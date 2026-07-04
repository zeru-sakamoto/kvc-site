'use client';

import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Full-page stroke whose reveal tracks scroll via a clip-path rect (plain
// viewBox Y-units, not stroke-dasharray/dashoffset).
const VIEWBOX_H = 3000;
const PATH_D =
  'M 240 80 C 560 480 720 620 600 1000 C 480 1380 220 1520 360 1920 ' +
  'C 500 2320 740 2460 600 2860';

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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clipRect.setAttribute('height', String(VIEWBOX_H));
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const debug = new URLSearchParams(window.location.search).has('debugBrush');
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
      ro.disconnect();
      st.kill();
      marker?.remove();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox={`0 0 960 ${VIEWBOX_H}`}
      preserveAspectRatio="none"
      fill="none"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <rect ref={clipRectRef} x={0} y={0} width={960} height={0} />
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
