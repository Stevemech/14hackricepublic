"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

// Dot-matrix rendering of the HackRice "H" card logo — the hero's main
// visual, replacing the original component's hosted dither animation.
// Gold dots sampled from /images/Hlogo.png alpha; scan-in reveal, idle
// shimmer, cursor proximity glow. Reduced motion: one static frame.

const CELL = 9; // sampling grid pitch in px
const MAX_R = 3.1;
const REVEAL_MS = 1500;

interface Dot {
  x: number;
  y: number;
  strength: number; // 0..1 from alpha
  shade: number; // 0..1 from luminance → gold ramp
  phase: number;
}

function goldShade(t: number, boost: number): string {
  // gold-deep (#8A6620) → gold (#C3922E) → gold-bright (#E3B85A)
  const lerp = (a: number, b: number, k: number) => Math.round(a + (b - a) * k);
  const k = Math.min(1, t + boost);
  const from = { r: 138, g: 102, b: 32 };
  const to = { r: 227, g: 184, b: 90 };
  return `rgb(${lerp(from.r, to.r, k)},${lerp(from.g, to.g, k)},${lerp(from.b, to.b, k)})`;
}

export function DotMatrixLogo({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let revealStart: number | null = null;
    const mouse = { x: -9999, y: -9999 };
    const img = new Image();
    img.src = "/images/Hlogo.png";

    const build = () => {
      if (!img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fit the logo (contain, centered, 12% padding)
      const pad = 0.12;
      const scale = Math.min(
        (width * (1 - pad * 2)) / img.naturalWidth,
        (height * (1 - pad * 2)) / img.naturalHeight,
      );
      const w = img.naturalWidth * scale;
      const h = img.naturalHeight * scale;
      const ox = (width - w) / 2;
      const oy = (height - h) / 2;

      const cols = Math.max(1, Math.floor(w / CELL));
      const rows = Math.max(1, Math.floor(h / CELL));
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d")!;
      sctx.drawImage(img, 0, 0, cols, rows);
      const data = sctx.getImageData(0, 0, cols, rows).data;

      dots = [];
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const i = (gy * cols + gx) * 4;
          const a = data[i + 3] / 255;
          if (a < 0.15) continue;
          const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          // Halftone by inverse luminance: the card's ink (H, pips, borders,
          // owls) becomes bold dots; the pale card face stays a faint ghost
          // grid so the card silhouette still reads.
          const ink = Math.pow(1 - lum, 1.6);
          const strength = a * (0.08 + 0.92 * ink);
          if (strength < 0.06) continue;
          dots.push({
            x: ox + gx * CELL + CELL / 2,
            y: oy + gy * CELL + CELL / 2,
            strength,
            shade: ink,
            phase: (gx * 13 + gy * 29) % 100,
          });
        }
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = now / 1000;
      const reveal =
        reduced || revealStart === null ? 1 : Math.min(1, (now - revealStart) / REVEAL_MS);
      for (const d of dots) {
        // Scan-in: rows resolve top → bottom with a soft edge
        const rowT = (d.y / height) * 0.85;
        const k = Math.max(0, Math.min(1, (reveal - rowT) / 0.15));
        if (k <= 0) continue;
        const shimmer = reduced ? 0 : Math.sin(t * 1.3 + d.phase * 0.45) * 0.12;
        const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
        const boost = dist < 120 ? (1 - dist / 120) * 0.55 : 0;
        const r = Math.max(0.5, MAX_R * (0.18 + 0.82 * d.strength) * (0.82 + shimmer + boost * 0.35) * k);
        ctx.beginPath();
        ctx.fillStyle = goldShade(0.25 + d.shade * 0.65 + shimmer, boost);
        ctx.globalAlpha = Math.min(1, (0.3 + d.strength * 0.7) * k + boost);
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (revealStart === null) revealStart = now;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      build();
      if (reduced) {
        draw(0);
      } else {
        raf = requestAnimationFrame(loop);
      }
    };

    if (img.complete && img.naturalWidth) start();
    else img.onload = start;

    const onResize = () => {
      build();
      if (reduced) draw(0);
    };
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseout", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseout", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 55%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 70% 70% at 50% 50%, black 55%, transparent 100%)",
      }}
    />
  );
}
