import { describe, expect, it } from 'vitest';
import { createSolutionRegistry, parseSlidingWindowInput } from './solutionRegistry';

describe('LeetCode 239 solution registry', () => {
  it('accepts valid constrained data and rejects invalid input', () => {
    expect(parseSlidingWindowInput('{"nums":[1,3,-1],"k":2}')).toMatchObject({ valid: true, parsed: { nums: [1, 3, -1], k: 2 } });
    for (const raw of ['bad', '[]', '{"nums":[1],"k":2}', '{"nums":[1.5],"k":1}', '{"nums":[10001],"k":1}', '{"nums":[],"k":1}']) {
      expect(parseSlidingWindowInput(raw).valid).toBe(false);
    }
  });

  it('generates valid random inputs and complete unique steps', () => {
    const solution = createSolutionRegistry()[0];
    expect(solution.validateInput(solution.generateRandom()).valid).toBe(true);
    expect(solution.steps.length).toBeGreaterThan(10);
    expect(solution.steps.every((step) => step.operation && step.narration && step.binding.anchorIds.length)).toBe(true);
    expect(solution.codes.java.code).toContain('maxSlidingWindow');
    for (const step of solution.steps) {
      expect(new Set(step.frame.nodes.map((node) => node.id)).size).toBe(step.frame.nodes.length);
      for (const container of step.frame.containers ?? []) {
        expect(container.items.every((id) => step.frame.nodes.some((node) => node.id === id))).toBe(true);
      }
    }
  });
});
