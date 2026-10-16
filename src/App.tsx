/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Companion, CompanionId, ReadingLevel, UserPreferences } from './types';
import { COMPANIONS, INITIAL_PREFERENCES } from './data';
import { TopNavigationHeader } from './components/TopNavigationHeader';
import { PhoneSimulator } from './components/PhoneSimulator';
import { BoardView } from './components/BoardView';
import { Stage01Companion } from './components/stages/Stage01Companion';
import { Stage02AiChat } from './components/stages/Stage02AiChat';
import { Stage08Customizing } from './components/stages/Stage08Customizing';
import { Stage09ReadingProfile } from './components/stages/Stage09ReadingProfile';
import { Stage10ReadingWorld } from './components/stages/Stage10ReadingWorld';

export default function App() {
  const [currentStage, setCurrentStage] = useState<number>(1);
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

  const handleSelectCompanion = (id: CompanionId) => {
    setPreferences((prev) => ({
      ...prev,
      companionId: id
    }));
    const companion = COMPANIONS.find((c) => c.id === id);
    if (companion) {
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

  const handleUpdatePreferences = (updated: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updated }));
    showToast('阅读画像偏好设置已更新');
  };

  const handleReset = () => {
    setCurrentStage(1);
    setPreferences(INITIAL_PREFERENCES);
    showToast('已重置并返回第 01 屏选择旅伴');
  };

  return (
    <div className="min-h-screen bg-[#EDE7DC] text-stone-900 flex flex-col font-sans selection:bg-amber-600 selection:text-white">
      {/* Top Global Navigation Bar */}
      <TopNavigationHeader
        currentStage={currentStage}
        viewMode={viewMode}
        companion={currentCompanion}
        onSetViewMode={setViewMode}
        onJumpToStage={(s) => setCurrentStage(s)}
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
              setCurrentStage(stageNum);
              setViewMode('phone');
              showToast(`进入第 0${stageNum} 屏实操`);
            }}
            onToggleBookmark={handleToggleBookmark}
            onUpdatePreferences={handleUpdatePreferences}
          />
        ) : (
          <div className="w-full py-1 sm:py-2.5 flex flex-col items-center justify-center">
            <PhoneSimulator>
              {/* Stage 01: Companion Selection */}
              {currentStage === 1 && (
                <Stage01Companion
                  selectedCompanionId={preferences.companionId}
                  onSelectCompanion={handleSelectCompanion}
                  onNext={() => {
                    setCurrentStage(2);
                    showToast(`${currentCompanion.name} 正在和你初次打招呼...`);
                  }}
                />
              )}

              {/* Stage 02: AI First Onboarding Chat (Includes Interests & Reading Level Evaluation) */}
              {currentStage === 2 && (
                <Stage02AiChat
                  companion={currentCompanion}
                  onBack={() => setCurrentStage(1)}
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
                        companionStyle: surveyData?.companionStyle || prev.profile.companionStyle,
                        sessionDuration: surveyData?.duration?.includes('5') ? 5 : prev.profile.sessionDuration,
                        goalTrack: surveyData?.goalTrack || prev.profile.goalTrack
                      }
                    }));
                    // Complete dialogue rating and jump directly to Stage 8
                    setCurrentStage(8);
                    showToast(`已确定【${themes.slice(0, 2).join('、')}】与 ${cefrLevel} (${startingLevelCode}) 定级，正在定制专属世界`);
                  }}
                  onSkip={() => {
                    setCurrentStage(8);
                    showToast('已跳过对话，进入默认推荐定制');
                  }}
                />
              )}

              {/* Stage 08: Customizing Recommendations & Profile (Merged 08 & 09) */}
              {(currentStage === 8 || currentStage === 9) && (
                <Stage08Customizing
                  companion={currentCompanion}
                  interestTheme={preferences.interestTheme}
                  selectedThemes={preferences.selectedThemes}
                  determinedCefr={preferences.determinedCefr || 'A2'}
                  startingLevel={preferences.profile.startingLevel || 'L4'}
                  preferences={preferences}
                  onUpdatePreferences={handleUpdatePreferences}
                  onBack={() => setCurrentStage(2)}
                  onNext={() => {
                    setCurrentStage(10);
                    showToast('欢迎来到阅读世界！');
                  }}
                />
              )}

              {/* Stage 10: Reading World Hub */}
              {currentStage === 10 && (
                <Stage10ReadingWorld
                  companion={currentCompanion}
                  preferences={preferences}
                  onOpenStory={(id) => {
                    setCurrentStage(4);
                    showToast('重新载入沉浸阅读器');
                  }}
                  onToggleBookmark={handleToggleBookmark}
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
