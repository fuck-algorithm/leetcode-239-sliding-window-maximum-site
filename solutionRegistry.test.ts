import { describe, expect, it } from 'vitest';
import { createSolutionRegistry, parseSlidingWindowInput } from '../../../../features/solutions/solutionRegistry';

describe('createSolutionRegistry', () => {
  it('registers two independent solutions with valid teaching steps', () => {
    const registry = createSolutionRegistry();
    expect(registry.map(({ id }) => id)).toEqual(['brute-force', 'monotonic-deque']);
    expect(registry[0].steps).not.toBe(registry[1].steps);
    expect(registry[0].codes).not.toBe(registry[1].codes);
    expect(registry[0].thought).toContain('O(nk)');
    expect(registry[1].thought).toContain('O(n)');
    for (const solution of registry) {
      expect(solution.steps.length).toBeGreaterThan(10);
      for (const step of solution.steps) {
        expect(step.operation).toBeTruthy(); expect(step.narration).toBeTruthy(); expect(step.binding.anchorIds.length).toBeGreaterThan(0); expect(step.frame.metrics?.length).toBeGreaterThanOrEqual(2);
        const ids = step.frame.nodes.map(({ id }) => id); expect(new Set(ids).size).toBe(ids.length);
        expect(step.frame.nodes.filter(({ status }) => status === 'current').length).toBeLessThanOrEqual(1);
        expect(step.frame.nodes.filter(({ status }) => status === 'compare').length).toBeLessThanOrEqual(2);
        for (const container of step.frame.containers ?? []) expect(container.items.every((id) => ids.includes(id))).toBe(true);
      }
    }
  });
  it('validates constraints and rejects malformed input', () => {
    expect(parseSlidingWindowInput('{"nums":[1,3,-1],"k":2}')).toMatchObject({ valid: true, parsed: { nums: [1, 3, -1], k: 2 } });
    for (const raw of ['bad', '[]', '{"nums":[1],"k":2}', '{"nums":[1.5],"k":1}', '{"nums":[10001],"k":1}', '{"nums":[],"k":1}']) expect(parseSlidingWindowInput(raw).valid).toBe(false);
  });
  it('generates random input accepted by both solution validators', () => {
    const registry = createSolutionRegistry(); const raw = registry[0].generateRandom();
    for (const solution of registry) {
      expect(solution.validateInput(raw).valid).toBe(true);
      for (const language of ['java', 'python', 'go', 'javascript'] as const) expect(solution.codes[language].code).toContain('maxSlidingWindow');
    }
  });
});
