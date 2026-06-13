import HeroAscii from "@/components/ui/hero-ascii";
import { MobileIntro } from "@/components/hero/mobile-intro";
import { SiteNav } from "@/components/site-nav";
import { MlhBadge } from "@/components/mlh-badge";
import { AboutSection } from "@/components/sections/about";
import { ScheduleSection } from "@/components/sections/schedule";
import { TracksSection } from "@/components/sections/tracks";
import { SponsorsSection } from "@/components/sections/sponsors";
import { FaqSection } from "@/components/sections/faq";
import { TeamSection } from "@/components/sections/team";
import { FinalCta } from "@/components/sections/final-cta";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <div id="top" className="flex flex-1 flex-col">
      <a
        href="#main"
        className="sr-only z-[100] rounded-md bg-gold-bright px-4 py-2 font-bold text-felt focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Skip to main content
      </a>
      <MlhBadge />
      <SiteNav />
      <MobileIntro />
      <main id="main" className="flex-1">
        <HeroAscii />
        <AboutSection />
        <ScheduleSection />
        <TracksSection />
        <SponsorsSection />
        <FaqSection />
        <TeamSection />
        <FinalCta />
      </main>
      <footer className="border-t border-gold/20 bg-felt py-10">
        <div className="font-dot container mx-auto flex flex-col items-center justify-between gap-6 px-6 md:flex-row lg:px-8">
          <p className="text-[clamp(11px,0.8vw,14px)] text-stone-500">
            &copy; 2026 HackRice. All Rights Reserved.
          </p>
          <ScrollReveal variant="zoom" className="max-w-xl">
          <figure className="text-center md:text-right">
            <blockquote className="text-[clamp(11px,0.85vw,15px)] text-gold/70">
              &ldquo;Life is not always a matter of holding good cards, but
              sometimes, playing a poor hand well.&rdquo;
            </blockquote>
            <figcaption className="mt-1 text-[clamp(10px,0.7vw,12px)] tracking-[0.2em] text-stone-500 uppercase">
              — Jack London
            </figcaption>
          </figure>
          </ScrollReveal>
        </div>
      </footer>
    </div>
  );
}
