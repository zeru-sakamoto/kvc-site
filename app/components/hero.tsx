import { hero, download, platformDownloads, why } from '@/lib/content';
import { emphasize } from './highlight';
import DownloadButton from './download-button';
import HeroLoader from './hero-loader';
import HeroMeta from './hero-meta';
import HeroScene from './hero-scene';

// A big tablet top-left, the words bottom-right. The 3D scene covers the whole
// section behind the words (desk, grid, haze); its camera fits the tablet to
// the anchor box and pins it to the box's top-left corner. Words and gutters
// follow the header's (max-w-6xl less its px-6, i.e. 69rem), so the headline
// ends under GitHub and the tablet starts under the logo. The words may cover
// the tablet's outer bezel, and always stay on top.
const ANCHOR_ID = 'hero-scene-anchor';
export default function Hero() {
  return (
    <section
      id="top"
      // min-h-svh (not vh) so a mobile URL bar can't resize the hero mid-scroll.
      // pt clears the fixed h-16 header. select-none: clicks here tap the
      // tablet, and a stray drag shouldn't paint a selection over the scene.
      className="relative flex min-h-svh flex-col overflow-clip px-6 pb-8 pt-24 select-none"
    >
      <HeroLoader />

      {/* The screen's spill, translated to CSS for the page around the canvas:
          one soft pool on the tablet's side. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[35%] h-[40rem] w-[48rem] -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div
        data-hero-in
        aria-hidden
        className="hero-backdrop pointer-events-none absolute inset-0"
      >
        <HeroScene anchorId={ANCHOR_ID} />
      </div>

      {/* The tablet's box. The live canvas frames the tablet on it. Stacked
          (md up, and portrait lg) it leads, above the words, and takes what
          the viewport has left after the ~32rem of header, text and bottom
          row, so the hero stays one screen. Phones, phones on their side and
          short windows never get the scene (the hero-stage variant), so there
          it takes no space. Reduced motion does get it, held still. Side by
          side (hero-wide: landscape lg) the wrapper dissolves (display:
          contents) and the box positions against the section itself:
          top-left on the header's gutters, reaching down into the headline so
          the words may cover the outer bezel (never the screen). */}
      <div
        aria-hidden
        className="relative hidden h-[min(36rem,calc(100svh-32rem))] hero-stage:block hero-wide:contents"
      >
        <div
          id={ANCHOR_ID}
          className="absolute inset-0 hero-wide:inset-auto hero-wide:left-[max(1.5rem,calc((100%-69rem)/2))] hero-wide:top-20 hero-wide:h-[calc(100%-15rem)] hero-wide:w-[86%]"
        />
      </div>

      {/* One bottom row on the header's gutters: the words in the bottom-right
          corner, the scroll cue and the live GitHub badge bottom-left under
          the tablet. Stacked, the words sit above them. */}
      <div className="relative z-10 mx-auto mt-auto flex w-full max-w-[69rem] flex-col-reverse gap-6 pt-8 hero-wide:flex-row hero-wide:items-end hero-wide:justify-between hero-wide:gap-10">
        <div data-hero-in className="flex shrink-0 items-end gap-6">
          <a
            href={`#${why.id}`}
            aria-label={hero.scrollLabel}
            // The line is 1px wide; the padding gives it a real hit area.
            className="-m-3 rounded-full p-3 focus-visible:outline-2 focus-visible:outline-brand-blue"
          >
            <span className="relative block h-10 w-px overflow-hidden bg-muted/25">
              <span className="hero-scroll-tick absolute inset-x-0 top-0 h-3 bg-primary" />
            </span>
          </a>
          <HeroMeta />
        </div>

        <div
          data-hero-in
          className="@container min-w-0 text-right hero-wide:w-[58%]"
        >
          {/* One <h1>, two set lines. Each line is its own block so the pair
              breaks where the copy says, not where the column width does.
              From sm up the lines don't wrap, so the size is tied to the
              column's own width (cqw): "Version control" in Syne ExtraBold is
              ~11.3em wide, and 8.6cqw keeps it inside the column at any
              viewport. */}
          <h1 className="font-display text-[clamp(1.75rem,8.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-primary wrap-anywhere sm:text-[min(8.6cqw,3.5rem)] hero-wide:text-[min(8.6cqw,5.5rem)]">
            {hero.headlineLines.map((line) => (
              <span key={line} className="block sm:whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>

          <p className="ml-auto mt-6 max-w-[34rem] hero-wide:mt-5 text-lg leading-relaxed text-muted text-pretty">
            {emphasize(hero.sub, 'No cloud, no accounts', 'cool')}
          </p>

          <DownloadButton
            files={platformDownloads}
            redirectHref={download.redirectHref}
            label={hero.primaryCta.label}
            className="mt-9 inline-flex h-12 hero-wide:mt-7 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-7 text-sm font-semibold text-canvas-deep transition-[background-color,transform] hover:bg-accent-cool active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>
      </div>
    </section>
  );
}
