import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Languages,
  MoreHorizontal,
  RotateCcw,
  Volume2,
  Sparkle,
  Sparkles
} from 'lucide-react';
import { BookmarkedSentence, Companion, GoalTrackDetails } from '../../types';
import { InterestThemePicker } from '../InterestThemePicker';
import { CompletionRipple } from '../CompletionRipple';
import { COMPANION_TYPING_INTERVAL_MS, SPEECH_CONTENT_REVEAL_MS } from '../speechTiming';

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
  step: number;
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
    total: 3,
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
    total: 3,
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
    step: 13,
    number: 3,
    total: 3,
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
  }
];

export const LEVEL_METAS: Record<
  CefrLevelKey,
  { levelLabel: string; code: string; color: string; tagline: string; description: string }
> = {
  'A1-': {
    levelLabel: 'A1- 入门启蒙',
    code: 'L1',
    color: '#9A8EBB',
    tagline: '短句高频词，零负担轻松读',
    description: '核心词汇 800 以内，以基础日常会话与简短叙事短句为主，帮助你轻松找回英语语感。'
  },
  'A2': {
    levelLabel: 'A2 基础衔接',
    code: 'L4',
    color: '#C83E26',
    tagline: '生活语境叙事，自然建立语感',
    description: '词汇量约 1500-2000，涵盖常见复合句与生活叙事，能在熟悉的题材中流畅获取核心信息。'
  },
  'B1': {
    levelLabel: 'B1 地道流畅',
    code: 'L7',
    color: '#B83825',
    tagline: '复合从句与地道短语，畅读原版',
    description: '词汇量约 3500-4500，适应复合从句、地道成语与时事科普，可从容阅读国外主流媒体原版短文。'
  },
  'B2+': {
    levelLabel: 'B2+ 原汁原味',
    code: 'L10',
    color: '#7F4568',
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

const SENTENCE_TRANSLATIONS = [
  '我们都记得最喜欢的泰迪熊。它曾给过我们安慰。',
  '长大后，我们通常会把泰迪熊收起来或送人。但并不是每个人都会这样。',
  '有调查显示，英国每十个人中，就有一个人睡觉时需要泰迪熊陪伴。',
  '有些成年人甚至会带着毛绒玩具到处走。'
];

const SENTENCE_INTERPRETATIONS = [
  '这里的 comfort 不只是“舒服”，更强调玩偶带来的安慰与安全感。',
  'But this is not true for everyone 用转折指出：并非所有人长大后都会告别童年玩偶。',
  'one in ten 表示“十分之一”，也就是每十个人中有一个。重点是这项调查呈现的陪伴需求。',
  'take their soft toys everywhere 描写的是持续的陪伴习惯，everywhere 突出了“无论去哪里”。'
];

interface Stage02AiChatProps {
  companion: Companion;
  onBack: () => void;
  onComplete: (selectedInterests: string[], determinedLevel: CefrLevelKey, surveyAnswers?: SurveyAnswers) => void;
  onSkip: () => void;
  bookmarkedSentences?: BookmarkedSentence[];
  onToggleSentenceBookmark?: (sentence: BookmarkedSentence) => void;
}

export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  onBack,
  onComplete,
  onSkip: _onSkip,
  bookmarkedSentences = [],
  onToggleSentenceBookmark
}) => {
  // Navigation Steps:
  // 1: Interest theme selection
  // 11: Q1 核心目标
  // 12: Q2 场景定位
  // 13: Q3 专注节奏
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
  const [revealedSentenceStep, setRevealedSentenceStep] = useState<number | null>(null);
  const [isConfirmingInterest, setIsConfirmingInterest] = useState(false);
  const [isCompletingHabits, setIsCompletingHabits] = useState(false);

  // Reading assessment state
  const [_sentenceFeedbacks, setSentenceFeedbacks] = useState<
    Record<number, { text: string; direction: 'up' | 'down' | 'keep' }>
  >({});
  const [selectedFeeling, setSelectedFeeling] = useState<'down' | 'keep' | 'up' | null>(null);
  const [sentenceLevelHistory, setSentenceLevelHistory] = useState<Record<number, CefrLevelKey>>({ 0: 'A2' });
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showSentenceMenu, setShowSentenceMenu] = useState(false);


  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimerRef = useRef<number | null>(null);

  // Dynamic typewriter for companion speech bubble
  const triggerBubbleSpeech = (text: string) => {
    setRevealedQuestionStep(null);
    setRevealedSentenceStep(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setPlayingSentenceIdx(null);
    }
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
    }, COMPANION_TYPING_INTERVAL_MS);
  };

  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
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
    setRevealedSentenceStep(null);
    setShowTranslation(false);
    setIsCardFlipped(false);
    setShowSentenceMenu(false);
    setPlayingSentenceIdx(null);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStep(11);
      return;
    }

    setIsConfirmingInterest(true);
    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = null;
      setIsConfirmingInterest(false);
      setStep(11);
    }, 640);
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
      setStep(13);
      return;
    }

    if (currentStep === 13) {
      if (isCompletingHabits) return;

      const defaultCompanionStyle = companion.type || '智能点拨';
      setSurveyAnswers((prev) => ({
        ...prev,
        duration: opt.label,
        companionStyle: defaultCompanionStyle,
        initialLevel: currentLevel
      }));
      setSentenceLevelHistory({ 0: currentLevel });
      setSentenceFeedbacks({});
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setStep(3);
        return;
      }

      setIsCompletingHabits(true);
      completionTimerRef.current = window.setTimeout(() => {
        completionTimerRef.current = null;
        setIsCompletingHabits(false);
        setStep(3);
      }, 640);
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

    // 2. From Q2 (Step 12) -> Q3 (Step 13)
    if (step === 12 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 12);
      return;
    }

    // 3. From Q3 (Step 13) -> Sentence 1
    if (step === 13 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 13);
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
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setIsConfirmingInterest(false);
    setIsCompletingHabits(false);
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
    if (step === 13) {
      setStep(12);
      return;
    }
    if (step === 3) {
      setStep(13);
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
  const currentSentence = sentenceIdx === -1 ? '' : SENTENCES_BY_LEVEL[currentLevel][sentenceIdx];
  const sentenceHighlightEnd = currentSentence.search(/[.!?]/);
  const sentenceHighlight = sentenceHighlightEnd === -1
    ? currentSentence
    : currentSentence.slice(0, sentenceHighlightEnd + 1);
  const sentenceRemainder = currentSentence.slice(sentenceHighlight.length);

  useEffect(() => {
    if (sentenceIdx === -1 || isTyping) return;

    const timeout = window.setTimeout(() => setRevealedSentenceStep(step), 320);
    return () => window.clearTimeout(timeout);
  }, [sentenceIdx, step, isTyping, companionBubbleText]);

  const sentenceControlsReady =
    sentenceIdx !== -1 &&
    !isTyping &&
    selectedFeeling === null &&
    revealedSentenceStep === step;
  const currentTranslation = sentenceIdx === -1 ? '' : SENTENCE_TRANSLATIONS[sentenceIdx];
  const currentBookmarkedSentence = sentenceIdx === -1
    ? null
    : { sentence: currentSentence, translation: currentTranslation };
  const isSentenceBookmarked = Boolean(
    currentBookmarkedSentence &&
      bookmarkedSentences.some((item) => item.sentence === currentBookmarkedSentence.sentence)
  );

  const handlePlayFullText = () => {
    if (!('speechSynthesis' in window) || sentenceIdx === -1) return;
    if (playingSentenceIdx === sentenceIdx) {
      window.speechSynthesis.cancel();
      setPlayingSentenceIdx(null);
      return;
    }
    handlePlayAudio(SENTENCES_BY_LEVEL[currentLevel].join(' '), sentenceIdx);
  };

  const handleToggleSentenceBookmark = () => {
    if (!currentBookmarkedSentence || !onToggleSentenceBookmark) return;
    onToggleSentenceBookmark(currentBookmarkedSentence);
  };

  const renderSentenceActions = () => (
    <div className="grid h-[58px] shrink-0 grid-cols-3 items-center border-t border-[#E5DFF0] bg-white/95 px-2 sm:px-4">
      <button
        type="button"
        onClick={() => setShowTranslation((visible) => !visible)}
        aria-pressed={showTranslation}
        className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-[12px] font-medium transition-colors hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] sm:gap-2 sm:text-[13px] ${
          showTranslation ? 'text-[#B83825]' : 'text-[#34314F]'
        }`}
      >
        <Languages size={18} />
        <span>{showTranslation ? '隐藏译文' : '译文'}</span>
      </button>
      <button
        type="button"
        onClick={handlePlayFullText}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-[12px] font-medium text-[#34314F] transition-colors hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] sm:gap-2 sm:text-[13px]"
        aria-label={playingSentenceIdx === sentenceIdx ? '停止播放全文' : '听全文'}
      >
        <Volume2
          size={18}
          className={playingSentenceIdx === sentenceIdx ? 'animate-pulse text-[#B83825]' : 'text-[#514D6E]'}
        />
        <span>{playingSentenceIdx === sentenceIdx ? '停止' : '听全文'}</span>
      </button>
      <button
        type="button"
        onClick={() => setIsCardFlipped((flipped) => !flipped)}
        aria-label={isCardFlipped ? '翻回原句' : '翻面解读'}
        aria-pressed={isCardFlipped}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-[12px] font-medium text-[#34314F] transition-colors hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] sm:gap-2 sm:text-[13px]"
      >
        <RotateCcw size={17} />
        <span>{isCardFlipped ? '返回原句' : '翻面解读'}</span>
      </button>
    </div>
  );

  const progressStep =
    step === 1 ? 1 :
    currentQ ? currentQ.number + 1 :
    sentenceIdx !== -1 ? sentenceIdx + 5 :
    8;
  const progressPercentage = (progressStep / 8) * 100;
  const isHabitSurvey = Boolean(currentQ);

  return (
    <div
      className={`w-full h-full flex flex-col ${sentenceIdx !== -1 ? 'bg-[#F2EFFA] text-[#171A35]' : isHabitSurvey ? 'bg-[#FBFAFD] text-[#25243C]' : 'bg-[#F4F1FA] text-stone-900'} select-none overflow-hidden relative font-sans`}
      style={sentenceIdx !== -1 ? {
        backgroundImage: `url(${import.meta.env.BASE_URL}assets/reading-trial-scene.webp)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        backgroundSize: '100% auto'
      } : undefined}
    >
      {sentenceIdx !== -1 ? (
        <header className="relative z-30 mx-auto w-full max-w-xl shrink-0 border-b border-[#E5DFF0] bg-[#F2EFFA]/95 px-3 pb-2 pt-1.5">
          <div className="relative flex h-10 items-center justify-between">
            <button
              onClick={handlePrevStep}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#171A35] shadow-sm transition-colors hover:bg-[#F7F4FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
              aria-label="返回上一步"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-150px)] -translate-x-1/2 truncate text-center text-[15px] font-semibold text-[#171A35]">
              Teddy Bear Comfort
            </h1>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleSentenceBookmark}
                disabled={!onToggleSentenceBookmark}
                aria-pressed={isSentenceBookmarked}
                aria-label={isSentenceBookmarked ? '取消收藏句子' : '收藏句子'}
                title={isSentenceBookmarked ? '取消收藏句子' : '收藏句子'}
                className={`flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] disabled:cursor-not-allowed disabled:opacity-50 ${
                  isSentenceBookmarked ? 'text-[#B83825]' : 'text-[#171A35] hover:text-[#B83825]'
                }`}
              >
                <Bookmark size={20} fill={isSentenceBookmarked ? 'currentColor' : 'none'} />
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSentenceMenu((open) => !open)}
                  aria-expanded={showSentenceMenu}
                  aria-label="更多阅读选项"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#171A35] transition-colors hover:bg-[#F7F4FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
                >
                  <MoreHorizontal size={22} />
                </button>
                {showSentenceMenu && (
                  <div className="absolute right-0 top-11 z-40 w-48 rounded-xl border border-[#E5DFF0] bg-white p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setShowTranslation((visible) => !visible);
                        setShowSentenceMenu(false);
                      }}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-[#34314F] hover:bg-[#F5F2FA]"
                    >
                      {showTranslation ? '隐藏中文译文' : '显示中文译文'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-1 pt-1.5">
            <div
              className="flex h-2 flex-1 overflow-hidden rounded-full bg-[#D8D2E8]"
              role="progressbar"
              aria-label="句子试读进度"
              aria-valuemin={0}
              aria-valuemax={4}
              aria-valuenow={sentenceIdx + 1}
              aria-valuetext={`第 ${sentenceIdx + 1} 句，共 4 句`}
            >
              <span
                className="h-full rounded-full bg-[#C83E26] transition-[width] duration-500 ease-out"
                style={{ width: `${((sentenceIdx + 1) / 4) * 100}%` }}
              />
            </div>
            <span className="min-w-[42px] text-right text-[12px] tabular-nums text-[#77728D]">
              {sentenceIdx + 1} / 4
            </span>
          </div>
        </header>
      ) : (
        <div className={`z-30 mx-auto flex h-14 w-full max-w-xl shrink-0 items-center gap-3 border-b px-3 sm:px-5 ${
          isHabitSurvey
            ? 'border-[#E8E3F0] bg-[#FBFAFD]'
            : 'border-[#E5E0EF] bg-[#F4F1FA]'
        }`}>
          <button
            onClick={handlePrevStep}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#68647E] transition-colors hover:bg-white/80 hover:text-[#24233E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94A30] active:scale-95"
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
            aria-valuetext={`第 ${progressStep} 步，共 8 步`}
          >
            {Array.from({ length: 8 }, (_, index) => {
              const segmentSize = 100 / 8;
              const fill = Math.max(0, Math.min(100, ((progressPercentage - index * segmentSize) / segmentSize) * 100));
              return (
                <span key={index} className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#DCD6E9]">
                  <span
                    className="block h-full rounded-full bg-[#D94A30] transition-[width] duration-300 ease-out"
                    style={{ width: `${fill}%` }}
                  />
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= MAIN CONTENT CANVAS ================= */}
      <div className={`flex-1 no-scrollbar flex w-full max-w-xl mx-auto ${step === 1 ? 'min-h-0 overflow-hidden p-0' : sentenceIdx !== -1 ? 'min-h-0 overflow-hidden flex-col items-center justify-start p-3 sm:p-4' : 'overflow-y-auto flex-col items-center justify-between p-4 sm:p-5'}`}>
        {/* ================= SCREEN 0: ENTRY WELCOME ANIMATION (参考用户视频) ================= */}
        {false && step === 0 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Duolingo Speech Bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#E7E1F0] p-5 shadow-sm mb-6 inline-block text-left animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-[18px] font-bold tracking-tight leading-snug animate-title-gradient">
                  {companionBubbleText}
                  {isTyping && <span className="inline-block w-1.5 h-3.5 bg-emerald-600 ml-1 animate-pulse" />}
                </p>
                {/* Speech Bubble Arrow Notch pointing downward */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[14px] border-t-[#E7E1F0] -z-10" />
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
            isConfirming={isConfirmingInterest}
            onToggleTag={handleToggleTag}
            onApplyCustomTopics={handleApplyCustomTopics}
            onConfirm={handleConfirmAstrolabe}
          />
        )}

        {/* ================= SCREENS 3..7: SURVEY QUESTIONS (Duolingo Vertical Stack Cards, Zero Truncation) ================= */}
        {currentQ && (
        <div className="w-full flex-1 flex flex-col justify-start animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Duolingo Companion Speech Header (Mascot left + Speech bubble right) */}
            <div className="mt-2 mb-3 flex w-full items-center gap-3">
              <div className="relative h-16 w-16 shrink-0">
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="h-full w-full object-contain"
                />
                <CompletionRipple active={isCompletingHabits} showCheck />
              </div>

              {/* Pointing Speech Bubble with Notch */}
              <div className="relative flex min-h-16 flex-1 items-center rounded-[14px] border border-[#E2DCEC] bg-white px-4 py-3.5">
                <div className="absolute top-5 -left-2 w-0 h-0 border-y-[7px] border-y-transparent border-r-[9px] border-r-white z-10" />
                <div className="absolute top-[19px] -left-[10px] w-0 h-0 border-y-[8px] border-y-transparent border-r-[10px] border-r-[#E2DCEC]" />

                <div
                  aria-label={currentQ.title}
                  className="text-[17px] font-semibold leading-[26px] text-[#252D32]"
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
                <p className="min-h-6 mb-2 text-[13px] leading-5 text-[#79758D]">
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
                        className={`speech-option-enter group w-full min-h-[68px] px-1 text-left transition-colors duration-150 cursor-pointer flex items-center justify-between border-b border-[#E8E3F0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#D94A30] ${
                          isSelected ? 'text-[#8F3025]' : 'text-[#25243C] hover:bg-white/60'
                        }`}
                        style={{
                          animationDelay: `${
                            SPEECH_CONTENT_REVEAL_MS + idx * COMPANION_TYPING_INTERVAL_MS
                          }ms`
                        }}
                      >
                        <div className="flex items-center gap-4 min-w-0 pr-3 flex-1">
                          <span className="w-6 text-[12px] font-semibold tabular-nums text-[#9994A8] shrink-0">
                            0{idx + 1}
                          </span>
                          <span
                            className={`text-[15px] font-semibold leading-snug break-words transition-colors ${
                              isSelected ? 'text-[#8F3025]' : 'text-[#25243C] group-hover:text-[#B83825]'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </div>

                        <span
                          className={`w-[22px] h-[22px] rounded-full shrink-0 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[6px] border-[#D94A30] bg-white'
                              : 'border-[1.5px] border-[#D2CDDD] bg-transparent group-hover:border-[#B6AFC8]'
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
                    disabled={!selectedOptionItem || isCompletingHabits}
                    className={`w-full h-14 rounded-[9px] font-semibold text-[15px] flex items-center justify-center gap-2 transition-colors duration-150 ${
                      selectedOptionItem
                        ? 'bg-emerald-600 text-white cursor-pointer hover:bg-emerald-500 active:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2'
                        : 'bg-[#E9E5F0] text-[#9893A7] cursor-not-allowed'
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

        {/* ================= SENTENCE PLACEMENT TEST ================= */}
        {sentenceIdx !== -1 && (
          <div className="flex w-full min-h-0 flex-1 flex-col gap-2 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex min-h-[68px] shrink-0 items-center gap-2.5">
              <div className="relative h-[58px] w-[58px] shrink-0 sm:h-[64px] sm:w-[64px]">
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="h-full w-full object-contain drop-shadow-sm"
                />
              </div>
              <div
                className="relative flex min-h-[58px] flex-1 items-center rounded-[15px] border border-[#E1DBED] bg-white px-3.5 py-2.5 shadow-[0_3px_10px_rgba(63,48,90,0.04)] sm:px-4"
                role="status"
                aria-live="polite"
                aria-label={`${companion.name}正在说话`}
              >
                <span className="absolute left-[-7px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-l border-[#E1DBED] bg-white" />
                <p className="relative text-[13px] font-medium leading-[1.5] text-[#393550] sm:text-[14px]">
                  {companionBubbleText}
                  {isTyping && (
                    <span
                      aria-hidden="true"
                      className="ml-1 inline-block h-3.5 w-[2px] translate-y-[2px] animate-pulse bg-[#C83E26] motion-reduce:animate-none"
                    />
                  )}
                </p>
              </div>
            </div>

            <div className="relative flex min-h-[300px] flex-1 px-1 py-2 [perspective:1200px]">
              <div
                aria-hidden="true"
                className="absolute inset-x-2 bottom-1 top-5 rotate-[-2deg] rounded-[24px] bg-[#8176A8]/30"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-1 bottom-2 top-4 rotate-[1.2deg] rounded-[24px] bg-[#C83E26]/75"
              />
              <article
                className="relative z-10 flex min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#E5DFF0] bg-white shadow-[0_12px_28px_rgba(50,38,77,0.10)] transition-transform duration-500 motion-reduce:transition-none"
                style={{
                  transform: isCardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  aria-hidden={isCardFlipped}
                  className={`absolute inset-0 flex min-h-0 flex-col bg-white [backface-visibility:hidden] ${
                    isCardFlipped ? 'invisible pointer-events-none' : ''
                  }`}
                >
                  <div className="flex-1 overflow-y-auto px-5 pb-4 pt-7 sm:px-7 sm:pt-9">
                    <p className="text-[21px] font-medium leading-[1.5] text-[#171A35] selection:bg-[#F9DCD5] sm:text-[24px]">
                      <span className="sentence-highlight">{sentenceHighlight}</span>
                      {sentenceRemainder}
                    </p>
                    {showTranslation && (
                      <div className="mt-6 border-l-[3px] border-[#C83E26] bg-[#F8F5FC] px-3.5 py-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
                        <span className="mb-1 block text-[10px] font-semibold text-[#8176A8]">中文译文</span>
                        <p className="text-[14px] leading-6 text-[#49445E]">{currentTranslation}</p>
                      </div>
                    )}
                  </div>
                  {renderSentenceActions()}
                </div>

                <div
                  aria-hidden={!isCardFlipped}
                  className={`absolute inset-0 flex min-h-0 flex-col bg-white [backface-visibility:hidden] [transform:rotateY(180deg)] ${
                    isCardFlipped ? '' : 'invisible pointer-events-none'
                  }`}
                >
                  <div className="flex-1 overflow-y-auto px-5 pb-4 pt-6 sm:px-7 sm:pt-8">
                    <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[#F2EFFA] px-2.5 py-1 text-[11px] font-semibold text-[#766B91]">
                      <Sparkles size={13} />
                      句意解读
                    </div>
                    {showTranslation && (
                      <p className="mb-5 text-[17px] font-semibold leading-7 text-[#24213C]">
                        {currentTranslation}
                      </p>
                    )}
                    <div className="border-t border-[#E9E4F0] pt-4">
                      <h2 className="mb-2 text-[12px] font-semibold text-[#B83825]">读句提示</h2>
                      <p className="text-[14px] leading-6 text-[#49445E]">
                        {SENTENCE_INTERPRETATIONS[sentenceIdx]}
                      </p>
                    </div>
                    <p className="mt-5 text-[12px] leading-5 text-[#77728D]">{currentSentence}</p>
                  </div>
                  {renderSentenceActions()}
                </div>
              </article>
            </div>

            <div
              className={`grid min-h-[50px] w-full shrink-0 grid-cols-3 gap-2 ${
                sentenceControlsReady ? '' : 'invisible'
              }`}
              role="group"
              aria-label="这句话的阅读难度"
              aria-hidden={!sentenceControlsReady}
            >
                {([
                  ['down', '偏难'],
                  ['keep', '刚刚好'],
                  ['up', '太简单']
                ] as const).map(([feeling, label], index) => {
                  const isSelected = selectedFeeling === feeling;
                  return (
                    <button
                      key={`${step}-${feeling}-${sentenceControlsReady}`}
                      type="button"
                      onClick={() => handleSelectFeeling(feeling)}
                      aria-pressed={isSelected}
                      disabled={!sentenceControlsReady}
                      className={`speech-option-enter flex min-h-[50px] w-full cursor-pointer items-center justify-center rounded-[14px] border px-2 text-[14px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94A30] focus-visible:ring-offset-2 active:scale-[0.98] ${
                        isSelected
                        ? 'border-[#D94A30] bg-[#FBE8E3] text-[#9B3021]'
                          : 'border-[#E3DEEC] bg-white text-[#403C5A] hover:border-[#D7A497] hover:bg-[#FCF8F7]'
                      }`}
                      style={{
                        animationDelay: `${
                          SPEECH_CONTENT_REVEAL_MS + index * COMPANION_TYPING_INTERVAL_MS
                        }ms`
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
