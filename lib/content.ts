// Single source of truth for all site copy + links.
// Voice: painter-first, plain-language, calm — the site practises what "Artist Mode"
// preaches. I say "version / save / go back", not "commit / hash / rollback".

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
  primaryCta: { label: 'Download for free' },
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
      'Compare any two versions side by side, or drag a swipe slider across the canvas, zoomed and panned in sync. Changed pixels show up as a dashed outline, layer by layer. Click a layer for its opacity and blend mode, or the canvas for its size and color space.',
      'Color palettes get the same treatment, swatch by swatch, across every common format, so a palette tweak is as easy to review as a repaint.',
    ],
    reverse: true,
  },
  {
    id: 'history',
    title: 'Every save is a place you can go back to.',
    body: [
      "Each save is a full version you can return to anytime. Branch off to try something risky, then merge back when you're happy. Overlapping edits are flagged, never quietly overwritten, and a color-coded graph shows how your branches connect.",
      'Undo a save, or jump back several versions at once; old versions stay recoverable until you decide otherwise. Unsaved changes can be discarded any time, always with a confirmation first.',
    ],
    reverse: false,
  },
  {
    id: 'yours',
    title: 'Yours, in plain language, on your machine.',
    body: [
      'Artist Mode turns off the technical talk entirely: commit hashes become “Version 12,” and changes become plain words like “Updated.” One toggle switches back to the technical view.',
      'History can grow over time, so one button shows how much space old versions are using and clears it, only when you say so. Nothing syncs, nothing uploads.',
    ],
    reverse: true,
  },
  {
    id: 'settings',
    title: 'Sign your work, tune it to your machine.',
    body: [
      "Put your name on every version you save, so on a shared project it's obvious who did what. Set once in Settings, alongside how much space preview thumbnails use.",
      'Heavy revision history? Turn on compact storage and Krita VCS shrinks it down. Everything here is optional, and the custom title bar can be toggled off anytime, no restart needed.',
      'Krita VCS ships with eight color themes, six dark and two light. Pick one in Settings and it applies right away, no restart, saved right there on your machine.',
    ],
    reverse: false,
  },
  {
    id: 'performance',
    title: 'See exactly what version control is saving you.',
    body: [
      'A Performance tab shows what each version added next to what a full copy would have cost, with a percent-saved badge: already around 50% smaller than a full copy by your second save. Save and compare times sit right next to it too, no stopwatch required.',
    ],
    reverse: true,
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
  title: "What I'm building next.",
  intro: "Krita VCS is actively developed. A few things I'm still improving:",
  items: [
    {
      title: 'Diff stashing',
      body: 'Set aside an in-progress comparison and come back to it later without losing your place, so you can hop between reviews without re-picking the same two versions.',
    },
    {
      title: 'A guided first-launch tour',
      body: "A dynamic walkthrough of the app on first open, pointing out the repository switcher, Changes, History, and Settings so new users aren't left guessing.",
    },
    {
      title: 'The Krita plugin',
      body: 'An optional in-Krita "Version Control" panel (commit, quick-checkpoint, branch switching, no window-switching), built on the same history as the main app. Available today as a manual build; see the plugin guide in the docs.',
    },
  ],
  cta: { label: 'Request a feature on GitHub', href: links.issues },
} as const;

// OS availability, shown as a small icon row under the hero download button.
// Windows is real and downloadable today; macOS and Linux are not yet
// buildable, so they render as "coming soon," never as a live download —
// kept consistent with the FAQ's platform answer below.
export const platforms = {
  note: 'Windows today. macOS and Linux are on the way, on the same cross-platform base.',
  items: [
    { name: 'Windows', status: 'available' },
    { name: 'macOS', status: 'soon' },
    { name: 'Linux', status: 'soon' },
  ],
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
    a: 'Yes, Krita VCS is free and open source under the MIT license.',
  },
  {
    q: 'What platforms does it support?',
    a: "It's a desktop app built with Tauri, currently targeting Windows, with macOS and Linux following on the same cross-platform base.",
  },
  {
    q: 'Does it work with any file, or just .kra?',
    a: "It tracks the file types it understands and leaves the rest of your folder alone: Krita paintings (.kra), with the deep layer-by-layer visual diff, and color palettes (.gpl, .kpl, .aco, .ase), with a color-by-color swatch diff. Other files sitting in the project folder aren't touched; they're never copied into its history.",
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
  license: 'Free and open source · MIT license',
} as const;

// The /docs page — a chapter-tabbed documentation guide, kept off the
// single-page landing flow since it's read once, not scrolled past. No
// screenshots: same honest-media rule as the rest of the site.
export const docs = {
  title: 'Documentation',
  intro:
    'New to Krita VCS? Start here. Every chapter below covers a different part of the app: installing and saving your first version, a reference for each feature, the guardrails that keep your work safe, and the optional Krita plugin.',
  cta: { label: 'Read the docs on GitHub', href: links.docs },
} as const;

export const docsGettingStarted = {
  slug: 'getting-started',
  label: 'Getting started',
  title: 'Getting started',
  metaTitle: 'Getting started · Documentation · Krita VCS',
  metaDescription:
    'Install Krita VCS, point it at a project folder, and save your first version.',
  steps: [
    {
      title: 'Install and open.',
      body: 'Download it for free and launch it. No account, no sign-in.',
    },
    {
      title: 'Pick a project folder.',
      body: "Use the repository switcher at the top and choose Create repository (name it, choose a folder) or Browse existing repository (a folder you're already tracking). Picking a folder you've already set up just opens it. Nothing gets reset.",
    },
    {
      title: 'Save your first version.',
      body: "Open Changes, write a short note about what you did, and hit Commit version. Everything in the folder is saved, so there's nothing to pick and choose.",
    },
    {
      title: 'Compare two versions.',
      body: 'Open History, click any version to see a visual, side-by-side comparison of your layers, no code involved. Or swipe between the two with the slider, and click a layer for its details.',
    },
    {
      title: 'Try branching, merging, or restoring.',
      body: "Optional, once you're comfortable: branch off to try something risky, merge it back when you're happy, or restore an older version. All covered in Using each feature.",
    },
  ],
} as const;

export const docsUsingFeatures = {
  slug: 'using-features',
  label: 'Using each feature',
  title: 'Using each feature',
  metaTitle: 'Using each feature · Documentation · Krita VCS',
  metaDescription:
    'A quick reference for every panel in Krita VCS: Changes, History, Branches, comparing versions, and more.',
  items: [
    {
      lead: 'Changes',
      body: 'Where you save. Write a note, hit Commit. Locks briefly while saving so nothing gets interrupted.',
    },
    {
      lead: 'History',
      body: "Every version you've saved. Click one to see what changed.",
    },
    {
      lead: 'Branches',
      body: "Separate lines of work. Click one to switch to it. Hover for Merge into current (bring it into what you're on now) or Delete. New branch starts a fresh line, optionally starting from another one.",
    },
    {
      lead: 'Comparing versions',
      body: 'Side-by-side or a swipe slider, with zoom and pan that stay in sync between both sides. The eye icon highlights exactly what changed, a precise outline of the changed pixels, or a simpler box around the changed area. Click a layer to see its details.',
    },
    {
      lead: 'Undo',
      body: 'The ⋯ menu next to Changes or History. Removes only your most recent save; those changes come back as unsaved work, ready to save again.',
    },
    {
      lead: 'Restore',
      body: 'Pick any older version and bring its files back, saved as a brand-new version. Nothing older is ever deleted.',
    },
    {
      lead: 'Settings',
      body: '(gear icon) Artist view, title bar style, your name, and 8 color themes. Per project: how much space preview images may use, a compact storage option that shrinks history for files with lots of small edits, a low-memory option that uses less memory (a little slower in exchange), and Clean up storage.',
    },
    {
      lead: 'Clean up storage',
      body: 'Shows you exactly how much space would be freed before you confirm anything. Only ever clears old, unreachable leftovers, never your current work or anything still visible in your history.',
    },
  ],
} as const;

export const docsSafety = {
  slug: 'safety',
  label: 'Keeping your work safe',
  title: 'How Krita VCS keeps your work safe',
  metaTitle: 'Keeping your work safe · Documentation · Krita VCS',
  metaDescription:
    'The guardrails Krita VCS builds in so you never lose work by accident.',
  items: [
    {
      lead: "Won't switch or merge if you have unsaved changes.",
      body: "You'll get a prompt with a shortcut straight to Changes, so nothing you've done gets lost or mixed into the wrong line of work.",
    },
    {
      lead: 'Never silently overwrites a conflict.',
      body: 'If the same artwork changed in two places at once, Krita VCS keeps the incoming version and marks the file for you to review. It never guesses.',
    },
    {
      lead: "Can't delete your main line of work, or the one you're currently on.",
      body: "Switch to another branch first if you want to remove the one you're using.",
    },
    {
      lead: "Won't undo a save that something else depends on.",
      body: 'If a later save or another branch still needs it, undo is blocked so nothing gets orphaned.',
    },
    {
      lead: "Nothing happens if there's nothing to do.",
      body: "Saving with no changes, or restoring the version you're already on, simply does nothing.",
    },
    {
      lead: 'Only one save happens at a time.',
      body: 'If you\'re also using the Krita plugin, the two can never save at once. You\'ll see a brief "please wait" instead of any risk of a mixed-up save.',
    },
    {
      lead: 'Removing a project defaults to the safe choice.',
      body: '"Remove from list" just forgets it here; your files and history stay untouched. Deleting the folder for good asks you to type its name first, so it\'s never one accidental click away.',
    },
    {
      lead: 'Cleaning up always shows you first.',
      body: "You'll see exactly what would be freed before anything is actually deleted.",
    },
  ],
} as const;

export const docsPlugin = {
  slug: 'plugin',
  label: 'Installing the plugin',
  title: 'Installing the Krita plugin (optional)',
  metaTitle: 'Installing the plugin · Documentation · Krita VCS',
  metaDescription:
    'Set up the optional Krita plugin for saving versions without leaving Krita.',
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
} as const;

// Sidebar/tab order for the /docs chapter nav.
// docsPlugin is hidden from the nav for now (page + content still exist at
// /docs/plugin, just not linked) — add it back here to re-show the tab.
export const docsChapters = [
  docsGettingStarted,
  docsUsingFeatures,
  docsSafety,
] as const;

// The local installer served from `public/download/` + where the download
// button redirects to (the Getting Started chapter, flagged to show the
// download banner).
export const download = {
  fileHref: '/download/Krita-VC_0.2.1_x64-setup.exe',
  fileName: 'Krita-VC_0.2.1_x64-setup.exe',
  redirectHref: '/docs/getting-started?ref=download',
} as const;
