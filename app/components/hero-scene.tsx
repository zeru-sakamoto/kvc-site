'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useCallback, useState, useSyncExternalStore } from 'react';

// ssr: false only works from inside a Client Component, and a Server Component
// importing a Client Component dynamically doesn't code-split at all (Next 16
// lazy-loading guide). This wrapper is what keeps three + @react-three/fiber
// out of every other route's bundle — same reason flourishes.tsx exists.
const HeroCanvas = dynamic(() => import('./hero-canvas'), { ssr: false });

// Matches the placeholder SVG's tilt in the 3D scene (TILT_Y 0.24rad, TILT_X
// -0.06rad) so the cross-fade from flat image to mesh doesn't jump.
const FLAT_TILT =
  'perspective(1200px) rotateY(13.7deg) rotateX(-3.4deg) rotateZ(0.9deg)';

const REDUCED = '(prefers-reduced-motion: reduce)';
// Phones get the flat image. The scene is decorative and not worth the battery
// or the bundle on a small screen.
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

// A "no" here is not a degraded page: the flat image below is the finished
// state, and every word and control in the hero lives in the DOM either way.
// useSyncExternalStore (rather than an effect) keeps the server snapshot honest
// and re-decides for free if the viewport or the motion preference changes.
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

export default function HeroScene() {
  const enabled = useSyncExternalStore(subscribe, canRender3d, () => false);
  const [armed, setArmed] = useState(false);
  const [ready, setReady] = useState(false);
  // Bumping this throws away the <canvas> element and mounts a new one, which
  // is the only way to get a fresh WebGL context after the old one is lost.
  // ponytail: capped at 2 retries — if a machine can't hold a context, stop
  // fighting it and leave the flat image up.
  const [generation, setGeneration] = useState(0);

  const onReady = useCallback(() => setReady(true), []);
  const onContextLost = useCallback(() => {
    setReady(false);
    setGeneration((g) => (g < 2 ? g + 1 : g));
  }, []);

  // Mount the canvas only once the hero is on screen, and never during the
  // first commit. Two reasons, both load-bearing:
  //   1. It keeps three off the critical path, so the headline and the flat
  //      image paint first.
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
    // Fills whatever box the hero reserves for it. The parent owns the height
    // in CSS, so mounting the canvas over the flat image can't shift the page.
    <div ref={observe} className="relative h-full w-full">
      <Image
        src="/hero-window-placeholder.svg"
        // Matches TextureLoader's fetch, so the 3D layer reuses this preload
        // instead of requesting the file a second time.
        crossOrigin="anonymous"
        // Decorative: it stands in for a screenshot and carries no information
        // the headline doesn't already give. Give it real alt text on the day
        // it becomes a real capture.
        alt=""
        aria-hidden
        width={1280}
        height={800}
        priority
        unoptimized
        style={{ transform: FLAT_TILT }}
        className={`absolute left-1/2 top-1/2 w-[80%] sm:w-[56%] wide:w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-opacity duration-700 ${
          ready ? 'opacity-0' : 'opacity-100'
        }`}
      />
      {enabled && armed ? (
        <div className="pointer-events-none absolute inset-0">
          <HeroCanvas
            key={generation}
            onReady={onReady}
            onContextLost={onContextLost}
          />
        </div>
      ) : null}
    </div>
  );
}
