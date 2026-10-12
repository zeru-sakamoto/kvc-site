'use client';

import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { penTip } from './hero-loader';

// Full-page stroke whose reveal tracks scroll via a clip-path rect (plain
// viewBox Y-units, not stroke-dasharray/dashoffset).
const VIEWBOX_H = 3000;
const VIEWBOX_W = 960;
// Starts at the hero's 3D pen nib (hero-canvas.tsx reports it every frame),
// leaving it straight down, so the pen reads as drawing the stroke. Without
// the scene (phones, no WebGL) it starts in the right-hand column instead.
// The route is the original hand-drawn one (ROUTE), leaned a little toward
// each section heading as it passes: at each heading's height the stroke is
// pulled part of the way (PULL) from the route toward just before the
// heading's first word, so its swings tend toward the titles without
// detouring to them. Measured from the live layout (see `measure`), in
// viewBox units.
type Pt = [number, number];
const START: Pt = [700, 60];
// A start point, then three points per cubic curve.
const ROUTE: Pt[] = [
  START,
  [700, 342],
  [720, 640],
  [600, 1000],
  [480, 1380],
  [220, 1520],
  [360, 1920],
  [500, 2320],
  [740, 2560],
  [600, 2960],
];
// Until the headings are measured (and on the server, where the stroke is
// hidden anyway): the route's own joints.
const FALLBACK: Pt[] = [ROUTE[3], ROUTE[6], ROUTE[9]];
// How far before a heading's first word the lean aims, and how close it may
// come to the page's side edges, in client px.
const LEAD_IN = 28;
const EDGE = 12;
// How far from the route toward a heading the stroke leans: 0 keeps the
// route, 1 runs to the heading.
const PULL = 0.35;
// The feature headings (marked data-stroke-pass in section.tsx) are passed
// outright rather than leaned toward: with the text on the right the stroke
// runs behind the heading, PASS_BEHIND of the way into its narrowest line;
// with the text on the left it runs past the heading's right end, PASS_BY px
// clear of its longest line. Both at the heading's vertical middle.
const PASS_BEHIND = 0.25;
const PASS_BY = 64;
// One smooth curve through the stops (Catmull-Rom as cubic Béziers), except
// that it leaves the start straight down. Control points are held between
// their two stops' heights, so the stroke only ever heads down the page.
const TENSION = 1 / 6;
const pointsThrough = (s: Pt[]): Pt[] => {
  const p: Pt[] = [s[0]];
  for (let i = 0; i < s.length - 1; i++) {
    const a = s[i];
    const b = s[i + 1];
    const prev = s[i - 1] ?? a;
    const next = s[i + 2] ?? b;
    const c1: Pt =
      i === 0
        ? [a[0], a[1] + (b[1] - a[1]) * 0.3]
        : [
            a[0] + (b[0] - prev[0]) * TENSION,
            a[1] + (b[1] - prev[1]) * TENSION,
          ];
    const c2: Pt = [
      b[0] - (next[0] - a[0]) * TENSION,
      b[1] - (next[1] - a[1]) * TENSION,
    ];
    c1[1] = Math.min(Math.max(c1[1], a[1]), b[1]);
    c2[1] = Math.min(Math.max(c2[1], c1[1]), b[1]);
    p.push(c1, c2, b);
  }
  return p;
};
const pathOf = (p: Pt[]) => {
  const n = ([x, y]: Pt) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  let d = `M ${n(p[0])}`;
  for (let i = 1; i < p.length; i += 3)
    d += ` C ${n(p[i])} ${n(p[i + 1])} ${n(p[i + 2])}`;
  return d;
};
const PATH_D = pathOf(pointsThrough([START, ...FALLBACK]));

// Where the stroke crosses height y. It only ever heads down the page, so the
// curve holding y is solved for it by bisection.
function pointAtY(p: Pt[], y: number): Pt {
  const last = p.length - 4;
  for (let i = 0; i <= last; i += 3) {
    if (y > p[i + 3][1] && i < last) continue;
    const at = (t: number, k: 0 | 1) => {
      const u = 1 - t;
      return (
        u * u * u * p[i][k] +
        3 * u * u * t * p[i + 1][k] +
        3 * u * t * t * p[i + 2][k] +
        t * t * t * p[i + 3][k]
      );
    };
    let lo = 0;
    let hi = 1;
    for (let n = 0; n < 24; n++) {
      const t = (lo + hi) / 2;
      if (at(t, 1) < y) lo = t;
      else hi = t;
    }
    return [at(lo, 0), at(lo, 1)];
  }
  return p[p.length - 1];
}

// Fraction down the viewport the tip rides once past the initial ramp-in.
const ANCHOR = 0.3;
// The drawn end's spring (rad/s): higher keeps closer to the scroll, lower
// starts and stops softer.
const SPRING = 7;
// However far a fast scroll runs ahead of the spring, the drawn end (and the
// pen on it) stays inside this band of the viewport, as fractions of its
// height: the top leaves room for the header and the pen rising off the nib.
const KEEP_TOP = 0.22;
const KEEP_BOTTOM = 0.85;

export default function BrushStroke() {
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  // url(#id) is parsed as CSS; strip colons from React's generated id.
  const clipId = useId().replace(/:/g, '');

  useEffect(() => {
    const svg = svgRef.current;
    const clipRect = clipRectRef.current;
    if (!svg || !clipRect) return;

    // Client px in, viewBox units out.
    const toViewBox = (x: number, y: number): Pt => {
      const r = svg.getBoundingClientRect();
      return [
        ((x - r.left) / r.width) * VIEWBOX_W,
        ((y - r.top) / r.height) * VIEWBOX_H,
      ];
    };
    // ponytail: rewrites the whole path each frame the hero is on screen;
    // split off the first curve as its own <path> if the repaint ever shows
    // up in a profile.
    const path = svg.querySelector('path')!;
    let start = START;
    let stops = FALLBACK;
    let points = pointsThrough([start, ...stops]);
    const rebuild = () => {
      points = pointsThrough([start, ...stops.filter((s) => s[1] > start[1])]);
      path.setAttribute('d', pathOf(points));
    };
    penTip.move = (x, y) => {
      start = x !== undefined && y !== undefined ? toViewBox(x, y) : START;
      rebuild();
    };

    // The stops: at the middle of every section heading's first line (a
    // Range's first client rect is that line, wherever the heading is
    // aligned or wraps), the route leaned toward just before its first word;
    // then the route's own end.
    const measure = () => {
      const page = svg.parentElement;
      if (!page) return;
      const box = svg.getBoundingClientRect();
      const range = document.createRange();
      const next: Pt[] = [];
      const end = ROUTE[ROUTE.length - 1][1];
      const add = ([x, y]: Pt, pull: number) => {
        if (y >= end || y <= (next.at(-1)?.[1] ?? -Infinity)) return;
        const [base] = pointAtY(ROUTE, y);
        next.push([base + (x - base) * pull, y]);
      };
      const clampX = (x: number) =>
        Math.min(Math.max(x, box.left + EDGE), box.right - EDGE);
      page.querySelectorAll('section h2').forEach((h) => {
        range.selectNodeContents(h);
        const lines = [...range.getClientRects()];
        const first = lines[0] ?? h.getBoundingClientRect();
        if (!h.hasAttribute('data-stroke-pass')) {
          add(
            toViewBox(
              clampX(first.left - LEAD_IN),
              first.top + first.height / 2,
            ),
            PULL,
          );
          return;
        }
        const head = h.getBoundingClientRect();
        const left = Math.min(...lines.map((l) => l.left));
        const right = Math.max(...lines.map((l) => l.right));
        const narrowest = Math.min(...lines.map((l) => l.width));
        // Which column the text is in: right of the page's middle, or not
        // (left, or stacked on a narrow screen).
        const behind = (left + right) / 2 > box.left + box.width / 2;
        const x = behind ? left + narrowest * PASS_BEHIND : right + PASS_BY;
        add(toViewBox(clampX(x), head.top + head.height / 2), 1);
      });
      if (!next.length) return;
      next.push(ROUTE[ROUTE.length - 1]);
      stops = next;
      rebuild();
    };
    measure();
    const layout = new ResizeObserver(measure);
    layout.observe(svg.parentElement ?? svg);
    document.fonts?.ready.then(measure);

    // Hidden at the top of the page (loader, untouched hero); the whole
    // stroke fades in once the page has been scrolled.
    const show = () => {
      svg.style.opacity = window.scrollY > 0 ? '1' : '0';
    };
    window.addEventListener('scroll', show, { passive: true });
    show();
    const release = () => {
      penTip.move = null;
      penTip.end = null;
      penTip.layer = null;
      layout.disconnect();
      window.removeEventListener('scroll', show);
    };

    // Fully drawn and still: the pen stays on the tablet.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clipRect.setAttribute('height', String(VIEWBOX_H));
      return release;
    }

    // The drawn end: where the clip edge crosses the stroke. While the edge is
    // still above the stroke's start, nothing is drawn and the pen stays home.
    let clipY = 0;
    penTip.layer = layerRef.current;
    penTip.end = () => {
      if (clipY <= points[0][1]) return null;
      const [x, y] = pointAtY(
        points,
        Math.min(clipY, points[points.length - 1][1]),
      );
      const r = svg.getBoundingClientRect();
      return {
        x: r.left + (x / VIEWBOX_W) * r.width,
        y: r.top + (y / VIEWBOX_H) * r.height,
      };
    };

    gsap.registerPlugin(ScrollTrigger);

    const debug =
      process.env.NODE_ENV !== 'production' &&
      new URLSearchParams(window.location.search).has('debugBrush');
    let marker: HTMLDivElement | null = null;
    if (debug) {
      marker = document.createElement('div');
      marker.style.cssText =
        'position:fixed;left:0;width:100%;height:2px;background:red;z-index:9999;pointer-events:none;';
      document.body.appendChild(marker);
    }
    // The drawn end doesn't jump to where scroll puts it: it follows on a
    // critically damped spring, so the line (and the pen riding its end)
    // gathers speed when a scroll starts and eases into a stop, never
    // overshooting. Stepped on GSAP's ticker, the one Lenis and ScrollTrigger
    // already run on, and only until it has settled.
    let target = 0;
    let speed = 0;
    const paint = () => {
      clipRect.setAttribute('height', String(clipY));
      penTip.redraw?.();
    };
    const step = (_time: number, deltaMs: number) => {
      // Real time, in steps no longer than 1/60s so a slow frame stays stable
      // instead of slowing the spring down (capped for a backgrounded tab).
      const total = Math.min(deltaMs / 1000, 0.25);
      const n = Math.ceil(total * 60);
      for (let i = 0; i < n; i++) {
        const dt = total / n;
        speed += (SPRING * SPRING * (target - clipY) - 2 * SPRING * speed) * dt;
        clipY += speed * dt;
      }
      // Held in the band: lagging past an edge, it's carried along with the
      // page instead. Never past the target, so this can't overshoot.
      const r = svg.getBoundingClientRect();
      const toClip = (f: number) =>
        ((window.innerHeight * f - r.top) / r.height) * VIEWBOX_H;
      const lo = Math.min(target, toClip(KEEP_TOP));
      const hi = Math.max(target, toClip(KEEP_BOTTOM));
      if (clipY < lo) {
        clipY = lo;
        speed = Math.max(speed, 0);
      } else if (clipY > hi) {
        clipY = hi;
        speed = Math.min(speed, 0);
      }
      if (Math.abs(target - clipY) < 0.05 && Math.abs(speed) < 0.5) {
        clipY = target;
        speed = 0;
        gsap.ticker.remove(step);
      }
      paint();
    };

    const draw = (self: ScrollTrigger, snap = false) => {
      const maxScroll = ScrollTrigger.maxScroll(window) || 1;
      const leadMax = window.innerHeight * ANCHOR;
      const lead = Math.min(window.scrollY, leadMax);
      // Rescale so progress hits 1 exactly at max scroll, not before.
      const progress = Math.min(
        1,
        (self.progress + lead / maxScroll) / (1 + leadMax / maxScroll),
      );
      target = progress * VIEWBOX_H;
      if (snap) {
        // Load and layout changes land in place rather than animating there.
        gsap.ticker.remove(step);
        clipY = target;
        speed = 0;
        paint();
      } else {
        // add() ignores a callback that's already on the ticker.
        gsap.ticker.add(step);
      }
      if (marker) marker.style.top = `${lead}px`;
      if (debug) {
        console.log(
          `scrollY=${Math.round(window.scrollY)} maxScroll=${Math.round(maxScroll)} ` +
            `stProgress=${self.progress.toFixed(3)} progress=${progress.toFixed(3)} ` +
            `clipHeight=${(progress * VIEWBOX_H).toFixed(0)}/${VIEWBOX_H}`,
        );
      }
    };

    // No `trigger`: numeric start/end resolve against the real document range.
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => draw(self),
      onRefresh: (self) => draw(self, true),
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(svg.parentElement ?? svg);

    draw(st, true);

    return () => {
      release();
      gsap.ticker.remove(step);
      ro.disconnect();
      st.kill();
      marker?.remove();
    };
  }, []);

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden
        // z-1: over the hero's canvas (so it shows at the nib), under the hero's
        // text and every section below (z-10 in page.tsx).
        className="pointer-events-none absolute inset-0 z-1 h-full w-full opacity-0 transition-opacity duration-500 motion-reduce:transition-none"
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
            <rect ref={clipRectRef} x={0} y={0} width={VIEWBOX_W} height={0} />
          </clipPath>
        </defs>
        {/* Reveal, clipped to the scroll-driven line. */}
        <path
          d={PATH_D}
          clipPath={`url(#${clipId})`}
          style={{ stroke: 'var(--color-brand-blue)' }}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          opacity={0.7}
        />
      </svg>
      {/* The 3D pen's layer once it leaves the tablet to draw the stroke
        (hero-canvas.tsx renders into it): pinned to the viewport, over the
        stroke, under the hero text and every section, like the stroke. */}
      <div
        ref={layerRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-2"
      />
    </>
  );
}
