// Shared 3D dot-field engine pieces for the hero visuals (card, chip, text).

import { sampleImage, type SampledDot } from "./dot-sampling";

export const DOT_PITCH = 6; // one density everywhere — card, chip, title
export const MAX_R = 2.6;
export const FOCAL = 1400;

export interface Dot3 {
  x: number;
  y: number;
  z: number;
  strength: number;
  shade: number;
  phase: number;
  /** Face normal z (−1 front, +1 back) for back-face culling; 0/undefined = two-sided */
  nz?: number;
}

export function toDots3(
  sampled: SampledDot[],
  cols: number,
  rows: number,
  pitch: number,
  z: number,
): Dot3[] {
  return sampled.map((d) => ({
    x: (d.gx - cols / 2) * pitch,
    y: (d.gy - rows / 2) * pitch,
    z,
    strength: d.strength,
    shade: d.shade,
    phase: (d.gx * 13 + d.gy * 29) % 100,
  }));
}

/** Author the chip as a brightness map: white = strong dot. */
export function makeChipLuminanceMap(size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;
  const cx = size / 2;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);

  // Face disc — dark enough that the "16" owns the brightness budget
  ctx.fillStyle = "#383838";
  ctx.beginPath();
  ctx.arc(cx, cx, cx - 2, 0, Math.PI * 2);
  ctx.fill();

  // Edge-spot ring: dark band with six bright spots
  ctx.strokeStyle = "#222";
  ctx.lineWidth = size * 0.13;
  ctx.beginPath();
  ctx.arc(cx, cx, cx * 0.86, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "#fff";
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cx, cx * 0.86, a - 0.22, a + 0.22);
    ctx.stroke();
  }

  // Suit pips N/E/S/W — small and dim
  ctx.font = `bold ${size * 0.09}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#777";
  ["♠", "♥", "♣", "♦"].forEach((g, i) => {
    const a = (i / 4) * Math.PI * 2 - Math.PI / 2;
    ctx.fillText(g, cx + Math.cos(a) * cx * 0.5, cx + Math.sin(a) * cx * 0.5);
  });

  // Center stays empty — the "16" is stamped as an explicit pixel-font
  // bitmap in buildChipDots (font sampling blobs at this resolution).

  return c;
}

// 7-row pixel bitmaps for "1" and "6" (classic 5×7-style forms) —
// always legible as dots.
const GLYPH_1 = ["010", "110", "010", "010", "010", "010", "111"];
const GLYPH_6 = ["01110", "10000", "10000", "11110", "10001", "10001", "01110"];

/** Dots for a crisp pixel-font "16", centered on the chip face at z. */
const GLYPH_GAP = 2; // bitmap columns between digits — keeps them from fusing
function sixteenDots(cells: number, pitch: number, z: number): Dot3[] {
  const scale = Math.max(1, Math.round((cells * 0.44) / 7));
  const totalW = (GLYPH_1[0].length + GLYPH_GAP + GLYPH_6[0].length) * scale;
  const totalH = 7 * scale;
  const dots: Dot3[] = [];
  const stamp = (glyph: string[], colOffset: number) => {
    glyph.forEach((row, by) => {
      row.split("").forEach((bit, bx) => {
        if (bit !== "1") return;
        for (let sy = 0; sy < scale; sy++) {
          for (let sx = 0; sx < scale; sx++) {
            dots.push({
              x: ((colOffset + bx) * scale + sx - totalW / 2 + 0.5) * pitch,
              y: (by * scale + sy - totalH / 2 + 0.5) * pitch,
              z,
              // Slightly under full strength: full-size dots touch at this
              // pitch and fuse the strokes together.
              strength: 0.78,
              shade: 1,
              phase: (bx * 13 + by * 29) % 100,
            });
          }
        }
      });
    });
  };
  stamp(GLYPH_1, 0);
  stamp(GLYPH_6, GLYPH_1[0].length + GLYPH_GAP);
  return dots;
}

/** Rim of the chip: dot rings at the disc edge with cream edge-spot stripes. */
export function chipRimDots(radius: number, halfThick: number): Dot3[] {
  const dots: Dot3[] = [];
  const steps = 88;
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2;
    const spot = Math.floor((a / (Math.PI * 2)) * 12) % 2 === 0;
    for (let zi = -1; zi <= 1; zi++) {
      dots.push({
        x: Math.cos(a) * radius,
        y: Math.sin(a) * radius,
        z: zi * halfThick,
        strength: spot ? 0.95 : 0.4,
        shade: spot ? 0.95 : 0.45,
        phase: (i * 7) % 100,
      });
    }
  }
  return dots;
}

/** Full chip dot set (both faces + rim). Back face mirrored so "16" reads at 180°. */
export function buildChipDots(diameter: number, pitch: number): Dot3[] {
  const map = makeChipLuminanceMap(240);
  const cells = Math.max(8, Math.floor(diameter / pitch));
  const halfThick = diameter * 0.055;

  // Keep the sampled face clear of the digit zone so the "16" stays crisp.
  // In this projection smaller z is nearer the camera, so the front face
  // (visible at rest) sits at −halfThick with normal nz = −1; the back face
  // carries the x-mirrored design and is hidden by back-face culling.
  const sixteen = sixteenDots(cells, pitch, -halfThick);
  const clearW = Math.max(...sixteen.map((d) => Math.abs(d.x))) + pitch * 1.5;
  const clearH = Math.max(...sixteen.map((d) => Math.abs(d.y))) + pitch * 1.5;
  const faceDots = sampleImage(map, cells, cells, "lum");
  const face = (z: number) =>
    toDots3(faceDots, cells, cells, pitch, z).filter(
      (d) => Math.abs(d.x) > clearW || Math.abs(d.y) > clearH,
    );
  const front = [...face(-halfThick), ...sixteen].map((d) => ({ ...d, nz: -1 }));
  const back = [...face(halfThick), ...sixteenDots(cells, pitch, halfThick)].map((d) => ({
    ...d,
    x: -d.x,
    nz: 1,
  }));
  return [...front, ...back, ...chipRimDots(diameter / 2, halfThick)];
}

export interface DrawState {
  cx: number;
  cy: number;
  rotY: number;
  tiltX: number;
  /** Flat plane → skip depth sort */
  flat: boolean;
  reveal: number; // 0..1
  shimmer: boolean;
  canvasHeight: number;
  /** Dot radius cap — scale down alongside tighter pitches */
  maxR?: number;
  /** Cursor position (canvas coords) — nearby dots glow and swell */
  mouse?: { x: number; y: number } | null;
}

// Quantized rgba palette (16 shade × 16 alpha steps), cached forever.
// Batching dots by bucket turns thousands of per-dot fillStyle/globalAlpha
// swaps into a few dozen path fills — the difference between 39 and 60fps.
const COLOR_CACHE = new Map<number, string>();
function bucketColor(shade: number, alpha: number): { key: number; css: string } {
  const ti = Math.max(0, Math.min(15, Math.round(shade * 15)));
  const ai = Math.max(1, Math.min(15, Math.round(alpha * 15)));
  const key = ti * 16 + ai;
  let css = COLOR_CACHE.get(key);
  if (!css) {
    const k = ti / 15;
    const lerp = (a: number, b: number) => Math.round(a + (b - a) * k);
    css = `rgba(${lerp(158, 235)},${lerp(117, 196)},${lerp(40, 110)},${(ai / 15).toFixed(3)})`;
    COLOR_CACHE.set(key, css);
  }
  return { key, css };
}

const TAU = Math.PI * 2;

export function drawDots(
  ctx: CanvasRenderingContext2D,
  dots: Dot3[],
  s: DrawState,
  nowMs: number,
) {
  const t = nowMs / 1000;
  const sinY = Math.sin(s.rotY);
  const cosY = Math.cos(s.rotY);
  const sinX = Math.sin(s.tiltX);
  const cosX = Math.cos(s.tiltX);

  const maxR = s.maxR ?? MAX_R;
  const mx = s.mouse ? s.mouse.x : -1e9;
  const my = s.mouse ? s.mouse.y : -1e9;
  const GLOW_R2 = 160 * 160;

  if (!s.flat) {
    // Depth-sorted path (the chip): few dots, draw individually back→front.
    const proj: Array<{ px: number; py: number; r: number; a: number; shade: number; z: number }> =
      [];
    for (const d of dots) {
      if (d.nz && d.nz * cosY * cosX > 0.02) continue;
      const x1 = d.x * cosY + d.z * sinY;
      const z1 = -d.x * sinY + d.z * cosY;
      const y2 = d.y * cosX - z1 * sinX;
      const z2 = d.y * sinX + z1 * cosX;
      const sc = FOCAL / (FOCAL + z2);
      const px = s.cx + x1 * sc;
      const py = s.cy + y2 * sc;
      const rowT = Math.max(0, Math.min(0.85, py / s.canvasHeight));
      const k = Math.max(0, Math.min(1, (s.reveal - rowT) / 0.15));
      if (k <= 0) continue;
      const shimmer = s.shimmer ? Math.sin(t * 1.3 + d.phase * 0.45) * 0.1 : 0;
      const depth = Math.max(0.45, Math.min(1, 1 - z2 / 600));
      const r = Math.max(0.5, maxR * (0.22 + 0.78 * d.strength) * (0.85 + shimmer) * sc * k);
      proj.push({
        px,
        py,
        r,
        a: Math.min(1, (0.48 + d.strength * 0.52) * depth * k),
        shade: Math.max(0, Math.min(1, (0.38 + d.shade * 0.58 + shimmer - 0.25) / 0.75)),
        z: z2,
      });
    }
    proj.sort((a, b) => b.z - a.z);
    for (const p of proj) {
      ctx.beginPath();
      ctx.globalAlpha = p.a;
      ctx.fillStyle = bucketColor(p.shade, 1).css;
      ctx.arc(p.px, p.py, p.r, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return;
  }

  // Flat fast path (the card): project straight into quantized color buckets
  // (no intermediate objects — this loop runs ~18k times per frame) and fill
  // each bucket as a single path.
  const buckets = new Map<number, { css: string; pts: number[] }>();
  for (const d of dots) {
    const x1 = d.x * cosY + d.z * sinY;
    const z1 = -d.x * sinY + d.z * cosY;
    const y2 = d.y * cosX - z1 * sinX;
    const z2 = d.y * sinX + z1 * cosX;
    const sc = FOCAL / (FOCAL + z2);
    const px = s.cx + x1 * sc;
    const py = s.cy + y2 * sc;

    const rowT = Math.max(0, Math.min(0.85, py / s.canvasHeight));
    const k = Math.max(0, Math.min(1, (s.reveal - rowT) / 0.15));
    if (k <= 0) continue;

    const shimmer = s.shimmer ? Math.sin(t * 1.3 + d.phase * 0.45) * 0.1 : 0;
    const dx = px - mx;
    const dy = py - my;
    const d2 = dx * dx + dy * dy;
    const boost = d2 < GLOW_R2 ? (1 - Math.sqrt(d2) / 160) * 0.55 : 0;
    const r = Math.max(
      0.5,
      maxR * (0.22 + 0.78 * d.strength) * (0.85 + shimmer + boost * 0.45) * sc * k,
    );
    const a = Math.min(1, (0.48 + d.strength * 0.52) * k + boost * 0.35);
    const shade = Math.max(0, Math.min(1, (0.38 + d.shade * 0.58 + shimmer + boost - 0.25) / 0.75));

    const { key, css } = bucketColor(shade, a);
    let b = buckets.get(key);
    if (!b) {
      b = { css, pts: [] };
      buckets.set(key, b);
    }
    b.pts.push(px, py, r);
  }
  for (const b of buckets.values()) {
    ctx.fillStyle = b.css;
    ctx.beginPath();
    const pts = b.pts;
    for (let i = 0; i < pts.length; i += 3) {
      ctx.moveTo(pts[i] + pts[i + 2], pts[i + 1]);
      ctx.arc(pts[i], pts[i + 1], pts[i + 2], 0, TAU);
    }
    ctx.fill();
  }
}
