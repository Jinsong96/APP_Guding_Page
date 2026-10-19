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
    <div className="h-full flex flex-col justify-between p-4 sm:p-5 text-stone-900 select-none relative overflow-hidden bg-[#FAF6ED]">
      {/* Background Ambient Cosmic Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-20 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${companion.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Top Header Bar */}
      <div className="flex items-center pb-3 border-b border-[#E8DFC8] shrink-0 z-20">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white hover:bg-[#F2ECE1] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#E2D8C6] shadow-xs cursor-pointer"
          aria-label="返回上一步"
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      {/* Middle Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-2 sm:py-3 overflow-y-auto no-scrollbar z-10">
        {/* Top Companion Hero - Stays at top, gains sparkling & glowing effects when calibrated */}
        <div className="relative flex flex-col items-center text-center shrink-0 mb-3 sm:mb-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Halo Glow & Breathing Ambient Light */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 pointer-events-none ${
                isCalibrated ? 'animate-companion-glow' : 'opacity-30 animate-halo'
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
            {isCalibrated && (
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute -top-1 -right-1 text-amber-500/90 animate-sparkle-soft-1">
                  <Sparkles size={16} />
                </span>
                <span className="absolute top-1/2 -left-2 text-emerald-600/80 animate-sparkle-soft-2">
                  <Star size={13} fill="#059669" />
                </span>
                <span className="absolute -bottom-1 right-2 text-amber-500/75 animate-sparkle-spin-slow">
                  <Sparkles size={14} />
                </span>
              </div>
            )}

            {/* Companion Avatar Image: keeps 100% of the original 3D character design, style, and details */}
            <img
              key={isCalibrated ? `${companion.id}-celebrate-${celebrateBounces}` : `${companion.id}-normal`}
              src={isCalibrated && companion.id === 'light' ? '/assets/light_happy.png' : companion.avatarUrl}
              alt={companion.name}
              className={`w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10 drop-shadow-md select-none transition-transform duration-300 ${
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
            {/* Centered Title matching homepage '选一只合拍的萌宠搭子' typography and animated gradient */}
            <div className="text-center mb-3 sm:mb-4 px-2 relative animate-title-entrance">
              <div className="absolute -inset-x-4 -inset-y-1.5 bg-gradient-to-r from-amber-200/20 via-orange-100/30 to-amber-200/20 blur-md pointer-events-none rounded-full -z-10" />
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-stone-900 leading-snug animate-title-gradient">
                {companion.name}在读你的兴趣与水平
              </h1>
            </div>

            {/* Clean Warm Progress Track */}
            <div className="w-full bg-amber-100/70 h-2 rounded-full overflow-hidden p-0.5 border border-amber-200/80 mb-5 shadow-2xs">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* 3 Step Cards - Unified with Duolingo & Next Screen Typography */}
            <div className="w-full space-y-3 text-left">
              {/* Card 1: 锁定兴趣领域 */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 shadow-xs ${
                  activeStep >= 1
                    ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50/80 border-amber-400/90 shadow-sm shadow-amber-900/5'
                    : 'bg-white/70 border-[#E8DFC8]/70 text-stone-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold transition-colors ${
                      activeStep >= 1
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Check size={14} className="stroke-[2.5]" />
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-800 tracking-wider">
                    锁定兴趣领域
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80 font-bold text-xs sm:text-[13px] shadow-2xs">
                    {displayThemes}
                  </span>
                </div>
              </div>

              {/* Card 2: 阅读偏好搜集 */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 shadow-xs ${
                  activeStep >= 2
                    ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50/80 border-amber-400/90 shadow-sm shadow-amber-900/5'
                    : 'bg-white/70 border-[#E8DFC8]/70 text-stone-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold transition-colors ${
                      activeStep >= 2
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Check size={14} className="stroke-[2.5]" />
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-800 tracking-wider">
                    阅读偏好搜集
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-1 rounded-full bg-amber-100/90 text-amber-900 border border-amber-300/80 font-bold text-xs sm:text-[13px] shadow-2xs">
                    习惯与节奏已同步
                  </span>
                </div>
              </div>

              {/* Card 3: 已生成专属画像 */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between transition-all duration-300 shadow-xs ${
                  activeStep >= 3
                    ? 'bg-gradient-to-r from-amber-50 via-white to-amber-50/80 border-amber-400/90 shadow-sm shadow-amber-900/5'
                    : 'bg-white/70 border-[#E8DFC8]/70 text-stone-400 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 font-bold transition-colors ${
                      activeStep >= 3
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-xs'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    <Check size={14} className="stroke-[2.5]" />
                  </span>
                  <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-800 tracking-wider">
                    已生成专属画像
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300 font-bold text-xs tracking-wide">
                    已就绪
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Phase 2: Calibrated Stage (Duolingo reference style, boxes removed, clean and concise) */
          <div className="w-full max-w-sm sm:max-w-md px-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Duolingo-style Starting Level Anchor Badge */}
            <div className="relative mb-4 flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-700 ease-out">
              {/* Dynamic warm light pulse glow */}
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-pulse opacity-50 pointer-events-none" />

              {/* Centered Pill Badge */}
              <div className="relative inline-flex items-center justify-center gap-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-400 shadow-md shadow-amber-900/10 transition-transform duration-300 hover:scale-102">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-800 tracking-wider">
                  建议阅读起点
                </span>
                <strong className="text-2xl sm:text-3xl font-black font-mono text-amber-600 leading-none tracking-tight">
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
              className="w-full h-13 sm:h-14 rounded-2xl font-black text-stone-950 text-base sm:text-lg flex items-center justify-center gap-2 transition-all active:translate-y-1 active:shadow-none cursor-pointer"
              style={{
                background: 'linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%)',
                boxShadow: '0 4px 0 #D97706'
              }}
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
