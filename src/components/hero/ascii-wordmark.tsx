"use client";

import { useMemo } from "react";

// ANSI Shadow art is two-layer: solid blocks (the letter) + box-drawing
// "shadow" strokes. Coloring them separately is what makes it read crisply —
// a single flat color (or background-clip gradient) merges them into mush.
const BLOCK_CHARS = new Set(["█", "▓", "▒", "░"]);

// Foil gradient faked as per-row shades (bright top → deep bottom) so each
// glyph stays a solid, crisp color.
const ROW_SHADES = ["#F2D285", "#ECC771", "#E5BB5D", "#DDAE4A", "#D4A039", "#C3922E"];
// Shadow strokes sit just above the felt — present, but never competing
// with the block silhouette.
const SHADOW_COLOR = "#4A3814";

// Terminal cells are ~2:1 tall; browser mono at line-height 1 is ~1.67:1.
// Stretching restores the proportions figlet art was drawn for (and keeps
// block rows fused — larger line-height would open striping gaps instead).
const STRETCH = 1.28;

interface Run {
  text: string;
  block: boolean;
}

function toRuns(line: string): Run[] {
  const runs: Run[] = [];
  for (const ch of line) {
    const block = BLOCK_CHARS.has(ch) || ch === " ";
    const last = runs[runs.length - 1];
    // Spaces extend whichever run they're next to — they render nothing.
    if (last && (last.block === block || ch === " ")) last.text += ch;
    else runs.push({ text: ch, block });
  }
  return runs;
}

export function AsciiWordmark({ text, className }: { text: string; className?: string }) {
  const lines = useMemo(() => text.trimEnd().split("\n").map(toRuns), [text]);
  return (
    <pre
      aria-hidden="true"
      className={`font-ascii leading-none select-none ${className ?? ""}`}
      style={{
        transform: `scaleY(${STRETCH})`,
        transformOrigin: "top center",
        // scaleY is visual-only; reserve the extra height it paints into.
        marginBottom: `${(lines.length * (STRETCH - 1)).toFixed(2)}em`,
        filter: "drop-shadow(0 0 16px rgba(227,184,90,0.3))",
      }}
    >
      {lines.map((runs, row) => (
        <div key={row}>
          {runs.map((run, i) => (
            <span
              key={i}
              style={{
                color: run.block ? (ROW_SHADES[row] ?? ROW_SHADES[ROW_SHADES.length - 1]) : SHADOW_COLOR,
              }}
            >
              {run.text}
            </span>
          ))}
        </div>
      ))}
    </pre>
  );
}
