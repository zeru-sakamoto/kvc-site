'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

// Faint Krita-blue smudge trailing the pointer, fading when idle.
// Fine-pointer + non-reduced-motion only. Secondary flourish — the brush stroke
// is the required signature element; this is polish on top.
export default function CursorBrush() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    if (!fine || reduce) return;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    let fadeTimer: ReturnType<typeof setTimeout>;

    const onMove = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(el, { opacity: 0.5, duration: 0.2, overwrite: 'auto' });
      clearTimeout(fadeTimer);
      fadeTimer = setTimeout(
        () => gsap.to(el, { opacity: 0, duration: 0.6 }),
        140,
      );
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      clearTimeout(fadeTimer);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-30 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-2xl"
      style={{
        background:
          'radial-gradient(circle, var(--color-brand-blue) 0%, transparent 70%)',
      }}
    />
  );
}
