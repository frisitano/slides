---
marp: true
theme: default
paginate: false
html: true
title: EIP-8025 Recursive Proofs — August 13, 2026
category: EIP-8025
nav_title: "Aug 13 Recursive Proofs"
order: 80
kind: Progress
description: "Recursive execution-proof specification and reth/ethrex guest implementation updates."
style: |
  :root {
    --ink: #0f172a;
    --slate: #475569;
    --teal: #0f766e;
    --orange: #f97316;
    --mist: #eef2f7;
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
  h1 { font-size: 58px; letter-spacing: -0.035em; margin: 0; }
  section.title p { color: var(--slate); font-size: 23px; margin-top: 22px; }
  section.prs h1 { font-size: 42px; margin-bottom: 72px; }
  section.prs ul { width: 66%; padding-left: 32px; }
  section.prs li { font-size: 28px; margin: 0 0 58px; padding-left: 10px; }
  section.prs li::marker { color: var(--teal); }
  section.prs li + li::marker { color: var(--orange); }
  section.prs a { display: block; margin-top: 12px; font-size: 17px; color: var(--teal); }
  .recursive {
    position: absolute;
    right: 92px;
    top: 205px;
    width: 270px;
    height: 300px;
    background: var(--mist);
    border: 2px solid #cbd5e1;
  }
  .recursive > div {
    position: absolute;
    inset: 28px;
    background: white;
    border: 3px solid var(--teal);
  }
  .recursive > div > div {
    position: absolute;
    inset: 28px;
    background: #ccfbf1;
    border: 3px solid var(--teal);
  }
  .recursive > div > div > div {
    position: absolute;
    inset: 28px;
    display: grid;
    place-items: center;
    background: white;
    border: 3px solid var(--orange);
    font-weight: 700;
    font-size: 18px;
  }
---

<!-- _class: title -->

# EIP-8025 recursive proofs

Breakout call · August 13, 2026

---

<!-- _class: prs -->

# PRs in progress

- **Consensus-spec recursive guest**  
  [ethereum/consensus-specs #5534](https://github.com/ethereum/consensus-specs/pull/5534#discussion_r3763851393)

- **Recursive guest for reth and ethrex**  
  [eth-act/ere-guests #77](https://github.com/eth-act/ere-guests/pull/77)

<div class="recursive"><div><div><div>PROOFₙ</div></div></div></div>
