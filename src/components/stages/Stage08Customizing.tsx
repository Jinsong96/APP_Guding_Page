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

export const Stage08Customizing: React.FC<Stage08CustomizingProps> = ({
  companion,
  interestTheme,
  selectedThemes,
  determinedCefr = 'A2',
  startingLevel = 'L2',
  preferences,
  onUpdatePreferences,
  onBack,
  onNext
}) => {
  const [progress, setProgress] = useState(10);
  const [activeStep, setActiveStep] = useState(1);
  const [isCalibrated, setIsCalibrated] = useState(false);

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
    <div className="h-full flex flex-col justify-between p-4 sm:p-5 text-slate-100 select-none relative overflow-hidden bg-gradient-to-b from-[#141721] via-[#10131B] to-[#0B0D13]">
      {/* Background Ambient Cosmic Glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[110px] pointer-events-none opacity-25 transition-all duration-700"
        style={{
          background: `radial-gradient(circle, ${companion.accentColor} 0%, transparent 70%)`
        }}
      />

      {/* Top Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0 z-20">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
          aria-label="返回上一步"
        >
          <ArrowLeft size={16} />
        </button>
        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono transition-all">
          {isCalibrated ? '03 / 04 · 定制画像 · 阅读画像' : '03 / 04 · 定制画像 · 正在生成'}
        </span>
      </div>

      {/* Middle Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center py-2 sm:py-3 overflow-y-auto no-scrollbar z-10">
        {/* Top Companion Hero - Stays at top, gains sparkling & glowing effects when calibrated */}
        <div className="relative flex flex-col items-center text-center shrink-0 mb-3 sm:mb-4">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
            {/* Halo Glow */}
            <div
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
                isCalibrated ? 'opacity-70 scale-125' : 'opacity-40 animate-halo'
              }`}
              style={{ backgroundColor: companion.accentColor }}
            />

            {/* Pulsing Aura Rings when Calibrated */}
            {isCalibrated && (
              <>
                <div
                  className="absolute inset-0 rounded-full border-2 animate-ping opacity-40 pointer-events-none"
                  style={{ borderColor: companion.accentColor }}
                />
                <div
                  className="absolute -inset-2 rounded-full border border-amber-400/40 animate-pulse pointer-events-none"
                />
              </>
            )}

            {/* Sparkle Icons Floating Around Companion */}
            {isCalibrated && (
              <div className="absolute inset-0 pointer-events-none">
                <span className="absolute -top-1 -right-1 text-amber-400 animate-bounce">
                  <Sparkles size={17} />
                </span>
                <span className="absolute top-1/2 -left-2 text-emerald-300 animate-pulse">
                  <Star size={13} fill="#6EE7B7" />
                </span>
                <span className="absolute -bottom-1 right-2 text-amber-300 animate-spin" style={{ animationDuration: '6s' }}>
                  <Sparkles size={14} />
                </span>
              </div>
            )}

            {/* Companion Avatar Image */}
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className={`w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10 drop-shadow-2xl transition-transform duration-500 ${
                isCalibrated ? 'scale-105' : 'scale-100'
              }`}
            />
          </div>

          {/* Companion Celebration Badge / State Label */}
          {isCalibrated && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-[11px] font-medium text-amber-300 animate-in fade-in zoom-in-95 duration-300">
              <Sparkles size={11} className="text-amber-400" />
              <span>专属微定级已锁定</span>
            </div>
          )}
        </div>

        {/* Phase 1: Generating & Customizing (Before 100%) */}
        {!isCalibrated ? (
          <div className="w-full max-w-xs flex flex-col items-center text-center animate-in fade-in duration-300">
            <h1 className="text-lg sm:text-xl font-bold text-white mb-1">
              {companion.name} 在读你的兴趣与水平
            </h1>
            <p className="text-xs text-slate-400 mb-5">
              结合你的真实反馈，正在调适最适合你的起步坡度。
            </p>

            {/* Progress Track */}
            <div className="w-full bg-slate-800/90 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/60 mb-2">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="w-full flex items-center justify-between text-[11px] text-slate-400 font-mono mb-5">
              <span>已匹配 {progress}%</span>
              <span>{progress >= 100 ? '匹配完成' : '细致调适难度坡度中...'}</span>
            </div>

            {/* 3 Step Ticks */}
            <div className="w-full space-y-2 text-left">
              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                  activeStep >= 1
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    activeStep >= 1 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Check size={12} />
                </span>
                <p className="text-xs truncate">
                  <strong className="text-white font-medium">锁定兴趣星系：</strong> {displayThemes}
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                  activeStep >= 2
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    activeStep >= 2 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Check size={12} />
                </span>
                <p className="text-xs">
                  <strong className="text-white font-medium">微试读自适应定级：</strong> {determinedCefr}（建议起点 {startingLevel}）
                </p>
              </div>

              <div
                className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-300 ${
                  activeStep >= 3
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                    activeStep >= 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  <Check size={12} />
                </span>
                <p className="text-xs">
                  <strong className="text-white font-medium">已生成专属阅读画像与路线</strong>
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Phase 2: Calibrated Stage 09 Content (Cleaned: no 释义提示 or 单词目标) */
          <div className="w-full max-w-xs flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-3 duration-500">
            {/* Starting Level Anchor Badge */}
            <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/15 mb-2.5">
              <span className="text-[9px] font-medium text-emerald-300 tracking-wider uppercase">
                建议阅读起点
              </span>
              <strong className="text-2xl font-bold font-mono text-emerald-400 leading-none mt-0.5">
                {startingLevel}
              </strong>
            </div>

            {/* Level & Themes Subtag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/90 border border-slate-750 text-xs font-mono text-amber-300 mb-2.5 shadow-sm">
              <span>定级评定：{determinedCefr}</span>
              <span>·</span>
              <span className="text-slate-300 truncate max-w-[150px]">{displayThemes}</span>
            </div>

            {/* Headline */}
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-4">
              从这里开始，刚刚好
            </h1>

            {/* Two Core Pillars Cards */}
            <div className="w-full grid grid-cols-2 gap-2.5 text-left">
              <div className="p-3.5 rounded-2xl bg-[#181D29] border border-slate-750/80 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                    <Sparkles size={14} />
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">难度更贴合</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    绕过过易与过繁冗长语篇，聚焦核心高频长句。
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#181D29] border border-slate-750/80 shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                    <Compass size={14} />
                  </div>
                  <h3 className="text-xs font-bold text-white mb-1">随阅读调整</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    越读越懂你的节奏，随时一键自适应换档。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom CTA Button Area */}
      <div className="pt-2 shrink-0 z-20">
        {isCalibrated ? (
          <button
            onClick={onNext}
            className="w-full py-3.5 px-4 rounded-2xl font-bold text-slate-950 text-sm flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98] cursor-pointer hover:brightness-110 animate-in fade-in slide-in-from-bottom-2 duration-300"
            style={{
              backgroundColor: companion.accentColor || '#F59E0B'
            }}
          >
            <span>开启阅读首页</span>
            <ArrowRight size={17} />
          </button>
        ) : (
          <div className="w-full py-3 flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>细致调适难度坡度与画像中...</span>
          </div>
        )}
      </div>
    </div>
  );
};
