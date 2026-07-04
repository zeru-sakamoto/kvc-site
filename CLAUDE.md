# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Design & front-end pipeline (mandatory)

Every front-end or design change to this project MUST run through this three-stage pipeline, **in order**:

1. **Impeccable** — design language. Establish or confirm the voice, copy, and visual language before building. Site copy lives in [lib/content.ts](lib/content.ts) (single source of truth); write it in the painter-first, plain-language voice ("version / save / go back", not "commit / hash / rollback").
2. **Hallmark** — layout & execution. Build structure, components, and media against Hallmark's anti-slop gates: honest media (no fake app chrome or screenshots), locked color tokens (reference `var(--color-*)`, never inline hex), mobile-safe (overflow clip, no two-line CTAs), and genuine structural variety between sections.
3. **taste** — finalization. Final polish: rhythm, spacing, contrast, focus states, reduced-motion, and removing AI-slop tells (no em-dashes in visible copy, ≤1 eyebrow per 3 sections, no fake UI or fake-precise numbers).

`DESIGN.md` is the design **spec-of-record** — keep it in sync after design changes. `SITE_CONTENT.md` is the source copy for the site.

## Critical: non-standard Next.js version

This project pins `next@16.2.4` and `react@19.2.4` — versions ahead of your training data with breaking API/convention changes. Before writing any Next.js code (routing, data fetching, caching, config), check `node_modules/next/dist/docs/` (organized as `01-app/`, `02-pages/`, `03-architecture/`, `04-community/`) rather than relying on remembered APIs.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint (flat config via `eslint-config-next`, covers Core Web Vitals + TypeScript rules)

No test runner is configured in this repo.

## Current state

The site is built out: a single-page **Krita VCS** landing page (App Router, TypeScript, Tailwind CSS v4) for a free, local-only version-control app aimed at Krita painters. Structure lives under [app/](app/):

- [app/page.tsx](app/page.tsx) composes the sections in order: Hero → Why → three alternating feature blocks (Compare / History / Ownership) → What's next → FAQ.
- All copy is centralised in [lib/content.ts](lib/content.ts) (single source of truth). `SITE_CONTENT.md` is the source material it was written from.
- Section media are honest inline-SVG painterly motifs in [app/components/media.tsx](app/components/media.tsx) — no screenshots or fake app chrome.
- The FAQ uses a native `<details>` accordion ([app/components/faq.tsx](app/components/faq.tsx)) — no JS.

Design conventions in force (see `DESIGN.md`, the spec-of-record):

- Alternating left/right feature sections connected by a single animated SVG brush stroke ([app/components/brush-stroke.tsx](app/components/brush-stroke.tsx)), driven by GSAP + ScrollTrigger tied to scroll position (not timers), gated behind a `prefers-reduced-motion` check. GSAP is a dependency (`gsap` in package.json).
- Color tokens are defined in the DESIGN.md color table and in the `@theme` block of [app/globals.css](app/globals.css) — reference the `--color-*` tokens rather than inventing or inlining colors.
- Body sections share one reusable template ([app/components/section.tsx](app/components/section.tsx)) that toggles `flex-row` / `flex-row-reverse` for alternation, instead of duplicating markup per section.

## Architecture notes

- App Router structure lives entirely under [app/](app/); `@/*` resolves to the repo root (see [tsconfig.json](tsconfig.json)).
- Tailwind CSS v4 is configured via the `@import "tailwindcss"` + `@theme inline` block in [app/globals.css](app/globals.css) (no `tailwind.config.js` — theme tokens are defined directly in CSS).
- Fonts (Geist Sans/Mono) are loaded via `next/font/google` in [app/layout.tsx](app/layout.tsx) and exposed as CSS variables consumed by the Tailwind theme block.
