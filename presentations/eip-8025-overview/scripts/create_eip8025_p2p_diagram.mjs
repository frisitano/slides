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
  teal: "#0f172a",
  teal2: "#64748b",
  tealLight: "#f1f5f9",
  orange: "#0f172a",
  orangeDark: "#0f172a",
  orangeLight: "#f1f5f9",
  blue: "#0f172a",
  blueLight: "#f1f5f9",
  purple: "#0f172a",
  purpleLight: "#f1f5f9",
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

function tspans(lines, x, y, size, lineHeight = 1.2, anchor = "start") {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${y + i * size * lineHeight}" text-anchor="${anchor}">${esc(line)}</tspan>`)
    .join("");
}

function svgText({
  lines,
  x,
  y,
  size = 24,
  weight = 700,
  color = colors.ink,
  lineHeight = 1.2,
  anchor = "start",
  family = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
}) {
  return `<text font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans(lines, x, y, size, lineHeight, anchor)}</text>`;
}

function svgCode({ lines, x, y, size = 18, color = colors.ink, lineHeight = 1.35, weight = 760 }) {
  return `<text font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, monospace" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans(lines, x, y, size, lineHeight)}</text>`;
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
    svgBox({ x, y, w, h: 42, fill, stroke, strokeWidth: 2.5, radius: 14 }),
    svgText({ lines: [label], x: x + 16, y: y + 27, size: 17, weight: 850, color }),
  ].join("");
}

function sectionBox({ x, y, w, h, title, subtitle, color, fill, lines }) {
  const parts = [
    svgBox({ x, y, w, h, fill, stroke: color, strokeWidth: 3, radius: 24, shadow: true }),
    svgText({ lines: [title], x: x + 22, y: y + 36, size: 26, weight: 920, color }),
  ];
  if (subtitle) parts.push(svgText({ lines: [subtitle], x: x + 22, y: y + 62, size: 16, weight: 780, color: colors.slate }));
  lines.forEach((line, i) => {
    parts.push(svgText({ lines: [line], x: x + 22, y: y + 98 + i * 27, size: 17, weight: 740, color: i === 0 ? colors.ink : colors.slate }));
  });
  return parts.join("\n");
}

function typeCard({ x, y, w, h, title, subtitle, color, fill, code, codeSize = 18 }) {
  const parts = [
    svgBox({ x, y, w, h, fill, stroke: color, strokeWidth: 3, radius: 22, shadow: true }),
    svgText({ lines: [title], x: x + 22, y: y + 39, size: 25, weight: 930, color }),
  ];
  if (subtitle) parts.push(svgText({ lines: [subtitle], x: x + 22, y: y + 66, size: 15.5, weight: 780, color: colors.slate }));
  parts.push(svgCode({ lines: code, x: x + 22, y: y + 101, size: codeSize, color: colors.ink }));
  return parts.join("\n");
}

function splitField(field) {
  const index = field.indexOf(":");
  if (index === -1) return { name: field.trim(), type: null };
  return {
    name: field.slice(0, index).trim(),
    type: field.slice(index + 1).trim(),
  };
}

function entity({
  x,
  y,
  w,
  title,
  color,
  fields,
  rowH = 43,
  headerH = 76,
  fieldSize = 23,
  typeSize = 20,
  noteSize = 22,
  titleSize = 25,
  fixedH,
}) {
  const h = fixedH ?? headerH + fields.length * rowH;
  const effectiveRowH = fixedH ? (h - headerH) / fields.length : rowH;
  const parts = [
    svgBox({ x, y, w, h, fill: colors.white, stroke: colors.line, strokeWidth: 3, radius: 16, shadow: true }),
    `<rect x="${x}" y="${y}" width="${w}" height="${headerH}" rx="16" fill="${color}"/>`,
    `<rect x="${x}" y="${y + 36}" width="${w}" height="${headerH - 36}" fill="${color}"/>`,
    svgText({ lines: [title], x: x + w / 2, y: y + 48, size: titleSize, weight: 880, color: colors.white, anchor: "middle" }),
  ];
  fields.forEach((field, i) => {
    const fy = y + headerH + i * effectiveRowH;
    const parsed = splitField(field);
    const mid = fy + effectiveRowH / 2;
    if (i > 0) parts.push(`<line x1="${x}" y1="${fy}" x2="${x + w}" y2="${fy}" stroke="${colors.line}" stroke-width="2"/>`);
    if (parsed.type) {
      parts.push(svgText({ lines: [parsed.name], x: x + 18, y: mid - 9, size: fieldSize, weight: 870, color: colors.ink }));
      parts.push(svgCode({ lines: [parsed.type], x: x + 18, y: mid + 23, size: typeSize, weight: 760, color: colors.slate }));
    } else {
      parts.push(svgText({ lines: [parsed.name], x: x + 18, y: mid + 8, size: noteSize, weight: 780, color: colors.ink }));
    }
  });
  return { h, svg: parts.join("\n") };
}

function protocolSvg() {
  const parts = [];
  parts.push(svgText({ lines: ["P2P protocol data model"], x: 44, y: 62, size: 44, weight: 850 }));
  parts.push(svgText({
    lines: [
      "Networking defines message bodies and peer-selection signals.",
      "Proof verification sits outside this data model.",
    ],
    x: 44,
    y: 112,
    size: 28,
    weight: 650,
    color: colors.slate,
    lineHeight: 1.12,
  }));

  const boxW = 360;
  const rowH = 52;
  const headerH = 76;
  const fixedH = 410;
  const xs = [40, 425, 810, 1195];
  const row1 = 180;
  const row2 = 618;

  const signed = entity({
    x: xs[0],
    y: row1,
    w: boxW,
    title: "SignedExecutionProof",
    color: colors.ink,
    fields: [
      "Message: ExecutionProof",
      "ValidatorIndex: ValidatorIndex",
      "Signature: BLSSignature",
    ],
    fieldSize: 23,
    typeSize: 20,
    titleSize: 24.5,
    rowH,
    headerH,
    fixedH,
  });
  const proof = entity({
    x: xs[1],
    y: row1,
    w: boxW,
    title: "ExecutionProof",
    color: colors.teal,
    fields: [
      "ProofData: ByteList[MAX_PROOF_SIZE]",
      "ProofType: ProofType",
      "PublicInput: PublicInput",
    ],
    fieldSize: 23,
    typeSize: 20,
    titleSize: 26,
    rowH,
    headerH,
    fixedH,
  });
  const input = entity({
    x: xs[2],
    y: row1,
    w: boxW,
    title: "PublicInput",
    color: colors.orange,
    fields: [
      "NewPayloadRequestRoot: Root",
      "SuccessfulValidation: bool",
      "ChainConfig: ChainConfig",
    ],
    fieldSize: 22.5,
    typeSize: 20,
    titleSize: 26,
    rowH,
    headerH,
    fixedH,
  });
  const gossip = entity({
    x: xs[3],
    y: row1,
    w: boxW,
    title: "Gossip topic",
    color: colors.orange,
    fields: [
      "Topic: execution_proof",
      "Body: SignedExecutionProof",
      "seen root + dedup",
      "active validator + signature",
    ],
    fieldSize: 22,
    typeSize: 20,
    noteSize: 22,
    titleSize: 26,
    rowH,
    headerH,
    fixedH,
  });
  const range = entity({
    x: xs[0],
    y: row2,
    w: boxW,
    title: "ExecutionProofsByRange",
    color: colors.teal,
    fields: [
      "StartSlot: Slot",
      "Count: uint64",
      "ProofTypes: List[ProofType, 4]",
      "Response: SignedExecutionProof*",
      "ordered by slot",
    ],
    fieldSize: 21.5,
    typeSize: 20,
    noteSize: 21.5,
    titleSize: 23,
    rowH,
    headerH,
    fixedH,
  });
  const root = entity({
    x: xs[1],
    y: row2,
    w: boxW,
    title: "ExecutionProofsByRoot",
    color: colors.blue,
    fields: [
      "Request: List[ProofByRootId]",
      "ProofByRootId.BlockRoot: Root",
      "ProofByRootId.ProofTypes: List[ProofType, 4]",
      "Response: SignedExecutionProof*",
    ],
    fieldSize: 20.8,
    typeSize: 20,
    titleSize: 23.5,
    rowH,
    headerH,
    fixedH,
  });
  const status = entity({
    x: xs[2],
    y: row2,
    w: boxW,
    title: "ExecutionProofStatus",
    color: colors.purple,
    fields: [
      "BlockRoot: Root",
      "Slot: Slot",
      "ProofTypes: List[ProofType, 4]",
    ],
    fieldSize: 22.5,
    typeSize: 20,
    titleSize: 24,
    rowH,
    headerH,
    fixedH,
  });
  const enr = entity({
    x: xs[3],
    y: row2,
    w: boxW,
    title: "ENR.eproof",
    color: colors.purple,
    fields: [
      "Eproof: uint8",
      "0 = unsupported",
      "1 = proof-aware",
    ],
    fieldSize: 23,
    typeSize: 20,
    noteSize: 23,
    titleSize: 26,
    rowH,
    headerH,
    fixedH,
  });
  parts.push(signed.svg, proof.svg, input.svg, gossip.svg, range.svg, root.svg, status.svg, enr.svg);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1590 1120" width="1590" height="1120" role="img">
  <rect width="1590" height="1120" fill="${colors.white}"/>
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
    seed: 100000 + idCounter,
    version: 1,
    versionNonce: 200000 + idCounter,
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

function protocolElements() {
  idCounter = 0;
  return [
    exText(44, 36, "P2P protocol data model", 44, colors.ink, 980),
    exText(44, 88, "Networking defines message bodies and peer-selection signals.\nProof verification sits outside this data model.", 28, colors.slate, 980),
    exRect(40, 180, 360, 410, colors.ink, colors.white),
    exText(62, 206, "SignedExecutionProof\nMessage\nExecutionProof\nValidatorIndex\nValidatorIndex\nSignature\nBLSSignature", 22, colors.ink, 330),
    exRect(425, 180, 360, 410, colors.teal, colors.white),
    exText(447, 206, "ExecutionProof\nProofData\nByteList[MAX_PROOF_SIZE]\nProofType\nProofType\nPublicInput\nPublicInput", 22, colors.ink, 330),
    exRect(810, 180, 360, 410, colors.orange, colors.white),
    exText(832, 206, "PublicInput\nNewPayloadRequestRoot\nRoot\nSuccessfulValidation\nbool\nChainConfig\nChainConfig", 22, colors.ink, 330),
    exRect(1195, 180, 360, 410, colors.orange, colors.white),
    exText(1217, 206, "Gossip topic\nTopic\nexecution_proof\nBody\nSignedExecutionProof\nseen root + dedup\nactive validator + signature", 22, colors.ink, 330),
    exRect(40, 618, 360, 410, colors.teal, colors.white),
    exText(62, 644, "ExecutionProofsByRange\nStartSlot\nSlot\nCount\nuint64\nProofTypes\nList[ProofType, 4]\nResponse\nSignedExecutionProof*\nordered by slot", 21, colors.ink, 330),
    exRect(425, 618, 360, 410, colors.blue, colors.white),
    exText(447, 644, "ExecutionProofsByRoot\nRequest\nList[ProofByRootId]\nProofByRootId.BlockRoot\nRoot\nProofByRootId.ProofTypes\nList[ProofType, 4]\nResponse\nSignedExecutionProof*", 21, colors.ink, 330),
    exRect(810, 618, 360, 410, colors.purple, colors.white),
    exText(832, 644, "ExecutionProofStatus\nBlockRoot\nRoot\nSlot\nSlot\nProofTypes\nList[ProofType, 4]", 22, colors.ink, 330),
    exRect(1195, 618, 360, 410, colors.purple, colors.white),
    exText(1217, 644, "ENR.eproof\nEproof\nuint8\n0 = unsupported\n1 = proof-aware", 22, colors.ink, 330),
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

Proof-aware CL networking ^tex00000001

# Drawing

\`\`\`json
${JSON.stringify(drawing)}
\`\`\`
`;
}

fs.mkdirSync(sourceDir, { recursive: true });
fs.mkdirSync(diagramsDir, { recursive: true });
fs.writeFileSync(path.join(sourceDir, "eip8025-p2p-protocol.svg"), protocolSvg());
fs.writeFileSync(path.join(diagramsDir, "eip8025-p2p-protocol.excalidraw.md"), excalidrawMarkdown(protocolElements()));
console.log("Wrote P2P protocol SVG and Excalidraw source.");
