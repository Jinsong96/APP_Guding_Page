import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Companion, Story } from '../../types';
import { FIRST_STORY } from '../../data';

interface Stage03AiRecommendProps {
  companion: Companion;
  interestTheme: string;
  selectedThemes?: string[];
  onBack: () => void;
  onNext: () => void;
}

export const Stage03AiRecommend: React.FC<Stage03AiRecommendProps> = ({
  companion,
  interestTheme,
  selectedThemes,
  onBack,
  onNext
}) => {
  const [altStoryIndex, setAltStoryIndex] = useState(0);

  const stories: Story[] = [
    FIRST_STORY,
    {
      ...FIRST_STORY,
      id: 'mars-sub',
      title: 'Signals in the Red Dust',
      chineseTitle: '红沙深处的机械回音',
      part: '第 2 / 4 段',
      synopsis: '玛拉和维修机器人在废弃导轨中前行，捕捉到了本该在两年前沉寂的求救频率。'
    }
  ];

  const currentStory = stories[altStoryIndex];

  const handleSwap = () => {
    setAltStoryIndex((prev) => (prev + 1) % stories.length);
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

          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: companion.accentColor }} />
            <span className="text-stone-700 font-medium">已理解你的偏好</span>
            <span className="text-stone-400">· 推荐 1/1</span>
          </div>

          <button
            onClick={handleSwap}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-white hover:bg-[#EAF4EF] text-stone-600 hover:text-stone-900 border border-[#DCEBE5] shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>换一条</span>
          </button>
        </div>

        {/* Lead Title */}
        <div className="mt-4">
          <div className="flex items-center gap-1 text-xs text-emerald-700 font-medium mb-1">
            <Sparkles size={13} />
            <span>{companion.name} 专属推荐</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 leading-tight">
            我先带你去<br />
            <span style={{ color: companion.accentColor }}>
              {selectedThemes && selectedThemes.length > 0
                ? selectedThemes.slice(0, 2).join('与')
                : interestTheme || '科学'}
            </span>边缘的未来。
          </h1>
          {selectedThemes && selectedThemes.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              {selectedThemes.map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-white border border-[#DCEBE5] text-stone-700 font-medium shadow-xs"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recommended Story Card */}
      <div className="my-auto py-2">
        <div className="rounded-3xl bg-[#FFFFFF] border border-[#DCEBE5] overflow-hidden shadow-md relative transition-all duration-300">
          {/* Cover Image Banner */}
          <div className="relative h-44 w-full overflow-hidden bg-stone-100">
            <img
              src={currentStory.coverImage || `${import.meta.env.BASE_URL}assets/story/hero.webp`}
              alt={currentStory.title}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Minute badge */}
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-white flex items-center gap-1">
              <Clock size={11} className="text-emerald-400" />
              <span>约 4 分钟试读</span>
            </div>

            <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-emerald-500/80 text-white font-medium">
                {currentStory.continent}
              </span>
              <span className="text-white/70">·</span>
              <span className="text-white text-[11px] truncate">
                {currentStory.series}
              </span>
              <span className="text-white/70">·</span>
              <span className="text-emerald-300 text-[11px] font-mono">
                {currentStory.part}
              </span>
            </div>
          </div>

          {/* Story Body */}
          <div className="p-4 pt-2.5">
            <h2 className="text-lg font-bold text-stone-900 mb-1">
              {currentStory.chineseTitle}
            </h2>
            <p className="text-xs font-serif text-stone-500 italic mb-2.5">
              {currentStory.title}
            </p>
            <p className="text-xs text-stone-700 leading-relaxed bg-[#F0F8F4] p-2.5 rounded-xl border border-[#DCEBE5]">
              {currentStory.synopsis}
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onNext}
          className="w-full py-3.5 px-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer hover:brightness-105"
          style={{
            backgroundColor: companion.accentColor || '#65A30D',
            boxShadow: `0 6px 20px rgba(180, 100, 20, 0.25)`
          }}
        >
          <span>开始这篇故事</span>
          <ArrowRight size={17} />
        </button>

        <button
          onClick={handleSwap}
          className="w-full py-2.5 px-4 rounded-xl text-xs text-stone-600 hover:text-stone-900 bg-white hover:bg-[#EAF4EF] border border-[#DCEBE5] flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer"
        >
          <span>我想换一个感觉</span>
        </button>
      </div>
    </div>
  );
};
