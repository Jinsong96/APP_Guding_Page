import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowLeft, Sparkle, Sparkles } from 'lucide-react';
import { Companion, GoalTrackDetails } from '../../types';
import { InterestThemePicker } from '../InterestThemePicker';
import { CompanionScene } from '../CompanionScene';
import { CompanionAvatar } from '../CompanionAvatar';
import { DifficultySentencePicker } from '../DifficultySentencePicker';
import { DifficultyExampleList } from '../DifficultyExampleList';
import { COMPANION_TYPING_INTERVAL_MS, SPEECH_CONTENT_REVEAL_MS } from '../speechTiming';

// Pause after a tap so the selection registers visually before the screen advances.
const OPTION_ADVANCE_DELAY_MS = 400;

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
  subtitle?: string;
  category?: GoalCategory;
  level?: CefrLevelKey;
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
    total: goalCat === 'original' || goalCat === 'interest' ? 2 : 3,
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
  ...(goalCat === 'exam' || goalCat === 'workplace'
    ? [{
    step: 12,
    number: 2,
    total: 3,
    stageName: '场景定位',
    title:
      goalCat === 'exam'
        ? '你在准备哪个考试？'
        : '工作里，你主要用英语做什么？',
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
        : [
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
    }]
    : []),
  {
    step: 13,
    number: goalCat === 'original' || goalCat === 'interest' ? 2 : 3,
    total: goalCat === 'original' || goalCat === 'interest' ? 2 : 3,
    stageName: '专注节奏',
    title: '你希望每天花多久读英语？',
    defaultPrompt: '选一个刚好适合你的阅读时长，舒服才能走得远～',
    options: [
      {
        label: '3–5 分钟',
        subtitle: '轻松读一点',
        aiReasoning: '碎片化微阅读：零负担，排队通勤随时读完 1 篇精巧短文。'
      },
      {
        label: '5–20 分钟',
        subtitle: '留一段阅读时间',
        isRecommended: true,
        aiReasoning: '黄金阅读时长：精读 1-2 篇完整短文，深度与轻松感兼顾。'
      },
      {
        label: '20 分钟以上',
        subtitle: '多读一会儿',
        aiReasoning: '深度心流沉浸：适合长篇探究与全景输入，快速积累大体量语料。'
      }
    ]
  }
];

// V2 (简略版): one plain-language difficulty question instead of the goal/scene/duration questions.
const DIFFICULTY_QUESTION: SurveyQuestionDef = {
  step: 14,
  number: 1,
  total: 1,
  stageName: '阅读难度',
  title: '哪一句，你读着最舒服？',
  defaultPrompt: '选一个读起来舒服的难度，之后会跟着你慢慢调～',
  options: [
    { label: '入门', subtitle: '常用词和简单短句', level: 'A1-', aiReasoning: '' },
    { label: '基础', subtitle: '日常短文和小故事', level: 'A2', aiReasoning: '' },
    { label: '进阶', subtitle: '英文新闻和科普', level: 'B1', aiReasoning: '' },
    { label: '高阶', subtitle: '外刊原文', level: 'B2+', aiReasoning: '' }
  ]
};

// V2 03B: the same question as an option list with example sentences, kept for comparison with the
// sentence card. Reached only from the nav; confirming continues like 03.
const DIFFICULTY_LIST_QUESTION: SurveyQuestionDef = {
  ...DIFFICULTY_QUESTION,
  step: 15,
  title: '你想读什么难度的文章？'
};

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

interface Stage02AiChatProps {
  companion: Companion;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onBack: () => void;
  onComplete: (selectedInterests: string[], surveyAnswers?: SurveyAnswers) => void;
  version?: 'v1' | 'v2';
}

export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  initialStep,
  onStepChange,
  onBack,
  onComplete,
  version = 'v1'
}) => {
  const isV2 = version === 'v2';
  const firstQuestionStep = isV2 ? DIFFICULTY_QUESTION.step : 11;
  const questionsFor = (goalCat: GoalCategory) =>
    isV2 ? [DIFFICULTY_QUESTION, DIFFICULTY_LIST_QUESTION] : getSurveyQuestions(companion.name, goalCat);
  // Navigation Steps:
  // 1: Interest theme selection
  // 11: Q1 核心目标
  // 12: Q2 场景定位
  // 13: Q3 专注节奏 (then onComplete hands over to the article recommendation)
  const [step, setStep] = useState<number>(initialStep ?? 1);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('exam');

  // Option tapped on the active question; the screen advances shortly after
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(null);

  // Companion Dynamic Speech State
  const [companionBubbleText, setCompanionBubbleText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConfirmingInterest, setIsConfirmingInterest] = useState(false);

  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimerRef = useRef<number | null>(null);

  const updateStep = (nextStep: number) => {
    setStep(nextStep);
    onStepChange?.(nextStep);
  };

  useLayoutEffect(() => {
    if (initialStep !== undefined && initialStep !== step) {
      updateStep(initialStep);
    }
  }, [initialStep, step]);

  // Dynamic typewriter for companion speech bubble
  const triggerBubbleSpeech = (
    text: string,
    typingIntervalMs = COMPANION_TYPING_INTERVAL_MS
  ) => {
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
    }, typingIntervalMs);
  };

  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    };
  }, []);

  // Sync companion bubble text when step changes
  useLayoutEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setSelectedOptionLabel(null);

    const q = questionsFor(goalCategory).find((item) => item.step === step);
    if (step === 1) {
      triggerBubbleSpeech(
        '这一程，你想先读点什么？',
        COMPANION_TYPING_INTERVAL_MS * 2
      );
    } else if (q) {
      triggerBubbleSpeech(q.title);
    }
  }, [step, goalCategory, companion.name]);

  // Interest selection supports adding and removing themes before the pause completes.
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      return prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag];
    });
  };

  // Confirm selected themes and proceed directly to the reading-habits questions.
  const handleConfirmAstrolabe = (tags: string[]) => {
    setSelectedTags(tags);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateStep(firstQuestionStep);
      return;
    }

    setIsConfirmingInterest(true);
    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = null;
      setIsConfirmingInterest(false);
      updateStep(firstQuestionStep);
    }, 640);
  };

  // Auto Commit Helper for Survey Options
  const commitOptionAndAdvance = (opt: SurveyOptionItem, currentStep: number) => {
    if (currentStep === DIFFICULTY_QUESTION.step) {
      onComplete(selectedTags, { initialLevel: opt.level });
      return;
    }

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
      updateStep(detectedCategory === 'original' || detectedCategory === 'interest' ? 13 : 12);
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
      updateStep(13);
      return;
    }

    if (currentStep === 13) {
      const defaultCompanionStyle = companion.type || '智能点拨';
      setSurveyAnswers((prev) => ({
        ...prev,
        duration: opt.label,
        companionStyle: defaultCompanionStyle
      }));
      onComplete(selectedTags, {
        ...surveyAnswers,
        duration: opt.label,
        companionStyle: defaultCompanionStyle
      });
      return;
    }
  };

  // V2 difficulty is picked on the sentence card and confirmed there.
  const handleConfirmDifficulty = (level: CefrLevelKey) => {
    const option = DIFFICULTY_QUESTION.options.find((item) => item.level === level);
    if (option) commitOptionAndAdvance(option, DIFFICULTY_QUESTION.step);
  };

  // Survey options advance on tap.
  const handleSelectOption = (opt: SurveyOptionItem) => {
    if (selectedOptionLabel === opt.label) return;
    setSelectedOptionLabel(opt.label);

    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    const currentStep = step;
    autoAdvanceTimerRef.current = setTimeout(() => {
      autoAdvanceTimerRef.current = null;
      commitOptionAndAdvance(opt, currentStep);
    }, OPTION_ADVANCE_DELAY_MS);
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
    if (step === 1) {
      onBack();
      return;
    }
    if (step === 11 || step === DIFFICULTY_QUESTION.step || step === DIFFICULTY_LIST_QUESTION.step) {
      updateStep(1);
      return;
    }
    if (step === 12) {
      updateStep(11);
      return;
    }
    if (step === 13) {
      updateStep(goalCategory === 'original' || goalCategory === 'interest' ? 11 : 12);
      return;
    }
  };

  // Questions dataset
  const surveyQuestions = questionsFor(goalCategory);
  const currentQ = surveyQuestions.find((q) => q.step === step);
  useEffect(() => {
    if (step === 12 && (goalCategory === 'original' || goalCategory === 'interest')) {
      updateStep(13);
    }
  }, [step, goalCategory, updateStep]);

  const isHabitSurvey = Boolean(currentQ);

  return (
    <div
      className={`w-full h-full flex flex-col ${isHabitSurvey ? 'bg-[#FBFAFD] text-[#25243C]' : 'bg-[#F4F1FA] text-stone-900'} select-none overflow-hidden relative font-sans`}
    >
      {step !== 1 && !isHabitSurvey ? (
        <header className="z-30 mx-auto flex h-[58px] w-full max-w-xl shrink-0 items-center gap-2 border-b border-[#E3E8F0] bg-[#F8F9FC] px-3">
          <button
            onClick={handlePrevStep}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#263958] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BD4B35]"
            aria-label="返回上一页"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-center text-[17px] font-semibold text-[#172747]">
              和{companion.name}聊聊
            </h1>
          </div>
          <span className="h-10 w-10 shrink-0" aria-hidden="true" />
        </header>
      ) : null}

      {/* ================= MAIN CONTENT CANVAS ================= */}
      <div className={`flex-1 no-scrollbar flex w-full max-w-xl mx-auto ${step === 1 || isHabitSurvey ? 'min-h-0 overflow-hidden flex-col p-0' : 'overflow-y-auto flex-col items-center justify-between p-4 sm:p-5'}`}>
        {/* ================= SCREEN 0: ENTRY WELCOME ANIMATION (参考用户视频) ================= */}
        {false && step === 0 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Duolingo Speech Bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#E7E1F0] p-5 shadow-sm mb-6 inline-block text-left animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-[18px] font-bold tracking-tight leading-snug animate-title-gradient" dir="ltr">
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
                  src={companion.portraitUrl}
                  alt={companion.name}
                  className="w-full h-full object-cover rounded-[28%] relative z-10 animate-celebrate-action drop-shadow-md select-none"
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
            isConfirming={isConfirmingInterest}
            onToggleTag={handleToggleTag}
            onConfirm={handleConfirmAstrolabe}
            onBack={handlePrevStep}
          />
        )}

        {/* ================= GOAL AND READING RHYTHM CONVERSATION ================= */}
        {currentQ && (
          <div className="flex h-full min-h-0 w-full flex-1 flex-col animate-in fade-in duration-200 bg-[#F8F5FA] text-[#302A3B]">
            <section className="relative h-[164px] shrink-0 overflow-hidden rounded-b-[18px]">
              <CompanionScene companion={companion} portraitPosition="right" className="absolute inset-0 h-full w-full" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#17152A]/45 via-transparent to-[#17152A]/20" />
              <header className="absolute inset-x-0 top-0 z-10 flex h-[76px] items-start justify-between px-3 pt-2 text-white">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="返回上一页"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="pt-1 text-center drop-shadow">
                  <h1
                    className="text-[24px] font-bold leading-8"
                    style={{ fontFamily: '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif' }}
                  >
                    和{companion.name}聊聊
                  </h1>
                </div>
                <span className="h-9 min-w-9" aria-hidden="true" />
              </header>
            </section>

            <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain px-2.5 pb-2 pt-2">
              <div className="flex shrink-0 items-center gap-2">
                <CompanionAvatar companion={companion} size={40} />
                <div className="relative flex min-h-[58px] w-fit max-w-[calc(100%_-_48px)] items-center rounded-[16px] border border-[#DCCFE8] bg-white px-3.5 py-2">
                  <p aria-label={currentQ.title} className="text-[18px] font-bold leading-6 text-[#302A3B]" dir="ltr">
                    {companionBubbleText}
                    {isTyping && (
                      <span aria-hidden="true" className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-[#D94C3B] motion-reduce:animate-none" />
                    )}
                  </p>
                </div>
              </div>

              {isV2 && step === DIFFICULTY_QUESTION.step ? (
                <DifficultySentencePicker onConfirm={handleConfirmDifficulty} />
              ) : isV2 && step === DIFFICULTY_LIST_QUESTION.step ? (
                <DifficultyExampleList options={DIFFICULTY_QUESTION.options} onConfirm={handleConfirmDifficulty} />
              ) : (
              <div className="speech-content-enter mx-2 mt-4">
                <div
                  className="grid grid-cols-1 gap-2"
                  role="radiogroup"
                  aria-label={currentQ.title}
                >
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOptionLabel === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        role="radio"
                        aria-checked={isSelected}
                        className={`speech-option-enter relative flex min-h-[66px] items-center justify-between gap-2 rounded-[11px] border px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94C3B] ${
                          isSelected
                            ? 'border-[1.5px] border-[#E64E3D] bg-[#FFF0EC] text-[#302A3B]'
                            : 'border-[#DCCFE8] bg-white text-[#302A3B] hover:border-[#BCA9CE]'
                        }`}
                        style={{ animationDelay: `${SPEECH_CONTENT_REVEAL_MS + idx * COMPANION_TYPING_INTERVAL_MS}ms` }}
                      >
                        <span className="min-w-0 break-words text-[17px] leading-5">
                          <span className="font-bold">{opt.label}</span>
                          {opt.subtitle && (
                            <span className="font-medium text-[#82788A]"> · {opt.subtitle}</span>
                          )}
                        </span>
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? 'border-[#D94C3B] bg-[#D94C3B] text-white' : 'border-[#CBBED5]'
                        }`}>
                          {isSelected && <span className="text-[12px] font-bold">✓</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
