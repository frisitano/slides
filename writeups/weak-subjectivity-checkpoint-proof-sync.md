# Weak-Subjectivity Checkpoint Execution Proof Sync

> **Status:** draft for discussion
> **Related:** EIP-8025 Optional Proofs, [EIP-8237](https://eips.ethereum.org/EIPS/eip-8237)
> **Author:** Tau Lepton

---

## TL;DR

Upon joining a beacon chain from a trusted weak-subjectivity checkpoint, a node must verify that the post-checkpoint chain it syncs has valid execution payloads. EIP-8025 gives us per-payload execution proofs over `new_payload_request_root`. We propose using recursive proofs to provide CL / EL binding and weak-subjectivity checkpoint to head chain linking.

The suggested approach is:

- Keep the base EIP-8025 execution proof interface unchanged: an execution proof proves Engine API validation for `new_payload_request_root`.
- Add a `BeaconChainProof` layer above the execution proof: each step verifies one parent `BeaconChainProof`, one execution proof, and one compact beacon/execution binding.
- Bind the execution proof to the beacon chain by reconstructing `NewPayloadRequestHeader` from `BeaconBlockExecutionBinding` and checking that its root equals the execution proof's `new_payload_request_root`.

---

## 1. The Problem

Checkpoint sync gives a node a trusted weak-subjectivity checkpoint and lets it sync consensus history after that checkpoint. Under Gloas / EIP-7732, a node may be able to range-sync beacon blocks without downloading all historical execution payload data.

That removes the ordinary local check:

```text
CL block commits to execution payload
EL computes the execution block hash
engine_newPayload validates the payload
```

EIP-8025 gives us the execution side of that story. A per-payload proof can prove:

```text
NewPayloadRequest
  + execution witness
  + chain config
  -> successful Engine API validation
```

A joining node needs to know that the validated payload belongs to the beacon chain extending from the weak-subjectivity checkpoint. The recursive proof should therefore sit above the execution proof: it verifies the execution proof and binds its public input to a beacon chain.

---

## 2. The Sync Design Space

The weak-subjectivity checkpoint is the trust base. Everything before it is accepted under the normal weak-subjectivity model. Everything after it needs an execution-validity check.

### Option A: per-block verification

The direct path is to verify execution proofs block by block from the checkpoint to the head:

```text
for each block from checkpoint to head:
    verify accepted execution proof(s)
    check the proof binds to the beacon chain
```

This can use `k` of `n` proofs per payload if the sync policy wants multiple proof systems. It preserves the base EIP-8025 interface, but it makes the syncing node perform work proportional to the length of the range.

### Option B: beacon-chain proof recursion

A prover can aggregate the same block-by-block checks into a rolling `BeaconChainProof`:

```text
BeaconChainProof_i =
    extend_chain(BeaconChainProof_{i-1}, ExecutionProof_i, BeaconBlockExecutionBinding_i)
```

The proof commits to the following public input:

```python
class BeaconChainProofPublicInput(Container):
    ws_checkpoint_root: Root
    ws_checkpoint_slot: Slot
    head_root: Root
    head_slot: Slot
```

This public input states that the proof covers a beacon-chain range from the weak-subjectivity checkpoint to the head.

---

## 3. Quantifying The Naive Path

The naive sync path is expensive even with a moderate proof-size assumption.

Using the Electra weak-subjectivity reference table, a mainnet-scale active validator set gives a weak-subjectivity period of **3,532 epochs**. Mainnet has **32 slots per epoch**, so a full weak-subjectivity window covers:

```text
3,532 epochs * 32 slots/epoch = 113,024 slots
```

At 12 seconds per slot this is about **15.7 days** of beacon-chain history. Not every slot has a block, but treating every slot as carrying one payload is a useful upper-bound planning estimate.

If each execution proof is **250 KiB**, then fetching one proof per payload for the full window costs:

```text
113,024 payloads * 250 KiB/proof = 28,256,000 KiB ~= 26.9 GiB
```

The cost scales linearly with the proof policy:

| Sync policy | Proof bytes over one WS window |
| --- | ---: |
| 1 proof per payload | ~26.9 GiB |
| 2 proofs per payload | ~53.9 GiB |
| 4 proofs per payload | ~107.8 GiB |

---

## 4. Gossip-Only Recursive Proofs

One possible simplification is to remove the request/response protocol for individual execution proofs entirely. In that model, proof-syncing nodes do not request or gossip per-payload `ExecutionProof` objects. The network gossips recursive `BeaconChainProof` objects instead.

This has useful implications for proof sync. The execution proofs become prover-side inputs to the recursive proof construction, not sync artifacts that every verifier must download:

```text
beacon block gossip
    + BeaconChainProof gossip
    -> verify BeaconChainProof
    -> accept public input:
       ws_checkpoint_root, ws_checkpoint_slot, head_root, head_slot
```

Long-range proof sync then does not require requesting every execution proof from the weak-subjectivity checkpoint to head. A verifier only needs a gossiped `BeaconChainProof` whose public input covers the weak-subjectivity checkpoint and the claimed head. The recursive proof internally attests that each step verified the required execution proof and binding.

This removes most requirements for an execution-proof request/response protocol. The remaining network requirements are a gossip topic for `BeaconChainProof`, validation/ignore rules for recursive proofs, and the CL/EL binding inside `extend_chain`.

---

## 5. Base And Recursive Boundaries

The base execution proof remains an Engine API proof. Its public input continues to include `new_payload_request_root`:

```text
ExecutionProof:
    public input: new_payload_request_root
    statement: engine_newPayload(request) succeeds
```

The recursive layer is a beacon-chain proof. It does not re-execute the payload. It verifies the execution proof, checks beacon parent chaining, and checks that the execution proof's request root is the request committed by the beacon block being added.

```text
BeaconChainProof step:
    parent BeaconChainProof
    + one ExecutionProof
    + one BeaconBlockExecutionBinding
    -> BeaconChainProofPublicInput
```

---

## 6. Binding The Execution Proof To The Beacon Block

An exact binding scheme still needs to be refined but the following data types are of primary relevance:

```python
class BeaconBlockExecutionBinding(Container):
    beacon_header: BeaconBlockHeader
    execution_payload_header: ExecutionPayloadHeader
    signed_execution_payload_bid: SignedExecutionPayloadBid
```

`ExecutionPayloadHeader` is intentionally a header. It carries `transactions_root`, not the transaction bytes. The recursive guest should not open all transaction data. The execution proof handles execution validity; the recursive proof only needs enough beacon-committed data to bind that execution proof to the beacon block.

The guest reconstructs the request header:

```python
class NewPayloadRequestHeader(Container):
    execution_payload_header: ExecutionPayloadHeader
    versioned_hashes: List[VersionedHash, MAX_BLOB_COMMITMENTS_PER_BLOCK]
    parent_beacon_block_root: Root
    execution_requests_root: Root
```

Then it checks:

```python
new_payload_request_root = hash_tree_root(new_payload_request_header)
assert new_payload_request_root == execution_proof.public_input.new_payload_request_root
```

---

## 7. `extend_chain`

`extend_chain` is the one-step recursive transition:

```python
def extend_chain(
    parent_beacon_chain_proof: BeaconChainProof,
    execution_proof: ExecutionProof,
    execution_binding: BeaconBlockExecutionBinding,
) -> BeaconChainProofPublicInput:
    parent = proof_engine.verify_beacon_chain_proof(parent_beacon_chain_proof)
    execution = proof_engine.verify_execution_proof(execution_proof)

    header = execution_binding.beacon_header
    header_root = hash_tree_root(header)

    assert execution.execution_status == ExecutionStatus.SUCCESS
    assert header.parent_root == parent.head_root
    assert header.slot > parent.head_slot

    # TODO: refine this into the exact SSZ body-root opening check.
    # The binding should be proven as data committed by header.body_root.
    assert is_execution_binding_committed_by_body_root(
        header.body_root,
        execution_binding,
    )

    new_payload_request_header = NewPayloadRequestHeader(
        execution_payload_header=execution_binding.execution_payload_header,
        versioned_hashes=compute_versioned_hashes(execution_binding),
        parent_beacon_block_root=parent.head_root,
        execution_requests_root=compute_execution_requests_root(execution_binding),
    )

    assert (
        hash_tree_root(new_payload_request_header)
        == execution.public_input.new_payload_request_root
    )

    return BeaconChainProofPublicInput(
        ws_checkpoint_root=parent.ws_checkpoint_root,
        ws_checkpoint_slot=parent.ws_checkpoint_slot,
        head_root=header_root,
        head_slot=header.slot,
    )
```

---

## 8. `update_checkpoint`

`update_checkpoint` moves the weak-subjectivity checkpoint forward to a block already covered by the beacon-chain proof:

```python
def update_checkpoint(
    beacon_chain_proof: BeaconChainProof,
    checkpoint_root: Root,
    checkpoint_slot: Slot,
    membership_proof: CheckpointMembershipProof,
) -> BeaconChainProofPublicInput:
    public_input = proof_engine.verify_beacon_chain_proof(beacon_chain_proof)

    assert is_checkpoint_in_beacon_chain_proof_range(
        beacon_chain_proof,
        checkpoint_root,
        checkpoint_slot,
        membership_proof,
    )

    return BeaconChainProofPublicInput(
        ws_checkpoint_root=checkpoint_root,
        ws_checkpoint_slot=checkpoint_slot,
        head_root=public_input.head_root,
        head_slot=public_input.head_slot,
    )
```

The range-membership helper may need an MMR over proven beacon roots to avoid linear membership witnesses:

```python
def is_checkpoint_in_beacon_chain_proof_range(
    beacon_chain_proof: BeaconChainProof,
    checkpoint_root: Root,
    checkpoint_slot: Slot,
    membership_proof: CheckpointMembershipProof,
) -> bool:
    # TODO: Consider using an MMR over proven beacon roots to make this
    # membership check efficient for long ranges.
    raise NotImplementedError
```

---

## 9. Fork And Config Requirements

The execution proof still owns Engine API semantics and fork/config correctness.

The recursive guest needs to know how to constrain the forks at fork boundaries. The fork-specific may belong at the binding layer in the recursive guest. 

Execution layer maintainers should propose an interface aligned with the current data model to support the requirements of a beacon chain proof.
