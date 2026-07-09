import type { Metadata } from 'next';
import Steps from '../components/steps';
import { docsPage } from '@/lib/content';

export const metadata: Metadata = {
  title: docsPage.metaTitle,
  description: docsPage.metaDescription,
};

export default function DocsPage() {
  return (
    <div className="relative">
      {/* Intro — breaks from the landing page's two-column rhythm on purpose;
          this page is read once, not scrolled past. */}
      <section className="relative px-6 pb-16 pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance text-primary sm:text-5xl">
            {docsPage.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {docsPage.intro}
          </p>
          <a
            href={docsPage.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-5 text-sm font-medium text-primary transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            {docsPage.cta.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {docsPage.gettingStarted.title}
          </h2>
          <div className="mt-10">
            <Steps items={docsPage.gettingStarted.steps} />
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {docsPage.plugin.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {docsPage.plugin.intro}
          </p>
          <ul className="mt-6 space-y-3">
            {docsPage.plugin.notes.map((note) => (
              <li
                key={note}
                className="flex gap-3 text-base leading-relaxed text-muted"
              >
                <span
                  aria-hidden
                  className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent-cool"
                />
                {note}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-base leading-relaxed text-muted">
            {docsPage.plugin.closing}
          </p>
          <a
            href={docsPage.plugin.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-5 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {docsPage.plugin.cta.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
