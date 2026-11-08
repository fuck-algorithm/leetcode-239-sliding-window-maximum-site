import { useEffect, useMemo, useState } from 'react';
import { ProblemHeader } from './components/header/ProblemHeader';
import { GitHubBadge } from './components/header/GitHubBadge';
import { AlgorithmThoughtModal } from './components/overlay/AlgorithmThoughtModal';
import { DataInputBar } from './components/input/DataInputBar';
import { VisualizationCanvas } from './components/canvas/VisualizationCanvas';
import { CodePanel } from './components/code/CodePanel';
import { PlaybackControls } from './components/controls/PlaybackControls';
import { CommunityFloat } from './components/overlay/CommunityFloat';
import { usePlayback } from './features/playback/usePlayback';
import { createSolutionRegistry } from './features/solutions/solutionRegistry';
import { buildSampleSteps } from './features/solutions/sampleSteps';
import { buildBruteForceSteps } from './features/solutions/bruteForceSteps';
import type { SlidingWindowInput } from './features/solutions/solutionRegistry';
import type { Language, ProblemConfig, ProblemData, SolutionDefinition } from './types';

/**
 * 注意:
 * 1) App 仅做页面编排，不做重逻辑
 * 2) 具体算法动画、代码映射、输入校验都应在 feature/component 层实现
 * 3) 题目有多种解法时，每种解法必须有独立 SolutionDefinition（独立步骤与画布渲染）
 */
const PROBLEM_CONFIG: ProblemConfig = {
  number: Number('239'),
  title: '滑动窗口最大值',
  slug: 'sliding-window-maximum',
  leetcodeUrl: 'https://leetcode.cn/problems/sliding-window-maximum/',
  hot100Url: 'https://fuck-algorithm.github.io/leetcode-hot-100/',
  githubRepoUrl: 'https://github.com/fuck-algorithm/leetcode-239-sliding-window-maximum'
};

const DEFAULT_LANGUAGE: Language = 'java';

function App() {
  const [inputData, setInputData] = useState<ProblemData | null>(null);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('leetcode239-language') as Language | null) ?? DEFAULT_LANGUAGE);
  const [isThoughtOpen, setThoughtOpen] = useState(false);
  const [customSteps, setCustomSteps] = useState<ReturnType<typeof buildSampleSteps>>([]);

  const solutions = useMemo(() => createSolutionRegistry(), []);
  const [activeSolutionId, setActiveSolutionId] = useState<string>(solutions[0]?.id ?? '');

  const activeSolution: SolutionDefinition | undefined = useMemo(
    () => solutions.find((s) => s.id === activeSolutionId),
    [activeSolutionId, solutions]
  );

  useEffect(() => {
    if (inputData || !activeSolution) return;
    const initialRaw = activeSolution.samples[0]?.value ?? '';
    const validation = activeSolution.validateInput(initialRaw);
    if (validation.valid) setInputData({ raw: initialRaw, parsed: validation.parsed });
  }, [activeSolution, inputData]);

  const activeSteps = useMemo(() => {
    if (!inputData || !activeSolution) return activeSolution?.steps ?? [];
    if (customSteps.length) return activeSolution.id === 'brute-force'
      ? buildBruteForceSteps(inputData.parsed as SlidingWindowInput)
      : customSteps;
    const parsed = inputData.parsed as SlidingWindowInput;
    return activeSolution.id === 'brute-force'
      ? buildBruteForceSteps(parsed)
      : buildSampleSteps(`${JSON.stringify(parsed.nums)}, k=${parsed.k}`);
  }, [activeSolution, customSteps, inputData]);

  const playback = usePlayback({
    totalSteps: activeSteps.length,
    initialSpeed: 1
  });

  if (!activeSolution) {
    return <div className="app-empty">未找到可用解法配置</div>;
  }

  return (
    <div className="app-root" data-testid="app-root">
      <ProblemHeader config={PROBLEM_CONFIG} />

      <div className="top-actions" data-testid="top-actions">
        <button
          className="thought-btn"
          data-testid="thought-btn"
          type="button"
          onClick={() => setThoughtOpen(true)}
        >
          算法思路
        </button>
        <GitHubBadge repoUrl={PROBLEM_CONFIG.githubRepoUrl} />
      </div>

      <AlgorithmThoughtModal
        open={isThoughtOpen}
        title={activeSolution.name}
        content={activeSolution.thought}
        onClose={() => setThoughtOpen(false)}
      />

      <DataInputBar
        samples={activeSolution.samples}
        validator={activeSolution.validateInput}
        randomGenerator={activeSolution.generateRandom}
        onChange={(data) => {
          setInputData(data);
          const parsed = data.parsed as SlidingWindowInput;
          setCustomSteps(buildSampleSteps(`${JSON.stringify(parsed.nums)}, k=${parsed.k}`));
          playback.reset();
        }}
      />

      <div className="solution-tabs" data-testid="solution-tabs">
        {solutions.map((solution) => (
          <button
            key={solution.id}
            data-testid={`solution-tab-${solution.id}`}
            className={solution.id === activeSolutionId ? 'tab-btn active' : 'tab-btn'}
            type="button"
            onClick={() => {
              setActiveSolutionId(solution.id);
              setCustomSteps([]);
              playback.reset();
            }}
          >
            {solution.name}
          </button>
        ))}
      </div>

      <main className="workspace">
        <section className="canvas-section">
          <VisualizationCanvas
            data={inputData}
            step={activeSteps[playback.currentStep]}
            solution={activeSolution}
            speed={playback.speed}
          />
        </section>

        <aside className="code-section">
          <CodePanel
            language={language}
            onLanguageChange={(next) => {
              setLanguage(next);
              localStorage.setItem('leetcode239-language', next);
            }}
            codeArtifacts={activeSolution.codes}
            step={activeSteps[playback.currentStep]}
          />
        </aside>
      </main>

      <PlaybackControls
        currentStep={playback.currentStep}
        totalSteps={activeSteps.length}
        isPlaying={playback.isPlaying}
        speed={playback.speed}
        onPrev={playback.prev}
        onNext={playback.next}
        onPlayPause={playback.togglePlay}
        onReset={playback.reset}
        onSpeedChange={playback.setSpeed}
        onSeek={playback.seek}
      />

      <CommunityFloat />
    </div>
  );
}

export default App;
