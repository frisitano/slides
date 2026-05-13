---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
---

<!-- Slide 1: Title -->
# Optional Proofs — Progress Update

**Breakout Call, May 13, 2026**

Francesco Risitano

---

<style scoped>
section { justify-content: flex-start !important; }
li { font-size: 0.6em; }
</style>

<!-- Slide 2: Updates -->
### Updates

- **EIP-8025 rewrite** — [PR #11604](https://github.com/ethereum/EIPs/pull/11604)
- **General CL-specs refactor merged** (proof node API, dynamic proof-type advertisement) — [PR #5055](https://github.com/ethereum/consensus-specs/pull/5055)
- **`MAX_PROOF_SIZE` bumped to 400 KiB** — [PR #5162](https://github.com/ethereum/consensus-specs/pull/5162)
- **Validator proof re-signing deprecated** — design captured in [HackMD](https://hackmd.io/@frisitano/HkCzVt-a-x)
- **Optional execution & proof engines via optimistic sync specs** — [PR #5161](https://github.com/ethereum/consensus-specs/pull/5161)
- **Beacon-APIs endpoints updated** for EIP-8025 — [PR #569](https://github.com/ethereum/beacon-APIs/pull/569)
- **Opt-in witness retrieval flag** on existing engine methods — [execution-apis proposal](https://github.com/ethereum/execution-apis/pull/799/changes)
- **Proof-type encoding discussion** — [eth-act/execution-proofs-api#1](https://github.com/eth-act/execution-proofs-api/issues/1)
- **Network proof gossip writeup** for EIP-8025 — [HackMD](https://hackmd.io/@frisitano/H1XJS3XTZx)
- **GPU `ere` prover support landed** in ethereum-package (GPU driver / config spec, `shm-size` + ulimits) — [PR #1353](https://github.com/ethpandaops/ethereum-package/pull/1353)
- **Lighthouse ↔ Prysm interop devnet** ran successfully
- **Lighthouse**: maintainer-facing architecture writeup for the EIP-8025 implementation — [HackMD](https://hackmd.io/F4RtMrHgSm2Flw8iUbq2xA?view)
- **Lighthouse**: validator re-signing deprecated to align with the spec change
