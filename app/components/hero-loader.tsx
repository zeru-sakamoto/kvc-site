'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { hero } from '@/lib/content';

// Shared by hero-scene.tsx / hero-canvas.tsx (which report) and the loader
// (which listens). A module store rather than context: the loader can't sit
// inside HeroScene, whose ancestors are aria-hidden and transformed (a
// transform turns position:fixed into position:absolute).
let state = { revealed: false, progress: 0, intro: false };
const listeners = new Set<() => void>();
function set(next: Partial<typeof state>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}
function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
const SERVER_STATE = { revealed: false, progress: 0, intro: false };

// What the 3D hero waits on. Kept here, not in hero-canvas.tsx, so
// hero-scene.tsx can start fetching them without pulling three into the main
// bundle.
export const HERO_ASSETS = {
  tablet: '/models/kamvas-tablet.glb',
  stylus: '/models/kamvas-stylus.glb',
  // A lossless WebP of public/hero-screenshot.png, made by
  // scripts/build-webp.mjs. Swap the PNG for a new capture and rerun it.
  screen: '/hero-screenshot.webp',
  // The loader's own logo, which the intro puts on the tablet's screen.
  logo: '/logo.svg',
};

// The post-load intro: the loader's logo (already at 3x, 144px) holds while
// the bar fades, then the camera pulls back to show it was on the tablet's
// screen all along, the screen switches to the app, and the pen lifts out of
// the logo's own grey pen. GSAP tweens these (below) and hero-canvas.tsx reads
// them every frame. All 1 = settled, which is also what every path without the
// intro renders. x, y and size are the logo's centre (client px) and height,
// which the canvas's first frame matches exactly so the overlay can vanish
// without a visible cut.
export const heroIntro = {
  cam: 1,
  launch: 1,
  pen: 1,
  done: true,
  x: 0,
  y: 0,
  size: 96,
};
// The 3D pen's nib, for the page's brush stroke, which starts from it.
// brush-stroke.tsx installs `move`; hero-canvas.tsx calls it every frame with
// the nib's client px, and with nothing when the scene goes away.
export const penTip = {
  move: null as ((x?: number, y?: number) => void) | null,
};
const INTRO_KEY = 'kvc-hero-intro';
const TEXT = '[data-hero-in]:not(.hero-backdrop)';

// Decides, before the canvas paints anything, whether this load gets the
// intro: once per tab session, only from the top of the page, never under
// reduced motion or once the loader has already given up.
export function armIntro() {
  if (
    state.revealed ||
    window.scrollY > 4 ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
    return false;
  try {
    if (sessionStorage.getItem(INTRO_KEY)) return false;
  } catch {}
  const logo = document.querySelector('[data-hero-logo]');
  if (!logo) return false;
  const r = logo.getBoundingClientRect();
  Object.assign(heroIntro, {
    cam: 0,
    launch: 0,
    pen: 0,
    done: false,
    x: r.left + r.width / 2,
    y: r.top + r.height / 2,
    size: r.height,
  });
  return true;
}

// The canvas has every asset in and is drawing. With the intro armed, give it
// two frames to paint the intro pose under the overlay, then play.
export function heroReady() {
  if (heroIntro.done) return revealHero();
  if (state.intro) return;
  requestAnimationFrame(() =>
    requestAnimationFrame(() => set({ intro: true, progress: 1 })),
  );
}

// The hero's two layout queries, mirrored by the hero-wide / hero-stage
// variants in globals.css (CSS can't import these, so keep the pairs equal).
// Side by side needs a landscape screen at lg: a portrait one would leave the
// width-bound tablet sunk at the bottom under a tall void, so it stacks.
export const HERO_WIDE = '(min-width: 1024px) and (min-aspect-ratio: 1/1)';
// Where the scene mounts at all. Side by side it needs 500px of height.
// Stacked, the header, text and bottom bar take ~32rem around the scene box,
// so 780px leaves it ~16rem. Shorter (phones on their side, squat windows)
// gets the text-only hero.
export const HERO_STAGE = `${HERO_WIDE} and (min-height: 500px), (min-width: 768px) and (min-height: 780px)`;

export function revealHero() {
  if (state.revealed) return;
  // Lifted without the intro (give-up, lost context): render settled.
  if (!state.intro)
    Object.assign(heroIntro, { cam: 1, launch: 1, pen: 1, done: true });
  set({ revealed: true, progress: 1 });
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
  const { revealed, progress, intro } = useSyncExternalStore(
    subscribe,
    () => state,
    () => SERVER_STATE,
  );
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // A playing intro lifts the loader itself.
    const timer = setTimeout(() => state.intro || revealHero(), GIVE_UP_MS);
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
    if (intro || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return;
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
  }, [revealed, intro]);

  // The intro, ~3.9s. The overlay drops on one frame at 0.5s, once the bar has
  // faded: underneath, the canvas is already showing the same logo at the same
  // size on the tablet's screen, which fills the view. The pen comes out of the
  // logo before the hero's words appear. Any wheel, touch, key or click jumps
  // to the end.
  const overlay = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!intro) return;
    const events = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;
    const skip = () => tl.progress(1);
    const off = () =>
      events.forEach((e) => window.removeEventListener(e, skip));
    const finish = () => {
      off();
      try {
        sessionStorage.setItem(INTRO_KEY, '1');
      } catch {}
      // Two frames late, so the click that skipped isn't also taken as a tap.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          heroIntro.done = true;
        }),
      );
      gsap.set(['body>header', TEXT], { clearProps: 'opacity,transform' });
      revealHero();
      setGone(true);
    };
    gsap.set(TEXT, { opacity: 0, y: 20 });
    // Show the canvas's masked top and bottom edges while the screen fills
    // the view, then let the mask back in as it pulls away (globals.css).
    gsap.set('.hero-backdrop', { '--hero-edge': 1 });
    const tl = gsap
      .timeline({ onComplete: finish })
      .to('[data-hero-bar]', { opacity: 0, duration: 0.35 }, 0)
      // No CSS fade: the class's opacity transition would make this a dissolve.
      .set(overlay.current, { autoAlpha: 0, transition: 'none' }, 0.5)
      .to(heroIntro, { cam: 1, duration: 1.2, ease: 'power3.inOut' }, 0.5)
      .to(
        '.hero-backdrop',
        { '--hero-edge': 0, duration: 1.2, ease: 'power3.inOut' },
        0.5,
      )
      .to('body>header', { opacity: 1, duration: 0.5 }, 1.2)
      .to(heroIntro, { launch: 1, duration: 0.4, ease: 'power2.out' }, 1.7)
      // From the launch's first frame: the pen has to be under the logo
      // before it starts to fade. The canvas eases it.
      .to(heroIntro, { pen: 1, duration: 1.2, ease: 'none' }, 1.7)
      // Then the words, once the pen has settled into its hover.
      .to(
        TEXT,
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15 },
        2.9,
      );
    events.forEach((e) => window.addEventListener(e, skip, { passive: true }));
    return () => {
      off();
      tl.kill();
    };
  }, [intro]);

  if (gone) return null;

  return (
    <div
      ref={overlay}
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
      <img
        data-hero-logo
        src={HERO_ASSETS.logo}
        alt=""
        width={144}
        height={144}
      />
      <div
        data-hero-bar
        className="h-0.5 w-40 overflow-hidden rounded-full bg-white/10"
      >
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
