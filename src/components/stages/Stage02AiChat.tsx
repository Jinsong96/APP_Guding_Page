import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Send, Volume2, CheckCircle2, ChevronRight, BookOpen, RotateCcw } from 'lucide-react';
import { Companion } from '../../types';
import { GalaxyCompassPicker } from '../GalaxyCompassPicker';

export type CefrLevelKey = 'A1-' | 'A2' | 'B1' | 'B2+';

export interface SurveyAnswers {
  goal?: string;
  challenge?: string;
  duration?: string;
  companionStyle?: string;
}

export interface SurveyQuestionDef {
  step: number; // 11, 12, 13, 14
  number: number; // 1, 2, 3, 4
  title: string;
  options: {
    label: string;
    desc: string;
    icon: string;
  }[];
}

export const getSurveyQuestions = (companionName: string): SurveyQuestionDef[] => [
  {
    step: 11,
    number: 1,
    title: '平时你读英语，最想达成什么目标呢？',
    options: [
      { label: '拓展视野看原版', desc: '看懂英文原版资讯、前沿科技与外媒故事', icon: '🌟' },
      { label: '职场与专业应用', desc: '提升工作商务沟通、邮件撰写与文献阅读', icon: '💼' },
      { label: '升学与备考冲刺', desc: '四六级、雅思、托福或考研考证高效提分', icon: '🎯' },
      { label: '兴趣充能重拾语感', desc: '零压力轻松读，找回学英语的纯粹乐趣', icon: '🌱' }
    ]
  },
  {
    step: 12,
    number: 2,
    title: '遇到全英文或长难句时，你通常觉得最大的阻碍是？',
    options: [
      { label: '生词较多断节奏', desc: '频繁查词打断阅读连贯感与心流体验', icon: '🧩' },
      { label: '读得较慢容易累', desc: '信息密度大，句子需要反复回读多次才懂', icon: '⏳' },
      { label: '复杂句式理不清', desc: '从句套从句，容易抓不住核心主干逻辑', icon: '🧭' },
      { label: '感觉顺畅想进阶', desc: '大体能看懂，希望能掌握更多地道纯正表达', icon: '☕' }
    ]
  },
  {
    step: 13,
    number: 3,
    title: '每天如果留一段专注阅读时间，你更习惯哪种时长节奏？',
    options: [
      { label: '5-8 分钟', desc: '碎片化微阅读，随时随地零负担打卡', icon: '⚡' },
      { label: '10-15 分钟', desc: '完整读完 1-2 篇精选短文，节奏最适中', icon: '⏱️' },
      { label: '20 分钟以上', desc: '沉浸式深度阅读，持续探索更多领域', icon: '📖' }
    ]
  },
  {
    step: 14,
    number: 4,
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

export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  onBack,
  onComplete,
  onSkip
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
  const [currentLevel, setCurrentLevel] = useState<CefrLevelKey>('A2'); // Initial difficulty is A2
  const [isAiTyping, setIsAiTyping] = useState<boolean>(true);
  const [typedText, setTypedText] = useState<string>('');
  const [isThinkingDots, setIsThinkingDots] = useState<boolean>(true);
  const [inputText, setInputText] = useState<string>('');
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
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
    const q1 = `嗨！我是${companion.name}。初次见面，你平时最对什么领域的知识或故事感兴趣呢？`;
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

  // Step 1 -> Survey: Confirm tags, then introduce 4 friendly profiling questions to understand user better
  const handleConfirmTags = (tags: string[]) => {
    if (isBusy) return;
    const confirmedTags = tags.length > 0 ? tags : (selectedTags.length > 0 ? selectedTags : ['前沿科技', '天文探索']);
    setSelectedTags(confirmedTags);

    setMessages((prev) => [
      ...prev,
      {
        id: `u-tags-${Date.now()}`,
        sender: 'user',
        text: `兴趣罗盘已就绪 · ${confirmedTags.join(' · ')}`
      }
    ]);

    setIsBusy(true);
    setStep(-1);

    const topTags = confirmedTags.slice(0, 2).join('与');
    const introMsg = `【${topTags}】收到啦！在开始试读前，想先了解你 4 个阅读小习惯，这样能让${companion.name}在以后的阅读里更懂你的节奏～`;

    runTypewriter(introMsg, 'm-intro-survey', 180, 26, () => {
      const q1Msg = `第 1 问：你平时读英语，最想达成什么目标呢？`;
      runTypewriter(q1Msg, 'm-q1', 120, 26, () => {
        setStep(11);
        setIsBusy(false);
      });
    });
  };

  // Handle answering any of the 4 profiling questions (Q1: 11, Q2: 12, Q3: 13, Q4: 14)
  const handleAnswerSurvey = (currentStep: number, answerText: string) => {
    if (isBusy) return;
    setIsBusy(true);
    setStep(-1);

    setMessages((prev) => [
      ...prev,
      { id: `u-q${currentStep}-${Date.now()}`, sender: 'user', text: answerText }
    ]);

    if (currentStep === 11) {
      setSurveyAnswers((prev) => ({ ...prev, goal: answerText }));
      const companionReaction = `很棒的目标！一步一步来，${companion.name}会陪你走得很稳～`;
      runTypewriter(companionReaction, 'm-react-q1', 160, 24, () => {
        const q2Msg = `第 2 问：遇到全英文或长难句时，你通常觉得最大的阻碍是？`;
        runTypewriter(q2Msg, 'm-q2', 120, 24, () => {
          setStep(12);
          setIsBusy(false);
        });
      });
    } else if (currentStep === 12) {
      setSurveyAnswers((prev) => ({ ...prev, challenge: answerText }));
      const companionReaction = `记在心里了！以后的阅读里${companion.name}会主动帮你拆解长句，不让生词打断心流～`;
      runTypewriter(companionReaction, 'm-react-q2', 160, 24, () => {
        const q3Msg = `第 3 问：每天如果留一段专注阅读时间，你更习惯哪种时长节奏？`;
        runTypewriter(q3Msg, 'm-q3', 120, 24, () => {
          setStep(13);
          setIsBusy(false);
        });
      });
    } else if (currentStep === 13) {
      setSurveyAnswers((prev) => ({ ...prev, duration: answerText }));
      const companionReaction = `收到！微步前行聚沙成塔，这个时长非常舒适～`;
      runTypewriter(companionReaction, 'm-react-q3', 160, 24, () => {
        const q4Msg = `第 4 问：在接下来的阅读过程中，你希望${companion.name}怎样陪伴你？`;
        runTypewriter(q4Msg, 'm-q4', 120, 24, () => {
          setStep(14);
          setIsBusy(false);
        });
      });
    } else if (currentStep === 14) {
      setSurveyAnswers((prev) => ({ ...prev, companionStyle: answerText }));
      const transitionMsg = `太好啦！${companion.name}现在已经越来越懂你的阅读习惯与偏好了✨ 接下来我们通过 4 句微试读来为你精准定级。先看第 1 句：`;
      const initialLevel: CefrLevelKey = 'A2';
      setCurrentLevel(initialLevel);
      setSentenceLevelHistory({ 0: initialLevel });
      setSentenceFeedbacks({});
      presentSentenceWithRhythm(0, initialLevel, transitionMsg, 'm-read-intro', 3);
    }
  };

  // Return to previous survey question (allows user to reselect if picked wrong)
  const handlePrevSurveyQuestion = () => {
    if (isBusy || step <= 11) return;

    // Terminate any ongoing typing or delay timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (delayTimerRef.current) clearTimeout(delayTimerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsAiTyping(false);
    setTypedText('');
    setIsBusy(false);

    if (step === 12) {
      // Return from Q2 to Q1 (user's latest choice will be used upon re-selection)
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-q1');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(11);
      return;
    }

    if (step === 13) {
      // Return from Q3 to Q2
      setMessages((prev) => {
        const idx = prev.findIndex((m) => m.id === 'm-q2');
        return idx !== -1 ? prev.slice(0, idx + 1) : prev;
      });
      setStep(12);
      return;
    }

    if (step === 14) {
      // Return from Q4 to Q3
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
      // Return from Sentence 2 to Sentence 1
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
      // Return from Sentence 3 to Sentence 2
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
      // Return from Sentence 4 to Sentence 3
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

    // Record user message
    setMessages((prev) => [
      ...prev,
      { id: `u-fb-${nextSentenceIdx}-${Date.now()}`, sender: 'user', text: feedbackText }
    ]);

    // AI companion bridge answer
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

    // Directly reveal "开启专属定制" button without extra AI text dialogue
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
      // User typed interest keyword
      const customTag = trimmed.slice(0, 10);
      handleConfirmTags([customTag, '前沿科技']);
    } else if (step >= 11 && step <= 14) {
      handleAnswerSurvey(step, trimmed);
    } else if (step === 3) {
      // Sentence 1 feedback
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        advanceToSentence(1, trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        advanceToSentence(1, trimmed, 'up');
      } else {
        advanceToSentence(1, trimmed, 'keep');
      }
    } else if (step === 4) {
      // Sentence 2 feedback
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        advanceToSentence(2, trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        advanceToSentence(2, trimmed, 'up');
      } else {
        advanceToSentence(2, trimmed, 'keep');
      }
    } else if (step === 5) {
      // Sentence 3 feedback
      if (trimmed.includes('难') || trimmed.includes('吃力') || trimmed.includes('生词') || trimmed.includes('慢')) {
        advanceToSentence(3, trimmed, 'down');
      } else if (trimmed.includes('简单') || trimmed.includes('容易') || trimmed.includes('高') || trimmed.includes('挑战')) {
        advanceToSentence(3, trimmed, 'up');
      } else {
        advanceToSentence(3, trimmed, 'keep');
      }
    } else if (step === 6) {
      // Sentence 4 final feedback
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
        {step === 1 && !isAiTyping && !isBusy && (
          <div className="w-full pt-0.5 animate-in fade-in slide-in-from-bottom-2 duration-400">
            <GalaxyCompassPicker
              selectedTags={selectedTags}
              onToggleTag={handleToggleTag}
              onConfirm={handleConfirmTags}
              companionAccent={companion.accentColor}
            />
          </div>
        )}

        {/* STEPS 11-14: 4 Interactive Survey Questions to Understand the User Better */}
        {step >= 11 && step <= 14 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between px-1 text-xs text-stone-500">
              <span className="font-mono text-amber-700 flex items-center gap-1.5 font-semibold text-[13px]">
                <Sparkles size={13} />
                第 {step - 10}/4 题
              </span>

              {/* Lightweight "上一题" Action in Top-Right of Options (displayed for Q2, Q3, Q4; Q1 is the initial survey question) */}
              {step > 11 && (
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

            <div className="grid grid-cols-1 gap-2">
              {getSurveyQuestions(companion.name)
                .find((q) => q.step === step)
                ?.options.map((opt) => {
                  const currentSavedAnswer =
                    step === 11
                      ? surveyAnswers.goal
                      : step === 12
                      ? surveyAnswers.challenge
                      : step === 13
                      ? surveyAnswers.duration
                      : surveyAnswers.companionStyle;
                  const isPreviouslySelected = currentSavedAnswer ? currentSavedAnswer.includes(opt.label) : false;

                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleAnswerSurvey(step, `${opt.icon} ${opt.label}`)}
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
                  ? '或直接输入你感兴趣的主题...'
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
