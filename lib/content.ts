// Single source of truth for all site copy + links.
// Voice: painter-first, plain-language, calm — the site practises what "Artist Mode"
// preaches. I say "version / save / go back", not "commit / hash / rollback".

// The open-source repo the site links to (source, issues, releases/downloads).
export const repo = { owner: 'zeru-sakamoto', name: 'krita-vc' } as const;

const repoUrl = `https://github.com/${repo.owner}/${repo.name}`;

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
  metaTitle: 'Krita VCS: version control for your paintings, not your code',
  metaDescription:
    'Free, local-only version history for Krita painters: every save becomes a version of your .kra file you can compare, explore, or go back to instantly. No accounts, no uploads, and no coding required.',
  // Low ranking weight, but harmless and read by some engines. These are the
  // problem-phrases people actually search — nobody searches the product name.
  keywords: [
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
  badge: 'v1.0 · Free, open source, local-only',
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
  legal: { label: 'Privacy', href: '/privacy' },
} as const;

// The /docs page — a chapter-tabbed documentation guide, kept off the
// single-page landing flow since it's read once, not scrolled past. No
// screenshots: same honest-media rule as the rest of the site.
export const docs = {
  title: 'Documentation',
  intro:
    'New to Krita VCS? Start here. Every chapter below covers a different part of the app: installing and saving your first version, a reference for each feature, and the guardrails that keep your work safe. Want to save versions without leaving Krita? The optional plugin has its own page.',
  cta: { label: 'Read the docs on GitHub', href: links.docs },
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
      body: "Use the repository switcher at the top and choose Create repository (name it, choose a folder) or Browse existing repository (a folder you're already tracking). Picking a folder you've already set up just opens it. Nothing gets reset.",
    },
    {
      title: 'Save your first version.',
      body: "Open Changes, write a short note about what you did, and hit Commit version. Everything changed is included by default; stage just a subset first if you'd rather save only some files.",
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
  metaTitle: 'Using each feature',
  metaDescription:
    'A quick reference for every panel in Krita VCS: Changes, History, Branches, comparing versions of your painting, and more.',
  items: [
    {
      lead: 'Changes',
      body: 'Where you save. Stage everything or just a few files, write a note, and hit Commit. Locks briefly while saving so nothing gets interrupted.',
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
      lead: 'Set aside',
      body: "The same ⋯ menu. Parks work in progress on a shelf without saving it as a version, and puts your files back to your last saved version. Bring it back from the same menu, either the latest or picked from a list. If a branch switch is blocked because you have unsaved work, you'll be offered this as the way through.",
    },
    {
      lead: 'Restore',
      body: 'Pick any older version and bring its files back, saved as a brand-new version. Nothing older is ever deleted.',
    },
    {
      lead: 'Settings',
      body: "(gear icon) Artist view, title bar style, your name, 8 color themes, and your set-aside shelf (everything you've parked, with the branch it came from and how long it's been there; remove items one at a time or all at once). Per project: how much space preview images may use, a compact storage option that shrinks history for files with lots of small edits, a low-memory option that uses less memory (a little slower in exchange), and Clean up storage.",
    },
    {
      lead: 'Clean up storage',
      body: 'Shows you exactly how much space would be freed before you confirm anything. Only ever clears old, unreachable leftovers, never your current work or anything still visible in your history.',
    },
    {
      lead: 'Back up',
      body: "Zip a project's files and history to a spot you choose: the zip-icon button right above Settings backs up the project you're in, or use the repository switcher to back up every project at once. Good for an external drive or your own cloud storage.",
    },
  ],
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

// Sidebar/tab order for the /docs chapter nav. The plugin used to be a fourth
// chapter here; it's substantial enough (its own install guide, troubleshooting,
// download) to be its own page at /plugin instead — see pluginPage below.
export const docsChapters = [
  docsGettingStarted,
  docsUsingFeatures,
  docsSafety,
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
      fileHref: '/download/Krita-VC_1.0.0_x64-setup.exe',
      fileName: 'Krita-VC_1.0.0_x64-setup.exe',
      label: '.exe installer',
    },
    alternates: [
      {
        fileHref: '/download/Krita-VC_1.0.0_x64_en-US.msi',
        fileName: 'Krita-VC_1.0.0_x64_en-US.msi',
        label: '.msi installer',
      },
    ],
  },
  macos: {
    name: 'macOS',
    primary: {
      fileHref: '/download/Krita-VC_1.0.0_universal.dmg',
      fileName: 'Krita-VC_1.0.0_universal.dmg',
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
      fileHref: '/download/Krita-VC_1.0.0_amd64.AppImage',
      fileName: 'Krita-VC_1.0.0_amd64.AppImage',
      label: '.AppImage (any distro)',
    },
    alternates: [
      {
        fileHref: '/download/Krita-VC_1.0.0_amd64.deb',
        fileName: 'Krita-VC_1.0.0_amd64.deb',
        label: '.deb (Debian/Ubuntu)',
      },
      {
        fileHref: '/download/Krita-VC-1.0.0-1.x86_64.rpm',
        fileName: 'Krita-VC-1.0.0-1.x86_64.rpm',
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
  version: '1.0.0',
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

// The standalone /plugin page: feature rundown, install guide, and
// troubleshooting, with its own zip download. Kept off the /docs chapter
// tabs (see docsChapters) since it's substantial enough to be its own page.
// Installation guide here is deliberately end-user-only (unzip and copy);
// the Rust/cargo build-from-source steps stay in the repo's own README,
// linked at the bottom for the rare reader who wants them.
export const pluginPage = {
  slug: 'plugin',
  metaTitle: 'Krita VC plugin',
  metaDescription:
    'Save versions, checkpoint your progress, and switch branches without leaving Krita. Download the optional Krita VC plugin and install it in a few minutes.',
  title: 'The Krita VC plugin',
  intro:
    'A small Version Control panel that lives right inside Krita, so you can save a version, set work aside, or switch branches without ever leaving your canvas. It runs on the exact same engine and the exact same history as the desktop app. Save from either one, and the other sees it.',
  featuresTitle: 'What it does',
  features: [
    {
      lead: 'Commit and checkpoint, without leaving the canvas.',
      body: "The panel shows your current branch and changelist for the project you're painting in. Write a note and hit Commit, or use Checkpoint for a one-tap save with an auto-written, time-stamped message when you don't want to stop and think of one.",
    },
    {
      lead: 'You never have to save first.',
      body: "Versions are built from what's actually on disk, so the panel saves your open paintings for you the moment you click in. A version can never quietly miss your last few minutes of painting. But saving still isn't the same as committing: nothing becomes a version until you commit it.",
    },
    {
      lead: 'Pick exactly what goes in.',
      body: "Every file in the changelist has a checkbox, ticked by default, so Commit saves everything as expected. Untick anything you'd rather leave out; Commit, Checkpoint, Discard, and Set aside all act only on the ticked rows.",
    },
    {
      lead: 'Set work aside, or bring it back.',
      body: "Parks your ticked changes off to the side without them becoming a version, and puts those files back to your last saved version. Bring the latest one back, or pick from a list, from the same menu. It's also the fastest way past a branch switch blocked by unsaved work.",
    },
    {
      lead: 'Discard, with one honest warning.',
      body: "Reverts the ticked files to their last saved version. Everything since, including work the panel auto-saved for you, is gone for good. If there's a chance you'll want it back, set it aside instead.",
    },
    {
      lead: 'Documents reload themselves.',
      body: 'Discarding, setting aside, bringing work back, and switching branches all rewrite files on disk, so the panel closes and reopens any open document it actually changed, and your canvas always matches your history. The one tradeoff: a reopened document starts with an empty undo history.',
    },
    {
      lead: 'Branch-aware.',
      body: "Switch branches right from the panel. If unsaved work is in the way, you're offered Set aside & switch instead of having to leave Krita to sort it out first.",
    },
    {
      lead: 'Palette files ride along.',
      body: "Color palettes (.gpl, .kpl, .aco, .ase) sitting next to your art get tracked too, right alongside the .kra file. Untick them if you'd rather leave them out of a version.",
    },
    {
      lead: "What it deliberately doesn't do.",
      body: 'Creating a project, browsing full history, undoing a version, and merging or deleting branches all stay in the main Krita VCS app. The panel is for painting and quick version-control actions without alt-tabbing away.',
    },
  ],
  installTitle: 'Installing it',
  installNote:
    'Needs Krita with Python scripting enabled, on by default in official builds. You can confirm under Settings → Configure Krita → Python Plugin Manager, which should already list a few built-in plugins.',
  installSteps: [
    {
      title: 'Download and unzip.',
      body: "Download the plugin zip below and unzip it. Inside you'll find a pykrita folder and the kvc tool it talks to, already built, nothing to compile.",
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
  troubleshootingTitle: 'Troubleshooting',
  troubleshooting: [
    {
      lead: '"Version Control" isn\'t in the Dockers menu.',
      body: "The plugin didn't load. Recheck the steps above, and confirm both kritavc.desktop and the kritavc folder landed directly inside pykrita, not one level up or down.",
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
  uninstallTitle: 'Uninstalling',
  uninstall:
    'In Krita, turn off "Krita VC" in the Python Plugin Manager, then delete kritavc.desktop and the kritavc folder from the resource folder. Nothing about your projects or their history lives in the plugin folder, so removing it doesn\'t touch your work.',
  sourceLink: {
    label: 'Building it from source instead? See the technical guide on GitHub',
    href: links.pluginGuide,
  },
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
