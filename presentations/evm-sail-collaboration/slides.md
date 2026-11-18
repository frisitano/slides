---
marp: true
theme: default
paginate: false
size: 16:9
title: EVM Sail, ZisK & evmone — Status and a Shared Verification Target
nav_title: EVM Sail collaboration
category: Formal Verification
description: "EVM Sail status, measurement lessons, and a proposed shared interpreter verification target."
style: |
  :root {
    --ink: #0f172a;
    --slate: #475569;
    --teal: #0f766e;
    --orange: #f97316;
  }
  section {
    background: #f8fafc;
    color: var(--ink);
    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
    padding: 64px 72px;
  }
  section.title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
  section.title h1 {
    font-size: 58px;
    letter-spacing: -0.035em;
    margin: 0;
  }
  section.title p {
    color: var(--slate);
    font-size: 23px;
    margin-top: 22px;
  }
  section.prs h1 {
    font-size: 46px;
    letter-spacing: -0.035em;
    margin: 0 0 58px;
  }
  section.prs ul {
    width: 88%;
    padding-left: 34px;
  }
  section.prs li {
    font-size: 28px;
    line-height: 1.4;
    margin: 0 0 50px;
    padding-left: 10px;
  }
  section.prs li::marker {
    color: var(--teal);
  }
  section.prs li + li::marker {
    color: var(--orange);
  }
  section.prs a {
    color: var(--teal);
  }
  section { font-size: 28px; }
  section.prs h1 { margin-bottom: 32px; }
  section.prs ul, section.prs ol { width: 100%; }
  section.prs li { margin-bottom: 18px; }
  section.prs ol { padding-left: 44px; }
  section.prs ol li { margin-bottom: 14px; }
  section.prs table { font-size: 25px; width: 100%; }
  section.prs th { background: #e2e8f0; }
  section.prs blockquote { color: var(--slate); border-color: var(--teal); font-size: 21px; margin-top: 20px; }
  section.prs a { color: var(--teal); }
---

<!-- _class: title -->

# EVM Sail, ZisK & evmone

Status and a shared verification target

Francesco Risitano · EF zkEVM / EVM Sail · ZisK · FV contributors

**18 November 2026 — date to confirm**

A shared starting point for a first collaboration.

<!--
Opening: align on a tractable first artifact, rather than imply an existing joint commitment. Date is provisional pending host confirmation. Individual attendance and speakers also need confirmation; Paweł is the proposed evmone/intx lead. This is the host's short technical update within the broader meeting, not a replacement for the other teams' contributions.
-->

---

<!-- _class: prs -->

# Today’s conversation

1. Introductions and collaboration goals
2. **EVM Sail: status, lessons and refactor directions**
3. Cody Sail overview
4. ZisK: FV effort and the evmone guest
5. evmone / intx
6. Together: one fork, proof boundary, first milestone
7. Optional deep dive; owners and next steps

<!--
Canonical agenda: EVM Sail, ZisK and evmone Collaboration, discussion proposal consolidated 12 November 2026. Host-requested order: EVM Sail, Cody Sail overview, ZisK, evmone/intx, then collective scope. Timing must be revised to include Cody’s overview; the earlier 60-minute allocation was: introductions 0–5; EVM Sail 5–15; ZisK 15–25; evmone/intx 25–35; scope/fork 35–50; optional deep dive 50–55; decisions 55–60. Duration, speakers and attendance remain unconfirmed. Slides 3–5 support the EVM Sail segment; slide 6 opens collective scope discussion. Let the other teams present their own work.
-->

---

<!-- _class: prs -->

# EVM Sail today: one model, several artifacts

- **Compiler:** bound-driven C specialization, fixed layouts,
  splice overrides and exported narrowing obligations.
- **STF:** fork-specific EELS execution, Berlin → Amsterdam;
  v21 transport with explicit fork / revision selectors.
- **Extraction:** reference C, optimized C → RISC-V / ZisK;
  Lean, Rocq and executable Python renderings.

> Supported profiles ≠ complete test coverage.
> Generated definitions and compiler checks ≠ an interpreter proof.

<!--
Source snapshot: frisitano/evm-sail main at 06027a74fc691c1974a19cf4759af7e81aeac4bf, inspected 18 November 2026.
README: https://github.com/frisitano/evm-sail/blob/06027a74fc691c1974a19cf4759af7e81aeac4bf/README.md
Compiler engineering: https://github.com/frisitano/evm-sail/blob/06027a74fc691c1974a19cf4759af7e81aeac4bf/book/docs/engineering.md
Extraction map: https://github.com/frisitano/evm-sail/blob/06027a74fc691c1974a19cf4759af7e81aeac4bf/book/docs/extractions.md
Custom compiler: https://github.com/frisitano/sail/tree/evm-sail (moving branch; not a pinned compiler build claim). Range analysis, transitive specialization and C-only splicing preserve ordinary semantic types for Lean/Rocq. The compiler exports representation obligations, but this is not an end-to-end compiler correctness theorem or equivalence proof for C replacements. Host implementations and arithmetic remain explicit trust boundaries.
STF means state transition function. Fork constants span Frontier to Amsterdam, but the documented historical fixture/transport path covers Berlin through Amsterdam. Do not claim pre-Berlin full pipeline validation. The v21 two-byte selector is fork << 8 | revision, forks 0x0a–0x15, revision 0x01. Historical selectors are a local interoperability extension; the upstream Amsterdam guest accepts 0x1501 only. Fork-specific EELS filling avoids merely relabeling an Amsterdam transition. Pre-Paris execution transport does not validate Ethash consensus.
The README documents a 67,685-case pinned CI corpus and eleven allowed historical conversion limits; neither is evidence here that every historical input passes. No conformance or proof builds were rerun for this presentation. Earlier EEST success statements must be attached to their exact corpus, resources and output gate. Historical native reservations differ from production reservations.
Actual target directories include C spec/optimised, Lean with HostAxioms, Rocq with ExternBoundary, and Python with HostContract. Standard Sail backend availability is broader than this maintained extraction inventory. Extracted model definitions are not completed proofs of evmone or the guest.
-->

---

<!-- _class: prs -->

# Performance: measure the whole path

**Archived example: devnet block 110800 · identical stateless input**

| ZisK guest | Instruction steps (M) | Weighted proving cost (B) |
| :--- | ---: | ---: |
| EVM Sail | 105.97 | 12.36 |
| reth | 73.89 | 9.44 |
| ethrex | 182.73 | 19.38 |

[Dashboard](https://frisitano.github.io/evm-sail/performance.html) · [Engineering lessons](https://frisitano.github.io/evm-sail/engineering.html)

> Older build, not today’s speed: steps ≠ proving time.
> Equal-output gates first; pinning and threading measured negative.

<!--
Dataset at source revision 06027a74fc691c1974a19cf4759af7e81aeac4bf:
https://github.com/frisitano/evm-sail/blob/06027a74fc691c1974a19cf4759af7e81aeac4bf/book/docs/assets/generated/performance/catalog.json
25 fixtures from glamsterdam-devnet-7; example fixture id 5c21240d6888960d9f87, block 110800-b43ebbab4c7561c8d8aa1072036b98aea1a418aee031471cb4d43c4326abe72e. Exact steps: evm-sail 105967608, reth 73887680, ethrex 182728573. Exact weighted costs: 12356012096, 9442537410, 19380860566 respectively. M=10^6; B=10^9, rounded to two decimals. No averaging or general ranking is claimed.
Catalog build provenance: evm-sail 249fa3601b90a709c3c87542ef960aae5523683f-dirty, ELF SHA256 cb2258e0b5d8361bfeaf10fe334c5bc54082d53e00d3efd637443883fe7d1d91. This dirty tree cannot be reproduced solely from its commit. Comparison recipes at devtools/benchmarks/zisk-guests/README.md; ere-guests 9d3d4b9157cd0818abf68ebf7213ba041d1e83e9, reth stateless 711c3f91, ethrex e8860d29. ziskemu 1.0.0-alpha (4b9f758), locked ziskos 1.0.0-alpha. Authors' preferred configurations may differ. Catalog timestamp is 1786204163743108000 ns; these are archived measurements, not a run of current main.
Dashboard phases are exclusive: input decode, witness indexing, execution, state root, receipts/commitments; remainder unattributed. Semantic scopes overlap; missing instrumentation is not zero. Profiling syscall ELFs are emulator inputs, not provable binaries. Weighted proving cost is neither elapsed proving time nor measured proof generation.
Lessons: engineering notes require byte-exact EELS output gates before timing; a low-step run that rejects the block early is invalid evidence. Register pinning and register-file base-pointer threading were measured negative. Link-order churn has a reported ~0.2–1% noise band. Keep small deltas provisional and evaluate both steps and cost. No dashboard screenshot or fresh benchmark is fabricated.
-->

---

<!-- _class: prs -->

# Next: make the proof boundary easier to use

- **Model interface:** make machine state and host contracts
  easy to relate across Sail, evmone and a guest.
- **Refinement:** separate semantic definitions, generated code
  and optimized replacements; expose their obligations.
- **Compiler research:** payload tables, carried-tuple lowering,
  guaranteed tail calls — evaluate before adopting.
- **Shared validation:** fork-pinned cases, counterexamples
  and explicit assumptions alongside proof milestones.

> Discussion directions, not a committed joint roadmap.

<!--
Proposals for this collaboration: ask the teams which machine-state relation and host interface would remove the most proof friction. Existing pure Sail kernel and host-contract architecture supplies a starting point; do not present the proposed interface work as a new completed refactor.
Source engineering page at 06027a74fc691c1974a19cf4759af7e81aeac4bf lists parallel kind/payload tables, wide carried tuples as in/out parameters and guaranteed-tail-call handlers (GCC >=15 musttail) as planned. These are candidates, not measured improvements. Preserve reference semantics and output gates while exploring replacements. Prioritize whichever boundary the selected first proof actually consumes. Ownership, effort and dates need team agreement.
-->

---

<!-- _class: prs -->

# A collective north star — proposal

**Relate evmone’s EVM machine / interpreter to EVM Sail.**

- **One fork: explicit decision today — not yet selected.**
- Match stack, memory, PC, gas, halt status and return data
  under a stated initial-state relation and matching host effects.
- Assume host / crypto contracts and 256-bit arithmetic
  initially; identify what intx verification can discharge.
- First milestone: prove a bounded straight-line opcode subset,
  including gas and exceptional halts; share differential cases.

> Agree the fork, theorem boundary, owners and first artifact.

<!--
No team has agreed this target or delivered the proposed equivalence result. Select exactly one named fork before fixing the theorem; Amsterdam fixture work does not select the proof fork. Compare specification/implementation availability, coverage and stability together.
Candidate theorem: for related initial machine states at the selected fork, the bounded interpreter path yields related final states and identical observable gas use, halt/exception outcome and return bytes, with corresponding host effect traces. Decide explicitly whether the intended relationship is forward simulation, refinement or observational equivalence; the headline is an ambition until that choice and a statement are written.
Proposed first subset: PUSH, ADD, POP and STOP with bounded code/steps, valid memory conventions and explicit stack underflow/overflow and out-of-gas cases. No storage/CALL/CREATE/precompiles in that first theorem; model host behavior through matched contracts for later extension. Arithmetic uses modulo-2^256 word semantics; initially assume the implementation arithmetic/representation relation and discuss intx lemmas to replace assumptions. Extraction/compiler correctness and C/C++ memory safety also need an explicit trust story; tests do not discharge them.
Full STF, consensus, all forks and zkVM proof-system soundness are beyond this first machine/interpreter milestone. Deliverable candidate: a fork-pinned state relation, an assumption list, a machine-checked subset theorem and reusable differential fixtures. Ask each team to name an owner and a follow-up date; no schedule is implied here.
-->
