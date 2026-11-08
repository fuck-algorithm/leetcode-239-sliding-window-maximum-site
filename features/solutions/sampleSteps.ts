import type { AlgorithmStep, CanvasFrame, CanvasNode } from '../../types';
import { createQueue } from '../animation/structures';

type Action = 'init' | 'read' | 'compare' | 'remove' | 'enqueue' | 'match' | 'done';
type Snapshot = { action: Action; i: number; deque: number[]; result: number[]; removed?: number; compared?: number; message: string };

const ARRAY_Y = 490;
const SLOT = 92;
const START_X = 120;
const QUEUE_X = 144;

function simulate(nums: number[], k: number): Snapshot[] {
  const frames: Snapshot[] = [{ action: 'init', i: -1, deque: [], result: [], message: '初始化单调递减索引队列与结果数组。' }];
  const deque: number[] = [];
  const result: number[] = [];
  for (let i = 0; i < nums.length; i += 1) {
    frames.push({ action: 'read', i, deque: [...deque], result: [...result], message: `读取 nums[${i}] = ${nums[i]}，准备维护当前窗口候选。` });
    if (deque.length) {
      const head = deque[0];
      frames.push({ action: 'compare', i, deque: [...deque], result: [...result], compared: head, message: `检查队首索引 ${head} 是否早于窗口左界 ${i - k + 1}。` });
    }
    while (deque.length && deque[0] <= i - k) {
      const removed = deque.shift()!;
      frames.push({ action: 'remove', i, deque: [...deque], result: [...result], removed, message: `索引 ${removed} 已离开窗口，因此从队首过期移除。` });
    }
    while (deque.length) {
      const tail = deque[deque.length - 1];
      frames.push({ action: 'compare', i, deque: [...deque], result: [...result], compared: tail, message: `比较队尾值 ${nums[tail]} 与新值 ${nums[i]}，判断旧候选是否仍有用。` });
      if (nums[tail] >= nums[i]) break;
      const removed = deque.pop()!;
      frames.push({ action: 'remove', i, deque: [...deque], result: [...result], removed, message: `nums[${removed}]=${nums[removed]} 更小且更早，未来不可能胜过新值，故从队尾淘汰。` });
    }
    deque.push(i);
    frames.push({ action: 'enqueue', i, deque: [...deque], result: [...result], message: `将索引 ${i} 入队，队列对应值保持单调递减。` });
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
      frames.push({ action: 'match', i, deque: [...deque], result: [...result], message: `窗口 [${i - k + 1}, ${i}] 最大值是队首 nums[${deque[0]}]=${nums[deque[0]]}。` });
    }
  }
  frames.push({ action: 'done', i: nums.length - 1, deque: [...deque], result: [...result], message: `所有窗口处理完毕，返回结果 [${result.join(', ')}]。` });
  return frames;
}

function describe(action: Action): { title: string; operation: AlgorithmStep['operation']; anchor: string } {
  const map: Record<Action, { title: string; operation: AlgorithmStep['operation']; anchor: string }> = {
    init: { title: '初始化候选队列', operation: 'init', anchor: 'init' },
    read: { title: '读取新元素', operation: 'read', anchor: 'expire' },
    compare: { title: '比较候选索引', operation: 'compare', anchor: 'compare' },
    remove: { title: '淘汰无效候选', operation: 'remove', anchor: 'compare' },
    enqueue: { title: '加入当前索引', operation: 'enqueue', anchor: 'enqueue' },
    match: { title: '记录窗口最大值', operation: 'match', anchor: 'record' },
    done: { title: '返回所有窗口结果', operation: 'done', anchor: 'return' }
  };
  return map[action];
}

function makeFrame(nums: number[], k: number, snapshot: Snapshot): CanvasFrame {
  const { action, i, deque, result, removed, compared } = snapshot;
  const nodes: CanvasNode[] = nums.map((value, index) => ({
    id: `a${index}`, label: String(value), x: START_X + index * SLOT, y: ARRAY_Y,
    badge: String(index), sublabel: `nums[${index}]`,
    status: index === compared || index === removed || (index === i && action === 'compare') ? 'compare' : index === i || (action === 'init' && index === 0) ? 'current' : index < i ? 'visited' : 'idle', radius: 27
  }));
  let comparedQueueId: string | undefined;
  if (action === 'compare' && compared !== undefined) {
    comparedQueueId = `q${compared}`;
    const focusedCount = nodes.filter((node) => node.status === 'compare').length;
    if (focusedCount >= 2) comparedQueueId = undefined;
  }
  const queueItems = deque.map((index) => ({
    id: `q${index}`, label: String(nums[index]), badge: String(index), sublabel: `索引 ${index}`,
    status: action === 'match' || action === 'done' ? 'done' as const : `q${index}` === comparedQueueId ? 'compare' as const : 'visited' as const, radius: 24
  }));
  const queue = createQueue({ id: 'deque', x: QUEUE_X, y: 125, items: queueItems, capacity: Math.max(6, Math.min(nums.length, 9)), width: 720, height: 120, title: '单调递减双端队列：队首 → 队尾', emptyText: '空队列：等待候选索引' });
  nodes.push(...queue.nodes);
  const answerNodes: CanvasNode[] = result.map((value, index) => ({
    id: `r${index}`, label: String(value), x: START_X + index * SLOT, y: 650, badge: String(index), sublabel: `窗口 ${index + 1}`, status: 'done', radius: 23
  }));
  nodes.push(...answerNodes);
  const left = i < 0 ? 0 : Math.max(0, i - k + 1);
  const arrows = i >= 0 ? [
    { id: 'pointer-left', from: { x: START_X + left * SLOT, y: ARRAY_Y - 42 }, to: { x: START_X + left * SLOT, y: ARRAY_Y - 4 }, text: `L=${left}`, kind: 'pointer' as const },
    { id: 'pointer-right', from: { x: START_X + i * SLOT, y: ARRAY_Y - 42 }, to: { x: START_X + i * SLOT, y: ARRAY_Y - 4 }, text: `R=${i}`, kind: 'pointer' as const }
  ] : [];
  return {
    nodes, edges: [], arrows, containers: queue.containers,
    labels: [{ id: 'array-label', targetId: 'a0', text: `数组 nums（k=${k}）`, detail: '窗口右边界随索引 i 向右移动', position: 'top', variant: 'callout', tone: 'accent' }],
    notes: [removed !== undefined ? `本步淘汰索引 ${removed}` : action === 'match' ? `答案：${result.join(', ')}` : '保持原有元素坐标，队列按固定槽位显示'],
    metrics: [{ label: '当前索引', value: i < 0 ? '—' : i }, { label: '队列候选', value: deque.length }, { label: '已生成窗口', value: result.length }]
  };
}

export function buildSampleSteps(raw = '[1,3,-1,-3,5,3,6,7], k=3'): AlgorithmStep[] {
  const match = raw.match(/^\s*(\[[\s\S]*\])\s*,\s*k\s*=\s*(\d+)\s*$/);
  const nums = match ? JSON.parse(match[1]) as number[] : [1, 3, -1, -3, 5, 3, 6, 7];
  const k = match ? Number(match[2]) : 3;
  return simulate(nums, k).map((snapshot, id) => {
    const meta = describe(snapshot.action);
    return {
      id, title: meta.title, description: snapshot.message, narration: snapshot.message,
      operation: meta.operation,
      binding: { anchorIds: [meta.anchor], variables: { i: snapshot.i, deque: snapshot.deque.map((index) => `${index}:${nums[index]}`), result: snapshot.result, k } },
      frame: makeFrame(nums, k, snapshot)
    };
  });
}
