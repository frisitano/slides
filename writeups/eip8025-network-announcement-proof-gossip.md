# EIP-8025: Bandwidth and the Announce+Fetch Question

> **Status:** draft for discussion
> **Related:** [consensus-specs#5077](https://github.com/ethereum/consensus-specs/issues/5077) · [kev's HackMD summary](https://hackmd.io/@kevaundray/SJjGnqz8bl)
> **Source threads** *(Eth R&D, `#l1-zkevm-protocol`)*: [Prover whitelist](https://discord.com/channels/595666850260713488/1464245495294722089) · [Consensus specs PR and discussion](https://discord.com/channels/595666850260713488/1483418721367363594) · [Consensus specs update](https://discord.com/channels/595666850260713488/1487397630215454831)
> **Author:** Frankie (`@frisitano`)

---

## TL;DR

EIP-8025 proofs are large — up to ~400 KiB each, with up to four proof types per payload. The current (v1) gossip design floods every proof to every peer subscribed to the topic, which forces nodes to download the full payload before they can decide it was irrelevant or duplicate. The proposed alternative is an **announce+fetch** pattern: gossip a small announcement ("I have proof *X* for block *Y*"), and let interested peers pull the proof body via RPC only if they need it.

This doc frames the bandwidth problem and enumerates the concrete design options (A–C) that emerged on Discord. Tracking issue: [consensus-specs#5077](https://github.com/ethereum/consensus-specs/issues/5077).

---
## 1. Background: the full-gossip design

The consensus-specs for EIP-8025 places each `SignedExecutionProof` on a gossipsub topic, flooded to every peer subscribed to proofs. This gives the simplest possible property: if a proof exists on the network, every subscribed peer sees it.

The cost is that *every peer downloads every proof*, regardless of whether they already have a valid proof for that block, whether they care about that proof type, or whether the proof is duplicate / redundant. With proof sizes in the 100s of KiB and up to four proof types per payload, a naïve estimate of the steady-state bandwidth per peer is:

```
bw_peer ≈ proofs_per_slot × avg_proof_size × fanout
```

For a healthy network with multiple competing provers per slot, this can eat a significant share of the bandwidth budget — and most of those bytes are discarded. The motivation for announce+fetch is exactly this: move the decision "do I want this proof?" to *before* the body transfer, not after.

---

## 2. The announce+fetch idea

Rather than flood every proof body, peers broadcast a small announcement — `(proof_id, block_root, proof_type, …)` — and interested peers pull the body via RPC or an `IWANT`-style request. The body transfers point-to-point rather than on the broadcast topic. The framing was introduced by [@raulvk](https://discord.com/channels/595666850260713488/1464245495294722089/1464346265960841411): *"the main problem is that proofs are large and the gossip, defined as-is, forces nodes to download the whole message before they can decide whether it was useful or not."*

The design question is how to shape this. Three concrete options (plus one alternative that reaches the same bandwidth goal by a different route) emerged on Discord; none was picked, and the viable ones were acknowledged as reasonable starting points for a post-ethp2p design.

### Option A — hack gossipsub's partial-messages extension

Use the existing gossipsub partial-messages feature to advertise proof types per slot. **Ruled out by [@raulvk](https://discord.com/channels/595666850260713488/1464245495294722089/1464348901023944788):** partial-messages is designed to reconcile *inner parts of one canonical message* (e.g. blob chunks of a block), not to announce independent full-size payloads. Wrong tool for the job.

### Option B — `IHAVEMETA` + `IWANT` (Raúl's preferred direction)

Proposed by [@raulvk](https://discord.com/channels/595666850260713488/1464245495294722089/1464348901023944788): introduce a new gossipsub message variant, `IHAVEMETA`, that behaves like `IHAVE` but carries application-defined metadata. Peers inspect the metadata (e.g. `proof_id`, block root, proof type) and use existing `IWANT` to pull only the proofs they want.

- **Pros:** closest to gossipsub's native idiom; scales with the gossipsub mesh; generic enough to serve other large-payload use cases (blob refs, DA samples).
- **Cons:** needs an upstream gossipsub spec change

### Option C — share-gossip (split-and-distribute)

An alternative flagged during the v1-freeze discussion ([@taulepton_](https://discord.com/channels/595666850260713488/1483418721367363594/1483436217235410974)): rather than announce+fetch, **share-split each proof** (analogous to execution-payload distribution plans) and gossip the shares. Each peer receives and forwards a small fraction of each proof; peers reconstruct the full body from enough shares.

- **Pros:** bounded per-peer bandwidth by construction; no pull round-trip on the critical path; aligns with the share-gossip direction execution payloads are already heading.
- **Cons:** different tradeoff space from A/B; reconstruction latency and share-availability become the dominant concerns; entangles the proof layer with whichever share-gossip primitives execution-payload distribution ends up using.
