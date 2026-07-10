import type { Metadata } from 'next';
import BulletList from '../../components/bullet-list';
import { docsPlugin } from '@/lib/content';

export const metadata: Metadata = {
  title: docsPlugin.metaTitle,
  description: docsPlugin.metaDescription,
};

export default function PluginPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {docsPlugin.title}
      </h2>
      <p className="mt-5 text-base leading-relaxed text-muted">
        {docsPlugin.intro}
      </p>
      <div className="mt-6">
        <BulletList items={docsPlugin.notes.map((note) => ({ body: note }))} />
      </div>
      <p className="mt-6 text-base leading-relaxed text-muted">
        {docsPlugin.closing}
      </p>
      <a
        href={docsPlugin.cta.href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-5 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {docsPlugin.cta.label}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
