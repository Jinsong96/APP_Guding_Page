import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
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
import { CompanionScene } from './CompanionScene';
import { CompanionAvatar } from './CompanionAvatar';

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
    <div className="flex h-full min-h-0 w-full flex-col bg-[#F8F5FA] text-[#302A3B]">
      <section className="relative h-[164px] shrink-0 overflow-hidden rounded-b-[18px]">
        <CompanionScene companion={companion} portraitPosition="right" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#17152A]/45 via-transparent to-[#17152A]/20" />
        <header className="absolute inset-x-0 top-0 z-10 flex h-[76px] items-start justify-between px-3 pt-2 text-white">
          <button
            type="button"
            onClick={onBack}
            aria-label="返回选择旅伴"
            className="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="pt-1 text-center drop-shadow">
            <h1
              className="text-[24px] font-bold leading-8"
              style={{ fontFamily: '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif' }}
            >
              和{companion.name}聊聊
            </h1>
          </div>
          <span className="h-9 w-9" aria-hidden="true" />
        </header>
      </section>

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-2.5 pb-4 pt-4">
        <div className="flex shrink-0 items-center gap-2">
          <CompanionAvatar companion={companion} size={40}>
            <CompletionRipple active={isConfirming} />
          </CompanionAvatar>
          <div className="relative flex min-h-[58px] w-fit max-w-[calc(100%_-_48px)] flex-col justify-center rounded-[16px] border border-[#DCCFE8] bg-white px-3.5 py-2">
            <p className="text-[18px] font-bold leading-6 text-[#302A3B]" aria-live="polite" dir="ltr">
              {bubbleText}
              {bubbleIsTyping && (
                <span className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-[#D94C3B] motion-reduce:animate-none" />
              )}
            </p>
          </div>
        </div>

        <div
          className="speech-content-enter mx-2 mt-6 grid shrink-0 grid-cols-1 gap-2"
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

      <footer className="shrink-0 border-t border-[#E7DDED] bg-[#F8F5FA] px-2.5 pb-2 pt-2">
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
