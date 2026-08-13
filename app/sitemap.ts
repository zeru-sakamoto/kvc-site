import type { MetadataRoute } from 'next';
import {
  siteUrl,
  docsChapters,
  discoveryPages,
  privacyPage,
  downloadPage,
} from '@/lib/content';

// Built from the same content exports the pages render from, so adding a docs
// chapter, sub-chapter, or discovery page updates the sitemap automatically.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const abs = (path: string) => `${siteUrl}${path}`;

  const home = {
    url: siteUrl,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 1,
  };

  const discovery = discoveryPages.map((p) => ({
    url: abs(`/${p.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const docsIndex = {
    url: abs('/docs'),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  };

  // Each chapter's own page, plus one entry per sub-chapter (Using each
  // feature, Krita plugin) where present.
  const docsPages = docsChapters.flatMap((chapter) => {
    const chapterPage = {
      url: abs(chapter.path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    };
    if (!('subchapters' in chapter)) return [chapterPage];
    const subPages = chapter.subchapters.map((sub) => ({
      url: abs(sub.path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));
    return [chapterPage, ...subPages];
  });

  const download = {
    url: abs(`/${downloadPage.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  };

  const privacy = {
    url: abs(`/${privacyPage.slug}`),
    lastModified: now,
    changeFrequency: 'yearly' as const,
    priority: 0.3,
  };

  return [home, ...discovery, docsIndex, ...docsPages, download, privacy];
}
