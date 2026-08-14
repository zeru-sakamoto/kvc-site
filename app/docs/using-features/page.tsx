import ChapterLinks from '../../components/chapter-links';
import { docsUsingFeatures, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/docs/${docsUsingFeatures.slug}`,
  metaTitle: docsUsingFeatures.metaTitle,
  metaDescription: docsUsingFeatures.metaDescription,
});

export default function UsingFeaturesPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {docsUsingFeatures.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {docsUsingFeatures.intro}
      </p>
      <div className="mt-8">
        <ChapterLinks
          basePath="/docs/using-features"
          items={docsUsingFeatures.items}
        />
      </div>
    </div>
  );
}
