import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/content';

// Nothing to hide — a single-page marketing site plus docs. Allow everything,
// point crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
