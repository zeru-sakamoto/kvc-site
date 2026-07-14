import Image from 'next/image';
import Link from 'next/link';
import { footer, site } from '@/lib/content';

export default function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-canvas-deep">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5 font-display text-lg font-bold tracking-tight text-primary">
              <Image
                src="/logo.svg"
                alt=""
                aria-hidden
                width={28}
                height={30}
                className="h-7 w-auto"
              />
              {site.wordmark}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {footer.signature}
            </p>
            <p className="mt-3 text-xs text-muted">{footer.license}</p>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            {footer.columns.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-accent-cool">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) =>
                    l.href.startsWith('/') ? (
                      <li key={l.href}>
                        <Link
                          href={l.href}
                          className="whitespace-nowrap text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                        >
                          {l.label}
                        </Link>
                      </li>
                    ) : (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whitespace-nowrap text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
                        >
                          {l.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-16 text-xs text-muted">
          © {new Date().getFullYear()} {site.name}.
        </p>
      </div>
    </footer>
  );
}
