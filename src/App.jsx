import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Flag,
  Headphones,
  Library,
  ListChecks,
  Pause,
  PenLine,
  Play,
  RotateCcw,
  Timer,
  Volume2,
} from "lucide-react";
import {
  mockSections,
  officialResources,
  practiceCollections,
  sourcePolicy,
} from "./data/toeflData.js";

const navItems = [
  { id: "mock", label: "模拟机考", Icon: Timer },
  { id: "reading", label: "阅读", Icon: BookOpen },
  { id: "listening", label: "听力", Icon: Headphones },
  { id: "writing", label: "写作", Icon: PenLine },
];

const sectionIcons = {
  reading: BookOpen,
  listening: Headphones,
  writing: PenLine,
};

function flattenQuestions(section) {
  return section.blocks.flatMap((block) =>
    block.questions.map((question) => ({
      ...question,
      block,
      sectionId: section.id,
    })),
  );
}

function wordCount(value = "") {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}

function scoreTextAnswer(question, value = "") {
  const words = wordCount(value);
  if (!words) return 0;

  const lower = value.toLowerCase();
  const connectors = ["because", "however", "for example", "therefore", "although", "first", "also"]
    .filter((term) => lower.includes(term)).length;
  const hasSpecificExample = /\b(school|teacher|student|city|park|project|exam|library|class)\b/.test(
    lower,
  );
  const lengthScore = Math.min(words / question.minWords, 1);
  const structureScore = Math.min(connectors / 3, 1);
  const exampleScore = hasSpecificExample ? 1 : 0.55;

  return lengthScore * 0.55 + structureScore * 0.25 + exampleScore * 0.2;
}

function scoreSection(section, answers) {
  const questions = flattenQuestions(section);
  const earned = questions.reduce((sum, question) => {
    const answer = answers[question.id];
    if (question.type === "choice") return sum + Number(answer === question.answer);
    return sum + scoreTextAnswer(question, answer);
  }, 0);

  const answered = questions.filter((question) => {
    const answer = answers[question.id];
    return question.type === "choice" ? answer !== undefined : Boolean(answer?.trim());
  }).length;
  const ratio = questions.length ? earned / questions.length : 0;

  return {
    answered,
    total: questions.length,
    ratio,
    band: Number((1 + ratio * 5).toFixed(1)),
  };
}

function App() {
  const [activeTab, setActiveTab] = useState("mock");
  const [examMode, setExamMode] = useState("home");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(mockSections[0].minutes * 60);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [selectedSets, setSelectedSets] = useState({
    reading: practiceCollections.reading.sets[0][0],
    listening: practiceCollections.listening.sets[0][0],
    writing: practiceCollections.writing.sets[0][0],
  });

  const totalMockQuestions = useMemo(
    () => mockSections.reduce((sum, section) => sum + flattenQuestions(section).length, 0),
    [],
  );

  useEffect(() => {
    if (examMode === "active") {
      setTimeRemaining(mockSections[sectionIndex].minutes * 60);
      setAudioPlaying(false);
    }
  }, [examMode, sectionIndex]);

  useEffect(() => {
    if (examMode !== "active") return undefined;

    const timerId = window.setInterval(() => {
      setTimeRemaining((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [examMode, sectionIndex]);

  function startExam() {
    setExamMode("active");
    setActiveTab("mock");
    setSectionIndex(0);
    setQuestionIndex(0);
    setAnswers({});
    setMarked({});
    setAudioPlaying(false);
  }

  function exitExam() {
    setExamMode("home");
    setAudioPlaying(false);
  }

  function finishExam() {
    setExamMode("results");
    setAudioPlaying(false);
  }

  if (examMode === "active") {
    return (
      <MockExam
        sectionIndex={sectionIndex}
        questionIndex={questionIndex}
        answers={answers}
        marked={marked}
        timeRemaining={timeRemaining}
        audioPlaying={audioPlaying}
        onSetAudioPlaying={setAudioPlaying}
        onAnswer={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))}
        onToggleMark={(id) => setMarked((current) => ({ ...current, [id]: !current[id] }))}
        onSetQuestion={setQuestionIndex}
        onPrevious={() => {
          setQuestionIndex((index) => Math.max(0, index - 1));
          setAudioPlaying(false);
        }}
        onNext={() => {
          const questions = flattenQuestions(mockSections[sectionIndex]);
          if (questionIndex < questions.length - 1) {
            setQuestionIndex((index) => index + 1);
            setAudioPlaying(false);
            return;
          }

          if (sectionIndex < mockSections.length - 1) {
            setSectionIndex((index) => index + 1);
            setQuestionIndex(0);
            setAudioPlaying(false);
            return;
          }

          finishExam();
        }}
        onSectionChange={(nextSectionIndex) => {
          setSectionIndex(nextSectionIndex);
          setQuestionIndex(0);
          setAudioPlaying(false);
        }}
        onFinish={finishExam}
        onExit={exitExam}
      />
    );
  }

  if (examMode === "results") {
    return (
      <ResultsScreen
        answers={answers}
        onRestart={startExam}
        onBackHome={() => {
          setExamMode("home");
          setActiveTab("mock");
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <AppHeader activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="workspace">
        {activeTab === "mock" ? (
          <>
            <MockLanding totalMockQuestions={totalMockQuestions} onStart={startExam} />
            <PracticeRows
              selectedSets={selectedSets}
              onSelectSkill={setActiveTab}
              onSelectSet={(skill, setName) =>
                setSelectedSets((current) => ({ ...current, [skill]: setName }))
              }
            />
            <OfficialResources />
          </>
        ) : (
          <PracticeArea
            skill={activeTab}
            selectedSetName={selectedSets[activeTab]}
            onSelectSet={(setName) =>
              setSelectedSets((current) => ({ ...current, [activeTab]: setName }))
            }
            onStartMock={startExam}
          />
        )}
      </main>
    </div>
  );
}

function AppHeader({ activeTab, onTabChange }) {
  return (
    <header className="app-header">
      <button className="brand" type="button" onClick={() => onTabChange("mock")}>
        <span className="brand-mark">
          <BookOpen size={25} />
        </span>
        <span>Jennifer TOEFL Studio</span>
      </button>

      <nav className="top-nav" aria-label="Main TOEFL sections">
        {navItems.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={activeTab === id ? "active" : ""}
            type="button"
            onClick={() => onTabChange(id)}
          >
            <Icon size={23} />
            {label}
          </button>
        ))}
      </nav>

      <div className="header-status">
        <span>电脑版</span>
        <span>大字护眼</span>
      </div>
    </header>
  );
}

function MockLanding({ totalMockQuestions, onStart }) {
  return (
    <section className="mock-hero">
      <div className="mock-hero-summary">
        <div className="hero-icon">
          <Timer size={32} />
        </div>
        <div>
          <h1>TOEFL 机考模拟</h1>
          <p>按电脑考试界面练习阅读、听力、写作：计时、题号、标记复查、分区提交都在同一个流程里。</p>
        </div>
      </div>

      <div className="hero-metrics" aria-label="Mock test summary">
        <div>
          <span>预计用时</span>
          <strong>82:00</strong>
        </div>
        <div>
          <span>当前进度</span>
          <strong>0 / 3 Sections</strong>
        </div>
        <div>
          <span>站内题量</span>
          <strong>{totalMockQuestions} 题</strong>
        </div>
        <button className="primary-button hero-start" type="button" onClick={onStart}>
          <Play size={24} />
          开始模拟考试
        </button>
      </div>

      <div className="exam-preview" aria-label="Computer-based test preview">
        <div className="preview-title">
          <strong>机考界面预览</strong>
          <span>真实机考练习界面</span>
        </div>
        <div className="preview-panes">
          <div className="preview-passage">
            <div className="pane-line">
              <span>Passage 1 of 2</span>
              <button type="button">Hide</button>
            </div>
            <h2>The Impact of Urban Green Spaces on Well-Being</h2>
            <p>
              Cities around the world are growing rapidly. As more people live in urban areas,
              the way cities are designed has a major influence on residents' quality of life.
            </p>
            <p>
              Research shows that green spaces can improve both physical and mental health.
              People who live near parks are more likely to exercise and report lower stress.
            </p>
          </div>
          <div className="preview-question">
            <div className="pane-line">
              <span>Question 3 of 8</span>
              <span>Mark for Review</span>
            </div>
            <h2>Which statement best expresses the main idea of the passage?</h2>
            {["A", "B", "C", "D"].map((letter, index) => (
              <div key={letter} className={index === 0 ? "preview-option selected" : "preview-option"}>
                <span>{letter}</span>
                <p>{index === 0 ? "Design and access both affect the value of green spaces." : "A tempting but incomplete answer choice."}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PracticeRows({ selectedSets, onSelectSkill, onSelectSet }) {
  return (
    <section className="practice-block">
      <div className="section-heading">
        <div>
          <h2>专项练习题库</h2>
          <p>读、听、写都已经放进来。题目是原创仿真题，真题入口放在下方官方资源区。</p>
        </div>
        <div className="bank-total">
          <Library size={22} />
          <strong>
            {Object.values(practiceCollections).reduce((sum, skill) => sum + skill.totalItems, 0)}
          </strong>
          <span>站内训练项</span>
        </div>
      </div>

      <div className="practice-rows">
        {Object.entries(practiceCollections).map(([skill, collection]) => {
          const Icon = sectionIcons[skill];
          const selectedSetName = selectedSets[skill];
          const selectedSet = collection.sets.find((set) => set[0] === selectedSetName) || collection.sets[0];

          return (
            <article className="practice-row" key={skill}>
              <button className={`skill-icon ${skill}`} type="button" onClick={() => onSelectSkill(skill)}>
                <Icon size={33} />
              </button>
              <div className="practice-title">
                <h3>{collection.label}</h3>
                <p>{collection.description}</p>
              </div>
              <div className="practice-number">
                <span>题目数量</span>
                <strong>{collection.totalItems}</strong>
              </div>
              <div className="practice-number">
                <span>练习套数</span>
                <strong>{collection.setCount}</strong>
              </div>
              <div className="set-picker">
                <span>当前练习</span>
                <select value={selectedSetName} onChange={(event) => onSelectSet(skill, event.target.value)}>
                  {collection.sets.map((set) => (
                    <option key={set[0]} value={set[0]}>
                      {set[0]}
                    </option>
                  ))}
                </select>
                <small>
                  {selectedSet[1]} · {selectedSet[2]}
                </small>
              </div>
              <button className="outline-button" type="button" onClick={() => onSelectSkill(skill)}>
                开始练习
                <ArrowRight size={21} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OfficialResources() {
  return (
    <section className="resource-block">
      <div className="section-heading">
        <div>
          <h2>{sourcePolicy.title}</h2>
          <p>{sourcePolicy.note}</p>
        </div>
      </div>

      <div className="resource-grid">
        {officialResources.map((resource) => (
          <a key={resource.title} className="resource-card" href={resource.url} target="_blank" rel="noreferrer">
            <span>{resource.label}</span>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <strong>
              打开官方资源
              <ExternalLink size={18} />
            </strong>
          </a>
        ))}
      </div>
    </section>
  );
}

function PracticeArea({ skill, selectedSetName, onSelectSet, onStartMock }) {
  const collection = practiceCollections[skill];
  const Icon = sectionIcons[skill];
  const selectedSet = collection.sets.find((set) => set[0] === selectedSetName) || collection.sets[0];

  return (
    <section className="skill-page">
      <div className="skill-hero">
        <div className={`skill-hero-icon ${skill}`}>
          <Icon size={39} />
        </div>
        <div>
          <h1>{collection.label}专项题库</h1>
          <p>{collection.description}</p>
        </div>
        <button className="primary-button" type="button" onClick={onStartMock}>
          <Timer size={23} />
          进入模拟考
        </button>
      </div>

      <div className="skill-stats">
        <div>
          <span>站内训练项</span>
          <strong>{collection.totalItems}</strong>
        </div>
        <div>
          <span>练习套数</span>
          <strong>{collection.setCount}</strong>
        </div>
        <div>
          <span>预计训练</span>
          <strong>{collection.minutes} min</strong>
        </div>
      </div>

      <div className="skill-layout">
        <div className="set-list">
          {collection.sets.map((set) => (
            <button
              key={set[0]}
              className={selectedSetName === set[0] ? "active" : ""}
              type="button"
              onClick={() => onSelectSet(set[0])}
            >
              <span>{set[3]}</span>
              <strong>{set[0]}</strong>
              <small>{set[1]}</small>
            </button>
          ))}
        </div>

        <div className="set-detail">
          <span className="set-level">{selectedSet[3]}</span>
          <h2>{selectedSet[0]}</h2>
          <p>{selectedSet[1]}</p>
          <div className="detail-grid">
            <div>
              <ListChecks size={22} />
              <span>练习内容</span>
              <strong>{selectedSet[2]}</strong>
            </div>
            <div>
              <Clock3 size={22} />
              <span>建议方式</span>
              <strong>{skill === "writing" ? "写完再改一轮" : "限时完成后复盘"}</strong>
            </div>
          </div>
          <div className="practice-note">
            <CheckCircle2 size={24} />
            <span>
              完成后进入模拟考，把专项练习放回真实考试节奏里检查。
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function MockExam({
  sectionIndex,
  questionIndex,
  answers,
  marked,
  timeRemaining,
  audioPlaying,
  onSetAudioPlaying,
  onAnswer,
  onToggleMark,
  onSetQuestion,
  onPrevious,
  onNext,
  onSectionChange,
  onFinish,
  onExit,
}) {
  const section = mockSections[sectionIndex];
  const questions = flattenQuestions(section);
  const question = questions[questionIndex];
  const answer = answers[question.id];
  const answeredCount = questions.filter((item) =>
    item.type === "choice" ? answers[item.id] !== undefined : Boolean(answers[item.id]?.trim()),
  ).length;

  return (
    <div className="exam-shell">
      <header className="exam-header">
        <div>
          <strong>Jennifer TOEFL Studio</strong>
          <span>模拟机考界面</span>
        </div>
        <div className="exam-section-tabs">
          {mockSections.map((item, index) => (
            <button
              key={item.id}
              className={index === sectionIndex ? "active" : ""}
              type="button"
              onClick={() => onSectionChange(index)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="exam-timer">
          <Clock3 size={24} />
          <span>{formatTime(timeRemaining)}</span>
        </div>
        <button className="exam-exit" type="button" onClick={onExit}>
          退出
        </button>
      </header>

      <main className="exam-main">
        <section className="material-pane">
          <div className="pane-toolbar">
            <span>
              {section.english} · {question.block.title}
            </span>
            <strong>
              {answeredCount} / {questions.length}
            </strong>
          </div>
          <p className="directions">{section.instruction}</p>
          <Material block={question.block} audioPlaying={audioPlaying} onSetAudioPlaying={onSetAudioPlaying} />
        </section>

        <section className="question-pane">
          <div className="question-topline">
            <span>
              Question {questionIndex + 1} of {questions.length}
            </span>
            <button
              className={marked[question.id] ? "mark-button active" : "mark-button"}
              type="button"
              onClick={() => onToggleMark(question.id)}
            >
              <Flag size={20} />
              Mark for Review
            </button>
          </div>

          <h1>{question.stem}</h1>

          {question.type === "choice" ? (
            <div className="answer-options">
              {question.options.map((option, index) => (
                <button
                  key={option}
                  className={answer === index ? "selected" : ""}
                  type="button"
                  onClick={() => onAnswer(question.id, index)}
                >
                  <span>{String.fromCharCode(65 + index)}</span>
                  <p>{option}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="writing-box">
              <textarea
                value={answer || ""}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                placeholder="Type your response here..."
              />
              <div>
                <span>{wordCount(answer)} words</span>
                <span>Target {question.minWords}+ words</span>
              </div>
            </div>
          )}
        </section>

        <aside className="review-rail" aria-label="Question navigator">
          <strong>Review</strong>
          <div className="question-grid">
            {questions.map((item, index) => {
              const isAnswered =
                item.type === "choice"
                  ? answers[item.id] !== undefined
                  : Boolean(answers[item.id]?.trim());
              return (
                <button
                  key={item.id}
                  className={[
                    index === questionIndex ? "active" : "",
                    isAnswered ? "answered" : "",
                    marked[item.id] ? "marked" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  type="button"
                  onClick={() => {
                    onSetQuestion(index);
                    onSetAudioPlaying(false);
                  }}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <button className="submit-button" type="button" onClick={onFinish}>
            交卷
          </button>
        </aside>
      </main>

      <footer className="exam-footer">
        <button className="outline-button" type="button" onClick={onPrevious} disabled={questionIndex === 0}>
          <ArrowLeft size={20} />
          上一题
        </button>
        <div>
          <span>{section.label}</span>
          <strong>
            {question.block.type === "audio" ? "听力音频只播放，不显示原文" : question.skill}
          </strong>
        </div>
        <button className="primary-button" type="button" onClick={onNext}>
          {sectionIndex === mockSections.length - 1 && questionIndex === questions.length - 1
            ? "完成考试"
            : "下一题"}
          <ArrowRight size={20} />
        </button>
      </footer>
    </div>
  );
}

function Material({ block, audioPlaying, onSetAudioPlaying }) {
  if (block.type === "audio") {
    return (
      <div className="audio-material">
        <div className="audio-card">
          <button type="button" onClick={() => onSetAudioPlaying(!audioPlaying)}>
            {audioPlaying ? <Pause size={26} /> : <Play size={26} />}
          </button>
          <div>
            <span>{block.audioCue}</span>
            <strong>{audioPlaying ? "Playing" : "Ready"} · {block.duration}</strong>
          </div>
        </div>
        <div className="waveform" aria-hidden="true">
          {Array.from({ length: 54 }).map((_, index) => (
            <span key={index} style={{ height: `${18 + ((index * 13) % 58)}px` }} />
          ))}
        </div>
        <div className="audio-lock">
          <Volume2 size={24} />
          <p>Listening transcript is hidden during mock exam mode.</p>
        </div>
      </div>
    );
  }

  if (block.type === "writing") {
    return (
      <div className="writing-material">
        <span>{block.title}</span>
        <h2>Prompt</h2>
        <p>{block.prompt}</p>
      </div>
    );
  }

  return (
    <div className="passage-material">
      <h2>{block.title}</h2>
      {block.passage.split("\n\n").map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}

function ResultsScreen({ answers, onRestart, onBackHome }) {
  const results = mockSections.map((section) => ({ ...section, result: scoreSection(section, answers) }));
  const averageBand =
    results.reduce((sum, section) => sum + section.result.band, 0) / Math.max(results.length, 1);

  return (
    <div className="results-shell">
      <section className="results-panel">
        <div className="results-head">
          <CheckCircle2 size={40} />
          <div>
            <h1>模拟考完成</h1>
            <p>这是站内原创仿真题的即时估算。正式分数请以 ETS 官方 TestReady/TPO 或正式考试为准。</p>
          </div>
          <strong>{averageBand.toFixed(1)}</strong>
        </div>

        <div className="result-grid">
          {results.map((section) => {
            const Icon = sectionIcons[section.id];
            return (
              <article key={section.id}>
                <Icon size={31} />
                <span>{section.label}</span>
                <strong>{section.result.band.toFixed(1)}</strong>
                <p>
                  {section.result.answered} / {section.result.total} answered
                </p>
                <div>
                  <span style={{ width: `${section.result.ratio * 100}%` }} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="results-actions">
          <button className="primary-button" type="button" onClick={onRestart}>
            <RotateCcw size={22} />
            再做一次模拟考
          </button>
          <button className="outline-button" type="button" onClick={onBackHome}>
            回到题库
          </button>
          <a href="https://www.cn.ets.org/toefl/china/toefl/toefl-testready.html" target="_blank" rel="noreferrer">
            ETS TestReady
            <ExternalLink size={18} />
          </a>
        </div>
      </section>
    </div>
  );
}

export default App;
