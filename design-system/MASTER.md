# HackRice 16 — Design System Master File

> **⚠ DESIGN LANGUAGE v2 (post-checkpoint, user-directed evolution) — overrides §1 below.**
> The site is now **all-dark dot-terminal**: every section sits on felt `#0C0A06`
> (no cream sections). Display branding is **JACKRICE 16** (copyright stays HackRice;
> legacy body copy like "What is HackRice?" is preserved verbatim).
>
> - **Type:** ALL text uses `font-dot` (DotGothic16). Emphasis/headings = gold
>   (`text-gold`, `text-gold-bright`), secondary copy = warm grey (`text-stone-400`,
>   labels `text-stone-500`). No cream text, no crimson copy. Fluid `clamp()` sizes.
> - **Suit accents (non-text):** ♥ ♦ = `crimson-bright`, ♠ ♣ = gold. Decorative pips only.
> - **Dot engine** (`src/components/hero/`): `DotText` (dot-rendered display text),
>   `DotScene` (H card: slow sway, cursor wobble + proximity glow), `dot-engine.ts`
>   (sampling/projection), `ascii-art.ts` (figlet + ASCII card builder, `font-ascii`).
> - **Chrome:** section header = `NNN ── TITLE ──── ♠♥♦♣` rule rows (hero is 001;
>   about 002 … team 007). Gold hairline `border-gold/20` section tops. Corner-tick
>   hover accents on primary buttons. Site-wide sparse dot-grid overlay (z-30).
>   Layout capped at `max-w-[100rem]` frames / `container` inners.
> - **Cursor:** poker-chip SVG site-wide; bright "flipped" variant on interactive elements.
> - **Buttons:** outline style — `border-gold-bright text-gold-bright hover:bg-gold-bright
>   hover:text-felt` (primary) / `border-gold/60 text-gold` (secondary), `font-dot` uppercase.
> - **Panels:** `bg-felt-raised/60` + `border-gold/30`; playing-card frames keep the legacy
>   corner rank+pip + masked inner border pattern, rendered dark.
> - **Motion:** Framer Motion `whileInView` reveals (once, -80px margin); GSAP ScrollTrigger
>   for the tracks card-deal + team trellis parallax; reduced-motion = settled static.

> **LOGIC:** When building a specific page/section, first check `design-system/pages/[name].md`.
> If that file exists, its rules **override** this Master file. If not, strictly follow the rules below.
>
> Generated with ui-ux-pro-max (`--design-system --persist`, query: "hackathon event landing page
> casino playing card motion-driven kinetic parallax storytelling") on 2026-06-12, then
> brand-corrected: the generator's auto palette (felt-green) was replaced with the real HackRice
> brand colors carried over from the legacy `index.html`.

**Project:** HackRice 16 — Rice University's 16th Annual Hackathon (Sept 11–13, 2026)
**Style:** Motion-Driven / Kinetic Typography / Parallax Storytelling
**Pattern:** Scroll-Triggered Storytelling (casino table narrative)

---

## 1. Core Concept — "The Table and the Card"

Every section lives in one of two worlds. This is the central design rule that keeps the
casino theme coherent instead of decorative:

| World | Surface | Used for | Feel |
|-------|---------|----------|------|
| **The Table** | near-black felt `#0C0A06` + vignette + subtle felt noise | Hero, Team ("Behind the Deck"), Footer, climax CTA | The casino floor at night — gold glows, cards get dealt |
| **The Card Face** | cream `#F9F8F3` | About, Schedule, Tracks, Sponsors, FAQ | The face of a playing card — crisp ink, navy & crimson pips, gold foil accents |

Transitions between worlds are part of the story: scrolling out of the hero feels like a card
being turned face-up onto the table.

---

## 2. Color Palette (brand — single source of truth)

| Role | Hex | Token (Tailwind v4 `@theme`) | Notes |
|------|-----|------------------------------|-------|
| Gold (primary) | `#C3922E` | `--color-gold` | Brand primary. Borders, foil accents, ASCII art base |
| Gold bright (glow) | `#E3B85A` | `--color-gold-bright` | Hover/glow state, ASCII highlights, kinetic type sheen |
| Gold deep | `#8A6620` | `--color-gold-deep` | Gradient low-end, pressed states |
| Navy | `#3A4985` | `--color-navy` | Spades ♠ & clubs ♣, primary CTA on light surfaces |
| Navy deep | `#2F3A66` | `--color-navy-deep` | CTA hover (carried from legacy site) |
| Crimson | `#B4402A` | `--color-crimson` | Hearts ♥ & diamonds ♦, dates, section underlines |
| Cream | `#F9F8F3` | `--color-cream` | "Card face" light surface |
| Cream card | `#FFFFFF` | `--color-card` | Raised cards on cream sections |
| Felt | `#0C0A06` | `--color-felt` | "Table" near-black, warm undertone so gold reads warm |
| Felt raised | `#171208` | `--color-felt-raised` | Cards/panels on dark sections |
| Ink | `#1C1917` | `--color-ink` | Body text on cream |
| Ink muted | `#57534E` | `--color-ink-muted` | Secondary text on cream (≥4.5:1 on cream) |

### Contrast pairs (verified intent — re-check in QA pass)
- On **felt**: text = `cream` (≈17:1) or `gold-bright` (≈9:1). `gold` `#C3922E` ok for large text/decoration (≈6.9:1).
- On **cream**: text = `ink` (≈14:1), `ink-muted` (≈5.5:1), `navy` (≈7.6:1), `crimson` (≈5.6:1).
- **Never** gold text on cream (≈2.4:1 — decorative borders/foil only, never copy).

### Suit semantics (carried from legacy tracks section)
- ♥ Hearts / ♦ Diamonds → `crimson`
- ♠ Spades / ♣ Clubs → `navy`
- Track cards: Healthcare = A♥, Games & Gamification = K♠, Finance = Q♦, Work & Productivity = J♣

---

## 3. Typography (triple stack)

The generator proposed Syncopate + Space Mono (kinetic/techy). Syncopate's extreme width fights
the ornate gold trellises and reads sci-fi, not casino. Corrected pairing (from the skill's
typography DB, "Classic Elegant" + mono accent):

| Role | Font | Usage |
|------|------|-------|
| **Display** | Playfair Display (700/800/900) | Section headlines, kinetic type moments. High-contrast serif = card-deck royalty / casino luxe. Pairs with the gold trellis art |
| **Body** | Inter (400/500/600) | All body copy, nav, FAQ answers. Quiet and legible |
| **Mono** | Space Mono (400/700) | ASCII hero, countdown digits (tabular by nature), labels/eyebrows (`uppercase tracking-widest`), technical accents |

Load via `next/font/google` (not CSS `@import`) with `display: swap`.

**ASCII-art rendering rules (hard-won — do not regress):**
- All ASCII art uses `font-ascii` = self-hosted full JetBrains Mono (`public/fonts/`).
  `next/font`'s latin subsetting strips box-drawing/block/suit glyphs → per-glyph
  fallback fonts shred column alignment. Never render art in Space Mono.
- ANSI Shadow art is two-layer: blocks colored with the per-row gold ramp, box-drawing
  shadow strokes in `#4A3814` (see `AsciiWordmark`). One flat color = mush.
- Compose figlet wordmarks letter-by-letter with a 1-column gap (font smushing packs
  letters together) and stretch `scaleY(1.28)` to terminal cell proportions, reserving
  the painted overflow with an em-based margin.
Type scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64 / 96 (display sizes only on ≥768px).
Body ≥16px, line-height 1.5–1.75, headings 1.05–1.2.

---

## 4. Motion System (the soul of the site)

**Stack:** Framer Motion (component reveals, hover, presence) + GSAP ScrollTrigger
(scroll-driven sequences: card deals, parallax trellises, countdown flips). Lottie only for
pre-made vector loops if needed.

### Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--ease-deal` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | Cards dealt onto the table |
| `--ease-flip` | `cubic-bezier(0.65, 0, 0.35, 1)` | Card flips (rotateY) |
| `--ease-enter` | ease-out | Entrances |
| `--ease-exit` | ease-in | Exits (60–70% of enter duration) |
| `--dur-micro` | `180ms` | Hover, focus, press |
| `--dur-reveal` | `500ms` | Section entrances |
| `--dur-deal` | `700ms` | A single card deal |
| stagger | `60–90ms` | Between dealt cards; 30–50ms for list items |

### Signature choreography
1. **Hero (ASCII deal-in):** ASCII wordmark resolves from shuffling glyphs; suit pips shimmer
   gold; a 5-card ASCII poker hand deals in with stagger. Scroll scrubs a subtle parallax.
2. **Card deal (Tracks):** 4 track cards start off-screen at the "dealer" point (top center,
   rotated, stacked), GSAP ScrollTrigger deals them into the grid with `--ease-deal` + stagger.
3. **Card flip (FAQ):** answers reveal with a flip/settle, never a plain fade.
4. **Parallax trellises:** gold corner trellises drift at 0.85–0.92 scroll speed (3–5 layers max).
5. **Countdown:** flip-clock digit transitions on the second; tabular mono so no layout shift.
6. **Suit rails:** the repeating ♣♦♠♥ margin rails scroll-loop slowly (ambient).

### Hard rules
- Animate **transform/opacity only**. No width/height/top/left. No CLS from animation.
- Every animation expresses cause-effect (deal, flip, settle) — no decoration-only motion.
- Interruptible; never block input; content readable immediately (animate from 0.0→1.0 opacity
  but never hide content from non-JS/SSR render).
- **`prefers-reduced-motion`: ambient/looping animations freeze to their static final state;**
  scroll-triggered sequences render settled; countdown updates without flip animation.
  Implement once via a `useReducedMotion` hook + GSAP `matchMedia`.

---

## 5. Surfaces, Spacing, Effects

- Spacing: 4/8px rhythm — 4, 8, 16, 24, 32, 48, 64, 96. Sections: `py-24` (mobile `py-16`).
- Container: `max-w-6xl` center, gutters `px-6` (mobile) → `px-8`.
- Radius: cards `rounded-2xl`, buttons `rounded-xl`, pills `rounded-full`.
- Borders: hairline `gold/40` on section tops (carried from legacy), card inner-frame trick:
  inset gold/crimson/navy border with masked corners + suit pips at TL/BR (legacy pattern, keep).
- Shadows on cream: sm `0 1px 2px rgba(0,0,0,.05)`, md `0 4px 6px rgba(0,0,0,.1)`,
  hover-lift `0 10px 15px rgba(0,0,0,.1)` + `-translate-y-2`.
- Glow on felt: `0 0 24px rgba(227,184,90,.25)` (gold-bright at 25%) for CTAs/foil.
- Felt texture: CSS-only noise (SVG turbulence data-URI at ~3% opacity) + radial vignette.
- Z-index scale: 0 (bg art) / 10 (content) / 20 (section chrome) / 40 (nav) / 50 (MLH badge) / 100 (modals).

## 6. Components

- **Primary CTA** (light surfaces): navy bg, white text, hover navy-deep + lift. (legacy behavior)
- **Primary CTA** (felt surfaces): gold-bright border + gold text, hover fills gold→felt text,
  gold glow shadow.
- **Card** (universal): the playing-card frame — corner rank+pip, masked inner border, hover
  `-translate-y-2` + suit-colored border at 50–60%.
- **Eyebrow label:** Space Mono, uppercase, tracking-widest, 12px, gold (felt) / crimson (cream).
- **Section heading:** Playfair Display bold + crimson underline bar (`h-1 w-20 rounded-full`).
- **Nav:** fixed, cream/80 blur, gold/40 bottom hairline, right-side clearance for MLH badge.
- **MLH trust badge:** fixed top-right per MLH rules (must stay visible, top of page, z-50).

## 7. Content Invariants (do NOT invent)

- Tagline: "Rice University's 16th Annual Hackathon" / "Join 800+ of the brightest minds in the
  nation for 36 hours of relentless creation, collaboration, and building!"
- Dates: September 11th–13th, 2026 · countdown label "Shuffling the deck in" → target Sep 11 2026 00:00 CT.
- Anchors: `#about`, `#schedule`, `#tracks`, `#sponsors`, `#faq`, `#team`.
- Links: Interest form `https://forms.gle/SaYxSKi4YE2BBMQW8` · "Applications Open Soon!" `https://linktr.ee/hackrice` · `hack@rice.edu` · MLH badge + Code of Conduct.
- Tracks: Healthcare, Games & Gamification, Finance, Work & Productivity (copy from legacy).
- Schedule & sponsors are explicitly "pending" — keep placeholder cards, no fabricated data.
- Team: 3 directors + 10 subcommittee members with `/images/hr-*.jpg` photos.
- All assets from `/public/images/` (logos, chips, lettering, trellises, suit PNGs).

## 8. Anti-Patterns (Do NOT Use)

- ❌ Generic SaaS flattening — the casino theme is the brand, elevate it
- ❌ Emojis as icons (legacy used 🗓️/🤝/⏱️ — replace with Lucide SVG + suit glyphs)
- ❌ Gold text on cream (fails contrast) · ❌ low-contrast gray-on-gray
- ❌ Layout-shifting hovers, animated width/height, scroll-jacking
- ❌ Invisible focus states — visible `focus-visible` rings (gold on felt, navy on cream)
- ❌ Decorative-only motion, >500ms micro-interactions, missing reduced-motion fallback
- ❌ Fabricated sponsors/schedule/stats

## 9. Pre-Delivery Checklist

- [ ] No emoji icons (Lucide SVG + real suit glyphs/PNGs only)
- [ ] cursor-pointer + visible focus-visible on all interactive elements
- [ ] Hover transitions 150–300ms; exits faster than entrances
- [ ] Contrast: 4.5:1 body both worlds (felt AND cream checked independently)
- [ ] prefers-reduced-motion → ambient frozen static, sequences settled
- [ ] Responsive 375 / 768 / 1024 / 1440; no horizontal scroll; dvh not vh
- [ ] No content hidden behind fixed nav / MLH badge
- [ ] Semantic structure: single h1, sequential headings, landmarks, skip link
- [ ] Countdown digits tabular (no layout shift each second)
- [ ] `npm run build` passes; images via `next/image` with dimensions (no CLS)
