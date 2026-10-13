import React from 'react';
import { ArrowLeft, ArrowRight, Sparkles, MapPin, Compass } from 'lucide-react';
import { Companion } from '../../types';

interface Stage07GrowthFeedbackProps {
  companion: Companion;
  onBack: () => void;
  onNext: () => void;
}

export const Stage07GrowthFeedback: React.FC<Stage07GrowthFeedbackProps> = ({
  companion,
  onBack,
  onNext
}) => {
  return (
    <div className="h-full flex flex-col justify-between p-5 text-slate-100 select-none relative overflow-hidden bg-gradient-to-b from-[#121622] via-[#0D1017] to-[#08090D]">
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
          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-mono border border-emerald-500/30">
            07 / 10 · 首次里程碑
          </span>
        </div>

        {/* Big Celebration Title */}
        <div className="mt-4">
          <span className="text-[10px] tracking-widest font-mono text-emerald-400 uppercase px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 inline-block mb-2">
            FIRST ROUTE COMPLETED
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-tight">
            你读完了。<br />
            <span style={{ color: companion.accentColor }}>{companion.name}</span> 也留下了第一段路线。
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            下一段，从这里接着走。
          </p>
        </div>
      </div>

      {/* Growth Card */}
      <div className="my-auto py-2">
        <div className="rounded-3xl bg-[#161B27] border border-slate-750 p-5 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle background glow */}
          <div
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: companion.accentColor }}
          />

          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block mb-1">
            本次留下
          </span>
          <h2 className="text-lg font-bold text-white mb-4">
            “现实边缘的未来故事”
          </h2>

          {/* Companion avatar */}
          <div className="w-28 h-28 mx-auto relative flex items-center justify-center my-2">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30 animate-pulse"
              style={{ backgroundColor: companion.accentColor }}
            />
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="w-24 h-24 object-contain drop-shadow-xl relative z-10"
            />
          </div>

          {/* Remember Box */}
          <div className="mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center gap-2 text-xs font-medium text-emerald-300">
            <MapPin size={14} className="shrink-0 text-emerald-400" />
            <span>已点亮：科学大陆第 1 段海岸线</span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-2">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-4 rounded-2xl font-semibold text-slate-950 flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
          style={{
            backgroundColor: '#10B981',
            boxShadow: '0 4px 18px rgba(16, 185, 129, 0.25)'
          }}
        >
          <span>看看它怎样理解你</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
