import { faq } from '@/lib/content';

// Native <details> accordion — no JS, keyboard-accessible for free. Centered and
// narrow: this section breaks the alternating two-column rhythm on purpose.
export default function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6">
        <h2 className="mb-10 text-center font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          Questions, answered.
        </h2>

        <div className="border-t border-white/10">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-white/10">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-medium text-primary transition-colors hover:text-brand-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  className="h-5 w-5 flex-none text-muted transition-transform duration-200 group-open:rotate-45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="pb-6 pr-9 text-base leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
