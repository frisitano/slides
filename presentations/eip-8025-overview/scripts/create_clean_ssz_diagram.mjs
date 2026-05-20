import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const deckDir = path.resolve(scriptDir, "..");
const runningFromTaskSource = path.basename(deckDir) === "source";
const root = runningFromTaskSource ? path.resolve(scriptDir, "../..") : deckDir;
const sourceDir = runningFromTaskSource ? deckDir : path.join(root, "assets");
const diagramsDir = path.join(root, "source-diagrams");
const svgPath = path.join(sourceDir, "eip8025-ssz-data-model.svg");
const excalidrawPath = path.join(diagramsDir, "eip8025-ssz-data-model.excalidraw.md");
const viewW = 1590;
const viewH = 1120;

const c = {
  ink: "#0f172a",
  slate: "#475569",
  line: "#cbd5e1",
  teal: "#0f172a",
  orange: "#0f172a",
  orangeLight: "#f1f5f9",
  blueDark: "#0f172a",
  white: "#ffffff",
  bg: "#ffffff",
  panel: "#f8fafc",
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function t(lines, x, y, size, fill = c.ink, weight = 700, anchor = "start", lh = 1.2) {
  const spans = lines
    .map((line, i) => `<tspan x="${x}" y="${y + i * size * lh}" text-anchor="${anchor}">${esc(line)}</tspan>`)
    .join("");
  return `<text font-family="Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${spans}</text>`;
}

function box(x, y, w, h, fill = c.white, stroke = c.line, sw = 3, r = 18) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
}

function fmt(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
}

function strokeLine(x1, y1, x2, y2, color = c.orange, width = 4) {
  return `<line x1="${fmt(x1)}" y1="${fmt(y1)}" x2="${fmt(x2)}" y2="${fmt(y2)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
}

function arrow(x1, y1, x2, y2, color = c.orange) {
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

function splitField(field) {
  const index = field.indexOf(":");
  if (index === -1) return { name: field.trim(), type: null };
  return {
    name: field.slice(0, index).trim(),
    type: field.slice(index + 1).trim(),
  };
}

function entity({ x, y, w, title, color, fields, rowH = 66, headerH = 66, titleSize = 33, fieldSize = 24, typeSize = 20 }) {
  const h = headerH + fields.length * rowH;
  const parts = [
    box(x, y, w, h, c.white, c.line, 3, 16),
    `<rect x="${x}" y="${y}" width="${w}" height="${headerH}" rx="16" fill="${color}"/>`,
    `<rect x="${x}" y="${y + 34}" width="${w}" height="${headerH - 34}" fill="${color}"/>`,
    t([title], x + w / 2, y + 44, titleSize, c.white, 850, "middle"),
  ];
  fields.forEach((field, i) => {
    const fy = y + headerH + i * rowH;
    const parsed = splitField(field);
    if (i > 0) parts.push(`<line x1="${x}" y1="${fy}" x2="${x + w}" y2="${fy}" stroke="${c.line}" stroke-width="2"/>`);
    if (parsed.type) {
      parts.push(t([parsed.name], x + 20, fy + 29, fieldSize, c.ink, 820));
      parts.push(t([parsed.type], x + 20, fy + 55, typeSize, c.slate, 720, "start", 1.1));
    } else {
      parts.push(t([parsed.name], x + 20, fy + rowH / 2 + fieldSize * 0.34, fieldSize, c.ink, 760));
    }
  });
  return { h, svg: parts.join("\n") };
}

const newPayload = entity({
  x: 1030,
  y: 165,
  w: 500,
  title: "NewPayloadRequest",
  color: c.teal,
  rowH: 62,
  fields: [
    "ExecutionPayload: ExecutionPayload",
    "VersionedHashes: Sequence[VersionedHash]",
    "ParentBeaconBlockRoot: Root",
    "ExecutionRequests: ExecutionRequests",
  ],
});

const publicInput = entity({
  x: 60,
  y: 165,
  w: 500,
  title: "PublicInput",
  color: c.orange,
  fields: [
    "NewPayloadRequestRoot: Root",
    "SuccessfulValidation: bool",
    "ChainConfig: ChainConfig",
  ],
});

const signedProof = entity({
  x: 60,
  y: 835,
  w: 500,
  title: "SignedExecutionProof",
  color: c.blueDark,
  fields: [
    "Message: ExecutionProof",
    "ValidatorIndex: ValidatorIndex",
    "Signature: BLSSignature",
  ],
});

const executionProof = entity({
  x: 60,
  y: 520,
  w: 500,
  title: "ExecutionProof",
  color: c.teal,
  fields: [
    "ProofData: ByteList[MAX_PROOF_SIZE]",
    "ProofType: ProofType",
    "PublicInput: PublicInput",
  ],
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewW} ${viewH}" width="${viewW}" height="${viewH}" class="excalidraw-svg">
  <rect x="0" y="0" width="${viewW}" height="${viewH}" fill="${c.bg}"/>
  ${t(["SSZ envelope and payload binding"], 44, 66, 42, c.ink, 850)}
  ${t(["PublicInput carries the request root. ExecutionProof carries PublicInput. SignedExecutionProof carries the signature."], 44, 112, 27, c.slate, 650)}

  ${publicInput.svg}
  ${box(650, 300, 290, 148, c.orangeLight, c.orange, 4, 14)}
  ${t(["Request root"], 795, 362, 35, c.ink, 820, "middle")}
  ${t(["hash_tree_root", "(NewPayloadRequest)"], 795, 400, 22, c.slate, 700, "middle", 1.12)}
  ${newPayload.svg}

  ${arrow(1030, 374, 940, 374)}
  ${arrow(650, 374, 560, 374)}

  ${executionProof.svg}
  ${signedProof.svg}
  ${arrow(310, 429, 310, 520)}
  ${arrow(310, 784, 310, 835)}
</svg>
`;

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
    seed: 300000 + eid,
    version: 1,
    versionNonce: 400000 + eid,
    isDeleted: false,
    boundElements: null,
    updated: 1710000000000 + eid,
    link: null,
    locked: false,
  };
}
function exRect(x, y, width, height, fill = c.white, stroke = c.line) {
  const el = exCommon("rectangle", x, y, width, height);
  el.backgroundColor = fill;
  el.strokeColor = stroke;
  return el;
}
function exText(x, y, text, size = 24, color = c.ink, width = 320) {
  const lines = text.split("\n");
  const el = exCommon("text", x, y, width, lines.length * size * 1.25);
  el.strokeColor = color;
  el.fontSize = size;
  el.fontFamily = 1;
  el.text = text;
  el.rawText = text;
  el.originalText = text;
  el.textAlign = "left";
  el.verticalAlign = "top";
  el.baseline = Math.round(lines.length * size * 1.08);
  el.containerId = null;
  el.lineHeight = 1.25;
  textEntries.push(`${text.replaceAll("\n", " ")} ^${el.id}`);
  return el;
}
function exArrow(x1, y1, x2, y2) {
  const el = exCommon("arrow", x1, y1, x2 - x1, y2 - y1);
  el.strokeColor = c.orange;
  el.strokeWidth = 4;
  el.points = [[0, 0], [x2 - x1, y2 - y1]];
  el.startBinding = null;
  el.endBinding = null;
  el.startArrowhead = null;
  el.endArrowhead = "arrow";
  return el;
}

const elements = [
  exText(44, 40, "SSZ envelope and payload binding", 42, c.ink, 780),
  exText(44, 92, "PublicInput carries the request root. ExecutionProof carries PublicInput. SignedExecutionProof carries the signature.", 27, c.slate, 1350),
  exRect(60, 165, 500, 264),
  exText(90, 186, "PublicInput", 33, c.orange, 430),
  exText(80, 246, "NewPayloadRequestRoot\nRoot\nSuccessfulValidation\nbool\nChainConfig\nChainConfig", 22, c.ink, 455),
  exArrow(650, 374, 560, 374),
  exRect(650, 300, 290, 148, c.orangeLight, c.orange),
  exText(705, 330, "Request root\nhash_tree_root(NewPayloadRequest)", 28, c.ink, 260),
  exArrow(1030, 374, 940, 374),
  exRect(1030, 165, 500, 314),
  exText(1060, 186, "NewPayloadRequest", 33, c.teal, 450),
  exText(1050, 246, "ExecutionPayload\nExecutionPayload\nVersionedHashes\nSequence[VersionedHash]\nParentBeaconBlockRoot\nRoot\nExecutionRequests\nExecutionRequests", 22, c.ink, 455),
  exRect(60, 520, 500, 264),
  exText(90, 541, "ExecutionProof", 33, c.teal, 430),
  exText(80, 601, "ProofData\nByteList[MAX_PROOF_SIZE]\nProofType\nProofType\nPublicInput\nPublicInput", 22, c.ink, 455),
  exArrow(310, 429, 310, 520),
  exRect(60, 835, 500, 264),
  exText(90, 856, "SignedExecutionProof", 33, c.blueDark, 450),
  exText(80, 916, "Message\nExecutionProof\nValidatorIndex\nValidatorIndex\nSignature\nBLSSignature", 22, c.ink, 455),
  exArrow(310, 784, 310, 835),
];

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

const md = `---

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

fs.writeFileSync(svgPath, svg);
fs.writeFileSync(excalidrawPath, md);
console.log("Wrote clean SSZ diagram SVG and Excalidraw source.");
