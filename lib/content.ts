// Single source of truth for all site copy + links.
// Voice: painter-first, plain-language, calm — the site practises what "Artist Mode"
// preaches. I say "version / save / go back", not "commit / hash / rollback".

import type { Metadata } from 'next';

// The open-source repo the site links to (source, issues, releases/downloads).
export const repo = { owner: 'zeru-sakamoto', name: 'krita-vc' } as const;

const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

// Bump this on every release and swap the matching files in
// `public/download/` — nothing else in this file needs to change.
const APP_VERSION = '2.2.0';

// Canonical production origin. Env-overridable so a domain change is one var,
// not a code edit. No trailing slash — everything below joins onto it.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://krita-vc.zeru-sakamoto.codes';

// Every page's metadata in one shape. Next inherits `openGraph` root->page, so
// a page that sets only title/description silently ships the *homepage's*
// og:title and og:description (see app/layout.tsx, which deliberately omits
// og:url and canonical for the same inheritance reason). This is what makes
// that omission safe: call it on every route and nothing inherits by accident.
export function pageMeta(o: {
  path: string; // '/docs/safety' — leading slash, no origin
  metaTitle: string;
  metaDescription: string;
  type?: 'website' | 'article';
  absoluteTitle?: boolean; // opt out of the parent segment's title template
}): Metadata {
  const { path, metaTitle, metaDescription, type = 'article' } = o;
  return {
    title: o.absoluteTitle ? { absolute: metaTitle } : metaTitle,
    description: metaDescription,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: metaTitle,
      description: metaDescription,
      // Setting `openGraph` at all *replaces* the parent's whole object, and
      // that includes the app/opengraph-image.tsx file convention — so these
      // three have to be restated here or the page ships no card image at all.
      // (Every page that hand-rolled this block before was silently missing it.)
      siteName: site.name,
      locale: 'en_US',
      images: [ogImage],
    },
    twitter: { title: metaTitle, description: metaDescription },
  };
}

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
    'Krita VCS (also called KVC) is free, local-only version history for Krita painters. Save versions of a .kra painting, see what changed layer by layer, and go back whenever you like. No accounts, no uploads, and no coding required.',
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
  // Two short lines on purpose: the hero sets them as a pair in a half-width
  // column, so each has to fit one line at display size.
  headlineLines: ['Version control', 'for your art.'],
  headline: 'Version control for your art.',
  sub: 'Save versions of your paintings, see what changed layer by layer, and go back any time. All on your computer.',
  primaryCta: { label: 'Download for free' },
  // Screen-reader text for the hero's live GitHub badge (the visible badge is
  // just icons and numbers) and for the scroll cue (a bare animated line).
  repoMeta: {
    label: (stars: number, license: string | null) =>
      `Krita VCS on GitHub: ${stars} ${stars === 1 ? 'star' : 'stars'}${
        license ? `, ${license} license` : ''
      } (opens in a new tab)`,
  },
  scrollLabel: 'Scroll to the next section',
  loadingLabel: 'Loading the page',
  // Easter egg: drawn on the 3D tablet's screen while its power button has it
  // switched off. Decorative (the canvas is out of the accessibility tree).
  // `faceFallback` stands in where no installed font has the Kannada eyes.
  screenOff: {
    line: "Why'd you turn it off?",
    face: '(ಠ_ಠ)',
    faceFallback: '(•_•)',
  },
} as const;

// The one social card, generated by app/opengraph-image.tsx (which re-exports
// `alt`/`size` from here so the two can't drift). Restated by pageMeta because
// setting `openGraph` on a page replaces the file convention — see there.
export const ogImage = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: `${site.name}: ${hero.headline}`,
} as const;

// "Why artists use it" — the five value props as headings only, each paired
// with a glyph (app/components/why-glyphs.tsx, aligned by index). Full-width
// points grid, no media column; the feature blocks below carry the detail.
export const why = {
  id: 'why',
  title: 'Made for painters, not programmers.',
  intro:
    'Version control has always been built for code. Krita VCS is built for paintings, and for the way you actually work.',
  reverse: false,
  points: [
    { title: 'Nothing ever leaves your computer.' },
    { title: 'It reads every layer, not just your file.' },
    { title: 'See what changed, visually.' },
    { title: 'Try anything, and lose nothing.' },
    { title: 'Built for digital art.' },
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
      'Open any version and see it next to the one before, side by side or under a slider you drag. Whatever changed gets a dashed outline, and palettes compare swatch by swatch.',
    ],
    reverse: true,
  },
  {
    id: 'history',
    title: 'Every version is a place you can go back to.',
    body: [
      'Each version you save is a full version you can return to, laid out on the Version Map. Try something risky on its own line of work, and bring it back in if you like how it turned out.',
    ],
    reverse: false,
  },
  {
    id: 'yours',
    title: 'Yours, in plain language, on your machine.',
    body: [
      'Artist Mode swaps the technical talk for plain words like "Version 12." Nothing syncs, nothing uploads. You can back up several paintings, each with its whole history, into one archive.',
    ],
    reverse: true,
  },
  {
    id: 'settings',
    title: 'Sign your work, tune it to your machine.',
    body: [
      'Put your name on every version you save. There are eight color themes to pick from, and compact storage if your history gets heavy.',
    ],
    reverse: false,
  },
  {
    id: 'performance',
    title: 'See exactly what version control is saving you.',
    body: [
      'A Performance tab shows what each version added next to what a full copy would have cost.',
    ],
    reverse: true,
  },
  {
    id: 'panel',
    title: 'Save a version without leaving Krita.',
    body: [
      "There's an optional panel inside Krita, so you can save a version right beside your canvas. It saves your painting for you first, and it shares its history with the main app.",
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
  { name: 'Gallery', background: '#efe7d8', accent: '#b1531f' },
  { name: 'Overcast', background: '#eceef2', accent: '#3d6fa5' },
] as const;

// "What's next" — short roadmap, its own light section (no media column).
export const whatsNext = {
  id: 'next',
  title: "What I'm building next.",
  intro:
    "Krita VCS is still a work in progress. A few things I'm still improving:",
  items: [
    {
      title: 'A one-click plugin install',
      body: 'The Krita panel works today, but you install it by hand. Next, it installs with the app.',
    },
    {
      title: 'Signed installers',
      body: 'Windows and macOS still warn about an unknown developer. Signing the installers fixes that.',
    },
  ],
  cta: { label: 'Request a feature on GitHub', href: links.issues },
} as const;

// OS availability, shown as a small informational icon row under the hero
// download button — kept consistent with the FAQ's platform answer below.
export const platforms = {
  note: 'Windows, macOS, and Linux, all downloadable today.',
  items: [{ name: 'Windows' }, { name: 'macOS' }, { name: 'Linux' }],
} as const;

// FAQ — rendered as a native <details>/<summary> accordion (no JS).
export const faq = [
  {
    q: 'What does it do?',
    a: 'It keeps the versions of your painting that you save, like a save point for each stage of the work. You can look at any earlier version, see what changed in it, and go back to it, without a folder full of duplicate files.',
  },
  {
    q: 'Do I need to know Git, or use a command line?',
    a: 'No. There\'s no terminal and no git vocabulary anywhere in the app. Artist Mode is on from the start and shows plain labels like "Version 12" instead of hashes and codes. If you can save a file in Krita, you know most of what you need.',
  },
  {
    q: "What's the difference between saving in Krita and saving a version here?",
    a: "Ctrl+S in Krita works exactly as it always has. Saving a version in Krita VCS is a separate step on top: it records your saved painting so you can come back to it, see what changed, or restore it later. It's worth doing whenever you reach a point you'd hate to lose.",
  },
  {
    q: 'Is my art uploaded anywhere?',
    a: 'No. Krita VCS only works on your computer. Every version stays in a hidden folder beside the painting, nothing is ever sent anywhere, and it works the same with Wi-Fi on or off.',
  },
  {
    q: 'Can I lose work by using this?',
    a: 'The app is designed to make that hard. History is never deleted behind your back, anything that would throw work away asks first, and every write lands in a temporary file before it replaces anything real. A damaged history is never saved over, cleanup keeps what it clears in a hidden trash folder for 14 days, and restoring a backup over a painting keeps the one it replaced. A backup on another drive is still the only thing that protects you from a failing disk.',
  },
  {
    q: 'Is it free, and what does it run on?',
    a: "Yes, Krita VCS is free and open source under the GPL-3.0 license. It runs on Windows, macOS, and Linux. The installers aren't code-signed yet, so Windows and macOS show a warning the first time you open the app: on Windows choose More info, then Run anyway, and on macOS open System Settings → Privacy & Security and choose Open Anyway.",
  },
  {
    q: "Can I start using it on a painting I've already been working on for a while?",
    a: 'Yes. Choose Track an artwork and pick the .kra file. Your first version is the painting as it is right now, and nothing about the file changes.',
  },
  {
    q: 'Will my history get huge over time?',
    a: 'Each version only stores what changed, so the history stays compact. Compact storage in Settings can shrink it further for paintings you rework a lot, and if you ever want space back from old, unreachable versions, Clean up storage does it when you confirm.',
  },
  {
    q: 'I used an older version. Will it still open my history?',
    a: "No. Version 2.0 changed how history is stored, from one history per folder to one history per painting, and it can't read histories made by earlier versions. Your painting files themselves are fine.",
  },
  {
    q: 'Is KVC or Krita VC the same thing as Krita VCS?',
    a: "Yes. KVC, Krita VC, KritaVC, and Krita Version Control are all names for the same app. Krita VC is also what Krita's Python Plugin Manager calls the optional in-Krita panel, which runs on the same history.",
  },
] as const;

// The /docs page — a chapter-tabbed documentation guide, kept off the
// single-page landing flow since it's read once, not scrolled past. No
// screenshots: same honest-media rule as the rest of the site. Written for a
// reader who has never used version control before: What is version control?
// comes first, then a page per feature and per plugin panel, not one long list.
export const docs = {
  title: 'Documentation',
  intro:
    'New to version control? Start with What is version control?, then Getting started. Everything after that is short, one-topic pages: a page per feature, a page per plugin panel, and the safeguards that keep your work safe.',
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
    'Never used version control before? A short, plain-English explanation of what a version, a line of work and restoring mean, before you install anything.',
  intro:
    "If you've never used anything like this, start here. A handful of words cover most of it.",
  highlight: { phrase: 'A handful of words', tone: 'cool' } as const,
  terms: [
    {
      lead: 'Version control',
      body: 'A tool that remembers the versions of your work as you save them, so you can look back or go back. Think of a row of save points for your painting instead of the one you last pressed Ctrl+S on.',
    },
    {
      lead: 'A version',
      body: 'A saved snapshot of your painting at one moment, with a short note from you about what changed. Krita VCS keeps every version you save; a new one never overwrites an old one.',
    },
    {
      lead: 'A painting you track',
      body: 'Krita VCS keeps versions for the .kra files you choose. Each tracked painting has its own history, kept in a hidden .kvc folder next to the file.',
    },
    {
      lead: 'Saving a version',
      body: "Turning where your painting is right now into a new version. Ctrl+S in Krita still saves your file exactly as before. Saving a version is a separate step on top, for when you've reached something worth keeping.",
    },
    {
      lead: 'A line of work',
      body: 'A separate run of versions, split off so you can try something risky, like a new color scheme, without touching your main line. Developers call these branches.',
    },
    {
      lead: 'Restoring',
      body: 'Bringing an older version back as your newest one. Nothing that came after it is deleted.',
    },
    {
      lead: 'Setting work aside',
      body: "Putting changes you haven't saved as a version on a shelf, so you can bring them back later.",
    },
  ],
} as const;

export const docsGettingStarted = {
  slug: 'getting-started',
  label: 'Getting started',
  title: 'Getting started',
  metaTitle: 'Getting started',
  metaDescription:
    'Install Krita VCS, start tracking a .kra painting, and save your first version.',
  steps: [
    {
      title: 'Install and open.',
      body: "Download it for free and run the installer. There's no account and no sign-in. The installers aren't code-signed yet, so the first time you open the app Windows or macOS warns you about an unknown developer. On Windows, choose More info, then Run anyway. On macOS, open System Settings → Privacy & Security and choose Open Anyway.",
    },
    {
      title: 'Say hello.',
      body: 'The first time you open it, Krita VCS asks for your name (it stays on this computer and goes on the versions you save) and lets you pick a color theme. You can skip both and change them later in Settings.',
    },
    {
      title: 'Track a painting.',
      body: "Click the switcher at the top of the window, choose Track an artwork, and pick a .kra file. Its history starts in a hidden .kvc folder beside it. Picking a painting you've tracked before brings its history back; nothing is reset. A short tour then points out the main parts of the app.",
    },
    {
      title: 'Save your first version.',
      body: 'Open Changes, write a short note about the painting, and choose Save this version. The first version always holds the whole painting.',
    },
    {
      title: 'Keep painting, then save again.',
      body: 'Save in Krita as usual. When you switch back to Krita VCS it checks for changes by itself, and Changes lists the layers you touched. Leave them all ticked to save the whole painting, or untick the ones you want to leave for later.',
    },
    {
      title: 'See what changed.',
      body: "Open the Version Map and click a version. You'll see what changed in it, side by side or with a swipe slider, layer by layer.",
    },
    {
      title: "Try the rest when you're ready.",
      body: 'Lines of work, setting work aside and restoring older versions are all optional. Each one has its own short page under Using each feature.',
    },
  ],
} as const;

// One short page per part of the app. Slugs are URLs, so keep them stable:
// `history` is the Version Map's page and `branches` is lines of work.
export const docsFeatures: readonly FeatureDetail[] = [
  {
    slug: 'changes',
    label: 'Changes',
    title: 'Saving a version',
    metaTitle: 'Changes',
    metaDescription: 'How to turn your current work into a saved version.',
    summary: 'Where you turn your work into a version you can come back to.',
    intro:
      "Changes is where you turn your current work into a version. It lists the layers you've changed since your last version, each with a tick box.",
    highlight: { phrase: 'each with a tick box', tone: 'cool' },
    steps: [
      {
        title: 'Open Changes.',
        body: 'A changed group of layers shows up as one row.',
      },
      {
        title: 'Pick what to include.',
        body: "Everything starts ticked, so the whole painting is saved. Untick a layer to leave it for later; the button shows how many layers you're saving.",
      },
      {
        title: 'Write a short note.',
        body: 'A word or two about what changed is enough, like "Fixed the eyes."',
      },
      {
        title: 'Choose Save this version.',
        body: 'The app locks for a moment while it saves, so nothing interrupts it.',
      },
    ],
    note: {
      tone: 'blue',
      body: 'Layers you leave out stay changed in your file, ready for a later version. Canvas size, animation and document settings always go into the version.',
    },
  },
  {
    slug: 'history',
    label: 'Version Map',
    title: 'Looking back at your versions',
    metaTitle: 'The Version Map',
    metaDescription:
      'See every version of your painting laid out left to right, and open any one to see what changed.',
    summary: 'Every version of your painting, on one map.',
    intro:
      "The Version Map shows your painting's versions left to right, oldest first, each with its thumbnail, its note and the layers that changed. Click one to see what changed in it.",
    highlight: { phrase: 'left to right, oldest first', tone: 'cool' },
    items: [
      {
        lead: 'Moving around',
        body: 'Scroll to zoom and drag to move. The buttons in the header fit every version on screen or jump to the newest one, and the small map in the corner shows where you are.',
      },
      {
        lead: 'Work not saved yet',
        body: 'When you have changes that aren\'t a version yet, a dashed card at the end of the line says "not saved yet". Click it to go to Changes.',
      },
      {
        lead: 'All lines',
        body: 'Turn it on in the header to see every line of work on its own lane.',
      },
      {
        lead: 'Prefer lists?',
        body: 'Settings → Appearance → Legacy version history brings back the older History and Branches panels.',
      },
    ],
    note: {
      tone: 'blue',
      body: 'Nothing on the map changes just because you looked at it. Browsing is always safe.',
    },
  },
  {
    slug: 'comparing-versions',
    label: 'Seeing what changed',
    title: 'Seeing exactly what changed',
    metaTitle: 'Seeing what changed',
    metaDescription:
      'Open a version of your painting and see what changed since the one before, side by side or with a swipe slider.',
    summary: 'See exactly what changed, side by side.',
    intro:
      'Open any version and you see what changed since the version before it, side by side or with a swipe slider across one canvas.',
    highlight: { phrase: 'since the version before it', tone: 'cool' },
    steps: [
      { title: 'Open a version.', body: 'Click it on the Version Map.' },
      {
        title: 'Choose a view.',
        body: 'Side by side, or the swipe slider. Zoom and pan stay in sync on both sides.',
      },
      {
        title: 'Click a layer.',
        body: "The highlight then shows only that layer's changes, and the side panel shows its type, visibility, opacity, blend mode and painted area.",
      },
    ],
    note: {
      tone: 'cool',
      body: 'Changed pixels get a tint and a dashed outline that follows their shape, and palettes saved inside the painting are compared swatch by swatch.',
    },
  },
  {
    slug: 'undo',
    label: 'Undo',
    title: 'Taking back your last version',
    metaTitle: 'Undo',
    metaDescription:
      'Take back your most recent version, or put the painting back the way your last version had it.',
    summary: 'Take back your last version, or your unsaved work.',
    intro:
      'Undo the last version, in the ⋮ menu next to Changes, takes your most recent version off again. Its changes come back as unsaved work, ready to save differently.',
    highlight: { phrase: 'come back as unsaved work', tone: 'warm' },
    items: [
      {
        lead: 'Undo the last version',
        body: 'Takes back your most recent version. Nothing in the painting changes; only the version goes.',
      },
      {
        lead: 'Undo all',
        body: "At the top of Changes. Puts the painting back the way your last version had it. Everything since is lost, including Krita's undo history for it, so the app asks first.",
      },
    ],
    note: {
      tone: 'warm',
      body: 'Undo the last version is blocked if a later version or another line of work builds on it, so nothing that depends on it gets lost.',
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
      'Restore this version, in the side panel of an opened version, brings that older version back as a brand-new version on top of your history.',
    highlight: { phrase: 'brand-new version', tone: 'cool' },
    note: {
      tone: 'cool',
      body: 'Nothing in between is deleted, so you can always change your mind again.',
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
      'Setting work aside puts your unsaved changes on a shelf without making them a version, and returns the painting to your last version.',
    highlight: { phrase: 'a shelf', tone: 'cool' },
    steps: [
      { title: 'Open the ⋮ menu.', body: 'It sits next to Changes.' },
      {
        title: 'Choose Set this aside.',
        body: 'Add a label if you like. Your unsaved work moves to the shelf.',
      },
      {
        title: 'Bring it back later.',
        body: 'Choose Bring back latest, or Bring back to pick from the list.',
      },
    ],
    note: {
      tone: 'blue',
      body: 'If the painting changed in the meantime, nothing is overwritten: the layers you had changed are added back on top, for you to sort out in Krita. When a switch is blocked by unsaved work, Krita VCS offers Set it aside as the way through.',
    },
  },
  {
    slug: 'branches',
    label: 'Lines of work',
    title: 'Trying things without risk',
    metaTitle: 'Lines of work (branches)',
    metaDescription:
      'What a line of work is, and how to start, switch, bring in or remove one.',
    summary: 'A separate line of work you can try things on, safely.',
    intro:
      'A line of work (developers call it a branch) is a separate run of versions, so you can try a new direction without touching your main line. They live in the menu at the top left of the Version Map.',
    highlight: { phrase: 'separate run of versions', tone: 'warm' },
    items: [
      {
        lead: 'New version line',
        body: "Starts a new line from the newest version of the line you're on, or of another line you choose.",
      },
      {
        lead: 'Start a line here',
        body: 'Click any version on the map and start a new line from it.',
      },
      { lead: 'Switch', body: 'Pick a line in the menu to work on it.' },
      {
        lead: 'Bring it in',
        body: "Hover over a line and bring it into the one you're on. If both lines changed the painting, the one you bring in is marked Needs review, and the other version stays in its own line's history.",
      },
      {
        lead: 'Remove this version line',
        body: "Deletes a line you no longer need. Its versions aren't deleted straight away; Clean up storage reclaims the space later.",
      },
    ],
    note: {
      tone: 'warm',
      body: "You can't remove your main line, or the one you're on. Switch to another line first.",
    },
  },
  {
    slug: 'performance-tab',
    label: 'Performance tab',
    title: 'Seeing what it saves you',
    metaTitle: 'The Performance tab',
    metaDescription:
      'See how much space your history saves compared with full copies, and how long saving and comparing take.',
    summary: 'How much space your history saves, version by version.',
    intro:
      'The Performance tab compares what each version added with what a full copy of the painting would have cost, and shows the share saved.',
    highlight: {
      phrase: 'what a full copy of the painting would have cost',
      tone: 'cool',
    },
    note: {
      tone: 'blue',
      body: "The summary adds it all up, next to how long saving, switching and comparing take on average. Times only appear for things you've done in the app on this computer.",
    },
  },
  {
    slug: 'settings',
    label: 'Settings',
    title: 'Your name, your theme, your machine',
    metaTitle: 'Settings',
    metaDescription:
      'Your name, color theme, background CPU use and storage options.',
    summary: 'Your name, your theme, and how the app uses your machine.',
    intro:
      'Settings, the gear at the bottom left, has four tabs: Appearance, Performance, Storage and Set-Aside.',
    highlight: { phrase: 'four tabs', tone: 'blue' },
    items: [
      {
        lead: 'Appearance',
        body: "Artist view (plain words instead of technical ones), the app's own title bar or your system's window frame, the legacy History and Branches panels, your name, the color theme, and buttons to replay the tour and the welcome screen.",
      },
      {
        lead: 'Performance',
        body: 'Background CPU use (Gentle, Balanced or Full speed) sets how much of your processor version work may take. Low-memory diffs uses less memory on big paintings, in exchange for a little extra time.',
      },
      {
        lead: 'Storage',
        body: 'Where version history is kept, how much disk space previews may use, compact storage for paintings with lots of small edits, Clean up storage and Check for problems. It also says when you last made a backup.',
      },
      {
        lead: 'Set-Aside',
        body: "Everything on your shelf, with the line it came from and how long it's been there.",
      },
      {
        lead: 'Eight color themes',
        body: 'Six dark and two light. Your pick applies straight away, with no restart.',
      },
    ],
    note: {
      tone: 'blue',
      body: 'Changing where history is kept only affects paintings you start tracking afterwards. For now the Krita panel only finds history kept beside the painting, so leave it at the default if you use the panel.',
    },
  },
  {
    slug: 'storage-cleanup',
    label: 'Cleanup and checks',
    title: 'Reclaiming space, and checking your history',
    metaTitle: 'Clean up storage and Check for problems',
    metaDescription:
      'Free up space from old, unreachable versions safely, and check that every version is intact.',
    summary: 'Reclaim space safely, and check that every version is intact.',
    intro:
      'Clean up storage, in Settings → Storage, shows you how much space it would free before anything is deleted.',
    highlight: { phrase: 'before anything is deleted', tone: 'warm' },
    items: [
      {
        lead: 'Clean up storage',
        body: "Only clears old versions nothing can reach any more, never your current work or anything still on the Version Map. What it clears waits in a hidden trash folder for 14 days before it's gone for good.",
      },
      {
        lead: 'Check for problems',
        body: "Confirms the data behind every version is there, without changing anything. It reports missing pieces, a version whose earlier version has gone missing, and storage files it couldn't read. Check this painting, every painting you track, or only the ones never checked before.",
      },
      {
        lead: 'Read back every version',
        body: "The slower option also reads every stored version back to make sure it's intact.",
      },
    ],
    note: {
      tone: 'warm',
      body: "If a history is damaged, Krita VCS still shows every version it can read but won't save anything on top, and cleanup won't run on it. Restoring an earlier backup gets you a working history back.",
    },
  },
  {
    slug: 'backup',
    label: 'Backup and restore',
    title: 'Keeping a copy outside the app',
    metaTitle: 'Backup and restore',
    metaDescription:
      'Back up your paintings and their whole history into one archive, and restore them later.',
    summary: 'Your one copy that survives a lost folder or a failing disk.',
    intro:
      'Back up artworks, in the bar on the left just above the gear, puts your paintings and their whole history into one archive you keep somewhere else, like an external drive or your own cloud storage.',
    highlight: { phrase: 'somewhere else', tone: 'cool' },
    items: [
      {
        lead: 'Backing up',
        body: "Every painting you track starts ticked. Untick any you want to skip, then choose where to save. The archive is checked right after it's written, and a backup that fails leaves your previous one as it was.",
      },
      {
        lead: 'Restoring',
        body: 'Open the switcher at the top and choose Restore from a backup. Each painting goes back to its original folder if that folder still exists, or to a folder you choose.',
      },
      {
        lead: 'Replace',
        body: "A painting that's already there is skipped unless you choose Replace, and Compare versions shows both histories side by side first. Replace keeps the painting it swaps out under a new name, and its history for 14 days.",
      },
    ],
    note: {
      tone: 'warm',
      body: "It's the one safety net Krita VCS can't provide on its own. If a folder is ever lost to a stray delete or a failing disk, a backup you made is the way back.",
    },
  },
  {
    slug: 'stop-tracking',
    label: 'Stop tracking',
    title: 'Stopping tracking a painting',
    metaTitle: 'Stop tracking',
    metaDescription:
      'Remove a painting from the list, or delete its version history, without touching the painting.',
    summary: 'Forget a painting, or delete its history, safely.',
    intro:
      'Open the switcher and choose Stop tracking next to a painting. The painting file itself is never touched either way.',
    highlight: { phrase: 'never touched', tone: 'cool' },
    items: [
      {
        lead: 'Remove from list',
        body: 'Forgets the painting in the app and leaves its history on disk, so you can add it back any time.',
      },
      {
        lead: 'Delete version history',
        body: "Moves the history to your Recycle Bin or Trash, after you type the painting's name to confirm.",
      },
    ],
  },
] as const;

export const docsUsingFeatures = {
  slug: 'using-features',
  label: 'Using each feature',
  title: 'Using each feature',
  metaTitle: 'Using each feature',
  metaDescription:
    'A short page for each part of Krita VCS: Changes, the Version Map, seeing what changed in your painting, and more.',
  intro:
    "One short page for each part of the app. Pick the one you need; there's no need to read them in order.",
  items: docsFeatures,
} as const;

export const docsSafety = {
  slug: 'safety',
  label: 'Keeping your work safe',
  title: 'How Krita VCS keeps your work safe',
  metaTitle: 'Keeping your work safe',
  metaDescription:
    'The safeguards Krita VCS builds in so you never lose work by accident.',
  items: [
    {
      lead: "It won't switch lines or bring one in over unsaved work.",
      body: 'You get a prompt with three ways out: save first, set the work aside and carry on, or cancel.',
    },
    {
      lead: 'It never picks a winner in silence.',
      body: 'When two lines both changed the painting, the one you bring in is marked Needs review, and the other version stays in its own history.',
    },
    {
      lead: "You can't remove your main line or the one you're on.",
      body: 'Switch to another line first.',
    },
    {
      lead: "It won't undo a version something else depends on.",
      body: 'If a later version or another line builds on it, undo is blocked.',
    },
    {
      lead: "Nothing happens when there's nothing to do.",
      body: "Saving with no changes doesn't make an empty version.",
    },
    {
      lead: 'It never saves over damaged history.',
      body: "If part of a history is damaged, every version it can read stays viewable, but nothing new is saved on top and cleanup won't run, so the versions behind the damage aren't lost for good.",
    },
    {
      lead: 'Only one change is written at a time.',
      body: 'If the app and the Krita panel try at once, the second one stops and tells you what the first is doing.',
    },
    {
      lead: 'Nothing is written halfway.',
      body: "Every write goes to a temporary file and only replaces the real one once it's complete, so a crash or power cut can't leave a half-written version.",
    },
    {
      lead: 'On Windows it checks for disk space first.',
      body: "Saving, restoring and switching stop with a clear message if there isn't room, instead of failing partway through.",
    },
    {
      lead: 'Stopping tracking starts with the safe choice.',
      body: "Removing a painting from the list keeps its history, and deleting history asks you to type the painting's name first and moves it to the Recycle Bin or Trash.",
    },
    {
      lead: 'Cleanup always shows you first.',
      body: 'You see what would be freed before anything happens, and what it clears stays in a hidden trash folder for 14 days.',
    },
    {
      lead: "Backups are checked as soon as they're written.",
      body: 'A broken archive is never reported as a success, and a backup that fails leaves your previous one as it was.',
    },
    {
      lead: 'Restoring asks before it replaces anything.',
      body: 'A painting already in place is skipped unless you choose Replace, and you can compare both histories first. Replace keeps the painting and history it swaps out, and a restore that fails changes nothing.',
    },
    {
      lead: 'You can keep a copy of your own outside the app.',
      body: 'A backup on another drive is what brings a painting back if the folder is ever lost to a stray delete or a failing disk.',
    },
  ],
} as const;

// Short pages for the plugin panel too, same shape as docsFeatures. Slugs are
// URLs, so they stay as they were even where the label changed. "What it
// leaves to the app" isn't a feature to use, so it lives as a closing note on
// the /plugin index instead of its own page — see pluginPage below.
export const pluginSubchapters: readonly FeatureDetail[] = [
  {
    slug: 'commit-and-checkpoint',
    label: 'Commit',
    title: 'Saving from inside Krita',
    metaTitle: 'Commit from the panel',
    metaDescription: 'Save a version from the in-Krita panel.',
    summary: 'Write a note and save a version, right beside your canvas.',
    intro:
      "The panel shows the line of work you're on, whether your painting has unsaved changes, and a box for a short note. Write what you did and click Commit to save a version.",
    highlight: { phrase: 'click Commit', tone: 'cool' },
    note: {
      tone: 'blue',
      body: 'The note is required, and the version saves in the background, so you can keep using Krita while it works. The Author box holds the name the panel puts on your versions; Krita keeps it separately from the app, so set it in both if you use both.',
    },
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
      "Versions are made from what's on disk, so the panel saves for you. Clicking into the panel saves your painting if it has unsaved changes, and Commit saves before it records anything.",
    highlight: { phrase: 'the panel saves for you', tone: 'cool' },
    note: {
      tone: 'blue',
      body: "Saving still isn't the same as saving a version. Nothing becomes a version until you click Commit.",
    },
  },
  {
    slug: 'choose-what-to-include',
    label: 'A version is the whole painting',
    title: 'What goes into a version',
    metaTitle: 'A version is the whole painting',
    metaDescription:
      'The panel saves the whole painting; the app can save just some layers.',
    summary:
      'The panel saves the whole painting. The app can save just some layers.',
    intro:
      'The list under Changes shows your painting and how it changed since the last version, and the whole painting goes into the version.',
    highlight: { phrase: 'the whole painting', tone: 'warm' },
    note: {
      tone: 'blue',
      body: 'To save only some of your layers and leave the rest for later, use the Changes panel in the app, which lists each changed layer with its own tick box.',
    },
  },
  {
    slug: 'set-aside',
    label: 'Set aside',
    title: 'Parking work without saving it',
    metaTitle: 'Set aside',
    metaDescription: 'Shelve your changes without turning them into a version.',
    summary: 'Shelve your changes, then bring them back later.',
    intro:
      'Set aside, in the ⋮ menu, puts your changes on a shelf without making a version, and returns the painting to your last version. Bring it back later with Bring back latest, or pick one with Bring back.',
    highlight: { phrase: 'a shelf', tone: 'cool' },
    note: {
      tone: 'blue',
      body: "If the painting changed in the meantime, nothing gets overwritten: the layers you had changed are added back on top. It's also the quickest way past a switch that's blocked by unsaved work.",
    },
  },
  {
    slug: 'discard',
    label: 'Discard',
    title: 'Going back to your last version',
    metaTitle: 'Discard',
    metaDescription: 'Put your painting back the way your last version had it.',
    summary: 'One warning, then everything since your last version is gone.',
    intro:
      "Discard puts your painting back the way your last version had it. Everything since then, including work the panel saved for you, is gone for good, and it won't be in Krita's undo history either.",
    highlight: { phrase: 'gone for good', tone: 'warm' },
    note: {
      tone: 'warm',
      body: "The panel asks first. If there's any chance you'll want the work back, set it aside instead.",
    },
  },
  {
    slug: 'documents-reload-themselves',
    label: 'Your painting reopens itself',
    title: 'Why your canvas refreshes on its own',
    metaTitle: 'Your painting reopens itself',
    metaDescription:
      'Why the panel reopens your painting after an action changes the file.',
    summary: 'The panel reopens your painting whenever an action changed it.',
    intro:
      'Discarding, setting aside, bringing work back and switching lines all rewrite the .kra file on disk, so the panel closes and reopens your painting whenever an action changed it, keeping your canvas in sync with your history.',
    highlight: { phrase: 'in sync with your history', tone: 'cool' },
    note: {
      tone: 'warm',
      body: 'It reopens even when an action fails halfway. The one trade-off: a reopened painting starts with an empty undo history.',
    },
  },
  {
    slug: 'branch-switching',
    label: 'Switching lines',
    title: 'Switching lines of work from the panel',
    metaTitle: 'Switching lines',
    metaDescription: 'Switch to another line of work without leaving Krita.',
    summary: 'Switch without leaving Krita, even with unsaved work in the way.',
    intro:
      "The line you're on is shown at the top of the panel. Click it to switch to another line, or choose New branch to start one from the version you're on. If unsaved work is in the way, the panel offers Set aside & switch.",
    highlight: { phrase: 'Set aside & switch', tone: 'cool' },
  },
  {
    slug: 'palette-files',
    label: 'Palettes',
    title: 'Your color palettes come along',
    metaTitle: 'Palettes',
    metaDescription:
      'Palettes saved inside your .kra are saved and compared with it.',
    summary: 'Palettes inside your painting are saved with every version.',
    intro:
      "Palettes saved inside your .kra are part of the painting, so they're saved with every version and compared in the app, swatch by swatch.",
    highlight: { phrase: 'swatch by swatch', tone: 'cool' },
    note: {
      tone: 'blue',
      body: "Separate palette files (.gpl, .kpl, .aco, .ase) sitting beside your painting aren't tracked.",
    },
  },
  {
    slug: 'installing',
    label: 'Installing',
    title: 'Installing the plugin',
    metaTitle: 'Installing the plugin',
    metaDescription: 'Unzip, copy into Krita, and turn the plugin on.',
    summary: 'Unzip, copy into Krita, and turn it on.',
    intro:
      "You need the Krita VCS app installed first: it installs the kvc tool the panel talks to, and it's where you start tracking a painting. Your Krita also needs Python plugins, which official builds include.",
    highlight: { phrase: 'the Krita VCS app installed first', tone: 'blue' },
    steps: [
      {
        title: 'Download and unzip.',
        body: 'Download kritavc-plugin.zip and unzip it. Inside are a file called kritavc.desktop and a folder called kritavc.',
      },
      {
        title: "Find Krita's plugin folder.",
        body: "In Krita: Settings → Manage Resources → Open Resource Folder. Inside is a folder called pykrita; create it if it isn't there.",
      },
      {
        title: 'Copy the plugin in.',
        body: 'Copy kritavc.desktop and the kritavc folder into pykrita. Both have to sit directly inside it, not one level deeper.',
      },
      {
        title: 'Turn it on and restart.',
        body: 'Settings → Configure Krita → Python Plugin Manager, tick Krita VC, click OK, then restart Krita. Python plugins only load when Krita starts, so this step matters.',
      },
      {
        title: 'Open the panel.',
        body: "Settings → Dockers → Version Control. If it isn't there, the plugin didn't load; go back over the previous two steps.",
      },
      {
        title: 'Point it at kvc, if it asks.',
        body: "On Windows, and on Linux with the .deb or .rpm, the panel usually finds kvc by itself. If not, click Locate kvc and pick kvc.exe in the app's install folder (usually %LOCALAPPDATA%\\Krita-VC) on Windows, /Applications/Krita-VC.app/Contents/MacOS/kvc on macOS (press Cmd+Shift+G and paste the path), or /usr/bin/kvc on Linux. The AppImage keeps kvc where Krita can't reach it, so install the .deb or .rpm to use the panel.",
      },
    ],
    closing:
      "Uninstalling: untick Krita VC in the Python Plugin Manager, then delete kritavc.desktop and the kritavc folder from pykrita. Nothing about your paintings or their history lives in the plugin's folder, so removing it doesn't touch your work.",
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
      "Most problems come down to a file in the wrong place, Krita not finding the kvc tool, or a painting the app isn't tracking yet.",
    items: [
      {
        lead: '"Version Control" isn\'t in the Dockers menu.',
        body: "The plugin didn't load. Check that kritavc.desktop and the kritavc folder are directly inside pykrita, that Krita VC is ticked in the Python Plugin Manager, and that you restarted Krita afterwards.",
      },
      {
        lead: '"The kvc command-line tool wasn\'t found."',
        body: "Install the Krita VCS app if you haven't, then click Locate kvc and pick the file from the install steps.",
      },
      {
        lead: '"That isn\'t the kvc tool."',
        body: 'You picked a different file, often the main krita-vc app itself. Pick kvc (or kvc.exe on Windows), the file itself rather than its folder.',
      },
      {
        lead: '"Krita VC tracks .kra documents."',
        body: 'The painting you have open is a .png, .jpg or another format. Only .kra files have versions. Save it as .kra and start tracking it in the app.',
      },
      {
        lead: '"Open a saved document to see its versions."',
        body: "The painting hasn't been saved to a file yet. Save it as a .kra first.",
      },
      {
        lead: '"This artwork isn\'t version-controlled."',
        body: "Start tracking the painting in the app with Track an artwork. If the app already tracks it and you changed Settings → Storage → Where version history is kept, that's the cause: for now the panel only finds history kept beside the painting.",
      },
      {
        lead: '"repository is busy (locked by another process)"',
        body: "The app, or another action from the panel, is saving, switching or backing up right now. The message says what it's doing and for how long. Wait for it to finish and try again. The lock releases by itself, even after a crash, so there's nothing to delete by hand.",
      },
      {
        lead: '"Save (Ctrl+S) or undo your changes in … first."',
        body: "An action would have rewritten a painting that still has unsaved changes. You shouldn't normally see this, because clicking into the panel saves first. If you do, that save failed; see the next item.",
      },
      {
        lead: '"Couldn\'t save …"',
        body: "Krita couldn't write the file. Usually it's read-only, the disk is full, or another program has it open. Commit won't save a version from an out-of-date file, so fix the file and click the refresh button to try again.",
      },
      {
        lead: '"kvc didn\'t finish within …"',
        body: "Reading the history took longer than 30 seconds, or a save or switch longer than 5 minutes. Close the Krita VCS app if it's open and try again.",
      },
      {
        lead: '"version history is damaged: …"',
        body: "Part of this painting's history can't be read, so nothing new is saved on top of it, from the panel or the app. Open the app and run Settings → Storage → Check for problems to see what's wrong. Restoring an earlier backup brings a working history back.",
      },
      {
        lead: 'Anything else',
        body: 'The panel shows a short message and writes the full details to krita-vc-error.log in your home folder. Include that file if you open an issue on GitHub.',
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
    'Save versions, set work aside, and switch lines of work without leaving Krita. Download the optional Krita VC plugin and install it in a few minutes.',
  title: 'The Krita VCS plugin (aka Krita VC)',
  intro:
    'A small Version Control panel that lives inside Krita, so you can save a version, set work aside, or switch to another line of work without leaving your canvas. It uses the same engine and the same history as the Krita VCS app, so a version saved in one shows up in the other. It needs the app installed too.',
  featuresTitle: 'What it does',
  items: pluginSubchapters,
  closingTitle: 'What it leaves to the app',
  closing:
    'Starting to track a painting, browsing the Version Map, restoring an older version, undoing a version, bringing in or removing lines of work, saving only some layers, backups and settings all stay in the Krita VCS app. The panel is for the quick things you do while painting.',
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
  updated: 'October 16, 2026',
  intro:
    "The short version: Krita VCS doesn't collect anything. No accounts, no telemetry, no analytics, no cookies. Everything below explains what that means, in plain language.",
  sections: [
    {
      heading: 'The app',
      body: [
        'Krita VCS runs entirely on your computer. It reads and writes only the paintings you choose to track and their version history, and it never connects to the internet: no update checks, no license pings, no crash reports, nothing. There is no account to create and nothing to sign in to.',
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
        "Every version Krita VCS saves stays on your computer, in a hidden folder beside the painting (or in a folder you pick in Settings). We never see it, receive it, or back it up. If you delete it, it's gone, that's between you and your file system.",
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
  navLabel: 'Go back to a version',
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
        'Your versions line up left to right on the Version Map, each with a thumbnail and the note you wrote. Open one to see what changed since the version before it, side by side or under a swipe slider. Changed pixels are outlined layer by layer, so you can spot the exact version where things still looked right without guessing by filename or date.',
      ],
    },
    {
      title: 'Go back without losing anything.',
      body: [
        'Restore an older version and it comes back as a brand-new version on top of your history. The versions in between are never deleted, so you can always change your mind again. Undo works the same way: it lifts your most recent version back into unsaved changes, ready to save again.',
        'When two lines of work both changed the painting, the one you bring in is marked Needs review, and the other stays in its own history.',
      ],
    },
  ],
} as const;

export const vsCopiesPage = {
  slug: 'vs-saving-copies',
  navLabel: 'Stop saving copies',
  metaTitle: 'Manage Krita versions without saving copies',
  metaDescription:
    'Tired of painting_final_v3.kra piling up? Krita VCS keeps every version of one .kra file in a hidden folder beside it and only stores what changed. No duplicate files, no cloud.',
  headline: 'Stop saving copies of your .kra files.',
  intro:
    'The usual way to keep a painting safe is Save As: painting_final, painting_final_2, painting_FINAL_use_this. It works, until you have twenty near-identical files, no idea which is newest, and a drive filling up fast. Krita VCS replaces the whole pile with one painting and its history.',
  sections: [
    {
      title: 'The trouble with saving copies by hand.',
      body: [
        'Every manual copy is a full duplicate of a heavy, layer-packed file, so disk use climbs fast. Names drift out of order, cloud folders sync half-finished saves, and none of it tells you what actually changed from one copy to the next.',
      ],
    },
    {
      title: 'One file, every version, only what changed.',
      body: [
        'Krita VCS keeps the history in a hidden folder beside your painting, and each new version stores only what changed. By the second version the history already takes about half the space of two full copies, and the saving grows with every version after that. No _final_2, no duplicate .kra files cluttering your drive.',
        'It all stays on your machine. No account, no sync, no server.',
      ],
    },
    {
      title: 'And you can actually see the difference.',
      body: [
        'Instead of opening two files to guess what moved, open a version and see what changed since the one before, side by side or on a swipe slider, with changed layers outlined for you. Start a new line of work to try a bold new direction, then bring it back in or leave it, without a single extra file next to your painting.',
      ],
    },
  ],
} as const;

export const recoverAfterCrashPage = {
  slug: 'recover-after-a-krita-crash',
  navLabel: 'Recover from a crash',
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
        'Save a version whenever you reach a good stopping point; it takes a note and a click. The in-Krita panel even saves your painting for you the moment you click into it, so a version never misses your last few minutes of work.',
      ],
    },
    {
      title: 'If something still goes wrong, going back takes a few clicks.',
      body: [
        'Open the Version Map and pick the version from right before things went wrong. Restore brings it back as a brand-new version, and nothing in between is ever deleted, so you can always change your mind again.',
        'Everything lives in a hidden folder beside your painting. No account, no cloud, nothing that stops working the moment your internet does.',
      ],
    },
  ],
} as const;

export const comparePage = {
  slug: 'compare-krita-versions',
  navLabel: 'Compare versions',
  metaTitle: 'Compare versions of a Krita painting',
  metaDescription:
    'See exactly what changed in each version of a .kra file. Krita VCS shows a version next to the one before it, side by side or under a swipe slider, with changed layers outlined. Free and local-only.',
  headline: 'See exactly what changed in every version.',
  intro:
    'Opening two .kra files and flicking between windows is a slow way to find one edit. Open any version in Krita VCS and you see it next to the version before it, with the parts that actually changed marked for you.',
  sections: [
    {
      title: 'Side by side, or under a slider you drag.',
      body: [
        'View the two next to each other, or drag a swipe slider across a single canvas to wipe between before and after. The slider is the one most painters end up living in: it makes a repaint or a shifted silhouette obvious at a glance, because your eye compares the same spot rather than two spots.',
        'Zoom and pan stay linked across both sides, so you can go in close on one eye, one hand, one edge, and stay there.',
      ],
    },
    {
      title: 'Changed layers get a dashed outline.',
      body: [
        'Krita VCS reads your file layer by layer, so it can tell you which layers moved and which sat still. Changed regions get a tint and a dashed outline, and untouched layers are left alone. When a painting has forty layers and you only touched three, you find those three immediately. Click one and the highlight narrows to that layer alone.',
        'That also means comparing does not depend on you remembering what you did. The file remembers.',
      ],
    },
    {
      title: 'Every version, one step at a time.',
      body: [
        'Your versions line up on the Version Map, each with a thumbnail and the layers that changed in it, so you can walk back through a painting one version at a time and see what each step did. Palettes saved inside the painting are compared too, swatch by swatch.',
        'Nothing is thrown away while you look, and nothing leaves your machine.',
      ],
    },
  ],
} as const;

export const backupPage = {
  slug: 'backup-krita-files',
  navLabel: 'Back up your art',
  metaTitle: 'Back up your Krita paintings and their history',
  metaDescription:
    'A backup that keeps the whole story of a painting, not just the last save. Krita VCS puts your paintings and their full version history into one archive to keep anywhere you like. Free, local-only, no cloud.',
  headline: 'Back up the whole painting, not just the last save.',
  intro:
    'Most art backups copy one file: whatever the painting looked like the last time you saved. If that save was already painted over, the backup is painted over too. Krita VCS backs up the history as well, so the version you want is still in there.',
  sections: [
    {
      title: 'A copy of the newest file is not much of a safety net.',
      body: [
        'Cloud folders and drive backups sync the current state of a .kra file. Overpaint something on Tuesday and let it sync, and Monday is gone from the backup too, usually before you notice. Point-in-time recovery, where it exists at all, is a support ticket rather than a click.',
        'Keeping the history alongside the file solves this without any of that: the older versions are part of what gets backed up.',
      ],
    },
    {
      title: 'One archive, with every version inside it.',
      body: [
        'Krita VCS packs several paintings and their full histories into a single archive, and checks it right after writing it. Drop that archive on an external drive, a NAS, a USB stick, or a cloud folder if you want one. Restore it later from the app and the history comes back with it, ready to scroll through and go back into.',
        'If a painting is already in place, restoring skips it unless you choose Replace, and you can compare both histories first. Replace keeps the painting it swaps out under a new name, so restoring never quietly throws work away.',
        'It only ever stores what changed between saves, so the archive stays far smaller than a folder of full copies covering the same span of work.',
      ],
    },
    {
      title: 'Your files, your drive, your call.',
      body: [
        'There is no account and nothing uploads on its own. Krita VCS never phones anywhere; where a backup goes and how often is entirely up to you. If you uninstall the app tomorrow, your paintings and their history stay exactly where they are, in a hidden folder beside each painting.',
      ],
    },
  ],
} as const;

export const undoLimitPage = {
  slug: 'krita-undo-limit',
  navLabel: 'Past the undo limit',
  metaTitle: 'When Krita runs out of undo history',
  metaDescription:
    'Ctrl+Z only reaches so far back, and closing Krita clears it. Krita VCS keeps saved versions you can return to days later, long after undo has run out. Free and local-only.',
  headline: 'Undo runs out. Your history does not have to.',
  intro:
    "Krita's undo stack is finite, it lives in memory, and it empties the moment you close the file. That is fine for the last few strokes and useless for the hour you want back tomorrow morning. Saved versions cover the distance undo cannot.",
  sections: [
    {
      title: 'Why undo runs out exactly when you need it.',
      body: [
        'Undo holds a set number of steps, and heavy operations on a large canvas eat through them quickly. Raising the limit costs memory on the same machine that is already carrying a layer-heavy painting, so it can only go so far. Then you close the file, and the stack is empty.',
        'None of that is a flaw in Krita. Undo is built for the last few strokes, and it is very good at that. It was never meant to be a way back to Tuesday.',
      ],
    },
    {
      title: 'Saved versions are the long way back.',
      body: [
        'A version is a full point in your painting, written to disk with a short note in your own words. It survives closing the file, restarting the machine, and a week of other work. Scroll back through your history and pick the one you want, by look rather than by counting steps.',
        'Because only what changed gets stored, keeping hundreds of them stays cheap.',
      ],
    },
    {
      title: 'Going back is reversible too.',
      body: [
        'Restoring an older version brings it back as a brand-new save on top of your history, so the versions in between are still there if you change your mind again. There is also an undo of its own: it lifts your most recent saved version back into unsaved changes, ready to redo.',
        'Save a version at every good stopping point and undo stops being the thing standing between you and an hour of work.',
      ],
    },
  ],
} as const;

// Types for the handful of client components that render this data. They take
// it as props from their server parents rather than importing it: a single
// `import { x } from '@/lib/content'` in a client component pulls this whole
// module (~44KB) into the first-load bundle of every route, since the consts
// cross-reference each other and don't tree-shake. `import type` is erased at
// build, so these cost nothing.
export type DocsChapter = (typeof docsChapters)[number];
export type Theme = (typeof themes)[number];
export type PlatformDownloads = typeof platformDownloads;
export type NavContent = typeof nav;
export type FaqItems = typeof faq;

// Shared list: the sitemap, the footer's Guides column, and the related-guides
// block on each page all read from here, so a new page needs one entry.
export const discoveryPages = [
  recoverPage,
  vsCopiesPage,
  recoverAfterCrashPage,
  comparePage,
  backupPage,
  undoLimitPage,
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
      // Derived from discoveryPages so a new guide lands in the footer, the
      // sitemap, and each guide's related list from one entry.
      title: 'Guides',
      links: discoveryPages.map((p) => ({
        label: p.navLabel,
        href: `/${p.slug}`,
      })),
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
  license: 'Free and open source · GPL-3.0 license',
  aliasNote: 'Also called KVC, Krita VC, or Krita Version Control.',
  legal: { label: 'Privacy', href: '/privacy' },
} as const;
