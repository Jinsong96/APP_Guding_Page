import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Companion, ReadingLevel, Story } from '../../types';
import { FIRST_STORY } from '../../data';
import { WordLookupModal } from '../WordLookupModal';

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

export const StageReader: React.FC<StageReaderProps> = ({
  stageNumber,
  progressPct,
  timeRemaining,
  currentLevel: initialLevel,
  companion,
  bookmarkedWords,
  onToggleBookmark,
  onBack,
  onRateDifficulty
}) => {
  const [activeLevel, setActiveLevel] = useState<ReadingLevel>(initialLevel);
  const [activeVocabWord, setActiveVocabWord] = useState<string | null>(null);
  const [hasInteractedOnStage6, setHasInteractedOnStage6] = useState<boolean>(false);
  const [animatingText, setAnimatingText] = useState<boolean>(false);

  useEffect(() => {
    setActiveLevel(initialLevel);
  }, [initialLevel]);

  const storyContent = FIRST_STORY.levels[activeLevel] || FIRST_STORY.levels.mid;

  const handleDifficultyClick = (rating: 'hard' | 'just_right' | 'easy') => {
    let targetLevel: ReadingLevel = 'mid';
    if (rating === 'hard') targetLevel = 'easy';      // A1
    else if (rating === 'easy') targetLevel = 'hard';  // B1
    else targetLevel = 'mid';                          // A2

    if (stageNumber === 6) {
      // In Stage 06: instantly morph article text in-place so user directly observes CEFR adaptation
      setAnimatingText(true);
      setActiveLevel(targetLevel);
      setHasInteractedOnStage6(true);
      setTimeout(() => setAnimatingText(false), 300);
    } else {
      // In Stage 04 & 05: advance to next stage with new level
      onRateDifficulty(rating, targetLevel);
    }
  };

  const handleStage6Proceed = () => {
    const rating = activeLevel === 'easy' ? 'hard' : activeLevel === 'hard' ? 'easy' : 'just_right';
    onRateDifficulty(rating, activeLevel);
  };

  // Helper to render readable paragraphs
  const renderParagraph = (text: string, pIdx: number) => {
    const terms = [
      'emerged',
      'came out of',
      'walked out of',
      'unhurried',
      'dissolved',
      'emergency system',
      'grid'
    ];

    const regex = new RegExp(`(${terms.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <p
        key={pIdx}
        className="leading-[1.85] text-stone-900 font-serif text-[16px] sm:text-[17px] mb-5 tracking-normal transition-opacity duration-300"
      >
        {parts.map((part, idx) => {
          const matchKey = terms.find((t) => t.toLowerCase() === part.toLowerCase());
          if (matchKey && FIRST_STORY.keyVocab[matchKey]) {
            const isBookmarked = bookmarkedWords.includes(matchKey);
            return (
              <span
                key={idx}
                onClick={() => setActiveVocabWord(matchKey)}
                role="button"
                tabIndex={0}
                className={`cursor-pointer px-1 py-0.5 rounded transition-all font-sans font-medium border-b ${
                  isBookmarked
                    ? 'bg-amber-100 text-amber-900 border-amber-500'
                    : 'bg-emerald-100/70 text-emerald-900 border-emerald-500 hover:bg-emerald-100'
                }`}
                title="点击查看释义"
              >
                {part}
              </span>
            );
          }
          return <span key={idx}>{part}</span>;
        })}
      </p>
    );
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 text-stone-900 select-none relative overflow-hidden bg-[#FAF6ED]">
      {/* 1. Minimal Header */}
      <div className="shrink-0 pb-3 border-b border-[#E8DFC8]">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F2ECE1] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#E2D8C6] shadow-xs cursor-pointer"
            aria-label="返回上一步"
          >
            <ArrowLeft size={16} />
          </button>

          {/* Minimal Progress Line */}
          <div className="flex-1 mx-4 flex items-center gap-2.5">
            <div className="flex-1 h-1.5 bg-[#E8DFC8] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-[11px] font-mono text-stone-500 shrink-0">
              {timeRemaining}
            </span>
          </div>

          <span className="text-[11px] text-stone-500 font-mono">
            0{stageNumber}/10
          </span>
        </div>

        {/* Quiet Kicker & Title */}
        <div className="mt-3.5">
          <div className="text-[11px] text-stone-500 mb-1 flex items-center gap-1.5">
            <span>科学大陆</span>
            <span>·</span>
            <span>第 {stageNumber - 3} / 4 段</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif tracking-tight leading-snug">
            The 47th Minute Without Power
          </h1>
        </div>
      </div>

      {/* 2. Focused Article Body (Center Stage) */}
      <div 
        className={`flex-1 overflow-y-auto py-5 px-2 no-scrollbar transition-all duration-300 ${
          animatingText ? 'opacity-40 scale-[0.99]' : 'opacity-100 scale-100'
        }`}
      >
        {storyContent.paragraphs.map((p, idx) => renderParagraph(p, idx))}
      </div>

      {/* 3. Minimal Bottom Adaptive Interaction */}
      <div className="shrink-0 pt-3 pb-1 border-t border-[#E8DFC8] space-y-2.5">
        <p className="text-xs text-center text-stone-500 font-medium">
          你感觉这个难度怎么样？
        </p>

        {/* The 3 Pure Feedback Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleDifficultyClick('hard')}
            className={`py-3 px-2 rounded-2xl border text-xs sm:text-[13px] font-medium transition-all text-center active:scale-98 cursor-pointer ${
              stageNumber === 6 && activeLevel === 'easy'
                ? 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-sm'
                : 'bg-white border-[#E8DFC8] hover:bg-[#F8F4EC] text-stone-800 hover:text-stone-950 shadow-xs'
            }`}
          >
            有点难了
          </button>

          <button
            onClick={() => handleDifficultyClick('just_right')}
            className={`py-3 px-2 rounded-2xl border text-xs sm:text-[13px] font-medium transition-all text-center active:scale-98 cursor-pointer ${
              stageNumber === 6 && activeLevel === 'mid'
                ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-sm'
                : 'bg-white border-[#E8DFC8] hover:bg-[#F8F4EC] text-stone-800 hover:text-stone-950 shadow-xs'
            }`}
          >
            刚刚好
          </button>

          <button
            onClick={() => handleDifficultyClick('easy')}
            className={`py-3 px-2 rounded-2xl border text-xs sm:text-[13px] font-medium transition-all text-center active:scale-98 cursor-pointer ${
              stageNumber === 6 && activeLevel === 'hard'
                ? 'bg-sky-600 text-white font-bold border-sky-600 shadow-sm'
                : 'bg-white border-[#E8DFC8] hover:bg-[#F8F4EC] text-stone-800 hover:text-stone-950 shadow-xs'
            }`}
          >
            简简单单
          </button>
        </div>

        {/* Stage 06 Confirmation Button when ready */}
        {stageNumber === 6 && (
          <div className="pt-1 animate-in fade-in duration-200">
            <button
              onClick={handleStage6Proceed}
              className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-550 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <span>{hasInteractedOnStage6 ? '完成试读，生成我的专属路线' : '继续下一步'}</span>
              <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Word Lookup Modal on Tap */}
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
