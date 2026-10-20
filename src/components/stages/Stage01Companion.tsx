import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Shuffle, Sparkles, Check } from 'lucide-react';
import { Companion, CompanionId } from '../../types';
import { COMPANIONS } from '../../data';

interface Stage01CompanionProps {
  selectedCompanionId: CompanionId;
  onSelectCompanion: (id: CompanionId) => void;
  onNext: () => void;
}

export const Stage01Companion: React.FC<Stage01CompanionProps> = ({
  selectedCompanionId,
  onSelectCompanion,
  onNext
}) => {
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = COMPANIONS.findIndex(c => c.id === selectedCompanionId);
    return idx >= 0 ? idx : 0;
  });

  const moreIndex = COMPANIONS.length;
  const totalCards = COMPANIONS.length + 1;

  const handlePrev = () => {
    const nextIdx = (currentIndex - 1 + totalCards) % totalCards;
    setCurrentIndex(nextIdx);
    if (nextIdx < COMPANIONS.length) {
      onSelectCompanion(COMPANIONS[nextIdx].id);
    }
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % totalCards;
    setCurrentIndex(nextIdx);
    if (nextIdx < COMPANIONS.length) {
      onSelectCompanion(COMPANIONS[nextIdx].id);
    }
  };

  const handleRandom = () => {
    const randomIdx = Math.floor(Math.random() * COMPANIONS.length);
    setCurrentIndex(randomIdx);
    onSelectCompanion(COMPANIONS[randomIdx].id);
  };

  const selectedCompanion = COMPANIONS.find((c) => c.id === selectedCompanionId) || COMPANIONS[0];
  const browsingMore = currentIndex === moreIndex;

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 py-3 text-stone-800 select-none relative overflow-y-auto no-scrollbar bg-[#F0F8F4]">
      <div className="w-full max-w-[280px] flex flex-col items-center">
        <div className="w-full text-left mb-4 px-1">
          <p className="text-xs font-semibold text-emerald-700 mb-1">一鹿知 · 开始阅读旅程</p>
          <h1 className="text-[21px] font-bold leading-tight text-stone-900">
            选一位伴读伙伴
          </h1>
          <p className="text-xs text-stone-500 mt-1">找到最适合你的阅读节奏</p>
        </div>

        <div className="relative deck-container flex flex-col items-center">
          <div className="relative w-64 h-[285px] flex items-center justify-center">
            {/* Companions cards */}
            {COMPANIONS.map((companion, idx) => {
              let posClass = 'deck-card-hidden';
              if (idx === currentIndex) posClass = 'deck-card-front';
              else if (idx === (currentIndex - 1 + totalCards) % totalCards) posClass = 'deck-card-left';
              else if (idx === (currentIndex + 1) % totalCards) posClass = 'deck-card-right';

              const isLight = companion.id === 'light';

              return (
                <div
                  key={companion.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    onSelectCompanion(companion.id);
                  }}
                  className={`absolute inset-0 rounded-3xl border p-4 shadow-lg flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${posClass}`}
                  style={{
                    boxShadow: companion.id === selectedCompanionId
                      ? isLight
                        ? '0 16px 36px -8px rgba(16, 100, 78, 0.18)'
                        : '0 16px 36px -10px rgba(28, 25, 23, 0.14)'
                      : undefined,
                    borderColor: companion.id === selectedCompanionId
                      ? isLight
                        ? '#75D8B5'
                        : companion.accentColor
                      : '#DCEBE5',
                    background: isLight
                      ? '#FFFFFF'
                      : '#FFFFFF'
                  }}
                >
                  {companion.id === selectedCompanionId && (
                    <span
                      className="absolute top-3 right-3 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-sm font-bold text-xs bg-emerald-500 text-white"
                      style={{
                        color: '#FFFFFF'
                      }}
                    >
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                  )}

                  <div className={`w-32 h-32 my-auto relative flex items-center justify-center rounded-full ${isLight ? 'bg-[#F0F8F4]' : 'bg-[#F5F6F4]'}`}>
                    <img
                      src={companion.avatarUrl}
                      alt={companion.name}
                      className="w-28 h-28 object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <div className="text-center w-full pb-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="text-lg font-bold text-stone-900">{companion.name}</h3>
                      <span className="text-xs text-stone-400">{companion.nameEn}</span>
                    </div>
                    <div
                      className="text-[11px] font-bold mt-0.5 inline-block px-2.5 py-0.5 rounded-full"
                      style={{
                        color: isLight ? '#087A59' : companion.accentColor,
                        backgroundColor: isLight ? '#E6F8F0' : `${companion.accentColor}18`,
                      }}
                    >
                      {companion.type}
                    </div>
                    <p className="text-xs text-stone-600 mt-2 line-clamp-2 px-1">
                      {companion.quote}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* 5th Card: More coming soon */}
            {(() => {
              const idx = moreIndex;
              let posClass = 'deck-card-hidden';
              if (idx === currentIndex) posClass = 'deck-card-front';
              else if (idx === (currentIndex - 1 + totalCards) % totalCards) posClass = 'deck-card-left';
              else if (idx === (currentIndex + 1) % totalCards) posClass = 'deck-card-right';

              return (
                <div
                  key="coming-soon"
                  onClick={() => setCurrentIndex(idx)}
                  className={`absolute inset-0 rounded-3xl bg-[#F5FBF8] border border-dashed border-[#BDDCCF] p-4 shadow-sm flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${posClass}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white border border-[#DCEBE4] flex items-center justify-center text-emerald-700 mb-3">
                    <Sparkles size={24} aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">更多伴读萌宠</h3>
                  <span className="text-[11px] text-emerald-700 mt-1">即将加入</span>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed px-2">
                    新伙伴正在准备中，先选一位现有旅伴开始阅读吧。
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#EAF4EF] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#DCEBE5] shadow-xs cursor-pointer"
              aria-label="上一个旅伴"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalCards }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setCurrentIndex(i);
                    if (i < COMPANIONS.length) onSelectCompanion(COMPANIONS[i].id);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'w-5 bg-emerald-600' : 'w-1.5 bg-[#C9D9D1] hover:bg-[#91B9A7]'
                  }`}
                  aria-label={i === moreIndex ? '浏览更多伴读萌宠' : `选择${COMPANIONS[i].name}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#EAF4EF] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#DCEBE5] shadow-xs cursor-pointer"
              aria-label="下一个旅伴"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="w-full mt-3">
          <p className="text-center text-xs text-stone-500 mb-2">
            {browsingMore ? `当前选择：${selectedCompanion.name}` : `已选择：${selectedCompanion.name}`}
          </p>
          <button
            onClick={onNext}
            className="w-full min-h-12 px-4 rounded-2xl flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm transition-colors active:scale-[0.99] cursor-pointer"
          >
            <span>{browsingMore ? `继续使用${selectedCompanion.name}` : `让${selectedCompanion.name}陪我出发`}</span>
            <ArrowRight size={17} />
          </button>

          <button
            onClick={handleRandom}
            className="w-full mt-2 min-h-10 px-4 rounded-xl text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-[#F4F8F6] border border-[#DCEBE4] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Shuffle size={13} />
            <span>帮我随机选一个</span>
          </button>
        </div>
      </div>
    </div>
  );
};
