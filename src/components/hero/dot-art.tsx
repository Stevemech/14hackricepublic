"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { sampleImage } from "./dot-sampling";
import { drawDots, toDots3, MAX_R, type Dot3 } from "./dot-engine";

// A static, flat dot-field renderer for decorative artwork — the same dot
// recipe and slight additive bloom as the hero H card, but 2D and lightweight
// (no 3D projection, no pointer wobble). The source is either an image URL or
// a `paint` callback that draws a white silhouette onto a size×size canvas.
// The callback path is how the competition-track suits get perfectly
// symmetric, perfectly centered pips (vector shapes instead of font glyphs).

export type DotPainter = (ctx: CanvasRenderingContext2D, size: number) => void;

const REVEAL_MS = 900;

export function DotArt({
  src,
  paint,
  className,
  pitch = 4,
  bloom = true,
  contain = 0.92,
  animate = true,
}: {
  src?: string;
  paint?: DotPainter;
  className?: string;
  pitch?: number;
  bloom?: boolean;
  /** Fraction of the (square) box the artwork fills, leaving a margin. */
  contain?: number;
  /** When false, render a single static frame (no shimmer loop) — used where
      many instances would otherwise each animate (e.g. the team chips). */
  animate?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dots: Dot3[] = [];
    let revealStart: number | null = null;
    let onScreen = false;
    // Dots render offscreen so the main canvas can composite them once sharp
    // and once blurred-additive — the same gentle bloom as the H card.
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;
    const maxR = MAX_R * (pitch / 6) * 1.15;

    let img: HTMLImageElement | null = null;

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      off.width = canvas.width;
      off.height = canvas.height;
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Author a luminance map at display resolution: artwork on transparent.
      const map = document.createElement("canvas");
      map.width = width;
      map.height = height;
      const mctx = map.getContext("2d")!;
      const box = Math.min(width, height) * contain;
      if (paint) {
        mctx.save();
        mctx.translate((width - box) / 2, (height - box) / 2);
        mctx.fillStyle = "#fff";
        paint(mctx, box);
        mctx.restore();
      } else if (img && img.naturalWidth) {
        const aspect = img.naturalWidth / img.naturalHeight;
        let dw = box;
        let dh = box / aspect;
        if (dh > box) {
          dh = box;
          dw = box * aspect;
        }
        mctx.drawImage(img, (width - dw) / 2, (height - dh) / 2, dw, dh);
      }

      const cols = Math.max(8, Math.floor(width / pitch));
      const rows = Math.max(8, Math.floor(height / pitch));
      dots = toDots3(sampleImage(map, cols, rows, "lum"), cols, rows, pitch, 0);
    };

    // "Still" instances skip the shimmer loop: reduced-motion, or many
    // co-mounted chips that would each spin up a rAF.
    const still = reduced || !animate;

    const render = (now: number) => {
      if (revealStart === null) revealStart = now;
      const reveal = still ? 1 : Math.min(1, (now - revealStart) / REVEAL_MS);
      offCtx.clearRect(0, 0, width, height);
      drawDots(
        offCtx,
        dots,
        {
          cx: width / 2,
          cy: height / 2,
          rotY: 0,
          tiltX: 0,
          flat: true,
          reveal,
          shimmer: !still,
          canvasHeight: height,
          maxR,
        },
        now,
      );
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(off, 0, 0, width, height);
      if (bloom) {
        ctx.save();
        ctx.filter = "blur(3px)";
        ctx.globalAlpha = 0.45;
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(off, 0, 0, width, height);
        ctx.restore();
      }
    };

    const loop = (now: number) => {
      render(now);
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ready = () => {
      build();
      if (still) render(0);
      else if (onScreen) startLoop();
    };

    if (src) {
      img = new Image();
      img.src = src;
      if (img.complete && img.naturalWidth) ready();
      else img.onload = ready;
    } else {
      // Painter shapes don't depend on a webfont — render immediately.
      ready();
    }

    const ro = new ResizeObserver(() => {
      build();
      if (still) render(0);
    });
    ro.observe(canvas);

    // Only animate the shimmer while the element is actually on screen.
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
        if (still) return;
        if (onScreen) startLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (still) return;
      if (document.hidden) stopLoop();
      else if (onScreen) startLoop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopLoop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [src, paint, pitch, bloom, contain, animate, reduced]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
