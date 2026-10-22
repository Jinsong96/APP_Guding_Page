import React from 'react';
import { Smartphone, LayoutGrid, RotateCcw, BookOpen } from 'lucide-react';
import { Companion } from '../types';

export interface AppScreen {
  index: number;
  label: string;
  stage: number;
  step?: number;
}

export const APP_SCREENS: AppScreen[] = [
  { index: 0, label: '启动', stage: 0 },
  { index: 1, label: '选伴', stage: 1 },
  { index: 2, label: '兴趣', stage: 2, step: 1 },
  { index: 3, label: '阅读目标', stage: 2, step: 11 },
  { index: 4, label: '目标场景', stage: 2, step: 12 },
  { index: 5, label: '专注时长', stage: 2, step: 13 },
  { index: 6, label: '试读 1', stage: 2, step: 3 },
  { index: 7, label: '试读 2', stage: 2, step: 4 },
  { index: 8, label: '试读 3', stage: 2, step: 5 },
  { index: 9, label: '试读 4', stage: 2, step: 6 },
  { index: 10, label: '定制画像', stage: 8 },
  { index: 14, label: '成长反馈', stage: 7 },
  { index: 15, label: '阅读画像', stage: 9 },
  { index: 16, label: '阅读首页', stage: 10 }
];

interface TopNavigationHeaderProps {
  currentScreen: number;
  viewMode: 'phone' | 'board';
  companion: Companion;
  onSetViewMode: (mode: 'phone' | 'board') => void;
  onJumpToScreen: (screen: AppScreen) => void;
  onReset: () => void;
}

export const TopNavigationHeader: React.FC<TopNavigationHeaderProps> = ({
  currentScreen,
  viewMode,
  companion,
  onSetViewMode,
  onJumpToScreen,
  onReset
}) => (
  <header className="sticky top-0 z-50 border-b border-[#E7E1F0] bg-[#F4F1FA]/95 px-3 py-2 text-stone-800 backdrop-blur-md sm:px-6">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-2">
      <div className="flex w-full items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex shrink-0 items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-emerald-600 to-emerald-500 text-xs font-bold text-white shadow-sm">
              <BookOpen size={15} />
            </div>
            <span className="text-sm font-bold text-stone-900">一鹿知</span>
          </div>
          <div className="flex min-w-0 items-center gap-1.5 rounded-full border border-[#E7E1F0] bg-[#F0ECF8] px-2 py-1 text-xs">
            <img
              src={companion.avatarUrl}
              alt=""
              className="h-5 w-5 shrink-0 object-contain"
            />
            <span className="truncate text-[11px] font-medium text-stone-700">
              {companion.name} 同行
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center rounded-xl border border-[#E7E1F0] bg-[#F0ECF8] p-0.5">
            <button
              type="button"
              onClick={() => onSetViewMode('phone')}
              aria-pressed={viewMode === 'phone'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'phone'
                  ? 'border border-[#E7E1F0] bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone size={13} />
              <span>手机模拟</span>
            </button>
            <button
              type="button"
              onClick={() => onSetViewMode('board')}
              aria-pressed={viewMode === 'board'}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                viewMode === 'board'
                  ? 'border border-[#E7E1F0] bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <LayoutGrid size={13} />
              <span>全景故事板</span>
            </button>
          </div>
          <button
            type="button"
            onClick={onReset}
            aria-label="重置并返回启动页"
            title="重置并返回启动页"
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#E7E1F0] bg-[#F0ECF8] text-stone-600 transition-colors hover:bg-[#EAE5F4] hover:text-stone-900"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      <nav
        aria-label="逐屏导航"
        className="no-scrollbar -mx-1 flex w-full items-stretch gap-1 overflow-x-auto px-1 py-0.5"
      >
        {APP_SCREENS.map((screen, position) => {
          const isActive = currentScreen === screen.index && viewMode === 'phone';
          const number = String(position).padStart(2, '0');
          return (
            <button
              key={screen.index}
              type="button"
              onClick={() => onJumpToScreen(screen)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`${number} ${screen.label}`}
              title={`${number} ${screen.label}`}
              className={`flex min-h-10 min-w-[74px] shrink-0 flex-col items-center justify-center rounded-lg px-2 py-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B83825] ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-[#F0ECF8] text-stone-600 hover:bg-[#EAE5F4] hover:text-stone-900'
              }`}
            >
              <span className="text-[10px] font-semibold leading-3 tabular-nums">{number}</span>
              <span className="text-[11px] font-medium leading-4">{screen.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  </header>
);
