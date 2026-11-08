import { useEffect, useMemo, useState } from 'react';
import { getCached, getCachedEvenExpired, setCached } from '../../services/storage/indexedDbStore';

type Props = { repoUrl: string };
const STAR_TTL_SECONDS = 3600;

type Repo = { owner: string; repo: string };

function parseRepo(repoUrl: string): Repo | null {
  const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/?#]+?)(?:\.git)?\/?$/i);
  return match ? { owner: match[1], repo: match[2] } : null;
}

async function fetchStars(): Promise<number | null> {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/github-stars.json`, { cache: 'no-store' });
    if (!response.ok) return null;
    const data = (await response.json()) as { stargazers_count?: number };
    return typeof data.stargazers_count === 'number' ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export function GitHubBadge({ repoUrl }: Props) {
  const [stars, setStars] = useState<number>(0);
  const repo = useMemo(() => parseRepo(repoUrl), [repoUrl]);

  useEffect(() => {
    if (!repo) { setStars(0); return; }
    const key = `github-stars:${repo.owner}/${repo.repo}`;
    let cancelled = false;
    void (async () => {
      const fresh = await getCached<number>(key);
      if (typeof fresh === 'number') {
        if (!cancelled) setStars(fresh);
        return;
      }
      const next = await fetchStars();
      if (next !== null) {
        if (!cancelled) setStars(next);
        await setCached<number>(key, next, STAR_TTL_SECONDS);
        return;
      }
      const fallback = await getCachedEvenExpired<number>(key);
      if (!cancelled) setStars(typeof fallback === 'number' ? fallback : 0);
    })();
    return () => { cancelled = true; };
  }, [repo]);

  return (
    <a className="github-badge" data-testid="github-badge" href={repoUrl} target="_blank" rel="noreferrer" title="去 GitHub 仓库 Star 支持一下">
      <span aria-hidden>GitHub</span>
      <span className="github-stars" data-testid="github-stars">⭐ {stars}</span>
    </a>
  );
}
