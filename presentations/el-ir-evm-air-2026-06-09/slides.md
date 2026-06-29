---
marp: true
theme: gaia
class: lead
paginate: true
backgroundColor: #fff
title: Proving the EL State Machine — EL-IR
category: Formal Verification
description: "Specifying the EL state machine as an EL-IR intermediate representation for execution proving."
---

# Proving the EL State Machine

### EL-IR — a state-machine based EL Specification

Francesco Risitano

---

<style scoped>
section { justify-content: flex-start !important; }
blockquote { font-size: 0.7em; }
li { font-size: 0.6em; }
.events ul { columns: 4; column-gap: 1.4em; padding-left: 1.1em; margin-top: 0.2em; }
.events li { font-size: 0.62em; break-inside: avoid; margin-bottom: 0.12em; }
</style>

### EL-IR

- The EL is defined as a state machine that transitions using instructions.
- The EVM host is underspecified and only a reference python implementation exists.
- **Two kernels** — **EVM** (per-transaction) ⊕ **Block IR** (per-block)

**Block IR events**

<div class="events">

- TxBegin
- TxEnd
- ArithmeticOp
- MemoryExpand
- MemoryRead
- MemoryWrite
- MemoryByteWrite
- CallEnter
- CallExit
- CallResult
- PrecompileCall
- StorageRead
- StorageWrite
- AccountRead
- AccountWrite
- Keccak
- LogEmit
- BalanceTransfer
- GasCharge
- ReceiptEmit

</div>

---

<style scoped>
section { justify-content: flex-start !important; }
h3 { font-size: 1.0em; }
</style>

### Proof Composition

![w:1080 center](assets/block-kernel.svg)

---

<style scoped>
section { justify-content: flex-start !important; }
li { font-size: 0.74em; }
</style>

### Stack

- **EL-IR** — obligation spec
- **revm** — execution engine for generating EL-IR traces
- **Clean** — Use clean to satisfy obligations using tables and channels
- **LeanMultisig / WHIR / KoalaBear** — proof backend
