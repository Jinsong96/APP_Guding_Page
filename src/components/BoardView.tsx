import React from 'react';
import { Smartphone, Eye, ArrowRight } from 'lucide-react';
import { BookmarkedSentence, Companion, UserPreferences, ReadingLevel } from '../types';
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
  onToggleSentenceBookmark: (sentence: BookmarkedSentence) => void;
  onUpdatePreferences: (updated: Partial<UserPreferences>) => void;
}

export const BoardView: React.FC<BoardViewProps> = ({
  companion,
  preferences,
  onSelectCompanion,
  onJumpToStage,
  onToggleBookmark,
  onToggleSentenceBookmark,
  onUpdatePreferences
}) => {
  const STAGE_TITLES = [
    { num: 1, label: '01', title: '选择旅伴', desc: '选一只合拍的萌宠搭子，陪你轻松读英语吧' },
    { num: 2, label: '02', title: '对话定级', desc: '星盘吸纳兴趣 + 4句自适应微定级 + 底部对话框' },
    { num: 8, label: '03', title: '定制画像', desc: '智能匹配计算，动态切换为建议起点与阅读画像' },
    { num: 10, label: '04', title: '阅读首页', desc: '今日精选、专属推荐书架与三大导航' }
  ];

  return (
    <div className="w-full min-h-screen p-4 sm:p-8 bg-[#ECE8F7]">
      {/* Board Description Header */}
      <div className="max-w-7xl mx-auto mb-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E7E1F0] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-700 font-bold">
              一鹿知 · 阅读旅程全景看板
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            一鹿知 · 4 步完整旅程
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            涵盖选伴、360°星轨罗盘兴趣吸纳、4 问友好互动、4 句自适应微定级、建议起点定制画像及沉浸阅读首页。
          </p>
        </div>

        <button
          onClick={() => onJumpToStage(1)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
        >
          <Smartphone size={16} />
          <span>进入手机交互模式 (从第 01 屏开始)</span>
        </button>
      </div>

      {/* Grid of Phones */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
        {STAGE_TITLES.map((stage) => (
          <div key={stage.num} className="w-[280px] sm:w-[310px] flex flex-col">
            {/* Screen Top Header Tag */}
            <div className="flex items-center justify-between mb-2.5 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-6 h-5 rounded-md bg-white border border-[#E7E1F0] text-[11px] font-mono font-bold text-emerald-700 flex items-center justify-center shadow-xs">
                  {stage.label}
                </span>
                <h3 className="text-xs font-bold text-stone-800 truncate">{stage.title}</h3>
              </div>
              <button
                onClick={() => onJumpToStage(stage.num)}
                className="text-[10px] text-stone-500 hover:text-emerald-700 flex items-center gap-0.5 transition-colors font-medium cursor-pointer"
              >
                <span>试玩</span>
                <ArrowRight size={10} />
              </button>
            </div>

            {/* Scaled Phone Frame Container (Black phone chassis with warm cream screen) */}
            <div
              onClick={() => onJumpToStage(stage.num)}
              className="relative w-full h-[580px] rounded-[32px] bg-[#16181F] border-2 border-[#2A2E39] hover:border-emerald-500 p-2 shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden group flex flex-col"
            >
              <div className="w-full h-full rounded-[24px] bg-[#F4F1FA] overflow-hidden relative pointer-events-none text-left">
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
                    bookmarkedSentences={preferences.bookmarkedSentences}
                    onToggleSentenceBookmark={onToggleSentenceBookmark}
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
                    onToggleSentenceBookmark={onToggleSentenceBookmark}
                    onRestartOnboarding={() => {}}
                  />
                )}
              </div>

              {/* Hover Overlay Hint */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[1px] flex items-center justify-center transition-opacity rounded-[32px]">
                <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg flex items-center gap-1.5">
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
