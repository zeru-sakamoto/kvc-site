// Generic, non-trademarked OS glyphs (concept-based, not literal logo
// reproductions), thin-stroke to match media.tsx's line-art language.
// Kept apart from platform-icons.tsx so download-button.tsx (a client
// component) can use them without dragging all of lib/content.ts into the
// client bundle along with platform-icons' `platforms` import.

export function WindowsGlyph({
  className = 'h-4 w-4 flex-none',
}: {
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className}>
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
        />
      ))}
    </svg>
  );
}

export function MacGlyph({
  className = 'h-4 w-4 flex-none',
}: {
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className}>
      <rect
        x={1.5}
        y={2}
        width={13}
        height={9}
        rx={1.4}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      />
      <line
        x1={5.5}
        y1={14}
        x2={10.5}
        y2={14}
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <line
        x1={8}
        y1={11}
        x2={8}
        y2={14}
        stroke="currentColor"
        strokeWidth={1.4}
      />
    </svg>
  );
}

export function LinuxGlyph({
  className = 'h-4 w-4 flex-none',
}: {
  className?: string;
}) {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className={className}>
      <rect
        x={1.5}
        y={2.5}
        width={13}
        height={11}
        rx={1.4}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
      />
      <path
        d="M4.5 6.5 L6.5 8 L4.5 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
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
        strokeLinecap="round"
      />
    </svg>
  );
}
