import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Send, Volume2, CheckCircle2, ChevronRight, BookOpen } from 'lucide-react';
import { Companion } from '../../types';
import { GalaxyCompassPicker } from '../GalaxyCompassPicker';

export type CefrLevelKey = 'A1-' | 'A2' | 'B1' | 'B2+';

interface Stage02AiChatProps {
  companion: Companion;
  onBack: () => void;
  onComplete: (selectedInterests: string[], determinedLevel: CefrLevelKey) => void;
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

  // Step 1 -> Step 2: Confirm tags, then present Sentence 1 at A2 level
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

    const topTags = confirmedTags.slice(0, 2).join('与');
    const introMsg = `【${topTags}】收到！我们通过 4 句微试读来为你精准定级。先看第 1 句：`;

    const initialLevel: CefrLevelKey = 'A2';
    setCurrentLevel(initialLevel);

    presentSentenceWithRhythm(0, initialLevel, introMsg, 'm-read-intro', 3);
  };

  // Proceed to Next Sentence (Sentence 1 -> 2, Sentence 2 -> 3, Sentence 3 -> 4)
  const advanceToSentence = (
    nextSentenceIdx: number,
    feedbackText: string,
    direction: 'up' | 'down' | 'keep'
  ) => {
    if (isBusy) return;
    setIsBusy(true);

    const nextLvl = getNextLevel(currentLevel, direction);
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
    <div className="w-full h-full flex flex-col bg-[#0A0D14] text-slate-100 overflow-hidden relative select-none">
      {/* Background Ambient Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${companion.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Top Header Bar */}
      <div className="shrink-0 h-12 px-3.5 flex items-center justify-between border-b border-slate-800/80 bg-[#0A0D14]/90 backdrop-blur-md z-20">
        <button
          onClick={onBack}
          className="p-1.5 -ml-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="返回"
        >
          <ArrowLeft size={17} />
        </button>

        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10"
            />
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-900 bg-emerald-400"
            />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white tracking-wide">
                {companion.name}
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                AI 伴读
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {step <= 1
                ? '兴趣星盘校准中'
                : step === 7
                ? '定级完成'
                : `4 句自适应微定级 (${currentLevel})`}
            </div>
          </div>
        </div>

        <button
          onClick={onSkip}
          className="text-xs px-2.5 py-1 rounded-full bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          跳过
        </button>
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
                  className="w-7 h-7 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                  style={{
                    boxShadow: `0 0 10px ${companion.accentColor}33`
                  }}
                />
              </div>
            )}

            <div className={`max-w-[90%] sm:max-w-[88%] ${m.sender === 'user' ? 'ml-auto' : ''}`}>
              {/* Sentence Card (Pure, focused reading card without clutter) */}
              {m.sentenceCard ? (
                <div className="rounded-2xl bg-[#141824] border border-slate-750 overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Card Header with Progress Indicator & Clean Audio Button */}
                  <div className="px-3.5 py-2.5 bg-slate-800/80 border-b border-slate-750 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1.5 font-mono">
                        <BookOpen size={13} />
                        第 {m.sentenceCard.sentenceIndex + 1}/{m.sentenceCard.totalSentences} 句
                      </span>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(m.sentenceCard!.text, m.sentenceCard!.sentenceIndex)}
                      className="px-2 py-1 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-[11px]"
                      title="朗读本句"
                    >
                      <Volume2
                        size={13}
                        className={playingSentenceIdx === m.sentenceCard.sentenceIndex ? 'text-amber-400 animate-pulse' : 'text-slate-300'}
                      />
                      <span className="text-[11px] text-slate-300">朗读</span>
                    </button>
                  </div>

                  {/* Clean Sentence Body (No Circled Numbers) */}
                  <div className="p-4 sm:p-4.5 text-[15.5px] sm:text-[16px] leading-relaxed text-slate-100 font-serif">
                    <p className="tracking-wide selection:bg-amber-500/30">
                      {m.sentenceCard.text}
                    </p>
                  </div>
                </div>
              ) : m.summaryCard ? (
                /* Full Passage Summary Card upon Completing 4 Sentences */
                <div className="rounded-2xl bg-[#141824] border border-emerald-500/30 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-950/60 to-slate-800/80 border-b border-emerald-500/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-slate-950 font-mono"
                        style={{ backgroundColor: m.summaryCard.color }}
                      >
                        {m.summaryCard.levelLabel}
                      </span>
                      <span className="text-xs text-emerald-300 font-medium">4 句试读全貌</span>
                    </div>
                    <button
                      onClick={() => handlePlayAudio(m.summaryCard!.sentences.join(' '))}
                      className="p-1 rounded-md hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                      title="朗读全文"
                    >
                      <Volume2 size={13} className="text-emerald-400" />
                      <span className="text-[10px] text-emerald-300">全文朗读</span>
                    </button>
                  </div>

                  <div className="p-3.5 space-y-2 text-[14.5px] leading-relaxed text-slate-200 font-serif">
                    {m.summaryCard.sentences.map((sent, sIdx) => (
                      <p key={sIdx} className="p-1.5 rounded-lg hover:bg-slate-800/50 transition-colors">
                        {sent}
                      </p>
                    ))}
                  </div>

                  <div className="px-3.5 py-2 bg-[#0F121C] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>{m.summaryCard.tagline}</span>
                    <span className="text-[10px] text-amber-400 font-mono">建议起点 {m.summaryCard.code}</span>
                  </div>
                </div>
              ) : (
                /* Normal Chat Text Bubble */
                <div
                  className={`p-3.5 rounded-2xl text-[14.5px] sm:text-[15px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-amber-500 text-slate-950 font-semibold rounded-tr-xs shadow-md'
                      : 'bg-slate-800/80 backdrop-blur-md text-slate-100 border border-white/5 rounded-tl-xs shadow-sm'
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
                className="w-7 h-7 rounded-full object-cover shadow-sm ring-1 ring-white/10"
                style={{
                  boxShadow: `0 0 10px ${companion.accentColor}33`
                }}
              />
            </div>
            <div className="p-3.5 rounded-2xl text-[14.5px] sm:text-[15px] leading-relaxed max-w-[88%] bg-slate-800/80 backdrop-blur-md text-slate-100 border border-white/5 rounded-tl-xs flex items-center min-h-[42px] shadow-sm">
              {isThinkingDots ? (
                <div className="flex items-center gap-1.5 py-1 px-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <span>{typedText}</span>
                  <span className="w-1.5 h-3.5 bg-amber-400 cursor-blink inline-block rounded-xs" />
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

        {/* STEP 3: Rating for Sentence 1 (A2 initial) -> Leads to Sentence 2 */}
        {step === 3 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => advanceToSentence(1, '🟢 刚刚好，理解顺畅，继续保持', 'keep')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[13px] sm:text-[13.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>🟢 刚刚好，理解顺畅</span>
                <CheckCircle2 size={15} />
              </button>
              <button
                onClick={() => advanceToSentence(1, '🔴 稍显吃力，想降为轻盈基础版', 'down')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>🔴 偏难吃力，降为更轻盈基础版</span>
                <ChevronRight size={15} className="text-slate-400" />
              </button>
              <button
                onClick={() => advanceToSentence(1, '🔵 太简单了，想要更地道有挑战', 'up')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>🔵 太简单，想更有挑战感</span>
                <ChevronRight size={15} className="text-slate-400" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: Rating for Sentence 2 -> Leads to Sentence 3 */}
        {step === 4 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => advanceToSentence(2, '🟢 刚刚好，这个难度很舒服', 'keep')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[13px] sm:text-[13.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>🟢 刚刚好，保持当前难度节奏</span>
                <CheckCircle2 size={15} />
              </button>
              {currentLevel !== 'B2+' && (
                <button
                  onClick={() => advanceToSentence(2, '🔵 读起来轻松，想继续往上挑战！', 'up')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>🔵 读起来轻松，往上加点挑战</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}
              {currentLevel !== 'A1-' && (
                <button
                  onClick={() => advanceToSentence(2, '🔴 略有阻碍，稍微降低一点点', 'down')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>🔴 略有阻碍，稍降一点更稳</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 5: Rating for Sentence 3 -> Leads to Sentence 4 */}
        {step === 5 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => advanceToSentence(3, '🟢 刚刚好，很有阅读代入感', 'keep')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[13px] sm:text-[13.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>🟢 刚刚好，契合当前阅读心流</span>
                <CheckCircle2 size={15} />
              </button>
              {currentLevel !== 'B2+' && (
                <button
                  onClick={() => advanceToSentence(3, '🔵 游刃有余，第 4 句想冲刺高阶！', 'up')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>🔵 游刃有余，冲刺更高阶</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}
              {currentLevel !== 'A1-' && (
                <button
                  onClick={() => advanceToSentence(3, '🔴 有点吃力，第 4 句微调更基础', 'down')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>🔴 有点吃力，微调更基础一点</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: Rating for Sentence 4 -> Concludes Reading Level */}
        {step === 6 && !isAiTyping && !isBusy && (
          <div className="pl-9 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => completeEvaluation(`🟢 完美契合！就锁定为【${LEVEL_METAS[currentLevel].levelLabel}】`, 'keep')}
                className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[13px] sm:text-[13.5px] font-semibold flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>🟢 完美契合！锁定【{LEVEL_METAS[currentLevel].levelLabel}】</span>
                <CheckCircle2 size={15} />
              </button>
              {currentLevel !== 'B2+' && (
                <button
                  onClick={() => completeEvaluation('🔵 感觉还能再挑战高一阶！', 'up')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>🔵 还能更强，加档一阶挑战</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}
              {currentLevel !== 'A1-' && (
                <button
                  onClick={() => completeEvaluation('🔴 整体有点难，稳妥降一阶起步', 'down')}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[13px] sm:text-[13.5px] font-medium flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer"
                >
                  <span>🔴 稳妥起步，降一阶更轻松</span>
                  <ChevronRight size={15} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 7: Level Locked & Direct Navigation to Stage 8 */}
        {step === 7 && !isAiTyping && (
          <div className="pl-9 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <button
              onClick={() => onComplete(selectedTags, currentLevel)}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-slate-950 text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] cursor-pointer hover:brightness-110"
              style={{
                backgroundColor: companion.accentColor || '#F59E0B'
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
      <div className="shrink-0 p-2.5 sm:p-3 bg-[#0D1017] border-t border-slate-800/80 z-30">
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
                  : step >= 3 && step <= 6
                  ? `输入第 ${Math.max(1, Math.min(4, step - 2))}/4 句阅读感受，如：刚刚好、有点难、太简单...`
                  : '输入消息与伴读互动...'
              }
              className="w-full py-2.5 pl-3.5 pr-3 rounded-xl bg-slate-900 border border-slate-750 text-[13px] sm:text-[13.5px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isAiTyping || isBusy}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-950 font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md shrink-0 active:scale-95 hover:brightness-110"
            style={{
              backgroundColor: companion.accentColor || '#F59E0B'
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
