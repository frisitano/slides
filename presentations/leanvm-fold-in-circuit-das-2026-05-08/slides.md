---
marp: true
theme: default
paginate: true
size: 16:9
header: 'leanDA — PQ proofs of RS codes with leanVM'
footer: 'Francesco Risitano · 2026'
style: |
  section {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 22px;
  }
  section.construction { font-size: 17px; }
  section.construction4 {
    padding-top: 50px;
    padding-bottom: 34px;
  }
  h1 { color: #1a1a1a; }
  h2 { color: #2a4365; border-bottom: 2px solid #2a4365; padding-bottom: 6px; }
  section.construction4 h2 {
    font-size: 1.04em;
    line-height: 1.08;
    margin: 0 0 0.52rem;
    padding-bottom: 3px;
  }
  code { background: #f3f4f6; padding: 2px 5px; border-radius: 4px; }
  table { font-size: 0.85em; }
  table th { background: #2a4365; color: white; }
  .construction-grid {
    display: grid;
    grid-template-columns: 43% 57%;
    gap: 1rem;
    align-items: start;
  }
  .construction-grid.diagram-heavy {
    grid-template-columns: 54% 46%;
    gap: 0.85rem;
    margin-top: 0.1rem;
  }
  .construction-grid.diagram-heavy .latex {
    font-size: 0.66em;
    line-height: 1.12;
  }
  .construction-grid.diagram-heavy .right-column {
    margin-top: 1.25rem;
  }
  .construction-grid.diagram-heavy .step {
    margin-bottom: 0.58rem;
  }
  .construction-grid.diagram-heavy .bench table {
    font-size: 0.48em;
  }
  .diagram img {
    width: 100%;
    border: 1px solid #ced4da;
    border-radius: 8px;
    background: white;
  }
  .right-column {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .latex { font-size: 0.73em; line-height: 1.17; }
  .step { margin-bottom: 0.78rem; }
  .step p { margin: 0 0 0.12rem; }
  .step mjx-container { margin: 0.05rem 0 !important; }
  .bench table { font-size: 0.55em; margin: 0.1rem 0 0; }
  .impl {
    margin-top: 0.2rem;
    padding: 0.34rem 0.45rem;
    background: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    font-size: 0.68em;
    line-height: 1.28;
  }
  .impl a { color: #1c7ed6; }
  .impl.compact {
    align-self: flex-start;
    width: 68%;
    margin-top: 0.05rem;
    padding: 0.24rem 0.34rem;
    font-size: 0.5em;
    line-height: 1.18;
    background: #fbfcfd;
    border-color: #e9ecef;
  }
  .small { font-size: 0.72em; }
  .center { text-align: center; }
---

<!-- _class: lead -->

# leanDA

## Post Quantum Proofs of RS codes with leanVM

**Francesco Risitano**

---

<!-- _class: construction -->

## Construction 1 — RLC + FRI Fold In Circuit

<div class="construction-grid">

<div class="diagram">

![RLC + FRI fold diagram](assets/rlc-fri-fold.svg)

</div>

<div class="right-column">

<div class="latex">

<div class="step">

**1. Commit rows and sample the RLC challenge.** The transcript binds every row root before sampling $\rho$.

$$
D = H(\operatorname{root}(C_0),\ldots,\operatorname{root}(C_{m-1})),
\qquad
\rho = H(D)
$$

</div>

<div class="step">

**2. Build one extension-field aggregate codeword.** Every column is combined with powers of $\rho$.

$$
C^\star[j] = \sum_{i=0}^{m-1}\rho^i C_i[j]
$$

</div>

<div class="step">

**3. Fold the aggregate in the leanVM trace.** Each round halves the domain.

$$
C^{(t+1)}[j] =
\frac{C^{(t)}[2j] + C^{(t)}[2j+1]}{2}
+ \beta_t
\frac{C^{(t)}[2j] - C^{(t)}[2j+1]}{2x_j}
$$

</div>

<div class="step">

**4. Assert exact RS membership.** The final folded vector must be constant.

$$
C^{(\log n)}[0]=C^{(\log n)}[1]=\cdots
$$

</div>

</div>

<div class="bench">

| benchmark | parameters | prove | message throughput | proof |
|---|---:|---:|---:|---:|
| leanDAS headline | $m=240,\ n=4096$, half-rate | 5.28 s | 364 KB/s | 356 KiB |

</div>

</div>

</div>

<div class="impl">
Implementation: <a href="https://github.com/frisitano/leanDAS/blob/main/rust/crates/das-prover/circuit.py">circuit.py</a><br/>
Run: <code>cargo run --release --bin leandas -- -m 240 -n 4096 --zkvm</code>
</div>

---

<!-- _class: construction -->

## Construction 2 — Barycentric Check Per Row

<div class="construction-grid">

<div class="diagram">

![Barycentric row check diagram](assets/barycentric-per-row.svg)

</div>

<div class="right-column">

<div class="latex">

<div class="step">

**1. Commit rows and sample the barycentric point.** The same challenge is used for all row checks.

$$
D = H(\operatorname{root}(C_0),\ldots,\operatorname{root}(C_{B-1})),
\qquad r = \operatorname{Decode}_{\mathbb{E}}(D)
$$

</div>

<div class="step">

**2. Build the evens/odds barycentric slices.** For row domain roots $u=w^2$:

$$
s_L[j]=\frac{r^M-1}{r u^{-j}-1},
\qquad
s_R[j]=-\frac{r^M+1}{r w^{-1}u^{-j}-1}
$$

</div>

<div class="step">

**3. Check every row independently.** For $C_i=(v_0,\ldots,v_{2M-1})$:

$$
\sum_{j=0}^{M-1} s_L[j]\,v_{2j}
=
\sum_{j=0}^{M-1} s_R[j]\,v_{2j+1}
$$

</div>

</div>

<div class="bench">

| blobs | bytecode | cycles | Poseidon16 | ExtOp | proof | throughput |
|---:|---:|---:|---:|---:|---:|---:|
| 8  | 59,560 | 131,254 | 81,920  | 180,236 | 316.09 KiB | 836.91 KiB/s |
| 16 | 59,656 | 213,286 | 163,840 | 311,308 | 334.89 KiB | 930.65 KiB/s |
| 32 | 59,848 | 377,350 | 327,680 | 573,452 | 351.21 KiB | 949.17 KiB/s |

</div>

</div>

</div>

<div class="impl">
Implementation: <a href="https://github.com/leanEthereum/leanMultisig/blob/26d851afe7d53f1694057d29a0e8e36f51530f40/crates/lean-da/zkdsl_implem/lean_da.py">lean_da.py</a>, <a href="https://github.com/leanEthereum/leanMultisig/blob/26d851afe7d53f1694057d29a0e8e36f51530f40/crates/lean-da/zkdsl_implem/barycentric.py">barycentric.py</a><br/>
Run: <code>cargo run --release -p lean-da -- --n-blobs 32</code>
</div>

---

<!-- _class: construction construction4 -->

## Construction 3 — Systematic Row Digests + Column Merkle Commitments + Row Barycentric Checks + Cell-Level Sampling

<div class="construction-grid diagram-heavy">

<div class="diagram">

![Column Merkle commitment diagram](assets/column-merkle-commitment.png)

</div>

<div class="right-column">

<div class="latex">

<div class="step">

**1. Hash each cell.** Split every row into aligned cells of $L$ extension-field elements. Cell $j$ starts at offset $jL$, then its base-field limbs are chunked and chain-hashed into one 8-FE digest.

$$
\mathrm{cell}_{i,j}=C_i[jL\,..\,(j+1)L)\in\mathbb{E}^{L}
$$

$$
q_{i,j}=H_{\mathrm{chain}}(\operatorname{chunks}(\operatorname{limbs}_{\mathbb{F}}(\mathrm{cell}_{i,j})))\in\mathbb{F}^{8}
$$

</div>

<div class="step">

**2. Chain only systematic row-cell digests into one digest per row.** The row digest ignores parity cells.

$$
\mathrm{row}_i=H_{\mathrm{chain}}(q_{i,0},\ldots,q_{i,N_{\mathrm{sys}}-1})
$$

$$
R_{\mathrm{rows}}=H_{\mathrm{chain}}(\mathrm{row}_0,\ldots,\mathrm{row}_{B-1})
$$

</div>

<div class="step">

**3. Merkle-commit each column, then bind row and column commitments together.** Non-power-of-two row counts are zero-padded inside each column tree.

$$
\mathrm{col}_j=\operatorname{Merkle}(q_{0,j},q_{1,j},\ldots,q_{B-1,j},0,\ldots,0)
$$

$$
R_{\mathrm{col}}=\operatorname{Merkle}(\mathrm{col}_0,\ldots,\mathrm{col}_{N-1})
$$

$$
D=H(R_{\mathrm{rows}},R_{\mathrm{col}}), \qquad r=D
$$

</div>

<div class="step">

**4. Run the standard row barycentric LDT.** The same evens/odds identity is checked for every row.

$$
\sum_{j=0}^{M-1}s_L[j]\,C_i[2j]
=
\sum_{j=0}^{M-1}s_R[j]\,C_i[2j+1]
$$

</div>

</div>

<div class="bench">

| blobs | bytecode | cycles | Poseidon16 | ExtOp | proof | throughput |
|---:|---:|---:|---:|---:|---:|---:|
| 12 | 228,887 | 261,655 | 133,135 | 245,772 | 319.83 KiB | 770.04 KiB/s |
| 24 | 382,927 | 448,463 | 266,271 | 442,380 | 338.14 KiB | 711.70 KiB/s |
| 44 | 688,871 | 819,943 | 493,631 | 770,060 | 361.56 KiB | 1,102.26 KiB/s |
| 46 | 689,939 | 821,011 | 513,087 | 802,828 | 363.20 KiB | **1,150.06 KiB/s** |

</div>

<div class="impl compact">
Implementation: <a href="https://github.com/frisitano/leanMultisig/blob/feat/construction-4-column-commitments/crates/lean-da/zkdsl_implem/lean_da_column_commit.py">lean_da_column_commit.py</a><br/>
Run: <code>cargo run --release -p lean-da -- --construction column-commit --n-blobs 46 --tracing</code>
</div>

</div>

</div>
