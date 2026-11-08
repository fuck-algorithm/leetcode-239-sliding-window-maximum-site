import { expect, test, type Page } from '@playwright/test';

async function openApp(page: Page) {
  await page.goto('');
  await expect(page.getByTestId('app-root')).toBeVisible();
}

test.describe('AC-023 algorithm motion evidence', () => {
  test('focus is unique, IDs remain stable, null slots render, and quick switching leaves no duplicates', async ({ page }) => {
    await openApp(page);
    await expect(page.locator('.canvas-node.is-null')).toBeVisible();
    const idsAcrossSteps: string[][] = [];
    for (let i = 0; i < 8; i += 1) {
      const nodes = page.locator('.canvas-node');
      const current = await page.locator('.canvas-node[data-status="current"]').count();
      const compare = await page.locator('.canvas-node[data-status="compare"]').count();
      expect(current).toBe(1);
      expect(compare).toBeLessThanOrEqual(2);
      idsAcrossSteps.push(await nodes.evaluateAll((all) => all.map((node) => node.getAttribute('data-node-id') ?? '')));
      if (i < 7) await page.getByTestId('next-step-btn').click();
    }
    const first = new Set(idsAcrossSteps[0]);
    const overlap = idsAcrossSteps[1].filter((id) => first.has(id)).length / Math.max(first.size, 1);
    expect(overlap).toBeGreaterThanOrEqual(0.6);

    for (let i = 0; i < 3; i += 1) {
      await page.getByTestId('solution-tab-monotonic-deque').click();
      await page.getByTestId('next-step-btn').click();
      await page.getByTestId('solution-tab-brute-force').click();
      await page.getByTestId('next-step-btn').click();
    }
    const ids = await page.locator('.canvas-node').evaluateAll((nodes) => nodes.map((node) => node.getAttribute('data-node-id')));
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('reduced motion keeps narration, operation, legend and focus available', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await openApp(page);
    await page.getByTestId('next-step-btn').click();
    await expect(page.getByTestId('operation-badge')).toBeVisible();
    await expect(page.getByTestId('step-narration')).not.toBeEmpty();
    await expect(page.getByTestId('canvas-legend')).toBeVisible();
    await expect(page.locator('.code-line.active')).not.toHaveCount(0);
    await expect(page.locator('.canvas-node[data-status="current"]')).toHaveCount(1);
    await page.screenshot({ path: 'test-results/reduced-motion.png', fullPage: true });
  });
});
