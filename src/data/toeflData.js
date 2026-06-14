export const officialResources = [
  {
    title: "ETS Test Content",
    label: "官方题型与时间",
    description: "核对新版 TOEFL iBT 的 Reading, Listening, Writing, Speaking 结构、题量和计时。",
    url: "https://www.ets.org/toefl/test-takers/ibt/about/content.html",
  },
  {
    title: "Official TOEFL Prep",
    label: "官方练习入口",
    description: "ETS 官方备考资源中心，包含样题、备考提示和可购买练习资源。",
    url: "https://www.ets.org/toefl/test-takers/ibt/prepare.html",
  },
  {
    title: "TOEFL TestReady",
    label: "官方 TPO/真题入口",
    description: "官方平台中的 TPO 使用 authentic test questions，适合作为正式模考材料。",
    url: "https://www.cn.ets.org/toefl/china/toefl/toefl-testready.html",
  },
  {
    title: "Official Guide",
    label: "纸质/电子授权资料",
    description: "ETS 官方指南包含真实 TOEFL iBT 题目、完整练习测试和评分说明。",
    url: "https://www.etsglobal.org/mt/en/preparation-tool/official-guide-toefl-ibt-test---sixth-edition",
  },
];

export const sectionSpecs = [
  {
    id: "reading",
    label: "阅读",
    english: "Reading",
    officialItems: 50,
    officialMinutes: 30,
    accent: "#1463e8",
    tasks: ["Complete the Words", "Read in Daily Life", "Read an Academic Passage"],
  },
  {
    id: "listening",
    label: "听力",
    english: "Listening",
    officialItems: 47,
    officialMinutes: 29,
    accent: "#0f9f8f",
    tasks: [
      "Listen and Choose a Response",
      "Listen to a Conversation",
      "Listen to an Announcement",
      "Listen to an Academic Talk",
    ],
  },
  {
    id: "writing",
    label: "写作",
    english: "Writing",
    officialItems: 12,
    officialMinutes: 23,
    accent: "#2563eb",
    tasks: ["Build a Sentence", "Write an Email", "Write for an Academic Discussion"],
  },
];

export const mockSections = [
  {
    id: "reading",
    label: "阅读",
    english: "Reading",
    minutes: 30,
    instruction:
      "Read the passage carefully. Answer each question based only on information in the passage.",
    blocks: [
      {
        id: "r-urban-green",
        title: "The Impact of Urban Green Spaces on Well-Being",
        type: "passage",
        passage: `Cities around the world are growing rapidly. As more people live in urban areas, the way cities are designed has a major influence on residents' quality of life. One important feature is the presence of green spaces such as parks, gardens, and tree-lined streets.

Research shows that green spaces can improve both physical and mental health. People who live near parks are more likely to exercise, report lower stress levels, and experience greater life satisfaction. Green spaces can also reduce air pollution and urban heat by absorbing pollutants and providing shade.

However, the benefits of green spaces are not automatic. A small park surrounded by heavy traffic may be less useful than a connected network of quiet paths and accessible playgrounds. For this reason, many city planners now focus not only on adding green space but also on making it easy and pleasant for residents to use.`,
        questions: [
          {
            id: "r1",
            type: "choice",
            skill: "main idea",
            stem: "Which statement best expresses the main idea of the passage?",
            options: [
              "Urban green spaces can support health, but their design and accessibility matter.",
              "Urban residents should move away from large cities whenever possible.",
              "Parks are useful only when they are surrounded by heavy traffic.",
              "City planners have stopped building playgrounds in modern cities.",
            ],
            answer: 0,
          },
          {
            id: "r2",
            type: "choice",
            skill: "detail purpose",
            stem: "Why does the passage mention air pollution and urban heat?",
            options: [
              "To explain why parks are usually too expensive to maintain",
              "To give examples of environmental problems green spaces can reduce",
              "To show that green spaces are useful only in cold climates",
              "To argue that physical exercise is less important than shade",
            ],
            answer: 1,
          },
          {
            id: "r3",
            type: "choice",
            skill: "inference",
            stem: "What can be inferred about a connected network of paths?",
            options: [
              "It may make green spaces easier for residents to use regularly.",
              "It is less valuable than a single small park near traffic.",
              "It prevents city planners from adding trees.",
              "It is useful only for people who already exercise daily.",
            ],
            answer: 0,
          },
          {
            id: "r4",
            type: "choice",
            skill: "vocabulary",
            stem: "The word accessible in the passage is closest in meaning to",
            options: ["easy to reach", "difficult to design", "recently built", "privately owned"],
            answer: 0,
          },
        ],
      },
      {
        id: "r-ancient-dyes",
        title: "Ancient Dyes and Trade",
        type: "passage",
        passage: `Before synthetic dyes became common in the nineteenth century, many colors used in cloth came from plants, minerals, or insects. Some dyes were easy to produce locally, but others required rare materials and specialized knowledge. A deep purple dye made from sea snails, for example, was so costly that it became associated with wealth and political power.

Dyes can help historians trace trade connections. If a piece of cloth contains a colorant that did not exist in the region where the cloth was found, researchers can ask whether the cloth itself was imported or whether the dye material traveled separately. Chemical analysis is especially useful because written records often mention finished goods but not the ingredients used to make them.

The study of dyes therefore connects art history, chemistry, and economics. A small thread from an old textile can reveal information about technology, social status, and exchange networks across long distances.`,
        questions: [
          {
            id: "r5",
            type: "choice",
            skill: "author purpose",
            stem: "Why does the author discuss purple dye made from sea snails?",
            options: [
              "To show that some colors required rare materials and became status symbols",
              "To prove that synthetic dyes were invented earlier than historians thought",
              "To explain why sea snails disappeared from ancient markets",
              "To argue that all ancient dyes were inexpensive",
            ],
            answer: 0,
          },
          {
            id: "r6",
            type: "choice",
            skill: "sentence function",
            stem: "What role does chemical analysis play in the passage?",
            options: [
              "It replaces the need to study cloth.",
              "It helps identify materials not described fully in written records.",
              "It shows that trade connections were unimportant.",
              "It proves that finished goods were never imported.",
            ],
            answer: 1,
          },
          {
            id: "r7",
            type: "choice",
            skill: "summary",
            stem: "Which sentence best summarizes the passage?",
            options: [
              "Ancient dyes are useful evidence for understanding technology, status, and trade.",
              "Synthetic dyes were more expensive than all natural dyes.",
              "Historians can study trade only by reading government records.",
              "Old textiles rarely contain information about the societies that produced them.",
            ],
            answer: 0,
          },
          {
            id: "r8",
            type: "choice",
            skill: "inference",
            stem: "What can be inferred if a cloth contains a dye not found locally?",
            options: [
              "The cloth or dye material may have moved through trade.",
              "The cloth must be a modern copy.",
              "The region had no textile production.",
              "The dye was probably synthetic.",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "listening",
    label: "听力",
    english: "Listening",
    minutes: 29,
    instruction:
      "Listen to each conversation or academic talk. During the real test, transcripts are not shown until review.",
    blocks: [
      {
        id: "l-library",
        title: "Campus Conversation: Reserving a Study Room",
        type: "audio",
        duration: "2:05",
        audioCue: "Student speaks with a librarian about finding a quiet room before exams.",
        transcript: `Student: Hi, I tried to reserve a group study room for Thursday evening, but the system says everything is full.

Librarian: That happens during exam week. Are you meeting with a group, or do you mainly need a quiet place?

Student: Actually, I need to record a short presentation. I thought a group room would be best because it has a door.

Librarian: In that case, try a media room. Those are smaller, but they have a microphone and better sound insulation. You can reserve one for one hour.

Student: That sounds even better. Do I need special permission?

Librarian: No. Just bring your student ID when you check in.`,
        questions: [
          {
            id: "l1",
            type: "choice",
            skill: "conversation purpose",
            stem: "Why does the student go to the library desk?",
            options: [
              "To ask why her student ID stopped working",
              "To find a quiet room for recording a presentation",
              "To complain about a damaged microphone",
              "To request permission to miss an exam",
            ],
            answer: 1,
          },
          {
            id: "l2",
            type: "choice",
            skill: "speaker purpose",
            stem: "Why does the librarian suggest a media room?",
            options: [
              "It better matches the student's actual need.",
              "It is the only room that does not require a reservation.",
              "It allows large groups to meet during exams.",
              "It is farther from the library entrance.",
            ],
            answer: 0,
          },
          {
            id: "l3",
            type: "choice",
            skill: "detail",
            stem: "What does the student need to bring when checking in?",
            options: ["A printed script", "A signed permission form", "A student ID", "A laptop charger"],
            answer: 2,
          },
        ],
      },
      {
        id: "l-ecology",
        title: "Academic Talk: Forest Edges",
        type: "audio",
        duration: "2:35",
        audioCue: "Professor explains why the edge of a forest can be different from the interior.",
        transcript: `Professor: Today we are going to talk about edge effects. When a forest is divided by a road or a farm field, the new boundary is not just a line on a map. Conditions near that boundary can change.

For example, more sunlight and wind may reach the edge than the interior. The soil can become warmer and drier, which favors some plants but makes it harder for others to survive.

Animals also respond differently. Some birds avoid edges because predators can move more easily there. Other species prefer edges because they can find food from both the forest and the open area.

So when scientists measure habitat loss, they cannot simply count the amount of forest that remains. They also need to ask how much of that forest has been changed by new edges.`,
        questions: [
          {
            id: "l4",
            type: "choice",
            skill: "main idea",
            stem: "What is the main topic of the talk?",
            options: [
              "How forest edges can change environmental conditions and animal behavior",
              "Why roads should always be built inside forests",
              "How farmers choose the best trees for open fields",
              "Why all birds prefer the center of a forest",
            ],
            answer: 0,
          },
          {
            id: "l5",
            type: "choice",
            skill: "organization",
            stem: "How does the professor organize the talk?",
            options: [
              "By comparing two famous scientists",
              "By defining a concept and then giving plant and animal examples",
              "By listing events in strict historical order",
              "By describing one experiment without explanation",
            ],
            answer: 1,
          },
          {
            id: "l6",
            type: "choice",
            skill: "inference",
            stem: "What can be inferred about measuring habitat loss?",
            options: [
              "Area alone may not show how much habitat quality has changed.",
              "Only birds should be included in habitat studies.",
              "Scientists no longer study roads or farm fields.",
              "Forest interiors are always warmer than edges.",
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: "writing",
    label: "写作",
    english: "Writing",
    minutes: 23,
    instruction:
      "Write clearly and directly. Use specific reasons or examples. The word counter updates as you type.",
    blocks: [
      {
        id: "w-sentence",
        title: "Build a Sentence",
        type: "writing",
        prompt: "Combine the ideas into the clearest sentence: the museum extended evening hours; more students visited; the change happened during final exams.",
        questions: [
          {
            id: "w1",
            type: "choice",
            skill: "sentence control",
            stem: "Choose the best sentence.",
            options: [
              "During final exams, the museum extended evening hours, which led more students to visit.",
              "The museum, which students, extended final exams and hours.",
              "More students visited because final exams extended the museum.",
              "Evening hours were students and the museum visited final exams.",
            ],
            answer: 0,
          },
        ],
      },
      {
        id: "w-email",
        title: "Write an Email",
        type: "writing",
        prompt:
          "Your teacher has offered two project options: a poster presentation or a short research paper. Write an email explaining which option you choose and why.",
        questions: [
          {
            id: "w2",
            type: "text",
            skill: "email tone",
            minWords: 80,
            stem: "Write a polite email with a greeting, clear choice, reasons, and closing.",
          },
        ],
      },
      {
        id: "w-discussion",
        title: "Academic Discussion",
        type: "writing",
        prompt:
          "Professor: Some cities are replacing large parking lots with parks and bike lanes. Is this a good use of public space?",
        questions: [
          {
            id: "w3",
            type: "text",
            skill: "argument development",
            minWords: 110,
            stem: "Contribute to the discussion. State your position and support it with a specific example.",
          },
        ],
      },
    ],
  },
];

export const practiceCollections = {
  reading: {
    label: "阅读",
    english: "Reading",
    description: "学术文章、日常阅读、词汇填空、主旨、推断、句子功能和摘要题。",
    totalItems: 96,
    setCount: 16,
    minutes: 420,
    sets: [
      ["Green Space Passage", "主旨 + 细节功能", "2 篇文章，8 题", "基础"],
      ["Ancient Trade Passage", "推断 + 摘要", "2 篇文章，8 题", "中等"],
      ["Complete the Words A", "词汇填空", "24 个短句", "基础"],
      ["Read in Daily Life", "邮件、公告、课程说明", "12 题", "基础"],
      ["Sentence Function Set", "例证句、转折句、定义句", "10 题", "中等"],
      ["Inference Trap Scan", "排除过度推断", "12 题", "中等"],
      ["Vocabulary in Context", "上下文替换", "20 词", "基础"],
      ["Reference Chain", "this, these, it 指代", "14 题", "基础"],
      ["Two-Passage Timer", "连续阅读耐力", "30 分钟", "考试"],
      ["Summary Choice", "三选主干信息", "8 题", "高阶"],
      ["Contrast Marker Drill", "however, instead, although", "10 题", "中等"],
      ["Evidence Locator", "先题干后定位", "12 题", "速度"],
      ["Paragraph Map", "每段 6 词结构笔记", "6 篇", "中等"],
      ["Author Purpose Set", "作者为什么提到某细节", "12 题", "中等"],
      ["Science Topic Rotation", "生态、地质、心理、化学", "16 题", "高阶"],
      ["Wrong Answer Autopsy", "错项类型分类", "20 分钟", "复盘"],
    ],
  },
  listening: {
    label: "听力",
    english: "Listening",
    description: "校园对话、公告、学术讲座、主旨、态度、组织结构和细节证据。",
    totalItems: 88,
    setCount: 14,
    minutes: 390,
    sets: [
      ["Library Conversation", "来访目的 + 下一步", "2 段对话，6 题", "基础"],
      ["Forest Edge Lecture", "讲座结构", "2 段讲座，8 题", "中等"],
      ["Campus Announcement", "政策目的", "3 段公告，9 题", "基础"],
      ["Speaker Attitude", "语气和评价词", "12 题", "中等"],
      ["Lecture Skeleton", "topic, problem, evidence", "6 段", "基础"],
      ["Two-Column Notes", "概念 + 例子", "4 段", "基础"],
      ["Detail with Function", "细节为什么出现", "10 题", "中等"],
      ["Repair Missed Signal", "复听错题前后 15 秒", "20 分钟", "复盘"],
      ["No-Pause Recall", "听完 45 秒复述", "5 段", "速度"],
      ["Definition to Example", "听定义预测例子", "8 题", "中等"],
      ["Conversation Decision", "建议是否解决问题", "10 题", "基础"],
      ["Mini Lecture Set", "连续三段 lecture", "29 分钟", "考试"],
      ["Distractor Audit", "true but irrelevant", "12 题", "复盘"],
      ["Academic Accent Mix", "不同语速同话题", "6 段", "高阶"],
    ],
  },
  writing: {
    label: "写作",
    english: "Writing",
    description: "Build a Sentence、Email、Academic Discussion、语气、句法准确和例子展开。",
    totalItems: 54,
    setCount: 12,
    minutes: 310,
    sets: [
      ["Sentence Builder A", "因果、让步、定语从句", "12 题", "基础"],
      ["Sentence Builder B", "更长句控制", "12 题", "中等"],
      ["Email Choice", "二选一说明理由", "4 封", "基础"],
      ["Email Request", "请求、解释、感谢", "4 封", "基础"],
      ["Email Register Repair", "太随意改自然礼貌", "10 句", "中等"],
      ["Discussion Claim", "第一句必须有观点", "5 题", "基础"],
      ["Concrete Example Bank", "学校、科技、城市、学习", "16 例", "速度"],
      ["Argument Expansion", "60 词扩成 120 词", "4 段", "高阶"],
      ["Grammar Accuracy Pass", "时态、冠词、主谓一致", "8 篇", "复盘"],
      ["Cohesion Upgrade", "because, however, as a result", "12 句", "中等"],
      ["23-Min Writing Set", "三题连续完成", "23 分钟", "考试"],
      ["Model Answer Compare", "只学结构，不背句子", "6 篇", "复盘"],
    ],
  },
};

export const sourcePolicy = {
  title: "真题资源策略",
  note:
    "站内题目为原创 TOEFL-style 仿真题；正式真题和 TPO 属于 ETS 授权内容，建议通过官方 TestReady、Official Guide 或 Official Tests 获取。",
};
