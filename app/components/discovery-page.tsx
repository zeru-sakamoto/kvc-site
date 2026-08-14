import type { ReactNode } from 'react';
import Link from 'next/link';
import Section from './section';
import DownloadButton from './download-button';
import PlatformIcons from './platform-icons';
import JsonLd from './json-ld';
import {
  hero,
  siteUrl,
  discoveryPages,
  ogImage,
  download,
  platformDownloads,
} from '@/lib/content';

// Shared template for the discovery/landing pages (recover, vs-copies). Reuses
// the Section layout + existing honest media, so these read as part of the site,
// not a bolted-on SEO page. Copy lives in lib/content.ts.
type DiscoveryCopy = {
  slug: string;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  intro: string;
  sections: ReadonlyArray<{ title: string; body: readonly string[] }>;
};

const primaryBtn =
  'inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-6 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export default function DiscoveryPage({
  page,
  media,
}: {
  page: DiscoveryCopy;
  media: ReactNode[];
}) {
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      {
        '@type': 'ListItem',
        position: 2,
        name: page.metaTitle,
        item: `${siteUrl}/${page.slug}`,
      },
    ],
  };

  // Per-guide Article schema, so search and AI answer engines get a clean
  // summary of *this* page rather than only the site-wide SoftwareApplication.
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.metaTitle,
    description: page.metaDescription,
    url: `${siteUrl}/${page.slug}`,
    image: `${siteUrl}${ogImage.url}`,
    inLanguage: 'en',
    isAccessibleForFree: true,
    author: { '@id': `${siteUrl}/#person` },
    publisher: { '@id': `${siteUrl}/#person` },
  };

  const related = discoveryPages.filter((p) => p.slug !== page.slug);

  return (
    <div className="relative">
      <JsonLd data={breadcrumbLd} />
      <JsonLd data={articleLd} />

      {/* Intro */}
      <section className="relative px-6 pb-8 pt-28 sm:pt-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-balance text-primary wrap-anywhere sm:text-5xl lg:text-6xl">
            {page.headline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {page.intro}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <DownloadButton
              files={platformDownloads}
              redirectHref={download.redirectHref}
              label={hero.primaryCta.label}
              className={primaryBtn}
            />
            <Link
              href="/docs/getting-started"
              className="inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-6 text-sm font-medium text-primary transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              Read the guide
            </Link>
          </div>
          <PlatformIcons />
        </div>
      </section>

      {/* Body sections, alternating, reusing the site's honest media motifs. */}
      {page.sections.map((s, i) => (
        <Section
          key={s.title}
          id={`${page.slug}-${i}`}
          title={s.title}
          reverse={i % 2 === 1}
          media={media[i]}
        >
          {s.body.map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </Section>
      ))}

      {/* Related guides — the guides had no links between them, so each one was
          a dead end for a reader and an orphan in the internal link graph. */}
      <section className="relative px-6 pt-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cool">
            More guides
          </h2>
          <ul className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2">
            {related.map((r) => (
              <li key={r.slug} className="min-w-0">
                <Link
                  href={`/${r.slug}`}
                  className="text-base leading-relaxed text-muted underline decoration-white/20 underline-offset-4 transition-colors hover:text-primary hover:decoration-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                >
                  {r.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative px-6 pb-24 pt-12 sm:pb-32">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-white/10 bg-canvas-deep/60 px-8 py-10 text-center">
            <p className="font-display text-2xl font-bold tracking-tight text-balance text-primary sm:text-3xl">
              Try it on your next painting.
            </p>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Free, open source, and entirely on your own machine.
            </p>
            <div className="mt-7 flex justify-center">
              <DownloadButton
                files={platformDownloads}
                redirectHref={download.redirectHref}
                label={hero.primaryCta.label}
                className={primaryBtn}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
