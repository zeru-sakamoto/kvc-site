import type { Metadata } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';
import { site, siteUrl, links } from '@/lib/content';
import SiteHeader from './components/site-header';
import SiteFooter from './components/site-footer';
import CursorBrush from './components/cursor-brush';
import ScrollToTop from './components/scroll-to-top';
import JsonLd from './components/json-ld';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  weight: ['600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.metaTitle,
    template: '%s · Krita VCS',
  },
  description: site.metaDescription,
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: 'Zeru Sakamoto', url: links.portfolio }],
  creator: 'Zeru Sakamoto',
  publisher: 'Zeru Sakamoto',
  // No canonical here: metadata is inherited root->page, so a canonical set on
  // the root layout would point every child page at '/'. The homepage sets its
  // own in app/page.tsx; other pages set theirs or self-canonicalize.
  openGraph: {
    type: 'website',
    // No `url` here for the same inheritance reason — a child without its own
    // openGraph would otherwise report og:url as the homepage. Per-page routes
    // set their own url.
    siteName: site.name,
    title: site.metaTitle,
    description: site.metaDescription,
    locale: 'en_US',
    // Image comes from app/opengraph-image.tsx (file convention).
  },
  twitter: {
    card: 'summary_large_image',
    title: site.metaTitle,
    description: site.metaDescription,
    // No X account yet — add `creator: '@handle'` when there is one. Cards still
    // render: X falls back to the og:image supplied by opengraph-image.tsx.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the Search Console token.
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  category: 'technology',
};

// Site-wide structured data: who publishes the site (a person) and the site
// itself. Product + FAQ schema live on the homepage; breadcrumbs live per page.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: site.name,
      description: site.metaDescription,
      inLanguage: 'en',
      publisher: { '@id': `${siteUrl}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Zeru Sakamoto',
      url: links.portfolio,
      sameAs: [links.profile, links.portfolio],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={structuredData} />

        {/* Canvas grain — DESIGN.md noise filter. Fixed, behind content, decorative. */}
        <svg
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
        >
          <filter id="canvas-grain-texture">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves={3}
              stitchTiles="stitch"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0"
            />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#canvas-grain-texture)"
          />
        </svg>

        <ScrollToTop />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CursorBrush />
      </body>
    </html>
  );
}
