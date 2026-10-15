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

## zkEVM Verification Problem

![h:450](assets/zkevm-verification-problem.svg)

<!--
Follow the execution pipeline: the EVM RV64 guest program is transpiled to the
zkVM ISA guest program, which runs on the zkVM. The zkVM feeds the proof system.
This is the architecture motivating verification, not a claim of completed proofs.
-->

---

<div class="eyebrow">04 · Verification scope</div>

## What exactly are we verifying?

<div class="scope">
<strong>Block kernel</strong><br>
Does the block apply the right transactions and system operations?
<div class="scope">
<strong>Transaction kernel</strong><br>
Is the transaction valid, executed, and settled correctly?
<div class="scope">
<strong>EVM machine</strong><br>
Does the program execute according to the EVM rules?
</div>
</div>
</div>

<p class="small">Each scope needs its own correctness claim—and a connection to the others.</p>

<div class="source">Conceptual verification boundaries, not existing package names. Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/introduction.md">Model structure</a>.</div>

<!--
Nesting illustrates ordinary transaction execution. Block system operations can
also invoke the machine. The key point is scope, not the detailed call graph.
-->

---

<!-- _class: overview -->
<div class="eyebrow">02 · Sail and the model</div>

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

<div class="eyebrow">03 · Results</div>

## What have we achieved?

- **Executable specification:** run the model and compare its behaviour with execution-specs.
- **Multiple execution targets:** reference and optimized execution from a shared Sail model.
- **Proof-assistant outputs:** Lean and Rocq definitions provide a starting point for proofs.

<div class="source">Implemented capabilities, not end-to-end verification. Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/extractions.md">Targets</a> · <a href="https://github.com/frisitano/evm-sail/actions/runs/32505286476">Reviewed CI run</a>.</div>

<!--
Distinguish execution, differential testing, and proof. These are different kinds
of evidence. Do not claim full test-suite conformance or complete EVM correctness.
-->

---

<div class="eyebrow">03 · Challenges</div>

## What has been difficult?

<div class="card">

**Semantic coverage**  
Correct instructions are only part of correct transaction and block execution.

**Proof usability**  
Generating definitions is easier than making them convenient to reason about.

**Execution performance**  
A clear specification still needs to run efficiently enough to test and use.

</div>

<div class="source">Sources: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/introduction.md">Model scope</a> · <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/engineering.md">Engineering experience</a>.</div>

<!--
Frame these as lessons from building the workflow. The next slides explain
their consequences, without descending into instruction implementations.
-->

---

<div class="eyebrow">05 · Proof-assistant extraction</div>

## One model, multiple proof environments

<div class="cols">
<div class="card">

### The benefit

Reuse the Sail specification in **Lean and Rocq**.

Spend proof effort on properties rather than rewriting the entire model.

</div>
<div class="card">

### The cost

Generated definitions are not always proof-friendly.

External assumptions and changes to generated output still need careful management.

</div>
</div>

**Result:** proof work can start from the model; extraction alone does not prove correctness.

<div class="source">Source: <a href="https://github.com/frisitano/evm-sail/blob/adc44afd21ef6d5a45c96046f0d23f527acbf54e/book/docs/extractions.md">Extraction targets and external boundaries</a>.</div>

<!--
There are narrow existing proof examples, but no complete EVM correctness result.
Do not present extraction as a verified source-to-binary compilation pipeline.
-->

---

<div class="eyebrow">06 · Modified compiler and performance</div>

## Making the model practical to run

- **Type-driven lowering: semantic types become machine types.** The compiler uses the model’s types to choose efficient execution representations.

![w:1140](assets/execution-comparison.png)

<!--
Semantic types express what values mean in the model; machine types determine
how execution stores and manipulates them. Type-driven lowering connects the two.
The optimized EVM-word representation uses four 64-bit limbs. This is a compiler
design choice, not an end-to-end correctness proof or a measured speedup claim.
-->

---

<div class="eyebrow">07 · Future refactor · proposed direction</div>

## What we would change next

<div class="card">

**Clearer execution boundaries**  
Make the machine, transaction, and block responsibilities easier to isolate.

**Proof-friendly interfaces**  
Expose smaller correctness claims that can be connected.

**Performance-aware structure**  
Keep efficient execution and a readable specification viable together.

</div>

<p class="small">Intended payoffs: clearer scope, easier proofs, faster iteration.</p>

<!--
These are proposed priorities for discussion, not a committed implementation plan.
The actual refactor and its proof milestones still need presenter confirmation.
-->

