import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  BriefcaseBusiness,
  Check,
  Globe2,
  Landmark,
  Orbit,
  Sprout
} from 'lucide-react';
import type { Companion } from '../types';
import { CompletionRipple } from './CompletionRipple';
import { CompanionAvatar } from './CompanionAvatar';
import { MiniProgramHeader } from './MiniProgramHeader';

interface InterestThemePickerProps {
  companion: Companion;
  bubbleText: string;
  bubbleIsTyping: boolean;
  selectedTags: string[];
  isConfirming: boolean;
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
  onBack: () => void;
}

// Most interests a user can pick; more would dilute the recommendations.
export const MAX_INTERESTS = 3;
const LIMIT_HINT_MS = 1800;

const INTERESTS = [
  { name: '世界热点', subtitle: '看见更大的世界', reply: '好，我们一起看看更大的世界。', icon: Globe2 },
  { name: '科学探索', subtitle: '探索奇妙的世界', reply: '好，我们先从科学出发。', icon: Orbit },
  { name: '文化故事', subtitle: '从故事看世界', reply: '好，我们从文化故事出发。', icon: Landmark },
  { name: '商业观察', subtitle: '了解商业与社会', reply: '好，我们从商业观察出发。', icon: BriefcaseBusiness },
  { name: '自我成长', subtitle: '遇见更好的自己', reply: '好，我们从自我成长出发。', icon: Sprout },
  { name: '趣味故事', subtitle: '轻松有趣的阅读', reply: '好，我们先读一个有趣的故事。', icon: BookOpen }
] as const;

export const InterestThemePicker: React.FC<InterestThemePickerProps> = ({
  companion,
  bubbleText,
  bubbleIsTyping,
  selectedTags,
  isConfirming,
  onToggleTag,
  onConfirm,
  onBack
}) => {
  const selectedNames = selectedTags.filter((tag) => INTERESTS.some((interest) => interest.name === tag));
  const atLimit = selectedNames.length >= MAX_INTERESTS;
  // Briefly true after tapping a fourth interest, to explain why nothing happened.
  const [limitHint, setLimitHint] = useState(false);

  useEffect(() => {
    if (!limitHint) return;
    const timer = window.setTimeout(() => setLimitHint(false), LIMIT_HINT_MS);
    return () => window.clearTimeout(timer);
  }, [limitHint]);

  return (
    // Laid out like the reader (mini-program header, companion bubble) so choosing already feels like reading.
    <div
      className="rj-page text-[#302A3B]"
      style={{ '--rj-bg': `url(${import.meta.env.BASE_URL}assets/journey-bg.jpg)` } as React.CSSProperties}
    >
      <MiniProgramHeader title="选择阅读兴趣" onBack={onBack} />

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-2.5 pb-4 pt-1">
        {/* Same companion row and bubble as the reader. */}
        <div className="rj-companion-row" style={{ margin: '0 -10px' }}>
          <CompanionAvatar companion={companion} size={52} alt={companion.name}>
            <CompletionRipple active={isConfirming} />
          </CompanionAvatar>
          <div className="min-w-0 flex-1" aria-live="polite">
            <div className="rj-bubble">
              <p>
                {bubbleText}
                {bubbleIsTyping && (
                  <span className="ml-1 inline-block h-3.5 w-[2px] translate-y-[2px] animate-pulse bg-[#C83E26] motion-reduce:animate-none" />
                )}
              </p>
            </div>
          </div>
        </div>

        <div
          className="speech-content-enter mx-2 mt-4 grid shrink-0 grid-cols-1 gap-2"
          role="group"
          aria-label="选择阅读兴趣"
          style={{ animationDuration: '240ms' }}
        >
          {INTERESTS.map(({ name, subtitle, icon: Icon }) => {
            const isSelected = selectedTags.includes(name);
            const isBlocked = atLimit && !isSelected;
            return (
              <button
                key={name}
                type="button"
                aria-pressed={isSelected}
                aria-disabled={isBlocked}
                aria-label={`${name}，${subtitle}`}
                onClick={() => (isBlocked ? setLimitHint(true) : onToggleTag(name))}
                disabled={isConfirming}
                className={`flex min-h-[76px] min-w-0 items-center gap-3 rounded-[11px] border bg-white px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94C3B] disabled:cursor-wait ${
                  isSelected
                    ? 'border-[1.5px] border-[#E64E3D] bg-[#FFF0EC]'
                    : isBlocked
                      ? 'border-[#DCCFE8] opacity-50'
                      : 'border-[#DCCFE8] hover:border-[#BCA9CE]'
                }`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center ${
                  isSelected ? 'text-[#D94C3B]' : 'text-[#897D91]'
                }`}>
                  <Icon size={27} strokeWidth={1.9} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block break-words text-[17px] font-bold leading-5 text-[#302A3B]">
                    {name}
                  </span>
                  <span className="mt-1 block break-words text-[12px] leading-4 text-[#82788A]">
                    {subtitle}
                  </span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border ${
                    isSelected
                      ? 'border-[#D94C3B] bg-[#D94C3B] text-white'
                      : 'border-[#CBBED5]'
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && <Check size={14} strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="shrink-0 px-4 pb-3.5 pt-1">
        <button
          type="button"
          onClick={() => onConfirm(selectedTags)}
          disabled={!selectedNames.length || isConfirming}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#D94C3B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#C94032] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94C3B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#C9C3D0]"
        >
          <span>继续</span>
        </button>
        <p
          className={`mt-1 text-center text-[13px] leading-4 transition-colors ${limitHint ? 'text-[#D94C3B]' : 'text-[#82788A]'}`}
          aria-live="polite"
        >
          {limitHint
            ? `最多选 ${MAX_INTERESTS} 个，先取消一个再换`
            : `最多选 ${MAX_INTERESTS} 个 · 已选 ${selectedNames.length}/${MAX_INTERESTS}`}
        </p>
      </footer>
    </div>
  );
};
