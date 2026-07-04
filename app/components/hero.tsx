import { hero } from '@/lib/content';
import { LayersMedia } from './media';

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden px-6 pb-24 pt-28 sm:pt-32 lg:pb-32"
    >
      {/* Decorative paint marks — inline, no assets. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-24 top-24 h-72 w-72 rounded-full bg-brand-blue/20 blur-3xl sm:right-0" />
        <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-accent-warm/10 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 lg:flex-row lg:gap-20">
        <div className="w-full min-w-0 lg:w-[55%]">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-muted">
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent-cool"
            />
            {hero.badge}
          </span>

          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.03] tracking-tight text-balance text-primary wrap-anywhere sm:text-6xl lg:text-7xl">
            {hero.headline}
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
            {hero.sub}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={hero.primaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-6 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-6 text-sm font-medium text-primary transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>

        <div className="w-full min-w-0 lg:w-[45%]">
          <LayersMedia />
        </div>
      </div>
    </section>
  );
}
