import ChapterLinks from '../components/chapter-links';
import { pluginPage, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/${pluginPage.slug}`,
  metaTitle: pluginPage.metaTitle,
  metaDescription: pluginPage.metaDescription,
  // The layout's template would append "· Krita VC plugin" to its own title.
  absoluteTitle: true,
});

export default function PluginPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {pluginPage.featuresTitle}
      </h2>
      <div className="mt-8">
        <ChapterLinks
          basePath={`/${pluginPage.slug}`}
          items={pluginPage.items}
        />
      </div>

      <h3 className="mt-14 font-display text-lg font-semibold text-primary">
        {pluginPage.closingTitle}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-muted">
        {pluginPage.closing}
      </p>
    </div>
  );
}
