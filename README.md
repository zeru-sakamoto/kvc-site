# Krita VCS (KVC)

**Krita VCS** (also called **KVC**, **Krita VC**, **KritaVC**, or spelled out as **Krita Version Control**) is a free, local-only version control app built for Krita painters, not programmers. Every save becomes a version of your `.kra` file you can compare, explore, or go back to, with no accounts, no cloud, and none of the git jargon.

This repository (`kvc-site`) is the marketing site, deployed at [krita-vc.zeru-sakamoto.codes](https://krita-vc.zeru-sakamoto.codes). The desktop app itself lives in a separate repository, [zeru-sakamoto/krita-vc](https://github.com/zeru-sakamoto/krita-vc), which also holds the MIT-licensed source, releases, and issue tracker.

## Getting started (this site)

This is a [Next.js](https://nextjs.org) App Router project (TypeScript, Tailwind CSS v4, Next 16.2.4).

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

Other commands:

- `npm run build`: production build
- `npm start`: serve the production build
- `npm run lint`: ESLint (Core Web Vitals + TypeScript rules)
- `npm run format`: Prettier

All site copy lives in [`lib/content.ts`](lib/content.ts), the single source of truth for text used across the site (`app/`, metadata, JSON-LD).

## Learn more

- [Krita VCS app repo](https://github.com/zeru-sakamoto/krita-vc): source, releases, issue tracker
- [Live site](https://krita-vc.zeru-sakamoto.codes)
- [Next.js Documentation](https://nextjs.org/docs)
