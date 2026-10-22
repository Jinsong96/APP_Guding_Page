/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookmarkedSentence, Companion, CompanionId, ReadingLevel, RideTicket, SharedEvent, UserPreferences } from './types';
import { COMPANIONS, FIRST_STORY, INITIAL_PREFERENCES } from './data';
import { APP_SCREENS, AppScreen, TopNavigationHeader } from './components/TopNavigationHeader';
import { PhoneSimulator } from './components/PhoneSimulator';
import { BoardView } from './components/BoardView';
import { Stage01Companion } from './components/stages/Stage01Companion';
import { Stage02AiChat } from './components/stages/Stage02AiChat';
import { Stage07GrowthFeedback } from './components/stages/Stage07GrowthFeedback';
import { Stage08Customizing } from './components/stages/Stage08Customizing';
import { StageReader } from './components/stages/StageReader';
import { Stage10ReadingWorld } from './components/stages/Stage10ReadingWorld';
import { Stage00Start } from './components/stages/Stage00Start';
import { StageRecommend } from './components/stages/StageRecommend';
import { StageFirstRead } from './components/stages/StageFirstRead';
import { StageCompanionHome } from './components/stages/StageCompanionHome';
import { CefrLevelKey } from './components/stages/Stage02AiChat';
import { CEFR_TO_STARTING_LEVEL } from './components/stages/Stage08Customizing';
import { FIRST_READ_ARTICLES, FirstReadVocab, startLevelForGoal } from './firstReadArticles';

type EntryScreen = 'start' | 'companion' | 'stage';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [stage02Step, setStage02Step] = useState<number>(1);
  const [entryScreen, setEntryScreen] = useState<EntryScreen>('start');
  const [viewMode, setViewMode] = useState<'phone' | 'board'>('phone');
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [firstReadArticleId, setFirstReadArticleId] = useState<string>(FIRST_READ_ARTICLES[0].id);
  const [learnedWords, setLearnedWords] = useState<FirstReadVocab[]>([]);
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
  const firstReadStartLevel = startLevelForGoal(preferences.profile.goalTrack);
  const favouriteTheme = preferences.selectedThemes?.[0] || preferences.interestTheme;

  const todayLabel = () => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
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
        title: tickets.length === 0 ? '第一次一起读完一篇' : '又一起走过一程',
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

  const homeStoryTicket = ticketFor({
    id: FIRST_STORY.id,
    title: FIRST_STORY.title,
    chineseTitle: FIRST_STORY.chineseTitle,
    theme: '科学探索',
    coverUrl: FIRST_STORY.coverImage || firstReadArticle.coverUrl
  });

  const openCompanionHome = (returnStage: number) => {
    setCompanionHomeReturnStage(returnStage);
    goToStage(13);
  };

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
    setViewMode('phone');
    setPreferences(INITIAL_PREFERENCES);
    setTickets([]);
    setSharedEvents([]);
    showToast('已返回开始页');
  };

  const handleJumpToScreen = (screen: AppScreen) => {
    setCurrentScreen(screen.index);
    setCurrentStage(screen.stage);
    setEntryScreen(screen.stage === 0 ? 'start' : screen.stage === 1 ? 'companion' : 'stage');
    setViewMode('phone');
    if (screen.step !== undefined) setStage02Step(screen.step);
  };

  const handleJumpToStage = (stage: number) => {
    const screen = APP_SCREENS.find((item) => item.stage === stage);
    if (screen) {
      handleJumpToScreen(screen);
      return;
    }

    setCurrentStage(stage);
    setEntryScreen(stage === 0 ? 'start' : stage === 1 ? 'companion' : 'stage');
    setViewMode('phone');
  };

  return (
    <div className="onboarding-app min-h-screen bg-[#ECE8F7] text-stone-900 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Top Global Navigation Bar */}
      <TopNavigationHeader
        currentScreen={currentScreen}
        viewMode={viewMode}
        companion={currentCompanion}
        onSetViewMode={setViewMode}
        onJumpToScreen={handleJumpToScreen}
        onReset={handleReset}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center overflow-x-hidden">
        {viewMode === 'board' ? (
          <BoardView
            companion={currentCompanion}
            preferences={preferences}
            onSelectCompanion={handleSelectCompanion}
            onJumpToStage={(stageNum) => {
              handleJumpToStage(stageNum);
              showToast(`进入第 0${stageNum} 屏实操`);
            }}
            onToggleBookmark={handleToggleBookmark}
            onToggleSentenceBookmark={handleToggleSentenceBookmark}
            onUpdatePreferences={handleUpdatePreferences}
          />
        ) : (
          <div className="w-full py-1 sm:py-2.5 flex flex-col items-center justify-center">
            <PhoneSimulator darkChrome={entryScreen === 'start'}>
              {entryScreen === 'start' && (
                <Stage00Start
                  onStart={() => {
                    setCurrentStage(1);
                    setCurrentScreen(1);
                    setEntryScreen('companion');
                  }}
                  onBrowse={() => setViewMode('board')}
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
                  initialStep={stage02Step}
                  onStepChange={(step) => {
                    setStage02Step(step);
                    const screen = APP_SCREENS.find((item) => item.stage === 2 && item.step === step);
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
                    goToStage(11);
                  }}
                  onSkip={() => {
                    goToStage(11);
                    showToast('已跳过对话，先为你推荐几篇');
                  }}
                />
              )}

              {/* Stage 11: pick the first article */}
              {entryScreen === 'stage' && currentStage === 11 && (
                <StageRecommend
                  companion={currentCompanion}
                  selectedThemes={preferences.selectedThemes}
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
                  onToggleSentenceBookmark={handleToggleSentenceBookmark}
                  onBack={() => goToStage(11)}
                  onComplete={(finalLevel: CefrLevelKey, words) => {
                    setLearnedWords(words);
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

              {/* Stage 08: first read finished — achievement, starting level, reading profile */}
              {entryScreen === 'stage' && currentStage === 8 && (
                <Stage08Customizing
                  companion={currentCompanion}
                  interestTheme={preferences.interestTheme}
                  selectedThemes={preferences.selectedThemes}
                  determinedCefr={preferences.determinedCefr || 'A2'}
                  startingLevel={preferences.profile.startingLevel || 'L4'}
                  ticket={firstReadTicket}
                  articleMinutes={firstReadArticle.minutes}
                  paragraphCount={firstReadArticle.paragraphs.length}
                  learnedWords={learnedWords}
                  preferences={preferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onBack={() => goToStage(12)}
                  onNext={() => {
                    goToStage(10);
                    showToast('欢迎开启阅读体验！');
                  }}
                  onOpenTicketBook={() => openCompanionHome(8)}
                />
              )}

              {entryScreen === 'stage' && (currentStage === 4 || currentStage === 5 || currentStage === 6) && (
                <StageReader
                  stageNumber={currentStage}
                  stageTitle={currentStage === 4 ? '首次阅读' : '自适应阅读'}
                  progressPct={currentStage === 4 ? 36 : currentStage === 5 ? 68 : 92}
                  timeRemaining={currentStage === 4 ? '2:18' : currentStage === 5 ? '1:40' : '0:45'}
                  badgeLabel={currentStage === 4 ? '轻提示' : '自适应'}
                  currentLevel={preferences.currentLevel}
                  companion={currentCompanion}
                  bookmarkedWords={preferences.bookmarkedWords}
                  onToggleBookmark={handleToggleBookmark}
                  onBack={() => goToStage(currentStage === 4 ? 10 : currentStage - 1)}
                  onRateDifficulty={(_, selectedLevel) => {
                    if (selectedLevel) {
                      setPreferences((prev) => ({ ...prev, currentLevel: selectedLevel }));
                    }
                    if (currentStage === 6) recordRide(homeStoryTicket);
                    goToStage(currentStage === 4 ? 5 : currentStage === 5 ? 6 : 7);
                  }}
                />
              )}

              {entryScreen === 'stage' && currentStage === 7 && (
                <Stage07GrowthFeedback
                  companion={currentCompanion}
                  ticket={homeStoryTicket}
                  bookmarkCount={preferences.bookmarkedSentences.length}
                  onBack={() => goToStage(6)}
                  onNext={() => goToStage(10)}
                  onOpenTicketBook={() => openCompanionHome(7)}
                />
              )}

              {/* Stage 10: Reading World Hub */}
              {entryScreen === 'stage' && currentStage === 10 && (
                <Stage10ReadingWorld
                  companion={currentCompanion}
                  preferences={preferences}
                  onOpenStory={() => {
                    goToStage(4);
                    showToast('开始沉浸阅读');
                  }}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleSentenceBookmark={handleToggleSentenceBookmark}
                  onRestartOnboarding={handleReset}
                  rideCount={tickets.length}
                  onOpenCompanion={() => openCompanionHome(10)}
                />
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
        )}
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
