// Painterly inline-SVG media for each section. Honest, abstract motifs — never
// fake app chrome or mock screenshots (Hallmark gate 47). All colour references
// go through DESIGN.md tokens via CSS vars (gate 48), no inline hex.

const BLUE = 'var(--color-brand-blue)';
const COOL = 'var(--color-accent-cool)';
const WARM = 'var(--color-accent-warm)';

// Shared frame so every media panel sits in the same painterly surface.
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-canvas-deep/60 p-6 sm:p-8">
      {children}
    </div>
  );
}

// Hero / brand motif: translucent painting layers stacking up, with a small
// version-history trail threading through them. "Layers, tracked over time."
export function LayersMedia() {
  const layers = [
    { y: 26, fill: BLUE },
    { y: 58, fill: COOL },
    { y: 90, fill: WARM },
  ];
  return (
    <Panel>
      <svg aria-hidden viewBox="0 0 400 240" className="w-full" fill="none">
        {layers.map((l, i) => (
          <rect
            key={i}
            x={40 + i * 26}
            y={l.y}
            width={250}
            height={96}
            rx={12}
            className="mix-blend-screen"
            style={{ fill: l.fill }}
            fillOpacity={0.16}
            stroke={l.fill}
            strokeOpacity={0.5}
          />
        ))}
        {/* version trail — nodes along the bottom, connected */}
        <line
          x1={54}
          y1={210}
          x2={346}
          y2={210}
          stroke={BLUE}
          strokeOpacity={0.35}
        />
        {[54, 151, 248, 346].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={210}
            r={i === 3 ? 7 : 5}
            style={{ fill: i === 3 ? BLUE : 'var(--color-canvas-deep)' }}
            stroke={BLUE}
            strokeOpacity={i === 3 ? 1 : 0.6}
            strokeWidth={2}
          />
        ))}
      </svg>
    </Panel>
  );
}

// Compare: two versions split by a swipe handle, with a glow seam over the
// pixels that changed. A palette-diff swatch row sits beneath it.
export function DiffMedia() {
  const swatches = [
    { was: 'var(--color-brand-blue)', now: 'var(--color-accent-cool)' },
    { was: 'var(--color-accent-warm)', now: 'var(--color-accent-warm)' },
    { was: 'var(--color-muted)', now: 'var(--color-accent-cool)' },
    { was: 'var(--color-accent-cool)', now: 'var(--color-brand-blue)' },
  ];
  return (
    <Panel>
      <svg aria-hidden viewBox="0 0 400 190" className="w-full" fill="none">
        <clipPath id="diff-left">
          <rect x={30} y={20} width={168} height={150} rx={12} />
        </clipPath>
        <clipPath id="diff-right">
          <rect x={202} y={20} width={168} height={150} rx={12} />
        </clipPath>
        {/* "before" — cooler wash */}
        <g clipPath="url(#diff-left)">
          <rect
            x={30}
            y={20}
            width={168}
            height={150}
            style={{ fill: BLUE }}
            fillOpacity={0.14}
          />
          <circle
            cx={90}
            cy={80}
            r={44}
            style={{ fill: COOL }}
            fillOpacity={0.2}
            className="mix-blend-screen"
          />
        </g>
        {/* "after" — warmer, shifted */}
        <g clipPath="url(#diff-right)">
          <rect
            x={202}
            y={20}
            width={168}
            height={150}
            style={{ fill: BLUE }}
            fillOpacity={0.14}
          />
          <circle
            cx={278}
            cy={92}
            r={50}
            style={{ fill: WARM }}
            fillOpacity={0.22}
            className="mix-blend-screen"
          />
        </g>
        {/* seam glow — where the change is */}
        <line
          x1={200}
          y1={20}
          x2={200}
          y2={170}
          stroke={WARM}
          strokeWidth={2}
          strokeOpacity={0.7}
        />
        <circle
          cx={200}
          cy={95}
          r={11}
          style={{ fill: 'var(--color-canvas-deep)' }}
          stroke={WARM}
          strokeWidth={2}
        />
        <path
          d="M196 90 l-4 5 4 5 M204 90 l4 5 -4 5"
          stroke={WARM}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {/* palette diff — before → after swatch pairs */}
      <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-6">
        {swatches.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <span
              className="h-5 w-5 rounded"
              style={{ background: s.was, opacity: 0.5 }}
            />
            <span className="text-muted" aria-hidden>
              →
            </span>
            <span className="h-5 w-5 rounded" style={{ background: s.now }} />
          </div>
        ))}
      </div>
    </Panel>
  );
}

// History: a colour-coded branch graph — a main lane, a branch that diverges to
// try something, then merges back.
export function BranchMedia() {
  return (
    <Panel>
      <svg aria-hidden viewBox="0 0 400 220" className="w-full" fill="none">
        {/* main lane */}
        <line
          x1={70}
          y1={40}
          x2={70}
          y2={190}
          stroke={BLUE}
          strokeWidth={2.5}
          strokeOpacity={0.8}
        />
        {/* branch out and back */}
        <path
          d="M70 78 C 70 108, 190 100, 190 130 L 190 150 C 190 176, 70 168, 70 190"
          stroke={COOL}
          strokeWidth={2.5}
          strokeOpacity={0.8}
          fill="none"
        />
        {/* main-lane nodes */}
        {[40, 78, 132, 190].map((y, i) => (
          <circle
            key={y}
            cx={70}
            cy={y}
            r={i === 3 ? 8 : 6}
            style={{ fill: i === 3 ? BLUE : 'var(--color-canvas-deep)' }}
            stroke={BLUE}
            strokeWidth={2.5}
          />
        ))}
        {/* branch nodes */}
        {[130, 150].map((y) => (
          <circle
            key={y}
            cx={190}
            cy={y}
            r={6}
            style={{ fill: 'var(--color-canvas-deep)' }}
            stroke={COOL}
            strokeWidth={2.5}
          />
        ))}
      </svg>
    </Panel>
  );
}

// Yours: a conceptual map of what Artist Mode does — it translates the technical
// label on the left into the plain one on the right. Not a screenshot of the app,
// just the transformation the feature performs.
export function OwnershipMedia() {
  const rows = [
    { tech: 'commit a3f9c1e', plain: 'Version 12' },
    { tech: 'portrait_v3.kra', plain: 'Portrait' },
    { tech: 'status: MODIFIED', plain: 'Updated' },
  ];
  return (
    <Panel>
      <p className="mb-6 text-sm text-muted">
        Artist Mode reads version control in plain language:
      </p>
      <div className="space-y-5">
        {rows.map((r) => (
          <div
            key={r.tech}
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          >
            <span className="truncate font-mono text-xs text-muted/70">
              {r.tech}
            </span>
            <span aria-hidden className="text-muted">
              →
            </span>
            <span className="font-display text-lg font-semibold text-primary">
              {r.plain}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
