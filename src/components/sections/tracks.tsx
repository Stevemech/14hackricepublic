"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionShell } from "@/components/section-shell";
import { ScrollReveal } from "@/components/scroll-reveal";
import { DotArt } from "@/components/hero/dot-art";
import { SUIT_PAINTERS } from "@/components/hero/suit-shapes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// 004 — Competition tracks, the four cards of the hand: A♥ K♠ Q♦ J♣.
// GSAP ScrollTrigger deals them out of a deck point (top center) into the
// grid. Copy carried verbatim from the legacy site.

interface Track {
  rank: string;
  suit: string;
  red: boolean;
  name: string;
  copy: string;
}

const TRACKS: Track[] = [
  {
    rank: "A",
    suit: "♥",
    red: true,
    name: "Healthcare",
    copy: "Innovations in patient outcomes, biomedical tracking, and accessible wellness technologies to promote healthspan.",
  },
  {
    rank: "K",
    suit: "♠",
    red: false,
    name: "Games & Gamification",
    copy: "Build immersive worlds, interactive mechanics, or apply game design theory to turn everyday challenges into high-stakes engagement.",
  },
  {
    rank: "Q",
    suit: "♦",
    red: true,
    name: "Finance",
    copy: "Exploring next-generation tooling, capital accessibility platforms, or small business aids for confidence & control.",
  },
  {
    rank: "J",
    suit: "♣",
    red: false,
    name: "Work & Productivity",
    copy: "Stack the deck in your favor by engineering smarter collaboration tools, slick automation platforms, and systems that optimize your daily grind.",
  },
];

function CornerPip({ track, flipped }: { track: Track; flipped?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`font-dot absolute flex flex-col items-center leading-none ${
        track.red ? "text-crimson-bright" : "text-gold"
      } ${flipped ? "right-4 bottom-4 rotate-180" : "top-4 left-4"}`}
    >
      <span className="text-sm">{track.rank}</span>
      <span className="mt-0.5 text-base">{track.suit}</span>
    </div>
  );
}

export function TracksSection() {
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const grid = gridRef.current;
      if (!grid) return;
      const cards = gsap.utils.toArray<HTMLElement>(".track-card", grid);
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card, i) => {
          gsap.from(card, {
            // Fly in from the dealer's deck: top center of the grid
            x: () => {
              const gr = grid.getBoundingClientRect();
              const cr = card.getBoundingClientRect();
              return gr.left + gr.width / 2 - (cr.left + cr.width / 2);
            },
            y: -240,
            rotation: (i - 1.5) * 16,
            opacity: 0,
            duration: 0.7,
            delay: i * 0.09,
            ease: "expo.out", // --ease-deal
            scrollTrigger: { trigger: grid, start: "top 75%", once: true },
          });
        });
      });
    },
    { scope: gridRef },
  );

  return (
    <SectionShell id="tracks" number="004" title="Competition Tracks">
      <ScrollReveal>
        <p className="font-dot mx-auto mb-12 max-w-xl text-center text-[clamp(0.8rem,0.9vw,1.05rem)] text-stone-400">
          Tailor your build toward a specific problem domain to qualify for
          category-specific prize pools.
        </p>
      </ScrollReveal>

      <div ref={gridRef} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {TRACKS.map((track) => (
          <article
            key={track.rank}
            className="track-card group relative flex flex-col border border-gold/25 bg-felt-raised/50 px-6 pt-14 pb-14 text-center transition-all duration-300 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_0_32px_rgba(227,184,90,0.12)]"
          >
            {/* Inner card frame */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-2.5 border transition-colors duration-300 ${
                track.red
                  ? "border-crimson-bright/20 group-hover:border-crimson-bright/45"
                  : "border-gold/20 group-hover:border-gold/45"
              }`}
            />
            <CornerPip track={track} />
            <CornerPip track={track} flipped />

            {/* Center pip — a symmetric vector suit traced as a dot field */}
            <DotArt
              paint={SUIT_PAINTERS[track.suit]}
              pitch={3}
              contain={0.82}
              className="mx-auto mb-4 block h-20 w-20"
            />

            <h3 className="font-dot mb-3 text-[clamp(1rem,1.1vw,1.25rem)] tracking-[0.1em] text-gold-bright uppercase">
              {track.name}
            </h3>
            <p className="font-dot text-[clamp(0.78rem,0.85vw,0.95rem)] leading-relaxed text-stone-400">
              {track.copy}
            </p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
