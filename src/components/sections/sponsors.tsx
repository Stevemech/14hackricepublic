import { SectionShell } from "@/components/section-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

// 005 — Sponsors. Placeholder by design: the 2026 lineup is pending, so the
// panel is an open slot (dashed border) with a sponsorship CTA. Copy carried
// verbatim from the legacy site. Do NOT add sponsor names/logos here until
// they are confirmed.

export function SponsorsSection() {
  return (
    <SectionShell id="sponsors" number="005" title="Sponsors">
      <ScrollReveal>
        <p className="font-dot mx-auto mb-12 max-w-xl text-center text-[clamp(0.8rem,0.9vw,1.05rem)] text-stone-400">
          Supporting the next generation of innovators, builders, and
          card-sharks.
        </p>
      </ScrollReveal>

      <ScrollReveal delay={0.15} variant="zoom">
        {/* Open slot at the table: dashed frame, waiting to be filled */}
        <div className="mx-auto max-w-4xl border border-dashed border-gold/40 bg-felt-raised/40 px-6 py-12 text-center lg:px-12 lg:py-16">
          <p
            aria-hidden="true"
            className="font-dot mb-5 text-[clamp(11px,0.85vw,15px)] tracking-[0.4em]"
          >
            <span className="text-gold/60">♠ </span>
            <span className="text-crimson-bright/60">♥ ♦ </span>
            <span className="text-gold/60">♣</span>
          </p>

          <h3 className="font-dot mb-4 text-[clamp(1.1rem,1.6vw,1.7rem)] tracking-[0.15em] text-gold-bright uppercase">
            Backing the Stakes
          </h3>

          <p className="font-dot mx-auto mb-9 max-w-2xl text-[clamp(0.85rem,1vw,1.15rem)] leading-relaxed text-stone-400">
            Our 2026 sponsor lineup is currently being finalized. Want to get
            your company in front of 800+ top-tier developers, designers, and
            engineers? Email us at{" "}
            <a
              href="mailto:hack@rice.edu"
              className="text-gold underline decoration-gold/40 underline-offset-4 transition-colors duration-200 hover:text-gold-bright hover:decoration-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright"
            >
              hack@rice.edu
            </a>
            !
          </p>

          <a
            href="mailto:hack@rice.edu"
            className="group font-dot relative inline-block border border-gold-bright bg-transparent px-6 py-2.5 text-[clamp(12px,0.95vw,17px)] text-gold-bright uppercase transition-all duration-200 hover:bg-gold-bright hover:text-felt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright lg:px-8 lg:py-3"
          >
            <span
              aria-hidden="true"
              className="absolute -top-1 -left-1 hidden h-2 w-2 border-t border-l border-gold-bright opacity-0 transition-opacity group-hover:opacity-100 lg:block"
            />
            <span
              aria-hidden="true"
              className="absolute -right-1 -bottom-1 hidden h-2 w-2 border-r border-b border-gold-bright opacity-0 transition-opacity group-hover:opacity-100 lg:block"
            />
            Email hack@rice.edu
          </a>
        </div>
      </ScrollReveal>
    </SectionShell>
  );
}
