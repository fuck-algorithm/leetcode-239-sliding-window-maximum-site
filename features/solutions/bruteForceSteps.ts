import type { AlgorithmStep, CanvasFrame, CanvasNode } from '../../types';
import type { SlidingWindowInput } from './solutionRegistry';

const ARRAY_X = 150;
const SLOT = 92;
const ARRAY_Y = 430;

type Event = {
  action: 'init' | 'window' | 'compare' | 'update' | 'record' | 'done';
  left: number;
  right: number;
  j: number;
  bestIndex: number;
  result: number[];
  message: string;
};

function simulate({ nums, k }: SlidingWindowInput): Event[] {
  const events: Event[] = [{ action: 'init', left: 0, right: -1, j: -1, bestIndex: -1, result: [], message: '准备逐个枚举长度为 k 的窗口，并扫描窗口内所有元素。' }];
  const result: number[] = [];
  for (let left = 0; left + k <= nums.length; left += 1) {
    const right = left + k - 1;
    let bestIndex = left;
    events.push({ action: 'window', left, right, j: left, bestIndex, result: [...result], message: `建立窗口 [${left}, ${right}]，从左端 nums[${left}]=${nums[left]} 开始作为当前最大值。` });
    for (let j = left + 1; j <= right; j += 1) {
      events.push({ action: 'compare', left, right, j, bestIndex, result: [...result], message: `比较 nums[${j}]=${nums[j]} 与当前最大值 nums[${bestIndex}]=${nums[bestIndex]}。` });
      if (nums[j] > nums[bestIndex]) {
        bestIndex = j;
        events.push({ action: 'update', left, right, j, bestIndex, result: [...result], message: `新值 ${nums[j]} 更大，更新窗口最大值索引为 ${bestIndex}。` });
      }
    }
    result.push(nums[bestIndex]);
    events.push({ action: 'record', left, right, j: right, bestIndex, result: [...result], message: `窗口 [${left}, ${right}] 扫描结束，将最大值 ${nums[bestIndex]} 写入结果。` });
  }
  events.push({ action: 'done', left: 0, right: nums.length - 1, j: -1, bestIndex: -1, result: [...result], message: `所有窗口逐一扫描完毕，返回 [${result.join(', ')}]。` });
  return events;
}

function buildFrame(input: SlidingWindowInput, event: Event): CanvasFrame {
  const { nums, k } = input;
  const nodes: CanvasNode[] = nums.map((value, index) => {
    const inWindow = event.left <= index && index <= event.right;
    const isFocus = index === event.j;
    const isBest = index === event.bestIndex && event.action !== 'init';
    const status = isFocus || ((event.action === 'init' || event.action === 'done') && index === 0) ? 'current' : isBest ? 'done' : inWindow ? 'visited' : 'idle';
    return { id: `a${index}`, label: String(value), x: ARRAY_X + index * SLOT, y: ARRAY_Y, badge: String(index), sublabel: `nums[${index}]`, status, radius: 27 };
  });
  if (event.bestIndex >= 0) nodes.push({ id: 'best', label: String(nums[event.bestIndex]), x: 1050, y: 190, badge: 'max', sublabel: `nums[${event.bestIndex}]`, status: event.action === 'record' || event.action === 'done' ? 'done' : 'visited', radius: 30 });
  else nodes.push({ id: 'best-null', label: 'null', x: 1050, y: 190, kind: 'null', badge: 'max', sublabel: '当前没有候选最大值', status: 'idle', radius: 30 });
  nodes.push(...event.result.map((value, index) => ({ id: `r${index}`, label: String(value), x: ARRAY_X + index * SLOT, y: 640, badge: String(index), sublabel: `窗口 ${index + 1}`, status: 'done' as const, radius: 23 })));
  const arrows = event.j >= 0 ? [
    { id: 'left-pointer', from: { x: ARRAY_X + event.left * SLOT, y: ARRAY_Y - 48 }, to: { x: ARRAY_X + event.left * SLOT, y: ARRAY_Y - 6 }, text: `L=${event.left}`, kind: 'pointer' as const },
    { id: 'right-pointer', from: { x: ARRAY_X + event.right * SLOT, y: ARRAY_Y - 48 }, to: { x: ARRAY_X + event.right * SLOT, y: ARRAY_Y - 6 }, text: `R=${event.right}`, kind: 'pointer' as const },
    { id: 'scan-pointer', from: { x: ARRAY_X + event.j * SLOT, y: ARRAY_Y + 44 }, to: { x: ARRAY_X + event.j * SLOT, y: ARRAY_Y + 8 }, text: `j=${event.j}`, kind: 'pointer' as const }
  ] : [];
  return {
    nodes, edges: [], arrows,
    labels: [{ id: 'window-label', targetId: 'a0', text: `暴力枚举窗口（k=${k}）`, detail: '每个窗口都重新扫描并比较全部元素', position: 'top', variant: 'callout', tone: 'accent' }],
    notes: [event.action === 'update' ? '当前最大值已更新' : event.action === 'record' ? `答案：${event.result.join(', ')}` : '按窗口左边界固定坐标排列'],
    metrics: [
      { label: '窗口左界', value: event.action === 'init' ? '—' : event.left },
      { label: '扫描位置', value: event.j < 0 ? '—' : event.j },
      { label: '结果数', value: event.result.length }
    ]
  };
}

const META = {
  init: { title: '初始化扫描', operation: 'init' as const, anchor: 'init' },
  window: { title: '枚举新窗口', operation: 'move' as const, anchor: 'window' },
  compare: { title: '比较窗口元素', operation: 'compare' as const, anchor: 'compare' },
  update: { title: '更新当前最大值', operation: 'match' as const, anchor: 'update' },
  record: { title: '写入窗口最大值', operation: 'insert' as const, anchor: 'record' },
  done: { title: '返回答案', operation: 'done' as const, anchor: 'return' }
};

export function buildBruteForceSteps(input: SlidingWindowInput): AlgorithmStep[] {
  return simulate(input).map((event, id) => {
    const meta = META[event.action];
    return {
      id,
      title: meta.title,
      description: event.message,
      narration: event.message,
      operation: meta.operation,
      binding: { anchorIds: [meta.anchor], variables: { left: event.left, right: event.right, j: event.j, maxIndex: event.bestIndex, result: event.result } },
      frame: buildFrame(input, event)
    };
  });
}
