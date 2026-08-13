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
six feature blocks alternate left/right; the surrounding sections deliberately break that
rhythm so the page doesn't read as one repeated template.

1. **Hero — left-aligned + visual.** Bold headline ("Version control for your art, not your
   code."), factual badge carrying the version ("v1.0 · Free, open source, local-only"), linked
   to the `/download` page, Download + View-source CTAs on the left, with a small all-available
   OS icon row beneath (`platform-icons.tsx`); painterly `LayersMedia` (translucent painting
   layers + a version-history trail) on the right.
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
8. **Panel (feature block, media left).** "Save a version without leaving Krita." The in-Krita
   Version Control panel: file selection, discard, set aside, branch switching, and
   auto-save-on-open. Media: `PanelMedia` (two labeled surfaces sharing one synced version node,
   plus a row of plain action labels — not a screenshot of Krita's UI).
9. **What's next — narrow roadmap.** No media. Three roadmap items + "Request a feature" CTA.
10. **FAQ — centered accordion.** Native `<details>/<summary>`, no JS, keyboard-accessible.
11. **Footer.** Wordmark, maker signature, license note (TBD), Product + Maker link columns. No
    metric tiles.

### `/docs` route

A second area, separate from the single-page landing flow, holding the full documentation as a
chapter-and-sub-chapter guide (`app/docs/layout.tsx` + one route per chapter, plus one dynamic
`[slug]` route per sub-chapter). Written for a reader who has never used version control before:
one short, single-idea page per feature instead of one long flat list, with a colored highlight
phrase (`emphasize()`, `app/components/highlight.tsx`) in each page's intro and at most one boxed
callout (`app/components/callout.tsx`) for the single most important safety/behavior fact.

1. **Shared header (`app/docs/layout.tsx`).** Title + one-line framing, rendered once above the
   chapters, not repeated per tab.
2. **Chapter nav (`app/components/docs-nav.tsx`).** Five chapters, each a real route so they're
   shareable/bookmarkable: What is version control?, Getting started, Using each feature, Krita
   plugin, Keeping your work safe. A vertical list on the left on `lg:` and up (client component,
   `usePathname` for the active tab); collapses to a horizontal scrollable pill row above the
   content on mobile. Using each feature and Krita plugin each carry a nested, indented list of
   their sub-chapters that expands under themselves once a route inside that chapter is active
   (`lg:` and up only) — mobile stays on the flat top-level pill row, and each sub-chapter page
   carries its own "← back to chapter" link for mobile nav.
3. **What is version control?** (`app/docs/what-is-version-control/page.tsx`). A short glossary —
   version control, a version, a project/repository, committing, a branch, restoring — each one
   plain-English sentence with an everyday analogy (`BulletList`). The one page every later chapter
   can assume the reader has seen.
4. **Getting started** (`app/docs/getting-started/page.tsx`). Five numbered steps
   (`app/components/steps.tsx` — a plain numbered list, no stepper widget, no screenshots),
   covering install → pick a folder → save a version → compare versions → branch/merge/restore.
   This is also the page the hero's download button redirects to: when reached with
   `?ref=download` in the URL, a small callout renders above the steps ("Your download will start
   automatically", with a plain fallback link) — no fake progress bar or fake precision.
5. **Using each feature** (`app/docs/using-features/page.tsx` as an index +
   `app/docs/using-features/[slug]/page.tsx` per feature). The index is a linked list
   (`app/components/chapter-links.tsx` — title + one-line summary) to ten short pages: Changes,
   History, Branches, Comparing versions, Undo, Set aside, Restore, Settings, Storage cleanup,
   Backup. Each sub-chapter page (`app/components/feature-page.tsx`) is a highlighted intro plus at
   most one of `Steps`/`BulletList`, plus at most one `Callout`.
6. **Krita plugin** (`app/plugin/layout.tsx` + `app/plugin/page.tsx` as an index +
   `app/plugin/[slug]/page.tsx` per sub-chapter). Kept at its existing `/plugin` URL — already
   linked from the hero, footer, and FAQ — but now shares the docs sidebar and the same
   index-plus-sub-chapter treatment as Using each feature: its own hero (h1 + intro + download
   button, in `app/plugin/layout.tsx`) above the shared `DocsShell` sidebar row, then an index
   linking to nine feature sub-chapters plus Installing and Troubleshooting, closing with a "What
   it deliberately doesn't do" note. `app/docs/plugin/page.tsx` stays a one-line
   `redirect('/plugin')` for old links.
7. **Keeping your work safe** (`app/docs/safety/page.tsx`). `BulletList`, one entry per guardrail
   (won't switch with unsaved changes, never silently overwrites a conflict, etc.) — stays a single
   flat page since its items are guardrails, not separate features to use.

`app/docs/page.tsx` (the bare `/docs` route) is a one-line
`redirect('/docs/what-is-version-control')` — there's exactly one canonical place each chapter's
content lives, no duplication. The sidebar-plus-content row is shared via
`app/components/docs-shell.tsx`, used by both `app/docs/layout.tsx` and `app/plugin/layout.tsx`.

Same tokens, same voice, same no-fake-UI rule as the landing page. `SiteHeader`/`SiteFooter` wrap
it automatically via the root layout; no separate chrome. Not alternating, not media-columned —
intentionally a different rhythm than the landing page, same as Why/What's-next/FAQ already are.

### Download flow

The hero's primary CTA is `app/components/download-button.tsx`, not a plain link. It detects the
visitor's OS client-side after mount (`navigator.userAgent` sniffing — good enough for "which
installer to default to", never load-bearing for anything else) and renders a real
`<a download>` pointing at that platform's primary installer from `platformDownloads` in
`lib/content.ts`, labeled "Download for Windows/macOS/Linux" with the matching glyph. Its
`onClick` also client-navigates to `/docs/getting-started?ref=download`. Both actions fire from
the same click — the `download` attribute forces the browser to save the file instead of
navigating, so there's no conflict with the SPA redirect. Server render (and the brief pre-mount
client render) show a neutral state — a plain link to `/download` — so there's no hydration
mismatch; an unrecognized OS (mobile, etc.) simply stays in that neutral state instead of
guessing. All installers live flat in `public/download/`, served at `/download/<file>` directly
(no external host, no subfolder).

### `/download` route

A standalone top-level page (`app/download/page.tsx`), same structural pattern as `/plugin`: an
intro (h1 + lede + version line), then a three-column grid — Windows, macOS, and Linux shown side
by side as equal-weight cards from page load, no tabs and no platform emphasized over the others.
Each column has one primary install button (the standard/most-compatible format per OS — `.exe`,
`.dmg`, `.AppImage`) plus small secondary links for that OS's other formats (`.msi`;
`.app.tar.gz`; `.deb`/`.rpm`). All file data comes from `platformDownloads`; page copy from
`downloadPage`, both in `lib/content.ts`. The per-file `<a download>` + click-cooldown logic is
shared via `app/components/file-download-link.tsx` (also used by `plugin-download-button.tsx`)
rather than repeated per card. Closes with a line pointing to Getting started for install steps
and to GitHub for release notes or older versions.

### `/privacy` route

A standalone top-level page (`app/privacy/page.tsx`), same structural pattern as `/plugin`: intro
(h1 + lede + "last updated" line) then a single prose section, no `DiscoveryPage`/download-CTA
template since that doesn't fit a legal document. Content is a short, true policy, not padded
boilerplate — the app is fully offline (no telemetry, no network calls) and the site has no
analytics or cookies, so there's little to disclose. Copy lives in `privacyPage` in
`lib/content.ts`. Linked from the footer's copyright line (`footer.legal`), not a nav link or its
own column. Exists mainly as the privacy-policy URL required for a Microsoft Store submission.

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
  `SignatureMedia`, `PerformanceMedia`, `PanelMedia` — abstract painterly vector, all colors via
  tokens.
- **Steps (`steps.tsx`):** plain numbered list, reused across Getting started and any feature/
  plugin sub-chapter with a "how to" sequence. No animation, no stepper widget — a static ordered
  list styled with site tokens.
- **Bullet list (`bullet-list.tsx`):** dot-bullet list shared by What is version control?, Keeping
  your work safe, and any feature/plugin sub-chapter that lists options instead of steps —
  optional bold lead term + body, no new markup per chapter.
- **Callout (`callout.tsx`):** the one boxed emphasis a feature/plugin sub-chapter is allowed —
  colored left border + background tint per tone (`cool`/`warm`/`blue`, same tokens as
  `highlight.tsx`), body text stays `text-primary` so contrast never depends on the tint.
- **Chapter links (`chapter-links.tsx`):** index-page link list (title + one-line summary) shared
  by the Using each feature and Krita plugin index pages, pointing at their sub-chapters.
- **Feature page (`feature-page.tsx`):** shared sub-chapter body — highlighted intro
  (`emphasize()`), then at most one of `Steps`/`BulletList`, then at most one `Callout`, then an
  optional closing paragraph/link (used by Installing's uninstall blurb). Also renders the
  `lg:hidden` "← back to chapter" link for mobile, since the nested sidebar list is `lg:`-only.
- **Docs shell (`docs-shell.tsx`):** the sidebar-plus-content flex row, shared by `app/docs/layout.tsx`
  and `app/plugin/layout.tsx` so both chapter areas get the same nav without duplicating layout markup.
- **Docs nav (`docs-nav.tsx`):** chapter tabs for `/docs` and `/plugin` — vertical list on `lg:` and
  up, horizontal scrollable pill row on mobile. Client component, active tab via `usePathname`.
  Chapters with sub-chapters (Using each feature, Krita plugin) expand a nested indented list under
  themselves once a route inside that chapter is active, `lg:`-only. On `lg:` and up the list is
  `sticky top-24`, capped at `max-h-[calc(100vh-7rem)]` with `overflow-y-auto` so it stays pinned
  below the fixed header (and scrolls internally, not the page) even when fully expanded. Every
  chapter/sub-chapter `Link` uses `scroll={false}` — Next's own default (preserve scroll position on
  client navigation) is what keeps the reader's place on click; there's no custom scroll-restore
  code. `ScrollToTop` (`scroll-to-top.tsx`) is the other half: it force-resets scroll to top on every
  other route change (App Router doesn't do this reliably on its own), but skips that reset for any
  navigation that starts and ends inside the docs area (`/docs/*` or `/plugin`, since `/plugin`
  shares this sidebar) so the two mechanisms don't fight each other.
- **Download button (`download-button.tsx`):** the hero's primary CTA — see Download flow above.
  Detects the visitor's OS after mount and leads with the matching glyph
  (`WindowsGlyph`/`MacGlyph`/`LinuxGlyph`); falls back to a plain `/download` link pre-mount or on
  an unrecognized OS. Reused on the discovery pages.
- **Platform icons (`platform-icons.tsx`):** small, purely informational OS row under the hero
  CTAs — Windows/macOS/Linux, generic inline-SVG glyphs (also exports the glyphs for reuse by
  `download-button.tsx` and the `/download` page), wording sourced from `lib/content.ts`'s
  `platforms` (kept in sync with the FAQ's platform answer).
- **File download link (`file-download-link.tsx`):** shared `<a download>` + click-cooldown
  primitive (no redirect) used by the `/download` page's per-file buttons and
  `plugin-download-button.tsx`, so that logic isn't repeated per file.
- **FAQ (`faq.tsx`):** native `<details>` accordion.
- **Footer (`site-footer.tsx`):** maker signature, license, link columns — Product, **Guides**
  (the three discovery pages), Maker. Row wraps (`flex-wrap`) so three columns stay mobile-safe.
  Internal links use `next/link`; external repo links keep `target="_blank"`. The copyright line
  also carries a lone `Privacy` link (`footer.legal`) — no fourth column for one link.
- **JSON-LD (`json-ld.tsx`):** renders one `application/ld+json` block from a passed object,
  escaping `<` to close the `</script>` breakout. Reused by layout, home, docs, discovery pages.
- **Discovery page (`discovery-page.tsx`):** shared template for the SEO landing routes — intro
  (h1 + CTAs), alternating `Section` blocks reusing existing media motifs, closing CTA,
  `BreadcrumbList` JSON-LD. Copy lives in `lib/content.ts`.

## External Links

- **Download (hero):** served locally from `public/download/`, see Download flow above — not an
  external link.
- **Download (footer):** points to the local `/download` page (`links.download`), same as the
  hero badge; GitHub Releases is still reachable from "View source" and from `/download`'s
  closing line, for release notes or older versions.
- **Source:** hero secondary CTA + nav + footer → the repo.
- **Issues:** "Request a feature" (What's next) + footer.
- **Plugin build-from-source guide:** the Installing sub-chapter's closing link
  (`pluginSubchapters` → `installing.closingLink`) → the repo's Rust/cargo README, for the rare
  reader who wants to build the plugin themselves instead of using the zip download.
- **GitHub profile / Personal portfolio:** footer, tied to the maker signature.

## SEO & Discoverability

Discovery targets two tracks: the _problems_ painters search for (recovering a painting, avoiding
`_final_2.kra` copies, surviving a crash) and the product's own name, since "Krita VCS" gets typed
and typo'd as KVC, Krita VC, KritaVC, Krita-VC, and Krita Version Control. Both feed clean
structured data for AI answer engines. The painter-first voice is preserved throughout: keywords
live in metadata, FAQ answers, and JSON-LD, with only light surfacing of aliases in visible copy
(the footer's alias line, the plugin page heading).

- **Canonical origin:** `https://krita-vc.zeru-sakamoto.codes`, via `siteUrl` in `lib/content.ts`
  (env-overridable with `NEXT_PUBLIC_SITE_URL`). Feeds `metadataBase`, canonicals, sitemap, OG.
- **Metadata (`app/layout.tsx`):** `metadataBase`, title template `%s · Krita VCS`, keywords
  (problem-phrases plus brand-name variants: KVC, KritaVC, Krita VC, Krita-VC, Krita Version
  Control), author/creator, Open Graph (`website`, siteName, locale), Twitter `summary_large_image`,
  robots with `max-image-preview: large`, and a Search Console hook
  (`NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`). Canonical + `og:url` are **not** set on the root layout
  (metadata inherits root→page, which would point every page at `/`); the homepage sets its own
  canonical in `app/page.tsx`, other routes set theirs. Docs use a nested template
  `%s · Documentation · Krita VCS`.
- **Structured data (JSON-LD):** `WebSite` + `Person` site-wide (layout). `WebSite` and the
  homepage's `SoftwareApplication` both carry an `alternateName` array (`site.alternateNames` in
  `lib/content.ts`: KVC, KritaVC, Krita VC, Krita-VC, Krita Version Control) so answer engines
  resolve any of them to this product. `SoftwareApplication` (free/MIT/Windows, `downloadUrl`,
  version) + `FAQPage` (mapped from the `faq` array, including two entries disambiguating the
  KVC/Krita VC naming) on the home page; `BreadcrumbList` on docs + discovery pages. FAQ/HowTo rich
  results are Google-restricted now, but the schema still aids AI answer engines — HowTo markup is
  deliberately skipped.
- **Share image (`app/opengraph-image.tsx`):** dynamic 1200×630 card via `next/og` — brush logo,
  `Krita VCS` in Syne, tagline, `Free · local-only · MIT` on the brand canvas gradient. Honest
  media, literal DESIGN.md hex (Satori can't read CSS vars). Fonts fetched from Google with a
  graceful fallback so an offline build still renders on the built-in font. Covers `twitter:image`
  too (X falls back to `og:image`), so there is no separate `twitter-image`.
- **`robots.ts` / `sitemap.ts`:** allow-all robots pointing at the sitemap; sitemap built from the
  `docsChapters`/`discoveryPages` exports so it never drifts from the routes.
- **Discovery routes:** `/recover-a-krita-version` (go back to an earlier version),
  `/vs-saving-copies` (an alternative to `_final_final.kra` copies), and
  `/recover-after-a-krita-crash` (the panic search after Krita crashes or closes without saving —
  targets non-technical searchers who don't know the product exists yet) — distinct search intent
  from the homepage and from each other, cross-linked from the footer "Guides" column.
- **Repo-level signal:** `package.json`'s `name`/`description` and `README.md` also name the
  product and its aliases, since GitHub and code-crawling AI agents read those directly, not just
  the rendered site.
