import type { Metadata } from 'next';
import Link from 'next/link';
import { downloadPage, platformDownloads } from '@/lib/content';
import {
  WindowsGlyph,
  MacGlyph,
  LinuxGlyph,
} from '../components/platform-icons';
import FileDownloadLink from '../components/file-download-link';

export const metadata: Metadata = {
  title: downloadPage.metaTitle,
  description: downloadPage.metaDescription,
  alternates: { canonical: `/${downloadPage.slug}` },
  openGraph: {
    type: 'website',
    url: `/${downloadPage.slug}`,
    title: downloadPage.metaTitle,
    description: downloadPage.metaDescription,
  },
  twitter: {
    title: downloadPage.metaTitle,
    description: downloadPage.metaDescription,
  },
};

const primaryBtn =
  'inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-full bg-brand-blue px-5 text-sm font-semibold text-canvas-deep transition-colors hover:bg-accent-cool focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

const glyphs = { windows: WindowsGlyph, macos: MacGlyph, linux: LinuxGlyph };

export default function DownloadPage() {
  return (
    <div className="relative">
      {/* Intro — same read-once framing as /plugin and /privacy. */}
      <section className="relative px-6 pb-8 pt-28 sm:pt-32">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance text-primary sm:text-5xl">
            {downloadPage.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {downloadPage.intro}
          </p>
          <p className="mt-3 text-sm text-muted">{downloadPage.versionNote}</p>
        </div>
      </section>

      <section className="relative border-t border-white/10 px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 sm:grid-cols-3">
            {Object.entries(platformDownloads).map(([key, platform]) => {
              const Glyph = glyphs[key as keyof typeof glyphs];
              return (
                <div
                  key={key}
                  className="flex flex-col rounded-2xl border border-white/10 p-6"
                >
                  <div className="flex items-center gap-2 text-primary">
                    <Glyph className="h-6 w-6 flex-none" />
                    <span className="font-display text-lg font-semibold">
                      {platform.name}
                    </span>
                  </div>

                  <FileDownloadLink
                    fileHref={platform.primary.fileHref}
                    fileName={platform.primary.fileName}
                    className={`mt-6 ${primaryBtn}`}
                  >
                    Download the {platform.primary.label}
                  </FileDownloadLink>

                  {platform.alternates.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {platform.alternates.map((alt) => (
                        <li key={alt.fileHref}>
                          <FileDownloadLink
                            fileHref={alt.fileHref}
                            fileName={alt.fileName}
                            className="text-sm text-muted underline underline-offset-2 transition-colors hover:text-primary"
                          >
                            {alt.label}
                          </FileDownloadLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-14 max-w-2xl text-sm leading-relaxed text-muted">
            {downloadPage.closing.map((part, i) => (
              <span key={part.link.href}>
                {i > 0 ? ' ' : ''}
                {part.text}
                {part.link.href.startsWith('/') ? (
                  <Link
                    href={part.link.href}
                    className="text-primary underline underline-offset-2 hover:text-brand-blue"
                  >
                    {part.link.label}
                  </Link>
                ) : (
                  <a
                    href={part.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:text-brand-blue"
                  >
                    {part.link.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {'.'}
              </span>
            ))}
          </p>
        </div>
      </section>
    </div>
  );
}
