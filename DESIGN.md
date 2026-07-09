# Krita VCS — Design Spec

Product landing page for **Krita VCS**: a free, local-only version-control app for Krita
painters. Theme: painter-first clarity in a Krita-style digital-painting workspace. Organic
alternating left/right feature sections connected by a single animated SVG brush stroke. A
second route, `/docs`, holds the getting-started guide — kept off the single-page landing flow
since it's read once, not scrolled past.

Copy source: `SITE_CONTENT.md`. All copy is centralised in `lib/content.ts`. This file is the
design **spec-of-record**; keep it in sync when the design changes.

## Voice

Painter-first, plain-language, calm. The site practises what "Artist Mode" preaches: say
"version / save / go back", not "commit / hash / rollback". No em-dashes in visible copy. No
invented metrics or fake product UI.

## Stack

- Next.js App Router (Server Components default, Client Components for interactive bits)
- Tailwind CSS v4 (`@theme inline` tokens in `app/globals.css`, no `tailwind.config.js`)
- GSAP + ScrollTrigger (scroll-driven brush stroke) — a dependency (`gsap`)
- Fonts: Geist Sans/Mono + Syne (display), via `next/font`
- Vercel hosting

## Colors

Dark-locked (Krita workspace theme). Tokens live in the `@theme` block of `app/globals.css`;
reference `var(--color-*)`, never inline hex.

| Role                    | Name           | Hex       | Token            |
| ----------------------- | -------------- | --------- | ---------------- |
| Base bg                 | Charcoal Slate | `#1E1E24` | `bg-canvas-dark` |
| Deep bg (panels/footer) | Deep Ink       | `#151518` | `bg-canvas-deep` |
| Primary brand           | Krita Blue     | `#2E86DE` | `brand-blue`     |
| Warm accent             | Sunset Orange  | `#FF6B6B` | `accent-warm`    |
| Cool accent             | Electric Cyan  | `#00D2D3` | `accent-cool`    |
| Text primary            | Paper White    | `#F5F6FA` | `text-primary`   |
| Text muted              | Brush Grey     | `#A0A0B0` | `text-muted`     |

## Canvas Grain Texture

SVG noise filter on the root layer (fixed, `pointer-events-none`, decorative), low opacity —
see `app/layout.tsx`:

```html
<filter id="canvas-grain-texture">
  <feTurbulence
    type="fractalNoise"
    baseFrequency="0.8"
    numOctaves="3"
    stitchTiles="stitch"
  />
  <feColorMatrix
    type="matrix"
    values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0"
  />
</filter>
```

## Layout Flow (sections vary rhythm on purpose)

The brush stroke spans the full page height and follows scroll, connecting the sections. The
four feature blocks alternate left/right; the surrounding sections deliberately break that
rhythm so the page doesn't read as one repeated template.

1. **Hero — left-aligned + visual.** Bold headline ("Version control for your art, not your
   code."), factual badge, Download + View-source CTAs on the left; painterly `LayersMedia`
   (translucent painting layers + a version-history trail) on the right.
2. **Why artists use it — full-width points grid.** No media column. Intro + five value props
   in a two-column grid. Breaks the two-column rhythm before the feature blocks.
3. **Compare (feature block, media right).** "See exactly what changed, layer by layer." Visual
   layer diffs (including per-layer/canvas metadata on click) + palette diffs. Media: `DiffMedia`
   (two versions split by a swipe handle, a dashed-outline silhouette tracing the changed pixels,
   synced zoom/pan on both panels, a per-layer focus chip row, plus a before→after palette swatch
   row).
4. **History (feature block, media left).** "Every save is a place you can go back to." Real
   branches + undo/rollback. Media: `BranchMedia` (color-coded branch graph that diverges and
   merges back).
5. **Ownership (feature block, media right).** "Yours, in plain language, on your machine."
   Artist Mode + storage cleanup + local-only ethos. Media: `OwnershipMedia` (a conceptual
   technical→plain label map — not a screenshot).
6. **Settings (feature block, media left).** "Sign your work, tune it to your machine." Author
   name on saves + preview-image disk budget + compact-storage toggle + color theme picker.
   Media: `SignatureMedia` (a labeled slider, a labeled toggle, and a labeled row of theme
   swatches, each shaped to match what the setting does — not a screenshot of the Settings
   panel).
7. **What's next — narrow roadmap.** No media. Two roadmap items + "Request a feature" CTA.
8. **FAQ — centered accordion.** Native `<details>/<summary>`, no JS, keyboard-accessible.
9. **Footer.** Wordmark, maker signature, license note (TBD), Product + Maker link columns. No
   metric tiles.

### `/docs` route

A second page, separate from the single-page landing flow, for the getting-started guide:

1. **Intro.** Title + one-line framing + "Read the docs on GitHub" CTA (full docs live in the
   repo, not duplicated here).
2. **Getting started.** Four numbered steps (`app/components/steps.tsx` — a plain numbered list,
   no stepper widget, no screenshots), covering install → point at a folder → save a version →
   compare two versions.
3. **Installing the Krita plugin (optional).** Intro paragraph, a short bullet list of caveats,
   a closing paragraph, and a "Plugin guide on GitHub" CTA.

Same tokens, same voice, same no-fake-UI rule as the landing page. `SiteHeader`/`SiteFooter` wrap
it automatically via the root layout; no separate chrome. Not alternating, not media-columned —
intentionally a different rhythm than the landing page, same as Why/What's-next/FAQ already are.

## GSAP Animation

- **Brush stroke** (`app/components/brush-stroke.tsx`): one stroke drawn via `strokeDashoffset`
  tied to scroll position (not timers). A faint always-visible guide reads ahead of the tip.
  Under `prefers-reduced-motion: reduce`, the stroke shows fully drawn and scroll wiring is
  skipped.
- **Cursor brush** (`app/components/cursor-brush.tsx`): faint Krita-blue smudge trailing the
  pointer, fine-pointer + non-reduced-motion only. Secondary flourish, not the signature.
- **Media reveals** (`app/components/media.tsx`): each motif animates its own elements in as it
  scrolls into view — `gsap.from` inside a `gsap.context`, driven by a `ScrollTrigger` with
  `once: true` (plays once, never replays). The SVG's natural DOM state is the finished state, so
  under `prefers-reduced-motion: reduce` the reveal is skipped and the motif shows fully drawn.
  Shared `useReveal` hook holds the gate + boilerplate so it isn't copied per motif.
- Reduced-motion gate pattern:

```typescript
const preferReduced = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;
if (!preferReduced) {
  // run GSAP ScrollTrigger timelines
}
```

## Component Architecture

```
1. Visual Foundation Layer — grain (layout.tsx), base theme, tokens (globals.css)
2. Reversible Content Container — Section template, alternating grid
3. Painterly Media — honest inline-SVG motifs (media.tsx), no screenshots/fake chrome
4. Dynamic Vector Directives — GSAP scroll brush stroke
```

- **Header (`site-header.tsx`):** wordmark + anchor links (Why / Features / FAQ) + Docs route
  link + GitHub button. Transparent → frosted `canvas-deep` on scroll. Anchor hrefs are
  path-qualified (`/#why`, not `#why`) so they resolve correctly from `/docs` too; wordmark and
  Docs use `next/link` for client-side route navigation.
- **Body blocks (`section.tsx`):** one reusable template, toggles `flex-row` /
  `flex-row-reverse` for alternation — no duplicated markup. `eyebrow` is optional and used
  sparingly (the page leans on strong headings, not a mono-caps kicker over every section).
- **Media (`media.tsx`):** `LayersMedia`, `DiffMedia`, `BranchMedia`, `OwnershipMedia`,
  `SignatureMedia` — abstract painterly vector, all colors via tokens.
- **Steps (`steps.tsx`):** plain numbered list for the `/docs` Getting Started guide. No
  animation, no stepper widget — a static ordered list styled with site tokens.
- **FAQ (`faq.tsx`):** native `<details>` accordion.
- **Footer (`site-footer.tsx`):** maker signature, license, outbound link columns (internal
  links like `/docs` use `next/link` and skip `target="_blank"`; external repo links keep it).

## External Links

- **Download:** hero primary CTA → GitHub releases (no standalone download host yet).
- **Source:** hero secondary CTA + nav + footer → the repo.
- **Issues:** "Request a feature" (What's next) + footer.
- **Docs / Plugin guide:** `/docs` page CTAs → GitHub repo (no dedicated docs site yet, same
  placeholder-link convention as Download).
- **GitHub profile / Personal portfolio:** footer, tied to the maker signature.
