// Styled as the 21st.dev hero-ascii top header bar (hairline border, dotted
// wordmark), gold/grey palette, carrying the real site navigation.

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#schedule", label: "Schedule" },
  { href: "#tracks", label: "Tracks" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#faq", label: "FAQ" },
  { href: "#team", label: "Team" },
];

export function SiteNav() {
  return (
    <nav className="fixed top-0 left-0 z-40 w-full border-b border-gold/20 bg-felt/85 backdrop-blur-md">
      {/* Right padding clears the fixed MLH badge zone (right:50px + up to 100px wide) */}
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:pr-40 lg:px-8 lg:py-4 lg:pr-44">
        <a
          href="#top"
          className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright lg:gap-4"
        >
          <span className="font-dot text-[clamp(1.15rem,1.5vw,1.7rem)] tracking-[0.18em] text-gold-bright">
            JACKRICE 16
          </span>
          <span aria-hidden="true" className="h-3.5 w-px bg-gold/40 lg:h-5" />
          <span className="font-dot text-[clamp(8px,0.65vw,12px)] tracking-[0.2em] text-stone-500">
            SEPT 11–13 2026
          </span>
        </a>

        <div className="flex items-center gap-3 lg:gap-7">
          <div className="hidden items-center gap-5 md:flex lg:gap-7">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-dot text-[clamp(12px,0.9vw,16px)] tracking-[0.15em] text-stone-400 uppercase transition-colors duration-200 hover:text-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright"
              >
                {link.label}
              </a>
            ))}
          </div>
          {/* Hidden on mobile: the fixed MLH badge occupies this corner under 768px */}
          <a
            href="https://linktr.ee/hackrice"
            target="_blank"
            rel="noopener noreferrer"
            className="font-dot hidden border border-gold/60 px-3.5 py-2 text-[clamp(11px,0.8vw,14px)] tracking-[0.1em] text-gold-bright uppercase transition-all duration-200 hover:bg-gold hover:text-felt focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright md:block"
          >
            Applications Open Soon!
          </a>
        </div>
      </div>
    </nav>
  );
}
