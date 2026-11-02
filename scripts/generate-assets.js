const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, crc]);
}

function encodeRGBA(w, h, getPixel) {
  const rowSize = 1 + w * 4;
  const raw = Buffer.alloc(h * rowSize);
  for (let y = 0; y < h; y++) {
    const rowOffset = y * rowSize;
    raw[rowOffset] = 0; // Filter 0 (None)
    for (let x = 0; x < w; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = getPixel(x, y);
      raw[pxOffset] = r;
      raw[pxOffset + 1] = g;
      raw[pxOffset + 2] = b;
      raw[pxOffset + 3] = a;
    }
  }
  const sig = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', zlib.deflateSync(raw, { level: 9 }));
  const iendChunk = createChunk('IEND', Buffer.alloc(0));
  return Buffer.concat([sig, ihdrChunk, idatChunk, iendChunk]);
}

// 1. Generate Google Logo (96x96)
const googleW = 96;
const googleH = 96;
const googleBuf = encodeRGBA(googleW, googleH, (x, y) => {
  const cx = 48;
  const cy = 48;
  const dx = x - cx;
  const dy = y - cy;
  const d = Math.hypot(dx, dy);
  const rOut = 44;
  const rIn = 24.5;
  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;

  // Blue horizontal crossbar: from x=45 to 90, y between 37 and 59
  const inBar = x >= 46 && x <= 91 && y >= 37 && y <= 59;
  const nearBarEdge = inBar ? Math.min(x - 46, 91 - x, y - 37, 59 - y) : 0;

  // Ring check
  let ringAlpha = 0;
  if (d <= rOut + 1 && d >= rIn - 1) {
    let aOut = Math.max(0, Math.min(1, rOut - d + 0.5));
    let aIn = Math.max(0, Math.min(1, d - rIn + 0.5));
    ringAlpha = aOut * aIn;
  }

  // Bar alpha
  let barAlpha = 0;
  if (inBar) {
    barAlpha = Math.max(0, Math.min(1, nearBarEdge + 0.5));
  }

  // Cutout right inner triangle opening for the G
  if (d < rIn && !inBar) {
    return [0, 0, 0, 0];
  }
  // Cutout the gap above the bar (between y=15 to 37, x >= 48)
  if (x >= 48 && y < 37 && deg > -48 && deg < 0 && d > rIn) {
    // Gap above bar
    const gapDist = 37 - y;
    if (gapDist > 1) {
      ringAlpha = 0;
    } else {
      ringAlpha *= Math.max(0, 1 - gapDist);
    }
  }

  const alpha = Math.max(ringAlpha, barAlpha);
  if (alpha <= 0.01) return [0, 0, 0, 0];

  // Colors:
  // Red: top arc (deg between -145 and -45)
  // Yellow: left arc (|deg| >= 135)
  // Green: bottom arc (deg between 42 and 135)
  // Blue: right arc and crossbar (deg between -45 and 42, or inBar)
  let rgb;
  if (inBar || (deg >= -48 && deg <= 45)) {
    rgb = [66, 133, 244]; // Blue (#4285F4)
  } else if (deg > -145 && deg < -48) {
    rgb = [234, 67, 53]; // Red (#EA4335)
  } else if (Math.abs(deg) >= 135) {
    rgb = [251, 188, 5]; // Yellow (#FBBC05)
  } else {
    rgb = [52, 168, 83]; // Green (#34A853)
  }

  return [rgb[0], rgb[1], rgb[2], Math.round(alpha * 255)];
});

fs.writeFileSync(path.join(__dirname, '../assets/images/google-logo.png'), googleBuf);
console.log('google-logo.png created:', googleBuf.length, 'bytes');

// 2. Generate Redint Flame/Spark Logo (128x128)
// An elegant glowing flame/heart symbol in pure white
const logoW = 128;
const logoH = 128;
const logoBuf = encodeRGBA(logoW, logoH, (x, y) => {
  const nx = (x - 64) / 48; // -1 to 1
  const ny = (y - 68) / 48; // -1 to 1

  // Heart curve distance: (x^2 + y^2 - 1)^3 - x^2 * y^3 <= 0
  const hx = nx * 1.15;
  const hy = -ny * 1.15 + 0.15;
  const f = Math.pow(hx * hx + hy * hy - 0.75, 3) - hx * hx * Math.pow(hy, 3);

  // Flame top spark tail: nx ~ 0, ny from -0.8 to -1.3
  const sparkX = nx * 2.2;
  const sparkY = ny + 0.8;
  const inSpark = sparkY < 0 && Math.abs(sparkX) < Math.pow(-sparkY, 1.8) * 0.9;

  let alpha = 0;
  if (f <= 0.08 || inSpark) {
    alpha = Math.max(0, Math.min(1, (0.08 - f) * 12));
    if (inSpark) {
      alpha = Math.max(alpha, Math.min(1, (-sparkY) * 1.5));
    }
  }

  // Inner cutout / negative space for dynamic ribbon look
  const innerHx = hx * 1.6;
  const innerHy = hy * 1.6 + 0.05;
  const innerF = Math.pow(innerHx * innerHx + innerHy * innerHy - 0.6, 3) - innerHx * innerHx * Math.pow(innerHy, 3);
  if (innerF < -0.05 && ny > -0.4) {
    alpha *= Math.max(0, Math.min(1, (innerF + 0.05) * -15));
  }

  if (alpha <= 0.02) return [0, 0, 0, 0];
  return [255, 255, 255, Math.round(alpha * 255)];
});

fs.writeFileSync(path.join(__dirname, '../assets/images/redint-logo.png'), logoBuf);
console.log('redint-logo.png created:', logoBuf.length, 'bytes');

// 3. Generate Welcome Background (720x1560)
// Smooth gradient from coral peach -> vibrant rose -> deep ruby magenta
const bgW = 540;
const bgH = 1170;
const bgBuf = encodeRGBA(bgW, bgH, (x, y) => {
  // Diagonal progress from top-right (0.0) to bottom-left (1.0)
  const u = x / bgW;
  const v = y / bgH;
  // Flow angle ~145 deg (top-right is u=1, v=0; bottom-left is u=0, v=1)
  const t = Math.max(0, Math.min(1, 0.25 * (1 - u) + 0.75 * v));

  // Color stops:
  // 0.0:  #FF6B52 (255, 107, 82)
  // 0.35: #FF4464 (255, 68, 100)
  // 0.70: #FD297B (253, 41, 123)
  // 1.0:  #DD1465 (221, 20, 101)
  let r, g, b;
  if (t < 0.35) {
    const k = t / 0.35;
    r = 255;
    g = Math.round(107 + (68 - 107) * k);
    b = Math.round(82 + (100 - 82) * k);
  } else if (t < 0.7) {
    const k = (t - 0.35) / 0.35;
    r = Math.round(255 + (253 - 255) * k);
    g = Math.round(68 + (41 - 68) * k);
    b = Math.round(100 + (123 - 100) * k);
  } else {
    const k = (t - 0.7) / 0.3;
    r = Math.round(253 + (221 - 253) * k);
    g = Math.round(41 + (20 - 41) * k);
    b = Math.round(123 + (101 - 123) * k);
  }

  // Subtle warm glow at top-right
  const glowDist = Math.hypot(u - 0.85, v - 0.15);
  if (glowDist < 0.8) {
    const glow = Math.pow(1 - glowDist / 0.8, 2) * 0.15;
    r = Math.min(255, Math.round(r + 20 * glow));
    g = Math.min(255, Math.round(g + 25 * glow));
  }

  return [r, g, b, 255];
});

fs.writeFileSync(path.join(__dirname, '../assets/images/welcome-bg.png'), bgBuf);
console.log('welcome-bg.png created:', bgBuf.length, 'bytes');

