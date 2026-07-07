'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { faq } from '@/lib/content';

// <details>/<summary> stays the source of truth for open state (keyboard +
// screen-reader accessible for free); GSAP only animates the reveal on top of
// it. Under prefers-reduced-motion the click just toggles `open` natively —
// same reduced-motion contract as the brush stroke and media reveals.
function FaqItem({ q, a }: { q: string; a: string }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    const details = detailsRef.current;
    const content = contentRef.current;
    if (!details || !content) return;

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (!isOpen) {
      details.open = true;
      if (reduced) {
        setIsOpen(true);
        return;
      }
      gsap.fromTo(
        content,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.4,
          ease: 'power3.out',
          onComplete: () => setIsOpen(true),
        },
      );
    } else {
      if (reduced) {
        details.open = false;
        setIsOpen(false);
        return;
      }
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut',
        onComplete: () => {
          details.open = false;
          setIsOpen(false);
        },
      });
    }
  }

  return (
    <details ref={detailsRef} className="group border-b border-white/10">
      <summary
        onClick={handleToggle}
        className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-primary transition-colors hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue [&::-webkit-details-marker]:hidden"
      >
        <span>{q}</span>
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          className="h-5 w-5 flex-none text-muted transition-transform duration-200 group-open:rotate-45"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </summary>
      <div ref={contentRef} className="overflow-hidden">
        <p className="pb-6 pr-9 text-base leading-relaxed text-muted">{a}</p>
      </div>
    </details>
  );
}

// Centered and narrow: this section breaks the alternating two-column rhythm
// on purpose.
export default function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Questions, answered.
        </h2>

        <div className="border-t border-white/10">
          {faq.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
