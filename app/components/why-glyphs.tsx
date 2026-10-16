// One authored line glyph per "Why" value prop, aligned by index to
// `why.points`. Thin-stroke to match media.tsx's line-art language, and
// painter-coded rather than dev-coded (no git graph, no terminal). Decorative:
// the heading beside each one carries the meaning.

const glyphs = [
  // Nothing leaves your computer: a screen with a lock on it.
  <>
    <rect x={2.5} y={2.5} width={19} height={14.5} rx={2} />
    <path d="M12 17v4M8.5 21h7" />
    <rect x={8.5} y={9} width={7} height={5} rx={1} />
    <path d="M10 9V7.5a2 2 0 0 1 4 0V9" />
  </>,
  // Reads the painting down to the tile: a grid with the one changed tile filled.
  <>
    {[3, 13].flatMap((y) =>
      [3, 13].map((x) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={8}
          height={8}
          rx={1.5}
          fill={x === 13 && y === 3 ? 'currentColor' : 'none'}
        />
      )),
    )}
  </>,
  // See what changed: a canvas split by a swipe handle, before on one side.
  <>
    <path
      d="M12 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7z"
      fill="currentColor"
      fillOpacity={0.25}
      stroke="none"
    />
    <rect x={3} y={5} width={18} height={14} rx={2} />
    <path d="M12 2.5v19" />
    <circle cx={12} cy={12} r={1.8} fill="currentColor" />
  </>,
  // Explore without fear: a stroke that wanders off and comes back.
  <>
    <path d="M2.5 17h19" />
    <path d="M5 17c4 0 2.5-12 7-12s3 12 7 12" />
    <path d="M18.5 14 21.5 17l-3 3" />
  </>,
  // Built for real paintings: a tall stack of layers.
  <>
    <path d="M12 3l9 5-9 5-9-5z" />
    <path d="M3 12l9 5 9-5" />
    <path d="M3 16l9 5 9-5" />
  </>,
];

export default function WhyGlyph({
  index,
  className = 'size-9 flex-none',
}: {
  index: number;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphs[index]}
    </svg>
  );
}
