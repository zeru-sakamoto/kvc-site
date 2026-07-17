import type { Metadata } from 'next';
import BulletList from '../components/bullet-list';
import Steps from '../components/steps';
import JsonLd from '../components/json-ld';
import PluginDownloadButton from '../components/plugin-download-button';
import { pluginPage, siteUrl } from '@/lib/content';

export const metadata: Metadata = {
  title: pluginPage.metaTitle,
  description: pluginPage.metaDescription,
  alternates: { canonical: `/${pluginPage.slug}` },
  openGraph: {
    type: 'article',
    url: `/${pluginPage.slug}`,
    title: pluginPage.metaTitle,
    description: pluginPage.metaDescription,
  },
  twitter: {
    title: pluginPage.metaTitle,
    description: pluginPage.metaDescription,
  },
};

const primaryBtn =
  'inline-flex h-12 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-6 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export default function PluginPage() {
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

  return (
    <div className="relative">
      <JsonLd data={breadcrumbLd} />

      {/* Intro — same read-once framing as /docs, plus its own download. */}
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
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {pluginPage.featuresTitle}
          </h2>
          <div className="mt-8">
            <BulletList items={pluginPage.features} />
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {pluginPage.installTitle}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted">
            {pluginPage.installNote}
          </p>
          <div className="mt-10">
            <Steps items={pluginPage.installSteps} />
          </div>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            {pluginPage.troubleshootingTitle}
          </h2>
          <div className="mt-8">
            <BulletList items={pluginPage.troubleshooting} />
          </div>

          <h3 className="mt-14 font-display text-lg font-semibold text-primary">
            {pluginPage.uninstallTitle}
          </h3>
          <p className="mt-3 text-base leading-relaxed text-muted">
            {pluginPage.uninstall}
          </p>

          <a
            href={pluginPage.sourceLink.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block text-sm text-muted underline underline-offset-2 hover:text-primary"
          >
            {pluginPage.sourceLink.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>
    </div>
  );
}
