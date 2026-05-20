import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(scriptDir, "..");
const runningFromTaskSource = path.basename(deckDir) === "source";
const root = runningFromTaskSource ? path.resolve(scriptDir, "../..") : deckDir;
const sourceDir = runningFromTaskSource ? deckDir : path.join(root, "assets");
const diagramsDir = path.join(root, "source-diagrams");

const c = {
  ink: "#0f172a",
  slate: "#475569",
  line: "#cbd5e1",
  border: "#dbe4ee",
  teal: "#0f172a",
  tealLight: "#f1f5f9",
  orange: "#0f172a",
  orangeLight: "#f1f5f9",
  blue: "#0f172a",
  blueLight: "#f1f5f9",
  dark: "#0f172a",
  white: "#ffffff",
  panel: "#f8fafc",
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

function tspans(lines, x, y, size, lineHeight = 1.18, anchor = "start") {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${fmt(y + i * size * lineHeight)}" text-anchor="${anchor}">${esc(line)}</tspan>`)
    .join("");
}

function text({ lines, x, y, size = 24, color = c.ink, weight = 700, anchor = "start", lineHeight = 1.18 }) {
  return `<text font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans(lines, x, y, size, lineHeight, anchor)}</text>`;
}

function box({ x, y, w, h, fill = c.white, stroke = c.line, strokeWidth = 3, radius = 18, shadow = false }) {
  const shadowEl = shadow
    ? `<rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" rx="${radius}" fill="#0f172a" opacity="0.08"/>`
    : "";
  return `${shadowEl}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function line(x1, y1, x2, y2, color, width = 4) {
  return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function arrow({ x1, y1, x2, y2, color = c.orange, width = 4 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const headLen = 24;
  const headHalf = 8.5;
  const bx = x2 - ux * headLen;
  const by = y2 - uy * headLen;
  return `<g>
  ${line(x1, y1, x2, y2, color, width)}
  ${line(bx + px * headHalf, by + py * headHalf, x2, y2, color, width)}
  ${line(bx - px * headHalf, by - py * headHalf, x2, y2, color, width)}
</g>`;
}

function table({ x, y, w, h, title, color, rows, rowH = 74, titleSize = 34, rowSize = 27 }) {
  const headerH = 76;
  const parts = [
    box({ x, y, w, h, fill: c.white, stroke: c.line, strokeWidth: 3, radius: 18, shadow: true }),
    `<rect x="${x}" y="${y}" width="${w}" height="${headerH}" rx="18" fill="${color}"/>`,
    `<rect x="${x}" y="${y + 36}" width="${w}" height="${headerH - 36}" fill="${color}"/>`,
    text({ lines: [title], x: x + w / 2, y: y + 50, size: titleSize, weight: 900, color: c.white, anchor: "middle" }),
  ];
  rows.forEach((row, i) => {
    const ry = y + headerH + i * rowH;
    const rowLines = Array.isArray(row) ? row : [row];
    if (i > 0) parts.push(`<line x1="${x}" y1="${ry}" x2="${x + w}" y2="${ry}" stroke="${c.line}" stroke-width="2"/>`);
    parts.push(text({
      lines: rowLines,
      x: x + 22,
      y: ry + (rowLines.length > 1 ? 42 : 54),
      size: rowSize,
      weight: 760,
      color: c.ink,
      lineHeight: 1.1,
    }));
  });
  return parts.join("\n");
}

function compactCard({ x, y, w, title, rows, color }) {
  const h = 180;
  const parts = [
    box({ x, y, w, h, fill: c.white, stroke: c.line, strokeWidth: 3, radius: 18, shadow: true }),
    `<rect x="${x}" y="${y}" width="${w}" height="62" rx="18" fill="${color}"/>`,
    `<rect x="${x}" y="${y + 32}" width="${w}" height="30" fill="${color}"/>`,
    text({ lines: [title], x: x + w / 2, y: y + 42, size: 30, weight: 900, color: c.white, anchor: "middle" }),
  ];
  rows.forEach((row, i) => {
    parts.push(text({ lines: [row], x: x + 22, y: y + 102 + i * 44, size: 25, weight: 760, color: c.ink }));
  });
  return parts.join("\n");
}

function methodBlock({ x, y, w, method, detail = [], methodSize = 30, detailSize = 26, dividerY = null }) {
  const detailLines = Array.isArray(detail) ? detail : [detail];
  const parts = [
    text({ lines: [method], x, y, size: methodSize, weight: 900, color: c.ink, lineHeight: 1.08 }),
  ];
  if (detailLines.length > 0) {
    parts.push(text({ lines: detailLines, x, y: y + 40, size: detailSize, weight: 740, color: c.slate, lineHeight: 1.08 }));
  }
  if (dividerY !== null) {
    parts.push(`<line x1="${x}" y1="${dividerY}" x2="${x + w}" y2="${dividerY}" stroke="${c.line}" stroke-width="2"/>`);
  }
  return parts.join("\n");
}

function laneBox({ x, y, w, h, title }) {
  return `${box({ x, y, w, h, fill: c.panel, stroke: c.line, strokeWidth: 3, radius: 22, shadow: true })}
${text({ lines: [title], x: x + 30, y: y + 50, size: 34, weight: 900, color: c.ink })}`;
}

function componentCard({ x, y, w, h, title, body }) {
  return `${box({ x, y, w, h, fill: c.white, stroke: c.line, strokeWidth: 3, radius: 16 })}
<rect x="${x}" y="${y}" width="${w}" height="66" rx="16" fill="${c.dark}"/>
<rect x="${x}" y="${y + 36}" width="${w}" height="30" fill="${c.dark}"/>
${text({ lines: [title], x: x + w / 2, y: y + 45, size: 29, weight: 900, color: c.white, anchor: "middle" })}
${body}`;
}

function svg() {
  const parts = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1040" width="1600" height="1040" class="excalidraw-svg" role="img">
  <rect width="1600" height="1040" fill="${c.white}"/>`);

  const left = { x: 74, w: 420 };
  const middle = { x: 560, w: 430 };
  const right = { x: 1080, w: 466 };
  const cardH = 304;

  parts.push(laneBox({ x: 44, y: 44, w: 1512, h: 456, title: "Generation path" }));
  parts.push(componentCard({
    x: left.x,
    y: 140,
    w: left.w,
    h: cardH,
    title: "Beacon node",
    body: text({ lines: ["new payload", "forkchoice update", "proof request"], x: left.x + 34, y: 244, size: 34, weight: 780, lineHeight: 1.26 }),
  }));
  parts.push(componentCard({
    x: middle.x,
    y: 140,
    w: middle.w,
    h: cardH,
    title: "ProofEngine",
    body: [
      methodBlock({ x: middle.x + 30, y: 232, w: middle.w - 60, method: "notify_new_payload", detail: ["notify_forkchoice_updated"], methodSize: 28, detailSize: 25, dividerY: 328 }),
      methodBlock({ x: middle.x + 30, y: 362, w: middle.w - 60, method: "request_proofs", detail: ["NewPayloadRequest +", "ProofAttributes -> Root"], methodSize: 28, detailSize: 25 }),
    ].join("\n"),
  }));
  parts.push(componentCard({
    x: right.x,
    y: 140,
    w: right.w,
    h: cardH,
    title: "Proof node client",
    body: [
      methodBlock({ x: right.x + 32, y: 232, w: right.w - 64, method: "request_proofs", detail: ["SszBody +", "ProofAttributes -> Hash256"], methodSize: 30, detailSize: 26, dividerY: 328 }),
      methodBlock({ x: right.x + 32, y: 362, w: right.w - 64, method: "subscribe_proof_events", detail: ["FilterRoot ->", "Stream<ProofEvent>"], methodSize: 27, detailSize: 26 }),
    ].join("\n"),
  }));
  parts.push(arrow({ x1: 494, y1: 292, x2: 560, y2: 292, color: c.dark, width: 4 }));
  parts.push(arrow({ x1: 990, y1: 292, x2: 1080, y2: 292, color: c.dark, width: 4 }));

  parts.push(laneBox({ x: 44, y: 540, w: 1512, h: 456, title: "Verification path" }));
  parts.push(componentCard({
    x: left.x,
    y: 636,
    w: left.w,
    h: cardH,
    title: "Beacon node",
    body: text({ lines: ["incoming proof", "gossip validation", "proof sync backfill"], x: left.x + 34, y: 740, size: 34, weight: 780, lineHeight: 1.26 }),
  }));
  parts.push(componentCard({
    x: middle.x,
    y: 636,
    w: middle.w,
    h: cardH,
    title: "ProofEngine",
    body: [
      methodBlock({ x: middle.x + 30, y: 728, w: middle.w - 60, method: "verify_execution_proof", detail: ["ExecutionProof -> bool"], methodSize: 27, detailSize: 25, dividerY: 824 }),
      text({ lines: ["tracks verified proofs", "keeps CL proof-system", "agnostic"], x: middle.x + 30, y: 860, size: 26, weight: 760, color: c.slate, lineHeight: 1.08 }),
    ].join("\n"),
  }));
  parts.push(componentCard({
    x: right.x,
    y: 636,
    w: right.w,
    h: cardH,
    title: "Proof node client",
    body: [
      methodBlock({ x: right.x + 32, y: 728, w: right.w - 64, method: "verify_proof", detail: ["Root + ProofType +", "ProofData -> ProofStatus"], methodSize: 30, detailSize: 26, dividerY: 824 }),
      methodBlock({ x: right.x + 32, y: 858, w: right.w - 64, method: "get_proof", detail: ["Root + ProofType", "-> Bytes"], methodSize: 30, detailSize: 26 }),
    ].join("\n"),
  }));
  parts.push(arrow({ x1: 494, y1: 788, x2: 560, y2: 788, color: c.dark, width: 4 }));
  parts.push(arrow({ x1: 990, y1: 788, x2: 1080, y2: 788, color: c.dark, width: 4 }));

  parts.push("</svg>\n");
  return parts.join("\n");
}

let eid = 0;
const textEntries = [];

function nextId(prefix) {
  eid += 1;
  return `${prefix}${eid.toString(36).padStart(8, "0")}`;
}

function exCommon(type, x, y, width, height) {
  return {
    id: nextId(type.slice(0, 3)),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: c.ink,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: type === "rectangle" ? { type: 3 } : null,
    seed: 500000 + eid,
    version: 1,
    versionNonce: 600000 + eid,
    isDeleted: false,
    boundElements: null,
    updated: 1710000000000 + eid,
    link: null,
    locked: false,
  };
}

function exText(x, y, value, size = 24, color = c.ink, width = 320) {
  const lines = value.split("\n");
  const el = exCommon("text", x, y, width, lines.length * size * 1.25);
  el.strokeColor = color;
  el.fontSize = size;
  el.fontFamily = 1;
  el.text = value;
  el.rawText = value;
  el.originalText = value;
  el.textAlign = "left";
  el.verticalAlign = "top";
  el.baseline = Math.round(lines.length * size * 1.08);
  el.containerId = null;
  el.lineHeight = 1.25;
  textEntries.push(`${value.replaceAll("\n", " ")} ^${el.id}`);
  return el;
}

function exRect(x, y, width, height, fill = c.white, stroke = c.line) {
  const el = exCommon("rectangle", x, y, width, height);
  el.backgroundColor = fill;
  el.strokeColor = stroke;
  return el;
}

function exArrow(x1, y1, x2, y2, color = c.orange) {
  const el = exCommon("arrow", x1, y1, x2 - x1, y2 - y1);
  el.strokeColor = color;
  el.strokeWidth = 4;
  el.points = [[0, 0], [x2 - x1, y2 - y1]];
  el.startBinding = null;
  el.endBinding = null;
  el.startArrowhead = null;
  el.endArrowhead = "arrow";
  return el;
}

const elements = [
  exRect(44, 44, 1512, 456, c.panel, c.line),
  exText(74, 84, "Generation path", 34, c.ink, 420),
  exRect(74, 140, 420, 304),
  exText(108, 176, "Beacon node\nnew payload\nforkchoice update\nproof request", 32, c.ink, 340),
  exRect(560, 140, 430, 304),
  exText(590, 176, "ProofEngine\nnotify_new_payload\nnotify_forkchoice_updated\nrequest_proofs\nNewPayloadRequest + ProofAttributes -> Root", 26, c.ink, 370),
  exRect(1080, 140, 466, 304),
  exText(1112, 176, "Proof node client\nrequest_proofs\nSszBody + ProofAttributes -> Hash256\nsubscribe_proof_events\nFilterRoot -> Stream<ProofEvent>", 26, c.ink, 402),
  exArrow(494, 292, 560, 292, c.dark),
  exArrow(990, 292, 1080, 292, c.dark),
  exRect(44, 540, 1512, 456, c.panel, c.line),
  exText(74, 580, "Verification path", 34, c.ink, 420),
  exRect(74, 636, 420, 304),
  exText(108, 672, "Beacon node\nincoming proof\ngossip validation\nproof sync backfill", 32, c.ink, 340),
  exRect(560, 636, 430, 304),
  exText(590, 672, "ProofEngine\nverify_execution_proof\nExecutionProof -> bool\ntracks verified proofs\nkeeps CL proof-system agnostic", 26, c.ink, 370),
  exRect(1080, 636, 466, 304),
  exText(1112, 672, "Proof node client\nverify_proof\nRoot + ProofType + ProofData -> ProofStatus\nget_proof\nRoot + ProofType -> Bytes", 26, c.ink, 402),
  exArrow(494, 788, 560, 788, c.dark),
  exArrow(990, 788, 1080, 788, c.dark),
];

function excalidrawMarkdown() {
  const drawing = {
    type: "excalidraw",
    version: 2,
    source: "https://excalidraw.com",
    elements,
    appState: {
      gridSize: null,
      viewBackgroundColor: c.white,
    },
    files: {},
  };
  return `---

excalidraw-plugin: parsed
tags: [excalidraw]

---
==⚠  Switch to EXCALIDRAW VIEW in the MORE OPTIONS menu of this document. ⚠==

# Excalidraw Data

## Text Elements
${textEntries.join("\n\n")}


%%
## Drawing
\`\`\`json
${JSON.stringify(drawing)}
\`\`\`
%%
`;
}

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(diagramsDir, { recursive: true });
fs.writeFileSync(path.join(sourceDir, "eip8025-proofengine-boundary.svg"), svg());
fs.writeFileSync(path.join(diagramsDir, "eip8025-proofengine-boundary.excalidraw.md"), excalidrawMarkdown());
console.log("Wrote readable ProofEngine boundary SVG and Excalidraw source.");
