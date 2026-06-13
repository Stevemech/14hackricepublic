import { SectionShell } from "@/components/section-shell";
import { ScrollReveal } from "@/components/scroll-reveal";
import { BounceText } from "@/components/motion/bounce-text";

// 002 — What is HackRice? Copy carried verbatim from the legacy site.

const FACTS: Array<[string, string]> = [
  ["When", "September 11th–13th"],
  ["Where", "Rice Student Center @ Rice University"],
  ["Who", "800+ undergraduate builders & innovators"],
  ["Admission", "100% free, meals & swag included"],
];

export function AboutSection() {
  return (
    <SectionShell id="about" number="002" title="What is HackRice?">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <ScrollReveal delay={0.1}>
          <div className="font-dot space-y-4 text-[clamp(0.85rem,1vw,1.15rem)] leading-relaxed text-stone-400">
            <p>
              HackRice is Rice University&apos;s annual hackathon. It brings together
              creators, developers, and designers together under one roof to develop
              &amp; showcase their creative and entrepreneurial talents in an
              environment designed for collaboration. Teams of up to 4 form to attack
              real-world issues, building viable software or hardware solutions
              within a hyper-focused 36-hour sprint.
            </p>
            <p>
              This is an excellent opportunity for students to build a network of
              creators, receive internship &amp; job offers from world-class
              sponsors, and learn modern tools &amp; systems.
            </p>
            <p className="text-gold">
              <BounceText text="We hope to see you there!" />
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2} variant="zoom">
          <div className="relative border border-gold/30 bg-felt-raised/60 p-7 lg:p-9">
            {/* Corner ticks (hero button language) */}
            <span
              aria-hidden="true"
              className="absolute -top-px -left-px h-3 w-3 border-t-2 border-l-2 border-gold-bright"
            />
            <span
              aria-hidden="true"
              className="absolute -right-px -bottom-px h-3 w-3 border-r-2 border-b-2 border-gold-bright"
            />
            <dl className="font-dot">
              {FACTS.map(([label, value], i) => (
                <div
                  key={label}
                  className={`py-4 ${i > 0 ? "border-t border-gold/15" : "pt-0"} ${
                    i === FACTS.length - 1 ? "pb-0" : ""
                  }`}
                >
                  <dt className="mb-1 text-[clamp(10px,0.75vw,13px)] tracking-[0.3em] text-gold uppercase">
                    {label}
                  </dt>
                  <dd className="text-[clamp(0.95rem,1.1vw,1.3rem)] text-stone-300">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </SectionShell>
  );
}
