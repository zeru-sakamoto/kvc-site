import type { ReactNode } from 'react';

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  reverse?: boolean;
  media: ReactNode;
  children: ReactNode;
};

// The single reusable body template. `reverse` toggles the column order so the
// page alternates left/right down the scroll — one template, no duplicated markup.
// `eyebrow` is optional and used sparingly: the page leans on strong headings
// rather than a mono-caps kicker over every section.
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
          <h2 className="mb-6 font-display text-3xl font-bold leading-tight tracking-tight text-balance text-primary wrap-anywhere sm:text-4xl lg:text-[2.75rem]">
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
