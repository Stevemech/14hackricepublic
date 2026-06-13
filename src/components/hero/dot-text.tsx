"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { goldShade, sampleImage, type SampledDot } from "./dot-sampling";
import { DOT_PITCH, MAX_R } from "./dot-engine";

// Display text rendered at the same dot density as the card and chip.
// The real heading lives in the DOM (sr-only) — this canvas is decoration.

const REVEAL_MS = 1100;

interface Placed extends SampledDot {
  px: number;
  py: number;
}

export function DotText({
  lines,
  className,
  maxFontPx = 118,
}: {
  lines: string[];
  className?: string;
  maxFontPx?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dots: Placed[] = [];
    let width = 0;
    let height = 0;
    let maxR = MAX_R;
    let revealStart: number | null = null;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = wrap.clientWidth;
      const maxChars = Math.max(...lines.map((l) => l.length));
      // Mono advance ≈ 0.62em + letter-spacing ≈ 0.1em
      const fontPx = Math.max(40, Math.min(maxFontPx, width / (maxChars * 0.72)));
      const lineH = fontPx * 1.16;
      height = Math.ceil(lines.length * lineH + fontPx * 0.3);
      canvas.style.height = `${height}px`;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Author the luminance map: white text on black
      const map = document.createElement("canvas");
      map.width = width;
      map.height = height;
      const mctx = map.getContext("2d")!;
      mctx.fillStyle = "#000";
      mctx.fillRect(0, 0, width, height);
      mctx.fillStyle = "#fff";
      mctx.textBaseline = "top";
      const family = getComputedStyle(wrap).fontFamily || "monospace";
      mctx.font = `bold ${fontPx}px ${family}`;
      if ("letterSpacing" in mctx) {
        (mctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing =
          `${fontPx * 0.1}px`;
      }
      lines.forEach((line, i) => {
        mctx.fillText(line, 2, i * lineH + fontPx * 0.18);
      });

      // Tighter pitch when the type is small (mobile) so letters keep
      // enough dots to stay legible; dot radius scales with the pitch.
      const pitch = fontPx < 56 ? 4 : DOT_PITCH;
      maxR = MAX_R * (pitch / DOT_PITCH);
      const cols = Math.max(4, Math.floor(width / pitch));
      const rows = Math.max(4, Math.floor(height / pitch));
      dots = sampleImage(map, cols, rows, "lum").map((d) => ({
        ...d,
        px: d.gx * pitch + pitch / 2,
        py: d.gy * pitch + pitch / 2,
      }));
    };

    const draw = (now: number) => {
      const t = now / 1000;
      const reveal =
        reduced || revealStart === null ? 1 : Math.min(1, (now - revealStart) / REVEAL_MS);
      ctx.clearRect(0, 0, width, height);
      for (const d of dots) {
        // Resolve left → right, like type being dealt
        const colT = (d.px / width) * 0.85;
        const k = Math.max(0, Math.min(1, (reveal - colT) / 0.15));
        if (k <= 0) continue;
        const shimmer = reduced ? 0 : Math.sin(t * 1.3 + (d.gx * 13 + d.gy * 29) * 0.45) * 0.08;
        ctx.beginPath();
        ctx.globalAlpha = Math.min(1, (0.55 + d.strength * 0.45) * k);
        ctx.fillStyle = goldShade(0.55 + d.shade * 0.45 + shimmer);
        ctx.arc(d.px, d.py, Math.max(0.55, maxR * (0.3 + 0.7 * d.strength) * (0.88 + shimmer) * k), 0, Math.PI * 2);
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
    // Wait for the mono webfont so the map isn't drawn in a fallback face
    document.fonts.ready.then(start);

    const ro = new ResizeObserver(() => {
      build();
      if (reduced) draw(0);
    });
    ro.observe(wrap);
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !reduced) raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [lines, reduced, maxFontPx]);

  return (
    <div ref={wrapRef} className={`font-mono ${className ?? ""}`}>
      <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />
    </div>
  );
}
