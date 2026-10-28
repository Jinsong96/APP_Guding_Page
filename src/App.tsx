/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookmarkedSentence, CompanionId, ReadSummary, RideTicket, UserPreferences } from './types';
import { COMPANIONS, INITIAL_PREFERENCES } from './data';
import { APP_SCREENS, AppScreen, TopNavigationHeader } from './components/TopNavigationHeader';
import { PhoneSimulator } from './components/PhoneSimulator';
import { Stage01Companion } from './components/stages/Stage01Companion';
import { CefrLevelKey, INTEREST_STEP, Stage02AiChat } from './components/stages/Stage02AiChat';
import { Stage10ReadingWorld } from './components/stages/Stage10ReadingWorld';
import { Stage00Start } from './components/stages/Stage00Start';
import { StageFirstRead } from './components/stages/StageFirstRead';
import { StagePicking } from './components/stages/StagePicking';
import { ReadingReport, ReportNextArticle, ReportTotals } from './components/ReadingReport';
import {
  AMAZING_FRIEND_ARTICLE,
  CEFR_TO_STARTING_LEVEL,
  FIRST_READ_ARTICLES,
  FirstReadArticle,
  HOME_STORY_ARTICLES,
  pickNextArticle,
  rankHomeStoriesForInterests
} from './firstReadArticles';

type EntryScreen = 'start' | 'companion' | 'stage';

export default function App() {
  // The difficulty chosen on 03; every read is shown at this level.
  const [readingLevel, setReadingLevel] = useState<CefrLevelKey>('A2');
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [stage02Step, setStage02Step] = useState<number>(INTEREST_STEP);
  const [entryScreen, setEntryScreen] = useState<EntryScreen>('start');
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  // What happened during the latest finished read, for the report's stats.
  const [lastReadSummary, setLastReadSummary] = useState<ReadSummary | undefined>();
  const [likedArticleIds, setLikedArticleIds] = useState<string[]>([]);
  const [bookmarkedArticleIds, setBookmarkedArticleIds] = useState<string[]>([]);
  // Story card last opened from the reading home.
  const [homeStoryId, setHomeStoryId] = useState<string>('world-1');
  // Article opened from a report's 下一篇推荐; overrides the home story card while set.
  const [nextArticleId, setNextArticleId] = useState<string | null>(null);
  // English words read across all finished reads, for the report's 累计阅读词数.
  const [totalWordsRead, setTotalWordsRead] = useState(0);
  // One ticket per finished read.
  const [tickets, setTickets] = useState<RideTicket[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const currentCompanion =
    COMPANIONS.find((c) => c.id === preferences.companionId) || COMPANIONS[0];

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

  // Ticket for a read; reuses the stored one so revisiting a report never issues a second ticket.
  const ticketFor = (story: Omit<RideTicket, 'rideNumber' | 'date'>): RideTicket =>
    tickets.find((ticket) => ticket.id === story.id) || {
      ...story,
      rideNumber: tickets.length + 1,
      date: todayLabel()
    };

  const recordRide = (ticket: RideTicket) => {
    if (tickets.some((item) => item.id === ticket.id)) return;
    setTickets((prev) => [...prev, ticket]);
  };

  const homeArticle =
    [...FIRST_READ_ARTICLES, AMAZING_FRIEND_ARTICLE].find((article) => article.id === nextArticleId) ||
    HOME_STORY_ARTICLES[homeStoryId] ||
    HOME_STORY_ARTICLES['world-1'];
  // The home story featured as the user's first ride (best interest match).
  const featuredStoryId = rankHomeStoriesForInterests(preferences.selectedThemes)[0];
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
  // There is no separate first read: the first article opened from home is the first read.
  const isFirstRead = tickets.length === 0;
  const homeStoryTicket = ticketFor({
    id: homeArticle.id,
    title: homeArticle.title,
    chineseTitle: homeArticle.chineseTitle,
    theme: homeArticle.themes[0],
    coverUrl: homeArticle.coverUrl
  });

  // Moves the phone to a stage and keeps the top screen strip in sync (-1 for off-strip stages).
  const goToStage = (stage: number, step?: number) => {
    const screen = APP_SCREENS.find(
      (item) => item.stage === stage && (step === undefined || item.step === step)
    );
    setCurrentStage(stage);
    setCurrentScreen(screen ? screen.index : -1);
    setEntryScreen(stage === 0 ? 'start' : stage === 1 ? 'companion' : 'stage');
    if (step !== undefined) setStage02Step(step);
  };

  const handleSelectCompanion = (id: CompanionId) => {
    setPreferences((prev) => ({
      ...prev,
      companionId: id
    }));
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
  };

  const handleReset = () => {
    setCurrentStage(0);
    setCurrentScreen(0);
    setStage02Step(INTEREST_STEP);
    setEntryScreen('start');
    setPreferences(INITIAL_PREFERENCES);
    setTickets([]);
    setLikedArticleIds([]);
    setBookmarkedArticleIds([]);
    setReadingLevel('A2');
    showToast('已返回开始页');
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
                onSelectCompanion={handleSelectCompanion}
                onBack={() => {
                  setCurrentStage(0);
                  setCurrentScreen(0);
                  setEntryScreen('start');
                }}
                onNext={() => goToStage(2, INTEREST_STEP)}
              />
            )}

            {/* Stage 02: interests, then the difficulty question */}
            {entryScreen === 'stage' && currentStage === 2 && (
              <Stage02AiChat
                companion={currentCompanion}
                initialStep={stage02Step}
                onStepChange={(step) => {
                  setStage02Step(step);
                  const screen = APP_SCREENS.find((item) => item.stage === 2 && item.step === step);
                  if (screen) setCurrentScreen(screen.index);
                }}
                onBack={() => goToStage(1)}
                onComplete={(themes, level) => {
                  setPreferences((prev) => {
                    const nextThemes = themes.length ? themes : prev.selectedThemes || [];
                    return {
                      ...prev,
                      interestTheme: nextThemes[0] || prev.interestTheme,
                      selectedThemes: nextThemes
                    };
                  });
                  setReadingLevel(level);
                  goToStage(16);
                }}
              />
            )}

            {/* Stage 16: the companion picks the first article, then the reading home */}
            {entryScreen === 'stage' && currentStage === 16 && (
              <StagePicking
                companion={currentCompanion}
                covers={[
                  HOME_STORY_ARTICLES[featuredStoryId],
                  ...Object.values(HOME_STORY_ARTICLES),
                  ...FIRST_READ_ARTICLES
                ].filter((article, index, all) => all.findIndex((item) => item.id === article.id) === index)}
                onDone={() => goToStage(10)}
              />
            )}

            {/* Stage 10: Reading World Hub */}
            {entryScreen === 'stage' && currentStage === 10 && (
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
                featuredStoryId={featuredStoryId}
                showFirstRideHint={isFirstRead}
              />
            )}

            {/* Stage 04: an article opened from the reading home */}
            {entryScreen === 'stage' && currentStage === 4 && (
              <StageFirstRead
                key={`home-${homeArticle.id}`}
                companion={currentCompanion}
                article={homeArticle}
                level={readingLevel}
                bookmarkedSentences={preferences.bookmarkedSentences}
                bookmarkedWords={preferences.bookmarkedWords}
                onToggleWordBookmark={handleToggleBookmark}
                onToggleSentenceBookmark={handleToggleSentenceBookmark}
                isArticleLiked={likedArticleIds.includes(homeArticle.id)}
                isArticleBookmarked={bookmarkedArticleIds.includes(homeArticle.id)}
                onToggleArticleLike={() => toggleArticleId(homeArticle.id, setLikedArticleIds)}
                onToggleArticleBookmark={() => toggleArticleId(homeArticle.id, setBookmarkedArticleIds)}
                onBack={() => goToStage(10)}
                onComplete={(summary) => {
                  setLastReadSummary(summary);
                  setTotalWordsRead((total) => total + summary.wordsRead);
                  if (isFirstRead) {
                    setPreferences((prev) => ({
                      ...prev,
                      determinedCefr: readingLevel,
                      profile: { ...prev.profile, startingLevel: CEFR_TO_STARTING_LEVEL[readingLevel] }
                    }));
                  }
                  recordRide(homeStoryTicket);
                  // Every read prints its ticket (14) into the reading report (8).
                  goToStage(14);
                }}
              />
            )}

            {/* Stage 08: reading report, entered through stage 14 为你出票, where its ticket first prints
                out; the report stays mounted when 14 hands over to 08. */}
            {entryScreen === 'stage' && (currentStage === 8 || currentStage === 14) && (
              <ReadingReport
                issuing={currentStage === 14}
                onIssued={() => goToStage(8)}
                companionId={currentCompanion.id}
                ticket={homeStoryTicket}
                summary={lastReadSummary}
                quote={homeArticle.quote}
                totals={reportTotals}
                nextArticle={reportNextArticle(nextArticleAfter(homeArticle))}
                onStartNext={() => openNextArticle(nextArticleAfter(homeArticle))}
                onBack={() => goToStage(10)}
                onHome={() => {
                  goToStage(10);
                  if (homeStoryTicket.rideNumber === 1) {
                    showToast('欢迎开启阅读体验！');
                  }
                }}
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
