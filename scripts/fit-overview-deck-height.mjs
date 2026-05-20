#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { spawnSync } from "node:child_process";

const repoRoot = path.resolve(import.meta.dirname, "..");
const deckPath = path.join(repoRoot, "presentations/eip-8025-overview/slides.md");
const themePath = path.join(repoRoot, "themes/marp-4x5.css");
const buildPath = path.join(repoRoot, "scripts/build.sh");
const outPrefix = "/private/tmp/eip8025-overview-fit";
const width = 1080;
const standardHeight = 1240;
const safetyPadding = 36;

function parsePng(file) {
  const data = fs.readFileSync(file);
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (!data.subarray(0, 8).equals(signature)) {
    throw new Error(`${file} is not a PNG`);
  }

  let offset = 8;
  let pngWidth = 0;
  let pngHeight = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < data.length) {
    const length = data.readUInt32BE(offset);
    const type = data.subarray(offset + 4, offset + 8).toString("ascii");
    const chunk = data.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;

    if (type === "IHDR") {
      pngWidth = chunk.readUInt32BE(0);
      pngHeight = chunk.readUInt32BE(4);
      bitDepth = chunk[8];
      colorType = chunk[9];
    } else if (type === "IDAT") {
      idat.push(chunk);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
    throw new Error(`Unsupported PNG format in ${file}: bitDepth=${bitDepth}, colorType=${colorType}`);
  }

  const channels = colorType === 6 ? 4 : 3;
  const stride = pngWidth * channels;
  const inflated = zlib.inflateSync(Buffer.concat(idat));
  const rows = [];
  let prev = Buffer.alloc(stride);
  let pos = 0;

  for (let y = 0; y < pngHeight; y += 1) {
    const filter = inflated[pos];
    pos += 1;
    const row = Buffer.from(inflated.subarray(pos, pos + stride));
    pos += stride;

    for (let i = 0; i < stride; i += 1) {
      const left = i >= channels ? row[i - channels] : 0;
      const up = prev[i];
      const upLeft = i >= channels ? prev[i - channels] : 0;
      if (filter === 1) row[i] = (row[i] + left) & 0xff;
      else if (filter === 2) row[i] = (row[i] + up) & 0xff;
      else if (filter === 3) row[i] = (row[i] + Math.floor((left + up) / 2)) & 0xff;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        const pr = pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
        row[i] = (row[i] + pr) & 0xff;
      } else if (filter !== 0) {
        throw new Error(`Unsupported PNG filter ${filter} in ${file}`);
      }
    }

    rows.push(row);
    prev = row;
  }

  return { width: pngWidth, height: pngHeight, channels, rows };
}

function measure(file, threshold = 12, minPixels = 24) {
  const image = parsePng(file);
  let top = null;
  let bottom = null;

  for (let y = 0; y < image.height; y += 1) {
    const row = image.rows[y];
    const samples = [0, 1, 2, image.width - 3, image.width - 2, image.width - 1];
    const bg = [0, 0, 0];
    for (const x of samples) {
      const i = x * image.channels;
      bg[0] += row[i];
      bg[1] += row[i + 1];
      bg[2] += row[i + 2];
    }
    bg[0] = Math.floor(bg[0] / samples.length);
    bg[1] = Math.floor(bg[1] / samples.length);
    bg[2] = Math.floor(bg[2] / samples.length);

    let changed = 0;
    for (let x = 0; x < image.width; x += 1) {
      const i = x * image.channels;
      const diff = Math.max(
        Math.abs(row[i] - bg[0]),
        Math.abs(row[i + 1] - bg[1]),
        Math.abs(row[i + 2] - bg[2]),
      );
      if (diff > threshold) changed += 1;
    }

    if (changed >= minPixels) {
      if (top === null) top = y;
      bottom = y;
    }
  }

  return {
    file,
    width: image.width,
    height: image.height,
    top,
    bottom,
    contentHeight: bottom === null ? null : bottom + 1,
    bottomWhitespace: bottom === null ? null : image.height - 1 - bottom,
  };
}

function replaceOrThrow(text, pattern, replacement, label) {
  if (!pattern.test(text)) throw new Error(`Failed to update ${label}`);
  pattern.lastIndex = 0;
  return text.replace(pattern, replacement);
}

for (const file of fs.readdirSync("/private/tmp")) {
  if (file.startsWith(path.basename(outPrefix) + ".")) {
    fs.unlinkSync(path.join("/private/tmp", file));
  }
}

const render = spawnSync(
  "marp",
  [
    "--images",
    "png",
    "--allow-local-files",
    "--image-scale",
    "1",
    "--output",
    outPrefix,
    deckPath,
  ],
  { cwd: repoRoot, encoding: "utf8" },
);

if (render.status !== 0) {
  process.stderr.write(render.stdout || "");
  process.stderr.write(render.stderr || "");
  process.exit(render.status ?? 1);
}

const rendered = fs
  .readdirSync("/private/tmp")
  .filter((file) => file.startsWith(path.basename(outPrefix) + "."))
  .sort()
  .map((file) => path.join("/private/tmp", file));

if (rendered.length === 0) throw new Error("Marp rendered no PNGs");

const measurements = rendered.map((file) => measure(file));
const maxContentHeight = Math.max(...measurements.map((m) => m.contentHeight ?? 0));
const requiredHeight = Math.ceil((maxContentHeight + safetyPadding) / 2) * 2;
const ratio = width / standardHeight;

let theme = fs.readFileSync(themePath, "utf8");
theme = replaceOrThrow(theme, /height:\s*\d+px;/, `height: ${standardHeight}px;`, themePath);
fs.writeFileSync(themePath, theme);

let deck = fs.readFileSync(deckPath, "utf8");
deck = replaceOrThrow(deck, /height:\s*\d+px;/, `height: ${standardHeight}px;`, deckPath);
deck = deck.replace(/^fittedHeight:\s*\d+\s*$/gm, "");
deck = deck.replace(/^slideHeights:\s*\[[^\]]*\]\s*$/gm, "");
fs.writeFileSync(deckPath, deck);

let build = fs.readFileSync(buildPath, "utf8");
build = replaceOrThrow(
  build,
  /social-portrait\)\s*echo "[^"]+"\s*;;/,
  `social-portrait) echo "${width} / ${standardHeight}" ;;`,
  "social-portrait aspect ratio in build.sh",
);
build = replaceOrThrow(
  build,
  /4:5\)\s*echo "[^"]+"\s*;;/,
  `4:5) echo "${width} / ${standardHeight}" ;;`,
  "4:5 aspect ratio in build.sh",
);
build = replaceOrThrow(
  build,
  /--deck-width-ratio:\s*[0-9.]+;/,
  `--deck-width-ratio: ${ratio.toFixed(6)};`,
  "4:5 deck width ratio in build.sh",
);
build = replaceOrThrow(
  build,
  /--deck-target-height:\s*min\(\d+px,\s*calc\(100vh - var\(--menu-bar-height\) - 2\.4rem\)\);/,
  `--deck-target-height: min(${standardHeight}px, calc(100vh - var(--menu-bar-height) - 2.4rem));`,
  "social portrait deck target height in build.sh",
);
fs.writeFileSync(buildPath, build);

for (const [i, m] of measurements.entries()) {
  console.log(
    `${String(i + 1).padStart(2, "0")} ${path.basename(m.file)} ${m.width}x${m.height} ` +
      `content_h=${m.contentHeight} bottom_ws=${m.bottomWhitespace}`,
  );
}
console.log(`max_content_height=${maxContentHeight}`);
console.log(`required_height=${requiredHeight}`);
console.log(`standard_height=${standardHeight}`);
console.log(`width_ratio=${ratio.toFixed(6)}`);
if (requiredHeight > standardHeight) {
  console.warn(`warning: required_height exceeds the standardized canvas by ${requiredHeight - standardHeight}px`);
}
