---
marp: true
theme: default
paginate: false
html: true
title: EIP-8025 Progress — September 9, 2026
category: EIP-8025
nav_title: "Sep 9 PR & Specs"
order: 90
kind: Progress
description: "Consensus-specs and Lighthouse implementation progress for EIP-8025."
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

<!-- _class: prs -->

# EIP-8025 progress

- **Consensus specs** — EIP-8025 simplification merged in [#5566](https://github.com/ethereum/consensus-specs/pull/5566); follow-up [#5593](https://github.com/ethereum/consensus-specs/pull/5593) refinement of bounded `ProofData` type and gossip validation.

- **Lighthouse** — Upstream proof gossip and payload gating merged in [#9659](https://github.com/sigp/lighthouse/pull/9659) and [#9808](https://github.com/sigp/lighthouse/pull/9808); draft [eth-act/lighthouse#41](https://github.com/eth-act/lighthouse/pull/41) adds the aligned Gloas implementation and in-process ERE verification, based on the [`optional-proofs-gloas` branch](https://github.com/eth-act/lighthouse/tree/optional-proofs-gloas) in `eth-act/lighthouse`.
