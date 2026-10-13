import React from 'react';
import { Smartphone, Eye, ArrowRight } from 'lucide-react';
import { Companion, UserPreferences, ReadingLevel } from '../types';
import { Stage01Companion } from './stages/Stage01Companion';
import { Stage02AiChat } from './stages/Stage02AiChat';
import { Stage03AiRecommend } from './stages/Stage03AiRecommend';
import { StageReader } from './stages/StageReader';
import { Stage07GrowthFeedback } from './stages/Stage07GrowthFeedback';
import { Stage08Customizing } from './stages/Stage08Customizing';
import { Stage09ReadingProfile } from './stages/Stage09ReadingProfile';
import { Stage10ReadingWorld } from './stages/Stage10ReadingWorld';

interface BoardViewProps {
  companion: Companion;
  preferences: UserPreferences;
  onSelectCompanion: (id: any) => void;
  onJumpToStage: (stageNum: number) => void;
  onToggleBookmark: (word: string) => void;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  companion,
  preferences,
  onSelectCompanion,
  onJumpToStage,
  onToggleBookmark,
  onUpdatePreferences
}) => {
  const STAGE_TITLES = [
    { num: 1, label: '01', title: '选择旅伴', desc: '建立关系，选一个合拍的阅读搭子' },
    { num: 2, label: '02', title: '对话定级', desc: '星盘吸纳兴趣 + 4句自适应微定级 + 底部对话框' },
    { num: 8, label: '03', title: '定制画像', desc: '智能匹配计算，动态切换为建议起点与阅读画像' },
    { num: 10, label: '04', title: '阅读首页', desc: '今日精选、专属推荐书架与三大导航' },
  ];

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 bg-[#0B0D13]">
      {/* Board Description Header */}
      <div className="max-w-7xl mx-auto mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
              Streamlined Flow Architecture Overview
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI 英语阅读旅伴 · 全景看板
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            已整合第 02 屏对话中 4 句自适应微定级与底部输入框，逐句交互调档并直接衔接第 03 屏定制画像与第 04 屏阅读首页。
          </p>
        </div>

        <button
          onClick={() => onJumpToStage(1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-450 text-slate-950 font-semibold text-xs shadow-lg transition-all"
        >
          <Smartphone size={16} />
          <span>进入手机交互模式 (从第 01 屏开始)</span>
        </button>
      </div>

      {/* Grid of 10 Phones */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
        {STAGE_TITLES.map((stage) => (
          <div key={stage.num} className="w-[280px] sm:w-[310px] flex flex-col">
            {/* Screen Top Header Tag */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-5 rounded-md bg-slate-800 border border-slate-700 text-[11px] font-mono font-bold text-amber-400 flex items-center justify-center">
                  {stage.label}
                </span>
                <h3 className="text-xs font-bold text-slate-200 truncate">{stage.title}</h3>
              </div>
              <button
                onClick={() => onJumpToStage(stage.num)}
                className="text-[10px] text-slate-400 hover:text-amber-400 flex items-center gap-0.5 transition-colors font-medium"
              >
                <span>试玩</span>
                <ArrowRight size={10} />
              </button>
            </div>

            {/* Scaled Phone Frame Container */}
            <div
              onClick={() => onJumpToStage(stage.num)}
              className="relative w-full h-[580px] rounded-[32px] bg-[#141722] border-2 border-slate-750 hover:border-amber-400/70 p-2 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 transition-all cursor-pointer overflow-hidden group flex flex-col"
            >
              <div className="w-full h-full rounded-[24px] bg-[#0E1117] overflow-hidden relative pointer-events-none text-left">
                {stage.num === 1 && (
                  <Stage01Companion
                    selectedCompanionId={preferences.companionId}
                    onSelectCompanion={onSelectCompanion}
                    onNext={() => {}}
                  />
                )}
                {stage.num === 2 && (
                  <Stage02AiChat
                    companion={companion}
                    onBack={() => {}}
                    onComplete={() => {}}
                    onSkip={() => {}}
                  />
                )}
                {stage.num === 3 && (
                  <Stage03AiRecommend
                    companion={companion}
                    interestTheme={preferences.interestTheme}
                    selectedThemes={preferences.selectedThemes}
                    onBack={() => {}}
                    onNext={() => {}}
                  />
                )}
                {stage.num === 4 && (
                  <StageReader
                    stageNumber={4}
                    stageTitle="首次阅读"
                    progressPct={36}
                    timeRemaining="2:18"
                    badgeLabel="轻提示"
                    currentLevel={preferences.currentLevel}
                    companion={companion}
                    bookmarkedWords={preferences.bookmarkedWords}
                    onToggleBookmark={onToggleBookmark}
                    onBack={() => {}}
                    onRateDifficulty={() => {}}
                  />
                )}
                {stage.num === 5 && (
                  <StageReader
                    stageNumber={5}
                    stageTitle="自适应阅读"
                    progressPct={68}
                    timeRemaining="1:40"
                    badgeLabel="自适应"
                    currentLevel="easy"
                    companion={companion}
                    bookmarkedWords={preferences.bookmarkedWords}
                    onToggleBookmark={onToggleBookmark}
                    onBack={() => {}}
                    onRateDifficulty={() => {}}
                  />
                )}
                {stage.num === 6 && (
                  <StageReader
                    stageNumber={6}
                    stageTitle="自适应阅读"
                    progressPct={92}
                    timeRemaining="0:45"
                    badgeLabel="自适应"
                    currentLevel="hard"
                    companion={companion}
                    bookmarkedWords={preferences.bookmarkedWords}
                    onToggleBookmark={onToggleBookmark}
                    onBack={() => {}}
                    onRateDifficulty={() => {}}
                  />
                )}
                {stage.num === 7 && (
                  <Stage07GrowthFeedback
                    companion={companion}
                    onBack={() => {}}
                    onNext={() => {}}
                  />
                )}
                {stage.num === 8 && (
                  <Stage08Customizing
                    companion={companion}
                    interestTheme={preferences.interestTheme}
                    selectedThemes={preferences.selectedThemes}
                    determinedCefr={preferences.determinedCefr || 'A2'}
                    startingLevel={preferences.profile.startingLevel || 'L2'}
                    preferences={preferences}
                    onUpdatePreferences={onUpdatePreferences}
                    onBack={() => {}}
                    onNext={() => {}}
                  />
                )}
                {stage.num === 9 && (
                  <Stage09ReadingProfile
                    companion={companion}
                    preferences={preferences}
                    onUpdatePreferences={onUpdatePreferences}
                    onBack={() => {}}
                    onNext={() => {}}
                  />
                )}
                {stage.num === 10 && (
                  <Stage10ReadingWorld
                    companion={companion}
                    preferences={preferences}
                    onOpenStory={() => {}}
                    onToggleBookmark={onToggleBookmark}
                    onRestartOnboarding={() => {}}
                  />
                )}
              </div>

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] flex items-center justify-center transition-opacity rounded-[32px]">
                <span className="px-3 py-1.5 rounded-full bg-amber-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5">
                  <Smartphone size={13} />
                  <span>沉浸全屏体验</span>
                </span>
              </div>
            </div>

            {/* Screen Subtext */}
            <p className="text-[11px] text-slate-500 mt-2 px-1 line-clamp-1">
              {stage.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
