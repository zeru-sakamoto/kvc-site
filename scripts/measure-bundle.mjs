// Gzipped first-load JS per prerendered route, read straight off the emitted
// HTML. Next 16's build output no longer prints these, and the 3D hero must not
// regress the routes that don't use it.
//
// ponytail: greps script srcs out of the HTML instead of reassembling Next's
// per-route client manifests. Same answer, survives manifest reshuffles.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';

const APP = '.next/server/app';
const gz = new Map();
const sizeOf = (url) => {
  if (!gz.has(url)) {
    const p = join('.next', url.replace('/_next/', ''));
    gz.set(url, existsSync(p) ? gzipSync(readFileSync(p)).length : 0);
  }
  return gz.get(url);
};

const rows = readdirSync(APP)
  .filter((f) => f.endsWith('.html') && !f.startsWith('_'))
  .map((f) => {
    const html = readFileSync(join(APP, f), 'utf8');
    const urls = [
      ...new Set(html.match(/\/_next\/static\/[^"']+?\.js/g) ?? []),
    ];
    return [f.replace(/\.html$/, ''), urls.reduce((n, u) => n + sizeOf(u), 0)];
  })
  .sort((a, b) => b[1] - a[1]);

for (const [route, bytes] of rows) {
  console.log(`${(bytes / 1024).toFixed(1).padStart(8)} kB  ${route}`);
}
