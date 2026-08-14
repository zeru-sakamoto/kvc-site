import BulletList from '../../components/bullet-list';
import { emphasize } from '../../components/highlight';
import { whatIsVersionControl, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/docs/${whatIsVersionControl.slug}`,
  metaTitle: whatIsVersionControl.metaTitle,
  metaDescription: whatIsVersionControl.metaDescription,
});

export default function WhatIsVersionControlPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {whatIsVersionControl.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {emphasize(
          whatIsVersionControl.intro,
          whatIsVersionControl.highlight.phrase,
          whatIsVersionControl.highlight.tone,
        )}
      </p>
      <div className="mt-8">
        <BulletList items={whatIsVersionControl.terms} />
      </div>
    </div>
  );
}
