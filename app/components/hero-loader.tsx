'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { hero } from '@/lib/content';

// Shared by hero-scene.tsx / hero-canvas.tsx (which report) and the loader
// (which listens). A module store rather than context: the loader can't sit
// inside HeroScene, whose ancestors are aria-hidden and transformed (a
// transform turns position:fixed into position:absolute).
let state = { revealed: false, progress: 0 };
const listeners = new Set<() => void>();
function set(next: Partial<typeof state>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const SERVER_STATE = { revealed: false, progress: 0 };

// What the 3D hero waits on. Kept here, not in hero-canvas.tsx, so
// hero-scene.tsx can start fetching them without pulling three into the main
// bundle.
export const HERO_ASSETS = {
  tablet: '/models/kamvas-tablet.glb',
  stylus: '/models/kamvas-stylus.glb',
  // A lossless WebP of public/hero-screenshot.png, made by
  // scripts/build-webp.mjs. Swap the PNG for a new capture and rerun it.
  screen: '/hero-screenshot.webp',
};

export function revealHero() {
  if (!state.revealed) set({ revealed: true, progress: 1 });
}

export function setHeroProgress(loaded: number, total: number) {
  // Never moves backwards: the manager's total grows as loaders start.
  const progress = total ? loaded / total : 0;
  if (progress > state.progress) set({ progress });
}

// ponytail: fixed cap for slow networks or a failed model (useLoader throws and
// nothing catches it). Make it network-aware only if real visitors hit it.
const GIVE_UP_MS = 8000;

// Covers the whole homepage, header included, until the 3D hero has every
// asset in. SSR renders it visible so the page can't flash in first.
export default function HeroLoader() {
  const { revealed, progress } = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(revealHero, GIVE_UP_MS);
    return () => clearTimeout(timer);
  }, []);

  // Scroll stays locked while the overlay is up; the hero intro plays as it
  // lifts, instead of invisibly underneath it.
  useEffect(() => {
    const html = document.documentElement;
    if (!revealed) {
      html.style.overflow = 'hidden';
      return () => {
        html.style.overflow = '';
      };
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tl = gsap.timeline().from('[data-hero-in]', {
      opacity: 0,
      y: 20,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.15,
    });
    return () => {
      tl.kill();
    };
  }, [revealed]);

  if (gone) return null;

  return (
    <div
      data-hero-loader
      // Lenis listens on window; this keeps wheel and touch from scrolling the
      // page behind the overlay.
      data-lenis-prevent
      role="status"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-canvas-deep transition-opacity duration-500 motion-reduce:transition-none ${
        revealed ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      // transitionend bubbles: the progress bar's own transform transition
      // would otherwise cut the overlay's fade short.
      onTransitionEnd={(e) =>
        revealed && e.target === e.currentTarget && setGone(true)
      }
    >
      {/* page.tsx wraps the hero in a z-10 stacking context, so no z-index
          here can beat the fixed z-40 header. Hide the header instead, and
          fade it back in with the overlay. */}
      <style>
        {`body>header{transition:opacity 500ms}${
          revealed ? '' : 'body>header{opacity:0;pointer-events:none}'
        }`}
      </style>
      {/* Without JS nothing would ever lift it. */}
      <noscript>
        <style>{'[data-hero-loader]{display:none}'}</style>
      </noscript>
      {/* eslint-disable-next-line @next/next/no-img-element -- tiny SVG, no optimisation to gain */}
      <img src="/logo.svg" alt="" width={48} height={48} />
      <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full origin-left rounded-full bg-brand-blue transition-transform duration-300"
          // A sliver before the 3D chunk arrives, so it reads as started.
          style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }}
        />
      </div>
      <span className="sr-only">{revealed ? '' : hero.loadingLabel}</span>
    </div>
  );
}
