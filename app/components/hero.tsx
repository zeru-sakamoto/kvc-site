import { hero, download, platformDownloads, why } from '@/lib/content';
import { emphasize } from './highlight';
import DownloadButton from './download-button';
import HeroLoader from './hero-loader';
import HeroMeta from './hero-meta';
import HeroScene from './hero-scene';

// Words at the top-left, a big tablet (~3/4 of the hero's width at lg) right
// and low. The 3D scene covers the whole section behind the words (desk, grid,
// haze); its camera centres the tablet on the anchor box. The tablet's raised
// left end may sit behind the text, which always stays on top.
const ANCHOR_ID = 'hero-scene-anchor';
export default function Hero() {
  return (
    <section
      id="top"
      // min-h-svh (not vh) so a mobile URL bar can't resize the hero mid-scroll.
      // pt clears the fixed h-16 header.
      className="relative flex min-h-svh flex-col overflow-clip px-6 pb-8 pt-24"
    >
      <HeroLoader />

      {/* The screen's spill, translated to CSS for the page around the canvas:
          one soft pool behind the scene column. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-10%] top-1/2 h-[40rem] w-[48rem] -translate-y-1/2 rounded-full bg-brand-blue/10 blur-3xl" />
      </div>

      <div
        data-hero-in
        aria-hidden
        className="hero-backdrop pointer-events-none absolute inset-0"
      >
        <HeroScene anchorId={ANCHOR_ID} />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 content-center items-center gap-y-8 lg:static lg:content-start">
        <div
          data-hero-in
          className="@container relative z-10 min-w-0 lg:w-[66%]"
        >
          {/* One <h1>, two set lines. Each line is its own block so the pair
              breaks where the copy says, not where the column width does.
              From sm up the lines don't wrap, so the size is tied to the
              column's own width (cqw): "Version control" in Syne ExtraBold is
              ~11.3em wide, and 8.6cqw keeps it inside the column at any
              viewport. */}
          <h1 className="font-display text-[clamp(1.75rem,8.2vw,3.5rem)] font-extrabold leading-[1.02] tracking-tight text-primary wrap-anywhere sm:text-[min(8.6cqw,3.5rem)] lg:text-[min(8.6cqw,5.5rem)]">
            {hero.headlineLines.map((line) => (
              <span key={line} className="block sm:whitespace-nowrap">
                {line}
              </span>
            ))}
          </h1>

          <p className="mt-6 max-w-[34rem] lg:mt-5 text-lg leading-relaxed text-muted text-pretty">
            {emphasize(hero.sub, 'No cloud, no accounts', 'cool')}
          </p>

          <DownloadButton
            files={platformDownloads}
            redirectHref={download.redirectHref}
            label={hero.primaryCta.label}
            className="mt-9 inline-flex h-12 lg:mt-7 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-7 text-sm font-semibold text-canvas-deep transition-[background-color,transform] hover:bg-accent-cool active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          />
        </div>

        {/* The tablet's box. The live canvas frames the tablet on it. Stacked
            (md to lg) it leads, above the headline, and its height is capped
            by the viewport's so the button still lands above the fold. Phones
            and reduced motion never get the scene, so there it takes no
            space. At lg the wrapper
            dissolves (display: contents) and, with the grid static, the box
            positions against the section itself. Its right edge is the page
            gutter (the same max() that places the text's left edge), and the
            camera right-aligns the tablet's outline to it. 95% of the hero's width,
            anchored right. That frames a tablet about 3/4 of the
            hero wide, with the text above its raised left end. */}
        <div
          aria-hidden
          className="relative order-first hidden h-[min(26rem,40svh)] md:block motion-reduce:hidden lg:contents"
        >
          <div
            id={ANCHOR_ID}
            className="absolute inset-0 lg:inset-auto lg:right-[max(1.5rem,calc((100%-80rem)/2))] lg:top-[54%] lg:h-[120%] lg:w-[95%] lg:-translate-y-1/2"
          />
        </div>
      </div>

      {/* Bottom bar, in flow so it can't collide with the CTA on short
          screens: a scroll cue on the left, the live GitHub badge on the
          right, both on the same gutters as the text. */}
      <div
        data-hero-in
        className="relative z-10 mx-auto mt-6 flex w-full max-w-7xl items-end justify-between gap-6 lg:mt-10"
      >
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
    </section>
  );
}
