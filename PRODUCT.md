# Product

## Register

brand

## Users

Krita painters — digital artists who want real version control (save, compare, branch,
roll back) without touching git, terminals, or developer jargon. They're evaluating whether
to download a free, local-only tool from a single landing page, usually on a phone or laptop,
often mid-search for "how do I stop losing painting versions."

## Product Purpose

Krita VCS is a free, local-only version-control app for Krita painters: every save becomes a
version they can revisit, compare layer-by-layer, branch from, or roll back to — with zero
cloud accounts, zero uploads, and zero git jargon. The landing page's job is to make that value
click in plain language and convert to a download or a GitHub visit. Success: a visitor
understands what the tool does without needing to know what "commit" or "diff" mean.

## Brand Personality

Painter-first, plain-language, calm. Practices what "Artist Mode" (the product's own
jargon-off feature) preaches: say "version / save / go back," not "commit / hash / rollback."
Confident and quiet rather than hype-driven — no invented metrics, no fake product screenshots,
no urgency tactics.

## Anti-references

- Generic SaaS / dev-tool marketing aesthetic: gradient hero text, hero-metric stat rows,
  glassmorphism cards, tiny uppercase eyebrows over every section, numbered 01/02/03 scaffolding.
- Fake or implied app chrome — no browser-window screenshots, no fabricated UI mockups standing
  in for real product shots (per DESIGN.md, media is honest inline-SVG painterly motifs instead).
- Developer-tool-coded visuals or copy (terminal aesthetics, monospace-everywhere, git-branded
  iconography) — this is a tool for painters, not programmers, even though it does git-like work
  under the hood.

## Design Principles

- Say it the way a painter would say it — plain language over technical precision, even when
  simplifying loses exactness (this is Artist Mode's whole premise, applied to the copy itself).
- Show, don't fabricate — honest inline-SVG motifs over screenshots or invented product chrome;
  no placeholder numbers dressed up as real metrics.
- Structural variety over template repetition — sections deliberately vary rhythm (media
  left/right/none) so the page doesn't read as one repeated block.
- Calm confidence over hype — the product's own restraint (local-only, no accounts, no forced
  cloud sync) should be mirrored in how assertively/quietly the page markets it.

## Accessibility & Inclusion

WCAG 2.1 AA baseline. Reduced motion respected throughout (GSAP ScrollTrigger timelines gate on
`prefers-reduced-motion: reduce`, falling back to a fully-drawn state instead of an animated
one). FAQ is a native `<details>/<summary>` accordion — keyboard-accessible with no JS
dependency. Color tokens must maintain sufficient contrast against the dark Krita-workspace
theme (Charcoal Slate / Deep Ink backgrounds with Paper White / Brush Grey text).
