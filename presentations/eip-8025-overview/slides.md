---
marp: true
theme: marp-4x5
size: social-portrait
paginate: false
backgroundColor: #f8fafc
math: katex
title: Overview Deck
category: EIP-8025
description: "Visual resource deck covering the execution proof flow."
aspect: "Social portrait / 1080x1240"
---

<style>
section {
  width: 1080px;
  height: 1240px;
  padding: 54px 58px 112px;
  box-sizing: border-box;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #111827;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 18px;
  position: relative;
  overflow: hidden;
}
h1, h2, h3, p { margin: 0; letter-spacing: 0; }
.topline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 25px;
  font-weight: 860;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #475569;
}
.cardno { color: #0f766e; }
h1 {
  font-size: 74px;
  line-height: 0.96;
  font-weight: 920;
  color: #0f172a;
}
.subtitle {
  font-size: 29px;
  line-height: 1.22;
  font-weight: 680;
  color: #475569;
  max-width: 960px;
}
.context {
  margin: -4px auto 2px;
  width: 830px;
  color: #111827;
}
.context .katex-display {
  margin: 0;
  text-align: left;
}
.context .katex {
  font-size: 1.3em;
  line-height: 1.25;
}
.hero {
  background: #ffffff;
  border: 3px solid #dbe4ee;
  border-radius: 24px;
  box-shadow: 0 24px 65px rgba(15, 23, 42, 0.08);
  padding: 20px;
  width: 100%;
  min-height: 0;
  box-sizing: border-box;
}
.hero.tight {
  padding: 10px;
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero.diagram {
  padding: 10px;
  flex: 1 1 0;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero.media-fit {
  flex: 0 0 auto;
  aspect-ratio: var(--media-aspect);
  padding: 0;
  overflow: hidden;
}
.diagram-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.hero.media-fit .diagram-img {
  object-fit: fill;
}
.diagram-img.flow { max-height: none; }
.diagram-img.lifecycle { max-height: none; }
.diagram-img.ssz-model { max-height: none; }
.diagram-img.engine-boundary { max-height: none; }
.diagram-img.p2p-protocol { max-height: none; }
.diagram-img.el-guest,
.diagram-img.el-boundary { max-height: none; }
.diagram-img.consensus-hooks { max-height: none; }
.footer {
  position: absolute;
  left: 58px;
  right: 58px;
  bottom: 48px;
  height: 50px;
  margin: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  border-top: 2px solid #cbd5e1;
  padding-top: 14px;
  box-sizing: border-box;
  font-size: 21px;
  color: #64748b;
  font-weight: 820;
  letter-spacing: 0.12em;
}
.path-card {
  border: 3px solid #dbe4ee;
  border-radius: 24px;
  background: #ffffff;
  padding: 26px;
  box-shadow: 0 24px 65px rgba(15, 23, 42, 0.08);
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.path-card.opening-path {
  flex: 0 0 auto;
}
.path-heading {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 2px solid #dbe4ee;
  padding-bottom: 14px;
  margin-bottom: 18px;
}
.path-heading strong {
  font-size: 32px;
  line-height: 1.05;
  color: #0f172a;
}
.path-heading span {
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 0.08em;
  color: #64748b;
}
.lane {
  border: 3px solid #fed7aa;
  border-radius: 24px;
  background: #fff7ed;
  padding: 20px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 58px minmax(0, 1fr) 58px minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
}
.lane.proof {
  border-color: #99f6e4;
  background: #f0fdfa;
}
.row-label {
  height: 118px;
  border-radius: 18px;
  background: #0f172a;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  text-align: center;
  font-weight: 900;
  font-size: 24px;
  line-height: 1.02;
}
.row-label.teal { background: #0f766e; }
.step {
  height: 118px;
  border: 2px solid #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-sizing: border-box;
}
.step.orange { border-color: #fb923c; }
.step.teal { border-color: #2dd4bf; }
.step strong {
  font-size: 23px;
  line-height: 1.08;
  color: #0f172a;
}
.step span {
  margin-top: 8px;
  font-size: 17px;
  line-height: 1.08;
  color: #475569;
  font-weight: 760;
}
.bar-trio {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: auto;
}
.opening-path .bar-trio {
  margin-top: 18px;
}
.mini-bar {
  border: 2px solid #cbd5e1;
  border-radius: 14px;
  background: #f8fafc;
  padding: 13px 18px;
  text-align: center;
  color: #334155;
  font-size: 19px;
  font-weight: 900;
}
.line-arrow {
  height: 26px;
  position: relative;
}
.line-arrow::before {
  content: "";
  position: absolute;
  left: 0;
  right: 8px;
  top: 50%;
  border-top: 4px solid #f97316;
  transform: translateY(-50%);
}
.line-arrow::after {
  content: "";
  position: absolute;
  right: 0;
  top: 50%;
  width: 15px;
  height: 15px;
  border-top: 4px solid #f97316;
  border-right: 4px solid #f97316;
  transform: translateY(-50%) rotate(45deg);
}
.lane.proof .line-arrow::before,
.lane.proof .line-arrow::after {
  border-color: #0f766e;
}
section.opening-card { gap: 20px; }
section.opening-card h1 { font-size: 70px; }
section.opening-card .subtitle { font-size: 27px; }
section.opening-card .context { width: 760px; }
section.opening-card .context .katex { font-size: 1.2em; }
section.flow-card h1 { font-size: 72px; }
section.flow-card .hero.media-fit { --media-aspect: 1600 / 1040; }
section.flow-card .diagram-img.flow { max-height: none; }
section.hooks-card h1 { font-size: 67px; }
section.hooks-card .context { width: 960px; }
section.hooks-card .context .katex { font-size: 1.08em; }
section.hooks-card .hero.media-fit { --media-aspect: 1600 / 1040; }
section.lifecycle-card h1 { font-size: 68px; }
section.lifecycle-card .hero.media-fit { --media-aspect: 1120 / 920; }
section.lifecycle-card .diagram-img.lifecycle {
  height: 100%;
  max-height: none;
}
section.ssz-card h1 { font-size: 72px; }
section.ssz-card .hero.media-fit { --media-aspect: 1590 / 1120; }
section.engine-card h1 { font-size: 70px; }
section.engine-card .context { width: 760px; }
section.engine-card .hero.media-fit { --media-aspect: 1600 / 1040; }
section.p2p-card h1 { font-size: 69px; }
section.p2p-card .context { width: 990px; }
section.p2p-card .context .katex { font-size: 1.02em; }
section.p2p-card .hero.media-fit { --media-aspect: 1590 / 1120; }
section.el-card h1 { font-size: 68px; }
section.el-card .context { width: 760px; }
section.el-card .hero.media-fit { --media-aspect: 1600 / 1040; }
section.terms-card .context {
  width: 910px;
  margin-top: 8px;
}
section.terms-card .context .katex {
  font-size: 1.12em;
  line-height: 1.34;
}
section.faq-card {
  gap: 14px;
  padding: 50px 54px 108px;
}
section.faq-card .footer {
  left: 54px;
  right: 54px;
  bottom: 44px;
}
section.faq-card .topline { font-size: 22px; }
section.faq-card h1 {
  font-size: 62px;
  line-height: 0.94;
}
section.faq-card .subtitle {
  font-size: 25px;
  line-height: 1.22;
}
.forkcast-panel {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.forkcast-faq-list-view {
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  min-height: 0;
}
.forkcast-faq-intro {
  font-size: 18px;
  line-height: 1.35;
  font-weight: 500;
  color: #64748b;
}
.forkcast-faq-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}
.forkcast-faq-item {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  width: 100%;
  appearance: none;
  font: inherit;
  cursor: pointer;
  user-select: none;
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 0 18px;
  text-align: left;
  color: #1e293b;
  font-size: 19px;
  line-height: 1.16;
  font-weight: 720;
  transition: background-color 0.15s ease;
}
.forkcast-faq-item:hover,
.forkcast-faq-item:focus-visible {
  background: #f8fafc;
  outline: none;
}
.forkcast-faq-item span {
  min-width: 0;
  flex: 1 1 auto;
}
.forkcast-faq-item svg {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  color: #94a3b8;
}
.forkcast-faq-detail {
  flex: 1 1 auto;
  min-height: 0;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.forkcast-faq-detail[hidden] {
  display: none;
}
.forkcast-panel.is-answer-open .forkcast-faq-list-view {
  display: none;
}
.forkcast-faq-detail-card {
  width: 100%;
  max-height: 100%;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.06);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.forkcast-faq-detail-top {
  border-bottom: 2px solid #f1f5f9;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.forkcast-faq-back,
.forkcast-faq-exit {
  appearance: none;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  color: #334155;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.forkcast-faq-back {
  padding: 8px 13px;
  font-size: 16px;
  line-height: 1;
}
.forkcast-faq-exit {
  width: 40px;
  height: 40px;
  font-size: 26px;
  line-height: 1;
}
.forkcast-faq-back:hover,
.forkcast-faq-exit:hover,
.forkcast-faq-back:focus-visible,
.forkcast-faq-exit:focus-visible {
  background: #f8fafc;
  outline: none;
}
.forkcast-faq-detail-title {
  padding: 20px 24px 8px;
  font-size: 31px;
  line-height: 1.12;
  font-weight: 830;
  color: #0f172a;
}
.forkcast-faq-detail-copy {
  min-height: 0;
  overflow-y: auto;
  padding: 0 24px 24px;
  color: #334155;
}
.forkcast-faq-detail-copy p,
.forkcast-faq-detail-copy li {
  font-size: 20px;
  line-height: 1.37;
  font-weight: 560;
  color: #334155;
}
.forkcast-faq-detail-copy p + p,
.forkcast-faq-detail-copy p + ul,
.forkcast-faq-detail-copy ul + p {
  margin-top: 12px;
}
.forkcast-faq-detail-copy ul {
  margin: 0;
  padding-left: 26px;
}
.forkcast-faq-detail-copy li + li {
  margin-top: 7px;
}
.faq-note {
  border: 2px solid #cbd5e1;
  border-radius: 18px;
  background: #ffffff;
  padding: 14px 18px;
  font-size: 18.5px;
  line-height: 1.15;
  font-weight: 800;
  color: #475569;
}
section.resources-card {
  gap: 12px;
  padding: 46px 52px 108px;
}
section.resources-card .footer {
  left: 52px;
  right: 52px;
  bottom: 44px;
}
section.resources-card .topline { font-size: 22px; }
section.resources-card h1 {
  font-size: 52px;
  line-height: 0.92;
}
.resources-table {
  flex: 0 0 auto;
  border: 2px solid #dbe4ee;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 42px rgba(15, 23, 42, 0.07);
  padding: 10px 18px 12px;
  display: flex;
  flex-direction: column;
}
.resource-section {
  border-top: 2px solid #111827;
  padding-top: 6px;
  margin-top: 6px;
}
.resource-section:first-child {
  border-top: 0;
  padding-top: 0;
  margin-top: 0;
}
.resource-section h2 {
  margin: 0 0 3px;
  font-size: 19px;
  line-height: 1;
  font-weight: 930;
  color: #111827;
  text-transform: uppercase;
}
.resource-row {
  min-height: 27px;
  border-top: 1px solid #d1d5db;
  display: grid;
  grid-template-columns: 168px minmax(0, 1fr);
  gap: 14px;
  align-items: center;
}
.resource-row:first-of-type {
  border-top: 0;
}
.resource-name {
  font-size: 14.7px;
  line-height: 1.05;
  font-weight: 850;
  color: #111827;
}
.resource-links {
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 9px;
  row-gap: 2px;
}
.resource-row a {
  color: #334155;
  font-size: 14.5px;
  line-height: 1.05;
  font-weight: 720;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.resource-row a:hover {
  text-decoration: underline;
}
</style>

<!-- _class: opening-card -->

<div class="topline"><span>Optional execution proofs</span><span class="cardno">01 / 12</span></div>

# Optional execution proofs

<p class="subtitle">EIP-8025 lets Ethereum clients verify payloads using execution proofs. Execution proof verification takes constant time and does not require the EL state.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{Validation bottleneck:}\ \text{payload validity currently requires re-execution} \\
\textbf{Execution proofs:}\ \text{give constant-time payload verification} \\
\textbf{Stateless validation:}\ \text{no EL state is needed to check the proof}
\end{array}
$$

</div>

<div class="path-card opening-path">
  <div class="path-heading"><strong>Payload validation path</strong><span>Same block, different check</span></div>
  <div class="lane">
    <div class="row-label">Today</div>
    <div class="step"><strong>Block import</strong></div>
    <div class="line-arrow"></div>
    <div class="step orange"><strong>Re-execute payload</strong></div>
    <div class="line-arrow"></div>
    <div class="step"><strong>Payload validity</strong></div>
  </div>
  <div class="lane proof">
    <div class="row-label teal">EIP-8025</div>
    <div class="step"><strong>Block import</strong></div>
    <div class="line-arrow"></div>
    <div class="step teal"><strong>Verify proof</strong></div>
    <div class="line-arrow"></div>
    <div class="step teal"><strong>Stateless payload validity</strong></div>
  </div>
  <div class="bar-trio">
    <div class="mini-bar">No EL state</div>
    <div class="mini-bar">Constant-time check</div>
    <div class="mini-bar">Payload validity proof</div>
  </div>
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: flow-card -->

<div class="topline"><span>Execution proof flow</span><span class="cardno">02 / 12</span></div>

# Execution proof flow

<p class="subtitle">When a valid block is imported, a prover asks the proof engine for an execution proof, signs the proof, and publishes it to the network. Verifiers use the proof to check payload validity.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{Block import:}\ \text{creates one payload proof request} \\
\textbf{Prover:}\ \text{generates, signs, and publishes a SignedExecutionProof} \\
\textbf{Verifier:}\ \text{checks payload validity by verifying that proof}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img flow" src="assets/eip8025-proof-flow.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: hooks-card -->

<div class="topline"><span>Consensus specs modifications</span><span class="cardno">03 / 12</span></div>

# Consensus specs modifications

<p class="subtitle">A small set of changes to the consensus specs is required to integrate execution proofs.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{Active validator:}\ \text{validator index resolves to an active validator} \\
\textbf{Domain signature:}\ \text{the proof is signed by the active validator using the execution proof domain} \\
\textbf{Payload validity:}\ \text{ProofEngine verifies the execution proof instead of re-executing the payload}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img consensus-hooks" src="assets/eip8025-consensus-hooks.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: lifecycle-card -->

<div class="topline"><span>Proof generation lifecycle</span><span class="cardno">04 / 12</span></div>

# Proof generation lifecycle

<p class="subtitle">A prover watches block events, builds the payload request, asks the proof node to prove it, signs the proof, and gossips it to the network.</p>

<div class="hero media-fit">
  <img class="diagram-img lifecycle" src="assets/prover-lifecycle.png" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: ssz-card -->

<div class="topline"><span>Proof types</span><span class="cardno">05 / 12</span></div>

# Proof types

<p class="subtitle">EIP-8025 introduces consensus-layer data types for execution proof verification, signing, and network transport.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{PublicInput:}\ \text{binds verification to the exact payload request root} \\
\textbf{ExecutionProof:}\ \text{carries proof type, proof data, and public input} \\
\textbf{SignedExecutionProof:}\ \text{adds validator index and signature}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img ssz-model" src="assets/eip8025-ssz-data-model.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: engine-card -->

<div class="topline"><span>The Proof Engine</span><span class="cardno">06 / 12</span></div>

# The Proof Engine

<p class="subtitle">A proof engine is introduced to abstract execution proof generation, verification, and state tracking from the consensus layer.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{CL side:}\ \text{notify payload and forkchoice events, request proofs, verify proofs} \\
\textbf{ProofEngine:}\ \text{hides proof-system implementation and storage} \\
\textbf{Root binding:}\ \text{request id matches the PublicInput payload root}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img engine-boundary" src="assets/eip8025-proofengine-boundary.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: p2p-card -->

<div class="topline"><span>Execution proof networking</span><span class="cardno">07 / 12</span></div>

# Execution proof networking

<p class="subtitle">EIP-8025 adds one proof gossip topic, two proof-sync protocols, a status handshake, and an ENR flag. Gossip and sync carry signed proofs; discovery and status choose peers.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{Network object:}\ \text{SignedExecutionProof carries validator index, signature, and proof} \\
\textbf{Sync protocols:}\ \text{ByRange is slot-based; ByRoot is selector-based} \\
\textbf{Peer selection:}\ \text{ENR.eproof advertises capability; status returns block root, slot, and proof types}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img p2p-protocol" src="assets/eip8025-p2p-protocol.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: el-card -->

<div class="topline"><span>The guest program</span><span class="cardno">08 / 12</span></div>

# The guest program

<p class="subtitle">The execution proof guest program performs stateless validation for one Engine API payload request.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{Host:}\ \text{builds StatelessInput from payload request, witness, and chain config} \\
\textbf{Guest:}\ \text{runs stateless new-payload validation with no local EL database} \\
\textbf{Output:}\ \text{StatelessValidationResult is the public result}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img el-guest" src="assets/eip8025-el-guest-flow.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: el-card -->

<div class="topline"><span>Guest input standards</span><span class="cardno">09 / 12</span></div>

# Guest input standards

<p class="subtitle">Standardizing StatelessInput and StatelessValidationResult gives every prover stack the same input/output test surface.</p>

<div class="context">

$$
\begin{array}{l}
\textbf{Input:}\ \text{multiple guests and provers share StatelessInput} \\
\textbf{Output:}\ \text{all implementations return StatelessValidationResult} \\
\textbf{Test I/O:}\ \text{same input contract, same result contract, same cases}
\end{array}
$$

</div>

<div class="hero media-fit">
  <img class="diagram-img el-boundary" src="assets/eip8025-el-standard-boundary.svg" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: terms-card -->

<div class="topline"><span>Terminology</span><span class="cardno">10 / 12</span></div>

# Terminology

<div class="context">

$$
\begin{array}{l}
\textbf{Proof system:}\ \text{proves that a computation was performed correctly} \\
\textbf{Execution proof:}\ \text{proves stateless validation for one NewPayloadRequest} \\
\textbf{Prover:}\ \text{runs execution validation and generates an execution proof} \\
\textbf{Verifier:}\ \text{checks an execution proof instead of re-executing the payload} \\
\textbf{Guest:}\ \text{the program whose execution is proven} \\
\textbf{Host:}\ \text{prepares input, runs the guest, and packages the proof} \\
\textbf{Private input:}\ \text{serialized StatelessInput, including the execution witness} \\
\textbf{Execution Witness:}\ \text{data used by the guest without verifier EL state} \\
\textbf{Public input:}\ \text{binds NewPayloadRequest, chain configuration, and validation result} \\
\textbf{Proof node:}\ \text{external service that performs proof generation work} \\
\textbf{Proof engine:}\ \text{consensus-client interface to proof generation and verification} \\
\textbf{Proof-aware peer:}\ \text{advertises support and participates for supported proof types} \\
\textbf{Server-Sent Events (SSE):}\ \text{long-lived streams for block and proof-completion events}
\end{array}
$$

</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: faq-card -->

<div class="topline"><span></span><span class="cardno">11 / 12</span></div>

# FAQ

<div class="forkcast-panel" data-faq-root>
  <div class="forkcast-faq-list-view">
    <p class="forkcast-faq-intro">Frequently asked questions about this proposal. Select a question to open the answer.</p>
    <div class="forkcast-faq-list">
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-01"><span>What's in EIP-8025?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-02"><span>What problem does it solve?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-03"><span>Why optional first?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-04"><span>Why does an optional feature need protocol-level changes?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-05"><span>Is it "zkEVM" or "zkVM"?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-06"><span>What are the two new opt-in node modes?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-07"><span>If I opt in as a full node or validator, do I still need to run an EL?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-08"><span>What happens if the proof verification disagrees with the EL?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-09"><span>Should validators opt in?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
      <button type="button" class="forkcast-faq-item" data-faq-target="faq-answer-10"><span>Why propose for Hegotá?</span><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg></button>
    </div>
  </div>

  <div class="forkcast-faq-detail" data-faq-detail hidden>
    <div class="forkcast-faq-detail-card">
      <div class="forkcast-faq-detail-top">
        <button type="button" class="forkcast-faq-back" data-faq-close>Back to questions</button>
        <button type="button" class="forkcast-faq-exit" data-faq-close aria-label="Exit answer" title="Exit answer">&times;</button>
      </div>
      <h2 class="forkcast-faq-detail-title" data-faq-title></h2>
      <div class="forkcast-faq-detail-copy" data-faq-copy></div>
    </div>
  </div>

  <template id="faq-answer-01">
    <p>EIP-8025 introduces a consensus-layer mechanism by which beacon nodes can verify the validity of an <em>execution payload</em> using execution proofs, also called zkEVM proofs, received over the P2P network, rather than purely re-executing locally.</p>
    <p>The EIP <strong>defines two new opt-in node roles</strong>, expressed in the spec as modes a node enables independently or together:</p>
    <ul>
      <li><strong>Provers</strong> in proof-generating mode altruistically produce zkEVM proofs for each block's execution and gossip them.</li>
      <li><strong>zkAttesters</strong>, also called stateless attesters, verify received zkEVM proofs as a supplementary check on payload validity.</li>
    </ul>
    <p>EIP-8025 lives primarily on the consensus layer, but it also introduces an execution-layer artefact: the <em>guest program</em>, the block-execution logic that runs inside a zkVM and constitutes the computation the prover proves.</p>
    <p>The EVM itself is not modified; existing EL clients continue producing payloads as before.</p>
    <p>Importantly, validating nodes who do not opt in see no change.</p>
  </template>

  <template id="faq-answer-02">
    <p>It makes payload validation sublinear in the gas limit and the state size, and stateless.</p>
    <p>The practical implication is that payload validation remains accessible to nodes even as the gas limit grows and state size increases, because the cost of verifying a zkEVM proof does not scale with either.</p>
  </template>

  <template id="faq-answer-03">
    <p>An L1-zkEVM is a <strong>substantial shift in how blocks are validated</strong> on Ethereum, and the surface area touches many parts of the protocol stack: execution, consensus, cryptography, networking, economics, governance, and more.</p>
    <p>Making EIP-8025 <strong>non-consensus-critical</strong> lets the network test real-time zkEVM proving and verifying under mainnet conditions with only a subset of attesters opting in.</p>
    <p>In this optional phase, attestation duties are still driven by the EL client's re-execution of payloads, with <strong>proofs serving as a supplementary check</strong> rather than the sole source of validity. A node that has opted in but has not received enough valid proofs in time simply attests as it does today.</p>
    <p>This preserves a <strong>robust fallback</strong> if proofs are late, missing, or buggy, and it is the rational stance for an individual zkAttester: <strong>proving is altruistic during the optional phase</strong>, and missed or late proofs translate into missed timeliness rewards.</p>
  </template>

  <template id="faq-answer-04">
    <p>The work needed to land this is large: execution spec changes, testing-framework changes, and tooling changes. This is <strong>hard to accomplish and risky in a single hard fork</strong> while also making proofs mandatory at the same time. Splitting it across forks, optional first and potentially mandatory later, is more tractable.</p>
    <p>Moreover, scheduling it as an EIP <strong>forces dedicated capacity from multiple stakeholders</strong> to look at it seriously, which is needed because the architectural surface is non-trivial.</p>
    <p>Shipping it as an optional feature is also the <strong>safest way to gather real mainnet data</strong> and surface unknown unknowns without putting any load-bearing part of the network at risk.</p>
  </template>

  <template id="faq-answer-05">
    <p>Both, depending on which layer of the stack you mean.</p>
    <p>A <strong>zkVM</strong> is a general-purpose virtual machine, typically RISC-V or a similar minimal ISA, whose execution can be proven inside a proof system. It knows nothing about Ethereum; it just executes whatever program you compile for it and produces a proof that the program ran correctly on the given inputs. ZisK, Jolt, and LambdaVM are examples of zkVMs.</p>
    <p>A <strong>zkEVM</strong> is what you get when you run an EVM implementation <em>as a guest program</em> inside a zkVM. The guest in EIP-8025 is exactly this: a stateless EVM payload verifier, written against the execution specs, compiled to run inside a zkVM. So the rough equation is <strong>zkEVM = zkVM + EVM guest program</strong>.</p>
    <p>A practical implication of this split: the zkVM and the EVM guest program can evolve independently. You can swap the zkVM, for example moving from one proof system to another, without changing the guest program, and you can upgrade the guest program, for example to handle a new EVM fork, without changing the zkVM. EIP-8025's multi-proof-type support leans on exactly this separation.</p>
  </template>

  <template id="faq-answer-06">
    <p><strong>Proof-generating mode</strong> is opted into by an active validator, which takes on the role of a <em>proof-proposer</em>. When a new beacon block arrives, the validator asks its proof engine to generate proofs of the configured types, signs each returned proof, and broadcasts it on the new execution-proof gossip topic.</p>
    <p>The actual cryptographic proving work is delegated to an external proof node or prover behind the <em>proof engine</em>; the validator's job is to trigger generation, sign the result, and broadcast.</p>
    <p><strong>Proof-verifying mode</strong> is opted into by any node, validator or not. The node listens on the gossip topic, runs the standard gossip validation rules, and asks its <em>proof engine</em> to verify each proof it receives.</p>
  </template>

  <template id="faq-answer-07">
    <p>Yes. Optional proofs do not replace the EL. Re-execution remains the validity oracle for attestation and fork choice; the proof is additional work done only if you opt in.</p>
  </template>

  <template id="faq-answer-08">
    <p>The EL is authoritative. Proof verification is currently a separate, non-load-bearing path. It does not affect attestation, fork choice, or block validity.</p>
  </template>

  <template id="faq-answer-09">
    <p>There are a few points to consider here:</p>
    <ul>
      <li>Downloading and gossiping proofs is additional work and could slow opted-in validators down on the propagation path, with knock-on effects on peers.</li>
      <li>Proving is altruistic and missed or late proofs translate into missed timeliness rewards for validators.</li>
    </ul>
    <p>However, while excluding validators would minimise risk, it would also reduce what can be learned, because validator hardware profiles differ from full-node hardware profiles, and one of the goals is precisely to understand those.</p>
    <p>The plan is to communicate carefully which validators are recommended to enable the feature, ideally a small percentage with above-baseline resources, not everyone turning it on blindly.</p>
  </template>

  <template id="faq-answer-10">
    <p>ZK <strong>technology has significantly matured</strong>. Proving stacks have been running in production on L2s and rollups for years. As a logical continuation of the rollup-centric roadmap, the idea is to make L1 a rollup itself.</p>
    <p>Moreover, both CL and EL <strong>specs for EIP-8025 are largely settled</strong>, and both already have <strong>functioning client implementations</strong>. As a fully opt-in change, inclusion in Hegotá is <strong>low-risk</strong>: validators that do not enable either mode see no change to behaviour, bandwidth, or attestation duties.</p>
    <p>Just as important, proposing the EIP now anchors the work inside the protocol upgrade process, where it needs to live. Very practically, client teams, zkVM teams, tooling maintainers, and spec writers should feel empowered to <strong>allocate sustained resources</strong> to working on zkVMs, <em>guest programs</em>, execution witness generation, and the surrounding test infrastructure.</p>
    <p>Whether and when proofs eventually become protocol-native and <em>mandatory</em> is a separate decision for a later EIP and a later fork, at which point attesters would not be required to run a stateful EL client anymore, dramatically reducing the cost of running a verifying node.</p>
  </template>
</div>

<script>
(() => {
  const closeFaq = (root) => {
    const detail = root.querySelector('[data-faq-detail]');
    const copy = root.querySelector('[data-faq-copy]');
    const previousTarget = root.dataset.previousFaqTarget;
    root.classList.remove('is-answer-open');
    if (detail) detail.hidden = true;
    if (copy) copy.replaceChildren();
    if (previousTarget) {
      const previousButton = root.querySelector(`[data-faq-target="${previousTarget}"]`);
      if (previousButton) previousButton.focus({ preventScroll: true });
    }
  };

  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-faq-target]');
    if (trigger) {
      const root = trigger.closest('[data-faq-root]');
      if (!root) return;
      const target = trigger.getAttribute('data-faq-target');
      const template = root.querySelector(`template[id="${target}"]`);
      const detail = root.querySelector('[data-faq-detail]');
      const title = root.querySelector('[data-faq-title]');
      const copy = root.querySelector('[data-faq-copy]');
      const back = root.querySelector('[data-faq-close]');
      if (!template || !detail || !title || !copy) return;
      event.preventDefault();
      event.stopPropagation();
      root.dataset.previousFaqTarget = target;
      title.textContent = trigger.querySelector('span')?.textContent || '';
      copy.replaceChildren(template.content.cloneNode(true));
      detail.hidden = false;
      root.classList.add('is-answer-open');
      if (back) back.focus({ preventScroll: true });
      return;
    }

    const closeButton = event.target.closest('[data-faq-close]');
    if (closeButton) {
      const root = closeButton.closest('[data-faq-root]');
      if (!root) return;
      event.preventDefault();
      event.stopPropagation();
      closeFaq(root);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const root = document.querySelector('[data-faq-root].is-answer-open');
    if (!root) return;
    event.preventDefault();
    closeFaq(root);
  });
})();
</script>

<div class="footer">EIP-8025</div>

---

<!-- _class: resources-card -->

<div class="topline"><span>Resources</span><span class="cardno">12 / 12</span></div>

# Resources

<div class="resources-table">
  <section class="resource-section">
    <h2>Consensus Layer</h2>
    <div class="resource-row"><span class="resource-name">ACDC proposal deck</span><a target="_blank" rel="noopener noreferrer" href="https://frisitano.github.io/slides/presentations/eip8025-acdc-proposal-2026-05-14/">frisitano.github.io/slides/presentations/eip8025-acdc-proposal-2026-05-14/</a></div>
    <div class="resource-row"><span class="resource-name">EIP</span><a target="_blank" rel="noopener noreferrer" href="https://eips.ethereum.org/EIPS/eip-8025">eips.ethereum.org/EIPS/eip-8025</a></div>
    <div class="resource-row"><span class="resource-name">EIP PR</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/EIPs/pull/11604">github.com/ethereum/EIPs/pull/11604</a></div>
    <div class="resource-row"><span class="resource-name">Discussion</span><a target="_blank" rel="noopener noreferrer" href="https://ethereum-magicians.org/t/eip-8025-optional-execution-proofs/25500">ethereum-magicians.org/t/eip-8025-optional-execution-proofs/25500</a></div>
    <div class="resource-row"><span class="resource-name">Consensus specs</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/consensus-specs/tree/master/specs/_features/eip8025">github.com/ethereum/consensus-specs/tree/master/specs/_features/eip8025</a></div>
    <div class="resource-row"><span class="resource-name">Beacon API PR</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/beacon-APIs/pull/569">github.com/ethereum/beacon-APIs/pull/569</a></div>
    <div class="resource-row"><span class="resource-name">Lighthouse fork</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/eth-act/lighthouse">github.com/eth-act/lighthouse</a></div>
    <div class="resource-row"><span class="resource-name">Prysm fork</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/OffchainLabs/prysm/tree/optional-proofs">github.com/OffchainLabs/prysm/tree/optional-proofs</a></div>
    <div class="resource-row"><span class="resource-name">Kurtosis package</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethpandaops/ethereum-package">github.com/ethpandaops/ethereum-package</a></div>
    <div class="resource-row"><span class="resource-name">Kurtosis configs</span><span class="resource-links"><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethpandaops/ethereum-package/blob/main/.github/tests/zkboost.yaml">mock proofs</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethpandaops/ethereum-package/blob/main/.github/tests/examples/1gpu_zkvm.yaml">1 GPU</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethpandaops/ethereum-package/blob/main/.github/tests/examples/8gpu_zkvm.yaml">8 GPU</a></span></div>
    <div class="resource-row"><span class="resource-name">Dora explorer</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethpandaops/dora">github.com/ethpandaops/dora</a></div>
  </section>

  <section class="resource-section">
    <h2>Execution Layer</h2>
    <div class="resource-row"><span class="resource-name">Execution specs</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/tree/master/src/ethereum/forks/amsterdam">github.com/ethereum/execution-specs/tree/master/src/ethereum/forks/amsterdam</a></div>
    <div class="resource-row"><span class="resource-name">Stateless files</span><span class="resource-links"><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/blob/85fc20ca5937719a854472a87cb48d01ef1dffca/src/ethereum/forks/amsterdam/stateless.py">stateless.py</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/blob/85fc20ca5937719a854472a87cb48d01ef1dffca/src/ethereum/forks/amsterdam/stateless_guest.py">guest.py</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/blob/85fc20ca5937719a854472a87cb48d01ef1dffca/src/ethereum/forks/amsterdam/stateless_host.py">host.py</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/blob/85fc20ca5937719a854472a87cb48d01ef1dffca/src/ethereum/forks/amsterdam/stateless_host_exec_witness.py">witness.py</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/blob/85fc20ca5937719a854472a87cb48d01ef1dffca/src/ethereum/forks/amsterdam/stateless_ssz.py">stateless_ssz.py</a></span></div>
    <div class="resource-row"><span class="resource-name">Conformance tests</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-specs/tree/85fc20ca5937719a854472a87cb48d01ef1dffca/tests/amsterdam/eip8025_optional_proofs">github.com/ethereum/execution-specs/tree/.../eip8025_optional_proofs</a></div>
    <div class="resource-row"><span class="resource-name">Execution API PR</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/execution-apis/pull/735">github.com/ethereum/execution-apis/pull/735</a></div>
    <div class="resource-row"><span class="resource-name">eth-act repos</span><span class="resource-links"><a target="_blank" rel="noopener noreferrer" href="https://github.com/eth-act/zkboost">zkboost</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/eth-act/ere">ere</a><a target="_blank" rel="noopener noreferrer" href="https://github.com/eth-act/ere-guests">ere-guests</a></span></div>
  </section>

  <section class="resource-section">
    <h2>General</h2>
    <div class="resource-row"><span class="resource-name">Forkcast FAQ</span><a target="_blank" rel="noopener noreferrer" href="https://deploy-preview-300--eth-forkcast.netlify.app/eips/8025?tab=faq">deploy-preview-300--eth-forkcast.netlify.app/eips/8025?tab=faq</a></div>
    <div class="resource-row"><span class="resource-name">zkEVM hub</span><a target="_blank" rel="noopener noreferrer" href="https://zkevm.ethereum.foundation/">zkevm.ethereum.foundation/</a></div>
    <div class="resource-row"><span class="resource-name">eth-act benchmarks</span><a target="_blank" rel="noopener noreferrer" href="https://eth-act.github.io/zkevm-benchmark-runs/">eth-act.github.io/zkevm-benchmark-runs/</a></div>
    <div class="resource-row"><span class="resource-name">L1 zkEVM breakouts</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/pm/issues?q=is%3Aissue+L1-zkEVM+breakout">github.com/ethereum/pm/issues?q=is%3Aissue+L1-zkEVM+breakout</a></div>
    <div class="resource-row"><span class="resource-name">Benchmark profiles</span><a target="_blank" rel="noopener noreferrer" href="https://eth-act.github.io/zkevm-benchmark-runs/profiles/">eth-act.github.io/zkevm-benchmark-runs/profiles/</a></div>
    <div class="resource-row"><span class="resource-name">zkEVM blog</span><a target="_blank" rel="noopener noreferrer" href="https://zkevm.ethereum.foundation/blog">zkevm.ethereum.foundation/blog</a></div>
    <div class="resource-row"><span class="resource-name">EIP-8025 post</span><a target="_blank" rel="noopener noreferrer" href="https://zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota">zkevm.ethereum.foundation/blog/eip-8025-optional-execution-proofs-hegota</a></div>
    <div class="resource-row"><span class="resource-name">zkVM standards</span><a target="_blank" rel="noopener noreferrer" href="https://zkevm.ethereum.foundation/blog/zkevm-standards-v0-release">zkevm.ethereum.foundation/blog/zkevm-standards-v0-release</a></div>
    <div class="resource-row"><span class="resource-name">Ethproofs</span><a target="_blank" rel="noopener noreferrer" href="https://ethproofs.org/">ethproofs.org/</a></div>
    <div class="resource-row"><span class="resource-name">Ethproofs GitHub</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethproofs">github.com/ethproofs</a></div>
  </section>
</div>

<div class="footer">EIP-8025</div>
