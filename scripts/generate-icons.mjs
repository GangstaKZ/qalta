import { deflateSync } from "node:zlib";
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "icons");
mkdirSync(OUT, { recursive: true });

const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function encodePng(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (width * 4 + 1)] = 0;
    rgba.copy(raw, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const GREEN = [47, 191, 113];
const WHITE = [255, 255, 255];
const RING = [47, 191, 113];

function drawIcon(size, { fullBleed }) {
  const rgba = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;

  const rr = fullBleed ? 0 : size * 0.22; // corner radius of bg square
  const bgR = fullBleed ? size : size * 0.78; // size of bg square (centered)
  const half = bgR / 2;

  function inRoundedSquare(x, y) {
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    if (dx > half || dy > half) return false;
    const ox = dx - (half - rr);
    const oy = dy - (half - rr);
    if (ox > 0 && oy > 0) return ox * ox + oy * oy <= rr * rr;
    return true;
  }

  const coinR = size * (fullBleed ? 0.28 : 0.26);
  const ringInner = coinR * 0.62;
  const ringOuter = coinR * 0.82;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const i = (y * size + x) * 4;
      if (!inRoundedSquare(px, py)) {
        rgba[i] = 0;
        rgba[i + 1] = 0;
        rgba[i + 2] = 0;
        rgba[i + 3] = 0;
        continue;
      }
      const d = Math.hypot(px - cx, py - cy);
      let c = GREEN;
      if (d <= coinR) {
        if (d >= ringInner && d <= ringOuter) c = RING;
        else c = WHITE;
      } else if (d <= coinR + size * 0.012) {
        // soft edge of coin: keep green bg
        c = GREEN;
      }
      rgba[i] = c[0];
      rgba[i + 1] = c[1];
      rgba[i + 2] = c[2];
      rgba[i + 3] = 255;
    }
  }
  return encodePng(size, size, rgba);
}

const files = [
  ["icon-192.png", drawIcon(192, { fullBleed: false })],
  ["icon-512.png", drawIcon(512, { fullBleed: false })],
  ["icon-maskable-512.png", drawIcon(512, { fullBleed: true })],
  ["apple-touch-icon.png", drawIcon(180, { fullBleed: true })],
];

for (const [name, buf] of files) {
  writeFileSync(join(OUT, name), buf);
  console.log("wrote", name, buf.length, "bytes");
}
