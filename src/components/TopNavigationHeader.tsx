import React from 'react';
import { Smartphone, LayoutGrid, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { Companion } from '../types';

interface TopNavigationHeaderProps {
  currentStage: number;
  viewMode: 'phone' | 'board';
  companion: Companion;
  onSetViewMode: (mode: 'phone' | 'board') => void;
  onJumpToStage: (stage: number) => void;
  onReset: () => void;
}

export const TopNavigationHeader: React.FC<TopNavigationHeaderProps> = ({
  currentStage,
  viewMode,
  companion,
  onSetViewMode,
  onJumpToStage,
  onReset
}) => {
  const stageLabels = [
    { num: 1, label: '01 选伴' },
    { num: 2, label: '02 对话定级' },
    { num: 8, label: '03 定制画像' },
    { num: 10, label: '04 阅读首页' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6ED]/95 backdrop-blur-md border-b border-[#E8DFC8] text-stone-800 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        {/* Brand & Companion info */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
              <BookOpen size={15} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm tracking-tight text-stone-900">一鹿知</span>
              </div>
            </div>
          </div>

          {/* Current Companion Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F2ECE1] border border-[#E2D8C6] text-xs">
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-stone-700 text-[11px] font-medium">{companion.name} 同行</span>
          </div>
        </div>

        {/* Stage Fast Jump Buttons (Horizontal scrollable on small screens) */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full py-0.5 no-scrollbar px-1">
          {stageLabels.map((s) => (
            <button
              key={s.num}
              onClick={() => {
                onJumpToStage(s.num);
                onSetViewMode('phone');
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                currentStage === s.num && viewMode === 'phone'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'bg-[#F2ECE1] hover:bg-[#EBE2D2] text-stone-600 hover:text-stone-900'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle & Reset */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center p-0.5 bg-[#F2ECE1] rounded-xl border border-[#E2D8C6]">
            <button
              onClick={() => onSetViewMode('phone')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'phone'
                  ? 'bg-white text-stone-900 shadow-xs border border-[#E0D5C2]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone size={13} />
              <span>手机模拟</span>
            </button>

            <button
              onClick={() => onSetViewMode('board')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'board'
                  ? 'bg-white text-stone-900 shadow-xs border border-[#E0D5C2]'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LayoutGrid size={13} />
              <span>全景故事板</span>
            </button>
          </div>

          <button
            onClick={onReset}
            className="p-1.5 rounded-xl bg-[#F2ECE1] hover:bg-[#EBE2D2] text-stone-600 hover:text-stone-900 transition-colors border border-[#E2D8C6]"
            title="重置回第 01 屏"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
