import { Companion, Story, UserPreferences } from './types';

const publicAsset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;

export interface ContentCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  dotColor: string;
  bgColor: string;
  borderColor: string;
  tags: string[];
}

export const CONTENT_DOMAINS: ContentCategory[] = [
  {
    id: 'world',
    name: '世界',
    icon: '🌍',
    color: '#06B6D4',
    dotColor: '#22D3EE',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.35)',
    tags: ['全球热点', '社会观察', '法律法规', '公平权利', '战争冲突', '灾难救援', '城市出行', '慈善公益', '环境环保']
  },
  {
    id: 'science',
    name: '科学',
    icon: '🔬',
    color: '#10B981',
    dotColor: '#34D399',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.35)',
    tags: ['前沿科技', '人工智能', '宇宙太空', '自然地理', '动物世界', '人体奥秘', '心理探索', '气候能源', '农业科技', '科学史话', '科普冷知识', '数码科技', '医学健康', '社会科学']
  },
  {
    id: 'culture',
    name: '文化',
    icon: '🎬',
    color: '#F97316',
    dotColor: '#FB923C',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.35)',
    tags: ['影视娱乐', '音乐', '体育竞技', '动漫二次元', '游戏世界', '时尚美妆', '饮食文化', '旅行故事', '历史故事', '节日民俗', '文化现象', '艺术设计', '语言文字', '网络热梗', '宠物生活', '名人明星', '中国文化']
  },
  {
    id: 'business',
    name: '商业',
    icon: '💼',
    color: '#F59E0B',
    dotColor: '#FBBF24',
    bgColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
    tags: ['商业故事', '创业故事', '职场生存', '团队管理', '财经观察', '消费观察', '投资理财', '品牌营销', '行业趋势', '职业探索', '办公方式', '领导力', '企业文化']
  },
  {
    id: 'growth',
    name: '成长',
    icon: '🌱',
    color: '#84CC16',
    dotColor: '#A3E635',
    bgColor: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.35)',
    tags: ['校园升学', '教育观察', '学习方法', '高效思维', '自我驱动', '习惯养成', '沟通表达', '人际关系', '情绪调节', '运动健身', '人物故事', '家庭亲子', '人生思考', '留学海外', '发展创造', '亲密关系', '家居生活']
  },
  {
    id: 'story',
    name: '故事',
    icon: '📖',
    color: '#A855F7',
    dotColor: '#C084FC',
    bgColor: 'rgba(168, 85, 247, 0.12)',
    borderColor: 'rgba(168, 85, 247, 0.35)',
    tags: ['短篇故事', '经典名著', '科幻故事', '悬疑推理', '奇幻冒险', '成长励志', '童话寓言', '幽默喜剧', '诗歌散文', '演讲名篇']
  }
];

export interface BubbleSeed {
  tag: string;
  categoryId: string;
}

export const INITIAL_12_BUBBLES: BubbleSeed[] = [
  { tag: '全球热点', categoryId: 'world' },
  { tag: '社会观察', categoryId: 'world' },
  { tag: '前沿科技', categoryId: 'science' },
  { tag: '人工智能', categoryId: 'science' },
  { tag: '影视娱乐', categoryId: 'culture' },
  { tag: '音乐', categoryId: 'culture' },
  { tag: '商业故事', categoryId: 'business' },
  { tag: '创业故事', categoryId: 'business' },
  { tag: '校园升学', categoryId: 'growth' },
  { tag: '教育观察', categoryId: 'growth' },
  { tag: '短篇故事', categoryId: 'story' },
  { tag: '经典名著', categoryId: 'story' }
];

export const SEED_SETS: BubbleSeed[][] = [
  INITIAL_12_BUBBLES,
  [
    { tag: '宇宙太空', categoryId: 'science' },
    { tag: '社会观察', categoryId: 'world' },
    { tag: '数码科技', categoryId: 'science' },
    { tag: '游戏世界', categoryId: 'culture' },
    { tag: '动漫二次元', categoryId: 'culture' },
    { tag: '职场生存', categoryId: 'business' },
    { tag: '习惯养成', categoryId: 'growth' },
    { tag: '高效思维', categoryId: 'growth' },
    { tag: '科幻故事', categoryId: 'story' },
    { tag: '悬疑推理', categoryId: 'story' },
    { tag: '消费观察', categoryId: 'business' },
    { tag: '环境环保', categoryId: 'world' }
  ],
  [
    { tag: '心理探索', categoryId: 'science' },
    { tag: '旅行故事', categoryId: 'culture' },
    { tag: '饮食文化', categoryId: 'culture' },
    { tag: '投资理财', categoryId: 'business' },
    { tag: '品牌营销', categoryId: 'business' },
    { tag: '沟通表达', categoryId: 'growth' },
    { tag: '情绪调节', categoryId: 'growth' },
    { tag: '奇幻冒险', categoryId: 'story' },
    { tag: '成长励志', categoryId: 'story' },
    { tag: '城市出行', categoryId: 'world' },
    { tag: '科普冷知识', categoryId: 'science' },
    { tag: '留学海外', categoryId: 'growth' }
  ]
];

export const COMPANIONS: Companion[] = [
  {
    id: 'wick',
    name: '灯芯',
    nameEn: 'Wick',
    seat: 'B-01',
    type: '引路型旅伴',
    quote: '“安静陪着你，慢慢读。”',
    avatarUrl: publicAsset('/assets/companion-wick-card.png'),
    portraitUrl: publicAsset('/assets/companion-wick-avatar.jpg'),
    sceneUrl: publicAsset('/assets/companion-wick-scene.webp'),
    sceneMouth: { x: 0.425, y: 0.54 },
    intro: '我是灯芯，\n我在前面为你引路～',
    celebrateActionName: '喜悦欢呼跃动',
    celebrateQuote: '“太棒啦！准备好一起出发了吗？”',
    accentColor: '#B83C2A',
    bgGlow: 'rgba(184, 60, 42, 0.18)',
    description: '在前面安静引路，走三步回一次头。'
  },
  {
    id: 'pal',
    name: '帕利',
    nameEn: 'Pal',
    seat: 'B-02',
    type: '机灵型旅伴',
    quote: '“遇到难句，我们一起找线索。”',
    avatarUrl: publicAsset('/assets/companion-pal-card.png'),
    portraitUrl: publicAsset('/assets/companion-pal-avatar.jpg'),
    sceneUrl: publicAsset('/assets/companion-pal-scene.webp'),
    sceneMouth: { x: 0.265, y: 0.575 },
    // Interim until Pal's scene is redrawn facing open space: keep bubbles off the body.
    sceneBubbleAnchors: { side: { x: 0.31, y: 0.4 } },
    selectionSceneShift: 82,
    intro: '我是帕利！\n好句子我帮你收藏～',
    celebrateActionName: '机智跃动致意',
    celebrateQuote: '“发现新线索了！继续往前看看吧。”',
    accentColor: '#C76B3F',
    bgGlow: 'rgba(199, 107, 63, 0.18)',
    description: '陪你找线索，顺手帮你收藏好句子。'
  },
  {
    id: 'tuanzi',
    name: '团子',
    nameEn: 'Tuanzi',
    seat: 'B-03',
    type: '安静型旅伴',
    quote: '“我在这里，陪你慢慢读。”',
    avatarUrl: publicAsset('/assets/companion-tuanzi-card.png'),
    portraitUrl: publicAsset('/assets/companion-tuanzi-avatar.jpg'),
    sceneUrl: publicAsset('/assets/companion-tuanzi-scene.webp'),
    sceneMouth: { x: 0.4375, y: 0.445 },
    intro: '我是团子…\n安静陪你读就好。',
    celebrateActionName: '元气活力跳跃',
    celebrateQuote: '“读累了就歇一会儿，我一直都在。”',
    accentColor: '#6C779B',
    bgGlow: 'rgba(108, 119, 155, 0.18)',
    description: '安静待在你身边，偶尔眨一眨眼。'
  }
];

export const FIRST_STORY: Story = {
  id: 'mars-47',
  title: 'The 47th Minute Without Power',
  chineseTitle: '火星城市停电的第 47 分钟',
  continent: '科学大陆',
  series: '火星系列 · 当城市失效',
  part: '第 1 / 4 段',
  synopsis: '一座城市突然停电，旧维修机器人带着玛拉穿过一条不靠中心网络的地下隧道。',
  coverImage: publicAsset('/assets/story/hero.webp'),
  levels: {
    easy: {
      level: 'easy',
      cefr: 'A1',
      levelLabel: 'CEFR A1 · 入门起步',
      cefrDesc: '适合起步读者：简短句式（8~10词/句），常用高频词汇，降低认知负荷。',
      diffSummary: '短句重构 · 复杂修饰已全部拆解，替换为基础口语词（walked out of, safe, computers）',
      estMinutes: 2,
      paragraphs: [
        'At 9:47 pm, the lights went dark. There was no power in the whole city. The tall glass towers were lost in the red dust.',
        'Mara waited for help. But no help came. Then, an old robot walked out of a dark tunnel under the street.',
        '“I know another way,” the robot said. “It is longer, but it is safe. We do not need the city computers.”'
      ]
    },
    mid: {
      level: 'mid',
      cefr: 'A2',
      levelLabel: 'CEFR A2 · 基础巩固',
      cefrDesc: '适合日常阅读：标准复合句，清晰逻辑连词，兼顾流畅度与地道表达。',
      diffSummary: '标准原版 · 适度保留复合句与科幻日常词汇（emerged, emergency system, network）',
      estMinutes: 3,
      paragraphs: [
        'At 21:47, every light in the city went out. The glass towers disappeared into the red dust.',
        'Mara waited for the emergency system to start. Nothing happened. Then an old repair robot emerged from a tunnel under the street.',
        '“I know another way,” it said. The route was longer, but it did not depend on the city’s network.'
      ]
    },
    hard: {
      level: 'hard',
      cefr: 'B1',
      levelLabel: 'CEFR B1 · 进阶挑战',
      cefrDesc: '适合提升语感：丰富从句修饰、倒装状语、破折号插入语与高张力小说级词汇。',
      diffSummary: '深度进阶 · 多层修饰、虚拟语气从句与文学质感词汇（entire grid failed, dissolved, unhurried）',
      estMinutes: 5,
      paragraphs: [
        'At 21:47 the city’s entire grid failed, and the glass towers dissolved into the red dust that had been waiting for them all along.',
        'Mara stood waiting for an emergency system that never answered. Then, from a service tunnel beneath the street, an old repair robot emerged — unhurried, as though it had been expecting this night for years.',
        '“There is another route,” it said. “Longer, certainly. But it does not depend on the city’s network — which, tonight, is the only thing that matters.”'
      ]
    }
  },
  keyVocab: {
    emerged: {
      word: 'emerged',
      phonetic: '/ɪˈmɜːdʒd/',
      partOfSpeech: 'v. (过去式)',
      chinese: '出现；浮现；显露',
      englishDef: 'moved out of or away from something and became visible',
      example: 'The submarine emerged from the deep waters.',
      companionNote: '写作高频词！代替简单的 came out，带有从隐蔽或黑暗处缓缓显现的画面感。'
    },
    'came out of': {
      word: 'came out of',
      phonetic: '/keɪm aʊt əv/',
      partOfSpeech: 'phr.',
      chinese: '从……出来',
      englishDef: 'exited from an enclosed or interior space',
      example: 'She came out of the room with a smile.',
      companionNote: '日常口语表达，最直接自然的日常动词短语。'
    },
    'walked out of': {
      word: 'walked out of',
      phonetic: '/wɔːkt aʊt əv/',
      partOfSpeech: 'phr.',
      chinese: '从……走出来',
      englishDef: 'moved out of somewhere on foot',
      example: 'The robot walked out of the dark tunnel.',
      companionNote: 'A1 极简动词短语，动作清晰直白，无任何理解门槛。'
    },
    unhurried: {
      word: 'unhurried',
      phonetic: '/ʌnˈhʌrid/',
      partOfSpeech: 'adj.',
      chinese: '从容不迫的；不慌不忙的',
      englishDef: 'moving or doing things without hurry; relaxed',
      example: 'He walked with an unhurried, confident stride.',
      companionNote: '破折号后的独立修饰语！直接立住了这个老旧机器人见怪不怪的沧桑感。'
    },
    dissolved: {
      word: 'dissolved',
      phonetic: '/dɪˈzɒlvd/',
      partOfSpeech: 'v.',
      chinese: '溶解；消散；融入',
      englishDef: 'gradually disappeared or faded into background',
      example: 'The clouds dissolved in the afternoon sunlight.',
      companionNote: '用“消融”描写大楼隐入红沙，比单纯的 disappeared 具有更强文学张力。'
    },
    grid: {
      word: 'grid',
      phonetic: '/ɡrɪd/',
      partOfSpeech: 'n.',
      chinese: '电力网；网格系统',
      englishDef: 'a system of electrical wires and cables distributing power',
      example: 'A storm knocked out the power grid for three days.',
      companionNote: '科幻与科技阅读核心词，特指整个城市的输电或网络骨干网。'
    },
    'emergency system': {
      word: 'emergency system',
      phonetic: '/ɪˈmɜːdʒənsi ˈsɪstəm/',
      partOfSpeech: 'n. phr.',
      chinese: '应急系统；备用网络',
      englishDef: 'backup equipment designed to operate during a crisis',
      example: 'The backup generators powered the hospital emergency system.',
      companionNote: '常用复合名词，在危机状态下兜底的保障设施。'
    }
  },
  sentenceBreakdown: {
    original: 'Then, from a service tunnel beneath the street, an old repair robot emerged — unhurried, as though it had been expecting this night for years.',
    analysis: '这是一个典型的前置状语与后置形容词修饰长句。核心主谓宾为：“an old repair robot emerged”。',
    chunks: [
      {
        text: 'Then, from a service tunnel beneath the street,',
        role: '宾语/状语',
        explanation: '时间与地点状语倒装，把神秘的环境背景推到句子最前。'
      },
      {
        text: 'an old repair robot',
        role: '主语',
        explanation: '句子核心主体：一台旧维修机器人。'
      },
      {
        text: 'emerged',
        role: '谓语',
        explanation: '主动动词：显露、缓缓走出。'
      },
      {
        text: '— unhurried, as though it had been expecting this night for years.',
        role: '修饰分句',
        explanation: '破折号插入语 + as though 虚拟状语从句，细腻刻画机器人的从容神态。'
      }
    ]
  }
};

export const WORLD_STORIES = [
  {
    id: 'world-1',
    title: "A Children's World Game",
    chineseTitle: '儿童世界游戏',
    cover: publicAsset('/assets/story/Soft_watercolor_children_s_boo_2026-10-12T08-14-23.png'),
    fallbackCover: publicAsset('/assets/story/hero.webp'),
    mood: '有趣好玩',
    duration: '约 3 分钟',
    likes: 124,
    tags: ['儿童与少年', '创造力培养'],
    blurb: '在一个没有规则的下午，三个孩子用纸箱和旧时钟搭建了属于自己的微型王国。'
  },
  {
    id: 'world-2',
    title: 'An Amazing Friend',
    chineseTitle: '不可思议的朋友',
    cover: publicAsset('/assets/story/friend.webp'),
    fallbackCover: publicAsset('/assets/story/Soft_watercolor_children_s_boo_2026-10-12T08-14-40.png'),
    mood: '社交与温情',
    duration: '约 8 分钟',
    likes: 89,
    tags: ['社交活动', '情绪共鸣'],
    blurb: '我们都能从这件事中学到一课：人是可以改变自己的生活的。友谊的力量令人惊叹。'
  },
  {
    id: 'world-3',
    title: 'The Five Elements',
    chineseTitle: '五行之谜',
    cover: publicAsset('/assets/story/five.webp'),
    fallbackCover: publicAsset('/assets/story/Soft_watercolor_illustration_i_2026-10-12T08-14-56.png'),
    mood: '东方智慧',
    duration: '约 6 分钟',
    likes: 215,
    tags: ['传统文化', '自然哲思'],
    blurb: '以木火土金水解释自然运转，在日升月落与呼吸吐纳间找回身心平衡。'
  }
];

export const INITIAL_PREFERENCES: UserPreferences = {
  companionId: 'wick',
  interestTheme: '科学',
  pacing: 'relaxed',
  readingRatings: {},
  currentLevel: 'mid',
  profile: {
    startingLevel: 'L4',
    hintDensity: 'light',
    sessionDuration: 5
  },
  bookmarkedWords: ['emerged', 'unhurried'],
  bookmarkedSentences: [],
  streakDays: 0
};
