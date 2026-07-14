// OS-compatibility row shown under the hero download button. Generic,
// non-trademarked glyphs (concept-based, not literal logo reproductions),
// thin-stroke to match media.tsx's line-art language. Windows renders as
// available; macOS/Linux render muted with a "Soon" tag — honest about what's
// actually downloadable today, consistent with the FAQ's platform answer.
import { platforms } from '@/lib/content';

function WindowsGlyph({ opacity }: { opacity: number }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 flex-none">
      {[
        [1.5, 1.5],
        [8.5, 1.5],
        [1.5, 8.5],
        [8.5, 8.5],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={6}
          height={6}
          rx={1.2}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeOpacity={opacity}
        />
      ))}
    </svg>
  );
}

function MacGlyph({ opacity }: { opacity: number }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 flex-none">
      <rect
        x={1.5}
        y={2}
        width={13}
        height={9}
        rx={1.4}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeOpacity={opacity}
      />
      <line
        x1={5.5}
        y1={14}
        x2={10.5}
        y2={14}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeOpacity={opacity}
        strokeLinecap="round"
      />
      <line
        x1={8}
        y1={11}
        x2={8}
        y2={14}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeOpacity={opacity}
      />
    </svg>
  );
}

function LinuxGlyph({ opacity }: { opacity: number }) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 flex-none">
      <rect
        x={1.5}
        y={2.5}
        width={13}
        height={11}
        rx={1.4}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeOpacity={opacity}
      />
      <path
        d="M4.5 6.5 L6.5 8 L4.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeOpacity={opacity}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={7.5}
        y1={9.5}
        x2={11}
        y2={9.5}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeOpacity={opacity}
        strokeLinecap="round"
      />
    </svg>
  );
}

const glyphs = {
  Windows: WindowsGlyph,
  macOS: MacGlyph,
  Linux: LinuxGlyph,
} as const;

export default function PlatformIcons() {
  return (
    <div
      role="group"
      aria-label={platforms.note}
      className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
    >
      {platforms.items.map((p) => {
        const available = p.status === 'available';
        const Glyph = glyphs[p.name];
        return (
          <span
            key={p.name}
            className={`inline-flex items-center gap-1.5 text-xs ${
              available ? 'text-muted' : 'text-muted/50'
            }`}
            style={{
              color: available ? 'var(--color-accent-cool)' : undefined,
            }}
          >
            <Glyph opacity={available ? 1 : 0.45} />
            <span className={available ? 'text-muted' : 'text-muted/50'}>
              {p.name}
            </span>
            {!available && (
              <span className="text-[10px] tracking-wide text-muted/50">
                Soon
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
}
