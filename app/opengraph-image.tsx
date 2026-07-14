import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { site, hero } from '@/lib/content';

// One card for the whole site (root segment). Honest media: the real brush
// logo + wordmark + tagline on the brand canvas, no fake app chrome. Colors are
// literal DESIGN.md tokens — Satori can't read the CSS custom properties.
export const alt = `${site.name} — ${hero.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const FOOTER = 'Free · local-only · MIT';

// Fetch a subset of a Google font as TTF (no modern UA, so Google returns
// truetype that Satori can parse). Returns null on any failure so the build
// never breaks on a font hiccup — next/og falls back to its built-in font.
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const params = new URLSearchParams({
      family: `${family}:wght@${weight}`,
      text,
    });
    const css = await fetch(`https://fonts.googleapis.com/css2?${params}`).then(
      (r) => r.text(),
    );
    const url = css.match(
      /src: url\((.+?)\) format\('(?:opentype|truetype)'\)/,
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

type Font = {
  name: string;
  data: ArrayBuffer;
  weight: 500 | 800;
  style: 'normal';
};

export default async function Image() {
  const [logo, syne, inter] = await Promise.all([
    readFile(join(process.cwd(), 'app/icon.svg')),
    loadGoogleFont('Syne', 800, site.wordmark),
    loadGoogleFont('Inter', 500, `${hero.badge}${hero.headline}${FOOTER}`),
  ]);
  const logoSrc = `data:image/svg+xml;base64,${logo.toString('base64')}`;

  const fonts: Font[] = [];
  if (syne)
    fonts.push({ name: 'Syne', data: syne, weight: 800, style: 'normal' });
  if (inter)
    fonts.push({ name: 'Inter', data: inter, weight: 500, style: 'normal' });

  return new ImageResponse(
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'linear-gradient(135deg, #151518 0%, #1e1e24 100%)',
        color: '#f5f6fa',
        padding: '76px 80px',
        fontFamily: 'Inter',
      }}
    >
      {/* Logo + eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        {/* Satori (next/og) rasterizes this to PNG at build — next/image N/A here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={80} height={85} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: 25,
            color: '#a0a0b0',
          }}
        >
          <div
            style={{
              width: 11,
              height: 11,
              borderRadius: 9999,
              background: '#00d2d3',
            }}
          />
          {hero.badge}
        </div>
      </div>

      {/* Wordmark + tagline */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontFamily: 'Syne',
            fontSize: 122,
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: '-0.03em',
          }}
        >
          {site.wordmark}
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 44,
            lineHeight: 1.2,
            maxWidth: 940,
            color: '#f5f6fa',
          }}
        >
          {hero.headline}
        </div>
      </div>

      {/* Footer line with a brand-blue rule */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          fontSize: 27,
          color: '#a0a0b0',
        }}
      >
        <div
          style={{
            width: 60,
            height: 4,
            borderRadius: 9999,
            background: '#2e86de',
          }}
        />
        {FOOTER}
      </div>
    </div>,
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
