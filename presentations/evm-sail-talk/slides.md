---
marp: true
theme: default
paginate: true
size: 16:9
title: A Formal Specification of the EVM in Sail
nav_title: EVM Sail — From specification to verification
category: Formal Verification
kind: Talk draft
date: "Oct 2026"
description: "Building an executable EVM model: Sail, execution scopes, proof-assistant extraction, compiler optimizations, and the next refactor."
footer: 'evm-sail · Tau Lepton'
style: |
  section { font-family: 'Inter', system-ui, sans-serif; font-size: 28px; color: #172438; background: #f8fafc; padding: 48px 62px; }
  h1 { font-size: 1.65em; color: #10243a; line-height: 1.15; }
  h2 { font-size: 1.35em; color: #10243a; }
  strong { color: #087f8c; }
  a { color: #087f8c; }
  li { margin: 12px 0; }
  code { font-size: .86em; }
  pre { font-size: 24px; background: #eef2f6; padding: 22px; }
  footer { font-size: 16px; color: #64748b; }
  .eyebrow { font-size: 18px; text-transform: uppercase; letter-spacing: .12em; color: #087f8c; font-weight: 700; }
  .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .card { padding: 22px 26px; border: 1px solid #ccd8e2; border-radius: 12px; background: white; }
  .card p { margin: 10px 0; }
  .small { font-size: 21px; color: #526174; }
  .source { position: absolute; bottom: 48px; left: 62px; right: 62px; font-size: 16px; color: #64748b; }
  .scope { border: 2px solid #087f8c; border-radius: 10px; padding: 14px 22px; background: #edf8f8; font-size: 23px; }
  .scope .scope { margin: 12px 0 0 40px; background: #fff; }
  .scope .scope .scope { background: #edf2fa; border-color: #426899; }
  .flow { display: flex; gap: 18px; align-items: center; margin: 26px 0; }
  .flow .card { flex: 1; text-align: center; }
  section.lead { background: #10243a; color: white; }
  section.lead h1 { color: white; font-size: 2.05em; }
  section.lead strong { color: #6ee7d8; }
  section.lead footer { color: #aab9cb; }
  section.overview img { display: block; margin: 0 auto; }
---

<!-- _class: lead -->
<!-- _paginate: false -->

# A Formal Specification<br>of the EVM in Sail

**Tau Lepton**

zkEVM research engineer · Ethereum Foundation

<!--
Section 1 — introduction. Provisional 30-minute technical talk, excluding Q&A.
I'm a zkEVM research engineer at the Ethereum Foundation, and I'm interested
in formally verifying the EVM. This talk is about building a formal specification
in Sail: what worked, what proved difficult, and how that experience is shaping
the next version.
Draft based on evm-sail adc44afd21ef6d5a45c96046f0d23f527acbf54e, inspected 2026-10-15.
-->

---

<div class="eyebrow">01 · Motivation</div>

## What should a verified EVM implement?

A precise account of **instructions, transactions, and blocks**.

<div class="flow">
<div class="card">Executable<br><strong>semantics</strong></div>
<div>→</div>
<div class="card">Stated properties<br><strong>and proofs</strong></div>
<div>→</div>
<div class="card">Implementation<br><strong>correspondence</strong></div>
</div>

EVM Sail is an experimental model on this path.

<div class="source">Source: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/index.md">Project goals and status</a> · Arrows describe the verification goal, not completed proofs.</div>

<!--
The goal motivates the work; it is not an end-to-end result already achieved.
An executable formal specification lets us state what execution means and compare
implementations. Proving that a particular implementation follows it is another
obligation. Explain that “EVM” here includes the enclosing transaction and block rules.
-->

---

<!-- _class: overview -->
<div class="eyebrow">02 · Sail and the model</div>

## Sail connects machine models to tools

![h:430](assets/overview-sail.png)

<div class="source">Image: <a href="https://raw.githubusercontent.com/rems-project/sail/refs/heads/sail2/etc/overview/overview-sail.png">REMS Project · Sail ISA models and tooling</a>. Wider Sail ecosystem; not an EVM Sail integration list.</div>

<!--
Sail is a language for describing instruction-set semantics, with executable
and proof-assistant outputs. Walk the diagram from ISA models to Sail, then
follow only the executable-emulator and theorem-prover paths.
The figure includes Coq, Isabelle and HOL4; EVM Sail's inspected proof targets
are Lean and Rocq. Do not imply every pictured integration is implemented here.
-->

---

<div class="eyebrow">02 · Sail and the model</div>

## An instruction becomes an executable rule

```sail
let gas : gas = carried_gas - G_verylow;
let a = read_stack_word(sp);
sp = stack_top_retreat(sp, 1);
let b = read_stack_word(sp);
let result = alu_add(a, b);
write_stack_word(sp, result);
(gas, sp, Continue())
```

**ADD:** charge gas, read operands, write the result, continue.

<div class="source">Exact excerpt: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/sail/evm/execute.sail#L157-L163">execute_add</a>. Preceding stack and out-of-gas checks omitted here.</div>

<!--
Point out typed gas, explicit stack cursor and instruction outcome. The complete
function checks stack shape and available gas before this excerpt. alu_add
implements EVM word arithmetic. This is a readable entry point; storage access,
calls and fork-sensitive rules are where the model becomes more involved.
-->

---

<div class="eyebrow">03 · Successes and challenges</div>

## One model already serves several workflows

- **Execute:** reference C, optimized C, and Python targets.
- **Check:** typed sizes and SMT-backed obligations.
- **Compare:** differential validation against execution-specs.
- **Extract:** Lean and Rocq definitions for proof work.

<div class="source">Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/extractions.md">Extractions</a> · <a href="https://github.com/frisitano/evm-sail/actions/runs/32505286476">Configured CI gates passed at the reviewed revision</a>.</div>

<!--
These are concrete implemented workflows, not a claim of complete correctness.
Typing catches size/shape errors; differential tests compare behavior; generated
definitions permit proofs. The configured CI run was green, including corpus.
Do not quote 100% conformance: no complete retained v0.6.2 corpus result was
recorded at the inspected revision. Presenter: add a firsthand success example.
-->

---

<div class="eyebrow">03 · Successes and challenges</div>

## The difficult rules cross execution boundaries

<div class="cols">
<div class="card">

### Semantic complexity

- Fork-dependent gas and validity
- Calls, reverts, and state rollback
- Transaction and block accounting

</div>
<div class="card">

### Tooling complexity

- Host contracts for every target
- Generated definitions versus proof ergonomics
- Efficient execution versus transparent semantics

</div>
</div>

<div class="source">Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/introduction.md">Model structure</a> · <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/engineering.md">Engineering notes</a>.</div>

<!--
These are implementation concerns and design tradeoffs, not invented personal
anecdotes. Presenter: replace one point with an actual debugging or extraction
experience. Transition: separating execution scopes makes these interactions
easier to describe and gives us candidate boundaries for proofs.
-->

---

<div class="eyebrow">04 · Transaction kernel / block kernel / EVM machine</div>

## Three scopes, different responsibilities

<div class="scope">
<strong>Block kernel</strong> · system calls, transaction sequencing, block-end operations
<div class="scope">
<strong>Transaction kernel</strong> · validation, authorization, upfront accounting, settlement
<div class="scope">
<strong>EVM machine</strong> · instruction execution and call frames<br>
Program counter · stack · memory · gas
</div>
</div>
</div>

<p class="small">Stateless verification surrounds execution: witness handling and commitment checks.</p>

<div class="source">Conceptual scopes, not three existing package names. Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/sail/evm/transaction.sail">transaction</a> · <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/sail/executor/block.sail">block</a> · <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/sail/evm/interpreter.sail">interpreter</a>.</div>

<!--
Introduce the transaction kernel first: validity, authorizations, upfront effects,
execution and settlement. Then zoom out to block sequencing and system work;
finally zoom in to the EVM machine. The nesting describes ordinary transaction
execution, not every possible entry path: block system calls also invoke execution.
The current code has executor modules and a shared sail/kernel, not three separately
named kernel packages. State access and rollback cross the conceptual scopes.
-->

---

<div class="eyebrow">04 · Execution boundaries</div>

## A reverted call does not erase the transaction

<div class="flow">
<div class="card"><strong>Caller</strong><br>CALL</div>
<div>→</div>
<div class="card"><strong>Callee</strong><br>SSTORE → REVERT</div>
<div>→</div>
<div class="card"><strong>Caller</strong><br>receives failure</div>
</div>

- Callee state changes roll back at its call boundary.
- The caller can handle failure and continue.
- Consumed gas still matters to transaction settlement.

<div class="source">Schematic example. Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/sail/evm/interpreter.sail">Frame interpreter</a> · <a href="https://github.com/frisitano/evm-sail/tree/adc44afd21ef6d5a45c96046f0d23f527acbf54e/sail/kernel">Shared kernel</a>.</div>

<!--
Assume a valid non-static nested call, enough gas, and a caller that handles the
failed result. REVERT rolls back callee state changes; unused callee gas is returned,
but consumed gas is not undone. Do not imply every transaction-scoped structure
resets on every revert. No balances or gas numbers are asserted by this sketch.
The point is that frame-local state, rollback state and transaction accounting
have different lifetimes, so proving only an opcode rule is not the whole problem.
-->

---

<div class="eyebrow">05 · Proof-assistant extractions</div>

## Extraction preserves a shared semantic starting point

<div class="cols">
<div class="card">

### What it buys

- Definitions follow the Sail source.
- Lean and Rocq provide proof infrastructure.
- Named host assumptions remain inspectable.

</div>
<div class="card">

### What it costs

- Generated structure can complicate proofs.
- Effects and host contracts need reasoning.
- Compiler changes can affect proof maintenance.

</div>
</div>

<p class="small">Generated definitions do not establish source-to-binary correctness.</p>

<div class="source">Source: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/extractions.md">Extraction targets and trust boundary</a>. Costs are design tradeoffs to discuss.</div>

<!--
Lean's HostAxioms.lean and Rocq's ExternBoundary.v make the external boundary
explicit: hashing, input/output, stores, buffers and trie database operations.
Generated code avoids independently rewriting the whole semantics in each prover.
It does not remove the need for useful invariants, auxiliary lemmas or a precise
theorem statement. Presenter: add the extraction pain point you want to emphasize.
-->

---

<div class="eyebrow">05 · A concrete proof surface</div>

## Small interface properties are already provable

```coq
Lemma rlp_advance_remaining_nonnegative (source_len consumed : Z) :
  rlp_cursor_advance_valid source_len consumed = true ->
  0 <= source_len - consumed.
```

- A valid cursor advance leaves a nonnegative remaining length.
- Related lemmas cover progress, slice ends, and composition.
- This proves cursor properties, not complete EVM correctness.

<div class="source">Exact statement: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/extractions/rocq/proofs/RlpCursor.v">RlpCursor.v</a> · Handwritten lemmas over extracted definitions.</div>

<!--
The file imports evm_types. The proof unfolds the validity predicate, extracts
the bound, and uses linear integer arithmetic. This is a tangible, deliberately
narrow example of the proof surface, not a proof of the whole RLP decoder.
Its small interface suggests a useful question for refactoring: what other
boundaries can expose compact properties that compose?
-->

---

<div class="eyebrow">06 · Modified compiler and performance</div>

## Specialize representation without hiding the semantics

<div class="flow">
<div class="card"><strong>Sail word</strong><br>256-bit semantics</div>
<div>→</div>
<div class="card"><strong>Custom lowering</strong><br>fixed layout</div>
<div>→</div>
<div class="card"><strong>Optimized C</strong><br>4 × 64-bit limbs</div>
</div>

- Fixed widths and specialization reduce representation overhead.
- Selected C refinements replace operations in optimized execution.
- Reference and proof targets retain explicit Sail bodies.

<div class="source">Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/engineering.md">Custom compiler and layouts</a> · <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/extractions.md">Refinement boundary</a>.</div>

<!--
Four little-endian u64 limbs are the concrete EVM-word representation in the
optimized ABI. Distinguish compiler lowering and specialization from handwritten
runtime refinements and interpreter changes. Explicit reference bodies keep the
semantics available for reasoning; they do not automatically prove an optimized
replacement equivalent. Exported specialization obligations are another check,
not an end-to-end verified compiler theorem.
-->

---

<div class="eyebrow">06 · Performance optimizations</div>

## State representation changes the generated code

<div class="cols">
<div class="card">

### Thread a base pointer

Keep a pointer live across calls.

Moves and spills can outweigh saved address calculations.

**Reported experiment: regression.**

</div>
<div class="card">

### Carry hot values

Pass pc, gas, and cursors through handlers.

Expose dataflow and give the compiler fewer aliasing problems.

**Reported experiment: improvement.**

</div>
</div>

<div class="source">Source: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/engineering.md#registers-custody-and-why-code-structure-decides">Documented A/B experiments</a>. Historical, workload-specific observations; not new measurements.</div>

<!--
These examples concern state organization and runtime/compiler interaction, not
an isolated compiler-version comparison. The engineering notes report +7% for
pointer threading and -5.25% for carried values on its landing day. Percentages
are intentionally omitted on screen because their full run provenance and metric
would need explanation. Do not imply a universal speedup or additive savings.
The validation loop checks verdicts and byte-exact outputs before cost comparisons.
-->

---

<div class="eyebrow">07 · Future refactor · discussion draft</div>

## What should the next structure make easier to prove?

<div class="cols">
<div class="card">

### Current starting point

An EVM machine, transaction/block executors, and a shared state kernel.

</div>
<div class="card">

### Candidate direction

Explicit interfaces between scopes, with local invariants and composition rules.

</div>
</div>

**Next iteration:** name the responsibilities that move and the proof they enable.

<p class="small">Proposed framing for discussion with Tau; not a committed refactor plan.</p>

<!--
Presenter input required before this slide can state the actual roadmap.
Do not substitute the compiler TODO list for the intended refactor.
Ask which responsibilities move, which interfaces become explicit and which
proof or optimization gets easier. Replace the candidate box with the actual
before/after design, then return to the opening goal of formally verifying the EVM.
Project: https://github.com/frisitano/evm-sail
-->
