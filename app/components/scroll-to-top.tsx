'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// The root layout (header/footer) stays mounted across routes, so App Router
// doesn't reliably reset scroll when switching pages. Force it to the top —
// except when the URL carries a hash (the nav anchors), which should scroll
// to their target section instead, or when switching between docs-area
// chapter tabs (/docs/* and /plugin share the DocsNav sidebar, see
// docs-nav.tsx), which should keep the reader's scroll position instead of
// yanking them back to the intro every click.
const isDocsArea = (path: string) =>
  path.startsWith('/docs/') ||
  path === '/plugin' ||
  path.startsWith('/plugin/');

export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathname.current;
    prevPathname.current = pathname;

    if (window.location.hash) return;

    if (isDocsArea(prevPath) && isDocsArea(pathname)) return;

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
