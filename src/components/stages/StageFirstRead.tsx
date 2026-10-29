import React, { useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Heart,
  Languages,
  RotateCcw,
  Star,
  Volume2,
  X
} from 'lucide-react';
import { BookmarkedSentence, Companion, CompanionId, ReadSummary } from '../../types';
import { CompanionAvatar } from '../CompanionAvatar';
import { TypedLine } from '../TypedLine';
import { MiniProgramHeader } from '../MiniProgramHeader';
import { CefrLevelKey } from './Stage02AiChat';
import { FirstReadArticle, findParagraphVocab } from '../../firstReadArticles';
import { COMPANION_TYPING_INTERVAL_MS } from '../speechTiming';

interface StageFirstReadProps {
  companion: Companion;
  article: FirstReadArticle;
  // Every paragraph is shown at this level (the difficulty picked on 03).
  level?: CefrLevelKey;
  bookmarkedSentences?: BookmarkedSentence[];
  bookmarkedWords?: string[];
  onToggleWordBookmark?: (word: string) => void;
  onToggleSentenceBookmark?: (sentence: BookmarkedSentence) => void;
  isArticleLiked?: boolean;
  isArticleBookmarked?: boolean;
  onToggleArticleLike?: () => void;
  onToggleArticleBookmark?: () => void;
  onBack: () => void;
  onComplete: (summary: ReadSummary) => void;
}

type LineMoment = 'start' | 'checkpoint' | 'end';

// IP rule: a companion speaks up at most three times per read, each in its own voice.
// The first line always teaches tapping a word for help, the core "stuck? someone helps" moment.
// Wick guides gently and looks back now and then; Pal is the bookish scholar; Tuanzi talks tough but cares.
// \n marks where a line may wrap in the bubble, so it never breaks mid-phrase.
const COMPANION_LINES: Record<CompanionId, Partial<Record<LineMoment, string>>> = {
  wick: {
    start: '遇到不认识的词，点一下，\n我在旁边轻声告诉你。',
    checkpoint: '（灯芯回头看了看你）\n走得很稳，我们继续。',
    end: '最后一段了，\n我在前面等你到站。'
  },
  pal: {
    start: '生词点一下，\n意思和来历我都知道！',
    checkpoint: '好词记下来！\n词句本就是你的笔记。',
    end: '最后一段，\n读完又多知道一点点！'
  },
  tuanzi: {
    start: '……别硬扛，\n不认识就点一下。',
    checkpoint: '（打了个哈欠）\n读得还行嘛，继续。',
    end: '最后一段了。\n慢慢读，我又不急。'
  }
};

const lineMomentFor = (paragraphIdx: number, total: number): LineMoment | null => {
  if (paragraphIdx === 0) return 'start';
  if (paragraphIdx === total - 1) return 'end';
  if (paragraphIdx === 3) return 'checkpoint';
  return null;
};

// The reader for every article opened from the reading home: one paragraph per card at the chosen
// level, tap a word to look it up, companion lines at the start, a checkpoint and the end.
export const StageFirstRead: React.FC<StageFirstReadProps> = ({
  companion,
  article,
  level = 'A2',
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
  const [showTranslation, setShowTranslation] = useState(false);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [playing, setPlaying] = useState<'card' | 'full' | null>(null);
  const [lookupWord, setLookupWord] = useState<string | null>(null);
  // Words the user looked up (lowercased); the first lookup also ends the "tap a word" hint.
  const [lookedUpWords, setLookedUpWords] = useState<string[]>([]);
  const [bubbleText, setBubbleText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const startedAtRef = useRef(Date.now());
  // Horizontal swipe on the card turns pages, like the arrows.
  const swipeStartXRef = useRef<number | null>(null);

  const paragraph = article.paragraphs[paragraphIdx];
  const text = paragraph.text[level];
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

  // Companion line types out when it has something to say, but never blocks reading.
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
    setIsCardFlipped(false);
    setLookupWord(null);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setPlaying(null);
  }, [paragraphIdx]);

  useEffect(
    () => () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    },
    []
  );

  const openLookup = (word: string) => {
    setLookupWord(word);
    setLookedUpWords((prev) => (prev.includes(word.toLowerCase()) ? prev : [...prev, word.toLowerCase()]));
  };

  const handleNext = () => {
    if (isLast) {
      const wordsRead = article.paragraphs.reduce(
        (sum, part) => sum + (part.text[level].match(/[A-Za-z']+/g)?.length ?? 0),
        0
      );
      onComplete({
        lookedUpWords: lookedUpWords.length,
        wordsRead,
        seconds: Math.round((Date.now() - startedAtRef.current) / 1000)
      });
      return;
    }
    setParagraphIdx(paragraphIdx + 1);
  };

  const handlePrev = () => {
    if (paragraphIdx === 0) {
      onBack();
      return;
    }
    setParagraphIdx(paragraphIdx - 1);
  };

  const handlePlay = (kind: 'card' | 'full') => {
    if (!('speechSynthesis' in window)) return;
    if (playing === kind) {
      window.speechSynthesis.cancel();
      setPlaying(null);
      return;
    }
    const spokenText = kind === 'card' ? text : article.paragraphs.map((part) => part.text[level]).join(' ');
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

  // Up to two upcoming cards peek out behind the current one, as in a deck.
  const ghostCards = [
    { scale: 0.955, offsetY: 31, background: '#FAF8FF' },
    { scale: 0.91, offsetY: 60, background: '#EEE9F6' }
  ].slice(0, Math.min(2, total - 1 - paragraphIdx));

  const handleSwipeEnd = (clientX: number) => {
    const startX = swipeStartXRef.current;
    swipeStartXRef.current = null;
    if (startX === null || isCardFlipped || lookupWord) return;
    const deltaX = clientX - startX;
    if (deltaX < -50) handleNext();
    else if (deltaX > 50 && paragraphIdx > 0) handlePrev();
  };

  const renderWord = (part: string, index: number) => {
    const word = part.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, '');
    if (!word) return <React.Fragment key={index}>{part}</React.Fragment>;
    return (
      <React.Fragment key={index}>
        {part.slice(0, part.indexOf(word))}
        <button
          type="button"
          className={isHintWord(word) ? 'tap-hint-word' : undefined}
          onClick={() => openLookup(word)}
          aria-label={`查询 ${word}`}
        >
          {word}
        </button>
        {part.slice(part.indexOf(word) + word.length)}
      </React.Fragment>
    );
  };

  return (
    <div
      className="rj-page"
      style={{ '--rj-bg': `url(${import.meta.env.BASE_URL}assets/journey-bg.jpg)` } as React.CSSProperties}
    >
      <MiniProgramHeader title={article.title} onBack={onBack} />

      <div className="rj-progress-row">
        <div
          className="rj-progress"
          role="progressbar"
          aria-label="文章阅读进度"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={paragraphIdx + 1}
        >
          <div className="rj-progress-track">
            <i style={{ width: `${((paragraphIdx + 1) / total) * 100}%` }} />
          </div>
          <span>{paragraphIdx + 1} / {total}</span>
        </div>
        <div className="rj-article-actions">
          <button type="button" onClick={onToggleArticleLike} aria-label="喜欢文章" aria-pressed={isArticleLiked}>
            <Heart size={21} strokeWidth={1.6} fill={isArticleLiked ? 'currentColor' : 'none'} />
          </button>
          <button type="button" onClick={onToggleArticleBookmark} aria-label="收藏文章" aria-pressed={isArticleBookmarked}>
            <Star size={21} strokeWidth={1.6} fill={isArticleBookmarked ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <div className="rj-companion-row is-over-cards">
        <CompanionAvatar companion={companion} size={44} alt={companion.name} frameless className="rj-avatar" />
        <div className="min-w-0 flex-1" role="status" aria-atomic="true">
          {companionLine && (
            <div className="rj-bubble">
              <TypedLine text={companionLine} typed={bubbleText} isTyping={isTyping} />
            </div>
          )}
        </div>
      </div>

      <div
        className="rj-cards-region"
        onPointerDown={(event) => {
          swipeStartXRef.current = event.clientX;
        }}
        onPointerUp={(event) => handleSwipeEnd(event.clientX)}
        onPointerCancel={() => {
          swipeStartXRef.current = null;
        }}
      >
        <div className="rj-card-slot">
          {ghostCards.map((ghost, index) => (
            <div
              key={index}
              aria-hidden="true"
              className="rj-ghost"
              style={{
                background: ghost.background,
                transform: `translateY(${ghost.offsetY}px) scale(${ghost.scale})`,
                transformOrigin: 'top center',
                zIndex: -1 - index
              }}
            />
          ))}
          <div aria-hidden="true" className="rj-underlay" />
          <div key={`${paragraphIdx}-${level}`} className="rj-flip rj-card-enter">
            <div className={`rj-flip-inner ${isCardFlipped ? 'is-flipped' : ''}`}>
              <article className="rj-card" aria-hidden={isCardFlipped}>
                <div className="rj-reading-area">
                  <div className="rj-prose">
                    <p className="rj-english">{text.split(/(\s+)/).map(renderWord)}</p>
                    {showTranslation && <p className="rj-translation">{paragraph.translation}</p>}
                  </div>
                </div>
                <div className="rj-card-tools">
                  <button type="button" onClick={() => handlePlay('card')} className={playing === 'card' ? 'is-active' : undefined}>
                    <Volume2 size={18} strokeWidth={1.6} />
                    <span>{playing === 'card' ? '停止' : '朗读'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTranslation((visible) => !visible)}
                    aria-pressed={showTranslation}
                  >
                    <Languages size={18} strokeWidth={1.6} />
                    <span>{showTranslation ? '收起' : '译文'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCardFlipped(true)}
                  >
                    <RotateCcw size={18} strokeWidth={1.6} />
                    <span>解读</span>
                  </button>
                </div>
              </article>

              <article className="rj-card rj-card-back" aria-hidden={!isCardFlipped}>
                <div className="rj-reading-area rj-analysis">
                  <p className="rj-analysis-label">AI 解读</p>
                  <h2>读懂这一段</h2>
                  <p className="rj-analysis-text">{paragraph.note}</p>
                  {paragraphVocab.length > 0 && <hr />}
                  {paragraphVocab.slice(0, 3).map((item) => (
                    <React.Fragment key={item.word}>
                      <p className="rj-analysis-phrase">{item.word}</p>
                      <p className="rj-analysis-text">{item.meaning}</p>
                    </React.Fragment>
                  ))}
                  <p className="rj-translation" style={{ marginTop: 12 }}>{paragraph.translation}</p>
                </div>
                <div className="rj-card-tools">
                  <button type="button" onClick={() => setIsCardFlipped(false)}>
                    <RotateCcw size={18} strokeWidth={1.6} />
                    <span>返回原文</span>
                  </button>
                  <button type="button" onClick={() => handlePlay('card')} className={playing === 'card' ? 'is-active' : undefined}>
                    <Volume2 size={18} strokeWidth={1.6} />
                    <span>{playing === 'card' ? '停止' : '朗读本卡'}</span>
                  </button>
                  <button type="button" onClick={() => onToggleSentenceBookmark?.(bookmark)} aria-pressed={isBookmarked}>
                    <Bookmark size={18} strokeWidth={1.6} fill={isBookmarked ? 'currentColor' : 'none'} />
                    <span>{isBookmarked ? '已收藏' : '收藏'}</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>

        {paragraphIdx > 0 && (
          <button type="button" onClick={handlePrev} aria-label="上一张" className="rj-page-arrow is-prev">
            <ChevronLeft size={18} />
          </button>
        )}
        <button
          type="button"
          onClick={handleNext}
          aria-label={isLast ? '完成阅读' : '下一张'}
          className="rj-page-arrow is-next"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => handlePlay('full')}
        aria-label={playing === 'full' ? '停止听全文' : '听全文'}
        className={`rj-listen ${playing === 'full' ? 'is-playing' : ''}`}
      >
        <Headphones size={19} strokeWidth={1.6} />
        <span>{playing === 'full' ? '停止' : '听全文'}</span>
      </button>

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
