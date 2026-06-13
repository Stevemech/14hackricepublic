import { SectionShell } from "@/components/section-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

// 003 — Event schedule. PLACEHOLDER: the real timetable is pending, so no
// schedule items are rendered. Copy carried verbatim from the legacy site.

const RAIL_SUITS = ["♣", "♦", "♠", "♥"] as const;

/** Thin ambient column of suit glyphs for the far margins (xl+ only). */
function SuitRail({ side }: { side: "left" | "right" }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 hidden flex-col items-center justify-center gap-7 select-none xl:flex ${
        side === "left" ? "left-6" : "right-6"
      }`}
    >
      {Array.from({ length: 5 }).map((_, row) =>
        RAIL_SUITS.map((suit, i) => (
          <span
            key={`${row}-${i}`}
            className={`font-dot text-[clamp(11px,0.8vw,14px)] leading-none ${
              suit === "♥" || suit === "♦"
                ? "text-crimson-bright/20"
                : "text-gold/20"
            }`}
          >
            {suit}
          </span>
        )),
      )}
    </div>
  );
}

export function ScheduleSection() {
  return (
    <SectionShell id="schedule" number="003" title="Event Schedule">
      <SuitRail side="left" />
      <SuitRail side="right" />

      <ScrollReveal delay={0.1} variant="zoom">
        <div className="relative mx-auto max-w-3xl overflow-hidden border border-gold/30 bg-felt-raised/60 px-7 py-12 text-center lg:px-12 lg:py-16">
          {/* Corner ticks (hero button language) */}
          <span
            aria-hidden="true"
            className="absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-gold-bright"
          />
          <span
            aria-hidden="true"
            className="absolute -right-px -bottom-px h-3 w-3 border-r-2 border-b-2 border-gold-bright"
          />

          {/* Oversized suit watermark behind the copy */}
          <span
            aria-hidden="true"
            className="font-dot pointer-events-none absolute inset-0 flex items-center justify-center text-[clamp(14rem,28vw,22rem)] leading-none text-crimson-bright/[0.07] select-none"
          >
            ♦
          </span>

          <div className="relative">
            <p
              aria-hidden="true"
              className="font-dot mb-5 text-[clamp(0.9rem,1vw,1.1rem)] tracking-[0.5em]"
            >
              <span className="text-gold/60">♠ </span>
              <span className="text-crimson-bright/60">♥</span>
              <span className="text-crimson-bright/60"> ♦ </span>
              <span className="text-gold/60">♣</span>
            </p>

            <h3 className="font-dot mb-5 text-[clamp(1.15rem,1.6vw,1.7rem)] tracking-[0.14em] text-gold-bright uppercase">
              Shuffling the Timetable
            </h3>

            <p className="font-dot mx-auto mb-9 max-w-xl text-[clamp(0.85rem,1vw,1.15rem)] leading-relaxed text-stone-400">
              We are fine-tuning the itinerary to ensure you get the absolute
              most out of your 36 hours. The full breakdown of workshops,
              meals, and speaker panels will be dealt out soon!
            </p>

            {/* Status pill — global CSS freezes the pulse under reduced motion */}
            <p role="status">
              <span className="font-dot inline-flex animate-pulse items-center gap-3 rounded-full border border-gold/60 px-5 py-2 text-[clamp(10px,0.8vw,13px)] tracking-[0.25em] text-gold uppercase">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-gold-bright"
                />
                Full Schedule Pending
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full bg-gold-bright"
                />
              </span>
            </p>
          </div>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
