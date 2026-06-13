"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Per-letter wave bounce, looping with a pause between waves.
 * Reduced motion: plain static text.
 */
export function BounceText({ text, className }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <span className={className}>{text}</span>;
  }
  return (
    <span className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="inline-block"
          animate={{ y: [0, -7, 0] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            repeatDelay: 1.6,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        >
          {ch === " " ? " " : ch}
        </motion.span>
      ))}
    </span>
  );
}
