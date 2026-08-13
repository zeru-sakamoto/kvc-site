'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsChapters } from '@/lib/content';

// Chapter tabs: a horizontal scrollable pill row on mobile, a plain vertical
// list — sticky below the fixed header — on the left on lg+ — same content,
// no separate mobile component. `scroll={false}` on every Link is what keeps
// the reader's scroll position on click (Next's default Link behavior
// otherwise scrolls to the top); ScrollToTop (app/components/scroll-to-top.tsx)
// is the other half, skipping its own forced reset across the whole docs
// area (/docs/* and /plugin, which shares this sidebar).
// Chapters with `subchapters` (Using each feature, Krita plugin) carry a
// right-aligned chevron on lg+ so it reads as expandable before it's active,
// and expand into a nested indented list under themselves once a route
// inside that chapter is active — mobile keeps the flat top-level pill row,
// and each sub-chapter page carries its own "back to chapter" link for
// mobile nav.
export default function DocsNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Documentation chapters"
      className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:w-56 lg:flex-none lg:overflow-y-auto"
    >
      <ul className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0">
        {docsChapters.map((chapter) => {
          const isCurrentPage = pathname === chapter.path;
          const isActiveChapter =
            isCurrentPage || pathname?.startsWith(`${chapter.path}/`);

          return (
            <li key={chapter.slug} className="flex-none lg:w-full">
              <Link
                href={chapter.path}
                scroll={false}
                aria-current={isCurrentPage ? 'page' : undefined}
                aria-expanded={
                  'subchapters' in chapter ? isActiveChapter : undefined
                }
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue lg:rounded-md lg:px-3 lg:py-2 ${
                  isActiveChapter
                    ? 'bg-brand-blue font-medium text-canvas-deep lg:bg-white/5 lg:text-primary'
                    : 'border border-white/15 text-muted hover:text-primary lg:border-0'
                }`}
              >
                {chapter.label}
                {'subchapters' in chapter ? (
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className={`hidden h-3.5 w-3.5 flex-none transition-transform lg:ml-auto lg:block ${
                      isActiveChapter ? 'rotate-90' : ''
                    }`}
                  >
                    <path
                      d="M7 5l6 5-6 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </Link>

              {'subchapters' in chapter && isActiveChapter ? (
                <ul className="mt-1 hidden flex-col gap-0.5 border-l border-white/10 pl-3 lg:flex">
                  {chapter.subchapters.map((sub) => {
                    const subActive = pathname === sub.path;
                    return (
                      <li key={sub.slug}>
                        <Link
                          href={sub.path}
                          scroll={false}
                          aria-current={subActive ? 'page' : undefined}
                          className={`block rounded-md px-2 py-1.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue ${
                            subActive
                              ? 'font-medium text-primary'
                              : 'text-muted hover:text-primary'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
