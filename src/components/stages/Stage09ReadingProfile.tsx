import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, Sliders, Check, BookOpen, Compass, Bookmark, User } from 'lucide-react';
import { Companion, UserPreferences } from '../../types';

interface Stage09ReadingProfileProps {
  companion: Companion;
  preferences: UserPreferences;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
  onBack: () => void;
  onNext: () => void;
}

export const Stage09ReadingProfile: React.FC<Stage09ReadingProfileProps> = ({
  companion,
  preferences,
  onUpdatePreferences,
  onBack,
  onNext
}) => {
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [hintDensity, setHintDensity] = useState<'light' | 'detailed'>(
    preferences.profile.hintDensity
  );
  const [sessionDuration, setSessionDuration] = useState<5 | 10>(
    preferences.profile.sessionDuration
  );

  const handleSaveProfile = () => {
    onUpdatePreferences({
      profile: {
        ...preferences.profile,
        hintDensity,
        sessionDuration
      }
    });
    setShowEditSheet(false);
  };

  return (
    <div className="h-full flex flex-col justify-between p-5 text-slate-100 select-none relative overflow-hidden bg-gradient-to-b from-[#141721] via-[#10131B] to-[#0B0D13]">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            aria-label="返回上一步"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
            09 / 10 · 初步阅读画像
          </span>
        </div>

        {/* Level Hero Card */}
        <div className="mt-4 text-center">
          {/* Dynamic Circular Badge */}
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/10 mb-3">
            <span className="text-[9px] font-medium text-emerald-300 tracking-wider uppercase">
              建议阅读起点
            </span>
            <strong className="text-2xl font-bold font-mono text-emerald-400">
              {preferences.profile.startingLevel || 'L4'}
            </strong>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-amber-300 mb-2">
            <span>定级评定：{preferences.determinedCefr || 'A2'}</span>
            <span>·</span>
            <span className="text-slate-300">{preferences.selectedThemes?.slice(0, 2).join(' · ') || preferences.interestTheme || '前沿科技'}</span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            从这里开始，刚刚好
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 px-2 leading-relaxed">
            这是根据你在对话中对《Teddy Bear Comfort》的真实阅读感受给出的建议起点，不是冰冷的等级认证。后续会随你的真实阅读表现持续智能微调。
          </p>
        </div>
      </div>

      {/* Two Pillars Cards */}
      <div className="my-auto py-2 grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#181D29] border border-slate-750">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
            <Sparkles size={14} />
          </div>
          <h3 className="text-xs font-bold text-white mb-1">难度更贴合</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            绕过过易与过繁冗长语篇，聚焦核心高频长句。
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#181D29] border border-slate-750">
          <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
            <Sliders size={14} />
          </div>
          <h3 className="text-xs font-bold text-white mb-1">随阅读调整</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            越读越懂你的节奏，随时一键自适应换档。
          </p>
        </div>
      </div>

      {/* Profile Edit Drawer / Floating Sheet */}
      {showEditSheet ? (
        <div className="p-3.5 rounded-2xl bg-[#1C212E] border border-amber-500/30 mb-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-white">调整“这次怎么陪你”</span>
            <span className="text-[10px] text-slate-400">提示密度与时长</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Density */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">释义提示</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setHintDensity('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    hintDensity === 'light'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  轻提示
                </button>
                <button
                  onClick={() => setHintDensity('detailed')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    hintDensity === 'detailed'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  多解释
                </button>
              </div>
            </div>

            {/* Session duration */}
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-[11px]">单次目标</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSessionDuration(5)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    sessionDuration === 5
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  5 分钟
                </button>
                <button
                  onClick={() => setSessionDuration(10)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    sessionDuration === 10
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  10 分钟
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full mt-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-medium"
          >
            保存画像设置
          </button>
        </div>
      ) : null}

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-4 rounded-2xl font-semibold text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
          style={{
            backgroundColor: '#10B981',
            boxShadow: '0 4px 18px rgba(16, 185, 129, 0.25)'
          }}
        >
          <span>开启阅读世界</span>
          <ArrowRight size={17} />
        </button>

        <button
          onClick={() => setShowEditSheet(!showEditSheet)}
          className="w-full py-2.5 px-4 rounded-xl text-xs text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-750 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Sliders size={13} />
          <span>{showEditSheet ? '收起画像调整' : '有一点不对，调整画像'}</span>
        </button>
      </div>
    </div>
  );
};
