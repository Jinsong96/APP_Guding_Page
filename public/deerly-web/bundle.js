(function(){
// Deerly · 一鹿知 — 桌面宽屏网站版 Demo 数据与多难度内容库

const COMPANIONS = [
  {
    id: 'wick',
    name: 'PIP',
    nameEn: 'Pip',
    title: 'PIP · 小鹿',
    seat: 'B-01',
    role: '引路型旅伴',
    tags: ['温柔', '坚韧', '有担当'],
    desc: '自己也怕黑，却总走在前面替你照路。',
    quote: '“别怕，我在前面照着路。”',
    accent: '#B83C2A',
    accentSoft: 'rgba(184, 60, 42, 0.12)',
    portrait: 'assets/onboarding/companion-wick-portrait-v2.png',
    figure: 'assets/onboarding/companion-wick-figure-v2.png',
    cardImg: 'assets/onboarding/companions/wick-card-v2.jpg',
    idleVideo: 'assets/onboarding/companions/wick-v3-idle.mp4',
    greetVideo: 'assets/onboarding/companions/wick-v3-signature.mp4',
    pickingVideo: 'assets/onboarding/companions/wick-picking-v2.mp4',
    celebrateVideo: 'assets/celebrate/灯芯.mp4',
    readerPoses: {
      quizIdle: 'assets/reader/companions/idle/wick-quiz.webp',
      quizStill: 'assets/reader/companions/wick-quiz.png',
      startTap: 'assets/reader/companions/greet/wick-start-tap.webp',
      quizRight: 'assets/reader/companions/react/wick-quiz-right.webp',
      quizWrong: 'assets/reader/companions/react/wick-quiz-wrong.webp',
      lieIdle: 'assets/reader/companions/idle/wick-lie.webp',
      lieStill: 'assets/reader/companions/wick-lie.png'
    },
    paws: {
      left: 'assets/onboarding/paws/wick-left.png',
      right: 'assets/onboarding/paws/wick-right.png'
    },
    lines: {
      interestPrompt: '你平时喜欢读些什么呀？',
      ticketReady: '车票盖好章，我们从这一站出发吧。',
      startRead: ['遇到生词，点一下看看。', '看不懂的地方，点一点「解读」。', '不认识的单词，点一下。'],
      quizAsk: ['选一个试试吧！', '应该选什么呢？', '来答题吧！'],
      quizRight: ['真厉害！', 'Perfect! 答对啦！', '嗯，就是这个！'],
      quizWrong: ['没关系，再看看。', '就差一点点，看看解析吧。'],
      endPage: ['又进步了一点点哦。', '又读完一篇！', '读完啦！'],
      celebrateTitle: 'Perfect!',
      celebrateSub: '题目全对，脑子在发光'
    }
  },
  {
    id: 'pal',
    name: 'MILO',
    nameEn: 'Milo',
    title: 'MILO · 狐狸',
    seat: 'B-02',
    role: '学者型旅伴',
    tags: ['博学', '好奇', '爱问'],
    desc: '列车上的百科全书，什么都想弄明白。',
    quote: '“不懂的，我们一起弄明白。”',
    accent: '#C76B3F',
    accentSoft: 'rgba(199, 107, 63, 0.12)',
    portrait: 'assets/onboarding/companion-pal-portrait.png',
    figure: 'assets/onboarding/companion-pal-figure.png',
    cardImg: 'assets/onboarding/companions/pal-card-v2.jpg',
    idleVideo: 'assets/onboarding/companions/pal-v2-idle.mp4',
    greetVideo: 'assets/onboarding/companions/pal-v2-signature.mp4',
    pickingVideo: 'assets/onboarding/companions/pal-picking-v2.mp4',
    celebrateVideo: 'assets/celebrate/帕利.mp4',
    readerPoses: {
      quizIdle: 'assets/reader/companions/pal-quiz.png',
      quizStill: 'assets/reader/companions/pal-quiz.png',
      startTap: 'assets/reader/companions/pal-quiz.png',
      quizRight: 'assets/reader/companions/pal-quiz-right.png',
      quizWrong: 'assets/reader/companions/pal-quiz-wrong.png',
      lieIdle: 'assets/reader/companions/idle/pal-lie.webp',
      lieStill: 'assets/reader/companions/pal-lie.png'
    },
    paws: {
      left: 'assets/onboarding/paws/pal-left.png',
      right: 'assets/onboarding/paws/pal-right.png'
    },
    lines: {
      interestPrompt: '你平时最想探索哪些领域的故事？',
      ticketReady: '车票核对完毕！我们去读物车厢出发吧。',
      startRead: ['不认识的词点一下，我们一起查！', '随时点「解读」看我整理的笔记！'],
      quizAsk: ['考考你！答案就在刚才那段。', '这道题很有意思，选哪个？'],
      quizRight: ['完全正确，我记进百科了！', '太准了！推理满分！'],
      quizWrong: ['有意思！我们回原文找找线索。'],
      endPage: ['读完了！又多懂了一点点。', '收获满满的一趟旅程！'],
      celebrateTitle: 'Brilliant!',
      celebrateSub: '全部答对，百科全书都要向你学习'
    }
  },
  {
    id: 'tuanzi',
    name: 'TUANZI',
    nameEn: 'Tuanzi',
    title: 'TUANZI · 猫',
    seat: 'B-03',
    role: '守护型旅伴',
    tags: ['嘴硬', '护短', '可靠'],
    desc: '看着不好惹，其实一直在默默护着你。',
    quote: '“……我就顺路，陪你读一程。”',
    accent: '#5B678A',
    accentSoft: 'rgba(91, 103, 138, 0.12)',
    portrait: 'assets/onboarding/companion-tuanzi-portrait.png',
    figure: 'assets/onboarding/companion-tuanzi-figure.png',
    cardImg: 'assets/onboarding/companions/tuanzi-card-v2.jpg',
    idleVideo: 'assets/onboarding/companions/tuanzi-v2-idle.mp4',
    greetVideo: 'assets/onboarding/companions/tuanzi-v2-signature.mp4',
    pickingVideo: 'assets/onboarding/companions/tuanzi-picking-v2.mp4',
    celebrateVideo: 'assets/celebrate/团子.mp4',
    readerPoses: {
      quizIdle: 'assets/reader/companions/idle/tuanzi-quiz.webp',
      quizStill: 'assets/reader/companions/tuanzi-quiz.png',
      startTap: 'assets/reader/companions/idle/tuanzi-quiz.webp',
      quizRight: 'assets/reader/companions/tuanzi-quiz-right.png',
      quizWrong: 'assets/reader/companions/tuanzi-quiz-wrong.png',
      lieIdle: 'assets/reader/companions/idle/tuanzi-lie.webp',
      lieStill: 'assets/reader/companions/tuanzi-lie.png'
    },
    paws: {
      left: 'assets/onboarding/paws/tuanzi-left.png',
      right: 'assets/onboarding/paws/tuanzi-right.png'
    },
    lines: {
      interestPrompt: '……平时爱看什么？挑几个，我帮你留着。',
      ticketReady: '车票拿稳了，跟紧我上车。',
      startRead: ['……别硬扛，不认识的词就点。', '卡住了就看眼解读，不丢人。'],
      quizAsk: ['（摘下墨镜）这题你能行。', '随便选，我给你兜底。'],
      quizRight: ['哼，还行，没给我丢脸。', '……我就知道你行。'],
      quizWrong: ['……题出得刁，不怪你。'],
      endPage: ['……读完了？下一程我还顺路。', '挺能坚持嘛，继续保持。'],
      celebrateTitle: 'Nailed it!',
      celebrateSub: '哼，这几道题果然难不倒你'
    }
  },
  {
    id: 'doctor',
    name: 'JOJO',
    nameEn: 'Jojo',
    title: 'JOJO · 独角兽',
    seat: 'B-04',
    role: '倾听型旅伴',
    tags: ['温柔', '冷静', '可靠'],
    desc: '银河夜行专列的首席医疗官，温柔可靠。',
    quote: '“先听你说，我们再慢慢来。”',
    accent: '#8A63B8',
    accentSoft: 'rgba(138, 99, 184, 0.12)',
    portrait: 'assets/onboarding/companion-doctor-portrait.png',
    figure: 'assets/onboarding/companion-doctor-figure.png',
    cardImg: 'assets/onboarding/companion-doctor-card.png',
    idleVideo: 'assets/onboarding/companions/doctor-idle.mp4',
    greetVideo: 'assets/onboarding/companions/doctor-signature.mp4',
    pickingVideo: 'assets/onboarding/companions/doctor-picking.mp4',
    celebrateVideo: 'assets/celebrate/医生.mp4',
    readerPoses: {
      quizIdle: 'assets/onboarding/companion-doctor-figure.png',
      quizStill: 'assets/onboarding/companion-doctor-figure.png',
      startTap: 'assets/onboarding/companion-doctor-figure.png',
      quizRight: 'assets/onboarding/companion-doctor-figure.png',
      quizWrong: 'assets/onboarding/companion-doctor-figure.png',
      lieIdle: 'assets/onboarding/companion-doctor-figure.png',
      lieStill: 'assets/onboarding/companion-doctor-figure.png'
    },
    paws: {
      left: 'assets/onboarding/paws/doctor-left.png',
      right: 'assets/onboarding/paws/doctor-right.png'
    },
    lines: {
      interestPrompt: '深呼吸，平时读哪些话题会让你觉得放松？',
      ticketReady: '车票已经为你备好，按舒服的节奏出发吧。',
      startRead: ['遇到陌生的词，随时点一下看看。', '累了可以点「听全文」闭眼听一会儿。'],
      quizAsk: ['不用紧张，回想一下刚才读到的内容。', '慢慢看，觉得哪个最贴切？'],
      quizRight: ['答得很稳，状态非常好。', '完全正确，为你开心。'],
      quizWrong: ['别着急，我们看一眼解析就好。'],
      endPage: ['不知不觉就读完了，今天状态真好。'],
      celebrateTitle: 'Flawless!',
      celebrateSub: '节奏沉稳，答题全对，太棒了'
    }
  }
];

const INTEREST_THEMES = [
  { id: 'world', name: '世界', icon: '🌐', desc: '全球视野 · 社会观察 · 城市与远方' },
  { id: 'science', name: '科学', icon: '🔬', desc: '前沿科技 · 自然地理 · 脑洞科普' },
  { id: 'culture', name: '文化', icon: '🏺', desc: '旅行历史 · 艺术民俗 · 饮食生活' },
  { id: 'business', name: '商业', icon: '🏛️', desc: '硅谷车库 · 创业故事 · 消费洞察' },
  { id: 'growth', name: '成长', icon: '🌱', desc: '高效思维 · 心理探索 · 人物传记' },
  { id: 'story', name: '故事', icon: '🍀', desc: '奇幻短篇 · 温暖治愈 · 经典名篇' }
];

const DIFFICULTY_LEVELS = [
  {
    id: 'A1',
    label: 'A1',
    shortDesc: '简短句子·轻松读',
    bubbleText: '「入门」，短句高频词，读起来毫不费力',
    sampleEn: 'Every morning, my cat sits by the door and waits for me.',
    sampleZh: '每天早上，我的猫都会坐在门边等我。',
    sampleNote: '用最基础的并列短句 sits ... and waits，词汇全部为初中核心高频词。',
    wordCount: '约 350 词/篇',
    lexile: '300L – 500L'
  },
  {
    id: 'A2',
    label: 'A2',
    shortDesc: '日常表达·标准版',
    bubbleText: '「基础」，日常小故事这样写',
    sampleEn: 'Every morning, my cat waits for me by the door.',
    sampleZh: '每天早上，我的猫都会在门边等我。',
    sampleNote: 'wait for sb（等待某人）+ by the door（在门边），地道自然的日常叙事节奏。',
    wordCount: '约 450 词/篇',
    lexile: '500L – 700L'
  },
  {
    id: 'B1',
    label: 'B1',
    shortDesc: '丰富表达·进阶读',
    bubbleText: '「进阶」，新闻科普常这样写',
    sampleEn: "Scientists say cats can recognise their owners' voices.",
    sampleZh: '科学家表示，猫咪能够认出主人的声音。',
    sampleNote: '宾语从句结构 + 进阶核心动词 recognise（认出、辨别），常见于外刊科普报道。',
    wordCount: '约 500 词/篇',
    lexile: '700L – 900L'
  },
  {
    id: 'B2+',
    label: 'B2+',
    shortDesc: '复杂长文·挑战读',
    bubbleText: '「高阶」！原版文章的味道',
    sampleEn: 'Despite their aloof reputation, cats form surprisingly strong bonds with their owners.',
    sampleZh: '尽管猫咪总给人高冷的印象，但它们其实会与主人建立起惊人深厚的羁绊。',
    sampleNote: 'Despite 让步状语前置 + aloof（高冷的、疏离的）与 form strong bonds（建立深厚纽带），原汁原味外刊语感。',
    wordCount: '534 词/篇',
    lexile: '900L – 1150L'
  }
];

// 核心词汇词典（支持文中任意点击查词）
const GLOBAL_VOCAB = {
  gap: { word: 'gap year', phonetic: '/ˈɡæp jɪə(r)/', pos: 'n. phr.', meaning: '间隔年（毕业或升学前休学旅行、工作或做志愿者的一年）', example: 'Many students take a gap year to explore the world.' },
  abroad: { word: 'abroad', phonetic: '/əˈbrɔːd/', pos: 'adv.', meaning: '在国外；到海外', example: 'She worked abroad for two years after university.' },
  volunteer: { word: 'volunteer', phonetic: '/ˌvɒlənˈtɪə(r)/', pos: 'v. / n.', meaning: '自愿做；当志愿者；志愿者', example: 'They volunteer at a local animal shelter.' },
  career: { word: 'career', phonetic: '/kəˈrɪə(r)/', pos: 'n.', meaning: '职业生涯；事业', example: 'He started his career as a teacher.' },
  wealthy: { word: 'wealthy', phonetic: '/ˈwelθi/', pos: 'adj.', meaning: '富有的；富裕的', example: 'Only wealthy families could afford such a long journey.' },
  journey: { word: 'journey', phonetic: '/ˈdʒɜːni/', pos: 'n.', meaning: '长途旅行；旅程', example: 'They went on a long journey across Europe.' },
  century: { word: 'century', phonetic: '/ˈsentʃəri/', pos: 'n.', meaning: '世纪；一百年', example: 'The Grand Tour reached its peak in the eighteenth century.' },
  peak: { word: 'peak', phonetic: '/piːk/', pos: 'n.', meaning: '顶峰；巅峰；山峰', example: 'The custom reached its peak in the 1700s.' },
  aristocrats: { word: 'aristocrat', phonetic: '/ˈærɪstəkræt/', pos: 'n.', meaning: '贵族；王公贵族', example: 'It was mainly taken by young aristocrats.' },
  nobles: { word: 'noble', phonetic: '/ˈnəʊbl/', pos: 'n. / adj.', meaning: '贵族成员；高贵的', example: 'Most travellers were young nobles.' },
  admired: { word: 'admire', phonetic: '/ədˈmaɪə(r)/', pos: 'v.', meaning: '钦佩；赞赏；仰慕', example: 'Educated people greatly admired ancient Greece and Rome.' },
  renaissance: { word: 'Renaissance', phonetic: '/rɪˈneɪsns/', pos: 'n.', meaning: '文艺复兴（14至17世纪欧洲文化艺术运动）', example: 'They studied the art of the Renaissance in Italy.' },
  manners: { word: 'manners', phonetic: '/ˈmænəz/', pos: 'n. pl.', meaning: '礼仪；礼貌；举止规矩', example: 'It taught young men good manners and social behavior.' },
  channel: { word: 'English Channel', phonetic: '/ˈɪŋɡlɪʃ ˈtʃænl/', pos: 'n.', meaning: '英吉利海峡', example: 'A typical route began with a crossing of the English Channel.' },
  fencing: { word: 'fencing', phonetic: '/ˈfensɪŋ/', pos: 'n.', meaning: '击剑运动', example: 'They spent time in Paris learning French, dancing and fencing.' },
  ruins: { word: 'ruins', phonetic: '/ˈruːɪnz/', pos: 'n. pl.', meaning: '遗迹；废墟；古迹', example: 'In Italy, tourists visited ancient ruins and palaces.' },
  scholars: { word: 'scholar', phonetic: '/ˈskɒlə(r)/', pos: 'n.', meaning: '学者；研究员', example: 'Many hired local guides, who were often scholars.' },
  tutor: { word: 'tutor', phonetic: '/ˈtjuːtə(r)/', pos: 'n.', meaning: '私人教师；家庭导师', example: 'They were usually accompanied by a tutor.' },
  accompanied: { word: 'accompany', phonetic: '/əˈkʌmpəni/', pos: 'v.', meaning: '陪伴；陪同；伴随', example: 'Young men were accompanied by a family tutor.' },
  servants: { word: 'servant', phonetic: '/ˈsɜːvənt/', pos: 'n.', meaning: '仆人；随从', example: 'They also travelled with servants and large amounts of luggage.' },
  luggage: { word: 'luggage', phonetic: '/ˈlʌɡɪdʒ/', pos: 'n.', meaning: '行李', example: 'They carried large amounts of luggage across the Alps.' },
  portraits: { word: 'portrait', phonetic: '/ˈpɔːtrət/', pos: 'n.', meaning: '肖像画；人像', example: 'Wealthy travellers had their portraits painted in Rome.' },
  decline: { word: 'decline', phonetic: '/dɪˈklaɪn/', pos: 'v. / n.', meaning: '衰退；减少；没落', example: 'The Grand Tour began to decline in the nineteenth century.' },
  steamships: { word: 'steamship', phonetic: '/ˈstiːmʃɪp/', pos: 'n.', meaning: '蒸汽轮船', example: 'Railways and steamships made travel faster and cheaper.' },
  tourism: { word: 'tourism', phonetic: '/ˈtʊərɪzəm/', pos: 'n.', meaning: '旅游业；观光旅行', example: 'The age of modern tourism had begun.' }
};

// 首页与阅读器的完整文章库（第一篇完整还原视频 18 段 + 4 档难度 + 句法拆解 + 3 道嵌题）
const ARTICLES = [
  {
    id: 'grand-tour',
    title: 'The Grand Tour: The Original Gap Year',
    chineseTitle: '欧洲贵族的毕业旅行',
    subtitle: '三百年前，富家子弟翻越阿尔卑斯游欧洲。',
    tags: ['旅行故事', '历史故事'],
    category: 'culture',
    minutes: 5,
    wordCount: 534,
    readTimeSec: 93, // 1分33秒
    likes: 0,
    coverUrl: 'assets/covers/grand-tour.jpg',
    quote: {
      text: 'The Grand Tour turned travel into a way for young people to learn about the world.',
      translation: '壮游让年轻人通过旅行了解世界。'
    },
    questions: [
      {
        id: 'q1',
        afterParagraph: 5, // 6/18 页后弹出
        pageNumber: 6,
        stem: 'What was the Grand Tour meant to teach young men besides foreign languages?',
        options: [
          'Good manners and social behavior',
          'How to become rich',
          'How to cross the Alps'
        ],
        answer: 0,
        evidence: 'The Grand Tour was also meant to teach young men foreign languages, good manners and how to behave in high society.',
        explanation: '第 6 段明确提到，除了外语之外，壮游还旨在教会年轻人在上流社会中的良好礼仪与社交举止（good manners and how to behave in high society），因此选 A。'
      },
      {
        id: 'q2',
        afterParagraph: 10, // 11/18 页后弹出
        pageNumber: 11,
        stem: 'What was the main job of a "bear-leader"?',
        options: [
          'To guide studies and prevent trouble',
          'To carry all the luggage',
          'To teach young men to paint'
        ],
        answer: 0,
        evidence: 'They were usually accompanied by a tutor, sometimes jokingly called a "bear-leader", whose job was to guide their studies and keep them out of trouble.',
        explanation: '第 11 段指出，随行家庭导师（被戏称为 bear-leader“牵熊人”）的职责是指导学业并防止年轻人惹祸（guide their studies and keep them out of trouble），因此选 A。'
      },
      {
        id: 'q3',
        afterParagraph: 17, // 18/18 最后一页弹出
        pageNumber: 18,
        stem: 'What idea about travel is still alive today?',
        options: [
          'Travel helps people grow and learn about the world.',
          'Only rich people should travel.',
          'Travel should always be slow and expensive.'
        ],
        answer: 0,
        evidence: 'Yet the idea behind the Grand Tour, that travelling is an important part of growing up and learning about the world, is still very much alive today.',
        explanation: '最后一段总结道：壮游背后的核心理念——“旅行是成长和认识世界的重要一环”——直到今天依然充满生命力，因此选 A。'
      }
    ],
    paragraphs: [
      {
        index: 1,
        text: {
          'A1': 'Today, many young people take a year off after school. They travel or work in other countries. This idea is actually very old.',
          'A2': 'Today, many young people take a gap year after finishing school. They travel, work abroad or help others. But this idea is older than you think.',
          'B1': 'Many young people take a gap year, a break after school or university, to travel, work or volunteer. Yet the idea is far from new.',
          'B2+': 'Today, many young people take a gap year after school or university. They travel, work abroad or volunteer before starting a career. But this idea is much older than you might think.'
        },
        translation: '如今，许多年轻人在中学或大学毕业后会经历一个间隔年。在开启职业生涯之前，他们会去旅行、到国外工作或做志愿者。但这个概念比你想象的要古老得多。',
        gist: '本段以当代间隔年现象切入，说明年轻人常在求学后旅行、工作或志愿服务，而这一想法其实由来已久。',
        breakdown: [
          {
            label: '第 1 句 · 中英语序不同',
            en: [
              { t: 'Today', c: 'c1' }, { t: ', ' },
              { t: 'many young people', c: 'c2' }, { t: ' ' },
              { t: 'take a gap year', c: 'c3' }, { t: ' ' },
              { t: 'after school or university', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '如今', c: 'c1' }, { t: '，' },
              { t: '许多年轻人', c: 'c2' }, { t: ' ' },
              { t: '在中学或大学毕业后', c: 'c4' }, { t: ' ' },
              { t: '会参加间隔年', c: 'c3' }, { t: '。' }
            ]
          },
          {
            label: '第 2 句 · 中英语序不同',
            en: [
              { t: 'They', c: 'c2' }, { t: ' ' },
              { t: 'travel, work abroad or volunteer', c: 'c3' }, { t: ' ' },
              { t: 'before starting a career', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '他们', c: 'c2' }, { t: ' ' },
              { t: '在开启职业生涯前', c: 'c4' }, { t: '，' },
              { t: '旅行、出国工作或做志愿者', c: 'c3' }, { t: '。' }
            ]
          },
          {
            label: '第 3 句 · 比较结构',
            en: [
              { t: 'But', c: 'c1' }, { t: ' ' },
              { t: 'this idea', c: 'c2' }, { t: ' ' },
              { t: 'is much older', c: 'c3' }, { t: ' ' },
              { t: 'than you might think', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '但', c: 'c1' }, { t: ' ' },
              { t: '这个想法', c: 'c2' }, { t: ' ' },
              { t: '比你想象的', c: 'c4' }, { t: ' ' },
              { t: '历史要悠久得多', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'take a gap year', zh: '参加间隔年' },
          { type: '固定搭配', en: 'work abroad', zh: '出国工作' },
          { type: '固定搭配', en: 'start a career', zh: '开始职业生涯' },
          { type: '句型框架', en: 'be much older than you might think', zh: '比想象中悠久得多' }
        ]
      },
      {
        index: 2,
        text: {
          'A1': 'Three hundred years ago, rich young men from Britain travelled around Europe. Their trip lasted for many months.',
          'A2': 'Three hundred years ago, rich young men in Britain went on a long trip around Europe. It could last for months or years.',
          'B1': 'Three centuries ago, wealthy young British men went on journeys around Europe that could last for months or even years.',
          'B2+': 'Three hundred years ago, wealthy young men in Britain went on a long journey around Europe that could last months or even years.'
        },
        translation: '三百年前，英国富有的年轻男子会进行一场环游欧洲的长途旅行，这可能持续数月甚至数年。',
        gist: '回溯到三百年前的英国，富裕家庭的年轻男性会开启长达数月乃至数年的欧洲环游之旅。',
        breakdown: [
          {
            label: '定语从句后置修饰',
            en: [
              { t: 'Three hundred years ago', c: 'c1' }, { t: ', ' },
              { t: 'wealthy young men in Britain', c: 'c2' }, { t: ' ' },
              { t: 'went on a long journey around Europe', c: 'c3' }, { t: ' ' },
              { t: 'that could last months or even years', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '三百年前', c: 'c1' }, { t: '，' },
              { t: '英国富有的年轻男子', c: 'c2' }, { t: '会进行一场' },
              { t: '可能持续数月甚至数年', c: 'c4' }, { t: '的' },
              { t: '环游欧洲长途旅行', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'go on a long journey', zh: '进行长途旅行' },
          { type: '核心表达', en: 'last months or even years', zh: '持续数月甚至数年' }
        ]
      },
      {
        index: 3,
        text: {
          'A1': 'This trip was called the Grand Tour. It started in the 1600s and was very popular in the 1700s.',
          'A2': 'People called it the Grand Tour. It became popular in the late 1600s and was most famous in the 1700s.',
          'B1': 'Known as the Grand Tour, it became popular in the late 1600s and was at its height in the 1700s.',
          'B2+': 'It was called the Grand Tour. The Grand Tour became popular in the late seventeenth century and reached its peak in the eighteenth century.'
        },
        translation: '这被称为“壮游”（Grand Tour）。壮游在十七世纪末流行起来，并在十八世纪达到顶峰。',
        gist: '介绍这一传统旅行的名称“壮游（Grand Tour）”及其兴起与鼎盛的时代。',
        breakdown: [
          {
            label: '并列谓语结构',
            en: [
              { t: 'The Grand Tour', c: 'c2' }, { t: ' ' },
              { t: 'became popular in the late seventeenth century', c: 'c3' }, { t: ' and ' },
              { t: 'reached its peak in the eighteenth century', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '壮游', c: 'c2' }, { t: ' ' },
              { t: '在十七世纪末流行起来', c: 'c3' }, { t: '，并在' },
              { t: '十八世纪达到顶峰', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'reach its peak', zh: '达到顶峰 / 鼎盛期' },
          { type: '时间表达', en: 'in the late seventeenth century', zh: '在十七世纪末' }
        ]
      },
      {
        index: 4,
        text: {
          'A1': 'Most travellers were young men from rich families. They were about twenty years old and had just finished school.',
          'A2': 'Most travellers were sons of rich families. They took the trip in their late teens or early twenties after school.',
          'B1': 'Most travellers were young nobles or sons of rich families, usually in their late teens or early twenties, who had finished school or university.',
          'B2+': 'It was mainly taken by young aristocrats and the sons of rich families, usually in their late teens or early twenties, after they had finished their studies at school or university.'
        },
        translation: '参与者主要是年轻的贵族和富裕家庭的子弟，通常在十几岁末或二十出头、完成中学或大学学业之后出发。',
        gist: '说明壮游的主要参与人群：刚结束学业的英国年轻贵族与富家子弟。',
        breakdown: [
          {
            label: '被动语态 + 插入语 + 时间状语从句',
            en: [
              { t: 'It was mainly taken by', c: 'c1' }, { t: ' ' },
              { t: 'young aristocrats and the sons of rich families', c: 'c2' }, { t: ', ' },
              { t: 'usually in their late teens or early twenties', c: 'c3' }, { t: ', ' },
              { t: 'after they had finished their studies', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '它主要由', c: 'c1' },
              { t: '年轻贵族与富家子弟', c: 'c2' },
              { t: '在十几岁末或二十出头', c: 'c3' }, { t: '、' },
              { t: '完成学业之后', c: 'c4' }, { t: '参与。' }
            ]
          }
        ],
        expressions: [
          { type: '年龄表达', en: 'in their late teens or early twenties', zh: '十八九岁或二十出头' },
          { type: '核心词汇', en: 'young aristocrats', zh: '年轻贵族' }
        ]
      },
      {
        index: 5,
        text: {
          'A1': 'The goal was education. People loved the art and history of old Greece and Rome.',
          'A2': 'The goal was education. Educated people loved the art and history of ancient Greece and Rome.',
          'B1': 'The goal was education. Educated people deeply admired the art, history and ideas of ancient Greece, Rome and the Renaissance.',
          'B2+': 'The aim was education. In those days, educated people greatly admired the art, history and ideas of ancient Greece and Rome, as well as the art of the Renaissance.'
        },
        translation: '旅行的目的是教育。在那个时代，受过教育的人非常推崇古希腊和古罗马的艺术、历史与思想，以及文艺复兴时期的艺术。',
        gist: '阐述壮游的核心目的：亲身接受古典文化与文艺复兴艺术的熏陶。',
        breakdown: [
          {
            label: '主谓宾 + 并列宾语扩展',
            en: [
              { t: 'In those days', c: 'c1' }, { t: ', ' },
              { t: 'educated people', c: 'c2' }, { t: ' ' },
              { t: 'greatly admired', c: 'c3' }, { t: ' ' },
              { t: 'the art, history and ideas of ancient Greece and Rome', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '在那个年代', c: 'c1' }, { t: '，' },
              { t: '受过教育的人', c: 'c2' }, { t: ' ' },
              { t: '极其推崇', c: 'c3' }, { t: ' ' },
              { t: '古希腊与古罗马的艺术、历史与思想', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心搭配', en: 'greatly admire', zh: '极其钦佩 / 推崇' },
          { type: '固定搭配', en: 'as well as', zh: '以及；除……之外还' }
        ]
      },
      {
        index: 6,
        text: {
          'A1': 'A gentleman needed to see these places himself. The trip also taught him languages and good manners.',
          'A2': 'A gentleman was expected to see these things himself. The trip also taught foreign languages and good manners.',
          'B1': 'A gentleman was expected to see these things with his own eyes, while learning foreign languages, good manners and social skills.',
          'B2+': 'A gentleman was expected to have seen these things with his own eyes. The Grand Tour was also meant to teach young men foreign languages, good manners and how to behave in high society.'
        },
        translation: '一位真正的绅士应当亲眼见过这些胜景。此外，壮游还旨在教会年轻男子外语、良好礼仪，以及如何在上流社会中得体处事。',
        gist: '除了眼界与艺术，壮游也是英国绅士学习外语、社交礼仪与上流社会规矩的必修课。（本段后触发第 1 道理解题）',
        breakdown: [
          {
            label: 'be meant to do 表目的',
            en: [
              { t: 'The Grand Tour', c: 'c1' }, { t: ' ' },
              { t: 'was also meant to teach young men', c: 'c2' }, { t: ' ' },
              { t: 'foreign languages, good manners', c: 'c3' }, { t: ' and ' },
              { t: 'how to behave in high society', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '壮游', c: 'c1' }, { t: ' ' },
              { t: '还旨在教会年轻男子', c: 'c2' }, { t: ' ' },
              { t: '外语、良好的礼仪', c: 'c3' }, { t: '以及' },
              { t: '如何在上流社会得体处事', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'with one\'s own eyes', zh: '亲眼所见' },
          { type: '句型框架', en: 'be meant to do sth', zh: '旨在做某事；意在做某事' }
        ]
      },
      {
        index: 7,
        text: {
          'A1': 'First, they crossed the sea to France. In Paris, they learned French, dancing and sword fighting.',
          'A2': 'The trip usually started by crossing the sea to France. In Paris, travellers learned French, dancing and fencing.',
          'B1': 'A typical trip began by crossing the English Channel to France, where travellers stayed in Paris learning French, dancing and fencing.',
          'B2+': 'A typical route began with a crossing of the English Channel to France. Travellers often spent time in Paris, learning French, dancing and fencing.'
        },
        translation: '一条经典的路线始于横渡英吉利海峡前往法国。旅行者通常会在巴黎停留一段时间，学习法语、舞蹈和击剑。',
        gist: '壮游路线第一站：横渡英吉利海峡抵达巴黎，进修法语与社交技艺。',
        breakdown: [
          {
            label: '现在分词作伴随状语',
            en: [
              { t: 'Travellers', c: 'c1' }, { t: ' ' },
              { t: 'often spent time in Paris', c: 'c2' }, { t: ', ' },
              { t: 'learning French, dancing and fencing', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '旅行者们', c: 'c1' }, { t: ' ' },
              { t: '通常会在巴黎住上一段时间', c: 'c2' }, { t: '，' },
              { t: '学习法语、舞蹈与击剑', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心搭配', en: 'a typical route', zh: '一条典型的路线' },
          { type: '文化词汇', en: 'learning French, dancing and fencing', zh: '学习法语、舞蹈和击剑' }
        ]
      },
      {
        index: 8,
        text: {
          'A1': 'Next, they went to Italy. They visited Rome, Venice and Florence to see old buildings and paintings.',
          'A2': 'From France, they crossed the Alps into Italy. They visited Rome, Venice and Florence to see famous art.',
          'B1': 'From France, they crossed the Alps into Italy, visiting cities like Rome, Venice and Florence to study classical art and architecture.',
          'B2+': 'From France, they crossed the Alps into Italy, the heart of the Grand Tour, visiting Florence, Venice, Rome and Naples.'
        },
        translation: '离开法国后，他们翻越阿尔卑斯山进入壮游的核心目的地——意大利，先后造访佛罗伦萨、威尼斯、罗马和那不勒斯。',
        gist: '翻越阿尔卑斯山进入壮游的核心站——意大利各大艺术名城。',
        breakdown: [
          {
            label: '同位语 + 分词状语',
            en: [
              { t: 'From France', c: 'c1' }, { t: ', ' },
              { t: 'they crossed the Alps into Italy', c: 'c2' }, { t: ', ' },
              { t: 'the heart of the Grand Tour', c: 'c3' }, { t: ', ' },
              { t: 'visiting Florence, Venice, Rome and Naples', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '从法国出发', c: 'c1' }, { t: '，' },
              { t: '他们翻越阿尔卑斯山进入意大利', c: 'c2' }, { t: '——' },
              { t: '壮游的核心之地', c: 'c3' }, { t: '，' },
              { t: '造访佛罗伦萨、威尼斯、罗马与那不勒斯', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '地理表达', en: 'cross the Alps', zh: '翻越阿尔卑斯山' },
          { type: '核心表达', en: 'the heart of the Grand Tour', zh: '壮游的核心之地' }
        ]
      },
      {
        index: 9,
        text: {
          'A1': 'Some stayed in one city for months. In Italy, they looked at old buildings and hired teachers to explain history.',
          'A2': 'Some tourists stayed for months in one city. In Italy, they visited ancient ruins and hired guides to explain the history.',
          'B1': 'Some tourists spent months in a single city. In Italy, they visited ancient ruins, churches and galleries, hiring local scholars as guides.',
          'B2+': 'Some tourists spent several months in a single city, studying with local teachers. In Italy, tourists visited ancient ruins, churches, palaces and galleries. Many hired local guides, who were often scholars, to explain the history.'
        },
        translation: '有些旅行者会在一座城市待上好几个月，跟随当地老师学习。在意大利，他们参观古代遗迹、教堂、宫殿和美术馆。许多人还会聘请当地向导——通常是学者——来讲解历史。',
        gist: '在意大利深度旅居：参观遗迹与美术馆，并聘请当地学者担任历史向导。',
        breakdown: [
          {
            label: '非限制性定语从句插入',
            en: [
              { t: 'Many hired local guides', c: 'c1' }, { t: ', ' },
              { t: 'who were often scholars', c: 'c2' }, { t: ', ' },
              { t: 'to explain the history', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '许多人会聘请当地向导', c: 'c1' }, { t: '（' },
              { t: '他们往往是学者', c: 'c2' }, { t: '）' },
              { t: '来讲解历史', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心词汇', en: 'ancient ruins', zh: '古代遗迹 / 废墟' },
          { type: '核心搭配', en: 'hire local guides', zh: '聘请当地向导' }
        ]
      },
      {
        index: 10,
        text: {
          'A1': 'Travel was not all serious work. Young men also went to parties, concerts and theatres at night.',
          'A2': 'Of course, it was not only about study. Young men also enjoyed music, theatre and big parties.',
          'B1': 'Of course, not everyone used the tour only for serious study; many young men also enjoyed concerts, opera houses and lively parties.',
          'B2+': 'Of course, not everyone used the tour for serious study. Many young men spent their evenings at concerts, opera houses and parties, enjoying the freedom of being far from home.'
        },
        translation: '当然，并非所有人都把这趟旅程只用于严肃的求学。许多年轻人晚上流连于音乐会、歌剧院和社交派对，享受远离家乡的自由。',
        gist: '除了白天的古典研学，年轻旅人也在夜晚享受歌剧、音乐会与远离家人的自由。',
        breakdown: [
          {
            label: '部分否定 + 现在分词作状语',
            en: [
              { t: 'not everyone used the tour for serious study', c: 'c1' }, { t: '; ' },
              { t: 'many spent their evenings at concerts and parties', c: 'c2' }, { t: ', ' },
              { t: 'enjoying the freedom of being far from home', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '并非所有人都把旅途用于严肃求学', c: 'c1' }, { t: '；' },
              { t: '许多人晚上去听音乐会和参加派对', c: 'c2' }, { t: '，' },
              { t: '享受远离家乡的自由', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '部分否定', en: 'not everyone...', zh: '并非每个人……' },
          { type: '固定搭配', en: 'far from home', zh: '远离家乡' }
        ]
      },
      {
        index: 11,
        text: {
          'A1': 'Young men did not travel alone. A teacher went with them to help them study and stay safe.',
          'A2': 'Young men rarely travelled alone. A tutor went with them to guide their studies and keep them out of trouble.',
          'B1': 'Young men rarely travelled alone; they went with a tutor, jokingly called a "bear-leader", who guided their studies and kept them out of trouble.',
          'B2+': 'Young men rarely travelled alone. They were usually accompanied by a tutor, sometimes jokingly called a "bear-leader", whose job was to guide their studies and keep them out of trouble.'
        },
        translation: '年轻男子很少独自出行。他们通常由一位家庭导师陪同——有时被戏称为“牵熊人”（bear-leader）——负责指导他们的学业，并防止他们惹出麻烦。',
        gist: '介绍随行导师“牵熊人（bear-leader）”的有趣称呼与督学职责。（本段后触发第 2 道理解题）',
        breakdown: [
          {
            label: '过去分词后置 + whose 定语从句',
            en: [
              { t: 'They were usually accompanied by a tutor', c: 'c1' }, { t: ', ' },
              { t: 'sometimes jokingly called a "bear-leader"', c: 'c2' }, { t: ', ' },
              { t: 'whose job was to guide their studies and keep them out of trouble', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '他们通常由一位家庭导师陪同', c: 'c1' }, { t: '——' },
              { t: '有时被戏称为“牵熊人”', c: 'c2' }, { t: '——' },
              { t: '其职责是指导学业并防止他们惹祸', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'be accompanied by', zh: '由……陪同' },
          { type: '高频短语', en: 'keep sb out of trouble', zh: '让某人远离麻烦 / 不惹祸' }
        ]
      },
      {
        index: 12,
        text: {
          'A1': 'They also took servants and many bags. Travel was slow and expensive, so only rich families could do it.',
          'A2': 'They also travelled with servants and lots of luggage. Travel was slow, hard and expensive, so only rich people could afford it.',
          'B1': 'They travelled with servants and heavy luggage. Because journeys were slow, uncomfortable and costly, only wealthy families could afford them.',
          'B2+': 'They also travelled with servants and large amounts of luggage. Travel was slow, uncomfortable and expensive, and only rich families could afford it.'
        },
        translation: '他们还会带着仆人和大批行李一同上路。那时的旅行缓慢、颠簸又昂贵，只有富裕家庭才负担得起。',
        gist: '描述十八世纪欧洲旅行的真实条件：随从众多、路途颠簸且费用高昂。',
        breakdown: [
          {
            label: '并列分句说明原因与结果',
            en: [
              { t: 'Travel was slow, uncomfortable and expensive', c: 'c1' }, { t: ', and ' },
              { t: 'only rich families could afford it', c: 'c2' }, { t: '.' }
            ],
            zh: [
              { t: '旅行缓慢、不舒适且费用高昂', c: 'c1' }, { t: '，因此' },
              { t: '只有富裕家庭才负担得起', c: 'c2' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'large amounts of luggage', zh: '大批行李' },
          { type: '核心动词', en: 'afford it', zh: '负担得起' }
        ]
      },
      {
        index: 13,
        text: {
          'A1': 'Travellers bought paintings and books in Italy and brought them back to Britain.',
          'A2': 'When they went home, travellers brought back paintings, statues and books from Italy.',
          'B1': 'Returning home, travellers brought crates of paintings, sculptures and books back to their country houses in Britain.',
          'B2+': 'On their return, travellers brought back paintings, sculptures, books and musical instruments to fill their family homes in Britain.'
        },
        translation: '返程时，旅行者们会带回画作、雕塑、书籍和乐器，用来装点他们在英国的家族庄园。',
        gist: '壮游旅人从欧洲大陆带回大量艺术品与典籍，充实英国庄园。',
        breakdown: [
          {
            label: '不定式作目的状语',
            en: [
              { t: 'On their return', c: 'c1' }, { t: ', ' },
              { t: 'travellers brought back paintings, sculptures and books', c: 'c2' }, { t: ' ' },
              { t: 'to fill their family homes in Britain', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '返程时', c: 'c1' }, { t: '，' },
              { t: '旅行者带回画作、雕塑与书籍', c: 'c2' }, { t: '，' },
              { t: '用来装点他们在英国的家族宅邸', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'on one\'s return', zh: '在某人返程/归来时' },
          { type: '短语动词', en: 'bring back', zh: '带回' }
        ]
      },
      {
        index: 14,
        text: {
          'A1': 'Some of these art collections later became museums. Travellers also paid artists to paint their pictures in Rome.',
          'A2': 'Some of these collections later became museums. Rich travellers also had their pictures painted in front of famous ruins.',
          'B1': 'Some of these collections later formed the basis of museums. Travellers also had their portraits painted in front of Roman ruins.',
          'B2+': 'Some of these collections later became the basis of museums. Wealthy travellers also had their portraits painted in Rome, often standing in front of famous ruins, a bit like a modern tourist photo.'
        },
        translation: '其中一些收藏后来成为了博物馆的馆藏基础。富有的旅行者还会在罗马请人绘制肖像，画面里的他们常常站在著名古迹前——有点像今天的游客打卡照。',
        gist: '壮游收藏奠定了后世博物馆的基础，而在古迹前画肖像则是三百年前的“游客打卡照”。',
        breakdown: [
          {
            label: 'have sth done 结构 + 现在分词伴随',
            en: [
              { t: 'Wealthy travellers', c: 'c1' }, { t: ' ' },
              { t: 'also had their portraits painted in Rome', c: 'c2' }, { t: ', ' },
              { t: 'often standing in front of famous ruins', c: 'c3' }, { t: ', ' },
              { t: 'a bit like a modern tourist photo', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '富有的旅行者', c: 'c1' }, { t: ' ' },
              { t: '还会在罗马请人画肖像', c: 'c2' }, { t: '，' },
              { t: '常常站在著名古迹前', c: 'c3' }, { t: '，' },
              { t: '有点像现代的游客照', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心语法', en: 'have one\'s portrait painted', zh: '请人给自己画肖像（have sth done）' },
          { type: '固定搭配', en: 'become the basis of', zh: '成为……的基础' }
        ]
      },
      {
        index: 15,
        text: {
          'A1': 'British buildings and gardens started to look like Italian ones because of the Grand Tour.',
          'A2': 'The Grand Tour changed British taste. New buildings and gardens in Britain copied the style of Italy.',
          'B1': 'The Grand Tour shaped British culture: architecture, gardens and fashion at home all borrowed ideas from Italy and France.',
          'B2+': 'In this way, the Grand Tour shaped British taste in art, architecture and gardens for generations.'
        },
        translation: '通过这种方式，壮游影响了整整几代英国人在艺术、建筑与园林设计上的审美取向。',
        gist: '总结壮游对英国本土建筑、园林与艺术审美的深远塑造。',
        breakdown: [
          {
            label: '介词短语作状语',
            en: [
              { t: 'In this way', c: 'c1' }, { t: ', ' },
              { t: 'the Grand Tour shaped British taste', c: 'c2' }, { t: ' ' },
              { t: 'in art, architecture and gardens', c: 'c3' }, { t: ' ' },
              { t: 'for generations', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '通过这种方式', c: 'c1' }, { t: '，' },
              { t: '壮游塑造了英国人的审美品味', c: 'c2' }, { t: '（涵盖' },
              { t: '艺术、建筑与园林', c: 'c3' }, { t: '），' },
              { t: '延续数代人', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心搭配', en: 'shape one\'s taste', zh: '塑造某人的审美/品味' },
          { type: '时间短语', en: 'for generations', zh: '延续数代人；世世代代' }
        ]
      },
      {
        index: 16,
        text: {
          'A1': 'Some women also took similar trips, even though it was harder for them to travel at that time.',
          'A2': 'Some women also made similar trips in later years, although they had less freedom to travel.',
          'B1': 'Some women, especially in later years, also made similar journeys, though their freedom to travel was more limited.',
          'B2+': 'Some women, especially in the later years, also made similar journeys, although their freedom to travel was more limited.'
        },
        translation: '一些女性——尤其是在壮游盛行的后期——也进行了类似的旅行，尽管她们在出行自由上受到更多限制。',
        gist: '补充女性旅行者的身影：尽管受时代限制，仍有女性踏上壮游之路。',
        breakdown: [
          {
            label: 'although 让步状语从句',
            en: [
              { t: 'Some women', c: 'c1' }, { t: ', ' },
              { t: 'especially in the later years', c: 'c2' }, { t: ', ' },
              { t: 'also made similar journeys', c: 'c3' }, { t: ', ' },
              { t: 'although their freedom to travel was more limited', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '一些女性', c: 'c1' }, { t: '——' },
              { t: '尤其是在后期', c: 'c2' }, { t: '——' },
              { t: '也进行了类似的旅行', c: 'c3' }, { t: '，' },
              { t: '尽管她们的出行自由受到更多限制', c: 'c4' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'make similar journeys', zh: '进行类似的旅行' },
          { type: '核心表达', en: 'freedom to travel', zh: '出行的自由' }
        ]
      },
      {
        index: 17,
        text: {
          'A1': 'In the 1800s, trains and steamships made travel fast and cheap. More ordinary people started to travel.',
          'A2': 'In the 1800s, trains and ships made travel faster and cheaper, so middle-class people began to travel too.',
          'B1': 'The Grand Tour declined in the 1800s as railways and steamships made travel faster and cheaper for the middle classes.',
          'B2+': 'The Grand Tour began to decline in the nineteenth century, when railways and steamships made travel faster and cheaper, and more people from the middle classes began to travel.'
        },
        translation: '十九世纪，随着铁路和蒸汽轮船让旅行变得更快、更便宜，越来越多中产阶级开始出行，传统的贵族壮游也随之逐渐落幕。',
        gist: '工业革命带来铁路与蒸汽船，旅行走向大众化，贵族专属的壮游时代落幕。',
        breakdown: [
          {
            label: 'when 定语从句说明时代变化',
            en: [
              { t: 'The Grand Tour began to decline in the nineteenth century', c: 'c1' }, { t: ', ' },
              { t: 'when railways and steamships made travel faster and cheaper', c: 'c2' }, { t: ', and ' },
              { t: 'more people from the middle classes began to travel', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '壮游在十九世纪开始衰退', c: 'c1' }, { t: '，当时' },
              { t: '铁路与蒸汽船让旅行变得更快更便宜', c: 'c2' }, { t: '，' },
              { t: '更多中产阶级民众开始出行', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心搭配', en: 'begin to decline', zh: '开始衰退 / 走下坡路' },
          { type: '社会词汇', en: 'the middle classes', zh: '中产阶级' }
        ]
      },
      {
        index: 18,
        text: {
          'A1': 'Modern travel started then. Still, the idea that travel helps us grow up and learn is very much alive today.',
          'A2': 'Modern tourism had begun. Still, the idea that travelling helps you grow up and learn about the world is alive today.',
          'B1': 'The age of modern tourism had begun. Yet the belief that travelling is a key part of growing up and learning about the world lives on today.',
          'B2+': 'The age of modern tourism had begun. Yet the idea behind the Grand Tour, that travelling is an important part of growing up and learning about the world, is still very much alive today.'
        },
        translation: '现代旅游业时代由此开启。然而，壮游背后的理念——旅行是成长与认识世界的重要部分——直到今天依然充满生命力。',
        gist: '首尾呼应：从三百年前的壮游到今天的间隔年，通过旅行认识世界、完成成长的精神从未改变。（本段触发第 3 道理解题与读完庆祝）',
        breakdown: [
          {
            label: 'that 同位语从句解释核心理念',
            en: [
              { t: 'Yet the idea behind the Grand Tour', c: 'c1' }, { t: ', ' },
              { t: 'that travelling is an important part of growing up and learning about the world', c: 'c2' }, { t: ', ' },
              { t: 'is still very much alive today', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '然而壮游背后的理念', c: 'c1' }, { t: '——' },
              { t: '旅行是成长和认识世界的重要一环', c: 'c2' }, { t: '——' },
              { t: '在今天依然充满生命力', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'the age of modern tourism', zh: '现代旅游业时代' },
          { type: '高频表达', en: 'be very much alive', zh: '依然充满活力 / 依然盛行' }
        ]
      }
    ]
  },
  {
    id: 'two-friends-garage',
    title: 'Two Friends, a Garage and 538 Dollars',
    chineseTitle: '一间车库和538美元',
    subtitle: '用538美元，他们在车库写下硅谷起点。',
    tags: ['商业故事', '创业故事', '企业文化'],
    category: 'business',
    minutes: 5,
    wordCount: 486,
    readTimeSec: 110,
    likes: 0,
    coverUrl: 'assets/covers/two-friends.jpg',
    quote: {
      text: 'The small garage in Palo Alto became the birthplace of Silicon Valley.',
      translation: '帕洛阿尔托的那间小车库，成为了硅谷的诞生地。'
    },
    questions: [
      {
        id: 'q1',
        afterParagraph: 2,
        pageNumber: 3,
        stem: 'How did Bill Hewlett and Dave Packard decide the order of their company name?',
        options: [
          'They flipped a coin',
          'They used alphabetical order',
          'Their teacher chose it for them'
        ],
        answer: 0,
        evidence: 'To decide whether the company would be called Hewlett-Packard or Packard-Hewlett, they simply flipped a coin.',
        explanation: '两人通过抛硬币（flipped a coin）决定了公司名叫 Hewlett-Packard（惠普），因此选 A。'
      }
    ],
    paragraphs: [
      {
        index: 1,
        text: {
          'A1': 'In 1938, two young friends named Bill and Dave rented a small garage in California. They had only 538 dollars.',
          'A2': 'In 1938, two Stanford graduates, Bill Hewlett and Dave Packard, rented a small garage in California with just 538 dollars.',
          'B1': 'In 1938, two young engineers, Bill Hewlett and Dave Packard, moved into a wooden garage in Palo Alto with $538 in cash.',
          'B2+': 'In the autumn of 1938, two young Stanford engineering graduates, Bill Hewlett and Dave Packard, began working in a tiny wooden garage in Palo Alto with just 538 dollars.'
        },
        translation: '1938 年秋，两位刚从斯坦福大学毕业的年轻工程师——比尔·休利特与戴夫·帕卡德——揣着仅有的 538 美元，在帕洛阿尔托的一间小木头车库里开始了创业。',
        gist: '两位斯坦福毕业生带着 538 美元走进加州帕洛阿尔托的一间小车库。',
        breakdown: [
          {
            label: '同位语修饰主语',
            en: [
              { t: 'In the autumn of 1938', c: 'c1' }, { t: ', ' },
              { t: 'two young Stanford engineering graduates', c: 'c2' }, { t: ' ' },
              { t: 'began working in a tiny wooden garage', c: 'c3' }, { t: ' ' },
              { t: 'with just 538 dollars', c: 'c4' }, { t: '.' }
            ],
            zh: [
              { t: '1938年秋天', c: 'c1' }, { t: '，' },
              { t: '两位年轻的斯坦福工程系毕业生', c: 'c2' }, { t: ' ' },
              { t: '带着仅有的 538 美元', c: 'c4' }, { t: ' ' },
              { t: '在一间狭小的木车库里开始工作', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'engineering graduates', zh: '工程系毕业生' },
          { type: '介词短语', en: 'with just 538 dollars', zh: '仅凭 538 美元' }
        ]
      },
      {
        index: 2,
        text: {
          'A1': 'Their first good machine tested sound. They named it Model 200A so people would think they were not a new company.',
          'A2': 'Their first product was a sound machine. They called it Model 200A so buyers would not think it was their very first machine.',
          'B1': 'Their first successful product was an audio oscillator. They cleverly named it the Model 200A to make their company look well established.',
          'B2+': 'Their first breakthrough was an audio oscillator, which they cleverly named the Model 200A so customers would not realise it was the first product they had ever built.'
        },
        translation: '他们的第一个突破是一台音频振荡器。两人聪明地将它命名为“200A 型”，好让客户不会察觉这是他们造出的第一台产品。',
        gist: '第一台产品故意取名“200A 型”，让初创小作坊显得像成熟企业。',
        breakdown: [
          {
            label: 'so (that) 目的状语从句',
            en: [
              { t: 'They cleverly named it the Model 200A', c: 'c1' }, { t: ' ' },
              { t: 'so customers would not realise', c: 'c2' }, { t: ' ' },
              { t: 'it was the first product they had ever built', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '他们巧妙地将其命名为 200A 型', c: 'c1' }, { t: '，' },
              { t: '以免客户察觉到', c: 'c2' }, { t: ' ' },
              { t: '这是他们制造的第一款产品', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心词汇', en: 'breakthrough', zh: '重大突破' },
          { type: '目的从句', en: 'so customers would not realise...', zh: '以免客户意识到……' }
        ]
      },
      {
        index: 3,
        text: {
          'A1': 'They flipped a coin to choose the company name: Hewlett-Packard. Walt Disney bought eight of their machines.',
          'A2': 'To choose their company name, they flipped a coin. Soon, Walt Disney Studios bought eight machines for a new movie.',
          'B1': 'To decide the order of their names, they flipped a coin—and Hewlett-Packard was born. Soon Walt Disney bought eight oscillators for the film Fantasia.',
          'B2+': 'To decide whether the company would be called Hewlett-Packard or Packard-Hewlett, they simply flipped a coin. Before long, Walt Disney Studios ordered eight of their machines for the film Fantasia, and Silicon Valley had its birthplace.'
        },
        translation: '为了决定公司名叫“休利特-帕卡德”还是“帕卡德-休利特”，他们干脆抛了一枚硬币。不久后，华特迪士尼工作室为电影《幻想曲》订购了八台机器，硅谷也由此迎来了它的诞生地。',
        gist: '抛硬币诞生了惠普（HP），迪士尼成为首批大客户，小车库成为硅谷起点。',
        breakdown: [
          {
            label: '不定式作目的状语前置',
            en: [
              { t: 'To decide whether the company would be called HP or PH', c: 'c1' }, { t: ', ' },
              { t: 'they simply flipped a coin', c: 'c2' }, { t: '.' }
            ],
            zh: [
              { t: '为了决定公司名称的先后顺序', c: 'c1' }, { t: '，' },
              { t: '他们干脆抛了一枚硬币', c: 'c2' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '地道短语', en: 'flip a coin', zh: '抛硬币决定' },
          { type: '时间短语', en: 'before long', zh: '不久之后' }
        ]
      }
    ]
  },
  {
    id: 'renewable-living',
    title: 'Renewable Living',
    chineseTitle: '可再生的生活',
    subtitle: '一家人搬进风力供电的小屋。',
    tags: ['气候能源', '前沿科技'],
    category: 'science',
    minutes: 4,
    wordCount: 412,
    readTimeSec: 85,
    likes: 0,
    coverUrl: 'assets/covers/renewable-living.jpg',
    quote: {
      text: 'Living with nature does not mean giving up modern comfort.',
      translation: '与自然共生，并不意味着放弃现代生活的舒适。'
    },
    questions: [
      {
        id: 'q1',
        afterParagraph: 1,
        pageNumber: 2,
        stem: 'Where does the family store extra electricity for cloudy days?',
        options: [
          'In home battery packs',
          'In a tall water tower',
          'They buy it from a factory'
        ],
        answer: 0,
        evidence: 'Extra power is stored in battery packs along the wall, keeping the lights warm even on rainy nights.',
        explanation: '文中提到多余的电力储存在墙边的电池组（battery packs）中，因此选 A。'
      }
    ],
    paragraphs: [
      {
        index: 1,
        text: {
          'A1': 'The Miller family moved to a green hill. A wind turbine and roof panels give their house clean power.',
          'A2': 'When the Miller family moved to the countryside, they built a house powered by wind and sunlight.',
          'B1': 'High on a breezy hillside, the Miller family lives in a cabin powered entirely by a small wind turbine and solar roof panels.',
          'B2+': 'Perched on a breezy hillside, the Miller family’s timber cabin runs entirely on clean energy harvested from a slender wind turbine and rooftop solar panels.'
        },
        translation: '在微风吹拂的山坡上，米勒一家的木屋完全依靠一座纤细的风力发电机和屋顶太阳能板收集的清洁能源运转。',
        gist: '米勒一家搬进由风力与太阳能100%供电的山坡木屋。',
        breakdown: [
          {
            label: '过去分词前置作状语 + 后置定语',
            en: [
              { t: 'Perched on a breezy hillside', c: 'c1' }, { t: ', ' },
              { t: 'the family’s cabin runs entirely on clean energy', c: 'c2' }, { t: ' ' },
              { t: 'harvested from a wind turbine and solar panels', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '坐落在微风吹拂的山坡上', c: 'c1' }, { t: '，' },
              { t: '这家人居住的木屋完全依靠清洁能源运转', c: 'c2' }, { t: '——这些能源' },
              { t: '采集自风力发电机与太阳能板', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '固定搭配', en: 'run entirely on', zh: '完全依靠……运转' },
          { type: '核心搭配', en: 'clean energy', zh: '清洁能源' }
        ]
      },
      {
        index: 2,
        text: {
          'A1': 'Extra power goes into batteries on the wall. Even on rainy nights, the house stays bright and warm.',
          'A2': 'Extra power is saved in batteries on the wall. Even on rainy nights, the lights stay warm and bright.',
          'B1': 'Extra electricity is stored in battery packs along the wall, keeping the home warm and bright even during winter storms.',
          'B2+': 'Extra power is stored in battery packs along the wall, keeping the lights warm even on rainy nights and proving that sustainable living can be both practical and comfortable.'
        },
        translation: '多余的电力被储存在墙边的储能电池组里，即使在雨夜也能让屋里灯火温暖，证明可持续生活既务实又舒适。',
        gist: '储能电池保障全天候用电，让环保生活兼具温暖与舒适。',
        breakdown: [
          {
            label: '被动语态 + 现在分词结果状语',
            en: [
              { t: 'Extra power is stored in battery packs', c: 'c1' }, { t: ', ' },
              { t: 'keeping the lights warm even on rainy nights', c: 'c2' }, { t: '.' }
            ],
            zh: [
              { t: '多余的电力储存在电池组中', c: 'c1' }, { t: '，' },
              { t: '即使在雨夜也能让灯光保持温暖', c: 'c2' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心词汇', en: 'battery packs', zh: '电池组 / 储能包' },
          { type: '固定搭配', en: 'sustainable living', zh: '可持续生活' }
        ]
      }
    ]
  },
  {
    id: 'cleanest-room',
    title: 'The Cleanest Room in the School',
    chineseTitle: '一场扫地考试',
    subtitle: '一把扫帚，决定他能否走进学校。',
    tags: ['人物故事', '成长励志'],
    category: 'growth',
    minutes: 4,
    wordCount: 440,
    readTimeSec: 95,
    likes: 0,
    coverUrl: 'assets/covers/cleanest-room.jpg',
    quote: {
      text: 'Character is shown in how we handle the smallest tasks.',
      translation: '一个人对待最微小事物的态度，往往映照出他的品格。'
    },
    questions: [
      {
        id: 'q1',
        afterParagraph: 1,
        pageNumber: 2,
        stem: 'How did the headmaster check the classroom?',
        options: [
          'With a clean white handkerchief',
          'By asking the other students',
          'By looking through the window'
        ],
        answer: 0,
        evidence: 'The headteacher walked in, took out a spotless white handkerchief, and rubbed it across the wooden desks and corners.',
        explanation: '校长拿出一块洁白的手帕（a spotless white handkerchief）擦拭桌角检查卫生，因此选 A。'
      }
    ],
    paragraphs: [
      {
        index: 1,
        text: {
          'A1': 'Young Booker walked a long way to a school. He had no money, so the teacher told him to sweep a classroom.',
          'A2': 'After walking hundreds of miles to reach school, young Booker had no money. The headteacher asked him to sweep a classroom.',
          'B1': 'Exhausted and penniless after walking hundreds of miles to Hampton Institute, young Booker T. Washington was handed a broom and asked to sweep a recitation room.',
          'B2+': 'Exhausted and penniless after walking hundreds of miles to reach Hampton Institute, young Booker T. Washington was handed a broom by the headteacher and asked to sweep a classroom.'
        },
        translation: '徒步跋涉数百英里抵达汉普顿学院后，筋疲力尽又身无分文的少年布克·华盛顿从校长手中接过一把扫帚，被要求打扫一间教室。',
        gist: '少年布克徒步求学，身无分文的他收到了一份特殊的“入学测试”——打扫教室。',
        breakdown: [
          {
            label: '形容词短语前置作状语',
            en: [
              { t: 'Exhausted and penniless after walking hundreds of miles', c: 'c1' }, { t: ', ' },
              { t: 'young Booker was handed a broom', c: 'c2' }, { t: ' and ' },
              { t: 'asked to sweep a classroom', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '在徒步数百英里后筋疲力尽、身无分文', c: 'c1' }, { t: '，' },
              { t: '年少的布克接过一把扫帚', c: 'c2' }, { t: '，并' },
              { t: '被要求打扫一间教室', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心词汇', en: 'penniless', zh: '身无分文的' },
          { type: '被动结构', en: 'be handed a broom', zh: '被递给一把扫帚' }
        ]
      },
      {
        index: 2,
        text: {
          'A1': 'He swept the room three times and cleaned every corner. The teacher checked with a white cloth and let him stay.',
          'A2': 'Realising this was his exam, he swept the room three times. The teacher checked with a white cloth, found no dust, and welcomed him.',
          'B1': 'Realising this was his entrance exam, he swept the room three times and dusted every corner four times. The headteacher rubbed a white handkerchief over the woodwork, found no dust, and admitted him on the spot.',
          'B2+': 'Sensing that this was his true entrance examination, he swept the room three times and dusted every piece of furniture four times. The headteacher rubbed a spotless white handkerchief across the desks, found not a speck of dust, and quietly said, "I guess you will do to enter this institution."'
        },
        translation: '他敏锐地意识到这就是自己真正的入学考试，于是把教室扫了三遍，把每件家具擦了四遍。女校长用一块洁白无瑕的手帕擦过课桌，没发现一粒灰尘，轻声说道：“我想你可以进入这所学校了。”',
        gist: '布克把教室扫了三遍、擦了四遍，通过了白手帕的检验，成功入学。',
        breakdown: [
          {
            label: '现在分词作原因状语 + 三并列谓语',
            en: [
              { t: 'Sensing that this was his true entrance examination', c: 'c1' }, { t: ', ' },
              { t: 'he swept the room three times', c: 'c2' }, { t: ' and ' },
              { t: 'dusted every piece of furniture four times', c: 'c3' }, { t: '.' }
            ],
            zh: [
              { t: '意识到这是他真正的入学考试', c: 'c1' }, { t: '，' },
              { t: '他把房间扫了三遍', c: 'c2' }, { t: '，并' },
              { t: '把每件家具擦拭了四遍', c: 'c3' }, { t: '。' }
            ]
          }
        ],
        expressions: [
          { type: '核心搭配', en: 'entrance examination', zh: '入学考试' },
          { type: '生动表达', en: 'not a speck of dust', zh: '一粒灰尘也没有（一尘不染）' }
        ]
      }
    ]
  }
];



// ==================== 全局状态 ====================
const state = {
  // 主视图：'overview' (产品概览) | 'demo' (互动 Demo)
  activeView: 'overview',

  // 官网概览区状态
  painMode: 'after', // 'before' | 'after'
  overviewLevel: 'B2+',

  // 8 步互动 Demo 状态
  step: '01', // '01'..'08'
  companionId: 'wick',
  selectedInterests: ['world', 'science', 'culture'],
  readingLevel: 'B2+',
  diffTrialAddon: null, // 'zh' | 'note' | null

  // 首页与阅读器状态
  portalTab: 'home', // 'home' | 'vocab' | 'profile'
  currentArticleId: 'grand-tour',
  completedArticleIds: [],
  likedArticleIds: [],
  starredArticleIds: [],
  savedWords: ['gap year', 'Renaissance'],
  savedQuotes: [],

  // 阅读器内部状态
  readerViewMode: 'segment', // 'segment' | 'fulltext'
  paraIndex: 0, // 0..17
  showParaTranslation: false,
  showFullTranslation: true,
  rightPanelTab: 'analysis', // 'analysis' | 'quiz' | 'level'
  activeQuizId: null,
  quizAnswers: {},
  companionBubble: '',
  companionPoseType: 'startTap',

  // 全文听读状态
  isListening: false,
  listenVoice: 'US',
  listenSpeed: '1.0x',
  listeningParaIdx: 0,

  // 音频开关
  bgmPlaying: false
};

let listenInterval = null;
let bgmAudio = null;
let pickingTimer = null;

// ==================== 工具函数 ====================
function getCompanion(id = state.companionId) {
  return COMPANIONS.find((c) => c.id === id) || COMPANIONS[0];
}

function getArticle(id = state.currentArticleId) {
  return ARTICLES.find((a) => a.id === id) || ARTICLES[0];
}

function showToast(text) {
  const toast = document.getElementById('globalToast');
  const toastText = document.getElementById('globalToastText');
  if (!toast || !toastText) return;
  toastText.textContent = text;
  toast.classList.remove('hidden');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
}

function speakEnglish(text, lang = 'en-US', rate = 1.0) {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = rate;
      window.speechSynthesis.speak(u);
    }
  } catch (_) {}
}

function playSoundEffect(path) {
  try {
    const a = new Audio(path);
    a.volume = 0.6;
    a.play().catch(() => {});
  } catch (_) {}
}

function renderInteractiveWords(sentence) {
  return sentence
    .split(/(\s+)/)
    .map((token) => {
      const clean = token.replace(/[^a-zA-Z]/g, '').toLowerCase();
      if (!clean) return token;
      const hasVocab = Boolean(GLOBAL_VOCAB[clean]);
      return `<span class="tap-word ${hasVocab ? 'vocab-highlight' : ''}" data-word="${clean}" data-raw="${token.replace(/"/g, '&quot;')}">${token}</span>`;
    })
    .join('');
}

// ==================== 视图切换：产品概览 ⇄ 互动 Demo ====================
function switchMainView(viewName) {
  state.activeView = viewName;
  const overviewPage = document.getElementById('overviewPage');
  const demoPage = document.getElementById('demoPage');
  const btnOverview = document.getElementById('switchOverviewBtn');
  const btnDemo = document.getElementById('switchDemoBtn');

  if (viewName === 'demo') {
    overviewPage?.classList.add('hidden');
    demoPage?.classList.remove('hidden');
    btnOverview?.classList.remove('active');
    btnDemo?.classList.add('active');
    renderCurrentStage();
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else {
    stopListeningMode();
    clearTimeout(pickingTimer);
    demoPage?.classList.add('hidden');
    overviewPage?.classList.remove('hidden');
    btnDemo?.classList.remove('active');
    btnOverview?.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

// ==================== PART A: 产品概览页渲染（极简留白） ====================
function renderHeroPainCard() {
  const container = document.getElementById('heroPainBody');
  if (!container) return;

  document.querySelectorAll('.pain-mode-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.pain === state.painMode);
  });

  const comp = getCompanion();

  if (state.painMode === 'before') {
    container.innerHTML = `
      <div style="background:#f9f6f0;border-radius:20px;padding:30px;border:1px solid #e6dfd3;">
        <p style="font-family:var(--font-serif);font-size:20px;line-height:1.75;color:#2c2838;">
          Despite their <span class="blur-word">aloof</span> reputation, cats form
          surprisingly strong <span class="blur-word">bonds</span> with their owners.
          Scientists say cats can <span class="blur-word">recognise</span> their owners'
          voices.
        </p>
        <div style="display:flex;gap:14px;margin-top:22px;align-items:center;justify-content:center;">
          <span class="stamp-strike" style="font-size:22px;transform:rotate(-5deg);">看不懂</span>
          <span class="stamp-strike" style="font-size:22px;transform:rotate(4deg);">记不住</span>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div style="background:#fcfbfe;border-radius:20px;padding:24px;border:1.5px solid rgba(53,48,87,0.12);border-bottom:4px solid var(--crimson);">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="${comp.portrait}" style="width:34px;height:34px;border-radius:50%;object-fit:cover;" alt="${comp.name}" />
            <span style="background:#fdf2f0;color:var(--crimson);padding:4px 12px;border-radius:999px;font-size:12.5px;font-weight:700;">
              ${comp.name}：遇到生词，点一下看看
            </span>
          </div>
          <span style="font-size:12px;color:var(--text-muted);font-weight:700;">${state.overviewLevel}</span>
        </div>

        <p style="font-family:var(--font-serif);font-size:20px;line-height:1.65;color:#1d1930;margin-bottom:16px;">
          ${renderInteractiveWords('Today, many young people take a gap year after school or university. They travel, work abroad or volunteer.')}
        </p>

        <div style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;border-top:1px solid #f0edf8;font-size:12.5px;color:var(--text-secondary);">
          <span>👆 点击单词查词</span>
          <button type="button" class="chapter-try-btn" style="padding:7px 16px;font-size:12.5px;" data-goto-demo="01" onclick="window.deerlyGoDemo && window.deerlyGoDemo('01')">开始互动 Demo →</button>
        </div>
      </div>
    `;
  }
}

function renderOverviewCompanions() {
  const grid = document.getElementById('overviewCompanionsGrid');
  if (!grid) return;

  grid.innerHTML = COMPANIONS.map((c) => {
    const isSelected = c.id === state.companionId;
    return `
      <div class="companion-web-card ${isSelected ? 'selected' : ''}" data-pick-companion="${c.id}">
        <span class="comp-seat-badge">${c.seat}</span>
        <div class="comp-stage-circle">
          <video src="${isSelected ? c.greetVideo : c.idleVideo}" autoplay loop muted playsinline poster="${c.portrait}"></video>
        </div>
        <h3 class="comp-card-title">${c.title}</h3>
        <p class="comp-card-desc">${c.desc}</p>
        <div class="comp-tags-row">
          ${c.tags.map((t) => `<span class="comp-tag-chip">${t}</span>`).join('')}
        </div>
        <button class="comp-select-btn" data-pick-companion-go="${c.id}">
          ${isSelected ? '✓ 已选 · 立即出发' : `选 ${c.name} 同行`}
        </button>
      </div>
    `;
  }).join('');
}

function renderOverviewLevelSwitcher() {
  const preview = document.getElementById('overviewLevelPreview');
  if (!preview) return;

  document.querySelectorAll('#overviewLevelBtns .lls-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.lv === state.overviewLevel);
  });

  const lvObj = DIFFICULTY_LEVELS.find((d) => d.id === state.overviewLevel) || DIFFICULTY_LEVELS[3];
  const grandTourP1 = ARTICLES[0].paragraphs[0].text[state.overviewLevel];
  const comp = getCompanion();

  preview.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px;">
      <img src="${comp.portrait}" style="width:32px;height:32px;border-radius:50%;object-fit:cover;" alt="${comp.name}" />
      <span style="background:var(--crimson-soft);color:var(--crimson);padding:4px 12px;border-radius:999px;font-size:13px;font-weight:700;">
        ${lvObj.bubbleText}
      </span>
    </div>
    <div style="background:#faf8fe;border-radius:18px;padding:22px;border:1px solid rgba(53,48,87,0.09);margin-bottom:14px;">
      <p style="font-family:var(--font-serif);font-size:21px;line-height:1.65;color:#1d1930;">
        ${renderInteractiveWords(grandTourP1)}
      </p>
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;font-size:13px;color:var(--text-secondary);">
      <span>${lvObj.shortDesc} · 蓝思 ${lvObj.lexile}</span>
      <button class="tool-action-btn" data-speak="${grandTourP1.replace(/"/g, '&quot;')}">🔊 朗读</button>
    </div>
  `;
}

function updateTopCompanionUI() {
  const comp = getCompanion();
  const avatar = document.getElementById('topCompanionAvatar');
  const name = document.getElementById('topCompanionName');
  if (avatar) avatar.src = comp.portrait;
  if (name) name.textContent = comp.title;

  const dropdown = document.getElementById('companionDropdown');
  if (dropdown) {
    dropdown.innerHTML = COMPANIONS.map(
      (c) => `
      <button class="comp-drop-item ${c.id === state.companionId ? 'active' : ''}" data-switch-companion="${c.id}">
        <img src="${c.portrait}" alt="${c.name}" />
        <div class="comp-drop-info">
          <strong>${c.title}</strong>
          <span>${c.tags.join(' · ')}</span>
        </div>
        ${c.id === state.companionId ? '<span style="color:var(--crimson);font-weight:800;">✓</span>' : ''}
      </button>
    `
    ).join('');
  }
}

// ==================== PART B: 8 步全链路互动 Demo 渲染 ====================
function goToStep(stepCode, openDemoView = false) {
  clearTimeout(pickingTimer);
  stopListeningMode();

  if (stepCode === '07-quiz') {
    state.step = '07';
    state.paraIndex = 5;
    state.rightPanelTab = 'quiz';
    state.activeQuizId = 'q1';
  } else {
    state.step = stepCode;
  }

  document.querySelectorAll('#flowStepper .step-pill').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.step === state.step);
  });

  if (openDemoView || state.activeView !== 'demo') {
    switchMainView('demo');
  } else {
    renderCurrentStage();
  }
}

function renderCurrentStage() {
  const viewport = document.getElementById('stageViewport');
  if (!viewport) return;

  switch (state.step) {
    case '01':
      renderStage01Start(viewport);
      break;
    case '02':
      renderStage02Companions(viewport);
      break;
    case '03':
      renderStage03Interests(viewport);
      break;
    case '04':
      renderStage04Difficulty(viewport);
      break;
    case '05':
      renderStage05Picking(viewport);
      break;
    case '06':
      renderStage06HomePortal(viewport);
      break;
    case '07':
      renderStage07Reader(viewport);
      break;
    case '08':
      renderStage08Report(viewport);
      break;
    default:
      renderStage01Start(viewport);
  }
}

// ---------- 01. 启动页（列车封面） ----------
function renderStage01Start(viewport) {
  viewport.innerHTML = `
    <div class="stage-01-hero">
      <div class="hero-visual-pane">
        <video src="assets/onboarding/start-train-arrival-day.mp4" poster="assets/onboarding/readpal-start-scene.png" autoplay loop muted playsinline></video>
        <div class="hero-visual-overlay"></div>
      </div>

      <div class="hero-copy-pane">
        <div class="hero-eyebrow">✦ DEERLY · 一鹿知</div>
        <h1 class="hero-brand-title">Deerly</h1>
        <p class="hero-brand-sub">
          读过的每一天<br />
          都会把你带向更远的地方
        </p>

        <h2 class="hero-main-heading">下一程，一起读</h2>
        <p class="hero-main-desc">选一位旅伴，按自己的节奏出发</p>

        <div class="hero-cta-group" style="margin-top:16px;">
          <button class="primary-cta-btn" data-next-step="02">
            <span>遇见我的旅伴</span>
            <span>→</span>
          </button>
          <button class="secondary-ghost-btn" data-next-step="06">
            先随便看看
          </button>
        </div>
      </div>
    </div>
  `;
}

// ---------- 02. 选择旅伴 ----------
function renderStage02Companions(viewport) {
  viewport.innerHTML = `
    <div class="wide-container">
      <div class="stage-header-block">
        <div class="stage-header-left">
          <h1>这一程，想和谁同行？</h1>
          <p>跟着感觉选就好</p>
        </div>
        <button class="navy-submit-btn" data-next-step="03">
          选 TA 做旅伴 →
        </button>
      </div>

      <div class="companions-grid-4">
        ${COMPANIONS.map((c) => {
          const selected = c.id === state.companionId;
          return `
            <div class="companion-web-card ${selected ? 'selected' : ''}" data-stage2-select="${c.id}">
              <span class="comp-seat-badge">${c.seat}</span>
              <div class="comp-stage-circle">
                <video src="${selected ? c.greetVideo : c.idleVideo}" autoplay loop muted playsinline poster="${c.portrait}"></video>
              </div>
              <h3 class="comp-card-title">${c.title}</h3>
              <p class="comp-card-desc">${c.desc}</p>
              <div class="comp-tags-row">
                ${c.tags.map((t) => `<span class="comp-tag-chip">${t}</span>`).join('')}
              </div>
              <button class="comp-select-btn" data-stage2-confirm="${c.id}">
                选 TA 做旅伴
              </button>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ---------- 03. 选择阅读兴趣 ----------
function renderStage03Interests(viewport) {
  const comp = getCompanion();
  const count = state.selectedInterests.length;

  viewport.innerHTML = `
    <div class="onboarding-split-layout">
      <aside class="companion-side-panel">
        <div class="side-comp-top">
          <div class="side-comp-figure-box">
            <video src="${comp.idleVideo}" autoplay loop muted playsinline poster="${comp.portrait}"></video>
          </div>
          <div class="side-speech-bubble">
            “${comp.lines.interestPrompt}”
          </div>
        </div>
        <div class="side-train-progress">
          03 · 选择阅读兴趣
        </div>
      </aside>

      <section class="onboarding-main-card">
        <div>
          <div class="interest-header">
            <h2>选择 1–3 个喜欢的主题</h2>
            <span class="interest-counter">已选 ${count} / 3</span>
          </div>

          <div class="interest-timeline-grid">
            ${INTEREST_THEMES.map((item) => {
              const picked = state.selectedInterests.includes(item.id);
              return `
                <button class="interest-item-btn ${picked ? 'picked' : ''}" data-toggle-interest="${item.id}">
                  <span class="interest-pin">📍</span>
                  <div class="interest-item-body">
                    <div class="interest-item-title">
                      <span>${item.icon}</span>
                      <span>${item.name}</span>
                    </div>
                  </div>
                  <span class="interest-check-circle">✓</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="onboarding-bottom-bar">
          <button class="pager-btn" data-next-step="02">← 返回</button>
          <button class="navy-submit-btn" data-next-step="04" ${count === 0 ? 'disabled' : ''}>
            继续 →
          </button>
        </div>
      </section>
    </div>
  `;
}

// ---------- 04. 选择阅读难度 ----------
function renderStage04Difficulty(viewport) {
  const comp = getCompanion();
  const lvObj = DIFFICULTY_LEVELS.find((d) => d.id === state.readingLevel) || DIFFICULTY_LEVELS[3];

  viewport.innerHTML = `
    <div class="onboarding-split-layout">
      <aside class="companion-side-panel">
        <div class="side-comp-top">
          <div class="side-comp-figure-box">
            <video src="${comp.idleVideo}" autoplay loop muted playsinline poster="${comp.portrait}"></video>
          </div>
          <div class="side-speech-bubble">
            “${lvObj.bubbleText}”
          </div>
        </div>
        <div class="side-train-progress">
          04 · 选择阅读难度
        </div>
      </aside>

      <section class="onboarding-main-card">
        <div>
          <div class="interest-header">
            <h2>选择阅读难度</h2>
            <span class="diff-tag-pill">${lvObj.label} · ${lvObj.shortDesc}</span>
          </div>

          <div class="diff-preview-card">
            <p class="diff-sample-sentence">${lvObj.sampleEn}</p>

            ${
              state.diffTrialAddon === 'zh'
                ? `<div class="diff-addon-box">${lvObj.sampleZh}</div>`
                : state.diffTrialAddon === 'note'
                ? `<div class="diff-addon-box">${lvObj.sampleNote}</div>`
                : ''
            }

            <div class="card-mini-toolbar">
              <button class="tool-action-btn" data-speak="${lvObj.sampleEn.replace(/"/g, '&quot;')}">🔊 朗读</button>
              <button class="tool-action-btn ${state.diffTrialAddon === 'zh' ? 'active' : ''}" data-diff-addon="zh">文A 译文</button>
              <button class="tool-action-btn ${state.diffTrialAddon === 'note' ? 'active' : ''}" data-diff-addon="note">📖 解读</button>
            </div>
          </div>

          <div class="cefr-slider-bar">
            <span class="cefr-end-label">易</span>
            ${DIFFICULTY_LEVELS.map(
              (d) => `
              <button class="cefr-pill-btn ${d.id === state.readingLevel ? 'active' : ''}" data-pick-diff="${d.id}">
                ${d.label}
              </button>
            `
            ).join('')}
            <span class="cefr-end-label">难</span>
          </div>
        </div>

        <div class="onboarding-bottom-bar">
          <button class="pager-btn" data-next-step="03">← 返回</button>
          <button class="navy-submit-btn" data-next-step="05">
            按这个难度阅读 →
          </button>
        </div>
      </section>
    </div>
  `;
}

// ---------- 05. 车票签发过渡页 ----------
function renderStage05Picking(viewport) {
  const comp = getCompanion();
  playSoundEffect('assets/onboarding/train-depart.m4a');

  viewport.innerHTML = `
    <div class="stage-05-picking">
      <div class="carriage-track-scene">
        <div class="floating-cards-group">
          <div class="mini-floating-card"><img src="assets/covers/grand-tour.jpg" alt="card" /></div>
          <div class="mini-floating-card"><img src="assets/covers/two-friends.jpg" alt="card" /></div>
        </div>
        <img class="carriage-box-img" src="assets/onboarding/picking-carriage.png" alt="C-01 读物车厢" />
      </div>

      <div class="picking-companion-stage">
        <video src="${comp.pickingVideo}" autoplay loop muted playsinline poster="${comp.portrait}"></video>
      </div>

      <p class="picking-line-text">${comp.lines.ticketReady}</p>

      <button class="navy-submit-btn" style="margin-top:12px;" data-next-step="06">
        轻点跳过 →
      </button>
    </div>
  `;

  clearTimeout(pickingTimer);
  pickingTimer = setTimeout(() => {
    if (state.step === '05' && state.activeView === 'demo') goToStep('06');
  }, 3000);
}

// ---------- 06. 阅读世界首页 ----------
function renderStage06HomePortal(viewport) {
  const comp = getCompanion();
  const streakDays = state.completedArticleIds.length > 0 ? 1 : 0;

  const unreadArticles = ARTICLES.filter((a) => !state.completedArticleIds.includes(a.id));
  const featured = unreadArticles[0] || ARTICLES[0];
  const subArticles = ARTICLES.filter((a) => a.id !== featured.id);

  viewport.innerHTML = `
    <div class="home-portal-layout">
      <aside class="portal-left-nav">
        <div class="portal-companion-card">
          <img src="${comp.portrait}" alt="${comp.name}" />
          <div style="font-weight:800;font-size:15px;">${comp.title}</div>
          <span class="diff-tag-pill" style="font-size:11.5px;margin-top:8px;">难度 ${state.readingLevel}</span>
        </div>

        <div class="portal-nav-list">
          <button class="portal-nav-btn ${state.portalTab === 'home' ? 'active' : ''}" data-portal-tab="home">
            <span>🏠</span><span>首页</span>
          </button>
          <button class="portal-nav-btn ${state.portalTab === 'vocab' ? 'active' : ''}" data-portal-tab="vocab">
            <span>📓</span><span>词句本 (${state.savedWords.length})</span>
          </button>
          <button class="portal-nav-btn ${state.portalTab === 'profile' ? 'active' : ''}" data-portal-tab="profile">
            <span>🎫</span><span>我的 (${state.completedArticleIds.length})</span>
          </button>
        </div>
      </aside>

      <div class="portal-center-feed">
        <h2 style="font-size:28px;font-weight:900;">今天，想读点什么？</h2>

        <div class="train-streak-banner">
          <div class="streak-pill">
            <span class="streak-dot"></span>
            <span>已累计阅读 ${streakDays} 天</span>
          </div>
          <span class="today-pick-badge">今日精选</span>
        </div>

        ${
          state.portalTab === 'vocab'
            ? renderVocabBookView()
            : state.portalTab === 'profile'
            ? renderTicketWalletView()
            : `
          <article class="featured-story-card" data-open-article="${featured.id}">
            <div class="featured-cover-wrap">
              <img src="${featured.coverUrl}" alt="${featured.chineseTitle}" />
              <div class="cover-meta-overlay">
                <span>♡ ${featured.likes}</span>
                <span>🕒 约 ${featured.minutes} 分钟</span>
              </div>
            </div>
            <div class="featured-body">
              <div>
                <h3 class="featured-en-title">${featured.title}</h3>
                <div class="featured-cn-title">${featured.chineseTitle}</div>
                <p class="featured-blurb">${featured.subtitle}</p>
              </div>
              <div class="featured-footer">
                <div class="story-tags">
                  ${featured.tags.map((t) => `<span class="story-tag">${t}</span>`).join('')}
                </div>
                <span class="start-read-link">开始阅读 →</span>
              </div>
            </div>
          </article>

          <div class="sub-stories-grid">
            ${subArticles
              .map((art) => {
                const isDone = state.completedArticleIds.includes(art.id);
                return `
                <article class="sub-story-card" data-open-article="${art.id}">
                  <div class="sub-cover-wrap">
                    <img src="${art.coverUrl}" alt="${art.chineseTitle}" />
                    <div class="cover-meta-overlay">
                      <span>♡ ${art.likes}</span>
                      <span>🕒 约 ${art.minutes} 分钟</span>
                    </div>
                  </div>
                  <div class="sub-card-body">
                    <div>
                      <h4>${art.title}</h4>
                      <div class="sub-card-cn">${art.chineseTitle}</div>
                      <p class="sub-card-desc">${art.subtitle}</p>
                    </div>
                    <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #f2eff8;">
                      <div class="story-tags">
                        ${art.tags.slice(0, 1).map((t) => `<span class="story-tag">${t}</span>`).join('')}
                      </div>
                      <span style="font-size:12px;font-weight:800;color:${isDone ? 'var(--emerald)' : 'var(--crimson)'};">
                        ${isDone ? '✓ 已读' : '阅读 →'}
                      </span>
                    </div>
                  </div>
                </article>
              `;
              })
              .join('')}
          </div>
        `
        }
      </div>

      <aside class="portal-right-rail">
        <div class="rail-widget">
          <h3><span>📊 一路积累</span></h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div style="background:#f8f6fc;padding:14px;border-radius:14px;">
              <div style="font-size:11.5px;color:var(--text-muted);">累计天数</div>
              <div style="font-size:22px;font-weight:900;color:var(--navy-primary);">${streakDays} <small style="font-size:12px;">天</small></div>
            </div>
            <div style="background:#f8f6fc;padding:14px;border-radius:14px;">
              <div style="font-size:11.5px;color:var(--text-muted);">累计词数</div>
              <div style="font-size:22px;font-weight:900;color:var(--navy-primary);">${state.completedArticleIds.length * 534} <small style="font-size:12px;">词</small></div>
            </div>
          </div>
        </div>

        <div class="rail-widget">
          <h3><span>🔤 词句本</span></h3>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${state.savedWords
              .map(
                (w) => `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:#faf8fe;border-radius:10px;font-size:13px;">
                <strong>${w}</strong>
                <span style="color:var(--text-muted);font-size:12px;">已收藏</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderVocabBookView() {
  return `
    <div class="onboarding-main-card" style="padding:28px;">
      <h3 style="font-size:20px;font-weight:800;margin-bottom:16px;">📓 词句本</h3>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;">
        ${Object.values(GLOBAL_VOCAB)
          .slice(0, 6)
          .map(
            (v) => `
          <div style="padding:16px;border-radius:16px;background:#faf8fe;border:1px solid rgba(53,48,87,0.08);">
            <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;">
              <strong style="font-size:18px;font-family:var(--font-serif);">${v.word}</strong>
              <span style="font-size:12px;color:var(--text-muted);">${v.phonetic}</span>
            </div>
            <div style="font-size:13.5px;color:var(--text-main);font-weight:600;">${v.pos} ${v.meaning}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
}

function renderTicketWalletView() {
  return `
    <div class="onboarding-main-card" style="padding:28px;">
      <h3 style="font-size:20px;font-weight:800;margin-bottom:16px;">🎫 我的纪念车票</h3>
      <button class="navy-submit-btn" data-next-step="08">查看第 1 站车票 →</button>
    </div>
  `;
}

// ---------- 07. 核心阅读器 ----------
function renderStage07Reader(viewport) {
  const comp = getCompanion();
  const article = getArticle();
  const totalParas = article.paragraphs.length;
  const currentPara = article.paragraphs[state.paraIndex] || article.paragraphs[0];
  const progressPct = Math.round(((state.paraIndex + 1) / totalParas) * 100);
  const matchingQuiz = article.questions.find((q) => q.afterParagraph === state.paraIndex);

  let poseImg = comp.readerPoses.quizIdle;
  let bubbleLine = state.companionBubble;
  if (!bubbleLine) {
    if (state.paraIndex === 0) {
      poseImg = comp.readerPoses.startTap;
      bubbleLine = comp.lines.startRead[0];
    } else if (state.paraIndex >= totalParas - 2) {
      poseImg = comp.readerPoses.lieIdle;
      bubbleLine = comp.lines.endPage[0];
    } else if (matchingQuiz) {
      poseImg = comp.readerPoses.quizIdle;
      bubbleLine = comp.lines.quizAsk[0];
    } else {
      poseImg = comp.readerPoses.quizIdle;
      bubbleLine = comp.lines.startRead[1] || comp.lines.startRead[0];
    }
  }
  if (state.companionPoseType === 'quizRight') poseImg = comp.readerPoses.quizRight;
  if (state.companionPoseType === 'quizWrong') poseImg = comp.readerPoses.quizWrong;

  const isLiked = state.likedArticleIds.includes(article.id);
  const isStarred = state.starredArticleIds.includes(article.id);
  const paraEnText = currentPara.text[state.readingLevel] || currentPara.text['B2+'];

  viewport.innerHTML = `
    <div class="reader-workbench">
      <!-- 左栏：旅伴陪读 + 段落跳题 -->
      <aside class="reader-left-column">
        <div class="companion-perch-card">
          <div class="perch-stage" id="pokeCompanionBtn">
            <img src="${poseImg}" alt="${comp.name}" />
          </div>
          <div class="perch-speech-bubble">
            “${bubbleLine}”
          </div>
        </div>

        <div class="paragraph-map-card">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong style="font-size:13.5px;">段落导航</strong>
            <span style="font-size:11.5px;color:var(--crimson);font-weight:700;">★ 理解题</span>
          </div>
          <div class="para-dots-grid">
            ${article.paragraphs
              .map((p, idx) => {
                const hasQ = article.questions.some((q) => q.afterParagraph === idx);
                return `
                <button class="para-num-btn ${idx === state.paraIndex ? 'current' : ''} ${hasQ ? 'has-quiz' : ''}" data-jump-para="${idx}">
                  ${idx + 1}
                </button>
              `;
              })
              .join('')}
          </div>

          <div style="margin-top:auto;padding-top:12px;border-top:1px dashed var(--border-light);display:flex;flex-direction:column;gap:8px;">
            <button class="pager-btn" style="font-size:12px;padding:7px 10px;" data-jump-quiz="0">第 1 题 (6/18)</button>
            <button class="pager-btn" style="font-size:12px;padding:7px 10px;" data-jump-quiz="1">第 2 题 (11/18)</button>
            <button class="pager-btn" style="font-size:12px;padding:7px 10px;" data-jump-quiz="2">第 3 题 & 庆祝 (18/18)</button>
          </div>
        </div>
      </aside>

      <!-- 中栏：核心阅读卡片 -->
      <section class="reader-center-stage">
        <div class="reader-top-header">
          <div class="reader-back-title">
            <button class="back-circle-btn" data-next-step="06">‹</button>
            <div class="reader-article-title">${article.title}</div>
          </div>

          <div class="reader-progress-cluster">
            ${
              state.readerViewMode === 'fulltext'
                ? `<button class="pager-btn" style="padding:6px 14px;font-size:12.5px;" data-toggle-view="segment">📑 分段读</button>`
                : `
                <div class="progress-track-pill">
                  <div class="progress-fill-bar" style="width:${progressPct}%"></div>
                </div>
                <span class="progress-fraction">${state.paraIndex + 1}/${totalParas}</span>
              `
            }
            <button class="header-icon-action ${isLiked ? 'liked' : ''}" id="toggleLikeArticleBtn">${isLiked ? '♥' : '♡'}</button>
            <button class="header-icon-action ${isStarred ? 'starred' : ''}" id="toggleStarArticleBtn">${isStarred ? '★' : '☆'}</button>
          </div>
        </div>

        ${
          state.readerViewMode === 'segment'
            ? `
          <div class="card-reading-body">
            <p class="paragraph-en-text">
              ${renderInteractiveWords(paraEnText)}
            </p>

            ${
              state.showParaTranslation
                ? `<div class="paragraph-zh-box">${currentPara.translation}</div>`
                : ''
            }

            <div class="card-mini-toolbar" style="margin-top:auto;">
              <button class="tool-action-btn" data-speak="${paraEnText.replace(/"/g, '&quot;')}">🔊 朗读</button>
              <button class="tool-action-btn ${state.showParaTranslation ? 'active' : ''}" id="toggleParaZhBtn">文A 译文</button>
              <button class="tool-action-btn ${state.rightPanelTab === 'analysis' ? 'active' : ''}" data-open-right="analysis">📖 解读</button>
              <button class="tool-action-btn ${state.rightPanelTab === 'level' ? 'active' : ''}" data-open-right="level">🎚️ ${state.readingLevel}</button>
            </div>
          </div>
        `
            : `
          <div class="fulltext-scroll-body">
            ${article.paragraphs
              .map((p, idx) => {
                const pText = p.text[state.readingLevel] || p.text['B2+'];
                const isPlayingNow = state.isListening && state.listeningParaIdx === idx;
                return `
                <div class="fulltext-para-block ${isPlayingNow ? 'playing-now' : ''}" data-listen-para="${idx}">
                  <p class="fulltext-para-en">${renderInteractiveWords(pText)}</p>
                  ${state.showFullTranslation ? `<p class="fulltext-para-zh">${p.translation}</p>` : ''}
                </div>
              `;
              })
              .join('')}
          </div>
        `
        }

        <div class="reader-bottom-controls">
          ${
            state.readerViewMode === 'segment'
              ? `
              <button class="listen-full-pill" data-toggle-view="fulltext">
                <span>🎧 听全文</span>
              </button>

              <div class="reader-nav-pager">
                <button class="pager-btn" id="prevParaBtn" ${state.paraIndex === 0 ? 'disabled' : ''}>← 上一段</button>
                ${
                  matchingQuiz && state.quizAnswers[matchingQuiz.id] === undefined
                    ? `<button class="pager-btn primary-next" id="openQuizDrawerBtn">★ 答题 →</button>`
                    : state.paraIndex < totalParas - 1
                    ? `<button class="pager-btn primary-next" id="nextParaBtn">下一段 →</button>`
                    : `<button class="pager-btn primary-next" style="background:var(--crimson);" id="finishArticleBtn">🎉 完成阅读 →</button>`
                }
              </div>
            `
              : `
              <div class="audio-player-bar">
                <button class="listen-full-pill" id="toggleListenPlayBtn" style="padding:8px 18px;">
                  ${state.isListening ? '❚❚ 暂停' : '▶ 朗读'}
                </button>
                <button class="chip-toggle-btn ${state.listenVoice === 'US' ? 'active' : ''}" data-voice="US">美音</button>
                <button class="chip-toggle-btn ${state.listenVoice === 'UK' ? 'active' : ''}" data-voice="UK">英音</button>
                <button class="chip-toggle-btn" id="cycleSpeedBtn">${state.listenSpeed}</button>
              </div>

              <div style="display:flex;align-items:center;gap:10px;">
                <button class="pager-btn ${state.showFullTranslation ? 'primary-next' : ''}" id="toggleFullZhBtn">译</button>
                <button class="pager-btn primary-next" data-open-right="level">${state.readingLevel}</button>
              </div>
            `
          }
        </div>
      </section>

      <!-- 右栏：解读 / 题目 / 难度 -->
      <aside class="reader-right-column">
        <div class="right-panel-tabs">
          <button class="rp-tab-btn ${state.rightPanelTab === 'analysis' ? 'active' : ''}" data-rp-tab="analysis">✦ 解读</button>
          <button class="rp-tab-btn ${state.rightPanelTab === 'quiz' ? 'active' : ''}" data-rp-tab="quiz">📝 练习 (${Object.keys(state.quizAnswers).length}/${article.questions.length})</button>
          <button class="rp-tab-btn ${state.rightPanelTab === 'level' ? 'active' : ''}" data-rp-tab="level">🎚️ ${state.readingLevel}</button>
        </div>

        <div class="right-panel-content">
          ${
            state.rightPanelTab === 'quiz'
              ? renderRightQuizPanel(article, comp, matchingQuiz)
              : state.rightPanelTab === 'level'
              ? renderRightLevelPanel()
              : renderRightAnalysisPanel(currentPara, comp)
          }
        </div>
      </aside>
    </div>
  `;
}

function renderRightAnalysisPanel(currentPara, comp) {
  return `
    <div class="analysis-hero-banner">
      <img src="${comp.figure}" alt="${comp.name}" />
      <span class="analysis-badge-pill">✦ ${comp.name}为你解读 ✦</span>
    </div>

    <div class="analysis-sec-title">一句话大意</div>
    <p class="analysis-gist-text">${currentPara.gist}</p>

    <div class="analysis-sec-title">内容拆解</div>
    ${(currentPara.breakdown || [])
      .map(
        (b) => `
      <div class="breakdown-card">
        <div class="bd-label">${b.label}</div>
        <div class="bd-line">
          ${b.en.map((seg) => (seg.c ? `<span class="chunk-${seg.c}">${seg.t}</span>` : seg.t)).join('')}
        </div>
        <div class="bd-line">
          ${b.zh.map((seg) => (seg.c ? `<span class="chunk-${seg.c}">${seg.t}</span>` : seg.t)).join('')}
        </div>
      </div>
    `
      )
      .join('')}

    <div class="analysis-sec-title">重点表达</div>
    ${(currentPara.expressions || [])
      .map(
        (ex) => `
      <div class="expr-item">
        <span class="expr-badge">${ex.type}</span>
        <div>
          <div class="expr-en">${ex.en}</div>
          <div class="expr-zh">${ex.zh}</div>
        </div>
      </div>
    `
      )
      .join('')}
  `;
}

function renderRightQuizPanel(article, comp, matchingQuiz) {
  const quiz =
    article.questions.find((q) => q.id === state.activeQuizId) ||
    matchingQuiz ||
    article.questions[0];

  const pickedIdx = state.quizAnswers[quiz.id];
  const isAnswered = pickedIdx !== undefined;
  const isCorrect = pickedIdx === quiz.answer;

  return `
    <div class="quiz-active-box">
      <div style="display:flex;gap:8px;margin-bottom:14px;">
        ${article.questions
          .map((q, i) => {
            const done = state.quizAnswers[q.id] !== undefined;
            return `
            <button class="chip-toggle-btn ${q.id === quiz.id ? 'active' : ''}" style="border:1px solid #e2ddf0;padding:6px 12px;" data-select-quiz="${q.id}" data-quiz-para="${q.afterParagraph}">
              第 ${i + 1} 题 ${done ? '✓' : ''}
            </button>
          `;
          })
          .join('')}
      </div>

      <div class="quiz-question-stem">${quiz.stem}</div>

      <div class="quiz-options-list">
        ${quiz.options
          .map((opt, idx) => {
            const letter = ['A', 'B', 'C'][idx];
            let cls = '';
            if (isAnswered) {
              if (idx === quiz.answer) cls = 'correct';
              else if (idx === pickedIdx) cls = 'wrong';
            }
            return `
            <button class="quiz-opt-btn ${cls}" data-answer-quiz="${quiz.id}" data-opt-idx="${idx}">
              <span class="opt-letter">${letter}</span>
              <span style="flex:1;">${opt}</span>
              ${isAnswered && idx === quiz.answer ? '<span>✓</span>' : ''}
            </button>
          `;
          })
          .join('')}
      </div>

      ${
        isAnswered
          ? `
        <div class="quiz-explanation-box">
          ${quiz.explanation}
        </div>
        <button class="navy-submit-btn" style="width:100%;" id="continueAfterQuizBtn">
          ${state.paraIndex >= article.paragraphs.length - 1 ? '🎉 查看满分庆祝' : '继续阅读 →'}
        </button>
      `
          : ''
      }
    </div>
  `;
}

function renderRightLevelPanel() {
  return `
    <div>
      <h3 style="font-size:17px;font-weight:800;margin-bottom:14px;">选择阅读难度</h3>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${DIFFICULTY_LEVELS.map((d) => {
          const active = d.id === state.readingLevel;
          return `
            <button class="quiz-opt-btn ${active ? 'correct' : ''}" style="justify-content:space-between;" data-reader-switch-lv="${d.id}">
              <div>
                <strong style="font-size:16px;margin-right:10px;">${d.label}</strong>
                <span style="color:var(--text-secondary);font-size:13.5px;">${d.shortDesc}</span>
              </div>
              <span>${active ? '✓' : ''}</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function triggerCelebrateOverlay() {
  const comp = getCompanion();
  const overlay = document.getElementById('celebrateOverlay');
  if (!overlay) return;

  playSoundEffect('assets/onboarding/reading-completion-arrival-bell.wav');

  overlay.innerHTML = `
    <div class="celebrate-video-box">
      <video src="${comp.celebrateVideo}" autoplay loop muted playsinline poster="${comp.figure}"></video>
    </div>
    <h2 class="celebrate-title">${comp.lines.celebrateTitle}</h2>
    <p class="celebrate-sub">${comp.lines.celebrateSub}</p>
    <button class="primary-cta-btn" id="closeCelebrateToReportBtn">
      <span>查看阅读报告</span>
      <span>→</span>
    </button>
  `;
  overlay.classList.remove('hidden');
}

// ---------- 08. 阅读报告（双爪递车票） ----------
function renderStage08Report(viewport) {
  const comp = getCompanion();
  const article = getArticle();

  if (!state.completedArticleIds.includes(article.id)) {
    state.completedArticleIds.push(article.id);
  }

  playSoundEffect('assets/onboarding/report-stamp.wav');

  viewport.innerHTML = `
    <div class="report-stage-layout">
      <div class="ticket-delivery-wrapper">
        <div class="companion-paws-top">
          <img src="${comp.paws.left}" alt="左爪" />
          <img src="${comp.paws.right}" alt="右爪" />
        </div>

        <div class="ride-ticket-card">
          <div class="ticket-cover-header">
            <img src="${article.coverUrl}" alt="${article.chineseTitle}" />
            <div class="ticket-cover-shade">
              <div class="ticket-top-meta">
                <span class="station-badge">第 ${state.completedArticleIds.length} 站</span>
                <span class="ticket-date-str">2026.11.12</span>
              </div>
              <div>
                <div style="font-size:16px;font-weight:800;line-height:1.25;">${article.title}</div>
                <div style="font-size:12.5px;opacity:0.9;margin-top:3px;">${article.chineseTitle}</div>
              </div>
            </div>
          </div>

          <div class="completion-red-stamp">
            阅读完成
            <span>DEERLY PASS</span>
          </div>

          <div class="ticket-section">
            <div class="ticket-sec-heading">🚆 这一站的收获</div>
            <div class="ticket-stats-2col">
              <div>
                <div class="t-stat-label">本篇阅读词汇</div>
                <div class="t-stat-val">${article.wordCount} <small>词</small></div>
              </div>
              <div>
                <div class="t-stat-label">本次阅读时长</div>
                <div class="t-stat-val">1 <small>分</small> 33 <small>秒</small></div>
              </div>
            </div>

            <div class="ticket-quote-box">
              <div style="font-size:11px;color:var(--crimson);font-weight:700;margin-bottom:6px;">今日好句</div>
              <div class="ticket-quote-en">“${article.quote.text}”</div>
              <div class="ticket-quote-zh">${article.quote.translation}</div>
            </div>
          </div>

          <div class="ticket-section">
            <div class="ticket-sec-heading">📊 一路积累</div>
            <div class="ticket-stats-2col" style="margin-bottom:0;">
              <div>
                <div class="t-stat-label">累计阅读天数</div>
                <div class="t-stat-val">1 <small>天</small></div>
              </div>
              <div>
                <div class="t-stat-label">累计阅读词数</div>
                <div class="t-stat-val">${article.wordCount * state.completedArticleIds.length} <small>词</small></div>
              </div>
              <div>
                <div class="t-stat-label">已收藏金句</div>
                <div class="t-stat-val">${state.savedQuotes.length} <small>句</small></div>
              </div>
              <div>
                <div class="t-stat-label">已收藏单词</div>
                <div class="t-stat-val">${state.savedWords.length} <small>词</small></div>
              </div>
            </div>
          </div>

          <div class="ticket-footer-bar">
            <div style="display:flex;align-items:center;gap:8px;">
              <img src="${comp.portrait}" style="width:30px;height:30px;border-radius:50%;object-fit:cover;" alt="${comp.name}" />
              <div style="line-height:1.2;">
                <div style="font-size:12.5px;font-weight:800;">一鹿知</div>
                <div style="font-size:11px;color:var(--text-muted);">旅伴 · ${comp.name}</div>
              </div>
            </div>
            <div class="barcode-graphic"></div>
          </div>
        </div>
      </div>

      <div class="onboarding-main-card">
        <div>
          <span class="chapter-badge crimson">🎉 到站啦 · ARRIVED</span>
          <h2 style="font-size:32px;font-weight:900;margin-bottom:20px;">
            收下这张专属纪念车票
          </h2>

          <div style="display:flex;gap:14px;margin-bottom:32px;">
            <button class="navy-submit-btn" id="saveTicketBtn">⬇ 保存车票</button>
            <button class="btn-secondary-outline" id="openShareModalBtn">📤 分享车票</button>
          </div>

          <div style="background:#f8f6fc;border-radius:20px;padding:20px;border:1px solid var(--border-light);">
            <div style="font-size:12px;font-weight:800;color:var(--crimson);margin-bottom:10px;">
              🚂 下一程推荐
            </div>
            <div style="display:flex;align-items:center;gap:16px;">
              <img src="assets/covers/two-friends.jpg" style="width:100px;height:68px;border-radius:12px;object-fit:cover;" alt="下一篇" />
              <div style="flex:1;">
                <div style="font-weight:800;font-size:15px;">Two Friends, a Garage and 538 Dollars</div>
                <div style="font-size:12.5px;color:var(--text-secondary);">一间车库和538美元</div>
              </div>
              <button class="pager-btn primary-next" data-next-step="06">返回首页 →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==================== 全文听读定时器 ====================
function startListeningMode() {
  state.isListening = true;
  clearInterval(listenInterval);
  const article = getArticle();
  const currentText = article.paragraphs[state.listeningParaIdx]?.text[state.readingLevel];
  if (currentText) {
    speakEnglish(
      currentText,
      state.listenVoice === 'UK' ? 'en-GB' : 'en-US',
      parseFloat(state.listenSpeed)
    );
  }

  listenInterval = setInterval(() => {
    const art = getArticle();
    state.listeningParaIdx = (state.listeningParaIdx + 1) % art.paragraphs.length;
    renderCurrentStage();
  }, 4500);
}

function stopListeningMode() {
  state.isListening = false;
  clearInterval(listenInterval);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

// ==================== 查词浮层与分享弹窗 ====================
function openVocabPopover(cleanWord, rawWord) {
  const pop = document.getElementById('vocabPopover');
  if (!pop) return;

  const entry = GLOBAL_VOCAB[cleanWord] || {
    word: cleanWord,
    phonetic: '/.../',
    pos: 'n. / v.',
    meaning: '核心词汇（可加入词句本）',
    example: `"${rawWord}"`
  };

  const isSaved = state.savedWords.includes(entry.word);

  pop.innerHTML = `
    <div style="display:flex;align-items:baseline;justify-content:space-between;margin-bottom:8px;">
      <div>
        <strong style="font-size:24px;font-family:var(--font-serif);margin-right:10px;">${entry.word}</strong>
        <span style="font-size:13px;color:var(--text-muted);">${entry.phonetic}</span>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="tool-action-btn" data-speak="${entry.word}">🔊</button>
        <button class="tool-action-btn ${isSaved ? 'active' : ''}" data-save-word="${entry.word}">
          ${isSaved ? '★ 已存' : '☆ 存词句本'}
        </button>
        <button class="tool-action-btn" id="closeVocabPopBtn">✕</button>
      </div>
    </div>
    <div style="font-size:15px;font-weight:700;color:var(--text-main);margin-bottom:6px;">
      ${entry.pos} ${entry.meaning}
    </div>
    <div style="font-size:13px;color:var(--text-secondary);background:#f7f5fc;padding:10px 12px;border-radius:10px;">
      ${entry.example}
    </div>
  `;
  pop.classList.remove('hidden');
  speakEnglish(entry.word);
}

function openShareTicketModal() {
  const backdrop = document.getElementById('shareModalBackdrop');
  const modal = document.getElementById('sharePosterModal');
  if (!backdrop || !modal) return;
  const article = getArticle();
  const comp = getCompanion();

  modal.innerHTML = `
    <div style="width:100%;display:flex;justify-content:space-between;align-items:center;">
      <span style="font-size:14px;font-weight:700;">分享车票</span>
      <button style="color:#fff;font-size:18px;" id="closeShareModalBtn">✕</button>
    </div>

    <div class="ride-ticket-card" style="width:330px;color:var(--text-main);transform:scale(0.96);">
      <div class="ticket-cover-header" style="height:130px;">
        <img src="${article.coverUrl}" alt="${article.chineseTitle}" />
        <div class="ticket-cover-shade">
          <div class="ticket-top-meta">
            <span class="station-badge">第 1 站</span>
            <span class="ticket-date-str">2026.11.12</span>
          </div>
          <div style="font-size:14px;font-weight:800;">${article.title}</div>
        </div>
      </div>
      <div class="ticket-section" style="padding:14px 18px;">
        <div class="ticket-stats-2col" style="margin-bottom:8px;">
          <div><div class="t-stat-label">本篇阅读词汇</div><div class="t-stat-val" style="font-size:18px;">${article.wordCount} <small>词</small></div></div>
          <div><div class="t-stat-label">本次阅读时长</div><div class="t-stat-val" style="font-size:18px;">1 <small>分</small> 33 <small>秒</small></div></div>
        </div>
        <div class="ticket-quote-box" style="padding:10px;">
          <div class="ticket-quote-en" style="font-size:12.5px;">“${article.quote.text}”</div>
          <div class="ticket-quote-zh" style="font-size:11px;">${article.quote.translation}</div>
        </div>
      </div>
      <div class="ticket-footer-bar" style="padding:12px 18px;">
        <span style="font-size:12px;font-weight:800;">一鹿知 · 旅伴 ${comp.name}</span>
        <span style="font-size:11px;color:var(--crimson);font-weight:700;">一起上车</span>
      </div>
    </div>

    <div class="share-channels-row">
      <button class="share-ch-btn" data-share-action="微信好友"><span class="share-ch-icon" style="background:#16a34a;">💬</span><span>发送给朋友</span></button>
      <button class="share-ch-btn" data-share-action="朋友圈"><span class="share-ch-icon" style="background:#2563eb;">🌈</span><span>分享到朋友圈</span></button>
      <button class="share-ch-btn" data-share-action="收藏"><span class="share-ch-icon" style="background:#d97706;">⭐</span><span>收藏</span></button>
      <button class="share-ch-btn" data-share-action="相册"><span class="share-ch-icon" style="background:#0284c7;">⬇</span><span>保存图片</span></button>
    </div>
  `;

  backdrop.classList.remove('hidden');
}

// ==================== 全局事件代理 ====================
function bindEvents() {
  document.addEventListener('click', (e) => {
    const t = e.target;

    // 顶部视图切换（产品概览 ⇄ 互动 Demo）
    if (t.closest('#switchOverviewBtn') || t.closest('#backToOverviewBtn') || t.closest('#navBrandHome')) {
      e.preventDefault();
      switchMainView('overview');
      return;
    }
    if (t.closest('#switchDemoBtn')) {
      e.preventDefault();
      switchMainView('demo');
      return;
    }

    // 1. 痛点对比卡片切换
    const painBtn = t.closest('[data-pain]');
    if (painBtn) {
      state.painMode = painBtn.dataset.pain;
      renderHeroPainCard();
      return;
    }

    // 2. 概览区难度切换
    const ovLvBtn = t.closest('#overviewLevelBtns .lls-btn');
    if (ovLvBtn) {
      state.overviewLevel = ovLvBtn.dataset.lv;
      state.readingLevel = ovLvBtn.dataset.lv;
      renderOverviewLevelSwitcher();
      renderHeroPainCard();
      return;
    }

    // 3. 概览区选旅伴
    const pickCompCard = t.closest('[data-pick-companion]');
    if (pickCompCard && !t.closest('[data-pick-companion-go]')) {
      state.companionId = pickCompCard.dataset.pickCompanion;
      updateTopCompanionUI();
      renderOverviewCompanions();
      renderHeroPainCard();
      renderOverviewLevelSwitcher();
      showToast(`已切换旅伴：${getCompanion().title}`);
      return;
    }

    const pickCompGo = t.closest('[data-pick-companion-go]');
    if (pickCompGo) {
      state.companionId = pickCompGo.dataset.pickCompanionGo;
      updateTopCompanionUI();
      renderOverviewCompanions();
      goToStep('03', true);
      return;
    }

    // 4. 任何带 data-goto-demo 的按钮直接切到全屏 Demo 视图对应步骤
    const gotoDemoBtn = t.closest('[data-goto-demo]');
    if (gotoDemoBtn) {
      goToStep(gotoDemoBtn.dataset.gotoDemo, true);
      return;
    }

    // 5. 5站路线条滚动
    const scrollStop = t.closest('[data-scroll]');
    if (scrollStop) {
      const el = document.querySelector(scrollStop.dataset.scroll);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // 6. 顶部旅伴快速切换下拉框
    if (t.closest('#topCompanionChip')) {
      document.getElementById('companionDropdown')?.classList.toggle('hidden');
      return;
    }
    const switchCompBtn = t.closest('[data-switch-companion]');
    if (switchCompBtn) {
      state.companionId = switchCompBtn.dataset.switchCompanion;
      document.getElementById('companionDropdown')?.classList.add('hidden');
      updateTopCompanionUI();
      renderOverviewCompanions();
      renderHeroPainCard();
      renderOverviewLevelSwitcher();
      renderCurrentStage();
      showToast(`已切换旅伴：${getCompanion().title}`);
      return;
    }
    if (!t.closest('#companionDropdown')) {
      document.getElementById('companionDropdown')?.classList.add('hidden');
    }

    // 7. Demo 顶部 8 步切换条
    const stepPill = t.closest('#flowStepper .step-pill');
    if (stepPill) {
      goToStep(stepPill.dataset.step, false);
      return;
    }

    const nextStepBtn = t.closest('[data-next-step]');
    if (nextStepBtn) {
      goToStep(nextStepBtn.dataset.nextStep, false);
      return;
    }

    // 8. Stage 02 选旅伴
    const s2Select = t.closest('[data-stage2-select]');
    if (s2Select && !t.closest('[data-stage2-confirm]')) {
      state.companionId = s2Select.dataset.stage2Select;
      updateTopCompanionUI();
      renderOverviewCompanions();
      renderCurrentStage();
      return;
    }
    const s2Confirm = t.closest('[data-stage2-confirm]');
    if (s2Confirm) {
      state.companionId = s2Confirm.dataset.stage2Confirm;
      updateTopCompanionUI();
      renderOverviewCompanions();
      goToStep('03');
      return;
    }

    // 9. Stage 03 选兴趣
    const interestBtn = t.closest('[data-toggle-interest]');
    if (interestBtn) {
      const id = interestBtn.dataset.toggleInterest;
      if (state.selectedInterests.includes(id)) {
        state.selectedInterests = state.selectedInterests.filter((x) => x !== id);
      } else {
        if (state.selectedInterests.length >= 3) {
          showToast('最多选 3 个主题');
          return;
        }
        state.selectedInterests.push(id);
      }
      renderCurrentStage();
      return;
    }

    // 10. Stage 04 选难度
    const pickDiffBtn = t.closest('[data-pick-diff]');
    if (pickDiffBtn) {
      state.readingLevel = pickDiffBtn.dataset.pickDiff;
      state.overviewLevel = state.readingLevel;
      renderCurrentStage();
      return;
    }
    const diffAddonBtn = t.closest('[data-diff-addon]');
    if (diffAddonBtn) {
      const type = diffAddonBtn.dataset.diffAddon;
      state.diffTrialAddon = state.diffTrialAddon === type ? null : type;
      renderCurrentStage();
      return;
    }

    // 11. Stage 06 首页
    const portalTabBtn = t.closest('[data-portal-tab]');
    if (portalTabBtn) {
      state.portalTab = portalTabBtn.dataset.portalTab;
      renderCurrentStage();
      return;
    }
    const openArtCard = t.closest('[data-open-article]');
    if (openArtCard) {
      state.currentArticleId = openArtCard.dataset.openArticle;
      state.paraIndex = 0;
      state.readerViewMode = 'segment';
      state.rightPanelTab = 'analysis';
      state.companionBubble = '';
      state.companionPoseType = 'startTap';
      goToStep('07');
      return;
    }

    // 12. Stage 07 阅读器
    const wordSpan = t.closest('.tap-word');
    if (wordSpan) {
      openVocabPopover(wordSpan.dataset.word, wordSpan.dataset.raw);
      return;
    }
    if (t.closest('#closeVocabPopBtn')) {
      document.getElementById('vocabPopover')?.classList.add('hidden');
      return;
    }
    const saveWordBtn = t.closest('[data-save-word]');
    if (saveWordBtn) {
      const w = saveWordBtn.dataset.saveWord;
      if (state.savedWords.includes(w)) {
        state.savedWords = state.savedWords.filter((x) => x !== w);
        showToast(`已移除：${w}`);
      } else {
        state.savedWords.push(w);
        showToast(`已存入词句本：${w}`);
      }
      openVocabPopover(w.split(' ')[0].toLowerCase(), w);
      return;
    }

    if (t.closest('#toggleParaZhBtn')) {
      state.showParaTranslation = !state.showParaTranslation;
      renderCurrentStage();
      return;
    }

    if (t.closest('#toggleLikeArticleBtn')) {
      const id = state.currentArticleId;
      if (state.likedArticleIds.includes(id)) {
        state.likedArticleIds = state.likedArticleIds.filter((x) => x !== id);
      } else {
        state.likedArticleIds.push(id);
        showToast('已喜欢 ♥');
      }
      renderCurrentStage();
      return;
    }

    if (t.closest('#toggleStarArticleBtn')) {
      const id = state.currentArticleId;
      if (state.starredArticleIds.includes(id)) {
        state.starredArticleIds = state.starredArticleIds.filter((x) => x !== id);
      } else {
        state.starredArticleIds.push(id);
        showToast('文章已收藏 ★');
      }
      renderCurrentStage();
      return;
    }

    if (t.closest('#pokeCompanionBtn')) {
      const comp = getCompanion();
      const pool = [...comp.lines.startRead, ...comp.lines.endPage];
      state.companionBubble = pool[Math.floor(Math.random() * pool.length)];
      renderCurrentStage();
      return;
    }

    const jumpParaBtn = t.closest('[data-jump-para]');
    if (jumpParaBtn) {
      state.paraIndex = parseInt(jumpParaBtn.dataset.jumpPara, 10);
      state.companionBubble = '';
      state.companionPoseType = 'quizIdle';
      renderCurrentStage();
      return;
    }

    const jumpQuizBtn = t.closest('[data-jump-quiz]');
    if (jumpQuizBtn) {
      const qIdx = parseInt(jumpQuizBtn.dataset.jumpQuiz, 10);
      const art = getArticle();
      const q = art.questions[qIdx] || art.questions[0];
      if (q) {
        state.readerViewMode = 'segment';
        state.paraIndex = q.afterParagraph;
        state.rightPanelTab = 'quiz';
        state.activeQuizId = q.id;
        state.companionBubble = getCompanion().lines.quizAsk[0];
        renderCurrentStage();
      }
      return;
    }

    if (t.closest('#prevParaBtn')) {
      if (state.paraIndex > 0) {
        state.paraIndex -= 1;
        state.companionBubble = '';
        renderCurrentStage();
      }
      return;
    }

    if (t.closest('#nextParaBtn')) {
      const art = getArticle();
      if (state.paraIndex < art.paragraphs.length - 1) {
        state.paraIndex += 1;
        state.companionBubble = '';
        const nextQ = art.questions.find((q) => q.afterParagraph === state.paraIndex);
        if (nextQ) state.activeQuizId = nextQ.id;
        renderCurrentStage();
      }
      return;
    }

    if (t.closest('#openQuizDrawerBtn')) {
      const art = getArticle();
      const q = art.questions.find((item) => item.afterParagraph === state.paraIndex);
      if (q) {
        state.rightPanelTab = 'quiz';
        state.activeQuizId = q.id;
        state.companionBubble = getCompanion().lines.quizAsk[0];
        renderCurrentStage();
      }
      return;
    }

    if (t.closest('#finishArticleBtn')) {
      triggerCelebrateOverlay();
      return;
    }

    const rpTabBtn = t.closest('[data-rp-tab]');
    if (rpTabBtn) {
      state.rightPanelTab = rpTabBtn.dataset.rpTab;
      renderCurrentStage();
      return;
    }

    const openRightBtn = t.closest('[data-open-right]');
    if (openRightBtn) {
      state.rightPanelTab = openRightBtn.dataset.openRight;
      renderCurrentStage();
      return;
    }

    const selectQuizBtn = t.closest('[data-select-quiz]');
    if (selectQuizBtn) {
      state.activeQuizId = selectQuizBtn.dataset.selectQuiz;
      state.paraIndex = parseInt(selectQuizBtn.dataset.quizPara, 10);
      renderCurrentStage();
      return;
    }

    const answerQuizBtn = t.closest('[data-answer-quiz]');
    if (answerQuizBtn) {
      const qId = answerQuizBtn.dataset.answerQuiz;
      const optIdx = parseInt(answerQuizBtn.dataset.optIdx, 10);
      state.quizAnswers[qId] = optIdx;

      const art = getArticle();
      const q = art.questions.find((item) => item.id === qId);
      const comp = getCompanion();
      if (q && optIdx === q.answer) {
        state.companionPoseType = 'quizRight';
        state.companionBubble = comp.lines.quizRight[0];
        showToast('🎉 ' + comp.lines.quizRight[0]);
      } else {
        state.companionPoseType = 'quizWrong';
        state.companionBubble = comp.lines.quizWrong[0];
      }
      renderCurrentStage();
      return;
    }

    if (t.closest('#continueAfterQuizBtn')) {
      const art = getArticle();
      if (state.paraIndex >= art.paragraphs.length - 1) {
        triggerCelebrateOverlay();
      } else {
        state.paraIndex += 1;
        state.rightPanelTab = 'analysis';
        state.companionPoseType = 'quizIdle';
        state.companionBubble = '';
        renderCurrentStage();
      }
      return;
    }

    const switchLvBtn = t.closest('[data-reader-switch-lv]');
    if (switchLvBtn) {
      const newLv = switchLvBtn.dataset.readerSwitchLv;
      state.readingLevel = newLv;
      state.overviewLevel = newLv;
      showToast(`已切换为 ${newLv} 难度`);
      renderOverviewLevelSwitcher();
      renderCurrentStage();
      return;
    }

    const toggleViewBtn = t.closest('[data-toggle-view]');
    if (toggleViewBtn) {
      const mode = toggleViewBtn.dataset.toggleView;
      state.readerViewMode = mode;
      if (mode === 'fulltext') {
        state.listeningParaIdx = state.paraIndex;
        startListeningMode();
      } else {
        stopListeningMode();
      }
      renderCurrentStage();
      return;
    }

    const listenParaBlock = t.closest('[data-listen-para]');
    if (listenParaBlock && !t.closest('.tap-word')) {
      state.listeningParaIdx = parseInt(listenParaBlock.dataset.listenPara, 10);
      startListeningMode();
      renderCurrentStage();
      return;
    }

    if (t.closest('#toggleListenPlayBtn')) {
      if (state.isListening) stopListeningMode();
      else startListeningMode();
      renderCurrentStage();
      return;
    }

    const voiceBtn = t.closest('[data-voice]');
    if (voiceBtn) {
      state.listenVoice = voiceBtn.dataset.voice;
      if (state.isListening) startListeningMode();
      renderCurrentStage();
      return;
    }

    if (t.closest('#cycleSpeedBtn')) {
      const speeds = ['0.75x', '1.0x', '1.25x', '1.5x'];
      state.listenSpeed = speeds[(speeds.indexOf(state.listenSpeed) + 1) % speeds.length];
      if (state.isListening) startListeningMode();
      renderCurrentStage();
      return;
    }

    if (t.closest('#toggleFullZhBtn')) {
      state.showFullTranslation = !state.showFullTranslation;
      renderCurrentStage();
      return;
    }

    if (t.closest('#closeCelebrateToReportBtn')) {
      document.getElementById('celebrateOverlay')?.classList.add('hidden');
      goToStep('08');
      return;
    }

    if (t.closest('#saveTicketBtn')) {
      showToast('✓ 车票已保存');
      return;
    }
    if (t.closest('#openShareModalBtn')) {
      openShareTicketModal();
      return;
    }
    if (t.closest('#closeShareModalBtn') || t.id === 'shareModalBackdrop') {
      document.getElementById('shareModalBackdrop')?.classList.add('hidden');
      return;
    }
    const shareActionBtn = t.closest('[data-share-action]');
    if (shareActionBtn) {
      showToast(`已分享至：${shareActionBtn.dataset.shareAction}`);
      document.getElementById('shareModalBackdrop')?.classList.add('hidden');
      return;
    }

    const speakBtn = t.closest('[data-speak]');
    if (speakBtn) {
      speakEnglish(speakBtn.dataset.speak);
      return;
    }

    if (t.closest('#bgmToggleBtn')) {
      if (!bgmAudio) {
        bgmAudio = new Audio('assets/onboarding/start-train-arrival-day.wav');
        bgmAudio.loop = true;
        bgmAudio.volume = 0.35;
      }
      state.bgmPlaying = !state.bgmPlaying;
      const btn = document.getElementById('bgmToggleBtn');
      if (state.bgmPlaying) {
        bgmAudio.play().catch(() => {});
        btn?.classList.add('playing');
      } else {
        bgmAudio.pause();
        btn?.classList.remove('playing');
      }
      return;
    }

    if (t.closest('#resetDemoBtn')) {
      state.step = '01';
      state.completedArticleIds = [];
      state.quizAnswers = {};
      state.paraIndex = 0;
      goToStep('01');
      showToast('已重置到第 01 步');
    }
  });
}

function init() {
  updateTopCompanionUI();
  renderHeroPainCard();
  renderOverviewCompanions();
  renderOverviewLevelSwitcher();
  renderCurrentStage();
  bindEvents();
}

init();


window.deerlySwitchView = switchMainView;
window.deerlyGoDemo = function(stepCode) {
  goToStep(stepCode || '01', true);
};

})();
