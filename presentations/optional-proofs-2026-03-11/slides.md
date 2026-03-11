---
marp: true
theme: default
paginate: true
backgroundColor: #fff
---

<!-- Slide 1: Title -->
# Optional Proofs — Progress Update

**Breakout Call, March 11, 2026**

Francesco Risitano

---

<style scoped>
section { justify-content: flex-start !important; }
li { font-size: 0.75em; }
</style>

<!-- Slide 2: Lighthouse Implementation -->
### Lighthouse Implementation

- ✅ Proof engine service
- ✅ Execution proof gossip
- ✅ Execution proof signature verification
- ✅ Validator proof service
- ✅ Proof engine <-> Beacon chain integration
- ✅ Unit tests
- ✅ Network proof sync protocol (naive)
- ✅ Integration testing
- ⏳ `ExecutionProofStatus` RPC — PR in review
- ⏳ `ExecutionProofStatus` based network sync - PR in review
- [ ] Validator proof re-signing
- [ ] Ban validators for invalid proofs
- [ ] Kurtosis support

---

<style scoped>
section { justify-content: flex-start !important; }
li { font-size: 0.75em; }
p > strong { font-size: 1em; border: none; padding: 0; background: none; }
</style>

<!-- Slide 3: ExecutionProofStatus RPC -->
### ExecutionProofStatus RPC

**Problem:** 
- Only the peer initiating the connection has the remote peer's ENR - cannot determine proof capabilities symmetrically
- No awareness of proof availability on the peer

**Solution:** 
- `ExecutionProofStatus` invoked eagerly on connection to peers advertising `eproof` in ENR
- Exchanges `{ slot, block_root }` bidirectionally
- Both peers learn each other's latest verified proof state and proof capabilities

**Benefits:** 
- Select best peer to sync from based on execution proof status
- Decide when to do **range sync** vs **by-root sync**
- No changes to existing gossip protocol, purely additive
