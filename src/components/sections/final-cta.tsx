import { ScrollReveal } from "@/components/scroll-reveal";

// Climax CTA before the footer — repeats the two real links from the hero.

export function FinalCta() {
  return (
    <section className="relative border-t border-gold/20 py-20 lg:py-24" aria-label="Sign up">
      <div className="container mx-auto max-w-3xl px-6 text-center lg:px-8">
        <ScrollReveal variant="zoom">
          <p
            aria-hidden="true"
            className="font-dot mb-4 text-[clamp(11px,0.85vw,15px)] tracking-[0.3em]"
          >
            <span className="text-gold/60">♠ </span>
            <span className="text-crimson-bright/60">♥</span>
            <span className="text-stone-500"> THE TABLE IS SET </span>
            <span className="text-crimson-bright/60">♦ </span>
            <span className="text-gold/60">♣</span>
          </p>
          <h2 className="font-dot mb-2 text-[clamp(1.4rem,2.4vw,2.6rem)] tracking-[0.15em] text-gold-bright uppercase">
            JackRice 16
          </h2>
          <p className="font-dot mb-8 text-[clamp(11px,0.9vw,16px)] tracking-[0.25em] text-stone-400">
            SEPTEMBER 11–13, 2026 · RICE UNIVERSITY
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row lg:gap-4">
            <a
              href="https://forms.gle/SaYxSKi4YE2BBMQW8"
              target="_blank"
              rel="noopener noreferrer"
              className="group font-dot relative border border-gold-bright bg-transparent px-6 py-2.5 text-[clamp(12px,0.95vw,17px)] text-gold-bright uppercase transition-all duration-200 hover:bg-gold-bright hover:text-felt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright lg:px-8 lg:py-3"
            >
              <span className="absolute -top-1 -left-1 hidden h-2 w-2 border-t border-l border-gold-bright opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
              <span className="absolute -right-1 -bottom-1 hidden h-2 w-2 border-r border-b border-gold-bright opacity-0 transition-opacity group-hover:opacity-100 lg:block" />
              JackRice 16 Interest Form
            </a>
            <a
              href="https://linktr.ee/hackrice"
              target="_blank"
              rel="noopener noreferrer"
              className="font-dot border border-gold/60 bg-transparent px-6 py-2.5 text-[clamp(12px,0.95vw,17px)] text-gold uppercase transition-all duration-200 hover:bg-gold hover:text-felt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright lg:px-8 lg:py-3"
            >
              Applications Open Soon!
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
