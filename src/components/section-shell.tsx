import { ScrollReveal } from "@/components/scroll-reveal";
import { Typewriter } from "@/components/motion/typewriter";

/**
 * Standard section wrapper: gold hairline top, numbered terminal header row
 * (`NNN ── TITLE ──── ♠ ♥ ♦ ♣`), capped container. Hero is 001; sections
 * count up from 002.
 */
export function SectionShell({
  id,
  number,
  title,
  children,
  className,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative border-t border-gold/20 py-20 lg:py-28 ${className ?? ""}`}
    >
      <div className="container mx-auto max-w-6xl px-6 lg:px-8">
        <ScrollReveal>
          <div className="mb-10 flex items-center gap-3 lg:mb-14">
            <span className="font-dot text-[clamp(10px,0.8vw,14px)] text-stone-500">
              {number}
            </span>
            <div aria-hidden="true" className="h-px w-8 bg-gold/60" />
            <h2 className="font-dot text-[clamp(1.25rem,2vw,2.1rem)] tracking-[0.18em] text-gold-bright uppercase">
              <Typewriter text={title} charMs={32} />
            </h2>
            <div aria-hidden="true" className="h-px flex-1 bg-gold/25" />
            <span
              aria-hidden="true"
              className="hidden font-dot text-[clamp(9px,0.7vw,12px)] tracking-widest lg:inline"
            >
              <span className="text-gold/50">♠ </span>
              <span className="text-crimson-bright/50">♥ ♦ </span>
              <span className="text-gold/50">♣</span>
            </span>
          </div>
        </ScrollReveal>
        {children}
      </div>
    </section>
  );
}
