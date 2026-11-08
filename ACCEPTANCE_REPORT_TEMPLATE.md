# LeetCode 239 可视化验收报告

## 基本信息

- 日期：2026-11-09
- 仓库：https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum
- 发布站点：https://fuck-algorithm.github.io/leetcode-239-sliding-window-maximum-site/
- 工作树尚未提交。

## 最终判定模型（B1-B7）

## 验收轮次记录

## Gate 判定

| Gate | 结果 | 证据 |
|---|---|---|
| B1 无一票否决 | FAIL | GitHub REST API 匿名请求在此出口 IP 返回 403 rate limit，浏览器 console 留有 HTTP 错误 |
| B2 lint/type-check/build/coverage/E2E | PASS | `qa:guard`、lint、type-check、build、coverage、E2E 命令均 exit 0 |
| B3 15 项 E2E | PASS | `npm run test:e2e`：15/15 通过 |
| B4 AC-001~AC-023 | FAIL | API 限流影响 AC-005；静态 Pages 仓库没有 deploy.yml 工作流因此 AC-015 未证实；AC-023 需 1x/3x 及 reduced-motion 证据 |
| B5 P0/P1 为 0 | FAIL | GitHub API 403 限流为用户可见网络错误；尚非应用崩溃 |
| B6 Rubric >=80 | FAIL | 未完整完成人工 Rubric 评分；不虚报通过 |
| B7 证据完整 | FAIL | 有桌面视口截图及命令输出；缺 1x/3x 录屏、reduced-motion 录屏/截图和组织 Actions 成功记录 |

## 检查结果

- Playwright 15 条全通过；单测 44 条全通过。
- Coverage：lines 94.51%、functions 96.87%、branches 91.58%，超过 60/60/50 门槛。
- 已实装暴力枚举 O(nk) 与单调双端队列 O(n) 两种独立解法；Playwright E2E-011 和 registry 单测验证了切换、步骤重置、代码/轨迹隔离。
- 桌面实测：1366×768 画布卡片 588px（76.6%）、SVG 484px（63.0%）、无滚动；1920×1080 画布 900px（83.3%）、SVG 796px（73.7%）、无滚动。
- 真实页面截图：`/tmp/leetcode239-1366.png`、`/tmp/leetcode239-1920.png`、`/tmp/leetcode239-evidence/rapid-solution-switch.png`。
- 动效证据：`/tmp/leetcode239-evidence/1x.png`、`3x.png`、`reduced-motion.png`；录屏分别为 `/tmp/leetcode239-evidence/page@21155cdeec25915019d54818a66db4dd.webm` 与 `/tmp/leetcode239-evidence/page@5daec82e8714e82859e89a2f01212378.webm`。
- 真实页面路径：`http://127.0.0.1:41737/leetcode-239-sliding-window-maximum-site/`；资源与二维码正常加载。GitHub API 403 由 GitHub rate-limit response 确认。

## 失败轮次

| Round | 问题 | 处理与复测 |
|---|---|---|
| 3 | 原注册表只有一种解法；E2E-011 仅验证返回 Step 1 | 增加独立暴力解法、四语言代码和轨迹；增强 registry 单测和 E2E-011，验证切换与重置，全量通过 |
| 4 | GitHub API 匿名请求返回 403 | 增加 HTML 备用来源；浏览器仍看到 API 403，但回退源受 CORS 限制，展示缓存值/0，仍记录 FAIL |
| 5 | 静态 Pages 仓库没有 deploy.yml 工作流 | `gh workflow run deploy.yml` 返回 HTTP 404；Pages 当前站点保持 built/HTTP 200，但本次新 UI 尚未发布，记录 FAIL |

| Round | 缺陷 | 修复 / 复测 |
|---|---|---|
| 1 | Space 在播放按钮聚焦时被快捷键焦点保护过滤；一些 compare 快照没有 current；进度拖动测试只 mouseDown/up 不触发 mousemove | 按钮焦点不再阻断播放热键；启动帧有 current、焦点状态加单测；进度条 mouseup 终点定位；完整 15 项 E2E 通过 |
| 2 | 匿名 GitHub API 403 | 确认为外部公共 API 限流；保留 IndexedDB 缓存与 0 回退。控制台仍报网络错误，记录为未通过而非伪称解决 |

## 最终结论

**FAIL**。工程测试、覆盖率和桌面空间预算合格，但 B1/B4/B5/B6/B7 未全部满足。不得宣称 LeetCode Skill 的完整 PASS 验收。
