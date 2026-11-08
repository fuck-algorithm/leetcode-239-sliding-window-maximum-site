# LeetCode 239 算法可视化验收报告

## 基本信息

- 源码仓库：https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum（private）
- Pages 仓库：https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum-site（public，仅静态前端）
- 首页：https://fuck-algorithm.github.io/leetcode-239-sliding-window-maximum-site/
- Pages 最新成功 Actions：[42511737280](https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum-site/actions/runs/42511737280)，commit `1c6e78f`
- 本报告对应源码工作树，本仓库改动尚未提交。

## 最终判定模型（B1-B7）

## 验收轮次记录

| Round | 缺陷 | 修复和复测 |
|---|---|---|
| 1 | Space 焦点过滤、进度拖拽没有鼠标移动 | 调整播放键盘处理及拖拽终点；E2E 全量通过。 |
| 2 | 浏览器直接请求 GitHub API 有跨域/限流 | 改用 Actions 构建期同源 JSON、IndexedDB 缓存、过期缓存及 0 回退；新增 4 个组件单测。 |
| 3 | Actions 缺 Chromium、Star JSON 目录不存在 | Workflow 安装 Playwright 并创建目录，后续 Actions 成功发布。 |
| 4 | null 槽位未画出、焦点测试证据不足 | 两种解法均绘制初始 null 节点；每帧焦点规则增加单测，AC-023 专项 E2E 覆盖 null、稳定 ID、60% 坐标重用、快速切换无重复、reduced-motion。 |
| 5 | Workflow Star 命令中的 YAML 冒号解析 | 将 shell run 改成 folded scalar；部署 workflow 成功执行。 |
| 6 | 首次 AC-023 专项测试把 null 检查放到播放后，节点已正常退场 | 把 null 断言移至初始化帧；专项 2/2 通过，最终 17 项 E2E 通过。 |

## AC-001 ~ AC-023 逐项结论

| AC | 结果 | 证据 |
|---|---|---|
| AC-001 | PASS | E2E-001 + Chromium：1920×1080/1366×768 无纵向滚动；1366 画布 586/768=76.3%、SVG 484/768=63.0%；1920 画布 898/1080=83.1%、SVG 796/1080=73.7%；宽度份额达标。截图 `/tmp/leetcode239-1366.png`、`/tmp/leetcode239-1920.png`。 |
| AC-002 | PASS | E2E-002：标题含题号及中文标题，LeetCode 链接新标签。 |
| AC-003 | PASS | E2E-002：Hot 100 URL 正确且新标签。 |
| AC-004 | PASS | E2E-002/014：GitHub 徽标目标为私有源码仓库并新标签。 |
| AC-005 | PASS | `GitHubBadge.test.tsx` 4 项：3600s TTL、同源 JSON、缓存命中、过期缓存回退、无缓存 0；源仓库当前 Star=0，线上 JSON 相符。 |
| AC-006 | PASS | E2E-011 与 registry 单测：暴力 O(nk)/单调队列 O(n) 具有独立代码、步骤和变量；切换往返重置 Step 1。 |
| AC-007 | PASS | E2E-003/004 与 validator 单测：非法不更新，合法、样例、随机输入正常。 |
| AC-008 | PASS | E2E-005/006：Java/Python/Go/JavaScript、默认 Java、语言记忆、行号/当前行高亮/变量旁注。 |
| AC-009 | PASS | E2E-009 验证 pan/zoom；AC-023 专项 E2E 验证初始 null 节点，渲染器有对应 null 样式。 |
| AC-010 | PASS | 两套快照显示变化中的队列/最大值/结果；E2E-006/011 覆盖联动和切换。 |
| AC-011 | PASS | E2E-007/008 验证四个快捷键及进度拖拽。 |
| AC-012 | PASS | E2E-013 验证 2x 刷新保留。 |
| AC-013 | PASS | E2E-012 验证 QR 可见、原始比例和构建资源。 |
| AC-014 | PASS | `qa:guard`/E2E-015 无紫色。 |
| AC-015 | PASS | Pages repo 有 deploy.yml；Actions 42511737280 success，执行构建及 configure/upload/deploy。 |
| AC-016 | PASS | 本轮 fresh lint/type-check/build 均 exit 0。 |
| AC-017 | PASS | 本轮 fresh `npm run test:e2e` 17/17。 |
| AC-018 | PASS | README 只有标题、一句话、演示链接。 |
| AC-019 | PASS | `test:coverage` 48 tests：lines 94.54%、functions 96.87%、branches 91.76%。 |
| AC-020 | PASS | `tests/unit/` 有多个 TS/TSX 测试。 |
| AC-021 | PASS | package scripts、Vitest dependency/config 存在。 |
| AC-022 | PASS | 两种 solution registry 对合法/非法/随机数据共用 validator，测试逐解法检查。 |
| AC-023 | PASS | 专项 E2E：每帧 1 current、compare≤2、node IDs 稳定、相邻帧重合≥60%、初始化 null 可见、3 次快速切换后无重复 ID、reduced motion 保留徽标/解说/图例/焦点。另有真实播放视频。 |

## B1-B7 Gate

| Gate | 结果 | 证据 |
|---|---|---|
| B1 无一票否决 | PASS | 布局、焦点、motion 检查均通过；线上 Chromium console 无错误。 |
| B2 lint/type-check/build/coverage/E2E | PASS | 本轮命令均 exit 0。 |
| B3 E2E 必过集合 | PASS | 17/17（15 通用 + 2 AC-023）。 |
| B4 所有 AC | PASS | AC-001~023 全 PASS。 |
| B5 P0/P1 为 0 | PASS | 无已知未修复 P0/P1。 |
| B6 Rubric ≥80 | PASS | 按 rubric 权重计算 82/100。 |
| B7 证据完整 | PASS | 命令、截图、视频、reduced-motion、快切 DOM 和 Actions 发布均有证据。 |

### Rubric（0–5 分，按权重折算）

| 项目 | 分数 | 权重 | 加权分 |
|---|---:|---:|---:|
| 首屏信息架构 | 4 | 10% | 8 |
| 分镜清晰度 | 4 | 15% | 12 |
| 代码同步准确性 | 4 | 15% | 12 |
| 画布信息密度 | 4 | 15% | 12 |
| 交互可控性 | 4 | 10% | 8 |
| 多解法可比性 | 4 | 10% | 8 |
| 稳定性 | 4 | 10% | 8 |
| 工程发布质量 | 4 | 10% | 8 |
| 文档完整性 | 4 | 5% | 4 |
| **综合分** |  | **100%** | **82/100** |

## 本轮 fresh 验证

```text
npm run qa:guard       PASS
npm run lint           PASS
npm run type-check     PASS
npm run build          PASS
npm run test:coverage  PASS — 48 tests; 94.54% / 96.87% / 91.76%
npm run test:e2e       PASS — 17/17
```

## 浏览器与部署证据

- 双视口截图：`/tmp/leetcode239-1366.png`、`/tmp/leetcode239-1920.png`。
- 上线双解法截图：`/tmp/leetcode239-live-two-solutions.png`；快速切换 DOM：`/tmp/leetcode239-evidence/rapid-solution-switch.png`。
- 1x/3x 截图及视频：`/tmp/leetcode239-evidence/1x.png`、`3x.png`、`page@21155cdeec25915019d54818a66db4dd.webm`、`page@5daec82e8714e82859e89a2f01212378.webm`。
- reduced motion：`/tmp/leetcode239-evidence/reduced-motion.png`；专项测试截图 `test-results/reduced-motion.png`。
- Actions 42511737280 success；Pages `built`，线上 HTTP 200。源仓库维持 private；部署页通过同源 JSON 取 Star，当前为真实值 0。

## 最终结论

AC-001~AC-023 全部 PASS；B1-B7 全部 PASS；Rubric 82/100。**最终结论：PASS。**

如果任意 AC/Gate 后续回归失败，唯一允许的总验收状态为 FAIL；不得以本次 PASS 覆盖失败证据。
