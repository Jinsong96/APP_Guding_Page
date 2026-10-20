import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, BookOpen, Compass, Star } from 'lucide-react';
import { Companion, UserPreferences } from '../../types';

interface Stage08CustomizingProps {
  companion: Companion;
  interestTheme: string;
  selectedThemes?: string[];
  determinedCefr?: string;
  startingLevel?: string;
  preferences?: UserPreferences;
  onUpdatePreferences?: (updated: Partial<UserPreferences>) => void;
  onBack: () => void;
  onNext: () => void;
}

// CEFR to starting level mapping:
// A1- -> L1 (L1, L2, L3)
// A2  -> L4 (L4, L5, L6)
// B1  -> L7 (L7, L8, L9)
// B2+ -> L10 (L10, L11, L12)
export const CEFR_TO_STARTING_LEVEL: Record<string, string> = {
  'A1-': 'L1',
  'A2': 'L4',
  'B1': 'L7',
  'B2+': 'L10'
};

export const Stage08Customizing: React.FC<Stage08CustomizingProps> = ({
  companion,
  interestTheme,
  selectedThemes,
  determinedCefr = 'A2',
  startingLevel,
  preferences,
  onUpdatePreferences,
  onBack,
  onNext
}) => {
  const resolvedStartingLevel =
    (determinedCefr && CEFR_TO_STARTING_LEVEL[determinedCefr]) || startingLevel || 'L4';

  const [progress, setProgress] = useState(10);
  const [activeStep, setActiveStep] = useState(1);
  const [isCalibrated, setIsCalibrated] = useState(false);
  const [celebrateBounces, setCelebrateBounces] = useState(0);

  // Unhurried, relaxing calibration rhythm (takes ~3.6s total)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        const increment = 3;
        const next = prev + increment;
        if (next > 35 && next < 75) setActiveStep(2);
        else if (next >= 75) setActiveStep(3);
        return next > 100 ? 100 : next;
      });
    }, 120);

    return () => clearInterval(timer);
  }, []);

  // When progress hits 100%, hold for a gentle 650ms moment before smoothly blossoming into calibrated profile view
  useEffect(() => {
    if (progress >= 100 && !isCalibrated) {
      const finishTimer = setTimeout(() => {
        setIsCalibrated(true);
      }, 650);
      return () => clearTimeout(finishTimer);
    }
  }, [progress, isCalibrated]);

  const displayThemes =
    selectedThemes && selectedThemes.length > 0
      ? selectedThemes.slice(0, 3).join(' · ')
      : interestTheme || '前沿科技';

  return (
    <div className="h-full flex flex-col justify-between p-4 sm:p-5 text-stone-900 select-none relative overflow-hidden bg-[#FCFDFC]">
      {/* Top Header Bar */}
      <div className="flex items-center pb-3 border-b border-[#DCEBE5] shrink-0 z-20">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-white hover:bg-[#F2F7F4] flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors border border-[#DCEBE5] cursor-pointer"
          aria-label="返回上一步"
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Middle Content Area */}
      <div
        className={`flex-1 flex flex-col items-center overflow-y-auto no-scrollbar z-10 ${
          isCalibrated ? 'justify-center py-2 sm:py-3' : 'justify-start pt-8 sm:pt-10'
        }`}
      >
        {/* Top Companion Hero - Stays at top, gains sparkling & glowing effects when calibrated */}
        <div
          className={`relative flex flex-col items-center text-center shrink-0 ${
            isCalibrated ? 'mb-3 sm:mb-4' : 'mb-1'
          }`}
        >
          <div
            className={`relative flex items-center justify-center ${
              isCalibrated ? 'w-24 h-24 sm:w-28 sm:h-28' : 'w-48 h-48'
            }`}
          >
            {!isCalibrated && (
              <div className="absolute w-20 h-20 rounded-full bg-[#E7F4EE] pointer-events-none" />
            )}
            {/* Halo Glow & Breathing Ambient Light */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
                isCalibrated ? 'animate-companion-glow' : 'opacity-0'
              }`}
              style={{ backgroundColor: companion.accentColor }}
            />

            {/* Soft Ambient Breathing Ring when Calibrated (No aggressive ping/flash) */}
            {isCalibrated && (
              <div
                className="absolute -inset-2.5 rounded-full border pointer-events-none animate-companion-glow"
                style={{ borderColor: `${companion.accentColor}45` }}
              />
            )}

            {/* Soft Sparkle Icons Floating Around Companion with gentle pacing */}
            {!isCalibrated && (
              <span className="absolute top-10 right-2 text-emerald-500 pointer-events-none">
                <Sparkles size={18} />
              </span>
            )}

            {isCalibrated && (
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute -top-1 -right-1 text-emerald-500/90 animate-sparkle-soft-1">
                  <Sparkles size={16} />
                </span>
                <span className="absolute top-1/2 -left-2 text-emerald-600/80 animate-sparkle-soft-2">
                  <Star size={13} fill="#059669" />
                </span>
                <span className="absolute -bottom-1 right-2 text-emerald-500/75 animate-sparkle-spin-slow">
                  <Sparkles size={14} />
                </span>
              </div>
            )}

            {/* Companion Avatar Image: keeps 100% of the original 3D character design, style, and details */}
            <img
              key={isCalibrated ? `${companion.id}-celebrate-${celebrateBounces}` : `${companion.id}-normal`}
              src={companion.avatarUrl}
              alt={companion.name}
              className={`${
                isCalibrated ? 'w-20 h-20 sm:w-24 sm:h-24' : 'w-44 h-44'
              } object-contain relative z-10 drop-shadow-md select-none transition-transform duration-300 ${
                isCalibrated
                  ? 'animate-celebrate-action hover:scale-105 active:scale-95 cursor-pointer'
                  : 'animate-companion-float scale-100'
              }`}
              onClick={() => {
                if (isCalibrated) {
                  setCelebrateBounces((prev) => prev + 1);
                }
              }}
              title={isCalibrated ? '点击让它再次欢呼跳跃！' : undefined}
            />
          </div>
        </div>

        {/* Phase 1: Generating & Customizing (Before 100%) */}
        {!isCalibrated ? (
          <div className="w-full max-w-sm sm:max-w-md px-1 flex flex-col items-center text-center animate-in fade-in duration-300">
            <div className="text-center mb-5 px-2 animate-title-entrance">
              <h1 className="text-xl font-bold text-[#26372F] leading-snug">
                {companion.name}在读你的兴趣与水平
              </h1>
            </div>

            <div className="w-full bg-[#DCEEE6] h-[5px] rounded-full overflow-hidden mb-9">
              <div
                className="h-full bg-[#079B6B] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="w-full text-left divide-y divide-[#DFE9E4]">
              <div
                className={`min-h-[72px] px-1 flex items-center justify-between gap-3 transition-opacity duration-300 ${
                  activeStep >= 1 ? 'opacity-100' : 'opacity-45'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#079B6B] text-white flex items-center justify-center shrink-0">
                    <Check size={15} className="stroke-[2.5]" />
                  </span>
                  <span className="text-[15px] font-semibold text-[#26372F]">兴趣领域</span>
                </div>
                <span
                  className="max-w-[44%] truncate text-right text-[13px] font-medium text-[#26785D]"
                  title={displayThemes}
                >
                  {displayThemes}
                </span>
              </div>

              <div
                className={`min-h-[72px] px-1 flex items-center justify-between gap-3 transition-opacity duration-300 ${
                  activeStep >= 2 ? 'opacity-100' : 'opacity-45'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#079B6B] text-white flex items-center justify-center shrink-0">
                    <Check size={15} className="stroke-[2.5]" />
                  </span>
                  <span className="text-[15px] font-semibold text-[#26372F]">阅读偏好</span>
                </div>
                <span className="shrink-0 text-[13px] font-medium text-[#26785D]">已同步</span>
              </div>

              <div
                className={`min-h-[72px] px-1 flex items-center justify-between gap-3 transition-opacity duration-300 ${
                  activeStep >= 3 ? 'opacity-100' : 'opacity-45'
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-[#079B6B] text-white flex items-center justify-center shrink-0">
                    <Check size={15} className="stroke-[2.5]" />
                  </span>
                  <span className="text-[15px] font-semibold text-[#26372F]">定制画像</span>
                </div>
                <span className="shrink-0 text-[13px] font-medium text-[#26785D]">已就绪</span>
              </div>
            </div>
          </div>
        ) : (
          /* Phase 2: Calibrated Stage (Duolingo reference style, boxes removed, clean and concise) */
          <div className="w-full max-w-sm sm:max-w-md px-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Duolingo-style Starting Level Anchor Badge */}
            <div className="relative mb-4 flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-700 ease-out">
              {/* Dynamic warm light pulse glow */}
              <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-md animate-pulse opacity-50 pointer-events-none" />

              {/* Centered Pill Badge */}
              <div className="relative inline-flex items-center justify-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-400 shadow-md shadow-emerald-900/10 transition-transform duration-300 hover:scale-102">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-800 tracking-wider">
                  建议阅读起点
                </span>
                <strong className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 leading-none tracking-tight">
                  {resolvedStartingLevel}
                </strong>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 mb-8">
              从这里开始，刚刚好
            </h1>

            {/* Duolingo Tactile 3D Action Button */}
            <button
              onClick={onNext}
              className="w-full h-13 sm:h-14 rounded-2xl bg-[#526F65] font-black text-white text-base sm:text-lg flex items-center justify-center gap-2 transition-all hover:bg-[#456257] active:bg-[#3D574D] active:translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-2 cursor-pointer"
            >
              <span>开启阅读体验</span>
              <ArrowRight size={19} className="stroke-[2.5]" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
