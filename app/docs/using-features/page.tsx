import type { Metadata } from 'next';
import BulletList from '../../components/bullet-list';
import { docsUsingFeatures } from '@/lib/content';

export const metadata: Metadata = {
  title: docsUsingFeatures.metaTitle,
  description: docsUsingFeatures.metaDescription,
};

export default function UsingFeaturesPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {docsUsingFeatures.title}
      </h2>
      <div className="mt-8">
        <BulletList items={docsUsingFeatures.items} />
      </div>
    </div>
  );
}
