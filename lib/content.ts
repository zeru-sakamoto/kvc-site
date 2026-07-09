// Single source of truth for all site copy + links.
// Voice: painter-first, plain-language, calm — the site practises what "Artist Mode"
// preaches. We say "version / save / go back", not "commit / hash / rollback".

// The open-source repo the site links to (source, issues, releases/downloads).
export const repo = { owner: 'zeru-sakamoto', name: 'krita-vc' } as const;

const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

export const links = {
  repo: repoUrl,
  issues: `${repoUrl}/issues`,
  releases: `${repoUrl}/releases`,
  // No standalone download host yet — the latest build lives on GitHub releases.
  download: `${repoUrl}/releases`,
  // No dedicated docs site yet — the full docs and plugin guide live in the repo.
  docs: `${repoUrl}#readme`,
  pluginGuide: `${repoUrl}#readme`,
  profile: 'https://github.com/zeru-sakamoto',
  portfolio: 'https://zeru-sakamoto.codes',
} as const;

export const site = {
  name: 'Krita VCS',
  wordmark: 'Krita VCS',
  metaTitle: 'Krita VCS: version control for your art, not your code',
  metaDescription:
    'A free, local-only version-control app for Krita painters. Every save becomes a version you can revisit, compare, branch from, or roll back to. No accounts, no uploads.',
} as const;

export const nav = {
  // Path-qualified so they still resolve correctly from other routes (e.g. /docs).
  anchors: [
    { label: 'Why', href: '/#why' },
    { label: 'Features', href: '/#compare' },
    { label: 'FAQ', href: '/#faq' },
  ],
  docs: { label: 'Docs', href: '/docs' },
  repo: { label: 'GitHub', href: links.repo },
} as const;

export const hero = {
  // Normal-case badge (not an uppercase-tracked eyebrow), so it doesn't add to
  // the page's eyebrow count.
  badge: 'Free, open source, local-only',
  headline: 'Version control for your art, not your code.',
  sub: 'A free, local-only version-control app for Krita painters. No cloud, no accounts, and none of the git jargon.',
  primaryCta: { label: 'Download for free', href: links.download },
  secondaryCta: { label: 'View source on GitHub', href: links.repo },
} as const;

// "Why artists use it" — the five value props, condensed. Full-width points grid,
// no media column, above the deeper feature blocks.
export const why = {
  id: 'why',
  title: 'Made for painters, not programmers.',
  intro:
    'Version control has always been built for code. Krita VCS is built for paintings, and for the way you actually work.',
  reverse: false,
  points: [
    {
      title: 'Nothing ever leaves your computer.',
      body: 'All history lives in a hidden folder inside your own project. No account, no sync, no server. Ever.',
    },
    {
      title: 'It reads your painting, not just your file.',
      body: 'Krita VCS understands .kra files down to the tile, so a single brush stroke only stores what actually changed, not a fresh copy every time you save.',
    },
    {
      title: 'See what changed, visually.',
      body: 'No line numbers, no diffs full of symbols. Just your layers, before and after, side by side or on a swipe slider.',
    },
    {
      title: 'Explore without fear.',
      body: "Try a new color direction or a redesign on a branch, switch back to your original whenever you like, and bring the two together when you're ready.",
    },
    {
      title: 'Built for real paintings.',
      body: "Tuned to stay fast on large, layer-heavy files, so saves, comparisons, and restores don't crawl on anything but toy test cases.",
    },
  ],
} as const;

// The four alternating feature blocks. Each groups related features from
// SITE_CONTENT.md so the page reads as deliberate moments, not a pile of cards.
// `reverse` flips the media/content columns down the scroll.
export const features = [
  {
    id: 'compare',
    title: 'See exactly what changed, layer by layer.',
    body: [
      "Compare any two versions of a painting one layer at a time. Toggle side-by-side or drag a swipe slider across the canvas; zoom and pan to inspect the details, perfectly in sync between both views. What changed shows as a dashed outline tracing the silhouette of the edited pixels, and focusing a single layer narrows that outline to just that layer's changes. The flattened image loads first, so you're never staring at a blank panel; individual layers stream in right behind it. Click any layer for its details: type, visibility, opacity, blend mode, and the area it actually paints on. Click the canvas itself for the painting's size, resolution, and color space.",
      'Working with .gpl color palettes too? Krita VCS lays them out swatch by swatch, hex values and all, so a palette tweak is as easy to review as a repaint.',
    ],
    reverse: true,
  },
  {
    id: 'history',
    title: 'Every save is a place you can go back to.',
    body: [
      "Each save is a full version you can return to at any time. Branch off to try something risky, switch back in an instant, and merge the two when you're happy. Overlapping edits are flagged, never quietly overwritten. A color-coded graph shows exactly how your branches connect.",
      'Made a save you regret? Undo it. Want to jump back three versions? Do that instead. Krita VCS never deletes your history behind your back; old versions stay recoverable until you decide otherwise.',
    ],
    reverse: false,
  },
  {
    id: 'yours',
    title: 'Yours, in plain language, on your machine.',
    body: [
      "Artist Mode turns off the technical talk entirely. Commit hashes become “Version 12,” file paths become asset names, and change codes become plain words like “Updated.” It's on by default, but if you'd rather see the technical view, it's one toggle away.",
      "Because nothing is ever thrown away automatically, a project's history can grow over time. One button shows you how much space old, unreachable versions are using and clears it, only when you say so. Nothing syncs, nothing uploads; it all stays on your computer.",
    ],
    reverse: true,
  },
  {
    id: 'settings',
    title: 'Sign your work, tune it to your machine.',
    body: [
      "Put your name on every version you save, so on a shared project it's obvious who did what. That's set once in the Settings panel, right alongside how much disk space preview thumbnails are allowed to use.",
      'Working on a painting with a long, heavy revision history? Turn on compact storage and Krita VCS shrinks it down. Everything here is optional, and you can change any of it whenever you like.',
      'Prefer a different look for the app itself? Krita VCS ships with eight color themes, six dark and two light, from the moody default Charcoal to Krita Blue, Tokyo Night, and True Black. Pick one in Settings and it applies right away, no restart, saved right there on your machine.',
    ],
    reverse: false,
  },
] as const;

// The eight color themes offered in Settings (SITE_CONTENT.md's theme table).
// Real product colors, not decorative site tokens — used only by
// SignatureMedia's theme-swatch row.
export const themes = [
  { name: 'Charcoal', background: '#131210', accent: '#e07b39' },
  { name: 'Krita Blue', background: '#1e1e24', accent: '#2e86de' },
  { name: 'Electric Cyan', background: '#1a1d24', accent: '#00d2d3' },
  { name: 'Sunset Coral', background: '#201e22', accent: '#ff6b6b' },
  { name: 'Tokyo Night', background: '#1a1b26', accent: '#7aa2f7' },
  { name: 'True Black', background: '#000000', accent: '#8b5cf6' },
  { name: 'Charcoal Light', background: '#f4f1ea', accent: '#a8511a' },
  { name: 'Studio Light', background: '#f5f6fa', accent: '#2e86de' },
] as const;

// "What's next" — short roadmap, its own light section (no media column).
export const whatsNext = {
  id: 'next',
  title: "What we're building next.",
  intro:
    "Krita VCS is actively developed. A couple of things we're still sharpening:",
  items: [
    {
      title: 'Smarter diffs for everything else',
      body: 'Text and config files in a project get a basic line view today. A proper visual diff for them is on the way.',
    },
    {
      title: 'Deeper zoom for very large paintings',
      body: 'Comparisons render at a capped resolution to keep cached previews small. A way to push past that cap for pixel-level review on huge canvases is on the roadmap.',
    },
  ],
  cta: { label: 'Request a feature on GitHub', href: links.issues },
} as const;

// FAQ — rendered as a native <details>/<summary> accordion (no JS).
export const faq = [
  {
    q: 'What does it do?',
    a: 'It keeps every version of your painting as you save, like a save file for each stage of your art. You can look back at any earlier version, compare two side by side, or go back to one if you change your mind, all without leaving a mess of duplicate files on your computer.',
  },
  {
    q: 'Is my art uploaded anywhere?',
    a: "No. Krita VCS is local-only by design: there's no server, no account, and no sync. Every version lives in a folder on your own machine.",
  },
  {
    q: 'Is it free?',
    a: 'Yes, Krita VCS is free and open source. The license is still being finalised, so check the repository for current terms.',
  },
  {
    q: 'What platforms does it support?',
    a: "It's a desktop app built with Tauri, currently targeting Windows, with macOS and Linux following on the same cross-platform base.",
  },
  {
    q: 'Does it work with any file, or just .kra?',
    a: "It tracks your whole project folder, but its deep visual diffing, layer by layer, is built for Krita's .kra format and .gpl palettes. Other files are still tracked and versioned, with a simpler diff view.",
  },
  {
    q: 'Will my history get huge over time?',
    a: 'It only stores what changed between saves, not a full copy each time, so history stays compact. And if you ever want the space back from old, unreachable versions, the built-in “Clean up storage” tool does it, with your confirmation.',
  },
] as const;

export const footer = {
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Download', href: links.download },
        { label: 'Docs', href: '/docs' },
        { label: 'Source', href: links.repo },
        { label: 'Issues', href: links.issues },
      ],
    },
    {
      title: 'Maker',
      links: [
        { label: 'GitHub', href: links.profile },
        { label: 'Portfolio', href: links.portfolio },
      ],
    },
  ],
  signature: 'Made for painters by Zeru Sakamoto.',
  // SITE_CONTENT.md: license is still TBD — don't assert a specific one.
  license: 'Free and open source · license being finalised',
} as const;

// The /docs page — a step-by-step start guide, kept off the single-page
// landing flow since it's read once, not scrolled past. No screenshots: same
// honest-media rule as the rest of the site, just a plain numbered walkthrough.
export const docsPage = {
  metaTitle: 'Documentation — Krita VCS',
  metaDescription:
    'Install Krita VCS, save your first version, and set up the optional Krita plugin.',
  title: 'Documentation',
  intro:
    "New to Krita VCS? Start here. This walks through installing the app and saving your first version. Want to save without leaving Krita? There's an optional plugin for that too.",
  cta: { label: 'Read the docs on GitHub', href: links.docs },
  gettingStarted: {
    title: 'Getting started',
    steps: [
      {
        title: 'Install and open Krita VCS.',
        body: 'Download it for free and launch it. No account, no sign-in.',
      },
      {
        title: 'Point it at a folder.',
        body: 'Use the repository switcher at the top and choose Create or Browse to pick the folder your .kra files live in. Krita VCS keeps a small hidden history store inside that folder; your files themselves are never moved or renamed.',
      },
      {
        title: 'Save a version.',
        body: "Open the Changes view, write a short note about what you did, and hit Commit. That's a version you can always come back to.",
      },
      {
        title: 'Compare two versions.',
        body: 'Pick any two versions in the History view to see a visual, layer-by-layer diff. No line numbers, no code.',
      },
    ],
  },
  plugin: {
    title: 'Installing the Krita plugin (optional)',
    intro:
      'Prefer to save versions without switching windows? The Krita plugin adds a small Version Control panel right inside Krita, with a changelist, a commit button, a one-tap Checkpoint for quick milestones, and branch switching, all working against the same history as the main app.',
    notes: [
      "Commit and Checkpoint only turn on once you've saved in Krita. The plugin never saves your file for you.",
      'Everything it does is local, same as the main app. No new accounts, no new servers.',
      'Setting up a repository, and browsing or restoring older versions, still happens in the main Krita VCS app. The plugin is just a faster way to commit.',
    ],
    closing:
      "Today, installing it means building one small command-line helper alongside the app and copying a folder into Krita's plugin directory: a five-minute, one-time setup. Full step-by-step instructions live in the plugin's own guide.",
    cta: {
      label: 'Plugin guide on GitHub',
      href: links.pluginGuide,
    },
  },
} as const;
