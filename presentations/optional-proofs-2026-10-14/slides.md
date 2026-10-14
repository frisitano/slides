---
marp: true
theme: default
paginate: false
html: true
title: EIP-8025 Progress — October 14, 2026
category: EIP-8025
nav_title: "Oct 14 Progress"
order: 100
kind: Progress
description: "Consensus-specs progress, the Execution Chain Proofs EIP, and the Sepolia testnet plan."
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
---


<!-- _class: title -->

# EIP-8025 progress

Breakout call · October 14, 2026

---

<!-- _class: prs -->

# EIP-8025 progress

- **Consensus specs** — `ProofData` type and gossip validation refined in [#5593](https://github.com/ethereum/consensus-specs/pull/5593), and the ProofEngine is now validation-only in [#5639](https://github.com/ethereum/consensus-specs/pull/5639); both merged October 7.

- **New EIP** — Execution Chain Proofs, [EIP-8440](https://github.com/ethereum/EIPs/pull/12464), with the accompanying consensus-specs change in [#5725](https://github.com/ethereum/consensus-specs/pull/5725). Both open for review.

- **Next** — Sepolia testnet deployment.
