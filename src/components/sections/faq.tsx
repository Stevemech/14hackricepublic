import { SectionShell } from "@/components/section-shell";
import { ScrollReveal } from "@/components/scroll-reveal";

// 006 — Frequently Asked Questions. Copy carried verbatim from the legacy
// site. Always-open cards on an equal-height grid; suit pips rotate
// ♠ ♥ ♦ ♣ across the items (decorative only).

const SUITS = [
  { glyph: "♠", color: "text-gold" },
  { glyph: "♥", color: "text-crimson-bright" },
  { glyph: "♦", color: "text-crimson-bright" },
  { glyph: "♣", color: "text-gold" },
] as const;

interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

const FAQS: FaqItem[] = [
  {
    question: "How long is HackRice?",
    answer: (
      <>
        The event runs from Friday, September 11th through Sunday, September
        13th, 2026. You&apos;ll have a full, uninterrupted 36 hours of
        relentless creation, collaboration, and building.
      </>
    ),
  },
  {
    question: "Who can participate?",
    answer: (
      <>
        Any current undergraduate student over the age of 18 is eligible to
        apply to HackRice. Since we are an MLH member event, participants must
        also accept the{" "}
        <a
          href="https://mlh.io/code-of-conduct"
          target="_blank"
          rel="noopener noreferrer"
          className="link-glow font-semibold text-gold-bright underline decoration-gold/50 underline-offset-4 transition-colors duration-200 hover:text-gold-bright hover:decoration-gold-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright"
        >
          MLH Code of Conduct
        </a>
        .
      </>
    ),
  },
  {
    question: "How many hackers attend, and where from?",
    answer: (
      <>
        Last year, we hosted 400 bright minds from Rice &amp; all over the
        world. This year, we&apos;re raising the stakes and aiming to expand
        our table to welcome up to 800 hackers!
      </>
    ),
  },
  {
    question: "What are the acceptance criteria?",
    answer: (
      <>
        All Rice students are guaranteed acceptance. For Non-Rice students, we
        ask for some background information so that we can invite people who
        have demonstrated interest and skill. Above all else, we&apos;re
        looking for passion and excitement!
      </>
    ),
  },
  {
    question: "How many hackers per team?",
    answer: (
      <>
        Teams can range from 1 to 4 hackers. Whether you prefer running solo
        or assembling a full crew of four, you&apos;re perfectly clear to
        compete.
      </>
    ),
  },
  {
    question: "What if I don't have a team beforehand?",
    answer: (
      <>
        You don&apos;t have to form a team before the event, or at all. At the
        start of the event, we will provide plenty of time to break out and
        form a new one if you choose to.
      </>
    ),
  },
  {
    question: "What do I need to bring?",
    answer: (
      <>
        Please bring a student and legal ID so we can verify and register you
        on-site! You&apos;ll also need to bring a computer, whatever software
        you feel might be necessary for development. We also recommend that
        you bring power strips for convenience. Teammates are free to share
        equipment with each other.
      </>
    ),
  },
  {
    question: "What if I'm not very experienced?",
    answer: (
      <>
        We do our best to point people in the right direction and use tools
        and languages with a low barrier to entry. You will have access to our
        mentors and the HackRice team at all times! We will also be having
        workshops the week before the hackathon!
      </>
    ),
  },
  {
    question: "Can Rice alumni attend?",
    answer: (
      <>
        Yes! Rice alumni are welcome to attend to build projects or mentor
        current students. Just note that teams featuring alumni submissions
        will not be eligible to take home official hackathon prizes.
      </>
    ),
  },
  {
    question: "Do you offer travel stipends?",
    answer: (
      <>
        We do! This is what the majority of our budget goes towards. Make sure
        to keep an eye on our pages and check back closer to July to see the
        final status of travel reimbursements.
      </>
    ),
  },
];

export function FaqSection() {
  return (
    <SectionShell id="faq" number="006" title="Frequently Asked Questions">
      <div className="grid auto-rows-fr items-stretch gap-4 md:grid-cols-2">
        {FAQS.map((item, i) => {
          const suit = SUITS[i % SUITS.length];
          return (
            <ScrollReveal key={item.question} delay={(i % 2) * 0.08} className="h-full">
              <div className="flex h-full flex-col border border-gold/40 bg-felt-raised/50 px-5 py-4 transition-colors duration-300 hover:border-gold/60">
                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className={`font-dot text-[clamp(0.85rem,1vw,1.1rem)] ${suit.color}`}
                  >
                    {suit.glyph}
                  </span>
                  <h3 className="font-dot flex-1 text-[clamp(0.9rem,1vw,1.1rem)] leading-snug font-semibold text-gold-bright">
                    {item.question}
                  </h3>
                </div>
                <p className="font-dot mt-3 pl-[1.6em] text-[clamp(0.82rem,0.9vw,1rem)] leading-relaxed text-stone-300">
                  {item.answer}
                </p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      <ScrollReveal delay={0.15}>
        <p className="font-dot mt-12 text-center text-[clamp(0.8rem,0.9vw,1.05rem)] text-stone-500">
          Still holding questions in your hand? Drop us a line anytime at{" "}
          <a
            href="mailto:hack@rice.edu"
            className="text-gold underline-offset-4 transition-colors duration-200 hover:text-gold-bright hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright"
          >
            hack@rice.edu
          </a>
          .
        </p>
      </ScrollReveal>
    </SectionShell>
  );
}
