import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { GitHubBadge } from '../../../../components/header/GitHubBadge';
import { getCached, getCachedEvenExpired, setCached } from '../../../../services/storage/indexedDbStore';

vi.mock('../../../../services/storage/indexedDbStore', () => ({
  getCached: vi.fn(),
  getCachedEvenExpired: vi.fn(),
  setCached: vi.fn()
}));

describe('GitHubBadge Star cache fallback', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uses a fresh one-hour cache without a network request', async () => {
    vi.mocked(getCached).mockResolvedValue(7);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    render(<GitHubBadge repoUrl="https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum" />);
    await waitFor(() => expect(screen.getByTestId('github-stars')).toHaveTextContent('⭐ 7'));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('stores the same-origin value with a 3600 second TTL', async () => {
    vi.mocked(getCached).mockResolvedValue(undefined);
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ stargazers_count: 11 }) })));
    render(<GitHubBadge repoUrl="https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum" />);
    await waitFor(() => expect(screen.getByTestId('github-stars')).toHaveTextContent('⭐ 11'));
    expect(fetch).toHaveBeenCalledWith(`${import.meta.env.BASE_URL}data/github-stars.json`, { cache: 'no-store' });
    expect(setCached).toHaveBeenCalledWith('github-stars:fuck-algorithm/leetcode-239-sliding-window-maximum', 11, 3600);
  });

  it('falls back to stale cache on request failure, then displays zero without cache', async () => {
    vi.mocked(getCached).mockResolvedValue(undefined);
    vi.mocked(getCachedEvenExpired).mockResolvedValue(4);
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: false, json: async () => ({}) })));
    const view = render(<GitHubBadge repoUrl="https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum" />);
    await waitFor(() => expect(screen.getByTestId('github-stars')).toHaveTextContent('⭐ 4'));

    vi.mocked(getCachedEvenExpired).mockResolvedValue(undefined);
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('offline'); }));
    view.rerender(<GitHubBadge repoUrl="https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum.git" />);
    await waitFor(() => expect(screen.getByTestId('github-stars')).toHaveTextContent('⭐ 0'));
  });

  it('links to the repository in a new tab', () => {
    render(<GitHubBadge repoUrl="https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum" />);
    expect(screen.getByTestId('github-badge')).toHaveAttribute('target', '_blank');
    expect(screen.getByTestId('github-badge')).toHaveAttribute('href', 'https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum');
  });
});
