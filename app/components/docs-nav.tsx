'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsChapters } from '@/lib/content';

// Chapter tabs: a horizontal scrollable pill row on mobile, a plain vertical
// list on the left on lg+ — same content, no separate mobile component.
export default function DocsNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation chapters" className="lg:w-56 lg:flex-none">
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {docsChapters.map((chapter) => {
          const href = `/docs/${chapter.slug}`;
          const active = pathname === href;
          return (
            <li key={chapter.slug} className="flex-none">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`block whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue lg:rounded-md lg:px-3 lg:py-2 ${
                  active
                    ? 'bg-brand-blue font-medium text-canvas-deep lg:bg-white/5 lg:text-primary'
                    : 'border border-white/15 text-muted hover:text-primary lg:border-0'
                }`}
              >
                {chapter.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
