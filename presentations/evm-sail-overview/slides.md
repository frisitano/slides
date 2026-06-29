---
marp: true
theme: default
paginate: false
size: 16:9
math: katex
title: evm-sail — A formal specification of the EVM
category: Formal Verification
style: |
  section {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 21px;
    color: #111827;
    padding: 40px 52px;
    background: linear-gradient(180deg, #ffffff 0%, #f1f5f9 100%);
  }
  h1 { color: #0f172a; font-size: 1.7em; margin: 0; }
  .sub { color: #0f766e; font-weight: 700; font-size: 0.95em; margin: 4px 0 18px; }
  .repo {
    display: inline-block; margin: 6px 0 18px;
    font-size: 0.78em; font-weight: 600; color: #1c7ed6; text-decoration: none;
  }
  .repo::before { content: "↗ "; }
  h2 {
    color: #1e3a5f; font-size: 0.78em; text-transform: uppercase;
    letter-spacing: 0.07em; margin: 0 0 6px; padding-bottom: 4px;
    border-bottom: 2px solid #1e3a5f;
  }
  ul { margin: 0 0 16px; padding-left: 1.1em; }
  li { margin: 5px 0; line-height: 1.3; }
  code { background: #e7eef6; padding: 1px 5px; border-radius: 4px; font-size: 0.88em; }
  b { color: #0f172a; }
---

# evm-sail

<a class="repo" href="https://github.com/frisitano/evm-sail">github.com/frisitano/evm-sail</a>

## What it is

- Formal specification of the EVM, written in Sail

## Kernel design

- EVM core: opcodes · gas · frames
- **kernel interface** (`k_set_balance`, `k_get_nonce`, `k_get_slot`, `k_set_slot`, …)

## Extraction targets & uses

- **Lean** — theorems · prove evm-asm + riscv guest compliance
- **Islaris** — symbolic execution · automated test vector generation · client testing · contract verification
- **C** — 100% EEST state-tests + blockchain-tests
- **RISC-V** — zkEVM guest
- **Rocq** — foundational proofs & extraction
