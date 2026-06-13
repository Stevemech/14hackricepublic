"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { sampleAlphaEdge, sampleImage } from "./dot-sampling";
import { MAX_R, drawDots, toDots3, type Dot3 } from "./dot-engine";

// 1:1 trace: the artwork is reduced to a black & white ink mask and the dot
// lattice is laid over the ink only — uniform dots, no halftone gradients,
// no ghost grid (the same recipe as the dot title text). The fine pitch is
// what resolves the university owl. Dot radius scales with the pitch.
const CARD_PITCH = 3;
const CARD_MAX_R = MAX_R * (CARD_PITCH / 6) * 1.1;

// The hero's main right-side visual: the H card as a 3D field of gold dots.
// It rotates slowly by default (a gentle sway); with the cursor over it the
// card wobbles toward the pointer and nearby dots glow. No spinning.
// Reduced motion: static front-facing render (glow still follows the cursor).

const REVEAL_MS = 1500;
const SWAY = 0.3; // default slow rotation amplitude
const WOBBLE_Y = 0.24; // cursor-follow lean, horizontal
const WOBBLE_X = 0.16; // cursor-follow tilt, vertical
const BASE_TILT = 0.06;

export function DotScene({ className }: { className?: string }) {
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
    // Dots render offscreen; the main canvas composites them once sharp and
    // once blurred-additive — a very slight bloom that softens dot edges.
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;
    let cx = 0;
    let cy = 0;
    let hitR = 0;
    let rotY = 0;
    let tiltX = BASE_TILT;
    let mouse: { x: number; y: number } | null = null;
    let revealStart: number | null = null;

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
      off.width = canvas.width;
      off.height = canvas.height;
      offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // The card is the main element: ~84% of the height, capped by width
      // so it never clips inside the layout frame on wide displays.
      const aspect = img.naturalWidth / img.naturalHeight;
      const cardH = Math.min(height * 0.84, (width * 0.92) / aspect);
      const cardW = cardH * aspect;
      const cols = Math.max(8, Math.floor(cardW / CARD_PITCH));
      const rows = Math.max(8, Math.floor(cardH / CARD_PITCH));
      // Ink trace + a dim trace of the card's silhouette edge
      dots = toDots3(
        [...sampleImage(img, cols, rows, "mask"), ...sampleAlphaEdge(img, cols, rows)],
        cols,
        rows,
        CARD_PITCH,
        0,
      );
      cx = width * 0.52;
      cy = height * 0.485;
      hitR = Math.max(cardW, cardH) * 0.55;
    };

    const step = (t: number) => {
      if (mouse && !reduced) {
        // Wobble toward the cursor
        const nx = Math.max(-1, Math.min(1, (mouse.x - cx) / hitR));
        const ny = Math.max(-1, Math.min(1, (mouse.y - cy) / hitR));
        rotY += (nx * WOBBLE_Y - rotY) * 0.07;
        tiltX += (BASE_TILT + ny * WOBBLE_X - tiltX) * 0.07;
        return;
      }
      tiltX += (BASE_TILT - tiltX) * 0.05;
      if (reduced) {
        rotY += (0 - rotY) * 0.1;
        return;
      }
      // Default: rotate slowly back and forth
      rotY += (Math.sin(t * 0.4) * SWAY - rotY) * 0.03;
    };

    const frame = (now: number) => {
      if (revealStart === null) revealStart = now;
      step(now / 1000);
      offCtx.clearRect(0, 0, width, height);
      drawDots(
        offCtx,
        dots,
        {
          cx,
          cy,
          rotY,
          tiltX,
          flat: true,
          reveal: reduced ? 1 : Math.min(1, (now - revealStart) / REVEAL_MS),
          shimmer: !reduced,
          canvasHeight: height,
          mouse,
          maxR: CARD_MAX_R,
        },
        now,
      );
      // Composite: sharp pass + slight additive bloom
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(off, 0, 0, width, height);
      ctx.save();
      ctx.filter = "blur(4px)";
      ctx.globalAlpha = 0.4;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(off, 0, 0, width, height);
      ctx.restore();
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      build();
      raf = requestAnimationFrame(frame);
    };
    if (img.complete && img.naturalWidth) start();
    else img.onload = start;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => {
      mouse = null;
    };

    const onResize = () => build();
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 50%, black 60%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 75% 75% at 50% 50%, black 60%, transparent 100%)",
      }}
    />
  );
}
