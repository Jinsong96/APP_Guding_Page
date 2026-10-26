import React from 'react';
import { RotateCcw, BookOpen } from 'lucide-react';
import { Companion } from '../types';

export type DemoVersion = 'v1' | 'v2';

export const DEMO_VERSIONS: { id: DemoVersion; label: string }[] = [
  { id: 'v1', label: 'V1 完整版' },
  { id: 'v2', label: 'V2 简略版' }
];

export interface AppScreen {
  index: number;
  label: string;
  stage: number;
  step?: number;
}

// Each version numbers its screens in its own flow order.
export const screenCode = (screen: AppScreen) => String(screen.index).padStart(2, '0');

export const APP_SCREENS: AppScreen[] = [
  { index: 0, label: '启动', stage: 0 },
  { index: 1, label: '选伴', stage: 1 },
  { index: 2, label: '兴趣', stage: 2, step: 1 },
  { index: 3, label: '阅读目标', stage: 2, step: 11 },
  { index: 4, label: '目标场景', stage: 2, step: 12 },
  { index: 5, label: '专注时长', stage: 2, step: 13 },
  { index: 6, label: '推荐文章', stage: 11 },
  { index: 7, label: '首篇阅读', stage: 12 },
  { index: 8, label: '阅读报告', stage: 8 },
  { index: 9, label: '报告(首页)', stage: 7 },
  { index: 10, label: '阅读首页', stage: 10 },
  { index: 11, label: '我的旅伴', stage: 13 }
];

// V2 (简略版): interests → one difficulty question → the companion picks the featured story → reading home,
// where the first article the user opens is their first read (no ratings, starts at the chosen difficulty).
export const APP_SCREENS_V2: AppScreen[] = [
  { index: 0, label: '启动', stage: 0 },
  { index: 1, label: '选伴', stage: 1 },
  { index: 2, label: '兴趣', stage: 2, step: 1 },
  { index: 3, label: '阅读难度', stage: 2, step: 14 },
  { index: 4, label: '为你挑选', stage: 16 },
  { index: 5, label: '阅读首页', stage: 10 },
  { index: 6, label: '阅读报告', stage: 8 },
  { index: 7, label: '我的旅伴', stage: 13 },
  // Kept for preview only, no longer in the flow: the ticket intro over the home.
  { index: 8, label: '为你出票', stage: 14 }
];

export const screensForVersion = (version: DemoVersion) => (version === 'v2' ? APP_SCREENS_V2 : APP_SCREENS);

interface TopNavigationHeaderProps {
  currentScreen: number;
  version: DemoVersion;
  onSetVersion: (version: DemoVersion) => void;
  companion: Companion;
  onJumpToScreen: (screen: AppScreen) => void;
  onReset: () => void;
}

export const TopNavigationHeader: React.FC<TopNavigationHeaderProps> = ({
  currentScreen,
  version,
  onSetVersion,
  companion,
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
              src={companion.portraitUrl}
              alt=""
              className="h-5 w-5 shrink-0 rounded-full object-cover"
            />
            <span className="truncate text-[11px] font-medium text-stone-700">
              {companion.name} 同行
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center rounded-xl border border-[#E7E1F0] bg-[#F0ECF8] p-0.5" role="group" aria-label="版本">
            {DEMO_VERSIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSetVersion(item.id)}
                aria-pressed={version === item.id}
                className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                  version === item.id
                    ? 'bg-[#23305E] text-white shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                {item.label}
              </button>
            ))}
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
        {screensForVersion(version).map((screen) => {
          const isActive = currentScreen === screen.index;
          const number = screenCode(screen);
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
