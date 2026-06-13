"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = ["♠", "♥", "♦", "♣"];
const GOLD = { r: 195, g: 146, b: 46 }; // #C3922E
const GOLD_BRIGHT = { r: 227, g: 184, b: 90 }; // #E3B85A

interface Pip {
  x: number;
  y: number;
  glyph: string;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  alpha: number;
}

/**
 * Ambient felt-table atmosphere: suit pips drifting down the screen in faint
 * gold, brightening near the cursor. Replaces the original component's hosted
 * UnicornStudio embed with a self-owned canvas we can theme and freeze.
 * Reduced motion: a single static frame is drawn — no loop, no drift.
 */
export function AsciiField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let pips: Pip[] = [];
    let width = 0;
    let height = 0;
    // Canvas fonts can't resolve CSS vars — read the computed family instead.
    let fontFamily = "monospace";
    const mouse = { x: -9999, y: -9999 };

    const seed = (p: Pip, randomY: boolean) => {
      p.x = Math.random() * width;
      p.y = randomY ? Math.random() * height : -24;
      p.glyph = GLYPHS[(Math.random() * GLYPHS.length) | 0];
      p.size = 10 + Math.random() * 14;
      p.speed = 6 + Math.random() * 18; // px per second — a lazy drift
      p.sway = 6 + Math.random() * 14;
      p.phase = Math.random() * Math.PI * 2;
      p.alpha = 0.05 + Math.random() * 0.14;
    };

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      fontFamily = getComputedStyle(canvas).fontFamily || "monospace";
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(160, Math.floor((width * height) / 16000));
      pips = Array.from({ length: count }, () => {
        const p = {} as Pip;
        seed(p, true);
        return p;
      });
    };

    const draw = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      for (const p of pips) {
        const sway = Math.sin(p.phase + elapsed * 0.0004 * p.speed) * p.sway;
        const x = p.x + sway;
        const y = p.y;
        const d = Math.hypot(x - mouse.x, y - mouse.y);
        const boost = d < 140 ? (1 - d / 140) * 0.5 : 0;
        const c = boost > 0.05 ? GOLD_BRIGHT : GOLD;
        ctx.font = `${p.size}px ${fontFamily}`;
        ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${Math.min(0.85, p.alpha + boost)})`;
        ctx.fillText(p.glyph, x, y);
      }
    };

    build();

    if (reduced) {
      // Static state: one frame, frozen.
      draw(0);
      const onResize = () => {
        build();
        draw(0);
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - last);
      last = now;
      for (const p of pips) {
        p.y += (p.speed * dt) / 1000;
        if (p.y > height + 24) seed(p, false);
      }
      draw(now);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onResize = () => build();
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
      if (!document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
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

  return <canvas ref={canvasRef} className={`font-ascii ${className ?? ""}`} aria-hidden="true" />;
}
