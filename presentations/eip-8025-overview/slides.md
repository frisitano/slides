---
marp: true
theme: marp-4x5
size: social-portrait
paginate: false
backgroundColor: #f8fafc
math: katex
title: Overview Deck
category: EIP-8025
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
  padding: 12px 18px 14px;
  display: flex;
  flex-direction: column;
}
.resource-section {
  border-top: 2px solid #111827;
  padding-top: 8px;
  margin-top: 8px;
}
.resource-section:first-child {
  border-top: 0;
  padding-top: 0;
  margin-top: 0;
}
.resource-section h2 {
  margin: 0 0 4px;
  font-size: 22px;
  line-height: 1;
  font-weight: 930;
  color: #111827;
  text-transform: uppercase;
}
.resource-row {
  min-height: 32px;
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
  font-size: 16.2px;
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
  font-size: 15.8px;
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

<div class="topline"><span>Optional execution proofs</span><span class="cardno">01 / 11</span></div>

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

<div class="topline"><span>Execution proof flow</span><span class="cardno">02 / 11</span></div>

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

<div class="topline"><span>Consensus specs modifications</span><span class="cardno">03 / 11</span></div>

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

<div class="topline"><span>Proof generation lifecycle</span><span class="cardno">04 / 11</span></div>

# Proof generation lifecycle

<p class="subtitle">A prover watches block events, builds the payload request, asks the proof node to prove it, signs the proof, and gossips it to the network.</p>

<div class="hero media-fit">
  <img class="diagram-img lifecycle" src="assets/prover-lifecycle.png" />
</div>

<div class="footer">EIP-8025</div>

---

<!-- _class: ssz-card -->

<div class="topline"><span>Proof types</span><span class="cardno">05 / 11</span></div>

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

<div class="topline"><span>The Proof Engine</span><span class="cardno">06 / 11</span></div>

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

<div class="topline"><span>Execution proof networking</span><span class="cardno">07 / 11</span></div>

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

<div class="topline"><span>The guest program</span><span class="cardno">08 / 11</span></div>

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

<div class="topline"><span>Guest input standards</span><span class="cardno">09 / 11</span></div>

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

<div class="topline"><span>Terminology</span><span class="cardno">10 / 11</span></div>

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

<!-- _class: resources-card -->

<div class="topline"><span>Resources</span><span class="cardno">11 / 11</span></div>

# Resources

<div class="resources-table">
  <section class="resource-section">
    <h2>Consensus Layer</h2>
    <div class="resource-row"><span class="resource-name">ACDC proposal deck</span><a target="_blank" rel="noopener noreferrer" href="https://frisitano.github.io/slides/presentations/eip8025-acdc-proposal-2026-05-14/">frisitano.github.io/slides/presentations/eip8025-acdc-proposal-2026-05-14/</a></div>
    <div class="resource-row"><span class="resource-name">EIP</span><a target="_blank" rel="noopener noreferrer" href="https://eips.ethereum.org/EIPS/eip-8025">eips.ethereum.org/EIPS/eip-8025</a></div>
    <div class="resource-row"><span class="resource-name">EIP PR</span><a target="_blank" rel="noopener noreferrer" href="https://github.com/ethereum/EIPs/pull/11604">github.com/ethereum/EIPs/pull/11604</a></div>
    <div class="resource-row"><span class="resource-name">Discussion</span><a target="_blank" rel="noopener noreferrer" href="https://ethereum-magicians.org/t/eip-8025-optional-execution-proofs/25500">ethereum-magicians.org/t/eip-8025-optional-execution-proofs/25500</a></div>
    <div class="resource-row"><span class="resource-name">Consensus specs</span><a target="_blank" rel="noopener noreferrer" href="https://ethereum.github.io/consensus-specs/specs/_features/eip8025/">ethereum.github.io/consensus-specs/specs/_features/eip8025/</a></div>
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
