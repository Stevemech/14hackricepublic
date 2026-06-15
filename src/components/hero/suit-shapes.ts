import type { DotPainter } from "./dot-art";

// Vector suit silhouettes for the competition-track pips. Each is constructed
// symmetric about the vertical centerline and centered in its size×size box,
// so the sampled dot field comes out perfectly symmetric and centered — a
// clean replacement for the lopsided font glyphs. Painters draw a filled
// white shape; DotArt sets the fill and samples it to gold dots.

const TAU = Math.PI * 2;

const heart: DotPainter = (ctx, s) => {
  const x = s / 2;
  ctx.beginPath();
  ctx.moveTo(x, s * 0.8);
  ctx.bezierCurveTo(s * 0.02, s * 0.5, s * 0.1, s * 0.12, x, s * 0.34);
  ctx.bezierCurveTo(s * 0.9, s * 0.12, s * 0.98, s * 0.5, x, s * 0.8);
  ctx.closePath();
  ctx.fill();
};

const diamond: DotPainter = (ctx, s) => {
  const x = s / 2;
  ctx.beginPath();
  ctx.moveTo(x, s * 0.08);
  ctx.lineTo(s * 0.74, s * 0.5);
  ctx.lineTo(x, s * 0.92);
  ctx.lineTo(s * 0.26, s * 0.5);
  ctx.closePath();
  ctx.fill();
};

const spade: DotPainter = (ctx, s) => {
  const x = s / 2;
  // Inverted-heart body (point up).
  ctx.beginPath();
  ctx.moveTo(x, s * 0.12);
  ctx.bezierCurveTo(s * 0.98, s * 0.45, s * 0.8, s * 0.72, x, s * 0.6);
  ctx.bezierCurveTo(s * 0.2, s * 0.72, s * 0.02, s * 0.45, x, s * 0.12);
  ctx.closePath();
  ctx.fill();
  // Flared stem.
  ctx.beginPath();
  ctx.moveTo(x, s * 0.5);
  ctx.lineTo(s * 0.66, s * 0.86);
  ctx.lineTo(s * 0.34, s * 0.86);
  ctx.closePath();
  ctx.fill();
};

const club: DotPainter = (ctx, s) => {
  const x = s / 2;
  const r = s * 0.17;
  const lobe = (cx: number, cy: number) => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, TAU);
    ctx.fill();
  };
  lobe(x, s * 0.31); // top
  lobe(x - r * 1.05, s * 0.53); // left
  lobe(x + r * 1.05, s * 0.53); // right
  // Flared stem.
  ctx.beginPath();
  ctx.moveTo(x, s * 0.55);
  ctx.lineTo(s * 0.66, s * 0.88);
  ctx.lineTo(s * 0.34, s * 0.88);
  ctx.closePath();
  ctx.fill();
};

export const SUIT_PAINTERS: Record<string, DotPainter> = {
  "♥": heart,
  "♦": diamond,
  "♠": spade,
  "♣": club,
};
