import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  Bookmark,
  Headphones,
  Heart,
  Languages,
  RotateCcw,
  Sparkles,
  Star,
  Volume2,
  X
} from 'lucide-react';
import { BookmarkedSentence, Companion, CompanionId, ReadSummary } from '../../types';
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
  // 'onboarding' shows the onboarding step bar; 'library' (reads opened from home) shows reading progress.
  mode?: 'onboarding' | 'library';
  // When false, no difficulty rating: every paragraph is read at startLevel with a plain "下一段".
  rated?: boolean;
  bookmarkedSentences?: BookmarkedSentence[];
  bookmarkedWords?: string[];
  onToggleWordBookmark?: (word: string) => void;
  onToggleSentenceBookmark?: (sentence: BookmarkedSentence) => void;
  isArticleLiked?: boolean;
  isArticleBookmarked?: boolean;
  onToggleArticleLike?: () => void;
  onToggleArticleBookmark?: () => void;
  onBack: () => void;
  onComplete: (finalLevel: CefrLevelKey, learnedWords: FirstReadVocab[], summary: ReadSummary) => void;
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
// The first line always teaches tapping a word for help, the core "stuck? someone helps" moment.
// Wick guides quietly and looks back now and then; Pal plays detective and collects; Tuanzi barely speaks.
const COMPANION_LINES: Record<CompanionId, Partial<Record<LineMoment, string>>> = {
  wick: {
    start: '遇到不认识的词，点一下，我在旁边轻声告诉你。',
    checkpoint: '（灯芯回头看了看你）走得很稳，我们继续。',
    end: '最后一段了，我在前面等你到站。'
  },
  pal: {
    start: '发现不认识的词？点它！我来帮你破案～',
    checkpoint: '线索越来越多啦！查到的词可以加入词句本，我帮你收着。',
    end: '最后一段，线索集齐就到站！'
  },
  tuanzi: {
    start: '（团子用尾巴轻轻点了点一个词：卡住了就点一下）',
    end: '（团子慢慢眨了一下眼，陪你读完最后一段）'
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
  mode = 'onboarding',
  rated = true,
  bookmarkedSentences = [],
  bookmarkedWords = [],
  onToggleWordBookmark,
  onToggleSentenceBookmark,
  isArticleLiked = false,
  isArticleBookmarked = false,
  onToggleArticleLike,
  onToggleArticleBookmark,
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
  const [playing, setPlaying] = useState<'card' | 'full' | null>(null);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  // Words the user looked up (lowercased); the first lookup also ends the "tap a word" hint.
  const [lookedUpWords, setLookedUpWords] = useState<string[]>([]);
  const [bubbleText, setBubbleText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const paragraph = article.paragraphs[paragraphIdx];
  const text = paragraph.text[level];
  const isRated = rated && paragraphIdx < RATED_PARAGRAPH_COUNT;
  const isLast = paragraphIdx === total - 1;
  const bookmark = { sentence: text, translation: paragraph.translation };
  const isBookmarked = bookmarkedSentences.some((item) => item.sentence === text);
  const paragraphVocab = findParagraphVocab(article.vocab, text);
  // Until the first lookup, gently pulse the first key word of paragraph 1 to show words are tappable.
  const hintWord =
    paragraphIdx === 0 && lookedUpWords.length === 0
      ? findParagraphVocab(article.vocab, text, 1)[0]
      : undefined;
  const isHintWord = (word: string) =>
    !!hintWord && (hintWord.forms || [hintWord.word]).some((form) => form.toLowerCase() === word.toLowerCase());
  const lineMoment = lineMomentFor(paragraphIdx, total);
  const companionLine = !lineMoment ? '' : COMPANION_LINES[companion.id][lineMoment] || '';
  const lookupVocab = lookupWord ? article.vocab.find((item) =>
    (item.forms || [item.word]).some((form) => form.toLowerCase() === lookupWord.toLowerCase())
  ) : undefined;
  const contextSentence = lookupWord
    ? text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.find((sentence) =>
        sentence.toLowerCase().split(/[^a-z]+/).includes(lookupWord.toLowerCase())
      )?.trim() || text
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
    setIsCardFlipped(false);
    setLookupWord(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(null);
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

  const openLookup = (word: string) => {
    markHelped();
    setLookupWord(word);
    setLookedUpWords((prev) => (prev.includes(word.toLowerCase()) ? prev : [...prev, word.toLowerCase()]));
  };

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
      const wordsRead = article.paragraphs.reduce((sum, part, index) => {
        const shownLevel = levelHistory[index] || level;
        return sum + (part.text[shownLevel].match(/[A-Za-z']+/g)?.length ?? 0);
      }, 0);
      onComplete(level, collectLearnedWords(article, levelHistory, [...helpedParagraphsRef.current]), {
        lookedUpWords: lookedUpWords.length,
        wordsRead
      });
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

  const handlePlay = (kind: 'card' | 'full') => {
    if (!('speechSynthesis' in window)) return;
    if (playing === kind) {
      window.speechSynthesis.cancel();
      setPlaying(null);
      return;
    }
    const spokenText = kind === 'card' ? text : article.paragraphs.map((part, index) =>
      part.text[levelHistory[index] || level]
    ).join(' ');
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setPlaying(null);
    utterance.onerror = () => setPlaying(null);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setPlaying(kind);
  };

  const pronounceWord = (accent: 'en-GB' | 'en-US') => {
    if (!lookupWord || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setPlaying(null);
    const utterance = new SpeechSynthesisUtterance(lookupWord);
    utterance.lang = accent;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const renderActions = () => (
    <div className="grid h-[48px] shrink-0 grid-cols-3 items-center border-t border-[#E7E4EB] bg-white px-2">
      <button
        type="button"
        onClick={() => handlePlay('card')}
        aria-label={playing === 'card' ? '停止朗读本卡' : '朗读本卡'}
        className="inline-flex min-h-11 items-center justify-center gap-1 rounded px-1 text-[12px] text-[#27283D] hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
      >
        <Volume2 size={15} className={playing === 'card' ? 'animate-pulse text-[#B83825]' : ''} />
        <span>{playing === 'card' ? '停止' : '朗读'}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          markHelped();
          setShowTranslation((visible) => !visible);
        }}
        aria-pressed={showTranslation}
        className={`inline-flex min-h-11 items-center justify-center gap-1 rounded px-1 text-[12px] hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] ${showTranslation ? 'text-[#B83825]' : 'text-[#27283D]'}`}
      >
        <Languages size={15} />
        <span>{showTranslation ? '收起' : '译文'}</span>
      </button>
      <button
        type="button"
        onClick={() => {
          markHelped();
          setIsCardFlipped((flipped) => !flipped);
        }}
        aria-pressed={isCardFlipped}
        className="inline-flex min-h-11 items-center justify-center gap-1 rounded px-1 text-[12px] text-[#27283D] hover:bg-[#F5F2FA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
      >
        <RotateCcw size={15} />
        <span>{isCardFlipped ? '原文' : '解读'}</span>
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
      <header className="relative z-30 w-full shrink-0 bg-[#F2EFFA]/90 px-4 pb-2 pt-1.5">
        <div className="relative flex h-10 items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="返回上一段"
            className="flex h-10 w-9 shrink-0 items-center justify-center text-[#25263C] transition-colors hover:text-[#B83825] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="pointer-events-none absolute left-1/2 max-w-[calc(100%-110px)] -translate-x-1/2 truncate text-center text-[16px] font-semibold">
            {article.title}
          </h1>
          <div className="w-9" />
        </div>
        <div className="flex h-9 items-center gap-2.5 px-1">
          <div
            className="flex min-w-0 flex-1 items-center gap-2"
            role="progressbar"
            aria-label="文章阅读进度"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={paragraphIdx + 1}
          >
            <div className="h-[3px] min-w-0 flex-1 overflow-hidden rounded-full bg-[#DAD8E3]">
              <span
                className="block h-full rounded-full bg-[#B84E42] transition-[width] duration-500 ease-out"
                style={{ width: `${((paragraphIdx + 1) / total) * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-[10px] tabular-nums text-[#777689]">{paragraphIdx + 1} / {total}</span>
          </div>
          <button type="button" onClick={onToggleArticleLike} aria-label="喜欢文章" aria-pressed={isArticleLiked} className={`flex h-9 w-7 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] ${isArticleLiked ? 'text-[#B83825]' : 'text-[#626274]'}`}>
            <Heart size={17} fill={isArticleLiked ? 'currentColor' : 'none'} />
          </button>
          <button type="button" onClick={onToggleArticleBookmark} aria-label="收藏文章" aria-pressed={isArticleBookmarked} className={`flex h-9 w-7 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8] ${isArticleBookmarked ? 'text-[#B83825]' : 'text-[#626274]'}`}>
            <Star size={17} fill={isArticleBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </header>

      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-2 px-3 pb-3">
        <div className="flex min-h-[68px] shrink-0 items-center gap-3">
          <CompanionAvatar companion={companion} size={56} alt={companion.name} className="shadow-sm" />
          <div className="min-w-0 flex-1" role="status" aria-live="polite">
            {companionLine && (
              <div className="relative flex min-h-[56px] w-fit max-w-full items-center rounded-[12px] border border-[#E1DBED] bg-white px-4 py-2 shadow-[0_3px_10px_rgba(63,48,90,0.04)] animate-in fade-in duration-200">
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
        </div>

        <div className="relative my-auto flex h-[440px] min-h-[300px] w-[78%] shrink-0 self-center py-2">
          <div aria-hidden="true" className="absolute inset-x-0 bottom-1 top-5 rounded-[17px] bg-[#B84E42]/75" />
          <article
            key={`${paragraphIdx}-${level}`}
            className="relative z-10 flex min-h-0 flex-1 overflow-hidden rounded-[17px] bg-white shadow-[0_12px_28px_rgba(50,38,77,0.10)] animate-in fade-in slide-in-from-right-4"
          >
            <div
              aria-hidden={isCardFlipped}
              className={`absolute inset-0 flex min-h-0 flex-col bg-white ${isCardFlipped ? 'invisible pointer-events-none' : 'animate-in fade-in duration-200'}`}
            >
              <div className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto px-4 py-5">
                <div className="max-h-full overflow-y-auto">
                <p className="text-justify text-[20px] font-normal leading-[1.6] text-[#171A35] selection:bg-[#F9DCD5]">
                  {text.split(/(\s+)/).map((part, index) => {
                    const word = part.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
                    return word ? (
                      <React.Fragment key={index}>
                        {part.slice(0, part.indexOf(word))}
                        <button
                          type="button"
                          className={`inline rounded-sm text-inherit hover:text-[#B83825] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B83825] ${
                            isHintWord(word) ? 'tap-hint-word' : ''
                          }`}
                          onClick={() => openLookup(word)}
                          aria-label={`查询 ${word}`}
                        >
                          {word}
                        </button>
                        {part.slice(part.indexOf(word) + word.length)}
                      </React.Fragment>
                    ) : <React.Fragment key={index}>{part}</React.Fragment>;
                  })}
                </p>
                {showTranslation && (
                  <p className="mt-4 text-[12px] leading-[1.6] text-[#92909B] animate-in fade-in duration-200">{paragraph.translation}</p>
                )}
                </div>
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
                <button type="button" onClick={(event) => { event.stopPropagation(); onToggleSentenceBookmark?.(bookmark); }} aria-pressed={isBookmarked} className={`mt-4 inline-flex items-center gap-1.5 text-[13px] ${isBookmarked ? 'text-[#B83825]' : 'text-[#514D6E]'}`}>
                  <Bookmark size={15} fill={isBookmarked ? 'currentColor' : 'none'} />{isBookmarked ? '已收藏本段' : '收藏本段'}
                </button>
              </div>
              {renderActions()}
            </div>
          </article>
        </div>

        <button type="button" onClick={() => handlePlay('full')} aria-label={playing === 'full' ? '停止听全文' : '听全文'} className="flex h-8 shrink-0 items-center justify-center gap-1.5 text-[12px] text-[#34314F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]">
          <Headphones size={15} className={playing === 'full' ? 'animate-pulse text-[#B83825]' : ''} />{playing === 'full' ? '停止' : '听全文'}
        </button>

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
          </button>
        )}
      </div>
      {lookupWord && (
        <div className="absolute inset-0 z-50 flex items-end bg-[#171A35]/25" onClick={() => setLookupWord(null)}>
          <section role="dialog" aria-modal="true" aria-label={`${lookupWord} 查词`} className="w-full rounded-t-[18px] bg-white px-5 pb-5 pt-2 shadow-[0_-10px_30px_rgba(20,20,40,0.14)]" onClick={(event) => event.stopPropagation()}>
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#DDDAE2]" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold text-[#222239]">{lookupWord}</h2>
                {lookupVocab && <p className="mt-1 text-[13px] text-[#B83825]">{lookupVocab.meaning}</p>}
                {lookupVocab?.phonetic && <p className="mt-1 text-[11px] text-[#858393]">{lookupVocab.phonetic}</p>}
              </div>
              <button type="button" onClick={() => setLookupWord(null)} aria-label="关闭查词" className="flex h-8 w-8 items-center justify-center text-[#858393] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"><X size={16} /></button>
            </div>
            <div className="mt-4 flex gap-5 border-b border-[#ECEAF0] pb-4">
              {([['en-GB', '英'], ['en-US', '美']] as const).map(([accent, label]) => (
                <button key={accent} type="button" onClick={() => pronounceWord(accent)} className="inline-flex items-center gap-1.5 text-[12px] text-[#55536A]">
                  <span className="text-[10px]">{label}</span> 听发音 <Volume2 size={14} className="text-[#B84E42]" />
                </button>
              ))}
            </div>
            <h3 className="mt-4 text-[13px] font-medium text-[#222239]">结合原文理解</h3>
            <p className="mt-4 text-[12px] leading-5 text-[#777585]">{contextSentence}</p>
            <p className="mt-1 text-[12px] leading-5 text-[#9997A4]">{paragraph.translation}</p>
            <button type="button" onClick={() => onToggleWordBookmark?.(lookupVocab?.word || lookupWord.toLowerCase())} aria-pressed={bookmarkedWords.includes(lookupVocab?.word || lookupWord.toLowerCase())} className="mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-[6px] bg-[#24253F] text-[12px] text-white">
              <Bookmark size={14} />{bookmarkedWords.includes(lookupVocab?.word || lookupWord.toLowerCase()) ? '已加入词句本 · 点击移除' : '加入词句本'}
            </button>
          </section>
        </div>
      )}
    </div>
  );
};
