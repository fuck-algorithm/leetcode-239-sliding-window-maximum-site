import type { CodeArtifact, Language } from '../../types';

export function buildBruteForceCodes(): Record<Language, CodeArtifact> {
  return {
    java: {
      language: 'java',
      code: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // anchor:init
        int[] answer = new int[nums.length - k + 1];
        // anchor:window
        for (int left = 0; left + k <= nums.length; left++) {
            int best = nums[left];
            // anchor:compare
            for (int j = left + 1; j < left + k; j++) {
                // anchor:update
                if (nums[j] > best) best = nums[j];
            }
            // anchor:record
            answer[left] = best;
        }
        // anchor:return
        return answer;
    }
}`,
      anchorLineMap: { init: [3], window: [5], compare: [7], update: [9], record: [11], return: [14] }
    },
    python: {
      language: 'python',
      code: `class Solution:
    def maxSlidingWindow(self, nums, k):
        # anchor:init
        answer = []
        # anchor:window
        for left in range(len(nums) - k + 1):
            best = nums[left]
            # anchor:compare
            for j in range(left + 1, left + k):
                # anchor:update
                if nums[j] > best: best = nums[j]
            # anchor:record
            answer.append(best)
        # anchor:return
        return answer`,
      anchorLineMap: { init: [4], window: [6, 7], compare: [9], update: [11], record: [13], return: [15] }
    },
    go: {
      language: 'go',
      code: `func maxSlidingWindow(nums []int, k int) []int {
    // anchor:init
    answer := make([]int, 0, len(nums)-k+1)
    // anchor:window
    for left := 0; left+k <= len(nums); left++ {
        best := nums[left]
        // anchor:compare
        for j := left + 1; j < left+k; j++ {
            // anchor:update
            if nums[j] > best { best = nums[j] }
        }
        // anchor:record
        answer = append(answer, best)
    }
    // anchor:return
    return answer
}`,
      anchorLineMap: { init: [3], window: [5, 6], compare: [8], update: [10], record: [12], return: [15] }
    },
    javascript: {
      language: 'javascript',
      code: `function maxSlidingWindow(nums, k) {
  // anchor:init
  const answer = [];
  // anchor:window
  for (let left = 0; left + k <= nums.length; left++) {
    let best = nums[left];
    // anchor:compare
    for (let j = left + 1; j < left + k; j++) {
      // anchor:update
      if (nums[j] > best) best = nums[j];
    }
    // anchor:record
    answer.push(best);
  }
  // anchor:return
  return answer;
}`,
      anchorLineMap: { init: [3], window: [5, 6], compare: [8], update: [10], record: [12], return: [15] }
    }
  };
}
