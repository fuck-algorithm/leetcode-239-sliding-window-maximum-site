import type { InputValidationResult, SolutionDefinition } from '../../types';
import { buildSampleCodes } from './sampleCodes';
import { buildSampleSteps } from './sampleSteps';
import { buildBruteForceSteps } from './bruteForceSteps';
import { buildBruteForceCodes } from './bruteForceCodes';

export type SlidingWindowInput = { nums: number[]; k: number };

export function parseSlidingWindowInput(raw: string): InputValidationResult {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || !('nums' in parsed) || !('k' in parsed)) {
      return { valid: false, error: '输入格式应为 {"nums":[1,3,-1],"k":2}' };
    }
    const { nums, k } = parsed as SlidingWindowInput;
    if (!Array.isArray(nums) || nums.length < 1 || nums.length > 100000 || !nums.every(Number.isInteger)) {
      return { valid: false, error: 'nums 必须是 1–100000 个整数' };
    }
    if (!nums.every((value) => value >= -10000 && value <= 10000)) {
      return { valid: false, error: 'nums 中每个值须在 -10000 到 10000 之间' };
    }
    if (!Number.isInteger(k) || k < 1 || k > nums.length) {
      return { valid: false, error: 'k 必须是 1 到数组长度之间的整数' };
    }
    return { valid: true, parsed: { nums, k } };
  } catch {
    return { valid: false, error: '输入格式错误，请输入合法 JSON' };
  }
}

export function randomSlidingWindowInput(): string {
  const length = 5 + Math.floor(Math.random() * 4);
  const nums = Array.from({ length }, () => Math.floor(Math.random() * 21) - 10);
  const k = 1 + Math.floor(Math.random() * length);
  return JSON.stringify({ nums, k });
}

export function createSolutionRegistry(): SolutionDefinition[] {
  const samples = [
    { id: 's1', label: 'LeetCode 示例', value: '{"nums":[1,3,-1,-3,5,3,6,7],"k":3}' },
    { id: 's2', label: '单元素窗口', value: '{"nums":[1],"k":1}' }
  ];
  return [
    {
      id: 'brute-force',
      name: '暴力枚举 · O(nk)',
      thought: '枚举每个长度为 k 的窗口，再扫描窗口内的全部元素寻找最大值。每个窗口耗时 O(k)，共 O(n) 个窗口，因此时间复杂度 O(nk)，额外空间 O(1)（不计返回数组）。',
      samples,
      codes: buildBruteForceCodes(),
      steps: buildBruteForceSteps({ nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }),
      validateInput: parseSlidingWindowInput,
      generateRandom: randomSlidingWindowInput
    },
    {
      id: 'monotonic-deque',
      name: '单调双端队列 · O(n)',
      thought: '使用双端队列保存数组下标，并保证对应数值单调递减。每个下标最多入队、出队各一次：过期索引从队首移除，新元素入队前从队尾淘汰更小值。窗口形成后，队首就是最大值。时间复杂度 O(n)，空间复杂度 O(k)。',
      samples,
      codes: buildSampleCodes(),
      steps: buildSampleSteps(),
      validateInput: parseSlidingWindowInput,
      generateRandom: randomSlidingWindowInput
    }
  ];
}
