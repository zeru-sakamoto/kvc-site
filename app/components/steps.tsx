type Step = { title: string; body: string };

// Plain numbered steps for the Getting Started guide — no fake UI, no
// screenshots, just the sequence in order.
export default function Steps({ items }: { items: readonly Step[] }) {
  return (
    <ol className="space-y-8">
      {items.map((step, i) => (
        <li key={step.title} className="flex gap-5">
          <span
            aria-hidden
            className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/15 font-display text-sm font-bold text-primary"
          >
            {i + 1}
          </span>
          <div className="min-w-0 pt-1">
            <p className="font-display text-lg font-semibold text-primary">
              {step.title}
            </p>
            <p className="mt-1.5 text-base leading-relaxed text-muted">
              {step.body}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
