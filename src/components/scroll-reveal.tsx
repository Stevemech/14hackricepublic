"use client";

import { motion, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Section-content reveal when scrolled into view (once).
 * variant "rise" — fades in rising; "zoom" — fades in scaling up.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className,
  y = 18,
  variant = "rise",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  variant?: "rise" | "zoom";
}) {
  const reduced = useReducedMotion();
  const initial =
    variant === "zoom" ? { opacity: 0, scale: 0.93, y: 10 } : { opacity: 0, y };
  return (
    <motion.div
      initial={reduced ? false : initial}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: variant === "zoom" ? 0.6 : 0.55, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
