import type { ReactNode } from 'react';

type Tone = 'blue' | 'cool' | 'warm';

const toneBg: Record<Tone, string> = {
  blue: 'bg-brand-blue/14',
  cool: 'bg-accent-cool/10',
  warm: 'bg-accent-warm/10',
};

/**
 * The hero's key light, translated to flat CSS. These sections stay 2D on
 * purpose — no canvas, no depth — so the continuity is carried by a single
 * soft radial fill sitting where the light would fall, not by parallax.
 */
export function SectionGlow({
  side = 'right',
  tone = 'blue',
}: {
  side?: 'left' | 'right';
  tone?: Tone;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <div
        className={`absolute top-1/2 h-[30rem] w-[36rem] -translate-y-1/2 rounded-full blur-3xl ${
          side === 'right' ? '-right-32' : '-left-32'
        } ${toneBg[tone]}`}
      />
    </div>
  );
}

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  reverse?: boolean;
  media: ReactNode;
  children: ReactNode;
};

export default function Section({
  id,
  eyebrow,
  title,
  reverse = false,
  media,
  children,
}: SectionProps) {
  return (
    <section id={id} className="relative scroll-mt-24 py-24 sm:py-32">
      {/* Follows the existing left/right alternation rather than introducing a
          second rhythm of its own. */}
      <SectionGlow side={reverse ? 'left' : 'right'} tone="blue" />

      <div
        className={`mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 lg:gap-20 ${
          reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        <div className="w-full min-w-0 lg:w-1/2">
          {eyebrow ? (
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-accent-cool">
              {eyebrow}
            </p>
          ) : null}
          {/* Half the hero's display size at lg, so the step down from the 3D
              headline reads as deliberate. */}
          <h2 className="mb-6 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-primary wrap-anywhere sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-muted sm:text-lg">
            {children}
          </div>
        </div>
        <div className="w-full min-w-0 lg:w-1/2">{media}</div>
      </div>
    </section>
  );
}
