import type { MetadataRoute } from 'next';
import {
  siteUrl,
  docsChapters,
  discoveryPages,
  pluginPage,
} from '@/lib/content';

// Built from the same content exports the pages render from, so adding a docs
// chapter or discovery page updates the sitemap automatically.
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

  const docsPages = docsChapters.map((c) => ({
    url: abs(`/docs/${c.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const plugin = {
    url: abs(`/${pluginPage.slug}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  };

  return [home, ...discovery, docsIndex, ...docsPages, plugin];
}
