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
  ink: "#1e1e1e",
  prover: "#1565c0",
  proverFill: "#e3f2fd",
  proverNode: "#bbdefb",
  verifier: "#2e7d32",
  verifierFill: "#e8f5e9",
  verifierNode: "#c8e6c9",
  gossip: "#ef6c00",
  gossipFill: "#fff8e1",
  white: "#ffffff",
};

const handFont = '"Virgil", "Comic Sans MS", "Bradley Hand", "Segoe Print", cursive';

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

function tspans(lines, x, y, size, lineHeight = 1.18, anchor = "start") {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${fmt(y + i * size * lineHeight)}" text-anchor="${anchor}">${esc(line)}</tspan>`)
    .join("");
}

function text({ lines, x, y, size = 28, color = colors.ink, anchor = "start", weight = 700, lineHeight = 1.18 }) {
  return `<text class="hand" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans(lines, x, y, size, lineHeight, anchor)}</text>`;
}

function rect({ x, y, w, h, fill, stroke = colors.ink, strokeWidth = 4, dash = false, radius = 0 }) {
  const dashAttr = dash ? ' stroke-dasharray="14 12"' : "";
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"${dashAttr}/>`;
}

function ellipse({ x, y, w, h, fill, stroke = colors.gossip, strokeWidth = 4 }) {
  return `<ellipse cx="${x + w / 2}" cy="${y + h / 2}" rx="${w / 2}" ry="${h / 2}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function line(x1, y1, x2, y2, color, width = 4) {
  return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function arrowHead(x1, y1, x2, y2, color, width = 4, headLen = 28, headHalf = 11) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const bx = x2 - ux * headLen;
  const by = y2 - uy * headLen;
  return [
    line(bx + px * headHalf, by + py * headHalf, x2, y2, color, width),
    line(bx - px * headHalf, by - py * headHalf, x2, y2, color, width),
  ].join("\n");
}

function arrow({ x1, y1, x2, y2, color, width = 4 }) {
  return `<g>
  ${line(x1, y1, x2, y2, color, width)}
  ${arrowHead(x1, y1, x2, y2, color, width)}
</g>`;
}

function curveArrow({ x1, y1, cx, cy, x2, y2, color, width = 4 }) {
  const tx1 = x2 - cx;
  const ty1 = y2 - cy;
  return `<g>
  <path d="M ${fmt(x1)} ${fmt(y1)} Q ${fmt(cx)} ${fmt(cy)} ${fmt(x2)} ${fmt(y2)}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>
  ${arrowHead(x2 - tx1, y2 - ty1, x2, y2, color, width)}
</g>`;
}

function nodeBox({ x, y, w, h, fill, lines, size = 32 }) {
  return [
    rect({ x, y, w, h, fill, stroke: colors.ink, strokeWidth: 4 }),
    text({
      lines,
      x: x + w / 2,
      y: y + (lines.length === 1 ? h / 2 + size * 0.35 : h / 2 - size * 0.1),
      size,
      anchor: "middle",
      lineHeight: 1.1,
      weight: 700,
    }),
  ].join("\n");
}

function svg() {
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1040" width="1600" height="1040" class="excalidraw-svg" role="img">
  <style>
    .hand { font-family: ${handFont}; }
  </style>
  <rect width="1600" height="1040" fill="${colors.white}"/>`);

  parts.push(text({ lines: ["EIP-8025 - Execution Proof Flow"], x: 800, y: 48, size: 30, anchor: "middle", weight: 700 }));

  parts.push(rect({ x: 40, y: 82, w: 590, h: 880, fill: colors.proverFill, stroke: colors.prover, strokeWidth: 3.5, dash: true }));
  parts.push(text({ lines: ["Proof-generating node (opt-in)"], x: 72, y: 128, size: 28, weight: 700 }));

  parts.push(rect({ x: 970, y: 82, w: 590, h: 880, fill: colors.verifierFill, stroke: colors.verifier, strokeWidth: 3.5, dash: true }));
  parts.push(text({ lines: ["Proof-verifying node (opt-in)"], x: 1002, y: 128, size: 28, weight: 700 }));

  parts.push(nodeBox({ x: 92, y: 174, w: 486, h: 126, fill: colors.proverNode, lines: ["Beacon Node (prover)", "active validator"], size: 32 }));
  parts.push(nodeBox({ x: 92, y: 444, w: 486, h: 126, fill: colors.proverNode, lines: ["ProofEngine", "request_proofs"], size: 32 }));
  parts.push(nodeBox({ x: 92, y: 714, w: 486, h: 126, fill: colors.proverNode, lines: ["Proof Node", "(runs guest, produces proof)"], size: 29 }));

  parts.push(nodeBox({ x: 1022, y: 174, w: 486, h: 126, fill: colors.verifierNode, lines: ["Beacon Node (verifier)", "stateless verification"], size: 32 }));
  parts.push(nodeBox({ x: 1022, y: 444, w: 486, h: 126, fill: colors.verifierNode, lines: ["ProofEngine", "verify_execution_proof"], size: 32 }));
  parts.push(nodeBox({ x: 1022, y: 714, w: 486, h: 126, fill: colors.verifierNode, lines: ["Proof Node", "(verifies ExecutionProof)"], size: 31 }));

  parts.push(ellipse({ x: 638, y: 418, w: 324, h: 190, fill: colors.gossipFill }));
  parts.push(text({
    lines: ["CL p2p", "execution_proof topic", "SignedExecutionProof"],
    x: 800,
    y: 480,
    size: 25,
    color: colors.gossip,
    anchor: "middle",
    lineHeight: 1.05,
  }));

  parts.push(arrow({ x1: 300, y1: 300, x2: 300, y2: 444, color: colors.prover }));
  parts.push(text({ lines: ["1. request"], x: 246, y: 372, size: 27, color: colors.prover, anchor: "end" }));
  parts.push(arrow({ x1: 300, y1: 570, x2: 300, y2: 714, color: colors.prover }));
  parts.push(text({ lines: ["2. generate"], x: 246, y: 642, size: 27, color: colors.prover, anchor: "end" }));

  parts.push(arrow({ x1: 410, y1: 714, x2: 410, y2: 570, color: colors.prover }));
  parts.push(text({ lines: ["3. ready"], x: 464, y: 642, size: 27, color: colors.prover, anchor: "start" }));
  parts.push(arrow({ x1: 410, y1: 444, x2: 410, y2: 300, color: colors.prover }));
  parts.push(text({ lines: ["4. proof"], x: 464, y: 372, size: 27, color: colors.prover, anchor: "start" }));

  parts.push(curveArrow({ x1: 578, y1: 292, cx: 622, cy: 382, x2: 638, y2: 466, color: colors.gossip }));
  parts.push(text({ lines: ["5"], x: 610, y: 352, size: 31, color: colors.gossip }));
  parts.push(curveArrow({ x1: 962, y1: 466, cx: 978, cy: 378, x2: 1022, y2: 292, color: colors.gossip }));
  parts.push(text({ lines: ["6"], x: 972, y: 352, size: 31, color: colors.gossip }));

  parts.push(arrow({ x1: 1242, y1: 300, x2: 1242, y2: 444, color: colors.verifier }));
  parts.push(text({ lines: ["7. check proof"], x: 1188, y: 372, size: 26, color: colors.verifier, anchor: "end" }));
  parts.push(arrow({ x1: 1242, y1: 570, x2: 1242, y2: 714, color: colors.verifier }));
  parts.push(text({ lines: ["8. verify"], x: 1188, y: 642, size: 27, color: colors.verifier, anchor: "end" }));

  parts.push(arrow({ x1: 1308, y1: 714, x2: 1308, y2: 570, color: colors.verifier }));
  parts.push(text({ lines: ["9. valid/invalid"], x: 1362, y: 642, size: 27, color: colors.verifier, anchor: "start" }));
  parts.push(arrow({ x1: 1308, y1: 444, x2: 1308, y2: 300, color: colors.verifier }));
  parts.push(text({ lines: ["10. result"], x: 1362, y: 372, size: 27, color: colors.verifier, anchor: "start" }));

  parts.push("</svg>\n");
  return parts.join("\n");
}

function excalidrawMarkdown() {
  const drawing = {
    type: "excalidraw",
    version: 2,
    source: "generated",
    elements: [],
    appState: { gridSize: null, viewBackgroundColor: colors.white },
    files: {},
  };
  return `---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

# Drawing

\`\`\`json
${JSON.stringify(drawing)}
\`\`\`
`;
}

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(diagramsDir, { recursive: true });
fs.writeFileSync(path.join(sourceDir, "eip8025-proof-flow.svg"), svg());
fs.writeFileSync(path.join(diagramsDir, "eip8025-proof-flow.excalidraw.md"), excalidrawMarkdown());
console.log("Wrote enlarged proof-flow SVG and Excalidraw source.");
