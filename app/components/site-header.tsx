'use client';

import { useEffect, useState } from 'react';
import { site, nav } from '@/lib/content';

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-canvas-deep/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          className="group flex items-center gap-2.5 font-display text-base font-bold tracking-tight text-primary"
        >
          <span
            aria-hidden
            className="inline-block h-3.5 w-3.5 rounded-full bg-brand-blue transition-colors duration-300 group-hover:bg-accent-warm"
          />
          {site.wordmark}
        </a>

        <nav className="flex items-center gap-1 sm:gap-2">
          {/* Scroll shortcuts, not core functionality — content is still one
              scroll away, so hiding these below sm avoids header overflow on
              narrow phones instead of squeezing them into unusable widths. */}
          <div className="hidden items-center gap-1 sm:flex sm:gap-2">
            {nav.anchors.map((a) => (
              <a
                key={a.href}
                href={a.href}
                className="flex h-11 items-center rounded-md px-3 text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
              >
                {a.label}
              </a>
            ))}
          </div>
          <a
            href={nav.repo.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-1 inline-flex h-11 items-center rounded-md border border-white/15 px-4 text-sm font-medium text-primary transition-colors hover:border-brand-blue hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue sm:ml-2"
          >
            {nav.repo.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
