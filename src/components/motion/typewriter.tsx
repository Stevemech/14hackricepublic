"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

/**
 * Terminal-style typing with a blinking block caret. The final text width is
 * reserved up front (invisible copy underneath) so nothing reflows while it
 * types. Screen readers get the full text immediately; reduced motion skips
 * the typing entirely.
 */
export function Typewriter({
  text,
  className,
  charMs = 26,
  startDelay = 0,
  keepCaret = false,
}: {
  text: string;
  className?: string;
  charMs?: number;
  startDelay?: number;
  /** Keep the caret blinking after typing finishes (otherwise it fades out) */
  keepCaret?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(0);
  const done = shown >= text.length;

  useEffect(() => {
    if (!inView || reduced) return;
    let i = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    const timer = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= text.length && interval) clearInterval(interval);
      }, charMs);
    }, startDelay * 1000);
    return () => {
      clearTimeout(timer);
      if (interval) clearInterval(interval);
    };
  }, [inView, reduced, text, charMs, startDelay]);

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span ref={ref} className={`relative inline-block ${className ?? ""}`}>
      {/* Reserve the final footprint so typing never shifts layout */}
      <span className="invisible" aria-hidden="true">
        {text}▌
      </span>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="absolute inset-0">
        {text.slice(0, shown)}
        <span
          className={`caret-blink ${
            done && !keepCaret ? "transition-opacity duration-700 !opacity-0" : ""
          }`}
        >
          ▌
        </span>
      </span>
    </span>
  );
}
