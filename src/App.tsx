/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookmarkedSentence, Companion, CompanionId, ReadingLevel, UserPreferences } from './types';
import { COMPANIONS, INITIAL_PREFERENCES } from './data';
import { APP_SCREENS, AppScreen, TopNavigationHeader } from './components/TopNavigationHeader';
import { PhoneSimulator } from './components/PhoneSimulator';
import { BoardView } from './components/BoardView';
import { Stage01Companion } from './components/stages/Stage01Companion';
import { Stage02AiChat } from './components/stages/Stage02AiChat';
import { Stage07GrowthFeedback } from './components/stages/Stage07GrowthFeedback';
import { Stage08Customizing } from './components/stages/Stage08Customizing';
import { Stage09ReadingProfile } from './components/stages/Stage09ReadingProfile';
import { StageReader } from './components/stages/StageReader';
import { Stage10ReadingWorld } from './components/stages/Stage10ReadingWorld';
import { Stage00Start } from './components/stages/Stage00Start';

type EntryScreen = 'start' | 'companion' | 'stage';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(0);
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [stage02Step, setStage02Step] = useState<number>(1);
  const [entryScreen, setEntryScreen] = useState<EntryScreen>('start');
  const [viewMode, setViewMode] = useState<'phone' | 'board'>('phone');
  const [preferences, setPreferences] = useState<UserPreferences>(INITIAL_PREFERENCES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const currentCompanion =
    COMPANIONS.find((c) => c.id === preferences.companionId) || COMPANIONS[0];

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

  const handleSelectCompanionStyle = (style: string) => {
    setPreferences((prev) => ({
      ...prev,
      profile: { ...prev.profile, companionStyle: style }
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
                  selectedStyle={preferences.profile.companionStyle}
                  onSelectCompanion={(id) => handleSelectCompanion(id, false)}
                  onSelectStyle={handleSelectCompanionStyle}
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

              {/* Stage 02: AI First Onboarding Chat (Includes Interests & Reading Level Evaluation) */}
              {entryScreen === 'stage' && currentStage === 2 && (
                <Stage02AiChat
                  companion={currentCompanion}
                  initialStep={stage02Step}
                  onStepChange={(step) => {
                    setStage02Step(step);
                    const screen = APP_SCREENS.find((item) => item.stage === 2 && item.step === step);
                    if (screen) setCurrentScreen(screen.index);
                  }}
                  bookmarkedSentences={preferences.bookmarkedSentences}
                  onToggleSentenceBookmark={handleToggleSentenceBookmark}
                  onBack={() => {
                    setCurrentStage(1);
                    setEntryScreen('companion');
                  }}
                  onComplete={(themes, cefrLevel, surveyData) => {
                    // A1- -> L1 (L1-L3), A2 -> L4 (L4-L6), B1 -> L7 (L7-L9), B2+ -> L10 (L10-L12)
                    const startingLevelCode =
                      cefrLevel === 'A1-'
                        ? 'L1'
                        : cefrLevel === 'A2'
                        ? 'L4'
                        : cefrLevel === 'B1'
                        ? 'L7'
                        : 'L10';
                    const mappedLevel: ReadingLevel =
                      cefrLevel === 'A1-' ? 'easy' : cefrLevel === 'B1' || cefrLevel === 'B2+' ? 'hard' : 'mid';

                    setPreferences((prev) => ({
                      ...prev,
                      interestTheme: themes[0] || '科学',
                      selectedThemes: themes,
                      determinedCefr: cefrLevel,
                      currentLevel: mappedLevel,
                      profile: {
                        ...prev.profile,
                        startingLevel: startingLevelCode,
                        goal: surveyData?.goal || prev.profile.goal,
                        challenge: surveyData?.challenge || prev.profile.challenge,
                        durationPreference: surveyData?.duration || prev.profile.durationPreference,
                        readingState: surveyData?.readingState || prev.profile.readingState,
                        companionStyle: surveyData?.companionStyle || prev.profile.companionStyle,
                        sessionDuration: surveyData?.duration?.includes('3-5') || surveyData?.duration?.includes('5') ? 5 : prev.profile.sessionDuration,
                        goalTrack: surveyData?.goalTrack || prev.profile.goalTrack
                      }
                    }));
                    // Complete dialogue rating and jump directly to Stage 8
                    setCurrentStage(8);
                    setCurrentScreen(10);
                    showToast(`已确定【${themes.slice(0, 2).join('、')}】与 ${startingLevelCode} 起点，正在生成专属阅读画像`);
                  }}
                  onSkip={() => {
                    setCurrentStage(8);
                    setCurrentScreen(10);
                    showToast('已跳过对话，进入默认推荐定制');
                  }}
                />
              )}

              {/* Stage 08: Customizing Recommendations & Profile (Merged 08 & 09) */}
              {entryScreen === 'stage' && currentStage === 8 && (
                <Stage08Customizing
                  companion={currentCompanion}
                  interestTheme={preferences.interestTheme}
                  selectedThemes={preferences.selectedThemes}
                  determinedCefr={preferences.determinedCefr || 'A2'}
                  startingLevel={preferences.profile.startingLevel || 'L4'}
                  preferences={preferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onBack={() => {
                    setCurrentStage(2);
                    setCurrentScreen(2);
                    setStage02Step(1);
                  }}
                  onNext={() => {
                    setCurrentStage(10);
                    setCurrentScreen(16);
                    showToast('欢迎开启阅读体验！');
                  }}
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
                  onBack={() => {
                    const previousStage = currentStage === 4 ? 10 : currentStage - 1;
                    setCurrentStage(previousStage);
                    setCurrentScreen(previousStage === 10 ? 16 : previousStage === 4 ? 11 : 12);
                  }}
                  onRateDifficulty={(_, selectedLevel) => {
                    if (selectedLevel) {
                      setPreferences((prev) => ({ ...prev, currentLevel: selectedLevel }));
                    }
                    const nextStage = currentStage === 4 ? 5 : currentStage === 5 ? 6 : 7;
                    setCurrentStage(nextStage);
                    setCurrentScreen(nextStage === 5 ? 12 : nextStage === 6 ? 13 : 14);
                  }}
                />
              )}

              {entryScreen === 'stage' && currentStage === 7 && (
                <Stage07GrowthFeedback
                  companion={currentCompanion}
                  onBack={() => {
                    setCurrentStage(6);
                    setCurrentScreen(13);
                  }}
                  onNext={() => {
                    setCurrentStage(9);
                    setCurrentScreen(15);
                  }}
                />
              )}

              {entryScreen === 'stage' && currentStage === 9 && (
                <Stage09ReadingProfile
                  companion={currentCompanion}
                  preferences={preferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onBack={() => {
                    setCurrentStage(7);
                    setCurrentScreen(14);
                  }}
                  onNext={() => {
                    setCurrentStage(10);
                    setCurrentScreen(16);
                    showToast('阅读画像已更新，继续探索阅读世界');
                  }}
                />
              )}

              {/* Stage 10: Reading World Hub */}
              {entryScreen === 'stage' && currentStage === 10 && (
                <Stage10ReadingWorld
                  companion={currentCompanion}
                  preferences={preferences}
                  onOpenStory={(id) => {
                    setCurrentStage(4);
                    setCurrentScreen(11);
                    showToast('开始沉浸阅读');
                  }}
                  onToggleBookmark={handleToggleBookmark}
                  onToggleSentenceBookmark={handleToggleSentenceBookmark}
                  onRestartOnboarding={handleReset}
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
