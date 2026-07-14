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
   code."), factual badge, Download + View-source CTAs on the left, with a small
   Windows-available / macOS-Linux-coming-soon icon row beneath (`platform-icons.tsx`);
   painterly `LayersMedia` (translucent painting layers + a version-history trail) on the right.
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
7. **Performance (feature block, media right).** "See exactly what version control is saving
   you." Storage-saved comparison: what each version added vs. what a full copy would have cost,
   from a small +7% overhead on the first save to +50% saved by the second and climbing. Media:
   `PerformanceMedia` (shrinking storage bars per version, a warm badge for the first-save
   overhead, a cool badge for the second-save saving — no invented precision beyond those two
   figures already in the copy).
8. **What's next — narrow roadmap.** No media. Two roadmap items + "Request a feature" CTA.
9. **FAQ — centered accordion.** Native `<details>/<summary>`, no JS, keyboard-accessible.
10. **Footer.** Wordmark, maker signature, license note (TBD), Product + Maker link columns. No
    metric tiles.

### `/docs` route

A second area, separate from the single-page landing flow, holding the full documentation as a
chapter-tabbed guide (`app/docs/layout.tsx` + one route per chapter):

1. **Shared header (`app/docs/layout.tsx`).** Title + one-line framing + "Read the docs on
   GitHub" CTA (full docs live in the repo, not duplicated here), rendered once above the
   chapters, not repeated per tab.
2. **Chapter nav (`app/components/docs-nav.tsx`).** Four chapters, each a real route so they're
   shareable/bookmarkable: Getting started, Using each feature, Keeping your work safe, Installing
   the plugin. A vertical list on the left on `lg:` and up (client component, `usePathname` for
   the active tab); collapses to a horizontal scrollable pill row above the content on mobile —
   same overflow-safe pattern as the rest of the site, no separate mobile component.
3. **Getting started** (`app/docs/getting-started/page.tsx`). Five numbered steps
   (`app/components/steps.tsx` — a plain numbered list, no stepper widget, no screenshots),
   covering install → pick a folder → save a version → compare versions → branch/merge/restore.
   This is also the page the hero's download button redirects to: when reached with
   `?ref=download` in the URL, a small callout renders above the steps ("Your download will start
   automatically", with a plain fallback link) — no fake progress bar or fake precision.
4. **Using each feature** (`app/docs/using-features/page.tsx`). A dot-bullet reference list
   (`app/components/bullet-list.tsx`, bold lead term + body) covering Changes, History, Branches,
   comparing versions, Undo, Restore, Settings, and Clean up storage.
5. **Keeping your work safe** (`app/docs/safety/page.tsx`). Same `BulletList` component, one
   entry per guardrail (won't switch with unsaved changes, never silently overwrites a conflict,
   etc.).
6. **Installing the Krita plugin (optional)** (`app/docs/plugin/page.tsx`). Intro paragraph,
   `BulletList` of caveats, a closing paragraph, and a "Plugin guide on GitHub" CTA.

`app/docs/page.tsx` (the bare `/docs` route) is a one-line `redirect('/docs/getting-started')` —
there's exactly one canonical place each chapter's content lives, no duplication.

Same tokens, same voice, same no-fake-UI rule as the landing page. `SiteHeader`/`SiteFooter` wrap
it automatically via the root layout; no separate chrome. Not alternating, not media-columned —
intentionally a different rhythm than the landing page, same as Why/What's-next/FAQ already are.

### Download flow

The hero's primary CTA is `app/components/download-button.tsx`, not a plain link: a real
`<a href="/download/Krita-VC_0.2.1_x64-setup.exe" download>` (works with JS disabled) whose
`onClick` also client-navigates to `/docs/getting-started?ref=download`. Both actions fire from
the same click — the `download` attribute forces the browser to save the file instead of
navigating, so there's no conflict with the SPA redirect. The installer lives in
`public/download/`, served at `/download/...` directly (no external host).

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
  `SignatureMedia`, `PerformanceMedia` — abstract painterly vector, all colors via tokens.
- **Steps (`steps.tsx`):** plain numbered list for the `/docs` Getting Started chapter. No
  animation, no stepper widget — a static ordered list styled with site tokens.
- **Bullet list (`bullet-list.tsx`):** dot-bullet list shared by the Using each feature, Keeping
  your work safe, and plugin chapters — optional bold lead term + body, no new markup per chapter.
- **Docs nav (`docs-nav.tsx`):** chapter tabs for `/docs` — vertical list on `lg:` and up,
  horizontal scrollable pill row on mobile. Client component, active tab via `usePathname`.
- **Download button (`download-button.tsx`):** the hero's primary CTA — see Download flow above.
  Leads with the shared `WindowsGlyph` (the installer is Windows-only today); the accompanying
  `PlatformIcons` row shows macOS/Linux as "Soon." Reused on the discovery pages.
- **Platform icons (`platform-icons.tsx`):** small OS-availability row under the hero CTAs —
  Windows (available) vs. macOS/Linux (coming soon), generic inline-SVG glyphs, wording sourced
  from `lib/content.ts`'s `platforms` (kept in sync with the FAQ's platform answer).
- **FAQ (`faq.tsx`):** native `<details>` accordion.
- **Footer (`site-footer.tsx`):** maker signature, license, link columns — Product, **Guides**
  (the two discovery pages), Maker. Row wraps (`flex-wrap`) so three columns stay mobile-safe.
  Internal links use `next/link`; external repo links keep `target="_blank"`.
- **JSON-LD (`json-ld.tsx`):** renders one `application/ld+json` block from a passed object,
  escaping `<` to close the `</script>` breakout. Reused by layout, home, docs, discovery pages.
- **Discovery page (`discovery-page.tsx`):** shared template for the SEO landing routes — intro
  (h1 + CTAs), alternating `Section` blocks reusing existing media motifs, closing CTA,
  `BreadcrumbList` JSON-LD. Copy lives in `lib/content.ts`.

## External Links

- **Download (hero):** served locally from `public/download/`, see Download flow above — not an
  external link.
- **Download (footer):** still points to GitHub releases; only the hero CTA triggers the local
  file + redirect flow.
- **Source:** hero secondary CTA + nav + footer → the repo.
- **Issues:** "Request a feature" (What's next) + footer.
- **Docs / Plugin guide:** `/docs` chapter CTAs → GitHub repo (no dedicated docs site yet, same
  placeholder-link convention as the footer's Download link).
- **GitHub profile / Personal portfolio:** footer, tied to the maker signature.

## SEO & Discoverability

Nobody searches "Krita version control," so discovery targets the _problems_ painters search for
and clean structured data for AI answer engines. The painter-first voice is preserved: keywords
live in metadata, FAQ answers, and JSON-LD, with only light retuning of visible headings.

- **Canonical origin:** `https://krita-vc.zeru-sakamoto.codes`, via `siteUrl` in `lib/content.ts`
  (env-overridable with `NEXT_PUBLIC_SITE_URL`). Feeds `metadataBase`, canonicals, sitemap, OG.
- **Metadata (`app/layout.tsx`):** `metadataBase`, title template `%s · Krita VCS`, keywords,
  author/creator, Open Graph (`website`, siteName, locale), Twitter `summary_large_image`, robots
  with `max-image-preview: large`, and a Search Console hook (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`).
  Canonical + `og:url` are **not** set on the root layout (metadata inherits root→page, which would
  point every page at `/`); the homepage sets its own canonical in `app/page.tsx`, other routes set
  theirs. Docs use a nested template `%s · Documentation · Krita VCS`.
- **Structured data (JSON-LD):** `WebSite` + `Person` site-wide (layout); `SoftwareApplication`
  (free/MIT/Windows, `downloadUrl`, version) + `FAQPage` (mapped from the `faq` array) on the home
  page; `BreadcrumbList` on docs + discovery pages. FAQ/HowTo rich results are Google-restricted
  now, but the schema still aids AI answer engines — HowTo markup is deliberately skipped.
- **Share image (`app/opengraph-image.tsx`):** dynamic 1200×630 card via `next/og` — brush logo,
  `Krita VCS` in Syne, tagline, `Free · local-only · MIT` on the brand canvas gradient. Honest
  media, literal DESIGN.md hex (Satori can't read CSS vars). Fonts fetched from Google with a
  graceful fallback so an offline build still renders on the built-in font. Covers `twitter:image`
  too (X falls back to `og:image`), so there is no separate `twitter-image`.
- **`robots.ts` / `sitemap.ts`:** allow-all robots pointing at the sitemap; sitemap built from the
  `docsChapters`/`docsPlugin`/`discoveryPages` exports so it never drifts from the routes.
- **Discovery routes:** `/recover-a-krita-version` (go back to an earlier version) and
  `/vs-saving-copies` (an alternative to `_final_final.kra` copies) — distinct search intent from
  the homepage, cross-linked from the footer "Guides" column.
