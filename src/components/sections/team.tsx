"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SectionShell } from "@/components/section-shell";
import { ScrollReveal, EASE } from "@/components/scroll-reveal";
import { DotArt } from "@/components/hero/dot-art";
import { FlipAvatar } from "@/components/sections/flip-avatar";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Staggered pop-in for the people grids
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

// 007 — Behind the Deck: the organizing team, dealt face-up on the felt.
// Gold corner trellises drift with a gentle GSAP scroll parallax; the
// H watermark holds the center of the table.

// linkedin: fill in each person's profile URL when ready — the flip-to-chip
// link icon already points the anchor here.
interface Director {
  name: string;
  src: string;
  linkedin?: string;
}

interface Member {
  name: string;
  role: string;
  src: string;
  linkedin?: string;
}

const DIRECTORS: Director[] = [
  { name: "Hazel Goetsch", src: "/images/hr-hazel.jpg", linkedin: "https://www.linkedin.com/in/hazel-goetsch/" },
  { name: "Jacob King", src: "/images/hr-jacob.jpg", linkedin: "https://www.linkedin.com/in/jacob-l-king/" },
  { name: "Varshini Loganathan", src: "/images/hr-varshini.jpg", linkedin: "https://www.linkedin.com/in/varshini-loganathan/" },
];

const MEMBERS: Member[] = [
  { name: "Milan Cohen Camarena", role: "Public Relations", src: "/images/hr-milan.jpg", linkedin: "https://www.linkedin.com/in/milan-cohen-camarena-a4ba04384/" },
  { name: "Abena Poku", role: "Logistics", src: "/images/hr-abena.jpg", linkedin: "https://www.linkedin.com/in/abena-poku-78211935a/" },
  { name: "Saanvi Mukkara", role: "Logistics", src: "/images/hr-saanvi.jpg", linkedin: "https://www.linkedin.com/in/saanvi-mukkara/" },
  { name: "Henry Shan", role: "Tracks & Workshops", src: "/images/hr-henry.jpg", linkedin: "https://www.linkedin.com/in/henry-shan-04185a380/" },
  { name: "Oscar Pan", role: "Tracks & Workshops", src: "/images/hr-oscar.png", linkedin: "https://www.linkedin.com/in/oscar-pan-b58991340/" },
  { name: "Sophia Chen", role: "Tracks & Workshops", src: "/images/hr-sophia.jpg", linkedin: "https://www.linkedin.com/in/sophiaschen88/" },
  { name: "Jacqueline Chung", role: "Industry Outreach", src: "/images/hr-jacqueline.jpg", linkedin: "https://www.linkedin.com/in/jacqueline-chung-7a93b0330/" },
  { name: "Sanjana Dabbiru", role: "Design Team", src: "/images/hr-sanjana.jpg", linkedin: "https://www.linkedin.com/in/sanjana-iru/" },
  // Tony has no LinkedIn yet — left blank so his portrait stays static (no
  // flip/chip). Add a URL here to restore the poker-chip animation.
  { name: "Tony Martinez", role: "Design Team", src: "/images/hr-tony.jpg", linkedin: "" },
  { name: "Steve Zhang", role: "Design Team", src: "/images/hr-steve.jpg", linkedin: "https://www.linkedin.com/in/stevezhangsandiego" },
];

// Corner trellises (legacy art). Bottom pair reuses the opposite top asset
// rotated 180deg so the scrollwork mirrors inward. Top pair drifts down,
// bottom pair drifts up (parallax handled by GSAP below).
const TRELLISES: Array<{ src: string; pos: string; rotated: boolean; drift: number }> = [
  { src: "/images/hr-trellis-left.png", pos: "top-0 left-0", rotated: false, drift: 12 },
  { src: "/images/hr-trellis-right.png", pos: "top-0 right-0", rotated: false, drift: 12 },
  { src: "/images/hr-trellis-right.png", pos: "bottom-0 left-0", rotated: true, drift: -12 },
  { src: "/images/hr-trellis-left.png", pos: "bottom-0 right-0", rotated: true, drift: -12 },
];

export function TeamSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const section = root.closest("section");
      if (!section) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".team-trellis", root).forEach((el) => {
          gsap.to(el, {
            yPercent: Number(el.dataset.drift ?? 12),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    },
    { scope: rootRef },
  );

  return (
    <SectionShell id="team" number="007" title="Behind the Deck">
      <div ref={rootRef}>
        {/* Centered H watermark on the felt */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <Image
            src="/images/Hlogo.png"
            alt=""
            width={470}
            height={609}
            className="h-auto w-72 opacity-15 md:w-[420px]"
          />
        </div>

        {/* Gold corner trellises (parallax) */}
        {TRELLISES.map((t) => (
          <div
            key={t.pos}
            aria-hidden="true"
            data-drift={t.drift}
            className={`team-trellis pointer-events-none absolute opacity-90 ${t.pos}`}
          >
            <DotArt
              src={t.src}
              pitch={4}
              contain={1}
              className={`h-36 w-36 md:h-48 md:w-48 ${t.rotated ? "rotate-180" : ""}`}
            />
          </div>
        ))}

        <div className="relative z-10">
          {/* Directors — staggered pop-in */}
          <motion.ul
            variants={listVariants}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-wrap items-start justify-center gap-10 sm:gap-14"
          >
            {DIRECTORS.map((d) => (
              <motion.li
                variants={itemVariants}
                key={d.name}
                className="group flex w-36 flex-col items-center text-center"
              >
                  <FlipAvatar src={d.src} alt={d.name} linkedin={d.linkedin} size="lg" />
                  <h3 className="font-dot mt-4 text-[clamp(0.95rem,1.05vw,1.2rem)] leading-snug text-stone-300">
                    {d.name}
                  </h3>
                  <p className="font-dot mt-1 text-[10px] tracking-[0.25em] text-gold uppercase">
                    Director
                  </p>
                </motion.li>
              ))}
          </motion.ul>

          {/* Suit-pip divider */}
          <ScrollReveal delay={0.15}>
            <div aria-hidden="true" className="my-12 flex items-center justify-center gap-4 lg:my-16">
              <span className="h-px w-16 bg-gold/20 sm:w-24" />
              <span className="font-dot text-xs tracking-[0.4em]">
                <span className="text-gold">♠ </span>
                <span className="text-crimson-bright">♥ ♦ </span>
                <span className="text-gold">♣</span>
              </span>
              <span className="h-px w-16 bg-gold/20 sm:w-24" />
            </div>
          </ScrollReveal>

          {/* Subcommittee members — staggered pop-in */}
          <motion.ul
            variants={listVariants}
            initial={reduced ? false : "hidden"}
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mx-auto grid max-w-4xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          >
            {MEMBERS.map((m) => (
              <motion.li
                variants={itemVariants}
                key={m.name}
                className="group flex flex-col items-center text-center"
              >
                  <FlipAvatar src={m.src} alt={m.name} linkedin={m.linkedin} size="sm" />
                  <h3 className="font-dot mt-3 text-[clamp(0.7rem,0.75vw,0.85rem)] leading-snug text-stone-300">
                    {m.name}
                  </h3>
                  <p className="font-dot mt-1 text-[10px] text-stone-500">{m.role}</p>
                </motion.li>
              ))}
          </motion.ul>
        </div>
      </div>
    </SectionShell>
  );
}
