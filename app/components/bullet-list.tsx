type Item = { lead?: string; body: string };

// Shared dot-bullet list for docs chapters — an optional bold lead-in term
// followed by the body, or just the body when there's no lead.
export default function BulletList({ items }: { items: readonly Item[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.lead ?? item.body} className="flex gap-3">
          <span
            aria-hidden
            className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-accent-cool"
          />
          <p className="text-base leading-relaxed text-muted">
            {item.lead ? (
              <span className="font-semibold text-primary">{item.lead} </span>
            ) : null}
            {item.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
