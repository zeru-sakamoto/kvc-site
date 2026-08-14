'use client';

import dynamic from 'next/dynamic';

// Both effects render `null` on the server — they exist purely for post-hydration
// behaviour — yet importing them from the root layout anchored GSAP + Lenis
// (~130KB uncompressed) into the first-load bundle of every route, including
// /privacy, /download and all of /docs where nothing animates.
//
// ponytail: one thin client wrapper instead of restructuring the layout.
// `ssr: false` only works inside a Client Component (Next 16 lazy-loading
// guide), and a Server Component importing a Client Component dynamically
// doesn't code-split — so the wrapper is what makes the split actually happen.
const SmoothScroll = dynamic(() => import('./smooth-scroll'), { ssr: false });
const CursorBrush = dynamic(() => import('./cursor-brush'), { ssr: false });

export default function Flourishes() {
  return (
    <>
      <SmoothScroll />
      <CursorBrush />
    </>
  );
}
