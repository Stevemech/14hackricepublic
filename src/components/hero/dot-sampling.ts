// Shared halftone sampling for the dot-matrix visuals.

export interface SampledDot {
  gx: number;
  gy: number;
  /** 0..1 — how much ink/feature lives here (drives dot size) */
  strength: number;
  /** 0..1 — drives the gold ramp (brighter = closer to gold-bright) */
  shade: number;
}

/**
 * Sample an image into a cols×rows halftone grid.
 * mode "ink": dark-on-light artwork — dark ink → strong dots, pale areas →
 *   faint ghost grid (kept, so silhouettes still read).
 * mode "lum": authored brightness maps (the chip) — white → strong dots.
 * mode "mask": black & white threshold — a 1:1 trace; dots of uniform
 *   brightness exactly where the artwork has ink, nothing anywhere else.
 */
export function sampleImage(
  img: CanvasImageSource,
  cols: number,
  rows: number,
  mode: "ink" | "lum" | "mask",
): SampledDot[] {
  const sample = document.createElement("canvas");
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext("2d")!;
  sctx.drawImage(img, 0, 0, cols, rows);
  const data = sctx.getImageData(0, 0, cols, rows).data;

  const dots: SampledDot[] = [];
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      const i = (gy * cols + gx) * 4;
      const a = data[i + 3] / 255;
      if (a < 0.15) continue;
      const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
      let strength: number;
      let shade: number;
      if (mode === "ink") {
        // 1.25 exponent + lifted floor: midtone features (owls, pips, thin
        // borders) and the ghost grid stay clearly visible.
        const ink = Math.pow(1 - lum, 1.25);
        strength = a * (0.18 + 0.82 * ink);
        shade = ink;
      } else if (mode === "mask") {
        // Binary trace: a cell is ink, faint face-grid, or nothing. The 0.35
        // alpha floor keeps the card's antialiased outline in the trace.
        if (a < 0.35) continue;
        if (lum > 0.66) {
          // Card face: a calm, even grey-gold grid at double pitch
          if ((gx | gy) & 1) continue;
          strength = 0.16;
          shade = 0.32;
        } else {
          const ink = Math.min(1, 1 - lum);
          strength = 0.85 + 0.15 * ink;
          shade = 0.8 + 0.2 * ink;
        }
      } else {
        strength = a * lum;
        shade = lum;
      }
      if (strength < 0.08) continue;
      dots.push({ gx, gy, strength, shade });
    }
  }
  return dots;
}

/**
 * Trace the silhouette of the artwork: dots where opaque pixels border
 * transparent ones (the card's physical edge). Rendered dim so the shape
 * reads without competing with the ink trace.
 */
export function sampleAlphaEdge(
  img: CanvasImageSource,
  cols: number,
  rows: number,
): SampledDot[] {
  const sample = document.createElement("canvas");
  sample.width = cols;
  sample.height = rows;
  const sctx = sample.getContext("2d")!;
  sctx.drawImage(img, 0, 0, cols, rows);
  const data = sctx.getImageData(0, 0, cols, rows).data;
  const a = (x: number, y: number) =>
    x < 0 || y < 0 || x >= cols || y >= rows ? 0 : data[(y * cols + x) * 4 + 3] / 255;

  const dots: SampledDot[] = [];
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      if (a(gx, gy) < 0.5) continue;
      const onEdge =
        a(gx - 1, gy) < 0.5 || a(gx + 1, gy) < 0.5 || a(gx, gy - 1) < 0.5 || a(gx, gy + 1) < 0.5;
      if (!onEdge) continue;
      dots.push({ gx, gy, strength: 0.5, shade: 0.5 });
    }
  }
  return dots;
}

const GOLD_FROM = { r: 158, g: 117, b: 40 }; // lifted gold-deep (brighter dim parts)
const GOLD_TO = { r: 235, g: 196, b: 110 }; // a touch past gold-bright

export function goldShade(t: number, boost = 0): string {
  const k = Math.max(0, Math.min(1, t + boost));
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * k);
  return `rgb(${lerp(GOLD_FROM.r, GOLD_TO.r)},${lerp(GOLD_FROM.g, GOLD_TO.g)},${lerp(GOLD_FROM.b, GOLD_TO.b)})`;
}
