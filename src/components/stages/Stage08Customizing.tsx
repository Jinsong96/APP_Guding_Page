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
              src={companion.avatarUrl}
              alt={`${companion.name}${isCalibrated ? ' · 庆祝完成定级' : ''}`}
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
          <div className="w-full max-w-xs flex flex-col items-center text-center animate-in fade-in duration-300">
            <h1 className="text-lg sm:text-xl font-bold text-stone-900 mb-4">
              {companion.name} 在读你的兴趣与水平
            </h1>

            {/* Progress Track */}
            <div className="w-full bg-[#E8DFC8] h-2 rounded-full overflow-hidden p-0.5 border border-[#DDD3BC] mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-600 to-emerald-600 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-stone-500 font-mono mb-5">
              <span>已匹配 {progress}%</span>
              <span>{progress >= 100 ? '匹配完成' : '细致调适难度坡度中...'}</span>
            </div>

            {/* 3 Step Ticks */}
            <div className="w-full space-y-2 text-left">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                  activeStep >= 1
                    ? 'bg-emerald-50 border-emerald-300 text-stone-800 shadow-xs'
                    : 'bg-white/80 border-[#E8DFC8] text-stone-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    activeStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <Check size={12} />
                </span>
                <p className="text-xs truncate">
                  <strong className="text-stone-900 font-medium">锁定兴趣领域：</strong> {displayThemes}
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                  activeStep >= 2
                    ? 'bg-emerald-50 border-emerald-300 text-stone-800 shadow-xs'
                    : 'bg-white/80 border-[#E8DFC8] text-stone-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    activeStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <Check size={12} />
                </span>
                <p className="text-xs">
                  <strong className="text-stone-900 font-medium">微试读自适应定级：</strong>建议起点 {resolvedStartingLevel}
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                  activeStep >= 3
                    ? 'bg-emerald-50 border-emerald-300 text-stone-800 shadow-xs'
                    : 'bg-white/80 border-[#E8DFC8] text-stone-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    activeStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-400'
                  }`}
                >
                  <Check size={12} />
                </span>
                <p className="text-xs truncate">
                  <strong className="text-stone-900 font-medium">
                    {preferences?.profile?.goalTrack?.targetFocus
                      ? `已锁定【${preferences.profile.goalTrack.targetFocus}】专项画像`
                      : '已生成专属阅读画像与路线'}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Phase 2: Calibrated Stage 09 Content */
          <div className="w-full max-w-xs flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Centered Starting Level Anchor Badge with Dynamic Pop Animation */}
            <div className="relative mb-2.5 flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-700 ease-out">
              {/* Dynamic light pulse glow */}
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse opacity-40 pointer-events-none" />

              {/* Centered Pill Badge - perfectly balanced vertically and horizontally */}
              <div className="relative inline-flex items-center justify-center gap-2.5 px-5 py-2 rounded-full bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-500 shadow-md shadow-emerald-700/10 transition-transform duration-300 hover:scale-102">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[13.5px] font-bold text-stone-800 tracking-wider">
                  建议阅读起点
                </span>
                <strong className="text-2xl font-black font-mono text-emerald-700 leading-none tracking-tight">
                  {resolvedStartingLevel}
                </strong>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900 mb-2.5">
              从这里开始，刚刚好
            </h1>

            {/* Goal Track Personalized Badge */}
            {preferences?.profile?.goalTrack?.targetFocus && (
              <div className="w-full mb-3 p-2.5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-[#FFFDF8] to-emerald-50/90 border border-amber-300/80 shadow-xs flex items-center justify-between text-left">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0 text-sm">
                    {preferences.profile.goalTrack.category === 'exam' ? '🎯' :
                     preferences.profile.goalTrack.category === 'workplace' ? '💼' :
                     preferences.profile.goalTrack.category === 'original' ? '🌟' : '🌱'}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12px] font-bold text-stone-900 truncate">
                        {preferences.profile.goalTrack.targetFocus}
                      </span>
                      <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 font-medium">
                        专属靶向
                      </span>
                    </div>
                    {preferences.profile.goalTrack.targetHurdle && (
                      <div className="text-[11px] text-stone-500 truncate mt-0.5">
                        突破卡点：{preferences.profile.goalTrack.targetHurdle}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Two Core Pillars Cards */}
            <div className="w-full grid grid-cols-2 gap-2 text-left mb-3.5">
              <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5 text-xs">
                    <Sparkles size={13} />
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mb-0.5">
                    {preferences?.profile?.goalTrack?.category === 'exam'
                      ? '真题级语篇'
                      : preferences?.profile?.goalTrack?.category === 'workplace'
                      ? '实战语感积累'
                      : '难度更适合'}
                  </h3>
                  <p className="text-[10.5px] text-stone-500 leading-snug">
                    {preferences?.profile?.goalTrack?.category === 'exam'
                      ? '精准攻坚长难句，阅读做题更自信'
                      : preferences?.profile?.goalTrack?.category === 'workplace'
                      ? '储备高频地道表达与敏捷速读'
                      : '聚焦核心高频长句，零挫败感'}
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5 text-xs">
                    <Compass size={13} />
                  </div>
                  <h3 className="text-xs font-bold text-stone-900 mb-0.5">
                    {preferences?.profile?.goalTrack?.category === 'exam'
                      ? '攻克薄弱卡点'
                      : preferences?.profile?.goalTrack?.category === 'workplace'
                      ? '专业场景转化'
                      : '随阅读调整'}
                  </h3>
                  <p className="text-[10.5px] text-stone-500 leading-snug">
                    {preferences?.profile?.goalTrack?.category === 'exam'
                      ? `针对${preferences?.profile?.goalTrack?.targetHurdle || '考点'}伴读实时点拨`
                      : preferences?.profile?.goalTrack?.category === 'workplace'
                      ? '外刊与跨境场景即读即用'
                      : '越读越懂你节奏，随时自适应'}
                  </p>
                </div>
              </div>
            </div>

            {/* "开启阅读体验" Button located right below the two cards */}
            <button
              onClick={onNext}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-white text-[15px] sm:text-base flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer hover:brightness-105 animate-in fade-in slide-in-from-bottom-2 duration-300"
              style={{
                backgroundColor: companion.accentColor || '#D97706',
                boxShadow: `0 6px 20px rgba(180, 100, 20, 0.25)`
              }}
            >
              <span>开启阅读体验</span>
              <ArrowRight size={17} />
            </button>
          </div>
        )}
      </div>

      {/* Bottom Area - shown during calibration */}
      {!isCalibrated && (
        <div className="pt-2 shrink-0 z-20">
          <div className="w-full py-3 flex items-center justify-center gap-2 text-xs text-stone-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span>细致调适难度坡度与画像中...</span>
          </div>
        </div>
      )}
    </div>
  );
};
