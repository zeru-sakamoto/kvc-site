type Tone = 'cool' | 'warm' | 'blue';

const toneClass: Record<Tone, string> = {
  cool: 'border-accent-cool/30 bg-accent-cool/10',
  warm: 'border-accent-warm/30 bg-accent-warm/10',
  blue: 'border-brand-blue/30 bg-brand-blue/10',
};

const dotClass: Record<Tone, string> = {
  cool: 'bg-accent-cool',
  warm: 'bg-accent-warm',
  blue: 'bg-brand-blue',
};

// A single boxed callout for the one most important safety/behavior fact on
// a docs page — at most one per page. Matches the existing download-banner
// pattern (docs/getting-started/page.tsx): a full rounded border + subtle
// tint + small dot, not a side-border tab. Body text stays text-primary (not
// tinted) so it keeps WCAG AA contrast; only the border, background, and dot
// carry the accent color.
export default function Callout({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl border px-5 py-4 ${toneClass[tone]}`}
    >
      <span
        aria-hidden
        className={`mt-1.5 h-2 w-2 flex-none rounded-full ${dotClass[tone]}`}
      />
      <p className="text-sm leading-relaxed text-primary">{children}</p>
    </div>
  );
}
