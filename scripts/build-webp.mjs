// Converts every public/*.png to a same-named .webp alongside it.
// Run before build so components can reference the .webp directly.
import { readdir, unlink } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const DIR = fileURLToPath(new URL('../public', import.meta.url));

const files = await readdir(DIR);
const pngs = files.filter((f) => extname(f).toLowerCase() === '.png');

await Promise.all(
  pngs.map(async (file) => {
    const src = join(DIR, file);
    const dest = src.replace(/\.png$/i, '.webp');
    await sharp(src).webp({ quality: 82 }).toFile(dest);
    await unlink(src);
    console.log(`${file} -> ${file.replace(/\.png$/i, '.webp')} (png removed)`);
  }),
);
