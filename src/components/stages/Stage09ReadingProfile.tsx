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
    <div className="h-full flex flex-col justify-between p-5 text-stone-900 select-none relative overflow-hidden bg-[#F0F8F4]">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-[#DCEBE5]">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EAF4EF] flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors border border-[#DCEBE5] shadow-xs cursor-pointer"
            aria-label="返回上一步"
          >
            <ArrowLeft size={16} />
          </button>
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#EFE7D8] text-stone-600 font-mono border border-[#DCEBE5]">
            初步阅读画像
          </span>
        </div>

        {/* Level Hero Card */}
        <div className="mt-2 text-center">
          {/* Companion Celebration Avatar */}
          <div className="flex flex-col items-center justify-center mb-2">
            <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full blur-xl opacity-40 animate-companion-glow pointer-events-none"
                style={{ backgroundColor: companion.accentColor }}
              />
              <img
                src={companion.avatarUrl}
                alt={companion.name}
                className="w-14 h-14 sm:w-16 sm:h-16 object-contain relative z-10 drop-shadow-md animate-companion-float select-none"
              />
            </div>
          </div>

          {/* Centered Starting Level Anchor Badge with Dynamic Pop Animation */}
          <div className="relative mb-3.5 flex flex-col items-center justify-center animate-in zoom-in-75 fade-in duration-700 ease-out">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md animate-pulse opacity-40 pointer-events-none" />
            <div className="relative inline-flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border-2 border-emerald-500 shadow-md shadow-emerald-700/10 transition-transform duration-300 hover:scale-102">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="text-[14px] sm:text-[14.5px] font-bold text-stone-800 tracking-wider">
                建议阅读起点
              </span>
              <strong className="text-2xl font-black font-mono text-emerald-700 leading-none tracking-tight">
                {preferences.profile.startingLevel || 'L4'}
              </strong>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            从这里开始，刚刚好
          </h1>
          <p className="text-xs text-stone-600 mt-1.5 px-2 leading-relaxed">
            这是根据你在对话中对《Teddy Bear Comfort》的真实阅读感受给出的建议起点，不是冰冷的等级认证。后续会随你的真实阅读表现持续智能微调。
          </p>
        </div>
      </div>

      {/* Two Pillars Cards */}
      <div className="my-auto py-2 grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#DCEBE5] shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <Sparkles size={14} />
          </div>
          <h3 className="text-xs font-bold text-stone-900 mb-1">难度更贴合</h3>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            绕过过易与过繁冗长语篇，聚焦核心高频长句。
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#DCEBE5] shadow-xs">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
            <Sliders size={14} />
          </div>
          <h3 className="text-xs font-bold text-stone-900 mb-1">随阅读调整</h3>
          <p className="text-[11px] text-stone-500 leading-relaxed">
            越读越懂你的节奏，随时一键自适应换档。
          </p>
        </div>
      </div>

      {/* Profile Edit Drawer / Floating Sheet */}
      {showEditSheet ? (
        <div className="p-3.5 rounded-2xl bg-white border border-emerald-400 shadow-md mb-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-900">调整“这次怎么陪你”</span>
            <span className="text-[10px] text-stone-500">提示密度与时长</span>
          </div>

          <div className="space-y-2 text-xs">
            {/* Density */}
            <div className="flex items-center justify-between">
              <span className="text-stone-500 text-[11px]">释义提示</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setHintDensity('light')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    hintDensity === 'light'
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-[#EAF4EF] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  轻提示
                </button>
                <button
                  onClick={() => setHintDensity('detailed')}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    hintDensity === 'detailed'
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-[#EAF4EF] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  多解释
                </button>
              </div>
            </div>

            {/* Session duration */}
            <div className="flex items-center justify-between">
              <span className="text-stone-500 text-[11px]">单次目标</span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setSessionDuration(5)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    sessionDuration === 5
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-[#EAF4EF] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  5 分钟
                </button>
                <button
                  onClick={() => setSessionDuration(10)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                    sessionDuration === 10
                      ? 'bg-emerald-600 text-white font-medium'
                      : 'bg-[#EAF4EF] text-stone-600 hover:text-stone-900'
                  }`}
                >
                  10 分钟
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            className="w-full mt-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium cursor-pointer"
          >
            保存画像设置
          </button>
        </div>
      ) : null}

      {/* Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: '#059669',
            boxShadow: '0 6px 20px rgba(5, 150, 105, 0.25)'
          }}
        >
          <span>开启阅读世界</span>
          <ArrowRight size={17} />
        </button>

        <button
          onClick={() => setShowEditSheet(!showEditSheet)}
          className="w-full py-2.5 px-4 rounded-xl text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-[#EAF4EF] border border-[#DCEBE5] flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <Sliders size={13} />
          <span>{showEditSheet ? '收起画像调整' : '有一点不对，调整画像'}</span>
        </button>
      </div>
    </div>
  );
};
