// Single source of truth for all site copy + links.
// Voice: painter-first, plain-language, calm — the site practises what "Artist Mode"
// preaches. I say "version / save / go back", not "commit / hash / rollback".

// The open-source repo the site links to (source, issues, releases/downloads).
export const repo = { owner: 'zeru-sakamoto', name: 'krita-vc' } as const;

const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

// Bump this on every release and swap the matching files in
// `public/download/` — nothing else in this file needs to change.
const APP_VERSION = '1.2.0';

// Canonical production origin. Env-overridable so a domain change is one var,
// not a code edit. No trailing slash — everything below joins onto it.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://krita-vc.zeru-sakamoto.codes';

export const links = {
  repo: repoUrl,
  issues: `${repoUrl}/issues`,
  releases: `${repoUrl}/releases`,
  // Every installer is hosted locally now (see the /download page); GitHub
  // Releases is still linked separately from the hero's "View source" CTA.
  download: '/download',
  // No dedicated docs site yet — the full docs live in the repo.
  docs: `${repoUrl}#readme`,
  // Technical build-from-source reference for the plugin (Rust/cargo steps) —
  // linked from /plugin for the rare reader who wants to build it themselves.
  pluginGuide: `${repoUrl}/blob/main/krita-plugin/README.md`,
  profile: 'https://github.com/zeru-sakamoto',
  portfolio: 'https://zeru-sakamoto.codes',
} as const;

export const site = {
  name: 'Krita VCS',
  wordmark: 'Krita VCS',
  // Alternate names/spellings for the product itself (not just the plugin) —
  // feeds JSON-LD `alternateName` on WebSite + SoftwareApplication, and the
  // keywords below, so search + AI answer engines resolve any of these back
  // to Krita VCS.
  alternateNames: [
    'KVC',
    'KritaVC',
    'Krita VC',
    'Krita-VC',
    'Krita Version Control',
  ],
  metaTitle: 'KritaVCS | Krita Version Control',
  metaDescription:
    'Krita VCS (also called KVC) is free, local-only version history for Krita painters: every save becomes a version of your .kra file you can compare, explore, or go back to instantly. No accounts, no uploads, and no coding required.',
  // Low ranking weight, but harmless and read by some engines. Brand-name
  // variants come first, so AI answer engines and search resolve "KVC" /
  // "Krita VC" / etc. to this product, followed by the problem-phrases
  // people actually search for.
  keywords: [
    'Krita VCS',
    'Krita Version Control',
    'KVC',
    'KritaVC',
    'Krita VC',
    'Krita-VC',
    'Krita version control',
    'version control for artists',
    'version control for digital art',
    'digital painting version control',
    'Krita file versions',
    'compare Krita files',
    'go back to an earlier version in Krita',
    'recover a Krita painting',
    'backup Krita art',
    '.kra version history',
    'Krita crashed lost my painting',
    'recover unsaved Krita file',
    'Krita autosave',
    'save multiple versions of a drawing',
    'undo limit Krita',
    'digital art backup app',
    'Krita plugin version control',
    'save Krita versions without leaving Krita',
  ],
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
  // the page's eyebrow count. Links out to GitHub Releases so the version
  // claim has provenance.
  badge: `v${APP_VERSION} · Free, open source, local-only`,
  badgeHref: links.download,
  headline: 'Version control for your art, not your code.',
  sub: 'A free, local-only version control app for Krita painters and digital art. No cloud, no accounts, and none of the git jargon.',
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
      "Compare any two versions side by side, or drag a swipe slider across the canvas, zoomed and panned in sync. Composites load first so you're never staring at a blank panel, with layers streaming in right after. Changed pixels show up as a dashed outline, layer by layer. Click a layer for its type, visibility, opacity, and blend mode, or the canvas for its size, resolution, and color space.",
      'Color palettes get the same treatment: a swatch-by-swatch comparison with hex values, across every common format, so a palette tweak is as easy to review as a repaint.',
    ],
    reverse: true,
  },
  {
    id: 'history',
    title: 'Every save is a place you can go back to.',
    body: [
      "Each save is a full version you can return to anytime, and you choose exactly which files it includes, or save everything at once. Branch off to try something risky, then merge back when you're happy. Overlapping edits are flagged for review, never quietly overwritten; if one branch edited a file and the other deleted it, the edit wins. A color-coded graph shows how your branches connect.",
      'Undo a save, or jump back several versions at once; old versions stay recoverable until you decide otherwise. Not ready to commit? Set the change aside on a shelf instead, and bring it back whenever you like. Unsaved changes can be discarded any time, always with a confirmation first.',
    ],
    reverse: false,
  },
  {
    id: 'yours',
    title: 'Yours, in plain language, on your machine.',
    body: [
      'Artist Mode turns off the technical talk entirely: commit hashes become "Version 12," and changes become plain words like "Updated." One toggle switches back to the technical view.',
      'History can grow over time, so one button shows how much space old versions are using and clears it, only when you say so. Nothing syncs, nothing uploads.',
      "Removing a project moves its folder to your Recycle Bin instead of deleting it outright, so an accidental removal is just a restore away. Back up any project, or every project at once, to a single zip file, ready for an external drive or your own cloud storage. It's the one safety net Krita VCS can't provide automatically: if the project folder is ever lost outside the app entirely, a backup you made yourself is the way back.",
    ],
    reverse: true,
  },
  {
    id: 'settings',
    title: 'Sign your work, tune it to your machine.',
    body: [
      "Put your name on every version you save, so on a shared project it's obvious who did what. Set once in Settings, alongside how much space preview thumbnails use.",
      'Heavy revision history? Turn on compact storage and Krita VCS shrinks it down. Working with big files? Low-memory diffs load layers one at a time instead of all together, so RAM stays under control. Everything here is optional, and the custom title bar can be toggled off anytime, no restart needed.',
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
  {
    id: 'panel',
    title: 'Save a version without leaving Krita.',
    body: [
      'An optional Version Control panel lives right inside Krita, beside your canvas: save a version, choose exactly which files go into it, discard a change you regret, set work aside, or switch between your version lines.',
      'Click into the panel and it saves your open paintings for you first, so a version never misses your last few minutes of work. It runs on the same engine and the same history as the main app, so it never matters which one you used last.',
    ],
    reverse: false,
    cta: { label: 'Get the Krita plugin', href: '/plugin' },
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
  intro:
    "Krita VCS is still a work in progress. A few things I'm still improving:",
  items: [
    {
      title: 'Diff stashing',
      body: 'Set aside an in-progress comparison and come back to it later without losing your place, so you can hop between reviews without re-picking the same two versions.',
    },
    {
      title: 'A guided first-launch tour',
      body: "A quick walkthrough of the app on first open, pointing out the repository switcher, Changes, History, and Settings so new users aren't left guessing.",
    },
    {
      title: 'Signed installers',
      body: "Windows and macOS both flag the app as from an unknown developer on first launch, since it isn't code-signed yet. Getting a signing certificate is next, so that warning goes away.",
    },
  ],
  cta: { label: 'Request a feature on GitHub', href: links.issues },
} as const;

// OS availability, shown as a small informational icon row under the hero
// download button — kept consistent with the FAQ's platform answer below.
export const platforms = {
  note: 'Windows, macOS, and Linux, all downloadable today, on the same cross-platform base.',
  items: [{ name: 'Windows' }, { name: 'macOS' }, { name: 'Linux' }],
} as const;

// FAQ — rendered as a native <details>/<summary> accordion (no JS).
export const faq = [
  {
    q: 'What does it do?',
    a: 'It keeps every version of your painting as you save, like a save file for each stage of your art. You can look back at any earlier version, compare two side by side, or go back to one if you change your mind, all without leaving a mess of duplicate files on your computer.',
  },
  {
    q: 'What does KVC stand for?',
    a: 'KVC is just short for Krita VCS. You might also see it written as Krita VC, KritaVC, Krita-VC, or spelled out as Krita Version Control: different ways of writing the name of the same free, local-only app for Krita painters.',
  },
  {
    q: 'Is Krita VC the same as Krita VCS?',
    a: "Yes, they're the same app. Krita VC is also what Krita's own Python Plugin Manager calls the optional in-Krita panel, but it runs on the exact same engine and history as Krita VCS, not a separate product.",
  },
  {
    q: 'Do I need to know Git, or use a command line?',
    a: 'No. There\'s no terminal and no git jargon anywhere in the app. Artist Mode (on by default) shows plain labels like "Version 12" instead of hashes and codes, so if you\'re comfortable saving a file in Krita, you already know most of what you need.',
  },
  {
    q: "What's the difference between saving in Krita and saving a version here?",
    a: "Hitting Ctrl+S in Krita still works exactly like it always has; that part never changes. Committing a version in Krita VCS is a separate step on top: it takes a snapshot of your saved file so you can come back to it, compare it, or go back to it later. Saving isn't the same as committing, so it's worth checking in a version once you've saved something worth keeping.",
  },
  {
    q: 'Is my art uploaded anywhere?',
    a: "No. Krita VCS is local-only by design: there's no server, no account, and no sync. Every version lives in a folder on your own machine.",
  },
  {
    q: 'Do I need an internet connection to use it?',
    a: 'No. Everything runs and is stored entirely on your machine, so it works exactly the same with wifi on or off.',
  },
  {
    q: 'Can I lose work by using this?',
    a: "It's built to make that harder, not easier. History is never deleted behind your back, actions that would discard something (like Discard) always ask you to confirm first, and version control runs as an extra safety net alongside your normal saving, not a replacement for it. Removing a project moves it to your Recycle Bin rather than deleting it outright, and you can back up any project to a zip file for extra safety, kept wherever you like.",
  },
  {
    q: 'Is it free?',
    a: 'Yes, Krita VCS is free and open source under the MIT license.',
  },
  {
    q: 'What platforms does it support?',
    a: "It's a desktop app built with Tauri, available today for Windows, macOS, and Linux, on the same cross-platform base.",
  },
  {
    q: 'Will it slow down Krita or make my computer laggy?',
    a: "It's tuned for large, layer-heavy .kra files, so saving, comparing, and restoring stay fast even on big, real paintings, not just small test files.",
  },
  {
    q: 'Does it work with any file, or just .kra?',
    a: "It tracks the file types it understands and leaves the rest of your folder alone: Krita paintings (.kra), with the deep layer-by-layer visual diff, and color palettes (.gpl, .kpl, .aco, .ase), with a color-by-color swatch diff. Other files sitting in the project folder aren't touched, and Krita's own backup and autosave files are skipped too, so history stays a record of your work, not your app's scratch files.",
  },
  {
    q: "Can I start using it on a painting I've already been working on for a while?",
    a: "Yes. Point Krita VCS at the folder your painting already lives in and it picks up from there. You don't need to start a fresh file or lose any of your existing work to begin tracking it.",
  },
  {
    q: 'Do I have to use branches?',
    a: 'No. Branches are entirely optional. You can use Krita VCS just to save and compare versions on a single line of work and never touch branching at all.',
  },
  {
    q: 'Can more than one person work on the same painting with this?',
    a: "Not currently. Krita VCS is built for one artist working locally, with no accounts and no shared or remote history. Branches let you explore multiple directions yourself, but there's no built-in way to share history between different people or machines.",
  },
  {
    q: 'Will my history get huge over time?',
    a: 'It only stores what changed between saves, not a full copy each time, so history stays compact. And if you ever want the space back from old, unreachable versions, the built-in "Clean up storage" tool does it, with your confirmation.',
  },
  {
    q: 'What happens to my history if I uninstall Krita VCS?',
    a: 'Nothing. Your painting and its saved history live in a folder inside your own project, not inside the app. Uninstalling only removes the program; your files and their history stay exactly where they are.',
  },
] as const;

export const footer = {
  columns: [
    {
      title: 'Product',
      links: [
        { label: 'Download', href: links.download },
        { label: 'Docs', href: '/docs' },
        { label: 'Krita plugin', href: '/plugin' },
        { label: 'Source', href: links.repo },
        { label: 'Issues', href: links.issues },
      ],
    },
    {
      // Internal links to the discovery pages (kept as literals: `footer` is
      // evaluated before the discoveryPages consts below it in this module).
      title: 'Guides',
      links: [
        { label: 'Go back to a version', href: '/recover-a-krita-version' },
        { label: 'Stop saving copies', href: '/vs-saving-copies' },
        {
          label: 'Recover from a crash',
          href: '/recover-after-a-krita-crash',
        },
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
  aliasNote: 'Also called KVC, Krita VC, or Krita Version Control.',
  legal: { label: 'Privacy', href: '/privacy' },
} as const;

// The /docs page — a chapter-tabbed documentation guide, kept off the
// single-page landing flow since it's read once, not scrolled past. No
// screenshots: same honest-media rule as the rest of the site. Written for a
// reader who has never used version control before: What is version control?
// comes first, then a page per feature and per plugin panel, not one long list.
export const docs = {
  title: 'Documentation',
  intro:
    'New to version control? Start with What is version control?, then Getting started. Everything after that is short, one-topic pages: a page per feature, a page per plugin panel, and the guardrails that keep your work safe.',
} as const;

type AccentTone = 'cool' | 'warm' | 'blue';

// One short, self-contained page per feature (or plugin panel). `highlight`
// feeds the existing emphasize() helper — one accent phrase in the intro,
// nothing more. `note` is the one boxed callout a page is allowed, for the
// single most important safety/behavior fact. `steps`/`items` reuse the
// existing <Steps>/<BulletList> components; a page uses at most one of them.
export type FeatureDetail = {
  slug: string;
  label: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  intro: string;
  highlight?: { phrase: string; tone: AccentTone };
  steps?: readonly { title: string; body: string }[];
  items?: readonly { lead?: string; body: string }[];
  note?: { tone: AccentTone; body: string };
  closing?: string;
  closingLink?: { label: string; href: string };
};

export const whatIsVersionControl = {
  slug: 'what-is-version-control',
  label: 'What is version control?',
  title: 'What is version control?',
  metaTitle: 'What is version control?',
  metaDescription:
    'Never used version control before? A short, plain-English explanation of what a version, a branch, and a repository actually mean, before you install anything.',
  intro:
    "If you've never used anything like this before, start here. A handful of words explain most of what you need.",
  highlight: { phrase: 'a handful of words', tone: 'cool' } as const,
  terms: [
    {
      lead: 'Version control',
      body: 'A tool that remembers every version of your file as you save, so you can always look back or go back. Think of it as a row of save points for your painting, not just the one you last hit Ctrl+S on.',
    },
    {
      lead: 'A version',
      body: 'One saved snapshot of your painting at a point in time, like a save point in a video game. Krita VCS keeps every one you make, so none of them ever get overwritten.',
    },
    {
      lead: 'A project (or "repository")',
      body: 'The folder Krita VCS is watching. Point it at a folder with your .kra files and it starts keeping versions of what is inside.',
    },
    {
      lead: 'Committing, or saving a version',
      body: "Turning your current work into a new version. Ctrl+S in Krita still saves your file exactly like it always has; committing is a separate step on top, for when you've reached something worth keeping.",
    },
    {
      lead: 'A branch',
      body: 'A separate line of work, split off so you can try something risky, like a new color scheme, without touching your original.',
    },
    {
      lead: 'Restoring',
      body: 'Bringing an older version back as your current one, without deleting anything that came after it.',
    },
  ],
} as const;

export const docsGettingStarted = {
  slug: 'getting-started',
  label: 'Getting started',
  title: 'Getting started',
  metaTitle: 'Getting started',
  metaDescription:
    'Install Krita VCS, point it at a project folder, and save your first version of a .kra painting.',
  steps: [
    {
      title: 'Install and open.',
      body: 'Download it for free and launch it. No account, no sign-in.',
    },
    {
      title: 'Pick a project folder.',
      body: "Use the switcher at the top and choose Create repository (name it, choose a folder) or Browse existing repository (a folder you're already using). Opening a folder you've set up before just opens it. Nothing gets reset.",
    },
    {
      title: 'Save your first version.',
      body: "Open Changes, write a short note about what you did, and hit Commit version. Everything you changed is included by default; choose just some files first if you'd rather save only part of it.",
    },
    {
      title: 'Compare two versions.',
      body: 'Open History, click any version to see a visual, side-by-side comparison of your layers, no code involved. Or swipe between the two with the slider, and click a layer for its details.',
    },
    {
      title: 'Try branching, merging, or restoring.',
      body: "Optional, once you're comfortable. Each one has its own short page under Using each feature.",
    },
  ],
} as const;

// Ten short pages, one per panel, replacing the old single flat list.
export const docsFeatures: readonly FeatureDetail[] = [
  {
    slug: 'changes',
    label: 'Changes',
    title: 'Saving a version',
    metaTitle: 'Changes',
    metaDescription: 'How to turn your current work into a saved version.',
    summary: 'Where you turn your work into a version you can come back to.',
    intro:
      'Changes is where you turn your current work into a saved version. Write a short note about what you did, then save it.',
    highlight: { phrase: 'saved version', tone: 'cool' },
    steps: [
      {
        title: 'Open Changes.',
        body: 'It lists every file you have touched since your last version.',
      },
      {
        title: 'Pick what to include.',
        body: 'Everything is included by default. Untick anything you want to leave out.',
      },
      {
        title: 'Write a short note.',
        body: 'A word or two about what changed is enough, like "Fixed the eyes."',
      },
      {
        title: 'Hit Commit version.',
        body: 'Krita VCS locks briefly while it saves, so nothing gets interrupted partway through.',
      },
    ],
  },
  {
    slug: 'history',
    label: 'History',
    title: 'Looking back at old versions',
    metaTitle: 'History',
    metaDescription:
      'Browse every version you have saved and see what changed.',
    summary: "Every version you've saved, in one list.",
    intro:
      'History lists every version you have ever saved. Click any one to see exactly what changed, layer by layer.',
    highlight: { phrase: 'every version you have ever saved', tone: 'cool' },
    note: {
      tone: 'blue',
      body: 'Nothing in History is ever deleted just by looking at it. Browsing is always safe.',
    },
  },
  {
    slug: 'branches',
    label: 'Branches',
    title: 'Trying things without risk',
    metaTitle: 'Branches',
    metaDescription:
      'What a branch is, and how to switch, merge, or delete one.',
    summary: 'A separate line of work you can try things on, safely.',
    intro:
      'A branch is a separate line of work, split off from your main line so you can try something risky without touching it.',
    highlight: { phrase: 'separate line of work', tone: 'warm' },
    items: [
      {
        lead: 'New branch',
        body: 'Starts a fresh line of work, optionally starting from another branch.',
      },
      { lead: 'Switch', body: 'Click a branch to work on it.' },
      {
        lead: 'Merge into current',
        body: "Brings another branch's changes into the one you're on.",
      },
      { lead: 'Delete', body: 'Removes a branch you no longer need.' },
    ],
    note: {
      tone: 'warm',
      body: "You can't delete your main branch, or the one you're currently on. Switch to another one first.",
    },
  },
  {
    slug: 'comparing-versions',
    label: 'Comparing versions',
    title: 'Seeing exactly what changed',
    metaTitle: 'Comparing versions',
    metaDescription: 'Compare any two versions of your painting side by side.',
    summary: 'See exactly what changed, side by side.',
    intro:
      'Pick any two versions and see them side by side, or drag a slider across the canvas to swipe between them.',
    highlight: { phrase: 'side by side', tone: 'cool' },
    steps: [
      { title: 'Open History.', body: 'Pick any two versions to compare.' },
      {
        title: 'Choose a view.',
        body: 'Side-by-side, or the swipe slider. Both keep zoom and pan in sync.',
      },
      {
        title: 'Click a layer.',
        body: 'See its type, visibility, opacity, and blend mode.',
      },
    ],
    note: {
      tone: 'cool',
      body: 'Changed pixels are outlined for you, layer by layer, so you never have to guess what moved.',
    },
  },
  {
    slug: 'undo',
    label: 'Undo',
    title: 'Taking back your last save',
    metaTitle: 'Undo',
    metaDescription: 'Remove your most recent saved version.',
    summary: 'Take back your most recent save.',
    intro:
      'Undo removes only your most recent saved version. Find it in the ⋯ menu next to Changes or History.',
    highlight: { phrase: 'only your most recent saved version', tone: 'warm' },
    note: {
      tone: 'warm',
      body: 'Those changes come back as unsaved work, ready to save again. Undo is blocked if a later version or another branch still depends on it, so nothing important gets lost.',
    },
  },
  {
    slug: 'set-aside',
    label: 'Set aside',
    title: 'Parking work without saving it',
    metaTitle: 'Set aside',
    metaDescription:
      'Shelve unfinished work without turning it into a version.',
    summary: 'Park work in progress without saving it as a version.',
    intro:
      'Set aside puts unfinished work on a shelf, without turning it into a version, and returns your files to your last saved version.',
    highlight: { phrase: 'a shelf', tone: 'cool' },
    steps: [
      { title: 'Open the ⋯ menu.', body: 'Next to Changes or History.' },
      {
        title: 'Choose Set aside.',
        body: 'Your unsaved work moves to the shelf.',
      },
      {
        title: 'Bring it back later.',
        body: 'Pick the latest one, or choose from a list.',
      },
    ],
    note: {
      tone: 'blue',
      body: 'If a branch switch is blocked by unsaved work, Krita VCS offers Set aside as the way through.',
    },
  },
  {
    slug: 'restore',
    label: 'Restore',
    title: 'Bringing back an older version',
    metaTitle: 'Restore',
    metaDescription:
      'Bring an older version back without losing anything newer.',
    summary: 'Bring back an older version, without losing anything newer.',
    intro:
      "Restore brings an older version's files back, saved as a brand-new version on top of your history, not a rewrite of it.",
    highlight: { phrase: 'brand-new version', tone: 'cool' },
    note: {
      tone: 'cool',
      body: 'Nothing older is ever deleted, so you can always change your mind again.',
    },
  },
  {
    slug: 'settings',
    label: 'Settings',
    title: 'Your name, your theme, your space',
    metaTitle: 'Settings',
    metaDescription: 'Your name, color theme, and per-project storage options.',
    summary: 'Your name, your theme, and how the app manages space.',
    intro:
      'Settings, the gear icon, is where you set your name, pick a theme, and tune how much space Krita VCS uses on your machine.',
    highlight: { phrase: 'gear icon', tone: 'blue' },
    items: [
      {
        lead: 'Artist view',
        body: 'Turns off technical terms in favor of plain words like "Version 12."',
      },
      {
        lead: 'Your name',
        body: "So it's obvious who did what on a shared project.",
      },
      {
        lead: '8 color themes',
        body: '6 dark, 2 light. Applies right away, no restart.',
      },
      {
        lead: 'The set-aside shelf',
        body: 'Everything you have parked, with the branch it came from and how long it has been there.',
      },
      {
        lead: 'Per-project storage options',
        body: 'How much space preview images may use, compact storage for heavy history, and a low-memory mode for big files.',
      },
    ],
  },
  {
    slug: 'storage-cleanup',
    label: 'Storage cleanup',
    title: 'Reclaiming space from old versions',
    metaTitle: 'Storage cleanup',
    metaDescription: 'Free up space from old, unreachable versions safely.',
    summary: 'Reclaim space from old versions you can no longer reach.',
    intro:
      'Clean up storage shows you exactly how much space would be freed, before anything is deleted.',
    highlight: { phrase: 'before anything is deleted', tone: 'warm' },
    note: {
      tone: 'warm',
      body: 'It only ever clears old, unreachable leftovers, never your current work or anything still visible in History.',
    },
  },
  {
    slug: 'backup',
    label: 'Backup',
    title: 'Keeping a copy outside the app',
    metaTitle: 'Backup',
    metaDescription: 'Zip a project and its history to keep somewhere else.',
    summary: 'Your one copy that survives a lost or broken project folder.',
    intro:
      "Backup zips a project's files and its whole history into one file you keep somewhere else, like an external drive or your own cloud storage.",
    highlight: { phrase: 'somewhere else', tone: 'cool' },
    note: {
      tone: 'warm',
      body: "It's the one safety net Krita VCS can't provide on its own. If a project folder is ever lost outside the app, a backup you made yourself is the way back.",
    },
  },
] as const;

export const docsUsingFeatures = {
  slug: 'using-features',
  label: 'Using each feature',
  title: 'Using each feature',
  metaTitle: 'Using each feature',
  metaDescription:
    'A short page for every panel in Krita VCS: Changes, History, Branches, comparing versions of your painting, and more.',
  intro:
    'Ten short pages, one per panel. Pick the one you need, no need to read them in order.',
  items: docsFeatures,
} as const;

export const docsSafety = {
  slug: 'safety',
  label: 'Keeping your work safe',
  title: 'How Krita VCS keeps your work safe',
  metaTitle: 'Keeping your work safe',
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
      body: 'If a later save or another branch still needs it, undo is blocked so nothing important gets lost.',
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
      body: '"Remove from list" just forgets it here; your files and history stay untouched. Removing the folder for good asks you to type its name first, so it\'s never one accidental click away, and moves it to your Recycle Bin rather than deleting it outright.',
    },
    {
      lead: 'Cleaning up always shows you first.',
      body: "You'll see exactly what would be freed before anything is actually deleted.",
    },
    {
      lead: 'You can always keep a copy of your own, outside the app.',
      body: 'Back up any project, or every project at once, to a zip file whenever you like: the one thing to reach for if a project folder is ever lost outside Krita VCS entirely, like a stray delete outside the app or a failing drive.',
    },
  ],
} as const;

// Ten short pages for the plugin panel too, same shape as docsFeatures. "What
// it deliberately doesn't do" isn't a feature to use, so it lives as a closing
// note on the /plugin index instead of its own page — see pluginPage below.
export const pluginSubchapters: readonly FeatureDetail[] = [
  {
    slug: 'commit-and-checkpoint',
    label: 'Commit and checkpoint',
    title: 'Saving from inside Krita',
    metaTitle: 'Commit and checkpoint',
    metaDescription: 'Save a version from the in-Krita panel.',
    summary: 'Commit, or Checkpoint for a one-tap save.',
    intro:
      "The panel shows your current branch and the files you've changed. Write a note and hit Commit, or use Checkpoint for a one-tap save with the note written for you.",
    highlight: { phrase: 'one-tap save', tone: 'cool' },
  },
  {
    slug: 'no-need-to-save-first',
    label: 'You never have to save first',
    title: 'Saving happens automatically',
    metaTitle: 'You never have to save first',
    metaDescription: 'The panel saves your open painting before it acts.',
    summary:
      'The panel saves your open painting for you the moment you click in.',
    intro:
      "Krita VCS builds every version from what's actually on disk, so opening the panel saves your open paintings for you first. A version can never quietly miss your last few minutes of work.",
    highlight: {
      phrase: 'saves your open paintings for you first',
      tone: 'cool',
    },
    note: {
      tone: 'blue',
      body: "Saving still isn't the same as committing. Nothing becomes a version until you commit it.",
    },
  },
  {
    slug: 'choose-what-to-include',
    label: 'Choose what to include',
    title: 'Picking exactly what goes in',
    metaTitle: 'Choose what to include',
    metaDescription: 'Untick any file you want left out of a version.',
    summary:
      "Every file has a checkbox, untick anything you'd rather leave out.",
    intro:
      "Every file in the list has a checkbox, ticked by default. Untick anything you'd rather leave out, and Commit, Checkpoint, Discard, and Set aside will only act on the ticked files.",
    highlight: { phrase: 'ticked by default', tone: 'warm' },
  },
  {
    slug: 'set-aside',
    label: 'Set aside',
    title: 'Parking work without saving it',
    metaTitle: 'Set aside',
    metaDescription:
      'Shelve ticked changes without turning them into a version.',
    summary: 'Shelve your changes, then bring them back later.',
    intro:
      'Set aside parks your ticked changes on a shelf, without turning them into a version, and puts those files back to your last saved version.',
    highlight: { phrase: 'a shelf', tone: 'cool' },
    note: {
      tone: 'blue',
      body: "It's also the fastest way past a branch switch that's blocked by unsaved work.",
    },
  },
  {
    slug: 'discard',
    label: 'Discard',
    title: 'Reverting to your last saved version',
    metaTitle: 'Discard',
    metaDescription: 'Revert ticked files back to their last saved version.',
    summary:
      'One honest warning, then everything since your last save is gone.',
    intro:
      'Discard reverts your ticked files to their last saved version. Everything since, including anything the panel auto-saved for you, is gone for good.',
    highlight: { phrase: 'gone for good', tone: 'warm' },
    note: {
      tone: 'warm',
      body: "If there's any chance you'll want it back, use Set aside instead.",
    },
  },
  {
    slug: 'documents-reload-themselves',
    label: 'Documents reload themselves',
    title: 'Why your canvas refreshes on its own',
    metaTitle: 'Documents reload themselves',
    metaDescription:
      'Krita reopens any document a version-control action changed.',
    summary:
      'Krita reopens any document a version-control action actually changed.',
    intro:
      'Discarding, setting aside, bringing work back, and switching branches all rewrite files on disk, so the panel closes and reopens any open document it changed, keeping your canvas in sync with your history.',
    highlight: { phrase: 'in sync with your history', tone: 'cool' },
    note: {
      tone: 'warm',
      body: 'The one tradeoff: a reopened document starts with an empty undo history.',
    },
  },
  {
    slug: 'branch-switching',
    label: 'Branch switching',
    title: 'Switching branches from the panel',
    metaTitle: 'Branch switching',
    metaDescription: 'Switch branches without leaving Krita.',
    summary: 'Switch without leaving Krita, even with unsaved work in the way.',
    intro:
      "Switch branches right from the panel. If unsaved work is in the way, you're offered Set aside & switch instead of having to leave Krita to sort it out first.",
    highlight: { phrase: 'Set aside & switch', tone: 'cool' },
  },
  {
    slug: 'palette-files',
    label: 'Palette files',
    title: 'Tracking your color palettes too',
    metaTitle: 'Palette files',
    metaDescription:
      'Color palettes travel alongside your painting automatically.',
    summary: 'Palettes travel alongside your painting, automatically.',
    intro:
      "Color palettes (.gpl, .kpl, .aco, .ase) sitting next to your art get tracked too, right alongside the .kra file. Untick them if you'd rather leave them out of a version.",
    highlight: { phrase: 'tracked too', tone: 'cool' },
  },
  {
    slug: 'installing',
    label: 'Installing',
    title: 'Installing the plugin',
    metaTitle: 'Installing the plugin',
    metaDescription: 'Unzip, copy into Krita, and turn the plugin on.',
    summary: 'Unzip, copy into Krita, and turn it on.',
    intro:
      "Needs Krita with Python scripting enabled, which is on by default. Check under Settings → Configure Krita → Python Plugin Manager if you're not sure.",
    highlight: { phrase: 'on by default', tone: 'blue' },
    steps: [
      {
        title: 'Download and unzip.',
        body: "Download the plugin zip and unzip it. Inside you'll find a pykrita folder and the kvc tool it talks to, already built, nothing to compile.",
      },
      {
        title: "Find Krita's plugin folder.",
        body: "In Krita: Settings → Manage Resources → Open Resource Folder. Look for a pykrita folder inside; create it if it isn't there yet.",
      },
      {
        title: 'Copy the plugin in.',
        body: 'Copy the kritavc.desktop file and the kritavc folder from the zip into that pykrita folder. Both need to land directly inside it, not nested a level deeper.',
      },
      {
        title: 'Enable it and restart.',
        body: 'Settings → Configure Krita → Python Plugin Manager, find "Krita VC" in the list and check it on, then restart Krita. Python plugins only load at startup, so this step isn\'t optional.',
      },
      {
        title: 'Open the panel.',
        body: "Settings → Dockers → Version Control. If it's not there, the plugin didn't load. Double-check the previous two steps.",
      },
      {
        title: 'Point it at kvc, if asked.',
        body: "If the panel says the kvc tool wasn't found, click Locate kvc… and browse to the kvc file from the zip you downloaded.",
      },
    ],
    closing:
      'Uninstalling: turn off "Krita VC" in the Python Plugin Manager, then delete kritavc.desktop and the kritavc folder from the resource folder. Nothing about your projects or their history lives in the plugin folder, so removing it doesn\'t touch your work.',
    closingLink: {
      label:
        'Building it from source instead? See the technical guide on GitHub',
      href: links.pluginGuide,
    },
  },
  {
    slug: 'troubleshooting',
    label: 'Troubleshooting',
    title: 'If something goes wrong',
    metaTitle: 'Troubleshooting',
    metaDescription:
      'Fixes for the most common plugin install and usage issues.',
    summary: 'The most common install and usage snags, and how to fix them.',
    intro:
      'Most issues come down to a file landing in the wrong place, or Krita not knowing where to find the kvc tool.',
    items: [
      {
        lead: '"Version Control" isn\'t in the Dockers menu.',
        body: "The plugin didn't load. Recheck the install steps, and confirm both kritavc.desktop and the kritavc folder landed directly inside pykrita, not one level up or down.",
      },
      {
        lead: '"That isn\'t the kvc tool" after Locate kvc….',
        body: "Point it at the kvc (or kvc.exe) file itself, not the folder, and make sure it's the one from the zip you downloaded.",
      },
      {
        lead: '"Krita VC tracks .kra documents."',
        body: 'The active document is a .png/.jpg/etc. Only .kra files are versioned. Save it as .kra inside the tracked folder first.',
      },
      {
        lead: '"repository is busy (locked by another process)."',
        body: "The desktop app is mid-write, or a previous save didn't exit cleanly and left a lock file behind. Safe to delete by hand as long as nothing else is actually writing at the moment.",
      },
      {
        lead: '"Save (Ctrl+S) or undo your changes in … first."',
        body: "A discard/set-aside/switch would overwrite a file with unsaved edits. You shouldn't normally see this, since opening the panel's menu already saves everything on the way in. If you do, your last autosave failed (see the next entry).",
      },
      {
        lead: '"Couldn\'t save …"',
        body: "Krita couldn't write the file, usually because it's read-only, the disk is full, or something else has it open elsewhere. Fix the file and click the refresh button to retry.",
      },
    ],
  },
] as const;

// Sidebar order for the /docs chapter nav, now nested: Using each feature and
// the Krita plugin each list their sub-chapters, walked by docs-nav.tsx and
// used to build the sitemap. `path` is explicit rather than always
// `/docs/${slug}` since the plugin chapter's canonical URL stays `/plugin`
// (already linked from the hero, footer, and FAQ) even though it now shares
// the docs sidebar and sub-chapter treatment.
export const docsChapters = [
  {
    slug: whatIsVersionControl.slug,
    label: whatIsVersionControl.label,
    path: `/docs/${whatIsVersionControl.slug}`,
  },
  {
    slug: docsGettingStarted.slug,
    label: docsGettingStarted.label,
    path: `/docs/${docsGettingStarted.slug}`,
  },
  {
    slug: docsUsingFeatures.slug,
    label: docsUsingFeatures.label,
    path: `/docs/${docsUsingFeatures.slug}`,
    subchapters: docsFeatures.map((f) => ({
      slug: f.slug,
      label: f.label,
      path: `/docs/${docsUsingFeatures.slug}/${f.slug}`,
    })),
  },
  {
    slug: 'plugin',
    label: 'Krita plugin',
    path: '/plugin',
    subchapters: pluginSubchapters.map((f) => ({
      slug: f.slug,
      label: f.label,
      path: `/plugin/${f.slug}`,
    })),
  },
  {
    slug: docsSafety.slug,
    label: docsSafety.label,
    path: `/docs/${docsSafety.slug}`,
  },
] as const;

// Every installer file, served flat from `public/download/`, grouped by OS.
// `primary` is the format the hero button and the /download page's headline
// button use for that platform; `alternates` are the other formats listed as
// secondary links (installer type, not architecture — every build here is
// the same universal/x64 target).
export const platformDownloads = {
  windows: {
    name: 'Windows',
    primary: {
      fileHref: `/download/Krita-VC_${APP_VERSION}_x64-setup.exe`,
      fileName: `Krita-VC_${APP_VERSION}_x64-setup.exe`,
      label: '.exe installer',
    },
    alternates: [
      {
        fileHref: `/download/Krita-VC_${APP_VERSION}_x64_en-US.msi`,
        fileName: `Krita-VC_${APP_VERSION}_x64_en-US.msi`,
        label: '.msi installer',
      },
    ],
  },
  macos: {
    name: 'macOS',
    primary: {
      fileHref: `/download/Krita-VC_${APP_VERSION}_universal.dmg`,
      fileName: `Krita-VC_${APP_VERSION}_universal.dmg`,
      label: '.dmg installer (universal)',
    },
    alternates: [
      {
        fileHref: '/download/Krita-VC_universal.app.tar.gz',
        fileName: 'Krita-VC_universal.app.tar.gz',
        label: '.app bundle (.tar.gz)',
      },
    ],
  },
  linux: {
    name: 'Linux',
    primary: {
      fileHref: `/download/Krita-VC_${APP_VERSION}_amd64.AppImage`,
      fileName: `Krita-VC_${APP_VERSION}_amd64.AppImage`,
      label: '.AppImage (any distro)',
    },
    alternates: [
      {
        fileHref: `/download/Krita-VC_${APP_VERSION}_amd64.deb`,
        fileName: `Krita-VC_${APP_VERSION}_amd64.deb`,
        label: '.deb (Debian/Ubuntu)',
      },
      {
        fileHref: `/download/Krita-VC-${APP_VERSION}-1.x86_64.rpm`,
        fileName: `Krita-VC-${APP_VERSION}-1.x86_64.rpm`,
        label: '.rpm (Fedora/RHEL)',
      },
    ],
  },
} as const;

// Shared version + where the hero download button redirects to (the Getting
// Started chapter, flagged to show the download banner). `version` is the
// single source of truth for the JSON-LD softwareVersion field, since there's
// no one canonical filename to parse it from anymore.
export const download = {
  version: APP_VERSION,
  redirectHref: '/docs/getting-started?ref=download',
} as const;

// The plugin's zip download, served from `public/download/` same as the app installers.
export const pluginDownload = {
  fileHref: '/download/kritavc-plugin.zip',
  fileName: 'kritavc-plugin.zip',
} as const;

// The /download page: intro copy + the three-column OS comparison. File data
// itself comes from platformDownloads; this just holds page-level strings.
export const downloadPage = {
  slug: 'download',
  metaTitle: 'Download',
  metaDescription:
    'Download Krita VCS for free: installers for Windows, macOS, and Linux, all local-only, no accounts.',
  title: 'Download Krita VCS',
  intro:
    'Free, open source, and local-only on Windows, macOS, and Linux. Pick a platform below. The installer works the same way on all three.',
  versionNote: `v${download.version} · Free, open source, local-only`,
  closing: [
    {
      text: 'Need install steps? See ',
      link: { label: 'Getting started', href: '/docs/getting-started' },
    },
    {
      text: "Looking for release notes or an older version? They're on ",
      link: { label: 'GitHub', href: links.releases },
    },
  ],
} as const;

// The /plugin page: now an index into pluginSubchapters, same shape as
// docsUsingFeatures — joins the docs sidebar as a chapter (see docsChapters)
// while keeping its own URL, since it's already linked from the hero, footer,
// and FAQ. "What it deliberately doesn't do" lives here as a closing note
// rather than its own sub-chapter, since it's a boundary statement, not a
// feature to use.
export const pluginPage = {
  slug: 'plugin',
  metaTitle: 'Krita VC plugin',
  metaDescription:
    'Save versions, checkpoint your progress, and switch branches without leaving Krita. Download the optional Krita VC plugin and install it in a few minutes.',
  title: 'The Krita VCS plugin (aka Krita VC)',
  intro:
    'A small Version Control panel that lives right inside Krita, so you can save a version, set work aside, or switch branches without ever leaving your canvas. It runs on the exact same engine and the exact same history as the desktop app. Save from either one, and the other sees it.',
  featuresTitle: 'What it does',
  items: pluginSubchapters,
  closingTitle: "What it deliberately doesn't do",
  closing:
    'Creating a project, browsing full history, undoing a version, and merging or deleting branches all stay in the main Krita VCS app. The panel is for painting and quick version-control actions without alt-tabbing away.',
} as const;

// The /privacy page. Short and true rather than padded: the app is fully
// offline and the site has no analytics, so there's very little to disclose.
// Also the privacy-policy URL required for a Microsoft Store submission.
export const privacyPage = {
  slug: 'privacy',
  metaTitle: 'Privacy Policy',
  metaDescription:
    "Krita VCS collects nothing: no accounts, no telemetry, no analytics, no cookies. Here's exactly what the app and this website do and don't do with your data.",
  title: 'Privacy Policy',
  updated: 'July 17, 2026',
  intro:
    "The short version: Krita VCS doesn't collect anything. No accounts, no telemetry, no analytics, no cookies. Everything below explains what that means, in plain language.",
  sections: [
    {
      heading: 'The app',
      body: [
        'Krita VCS runs entirely on your computer. It reads and writes files only inside the project folders you choose, and it never connects to the internet: no update checks, no license pings, no crash reports, nothing. There is no account to create and nothing to sign in to.',
        "The app is open source, so you don't have to take our word for any of this. You can read exactly what it does yourself, on GitHub.",
      ],
      linkLabel: 'View the source on GitHub',
      linkHref: links.repo,
    },
    {
      heading: 'This website',
      body: [
        "This website doesn't use cookies, analytics, or third-party trackers. We don't know who you are, what you clicked, or how long you stayed.",
        "Like any website, our hosting provider keeps standard server logs for every request it handles, things like IP address, browser type, and timestamp. That's normal web infrastructure, not something we set up: we don't read it for analytics, and we don't share it with anyone.",
        'The preview image shown when a link to this site is shared is built on our server, using Google Fonts fetched by that server, not by your browser. Nothing about your visit reaches Google because of it.',
      ],
    },
    {
      heading: 'Downloading the app',
      body: [
        "Downloading the installer doesn't ask for an account, an email address, or any personal information. It's a direct file download, the same as downloading any file from any website.",
        "You can also get Krita VCS from its GitHub Releases page. If you download it from there instead, GitHub's own privacy policy covers that visit, not this one.",
      ],
    },
    {
      heading: 'Your version history',
      body: [
        "Every version Krita VCS saves stays inside your own project folder, in a local history store next to your files. We never see it, receive it, or back it up. If you delete it, it's gone, that's between you and your file system.",
      ],
    },
    {
      heading: "Children's privacy",
      body: [
        "Krita VCS is a tool for digital painters, not a service aimed at children, and we don't knowingly collect information from anyone, of any age, because we don't collect information at all.",
      ],
    },
    {
      heading: 'Changes to this policy',
      body: [
        'If anything here ever changes, the "last updated" date at the top will change with it. The full history is public in this site\'s own repository, like everything else about it.',
      ],
    },
    {
      heading: 'Contact',
      body: [
        'Krita VCS is made by one person, not a company. Questions about this policy, or anything else: reach out at anzelsakamoto@gmail.com, or on GitHub.',
      ],
      linkLabel: 'Find me on GitHub',
      linkHref: links.profile,
    },
  ],
} as const;

// Discovery / landing pages. Nobody searches the product name, so these target
// the *problems* painters actually search for. Each renders at /<slug> via the
// shared DiscoveryPage template, reusing the Section layout + honest media.
// Voice stays painter-first, same as the rest of the site.
export const recoverPage = {
  slug: 'recover-a-krita-version',
  metaTitle: 'Go back to an earlier version of a Krita painting',
  metaDescription:
    'Painted over good work, or a .kra file got away from you? Krita VCS keeps every save as a version you can compare and go back to. Free, local-only, no cloud.',
  headline: 'Go back to any earlier version of your painting.',
  intro:
    'Painted over an hour of good work, or a .kra file got away from you? If you have been saving with Krita VCS, every one of those saves is still there. Getting back to the one you want takes a few clicks, with nothing overwritten and nothing deleted.',
  sections: [
    {
      title: 'Every save is already a restore point.',
      body: [
        'Each time you save a version, Krita VCS records the full state of your painting, layer by layer. Nothing is flattened, nothing is thrown away. Weeks of work sit in one history you scroll back through, not a folder full of look-alike files.',
        'Because it only stores what changed between saves, that history stays small even after hundreds of versions.',
      ],
    },
    {
      title: 'Find the version you want, visually.',
      body: [
        'Open History and pick any two versions to see them side by side, or drag a swipe slider across the canvas. Changed pixels are outlined layer by layer, so you can spot the exact save where things still looked right, no guessing by filename or date.',
      ],
    },
    {
      title: 'Go back without losing anything.',
      body: [
        'Restore an older version and its files come back as a brand-new save on top of your history. The versions in between are never deleted, so you can always change your mind again. Undo works the same way: it lifts your most recent save back into unsaved changes, ready to redo.',
        'Overlapping edits are flagged for you to review, never quietly overwritten.',
      ],
    },
  ],
} as const;

export const vsCopiesPage = {
  slug: 'vs-saving-copies',
  metaTitle: 'Manage Krita versions without saving copies',
  metaDescription:
    'Tired of painting_final_v3.kra piling up? Krita VCS tracks every version inside one project folder and only stores what changed. No duplicate .kra files, no cloud.',
  headline: 'Stop saving copies of your .kra files.',
  intro:
    'The usual way to keep a painting safe is Save As: painting_final, painting_final_2, painting_FINAL_use_this. It works, until you have twenty near-identical files, no idea which is newest, and a drive filling up fast. Krita VCS replaces the whole pile with one tracked folder.',
  sections: [
    {
      title: 'The trouble with saving copies by hand.',
      body: [
        'Every manual copy is a full duplicate of a heavy, layer-packed file, so disk use climbs fast. Names drift out of order, cloud folders sync half-finished saves, and none of it tells you what actually changed from one copy to the next.',
      ],
    },
    {
      title: 'One folder, every version, only what changed.',
      body: [
        'Krita VCS keeps all of your history in a hidden folder inside your own project, and stores only the pixels that changed between saves, already around 50% smaller than a full copy by your second save. No _final_2, no duplicate .kra files cluttering your drive.',
        'It all stays on your machine. No account, no sync, no server.',
      ],
    },
    {
      title: 'And you can actually see the difference.',
      body: [
        'Instead of opening two files to guess what moved, compare any two versions side by side or on a swipe slider, with changed layers outlined for you. Branch off to try a bold new direction, then merge it back or drop it, without a single extra file on disk.',
      ],
    },
  ],
} as const;

export const recoverAfterCrashPage = {
  slug: 'recover-after-a-krita-crash',
  metaTitle: 'Recover from a Krita crash without losing your painting',
  metaDescription:
    'Krita crashed and you lost work? Krita VCS keeps a running history of every save, free and local-only, so next time a crash only costs a few minutes, not the whole painting.',
  headline: 'Stop losing hours of work to a Krita crash.',
  intro:
    "Krita crashing, freezing, or closing without saving can cost you hours of painting in one shot. Krita VCS can't bring back a file it never saw, but it makes sure this is the last time it costs you more than a few minutes: every version you save stays in your history, safe on your own machine, ready to go back to.",
  sections: [
    {
      title:
        'Most crash losses come from having no earlier save to fall back on.',
      body: [
        'The usual routine is one file, saved over itself again and again. If Krita crashes, freezes, or the file corrupts before your next save, whatever changed since the last one is simply gone.',
        'Krita VCS keeps every version you save as its own full point in your history, so a crash never erases more than the time since your last save.',
      ],
    },
    {
      title:
        "A version is one click away, right where you're already painting.",
      body: [
        'Save a version whenever you reach a good stopping point; it takes a note and a click. From the in-Krita panel, it can even save your open paintings for you the moment you click in, so a save is never more than a few minutes stale.',
      ],
    },
    {
      title: 'If something still goes wrong, going back takes a few clicks.',
      body: [
        'Open History and pick the version from right before things went wrong. Restore brings it back as a brand-new save, and nothing in between is ever deleted, so you can always change your mind again.',
        'Everything lives in a hidden folder inside your own project. No account, no cloud, nothing that stops working the moment your internet does.',
      ],
    },
  ],
} as const;

// Shared list for the sitemap + footer internal links.
export const discoveryPages = [
  recoverPage,
  vsCopiesPage,
  recoverAfterCrashPage,
] as const;
