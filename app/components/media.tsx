'use client';

// Painterly inline-SVG media for each section. Honest, abstract motifs — never
// fake app chrome or mock screenshots (Hallmark gate 47). All colour references
// go through DESIGN.md tokens via CSS vars (gate 48), no inline hex — except
// SignatureMedia's theme swatches, which render the real per-theme colors from
// lib/content.ts's `themes` table (content data, not decorative site chrome).
//
// Each motif reveals its own elements as it scrolls into view: `gsap.from`
// inside a `gsap.context`, driven by a `ScrollTrigger` with `once: true`. The
// SVG's natural DOM state is the finished state, so under prefers-reduced-motion
// the reveal is skipped and the motif just shows fully drawn — same contract as
// the brush stroke.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { themes } from '@/lib/content';

const BLUE = 'var(--color-brand-blue)';
const COOL = 'var(--color-accent-cool)';
const WARM = 'var(--color-accent-warm)';

// One place for the reduced-motion gate + ScrollTrigger boilerplate, so it isn't
// copied into every motif. `build` runs scoped to the returned ref via
// gsap.context, which also reverts every tween/trigger on unmount.
function useReveal(build: (self: HTMLDivElement) => void) {
  const ref = useRef<HTMLDivElement>(null);
  // Capture build once (these motifs never re-render), so it isn't an effect
  // dependency and the reveal wires up exactly once.
  const buildRef = useRef(build);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => buildRef.current(el), el);
    return () => ctx.revert();
  }, []);
  return ref;
}

// A scroll-triggered timeline that plays once when `el` scrolls into view.
function revealTimeline(el: HTMLElement) {
  return gsap.timeline({
    defaults: { ease: 'power2.out' },
    scrollTrigger: { trigger: el, start: 'top 78%', once: true },
  });
}

// Shared frame so every media panel sits in the same painterly surface.
function Panel({
  panelRef,
  children,
}: {
  panelRef?: React.Ref<HTMLDivElement>;
  children: React.ReactNode;
}) {
  return (
    <div
      ref={panelRef}
      className="rounded-2xl border border-white/10 bg-canvas-deep/60 p-6 sm:p-8"
    >
      {children}
    </div>
  );
}

// Hero / brand motif: translucent painting layers stacking up, with a small
// version-history trail threading through them. "Layers, tracked over time."
export function LayersMedia() {
  const ref = useReveal((el) => {
    revealTimeline(el)
      .from('[data-layer]', {
        yPercent: 12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
      })
      .from(
        '[data-node]',
        { scale: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.4 },
        '-=0.3',
      );
  });

  const layers = [
    { y: 26, fill: BLUE },
    { y: 58, fill: COOL },
    { y: 90, fill: WARM },
  ];
  return (
    <Panel panelRef={ref}>
      <svg aria-hidden viewBox="0 0 400 240" className="w-full" fill="none">
        {layers.map((l, i) => (
          <rect
            key={i}
            data-layer
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
            data-node
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

// Compare: two versions of the same painting side by side, split by a swipe
// handle. A dashed selection outline traces the pixels that changed; a chip row
// underneath shows a single layer in focus; a palette-diff row sits below that.
export function DiffMedia() {
  const ref = useReveal((el) => {
    revealTimeline(el)
      // Both panels ease in together — reads as zoom/pan kept in sync.
      .from('[data-panel]', {
        scale: 0.9,
        opacity: 0,
        transformOrigin: '50% 50%',
        duration: 0.7,
      })
      .from('[data-swipe]', { opacity: 0, duration: 0.4 }, '-=0.3')
      // The dashed silhouette settles in over the changed region.
      .from(
        '[data-outline]',
        { scale: 0.85, opacity: 0, transformOrigin: '50% 50%', duration: 0.5 },
        '-=0.15',
      )
      .from(
        '[data-chip]',
        { yPercent: 30, opacity: 0, stagger: 0.08, duration: 0.4 },
        '-=0.2',
      )
      .from(
        '[data-swatch]',
        {
          scale: 0.4,
          opacity: 0,
          transformOrigin: '50% 50%',
          stagger: 0.06,
          duration: 0.35,
        },
        '-=0.2',
      );
  });

  const layers = ['Sketch', 'Colour', 'Light'];
  const swatches = [
    { was: BLUE, now: COOL },
    { was: WARM, now: WARM },
    { was: 'var(--color-muted)', now: COOL },
    { was: COOL, now: BLUE },
  ];
  return (
    <Panel panelRef={ref}>
      <svg aria-hidden viewBox="0 0 400 175" className="w-full" fill="none">
        <clipPath id="diff-left">
          <rect x={30} y={20} width={168} height={135} rx={12} />
        </clipPath>
        <clipPath id="diff-right">
          <rect x={202} y={20} width={168} height={135} rx={12} />
        </clipPath>
        {/* "before" — cooler wash */}
        <g data-panel clipPath="url(#diff-left)">
          <rect
            x={30}
            y={20}
            width={168}
            height={135}
            style={{ fill: BLUE }}
            fillOpacity={0.14}
          />
          {/* "before" — a plain circle, centred in the panel */}
          <circle
            cx={114}
            cy={88}
            r={44}
            style={{ fill: COOL }}
            fillOpacity={0.2}
            className="mix-blend-screen"
          />
        </g>
        {/* "after" — warmer, shifted */}
        <g data-panel clipPath="url(#diff-right)">
          <rect
            x={202}
            y={20}
            width={168}
            height={135}
            style={{ fill: BLUE }}
            fillOpacity={0.14}
          />
          {/* "after" — the same circle warped into an irregular blob, centred
              on the same spot as the before circle so the change reads cleanly */}
          <path
            d="M 286 42 C 322 42, 340 72, 332 98 C 328 120, 298 138, 272 132 C 248 128, 240 102, 246 82 C 250 62, 260 42, 286 42 Z"
            style={{ fill: WARM }}
            fillOpacity={0.22}
            className="mix-blend-screen"
          />
          {/* dashed selection outline — traces the blob silhouette */}
          <path
            data-outline
            d="M 286 35 C 327 35, 347 70, 338 99 C 334 124, 299 145, 270 138 C 242 133, 233 104, 239 81 C 245 58, 256 35, 286 35 Z"
            fill="none"
            stroke={WARM}
            strokeWidth={1.5}
            strokeDasharray="6 5"
            strokeLinecap="round"
          />
        </g>
        {/* swipe handle between the two versions */}
        <g data-swipe>
          <line
            x1={200}
            y1={20}
            x2={200}
            y2={155}
            stroke={WARM}
            strokeWidth={2}
            strokeOpacity={0.7}
          />
          <circle
            cx={200}
            cy={88}
            r={11}
            style={{ fill: 'var(--color-canvas-deep)' }}
            stroke={WARM}
            strokeWidth={2}
          />
          <path
            d="M196 83 l-4 5 4 5 M204 83 l4 5 -4 5"
            stroke={WARM}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
      {/* layer focus — one layer in focus, the rest dimmed */}
      <div className="mt-6 flex items-center gap-2">
        {layers.map((name, i) => (
          <span
            key={name}
            data-chip
            className={`rounded-full border px-2.5 py-1 text-xs ${
              i === 1
                ? 'border-accent-warm/60 text-primary'
                : 'border-white/10 text-muted'
            }`}
          >
            {name}
          </span>
        ))}
      </div>
      {/* palette diff — before → after swatch pairs */}
      <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-5">
        {swatches.map((s, i) => (
          <div key={i} data-swatch className="flex items-center gap-1.5">
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
// try something, then merges back. Lanes draw on; nodes pop in sequence.
export function BranchMedia() {
  const ref = useReveal((el) => {
    // pathLength=1 on the lanes normalises dash units so 1 == full length.
    gsap.set('[data-lane]', { strokeDasharray: 1 });
    revealTimeline(el)
      .from('[data-lane]', {
        strokeDashoffset: 1,
        duration: 1,
        ease: 'power1.inOut',
        stagger: 0.25,
      })
      .from(
        '[data-node]',
        { scale: 0, transformOrigin: '50% 50%', stagger: 0.08, duration: 0.4 },
        '-=0.7',
      );
  });

  return (
    <Panel panelRef={ref}>
      <svg aria-hidden viewBox="0 0 400 220" className="w-full" fill="none">
        {/* main lane */}
        <line
          data-lane
          pathLength={1}
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
          data-lane
          pathLength={1}
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
            data-node
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
            data-node
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
  const ref = useReveal((el) => {
    revealTimeline(el).from('[data-row]', {
      xPercent: -6,
      opacity: 0,
      stagger: 0.12,
      duration: 0.5,
    });
  });

  const rows = [
    { tech: 'commit a3f9c1e', plain: 'Version 12' },
    { tech: 'portrait_v3.kra', plain: 'Portrait' },
    { tech: 'status: MODIFIED', plain: 'Updated' },
  ];
  return (
    <Panel panelRef={ref}>
      <p className="mb-6 text-sm text-muted">
        Artist Mode reads version control in plain language:
      </p>
      <div className="space-y-5">
        {rows.map((r) => (
          <div
            key={r.tech}
            data-row
            className="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
          >
            <span className="truncate font-mono text-xs text-muted">
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

// Settings: controls shaped like what they actually do — a slider for the
// continuous preview-thumbnail budget, a toggle for the on/off
// compact-storage switch, and a row of swatches for picking a color theme.
// Abstract controls, not a screenshot of the Settings panel itself.
export function SignatureMedia() {
  const ref = useReveal((el) => {
    revealTimeline(el)
      .from('[data-track]', { opacity: 0, duration: 0.4 })
      .from(
        '[data-fill]',
        { scaleX: 0, transformOrigin: '0% 50%', duration: 0.5 },
        '-=0.15',
      )
      .from(
        '[data-thumb], [data-knob], [data-swatch]',
        { scale: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.4 },
        '<',
      )
      .from(
        '[data-control-label]',
        { opacity: 0, yPercent: 20, stagger: 0.15, duration: 0.35 },
        '-=0.4',
      );
  });

  return (
    <Panel panelRef={ref}>
      <div className="flex flex-col gap-10">
        <div>
          <p data-control-label className="mb-4 text-xs text-muted">
            Preview budget
          </p>
          {/* a continuous amount, so a filled slider track spanning the full
              width. Fill amount and thumb position are illustrative, not a
              real reading. */}
          <div className="relative h-1.5 w-full">
            <div
              data-track
              className="absolute inset-0 rounded-full"
              style={{ background: 'var(--color-muted)', opacity: 0.25 }}
            />
            <div
              data-fill
              className="absolute inset-y-0 left-0 w-[70%] origin-left rounded-full"
              style={{ background: COOL }}
            />
            <div
              data-thumb
              className="absolute top-1/2 left-[70%] h-4.5 w-4.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                background: 'var(--color-canvas-deep)',
                borderColor: COOL,
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-10">
          <div>
            <p data-control-label className="mb-4 text-xs text-muted">
              Compact storage
            </p>
            {/* a binary setting, so an on/off toggle. Knob color +
                right-side position read as "on"; no literal text. Stays a
                fixed, compact size — a toggle shouldn't stretch to fill the
                row. */}
            <div className="relative h-8 w-14">
              <div
                data-track
                className="absolute inset-0 rounded-full"
                style={{
                  border: '2px solid var(--color-muted)',
                  opacity: 0.25,
                }}
              />
              <div
                data-knob
                className="absolute top-1/2 right-1.25 h-5 w-5 -translate-y-1/2 rounded-full"
                style={{ background: WARM }}
              />
            </div>
          </div>

          <div className="min-w-0">
            <p data-control-label className="mb-4 text-xs text-muted">
              Themes
            </p>
            {/* every theme in the picker — each swatch is bi-color (the
                theme's background + its accent), real colors from
                lib/content.ts's `themes` table, not decorative tokens. The
                default, Charcoal, reads as selected via the ring around it. */}
            <div className="flex flex-wrap items-center gap-2">
              {themes.map((t, i) => (
                <span
                  key={t.name}
                  data-swatch
                  title={t.name}
                  className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                  style={
                    i === 0
                      ? { border: `2px solid ${BLUE}` }
                      : { border: '1px solid rgba(255,255,255,0.1)' }
                  }
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ background: t.background }}
                  />
                  <span
                    className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full"
                    style={{
                      background: t.accent,
                      boxShadow: '0 0 0 1.5px var(--color-canvas-deep)',
                    }}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
}

// Performance: a per-version storage comparison — a constant-width outline
// bar for "what a full copy would cost" against a bar for "what this version
// actually added." The first save still carries a little version-control
// overhead (+7%, in warm); by the second save that flips into real savings
// (+50%, in cool) and keeps compounding. Every number here is one already
// sanctioned in the copy — no invented precision beyond those two.
export function PerformanceMedia() {
  const ref = useReveal((el) => {
    revealTimeline(el)
      .from('[data-bar-full]', {
        scaleX: 0,
        transformOrigin: '0% 50%',
        stagger: 0.12,
        duration: 0.5,
      })
      .from(
        '[data-bar-added]',
        {
          scaleX: 0,
          transformOrigin: '0% 50%',
          stagger: 0.12,
          duration: 0.5,
        },
        '-=0.3',
      )
      .from(
        '[data-badge]',
        { scale: 0, transformOrigin: '50% 50%', stagger: 0.1, duration: 0.4 },
        '-=0.2',
      );
  });

  // Illustrative only — the shrinking width tells the story, not a literal
  // reading. Full-copy cost is constant; what each save adds keeps shrinking,
  // starting from a small overhead on the very first save.
  const rows: {
    label: string;
    added: number;
    badge?: string;
    tone?: string;
  }[] = [
    { label: 'Version 1', added: 0.93, badge: '+7%', tone: COOL },
    { label: 'Version 2', added: 0.62, badge: '+50%', tone: COOL },
    { label: 'Version 3', added: 0.45 },
    { label: 'Version 4', added: 0.33 },
  ];
  const barX = 100;
  const fullWidth = 180;
  const rowHeight = 42;

  return (
    <Panel panelRef={ref}>
      <svg
        aria-hidden
        viewBox={`0 0 400 ${(rows.length - 1) * rowHeight + 36}`}
        className="w-full"
        fill="none"
      >
        {rows.map((r, i) => {
          const y = 10 + i * rowHeight;
          return (
            <g key={r.label}>
              <text
                x={14}
                y={y + 13}
                className="font-mono text-[11px]"
                fill="var(--color-muted)"
              >
                {r.label}
              </text>
              <rect
                data-bar-full
                x={barX}
                y={y}
                width={fullWidth}
                height={16}
                rx={4}
                fill="none"
                stroke={COOL}
                strokeOpacity={0.4}
                strokeDasharray="4 4"
              />
              <rect
                data-bar-added
                x={barX}
                y={y}
                width={fullWidth * r.added}
                height={16}
                rx={4}
                style={{ fill: BLUE }}
                fillOpacity={0.55}
              />
              {r.badge && (
                <g data-badge>
                  <rect
                    x={barX + fullWidth + 14}
                    y={y - 3}
                    width={54}
                    height={22}
                    rx={11}
                    style={{ fill: r.tone }}
                    fillOpacity={0.18}
                    stroke={r.tone}
                    strokeOpacity={0.6}
                  />
                  <text
                    x={barX + fullWidth + 41}
                    y={y + 12}
                    textAnchor="middle"
                    className="font-mono text-[11px] font-semibold"
                    style={{ fill: r.tone }}
                  >
                    {r.badge}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </Panel>
  );
}
