import type { Metadata } from 'next';
import { Geist, Geist_Mono, Syne } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/content';
import SiteHeader from './components/site-header';
import SiteFooter from './components/site-footer';
import CursorBrush from './components/cursor-brush';
import ScrollToTop from './components/scroll-to-top';

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
  title: site.metaTitle,
  description: site.metaDescription,
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
