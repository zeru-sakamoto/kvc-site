import type { Metadata } from 'next';
import BulletList from '../../components/bullet-list';
import { emphasize } from '../../components/highlight';
import { whatIsVersionControl } from '@/lib/content';

export const metadata: Metadata = {
  title: whatIsVersionControl.metaTitle,
  description: whatIsVersionControl.metaDescription,
};

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
