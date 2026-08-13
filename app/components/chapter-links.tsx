import Link from 'next/link';

type Item = { slug: string; label: string; summary: string };

// Index-page link list — one row per sub-chapter, title + one-line summary.
// Shared by the "Using each feature" and "Krita plugin" index pages.
export default function ChapterLinks({
  basePath,
  items,
}: {
  basePath: string;
  items: readonly Item[];
}) {
  return (
    <ul className="divide-y divide-white/10 border-t border-white/10">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`${basePath}/${item.slug}`}
            className="group flex items-baseline justify-between gap-6 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
          >
            <span>
              <span className="font-display font-semibold text-primary group-hover:text-accent-cool">
                {item.label}
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">
                {item.summary}
              </span>
            </span>
            <span
              aria-hidden
              className="flex-none text-muted group-hover:text-accent-cool"
            >
              →
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
