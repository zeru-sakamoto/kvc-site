// OS-availability row shown under the hero download button. Purely
// informational: all three platforms are downloadable today (see /download).
import { platforms } from '@/lib/content';
import { WindowsGlyph, MacGlyph, LinuxGlyph } from './platform-glyphs';

const glyphs = {
  Windows: WindowsGlyph,
  macOS: MacGlyph,
  Linux: LinuxGlyph,
} as const;

export default function PlatformIcons() {
  return (
    <div
      role="group"
      aria-label={platforms.note}
      className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
    >
      {platforms.items.map((p) => {
        const Glyph = glyphs[p.name];
        return (
          <span
            key={p.name}
            className="inline-flex items-center gap-1.5 text-xs"
            style={{ color: 'var(--color-accent-cool)' }}
          >
            <Glyph />
            <span className="text-muted">{p.name}</span>
          </span>
        );
      })}
    </div>
  );
}
