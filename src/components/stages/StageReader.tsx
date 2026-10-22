import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Headphones, MoreHorizontal, Sparkles, VolumeX, X } from 'lucide-react';
import { Companion, ReadingLevel } from '../../types';
import { FIRST_STORY } from '../../data';
import { WordLookupModal } from '../WordLookupModal';
import { CompanionAvatar } from '../CompanionAvatar';

interface StageReaderProps {
  stageNumber: 4 | 5 | 6;
  stageTitle: string;
  progressPct: number;
  timeRemaining: string;
  badgeLabel?: string;
  currentLevel: ReadingLevel;
  companion: Companion;
  bookmarkedWords: string[];
  onToggleBookmark: (word: string) => void;
  onBack: () => void;
  onRateDifficulty: (rating: 'hard' | 'just_right' | 'easy', selectedLevel?: ReadingLevel) => void;
}

const PARAGRAPH_TRANSLATIONS: Record<ReadingLevel, string[]> = {
  easy: [
    '晚上9点47分，灯光熄灭了。整座城市都停了电。高耸的玻璃大楼消失在红色尘土中。',
    '玛拉等待救援，但没有人来。接着，一台老机器人从街道下方的黑暗隧道里走了出来。',
    '“我知道另一条路，”机器人说。“路会更远一些，但很安全。我们不需要城市电脑。”'
  ],
  mid: [
    '晚上21:47，整座城市的灯光突然熄灭。玻璃大楼消失在红色尘土中。',
    '玛拉等着应急系统启动，但什么也没有发生。随后，一台老旧的维修机器人从街道下方的隧道里出现。',
    '“我知道另一条路，”它说。那条路更远一些，但不依赖城市网络。'
  ],
  hard: [
    '21:47，整座城市的电网突然瘫痪；那些玻璃大楼仿佛消融进了早已等候多时的红色尘土。',
    '玛拉等着应急系统回应，却始终没有消息。随后，一台老维修机器人从街道下方的隧道里走出，神情从容，仿佛多年前就预料到了这个夜晚。',
    '“还有另一条路，”它说。“当然会更远。但它不依赖城市网络，而今晚，只有这一点最重要。”'
  ]
};

const VOCAB_TERMS = [
  'emerged',
  'came out of',
  'walked out of',
  'unhurried',
  'dissolved',
  'emergency system',
  'grid'
];

export const StageReader: React.FC<StageReaderProps> = ({
  stageNumber,
  stageTitle,
  timeRemaining,
  currentLevel: initialLevel,
  companion,
  bookmarkedWords,
  onToggleBookmark,
  onBack,
  onRateDifficulty
}) => {
  const [activeLevel, setActiveLevel] = useState<ReadingLevel>(initialLevel);
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [activeVocabWord, setActiveVocabWord] = useState<string | null>(null);
  const [hasInteractedOnStage6, setHasInteractedOnStage6] = useState(false);
  const [animatingText, setAnimatingText] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const swipeStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveLevel(initialLevel);
  }, [initialLevel]);

  useEffect(() => {
    setParagraphIndex(0);
    setHasInteractedOnStage6(false);
  }, [stageNumber]);

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const storyContent = FIRST_STORY.levels[activeLevel];
  const paragraphs = storyContent.paragraphs;
  const currentParagraph = paragraphs[paragraphIndex] || paragraphs[0];
  const currentTranslation = PARAGRAPH_TRANSLATIONS[activeLevel][paragraphIndex] || '';
  const totalParagraphs = paragraphs.length;
  const currentPosition = (stageNumber - 4) * totalParagraphs + paragraphIndex + 1;
  const totalPosition = totalParagraphs * 3;
  const stageStarts = [0, 36, 68];
  const stageEnds = [36, 68, 100];
  const progress = stageStarts[stageNumber - 4] +
    (stageEnds[stageNumber - 4] - stageStarts[stageNumber - 4]) * ((paragraphIndex + 1) / totalParagraphs);

  const handleDifficultyClick = (rating: 'hard' | 'just_right' | 'easy') => {
    const targetLevel: ReadingLevel =
      rating === 'hard' ? 'easy' : rating === 'easy' ? 'hard' : 'mid';

    if (stageNumber === 6) {
      setAnimatingText(true);
      setActiveLevel(targetLevel);
      setHasInteractedOnStage6(true);
      window.setTimeout(() => setAnimatingText(false), 300);
    } else {
      onRateDifficulty(rating, targetLevel);
    }
  };

  const handleStage6Proceed = () => {
    const rating = activeLevel === 'easy' ? 'hard' : activeLevel === 'hard' ? 'easy' : 'just_right';
    onRateDifficulty(rating, activeLevel);
  };

  const handleNext = () => {
    if (paragraphIndex < totalParagraphs - 1) {
      setParagraphIndex((current) => current + 1);
    } else if (stageNumber === 6) {
      handleStage6Proceed();
    } else {
      onRateDifficulty('just_right', activeLevel);
    }
  };

  const handlePrevious = () => {
    if (paragraphIndex > 0) {
      setParagraphIndex((current) => current - 1);
    } else {
      onBack();
    }
  };

  const handleCardTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleCardTouchEnd = (event: React.TouchEvent<HTMLElement>) => {
    if (swipeStartX.current === null) return;
    const deltaX = event.changedTouches[0]?.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (deltaX <= -52) handleNext();
    if (deltaX >= 52) handlePrevious();
  };

  const handleListen = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(paragraphs.join(' '));
    utterance.lang = 'en-US';
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const renderParagraph = (text: string) => {
    const regex = new RegExp(`(${VOCAB_TERMS.join('|')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const matchKey = VOCAB_TERMS.find((term) => term.toLowerCase() === part.toLowerCase());
      if (!matchKey || !FIRST_STORY.keyVocab[matchKey]) {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }

      return (
        <button
          key={index}
          type="button"
          onClick={() => setActiveVocabWord(matchKey)}
          className="cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-600"
          aria-label={`查看词汇 ${part} 的释义`}
        >
          {part}
        </button>
      );
    });
  };

  return (
    <div className="h-full flex flex-col gap-3 px-5 pt-3 pb-3 text-[#171A35] relative overflow-hidden bg-[#F4F0FA]">
      <header className="shrink-0">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-11 h-11 rounded-full bg-white border border-[#E5DFF0] flex items-center justify-center text-[#171A35] shadow-sm"
            aria-label="返回"
          >
            <ArrowLeft size={21} />
          </button>
          <h1 className="min-w-0 flex-1 text-center text-[16px] font-semibold truncate">
            {FIRST_STORY.title}
          </h1>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMore((shown) => !shown)}
              className="w-11 h-11 rounded-full bg-white border border-[#E5DFF0] flex items-center justify-center text-[#171A35] shadow-sm"
              aria-label="阅读设置"
              aria-expanded={showMore}
            >
              <MoreHorizontal size={22} />
            </button>
            {showMore && (
              <div className="absolute right-0 top-12 z-30 w-60 p-2 rounded-2xl bg-white border border-[#E5DFF0] shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowTranslation((visible) => !visible);
                  }}
                  className="w-full min-h-11 px-3 rounded-xl text-left text-sm hover:bg-[#F4F0FA]"
                >
                  {showTranslation ? '隐藏中文译文' : '显示中文译文'}
                </button>
                <div className="my-2 border-t border-[#E8E2EF]" />
                <p className="px-2 mb-2 text-xs font-medium text-[#77728A]">这段读起来感觉如何？</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    ['hard', '偏难'],
                    ['just_right', '刚好'],
                    ['easy', '简单']
                  ] as const).map(([rating, label]) => {
                    const isActive = stageNumber === 6 && (
                      (rating === 'hard' && activeLevel === 'easy') ||
                      (rating === 'just_right' && activeLevel === 'mid') ||
                      (rating === 'easy' && activeLevel === 'hard')
                    );
                    return (
                      <button
                        key={rating}
                        type="button"
                        onClick={() => {
                          handleDifficultyClick(rating);
                          setShowMore(false);
                        }}
                        aria-pressed={isActive}
                        className={`min-h-11 rounded-xl border text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-emerald-700 border-emerald-700 text-white'
                            : 'bg-[#F5F2FA] border-[#E5DFF0] text-[#38344F] hover:bg-[#F0ECF8]'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 px-2 text-[11px] text-[#8A9B94]">{stageTitle} · {timeRemaining}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div
            className="h-2 flex-1 rounded-full bg-[#E6E1EF] overflow-hidden"
            role="progressbar"
            aria-label={`${stageTitle}阅读进度`}
            aria-valuemin={0}
            aria-valuemax={totalPosition}
            aria-valuenow={currentPosition}
          >
            <div
              className="h-full rounded-full bg-lime-400 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-sm font-medium text-[#77728A]">
            {String(currentPosition).padStart(2, '0')} / {String(totalPosition).padStart(2, '0')}
          </span>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div
          aria-hidden="true"
          className="absolute top-7 right-0 bottom-7 w-8 rounded-r-[28px] bg-[#E9E3F2] border border-[#DBD3EB]"
        />
        <main
          onTouchStart={handleCardTouchStart}
          onTouchEnd={handleCardTouchEnd}
          onTouchCancel={() => {
            swipeStartX.current = null;
          }}
          aria-label="阅读卡片，向左或向右滑动翻页"
          className={`absolute left-1/2 top-1/2 h-[min(72%,560px)] min-h-[320px] w-[min(76%,320px)] -translate-x-1/2 -translate-y-1/2 rounded-[30px] bg-white border border-[#E8E2EF] shadow-[0_10px_0_#C9BEE6,0_18px_28px_rgba(42,32,71,0.08)] overflow-visible touch-pan-y transition-[opacity,transform] duration-300 ${
            animatingText ? 'opacity-50' : 'opacity-100'
          }`}
        >
          <article className="absolute inset-0 overflow-y-auto px-10 py-7">
            <div className="relative z-10 min-h-full flex flex-col justify-start">
              <p className="text-justify text-[24px] leading-[1.5] font-normal text-[#171A35]">
                {renderParagraph(currentParagraph)}
              </p>
              {showTranslation && (
                  <p className="mt-7 text-[16px] leading-[1.8] text-[#706B82]">
                  {currentTranslation}
                </p>
              )}
            </div>
          </article>

          <button
            type="button"
            onClick={handlePrevious}
            className="absolute -left-8 top-1/2 z-20 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 border border-[#E6E1EF] flex items-center justify-center text-[#171A35] shadow-sm"
            aria-label={paragraphIndex === 0 ? '返回上一步' : '上一段'}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-8 top-1/2 z-20 -translate-y-1/2 w-11 h-11 rounded-full bg-white/95 border border-[#E6E1EF] flex items-center justify-center text-[#171A35] shadow-sm"
            aria-label={paragraphIndex === totalParagraphs - 1 ? '继续阅读' : '下一段'}
          >
            <ArrowRight size={20} />
          </button>

          <CompanionAvatar
            companion={companion}
            size={56}
            alt={`${companion.name}陪你阅读`}
            className="pointer-events-none absolute right-3 -top-10 z-10 shadow-md"
          />
        </main>
      </div>

      <section className="shrink-0" aria-label="阅读操作">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleListen}
            className="min-h-14 rounded-full bg-white border border-[#E5DFF0] text-[#171A35] font-semibold flex items-center justify-center gap-2 shadow-[0_5px_0_#E7E1F0] transition-transform active:scale-[0.98]"
          >
            {isSpeaking ? <VolumeX size={18} /> : <Headphones size={18} />}
            <span>{isSpeaking ? '停止朗读' : '听全文'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowBreakdown(true)}
            className="min-h-14 rounded-full bg-[#B83825] hover:bg-[#A52F1D] text-white font-semibold flex items-center justify-center gap-2 shadow-[0_5px_0_#8C281A] transition-transform active:scale-[0.98]"
          >
            <Sparkles size={18} />
            <span>AI 解读</span>
          </button>
        </div>
        {stageNumber === 6 && hasInteractedOnStage6 && (
          <button
            type="button"
            onClick={handleStage6Proceed}
            className="w-full mt-2 h-10 rounded-full bg-emerald-700 text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Check size={16} />
            完成阅读
          </button>
        )}
      </section>

      {showBreakdown && (
        <div className="absolute inset-0 z-40 flex items-end justify-center bg-[#1D1A32]/35 p-3">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="reading-breakdown-title"
            className="w-full rounded-[24px] bg-white border border-[#E5DFF0] p-5 shadow-xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={17} className="text-emerald-700" />
                <h2 id="reading-breakdown-title" className="font-bold text-[#171A35]">AI 解读</h2>
              </div>
              <button
                type="button"
                onClick={() => setShowBreakdown(false)}
                className="w-9 h-9 rounded-full bg-[#F4F0FA] flex items-center justify-center"
                aria-label="关闭解读"
              >
                <X size={18} />
              </button>
            </div>
            <p className="text-sm leading-relaxed text-[#38344F]">{currentParagraph}</p>
            <p className="mt-3 p-3 rounded-xl bg-[#F4F0FA] text-sm leading-relaxed text-[#706B82]">
              阅读提示：先找到句子的主语和动作，再留意时间、地点等补充信息。点击高亮词汇可以查看释义。
            </p>
            <button
              type="button"
              onClick={() => setShowBreakdown(false)}
              className="w-full mt-4 h-11 rounded-full bg-emerald-700 text-white text-sm font-semibold"
            >
              返回阅读
            </button>
          </section>
        </div>
      )}

      {activeVocabWord && FIRST_STORY.keyVocab[activeVocabWord] && (
        <WordLookupModal
          vocab={FIRST_STORY.keyVocab[activeVocabWord]}
          companion={companion}
          isBookmarked={bookmarkedWords.includes(activeVocabWord)}
          onToggleBookmark={onToggleBookmark}
          onClose={() => setActiveVocabWord(null)}
        />
      )}
    </div>
  );
};
