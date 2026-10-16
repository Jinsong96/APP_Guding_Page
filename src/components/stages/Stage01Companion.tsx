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

  const totalCards = COMPANIONS.length + 1; // +1 for "更多萌宠"

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

  const currentCompanion = COMPANIONS[currentIndex] || COMPANIONS[0];

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 py-3 text-stone-800 select-none relative overflow-y-auto no-scrollbar bg-[#FAF6ED]">
      <div className="w-full max-w-[280px] sm:max-w-[290px] flex flex-col items-center">
        {/* Centered Title directly above cards with entrance & gradient animation */}
        <div className="text-center mb-2.5 sm:mb-3 px-2 relative animate-title-entrance">
          <div className="absolute -inset-x-4 -inset-y-1.5 bg-gradient-to-r from-amber-200/20 via-orange-100/30 to-amber-200/20 blur-md pointer-events-none rounded-full -z-10" />
          <h1 className="text-[18px] sm:text-[19px] font-bold tracking-tight leading-snug animate-title-gradient">
            选一只合拍的萌宠搭子，
            <br />
            陪你轻松读英语吧
          </h1>
        </div>

        {/* 3D Carousel Stack Area */}
        <div className="relative deck-container flex flex-col items-center">
          <div className="relative w-64 h-[285px] sm:h-[295px] flex items-center justify-center">
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
                  className={`absolute inset-0 rounded-3xl border p-4 shadow-xl flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${posClass}`}
                  style={{
                    boxShadow: idx === currentIndex
                      ? isLight
                        ? '0 16px 36px -8px rgba(245, 158, 11, 0.35), 0 0 24px rgba(254, 240, 138, 0.3)'
                        : `0 16px 36px -10px rgba(180, 100, 20, 0.16)`
                      : undefined,
                    borderColor: idx === currentIndex
                      ? isLight
                        ? '#F59E0B'
                        : companion.accentColor
                      : '#E8DFC8',
                    background: isLight
                      ? 'radial-gradient(120% 120% at 50% 20%, #FFFDF5 0%, #FEFCE8 50%, #FEF9C3 100%)'
                      : '#FFFFFF'
                  }}
                >
                  {/* Check badge */}
                  {idx === currentIndex && (
                    <span
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center shadow-md font-bold text-xs"
                      style={{
                        background: isLight
                          ? 'linear-gradient(135deg, #FDE047 0%, #F59E0B 100%)'
                          : companion.accentColor,
                        color: isLight ? '#1C1917' : '#FFFFFF'
                      }}
                    >
                      <Check size={14} className={isLight ? 'stroke-[2.5]' : ''} />
                    </span>
                  )}

                  {/* Avatar with bright golden astrolabe aura for Light */}
                  <div className="w-32 h-32 my-auto relative flex items-center justify-center">
                    {isLight ? (
                      <>
                        {/* Astrolabe radiant golden sun halo */}
                        <div
                          className="absolute inset-1 rounded-full opacity-75 animate-pulse"
                          style={{
                            background: 'radial-gradient(circle, #FEF08A 0%, #FDE047 40%, #F59E0B 80%, transparent 100%)',
                            filter: 'blur(15px)'
                          }}
                        />
                        {/* Delicate rotating golden astrolabe orbit ring */}
                        <div
                          className="absolute w-26 h-26 rounded-full border border-amber-300/60 opacity-60 animate-spin-slow pointer-events-none"
                          style={{
                            boxShadow: '0 0 16px rgba(251, 191, 36, 0.4)'
                          }}
                        />
                      </>
                    ) : (
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse"
                        style={{ backgroundColor: companion.accentColor }}
                      />
                    )}
                    <img
                      src={companion.avatarUrl}
                      alt={companion.name}
                      className="w-28 h-28 object-contain drop-shadow-md relative z-10 transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  {/* Text Content */}
                  <div className="text-center w-full pb-1">
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="text-lg font-bold text-stone-900">{companion.name}</h3>
                      <span className="text-xs text-stone-400 font-mono">{companion.nameEn}</span>
                    </div>
                    <div
                      className="text-[11px] font-bold tracking-wide mt-0.5 inline-block px-2.5 py-0.5 rounded-full"
                      style={{
                        color: isLight ? '#92400E' : companion.accentColor,
                        backgroundColor: isLight ? '#FEF3C7' : `${companion.accentColor}18`,
                        borderWidth: isLight ? 1 : 0,
                        borderColor: isLight ? '#FDE68A' : undefined
                      }}
                    >
                      {companion.type}
                    </div>
                    <p className="text-xs text-stone-600 italic mt-2 line-clamp-2 px-1 font-serif">
                      {companion.quote}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* 5th Card: More coming soon */}
            {(() => {
              const idx = 4;
              let posClass = 'deck-card-hidden';
              if (idx === currentIndex) posClass = 'deck-card-front';
              else if (idx === (currentIndex - 1 + totalCards) % totalCards) posClass = 'deck-card-left';
              else if (idx === (currentIndex + 1) % totalCards) posClass = 'deck-card-right';

              return (
                <div
                  key="coming-soon"
                  onClick={() => setCurrentIndex(idx)}
                  className={`absolute inset-0 rounded-3xl bg-[#FAF6ED] border border-dashed border-[#D5CABB] p-4 shadow-md flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${posClass}`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 mb-3">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="text-base font-bold text-stone-900">更多伴读萌宠</h3>
                  <span className="text-[11px] text-amber-600 font-mono mt-0.5">正在旅程孵化中</span>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed px-2">
                    团子、毛豆还在路上——它们也在等待一位爱读书的朋友。
                  </p>
                </div>
              );
            })()}
          </div>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-3">
            <button
              onClick={handlePrev}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#F4ECE0] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#E2D8C6] shadow-xs cursor-pointer"
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
                    i === currentIndex ? 'w-5 bg-amber-600' : 'w-1.5 bg-[#DCD2C0] hover:bg-[#C2B59F]'
                  }`}
                  aria-label={`跳转到第 ${i + 1} 个卡片`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-9 h-9 rounded-full bg-[#FFFFFF] hover:bg-[#F4ECE0] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#E2D8C6] shadow-xs cursor-pointer"
              aria-label="下一个旅伴"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Action Buttons - connected directly below carousel with cohesive spacing */}
        <div className="w-full space-y-2 mt-4 sm:mt-4.5">
          <button
            onClick={onNext}
            className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
              currentCompanion.id === 'light' ? 'text-stone-950 font-black' : 'text-white font-semibold'
            }`}
            style={
              currentCompanion.id === 'light'
                ? {
                    background: 'linear-gradient(135deg, #FDE047 0%, #F59E0B 50%, #D97706 100%)',
                    boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
                  }
                : {
                    backgroundColor: currentCompanion.accentColor || '#D97706',
                    boxShadow: `0 6px 20px rgba(180, 100, 20, 0.25)`
                  }
            }
          >
            <span>让 {currentCompanion.name} 陪我出发</span>
            <ArrowRight size={17} className={currentCompanion.id === 'light' ? 'text-stone-950' : 'text-white'} />
          </button>

          <button
            onClick={handleRandom}
            className="w-full py-2.5 px-4 rounded-xl text-xs text-stone-600 hover:text-stone-900 bg-[#FFFFFF] hover:bg-[#F4ECE0] border border-[#E2D8C6] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Shuffle size={13} />
            <span>帮我随机选一个</span>
          </button>
        </div>
      </div>
    </div>
  );
};
