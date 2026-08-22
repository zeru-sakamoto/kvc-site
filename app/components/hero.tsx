import { hero, download, platformDownloads } from '@/lib/content';
import { emphasize } from './highlight';
import DownloadButton from './download-button';
import HeroScene from './hero-scene';
import PlatformIcons from './platform-icons';

// Presentation-only split so the copy stays single-sourced in lib/content.ts,
// the same way the emphasis maps live in page.tsx rather than in the content
// module. Degrades to the whole line if the comma ever moves.
const comma = hero.headline.indexOf(',');
const headStart =
  comma === -1 ? hero.headline : hero.headline.slice(0, comma + 1);
const headEnd = comma === -1 ? '' : hero.headline.slice(comma + 1).trim();

// One sentence, one <h1>. At lg the two halves go to opposite corners with the
// floating window between them; below lg they are ordinary flowing text and the
// hero falls back to the stacked layout. Either way `h1.textContent` is the
// whole headline, so crawlers and screen readers read one uninterrupted line.
export default function Hero() {
  return (
    <section
      id="top"
      // min-h-svh (not vh) so a mobile URL bar can't resize the hero mid-scroll.
      // pt clears the fixed h-16 header.
      className="relative flex min-h-svh flex-col overflow-hidden px-6 pb-12 pt-24 sm:pt-28"
    >
      {/* Key light, translated to CSS. The 3D scene lights the window from the
          same side, so the page and the mesh agree on where the light is. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[34rem] w-[52rem] -translate-x-1/2 -translate-y-1/4 rounded-full bg-brand-blue/12 blur-3xl" />
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-accent-cool/10 blur-3xl" />
        <div className="absolute -right-20 bottom-8 h-80 w-80 rounded-full bg-accent-warm/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col">
        {/* The stage. At lg the headline is an overlay across it, the window
            floats at its centre, and the controls sit in the bottom-left with
            `mt-auto` — so the stage's height, not a hardcoded spacer, is what
            reserves the space. That keeps CLS at 0 when the canvas mounts. */}
        <div className="relative mt-8 flex flex-1 flex-col wide:mt-10">
          <h1
            // The overlay covers the controls too, so it must not swallow their
            // clicks; the halves opt back in. Same trick as the canvas layer.
            className="text-center font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-balance text-primary wrap-anywhere sm:text-7xl wide:pointer-events-none wide:absolute wide:inset-0 wide:z-0 wide:text-left wide:text-[clamp(2.25rem,min(5vw,8.5vh),4.5rem)]"
          >
            <span className="wide:pointer-events-auto wide:absolute wide:left-0 wide:top-0 wide:block wide:max-w-[12.5em]">
              {headStart}
            </span>{' '}
            <span className="wide:pointer-events-auto wide:absolute wide:bottom-0 wide:right-0 wide:block wide:max-w-[8em] wide:text-right">
              {headEnd}
            </span>
          </h1>

          <div
            aria-hidden
            className="pointer-events-none relative z-10 mt-8 h-[15rem] sm:h-[26rem] wide:absolute wide:inset-x-0 wide:top-1/2 wide:mt-0 wide:h-[84%] wide:-translate-y-1/2"
          >
            <HeroScene />
          </div>

          <div className="relative z-20 mt-10 flex flex-col items-center wide:mt-auto wide:max-w-sm wide:items-start">
            <p className="text-center text-lg leading-relaxed text-muted wide:text-left">
              {emphasize(hero.sub, 'No cloud, no accounts', 'cool')}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <DownloadButton
                files={platformDownloads}
                redirectHref={download.redirectHref}
                label={hero.primaryCta.label}
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-6 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              />
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-6 text-sm font-medium text-primary transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                {hero.secondaryCta.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>

            <div className="flex justify-center wide:justify-start">
              <PlatformIcons />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
