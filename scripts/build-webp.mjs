// Converts every public/*.png to a same-named .webp alongside it.
// Files in LOSSLESS (e.g. the hero screenshot texture) get a lossless,
// pixel-identical WebP and keep their PNG as the swappable source; the rest
// are converted lossy and the PNG removed.
// Run before build so components can reference the .webp directly.
import { readdir, unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = fileURLToPath(new URL('../public', import.meta.url));
const LOSSLESS = new Set(['hero-screenshot.png']);

const files = await readdir(DIR);
const pngs = files.filter((f) => extname(f).toLowerCase() === '.png');

await Promise.all(
  pngs.map(async (file) => {
    const src = join(DIR, file);
    const dest = src.replace(/\.png$/i, '.webp');
    const out = file.replace(/\.png$/i, '.webp');
    if (LOSSLESS.has(file)) {
      await sharp(src).webp({ lossless: true, effort: 6 }).toFile(dest);
      console.log(`${file} -> ${out} (lossless, png kept)`);
      return;
    }
    await sharp(src).webp({ quality: 95 }).toFile(dest);
    await unlink(src);
    console.log(`${file} -> ${out} (png removed)`);
  }),
);
