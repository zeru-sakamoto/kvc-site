'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { revealHero } from './hero-loader';

// ssr: false only works from inside a Client Component, and a Server Component
// importing a Client Component dynamically doesn't code-split at all (Next 16
// lazy-loading guide). This wrapper is what keeps three + @react-three/fiber
// out of every other route's bundle — same reason flourishes.tsx exists.
const HeroCanvas = dynamic(() => import('./hero-canvas'), { ssr: false });

const REDUCED = '(prefers-reduced-motion: reduce)';
// The scene is decorative and not worth the battery or the bundle on a small
// screen, so phones get the text-only hero.
const WIDE = '(min-width: 768px)';

// Probed once and remembered: getSnapshot runs on every render, and building a
// throwaway canvas each time would be silly.
let webgl: boolean | undefined;
function hasWebgl() {
  if (webgl === undefined) {
    try {
      const probe = document.createElement('canvas');
      webgl = Boolean(
        probe.getContext('webgl2') ?? probe.getContext('experimental-webgl'),
      );
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

// Every word and control in the hero lives in the DOM either way; a "no" only
// leaves the scene out. useSyncExternalStore (rather than an effect) keeps the
// server snapshot honest and re-decides for free if the viewport or the motion
// preference changes.
function subscribe(onChange: () => void) {
  const queries = [window.matchMedia(REDUCED), window.matchMedia(WIDE)];
  queries.forEach((q) => q.addEventListener('change', onChange));
  return () =>
    queries.forEach((q) => q.removeEventListener('change', onChange));
}

function canRender3d() {
  return (
    !window.matchMedia(REDUCED).matches &&
    window.matchMedia(WIDE).matches &&
    (navigator.hardwareConcurrency ?? 8) >= 4 &&
    hasWebgl()
  );
}

// The live scene. Fills the whole hero section behind the text; the camera
// frames the tablet on the element named by `anchorId`, so the tablet sits in
// the scene column while the desk, grid and haze run under the whole hero.
export default function HeroScene({ anchorId }: { anchorId: string }) {
  const enabled = useSyncExternalStore(subscribe, canRender3d, () => false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  // Bumping this throws away the <canvas> element and mounts a new one, which
  // is the only way to get a fresh WebGL context after the old one is lost.
  // ponytail: capped at 2 retries — if a machine can't hold a context, stop
  // fighting it, lift the loader and leave the stage empty.
  const [generation, setGeneration] = useState(0);

  const onReady = useCallback(() => {
    setReady(true);
    revealHero();
  }, []);
  const onContextLost = useCallback(() => {
    setReady(false);
    setGeneration((g) => {
      if (g >= 2) revealHero();
      return g < 2 ? g + 1 : g;
    });
  }, []);

  // Nothing to wait for on phones, reduced motion or no WebGL. Asks
  // canRender3d() directly: `enabled` is still the server snapshot (false)
  // during this first effect, even on a desktop.
  useEffect(() => {
    if (!canRender3d()) revealHero();
  }, []);

  // Mount the canvas only once the hero is on screen, and never during the
  // first commit. Two reasons, both load-bearing:
  //   1. It keeps three off the critical path, so the page's HTML and CSS
  //      paint first.
  //   2. React StrictMode double-invokes effects in dev, and R3F's unmount
  //      calls forceContextLoss() on a 500ms timer — which lands on the
  //      remounted renderer's context and kills it. Arriving after that cycle
  //      means the Canvas mounts exactly once.
  const observe = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    // The section owns the size in CSS, so mounting the canvas can't shift
    // the page.
    <div ref={observe} className="relative h-full w-full">
      {enabled && armed ? (
        // Hidden until the models and screenshot have loaded, then faded in,
        // so the tablet never appears half-built.
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <HeroCanvas
            key={generation}
            anchorId={anchorId}
            onReady={onReady}
            onContextLost={onContextLost}
          />
        </div>
      ) : null}
    </div>
  );
}
