import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(scriptDir, "..");
const runningFromTaskSource = path.basename(deckDir) === "source";
const root = runningFromTaskSource ? path.resolve(scriptDir, "../..") : deckDir;
const sourceDir = runningFromTaskSource ? deckDir : path.join(root, "assets");
const diagramsDir = path.join(root, "source-diagrams");

const colors = {
  ink: "#0f172a",
  slate: "#475569",
  line: "#cbd5e1",
  border: "#dbe4ee",
  teal: "#0f766e",
  teal2: "#14b8a6",
  tealLight: "#ecfeff",
  orange: "#f97316",
  orangeDark: "#ea580c",
  orangeLight: "#fff7ed",
  blue: "#2563eb",
  blueLight: "#eff6ff",
  purple: "#7c3aed",
  purpleLight: "#f5f3ff",
  white: "#ffffff",
  bg: "#f8fafc",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function fmt(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function tspans(lines, x, y, size, lineHeight = 1.22, anchor = "start") {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${y + i * size * lineHeight}" text-anchor="${anchor}">${esc(line)}</tspan>`)
    .join("");
}

function svgText({ lines, x, y, size = 24, weight = 700, color = colors.ink, lineHeight = 1.22, anchor = "start", family }) {
  const font = family ?? "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif";
  return `<text font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${color}" xml:space="preserve">${tspans(lines, x, y, size, lineHeight, anchor)}</text>`;
}

function svgBox({
  x,
  y,
  w,
  h,
  fill = colors.white,
  stroke = colors.line,
  strokeWidth = 3,
  radius = 22,
  shadow = false,
}) {
  const shadowEl = shadow
    ? `<rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" rx="${radius}" fill="#0f172a" opacity="0.08"/>`
    : "";
  return `${shadowEl}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function strokeLine(x1, y1, x2, y2, color = colors.orange, width = 4) {
  return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function svgArrow({ x1, y1, x2, y2, color = colors.orange }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const headLen = 24;
  const headHalf = 8.5;
  const bx = x2 - ux * headLen;
  const by = y2 - uy * headLen;
  return `<g stroke-linecap="round">
  ${strokeLine(x1, y1, x2, y2, color)}
  ${strokeLine(bx + px * headHalf, by + py * headHalf, x2, y2, color)}
  ${strokeLine(bx - px * headHalf, by - py * headHalf, x2, y2, color)}
</g>`;
}

function pill({ x, y, w, label, fill, stroke, color }) {
  return [
    svgBox({ x, y, w, h: 44, fill, stroke, strokeWidth: 2.5, radius: 14 }),
    svgText({ lines: [label], x: x + 16, y: y + 29, size: 17, weight: 850, color }),
  ].join("");
}

function insightCard({ x, y, w, title, lines }) {
  return [
    svgBox({ x, y, w, h: 130, fill: "#ffffff", stroke: colors.line, strokeWidth: 2.5, radius: 18 }),
    svgText({ lines: [title], x: x + 20, y: y + 38, size: 23, weight: 930, color: colors.ink }),
    svgText({ lines, x: x + 20, y: y + 76, size: 19, weight: 760, color: colors.slate, lineHeight: 1.17 }),
  ].join("\n");
}

function codeLineText(line, x, y, size) {
  const trimmed = line.trim();
  const family = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace";
  if (trimmed.startsWith("#") || trimmed === "...") {
    return svgText({ lines: [line], x, y, size, weight: 740, color: colors.slate, family });
  }

  const keywordWeight = /^\s*(def|assert|return|if|else|for|while|with)\b/.test(line) ? 930 : 780;
  return svgText({ lines: [line], x, y, size, weight: keywordWeight, color: colors.ink, family });
}

function codeBlock({
  x,
  y,
  w,
  h,
  lines,
  highlights = [],
  chip,
  chipColor,
  firstLineNumber = 1,
  lineStep = 38,
  codeSize = 24,
  lineNumberSize = 22,
}) {
  const firstY = y + 54;
  const parts = [
    svgBox({ x, y, w, h, fill: "#ffffff", stroke: colors.line, strokeWidth: 2.5, radius: 16 }),
    svgBox({ x: x + 1, y: y + 1, w: 68, h: h - 2, fill: "#f1f5f9", stroke: "transparent", strokeWidth: 0, radius: 15 }),
  ];
  for (const index of highlights) {
    parts.push(svgBox({
      x: x + 82,
      y: firstY - 31 + index * lineStep,
      w: w - 112,
      h: 44,
      fill: "#e5e7eb",
      stroke: "transparent",
      strokeWidth: 0,
      radius: 7,
    }));
  }
  if (chip) {
    const chipW = chip.length * 9.5 + 34;
    parts.push(svgBox({
      x: x + w - chipW - 18,
      y: y + 14,
      w: chipW,
      h: 36,
      fill: "#ffffff",
      stroke: chipColor,
      strokeWidth: 2,
      radius: 12,
    }));
    parts.push(svgText({ lines: [chip], x: x + w - chipW + 1, y: y + 38, size: 15, weight: 900, color: chipColor }));
  }
  lines.forEach((line, index) => {
    const yy = firstY + index * lineStep;
    parts.push(svgText({
      lines: [String(firstLineNumber + index).padStart(2, " ")],
      x: x + 19,
      y: yy,
      size: lineNumberSize,
      weight: 760,
      color: "#94a3b8",
      family: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace",
    }));
    parts.push(codeLineText(line, x + 92, yy, codeSize));
  });
  return parts.join("\n");
}

function methodPanel({ x, y, w, h, title, subtitle, color, fill, code, highlights, chip, firstLineNumber = 1 }) {
  const parts = [
    svgBox({ x, y, w, h, fill, stroke: color, strokeWidth: 3, radius: 24, shadow: true }),
    svgText({ lines: [title], x: x + 24, y: y + 40, size: 26, weight: 930, color }),
    svgText({ lines: [subtitle], x: x + 24, y: y + 69, size: 17, weight: 780, color: colors.slate }),
    codeBlock({
      x: x + 24,
      y: y + 80,
      w: w - 48,
      h: h - 104,
      lines: code,
      highlights,
      chip,
      chipColor: color,
      firstLineNumber,
    }),
  ];
  return parts.join("\n");
}

function consensusHooksSvg() {
  const parts = [];
  parts.push(codeBlock({
    x: 60,
    y: 40,
    w: 1480,
    h: 960,
    lines: [
      "def process_execution_proof(",
      "    state: BeaconState,",
      "    signed_proof: SignedExecutionProof,",
      "    proof_engine: ProofEngine,",
      ") -> None:",
      "    proof_message = signed_proof.message",
      "",
      "    # Verify prover is an active validator",
      "    validator = state.validators[signed_proof.validator_index]",
      "    assert is_active_validator(validator, get_current_epoch(state))",
      "",
      "    # Verify execution proof signature",
      "    domain = get_domain(state, DOMAIN_EXECUTION_PROOF, compute_epoch_at_slot(state.slot))",
      "    signing_root = compute_signing_root(proof_message, domain)",
      "    assert bls.Verify(validator.pubkey, signing_root, signed_proof.signature)",
      "",
      "    # Verify the execution proof",
      "    assert proof_engine.verify_execution_proof(proof_message)",
    ],
    highlights: [],
    lineStep: 49,
    codeSize: 25,
    lineNumberSize: 22,
  }));

  return `<svg xmlns="http://www.w3.org/2000/svg" class="excalidraw-svg" viewBox="0 0 1600 1040" width="1600" height="1040" role="img">
  <rect width="1600" height="1040" fill="${colors.bg}"/>
  ${parts.join("\n")}
</svg>
`;
}

let idCounter = 0;

function nextId(prefix) {
  idCounter += 1;
  return `${prefix}${idCounter.toString(36).padStart(8, "0")}`;
}

function exBase(type, x, y, width, height, strokeColor, backgroundColor) {
  return {
    id: nextId(type.slice(0, 3)),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor,
    backgroundColor,
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: type === "text" ? null : { type: 3 },
    seed: 300000 + idCounter,
    version: 1,
    versionNonce: 400000 + idCounter,
    isDeleted: false,
    boundElements: null,
    updated: 1710000000000 + idCounter,
    link: null,
    locked: false,
  };
}

function exText(x, y, text, fontSize, color, width) {
  return {
    ...exBase("text", x, y, width, text.split("\n").length * fontSize * 1.25, color, "transparent"),
    fontSize,
    fontFamily: 1,
    text,
    rawText: text,
    originalText: text,
    textAlign: "left",
    verticalAlign: "top",
    baseline: Math.round(text.split("\n").length * fontSize * 1.08),
    lineHeight: 1.25,
  };
}

function exRect(x, y, width, height, strokeColor = colors.line, backgroundColor = colors.white) {
  return exBase("rectangle", x, y, width, height, strokeColor, backgroundColor);
}

function exArrow(x1, y1, x2, y2) {
  const element = exBase("arrow", x1, y1, x2 - x1, y2 - y1, colors.orange, "transparent");
  element.strokeWidth = 4;
  element.points = [[0, 0], [x2 - x1, y2 - y1]];
  element.lastCommittedPoint = null;
  element.startBinding = null;
  element.endBinding = null;
  element.startArrowhead = null;
  element.endArrowhead = "arrow";
  return element;
}

function consensusElements() {
  idCounter = 0;
  return [
    exRect(60, 40, 1480, 960, colors.ink, colors.white),
    exText(84, 94, [
      "def process_execution_proof(",
      "    state: BeaconState,",
      "    signed_proof: SignedExecutionProof,",
      "    proof_engine: ProofEngine,",
      ") -> None:",
      "    proof_message = signed_proof.message",
      "",
      "    # Verify prover is an active validator",
      "    validator = state.validators[signed_proof.validator_index]",
      "    assert is_active_validator(validator, get_current_epoch(state))",
      "",
      "    # Verify execution proof signature",
      "    domain = get_domain(state, DOMAIN_EXECUTION_PROOF, compute_epoch_at_slot(state.slot))",
      "    signing_root = compute_signing_root(proof_message, domain)",
      "    assert bls.Verify(validator.pubkey, signing_root, signed_proof.signature)",
      "",
      "    # Verify the execution proof",
      "    assert proof_engine.verify_execution_proof(proof_message)",
    ].join("\n"), 19, colors.ink, 1360),
  ];
}

function excalidrawMarkdown(elements) {
  const drawing = {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: colors.bg,
    },
    files: {},
  };
  return `---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

# Text Elements

Consensus specs modifications ^tex00000001

# Drawing

\`\`\`json
${JSON.stringify(drawing)}
\`\`\`
`;
}

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(diagramsDir, { recursive: true });
fs.writeFileSync(path.join(sourceDir, "eip8025-consensus-hooks.svg"), consensusHooksSvg());
fs.writeFileSync(path.join(diagramsDir, "eip8025-consensus-hooks.excalidraw.md"), excalidrawMarkdown(consensusElements()));
console.log("Wrote consensus hooks SVG and Excalidraw source.");
