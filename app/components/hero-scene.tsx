'use client';

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { preload } from 'react-dom';
import {
  armIntro,
  HERO_ASSETS,
  HERO_STAGE,
  heroReady,
  revealHero,
} from './hero-loader';

// ssr: false only works from inside a Client Component, and a Server Component
// importing a Client Component dynamically doesn't code-split at all (Next 16
// lazy-loading guide). This wrapper is what keeps three + @react-three/fiber
// out of every other route's bundle — same reason flourishes.tsx exists.
const HeroCanvas = dynamic(() => import('./hero-canvas'), { ssr: false });

// The scene is decorative and not worth the battery or the bundle on a small
// screen, so phones (upright or on their side) get the text-only hero; see
// HERO_STAGE. Reduced motion still gets the scene, held still by
// hero-canvas.tsx.

// Probed once and remembered: getSnapshot runs on every render, and building a
// throwaway canvas each time would be silly.
let webgl: boolean | undefined;
function hasWebgl() {
  if (webgl === undefined) {
    try {
      const probe = document.createElement('canvas');
      const gl = (probe.getContext('webgl2') ??
        probe.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      webgl = Boolean(gl);
      // Hand the probe's context straight back: browsers cap live contexts
      // per page, and the real canvas needs one.
      gl?.getExtension('WEBGL_lose_context')?.loseContext();
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

// Every word and control in the hero lives in the DOM either way; a "no" only
// leaves the scene out. useSyncExternalStore (rather than an effect) keeps the
// server snapshot honest and re-decides for free if the viewport changes.
function subscribe(onChange: () => void) {
  const query = window.matchMedia(HERO_STAGE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function canRender3d() {
  return (
    window.matchMedia(HERO_STAGE).matches &&
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
  // Playing the intro: the canvas must be fully there the instant the loader
  // drops, so it skips its fade-in.
  const [intro, setIntro] = useState(false);
  // Bumping this throws away the <canvas> element and mounts a new one, which
  // is the only way to get a fresh WebGL context after the old one is lost.
  // ponytail: capped at 2 retries — if a machine can't hold a context, stop
  // fighting it, lift the loader and leave the stage empty.
  const [generation, setGeneration] = useState(0);

  // Start the models and screenshot downloading alongside the 3D chunk rather
  // than after it has loaded and mounted. The crossOrigin values match what
  // three's FileLoader (fetch) and ImageLoader (<img>) request with, so
  // useLoader picks these up from the preload cache instead of refetching.
  if (enabled) {
    preload(HERO_ASSETS.tablet, { as: 'fetch', crossOrigin: 'anonymous' });
    preload(HERO_ASSETS.stylus, { as: 'fetch', crossOrigin: 'anonymous' });
    preload(HERO_ASSETS.screen, { as: 'image', crossOrigin: 'anonymous' });
    preload(HERO_ASSETS.logo, { as: 'image', crossOrigin: 'anonymous' });
  }

  const onReady = useCallback(() => {
    setReady(true);
    heroReady();
  }, []);
  const onContextLost = useCallback(() => {
    setReady(false);
    setGeneration((g) => {
      if (g >= 2) revealHero();
      return g < 2 ? g + 1 : g;
    });
  }, []);

  // Nothing to wait for on phones, short screens or no WebGL. Asks
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
          // Decided before the canvas exists, so its first frame is already
          // the intro pose.
          if (canRender3d()) setIntro(armIntro());
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
          className={`pointer-events-none absolute inset-0 ${
            intro ? '' : 'transition-opacity duration-700'
          } ${ready ? 'opacity-100' : 'opacity-0'}`}
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
