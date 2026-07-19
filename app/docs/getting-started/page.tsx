import type { Metadata } from 'next';
import Link from 'next/link';
import Steps from '../../components/steps';
import { docsGettingStarted } from '@/lib/content';

export const metadata: Metadata = {
  title: docsGettingStarted.metaTitle,
  description: docsGettingStarted.metaDescription,
  // The download button lands here with ?ref=download; canonicalize so the
  // query variant doesn't split ranking signals from the clean URL.
  alternates: { canonical: '/docs/getting-started' },
};

export default async function GettingStartedPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const fromDownload = params.ref === 'download';

  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {docsGettingStarted.title}
      </h2>

      {fromDownload ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-blue/30 bg-brand-blue/10 px-5 py-4">
          <span
            aria-hidden
            className="mt-1.5 h-2 w-2 flex-none rounded-full bg-accent-cool"
          />
          <p className="text-sm leading-relaxed text-primary">
            Your download will start automatically. If it doesn&apos;t, pick
            your platform on the{' '}
            <Link
              href="/download"
              className="font-semibold text-brand-blue underline underline-offset-2 hover:text-accent-cool"
            >
              download page
            </Link>
            .
          </p>
        </div>
      ) : null}

      <div className="mt-10">
        <Steps items={docsGettingStarted.steps} />
      </div>
    </div>
  );
}
