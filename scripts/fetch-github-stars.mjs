import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const repository = process.env.STARS_REPOSITORY ?? 'fuck-algorithm/leetcode-239-sliding-window-maximum';
const output = resolve('public/data/github-stars.json');
const endpoint = `https://api.github.com/repos/${repository}`;
const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

let payload = { stargazers_count: 0, fetched_at: new Date().toISOString(), source: 'fallback' };
try {
  const response = await fetch(endpoint, { headers });
  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
  const data = await response.json();
  if (!Number.isInteger(data.stargazers_count) || data.stargazers_count < 0) throw new Error('Invalid stargazers_count');
  payload = { stargazers_count: data.stargazers_count, fetched_at: new Date().toISOString(), source: 'github-api' };
} catch (error) {
  console.warn(`[stars] ${error.message}; publishing zero so the browser can use its IndexedDB cache`);
}

await mkdir(dirname(output), { recursive: true });
await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
console.log(`[stars] wrote ${output} (${payload.stargazers_count}, ${payload.source})`);
