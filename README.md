# JackRice 16 — hackrice.com

Site for **HackRice 16** (branded *JackRice 16*), Rice University's 16th annual
hackathon — September 11–13, 2026.

Built with **Next.js 16 (App Router) + Tailwind CSS v4 + Framer Motion + GSAP**.
The visual identity is a gold-on-felt, dot-matrix casino terminal: the H card and
all display type are rendered as interactive dot fields on canvas
(`src/components/hero/`). Design rules live in `design-system/MASTER.md` —
read the "DESIGN LANGUAGE v2" block before touching styles.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (fully static output)
npm run lint
```

## Deploy — Vercel

The app deploys on Vercel with zero config (auto-detected Next.js):

1. Import this GitHub repo in Vercel.
2. Add the domain `hackrice.com` in the Vercel project settings.
3. Point DNS at Vercel (domain is purchased/managed on **Namecheap**).
4. Disable GitHub Pages in repo settings once DNS has cut over
   (the old Pages workflow has been removed; the previous static site keeps
   serving from the last Pages artifact until Pages is disabled).

## Repo notes

- `index.html` + `images/` at the repo root are the **legacy static site**,
  kept for reference. The live app serves assets from `public/images/`.
- Content source of truth is the legacy `index.html` — schedule and sponsors
  are placeholders on purpose; don't invent entries.
- The MLH trust badge must remain fixed at the top of the page per MLH rules.
