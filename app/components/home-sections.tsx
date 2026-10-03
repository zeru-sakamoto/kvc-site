import Link from 'next/link';
import Section, { SectionGlow } from './section';
import Faq from './faq';
import {
  DiffMedia,
  BranchMedia,
  OwnershipMedia,
  SignatureMedia,
  PerformanceMedia,
  PanelMedia,
} from './media';
import { emphasize } from './highlight';
import WhyGlyph from './why-glyphs';
import { why, features, whatsNext, faq, themes } from '@/lib/content';

const featureMedia = {
  compare: <DiffMedia />,
  history: <BranchMedia />,
  yours: <OwnershipMedia />,
  settings: <SignatureMedia themes={themes} />,
  performance: <PerformanceMedia />,
  panel: <PanelMedia />,
} as const;

// Accent color of each Why glyph. Aligned by index to `why.points`; kept here
// (not in lib/content.ts) since it's a presentation choice, not copy.
const whyTone = [
  'text-accent-cool',
  'text-brand-blue',
  'text-brand-blue',
  'text-accent-warm',
  'text-brand-blue',
] as const;

// The one most intriguing detail per paragraph, pulled out in accent color.
// Aligned by [featureId][paragraphIndex].
const featureEmphasis = {
  compare: [{ phrase: 'a dashed outline', tone: 'blue' }],
  history: [{ phrase: 'a full version you can return to', tone: 'cool' }],
  yours: [{ phrase: 'Nothing syncs, nothing uploads', tone: 'cool' }],
  settings: [{ phrase: 'eight color themes', tone: 'blue' }],
  performance: [{ phrase: 'what a full copy would have cost', tone: 'cool' }],
  panel: [{ phrase: 'right beside your canvas', tone: 'warm' }],
} as const;

// Everything on the homepage below the hero: Why, the alternating feature
// blocks, What's next and the FAQ.
export default function HomeSections() {
  return (
    <div className="relative z-10">
      {/* Why — full-width value props, no media column. Breaks the two-column
          rhythm before the alternating feature blocks begin. */}
      <section id={why.id} className="relative scroll-mt-24 py-24 sm:py-32">
        <SectionGlow side="left" tone="cool" />
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-balance text-primary sm:text-4xl lg:text-[2.75rem]">
              {why.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {why.intro}
            </p>
          </div>

          <ul className="mt-14 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {why.points.map((p, i) => (
              <li key={p.title} className="flex min-w-0 items-center gap-4">
                <span className={whyTone[i]}>
                  <WhyGlyph index={i} />
                </span>
                <p className="min-w-0 font-display text-lg font-semibold text-balance text-primary sm:text-xl">
                  {p.title}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Four alternating feature blocks, connected by the brush stroke. */}
      {features.map((f) => (
        <Section
          key={f.id}
          id={f.id}
          title={f.title}
          reverse={f.reverse}
          media={featureMedia[f.id as keyof typeof featureMedia]}
        >
          {f.body.map((p, i) => {
            const em = featureEmphasis[f.id as keyof typeof featureEmphasis][i];
            return <p key={i}>{em ? emphasize(p, em.phrase, em.tone) : p}</p>;
          })}
          {'cta' in f ? (
            <Link
              href={f.cta.href}
              className="mt-2 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-5 text-sm font-medium text-primary transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
            >
              {f.cta.label}
            </Link>
          ) : null}
        </Section>
      ))}

      {/* What's next — narrow roadmap, no media. */}
      <section
        id={whatsNext.id}
        className="relative scroll-mt-24 py-24 sm:py-32"
      >
        <SectionGlow side="right" tone="warm" />
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="font-display text-3xl font-bold tracking-tight text-balance text-primary sm:text-4xl">
            {whatsNext.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {whatsNext.intro}
          </p>

          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {whatsNext.items.map((item) => (
              <div key={item.title} className="min-w-0">
                <p className="font-display text-lg font-semibold text-primary">
                  {item.title}
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          <a
            href={whatsNext.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full border border-white/15 px-5 text-sm font-medium text-primary transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            {whatsNext.cta.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </section>

      <Faq items={faq} />
    </div>
  );
}
