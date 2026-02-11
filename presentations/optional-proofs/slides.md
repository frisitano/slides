---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
---

<!-- Load Mermaid.js for diagram rendering -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({
    startOnLoad: true,
    theme: 'default'
  });
</script>

<style>
pre {
  font-size: 0.55em;
  line-height: 1.2;
}

/* Constrain the Mermaid container itself */
section pre.mermaid {
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  overflow: visible; /* don't clip labels */
}

/* Height-first scaling (overrides width="100%") */
section pre.mermaid > svg {
  display: block;
  margin: 0 auto;
  height: 50vh !important;
  width: auto !important;
  max-width: 100% !important;
  font-size: 20px !important;
}

section pre.mermaid svg foreignObject > div {
  max-width: none !important;   /* Mermaid sets max-width; this causes truncation */
  width: max-content !important;
  overflow: visible !important;
}

section pre.mermaid svg foreignObject {
  overflow: visible !important;
} 
</style>

<!-- Slide 1: Title -->
# Optional Proofs — Consensus Layer Integration Update 1

**Breakout Call, February 11, 2026**

Francesco Risitano

---

<style scoped>
li { font-size: 0.8em; }
</style>


<!-- Slide 2: Agenda -->
### Agenda

1. EngineAPI Refresher
2. Validator Bandwidth & Prover Interface
3. Protocol Data Types
4. Proof Engine
5. Process Block
6. Process Execution Proof
7. Request Proofs
8. Proof Gossip Protocol
9. Lighthouse Implementation
10. References

---

<!-- Slide 3: EngineAPI Refresher -->
### EngineAPI Refresher

```python
class NewPayloadRequest(object):
    execution_payload: ExecutionPayload
    versioned_hashes: Sequence[VersionedHash]
    parent_beacon_block_root: Root
    execution_requests: ExecutionRequests

def new_payload(
    self: ExecutionEngine, new_payload_request: NewPayloadRequest
) -> bool:
    """
    Return ``True`` if and only if ``new_payload_request`` is valid`.
    """
    execution_payload = new_payload_request.execution_payload
    parent_beacon_block_root = new_payload_request.parent_beacon_block_root
    execution_requests = new_payload_request.execution_requests

    if b"" in execution_payload.transactions:
        return False

    # Assert that the block hash is valid with respect to the parent beacon block root, execution requests and execution payload.
    if not self.is_valid_block_hash(execution_payload, parent_beacon_block_root, execution_requests):
        return False

    # Assert that the versioned hashes are consistent with the transactions in the execution payload.
    if not self.is_valid_versioned_hashes(new_payload_request):
        return False

    # Assert that the execution payload is valid
    if not self.notify_new_payload(execution_payload, parent_beacon_block_root):
        return False

    return True
```

---

<!-- Slide 4: Validator Bandwidth & Prover Interface -->
### Validator Bandwidth & Prover Interface

```python
def prove_payload(self: Prover, new_payload_request: NewPayloadRequest) -> Hash256:
      """
    Return ``Hash256`` of the new payload request tree hash root if and only if ``new_payload_request`` is valid.
    """
    execution_payload = new_payload_request.execution_payload
    parent_beacon_block_root = new_payload_request.parent_beacon_block_root
    execution_requests = new_payload_request.execution_requests

    if b"" in execution_payload.transactions:
        return False

    # Assert that the block hash is valid with respect to the parent beacon block root, execution requests and execution payload.
      assert self.is_valid_block_hash(execution_payload, parent_beacon_block_root, execution_requests)

    # Assert that the versioned hashes are consistent with the transactions in the execution payload.
    assert self.is_valid_versioned_hashes(new_payload_request)

    # Assert that the execution payload is valid
    assert self.notify_new_payload(execution_payload, parent_beacon_block_root)

    new_payload_request_root = new_payload_request.hash_tree_root()

    return new_payload_request_root



def verify_payload(self: Verifier, proof_data: ByteList[MAX_PROOF_SIZE], new_payload_request_root: Hash256) -> bool:
    """
    Return ``True`` if and only if the new payload request tree hash root is valid.
    """
    # Assert that the new payload request tree hash root is valid
    return self.verify_proof(proof_data, new_payload_request_root)
```



---

<!-- Slide 5: Protocol Data Types -->
### Protocol Data Types

<pre class="mermaid">
%%{init: {'themeVariables': { 'fontSize': '13px', 'lineHeight': '1.1' }}}%%
classDiagram
    class ExecutionProof {
        +ByteList proof_data
        +uint8 proof_type
        +PublicInput public_input
    }

    class PublicInput {
        +Root new_payload_request_root
    }

    class SignedExecutionProof {
        +ExecutionProof message
        +ValidatorIndex validator_index
        +BLSSignature signature
    }

    class NewPayloadRequest {
        +ExecutionPayload execution_payload
        +Sequence~VersionedHash~ versioned_hashes
        +Root parent_beacon_block_root
        +ExecutionRequests execution_requests
    }

    class NewPayloadRequestHeader {
        +ExecutionPayloadHeader execution_payload_header
        +Sequence~VersionedHash~ versioned_hashes
        +Root parent_beacon_block_root
        +ExecutionRequests execution_requests
    }

    ExecutionProof --> PublicInput
    SignedExecutionProof --> ExecutionProof
    NewPayloadRequest --> NewPayloadRequestHeader
    NewPayloadRequestHeader --> PublicInput
</pre>

---

<!-- Slide 6: Proof Engine -->
### Proof Engine

```python
def verify_execution_proof(
    self: ProofEngine,
    execution_proof: ExecutionProof,
) -> bool:
    """
    Verify an execution proof.
    Return ``True`` if proof is valid.
    """
    ...

def notify_new_payload_header(
    self: ProofEngine,
    new_payload_request_header: NewPayloadRequestHeader,
):
    """
    Notify the proof engine of a new payload request header.
    """
    ...

@dataclass
class ProofAttributes(object):
    proof_types: List[ProofType]

def request_proofs(
    self: ProofEngine,
    new_payload_request: NewPayloadRequest,
    proof_attributes: ProofAttributes,
) -> ProofGenId:
    """
    Request proof generation for a new payload request.
    """
    ...
```

---

<!-- Slide 5a: Process Block -->
### Process Block

<pre class="mermaid">
%%{init: {"fontFamily": "Arial, sans-serif" }}%% 
sequenceDiagram
    participant BN as Beacon Node
    participant PE as Proof Engine

    Note left of BN: BeaconBlock received
    BN->>BN: Extract NewPayloadRequestHeader
    BN->>PE: notify_new_payload_header()

    PE->>PE: Cache newPayloadRequestHeader in</br>forkchoice store

    PE-->>BN: Syncing
    BN->>BN: Import optimistically
</pre>

---

<!-- Slide 5b: Process Execution Proof -->
### Process Execution Proof

<pre class="mermaid">
%%{init: {"fontFamily": "Arial, sans-serif" }}%% 
sequenceDiagram
    participant Gossip as P2P Gossip
    participant BN as Beacon Node
    participant PE as Proof Engine

    Gossip->>BN: SignedExecutionProof<br/>on execution_proof topic
    BN->>BN: Fetch validator pubkey</br>based on validator_index
    BN->>BN: Verify BLS signature
    BN->>PE: verify_execution_proof(proof)

    PE->>PE: Check if sufficient proofs</br>received for the new payload request

    PE-->>BN: Valid
    PE->>PE: Store proof in proof engine
    BN->>Gossip: Re-broadcast valid proof
    BN->>BN: Mark block as valid in forkchoice
</pre>

---

<!-- Slide 5c: Request Proofs -->
### Request Proofs

<pre class="mermaid">
%%{init: {"fontFamily": "Arial, sans-serif" }}%% 
sequenceDiagram
    participant PE as Proof Engine
    participant Validator as Validator
    participant BN as Beacon Node

    BN->>Validator: Observe new BeaconBlock
    Validator->>Validator: Extract NewPayloadRequest
    Validator->>PE: request_proofs(new_payload_request, proof_attributes)
    PE-->>Validator: ProofGenId

    Note over PE: Proof generation (async)

    PE->>Validator: POST /eth/v1/validator/execution_proofs<br/>(unsigned ExecutionProof)
    Validator->>Validator: Sign with validator key
    Validator->>BN: Broadcast SignedExecutionProof<br/>on execution_proof topic
</pre>


---
<style scoped>
section {
  justify-content: flex-start !important;
}
</style>

<!-- Slide 7: Gossip Protocol -->
## Proof Gossip Protocol

- Validators sign and broadcast proofs on execution_proof topic
- Nodes ban peers that send invalid proofs
- Nodes ban validators that sign invalid proofs

<pre class="mermaid">
flowchart LR
    A["Validator A"] -->|"✅ Valid"| C["Validator C"]
    C -->|"✅ Re-signed"| B["Validator B"]
    A -.->|"❌ Invalid"| B
</pre>


---

<style scoped>
li { font-size: 0.8em; }
</style>

<!-- Slide 8: Lighthouse Implementation -->
## Lighthouse Implementation

- ✅ Proof engine service
- ✅ Execution proof gossip
- ✅ Execution proof signature verification
- ✅ Validator proof service
- ✅ Proof engine <-> Beacon chain integration
- ✅ Unit tests
- [ ] Historical proof sync
- [ ] Ban validators for invalid proofs
- [ ] Integration testing
- [ ] Kurtosis support

---

<!-- Slide 9: References -->
## References

- [EIP-8025 Consensus Specs](https://github.com/ethereum/consensus-specs/tree/master/specs/_features/eip8025)
- [Lighthouse Implementation](https://github.com/eth-act/lighthouse/tree/feat/eip8025)
