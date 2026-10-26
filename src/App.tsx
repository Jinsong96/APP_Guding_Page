/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookmarkedSentence, Companion, CompanionId, ReadSummary, ReadingLevel, RideTicket, SharedEvent, UserPreferences } from './types';
import { COMPANIONS, INITIAL_PREFERENCES } from './data';
import { AppScreen, DemoVersion, TopNavigationHeader, screensForVersion } from './components/TopNavigationHeader';
import { PhoneSimulator } from './components/PhoneSimulator';
import { Stage01Companion } from './components/stages/Stage01Companion';
import { Stage02AiChat } from './components/stages/Stage02AiChat';
import { Stage10ReadingWorld } from './components/stages/Stage10ReadingWorld';
import { Stage00Start } from './components/stages/Stage00Start';
import { StageRecommend } from './components/stages/StageRecommend';
import { StageFirstRead } from './components/stages/StageFirstRead';
import { StageCompanionHome } from './components/stages/StageCompanionHome';
import { StagePicking } from './components/stages/StagePicking';
import { TicketIssueIntro } from './components/TicketIssueIntro';
import { CefrLevelKey } from './components/stages/Stage02AiChat';
import { ReadingReport, ReportNextArticle, ReportTotals } from './components/ReadingReport';
import {
  AMAZING_FRIEND_ARTICLE,
  CEFR_TO_STARTING_LEVEL,
  FIRST_READ_ARTICLES,
  FirstReadArticle,
  HOME_STORY_ARTICLES,
  pickNextArticle,
  rankHomeStoriesForInterests,
  startLevelForGoal
} from './firstReadArticles';

type EntryScreen = 'start' | 'companion' | 'stage';

export default function App() {
  // V1 = 完整版 (goal/scene/duration questions + article picker); V2 = 简略版 (difficulty question + auto pick).
  const [version, setVersion] = useState<DemoVersion>('v1');
  // V2 only: the difficulty the user chose, used as the first read's starting level.
  const [v2StartLevel, setV2StartLevel] = useState<CefrLevelKey>('A2');
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [stage02Step, setStage02Step] = useState<number>(1);
  const [entryScreen, setEntryScreen] = useState<EntryScreen>('start');
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [firstReadArticleId, setFirstReadArticleId] = useState<string>(FIRST_READ_ARTICLES[0].id);
  // What happened during the latest finished read, for the arrival screen's stats.
  const [lastReadSummary, setLastReadSummary] = useState<ReadSummary | undefined>();
  const [likedArticleIds, setLikedArticleIds] = useState<string[]>([]);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>([]);
  // Story card last opened from the reading home.
  const [homeStoryId, setHomeStoryId] = useState<string>('world-1');
  // Article opened from a report's 下一篇推荐; overrides the home story card while set.
  const [nextArticleId, setNextArticleId] = useState<string | null>(null);
  // English words read across all finished reads, for the report's 累计阅读词数.
  const [totalWordsRead, setTotalWordsRead] = useState(0);
  // The ticket book and shared moments behind the companion line.
  const [tickets, setTickets] = useState<RideTicket[]>([]);
  const [sharedEvents, setSharedEvents] = useState<SharedEvent[]>([]);
  const [companionHomeReturnStage, setCompanionHomeReturnStage] = useState<number>(10);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const currentCompanion =
    COMPANIONS.find((c) => c.id === preferences.companionId) || COMPANIONS[0];
  const firstReadArticle =
    FIRST_READ_ARTICLES.find((article) => article.id === firstReadArticleId) || FIRST_READ_ARTICLES[0];
  const firstReadStartLevel = version === 'v2' ? v2StartLevel : startLevelForGoal(preferences.profile.goalTrack);
  const favouriteTheme = preferences.selectedThemes?.[0] || preferences.interestTheme;

  const dateLabel = (date: Date) =>
    `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
  const todayLabel = () => dateLabel(new Date());

  // Consecutive days with a finished read, counting back from today (or from yesterday if today has none yet).
  const readingStreakDays = () => {
    const readDays = new Set(tickets.map((ticket) => ticket.date));
    const day = new Date();
    if (!readDays.has(dateLabel(day))) day.setDate(day.getDate() - 1);
    let streak = 0;
    while (readDays.has(dateLabel(day))) {
      streak += 1;
      day.setDate(day.getDate() - 1);
    }
    return streak;
  };

  // Ticket for a read; reuses the stored one so revisiting an arrival screen never issues a second ticket.
  const ticketFor = (story: Omit<RideTicket, 'rideNumber' | 'date'>): RideTicket =>
    tickets.find((ticket) => ticket.id === story.id) || {
      ...story,
      rideNumber: tickets.length + 1,
      date: todayLabel()
    };

  const recordRide = (ticket: RideTicket) => {
    if (tickets.some((item) => item.id === ticket.id)) return;
    setTickets((prev) => [...prev, ticket]);
    setSharedEvents((prev) => [
      ...prev,
      {
        id: `ride-${ticket.id}`,
        kind: 'ride',
        date: ticket.date,
        title: tickets.length === 0 ? '第一次一起读完一篇' : '又一起到达一站',
        detail: `我们一起读完了《${ticket.chineseTitle}》。`
      }
    ]);
  };

  const firstReadTicket = ticketFor({
    id: firstReadArticle.id,
    title: firstReadArticle.title,
    chineseTitle: firstReadArticle.chineseTitle,
    theme: firstReadArticle.themes.find((theme) => preferences.selectedThemes?.includes(theme)) || firstReadArticle.themes[0],
    coverUrl: firstReadArticle.coverUrl
  });

  const homeArticle =
    [...FIRST_READ_ARTICLES, AMAZING_FRIEND_ARTICLE].find((article) => article.id === nextArticleId) ||
    HOME_STORY_ARTICLES[homeStoryId] ||
    HOME_STORY_ARTICLES['world-1'];
  // V2: the home story featured as the user's first ride (best interest match).
  const v2FeaturedStoryId = rankHomeStoriesForInterests(preferences.selectedThemes)[0];
  // 下一篇推荐 on the reading report: best unread interest match after this article.
  const nextArticleAfter = (current: FirstReadArticle) =>
    pickNextArticle(preferences.selectedThemes, [current.id, ...tickets.map((ticket) => ticket.id)]);
  const reportNextArticle = (article?: FirstReadArticle): ReportNextArticle | undefined =>
    article && { title: article.title, coverUrl: article.coverUrl, coverAlt: article.chineseTitle };
  const openNextArticle = (article?: FirstReadArticle) => {
    if (!article) return;
    setNextArticleId(article.id);
    goToStage(4);
  };
  const reportTotals: ReportTotals = {
    days: Math.max(1, new Set(tickets.map((ticket) => ticket.date)).size),
    words: totalWordsRead,
    sentences: preferences.bookmarkedSentences.length,
    savedWords: preferences.bookmarkedWords.length
  };
  // V2 has no separate first read: the first article opened from home is the first read.
  const isV2FirstRead = version === 'v2' && tickets.length === 0;
  const homeStoryTicket = ticketFor({
    id: homeArticle.id,
    title: homeArticle.title,
    chineseTitle: homeArticle.chineseTitle,
    theme: homeArticle.themes[0],
    coverUrl: homeArticle.coverUrl
  });

  const openCompanionHome = (returnStage: number) => {
    setCompanionHomeReturnStage(returnStage);
    goToStage(13);
  };

  // Moves the phone to a stage and keeps the top screen strip in sync (-1 for off-strip stages).
  const goToStage = (stage: number, step?: number) => {
    const screen = screensForVersion(version).find(
      (item) => item.stage === stage && (step === undefined || item.step === step)
    );
    setCurrentStage(stage);
    setCurrentScreen(screen ? screen.index : -1);
    setEntryScreen(stage === 0 ? 'start' : stage === 1 ? 'companion' : 'stage');
    if (step !== undefined) setStage02Step(step);
  };

  const handleSelectCompanion = (id: CompanionId, announce = true) => {
    setPreferences((prev) => ({
      ...prev,
      companionId: id
    }));
    const companion = COMPANIONS.find((c) => c.id === id);
    if (announce && companion) {
      showToast(`已选定伴读萌宠：${companion.name} (${companion.type})`);
    }
  };

  const handleToggleBookmark = (word: string) => {
    setPreferences((prev) => {
      const exists = prev.bookmarkedWords.includes(word);
      const nextWords = exists
        ? prev.bookmarkedWords.filter((w) => w !== word)
        : [...prev.bookmarkedWords, word];
      showToast(exists ? `已从生词本移除: ${word}` : `已收录到生词本: ${word}`);
      return { ...prev, bookmarkedWords: nextWords };
    });
  };

  const toggleArticleId = (id: string, update: React.Dispatch<React.SetStateAction<string[]>>) => {
    update((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]);
  };

  const handleToggleSentenceBookmark = (sentence: BookmarkedSentence) => {
    setPreferences((prev) => {
      const exists = prev.bookmarkedSentences.some((item) => item.sentence === sentence.sentence);
      const nextSentences = exists
        ? prev.bookmarkedSentences.filter((item) => item.sentence !== sentence.sentence)
        : [...prev.bookmarkedSentences, sentence];
      showToast(exists ? '已从词句本移除这句话' : '已收藏到词句本');
      return { ...prev, bookmarkedSentences: nextSentences };
    });
    const isAdding = !preferences.bookmarkedSentences.some((item) => item.sentence === sentence.sentence);
    if (isAdding && !sharedEvents.some((event) => event.kind === 'bookmark')) {
      const excerpt = sentence.sentence.length > 60 ? `${sentence.sentence.slice(0, 60)}…` : sentence.sentence;
      setSharedEvents((prev) => [
        ...prev,
        {
          id: 'first-bookmark',
          kind: 'bookmark',
          date: todayLabel(),
          title: '收藏了第一句喜欢的话',
          detail: `“${excerpt}”`
        }
      ]);
    }
  };

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
    showToast('阅读画像偏好设置已更新');
  };

  const handleReset = () => {
    setCurrentStage(0);
    setCurrentScreen(0);
    setStage02Step(1);
    setEntryScreen('start');
    setPreferences(INITIAL_PREFERENCES);
    setTickets([]);
    setSharedEvents([]);
    setLikedArticleIds([]);
    setBookmarkedArticleIds([]);
    setV2StartLevel('A2');
    showToast('已返回开始页');
  };

  const handleSetVersion = (nextVersion: DemoVersion) => {
    if (nextVersion === version) return;
    setVersion(nextVersion);
    handleReset();
    showToast(nextVersion === 'v2' ? '已切换到 V2 简略版' : '已切换到 V1 完整版');
  };

  const handleJumpToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen.index);
    setCurrentStage(screen.stage);
    setEntryScreen(screen.stage === 0 ? 'start' : screen.stage === 1 ? 'companion' : 'stage');
    if (screen.step !== undefined) setStage02Step(screen.step);
  };

  return (
    <div className="onboarding-app min-h-screen bg-[#ECE8F7] text-stone-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Global Navigation Bar */}
      <TopNavigationHeader
        currentScreen={currentScreen}
        version={version}
        onSetVersion={handleSetVersion}
        companion={currentCompanion}
        onJumpToScreen={handleJumpToScreen}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center overflow-x-hidden">
        <div className="w-full py-1 sm:py-2.5 flex flex-col items-center justify-center">
          <PhoneSimulator darkChrome={entryScreen === 'start'}>
            {entryScreen === 'start' && (
              <Stage00Start
                onStart={() => {
                  setCurrentStage(1);
                  setCurrentScreen(1);
                  setEntryScreen('companion');
                }}
                onBrowse={() => goToStage(10)}
              />
            )}

            {/* Stage 01: Companion Selection */}
            {entryScreen === 'companion' && currentStage === 1 && (
              <Stage01Companion
                selectedCompanionId={preferences.companionId}
                onSelectCompanion={(id) => handleSelectCompanion(id, false)}
                onBack={() => {
                  setCurrentStage(0);
                  setCurrentScreen(0);
                  setEntryScreen('start');
                }}
                onNext={() => {
                  setCurrentStage(2);
                  setCurrentScreen(2);
                  setStage02Step(1);
                  setEntryScreen('stage');
                }}
              />
            )}

            {/* Stage 02: interests + goal/habit questions */}
            {entryScreen === 'stage' && currentStage === 2 && (
              <Stage02AiChat
                companion={currentCompanion}
                key={version}
                version={version}
                initialStep={stage02Step}
                onStepChange={(step) => {
                  setStage02Step(step);
                  const screen = screensForVersion(version).find((item) => item.stage === 2 && item.step === step);
                  if (screen) setCurrentScreen(screen.index);
                }}
                onBack={() => goToStage(1)}
                onComplete={(themes, surveyData) => {
                  setPreferences((prev) => {
                    const nextThemes = themes.length ? themes : prev.selectedThemes || [];
                    return {
                      ...prev,
                      interestTheme: nextThemes[0] || prev.interestTheme,
                      selectedThemes: nextThemes,
                      profile: {
                        ...prev.profile,
                        goal: surveyData?.goal || prev.profile.goal,
                        durationPreference: surveyData?.duration || prev.profile.durationPreference,
                        companionStyle: surveyData?.companionStyle || prev.profile.companionStyle,
                        sessionDuration: surveyData?.duration?.startsWith('3') ? 5 : prev.profile.sessionDuration,
                        goalTrack: surveyData?.goalTrack || prev.profile.goalTrack
                      }
                    };
                  });
                  if (version === 'v2') {
                    setV2StartLevel(surveyData?.initialLevel || 'A2');
                    goToStage(16);
                    return;
                  }
                  goToStage(11);
                }}
              />
            )}

            {/* Stage 11: pick the first article */}
            {entryScreen === 'stage' && currentStage === 11 && (
              <StageRecommend
                companion={currentCompanion}
                selectedThemes={preferences.selectedThemes}
                level={firstReadStartLevel}
                onBack={() => goToStage(2, 13)}
                onSelectArticle={(article) => {
                  setFirstReadArticleId(article.id);
                  goToStage(12);
                }}
              />
            )}

            {/* Stage 12: first read — the opening paragraphs set the starting level */}
            {entryScreen === 'stage' && currentStage === 12 && (
              <StageFirstRead
                key={`${firstReadArticle.id}-${firstReadStartLevel}`}
                companion={currentCompanion}
                article={firstReadArticle}
                startLevel={firstReadStartLevel}
                bookmarkedSentences={preferences.bookmarkedSentences}
                bookmarkedWords={preferences.bookmarkedWords}
                onToggleWordBookmark={handleToggleBookmark}
                onToggleSentenceBookmark={handleToggleSentenceBookmark}
                isArticleLiked={likedArticleIds.includes(firstReadArticle.id)}
                isArticleBookmarked={bookmarkedArticleIds.includes(firstReadArticle.id)}
                onToggleArticleLike={() => toggleArticleId(firstReadArticle.id, setLikedArticleIds)}
                onToggleArticleBookmark={() => toggleArticleId(firstReadArticle.id, setBookmarkedArticleIds)}
                onBack={() => (version === 'v2' ? goToStage(2, 14) : goToStage(11))}
                onComplete={(finalLevel: CefrLevelKey, _words, summary) => {
                  setLastReadSummary(summary);
                  setTotalWordsRead((total) => total + summary.wordsRead);
                  recordRide(firstReadTicket);
                  const mappedLevel: ReadingLevel =
                    finalLevel === 'A1-' ? 'easy' : finalLevel === 'B1' || finalLevel === 'B2+' ? 'hard' : 'mid';
                  setPreferences((prev) => ({
                    ...prev,
                    determinedCefr: finalLevel,
                    currentLevel: mappedLevel,
                    profile: { ...prev.profile, startingLevel: CEFR_TO_STARTING_LEVEL[finalLevel] }
                  }));
                  goToStage(8);
                }}
              />
            )}

            {/* Stage 08: reading report. V1: after the first read. V2: after every read (V2 has no stage 7). */}
            {entryScreen === 'stage' && currentStage === 8 && (
              <ReadingReport
                companion={currentCompanion}
                ticket={version === 'v2' ? homeStoryTicket : firstReadTicket}
                summary={lastReadSummary}
                quote={(version === 'v2' ? homeArticle : firstReadArticle).quote}
                totals={reportTotals}
                nextArticle={reportNextArticle(nextArticleAfter(version === 'v2' ? homeArticle : firstReadArticle))}
                onStartNext={() => openNextArticle(nextArticleAfter(version === 'v2' ? homeArticle : firstReadArticle))}
                onBack={() => goToStage(version === 'v2' ? 10 : 12)}
                onHome={() => {
                  goToStage(10);
                  if ((version === 'v2' ? homeStoryTicket : firstReadTicket).rideNumber === 1) {
                    showToast('欢迎开启阅读体验！');
                  }
                }}
              />
            )}

            {/* Stage 04: a read opened from the reading home — same reader as the first read */}
            {entryScreen === 'stage' && currentStage === 4 && (
              <StageFirstRead
                key={`home-${homeArticle.id}`}
                mode="library"
                rated={version !== 'v2'}
                companion={currentCompanion}
                article={homeArticle}
                startLevel={version === 'v2' ? v2StartLevel : preferences.determinedCefr || firstReadStartLevel}
                bookmarkedSentences={preferences.bookmarkedSentences}
                bookmarkedWords={preferences.bookmarkedWords}
                onToggleWordBookmark={handleToggleBookmark}
                onToggleSentenceBookmark={handleToggleSentenceBookmark}
                isArticleLiked={likedArticleIds.includes(homeArticle.id)}
                isArticleBookmarked={bookmarkedArticleIds.includes(homeArticle.id)}
                onToggleArticleLike={() => toggleArticleId(homeArticle.id, setLikedArticleIds)}
                onToggleArticleBookmark={() => toggleArticleId(homeArticle.id, setBookmarkedArticleIds)}
                onBack={() => goToStage(10)}
                onComplete={(_level, _words, summary) => {
                  setLastReadSummary(summary);
                  setTotalWordsRead((total) => total + summary.wordsRead);
                  if (isV2FirstRead) {
                    setPreferences((prev) => ({
                      ...prev,
                      determinedCefr: v2StartLevel,
                      profile: { ...prev.profile, startingLevel: CEFR_TO_STARTING_LEVEL[v2StartLevel] }
                    }));
                    recordRide(homeStoryTicket);
                    goToStage(8);
                    return;
                  }
                  recordRide(homeStoryTicket);
                  // V2 has one reading report for every read; V1 keeps a separate one for later reads.
                  goToStage(version === 'v2' ? 8 : 7);
                }}
              />
            )}

            {/* Stage 07: a later read finished — reading report */}
            {entryScreen === 'stage' && currentStage === 7 && (
              <ReadingReport
                companion={currentCompanion}
                ticket={homeStoryTicket}
                summary={lastReadSummary}
                quote={homeArticle.quote}
                totals={reportTotals}
                nextArticle={reportNextArticle(nextArticleAfter(homeArticle))}
                onStartNext={() => openNextArticle(nextArticleAfter(homeArticle))}
                onBack={() => goToStage(4)}
                onHome={() => goToStage(10)}
              />
            )}

            {/* Stage 16 (V2 only): the companion picks the first article, then the reading home */}
            {entryScreen === 'stage' && currentStage === 16 && (
              <StagePicking
                companion={currentCompanion}
                covers={[
                  HOME_STORY_ARTICLES[v2FeaturedStoryId],
                  ...Object.values(HOME_STORY_ARTICLES),
                  ...FIRST_READ_ARTICLES
                ].filter((article, index, all) => all.findIndex((item) => item.id === article.id) === index)}
                onDone={() => goToStage(10)}
              />
            )}

            {/* Stage 10: Reading World Hub. Stage 14 (V2 only) is the same home with the "ticket printed
                for you" intro on top, issuing the featured story as the first ride; the home stays
                mounted when the intro hands over to stage 10. */}
            {entryScreen === 'stage' && (currentStage === 10 || currentStage === 14) && (
              <div className="relative h-full w-full">
                <Stage10ReadingWorld
                  companion={currentCompanion}
                  preferences={preferences}
                  onOpenStory={(storyId) => {
                    setNextArticleId(null);
                    setHomeStoryId(storyId);
                    goToStage(4);
                  }}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleSentenceBookmark={handleToggleSentenceBookmark}
                  onRestartOnboarding={handleReset}
                  rideCount={tickets.length}
                  streakDays={readingStreakDays()}
                  onOpenCompanion={() => openCompanionHome(10)}
                  featuredStoryId={version === 'v2' ? v2FeaturedStoryId : undefined}
                  showFirstRideHint={version === 'v2' && tickets.length === 0}
                />
                {currentStage === 14 && (
                  <TicketIssueIntro
                    companion={currentCompanion}
                    article={HOME_STORY_ARTICLES[v2FeaturedStoryId]}
                    themes={
                      preferences.selectedThemes?.length
                        ? preferences.selectedThemes
                        : [HOME_STORY_ARTICLES[v2FeaturedStoryId].themes[0]]
                    }
                    level={v2StartLevel}
                    onDone={() => goToStage(10)}
                  />
                )}
              </div>
            )}

            {/* Stage 13: my companion — berth, ticket book and shared moments */}
            {entryScreen === 'stage' && currentStage === 13 && (
              <StageCompanionHome
                companion={currentCompanion}
                tickets={tickets}
                events={sharedEvents}
                favouriteTheme={tickets.length ? favouriteTheme : undefined}
                onBack={() => goToStage(companionHomeReturnStage)}
                onContinue={() => goToStage(10)}
                onSwitchCompanion={() => showToast('演示版暂不支持更换旅伴')}
                onManageMemory={() => showToast('共同记忆可查看、可删除，演示版暂未开放')}
              />
            )}
          </PhoneSimulator>
        </div>
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-stone-900/95 border border-stone-800 text-stone-100 text-xs font-medium shadow-xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
