# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Design & front-end pipeline (mandatory)

Every front-end or design change to this project MUST run through this three-stage pipeline, **in order**:

1. **Impeccable** — design language. Establish or confirm the voice, copy, and visual language before building. Site copy lives in [lib/content.ts](lib/content.ts) (single source of truth); write it in the painter-first, plain-language voice ("version / save / go back", not "commit / hash / rollback").
2. **Hallmark** — layout & execution. Build structure, components, and media against Hallmark's anti-slop gates: honest media (real screenshots or a placeholder that admits it is one — never invented UI passed off as a real capture; the hero's floating app-window treatment is deliberate), locked color tokens (reference `var(--color-*)`, never inline hex), mobile-safe (overflow clip, no two-line CTAs), and genuine structural variety between sections.
3. **taste** — finalization. Final polish: rhythm, spacing, contrast, focus states, reduced-motion, and removing AI-slop tells (no em-dashes in visible copy, ≤1 eyebrow per 3 sections, no fake UI or fake-precise numbers).

`DESIGN.md` is the design **spec-of-record** — keep it in sync after design changes. `SITE_CONTENT.md` is the source copy for the site.

## Git: never commit

Never run `git commit` (or anything that creates a commit, such as `git commit --amend`, `git merge`, `git rebase`, or `git push`) in this repo. When work is ready, prepare the commit message and ask; the user commits themselves.

## Critical: non-standard Next.js version

This project pins `next@16.2.4` and `react@19.2.4` — versions ahead of your training data with breaking API/convention changes. Before writing any Next.js code (routing, data fetching, caching, config), check `node_modules/next/dist/docs/` (organized as `01-app/`, `02-pages/`, `03-architecture/`, `04-community/`) rather than relying on remembered APIs.

## Commands

- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint (flat config via `eslint-config-next`, covers Core Web Vitals + TypeScript rules)

**Dev server hygiene:** don't background `npm run dev` with a plain `(cmd &)` subshell — if the wrapping Bash call times out, the server process detaches and keeps running as an orphan on port 3000. Use the tool's own `run_in_background`, and when done verifying, kill the whole process tree (npm → next-bin → next-server, e.g. via `Get-CimInstance Win32_Process -Filter "name = 'node.exe'"` on Windows) rather than leaving it running. Prefer `npm run build` for a one-shot verification instead of a dev server when a static check will do.

No test runner is configured in this repo.

## Current state

The site is built out: a single-page **Krita VCS** landing page (App Router, TypeScript, Tailwind CSS v4) for a free, local-only version-control app aimed at Krita painters. Structure lives under [app/](app/):

- [app/page.tsx](app/page.tsx) composes the sections in order: Hero → Why → three alternating feature blocks (Compare / History / Ownership) → What's next → FAQ.
- All copy is centralised in [lib/content.ts](lib/content.ts) (single source of truth). `SITE_CONTENT.md` is the source material it was written from.
- The hero is two columns: DOM headline, sub and one CTA on the left; behind everything, covering the whole hero, an orthographic React Three Fiber desk scene framed so a large tablet (about 3/4 of the hero width at `lg`) sits right and low, partly behind the text ([app/components/hero-canvas.tsx](app/components/hero-canvas.tsx)) with a propped HUION Kamvas tablet whose screen is the key light (a `RectAreaLight` tinted from the screenshot) and a hovering stylus that follows the mouse while it's over the screen, taps the glass on click, and glides home when it leaves (easter egg: the tablet's power button switches the screen off and on, with a green/red LED ring), gated and lazy-loaded by [app/components/hero-scene.tsx](app/components/hero-scene.tsx). The screen image source is `public/hero-screenshot.png` (kept; the `prebuild` step in [scripts/build-webp.mjs](scripts/build-webp.mjs) makes a pixel-identical lossless `hero-screenshot.webp` from it via `LOSSLESS`, which is what the canvas loads) — swap the PNG for a new capture and rerun the script. The GLBs in `public/models/` are meshopt-compressed (`npx @gltf-transform/cli meshopt`); run any replacement model through the same step. A homepage-only loader ([app/components/hero-loader.tsx](app/components/hero-loader.tsx)) covers the page until those assets are in (8s cap). `three` and `@react-three/fiber` are dependencies, deliberately kept out of every other route's bundle.
- Feature-section media are honest inline-SVG painterly motifs in [app/components/media.tsx](app/components/media.tsx). Everything below the hero stays 2D by design — no canvas, no WebGL, no depth parallax.
- The FAQ uses a native `<details>` accordion ([app/components/faq.tsx](app/components/faq.tsx)) — no JS.

Design conventions in force (see `DESIGN.md`, the spec-of-record):

- Alternating left/right feature sections connected by a single animated SVG brush stroke ([app/components/brush-stroke.tsx](app/components/brush-stroke.tsx)), driven by GSAP + ScrollTrigger tied to scroll position (not timers), gated behind a `prefers-reduced-motion` check. GSAP is a dependency (`gsap` in package.json).
- Every motion path has a static fallback. The hero canvas only mounts when the viewport matches `HERO_STAGE` (≥ 768px wide and tall enough for its layout; landscape phones are excluded) and WebGL is available; otherwise the hero is text only (no image stands in). Under reduced motion it still mounts, but every ambient movement is stopped and the pen doesn't follow the mouse. The canvas is decorative: `pointer-events-none`, out of the tab order, and out of the accessibility tree.
- Color tokens are defined in the DESIGN.md color table and in the `@theme` block of [app/globals.css](app/globals.css) — reference the `--color-*` tokens rather than inventing or inlining colors.
- Body sections share one reusable template ([app/components/section.tsx](app/components/section.tsx)) that toggles `flex-row` / `flex-row-reverse` for alternation, instead of duplicating markup per section.

## Architecture notes

- App Router structure lives entirely under [app/](app/); `@/*` resolves to the repo root (see [tsconfig.json](tsconfig.json)).
- Tailwind CSS v4 is configured via the `@import "tailwindcss"` + `@theme inline` block in [app/globals.css](app/globals.css) (no `tailwind.config.js` — theme tokens are defined directly in CSS).
- Fonts (Geist Sans/Mono) are loaded via `next/font/google` in [app/layout.tsx](app/layout.tsx) and exposed as CSS variables consumed by the Tailwind theme block.
