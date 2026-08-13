import Link from 'next/link';
import type { FeatureDetail } from '@/lib/content';
import Steps from './steps';
import BulletList from './bullet-list';
import Callout from './callout';
import { emphasize } from './highlight';

// Shared body for every "Using each feature" and "Krita plugin" sub-chapter
// page: a highlighted intro, an optional how-to (steps or a bullet list), an
// optional single callout, and an optional closing note/link (installing's
// uninstall blurb + source-guide link). The lg:hidden back link stands in
// for the nested sidebar list, which only renders on lg+.
export default function FeaturePage({
  feature,
  backHref,
  backLabel,
}: {
  feature: FeatureDetail;
  backHref: string;
  backLabel: string;
}) {
  return (
    <div>
      <Link
        href={backHref}
        className="mb-6 inline-block text-sm text-muted underline underline-offset-2 hover:text-primary lg:hidden"
      >
        ← {backLabel}
      </Link>

      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {feature.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-muted">
        {feature.highlight
          ? emphasize(
              feature.intro,
              feature.highlight.phrase,
              feature.highlight.tone,
            )
          : feature.intro}
      </p>

      {feature.steps ? (
        <div className="mt-8">
          <Steps items={feature.steps} />
        </div>
      ) : null}

      {feature.items ? (
        <div className="mt-8">
          <BulletList items={feature.items} />
        </div>
      ) : null}

      {feature.note ? (
        <div className="mt-8">
          <Callout tone={feature.note.tone}>{feature.note.body}</Callout>
        </div>
      ) : null}

      {feature.closing ? (
        <p className="mt-10 text-base leading-relaxed text-muted">
          {feature.closing}
        </p>
      ) : null}

      {feature.closingLink ? (
        <a
          href={feature.closingLink.href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm text-muted underline underline-offset-2 hover:text-primary"
        >
          {feature.closingLink.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </div>
  );
}
