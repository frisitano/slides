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
  teal2: "#94a3b8",
  tealLight: "#f1f5f9",
  orange: "#0f172a",
  orangeDark: "#0f172a",
  orangeLight: "#f8fafc",
  blueLight: "#f1f5f9",
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

function tspans(lines, x, y, size, lineHeight = 1.18, anchor = "start") {
  return lines
    .map((line, i) => `<tspan x="${x}" y="${y + i * size * lineHeight}" text-anchor="${anchor}">${esc(line)}</tspan>`)
    .join("");
}

function svgBox({
  x,
  y,
  w,
  h,
  fill = colors.white,
  stroke = colors.line,
  strokeWidth = 4,
  radius = 22,
  shadow = false,
}) {
  const shadowEl = shadow
    ? `<rect x="${x + 8}" y="${y + 10}" width="${w}" height="${h}" rx="${radius}" fill="#0f172a" opacity="0.08"/>`
    : "";
  return `${shadowEl}<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
}

function svgText({ lines, x, y, size = 28, weight = 700, color = colors.ink, lineHeight = 1.18, anchor = "start", family = "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif" }) {
  return `<text font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${color}">${tspans(lines, x, y, size, lineHeight, anchor)}</text>`;
}

function svgPill({ x, y, w, h, label, fill = colors.tealLight, stroke = colors.teal2, color = colors.teal, size = 26 }) {
  return [
    svgBox({ x, y, w, h, fill, stroke, strokeWidth: 3, radius: 18 }),
    svgText({ lines: [label], x: x + 18, y: y + 35, size, weight: 850, color }),
  ].join("");
}

function fmt(value) {
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
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

function baseSvg(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1040" width="1600" height="1040" role="img">
  <defs>
    <style>
      .small { font-feature-settings: "tnum" 1; }
    </style>
  </defs>
  <rect width="1600" height="1040" fill="${colors.bg}"/>
  ${inner}
</svg>
`;
}

function guestFlowSvg() {
  const parts = [];
  parts.push(svgText({
    lines: ["Host input -> pure guest -> public result"],
    x: 60,
    y: 62,
    size: 44,
    weight: 900,
  }));
  parts.push(svgText({
    lines: ["A prover generates an execution proof for stateless validation of one payload request."],
    x: 60,
    y: 112,
    size: 28,
    weight: 700,
    color: colors.slate,
  }));

  parts.push(svgBox({ x: 60, y: 150, w: 410, h: 690, fill: colors.white, stroke: colors.line, shadow: true }));
  parts.push(svgText({ lines: ["Host / EL client"], x: 92, y: 205, size: 36, weight: 900 }));
  parts.push(svgText({ lines: ["records the data touched during", "execution or block construction"], x: 92, y: 250, size: 24, weight: 700, color: colors.slate }));
  parts.push(svgPill({ x: 92, y: 315, w: 342, h: 80, label: "NewPayloadRequest", fill: colors.blueLight, stroke: colors.teal2, color: colors.ink }));
  parts.push(svgText({ lines: ["payload, versioned hashes,", "parent beacon root, requests"], x: 110, y: 438, size: 24, weight: 700, color: colors.slate }));
  parts.push(svgPill({ x: 92, y: 505, w: 342, h: 80, label: "ExecutionWitness", fill: colors.tealLight, stroke: colors.teal2, color: colors.teal }));
  parts.push(svgText({ lines: ["state trie nodes, bytecode,", "ancestor headers"], x: 110, y: 628, size: 24, weight: 700, color: colors.slate }));
  parts.push(svgPill({ x: 92, y: 700, w: 356, h: 78, label: "ChainConfig + public_keys", fill: colors.orangeLight, stroke: colors.orange, color: colors.orangeDark }));

  parts.push(svgArrow({ x1: 486, y1: 500, x2: 585, y2: 500 }));

  parts.push(svgBox({ x: 605, y: 150, w: 430, h: 690, fill: colors.ink, stroke: colors.ink, shadow: true }));
  parts.push(svgText({ lines: ["zkVM guest program"], x: 637, y: 208, size: 36, weight: 900, color: colors.white }));
  parts.push(svgText({ lines: ["pure function:", "no local EL database"], x: 637, y: 250, size: 22, weight: 750, color: "#cbd5e1", lineHeight: 1.08 }));
  const steps = [
    ["1", "validate fork config"],
    ["2", "check witness headers"],
    ["3", "build WitnessState"],
    ["4", "execute payload / STF"],
  ];
  for (const [i, [num, label]] of steps.entries()) {
    const y = 315 + i * 118;
    parts.push(svgBox({ x: 637, y, w: 366, h: 76, fill: i === 3 ? colors.orangeLight : colors.white, stroke: i === 3 ? colors.orange : colors.border, strokeWidth: 3, radius: 16 }));
    parts.push(svgText({ lines: [num], x: 661, y: y + 50, size: 30, weight: 950, color: i === 3 ? colors.orangeDark : colors.teal }));
    parts.push(svgText({ lines: [label], x: 704, y: y + 49, size: 26, weight: 850, color: colors.ink }));
  }

  parts.push(svgArrow({ x1: 1054, y1: 500, x2: 1147, y2: 500 }));

  parts.push(svgBox({ x: 1165, y: 150, w: 375, h: 690, fill: colors.white, stroke: colors.line, shadow: true }));
  parts.push(svgText({ lines: ["StatelessValidation", "Result"], x: 1194, y: 204, size: 30, weight: 900, lineHeight: 1.08 }));
  parts.push(svgPill({ x: 1194, y: 330, w: 316, h: 72, label: "NewPayloadRequestRoot", fill: colors.blueLight, stroke: colors.teal2, color: colors.ink, size: 21 }));
  parts.push(svgPill({ x: 1194, y: 465, w: 316, h: 72, label: "SuccessfulValidation", fill: colors.tealLight, stroke: colors.teal2, color: colors.teal, size: 24 }));
  parts.push(svgPill({ x: 1194, y: 600, w: 316, h: 72, label: "ChainConfig", fill: colors.orangeLight, stroke: colors.orange, color: colors.orangeDark }));
  parts.push(svgText({ lines: ["Verifier binds the proof to", "the exact payload request."], x: 1194, y: 735, size: 24, weight: 750, color: colors.slate }));

  parts.push(svgBox({ x: 60, y: 890, w: 1480, h: 110, fill: colors.white, stroke: colors.border, strokeWidth: 3, radius: 20, shadow: true }));
  parts.push(svgText({ lines: ["Verifier accepts if"], x: 92, y: 952, size: 30, weight: 900, color: colors.teal }));
  parts.push(svgText({
    lines: ["proof verifies + success=true + root matches NewPayloadRequest", "ChainConfig matches the expected chain/fork"],
    x: 382,
    y: 935,
    size: 26,
    weight: 760,
    color: colors.slate,
  }));
  return baseSvg(parts.join("\n"));
}

function boundarySvg() {
  const parts = [];
  parts.push(svgText({ lines: ["Why standardize the EL boundary?"], x: 60, y: 62, size: 44, weight: 900 }));
  parts.push(svgText({
    lines: ["Different prover stacks can implement different guests while sharing one input/output test surface."],
    x: 60,
    y: 112,
    size: 28,
    weight: 700,
    color: colors.slate,
  }));

  parts.push(svgBox({ x: 60, y: 155, w: 390, h: 650, fill: colors.white, stroke: colors.line, shadow: true }));
  parts.push(svgText({ lines: ["Many prover stacks"], x: 88, y: 214, size: 34, weight: 900 }));
  const stacks = [
    ["Guest A", "zkVM / proof system A"],
    ["Guest B", "zkVM / proof system B"],
    ["Guest C", "zkVM / proof system C"],
  ];
  for (const [i, [title, body]] of stacks.entries()) {
    const y = 270 + i * 132;
    parts.push(svgBox({ x: 88, y, w: 322, h: 88, fill: i === 1 ? colors.tealLight : colors.bg, stroke: i === 1 ? colors.teal2 : colors.border, strokeWidth: 3, radius: 16 }));
    parts.push(svgText({ lines: [title], x: 110, y: y + 40, size: 28, weight: 900 }));
    parts.push(svgText({ lines: [body], x: 110, y: y + 70, size: 21, weight: 760, color: colors.slate }));
  }
  parts.push(svgText({ lines: ["Without a common boundary,", "each stack needs bespoke", "input assembly libraries."], x: 88, y: 704, size: 23, weight: 750, color: colors.slate }));

  parts.push(svgArrow({ x1: 470, y1: 480, x2: 515, y2: 480 }));

  parts.push(svgBox({ x: 535, y: 155, w: 535, h: 650, fill: colors.ink, stroke: colors.ink, shadow: true }));
  parts.push(svgText({ lines: ["Stable boundary"], x: 573, y: 222, size: 38, weight: 950, color: colors.white }));
  parts.push(svgText({ lines: ["shared contract", "every guest must implement"], x: 573, y: 266, size: 23, weight: 750, color: "#cbd5e1", lineHeight: 1.08 }));
  const boundaryRows = [
    ["StatelessInput", ["payload + witness + chain/fork config"]],
    ["Guest semantics", ["validate input, run STF, commit result"]],
    ["Public result", ["NewPayloadRequestRoot, SuccessBit,", "ChainConfig"]],
  ];
  for (const [i, [title, body]] of boundaryRows.entries()) {
    const y = 320 + i * 145;
    parts.push(svgBox({ x: 573, y, w: 459, h: 108, fill: i === 1 ? colors.orangeLight : colors.white, stroke: i === 1 ? colors.orange : colors.border, strokeWidth: 3, radius: 16 }));
    parts.push(svgText({ lines: [title], x: 595, y: y + 42, size: 29, weight: 950, color: i === 1 ? colors.orangeDark : colors.teal }));
    parts.push(svgText({ lines: body, x: 595, y: y + 74, size: 20, weight: 740, color: colors.slate, lineHeight: 1.08 }));
  }

  parts.push(svgArrow({ x1: 1090, y1: 480, x2: 1182, y2: 480 }));

  parts.push(svgBox({ x: 1205, y: 155, w: 335, h: 650, fill: colors.white, stroke: colors.line, shadow: true }));
  parts.push(svgText({ lines: ["execution-specs"], x: 1237, y: 214, size: 34, weight: 900 }));
  parts.push(svgText({ lines: ["Amsterdam fork tests"], x: 1237, y: 252, size: 24, weight: 750, color: colors.slate }));
  const tests = [
    ["valid payload cases"],
    ["invalid input cases"],
    ["fork / ChainConfig cases"],
    ["SSZ + host assembly"],
  ];
  for (const [i, [label]] of tests.entries()) {
    parts.push(svgPill({
      x: 1217,
      y: 310 + i * 92,
      w: 310,
      h: 62,
      label,
      fill: i % 2 ? colors.orangeLight : colors.tealLight,
      stroke: i % 2 ? colors.orange : colors.teal2,
      color: i % 2 ? colors.orangeDark : colors.teal,
      size: label.includes("ChainConfig") ? 23 : 24,
    }));
  }
  parts.push(svgText({ lines: ["Input/output tests target", "the shared boundary,", "not one stack."], x: 1237, y: 692, size: 22, weight: 750, color: colors.slate }));

  const benefits = [
    ["reduces prover complexity", "one witness/input format"],
    ["enables interop", "multiple guests, same contract"],
    ["input/output test", "valid + invalid conformance cases"],
  ];
  for (const [i, [title, body]] of benefits.entries()) {
    const x = 60 + i * 505;
    parts.push(svgBox({ x, y: 870, w: 460, h: 120, fill: i === 1 ? colors.ink : colors.white, stroke: i === 1 ? colors.ink : colors.border, strokeWidth: 3, radius: 20, shadow: true }));
    parts.push(svgText({ lines: [title], x: x + 28, y: 931, size: 30, weight: 900, color: i === 1 ? colors.white : colors.ink }));
    parts.push(svgText({ lines: [body], x: x + 28, y: 968, size: 24, weight: 750, color: i === 1 ? "#cbd5e1" : colors.slate }));
  }

  return baseSvg(parts.join("\n"));
}

let idCounter = 0;
const textEntries = [];

function id(prefix = "el") {
  idCounter += 1;
  return `${prefix}${idCounter.toString(36).padStart(8, "0")}`;
}

function excalidrawCommon(type, x, y, width = 0, height = 0) {
  return {
    id: id(type.slice(0, 3)),
    type,
    x,
    y,
    width,
    height,
    angle: 0,
    strokeColor: colors.ink,
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 2,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    roundness: type === "rectangle" ? { type: 3 } : null,
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

function exRect(x, y, width, height, fill = colors.white, stroke = colors.line) {
  const element = excalidrawCommon("rectangle", x, y, width, height);
  element.backgroundColor = fill;
  element.strokeColor = stroke;
  return element;
}

function exText(x, y, text, size = 24, color = colors.ink, width = 320) {
  const lines = text.split("\n");
  const element = excalidrawCommon("text", x, y, width, lines.length * size * 1.25);
  element.strokeColor = color;
  element.fontSize = size;
  element.fontFamily = 1;
  element.text = text;
  element.rawText = text;
  element.originalText = text;
  element.textAlign = "left";
  element.verticalAlign = "top";
  element.baseline = Math.round(lines.length * size * 1.08);
  element.containerId = null;
  element.lineHeight = 1.25;
  textEntries.push(`${text.replaceAll("\n", " ")} ^${element.id}`);
  return element;
}

function exArrow(x1, y1, x2, y2) {
  const element = excalidrawCommon("arrow", x1, y1, x2 - x1, y2 - y1);
  element.strokeColor = colors.orange;
  element.strokeWidth = 4;
  element.points = [[0, 0], [x2 - x1, y2 - y1]];
  element.lastCommittedPoint = null;
  element.startBinding = null;
  element.endBinding = null;
  element.startArrowhead = null;
  element.endArrowhead = "arrow";
  return element;
}

function guestFlowElements() {
  textEntries.length = 0;
  idCounter = 0;
  const e = [];
  e.push(exText(60, 35, "Host input -> pure guest -> public result", 36, colors.ink, 900));
  e.push(exText(60, 82, "A prover generates an execution proof for stateless validation of one payload request.", 23, colors.slate, 980));
  e.push(exRect(60, 135, 410, 505));
  e.push(exText(92, 178, "Host / EL client", 30, colors.ink, 320));
  e.push(exText(92, 219, "NewPayloadRequest\nExecutionWitness\nChainConfig + public_keys", 24, colors.teal, 356));
  e.push(exArrow(486, 386, 585, 386));
  e.push(exRect(605, 135, 430, 505, colors.ink, colors.ink));
  e.push(exText(637, 178, "zkVM guest program", 30, colors.white, 360));
  e.push(exText(637, 220, "pure function:\nno local EL database", 22, "#cbd5e1", 370));
  e.push(exText(637, 285, "1 validate fork config\n2 check witness headers\n3 build WitnessState\n4 execute payload / STF", 24, colors.white, 380));
  e.push(exArrow(1054, 386, 1147, 386));
  e.push(exRect(1165, 135, 375, 505));
  e.push(exText(1194, 178, "StatelessValidation\nResult", 25, colors.ink, 330));
  e.push(exText(1194, 300, "NewPayloadRequestRoot\nSuccessfulValidation\nChainConfig", 24, colors.teal, 330));
  e.push(exRect(60, 695, 1480, 92));
  e.push(exText(92, 730, "Verifier accepts if", 26, colors.teal, 290));
  e.push(exText(382, 724, "proof verifies + success=true + root matches NewPayloadRequest\nChainConfig matches chain/fork", 23, colors.slate, 1060));
  return { elements: e, text: [...textEntries] };
}

function boundaryElements() {
  textEntries.length = 0;
  idCounter = 0;
  const e = [];
  e.push(exText(60, 35, "Why standardize the EL boundary?", 36, colors.ink, 900));
  e.push(exText(60, 82, "Different prover stacks can implement different guests while sharing one input/output test surface.", 23, colors.slate, 1100));
  e.push(exRect(60, 150, 390, 490));
  e.push(exText(88, 193, "Many prover stacks", 30, colors.ink, 350));
  e.push(exText(88, 245, "Guest A / zkVM A\nGuest B / zkVM B\nGuest C / zkVM C", 25, colors.teal, 340));
  e.push(exText(88, 565, "Without a common boundary,\neach stack needs bespoke\ninput assembly libraries.", 19, colors.slate, 330));
  e.push(exArrow(470, 372, 515, 372));
  e.push(exRect(535, 150, 535, 490, colors.ink, colors.ink));
  e.push(exText(573, 195, "Stable boundary", 32, colors.white, 400));
  e.push(exText(573, 245, "StatelessInput\nGuest semantics\nStatelessValidationResult", 27, colors.white, 450));
  e.push(exArrow(1090, 372, 1182, 372));
  e.push(exRect(1205, 150, 335, 490));
  e.push(exText(1227, 193, "execution-specs", 30, colors.ink, 300));
  e.push(exText(1217, 242, "valid payload cases\ninvalid input cases\nfork / ChainConfig cases\nSSZ + host assembly", 23, colors.teal, 310));
  e.push(exText(1237, 570, "Tests target the boundary,\nnot one stack.", 19, colors.slate, 280));
  e.push(exRect(60, 675, 460, 100));
  e.push(exText(88, 712, "reduces prover complexity\none witness/input format", 25, colors.ink, 390));
  e.push(exRect(565, 675, 460, 100, colors.ink, colors.ink));
  e.push(exText(593, 712, "enables interop\nmultiple guests, same contract", 25, colors.white, 390));
  e.push(exRect(1070, 675, 460, 100));
  e.push(exText(1098, 712, "input/output test\nvalid + invalid conformance cases", 25, colors.ink, 390));
  return { elements: e, text: [...textEntries] };
}

function excalidrawMarkdown({ title, elements, text }) {
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

# Excalidraw Data

## Text Elements
${text.join("\n\n")}


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

fs.writeFileSync(path.join(sourceDir, "eip8025-el-guest-flow.svg"), guestFlowSvg());
fs.writeFileSync(path.join(sourceDir, "eip8025-el-standard-boundary.svg"), boundarySvg());

const guest = guestFlowElements();
fs.writeFileSync(
  path.join(diagramsDir, "eip8025-el-guest-flow.excalidraw.md"),
  excalidrawMarkdown({ title: "EL guest flow", elements: guest.elements, text: guest.text }),
);

const boundary = boundaryElements();
fs.writeFileSync(
  path.join(diagramsDir, "eip8025-el-standard-boundary.excalidraw.md"),
  excalidrawMarkdown({ title: "EL standard boundary", elements: boundary.elements, text: boundary.text }),
);

console.log("Wrote EL-layer SVGs and Excalidraw sources.");
