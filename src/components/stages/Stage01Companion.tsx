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
    <div className="h-full flex flex-col justify-between p-5 text-slate-100 select-none relative overflow-hidden bg-gradient-to-b from-[#141721] via-[#10131B] to-[#0B0D13]">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-mono text-emerald-400 font-semibold tracking-wider">01 / 04</span>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
            建立关系
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          选择谁陪你读
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          不是选老师，是选一个合拍的英语阅读搭子。
        </p>
      </div>

      {/* 3D Carousel Stack Area */}
      <div className="relative my-auto py-2 deck-container flex flex-col items-center">
        <div className="relative w-64 h-[310px] flex items-center justify-center">
          {/* Companions cards */}
          {COMPANIONS.map((companion, idx) => {
            let posClass = 'deck-card-hidden';
            if (idx === currentIndex) posClass = 'deck-card-front';
            else if (idx === (currentIndex - 1 + totalCards) % totalCards) posClass = 'deck-card-left';
            else if (idx === (currentIndex + 1) % totalCards) posClass = 'deck-card-right';

            return (
              <div
                key={companion.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  onSelectCompanion(companion.id);
                }}
                className={`absolute inset-0 rounded-3xl bg-[#191E2B] border border-slate-750 p-4 shadow-2xl flex flex-col items-center justify-between transition-all duration-300 cursor-pointer ${posClass}`}
                style={{
                  boxShadow: idx === currentIndex ? `0 12px 30px -8px ${companion.bgGlow}` : undefined,
                  borderColor: idx === currentIndex ? companion.accentColor : '#252B3C'
                }}
              >
                {/* Check badge */}
                {idx === currentIndex && (
                  <span
                    className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-slate-950 shadow-md font-bold text-xs"
                    style={{ backgroundColor: companion.accentColor }}
                  >
                    <Check size={14} />
                  </span>
                )}

                {/* Avatar */}
                <div className="w-32 h-32 my-auto relative flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
                    style={{ backgroundColor: companion.accentColor }}
                  />
                  <img
                    src={companion.avatarUrl}
                    alt={companion.name}
                    className="w-28 h-28 object-contain drop-shadow-xl relative z-10 transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* Text Content */}
                <div className="text-center w-full pb-1">
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="text-lg font-bold text-white">{companion.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">{companion.nameEn}</span>
                  </div>
                  <div
                    className="text-[11px] font-medium tracking-wide mt-0.5 inline-block px-2 py-0.5 rounded-full"
                    style={{
                      color: companion.accentColor,
                      backgroundColor: `${companion.accentColor}18`
                    }}
                  >
                    {companion.type}
                  </div>
                  <p className="text-xs text-slate-300 italic mt-2 line-clamp-2 px-1 font-serif">
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
                className={`absolute inset-0 rounded-3xl bg-[#181D29] border border-dashed border-slate-700 p-4 shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer ${posClass}`}
              >
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-base font-bold text-white">更多伴读萌宠</h3>
                <span className="text-[11px] text-amber-400/90 font-mono mt-0.5">正在旅程孵化中</span>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed px-2">
                  团子、毛豆还在路上——它们也在等待一位爱读书的朋友。
                </p>
              </div>
            );
          })()}
        </div>

        {/* Carousel controls */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700"
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
                  i === currentIndex ? 'w-5 bg-amber-400' : 'w-1.5 bg-slate-700 hover:bg-slate-600'
                }`}
                aria-label={`跳转到第 ${i + 1} 个卡片`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors border border-slate-700"
            aria-label="下一个旅伴"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-4 rounded-2xl font-semibold text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
          style={{
            backgroundColor: currentCompanion.accentColor || '#F59E0B',
            boxShadow: `0 4px 18px ${currentCompanion.bgGlow}`
          }}
        >
          <span>让 {currentCompanion.name} 陪我出发</span>
          <ArrowRight size={17} />
        </button>

        <button
          onClick={handleRandom}
          className="w-full py-2.5 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-750 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Shuffle size={13} />
          <span>帮我随机选一个</span>
        </button>
      </div>
    </div>
  );
};
