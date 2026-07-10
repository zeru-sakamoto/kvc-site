'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// The root layout (header/footer) stays mounted across routes, so App Router
// doesn't reliably reset scroll when switching pages. Force it to the top —
// except when the URL carries a hash (the nav anchors), which should scroll
// to their target section instead, or when switching between /docs chapter
// tabs, which should keep the reader's scroll position instead of yanking
// them back to the intro every click.
export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    const prevPath = prevPathname.current;
    prevPathname.current = pathname;

    if (window.location.hash) return;

    const isDocsTabSwitch =
      prevPath.startsWith('/docs/') && pathname.startsWith('/docs/');
    if (isDocsTabSwitch) return;

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
