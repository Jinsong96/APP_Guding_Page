import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Send, Volume2, CheckCircle2, ChevronRight, BookOpen, RotateCcw, Compass } from 'lucide-react';
import { Companion, GoalTrackDetails } from '../../types';
import { CONTENT_DOMAINS } from '../../data';
import { GalaxyCompassPicker } from '../GalaxyCompassPicker';

export type CefrLevelKey = 'A1-' | 'A2' | 'B1' | 'B2+';

export type GoalCategory = 'exam' | 'workplace' | 'original' | 'interest';

export interface SurveyAnswers {
  goal?: string;
  challenge?: string;
  duration?: string;
  companionStyle?: string;
  goalTrack?: GoalTrackDetails;
}

export interface SurveyOptionItem {
  label: string;
  desc: string;
  icon: string;
  category?: GoalCategory;
}

export interface SurveyQuestionDef {
  step: number; // 11: Q1, 12: Q2 (focus), 15: Q3 (hurdle), 13: Q4 (duration), 14: Q5 (style)
  number: number;
  total: number;
  stageName: string;
  title: string;
  options: SurveyOptionItem[];
}

export const getSurveyQuestions = (companionName: string, goalCat: GoalCategory = 'exam'): SurveyQuestionDef[] => [
  {
    step: 11,
    number: 1,
    total: 5,
    stageName: '核心目标',
    title: '平时你读英语，最想达成什么目标呢？',
    options: [
      { label: '升学与备考冲刺', desc: '中考高考、四六级、考研、雅思托福或 KET/PET 考级', icon: '🎯', category: 'exam' },
      { label: '职场与专业应用', desc: '跨境电商、外刊精读、跨国协作与海外客户谈判', icon: '💼', category: 'workplace' },
      { label: '拓展视野看原版', desc: '看懂前沿科技、外媒时事评析与原版社科人文', icon: '🌟', category: 'original' },
      { label: '兴趣充能重拾语感', desc: '零压力轻松读，告别死记硬背，重拾英语好感', icon: '🌱', category: 'interest' }
    ]
  },
  {
    step: 12,
    number: 2,
    total: 5,
    stageName: '重点场景',
    title:
      goalCat === 'exam'
        ? '针对备考冲刺，你当前重点攻坚哪项考试呢？'
        : goalCat === 'workplace'
        ? '针对职场实战，你目前最关心的核心应用场景是？'
        : goalCat === 'original'
        ? '看原版拓视野，你平时更想看哪一类英文内容？'
        : '轻松读找回好感，你更期待哪种阅读体验？',
    options:
      goalCat === 'exam'
        ? [
            { label: '中考与初中培优', desc: '夯实语法基础，中考完形与阅读冲刺满分', icon: '🎒' },
            { label: '高考与高中拔高', desc: '攻克长难句与七选五，高效提升阅读速度与语感', icon: '🏫' },
            { label: '大学英语四六级', desc: 'CET-4 / CET-6 核心词汇突击与真题技巧', icon: '🎓' },
            { label: '考研英语一/二', desc: '真题阅读长难句精析，精准拆解命题逻辑', icon: '📚' },
            { label: '雅思 / 托福留学', desc: 'IELTS / TOEFL 学术长篇快速泛读与逻辑论证', icon: '✈️' },
            { label: 'KET / PET 剑桥五级', desc: 'MSE 剑桥通用英语等级冲刺，原版英语能力奠基', icon: '🏅' }
          ]
        : goalCat === 'workplace'
        ? [
            { label: '跨境与境外电商实务', desc: 'Listing 优质文案、海外社媒投放与买家精准沟通', icon: '🛍️' },
            { label: '外刊精读提升', desc: '经济学人、金融时报 FT、纽约时报等深度原刊时评', icon: '📰' },
            { label: '外企跨国协作与沟通', desc: '地道跨文化表达、全英文会议汇报与日常业务协同', icon: '🤝' },
            { label: '海外客户与商务谈判', desc: '专业商务条款磋商、询盘答复与海外项目推进', icon: '💼' }
          ]
        : goalCat === 'original'
        ? [
            { label: '前沿科技与 AI 资讯', desc: '一手海外科技速递、AI 发展动态与前瞻科技长文', icon: '🤖' },
            { label: '国际时评与外媒纪实', desc: '全球要闻第一手视角、文化观察与深度特稿纪实', icon: '🌍' },
            { label: '商业传记与领袖故事', desc: '大师传记、商业巨头创业史与行业领袖深度思想', icon: '💡' },
            { label: '社科人文与经典著作', desc: '哲学心理、历史原著与经典英文随笔散文', icon: '📖' }
          ]
        : [
            { label: '探索趣味冷知识与奇闻', desc: '新奇百科、动物世界与不可思议的自然地理', icon: '🔍' },
            { label: '告别死记硬背无痛输入', desc: '从故事短句中自然吸纳词汇，不查词也能懂大意', icon: '🍃' },
            { label: '零压力碎片微习惯打卡', desc: '每天几分钟不累不卷，循序渐进重建英语信心', icon: '☕' },
            { label: '影视动漫与流行文化', desc: '流行文化梗、剧集电影地道台词与艺术灵感', icon: '🎬' }
          ]
  },
  {
    step: 15,
    number: 3,
    total: 5,
    stageName: '攻坚瓶颈',
    title:
      goalCat === 'exam'
        ? '备考阅读中，你觉得目前最需要突破的薄弱卡点是？'
        : goalCat === 'workplace'
        ? '日常英文实操中，你通常觉得最大的进阶瓶颈是？'
        : goalCat === 'original'
        ? '阅读全英文原版时，你觉得最大的阻力通常是？'
        : '培养英语阅读习惯，你此前最容易遇到的困扰是？',
    options:
      goalCat === 'exam'
        ? [
            { label: '长难句主干理不清', desc: '从句套从句，容易抓不住句子核心骨架', icon: '🧭' },
            { label: '做题与阅读速度慢', desc: '长篇阅读耗时太长，往往来不及答完全部题目', icon: '⏳' },
            { label: '真题高频核心词短板', desc: '生词卡壳频次多，反复查词严重打断节奏', icon: '🧩' },
            { label: '选项逻辑易被陷阱误导', desc: '看似看懂文章，但做选择题时容易选偏', icon: '🎯' }
          ]
        : goalCat === 'workplace'
        ? [
            { label: '缺乏地道生动的实操表达', desc: '容易掉入中式生硬翻译，用词不够地道精炼', icon: '💬' },
            { label: '长篇外刊专业术语吃力', desc: '信息密度高，遇到陌生行业专业术语需要反复咀嚼', icon: '📚' },
            { label: '快速扫读提炼事实较慢', desc: '无法迅速从大篇幅英文中抓取核心关键数据', icon: '⚡' },
            { label: '难以自如应对海外实战场景', desc: '阅读勉强看懂，但临场难以自然转化与输出', icon: '🌐' }
          ]
        : goalCat === 'original'
        ? [
            { label: '生词较多打断节奏', desc: '频繁查词打断阅读连贯感与心流沉浸', icon: '🧩' },
            { label: '复杂句式结构理不清', desc: '主从复合句层次多，容易迷失修饰关系', icon: '🧭' },
            { label: '文化背景与俚语不熟悉', desc: '字面看懂了，但不太了解西方社会历史与双关梗', icon: '🌏' },
            { label: '读得较慢容易疲劳', desc: '专注力容易耗散，长篇读完略显吃力', icon: '⏳' }
          ]
        : [
            { label: '容易三天打鱼难以坚持', desc: '缺乏即时正向反馈，几天不读就容易搁置', icon: '⏳' },
            { label: '怕生词长句劝退挫败', desc: '一遇到硬核长篇就容易产生畏难心理', icon: '🍃' },
            { label: '缺少及时正向成就感', desc: '读完不知道自己进步在哪里，缺乏里程碑激励', icon: '🎉' },
            { label: '找不到合拍有趣的好读物', desc: '网上的素材要么过难要么枯燥，提不起兴趣', icon: '🔍' }
          ]
  },
  {
    step: 13,
    number: 4,
    total: 5,
    stageName: '专注节奏',
    title: '每天如果留一段专注阅读时间，你更习惯哪种时长节奏？',
    options: [
      { label: '5-8 分钟', desc: '碎片化微阅读，随时随地零负担打卡', icon: '⚡' },
      { label: '10-15 分钟', desc: '完整读完 1-2 篇精选短文，节奏最适中', icon: '⏱️' },
      { label: '20 分钟以上', desc: '沉浸式深度阅读，持续探索更多领域', icon: '📖' }
    ]
  },
  {
    step: 14,
    number: 5,
    total: 5,
    stageName: '伴读风格',
    title: `在接下来的阅读过程中，你希望${companionName}怎样陪伴你？`,
    options: [
      { label: '智能点拨', desc: '遇到难词长句，主动支招点拨与语法拆解', icon: '💡' },
      { label: '静默守护', desc: '尽量少打扰，遇到卡壳处点击时再细致解答', icon: '🍃' },
      { label: '鼓励打气', desc: '多给正向激励与微小成就反馈，战胜惰性', icon: '🎉' },
      { label: '背景拓展', desc: '多补充文化背景、地道俚语与历史趣味典故', icon: '🌏' }
    ]
  }
];

interface Stage02AiChatProps {
  companion: Companion;
  onBack: () => void;
  onComplete: (selectedInterests: string[], determinedLevel: CefrLevelKey, surveyAnswers?: SurveyAnswers) => void;
  onSkip: () => void;
}

export const LEVEL_METAS: Record<
  CefrLevelKey,
  { levelLabel: string; code: string; color: string; tagline: string }
> = {
  'A1-': {
    levelLabel: 'A1- 入门启蒙',
    code: 'L1', // 对应 L1, L2, L3，默认起点 L1
    color: '#38BDF8',
    tagline: '短句高频词，零负担轻松读'
  },
  'A2': {
    levelLabel: 'A2 基础衔接',
    code: 'L4', // 对应 L4, L5, L6，默认起点 L4
    color: '#34D399',
    tagline: '生活语境叙事，自然建立语感'
  },
  'B1': {
    levelLabel: 'B1 地道流畅',
    code: 'L7', // 对应 L7, L8, L9，默认起点 L7
    color: '#FBBF24',
    tagline: '复合从句与地道短语，畅读原版'
  },
  'B2+': {
    levelLabel: 'B2+ 原汁原味',
    code: 'L10', // 对应 L10, L11, L12，默认起点 L10
    color: '#F472B6',
    tagline: '原生文笔与细腻修辞，深度探究'
  }
};

// 4 Levels x 4 Sentences dataset
export const SENTENCES_BY_LEVEL: Record<CefrLevelKey, string[]> = {
  'A1-': [
    'We all remember our favourite teddy bear. It gave us comfort.',
    'Later, we grow up and forget our teddy. But this is not true for everyone.',
    'One survey says one in ten people need a teddy in bed.',
    'Some adults take their soft toys everywhere.'
  ],
  'A2': [
    'We all remember our favourite teddy bear from childhood. It was our soft friend and gave us comfort.',
    'As we grow up, we usually put our teddy away or give it away. But this doesn\'t happen to everyone.',
    'It seems that some adults still need their teddy. One survey says one in ten people in the UK need a teddy in bed.',
    'Some adults even take their soft toys everywhere.'
  ],
  'B1': [
    'One thing we always remember from childhood is our favourite teddy bear. This soft toy was our comfort and friend.',
    'As we grow up, we usually leave childish things behind, and our teddy often ends up in a box. But that\'s not the case for everyone.',
    'It seems that some adults still need their cuddly toy. One sleep survey suggested that a tenth of people in the UK need a teddy bear in bed.',
    'For some adults, soft toys are so important that they take them everywhere.'
  ],
  'B2+': [
    'One thing we always remember from our childhood is our favourite teddy bear. This soft, ragged toy was our comfort and companion.',
    'As we grow up, we normally give up our childish ways, and our furry friend often ends up in storage or at a jumble sale. But that\'s not the case for everyone.',
    'It seems that some grown-ups continue to need their cuddly toy by their sides. One sleep survey suggested a tenth of people in the UK need a teddy bear in bed.',
    'And for some adults, soft toys remain an essential presence – they take them wherever they go.'
  ]
};

export interface SentenceCardData {
  sentenceIndex: number; // 0, 1, 2, 3 (displays as 1/4, 2/4, 3/4, 4/4)
  totalSentences: number;
  level: CefrLevelKey;
  levelLabel: string;
  code: string;
  color: string;
  text: string;
}

export interface FullSummaryCardData {
  level: CefrLevelKey;
  levelLabel: string;
  code: string;
  color: string;
  tagline: string;
  sentences: string[];
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  sentenceCard?: SentenceCardData;
  summaryCard?: FullSummaryCardData;
}

// 智能意图映射算法：严格限定在系统现有的 81 个官方内容标签内（零新增标签）
const matchIntentionTo81Tags = (query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) return null;

  // 1. 直接精确或包含匹配 81 个标签原名
  for (let dIdx = 0; dIdx < CONTENT_DOMAINS.length; dIdx++) {
    const dom = CONTENT_DOMAINS[dIdx];
    const matched = dom.tags.filter((t) => q.includes(t.toLowerCase()) || t.toLowerCase().includes(q));
    if (matched.length > 0) {
      return {
        domainIndex: dIdx,
        domainName: dom.name,
        matchedTags: matched.slice(0, 3)
      };
    }
  }

  // 2. 深度热门语义与书名/作者封闭映射（所有结果 100% 对应现有 81 标签）
  // 特斯拉与新能源创新（优先对应 科学 领域的前沿科技）
  if (q.includes('特斯拉') || q.includes('tesla') || q.includes('马斯克') || q.includes('新能源') || q.includes('电动车')) {
    return {
      domainIndex: 1, // 科学
      domainName: '科学',
      matchedTags: ['前沿科技']
    };
  }
  // 人工智能与前沿科技 (科学)
  if (q.includes('ai') || q.includes('人工智能') || q.includes('智能') || q.includes('大模型') || q.includes('算力') || q.includes('chatgpt') || q.includes('算法')) {
    return {
      domainIndex: 1, // 科学
      domainName: '科学',
      matchedTags: ['人工智能', '前沿科技']
    };
  }
  // 中国文化与名家（如曾仕强、南怀瑾、道德经、易经等）
  if (q.includes('中国文化') || q.includes('文化') || q.includes('曾仕强') || q.includes('南怀瑾') || q.includes('易经') || q.includes('道德经') || q.includes('国学') || q.includes('老子') || q.includes('孔子') || q.includes('哲学')) {
    return {
      domainIndex: 2, // 文化
      domainName: '文化',
      matchedTags: ['中国文化', '历史故事']
    };
  }
  // 宇宙深空与天文航天
  if (q.includes('宇宙') || q.includes('太空') || q.includes('星际') || q.includes('黑洞') || q.includes('航天') || q.includes('天文')) {
    return {
      domainIndex: 1, // 科学
      domainName: '科学',
      matchedTags: ['宇宙太空', '自然地理']
    };
  }
  // 科幻故事与经典名著（如三体、刘慈欣等）
  if (q.includes('三体') || q.includes('刘慈欣') || q.includes('科幻') || q.includes('流浪地球') || q.includes('名著') || q.includes('小说')) {
    return {
      domainIndex: 5, // 故事
      domainName: '故事',
      matchedTags: ['科幻故事', '经典名著']
    };
  }
  // 商业、管理与投资（如乔布斯、巴菲特、创业等）
  if (q.includes('商业') || q.includes('创业') || q.includes('投资') || q.includes('理财') || q.includes('乔布斯') || q.includes('巴菲特') || q.includes('管理') || q.includes('职场')) {
    return {
      domainIndex: 3, // 商业
      domainName: '商业',
      matchedTags: ['商业故事', '创业故事', '职场生存']
    };
  }
  // 心理、沟通与自我成长
  if (q.includes('心理') || q.includes('习惯') || q.includes('沟通') || q.includes('自控') || q.includes('焦虑') || q.includes('情绪') || q.includes('情商') || q.includes('人际') || q.includes('成长')) {
    return {
      domainIndex: 4, // 成长
      domainName: '成长',
      matchedTags: ['习惯养成', '沟通表达', '心理探索']
    };
  }
  // 自然、动物与生态
  if (q.includes('自然') || q.includes('动物') || q.includes('植物') || q.includes('海洋') || q.includes('生物') || q.includes('地理') || q.includes('环境')) {
    return {
      domainIndex: 1, // 科学
      domainName: '科学',
      matchedTags: ['动物世界', '自然地理', '科普冷知识']
    };
  }
  // 国际局势与社会热点
  if (q.includes('热点') || q.includes('国际') || q.includes('全球') || q.includes('社会') || q.includes('新闻') || q.includes('世界')) {
    return {
      domainIndex: 0, // 世界
      domainName: '世界',
      matchedTags: ['全球热点', '国际局势', '社会观察']
    };
  }

  // 默认：归纳为科学领域的前两个官方合法标签
  return {
    domainIndex: 1,
    domainName: '科学',
    matchedTags: ['前沿科技', '科普冷知识']
  };
};

export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  onBack,
  onComplete,
  onSkip: _onSkip
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // Flow steps:
  // 0: AI typing greeting
  // 1: 360° Compass visible for picking interests
  // -1: Transitioning/reading pause (buttons locked)
  // 3: Sentence 1 shown, awaiting feedback for sentence 1
  // 4: Sentence 2 shown, awaiting feedback for sentence 2
  // 5: Sentence 3 shown, awaiting feedback for sentence 3
  // 6: Sentence 4 shown, awaiting feedback for sentence 4
  // 7: Reading evaluation complete, final level locked, ready for Stage 8
  const [step, setStep] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [astrolabeTargetDomain, setAstrolabeTargetDomain] = useState<number | null>(null);
  const [currentLevel, setCurrentLevel] = useState<CefrLevelKey>('A2'); // Initial difficulty is A2
  const [isAiTyping, setIsAiTyping] = useState<boolean>(true);
  const [typedText, setTypedText] = useState<string>('');
  const [isThinkingDots, setIsThinkingDots] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('exam');
  const [sentenceLevelHistory, setSentenceLevelHistory] = useState<Record<number, CefrLevelKey>>({ 0: 'A2' });
  const [sentenceFeedbacks, setSentenceFeedbacks] = useState<Record<number, { text: string; direction: 'up' | 'down' | 'keep' }>>({});

  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const delayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, step, isAiTyping, typedText]);

  // Cleanup all timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  // Speech synthesis helper
  const handlePlayAudio = (text: string, sIdx?: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      if (typeof sIdx === 'number') {
        setPlayingSentenceIdx(sIdx);
        utterance.onend = () => setPlayingSentenceIdx(null);
        utterance.onerror = () => setPlayingSentenceIdx(null);
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Natural typewriter helper
  const runTypewriter = (
    fullText: string,
    messageId: string,
    initialDelayMs: number,
    charSpeedMs: number,
    onCompleteCb?: () => void,
    extraCard?: { sentenceCard?: SentenceCardData; summaryCard?: FullSummaryCardData }
  ) => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);

    setIsAiTyping(true);
    setTypedText('');
    setIsThinkingDots(initialDelayMs > 100);

    delayTimerRef.current = setTimeout(() => {
      setIsThinkingDots(false);
      let idx = 0;

      const charInterval = setInterval(() => {
        idx++;
        setTypedText(fullText.slice(0, idx));

        if (idx >= fullText.length) {
          clearInterval(charInterval);
          timerRef.current = null;

          setMessages((prev) => {
            if (prev.some((m) => m.id === messageId)) return prev;
            return [
              ...prev,
              {
                id: messageId,
                sender: 'ai',
                text: fullText,
                sentenceCard: extraCard?.sentenceCard,
                summaryCard: extraCard?.summaryCard
              }
            ];
          });
          setIsAiTyping(false);
          setTypedText('');

          if (onCompleteCb) {
            onCompleteCb();
          }
        }
      }, charSpeedMs);

      timerRef.current = charInterval;
    }, initialDelayMs);
  };

  // Turn 1: AI companion types out initial greeting
  useEffect(() => {
    const q1 = `嗨！我是${companion.name}。初次见面，你最近想读点什么呢？`;
    runTypewriter(q1, 'm1', 260, 36, () => {
      setStep(1); // Reveal 360° compass
    });
  }, [companion.name]);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 10) {
        return prev;
      }
      return [...prev, tag];
    });
  };

  // Level adjustment helper
  const getNextLevel = (current: CefrLevelKey, direction: 'up' | 'down' | 'keep'): CefrLevelKey => {
    if (direction === 'keep') return current;
    if (direction === 'up') {
      if (current === 'A1-') return 'A2';
      if (current === 'A2') return 'B1';
      return 'B2+';
    } else {
      if (current === 'B2+') return 'B1';
      if (current === 'B1') return 'A2';
      return 'A1-';
    }
  };

  // Helper to present a sentence with the optimized rhythm:
  // 1. Answer companion response
  // 2. Immediately display reading sentence card
  // 3. Pause 2000ms for comfortable reading
  // 4. Then ask reading feeling & reveal rating options
  const presentSentenceWithRhythm = (
    sentenceIdx: number, // 0, 1, 2, 3
    levelToUse: CefrLevelKey,
    companionAnswer: string,
    bridgeMessageId: string,
    targetStep: number // 3 for sent 1, 4 for sent 2, 5 for sent 3, 6 for sent 4
  ) => {
    setIsBusy(true);
    setStep(-1); // Hide previous options immediately to eliminate duplicate clicks

    // Step 1: AI companion answers first
    runTypewriter(companionAnswer, bridgeMessageId, 180, 26, () => {
      // Step 2: Show the reading sentence card immediately below
      const sentenceText = SENTENCES_BY_LEVEL[levelToUse][sentenceIdx];
      const sCard: SentenceCardData = {
        sentenceIndex: sentenceIdx,
        totalSentences: 4,
        level: levelToUse,
        levelLabel: LEVEL_METAS[levelToUse].levelLabel,
        code: LEVEL_METAS[levelToUse].code,
        color: LEVEL_METAS[levelToUse].color,
        text: sentenceText
      };

      setMessages((prev) => {
        if (prev.some((m) => m.id === `sentence-card-${sentenceIdx}`)) return prev;
        return [
          ...prev,
          {
            id: `sentence-card-${sentenceIdx}`,
            sender: 'ai',
            text: `试读选文 · 第 ${sentenceIdx + 1}/4 句`,
            sentenceCard: sCard
          }
        ];
      });

      // Step 3: Pause for 2 seconds (2000ms) to give the user dedicated quiet reading time
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = setTimeout(() => {
        // Step 4: After 2 seconds pause, ask about their reading experience
        const askMsg =
          sentenceIdx === 0
            ? '读完第 1 句，你觉得这句理解起来轻松吗？'
            : sentenceIdx === 3
            ? '全篇第 4 句收尾！整体试读下来，你觉得这个难度节奏契合吗？'
            : `第 ${sentenceIdx + 1} 句阅读感受如何？`;

        runTypewriter(askMsg, `m-ask-s${sentenceIdx + 1}`, 150, 28, () => {
          setStep(targetStep);
          setIsBusy(false);
        });
      }, 2000);
    });
  };

  // Step 1 -> Survey: Confirm tags, then introduce 5 friendly profiling questions to understand user better
  const handleConfirmTags = (tags: string[]) => {
    if (isBusy) return;
    const confirmedTags = tags.length > 0 ? tags : (selectedTags.length > 0 ? selectedTags : ['前沿科技', '天文探索']);
    setSelectedTags(confirmedTags);

    setMessages((prev) => [
      ...prev,
      {
        id: `u-tags-${Date.now()}`,
        sender: 'user',
        text: `兴趣星盘已就绪 · ${confirmedTags.join(' · ')}`
      }
    ]);

    setIsBusy(true);
    setStep(-1);

    const topTags = confirmedTags.slice(0, 2).join('与');
    const introMsg = `【${topTags}】收到啦！在开始试读前，想先了解你几个阅读小习惯，这样能让${companion.name}在以后的阅读里更懂你的节奏～`;

    runTypewriter(introMsg, 'm-intro-survey', 180, 26, () => {
      const q1Msg = `第 1 问：你平时读英语，最想达成什么目标呢？`;
      runTypewriter(q1Msg, 'm-q1', 120, 26, () => {
        setStep(11);
        setIsBusy(false);
      });
    });
  };

  // Handle answering any of the 5 profiling questions (Q1: 11, Q2: 12, Q3: 15, Q4: 13, Q5: 14)
  const handleAnswerSurvey = (currentStep: number, answerText: string, optItem?: SurveyOptionItem) => {
    if (isBusy) return;
    setIsBusy(true);
    setStep(-1);

    setMessages((prev) => [
      ...prev,
      { id: `u-q${currentStep}-${Date.now()}`, sender: 'user', text: answerText }
    ]);

    const cleanText = optItem ? optItem.label : answerText.replace(/^[^\w\u4e00-\u9fa5]+/, '').trim();

    if (currentStep === 11) {
      const detectedCategory: GoalCategory = optItem?.category || (
        cleanText.includes('升学') || cleanText.includes('备考') ? 'exam' :
        cleanText.includes('职场') || cleanText.includes('电商') || cleanText.includes('外刊') ? 'workplace' :
        cleanText.includes('原版') || cleanText.includes('视野') ? 'original' : 'interest'
      );
      setGoalCategory(detectedCategory);

      setSurveyAnswers((prev) => ({
        ...prev,
        goal: cleanText,
        goalTrack: {
          category: detectedCategory,
          categoryLabel: cleanText,
          targetFocus: '',
          targetHurdle: ''
        }
      }));

      const companionReaction =
        detectedCategory === 'exam'
          ? `收到！备考冲刺贵在靶向精准～你当前重点攻坚哪项考试呢？`
          : detectedCategory === 'workplace'
          ? `太棒啦！实战应用讲究学以致用，你目前最关心的核心应用场景是？`
          : detectedCategory === 'original'
          ? `原版能带来第一手前沿视野！你平时更想看哪一类英文内容？`
          : `轻松出发最重要！零压力培养纯粹好感，你更期待哪种阅读体验？`;

      runTypewriter(companionReaction, 'm-q2', 150, 24, () => {
        setStep(12);
        setIsBusy(false);
      });
    } else if (currentStep === 12) {
      setSurveyAnswers((prev) => ({
        ...prev,
        goalTrack: {
          category: prev.goalTrack?.category || goalCategory,
          categoryLabel: prev.goalTrack?.categoryLabel || prev.goal || '目标冲刺',
          targetFocus: cleanText,
          targetHurdle: prev.goalTrack?.targetHurdle || ''
        }
      }));

      const companionReaction = `记下来啦，针对【${cleanText}】，我们把关口摸透～日常阅读中最想突破的卡点是？`;
      runTypewriter(companionReaction, 'm-q15', 150, 24, () => {
        setStep(15);
        setIsBusy(false);
      });
    } else if (currentStep === 15) {
      setSurveyAnswers((prev) => ({
        ...prev,
        challenge: cleanText,
        goalTrack: {
          category: prev.goalTrack?.category || goalCategory,
          categoryLabel: prev.goalTrack?.categoryLabel || prev.goal || '目标冲刺',
          targetFocus: prev.goalTrack?.targetFocus || '核心专项',
          targetHurdle: cleanText
        }
      }));

      const companionReaction = `收到！针对【${cleanText}】，以后的阅读里${companion.name}会特别为你标注破解要点。那每天专注阅读，你更习惯哪种时长节奏？`;
      runTypewriter(companionReaction, 'm-q3', 150, 24, () => {
        setStep(13);
        setIsBusy(false);
      });
    } else if (currentStep === 13) {
      setSurveyAnswers((prev) => ({ ...prev, duration: cleanText }));
      const companionReaction = `微步前行聚沙成塔！在接下来的阅读过程中，你希望${companion.name}怎样陪伴你？`;
      runTypewriter(companionReaction, 'm-q4', 150, 24, () => {
        setStep(14);
        setIsBusy(false);
      });
    } else if (currentStep === 14) {
      setSurveyAnswers((prev) => ({ ...prev, companionStyle: cleanText }));
      const targetFocusLabel = surveyAnswers.goalTrack?.targetFocus || '个性化';
      const transitionMsg = `太好啦！${companion.name}已经全方位掌握你的阅读偏好与【${targetFocusLabel}】目标✨ 接下来我们通过 4 句微试读来为你精准定级。先看第 1 句：`;
      const initialLevel: CefrLevelKey = 'A2';
      setCurrentLevel(initialLevel);
      setSentenceLevelHistory({ 0: initialLevel });
      setSentenceFeedbacks({});
      presentSentenceWithRhythm(0, initialLevel, transitionMsg, 'm-read-intro', 3);
    }
  };

  // Return from Habit Exploration Q1 back to Step 1 (Galaxy Astrolabe) to reselect interests
  const handleReturnToCompass = () => {
    if (isBusy) return;

    if (timerRef.current) clearInterval(timerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsAiTyping(false);
    setTypedText('');
    setIsBusy(false);

    setMessages((prev) => {
      const idx = prev.findIndex((m) => m.id.startsWith('u-tags-'));
      return idx !== -1 ? prev.slice(0, idx) : prev;
    });

    setSurveyAnswers({});
    setAstrolabeTargetDomain(null);
    setStep(1);
  };

  // Return to previous survey question (allows user to reselect if picked wrong)
  const handlePrevSurveyQuestion = () => {
    if (isBusy || step <= 11) return;

    if (timerRef.current) clearInterval(timerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsAiTyping(false);
    setTypedText('');
    setIsBusy(false);

    if (step === 12) {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-q1');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(11);
      return;
    }

    if (step === 15) {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-q2');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(12);
      return;
    }

    if (step === 13) {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-q15');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(15);
      return;
    }

    if (step === 14) {
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-q3');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(13);
      return;
    }
  };

  // Return to previous sentence (supported for sentences 2, 3, 4)
  const handlePrevSentence = () => {
    if (isBusy || step <= 3 || step > 6) return;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsAiTyping(false);
    setTypedText('');
    setIsBusy(false);
    setPlayingSentenceIdx(null);

    if (step === 4) {
      const prevLevel = sentenceLevelHistory[0] || 'A2';
      setCurrentLevel(prevLevel);
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-ask-s1');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(3);
      return;
    }

    if (step === 5) {
      const prevLevel = sentenceLevelHistory[1] || 'A2';
      setCurrentLevel(prevLevel);
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-ask-s2');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(4);
      return;
    }

    if (step === 6) {
      const prevLevel = sentenceLevelHistory[2] || 'A2';
      setCurrentLevel(prevLevel);
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-ask-s3');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(5);
      return;
    }
  };

  // Proceed to Next Sentence (Sentence 1 -> 2, Sentence 2 -> 3, Sentence 3 -> 4)
  const advanceToSentence = (
    nextSentenceIdx: number,
    feedbackText: string,
    direction: 'up' | 'down' | 'keep'
  ) => {
    if (isBusy) return;
    setIsBusy(true);

    const prevSentIdx = nextSentenceIdx - 1; // 0 for Sentence 1, 1 for Sentence 2, 2 for Sentence 3
    setSentenceFeedbacks((prev) => ({
      ...prev,
      [prevSentIdx]: { text: feedbackText, direction }
    }));

    const nextLvl = getNextLevel(currentLevel, direction);
    setSentenceLevelHistory((prev) => ({
      ...prev,
      [nextSentenceIdx]: nextLvl
    }));
    setCurrentLevel(nextLvl);

    setMessages((prev) => [
      ...prev,
      { id: `u-fb-${nextSentenceIdx}-${Date.now()}`, sender: 'user', text: feedbackText }
    ]);

    let bridge = '';
    if (direction === 'up') {
      bridge = `实力很强！为你加深句式与地道表达，来看第 ${nextSentenceIdx + 1}/4 句：`;
    } else if (direction === 'down') {
      bridge = `收到，我们切换为更轻盈的基础表达，来看第 ${nextSentenceIdx + 1}/4 句：`;
    } else {
      bridge = `好的，保持这个舒适节奏！来看第 ${nextSentenceIdx + 1}/4 句：`;
    }

    const nextTargetStep = nextSentenceIdx + 3; // 1->4, 2->5, 3->6
    presentSentenceWithRhythm(nextSentenceIdx, nextLvl, bridge, `m-bridge-${nextSentenceIdx}`, nextTargetStep);
  };

  // Complete Sentence 4 and Lock Final Level (Graduation to Stage 8)
  const completeEvaluation = (feedbackText: string, finalAdjustment?: 'up' | 'down' | 'keep') => {
    if (isBusy) return;
    setIsBusy(true);
    setStep(-1);

    setSentenceFeedbacks((prev) => ({
      ...prev,
      3: { text: feedbackText, direction: finalAdjustment || 'keep' }
    }));

    let finalLvl = currentLevel;
    if (finalAdjustment) {
      finalLvl = getNextLevel(currentLevel, finalAdjustment);
      setCurrentLevel(finalLvl);
    }

    setMessages((prev) => [
      ...prev,
      { id: `u-final-${Date.now()}`, sender: 'user', text: feedbackText }
    ]);

    setTimeout(() => {
      setStep(7);
      setIsBusy(false);
    }, 150);
  };

  // User free text input handler
  const handleSendMessage = () => {
    const trimmed = inputText.trim();
    if (!trimmed || isAiTyping || isBusy) return;

    setInputText('');

    if (step === 1) {
      const match = matchIntentionTo81Tags(trimmed);
      if (match) {
        setMessages((prev) => [
          ...prev,
          { id: `u-${Date.now()}`, sender: 'user', text: trimmed }
        ]);

        setSelectedTags((prev) => {
          const next = [...prev];
          match.matchedTags.forEach((t) => {
            if (!next.includes(t) && next.length < 10) {
              next.push(t);
            }
          });
          return next;
        });

        setAstrolabeTargetDomain(match.domainIndex);

        const replyMsg = `收到！已为你锁定【${match.domainName}】领域的【${match.matchedTags.join('、')}】～ 星盘已自动调准，可以直接点击下方就绪，也可以继续挑选其他标签哦！`;
        runTypewriter(replyMsg, `ai-match-${Date.now()}`, 100, 24);
      }
    } else if (step >= 11 && step <= 15) {
      handleAnswerSurvey(step, trimmed);
    } else if (step === 3) {
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        advanceToSentence(1, trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        advanceToSentence(1, trimmed, 'up');
      } else {
        advanceToSentence(1, trimmed, 'keep');
      }
    } else if (step === 4) {
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        advanceToSentence(2, trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        advanceToSentence(2, trimmed, 'up');
      } else {
        advanceToSentence(2, trimmed, 'keep');
      }
    } else if (step === 5) {
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        advanceToSentence(3, trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        advanceToSentence(3, trimmed, 'up');
      } else {
        advanceToSentence(3, trimmed, 'keep');
      }
    } else if (step === 6) {
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        completeEvaluation(trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        completeEvaluation(trimmed, 'up');
      } else {
        completeEvaluation(trimmed, 'keep');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF6ED] text-stone-900 overflow-hidden relative select-none">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-15 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${companion.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Top Header Bar */}
      <div className="shrink-0 h-12 px-3.5 flex items-center justify-between border-b border-[#E8DFC8] bg-[#FAF6ED]/95 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-full text-stone-600 hover:text-stone-900 hover:bg-[#F2ECE1] transition-colors cursor-pointer"
          aria-label="返回"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-stone-300"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white bg-emerald-500"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-stone-900 tracking-wide">
              {companion.name}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#EFE7D8] text-stone-600 font-mono">
              AI 伴读
            </span>
          </div>
        </div>

        {/* Balance layout without skip button */}
        <div className="w-7" />
      </div>

      {/* Main Conversational Stream */}
      <div className="flex-1 overflow-y-auto px-3.5 sm:px-4 py-3 space-y-3.5 no-scrollbar relative z-10 flex flex-col">
        {/* Render Established Chat Messages */}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end animate-in fade-in duration-200' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-7 h-7 rounded-full object-cover shadow-xs ring-1 ring-stone-200"
                  style={{
                    boxShadow: `0 0 10px ${companion.accentColor}25`
                  }}
                />
              </div>
            )}

            <div className={`max-w-[90%] sm:max-w-[88%] ${m.sender === 'user' ? 'ml-auto' : ''}`}>
              {/* Sentence Card (Pure, focused reading card on warm paper) */}
              {m.sentenceCard ? (
                <div className="rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] overflow-hidden shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Card Header with Progress Indicator & Clean Audio Button */}
                  <div className="px-3.5 py-2.5 bg-[#FAF6ED] border-b border-[#E8DFC8] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1.5 font-mono">
                        <BookOpen size={13} />
                        第 {m.sentenceCard.sentenceIndex + 1}/{m.sentenceCard.totalSentences} 句
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(m.sentenceCard!.text, m.sentenceCard!.sentenceIndex)}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-[#F2ECE1] text-stone-700 hover:text-stone-900 border border-[#E2D8C6] transition-colors cursor-pointer flex items-center gap-1.5 text-[11px] shadow-xs"
                      title="朗读本句"
                    >
                      <Volume2
                        size={13}
                        className={playingSentenceIdx === m.sentenceCard.sentenceIndex ? 'text-amber-600 animate-pulse' : 'text-stone-600'}
                      />
                      <span className="text-[11px] text-stone-700 font-medium">朗读</span>
                    </button>
                  </div>

                  {/* Clean Sentence Body */}
                  <div className="p-4 sm:p-4.5 text-[17px] sm:text-[17.5px] leading-relaxed text-stone-900 font-serif">
                    <p className="tracking-wide selection:bg-amber-100">
                      {m.sentenceCard.text}
                    </p>
                  </div>
                </div>
              ) : m.summaryCard ? (
                /* Full Passage Summary Card upon Completing 4 Sentences */
                <div className="rounded-2xl bg-[#FFFFFF] border border-emerald-500/30 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="px-3.5 py-2.5 bg-emerald-50/80 border-b border-emerald-200/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-white font-mono"
                        style={{ backgroundColor: m.summaryCard.color }}
                      >
                        {m.summaryCard.levelLabel}
                      </span>
                      <span className="text-xs text-emerald-800 font-medium">4 句试读全貌</span>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(m.summaryCard!.sentences.join(' '))}
                      className="p-1 rounded-md hover:bg-emerald-100 text-stone-700 hover:text-stone-900 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="朗读全文"
                    >
                      <Volume2 size={13} className="text-emerald-700" />
                      <span className="text-[10px] text-emerald-800 font-medium">全文朗读</span>
                    </button>
                  </div>

                  <div className="p-3.5 space-y-2 text-[15.5px] leading-relaxed text-stone-800 font-serif">
                    {m.summaryCard.sentences.map((sent, sIdx) => (
                      <p key={sIdx} className="p-1.5 rounded-lg hover:bg-emerald-50/50 transition-colors">
                        {sent}
                      </p>
                    ))}
                  </div>

                  <div className="px-3.5 py-2 bg-[#FAF6ED] border-t border-[#E8DFC8] text-[11px] text-stone-600 flex items-center justify-between">
                    <span>{m.summaryCard.tagline}</span>
                    <span className="text-[10px] text-amber-700 font-mono font-semibold">建议起点 {m.summaryCard.code}</span>
                  </div>
                </div>
              ) : (
                /* Normal Chat Text Bubble */
                <div
                  className={`p-3.5 sm:p-4 rounded-2xl text-[16px] sm:text-[16.5px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-600 text-white font-semibold rounded-tr-xs shadow-xs'
                      : 'bg-[#FFFFFF] text-stone-900 border border-[#E8DFC8] rounded-tl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Live Typing Message Bubble */}
        {isAiTyping && (
          <div className="flex items-start gap-2.5 justify-start animate-in fade-in duration-150">
            <div className="relative shrink-0 mt-0.5">
              <img
                src={companion.avatarUrl}
                alt={companion.name}
                className="w-7 h-7 rounded-full object-cover shadow-xs ring-1 ring-stone-200"
                style={{
                  boxShadow: `0 0 10px ${companion.accentColor}25`
                }}
              />
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl text-[16px] sm:text-[16.5px] leading-relaxed max-w-[88%] bg-[#FFFFFF] text-stone-900 border border-[#E8DFC8] rounded-tl-xs flex items-center min-h-[46px] shadow-xs">
              {isThinkingDots ? (
                <div className="flex items-center gap-1.5 py-1 px-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>{typedText}</span>
                  <span className="w-1.5 h-3.5 bg-amber-600 cursor-blink inline-block rounded-xs" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 1: 360° Galaxy Compass for Picking Interests */}
        {step === 1 && (
          <div className="w-full pt-0.5 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <GalaxyCompassPicker
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              onConfirm={handleConfirmTags}
              companionAccent={companion.accentColor}
              targetDomainIndex={astrolabeTargetDomain}
              onDomainChange={() => {
                setAstrolabeTargetDomain(null);
              }}
            />
          </div>
        )}

        {/* STEPS 11-15: 5 Dynamic Interactive Survey Questions to Understand the User Better */}
        {(step === 11 || step === 12 || step === 15 || step === 13 || step === 14) && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
            {(() => {
              const currentQ = getSurveyQuestions(companion.name, goalCategory).find((q) => q.step === step);
              if (!currentQ) return null;

              return (
                <>
                  <div className="flex items-center justify-between px-1 text-xs text-stone-500">
                    <span className="font-mono text-amber-700 flex items-center gap-1.5 font-semibold text-[13px]">
                      <Sparkles size={13} />
                      第 {currentQ.number}/{currentQ.total} 问 · {currentQ.stageName}
                    </span>

                    {/* In Q1 (step === 11), provide direct button to return to interest selection / astrolabe */}
                    {step === 11 && (
                      <button
                        type="button"
                        onClick={handleReturnToCompass}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-amber-800 hover:text-amber-950 bg-[#FFFFFF] hover:bg-amber-50/90 border border-amber-300 hover:border-amber-400 transition-all cursor-pointer active:scale-95 shadow-2xs group"
                        title="返回星盘重新选择兴趣"
                      >
                        <Compass size={12} className="text-amber-600 group-hover:rotate-45 transition-transform" />
                        <span>返回重选星盘</span>
                      </button>
                    )}

                    {/* Lightweight "上一题" Action in Top-Right of Options (displayed for steps other than Q1) */}
                    {step !== 11 && (
                      <button
                        type="button"
                        onClick={handlePrevSurveyQuestion}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-stone-600 hover:text-amber-800 bg-[#FFFFFF] hover:bg-amber-50/80 border border-[#E4DAC5] hover:border-amber-300 transition-all cursor-pointer active:scale-95 shadow-2xs group"
                        title="返回上一题重新选择"
                      >
                        <RotateCcw size={11.5} className="text-stone-400 group-hover:text-amber-600 transition-transform group-hover:-rotate-45" />
                        <span>上一题</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-[350px] overflow-y-auto no-scrollbar pr-0.5">
                    {currentQ.options.map((opt) => {
                      const currentSavedAnswer =
                        step === 11
                          ? surveyAnswers.goal
                          : step === 12
                          ? surveyAnswers.goalTrack?.targetFocus
                          : step === 15
                          ? surveyAnswers.goalTrack?.targetHurdle || surveyAnswers.challenge
                          : step === 13
                          ? surveyAnswers.duration
                          : surveyAnswers.companionStyle;
                      const isPreviouslySelected = currentSavedAnswer ? currentSavedAnswer.includes(opt.label) : false;

                      return (
                        <button
                          key={opt.label}
                          onClick={() => handleAnswerSurvey(step, `${opt.icon} ${opt.label}`, opt)}
                          className={`w-full p-3 rounded-xl text-left transition-all active:scale-[0.98] cursor-pointer group flex items-center justify-between gap-2 shadow-xs ${
                            isPreviouslySelected
                              ? 'bg-amber-50/70 border-2 border-amber-500/80 hover:bg-amber-50 hover:border-amber-600'
                              : 'bg-[#FFFFFF] hover:bg-[#FFFDF8] border border-[#E8DFC8] hover:border-amber-500/70'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-lg shrink-0">{opt.icon}</span>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-[14px] sm:text-[14.5px] font-semibold transition-colors ${
                                    isPreviouslySelected ? 'text-amber-900 font-bold' : 'text-stone-900 group-hover:text-amber-700'
                                  }`}
                                >
                                  {opt.label}
                                </span>
                                {isPreviouslySelected && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200/80 text-amber-900 font-medium font-sans">
                                    上次所选
                                  </span>
                                )}
                              </div>
                              <div className="text-[11.5px] sm:text-[12px] text-stone-500 truncate mt-0.5">
                                {opt.desc}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            size={15}
                            className={`shrink-0 transition-transform group-hover:translate-x-0.5 ${
                              isPreviouslySelected ? 'text-amber-600' : 'text-stone-400 group-hover:text-amber-600'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* STEP 3: Rating for Sentence 1 (A2 initial) -> Leads to Sentence 2 */}
        {step === 3 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1 text-xs text-stone-500 mb-0.5">
              <span className="font-mono text-amber-700 flex items-center gap-1.5 font-semibold text-[13px]">
                <BookOpen size={13} />
                第 1/4 句
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => advanceToSentence(1, '🟢 刚刚好，理解顺畅，继续保持', 'keep')}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                  sentenceFeedbacks[0]?.direction === 'keep'
                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🟢 刚刚好，理解顺畅</span>
                  {sentenceFeedbacks[0]?.direction === 'keep' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-medium font-sans">
                      上次所选
                    </span>
                  )}
                </div>
                <CheckCircle2 size={15} />
              </button>
              <button
                onClick={() => advanceToSentence(1, '🔴 稍显吃力，想降为轻盈基础版', 'down')}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                  sentenceFeedbacks[0]?.direction === 'down'
                    ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                    : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🔴 偏难吃力，降为更轻盈基础版</span>
                  {sentenceFeedbacks[0]?.direction === 'down' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                      上次所选
                    </span>
                  )}
                </div>
                <ChevronRight size={15} className="text-stone-400" />
              </button>
              <button
                onClick={() => advanceToSentence(1, '🔵 太简单了，想要更地道有挑战', 'up')}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                  sentenceFeedbacks[0]?.direction === 'up'
                    ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                    : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🔵 太简单，想更有挑战感</span>
                  {sentenceFeedbacks[0]?.direction === 'up' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                      上次所选
                    </span>
                  )}
                </div>
                <ChevronRight size={15} className="text-stone-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Rating for Sentence 2 -> Leads to Sentence 3 */}
        {step === 4 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1 text-xs text-stone-500 mb-0.5">
              <span className="font-mono text-amber-700 flex items-center gap-1.5 font-semibold text-[13px]">
                <BookOpen size={13} />
                第 2/4 句
              </span>
              <button
                type="button"
                onClick={handlePrevSentence}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-stone-600 hover:text-amber-800 bg-[#FFFFFF] hover:bg-amber-50/80 border border-[#E4DAC5] hover:border-amber-300 transition-all cursor-pointer active:scale-95 shadow-2xs group"
                title="返回上一句重新选择"
              >
                <RotateCcw size={11.5} className="text-stone-400 group-hover:text-amber-600 transition-transform group-hover:-rotate-45" />
                <span>上一句</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => advanceToSentence(2, '🟢 刚刚好，这个难度很舒服', 'keep')}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                  sentenceFeedbacks[1]?.direction === 'keep'
                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🟢 刚刚好，保持当前难度节奏</span>
                  {sentenceFeedbacks[1]?.direction === 'keep' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-medium font-sans">
                      上次所选
                    </span>
                  )}
                </div>
                <CheckCircle2 size={15} />
              </button>
              {currentLevel !== 'B2+' && (
                <button
                  onClick={() => advanceToSentence(2, '🔵 读起来轻松，想继续往上挑战！', 'up')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    sentenceFeedbacks[1]?.direction === 'up'
                      ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                      : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔵 读起来轻松，往上加点挑战</span>
                    {sentenceFeedbacks[1]?.direction === 'up' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                        上次所选
                      </span>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              )}
              {currentLevel !== 'A1-' && (
                <button
                  onClick={() => advanceToSentence(2, '🔴 略有阻碍，稍微降低一点点', 'down')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    sentenceFeedbacks[1]?.direction === 'down'
                      ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                      : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔴 略有阻碍，稍降一点更稳</span>
                    {sentenceFeedbacks[1]?.direction === 'down' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                        上次所选
                      </span>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Rating for Sentence 3 -> Leads to Sentence 4 */}
        {step === 5 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1 text-xs text-stone-500 mb-0.5">
              <span className="font-mono text-amber-700 flex items-center gap-1.5 font-semibold text-[13px]">
                <BookOpen size={13} />
                第 3/4 句
              </span>
              <button
                type="button"
                onClick={handlePrevSentence}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-stone-600 hover:text-amber-800 bg-[#FFFFFF] hover:bg-amber-50/80 border border-[#E4DAC5] hover:border-amber-300 transition-all cursor-pointer active:scale-95 shadow-2xs group"
                title="返回上一句重新选择"
              >
                <RotateCcw size={11.5} className="text-stone-400 group-hover:text-amber-600 transition-transform group-hover:-rotate-45" />
                <span>上一句</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => advanceToSentence(3, '🟢 刚刚好，很有阅读代入感', 'keep')}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                  sentenceFeedbacks[2]?.direction === 'keep'
                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🟢 刚刚好，契合当前阅读心流</span>
                  {sentenceFeedbacks[2]?.direction === 'keep' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-medium font-sans">
                      上次所选
                    </span>
                  )}
                </div>
                <CheckCircle2 size={15} />
              </button>
              {currentLevel !== 'B2+' && (
                <button
                  onClick={() => advanceToSentence(3, '🔵 游刃有余，第 4 句想冲刺高阶！', 'up')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    sentenceFeedbacks[2]?.direction === 'up'
                      ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                      : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔵 游刃有余，冲刺更高阶</span>
                    {sentenceFeedbacks[2]?.direction === 'up' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                        上次所选
                      </span>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              )}
              {currentLevel !== 'A1-' && (
                <button
                  onClick={() => advanceToSentence(3, '🔴 有点吃力，第 4 句微调更基础', 'down')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    sentenceFeedbacks[2]?.direction === 'down'
                      ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                      : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔴 有点吃力，微调更基础一点</span>
                    {sentenceFeedbacks[2]?.direction === 'down' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                        上次所选
                      </span>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Rating for Sentence 4 -> Concludes Reading Level */}
        {step === 6 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1 text-xs text-stone-500 mb-0.5">
              <span className="font-mono text-amber-700 flex items-center gap-1.5 font-semibold text-[13px]">
                <BookOpen size={13} />
                第 4/4 句
              </span>
              <button
                type="button"
                onClick={handlePrevSentence}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11.5px] font-medium text-stone-600 hover:text-amber-800 bg-[#FFFFFF] hover:bg-amber-50/80 border border-[#E4DAC5] hover:border-amber-300 transition-all cursor-pointer active:scale-95 shadow-2xs group"
                title="返回上一句重新选择"
              >
                <RotateCcw size={11.5} className="text-stone-400 group-hover:text-amber-600 transition-transform group-hover:-rotate-45" />
                <span>上一句</span>
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => completeEvaluation(`🟢 完美契合！就锁定为【${LEVEL_METAS[currentLevel].levelLabel}】`, 'keep')}
                className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                  sentenceFeedbacks[3]?.direction === 'keep'
                    ? 'bg-emerald-100/90 border-emerald-400 text-emerald-900'
                    : 'bg-emerald-50 hover:bg-emerald-100/80 border-emerald-300 text-emerald-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>🟢 完美契合！锁定【{LEVEL_METAS[currentLevel].levelLabel}】</span>
                  {sentenceFeedbacks[3]?.direction === 'keep' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-200 text-emerald-900 font-medium font-sans">
                      上次所选
                    </span>
                  )}
                </div>
                <CheckCircle2 size={15} />
              </button>
              {currentLevel !== 'B2+' && (
                <button
                  onClick={() => completeEvaluation('🔵 感觉还能再挑战高一阶！', 'up')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    sentenceFeedbacks[3]?.direction === 'up'
                      ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                      : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔵 还能更强，加档一阶挑战</span>
                    {sentenceFeedbacks[3]?.direction === 'up' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                        上次所选
                      </span>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              )}
              {currentLevel !== 'A1-' && (
                <button
                  onClick={() => completeEvaluation('🔴 整体有点难，稳妥降一阶起步', 'down')}
                  className={`w-full py-2.5 px-3.5 rounded-xl border text-[14px] sm:text-[14.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer shadow-xs ${
                    sentenceFeedbacks[3]?.direction === 'down'
                      ? 'bg-amber-50/70 border-amber-400 text-stone-900'
                      : 'bg-[#FFFFFF] hover:bg-[#F9F5EC] border-[#E8DFC8] text-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🔴 稳妥起步，降一阶更轻松</span>
                    {sentenceFeedbacks[3]?.direction === 'down' && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 font-medium font-sans">
                        上次所选
                      </span>
                    )}
                  </div>
                  <ChevronRight size={15} className="text-stone-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: Level Locked & Direct Navigation to Stage 8 */}
        {step === 7 && !isAiTyping && (
          <div className="pl-9 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => onComplete(selectedTags, currentLevel, surveyAnswers)}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer hover:brightness-105"
              style={{
                backgroundColor: companion.accentColor || '#D97706',
                boxShadow: `0 6px 20px rgba(180, 100, 20, 0.25)`
              }}
            >
              <span>开启专属定制</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Bottom Conversation Input Bar */}
      <div className="shrink-0 p-2.5 sm:p-3 bg-[#FAF6ED] border-t border-[#E8DFC8] z-30">
        <div className="flex items-center gap-2 max-w-full">
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isAiTyping || isBusy}
              placeholder={
                isAiTyping || isBusy
                  ? '伴读互动中...'
                  : step === 1
                  ? '特斯拉、人工智能、中国文化'
                  : step === 11
                  ? '输入你的目标，或点击上方选项...'
                  : step === 12
                  ? '输入你的阅读痛点，或点击上方选项...'
                  : step === 13
                  ? '输入你期望的时长，或点击上方选项...'
                  : step === 14
                  ? '输入你期望的陪伴方式，或点击上方选项...'
                  : step >= 3 && step <= 6
                  ? `输入第 ${Math.max(1, Math.min(4, step - 2))}/4 句阅读感受，如：刚刚好、有点难、太简单...`
                  : '输入消息与伴读互动...'
              }
              className="w-full py-2.5 pl-3.5 pr-3 rounded-xl bg-[#FFFFFF] border border-[#E2D8C6] text-[14px] sm:text-[14.5px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-amber-600 transition-all shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isAiTyping || isBusy}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs shrink-0 active:scale-95 hover:brightness-105"
            style={{
              backgroundColor: companion.accentColor || '#D97706'
            }}
            aria-label="发送消息"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
