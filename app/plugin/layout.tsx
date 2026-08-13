import type { Metadata } from 'next';
import DocsShell from '../components/docs-shell';
import JsonLd from '../components/json-ld';
import PluginDownloadButton from '../components/plugin-download-button';
import { pluginPage, siteUrl } from '@/lib/content';

// Shared hero (h1 + intro + download button) and chapter-nav shell for
// /plugin and every /plugin/[slug] sub-chapter, mirroring app/docs/layout.tsx
// so the plugin reads as a chapter in the same docs sidebar while keeping its
// own URL and its own download CTA above the fold.
export const metadata: Metadata = {
  title: {
    default: pluginPage.metaTitle,
    template: '%s · Krita VC plugin · Krita VCS',
  },
  description: pluginPage.metaDescription,
};

const breadcrumbLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    {
      '@type': 'ListItem',
      position: 2,
      name: pluginPage.metaTitle,
      item: `${siteUrl}/${pluginPage.slug}`,
    },
  ],
};

const primaryBtn =
  'inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-6 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export default function PluginLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative">
      <JsonLd data={breadcrumbLd} />

      <section className="relative px-6 pb-8 pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance text-primary sm:text-5xl">
            {pluginPage.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {pluginPage.intro}
          </p>
          <PluginDownloadButton className={`mt-8 ${primaryBtn}`} />
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <DocsShell>{children}</DocsShell>
      </section>
    </div>
  );
}
