'use client';

import { useEffect } from 'react';
import gsap from 'gsap';

// One-shot mount animation, not scroll-linked, so no ScrollTrigger here.
// Renders nothing — it only reaches into the DOM for [data-hero-in] targets
// marked up by hero.tsx.
export default function HeroIntro() {
  useEffect(() => {
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
  }, []);

  return null;
}
