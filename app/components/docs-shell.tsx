import DocsNav from './docs-nav';

// Sidebar-plus-content row shared by /docs and /plugin, so both get the same
// chapter nav without duplicating the flex layout in two layout.tsx files.
export default function DocsShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
      <DocsNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
