---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
title: Optional Proofs Progress Update — July 8, 2026
category: EIP-8025
nav_title: "Jul 8 Progress"
order: 70
kind: Progress
description: "Weak-subjectivity checkpoint execution proof sync."
---

<!-- Slide 1: Title -->
# Optional Proofs — Progress Update

**Breakout Call, July 8, 2026**

Francesco Risitano

---

<style scoped>
section { justify-content: flex-start !important; }
p { font-size: 0.62em; text-align: left; }
li { font-size: 0.56em; }
table { font-size: 0.52em; margin: 0.4em auto 0.12em; width: 62%; }
th, td { padding: 0.25em 0.45em; }
.assumption { color: #666; font-size: 0.42em; margin: 0 auto 0.35em; text-align: center; width: 66%; }
</style>

<!-- Slide 2: Weak-Subjectivity Checkpoint Proof Sync -->
### Weak-Subjectivity Checkpoint Execution Proof Sync

When joining the network a node must validate execution payloads from weak-subjectivity checkpoint to head:

| Sync policy | Proof bytes over one WS window |
| --- | ---: |
| 1 proof per payload | ~26.9 GiB |
| 2 proofs per payload | ~53.9 GiB |
| 4 proofs per payload | ~107.8 GiB |

<p class="assumption">Assuming the Electra WS reference period of 3,532 epochs, 32 slots per epoch, 113,024 slots, and 250 KiB per execution proof.</p>

- **Naive sync scales linearly** with both the weak-subjectivity window length and the proof policy.
- **Recursive direction** — add a `RecursiveExecutionProof` layer above base `ExecutionProof`.
- **Chain-prefix authentication** — use a Merkle tree or MMR over proven beacon roots to authenticate that a block is part of the proven chain prefix.
- **Network simplification** — a single proof for the chain tip can authenticate the full prefix, including the checkpoint-to-tip range, removing most requirements for historical execution-proof req/resp.
- **Next steps** — spec the chain-prefix / checkpoint-membership scheme, then implement the proof-sync path.
