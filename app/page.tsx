import Hero from './components/hero';
import Section from './components/section';
import BrushStroke from './components/brush-stroke';
import Faq from './components/faq';
import { DiffMedia, BranchMedia, OwnershipMedia } from './components/media';
import { why, features, whatsNext } from '@/lib/content';

const featureMedia = {
  compare: <DiffMedia />,
  history: <BranchMedia />,
  yours: <OwnershipMedia />,
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
              {why.points.map((p) => (
                <li key={p.title} className="min-w-0">
                  <p className="font-display text-lg font-semibold text-primary">
                    {p.title}
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-muted">
                    {p.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Three alternating feature blocks, connected by the brush stroke. */}
        {features.map((f) => (
          <Section
            key={f.id}
            id={f.id}
            title={f.title}
            reverse={f.reverse}
            media={featureMedia[f.id as keyof typeof featureMedia]}
          >
            {f.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
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
            </a>
          </div>
        </section>

        <Faq />
      </div>
    </div>
  );
}
