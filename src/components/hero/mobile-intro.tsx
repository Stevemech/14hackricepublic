"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { goldShade, sampleAlphaEdge, sampleImage } from "./dot-sampling";

// Mobile-only opening: the H card materializes full-screen, dot by dot, in
// pseudo-random order; once built it holds a beat, then the page scrolls
// itself down to the hero. Hidden on lg+ and under reduced motion via CSS
// (and the effect bails), so desktop behavior is completely untouched.
// If the visitor scrolls first, the auto-scroll is cancelled.

const PITCH = 3;
const MAX_R = 1.45;
const BUILD_MS = 2100;
const POP_MS = 260;
const HOLD_MS = 550;
const SCROLL_MS = 1900; // unhurried glide down to the hero

/** rAF-driven scroll: native smooth scrolling is too quick and not tunable.
 *  Aborts the moment the visitor takes over (wheel/touch/keys). */
function glideTo(targetY: number, duration: number) {
  const startY = window.scrollY;
  const t0 = performance.now();
  let aborted = false;
  const abort = () => {
    aborted = true;
  };
  const opts = { passive: true } as const;
  window.addEventListener("wheel", abort, opts);
  window.addEventListener("touchstart", abort, opts);
  window.addEventListener("keydown", abort, opts);
  const cleanup = () => {
    window.removeEventListener("wheel", abort);
    window.removeEventListener("touchstart", abort);
    window.removeEventListener("keydown", abort);
  };
  const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
  const step = (now: number) => {
    if (aborted) return cleanup();
    const k = Math.min(1, (now - t0) / duration);
    // "instant" per frame — the page's CSS scroll-behavior:smooth would
    // otherwise re-animate every step into a crawl-then-jump.
    window.scrollTo({
      top: startY + (targetY - startY) * ease(k),
      behavior: "instant" as ScrollBehavior,
    });
    if (k < 1) requestAnimationFrame(step);
    else cleanup();
  };
  requestAnimationFrame(step);
}

interface IntroDot {
  x: number;
  y: number;
  strength: number;
  shade: number;
  appear: number; // 0..1 of BUILD_MS
  phase: number;
}

export function MobileIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas || canvas.clientWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let dots: IntroDot[] = [];
    let width = 0;
    let height = 0;
    let start: number | null = null;
    let scrollFired = false;
    let userScrolled = false;
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;

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

      const aspect = img.naturalWidth / img.naturalHeight;
      const cardW = Math.min(width * 0.94, height * 0.86 * aspect);
      const cardH = cardW / aspect;
      const ox = (width - cardW) / 2;
      const oy = (height - cardH) / 2;
      const cols = Math.max(8, Math.floor(cardW / PITCH));
      const rows = Math.max(8, Math.floor(cardH / PITCH));
      dots = [...sampleImage(img, cols, rows, "mask"), ...sampleAlphaEdge(img, cols, rows)].map(
        (d) => ({
          x: ox + d.gx * PITCH + PITCH / 2,
          y: oy + d.gy * PITCH + PITCH / 2,
          strength: d.strength,
          shade: d.shade,
          // Deterministic pseudo-random assembly order
          appear: ((d.gx * 73 + d.gy * 151) % 997) / 997,
          phase: (d.gx * 13 + d.gy * 29) % 100,
        }),
      );
    };

    const frame = (now: number) => {
      if (start === null) start = now;
      const t = now - start;
      const ts = now / 1000;

      offCtx.clearRect(0, 0, width, height);
      // Bucket by quantized color so thousands of dots stay cheap
      const buckets = new Map<number, { css: string; pts: number[] }>();
      for (const d of dots) {
        const k = Math.max(0, Math.min(1, (t - d.appear * BUILD_MS) / POP_MS));
        if (k <= 0) continue;
        const ease = 1 - Math.pow(1 - k, 3);
        const shimmer = Math.sin(ts * 1.3 + d.phase * 0.45) * 0.1;
        const r = Math.max(0.4, MAX_R * (0.22 + 0.78 * d.strength) * (0.85 + shimmer) * ease);
        const a = Math.min(1, (0.48 + d.strength * 0.52) * ease);
        const shade = Math.max(0, Math.min(1, (0.38 + d.shade * 0.58 + shimmer - 0.25) / 0.75));
        const key = Math.round(shade * 15) * 16 + Math.round(a * 15);
        let b = buckets.get(key);
        if (!b) {
          b = { css: "", pts: [] };
          buckets.set(key, b);
        }
        if (!b.css) {
          const rgb = goldShade(shade);
          b.css = rgb.replace("rgb(", "rgba(").replace(")", `,${a.toFixed(3)})`);
        }
        b.pts.push(d.x, d.y, r);
      }
      for (const b of buckets.values()) {
        offCtx.fillStyle = b.css;
        offCtx.beginPath();
        for (let i = 0; i < b.pts.length; i += 3) {
          offCtx.moveTo(b.pts[i] + b.pts[i + 2], b.pts[i + 1]);
          offCtx.arc(b.pts[i], b.pts[i + 1], b.pts[i + 2], 0, Math.PI * 2);
        }
        offCtx.fill();
      }

      // Sharp + slight bloom, matching the desktop card
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(off, 0, 0, width, height);
      ctx.save();
      ctx.filter = "blur(4px)";
      ctx.globalAlpha = 0.4;
      ctx.globalCompositeOperation = "lighter";
      ctx.drawImage(off, 0, 0, width, height);
      ctx.restore();

      // Once assembled (+ hold), glide down to the hero — unless the visitor
      // already took over scrolling.
      if (!scrollFired && t > BUILD_MS + POP_MS + HOLD_MS) {
        scrollFired = true;
        if (!userScrolled && window.scrollY < 40) {
          glideTo(section.offsetTop + section.offsetHeight, SCROLL_MS);
        }
      }
      raf = requestAnimationFrame(frame);
    };

    const startAll = () => {
      build();
      raf = requestAnimationFrame(frame);
    };
    if (img.complete && img.naturalWidth) startAll();
    else img.onload = startAll;

    const onUserScroll = () => {
      if (window.scrollY > 30) userScrolled = true;
    };
    const onResize = () => build();
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(frame);
    };
    window.addEventListener("scroll", onUserScroll, { passive: true });
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onUserScroll);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      aria-hidden="true"
      className="relative block h-dvh overflow-hidden bg-felt felt-texture motion-reduce:hidden lg:hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </section>
  );
}
