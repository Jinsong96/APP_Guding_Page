import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Languages,
  MessageCircle,
  MessageCircleOff,
  RotateCcw,
  Sparkles,
  Volume2
} from 'lucide-react';
import { BookmarkedSentence, Companion, CompanionId } from '../../types';
import { OnboardingProgress } from '../OnboardingProgress';
import { CompanionAvatar } from '../CompanionAvatar';
import { CefrLevelKey } from './Stage02AiChat';
import {
  FirstReadArticle,
  FirstReadVocab,
  RATED_PARAGRAPH_COUNT,
  collectLearnedWords,
  findParagraphVocab
} from '../../firstReadArticles';
import { COMPANION_TYPING_INTERVAL_MS, SPEECH_CONTENT_REVEAL_MS } from '../speechTiming';

interface StageFirstReadProps {
  companion: Companion;
  article: FirstReadArticle;
  startLevel?: CefrLevelKey;
  bookmarkedSentences?: BookmarkedSentence[];
  onToggleSentenceBookmark?: (sentence: BookmarkedSentence) => void;
  onBack: () => void;
  onComplete: (finalLevel: CefrLevelKey, learnedWords: FirstReadVocab[]) => void;
}

type Feeling = 'down' | 'keep' | 'up';

const LEVEL_ORDER: CefrLevelKey[] = ['A1-', 'A2', 'B1', 'B2+'];
// Pause after a rating so the choice registers visually before the next paragraph.
const RATING_ADVANCE_DELAY_MS = 400;

const getNextLevel = (current: CefrLevelKey, feeling: Feeling): CefrLevelKey => {
  const index = LEVEL_ORDER.indexOf(current);
  if (feeling === 'up') return LEVEL_ORDER[Math.min(index + 1, LEVEL_ORDER.length - 1)];
  if (feeling === 'down') return LEVEL_ORDER[Math.max(index - 1, 0)];
  return current;
};

type LineMoment = 'start' | 'checkpoint' | 'end';

// IP rule: a companion speaks up at most three times per read, each in its own voice.
// Wick looks back once after three paragraphs, Pal nudges to collect a sentence, Mochi barely speaks.
const COMPANION_LINES: Record<CompanionId, Partial<Record<LineMoment, string>>> = {
  wick: {
    start: '我在前面走，你慢慢跟上。',
    checkpoint: '（灯芯回头看了你一眼）还跟得上吗？',
    end: '快到站了，这一段我陪你走完。'
  },
  pal: {
    start: '出发！遇到好句子，我帮你收藏起来。',
    checkpoint: '这段有好句子，点右上角收藏它吧？',
    end: '最后一段，线索收齐就到站啦！'
  },
  tuanzi: {
    start: '（团子在你旁边安静地趴下了）',
    end: '（团子慢慢眨了一下眼）'
  }
};

const lineMomentFor = (paragraphIdx: number, total: number): LineMoment | null => {
  if (paragraphIdx === 0) return 'start';
  if (paragraphIdx === total - 1) return 'end';
  if (paragraphIdx === 3) return 'checkpoint';
  return null;
};

// The user's first real read: the opening paragraphs double as the placement check, so there
// is no separate test. Each rated paragraph sets the difficulty of the next one.
export const StageFirstRead: React.FC<StageFirstReadProps> = ({
  companion,
  article,
  startLevel = 'A2',
  bookmarkedSentences = [],
  onToggleSentenceBookmark,
  onBack,
  onComplete
}) => {
  const total = article.paragraphs.length;
  const [paragraphIdx, setParagraphIdx] = useState(0);
  const [level, setLevel] = useState<CefrLevelKey>(startLevel);
  // Level each paragraph was shown at, so going back restores what the user saw.
  const [levelHistory, setLevelHistory] = useState<CefrLevelKey[]>([startLevel]);
  // Paragraphs where the user opened the translation, flipped the card or rated it hard.
  const helpedParagraphsRef = useRef<Set<number>>(new Set());
  const [selectedFeeling, setSelectedFeeling] = useState<Feeling | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isQuiet, setIsQuiet] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paragraph = article.paragraphs[paragraphIdx];
  const text = paragraph.text[level];
  const isRated = paragraphIdx < RATED_PARAGRAPH_COUNT;
  const isLast = paragraphIdx === total - 1;
  const highlight = text.match(/^.*?[.!?]["”]?(?=\s|$)/)?.[0] ?? text;
  const remainder = text.slice(highlight.length);
  const bookmark = { sentence: text, translation: paragraph.translation };
  const isBookmarked = bookmarkedSentences.some((item) => item.sentence === text);
  const paragraphVocab = findParagraphVocab(article.vocab, text);
  const lineMoment = lineMomentFor(paragraphIdx, total);
  const companionLine = isQuiet || !lineMoment ? '' : COMPANION_LINES[companion.id][lineMoment] || '';
  const suggestCollect = companion.id === 'pal' && lineMoment === 'checkpoint' && !isQuiet && !isBookmarked;
  const previousLevel = paragraphIdx > 0 ? levelHistory[paragraphIdx - 1] : undefined;
  const levelShift =
    previousLevel && previousLevel !== level
      ? LEVEL_ORDER.indexOf(level) < LEVEL_ORDER.indexOf(previousLevel)
        ? '已调简单一点'
        : '已调难一点'
      : '';

  // Companion line types out when it has something to say, but never blocks reading or rating.
  useEffect(() => {
    const line = companionLine;
    if (!line) {
      setBubbleText('');
      setIsTyping(false);
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBubbleText(line);
      return;
    }
    const characters = Array.from(line);
    let count = 0;
    setBubbleText('');
    setIsTyping(true);
    const timer = window.setInterval(() => {
      count += 1;
      setBubbleText(characters.slice(0, count).join(''));
      if (count >= characters.length) {
        window.clearInterval(timer);
        setIsTyping(false);
      }
    }, COMPANION_TYPING_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [companionLine]);

  useEffect(() => {
    setSelectedFeeling(null);
    setShowTranslation(false);
    setIsCardFlipped(false);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsPlaying(false);
  }, [paragraphIdx]);

  useEffect(
    () => () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    []
  );

  const goToParagraph = (nextIdx: number, nextLevel: CefrLevelKey) => {
    setLevel(nextLevel);
    setLevelHistory((prev) => {
      const next = prev.slice(0, nextIdx);
      next[nextIdx] = nextLevel;
      return next;
    });
    setParagraphIdx(nextIdx);
  };

  const markHelped = () => helpedParagraphsRef.current.add(paragraphIdx);

  const handleRate = (feeling: Feeling) => {
    setSelectedFeeling(feeling);
    if (feeling === 'down') markHelped();
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current);
    const currentIdx = paragraphIdx;
    const nextLevel = getNextLevel(level, feeling);
    advanceTimerRef.current = setTimeout(() => {
      advanceTimerRef.current = null;
      goToParagraph(currentIdx + 1, nextLevel);
    }, RATING_ADVANCE_DELAY_MS);
  };

  const handleNext = () => {
    if (isLast) {
      onComplete(level, collectLearnedWords(article, levelHistory, [...helpedParagraphsRef.current]));
      return;
    }
    goToParagraph(paragraphIdx + 1, level);
  };

  const handlePrev = () => {
    if (advanceTimerRef.current) {
      clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
    if (paragraphIdx === 0) {
      onBack();
      return;
    }
    const prevIdx = paragraphIdx - 1;
    setLevel(levelHistory[prevIdx] || startLevel);
    setParagraphIdx(prevIdx);
  };

  const handlePlay = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const renderActions = () => (
    <div className="grid h-[54px] shrink-0 grid-cols-3 items-center border-t border-[#E5DFF0] bg-white/95 px-2">
      <button
        type="button"
        onClick={() => {
          markHelped();
          setShowTranslation((visible) => !visible);
        }}
        aria-pressed={showTranslation}
        className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-[14px] font-medium transition-colors hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] ${
          showTranslation ? 'text-[#B83825]' : 'text-[#34314F]'
        }`}
      >
        <Languages size={18} />
        <span>{showTranslation ? '隐藏译文' : '译文'}</span>
      </button>
      <button
        type="button"
        onClick={handlePlay}
        aria-label={isPlaying ? '停止朗读' : '朗读这一段'}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-[14px] font-medium text-[#34314F] transition-colors hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
      >
        <Volume2 size={18} className={isPlaying ? 'animate-pulse text-[#B83825]' : 'text-[#514D6E]'} />
        <span>{isPlaying ? '停止' : '朗读'}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          markHelped();
          setIsCardFlipped((flipped) => !flipped);
        }}
        aria-pressed={isCardFlipped}
        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-1 text-[14px] font-medium text-[#34314F] transition-colors hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
      >
        <RotateCcw size={17} />
        <span>{isCardFlipped ? '返回原文' : '翻面解读'}</span>
      </button>
    </div>
  );

  return (
    <div
      className="relative flex h-full w-full select-none flex-col overflow-hidden bg-[#F2EFFA] text-[#171A35]"
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}assets/reading-trial-scene.webp)`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center bottom',
        backgroundSize: '100% auto'
      }}
    >
      <header className="relative z-30 w-full shrink-0 border-b border-[#E5DFF0] bg-[#F2EFFA]/95 px-3 pb-2 pt-1.5">
        <div className="relative flex h-10 items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="返回上一段"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#171A35] shadow-sm transition-colors hover:bg-[#F7F4FC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-110px)] -translate-x-1/2 truncate text-center text-[16px] font-semibold">
            {article.title}
          </h1>
          <button
            type="button"
            onClick={() => onToggleSentenceBookmark?.(bookmark)}
            disabled={!onToggleSentenceBookmark}
            aria-pressed={isBookmarked}
            aria-label={isBookmarked ? '取消收藏这一段' : '收藏这一段'}
            className={`flex h-10 w-10 items-center justify-center rounded-full bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] disabled:opacity-50 ${
              isBookmarked ? 'text-[#B83825]' : 'text-[#171A35] hover:text-[#B83825]'
            } ${suggestCollect ? 'animate-pulse' : ''}`}
            style={suggestCollect ? { boxShadow: '0 0 0 3px rgba(224, 163, 58, 0.55)' } : undefined}
          >
            <Bookmark size={20} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
        <OnboardingProgress phase={3} phaseProgress={(paragraphIdx + 1) / total} className="px-1 pt-1.5" />
      </header>

      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-2 p-3">
        <div className="flex min-h-[64px] shrink-0 items-center gap-2.5">
          <CompanionAvatar companion={companion} size={52} alt={companion.name} className="shadow-sm" />
          <div className="min-w-0 flex-1" role="status" aria-live="polite">
            {companionLine && (
              <div className="relative flex min-h-[52px] w-fit max-w-full items-center rounded-[15px] border border-[#E1DBED] bg-white px-3.5 py-2 shadow-[0_3px_10px_rgba(63,48,90,0.04)] animate-in fade-in duration-200">
                <span className="absolute left-[-7px] top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 border-b border-l border-[#E1DBED] bg-white" />
                <p className="relative text-[15px] font-medium leading-[1.5] text-[#393550]">
                  {bubbleText}
                  {isTyping && (
                    <span aria-hidden="true" className="ml-1 inline-block h-3.5 w-[2px] translate-y-[2px] animate-pulse bg-[#C83E26] motion-reduce:animate-none" />
                  )}
                </p>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIsQuiet((quiet) => !quiet)}
            aria-pressed={isQuiet}
            aria-label={isQuiet ? `让${companion.name}说话` : `让${companion.name}安静`}
            className="flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-1.5 py-1 text-[11px] font-medium text-[#77728D] transition-colors hover:bg-white/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
          >
            {isQuiet ? <MessageCircleOff size={18} /> : <MessageCircle size={18} />}
            <span>{isQuiet ? '已安静' : '安静'}</span>
          </button>
        </div>

        <div className="relative flex min-h-[300px] w-[88%] flex-1 self-center py-2">
          <div aria-hidden="true" className="absolute inset-x-2 bottom-1 top-5 rotate-[-2deg] rounded-[24px] bg-[#8176A8]/30" />
          <div aria-hidden="true" className="absolute inset-x-1 bottom-2 top-4 rotate-[1.2deg] rounded-[24px] bg-[#C83E26]/75" />
          <article
            key={`${paragraphIdx}-${level}`}
            className="relative z-10 flex min-h-0 flex-1 overflow-hidden rounded-[24px] border border-[#E5DFF0] bg-white shadow-[0_12px_28px_rgba(50,38,77,0.10)] animate-in fade-in slide-in-from-right-4"
          >
            <div
              aria-hidden={isCardFlipped}
              className={`absolute inset-0 flex min-h-0 flex-col bg-white ${isCardFlipped ? 'invisible pointer-events-none' : 'animate-in fade-in duration-200'}`}
            >
              <div className="flex-1 overflow-y-auto px-5 pb-4 pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <span className="inline-block rounded-full bg-[#F2EFFA] px-2.5 py-1 text-[12px] font-semibold text-[#766B91]">
                    第 {paragraphIdx + 1} 段 / 共 {total} 段
                  </span>
                  {levelShift && (
                    <span className="inline-block rounded-full bg-[#EEF3EC] px-2.5 py-1 text-[12px] font-medium text-[#4E6B4A]">
                      {levelShift}
                    </span>
                  )}
                </div>
                <p className="text-[19px] font-medium leading-[1.6] text-[#171A35] selection:bg-[#F9DCD5]">
                  <span className="sentence-highlight">{highlight}</span>
                  {remainder}
                </p>
                {showTranslation && (
                  <div className="mt-5 border-l-[3px] border-[#C83E26] bg-[#F8F5FC] px-3.5 py-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <span className="mb-1 block text-[12px] font-semibold text-[#8176A8]">中文译文</span>
                    <p className="text-[15px] leading-7 text-[#49445E]">{paragraph.translation}</p>
                  </div>
                )}
              </div>
              {renderActions()}
            </div>

            <div
              aria-hidden={!isCardFlipped}
              className={`absolute inset-0 flex min-h-0 flex-col bg-white ${isCardFlipped ? 'animate-in fade-in duration-200' : 'invisible pointer-events-none'}`}
            >
              <div
                role="button"
                tabIndex={isCardFlipped ? 0 : -1}
                aria-label="点击返回原文"
                onClick={() => setIsCardFlipped(false)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    setIsCardFlipped(false);
                  }
                }}
                className="flex-1 cursor-pointer overflow-y-auto px-5 pb-4 pt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8176A8]"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2EFFA] px-2.5 py-1 text-[12px] font-semibold text-[#766B91]">
                    <Sparkles size={13} />
                    第 {paragraphIdx + 1} 段解读
                  </span>
                  <span className="text-[11px] text-[#A39DB5]">点击卡片返回原文</span>
                </div>

                <h2 className="text-[13px] font-semibold text-[#B83825]">本段大意</h2>
                <p className="mt-1 text-[15px] font-medium leading-6 text-[#24213C]">{paragraph.gist}</p>

                {paragraphVocab.length > 0 && (
                  <>
                    <h2 className="mt-4 text-[13px] font-semibold text-[#B83825]">重点词汇</h2>
                    <ul className="mt-1.5 divide-y divide-[#F0ECF8] rounded-xl bg-[#F8F5FC] px-3">
                      {paragraphVocab.map((item) => (
                        <li key={item.word} className="flex items-baseline gap-2 py-2">
                          <span className="shrink-0 text-[15px] font-semibold text-[#171A35]">{item.word}</span>
                          {item.phonetic && <span className="shrink-0 text-[12px] text-[#8E88A3]">{item.phonetic}</span>}
                          <span className="ml-auto text-right text-[13px] text-[#49445E]">{item.meaning}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <h2 className="mt-4 text-[13px] font-semibold text-[#B83825]">读句提示</h2>
                <p className="mt-1 text-[14px] leading-6 text-[#49445E]">{paragraph.note}</p>

                <h2 className="mt-4 text-[13px] font-semibold text-[#B83825]">中文译文</h2>
                <p className="mt-1 text-[14px] leading-6 text-[#77728D]">{paragraph.translation}</p>
              </div>
              {renderActions()}
            </div>
          </article>
        </div>

        {isRated ? (
          <div className="grid min-h-[50px] w-full shrink-0 grid-cols-3 gap-2" role="group" aria-label="这一段的阅读难度">
            {([
              ['down', '偏难'],
              ['keep', '刚刚好'],
              ['up', '太简单']
            ] as const).map(([feeling, label], index) => {
              const isSelected = selectedFeeling === feeling;
              return (
                <button
                  key={`${paragraphIdx}-${feeling}`}
                  type="button"
                  onClick={() => handleRate(feeling)}
                  aria-pressed={isSelected}
                  disabled={selectedFeeling !== null}
                  className={`speech-option-enter flex min-h-[50px] w-full items-center justify-center rounded-[14px] border px-2 text-[14px] font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94A30] focus-visible:ring-offset-2 active:scale-[0.98] ${
                    isSelected
                      ? 'border-[#D94A30] bg-[#FBE8E3] text-[#9B3021]'
                      : 'border-[#E3DEEC] bg-white text-[#403C5A] hover:border-[#D7A497] hover:bg-[#FCF8F7]'
                  }`}
                  style={{ animationDelay: `${SPEECH_CONTENT_REVEAL_MS + index * COMPANION_TYPING_INTERVAL_MS}ms` }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-[14px] bg-[#B83825] text-[15px] font-semibold text-white transition-colors hover:bg-[#A52F1D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83825] focus-visible:ring-offset-2"
          >
            <span>{isLast ? '读完了' : '下一段'}</span>
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};
