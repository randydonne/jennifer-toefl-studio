import { useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Edit3,
  ExternalLink,
  FileText,
  Headphones,
  Library,
  ListChecks,
  Mic2,
  Play,
  RefreshCw,
  Sparkles,
  Target,
} from "lucide-react";
import {
  contentStats,
  diagnosticSummary,
  diagnosticItems,
  examBlueprint,
  initialSkillProfile,
  practiceLibrary,
  reviewSignals,
  trainingModules,
  weeklyBlocks,
} from "./data/toeflData.js";

const iconMap = {
  reading: BookOpen,
  listening: Headphones,
  speaking: Mic2,
  writing: Edit3,
};

const skillColors = {
  reading: "var(--blue)",
  listening: "var(--teal)",
  speaking: "var(--violet)",
  writing: "var(--amber)",
};

function wordCount(value = "") {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function scoreOpenAnswer(item, value = "") {
  const words = wordCount(value);
  if (!words) return 0;

  const text = value.toLowerCase();
  const connectors = [
    "because",
    "however",
    "therefore",
    "for example",
    "first",
    "second",
    "also",
    "although",
    "in addition",
  ].filter((term) => text.includes(term)).length;
  const hasSpecifics = /\b(school|teacher|project|library|exam|city|students|research|data|example)\b/.test(
    text,
  );
  const lengthScore = Math.min(words / item.minWords, 1);
  const structureScore = Math.min(connectors / 3, 1);
  const specificityScore = hasSpecifics ? 1 : 0.45;

  return Math.min(lengthScore * 0.52 + structureScore * 0.28 + specificityScore * 0.2, 1);
}

function scoreChoice(item, response) {
  return Number(response === item.answer);
}

function calculateProfile(responses) {
  const profile = {};

  examBlueprint.forEach((skill) => {
    const skillItems = diagnosticItems.filter((item) => item.skill === skill.id);
    const earned = skillItems.reduce((sum, item) => {
      const response = responses[item.id];
      if (item.type === "choice") return sum + scoreChoice(item, response);
      return sum + scoreOpenAnswer(item, response);
    }, 0);
    const answered = skillItems.filter((item) => {
      const response = responses[item.id];
      return item.type === "choice" ? response !== undefined : Boolean(response?.trim());
    }).length;
    const ratio = skillItems.length ? earned / skillItems.length : 0;
    const blended = answered ? 1 + ratio * 5 : initialSkillProfile[skill.id];

    profile[skill.id] = {
      score: Number(blended.toFixed(1)),
      answered,
      total: skillItems.length,
      ratio,
    };
  });

  return profile;
}

function getBand(score) {
  if (score >= 5.2) return "高分冲刺";
  if (score >= 4.2) return "稳定提升";
  if (score >= 3.2) return "重点补强";
  return "基础重建";
}

function getWeakestSkills(profile) {
  return [...examBlueprint]
    .sort((a, b) => profile[a.id].score - profile[b.id].score)
    .slice(0, 2);
}

function App() {
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [activeSkill, setActiveSkill] = useState("reading");
  const [showTranscript, setShowTranscript] = useState(false);

  const profile = useMemo(() => calculateProfile(responses), [responses]);
  const answeredCount = Object.entries(responses).filter(([id, value]) => {
    const item = diagnosticItems.find((entry) => entry.id === id);
    return item?.type === "choice" ? value !== undefined : Boolean(value?.trim());
  }).length;
  const progress = Math.round((answeredCount / diagnosticItems.length) * 100);
  const activeItem = diagnosticItems[activeIndex];
  const selectedPractice = practiceLibrary[activeSkill];
  const selectedTrainingModule = trainingModules[activeSkill];
  const weakest = getWeakestSkills(profile);
  const projectedTotal = Math.round(
    examBlueprint.reduce((sum, skill) => sum + profile[skill.id].score, 0) * 5,
  );

  function updateResponse(itemId, value) {
    setResponses((current) => ({ ...current, [itemId]: value }));
  }

  function goNext() {
    setShowTranscript(false);
    if (activeIndex < diagnosticItems.length - 1) {
      setActiveIndex((index) => index + 1);
      setActiveSkill(diagnosticItems[activeIndex + 1].skill);
      return;
    }
    setStarted(false);
  }

  function resetDiagnostic() {
    setResponses({});
    setActiveIndex(0);
    setActiveSkill("reading");
    setStarted(true);
    setShowTranscript(false);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="TOEFL skill navigation">
        <div className="brand">
          <div className="brand-mark">J</div>
          <div>
            <strong>Jennifer</strong>
            <span>TOEFL Studio</span>
          </div>
        </div>

        <button
          className="nav-primary"
          type="button"
          onClick={() => {
            setStarted(true);
            setActiveSkill(activeItem.skill);
          }}
        >
          <Target size={18} />
          今日诊断
        </button>

        <nav className="skill-nav">
          <span className="nav-label">四项技能</span>
          {examBlueprint.map((skill) => {
            const Icon = iconMap[skill.id];
            const active = activeSkill === skill.id;
            return (
              <button
                key={skill.id}
                className={`skill-nav-item ${active ? "active" : ""}`}
                type="button"
                onClick={() => setActiveSkill(skill.id)}
              >
                <Icon size={19} style={{ color: skillColors[skill.id] }} />
                <span>{skill.label}</span>
                <small>{profile[skill.id].score.toFixed(1)}</small>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-links">
          <button type="button">
            <CalendarDays size={18} />
            学习计划
          </button>
          <button type="button">
            <FileText size={18} />
            错题本
          </button>
          <button type="button">
            <BarChart3 size={18} />
            模考记录
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>欢迎回来，Jennifer</h1>
            <p>先做短诊断，再把每天练习压到最有效的弱项上。</p>
          </div>
          <div className="topbar-actions">
            <div className="mode-chip">Grade 8 mode</div>
            <a
              className="source-link"
              href="https://www.ets.org/toefl/test-takers/ibt/about/content.html"
              target="_blank"
              rel="noreferrer"
            >
              ETS format
              <ExternalLink size={15} />
            </a>
          </div>
        </header>

        <section className="dashboard-grid" aria-label="TOEFL preparation dashboard">
          <div className="primary-column">
            <div className="top-grid">
              <DiagnosticPanel
                activeItem={activeItem}
                activeIndex={activeIndex}
                started={started}
                progress={progress}
                responses={responses}
                showTranscript={showTranscript}
                onShowTranscript={() => setShowTranscript((value) => !value)}
                onStart={() => setStarted(true)}
                onReset={resetDiagnostic}
                onNext={goNext}
                onUpdate={updateResponse}
              />

              <ProfilePanel profile={profile} projectedTotal={projectedTotal} />
            </div>

            <TrainingPlan profile={profile} weakest={weakest} />

            <ContentScalePanel />

            <PracticeBankPanel
              activeSkill={activeSkill}
              selectedTrainingModule={selectedTrainingModule}
              onSelectSkill={setActiveSkill}
            />

            <TaskPreview
              activeSkill={activeSkill}
              selectedPractice={selectedPractice}
              onSelectSkill={setActiveSkill}
            />
          </div>

          <CoachPanel profile={profile} weakest={weakest} progress={progress} />
        </section>
      </main>
    </div>
  );
}

function ContentScalePanel() {
  return (
    <section className="panel content-scale-panel">
      <div className="panel-head compact">
        <div>
          <h2>v2 内容容量</h2>
          <p>从短测原型升级成可持续训练池，数量和覆盖面都可检查。</p>
        </div>
        <div className="scale-icon" aria-hidden="true">
          <Library size={20} />
        </div>
      </div>

      <div className="content-stat-grid">
        {contentStats.map((stat) => (
          <div key={stat.label}>
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
            <small>{stat.detail}</small>
          </div>
        ))}
      </div>

      <div className="review-signal-strip" aria-label="Review signal tags">
        <ListChecks size={17} />
        {reviewSignals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
    </section>
  );
}

function DiagnosticPanel({
  activeItem,
  activeIndex,
  started,
  progress,
  responses,
  showTranscript,
  onShowTranscript,
  onStart,
  onReset,
  onNext,
  onUpdate,
}) {
  const activeResponse = responses[activeItem.id];
  const isAnswered =
    activeItem.type === "choice"
      ? activeResponse !== undefined
      : Boolean(activeResponse?.trim());

  return (
    <section className="panel diagnostic-panel">
      <div className="panel-head">
        <div>
          <h2>TOEFL iBT 水平诊断</h2>
          <p>{diagnosticItems.length} 题短测，每科 9 题，覆盖四科关键高分能力。</p>
        </div>
        <div className="progress-ring" aria-label={`诊断进度 ${progress}%`}>
          <svg viewBox="0 0 42 42" role="img">
            <circle cx="21" cy="21" r="17" />
            <circle
              className="progress"
              cx="21"
              cy="21"
              r="17"
              strokeDasharray={`${progress} 100`}
            />
          </svg>
          <span>{progress}%</span>
        </div>
      </div>

      {!started ? (
        <div className="diagnostic-start">
          <div className="mini-stats">
            <div>
              <span>题量</span>
              <strong>{diagnosticItems.length}</strong>
            </div>
            <div>
              <span>预计</span>
              <strong>{diagnosticSummary.estimatedMinutes} min</strong>
            </div>
            <div>
              <span>评分</span>
              <strong>1-6</strong>
            </div>
          </div>
          <div className="blueprint-list">
            {examBlueprint.map((skill) => (
              <div key={skill.id}>
                <Check size={16} />
                <span>{skill.label}</span>
                <small>{skill.official}</small>
              </div>
            ))}
          </div>
          <p className="diagnostic-note">{diagnosticSummary.reliability}</p>
          <div className="action-row">
            <button className="button primary" type="button" onClick={onStart}>
              开始水平测试
              <ArrowRight size={17} />
            </button>
            <button className="button secondary" type="button" onClick={onReset}>
              <RefreshCw size={16} />
              重新开始
            </button>
          </div>
        </div>
      ) : (
        <div className="question-area">
          <div className="question-meta">
            <span>{activeItem.title}</span>
            <span>
              <Clock3 size={14} />
              {activeItem.time}
            </span>
            <span>
              题目 {activeIndex + 1} / {diagnosticItems.length}
            </span>
          </div>

          {activeItem.audioCue ? (
            <div className="audio-strip">
              <button type="button" onClick={onShowTranscript} aria-label="Play listening sample">
                <Play size={17} />
              </button>
              <div>
                <strong>{activeItem.audioCue}</strong>
                <div className="wave-bars" aria-hidden="true">
                  {Array.from({ length: 28 }).map((_, index) => (
                    <span key={index} style={{ height: `${8 + ((index * 7) % 22)}px` }} />
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {showTranscript && activeItem.transcript ? (
            <p className="transcript">{activeItem.transcript}</p>
          ) : null}

          <p className="prompt">{activeItem.prompt}</p>
          <h3>{activeItem.question}</h3>

          {activeItem.type === "choice" ? (
            <div className="options">
              {activeItem.options.map((option, index) => (
                <button
                  key={option}
                  className={activeResponse === index ? "selected" : ""}
                  type="button"
                  onClick={() => onUpdate(activeItem.id, index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="open-response">
              <textarea
                value={activeResponse || ""}
                onChange={(event) => onUpdate(activeItem.id, event.target.value)}
                placeholder="Write the answer you would say or submit..."
                rows={7}
              />
              <div className="response-metrics">
                <span>{wordCount(activeResponse)} words</span>
                <span>目标 {activeItem.minWords}+ words</span>
                <span>{activeItem.concept}</span>
              </div>
            </div>
          )}

          <div className="question-footer">
            <span>{activeItem.concept}</span>
            <button
              className="button primary"
              type="button"
              disabled={!isAnswered}
              onClick={onNext}
            >
              {activeIndex === diagnosticItems.length - 1 ? "完成诊断" : "下一题"}
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function ProfilePanel({ profile, projectedTotal }) {
  const points = radarPoints(profile);

  return (
    <section className="panel profile-panel">
      <div className="panel-head">
        <div>
          <h2>能力画像</h2>
          <p>按 ETS 新版 1-6 分制估算。</p>
        </div>
        <div className="total-score">
          <span>总分预估</span>
          <strong>{projectedTotal}</strong>
        </div>
      </div>

      <div className="radar-wrap">
        <svg viewBox="0 0 220 220" aria-label="四科能力雷达图">
          <polygon className="radar-grid" points="110,28 192,110 110,192 28,110" />
          <polygon className="radar-grid inner" points="110,62 158,110 110,158 62,110" />
          <line x1="110" y1="28" x2="110" y2="192" />
          <line x1="28" y1="110" x2="192" y2="110" />
          <polygon className="radar-score" points={points} />
          {examBlueprint.map((skill) => {
            const point = radarLabel(skill.id);
            return (
              <text key={skill.id} x={point.x} y={point.y} textAnchor={point.anchor}>
                {skill.label}
              </text>
            );
          })}
        </svg>
        <div className="score-list">
          {examBlueprint.map((skill) => (
            <div key={skill.id}>
              <span>{skill.label}</span>
              <strong>{profile[skill.id].score.toFixed(1)}</strong>
              <small>{getBand(profile[skill.id].score)}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function radarPoints(profile) {
  const center = 110;
  const max = 82;
  const value = (skill) => (profile[skill].score / 6) * max;
  return [
    `${center},${center - value("reading")}`,
    `${center + value("listening")},${center}`,
    `${center},${center + value("speaking")}`,
    `${center - value("writing")},${center}`,
  ].join(" ");
}

function radarLabel(skill) {
  const labels = {
    reading: { x: 110, y: 18, anchor: "middle" },
    listening: { x: 203, y: 114, anchor: "start" },
    speaking: { x: 110, y: 212, anchor: "middle" },
    writing: { x: 17, y: 114, anchor: "end" },
  };
  return labels[skill];
}

function TrainingPlan({ profile, weakest }) {
  return (
    <section className="panel training-panel">
      <div className="panel-head compact">
        <div>
          <h2>专项提升计划</h2>
          <p>根据诊断自动排序，先补最影响提分的环节。</p>
        </div>
        <button className="text-button" type="button">
          查看详细计划
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="plan-list">
        {examBlueprint
          .map((skill) => ({ ...skill, score: profile[skill.id].score }))
          .sort((a, b) => a.score - b.score)
          .map((skill, index) => {
            const practice = practiceLibrary[skill.id];
            return (
              <article className="plan-row" key={skill.id}>
                <div className="rank" style={{ backgroundColor: skillColors[skill.id] }}>
                  {index + 1}
                </div>
                <div>
                  <h3>
                    {skill.label}: {practice.title}
                  </h3>
                  <p>{skill.target}</p>
                </div>
                <div className="row-progress">
                  <div>
                    <span style={{ width: `${(skill.score / 6) * 100}%` }} />
                  </div>
                  <strong>{skill.score.toFixed(1)}</strong>
                </div>
              </article>
            );
          })}
      </div>

      <div className="weakness-callout">
        <Sparkles size={18} />
        <span>
          先抓 {weakest.map((skill) => skill.label).join(" + ")}，更容易把总分预估拉上去。
        </span>
      </div>
    </section>
  );
}

function PracticeBankPanel({ activeSkill, selectedTrainingModule, onSelectSkill }) {
  return (
    <section className="panel bank-panel">
      <div className="panel-head compact bank-head">
        <div>
          <h2>专项训练池</h2>
          <p>
            {selectedTrainingModule.bankCount} 个 {activeSkill} 任务，覆盖：
            {selectedTrainingModule.coverage}
          </p>
        </div>
        <div className="bank-tabs" role="tablist" aria-label="Training bank skill tabs">
          {examBlueprint.map((skill) => (
            <button
              key={skill.id}
              className={activeSkill === skill.id ? "active" : ""}
              type="button"
              onClick={() => onSelectSkill(skill.id)}
            >
              {skill.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bank-grid">
        {selectedTrainingModule.tasks.slice(0, 6).map((task) => (
          <article key={task.name} className="bank-task">
            <div>
              <ClipboardCheck size={17} />
              <span>{task.level}</span>
            </div>
            <h3>{task.name}</h3>
            <p>{task.prompt}</p>
            <small>{task.minutes} min</small>
          </article>
        ))}
      </div>
    </section>
  );
}

function TaskPreview({ activeSkill, selectedPractice, onSelectSkill }) {
  return (
    <section className="panel task-panel">
      <div className="task-tabs" role="tablist" aria-label="TOEFL task preview tabs">
        {examBlueprint.map((skill) => (
          <button
            key={skill.id}
            className={activeSkill === skill.id ? "active" : ""}
            type="button"
            onClick={() => onSelectSkill(skill.id)}
          >
            {skill.label}
          </button>
        ))}
      </div>

      <div className="task-content">
        <div>
          <span className="task-label">{selectedPractice.title}</span>
          <h2>{selectedPractice.task}</h2>
          <p>{selectedPractice.drill}</p>
        </div>
        <div className="rubric-list">
          {selectedPractice.rubric.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function CoachPanel({ profile, weakest, progress }) {
  const leadingWeakness = weakest[0];
  const score = profile[leadingWeakness.id].score;
  const skillPractice = practiceLibrary[leadingWeakness.id];

  return (
    <aside className="coach-column" aria-label="Parent coaching notes">
      <img
        className="study-image"
        src={`${import.meta.env.BASE_URL}study-studio.png`}
        alt="Student studying TOEFL listening and notes at a bright desk"
      />

      <section className="panel coach-panel">
        <div className="coach-head">
          <Target size={20} />
          <h2>家长教练建议</h2>
        </div>
        <div className="coach-advice">
          <article>
            <strong>优先提升 {leadingWeakness.label}</strong>
            <p>
              当前估算 {score.toFixed(1)} / 6。今天只盯一个动作：
              {skillPractice.drill}
            </p>
          </article>
          <article>
            <strong>训练记录方式</strong>
            <p>每次练习只记录题型、错因、下一次修正动作，避免只堆题量。</p>
          </article>
          <article>
            <strong>考试贴近度</strong>
            <p>36 题诊断按 TOEFL iBT 分区与 1-6 分制设计，题目为原创 TOEFL-style。</p>
          </article>
        </div>
      </section>

      <section className="panel data-panel">
        <div className="data-grid">
          <div>
            <Clock3 size={18} />
            <strong>{progress}%</strong>
            <span>诊断完成</span>
          </div>
          <div>
            <Check size={18} />
            <strong>48</strong>
            <span>专项任务</span>
          </div>
          <div>
            <BarChart3 size={18} />
            <strong>1-6</strong>
            <span>单科估分</span>
          </div>
        </div>

        <div className="week-strip" aria-label="Weekly TOEFL plan">
          {weeklyBlocks.map((block) => (
            <button key={block.day} type="button" title={`${block.focus}: ${block.minutes} min`}>
              <span>{block.day}</span>
              <strong>{block.minutes}</strong>
            </button>
          ))}
        </div>

        <a
          className="official-note"
          href="https://www.ets.org/toefl/test-takers/ibt/about/content.html"
          target="_blank"
          rel="noreferrer"
        >
          参考 ETS TOEFL iBT Test Content
          <ExternalLink size={15} />
        </a>
      </section>
    </aside>
  );
}

export default App;
