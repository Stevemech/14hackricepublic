"use client";

import Image from "next/image";
import { Link2 } from "lucide-react";
import { DotArt, type DotPainter } from "@/components/hero/dot-art";

// A team member's portrait that flips on hover/focus to reveal a glowing,
// holographic dot-matrix poker chip with a link icon. The chip face is drawn
// with the same dot engine + bloom as the hero H card (rendered static so a
// gridful of them doesn't each animate); the holographic sheen and glow are
// cheap CSS on top. The whole thing is the LinkedIn anchor — pass `linkedin`
// to make it navigate. Until a URL is provided the flip still works.

const TAU = Math.PI * 2;

// White-on-transparent chip silhouette → sampled to a gold dot field. A
// brighter outer ring + dimmer inner face + bright edge-spots reads as a
// poker chip once dotted.
const chipPaint: DotPainter = (ctx, s) => {
  const c = s / 2;
  ctx.fillStyle = "#777";
  ctx.beginPath();
  ctx.arc(c, c, s * 0.48, 0, TAU);
  ctx.fill();
  ctx.fillStyle = "#363636";
  ctx.beginPath();
  ctx.arc(c, c, s * 0.36, 0, TAU);
  ctx.fill();
  // Edge-spots around the rim.
  ctx.fillStyle = "#fff";
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    ctx.save();
    ctx.translate(c + Math.cos(a) * s * 0.42, c + Math.sin(a) * s * 0.42);
    ctx.rotate(a);
    ctx.fillRect(-s * 0.032, -s * 0.03, s * 0.064, s * 0.06);
    ctx.restore();
  }
};

export function FlipAvatar({
  src,
  alt,
  linkedin,
  size = "lg",
}: {
  src: string;
  alt: string;
  linkedin?: string;
  size?: "lg" | "sm";
}) {
  const dim = size === "lg" ? "h-24 w-24" : "h-16 w-16";
  const px = size === "lg" ? 96 : 64;
  const ring = size === "lg" ? "border-2" : "border";
  const borderClr = size === "lg" ? "border-gold/40" : "border-gold/25";
  const icon = size === "lg" ? "h-8 w-8" : "h-6 w-6";

  // No LinkedIn yet → plain static portrait, no flip/chip.
  if (!linkedin) {
    return (
      <span className={`block ${dim}`}>
        <Image
          src={src}
          alt={alt}
          width={px}
          height={px}
          className={`${dim} rounded-full ${ring} ${borderClr} object-cover`}
        />
      </span>
    );
  }

  return (
    <a
      href={linkedin || undefined}
      target={linkedin ? "_blank" : undefined}
      rel={linkedin ? "noopener noreferrer" : undefined}
      aria-label={linkedin ? `${alt} — LinkedIn` : alt}
      className={`group/flip relative block ${dim} rounded-full [perspective:700px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-bright`}
    >
      <span className="relative block h-full w-full transition-transform duration-500 ease-out [transform-style:preserve-3d] group-hover/flip:[transform:rotateY(180deg)] group-focus-visible/flip:[transform:rotateY(180deg)]">
        {/* Front — portrait */}
        <span className="absolute inset-0 [backface-visibility:hidden]">
          <Image
            src={src}
            alt={alt}
            width={px}
            height={px}
            className={`${dim} rounded-full ${ring} ${borderClr} object-cover transition-colors duration-300 group-hover/flip:border-gold-bright`}
          />
        </span>

        {/* Back — holographic dot-matrix poker chip */}
        <span
          className={`chip-face absolute inset-0 overflow-hidden rounded-full ${ring} border-gold/70 [transform:rotateY(180deg)] [backface-visibility:hidden]`}
        >
          <DotArt
            paint={chipPaint}
            pitch={3}
            contain={1}
            animate={false}
            className="absolute inset-0 h-full w-full"
          />
          <span aria-hidden="true" className="chip-holo absolute inset-0 rounded-full" />
          <span className="absolute inset-0 flex items-center justify-center">
            <Link2
              className={`${icon} text-gold-bright drop-shadow-[0_0_7px_rgba(227,184,90,0.95)]`}
              strokeWidth={2.2}
            />
          </span>
        </span>
      </span>
    </a>
  );
}
