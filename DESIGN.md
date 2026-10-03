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
invented metrics. Product screenshots are allowed and wanted — a real capture of the app,
shown honestly — but until one exists the hero carries a placeholder that says so on its face.
What stays banned is invented UI passed off as real. Landing-page copy stays short: one or two
sentences per feature block and one line per roadmap item. The detail lives in `/docs`.

## Stack

- Next.js App Router (Server Components default, Client Components for interactive bits)
- Tailwind CSS v4 (`@theme inline` tokens in `app/globals.css`, no `tailwind.config.js`)
- GSAP + ScrollTrigger (scroll-driven brush stroke) — a dependency (`gsap`)
- Three.js + React Three Fiber (`three`, `@react-three/fiber`) — the 3D hero only, lazy-loaded
- Fonts: Geist Sans/Mono + Syne (display), via `next/font`
- Vercel hosting

`@designcodeio/threeui` was evaluated for the hero and rejected. It is not a React Three Fiber
library (nothing in it references `@react-three/fiber`), and most of its components are
`<iframe srcDoc>` documents that fetch three.js, GSAP and Tailwind from jsdelivr, unpkg, cdnjs
and skypack at runtime. Third-party CDN calls contradict the product's local-only promise and
its privacy policy, so the hero's ambient particle field is built in the scene itself instead.
No drei either: `useLoader` + `useFrame` cover everything the scene needs.

## Colors

Dark-locked (Krita workspace theme). Tokens live in the `@theme` block of `app/globals.css`;
reference `var(--color-*)`, never inline hex.

`globals.css` also defines two hero-only mask classes. `.hero-backdrop` fades the top (under
the header, top 12%) and bottom (into the next section, last 6%) of the full-section 3D layer; left and right are
the viewport edges and the desk's own radial falloff handles those.

| Role                    | Name           | Hex       | Token            |
| ----------------------- | -------------- | --------- | ---------------- |
| Base bg                 | Charcoal Slate | `#1E1E24` | `bg-canvas-dark` |
| Deep bg (panels/footer) | Deep Ink       | `#151518` | `bg-canvas-deep` |
| Primary brand           | Krita Blue     | `#2E86DE` | `brand-blue`     |
| Warm accent             | Sunset Orange  | `#FF6B6B` | `accent-warm`    |
| Cool accent             | Electric Cyan  | `#00D2D3` | `accent-cool`    |
| Text primary            | Paper White    | `#F5F6FA` | `text-primary`   |
| Text muted              | Brush Grey     | `#A0A0B0` | `text-muted`     |
| Power LED on (hero 3D)  | Status Green   | `#3DDC84` | `status-on`      |
| Power LED off (hero 3D) | Status Red     | `#FF4757` | `status-off`     |

The two status colours exist only for the hero tablet's power LED ring (the easter egg,
see the hero section); they are not part of the UI palette and never appear in 2D.

## Canvas Grain Texture

SVG noise filter, fixed behind the content, `pointer-events-none`, decorative, low opacity.
It lives in `app/globals.css` as `body::before` — a data-URI SVG on a 180px tile with
`background-repeat: repeat`, not a full-viewport filtered `<rect>`. Same fractal noise, but
the browser rasterizes it once on a small tile instead of re-rasterizing the whole viewport
on every resize. Keep it a tile: the full-viewport version measured as a paint and layout-
stability cost.

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

**Everything below the hero stays 2D by design.** No canvas, no WebGL, no scroll-linked depth
or `translateZ` parallax in the feature sections. Continuity with the hero is carried in flat
CSS instead: a soft radial glow per section sitting where the hero's key light would fall
(`SectionGlow` in `section.tsx`, following the existing left/right alternation rather than
introducing a second rhythm), panel materials with a lit top edge falling to shadow, and a
heading scale set at half the hero's display size so the step down reads as deliberate. One
WebGL context exists on the whole page, and it belongs to the hero.

1. **Hero: a big lit tablet top-left, the words bottom-right.** Side by side (`hero-wide`,
   landscape `lg`) the tablet sits top-left and the text block (a two-line headline, one short
   paragraph and one primary CTA, the OS-aware download button) sits in the bottom-right
   corner, right-aligned, 58% of the frame wide. Both use the header's gutters (`max-w-6xl`
   less its `px-6`, i.e. `max-w-[69rem]`), so the headline ends under GitHub and the tablet
   starts under the logo. The headline may cover the tablet's outer bezel, never its screen
   (the text is always on top, `z-10`). The scroll cue and the live GitHub badge share the
   bottom row, bottom-left under the tablet. No eyebrow, no secondary CTA, no platform-icon
   row. The 3D scene covers the **whole hero section** behind everything (desk, grid, dust
   and haze run under the words too); its camera frames the tablet on one box,
   `#hero-scene-anchor`.

   - **Copy.** `hero.headlineLines` (`['Version control', 'for your art.']`) is set as two
     block `<span>`s inside one `<h1>`, so it breaks where the copy says; `hero.headline` is
     the same sentence joined, for metadata and the OG alt. The sub is 19 words and carries the
     painter-voice promise ("compare or go back to", "no git jargon"). The old "not your code"
     half was dropped: it was dev-coded, and the sentence couldn't set as two large lines in a
     half-width column.
   - **Size is tied to the column, not the viewport.** From `sm` up each line is `nowrap`
     and sized `min(8.6cqw, 3.5rem)` (`5.5rem` cap at `hero-wide`) against the text block, which is
     a `@container`. "Version control" in Syne ExtraBold is ~11.3em wide, so 8.6cqw always
     fits its block (58% of the 69rem frame at `hero-wide`). (A viewport-based `4.3vw` pushed the line
     126px past its column into the scene at 1440.) Below `sm` it's
     `clamp(1.75rem, 8.2vw, 3.5rem)` and may wrap once at the space.
   - **The tablet's box, and the hero is one screen.** At `hero-wide` the anchor wrapper is
     `display: contents`, so the anchor positions against the section itself: left edge on
     the header's gutter, `max(1.5rem, (100% - 69rem) / 2)`, top at `5rem` (under the header),
     86% of the hero wide and `100% - 15rem` tall, which reaches into the headline. The words
     and badge are one `mt-auto` flex row at the section's bottom. The section is `min-h-svh`,
     so the whole hero is always one viewport tall. The parent owns every height (CLS 0).
   - **Two layout queries, not `md`/`lg`.** Side by side is the `hero-wide` custom variant,
     `(min-width: 1024px) and (min-aspect-ratio: 1/1)`: landscape only, because on a portrait
     lg screen (iPad Pro, 1024×1366) the width-bound tablet sank to the bottom under ~500px of
     empty grid. Whether the scene mounts at all is `hero-stage`: side by side with ≥ 500px of
     height, or stacked (≥ 768px wide) with ≥ 780px. Both are
     defined in `globals.css` (`@custom-variant`, `hero-stage` first so `hero-wide:contents`
     wins) and mirrored as `HERO_WIDE` / `HERO_STAGE` in `hero-loader.tsx` for the JS gates.
   - **Stacked, scene first.** Tablets and portrait lg get the scene _above_ the headline
     (it comes first in the flow), height `min(36rem, 100svh - 32rem)`: whatever the ~32rem of header, text
     and bottom bar leave, so the hero stays one screen. The camera fits the tablet's own
     outline to that box (92%, see Camera below) and centres it. Phones, phones on
     their side (844×390: the old width-only gate put a 150px tablet above the fold and the CTA
     below it) and short windows leave the box `hidden` and get the text-only hero.
   - **Reduced motion keeps the tablet, still.** Under `prefers-reduced-motion: reduce` the
     scene mounts like any other and every ambient movement stops (camera sway, pointer
     orbit, scroll tilt, pen bob and drift, dust and haze drift, LED pulse). The pen doesn't
     follow the mouse or tap; the power button still switches the screen, instantly instead
     of fading. `hero-canvas.tsx` reads the live `MediaQueryList`, so an OS toggle takes
     effect on the next frame.
   - Verified at 3440×1440, 2560×1440, 1920×1080, 1536×864, 1366×768, 1280×1024, 1280×720,
     1100×1050, 1024×768, 1024×600, 1024×1366, 912×1368, 820×1180, 768×1024, 768×800, 768×760,
     932×430, 844×390, 390×844 and 360×740, plus reduced motion (still scene) at 1920×1080,
     1024×1366 and 820×1180: the hero is one screen (text-only landscape phones overflow slightly but keep
     the CTA in view), no horizontal scroll, CTA on one line.

   - **Bottom bar.** An in-flow row under the grid (so it can't collide with the CTA on
     short screens), on the same gutters as the text. Left: a minimal scroll cue, a 40px
     hairline with a tick travelling down it (`.hero-scroll-tick` in `globals.css`; it rests
     at the top under reduced motion), linking to `#why`. Right: a live GitHub badge
     (`hero-meta.tsx`), a star count plus the license's SPDX id with an icon for its type
     (GNU head for the GPL family, OSI keyhole for an allow-list of OSI licenses, GitHub's
     generic license glyph otherwise; `license-glyphs.tsx`, Octicons MIT + Simple Icons CC0,
     inlined). One link to the repo, with a full sentence as its `aria-label`. The data comes
     from `lib/github.ts`: a server-side `fetch` of the GitHub API with
     `next: { revalidate: 3600 }`, so the homepage stays static and refreshes hourly (ISR),
     and visitors' browsers never call GitHub (the local-only promise holds). If GitHub
     can't be reached the badge renders nothing rather than a guessed number.

   See "3D hero" under GSAP Animation for the scene itself.

2. **Why artists use it — full-width points grid.** No media column. Intro + five value props
   in a two-column grid. Breaks the two-column rhythm before the feature blocks. Each prop is a
   heading only, with an authored line glyph beside it (`why-glyphs.tsx`: 24px grid, 1.5 stroke,
   `currentColor`, decorative) tinted cool / blue / blue / warm / blue. No body paragraphs here;
   the feature blocks below carry the detail. Glyphs stay painter-coded (screen with a lock,
   tile grid, swipe-split canvas, a stroke that wanders off and returns, layer stack), never
   git-graph or terminal iconography, and sit bare with no tinted tile behind them.
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

- **3D hero** (`app/components/hero-scene.tsx`, `hero-canvas.tsx`): an isometric desk scene in
  a React Three Fiber canvas. A HUION Kamvas 13 (`public/models/kamvas-tablet.glb`) sits on a
  desk, propped 20° at the back like a pen display on its kickstand, with the stylus
  (`kamvas-stylus.glb`) hovering over the right of the screen.
  - **Camera.** `OrthographicCamera`, pitched 35° down and yawed 20° round to the tablet's
    left: corner-on enough to read as an object, square-on enough that the screen reads (45°
    was tried and felt too steep). The pen leans out toward the viewer. Pointer orbit is ±2.5°
    yaw / ±1.5° pitch, with the yaw inverted (the camera swings away from the pointer, so the
    tablet turns its face toward it), and it holds still while the pen is following the mouse
    (see below). On top of that sits an idle sway, like a handheld camera
    at rest: two summed sines per axis on slow, unrelated periods (~12–35s), peaking around 2°
    yaw and 1° pitch, so it never reads as a loop. Scrolling the hero away tilts it up to ~8° toward top-down. The scroll
    value comes from a ScrollTrigger on `#top`, which shares `gsap.ticker` with Lenis and the
    brush stroke.
  - **Framing on an anchor.** The canvas fills the whole hero (`.hero-backdrop`, behind the
    text). The camera measures `#hero-scene-anchor` (see the Hero layout) against the canvas
    with a `ResizeObserver` and slides sideways in its own plane to place the tablet.
    Orthographic, so the slide pans without changing the angle.
  - **Fitted to the box, pinned top-left.** Once the models load, `Stage` projects every
    tablet and pen vertex (pen in its base pose) onto the rest-pose camera's horizontal and up
    axes and stores the outline's extent. The camera zooms so that outline fills 92% of the
    anchor (the rest is room for the orbit, sway and pen bob). At `hero-wide` it pins the
    outline's left and top edges to the anchor's top-left corner; stacked it centres it both
    ways. Before the models land, a fallback zoom of `min(anchorHeight / 5.2, anchorWidth /
6.5)` holds the first frames.
  - **Desk.** One 40×40 `MeshStandardMaterial` plane with two shader patches (`onBeforeCompile`):
    an `fwidth`-antialiased grid in Krita Blue, ~8.5% at the tablet falling to a 2.5% floor,
    so it stays subtly visible across the whole hero including under the text (felt, not
    seen), and a radial alpha falloff (8 to 18 units) wide enough to cover the section with no
    edge ever showing. The desk's base colour _and_ its emissive floor are `--color-canvas-dark`, the page
    background, so an unlit patch of desk is exactly the page colour and the canvas never reads
    as a darker box. The material is dithered, or the long shallow fade bands into rings.
    Fog uses the same token for the same reason. This deliberately departs from a Deep Ink
    fade: Deep Ink against the Charcoal Slate page showed as a rectangle.
  - **Prop.** The tablet group pivots on its front edge (which stays on the desk) and tilts the
    back up. A flat leg in the tablet's own `BezelPlastic` material runs from the underside to
    the desk behind. A contact shadow quad is tight and dark along the front edge and soft and
    faint under the raised back; that difference is what makes the prop read at this angle. The
    chassis material is cloned at `metalness: 0.35` because fully metallic with no environment
    renders black, and its sides are what show the wedge.
  - **The screen is the light.** A `RectAreaLight` (`RectAreaLightUniformsLib.init()`) sits on
    the panel at the panel's size, emitting along the panel normal and tilting with it. Its
    colour is the screenshot's average, sampled once from the `fitToPanel()` canvas and
    normalised to full brightness (hue only; intensity carries brightness). Desk, bezel, leg and
    pen are all `MeshStandardMaterial`, so they respond. The pen body is lifted from 0.02 to
    ~0.07 albedo so the spill shows on its underside. An additive light-pool quad on the desk
    follows the tilted throw, reaching 3.4 units in front and 2.4 behind. Everything else is
    minimal: a Krita Blue ambient at 0.22 so shadows aren't black, and a dim Electric Cyan rim
    at 0.7 from behind-left for silhouettes. The Screen material stays emissive-only (black base
    colour), so no light tints the UI.
  - **Stylus hover.** Lives in the tilted tablet frame, so the gap is measured along the panel's
    normal, not world up. The nib sits 1.6cm above the glass (model scale) with a slow bob and
    drift, clamped to a 3mm minimum every frame; the wobble rotates about the nib, so it can't
    change the gap. Under the nib, the pen display's own hover cursor (a thin crosshair with an
    open centre, Paper White on a Deep Ink halo) tracks it straight down the normal; the space
    between cursor and nib is what shows the height.
  - **Pen follows the mouse over the glass.** Each frame the pointer's last client position is
    cast into the tablet frame and met with the screen surface as a plain plane (no mesh
    raycast; the canvas stays `pointer-events: none`). Anywhere on the 16:9 panel counts,
    including where the headline sits on top of it; a 2mm slack past the edge on the way out
    absorbs the orbit's last bit of easing. While on the glass the nib eases to the hit
    point (damp rate 20, ~0.15s), dips from 16mm to 5mm (bob and drift soften to 40%), and the
    pen's top leans up to ~8° toward its travel, rotating about the nib in the tablet's axes.
    The nib's final position (after the drift) is clamped to the glass, so neither it nor the
    crosshair ever sits on the bezel. Off the glass it glides home at rate 4.5 (~0.7s) and
    lifts back to hover height. While the pen follows, the pointer orbit is _held_ at its value
    on entry, so the tablet holds still in use (the idle sway and scroll tilt carry on). Held,
    not faded to zero: easing the orbit back moved the glass up to ~13mm under a still cursor
    near the right edge, which needed a 1cm exit slack and let the pen overshoot whichever
    edge it left by. Touch pointers are ignored, and scrolling under a still mouse re-targets
    or releases the pen, since the hit is recomputed every frame.
  - **Click to tap.** A primary click (window `pointerdown`, mouse or pen) while the pen is
    following makes the nib meet the glass: down in 70ms, springing back up in 110ms. Holding
    the button keeps it on the glass (it drags along with the mouse) until release, or until
    the pointer leaves the screen; a quick click still gets the full touchdown before the
    lift. This is the one time the no-contact floor is lifted. Where it touched, the display
    draws a thin
    Paper White ring growing to 12mm and fading over 0.5s, clipped to the panel. Clicks whose
    target is a link, button, form control, `summary` or `label` never reach the scene, so
    the CTA and nav stay side-effect free. The hero section is `select-none`, so clicking and
    dragging over the tablet never paints a text selection across the scene.
  - **Power button easter egg.** The GLB's `PowerButton` (a 14.3 × 4.8mm pill, top-left of the
    bezel at the back edge) is hit-tested with 3mm padding. Hovering it sets a pointer cursor
    on `body`, the only hint besides the LED. Clicking it fades the screen off over 0.3s:
    the Screen's emissive, the `RectAreaLight` and the desk light pool all go to zero, so the
    scene falls back to its ambient and rim light. The hover crosshair and tap ripple go
    too (a dark display draws only its message), but the pen still follows and taps. As the
    picture fades, the dark screen shows "Why'd you turn it off?" over a staring `(ಠ_ಠ)` (or `(•_•)` where no installed font has those glyphs, checked by drawing them against the missing-glyph box) in
    Paper (`--color-primary`) and the page font, drawn once to a canvas texture on a plane just
    above the glass; the copy is `hero.screenOff` in `lib/content.ts`. Clicking again
    fades it back. Not persisted: every load starts on. The LED is a thin additive outline
    traced around the pill (a stadium SDF, not in the model): Status Green with a soft
    brightening every ~6s while on, a steady dimmer Status Red while off, cross-fading with
    the screen. Not keyboard-reachable, by design: the canvas is decorative and `aria-hidden`.
  - **Atmosphere covers the whole hero.** 260 dust motes (sparse on purpose) in a 22-unit
    field centred 3.5 units left of the tablet along the camera's right axis, so it reaches the
    text side; additive, in Krita Blue / Electric Cyan / Sunset Orange (warm rarest). Motes near
    the screen are brighter and lean toward its colour. The field sways rather than spins (a
    spin would carry the off-centre field out of frame). Six soft haze billboards (Blue, Cyan,
    Orange at 4.5-11% opacity), three around the tablet and three out toward the text, drift
    slowly. Their falloff is computed in the shader, because a
    canvas-gradient sprite banded into visible rings at that scale.
  - Every colour comes from `readPalette()` (`getComputedStyle` on `:root`); no inline hex. The
    screen shows `public/hero-screenshot.png` through `fitToPanel()` (16:10 fitted to the 16:9
    panel by stretching its outer 1px columns); swapping that one file (then rerunning
    `scripts/build-webp.mjs`, which the build does anyway) is the whole migration path. The
    canvas loads the pixel-identical lossless `hero-screenshot.webp` the script makes from it.
  - Performance: DPR capped at 1.5 (the canvas covers the whole hero and every desk pixel runs
    the RectAreaLight shading); the render loop stops while the hero is off screen; the GLBs are
    meshopt-compressed and quantized; the models and screenshot are preloaded as soon as the
    scene is known to mount, in parallel with the 3D chunk.
  - **No image fallback.** The canvas mounts only when all of these hold: the viewport
    matches `HERO_STAGE` (see the hero section above), `hardwareConcurrency` ≥ 4, and a
    WebGL context is obtainable. Otherwise the hero is text only: every word and control lives
    in the DOM, so nothing is lost but the picture.
  - **Loader (homepage only).** `hero-loader.tsx` is a full-screen Deep Ink overlay (logo + Krita
    Blue progress bar, counted per file via `THREE.DefaultLoadingManager`) that SSR renders
    visible, so the page never paints before the tablet. It lifts when the canvas is ready, at
    hydration when 3D won't render (phones, short screens, no WebGL), after 8s, or when WebGL
    context retries run out (the stage is then left empty). While up it locks scroll and hides the fixed header (the hero sits
    in a `z-10` stacking context, so it can't out-stack it); the `[data-hero-in]` intro stagger
    plays as it lifts. A `<noscript>` style hides it for JS-off visitors.
  - **Intro (first 3D load per tab session).** Instead of fading, the loader hands off to the
    tablet in one ~3.9s GSAP timeline (`hero-loader.tsx`) driving the `heroIntro` values the
    canvas reads each frame. The logo already shows at 3x (144px) while loading. 0-0.5s: the bar fades, the logo holds. 0.5s: the overlay
    drops on a single frame. Underneath, the canvas is already showing an opening shot, square-on
    down the propped screen's normal, zoomed so the screen overfills the viewport (1.05x), with a
    logo screen drawn on the glass: `--color-canvas-deep` fill plus the logo at the loader logo's
    exact client position and 144px size. The canvas is `flat` (no tone mapping) and the shader
    ends in `colorspace_fragment`, so the fill is the loader's hex and the cut can't be seen. The
    logo screen draws last with no depth test, because additive glows behind the glass would
    otherwise bleed through. 0.5-1.7s: the camera blends (slerp, log-space zoom) into the live
    rest pose, the dust and haze fade in, and `--hero-edge` brings the backdrop's edge mask back.
    During the pull-back the screen's centre travels a straight
    line in screen px from the logo's spot to its rest spot, with the camera placed around it
    (blending camera positions in world space against the log zoom swung the tablet far past
    its rest spot and back: measured at 1512×793, down to y≈927 before settling at 320).
    From 1.2s the header fades in. 1.7-2.1s, the launch: the logo screen fades and
    shrinks to 0.85 while the screenshot settles from 1.04x, and the screen light rises from 12%.
    1.7-2.9s (experimental): the pen comes out of the logo. It starts lying flat on the glass
    exactly over the logo's grey pen, at that pen's size and angle (`LOGO_PEN`, measured off
    `logo.svg`'s path), shows through as the logo screen fades, then lifts in a low arc, grows to
    full size and turns into its hover pose (smootherstep, so it lingers on the logo first).
    From 2.9s, once the pen is out, the hero's words stagger in. Pen follow, taps and the power button stay off until
    the intro ends. Any wheel, touch, key or click jumps to the end. It plays only from the top
    of the page, without reduced motion, and once per session (`sessionStorage`
    `kvc-hero-intro`); every other path uses the plain fade onto the settled scene, and so do the
    8s give-up and a lost context.
  - **Never in the shared bundle.** `next/dynamic(..., { ssr: false })` from inside a Client
    Component, the same shape as `flourishes.tsx`, keeps `three` off every other route. The
    canvas also waits for an IntersectionObserver before mounting, so it never competes with
    first paint.
  - **Lost contexts are recovered.** GPU resets and long backgrounding kill WebGL contexts in the
    wild, and a lost context can only be replaced by a fresh canvas element, so `webglcontextlost`
    bumps a key that remounts the canvas (capped at two retries). This also absorbs React
    StrictMode's dev double-mount, where R3F's unmount fires `forceContextLoss()` on a 500ms timer
    that would otherwise land on the remounted renderer.
  - Nothing in the 3D layer is interactive, so nothing there needs a DOM equivalent. The canvas is
    `pointer-events-none`, `tabIndex={-1}`, and inside an `aria-hidden` wrapper: it never enters
    the tab order or the accessibility tree.
- **Brush stroke** (`app/components/brush-stroke.tsx`): one stroke revealed by a scroll-driven
  clip-path rect (plain viewBox Y-units, not `strokeDashoffset`) tied to scroll position, not
  timers. It starts at the 3D pen's nib: `hero-canvas.tsx` projects the nib to client px every
  frame and hands it over through `penTip` (`hero-loader.tsx`), and the stroke rewrites its first
  curve to leave that point straight down, so the pen reads as drawing it wherever the bob, the
  mouse follow, a tap or the intro has put it. The SVG stacks over the hero canvas, under the
  hero text and under every section below. Without the scene (phones, no WebGL) it starts in the
  right-hand column (x 700 of 960). The whole SVG is hidden at scroll 0 (loader and untouched
  hero) and fades in on the first scroll. From then on a faint
  guide reads ahead of the tip. Under `prefers-reduced-motion: reduce`, the stroke shows fully
  drawn and scroll wiring is skipped.
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
1. Visual Foundation Layer — grain, base theme, tokens (all in globals.css)
2. Reversible Content Container — Section template, alternating grid
3. Painterly Media — honest inline-SVG motifs (media.tsx) for the feature sections
4. 3D Hero: R3F isometric desk scene, lazy, text-only where it won't run
4. Dynamic Vector Directives — GSAP scroll brush stroke
```

- **Header (`site-header.tsx`):** wordmark + anchor links (Why / Features / FAQ) + Docs route
  link + GitHub button. Transparent → frosted `canvas-deep` on scroll. Anchor hrefs are
  path-qualified (`/#why`, not `#why`) so they resolve correctly from `/docs` too; wordmark and
  Docs use `next/link` for client-side route navigation.
- **Body blocks (`section.tsx`):** one reusable template, toggles `flex-row` /
  `flex-row-reverse` for alternation — no duplicated markup. `eyebrow` is optional and used
  sparingly (the page leans on strong headings, not a mono-caps kicker over every section).
- **Media (`media.tsx`):** `DiffMedia`, `BranchMedia`, `OwnershipMedia`, `SignatureMedia`,
  `PerformanceMedia`, `PanelMedia` — abstract painterly vector, all colors via tokens. (`LayersMedia`
  is gone; the 3D hero replaced the motif it existed for.) The shared `Panel` carries the flat
  translation of the hero's material: a lit top edge falling to shadow over `canvas-deep`.
- **Hero scene (`hero-scene.tsx` / `hero-canvas.tsx`):** capability gate + lazy canvas, and the
  scene itself. The only WebGL on the site.
- **Download button (`download-button.tsx`):** renders a neutral "Download for free" on the
  server and swaps to "Download for <OS>" once the platform resolves after hydration. It carries
  its own `min-w` floor sized to the widest label, so that swap can't shove the CTA beside it
  sideways — without it the GitHub link jumped 58px about 700ms after load.
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
- **Platform icons (`platform-icons.tsx`):** small, purely informational OS row under the
  discovery pages' CTAs (the homepage hero dropped it for a single CTA) — Windows/macOS/Linux, generic inline-SVG glyphs (also exports the glyphs for reuse by
  `download-button.tsx` and the `/download` page), wording sourced from `lib/content.ts`'s
  `platforms` (kept in sync with the FAQ's platform answer).
- **File download link (`file-download-link.tsx`):** shared `<a download>` + click-cooldown
  primitive (no redirect) used by the `/download` page's per-file buttons and
  `plugin-download-button.tsx`, so that logic isn't repeated per file.
- **FAQ (`faq.tsx`):** native `<details>` accordion.
- **Footer (`site-footer.tsx`):** maker signature, license, link columns — Product, **Guides**
  (derived from `discoveryPages`, so a new guide needs one entry), Maker. Row wraps (`flex-wrap`) so three columns stay mobile-safe.
  Internal links use `next/link`; external repo links keep `target="_blank"`. The copyright line
  also carries a lone `Privacy` link (`footer.legal`) — no fourth column for one link.
- **JSON-LD (`json-ld.tsx`):** renders one `application/ld+json` block from a passed object,
  escaping `<` to close the `</script>` breakout. Reused by layout, home, docs, discovery pages.
- **Discovery page (`discovery-page.tsx`):** shared template for the SEO landing routes — intro
  (h1 + CTAs), alternating `Section` blocks reusing existing media motifs, a "More guides"
  cross-link list (the other `discoveryPages`), closing CTA, `BreadcrumbList` + `Article`
  JSON-LD. Copy lives in `lib/content.ts`.
- **404 (`not-found.tsx`):** eyebrow + h1 + three pill links (home, getting started, download),
  `robots: { index: false }`. Same read-once framing as `/privacy`.

## External Links

- **Download (hero):** served locally from `public/download/`, see Download flow above — not an
  external link.
- **Download (footer):** points to the local `/download` page (`links.download`), same as the
  hero badge; GitHub Releases is still reachable from the repo and from `/download`'s
  closing line, for release notes or older versions.
- **Source:** nav + footer → the repo.
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
  canonical in `app/page.tsx`, other routes set theirs — all of them through `pageMeta()` in
  `lib/content.ts`, which is the only supported way to set page metadata here. Setting `openGraph`
  on a page **replaces** the parent's whole object, including the `opengraph-image.tsx` file
  convention, so `pageMeta` restates siteName/locale/images; hand-rolling the block silently drops
  the share image. Docs use a nested template `%s · Documentation · Krita VCS`.
  `viewport.themeColor` is `--color-canvas-deep`, so mobile browser chrome matches the dark site.
- **Structured data (JSON-LD):** `WebSite` + `Person` site-wide (layout). `WebSite` and the
  homepage's `SoftwareApplication` both carry an `alternateName` array (`site.alternateNames` in
  `lib/content.ts`: KVC, KritaVC, Krita VC, Krita-VC, Krita Version Control) so answer engines
  resolve any of them to this product. `SoftwareApplication` (free/GPL-3.0/Windows, `downloadUrl`,
  version) + `FAQPage` (mapped from the `faq` array, including one entry disambiguating the
  KVC/Krita VC naming) on the home page; `BreadcrumbList` on docs + discovery pages. FAQ/HowTo rich
  results are Google-restricted now, but the schema still aids AI answer engines — HowTo markup is
  deliberately skipped.
- **Share image (`app/opengraph-image.tsx`):** dynamic 1200×630 card via `next/og` — brush logo,
  `Krita VCS` in Syne, tagline, `Free · local-only · GPL-3.0` on the brand canvas gradient. Honest
  media, literal DESIGN.md hex (Satori can't read CSS vars). Fonts fetched from Google with a
  graceful fallback so an offline build still renders on the built-in font. Covers `twitter:image`
  too (X falls back to `og:image`), so there is no separate `twitter-image`.
- **`robots.ts` / `sitemap.ts`:** allow-all robots pointing at the sitemap; sitemap built from the
  `docsChapters`/`discoveryPages` exports so it never drifts from the routes. `/docs` and
  `/docs/plugin` are `redirect()` shells and are deliberately kept out of the sitemap.
- **Discovery routes:** `/recover-a-krita-version` (go back to an earlier version),
  `/vs-saving-copies` (an alternative to `_final_final.kra` copies), and
  `/recover-after-a-krita-crash` (the panic search after Krita crashes or closes without saving —
  targets non-technical searchers who don't know the product exists yet), `/compare-krita-versions`
  (seeing what changed between two saves), `/backup-krita-files` (backing up the history, not just
  the newest file), and `/krita-undo-limit` (undo running out, and why saved versions outlive it) —
  distinct search intent from the homepage and from each other, cross-linked from the footer
  "Guides" column and from each other's "More guides" list.
- **Repo-level signal:** `package.json`'s `name`/`description` and `README.md` also name the
  product and its aliases, since GitHub and code-crawling AI agents read those directly, not just
  the rendered site.
