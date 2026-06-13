"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "♠♥♦♣█▓▒░═║╔╗╚╝";

/**
 * Scramble-resolve effect for ASCII art. SSR renders the final art (content is
 * never hidden); after mount the glyphs shuffle and resolve left-to-right.
 * Respects prefers-reduced-motion by never scrambling.
 */
export function useScramble(finalText: string, durationMs = 1400, delayMs = 0) {
  const reduced = useReducedMotion();
  // null = settled (show the final art). Only the animation sets a value.
  const [scrambled, setScrambled] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let start: number | null = null;
    const lines = finalText.split("\n");
    const maxLen = Math.max(...lines.map((l) => l.length));

    const tick = (now: number) => {
      if (start === null) start = now + delayMs;
      const t = (now - start) / durationMs;
      if (t >= 1) {
        setScrambled(null);
        return;
      }
      if (t >= 0) {
        // Resolve columns left → right with a noisy edge, like a card sliding
        // out of a shuffle.
        const edge = t * (maxLen + 14);
        setScrambled(
          lines
            .map((line, y) =>
              line
                .split("")
                .map((ch, x) => {
                  if (ch === " ") return " ";
                  const noise = ((x * 7 + y * 13) % 14) - 7;
                  return x + noise < edge
                    ? ch
                    : GLYPHS[(x * 31 + y * 17 + ((now / 90) | 0) * 7) % GLYPHS.length];
                })
                .join(""),
            )
            .join("\n"),
        );
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      setScrambled(null);
    };
  }, [finalText, durationMs, delayMs, reduced]);

  return { text: scrambled ?? finalText, done: scrambled === null };
}
