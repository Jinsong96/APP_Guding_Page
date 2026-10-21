import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  Check,
  Sparkle,
  Sparkles
} from 'lucide-react';
import { Companion, GoalTrackDetails } from '../../types';
import { InterestThemePicker } from '../InterestThemePicker';

export type CefrLevelKey = 'A1-' | 'A2' | 'B1' | 'B2+';
export type GoalCategory = 'exam' | 'workplace' | 'original' | 'interest';

export interface SurveyAnswers {
  goal?: string;
  challenge?: string;
  duration?: string;
  readingState?: string;
  initialLevel?: CefrLevelKey;
  companionStyle?: string;
  goalTrack?: GoalTrackDetails;
}

export interface SurveyOptionItem {
  label: string;
  category?: GoalCategory;
  isRecommended?: boolean;
  aiReasoning: string; // Dynamic AI insight expressed when selected
}

export interface SurveyQuestionDef {
  step: number; // 11: Q1, 12: Q2 (focus), 15: Q3 (hurdle), 13: Q4 (duration), 14: Q5 (reading state / starting level)
  number: number;
  total: number;
  stageName: string;
  title: string;
  defaultPrompt: string;
  options: SurveyOptionItem[];
}

export const getSurveyQuestions = (companionName: string, goalCat: GoalCategory = 'exam'): SurveyQuestionDef[] => [
  {
    step: 11,
    number: 1,
    total: 5,
    stageName: '核心目标',
    title: '平时读英语，你最想达成什么目标？',
    defaultPrompt: `嗨！告诉我你的主要阅读方向，${companionName}将据此调配全套篇目与梯度～`,
    options: [
      {
        label: '备考升学',
        category: 'exam',
        aiReasoning: '锁定靶向备考：精准匹配真题考点与核心长难句语料，助你高效突破！'
      },
      {
        label: '职场应用',
        category: 'workplace',
        aiReasoning: '强化实战应用：精炼外贸出海、商务邮件与深度外刊等实战语料！'
      },
      {
        label: '国际视野',
        category: 'original',
        aiReasoning: '拓展原版视野：精选全球热点、跨文化透视与地道原汁原味篇目！'
      },
      {
        label: '兴趣爱好',
        category: 'interest',
        aiReasoning: '轻松无痛输入：零压力微阅读，在故事与百科中自然吸纳地道语感！'
      }
    ]
  },
  {
    step: 12,
    number: 2,
    total: 5,
    stageName: '场景定位',
    title:
      goalCat === 'exam'
        ? '你在准备哪个考试？'
        : goalCat === 'workplace'
        ? '工作里，你主要用英语做什么？'
        : goalCat === 'original'
        ? '读完一篇文章，你最希望收获的是？'
        : '你更喜欢哪种读法？',
    defaultPrompt: '精准锁定具体场景，匹配专属词库与篇目语料～',
    options:
      goalCat === 'exam'
        ? [
            {
              label: 'KET/PET',
              aiReasoning: '通用能力打底：夯实原版阅读基础，稳步建立英语综合自信！'
            },
            {
              label: '中考',
              aiReasoning: '初中考纲攻坚：锁定中考核心高频词，轻松拿捏阅读与完形填空！'
            },
            {
              label: '高考',
              aiReasoning: '高考长难句拔高：训练七选五主干抓取与长篇速读提分技巧！'
            },
            {
              label: '四六级',
              aiReasoning: '大学四六级冲刺：突击考纲高频核心词汇与段落主旨快速定位！'
            },
            {
              label: '考研',
              aiReasoning: '考研学术长难句攻关：深度剖析学术论证逻辑框架与解题切入点！'
            },
            {
              label: '雅思或托福',
              aiReasoning: '学术原版快速跃迁：专项强化学术论证逻辑与学术高阶词汇！'
            }
          ]
        : goalCat === 'workplace'
        ? [
            {
              label: '外贸与跨境电商',
              aiReasoning: '出海实战聚焦：精读爆款 Listing、海外买家询盘与精准商业磋商！'
            },
            {
              label: '邮件与日常沟通',
              aiReasoning: '日常高效协同：掌握本土原生用词，告别中式生硬翻译腔！'
            },
            {
              label: '会议与商务谈判',
              aiReasoning: '商务沟通实战：商业条款磋商、英文会议表达与跨国项目推进！'
            },
            {
              label: '行业资讯与报告',
              aiReasoning: '前沿资讯敏锐度：快速扫读研报核心数据与全球行业动态！'
            }
          ]
        : goalCat === 'original'
        ? [
            {
              label: '弄懂来龙去脉',
              aiReasoning: '全景通透掌握：梳理事件完整时间轴与核心逻辑脉络！'
            },
            {
              label: '积累地道表达',
              aiReasoning: '原生好词好句：随文点拨本土固定搭配与高阶修辞金句！'
            },
            {
              label: '了解文化观点',
              aiReasoning: '跨文化视角透视：随文拓展欧美文化典故与多元思维碰撞！'
            },
            {
              label: '读懂复杂长句',
              aiReasoning: '长难句拆解通关：多层嵌套从句也能像积木一样清晰直观！'
            }
          ]
        : [
            {
              label: '一篇读透，弄懂每句话',
              aiReasoning: '精读深耕模式：逐句拆解核心词与句法细节，每一句都读通读透！'
            },
            {
              label: '多读几篇，懂个大概就好',
              aiReasoning: '泛读心流模式：顺畅抓取大意与剧情起伏，享受无压力轻松阅读！'
            }
          ]
  },
  {
    step: 15,
    number: 3,
    total: 5,
    stageName: '核心卡点',
    title: '读英文时，最让你头疼的是？',
    defaultPrompt: `${companionName}会在后续阅读中专门标注破解支架与攻坚技巧～`,
    options:
      goalCat === 'exam'
        ? [
            {
              label: '长难句看不懂',
              aiReasoning: '激活句法支架：后续长难句将提供分层染色与逻辑主干拆解！'
            },
            {
              label: '核心词记不住',
              aiReasoning: '语境记忆加持：高频考点词随文高亮解析，彻底告别死记硬背！'
            },
            {
              label: '阅读速度太慢',
              aiReasoning: '意群速读训练：引导视线快速定位主谓宾，大幅提升做题效率！'
            },
            {
              label: '抓不住文章主旨',
              aiReasoning: '段落脉络导引：重点点拨段落首尾论点与转折过渡词！'
            }
          ]
        : goalCat === 'workplace'
        ? [
            {
              label: '表达不够地道',
              aiReasoning: '地道表达置换：自动标注本土原生用词，职场表达更自信！'
            },
            {
              label: '专业术语看不懂',
              aiReasoning: '行业黑话精析：专业术语与行业缩写即点即查、智能速记！'
            },
            {
              label: '长文抓不住重点',
              aiReasoning: '关键信息抓取：以数据和核心结论为锚点，迅速抓住决策重点！'
            },
            {
              label: '读得慢效率低',
              aiReasoning: '结构化速读法：先看结论后看论据，成倍提升文献阅读速度！'
            }
          ]
        : goalCat === 'original'
        ? [
            {
              label: '生词打断节奏',
              aiReasoning: '智能释义浮窗：轻量提示高亮，无需跳出查词打断阅读心流！'
            },
            {
              label: '长句容易绕晕',
              aiReasoning: '多层从句拆解：抽丝剥茧还原主干，长句子也能一眼看懂！'
            },
            {
              label: '背景文化看不懂',
              aiReasoning: '背景百科卡片：随文补充西方历史文化、政治与社会背景！'
            },
            {
              label: '长篇阅读容易疲劳',
              aiReasoning: '意群微步推进：舒适分段阅读，长文读起来轻盈不费力！'
            }
          ]
        : [
            {
              label: '很难坚持下去',
              aiReasoning: '微习惯正向反馈：每天几分钟无痛打卡，让进步清晰可见！'
            },
            {
              label: '文章内容太难',
              aiReasoning: '智能难度降阶：随时根据你的状态自动调配最友善的版本！'
            },
            {
              label: '感觉不到进步',
              aiReasoning: '多维成长勋章：即时记录新学词汇与阅读里程碑，满满成就感！'
            },
            {
              label: '找不到想读的',
              aiReasoning: '兴趣星系推送：紧密围绕你的专属星盘，精准推荐心仪佳作！'
            }
          ]
  },
  {
    step: 13,
    number: 4,
    total: 5,
    stageName: '专注节奏',
    title: '每天留一段专注阅读时间，你更习惯哪种时长？',
    defaultPrompt: '选择最契合当前生活节奏的打卡时长，可持续才是硬道理～',
    options: [
      {
        label: '3-5 分钟',
        aiReasoning: '碎片化微阅读：零负担打卡，排队通勤随时读完 1 篇精巧短文。'
      },
      {
        label: '5-20 分钟',
        isRecommended: true,
        aiReasoning: '黄金阅读时长：精读 1-2 篇完整短文，深度与轻松感兼顾。'
      },
      {
        label: '20 分钟以上',
        aiReasoning: '深度心流沉浸：适合长篇探究与全景输入，快速积累大体量语料。'
      }
    ]
  },
  {
    step: 14,
    number: 5,
    total: 5,
    stageName: '当前状态',
    title: '读英文文章时，你一般是什么状态？',
    defaultPrompt: '选出你的真实状态，我们将据此为你锁定最适宜的起步试读！',
    options: [
      {
        label: '只能看懂简单的句子',
        aiReasoning: '从基础短句起步：词汇高频、句式简短，零压力开启第一步！'
      },
      {
        label: '能读懂短文，但要查不少词',
        aiReasoning: '稳固日常语感：涵盖实用复合句与生活叙事，查词更智能省心！'
      },
      {
        label: '大部分能读懂，偶尔卡住',
        aiReasoning: '进阶地道流畅：适应丰富从句与主流资讯，快速突破阅读瓶颈！'
      },
      {
        label: '读外刊、原版书比较轻松',
        aiReasoning: '原生深度阅读：品读细腻修辞与复杂论证，享受母语级阅读快感！'
      }
    ]
  }
];

export const LEVEL_METAS: Record<
  CefrLevelKey,
  { levelLabel: string; code: string; color: string; tagline: string; description: string }
> = {
  'A1-': {
    levelLabel: 'A1- 入门启蒙',
    code: 'L1',
    color: '#38BDF8',
    tagline: '短句高频词，零负担轻松读',
    description: '核心词汇 800 以内，以基础日常会话与简短叙事短句为主，帮助你轻松找回英语语感。'
  },
  'A2': {
    levelLabel: 'A2 基础衔接',
    code: 'L4',
    color: '#34D399',
    tagline: '生活语境叙事，自然建立语感',
    description: '词汇量约 1500-2000，涵盖常见复合句与生活叙事，能在熟悉的题材中流畅获取核心信息。'
  },
  'B1': {
    levelLabel: 'B1 地道流畅',
    code: 'L7',
    color: '#BDE65C',
    tagline: '复合从句与地道短语，畅读原版',
    description: '词汇量约 3500-4500，适应复合从句、地道成语与时事科普，可从容阅读国外主流媒体原版短文。'
  },
  'B2+': {
    levelLabel: 'B2+ 原汁原味',
    code: 'L10',
    color: '#F472B6',
    tagline: '原生文笔与细腻修辞，深度探究',
    description: '词汇量 6000 以上，面对复杂论证、学术专论与原生文笔游刃有余，享受母语级沉浸体验。'
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

interface Stage02AiChatProps {
  companion: Companion;
  onBack: () => void;
  onComplete: (selectedInterests: string[], determinedLevel: CefrLevelKey, surveyAnswers?: SurveyAnswers) => void;
  onSkip: () => void;
}

export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  onBack,
  onComplete,
  onSkip: _onSkip
}) => {
  // Navigation Steps:
  // 1: Interest theme selection
  // 11: Q1 核心目标
  // 12: Q2 场景定位
  // 15: Q3 核心卡点
  // 13: Q4 专注节奏
  // 14: Q5 当前状态（语感自评 ➔ 决定试读起步等级）
  // 3-6: Four sentence-reading assessment questions
  const [step, setStep] = useState<number>(1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTopics, setCustomTopics] = useState<string[]>([]);
  const [priorityTopics, setPriorityTopics] = useState<string[]>([]);

  const [currentLevel, setCurrentLevel] = useState<CefrLevelKey>('A2');
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('exam');

  // Currently selected option in the active screen (before clicking Continue)
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(null);
  const [selectedOptionItem, setSelectedOptionItem] = useState<SurveyOptionItem | null>(null);

  // Companion Dynamic Speech State
  const [companionBubbleText, setCompanionBubbleText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [revealedQuestionStep, setRevealedQuestionStep] = useState<number | null>(null);

  // Reading assessment state
  const [_sentenceFeedbacks, setSentenceFeedbacks] = useState<
    Record<number, { text: string; direction: 'up' | 'down' | 'keep' }>
  >({});
  const [selectedFeeling, setSelectedFeeling] = useState<'down' | 'keep' | 'up' | null>(null);
  const [sentenceLevelHistory, setSentenceLevelHistory] = useState<Record<number, CefrLevelKey>>({ 0: 'A2' });
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);


  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic typewriter for companion speech bubble
  const triggerBubbleSpeech = (text: string) => {
    setRevealedQuestionStep(null);
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCompanionBubbleText(text);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const characters = Array.from(text);
    let idx = 0;
    setCompanionBubbleText('');

    typewriterTimerRef.current = setInterval(() => {
      idx += 1;
      setCompanionBubbleText(characters.slice(0, idx).join(''));
      if (idx >= characters.length) {
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
        setIsTyping(false);
      }
    }, 28);
  };

  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync companion bubble text when step changes
  useLayoutEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setSelectedOptionLabel(null);
    setSelectedOptionItem(null);
    setSelectedFeeling(null);

    const questions = getSurveyQuestions(companion.name, goalCategory);
    const q = questions.find((item) => item.step === step);
    if (step === 1) {
      triggerBubbleSpeech('选择你感兴趣的主题');
    } else if (q) {
      triggerBubbleSpeech(q.title);
    } else if (step >= 3 && step <= 6) {
      const sIdx = step - 3;
      const initialMsgs = [
        `这是第 1/4 句，品读生词与长句节奏，选出你的真实感受：`,
        `表现不错！来看第 2/4 句，体会一下句意理解是否顺畅？`,
        `渐入佳境！来看第 3/4 句，体会一下从句与语感契合度：`,
        `最后第 4 句收尾！读完这句，我们就能锁定你的专属起步等级。`
      ];
      triggerBubbleSpeech(initialMsgs[sIdx] || '仔细品读这句英文，选出你的真实感受：');
    }
  }, [step, goalCategory, companion.name]);

  // Audio Playback
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

  // Tag selection helper for Astrolabe
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 10) return prev;
      return [...prev, tag];
    });
  };

  const handleApplyCustomTopics = (topics: string[], newlyCreated: string[]) => {
    setCustomTopics((prev) => [...new Set([...newlyCreated, ...prev])]);
    setPriorityTopics((prev) => [...new Set([...topics, ...prev])]);
    setSelectedTags((prev) => {
      const next = [...prev];
      topics.forEach((topic) => {
        if (!next.includes(topic) && next.length < 10) next.push(topic);
      });
      return next;
    });
  };

  // Confirm selected themes and proceed directly to the reading-habits questions.
  const handleConfirmAstrolabe = (tags: string[]) => {
    setSelectedTags(tags);
    setStep(11);
  };

  // Auto Commit Helper for Survey Options
  const commitOptionAndAdvance = (opt: SurveyOptionItem, currentStep: number) => {
    if (currentStep === 11) {
      const detectedCategory: GoalCategory =
        opt.category ||
        (opt.label.includes('升学') || opt.label.includes('备考')
          ? 'exam'
          : opt.label.includes('职场')
          ? 'workplace'
          : opt.label.includes('国际') || opt.label.includes('视野')
          ? 'original'
          : 'interest');

      setGoalCategory(detectedCategory);
      setSurveyAnswers((prev) => ({
        ...prev,
        goal: opt.label,
        goalTrack: {
          category: detectedCategory,
          categoryLabel: opt.label,
          targetFocus: '',
          targetHurdle: ''
        }
      }));
      setStep(12);
      return;
    }

    if (currentStep === 12) {
      setSurveyAnswers((prev) => ({
        ...prev,
        goalTrack: {
          category: prev.goalTrack?.category || goalCategory,
          categoryLabel: prev.goalTrack?.categoryLabel || prev.goal || '目标冲刺',
          targetFocus: opt.label,
          targetHurdle: prev.goalTrack?.targetHurdle || ''
        }
      }));
      setStep(15);
      return;
    }

    if (currentStep === 15) {
      setSurveyAnswers((prev) => ({
        ...prev,
        challenge: opt.label,
        goalTrack: {
          category: prev.goalTrack?.category || goalCategory,
          categoryLabel: prev.goalTrack?.categoryLabel || prev.goal || '目标冲刺',
          targetFocus: prev.goalTrack?.targetFocus || '核心专项',
          targetHurdle: opt.label
        }
      }));
      setStep(13);
      return;
    }

    if (currentStep === 13) {
      const defaultCompanionStyle = companion.type || '智能点拨';
      setSurveyAnswers((prev) => ({
        ...prev,
        duration: opt.label,
        companionStyle: defaultCompanionStyle
      }));
      setStep(14); // Proceed to Q5 Reading State
      return;
    }

    if (currentStep === 14) {
      // Q5 Reading State maps directly to initial placement testing level:
      // 只能看懂简单的句子 ➔ A1-
      // 能读懂短文，但要查不少词 ➔ A2
      // 大部分能读懂，偶尔卡住 ➔ B1
      // 读外刊、原版书比较轻松 ➔ B2+
      const levelMap: Record<string, CefrLevelKey> = {
        '只能看懂简单的句子': 'A1-',
        '能读懂短文，但要查不少词': 'A2',
        '大部分能读懂，偶尔卡住': 'B1',
        '读外刊、原版书比较轻松': 'B2+'
      };
      const determinedStartLevel: CefrLevelKey = levelMap[opt.label] || 'A2';

      setSurveyAnswers((prev) => ({
        ...prev,
        readingState: opt.label,
        initialLevel: determinedStartLevel
      }));
      setCurrentLevel(determinedStartLevel);
      setSentenceLevelHistory({ 0: determinedStartLevel });
      setSentenceFeedbacks({});
      setStep(3);
      return;
    }
  };

  // Option Click in Survey Questions: Instant AI dynamic reasoning (user confirms with Continue button)
  const handleSelectOption = (opt: SurveyOptionItem) => {
    setSelectedOptionLabel(opt.label);
    setSelectedOptionItem(opt);

    // Cancel any previous timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  // Auto Commit Helper for Sentence Feelings
  const commitFeelingAndAdvance = (feeling: 'down' | 'keep' | 'up', currentStep: number) => {
    if (currentStep >= 3 && currentStep <= 5) {
      const sIdx = currentStep - 3; // 0, 1, 2
      const feedbackMap = {
        down: '偏难吃力，调至轻量版本',
        keep: '顺畅适中，节奏契合心流',
        up: '轻松有余，挑战更高阶篇目'
      };
      setSentenceFeedbacks((prev) => ({
        ...prev,
        [sIdx]: { text: feedbackMap[feeling], direction: feeling }
      }));

      const nextLvl = getNextLevel(currentLevel, feeling);
      setSentenceLevelHistory((prev) => ({
        ...prev,
        [sIdx + 1]: nextLvl
      }));
      setCurrentLevel(nextLvl);
      setStep(currentStep + 1);
      return;
    }

    if (currentStep === 6) {
      setSentenceFeedbacks((prev) => ({
        ...prev,
        3: { text: feeling, direction: feeling }
      }));
      const finalLvl = getNextLevel(currentLevel, feeling);
      setCurrentLevel(finalLvl);
      onComplete(selectedTags, finalLvl, surveyAnswers);
      return;
    }
  };

  // Record the selected difficulty, then advance after a short confirmation pause.
  const handleSelectFeeling = (feeling: 'down' | 'keep' | 'up') => {
    setSelectedFeeling(feeling);
    if (feeling === 'down') {
      triggerBubbleSpeech(`收到！这句难度略高，为你调配更轻盈的基础句式，保证流畅理解。`);
    } else if (feeling === 'keep') {
      triggerBubbleSpeech(`刚刚好！你的语感节奏非常平稳，继续保持这个舒适心流。`);
    } else {
      triggerBubbleSpeech(`游刃有余！感觉很轻松，为你提升句式丰富度与地道挑战。`);
    }

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
    }
    autoAdvanceTimerRef.current = setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      commitFeelingAndAdvance(feeling, step);
    }, 2000);
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

  // Continue Button Click Action
  const handleContinue = () => {
    // Clear any running timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    // 1. From Q1 (Step 11) -> Q2 (Step 12)
    if (step === 11 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 11);
      return;
    }

    // 2. From Q2 (Step 12) -> Q3 (Step 15)
    if (step === 12 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 12);
      return;
    }

    // 3. From Q3 (Step 15) -> Q4 (Step 13)
    if (step === 15 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 15);
      return;
    }

    // 4. From Q4 (Step 13) -> Q5 (Step 14)
    if (step === 13 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 13);
      return;
    }

    // 5. From Q5 (Step 14) -> Sentence 1 (Step 3)
    if (step === 14 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 14);
      return;
    }

    // 6. From Sentences 1, 2, 3 -> Next Sentence
    if (step >= 3 && step <= 5 && selectedFeeling) {
      commitFeelingAndAdvance(selectedFeeling, step);
      return;
    }

    // 7. From Sentence 4 (Step 6) -> Complete onboarding
    if (step === 6 && selectedFeeling) {
      commitFeelingAndAdvance(selectedFeeling, 6);
      return;
    }
  };

  // Back Navigation
  const handlePrevStep = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (step === 1) {
      onBack();
      return;
    }
    if (step === 11) {
      setStep(1);
      return;
    }
    if (step === 12) {
      setStep(11);
      return;
    }
    if (step === 15) {
      setStep(12);
      return;
    }
    if (step === 13) {
      setStep(15);
      return;
    }
    if (step === 14) {
      setStep(13); // Back to Q4
      return;
    }
    if (step === 3) {
      setStep(14);
      return;
    }
    if (step === 4) {
      const prevLvl = sentenceLevelHistory[0] || 'A2';
      setCurrentLevel(prevLvl);
      setStep(3);
      return;
    }
    if (step === 5) {
      const prevLvl = sentenceLevelHistory[1] || 'A2';
      setCurrentLevel(prevLvl);
      setStep(4);
      return;
    }
    if (step === 6) {
      const prevLvl = sentenceLevelHistory[2] || 'A2';
      setCurrentLevel(prevLvl);
      setStep(5);
      return;
    }
  };

  // Questions dataset
  const surveyQuestions = getSurveyQuestions(companion.name, goalCategory);
  const currentQ = surveyQuestions.find((q) => q.step === step);
  useEffect(() => {
    if (!currentQ || isTyping || companionBubbleText !== currentQ.title) return;

    const timeout = window.setTimeout(() => setRevealedQuestionStep(currentQ.step), 320);
    return () => window.clearTimeout(timeout);
  }, [currentQ?.step, currentQ?.title, isTyping, companionBubbleText]);

  const surveyContentReady = Boolean(
    currentQ &&
      !isTyping &&
      companionBubbleText === currentQ.title &&
      revealedQuestionStep === currentQ.step
  );
  const sentenceIdx = step >= 3 && step <= 6 ? step - 3 : -1;

  const progressStep =
    step === 1 ? 1 :
    currentQ ? currentQ.number + 1 :
    sentenceIdx !== -1 ? sentenceIdx + 7 :
    10;
  const progressPercentage = progressStep * 10;
  const isHabitSurvey = Boolean(currentQ);

  return (
    <div className={`w-full h-full flex flex-col ${sentenceIdx !== -1 ? 'bg-[#F1FAF6] text-[#103E39]' : isHabitSurvey ? 'bg-[#FAFBFA] text-[#252D32]' : 'bg-[#F0F8F4] text-stone-900'} select-none overflow-hidden relative font-sans`}>
      <div className={`z-30 mx-auto flex h-14 w-full max-w-xl shrink-0 items-center gap-3 border-b px-3 sm:px-5 ${
        isHabitSurvey
          ? 'border-[#E0E7E3] bg-[#FAFBFA]'
          : 'border-[#DCE7E0] bg-[#F0F8F4]'
      }`}>
        <button
          onClick={handlePrevStep}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#64766B] transition-colors hover:bg-white/80 hover:text-[#29362F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] active:scale-95"
          aria-label="返回上一页"
        >
          <ArrowLeft size={20} className="stroke-[2.2]" />
        </button>
        <div
          className="flex flex-1 items-center gap-1.5"
          role="progressbar"
          aria-label="引导进度"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercentage}
          aria-valuetext={`第 ${progressStep} 步，共 10 步`}
        >
          {Array.from({ length: 7 }, (_, index) => {
            const segmentSize = 100 / 7;
            const fill = Math.max(0, Math.min(100, ((progressPercentage - index * segmentSize) / segmentSize) * 100));
            return (
              <span key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#D9E5DD]">
                <span
                  className="block h-full rounded-full bg-[#526F65] transition-[width] duration-300 ease-out"
                  style={{ width: `${fill}%` }}
                />
              </span>
            );
          })}
        </div>
      </div>

      {/* ================= MAIN CONTENT CANVAS ================= */}
      <div className={`flex-1 no-scrollbar flex w-full max-w-xl mx-auto ${step === 1 ? 'min-h-0 overflow-hidden p-0' : 'overflow-y-auto flex-col items-center justify-between p-4 sm:p-5'}`}>
        {/* ================= SCREEN 0: ENTRY WELCOME ANIMATION (参考用户视频) ================= */}
        {false && step === 0 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Duolingo Speech Bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#DCEBE5] p-5 shadow-sm mb-6 inline-block text-left animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-[18px] font-bold tracking-tight leading-snug animate-title-gradient">
                  {companionBubbleText}
                  {isTyping && <span className="inline-block w-1.5 h-3.5 bg-emerald-600 ml-1 animate-pulse" />}
                </p>
                {/* Speech Bubble Arrow Notch pointing downward */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[14px] border-t-[#DCEBE5] -z-10" />
              </div>

              {/* Mascot Center Glow Avatar with celebratory wave */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />
                {/* Floating Soft Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute -top-1 -right-2 text-emerald-500 animate-sparkle-soft-1">
                    <Sparkles size={18} />
                  </span>
                  <span className="absolute top-1/2 -left-3 text-emerald-400 animate-sparkle-soft-2">
                    <Sparkle size={14} className="fill-emerald-400" />
                  </span>
                  <span className="absolute -bottom-1 right-2 text-emerald-500 animate-sparkle-soft-1">
                    <Sparkles size={16} />
                  </span>
                </div>
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain relative z-10 animate-celebrate-action drop-shadow-md select-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 1: INTEREST THEME PICKER ================= */}
        {step === 1 && (
          <InterestThemePicker
            companion={companion}
            bubbleText={companionBubbleText}
            bubbleIsTyping={isTyping}
            selectedTags={selectedTags}
            customTopics={customTopics}
            priorityTopics={priorityTopics}
            onToggleTag={handleToggleTag}
            onApplyCustomTopics={handleApplyCustomTopics}
            onConfirm={handleConfirmAstrolabe}
          />
        )}

        {/* ================= SCREENS 3..7: SURVEY QUESTIONS (Duolingo Vertical Stack Cards, Zero Truncation) ================= */}
        {currentQ && (
        <div className="w-full flex-1 flex flex-col justify-start animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Duolingo Companion Speech Header (Mascot left + Speech bubble right) */}
            <div className="flex items-center gap-3 mb-3 w-full">
              <img
                src={companion.avatarUrl}
                alt={companion.name}
                className="h-[48px] w-[48px] shrink-0 object-contain"
              />

              {/* Pointing Speech Bubble with Notch */}
              <div className="relative flex-1 rounded-[14px] border border-[#D8E2DD] bg-white px-4 py-3.5">
                <div className="absolute top-5 -left-2 w-0 h-0 border-y-[7px] border-y-transparent border-r-[9px] border-r-white z-10" />
                <div className="absolute top-[19px] -left-[10px] w-0 h-0 border-y-[8px] border-y-transparent border-r-[10px] border-r-[#D8E2DD]" />

                <div
                  aria-label={currentQ.title}
                  className="text-[16px] font-semibold text-[#252D32] leading-snug"
                >
                  {companionBubbleText}
                  {isTyping && (
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-emerald-600 motion-reduce:animate-none"
                    />
                  )}
                </div>
              </div>
            </div>

            {surveyContentReady && (
              <div className="speech-content-enter">
                <p className="min-h-6 mb-2 text-[13px] leading-5 text-[#7B8984]">
                  选一个最接近的就好，之后也可以调整
                </p>

                {/* Quiet single-choice rows keep the question and all options easy to scan. */}
                <div className="w-full" role="radiogroup" aria-label={currentQ.title}>
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOptionLabel === opt.label;

                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        role="radio"
                        aria-checked={isSelected}
                        className={`group w-full min-h-[68px] px-1 text-left transition-colors duration-150 cursor-pointer flex items-center justify-between border-b border-[#E1E8E4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#176B57] ${
                          isSelected ? 'text-[#173D34]' : 'text-[#252D32] hover:bg-white/60'
                        }`}
                      >
                        <div className="flex items-center gap-4 min-w-0 pr-3 flex-1">
                          <span className="w-6 text-[12px] font-semibold tabular-nums text-[#9AA7A1] shrink-0">
                            0{idx + 1}
                          </span>
                          <span
                            className={`text-[15px] font-semibold leading-snug break-words transition-colors ${
                              isSelected ? 'text-[#173D34]' : 'text-[#252D32] group-hover:text-[#176B57]'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </div>

                        <span
                          className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[6px] border-[#08735D] bg-white'
                              : 'border-[1.5px] border-[#C9D5CF] bg-transparent group-hover:border-[#7A9A8D]'
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-7 w-full pb-4">
                  <button
                    type="button"
                    onClick={handleContinue}
                    disabled={!selectedOptionItem}
                    className={`w-full h-14 rounded-[9px] font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors duration-150 ${
                      selectedOptionItem
                        ? 'bg-[#08735D] text-white cursor-pointer hover:bg-[#06634F] active:bg-[#055642] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#08735D] focus-visible:ring-offset-2'
                        : 'bg-[#E3EBE7] text-[#96A49E] cursor-not-allowed'
                    }`}
                  >
                    <span>继续</span>
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= SCREENS 8..11: 4-SENTENCE PLACEMENT TEST (选项整体上移，去除中空缝隙) ================= */}
        {sentenceIdx !== -1 && (
          <div className="w-full flex-1 flex flex-col justify-start gap-2.5 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative w-full min-h-[190px] max-h-[245px] flex-1">
              <div
                aria-hidden="true"
                className="absolute top-5 right-0 bottom-5 w-7 rounded-r-[26px] bg-[#E6F4ED] border border-[#D2E9DD]"
              />
              <article className="absolute inset-y-0 left-0 right-3 rounded-[28px] bg-white border border-[#E5F0EB] shadow-[0_9px_0_#BCE8D8,0_16px_24px_rgba(17,72,61,0.08)] overflow-hidden">
                <div className="absolute inset-0 overflow-y-auto px-5 py-5">
                  <p className="pr-2 pb-[76px] text-[21px] leading-[1.5] font-medium text-[#103E39] selection:bg-emerald-200">
                    {SENTENCES_BY_LEVEL[currentLevel][sentenceIdx]}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handlePlayAudio(SENTENCES_BY_LEVEL[currentLevel][sentenceIdx], sentenceIdx)}
                  className="absolute bottom-3 left-4 z-20 w-10 h-10 rounded-full bg-[#F1FAF6] border border-[#DCEDE5] flex items-center justify-center text-[#315A50] shadow-sm transition-colors hover:bg-[#EAF5EF]"
                  title="播放发音"
                  aria-label="播放发音"
                >
                  <Volume2
                    size={18}
                    className={playingSentenceIdx === sentenceIdx ? 'text-emerald-700 animate-pulse' : 'text-[#315A50]'}
                  />
                </button>
                <img
                  src={companion.avatarUrl}
                  alt={`${companion.name}陪你试读`}
                  className="absolute right-0 bottom-0 z-10 w-[82px] h-[98px] object-contain pointer-events-none"
                />
              </article>
            </div>

            <div
              className="min-h-[48px] shrink-0 flex items-center gap-2 px-1 text-[13px] font-medium leading-snug text-[#315A50]"
              role="status"
              aria-live="polite"
            >
              <Sparkles size={16} className="shrink-0 text-emerald-700" />
              <span>
                {companionBubbleText}
                {isTyping && <span className="inline-block w-1.5 h-3 bg-emerald-600 ml-1 animate-pulse" />}
              </span>
            </div>

            <div className="w-full shrink-0">
              <div className="flex flex-col gap-2 w-full">
                {([
                  ['keep', '顺畅适中', '契合心流'],
                  ['down', '偏难吃力', '降阶调轻'],
                  ['up', '轻松有余', '加档拔高']
                ] as const).map(([feeling, label, hint]) => {
                  const isSelected = selectedFeeling === feeling;
                  return (
                    <button
                      key={feeling}
                      type="button"
                      onClick={() => handleSelectFeeling(feeling)}
                      aria-pressed={isSelected}
                      className={`group relative w-full min-h-[50px] rounded-2xl px-4 py-2.5 text-left transition-all duration-150 cursor-pointer flex items-center justify-between border-2 active:scale-[0.99] ${
                        isSelected
                          ? 'border-emerald-500 bg-[#F8FCFA] shadow-[0_3px_0_#65A30D] ring-2 ring-emerald-400/20 translate-y-0.5'
                          : 'border-[#DCEDE5] bg-white hover:border-emerald-400 hover:bg-[#F8FCFA] shadow-[0_3px_0_#DCEBE5] hover:shadow-[0_1px_0_#DCEBE5] hover:translate-y-0.5 active:translate-y-1 active:shadow-none'
                      }`}
                    >
                      <span className={`text-[14px] font-bold ${isSelected ? 'text-[#103E39]' : 'text-[#24483F]'}`}>
                        {label}
                      </span>
                      <span className="flex items-center gap-2">
                        <span className={`text-xs ${isSelected ? 'font-semibold text-emerald-800' : 'text-[#84958E]'}`}>
                          {isSelected ? '已选择' : hint}
                        </span>
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'border border-[#DCEDE5] bg-[#F1FAF6] text-transparent'
                          }`}
                        >
                          <Check size={12} className="stroke-[3]" />
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
