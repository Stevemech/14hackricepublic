"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

// September 11, 2026 00:00, Houston (CDT)
const TARGET = new Date("2026-09-11T00:00:00-05:00").getTime();

interface Parts {
  days: string;
  hours: string;
  mins: string;
  secs: string;
}

function partsAt(now: number): Parts {
  const d = Math.max(0, TARGET - now);
  return {
    days: String(Math.floor(d / 86400000)).padStart(2, "0"),
    hours: String(Math.floor((d % 86400000) / 3600000)).padStart(2, "0"),
    mins: String(Math.floor((d % 3600000) / 60000)).padStart(2, "0"),
    secs: String(Math.floor((d % 60000) / 1000)).padStart(2, "0"),
  };
}

function Digit({ value, animate }: { value: string; animate: boolean }) {
  return (
    // Fixed width: DotGothic16 isn't strictly monospace, so the cell is
    // pinned to keep the readout from jittering every second.
    <span className="relative block h-[1.4em] w-[1.6em] overflow-hidden text-center text-[clamp(1.5rem,2.2vw,2.6rem)] text-gold-bright">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={animate ? { y: "-100%", opacity: 0 } : false}
          animate={{ y: "0%", opacity: 1 }}
          exit={animate ? { y: "100%", opacity: 0 } : undefined}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className="block leading-[1.4em]"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/** "Shuffling the deck in" — live countdown styled as a technical readout. */
export function Countdown() {
  const reduced = useReducedMotion();
  const [parts, setParts] = useState<Parts | null>(null);

  useEffect(() => {
    const update = () => setParts(partsAt(Date.now()));
    const raf = requestAnimationFrame(update); // first paint, async per lint rule
    const id = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, []);

  const cells: Array<[keyof Parts, string]> = [
    ["days", "Days"],
    ["hours", "Hrs"],
    ["mins", "Min"],
    ["secs", "Sec"],
  ];

  return (
    <div>
      <div className="mb-2 flex items-center gap-2 opacity-80">
        <span aria-hidden="true" className="font-dot text-[9px] text-gold">
          ◇
        </span>
        <span className="font-dot text-[clamp(10px,0.85vw,15px)] tracking-[0.3em] text-gold uppercase">
          Shuffling the deck in
        </span>
        <div className="h-px w-8 bg-gold/60" aria-hidden="true" />
      </div>
      <div
        className="font-dot flex items-start gap-1 lg:gap-2"
        role="timer"
        aria-label="Countdown to HackRice 16, September 11 2026"
      >
        {cells.map(([key, label], i) => (
          <div key={key} className="flex items-start gap-1 lg:gap-2">
            {i > 0 && (
              <span
                aria-hidden="true"
                className="text-[clamp(1.5rem,2.2vw,2.6rem)] leading-[1.4em] text-gold/40"
              >
                :
              </span>
            )}
            <div>
              {parts ? (
                <Digit value={parts[key]} animate={!reduced} />
              ) : (
                <span className="block h-[1.4em] w-[1.6em] text-center text-[clamp(1.5rem,2.2vw,2.6rem)] leading-[1.4em] text-gold/40">
                  --
                </span>
              )}
              <p className="mt-0.5 text-center text-[clamp(9px,0.7vw,12px)] tracking-[0.25em] text-stone-500 uppercase">
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
