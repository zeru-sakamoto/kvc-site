import type { Metadata } from 'next';
import JsonLd from '../components/json-ld';
import { privacyPage, siteUrl } from '@/lib/content';

export const metadata: Metadata = {
  title: privacyPage.metaTitle,
  description: privacyPage.metaDescription,
  alternates: { canonical: `/${privacyPage.slug}` },
  openGraph: {
    type: 'article',
    url: `/${privacyPage.slug}`,
    title: privacyPage.metaTitle,
    description: privacyPage.metaDescription,
  },
  twitter: {
    title: privacyPage.metaTitle,
    description: privacyPage.metaDescription,
  },
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    {
      '@type': 'ListItem',
      position: 2,
      name: privacyPage.title,
      item: `${siteUrl}/${privacyPage.slug}`,
    },
  ],
};

export default function PrivacyPage() {
  return (
    <div className="relative">
      <JsonLd data={breadcrumbLd} />

      {/* Read-once legal doc, same intro framing as /docs and /plugin. */}
      <section className="relative px-6 pb-8 pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance text-primary sm:text-5xl">
            {privacyPage.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {privacyPage.intro}
          </p>
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-cool">
            Last updated {privacyPage.updated}
          </p>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl space-y-12">
          {privacyPage.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-xl font-bold tracking-tight text-primary sm:text-2xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-base leading-relaxed text-muted"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              {'linkHref' in section && (
                <a
                  href={section.linkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-sm text-muted underline underline-offset-2 hover:text-primary"
                >
                  {section.linkLabel}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
