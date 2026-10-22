import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
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
import { CHAT_REPLY_PAUSE_MS, CHAT_TYPING_INTERVAL_MS } from './speechTiming';

interface InterestThemePickerProps {
  companion: Companion;
  bubbleText: string;
  bubbleIsTyping: boolean;
  selectedTags: string[];
  isConfirming: boolean;
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
  onBack: () => void;
  onSkip: () => void;
}

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
  onBack,
  onSkip
}) => {
  const [conversationPhase, setConversationPhase] = useState<
    'idle' | 'waiting' | 'userTyping' | 'companionTyping' | 'complete'
  >('idle');
  const [userMessage, setUserMessage] = useState('');
  const [companionMessage, setCompanionMessage] = useState('');
  const selectedNames = selectedTags.filter((tag) => INTERESTS.some((interest) => interest.name === tag));
  const userMessageTarget = `我想先读：${selectedNames.join('、')}`;
  const interestQuestionReady = bubbleText === '这一程，你想先读点什么？' && !bubbleIsTyping;

  useLayoutEffect(() => {
    if (selectedNames.length === 0) {
      setConversationPhase('idle');
      setUserMessage('');
      setCompanionMessage('');
      return;
    }

    setConversationPhase('waiting');
    setUserMessage('');
    setCompanionMessage('');
    const timer = window.setTimeout(() => setConversationPhase('userTyping'), 1000);
    return () => window.clearTimeout(timer);
  }, [selectedTags]);

  useEffect(() => {
    if (conversationPhase !== 'userTyping' || selectedNames.length === 0) return;

    const message = userMessageTarget;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setUserMessage(message);
      const timer = window.setTimeout(
        () => setConversationPhase('companionTyping'),
        CHAT_REPLY_PAUSE_MS
      );
      return () => window.clearTimeout(timer);
    }

    const characters = Array.from(message);
    let index = 0;
    let pauseTimer: number | null = null;
    const typingTimer = window.setInterval(() => {
      index += 1;
      setUserMessage(characters.slice(0, index).join(''));
      if (index >= characters.length) {
        window.clearInterval(typingTimer);
        pauseTimer = window.setTimeout(
          () => setConversationPhase('companionTyping'),
          CHAT_REPLY_PAUSE_MS
        );
      }
    }, CHAT_TYPING_INTERVAL_MS);
    return () => {
      window.clearInterval(typingTimer);
      if (pauseTimer !== null) window.clearTimeout(pauseTimer);
    };
  }, [conversationPhase, selectedTags]);

  useEffect(() => {
    if (conversationPhase !== 'companionTyping' || selectedNames.length === 0) return;

    const message = '好呀，记下啦！我们就从这些地方开始，在旅途中慢慢探索。';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCompanionMessage(message);
      setConversationPhase('complete');
      return;
    }

    const characters = Array.from(message);
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setCompanionMessage(characters.slice(0, index).join(''));
      if (index >= characters.length) {
        window.clearInterval(timer);
        setConversationPhase('complete');
      }
    }, CHAT_TYPING_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [conversationPhase, selectedTags]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#F8F5FA] text-[#302A3B]">
      <section className="relative h-[164px] shrink-0 overflow-hidden rounded-b-[18px]">
        <img
          src={`${import.meta.env.BASE_URL}assets/companion-train-scene.png`}
          alt="B-01 夜行列车包厢里的灯芯"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
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
            <p className="mt-0.5 text-[14px] font-medium text-white/90">阅读喜好 · 1/2</p>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="mt-1 min-w-9 px-1 py-2 text-[14px] font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            跳过
          </button>
        </header>
      </section>

      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-2.5 pb-8 pt-4">
        <div className="flex shrink-0 items-center gap-2">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-[11px] border border-[#DCCFE8] bg-white p-0.5">
            <img
              src={`${import.meta.env.BASE_URL}assets/companion-train-scene.png`}
              alt=""
              className="h-full w-full rounded-[8px] object-cover"
            />
            <CompletionRipple active={isConfirming} />
          </div>
          <div className="relative flex min-h-[58px] w-fit max-w-[calc(100%_-_48px)] flex-col justify-center rounded-[16px] border border-[#DCCFE8] bg-white px-3.5 py-2">
            <p className="text-[18px] font-bold leading-6 text-[#302A3B]" aria-live="polite" dir="ltr">
              {bubbleText}
              {bubbleIsTyping && (
                <span className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-[#D94C3B] motion-reduce:animate-none" />
              )}
            </p>
          </div>
        </div>

        {interestQuestionReady && (
          <div
            className="speech-content-enter mt-6 grid shrink-0 grid-cols-1 gap-2"
            role="group"
            aria-label="选择阅读兴趣"
            style={{ animationDuration: '240ms' }}
          >
            {INTERESTS.map(({ name, subtitle, icon: Icon }) => {
              const isSelected = selectedTags.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`${name}，${subtitle}`}
                  onClick={() => onToggleTag(name)}
                  disabled={isConfirming}
                  className={`flex min-h-[76px] min-w-0 items-center gap-3 rounded-[11px] border bg-white px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94C3B] disabled:cursor-wait ${
                    isSelected
                      ? 'border-[1.5px] border-[#E64E3D] bg-[#FFF0EC]'
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
        )}

        {conversationPhase !== 'idle' && conversationPhase !== 'waiting' && (
          <div className="mt-[30px] flex shrink-0 flex-col gap-[25px]" aria-live="polite">
            <div className="flex justify-end">
                <p className="relative max-w-[92%] rounded-[18px] rounded-br-[6px] border border-[#E64E3D] bg-[#FFF0EC] px-3.5 py-2 text-[18px] font-semibold leading-6 text-[#302A3B]" dir="ltr">
                  <span aria-hidden="true" className="invisible block">{userMessageTarget}</span>
                  <span className="absolute left-3.5 right-3.5 top-2">
                    {userMessage}
                  </span>
              </p>
            </div>
            {(conversationPhase === 'companionTyping' || conversationPhase === 'complete') && (
              <div className="flex items-center gap-2">
                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-[11px] border border-[#DCCFE8] bg-white p-0.5">
                  <img
                    src={`${import.meta.env.BASE_URL}assets/companion-train-scene.png`}
                    alt=""
                    className="h-full w-full rounded-[8px] object-cover"
                  />
                </div>
                <p className="w-fit max-w-[calc(100%_-_48px)] rounded-[18px] rounded-bl-[6px] border border-[#DCCFE8] bg-white px-3.5 py-2.5 text-[18px] font-medium leading-6 text-[#3E3747]" dir="ltr">
                  {companionMessage}
                  {conversationPhase === 'companionTyping' && (
                    <span aria-hidden="true" className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-[#D94C3B] motion-reduce:animate-none" />
                  )}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-auto shrink-0 pt-[84px]">
          <button
            type="button"
            onClick={() => onConfirm(selectedTags)}
            disabled={!selectedNames.length || conversationPhase !== 'complete' || isConfirming}
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#D94C3B] px-4 text-[16px] font-bold text-white transition-colors hover:bg-[#C94032] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D94C3B] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#C9C3D0]"
          >
            <span>继续，选个阅读目标</span>
            <ArrowRight size={19} />
          </button>
          <p className="mt-1 text-center text-[13px] leading-4 text-[#82788A]">
            偏好只影响推荐顺序
          </p>
        </div>
      </div>
    </div>
  );
};
