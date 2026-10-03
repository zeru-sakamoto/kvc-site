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
const pathFrom = (x: number, y: number) =>
  `M ${x.toFixed(1)} ${y.toFixed(1)} ` +
  `C ${x.toFixed(1)} ${(y + (1000 - y) * 0.3).toFixed(1)} 720 640 600 1000 ` +
  'C 480 1380 220 1520 360 1920 C 500 2320 740 2560 600 2960';
const PATH_D = pathFrom(700, 60);

// Fraction down the viewport the tip rides once past the initial ramp-in.
const ANCHOR = 0.3;

export default function BrushStroke() {
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  // url(#id) is parsed as CSS; strip colons from React's generated id.
  const clipId = useId().replace(/:/g, '');

  useEffect(() => {
    const svg = svgRef.current;
    const clipRect = clipRectRef.current;
    if (!svg || !clipRect) return;

    // Client px in, viewBox units out. Both the guide and the reveal move.
    // ponytail: rewrites the whole path each frame the hero is on screen;
    // split off the first curve as its own <path> if the repaint ever shows
    // up in a profile.
    const paths = svg.querySelectorAll('path');
    penTip.move = (x, y) => {
      let d = PATH_D;
      if (x !== undefined && y !== undefined) {
        const r = svg.getBoundingClientRect();
        d = pathFrom(
          ((x - r.left) / r.width) * VIEWBOX_W,
          ((y - r.top) / r.height) * VIEWBOX_H,
        );
      }
      paths.forEach((p) => p.setAttribute('d', d));
    };
    // Hidden at the top of the page (loader, untouched hero); the whole
    // stroke, guide included, fades in once the page has been scrolled.
    const show = () => {
      svg.style.opacity = window.scrollY > 0 ? '1' : '0';
    };
    window.addEventListener('scroll', show, { passive: true });
    show();
    const release = () => {
      penTip.move = null;
      window.removeEventListener('scroll', show);
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clipRect.setAttribute('height', String(VIEWBOX_H));
      return release;
    }

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
    const draw = (self: ScrollTrigger) => {
      const maxScroll = ScrollTrigger.maxScroll(window) || 1;
      const leadMax = window.innerHeight * ANCHOR;
      const lead = Math.min(window.scrollY, leadMax);
      // Rescale so progress hits 1 exactly at max scroll, not before.
      const progress = Math.min(
        1,
        (self.progress + lead / maxScroll) / (1 + leadMax / maxScroll),
      );
      clipRect.setAttribute('height', String(progress * VIEWBOX_H));
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
      onUpdate: draw,
      onRefresh: draw,
    });

    const ro = new ResizeObserver(() => ScrollTrigger.refresh());
    ro.observe(svg.parentElement ?? svg);

    draw(st);

    return () => {
      release();
      ro.disconnect();
      st.kill();
      marker?.remove();
    };
  }, []);

  return (
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
      {/* Faint guide, always fully visible. */}
      <path
        d={PATH_D}
        style={{ stroke: 'var(--color-brand-blue)' }}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        opacity={0.14}
      />
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
  );
}
