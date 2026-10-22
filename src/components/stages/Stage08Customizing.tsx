import React, { useState, useEffect, useRef } from 'react';
import { Sliders } from 'lucide-react';
import { Companion, RideTicket, UserPreferences } from '../../types';
import { CefrLevelKey, LEVEL_METAS } from './Stage02AiChat';
import { JourneyArrival } from '../JourneyArrival';
import type { FirstReadVocab } from '../../firstReadArticles';

interface Stage08CustomizingProps {
  companion: Companion;
  interestTheme: string;
  selectedThemes?: string[];
  determinedCefr?: string;
  startingLevel?: string;
  ticket: RideTicket;
  articleMinutes?: number;
  paragraphCount?: number;
  learnedWords?: FirstReadVocab[];
  preferences?: UserPreferences;
  onUpdatePreferences?: (updated: Partial<UserPreferences>) => void;
  onBack: () => void;
  onNext: () => void;
  onOpenTicketBook?: () => void;
}

// CEFR to starting level mapping:
// A1- -> L1 (L1, L2, L3)
// A2  -> L4 (L4, L5, L6)
// B1  -> L7 (L7, L8, L9)
// B2+ -> L10 (L10, L11, L12)
export const CEFR_TO_STARTING_LEVEL: Record<string, string> = {
  'A1-': 'L1',
  'A2': 'L4',
  'B1': 'L7',
  'B2+': 'L10'
};

const ACCENT = '#B83825';

// The first read's arrival: the first keepsake ticket, the words met on the way, the suggested
// starting level, and an inline way to adjust the reading profile.
export const Stage08Customizing: React.FC<Stage08CustomizingProps> = ({
  companion,
  interestTheme,
  selectedThemes,
  determinedCefr = 'A2',
  startingLevel,
  ticket,
  articleMinutes = 3,
  paragraphCount = 6,
  learnedWords = [],
  preferences,
  onUpdatePreferences,
  onBack,
  onNext,
  onOpenTicketBook
}) => {
  const resolvedStartingLevel =
    (determinedCefr && CEFR_TO_STARTING_LEVEL[determinedCefr]) || startingLevel || 'L4';
  const levelMeta = LEVEL_METAS[(determinedCefr as CefrLevelKey) in LEVEL_METAS ? (determinedCefr as CefrLevelKey) : 'A2'];

  const [showEditSheet, setShowEditSheet] = useState(false);
  const [hintDensity, setHintDensity] = useState<'light' | 'detailed'>(
    preferences?.profile.hintDensity || 'light'
  );
  const [sessionDuration, setSessionDuration] = useState<5 | 10>(
    preferences?.profile.sessionDuration || 5
  );
  const editSheetRef = useRef<HTMLDivElement>(null);

  // The adjust panel opens below the summary; bring it into view so the tap has a visible result.
  useEffect(() => {
    if (showEditSheet) editSheetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [showEditSheet]);

  const favouriteTheme = selectedThemes?.[0] || interestTheme || '科学探索';

  const handleSaveProfile = () => {
    if (preferences && onUpdatePreferences) {
      onUpdatePreferences({
        profile: {
          ...preferences.profile,
          hintDensity,
          sessionDuration
        }
      });
    }
    setShowEditSheet(false);
  };

  const renderToggle = <T extends string | number>(
    value: T,
    current: T,
    label: string,
    onSelect: (value: T) => void
  ) => (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={current === value}
      className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer"
      style={
        current === value
          ? { backgroundColor: '#23305E', color: '#FFFFFF' }
          : { backgroundColor: '#F0ECF8', color: '#57534E' }
      }
    >
      {label}
    </button>
  );

  return (
    <JourneyArrival
      companion={companion}
      ticket={ticket}
      memoryLine={`${companion.name}开始记得：你喜欢${favouriteTheme}。`}
      stats={[
        { value: `${paragraphCount} 段`, label: '读完全文' },
        { value: `${learnedWords.length} 个`, label: '新认识的词' },
        { value: `约 ${articleMinutes} 分钟`, label: '这一程' }
      ]}
      primaryLabel="开启阅读世界"
      onPrimary={onNext}
      secondaryLabel={onOpenTicketBook ? '查看我们的车票册' : undefined}
      onSecondary={onOpenTicketBook}
      onBack={onBack}
    >
      {learnedWords.length > 0 && (
        <div className="mt-3 shrink-0 rounded-2xl border border-[#E7E1F0] bg-white px-4 py-3 shadow-xs">
          <h3 className="text-[13px] font-bold">这一程新认识的词</h3>
          <ul className="mt-1 divide-y divide-[#F0ECF8]">
            {learnedWords.map((item) => (
              <li key={item.word} className="flex items-baseline gap-2 py-2">
                <span className="shrink-0 text-[15px] font-semibold text-[#171A35]">{item.word}</span>
                {item.phonetic && <span className="shrink-0 text-[12px] text-[#8E88A3]">{item.phonetic}</span>}
                <span className="ml-auto text-right text-[13px] text-stone-600">{item.meaning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-3 flex shrink-0 items-center gap-3 rounded-2xl border border-[#E7E1F0] bg-white px-4 py-3 shadow-xs">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#FBECE8]">
          <strong className="text-[22px] font-black font-mono leading-none" style={{ color: ACCENT }}>
            {resolvedStartingLevel}
          </strong>
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-stone-900">建议阅读起点 · 从这里开始，刚刚好</p>
          <p className="mt-0.5 text-[12px] leading-snug" style={{ color: ACCENT }}>
            {levelMeta.levelLabel} · {levelMeta.tagline}
          </p>
        </div>
      </div>
      <p className="mt-2 px-1 text-center text-[11px] leading-relaxed text-stone-400">
        起点根据你读这篇前 4 段的感受给出，后续会随你的阅读表现持续微调。
      </p>

      <button
        type="button"
        onClick={() => setShowEditSheet((open) => !open)}
        className="mx-auto mt-1 flex shrink-0 items-center gap-1.5 px-2 py-1 text-[12px] text-stone-500 hover:text-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
      >
        <Sliders size={13} />
        <span>{showEditSheet ? '收起画像调整' : '有一点不对，调整画像'}</span>
      </button>

      {showEditSheet && (
        <div
          ref={editSheetRef}
          className="mt-2 shrink-0 p-3.5 rounded-2xl bg-white border border-[#DCDDEB] shadow-md animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-900">调整“这次怎么陪你”</span>
            <span className="text-[10px] text-stone-500">提示密度与时长</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-stone-500 text-[11px]">释义提示</span>
              <div className="flex gap-1.5">
                {renderToggle<'light' | 'detailed'>('light', hintDensity, '轻提示', setHintDensity)}
                {renderToggle<'light' | 'detailed'>('detailed', hintDensity, '多解释', setHintDensity)}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-stone-500 text-[11px]">单次目标</span>
              <div className="flex gap-1.5">
                {renderToggle<5 | 10>(5, sessionDuration, '5 分钟', setSessionDuration)}
                {renderToggle<5 | 10>(10, sessionDuration, '10 分钟', setSessionDuration)}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveProfile}
            className="w-full mt-2.5 py-1.5 rounded-lg bg-[#23305E] text-white text-xs font-medium cursor-pointer"
          >
            保存画像设置
          </button>
        </div>
      )}
    </JourneyArrival>
  );
};
