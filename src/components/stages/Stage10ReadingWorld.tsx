import React, { useState } from 'react';
import { Bookmark, Heart, Clock, Home, MoreHorizontal, Smile, Sparkles, ArrowRight, Volume2, Trash2 } from 'lucide-react';
import { BookmarkedSentence, Companion, Story, UserPreferences } from '../../types';
import { WORLD_STORIES, FIRST_STORY } from '../../data';
import { HOME_STORY_ARTICLES } from '../../firstReadArticles';
import { CompanionAvatar } from '../CompanionAvatar';

interface Stage10ReadingWorldProps {
  companion: Companion;
  preferences: UserPreferences;
  onOpenStory: (storyId: string) => void;
  onToggleBookmark: (word: string) => void;
  onToggleSentenceBookmark: (sentence: BookmarkedSentence) => void;
  onRestartOnboarding: () => void;
  rideCount?: number;
  // Consecutive reading days, shown in the featured banner.
  streakDays?: number;
  onOpenCompanion?: () => void;
  // Story shown as the large featured card (defaults to the first story).
  featuredStoryId?: string;
  // V2 before the first read: mark the featured story as the user's first ride.
  showFirstRideHint?: boolean;
}

export const Stage10ReadingWorld: React.FC<Stage10ReadingWorldProps> = ({
  companion,
  preferences,
  onOpenStory,
  onToggleBookmark,
  onToggleSentenceBookmark,
  onRestartOnboarding,
  rideCount = 0,
  streakDays = 0,
  onOpenCompanion,
  featuredStoryId,
  showFirstRideHint = false
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'vocab' | 'profile'>('home');
  const [activeCollectionTab, setActiveCollectionTab] = useState<'words' | 'sentences'>('words');
  const likes: Record<string, number> = {
    'world-1': 124,
    'world-2': 89,
    'world-3': 215
  };

  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Titles, hook and length come from the article each card opens, so the card matches the reader.
  const storyInfo = (id: string) => HOME_STORY_ARTICLES[id] || HOME_STORY_ARTICLES['world-1'];

  const mainStory = WORLD_STORIES.find((story) => story.id === featuredStoryId) || WORLD_STORIES[0];
  const duoStories = WORLD_STORIES.filter((story) => story.id !== mainStory.id);

  return (
    <div className="h-full flex flex-col justify-between text-stone-900 select-none relative overflow-hidden bg-[#F1F0FA]">
      {/* Scrollable Content Area */}
      <div className={`flex-1 overflow-y-auto no-scrollbar ${activeTab === 'home' ? '' : 'p-5'}`}>
        {activeTab === 'home' && (
          <div className="rh-home">
            <header className="rh-header">
              <h1>今天，想读点什么？</h1>
              <div className="rj-capsule">
                <button type="button" aria-label="更多">
                  <MoreHorizontal size={21} strokeWidth={1.8} />
                </button>
                <span aria-hidden="true" />
                <button type="button" aria-label="关闭">
                  <i className="rj-close-mark" />
                </button>
              </div>
            </header>

            {/* Featured story: night-sky banner with the ride count, then the card tucked under it */}
            <section className="rh-featured">
              <div
                className="rh-banner"
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL}assets/readpal-start-scene.png)` }}
              >
                <p>
                  <i aria-hidden="true" />
                  已连续阅读 <strong>{streakDays}</strong> 天
                </p>
                <span className="rh-pick">今日精选</span>
              </div>
              <button type="button" className="rh-featured-card" onClick={() => onOpenStory(mainStory.id)}>
                <div className="rh-cover rh-cover-large">
                  <img src={mainStory.cover} alt="" draggable={false} onError={(e) => { (e.target as HTMLImageElement).src = mainStory.fallbackCover; }} />
                  {showFirstRideHint && <span className="rh-first-stop">第一站</span>}
                  <span className="rh-cover-meta">
                    <Heart size={17} strokeWidth={1.8} />
                    {likes[mainStory.id]}
                    <Clock size={17} strokeWidth={1.8} />
                    {storyInfo(mainStory.id).minutes}min
                  </span>
                </div>
                <h2 className="rh-title-en rh-title-en-large">{mainStory.title}</h2>
                <p className="rh-title-zh rh-title-zh-large">{storyInfo(mainStory.id).chineseTitle}</p>
                <p className="rh-hook">{storyInfo(mainStory.id).hook}</p>
                <div className="rh-card-foot">
                  <div className="rh-tags">
                    {mainStory.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  <span className="rh-start">
                    开始阅读 <ArrowRight size={18} strokeWidth={2} />
                  </span>
                </div>
              </button>
            </section>

            <div className="rh-grid">
              {duoStories.map((story) => (
                <button key={story.id} type="button" className="rh-card" onClick={() => onOpenStory(story.id)}>
                  <div className="rh-cover">
                    <img src={story.cover} alt="" draggable={false} onError={(e) => { (e.target as HTMLImageElement).src = story.fallbackCover; }} />
                    <span className="rh-cover-meta">
                      <Heart size={15} strokeWidth={1.8} />
                      {likes[story.id]}
                      <Clock size={15} strokeWidth={1.8} />
                      {storyInfo(story.id).minutes}min
                    </span>
                  </div>
                  <h3 className="rh-title-en">{story.title}</h3>
                  <p className="rh-title-zh">{storyInfo(story.id).chineseTitle}</p>
                  <p className="rh-hook rh-hook-small">{storyInfo(story.id).hook}</p>
                  <div className="rh-tags">
                    {story.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Vocabulary Book */}
        {activeTab === 'vocab' && (
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E7E1F0]">
              <div>
                <h2 className="text-lg font-bold text-stone-900">我的词句本</h2>
                <p className="text-xs text-stone-500">
                  {preferences.bookmarkedWords.length} 个词 · {preferences.bookmarkedSentences.length} 句
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 font-medium">
                L1 核心
              </span>
            </div>

            <div className="mb-4 flex w-full rounded-xl border border-[#E5DFF0] bg-white p-1" role="tablist" aria-label="词句本类型">
              <button
                type="button"
                role="tab"
                aria-selected={activeCollectionTab === 'words'}
                onClick={() => setActiveCollectionTab('words')}
                className={`min-h-9 flex-1 rounded-lg text-[12px] font-semibold transition-colors ${
                  activeCollectionTab === 'words' ? 'bg-[#F2EFFA] text-[#766B91]' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                生词 {preferences.bookmarkedWords.length}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeCollectionTab === 'sentences'}
                onClick={() => setActiveCollectionTab('sentences')}
                className={`min-h-9 flex-1 rounded-lg text-[12px] font-semibold transition-colors ${
                  activeCollectionTab === 'sentences' ? 'bg-[#FBE8E3] text-[#9B3021]' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                收藏句子 {preferences.bookmarkedSentences.length}
              </button>
            </div>

            {activeCollectionTab === 'sentences' ? (
              preferences.bookmarkedSentences.length === 0 ? (
                <div className="py-12 text-center text-xs text-stone-400">
                  <Bookmark size={30} className="mx-auto mb-2 opacity-40" />
                  <p>试读时收藏的句子会保存在这里。</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {preferences.bookmarkedSentences.map((item) => (
                    <article
                      key={item.sentence}
                      className="flex items-start justify-between gap-3 rounded-xl border border-[#E7E1F0] bg-white p-3.5 shadow-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-medium leading-5 text-[#25243C]">{item.sentence}</p>
                        <p className="mt-1.5 text-[12px] leading-5 text-[#766B91]">{item.translation}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleSentenceBookmark(item)}
                        className="shrink-0 rounded-lg p-2 text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        title="移除收藏句子"
                        aria-label="移除收藏句子"
                      >
                        <Trash2 size={15} />
                      </button>
                    </article>
                  ))}
                </div>
              )
            ) : preferences.bookmarkedWords.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                <Bookmark size={32} className="mx-auto mb-2 opacity-40 text-stone-400" />
                <p>在阅读正文中轻触高亮词汇，即可加入词句本。</p>
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
                      className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-start justify-between gap-3 shadow-xs"
                    >
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2">
                          <h4 className="text-base font-bold font-serif text-stone-900">{word}</h4>
                          <span className="text-[11px] text-stone-400 font-mono">{vocab.phonetic}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F4F1FA] border border-[#E7E1F0] text-emerald-800 font-medium">
                            {vocab.partOfSpeech}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-700 mt-1 font-semibold">{vocab.chinese}</p>
                        <p className="text-[11px] text-stone-600 mt-1 italic font-serif">"{vocab.example}"</p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handlePronounce(word)}
                          className="p-2 rounded-lg bg-[#F4F1FA] hover:bg-[#F0ECF8] text-emerald-700 transition-colors border border-[#E7E1F0] cursor-pointer shadow-xs"
                          title="听发音"
                        >
                          <Volume2 size={14} />
                        </button>
                        <button
                          onClick={() => onToggleBookmark(word)}
                          className="p-2 rounded-lg bg-[#F4F1FA] hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition-colors border border-[#E7E1F0] cursor-pointer shadow-xs"
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
            <div className="text-center py-4 mb-4 pb-4 border-b border-[#E7E1F0]">
              <button
                type="button"
                onClick={onOpenCompanion}
                aria-label={`查看我的旅伴${companion.name}`}
                className="relative mx-auto mb-2 block h-20 w-20 rounded-[22px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8176A8]"
              >
                <CompanionAvatar companion={companion} size={80} alt={companion.name} />
              </button>
              <h2 className="text-base font-bold text-stone-900">
                你的伴读者：{companion.name}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">{companion.type} · {companion.quote}</p>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">当前建议起点</span>
                <span className="font-bold text-emerald-700 font-mono text-sm">
                  {preferences.profile.startingLevel} (初级进阶)
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">伴读提示偏好</span>
                <span className="text-stone-800 font-medium">
                  {preferences.profile.hintDensity === 'light' ? '轻提示' : '多解释'}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">单次阅读节奏</span>
                <span className="text-stone-800 font-medium">
                  {preferences.profile.sessionDuration} 分钟 / 次
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                <span className="text-stone-500">车票册</span>
                <span className="text-emerald-700 font-semibold">已收集 {rideCount} 张车票</span>
              </div>

              {preferences.profile.goalTrack?.targetFocus && (
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300/80 flex items-center justify-between shadow-xs">
                  <span className="text-emerald-900 font-medium flex items-center gap-1.5">
                    <span>{preferences.profile.goalTrack.category === 'exam' ? '🎯' :
                           preferences.profile.goalTrack.category === 'workplace' ? '💼' :
                           preferences.profile.goalTrack.category === 'original' ? '🌟' : '🌱'}</span>
                    <span>细分目标专项</span>
                  </span>
                  <span className="font-bold text-emerald-900 truncate max-w-[170px]">
                    {preferences.profile.goalTrack.targetFocus}
                  </span>
                </div>
              )}

              {preferences.profile.goalTrack?.targetHurdle && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">重点突破卡点</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">
                    {preferences.profile.goalTrack.targetHurdle}
                  </span>
                </div>
              )}

              {preferences.profile.goal && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">阅读目标</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.goal}</span>
                </div>
              )}

              {preferences.profile.challenge && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">主要攻克阻碍</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.challenge}</span>
                </div>
              )}

              {preferences.profile.durationPreference && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">专注习惯</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.durationPreference}</span>
                </div>
              )}

              {preferences.profile.companionStyle && (
                <div className="p-3.5 rounded-2xl bg-[#FFFFFF] border border-[#E7E1F0] flex items-center justify-between shadow-xs">
                  <span className="text-stone-500">伴读风格</span>
                  <span className="text-stone-800 font-medium truncate max-w-[170px]">{preferences.profile.companionStyle}</span>
                </div>
              )}
            </div>

            <button
              onClick={onRestartOnboarding}
              className="w-full mt-5 py-2.5 rounded-xl bg-white hover:bg-[#F0ECF8] text-stone-700 hover:text-stone-900 text-xs font-medium transition-colors border border-[#E7E1F0] shadow-xs cursor-pointer"
            >
              重新体验完整引导流程
            </button>
          </div>
        )}
      </div>

      {/* Bottom Fixed Tab Navigation */}
      <nav className="rh-tabbar">
        {([
          ['home', '首页', Home],
          ['vocab', '词句本', Bookmark],
          ['profile', '我的', Smile]
        ] as const).map(([tab, label, Icon]) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            aria-current={activeTab === tab ? 'page' : undefined}
            className={activeTab === tab ? 'is-active' : undefined}
          >
            <Icon size={26} strokeWidth={1.8} fill={activeTab === tab && tab === 'home' ? 'currentColor' : 'none'} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
