import type { Metadata } from 'next';
import Link from 'next/link';

// Next's default 404 is bare text with no way onward. This keeps the site voice
// and hands the reader (and any crawler that landed here) the three routes that
// actually matter. Noindex: a 404 should never enter the index.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const links = [
  { href: '/', label: 'Back to the start' },
  { href: '/docs/getting-started', label: 'Getting started' },
  { href: '/download', label: 'Download' },
];

export default function NotFound() {
  return (
    <section className="relative px-6 pb-24 pt-28 sm:pt-32">
      <div className="mx-auto max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cool">
          404
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight tracking-tight text-balance text-primary sm:text-5xl">
          This page went missing.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted">
          Nothing you saved is affected. The link is either old or slightly
          mistyped. Here is the way back.
        </p>

        <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-5 text-sm font-medium text-primary transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
