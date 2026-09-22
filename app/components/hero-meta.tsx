import { hero, links } from '@/lib/content';
import { getRepoMeta } from '@/lib/github';
import { LicenseGlyph, StarGlyph } from './license-glyphs';

const compact = new Intl.NumberFormat('en', { notation: 'compact' });

// Live GitHub stars and license, fetched on the server (see lib/github.ts).
// One link to the repo; renders nothing if GitHub couldn't be reached.
export default async function HeroMeta() {
  const meta = await getRepoMeta();
  if (!meta) return null;
  const license =
    meta.license && meta.license.spdx !== 'NOASSERTION'
      ? meta.license.spdx
      : null;

  return (
    <a
      href={links.repo}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={hero.repoMeta.label(meta.stars, license)}
      className="inline-flex items-center gap-4 whitespace-nowrap rounded-full text-sm text-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
    >
      <span className="inline-flex items-center gap-1.5">
        <StarGlyph className="size-3.5" />
        <span className="tabular-nums">{compact.format(meta.stars)}</span>
      </span>
      {license ? (
        <span className="inline-flex items-center gap-1.5">
          <LicenseGlyph spdx={license} className="size-4" />
          {license}
        </span>
      ) : null}
    </a>
  );
}
