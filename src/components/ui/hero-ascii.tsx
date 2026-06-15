"use client";

// Adapted from 21st.dev "hero-ascii" (reapollo) — installed via
//   npx shadcn@latest add "https://21st.dev/r/reapollo/hero-ascii"
// Structure mirrors the original (left content column, rule lines, dither
// strip, dot row, outline buttons, technical bottom strip, corner frames),
// recolored gold/grey with dot-matrix type. The visual centerpiece is the
// H card + "16" chip rendered as interactive dot fields. Layout lives in a
// capped frame so ultrawide monitors keep the composition cohesive.

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DotScene } from "@/components/hero/dot-scene";
import { DotText } from "@/components/hero/dot-text";
import { Countdown } from "@/components/hero/countdown";
import { Typewriter } from "@/components/motion/typewriter";

const EASE = [0.16, 1, 0.3, 1] as const;

// Footer ticker quips — half poker table, half terminal. Rotates so the strip
// rewards a second look instead of just restating facts already on the page.
const QUIPS = [
  "sudo deal me in",
  "P(sleep) → 0.00",
  "all-in on caffeine",
  "the house always renders",
  "while (awake) { hack(); }",
  "git push --force (it's the flop)",
  "EV positive, sleep negative",
  "404: sleep not found",
  "may your builds compile",
  "npm install victory",
  "stack the deck, not the trace",
  "// TODO: win hackathon",
];

// One rotating quip slot. SSR-safe: first paint is deterministic (index 0 +
// offset), the interval only advances client-side after mount.
function QuipTicker({ offset = 0, className }: { offset?: number; className?: string }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setI((n) => (n + 1) % QUIPS.length), 3800);
    return () => clearInterval(id);
  }, [reduced]);
  const quip = QUIPS[(i + offset) % QUIPS.length];
  return (
    <span className={`relative inline-block ${className ?? ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={quip}
          initial={reduced ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -5 }}
          transition={{ duration: 0.3 }}
          className="block whitespace-nowrap text-gold/70"
        >
          {quip}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Reveal({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroAscii() {
  return (
    <section className="relative h-dvh overflow-hidden bg-felt felt-texture">
      {/* Top corner frame accents — framing the top of the viewport. The
          bottom of the composition is capped by the footer strip below. */}
      <div aria-hidden="true">
        <div className="absolute top-20 left-0 z-20 h-8 w-8 border-t-2 border-l-2 border-gold/30 lg:h-12 lg:w-12" />
        <div className="absolute top-20 right-0 z-20 h-8 w-8 border-t-2 border-r-2 border-gold/30 lg:h-12 lg:w-12" />
      </div>

      {/* Layout frame: caps the composition so ultrawide stays cohesive */}
      <div className="relative mx-auto min-h-dvh w-full max-w-[100rem]">
        {/* The H card — the main right-side element — hidden on mobile */}
        <div className="absolute inset-0 hidden h-full w-full lg:block">
          <DotScene className="absolute inset-y-0 right-0 h-full w-[50%]" />
        </div>

        {/* pointer-events pass through to the card canvas except on real content */}
        <div className="pointer-events-none relative z-10 mt-[4vh] flex min-h-dvh items-center pt-20 lg:pt-0">
          <div className="w-full px-6 lg:ml-[7%] lg:max-w-[46%] lg:px-10">
            <div className="hero-content-fit pointer-events-auto relative">
              {/* Top decorative line — the real eyebrow instead of "001" */}
              <Reveal delay={0.05}>
                <div className="mb-3 flex items-center gap-2 opacity-80 lg:mb-4">
                  <div className="h-px w-8 bg-gold" />
                  <Typewriter
                    text="Rice University's 16th Annual Hackathon"
                    className="font-dot text-[clamp(10px,0.8vw,15px)] tracking-wider text-gold uppercase"
                    startDelay={0.4}
                    keepCaret
                  />
                  <div className="h-px flex-1 bg-gold/60" />
                </div>
              </Reveal>

              {/* Title in dots (same engine as the card) */}
              <Reveal delay={0.15}>
                <h1 className="sr-only">
                  JackRice 16 — Rice University&apos;s 16th Annual Hackathon
                </h1>
                <div className="relative mb-3 lg:mb-5">
                  <div className="dither-pattern absolute top-0 bottom-0 -left-3 hidden w-1 opacity-40 lg:block" />
                  <DotText lines={["JACKRICE", "SIXTEEN"]} />
                </div>
              </Reveal>

              {/* Decorative dots pattern — desktop only */}
              <Reveal delay={0.25}>
                <div className="mb-4 hidden gap-1 opacity-40 lg:flex" aria-hidden="true">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="h-0.5 w-0.5 rounded-full bg-gold-bright" />
                  ))}
                </div>
              </Reveal>

              {/* Date + description with technical corner accent */}
              <Reveal delay={0.35}>
                <p className="font-dot mb-2 text-[clamp(12px,1.05vw,18px)] tracking-[0.25em] text-gold-bright">
                  SEPTEMBER 11–13, 2026
                </p>
                <div className="relative">
                  <p className="font-dot mb-5 max-w-[46ch] text-[clamp(0.85rem,1.05vw,1.25rem)] leading-relaxed text-stone-400 lg:mb-7">
                    Join 800+ of the brightest minds in the nation for 36 hours of
                    relentless creation, collaboration, and building!
                  </p>
                  <div
                    className="absolute top-1/2 -right-4 hidden h-3 w-3 -translate-y-1/2 border border-gold opacity-30 lg:block"
                    aria-hidden="true"
                  >
                    <div className="absolute top-1/2 left-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 bg-gold" />
                  </div>
                </div>
              </Reveal>

              {/* Buttons with technical accents */}
              <Reveal delay={0.5}>
                <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                  <a
                    href="https://forms.gle/SaYxSKi4YE2BBMQW8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group font-dot relative border border-gold-bright bg-transparent px-5 py-2.5 text-center text-[clamp(12px,0.95vw,17px)] text-gold-bright uppercase transition-all duration-200 hover:bg-gold-bright hover:text-felt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright lg:px-7 lg:py-3"
                  >
                    <span className="absolute -top-1 -left-1 hidden h-2 w-2 border-t border-l border-gold-bright opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
                    <span className="absolute -right-1 -bottom-1 hidden h-2 w-2 border-r border-b border-gold-bright opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
                    JackRice 16 Interest Form
                  </a>
                  <a
                    href="https://linktr.ee/hackrice"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-dot border border-gold/60 bg-transparent px-5 py-2.5 text-center text-[clamp(12px,0.95vw,17px)] text-gold uppercase transition-all duration-200 hover:bg-gold hover:text-felt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright lg:px-7 lg:py-3"
                  >
                    Applications Open Soon!
                  </a>
                </div>
              </Reveal>

              {/* Countdown as a technical readout */}
              <Reveal delay={0.65} className="mt-7 lg:mt-9">
                <Countdown />
              </Reveal>

              {/* Bottom technical notation — desktop only */}
              <Reveal delay={0.8}>
                <div
                  className="mt-7 hidden items-center gap-2 opacity-40 lg:flex"
                  aria-hidden="true"
                >
                  <span className="font-dot text-[clamp(9px,0.7vw,12px)] text-gold">♠</span>
                  <div className="h-px flex-1 bg-gold" />
                  <span className="font-dot text-[clamp(9px,0.7vw,12px)] tracking-[0.2em] text-gold">
                    HOUSTON.TX
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom footer strip */}
      <div className="absolute right-0 bottom-0 left-0 z-20 border-t border-gold/20 bg-felt/40 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-3 lg:px-8 lg:py-4">
          <div className="font-dot flex items-center gap-3 text-[clamp(9px,0.75vw,13px)] text-stone-500 lg:gap-6">
            <span className="hidden lg:inline">TABLE.ACTIVE</span>
            <span className="lg:hidden">TBL.ACT</span>
            <QuipTicker offset={0} className="hidden sm:inline-block" />
          </div>

          <div className="font-dot flex items-center gap-3 text-[clamp(9px,0.75vw,13px)] text-stone-500 lg:gap-5">
            <QuipTicker
              offset={Math.floor(QUIPS.length / 2)}
              className="hidden sm:inline-block"
            />
            <span aria-hidden="true" className="tracking-widest text-gold/60">
              ♠ ♥ ♦ ♣
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
