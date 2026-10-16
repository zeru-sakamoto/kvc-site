import Hero from './components/hero';
import BrushStroke from './components/brush-stroke';
import HomeSections from './components/home-sections';
import JsonLd from './components/json-ld';
import { faq, site, download, siteUrl, pageMeta } from '@/lib/content';

// The product itself: free, GPL-3.0, downloadable. Still earns rich results, and
// feeds AI answer engines a clean description of what Krita VCS is.
const softwareLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: site.name,
  alternateName: [...site.alternateNames],
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Windows, macOS, Linux',
  description: site.metaDescription,
  url: siteUrl,
  downloadUrl: `${siteUrl}/download`,
  softwareVersion: download.version,
  license: 'https://www.gnu.org/licenses/gpl-3.0.html',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  author: { '@id': `${siteUrl}/#person` },
};

// Homepage's own canonical + og:url — set on the page segment, not the root
// layout, so neither is inherited by every other route (see app/layout.tsx).
export const metadata = pageMeta({
  path: '/',
  metaTitle: site.metaTitle,
  metaDescription: site.metaDescription,
  type: 'website',
  absoluteTitle: true,
});

// FAQ schema, mapped straight from the on-page accordion so the two never drift.
const faqLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function Home() {
  return (
    <div className="relative z-10">
      <JsonLd data={softwareLd} />
      <JsonLd data={faqLd} />
      {/* The stroke sits between the hero's canvas and its text, and under
          every section below: it starts at the 3D pen's nib. */}
      <Hero />
      <BrushStroke />

      <HomeSections />
    </div>
  );
}
