# LeetCode 239 算法可视化验收报告

## 基本信息

- 源码仓库：https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum（private）
- Pages 仓库：https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum-site（public，仅静态前端）
- 首页：https://fuck-algorithm.github.io/leetcode-239-sliding-window-maximum-site/
- Pages 发布提交：`1e5c058`；成功 Actions：[#42508936792](https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum-site/actions/runs/42508936792)
- 本报告对应当前源码工作树（未提交）。

## 最终判定模型（B1-B7）

## 验收轮次记录

| Round | 缺陷 | 修复及复测 |
|---|---|---|
| 1 | 播放按钮聚焦时 Space 被过滤；进度拖拽仅 mouseDown/up 未移动 | 保留播放按钮热键、mouseup 补足拖动终点；E2E 全量回归。 |
| 2 | Star API 浏览器跨域/限流 | 改为构建期生成同源 JSON、IndexedDB 3600 秒缓存、过期值/0 回退；组件单测覆盖。 |
| 3 | Actions 缺 Playwright 浏览器、Star JSON 写入目录问题 | 工作流安装 Chromium、创建 JSON 目录；Actions 42508936792 全流程成功。 |
| 4 | 空候选焦点缺失，AC-023 没有自动化逐帧证据 | 两解法每帧唯一 current；空 max 明确画 null；新增 AC-023 专项 E2E，覆盖 stable ID、60% 位置复用、快速切换无残留、reduced motion。 |
| 5 | 首次完整门禁发现 null 检查在播放后才执行，节点已被下一帧移除 | 将断言移至初始化帧；专项 2/2 通过，随后执行完整门禁。 |

## AC-001 ~ AC-023 逐项判定

| AC | 结果 | 新鲜证据 |
|---|---|---|
| AC-001 | PASS | E2E-001 在 1920×1080、1366×768 实测无滚动；1366 画布 588/768=76.6%、SVG 484/768=63%；1920 画布 900/1080=83.3%、SVG 796/1080=73.7%；截图 `/tmp/leetcode239-1366.png`、`/tmp/leetcode239-1920.png`。 |
| AC-002 | PASS | E2E-002：LeetCode 239 中文标题、题目 URL、新标签。 |
| AC-003 | PASS | E2E-002：Hot 100 URL 正确、新标签。 |
| AC-004 | PASS | E2E-002/014：GitHub 徽标指向私有源仓库、新标签。 |
| AC-005 | PASS | `tests/unit/components/header/GitHubBadge.test.tsx` 4 项测试：3600 秒 TTL、同源 JSON、命中缓存、过期缓存回退、无缓存 0；源仓库与线上静态 JSON 当前均为 0。 |
| AC-006 | PASS | E2E-011：暴力 O(nk) / 单调队列 O(n) 代码、步骤、变量映射独立；来回切换重置。 |
| AC-007 | PASS | E2E-003/004 和 validator 单测覆盖错误输入无更新、合法输入、样例、随机输入。 |
| AC-008 | PASS | E2E-005/006：四语言、默认 Java、刷新记忆、行号/高亮/变量旁注。 |
| AC-009 | PASS | E2E-009 验证 pan/zoom；专用 motion E2E 验证初始帧 null 节点及下方结构槽。 |
| AC-010 | PASS | 算法步骤每帧快照更新队列/最大值/结果；E2E-006/011 与 AC-023 专项覆盖。 |
| AC-011 | PASS | E2E-007/008 验证 Left/Right/Space/R、进度拖拽。 |
| AC-012 | PASS | E2E-013 验证 2x 持久化。 |
| AC-013 | PASS | E2E-012 验证 QR 资源构建可见与宽高比。 |
| AC-014 | PASS | qa:guard + E2E-015 无紫色。 |
| AC-015 | PASS | Pages 仓库 `deploy.yml` 含依赖、测试、构建、configure/upload/deploy；Actions 42508936792 success，线上 HTTP 200。 |
| AC-016 | PASS | 本轮 fresh lint/type-check/build exit 0。 |
| AC-017 | PASS | 本轮 fresh Playwright 17/17。 |
| AC-018 | PASS | README 精简为标题、一句话说明、线上链接。 |
| AC-019 | PASS | coverage 48 tests：lines 94.54%、functions 96.87%、branches 91.76%。 |
| AC-020 | PASS | tests/unit 有多个 `.test.ts/.tsx`。 |
| AC-021 | PASS | package scripts、Vitest 依赖与配置齐全。 |
| AC-022 | PASS | 两种解法逐一验证合法/非法输入与随机生成共用 validator。 |
| AC-023 | PASS | 新增 `animation-acceptance.spec.ts`：逐帧 current=1、compare≤2、稳定 ID、相邻节点位置重合率≥60%、空 null 节点、3 次快速切换无重复 ID、reduced-motion 下操作/解说/图例/代码焦点齐全。另有 1x/3x 视频与截图。 |

## B1-B7 判定

| Gate | 结果 | 证据 |
|---|---|---|
| B1 一票否决项为 0 | PASS | AC-001/009/023 证据通过，线上 Chromium console 无错误。 |
| B2 工程命令全绿 | PASS | qa:guard、lint、type-check、build、coverage、E2E 全 exit 0。 |
| B3 Playwright 15/15 必过 | PASS | 通用 15 项全过，另有 AC-023 专项 2 项；总共 17 项通过。 |
| B4 AC-001~023 | PASS | 上表全 PASS。 |
| B5 P0/P1 缺陷为 0 | PASS | 本轮无遗留 P0/P1。 |
| B6 Rubric ≥80 | PASS | 按下方 Rubric 加权 82/100。 |
| B7 证据完整 | PASS | 命令、双分辨率截图、播放视频、reduced-motion、快速切换 DOM、成功 Actions 均有路径/链接。 |

### Rubric（0–5 分；权重折算）

| 项目 | 分 | 权重 | 加权 |
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
| **总计** |  | **100%** | **82/100** |

## 本轮 fresh 命令输出摘要

```text
npm run qa:guard       PASS
npm run lint           PASS
npm run type-check     PASS
npm run build          PASS
npm run test:coverage  PASS — 48 tests, 94.54% / 96.87% / 91.76%
npm run test:e2e       PASS — 17 passed
```

## 浏览器与线上证据

- 视口截图：`/tmp/leetcode239-1366.png`、`/tmp/leetcode239-1920.png`、`/tmp/leetcode239-live-two-solutions.png`。
- 动效截图：`/tmp/leetcode239-evidence/1x.png`、`3x.png`、`reduced-motion.png`、`rapid-solution-switch.png`；AC-023 专项 E2E 额外产出 reduced-motion 截图于 `test-results/reduced-motion.png`。
- 视频：`/tmp/leetcode239-evidence/page@21155cdeec25915019d54818a66db4dd.webm`、`/tmp/leetcode239-evidence/page@5daec82e8714e82859e89a2f01212378.webm`。
- Pages Actions：[#42508936792](https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum-site/actions/runs/42508936792)，success；Pages status=built；首页 HTTP 200。
- 私有源码仍为 private；页面读取同源 Star JSON，浏览器不请求 GitHub API；当前源 Stars 为 0，线上 JSON 一致。

## 最终结论

本轮 AC-001~AC-023 全部 PASS，B1-B7 全部 PASS，Rubric 82/100。**最终结论：PASS。**

按统一验收规则，任何 AC 或 Gate 出现 FAIL 时总体验收结果为 **FAIL**。
