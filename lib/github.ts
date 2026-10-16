import { repo } from './content';

export type RepoMeta = {
  stars: number;
  // SPDX id (e.g. "GPL-3.0"); "NOASSERTION" when GitHub can't classify it.
  license: { spdx: string; name: string } | null;
};

// Server-only. Runs at build and then at most once an hour (ISR), so
// visitors' browsers never talk to GitHub and the page stays static. The
// unauthenticated API allows 60 requests an hour per IP, far above this.
// Returns null on any failure: the badge then simply doesn't render rather
// than showing a made-up number.
export async function getRepoMeta(): Promise<RepoMeta | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo.owner}/${repo.name}`,
      {
        headers: { Accept: 'application/vnd.github+json' },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (typeof data.stargazers_count !== 'number') return null;
    return {
      stars: data.stargazers_count,
      license: data.license
        ? { spdx: data.license.spdx_id, name: data.license.name }
        : null,
    };
  } catch {
    return null;
  }
}
