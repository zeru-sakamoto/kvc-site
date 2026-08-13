import type { Metadata } from 'next';
import DocsShell from '../components/docs-shell';
import JsonLd from '../components/json-ld';
import { docs, siteUrl } from '@/lib/content';

export const metadata: Metadata = {
  title: {
    default: docs.title,
    template: '%s · Documentation · Krita VCS',
  },
  description: docs.intro,
};

// Home -> Documentation trail, shared by every docs page.
// ponytail: 2-level, defined once here. Add a per-chapter 3rd level in each
// chapter page if breadcrumb rich results for individual chapters matter.
const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Documentation',
      item: `${siteUrl}/docs`,
    },
  ],
};

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      <JsonLd data={breadcrumbLd} />

      {/* Intro — breaks from the landing page's two-column rhythm on purpose;
          this page is read once, not scrolled past. */}
      <section className="relative px-6 pb-12 pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance text-primary sm:text-5xl">
            {docs.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {docs.intro}
          </p>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <DocsShell>{children}</DocsShell>
      </section>
    </div>
  );
}
