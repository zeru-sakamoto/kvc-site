import Hero from './components/hero';
import Section from './components/section';
import BrushStroke from './components/brush-stroke';
import Faq from './components/faq';
import {
  DiffMedia,
  BranchMedia,
  OwnershipMedia,
  SignatureMedia,
  PerformanceMedia,
} from './components/media';
import { emphasize } from './components/highlight';
import { why, features, whatsNext } from '@/lib/content';

const featureMedia = {
  compare: <DiffMedia />,
  history: <BranchMedia />,
  yours: <OwnershipMedia />,
  settings: <SignatureMedia />,
  performance: <PerformanceMedia />,
} as const;

// The one most intriguing detail per paragraph, pulled out in accent color.
// Aligned by index to `why.points`; kept here (not in lib/content.ts) since
// it's a presentation choice, not copy.
const whyEmphasis = [
  { phrase: 'No account, no sync, no server', tone: 'cool' },
  { phrase: 'only stores what actually changed', tone: 'blue' },
  { phrase: 'side by side or on a swipe slider', tone: 'blue' },
  { phrase: 'switch back to your original whenever you like', tone: 'warm' },
  { phrase: 'stay fast on large, layer-heavy files', tone: 'blue' },
] as const;

// Same idea, aligned by [featureId][paragraphIndex].
const featureEmphasis = {
  compare: [
    { phrase: 'a dashed outline', tone: 'blue' },
    { phrase: 'as easy to review as a repaint', tone: 'warm' },
  ],
  history: [
    {
      phrase: 'Overlapping edits are flagged, never quietly overwritten',
      tone: 'cool',
    },
    {
      phrase: 'old versions stay recoverable until you decide otherwise',
      tone: 'cool',
    },
  ],
  yours: [
    { phrase: 'turns off the technical talk entirely', tone: 'warm' },
    { phrase: 'Nothing syncs, nothing uploads', tone: 'cool' },
  ],
  settings: [
    { phrase: "it's obvious who did what", tone: 'warm' },
    { phrase: 'Krita VCS shrinks it down', tone: 'cool' },
    { phrase: 'applies right away, no restart', tone: 'blue' },
  ],
  performance: [
    {
      phrase: 'around 50% smaller than a full copy by your second save',
      tone: 'cool',
    },
  ],
} as const;

export default function Home() {
  return (
    <div className="relative">
      <BrushStroke />

      <div className="relative z-10">
        <Hero />

        {/* Why — full-width value props, no media column. Breaks the two-column
            rhythm before the alternating feature blocks begin. */}
        <section id={why.id} className="relative scroll-mt-24 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-balance text-primary sm:text-4xl lg:text-[2.75rem]">
                {why.title}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-muted">
                {why.intro}
              </p>
            </div>

            <ul className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {why.points.map((p, i) => (
                <li key={p.title} className="min-w-0">
                  <p className="font-display text-lg font-semibold text-primary">
                    {p.title}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-muted">
                    {emphasize(
                      p.body,
                      whyEmphasis[i].phrase,
                      whyEmphasis[i].tone,
                    )}
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
              const em =
                featureEmphasis[f.id as keyof typeof featureEmphasis][i];
              return <p key={i}>{em ? emphasize(p, em.phrase, em.tone) : p}</p>;
            })}
          </Section>
        ))}

        {/* What's next — narrow roadmap, no media. */}
        <section
          id={whatsNext.id}
          className="relative scroll-mt-24 py-24 sm:py-32"
        >
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

        <Faq />
      </div>
    </div>
  );
}
