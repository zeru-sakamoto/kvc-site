# Krita VCS — Design Spec

Product landing page for **Krita VCS**: a free, local-only version-control app for Krita
painters. Theme: painter-first clarity in a Krita-style digital-painting workspace. Organic
alternating left/right feature sections connected by a single animated SVG brush stroke.

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
three feature blocks alternate left/right; the surrounding sections deliberately break that
rhythm so the page doesn't read as one repeated template.

1. **Hero — left-aligned + visual.** Bold headline ("Version control for your art, not your
   code."), factual badge, Download + View-source CTAs on the left; painterly `LayersMedia`
   (translucent painting layers + a version-history trail) on the right.
2. **Why artists use it — full-width points grid.** No media column. Intro + five value props
   in a two-column grid. Breaks the two-column rhythm before the feature blocks.
3. **Compare (feature block, media right).** "See exactly what changed, layer by layer." Visual
   layer diffs + palette diffs. Media: `DiffMedia` (two versions split by a swipe handle with a
   glow seam, plus a before→after palette swatch row).
4. **History (feature block, media left).** "Every save is a place you can go back to." Real
   branches + undo/rollback. Media: `BranchMedia` (color-coded branch graph that diverges and
   merges back).
5. **Ownership (feature block, media right).** "Yours, in plain language, on your machine."
   Artist Mode + storage cleanup + local-only ethos. Media: `OwnershipMedia` (a conceptual
   technical→plain label map — not a screenshot).
6. **What's next — narrow roadmap.** No media. Two roadmap items + "Request a feature" CTA.
7. **FAQ — centered accordion.** Native `<details>/<summary>`, no JS, keyboard-accessible.
8. **Footer.** Wordmark, maker signature, license note (TBD), Product + Maker link columns. No
   metric tiles.

## GSAP Animation

- **Brush stroke** (`app/components/brush-stroke.tsx`): one stroke drawn via `strokeDashoffset`
  tied to scroll position (not timers). A faint always-visible guide reads ahead of the tip.
  Under `prefers-reduced-motion: reduce`, the stroke shows fully drawn and scroll wiring is
  skipped.
- **Cursor brush** (`app/components/cursor-brush.tsx`): faint Krita-blue smudge trailing the
  pointer, fine-pointer + non-reduced-motion only. Secondary flourish, not the signature.
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

- **Header (`site-header.tsx`):** wordmark + anchor links (Why / Features / FAQ) + GitHub
  button. Transparent → frosted `canvas-deep` on scroll.
- **Body blocks (`section.tsx`):** one reusable template, toggles `flex-row` /
  `flex-row-reverse` for alternation — no duplicated markup. `eyebrow` is optional and used
  sparingly (the page leans on strong headings, not a mono-caps kicker over every section).
- **Media (`media.tsx`):** `LayersMedia`, `DiffMedia`, `BranchMedia`, `OwnershipMedia` —
  abstract painterly vector, all colors via tokens.
- **FAQ (`faq.tsx`):** native `<details>` accordion.
- **Footer (`site-footer.tsx`):** maker signature, license, outbound link columns.

## External Links

- **Download:** hero primary CTA → GitHub releases (no standalone download host yet).
- **Source:** hero secondary CTA + nav + footer → the repo.
- **Issues:** "Request a feature" (What's next) + footer.
- **GitHub profile / Personal portfolio:** footer, tied to the maker signature.
