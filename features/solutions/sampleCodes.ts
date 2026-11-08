import type { CodeArtifact, Language } from '../../types';

export function buildSampleCodes(): Record<Language, CodeArtifact> {
  return {
    java: {
      language: 'java',
      code: `class Solution {
    public int[] maxSlidingWindow(int[] nums, int k) {
        // anchor:init
        Deque<Integer> deque = new ArrayDeque<>();
        int[] answer = new int[nums.length - k + 1];
        // anchor:expire
        for (int i = 0; i < nums.length; i++) {
            while (!deque.isEmpty() && deque.peekFirst() <= i - k) deque.pollFirst();
            // anchor:compare
            while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) deque.pollLast();
            // anchor:enqueue
            deque.offerLast(i);
            // anchor:record
            if (i >= k - 1) answer[i - k + 1] = nums[deque.peekFirst()];
        }
        // anchor:return
        return answer;
    }
}`,
      anchorLineMap: { init: [3, 4], expire: [6], compare: [8], enqueue: [10], record: [12], return: [15] }
    },
    python: {
      language: 'python',
      code: `from collections import deque

class Solution:
    def maxSlidingWindow(self, nums, k):
        # anchor:init
        q, answer = deque(), []
        # anchor:expire
        for i, value in enumerate(nums):
            while q and q[0] <= i - k: q.popleft()
            # anchor:compare
            while q and nums[q[-1]] < value: q.pop()
            # anchor:enqueue
            q.append(i)
            # anchor:record
            if i >= k - 1: answer.append(nums[q[0]])
        # anchor:return
        return answer`,
      anchorLineMap: { init: [6], expire: [8], compare: [10], enqueue: [12], record: [14], return: [16] }
    },
    go: {
      language: 'go',
      code: `func maxSlidingWindow(nums []int, k int) []int {
    // anchor:init
    deque, answer := []int{}, []int{}
    // anchor:expire
    for i, value := range nums {
        if len(deque) > 0 && deque[0] <= i-k { deque = deque[1:] }
        // anchor:compare
        for len(deque) > 0 && nums[deque[len(deque)-1]] < value { deque = deque[:len(deque)-1] }
        // anchor:enqueue
        deque = append(deque, i)
        // anchor:record
        if i >= k-1 { answer = append(answer, nums[deque[0]]) }
    }
    // anchor:return
    return answer
}`,
      anchorLineMap: { init: [3], expire: [5], compare: [7], enqueue: [9], record: [11], return: [14] }
    },
    javascript: {
      language: 'javascript',
      code: `function maxSlidingWindow(nums, k) {
  // anchor:init
  const deque = [], answer = [];
  // anchor:expire
  for (let i = 0; i < nums.length; i++) {
    while (deque.length && deque[0] <= i - k) deque.shift();
    // anchor:compare
    while (deque.length && nums[deque.at(-1)] < nums[i]) deque.pop();
    // anchor:enqueue
    deque.push(i);
    // anchor:record
    if (i >= k - 1) answer.push(nums[deque[0]]);
  }
  // anchor:return
  return answer;
}`,
      anchorLineMap: { init: [3], expire: [5], compare: [7], enqueue: [9], record: [11], return: [14] }
    }
  };
}
