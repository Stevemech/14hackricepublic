"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HAND } from "./ascii-art";

const EASE_DEAL = [0.16, 1, 0.3, 1] as const;

// Settled fan: rotation + arc lift per card (center card proud of the rest).
const FAN = [
  { rotate: -12, y: 18 },
  { rotate: -6, y: 6 },
  { rotate: 0, y: 0 },
  { rotate: 6, y: 6 },
  { rotate: 12, y: 18 },
];

/**
 * The dealt poker hand: A♥ K♠ [16] Q♦ J♣ — the four competition tracks
 * around the 16 card. Cards fly in from the dealer's deck (top center),
 * staggered, then rest in a fan. Hover lifts a card out of the hand.
 */
export function DealtHand({ delay = 1.2 }: { delay?: number }) {
  const reduced = useReducedMotion();

  return (
    <div className="flex items-end justify-center" aria-hidden="true">
      {HAND.map((card, i) => (
        <motion.pre
          key={card.rank + card.suit}
          initial={
            reduced
              ? false
              : { opacity: 0, y: -260, x: (2 - i) * 60, rotate: (i - 2) * 30, scale: 0.7 }
          }
          animate={{
            opacity: 1,
            y: FAN[i].y,
            x: 0,
            rotate: FAN[i].rotate,
            scale: card.sixteen ? 1.06 : 1,
          }}
          transition={
            reduced
              ? { duration: 0 }
              : { duration: 0.7, delay: delay + i * 0.09, ease: EASE_DEAL }
          }
          whileHover={
            reduced ? undefined : { y: FAN[i].y - 14, rotate: 0, scale: 1.1, zIndex: 10 }
          }
          className={`-mx-2 select-none font-ascii text-[7px] leading-[1.05] sm:-mx-1.5 sm:text-[9px] md:text-[11px] ${
            card.sixteen
              ? "relative z-[5] text-gold-bright drop-shadow-[0_0_18px_rgba(227,184,90,0.45)]"
              : card.red
                ? "text-crimson-bright/90"
                : "text-gold/90"
          }`}
          style={{ transformOrigin: "50% 120%" }}
        >
          {card.art}
        </motion.pre>
      ))}
    </div>
  );
}
