'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// The root layout (header/footer) stays mounted across routes, so App Router
// doesn't reliably reset scroll when switching pages. Force it to the top —
// except when the URL carries a hash (the nav anchors), which should scroll
// to their target section instead.
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
