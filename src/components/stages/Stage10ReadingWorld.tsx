import React, { useState } from 'react';
import { BookOpen, Bookmark, User, Heart, Clock, Sparkles, ArrowRight, Volume2, Trash2 } from 'lucide-react';
import { Companion, Story, UserPreferences } from '../../types';
import { WORLD_STORIES, FIRST_STORY } from '../../data';

interface Stage10ReadingWorldProps {
  companion: Companion;
  preferences: UserPreferences;
  onOpenStory: (storyId: string) => void;
  onToggleBookmark: (word: string) => void;
  onRestartOnboarding: () => void;
}

export const Stage10ReadingWorld: React.FC<Stage10ReadingWorldProps> = ({
  companion,
  preferences,
  onOpenStory,
  onToggleBookmark,
  onRestartOnboarding
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'vocab' | 'profile'>('home');
  const [likes, setLikes] = useState<Record<string, number>>({
    'world-1': 124,
    'world-2': 89,
    'world-3': 215
  });

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const mainStory = WORLD_STORIES[0];
  const duoStories = WORLD_STORIES.slice(1);

  return (
    <div className="h-full flex flex-col justify-between text-stone-900 select-none relative overflow-hidden bg-[#FAF6ED]">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
        {activeTab === 'home' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-8 h-8 rounded-full object-cover border border-amber-500/40"
                />
                <span className="text-xs sm:text-[13px] font-semibold text-stone-900 tracking-wide">
                  {companion.name}与你同行中
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono border border-emerald-300">
                  连续打卡 {preferences.streakDays} 天
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-medium border border-amber-300">
                  今日精选
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-stone-900 mt-3 mb-1">
              今天，想读点什么？
            </h1>
            <p className="text-xs text-stone-500 mb-4">
              根据你的 {preferences.profile?.startingLevel || 'L4'} 起点，为你精编的趣味沉浸读物。
            </p>

            {/* Featured Hero Story Card */}
            <div
              onClick={() => onOpenStory(mainStory.id)}
              className="rounded-3xl bg-[#FFFFFF] border border-[#E8DFC8] overflow-hidden shadow-md mb-4 cursor-pointer group transition-all duration-300 hover:border-amber-400/80"
            >
              <div className="relative h-40 w-full overflow-hidden bg-stone-100">
                <img
                  src={mainStory.cover}
                  alt={mainStory.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback to hero.webp if original fails
                    (e.target as HTMLImageElement).src = mainStory.fallbackCover;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white font-mono text-[11px] flex items-center gap-1 border border-white/10">
                    <Clock size={11} className="text-amber-400" />
                    <span>{mainStory.duration}</span>
                  </span>

                  <button
                    onClick={(e) => handleLike(e, mainStory.id)}
                    className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-stone-200 hover:text-rose-400 font-mono text-[11px] flex items-center gap-1 border border-white/10 transition-colors"
                  >
                    <Heart size={12} className="text-rose-400 fill-rose-400/20" />
                    <span>{likes[mainStory.id]}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 pt-2.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium">
                    {mainStory.mood}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-amber-700 transition-colors">
                  {mainStory.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                  {mainStory.blurb}
                </p>

                <div className="mt-3 pt-3 border-t border-[#E8DFC8] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    {mainStory.tags.map((t, idx) => (
                      <span key={idx} className="bg-[#FAF6ED] border border-[#E8DFC8] px-1.5 py-0.5 rounded text-stone-600">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-amber-700 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>开始阅读</span>
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </div>

            {/* Duo Secondary Stories */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {duoStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => onOpenStory(story.id)}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] overflow-hidden shadow-xs cursor-pointer group flex flex-col justify-between hover:border-amber-400/60 transition-all"
                >
                  <div className="relative h-24 w-full overflow-hidden bg-stone-100">
                    <img
                      src={story.cover}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = story.fallbackCover;
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-white font-mono">
                      {story.duration}
                    </div>
                  </div>

                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
                        {story.title}
                      </h4>
                      <p className="text-[11px] text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                        {story.blurb}
                      </p>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-[10px] text-stone-500">
                      <span>{story.tags[0]}</span>
                      <span className="text-amber-700 font-medium">阅读 →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Vocabulary Book */}
        {activeTab === 'vocab' && (
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8DFC8]">
              <div>
                <h2 className="text-lg font-bold text-stone-900">我的词句本</h2>
                <p className="text-xs text-stone-500">已收录 {preferences.bookmarkedWords.length} 个阅读高频词</p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-300 font-medium">
                L1 核心
              </span>
            </div>

            {preferences.bookmarkedWords.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                <Bookmark size={32} className="mx-auto mb-2 opacity-40 text-stone-400" />
                <p>在阅读正文中轻触绿色高亮词汇，即可加入词句本。</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {preferences.bookmarkedWords.map((word) => {
                  const vocab = FIRST_STORY.keyVocab[word] || {
                    word,
                    phonetic: '/.../',
                    partOfSpeech: 'w.',
                    chinese: '阅读生词',
                    englishDef: 'Vocabulary noted during reading.',
                    example: 'Recorded from reading session.',
                    companionNote: '持续复习，加深语感！'
                  };

                  return (
                    <div
                      key={word}
                      className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-start justify-between gap-3 shadow-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-base font-bold font-serif text-stone-900">{word}</h4>
                          <span className="text-[11px] text-stone-400 font-mono">{vocab.phonetic}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FAF6ED] border border-[#E8DFC8] text-amber-800 font-medium">
                            {vocab.partOfSpeech}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 mt-1 font-semibold">{vocab.chinese}</p>
                        <p className="text-[11px] text-stone-600 mt-1 italic font-serif">"{vocab.example}"</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePronounce(word)}
                          className="p-2 rounded-lg bg-[#FAF6ED] hover:bg-[#F2ECE1] text-amber-700 transition-colors border border-[#E2D8C6] cursor-pointer shadow-xs"
                          title="听发音"
                        >
                          <Volume2 size={14} />
                        </button>
                        <button
                          onClick={() => onToggleBookmark(word)}
                          className="p-2 rounded-lg bg-[#FAF6ED] hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors border border-[#E2D8C6] cursor-pointer shadow-xs"
                          title="移除"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile */}
        {activeTab === 'profile' && (
          <div>
            <div className="text-center py-4 mb-4 pb-4 border-b border-[#E8DFC8]">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>
              <h2 className="text-base font-bold text-stone-900">
                你的伴读者：{companion.name}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">{companion.type} · {companion.quote}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">当前建议起点</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">
                  {preferences.profile.startingLevel} (初级进阶)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">伴读提示偏好</span>
                <span className="text-stone-800 font-medium">
                  {preferences.profile.hintDensity === 'light' ? '轻提示' : '多解释'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">单次阅读节奏</span>
                <span className="text-stone-800 font-medium">
                  {preferences.profile.sessionDuration} 分钟 / 次
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">已点亮主题大陆</span>
                <span className="text-amber-700 font-semibold">科学大陆第 1 段海岸线</span>
              </div>

              {preferences.profile.goal && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">阅读目标</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.goal}</span>
                </div>
              )}

              {preferences.profile.challenge && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">主要攻克阻碍</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.challenge}</span>
                </div>
              )}

              {preferences.profile.durationPreference && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">专注习惯</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.durationPreference}</span>
                </div>
              )}

              {preferences.profile.companionStyle && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E8DFC8] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">伴读风格</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.companionStyle}</span>
                </div>
              )}
            </div>

            <button
              onClick={onRestartOnboarding}
              className="w-full mt-5 py-2.5 rounded-xl bg-white hover:bg-[#F2ECE1] text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors border border-[#E2D8C6] shadow-xs cursor-pointer"
            >
              重新体验完整引导流程
            </button>
          </div>
        )}
      </div>

      {/* Bottom Fixed Tab Navigation */}
      <nav className="h-16 border-t border-[#E8DFC8] bg-[#FAF6ED] flex items-center justify-around px-4 shadow-sm z-30">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-amber-700 font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <BookOpen size={18} />
          <span className="text-[10px] font-medium">首页</span>
        </button>

        <button
          onClick={() => setActiveTab('vocab')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'vocab' ? 'text-amber-700 font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <Bookmark size={18} />
          <span className="text-[10px] font-medium">词句本</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-amber-700 font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
        >
          <User size={18} />
          <span className="text-[10px] font-medium">我的</span>
        </button>
      </nav>
    </div>
  );
};
