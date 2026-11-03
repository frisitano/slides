---
marp: true
theme: default
paginate: true
size: 16:9
math: katex
header: 'EIP-8479 · Post-Quantum Data Availability'
footer: 'Francesco Risitano · EF Research'
style: |
  :root {
    --paper: #f8f7f4;
    --ink: #111827;
    --muted: #596579;
    --violet: #5b42d6;
    --violet-dark: #39259f;
    --violet-pale: #eeebff;
    --cyan: #007d86;
    --cyan-pale: #e0f5f3;
    --amber: #b45309;
    --amber-pale: #fff3d6;
    --line: #d9d8e0;
  }
  section {
    background:
      radial-gradient(circle at 93% 8%, rgba(91, 66, 214, 0.06), transparent 24%),
      var(--paper);
    color: var(--ink);
    font-family: "Helvetica Neue", Inter, ui-sans-serif, system-ui, sans-serif;
    font-size: 23px;
    padding: 62px 74px 52px;
  }
  section::before {
    background: linear-gradient(90deg, var(--violet), var(--cyan));
    content: "";
    height: 5px;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
  }
  section::after {
    color: #8a91a0;
    font-size: 13px;
  }
  header, footer {
    color: #858b98;
    font-size: 12px;
    letter-spacing: 0.02em;
  }
  h1, h2, h3 { color: var(--ink); }
  h1 {
    font-size: 2.7em;
    letter-spacing: -0.045em;
    line-height: 1.02;
  }
  h2 {
    border: 0;
    font-size: 1.72em;
    letter-spacing: -0.035em;
    line-height: 1.08;
    margin: 0 0 0.7em;
  }
  h3 {
    font-size: 0.88em;
    letter-spacing: 0.01em;
    margin: 0 0 0.35em;
    text-transform: uppercase;
  }
  p { line-height: 1.4; }
  strong { color: var(--ink); }
  code {
    background: #ebeaf0;
    border-radius: 4px;
    color: #2d2555;
    padding: 1px 5px;
  }
  pre {
    background: #ffffff;
    border: 1.5px solid #c9c6d8;
    border-radius: 10px;
    box-shadow: none;
    color: var(--ink);
    font-size: 0.72em;
    line-height: 1.32;
    padding: 0.75em 0.9em;
  }
  pre code { background: transparent; color: inherit; padding: 0; }
  ul { margin: 0.25em 0 0; padding-left: 1.15em; }
  li { line-height: 1.32; margin-bottom: 0.38em; }
  a { color: var(--violet); }
  section.lead {
    background:
      radial-gradient(circle at 82% 16%, rgba(66, 229, 213, 0.20), transparent 24%),
      radial-gradient(circle at 76% 82%, rgba(124, 92, 255, 0.28), transparent 32%),
      linear-gradient(135deg, #10111f 0%, #17182a 55%, #24213c 100%);
    color: #f8fafc;
  }
  section.lead::before { height: 7px; }
  section.lead h1 { color: white; font-size: 3.25em; max-width: 1000px; }
  section.lead h2 {
    color: #cdd5e6;
    font-size: 1.35em;
    font-weight: 450;
    max-width: 980px;
  }
  section.lead strong { color: white; }
  section.lead a { color: #9ff5ec; }
  .eyebrow {
    color: #8ff1e7;
    font-size: 0.68em;
    font-weight: 800;
    letter-spacing: 0.16em;
    margin-bottom: 1.1em;
    text-transform: uppercase;
  }
  .byline { color: #aeb8ca; font-size: 0.78em; margin-top: 2.1em; }
  .kicker {
    color: var(--violet);
    font-size: 0.66em;
    font-weight: 800;
    letter-spacing: 0.13em;
    margin-bottom: 0.7em;
    text-transform: uppercase;
  }
  .grid-2 {
    display: grid;
    gap: 1.25em;
    grid-template-columns: 1fr 1fr;
  }
  .grid-3 {
    display: grid;
    gap: 0.9em;
    grid-template-columns: repeat(3, 1fr);
  }
  .rule {
    border-left: 3px solid var(--violet);
    padding: 0.15em 0 0.15em 0.8em;
  }
  .rule.cyan { border-left-color: var(--cyan); }
  .rule.amber { border-left-color: var(--amber); }
  .rule p, .rule li { color: var(--muted); font-size: 0.86em; }
  .statement {
    color: var(--muted);
    font-size: 0.9em;
    line-height: 1.42;
    max-width: 1000px;
  }
  .formula {
    background: #171824;
    border-left: 5px solid var(--violet);
    border-radius: 8px;
    color: white;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.82em;
    line-height: 1.4;
    margin: 0.65em 0;
    padding: 0.75em 0.9em;
  }
  .metric-row {
    border-bottom: 1px solid var(--line);
    display: grid;
    gap: 1em;
    grid-template-columns: 1fr auto;
    padding: 0.5em 0;
  }
  .metric-row:last-child { border-bottom: 0; }
  .metric-row span { color: var(--muted); }
  .metric-row strong { color: var(--violet-dark); }
  .diagram {
    display: block;
    margin: 0.1em auto 0;
    max-height: 520px;
    max-width: 100%;
  }
  .diagram.compact { max-height: 430px; }
  .caption {
    color: var(--muted);
    font-size: 0.7em;
    margin: 0.15em auto 0;
    text-align: center;
  }
  .tag {
    background: var(--violet-pale);
    border: 1px solid #d8d0ff;
    border-radius: 999px;
    color: var(--violet-dark);
    display: inline-block;
    font-size: 0.66em;
    font-weight: 750;
    margin: 0.1em 0.2em 0.1em 0;
    padding: 0.24em 0.55em;
  }
  .tag.cyan {
    background: var(--cyan-pale);
    border-color: #bce8e3;
    color: #00646b;
  }
  .note {
    background: var(--violet-pale);
    border-radius: 8px;
    color: #332575;
    font-size: 0.78em;
    margin-top: 0.7em;
    padding: 0.55em 0.7em;
  }
  .note.warn { background: var(--amber-pale); color: #78400a; }
  .small { font-size: 0.78em; }
  .tiny { font-size: 0.67em; }
  .quote {
    border-left: 5px solid var(--cyan);
    color: #263448;
    font-size: 1.12em;
    line-height: 1.35;
    margin-top: 1em;
    max-width: 1030px;
    padding-left: 0.8em;
  }
title: Post-Quantum Data Availability
category: Post Quantum Data Availability
nav_title: "Post-Quantum Data Availability"
date: Nov 1, 2026
order: 1
description: "EIP-8479: post-quantum PeerDAS and variable-size blobs."
---

<!-- class: lead -->
<!-- paginate: false -->

<div class="eyebrow">EIP-8479 · Draft</div>

# Post-Quantum Data Availability

## Post-Quantum PeerDAS and Variable-Size Blobs

<div class="byline"><strong>Francesco Risitano</strong> · EF Research Engineer · 1 November 2026</div>

---

<!-- class: -->
<!-- paginate: true -->

<div class="kicker">Current state</div>

## KZG PeerDAS

<img class="diagram" src="./assets/current-peerdas.svg" alt="Rows of PeerDAS cells with a KZG commitment per blob and KZG cell proofs">

<p class="caption">One commitment per blob row · one proof per cell · columns define custody and sampling</p>

---

<div class="kicker">EIP-8479</div>

## Post-Quantum PeerDAS

<img class="diagram" src="./assets/post-quantum-peerdas.svg" alt="Post-quantum PeerDAS matrix with a per-blob Merkle tree and one LeanDA proof">

<p class="caption">The illustrated guest batch has one LeanDA proof; EIP-8288 later folds required proofs into the block aggregate.</p>

---

<div class="kicker">Variable-size blobs</div>

## Fixed columns, variable cell byte lengths

<img class="diagram compact" src="./assets/variable-size-blobs.svg" alt="Blob rows with different cell byte lengths and the same 128-column geometry">

<div class="grid-3 small">
  <div class="rule"><strong>2–512 KiB</strong><br>permitted blob lengths</div>
  <div class="rule cyan"><strong>128 cells</strong><br>in every blob</div>
  <div class="rule amber"><strong>16 B–4 KiB</strong><br>per-cell byte length</div>
</div>

---

<div class="kicker">Commitment and proof statement</div>

## Blob commitments and the LeanDA guest

<div class="grid-2">

<div>

### Guest inputs

~~~python
class BlobCommitment:
    blob_merkle_root: Bytes32
    blob_byte_length: Uint64

class PublicInput:
    blob_commitments: list[BlobCommitment]

class Blob:
    data: bytes

class PrivateInput:
    blobs: list[Blob]
~~~

<div class="note">The root authenticates the 128 cells. The signed byte length fixes how those cells are interpreted.</div>

</div>

<div>

### Guest validation

~~~python
def verify_blob(blob):
    length = len(blob.data)
    assert is_valid_blob_byte_length(length)

    root = compute_blob_merkle_root(blob.data)
    assert verify_reed_solomon_relation(
        blob.data, root
    )
    return BlobCommitment(root, length)

def run_guest(public_input, private_input):
    assert public_input.blob_commitments == [
        verify_blob(blob)
        for blob in private_input.blobs
    ]
~~~

</div>

</div>

---

<div class="kicker">Execution layer</div>

## EIP-8141 frame transactions + EIP-8288

<div class="rule small"><strong>No new transaction type.</strong> EIP-8141’s signed <code>blob_versioned_hashes</code> list becomes ordered <code>blob_commitments</code>.</div>

<img class="diagram compact" src="./assets/frame-8288.svg" alt="EIP-8141 frame transaction and LeanDA dependency folded into EIP-8288">

<div class="rule cyan small">Every blob-carrying frame declares its required <code>LEANDA_SCHEME</code> dependency.</div>

---

<div class="kicker">Execution semantics and fees</div>

## BLOBHASH and byte-based blob gas

<div class="grid-2">

<div>

### Versioned hash

<div class="formula">0x02 || keccak256(<br>  blob_merkle_root || uint64_le(blob_byte_length)<br>)[1:]</div>

<p class="statement"><code>BLOBHASH(i)</code> derives this value from signed commitment <em>i</em>, or returns zero when the index is out of range.</p>

<div class="note">Mixing in the length prevents a root from being interpreted under another blob size.</div>

</div>

<div>

### Accounted bytes

<div class="formula">blob_gas = blob_byte_length + 4,064</div>

<div class="metric-row"><span>Internal Merkle nodes</span><strong>127</strong></div>
<div class="metric-row"><span>Hash bytes per node</span><strong>32</strong></div>
<div class="metric-row"><span>Legacy-sized blob charge</span><strong>135,136</strong></div>

<p class="tiny">The target and maximum become blob-gas budgets derived from the active EIP-7892 schedule. The fixed allowance is a consensus accounting convention, not an estimate of every peer’s wire usage.</p>

</div>

</div>

---

<div class="kicker">Execution networking</div>

## Sparse blobpool and Engine API

<img class="diagram compact" src="./assets/blobpool-engine.svg" alt="Full blob and partial cell response formats">

<div class="grid-2 small">
  <div class="rule"><strong><code>eth/73</code></strong> advertises commitments and exchanges variable-length cells.</div>
  <div class="rule cyan"><strong><code>engine_getBlobsV5</code></strong> remains requested by derived versioned hash.</div>
</div>

---

<div class="kicker">Consensus layer</div>

## Commitments, sidecars, and cell-level deltas

<img class="diagram compact" src="./assets/cl-sidecars-deltas.svg" alt="ExecutionPayloadBid commitments, DataColumnSidecar cells and paths, and EIP-8136 partial sidecar">

<div class="grid-2 small">
  <div class="rule">The CL derives ordered versioned hashes from <code>ExecutionPayloadBid.blob_commitments</code> for <code>NewPayload</code>.</div>
  <div class="rule cyan">EIP-8136 keeps its bitmap and ordering rules; <code>kzg_proofs</code> becomes <code>authentication_paths</code>.</div>
</div>

---

<div class="kicker">Fork and trust boundary</div>

## Activation and security

<div>

### At the fork

- Historical data remains valid under its original rules.
- Type-3 and legacy KZG blob transactions become invalid for new inclusion.
- Transaction pools remove ineligible KZG transactions.
- <code>eth/73</code> and Engine API V5 carry the new formats.

</div>

---

<!-- class: lead -->

<div class="eyebrow">EIP-8479 · Draft</div>

# Review the proposal

## Post-Quantum PeerDAS and Variable-Size Blobs

**Draft:** [github.com/frisitano/EIPs/eip-8479.md](https://github.com/frisitano/EIPs/blob/eip-post-quantum-peerdas/EIPS/eip-8479.md)  
**Discussion:** [ethereum-magicians.org/t/30167](https://ethereum-magicians.org/t/eip-8479-post-quantum-peerdas-and-variable-size-blobs/30167)

<div class="quote" style="color:#d8e1f0;border-left-color:#8ff1e7;">Rollups and blob users: are variable-size blobs valuable to you—and why?</div>
