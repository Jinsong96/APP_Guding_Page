import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { Companion } from '../../types';
import { InterestThemePicker, MAX_INTERESTS } from '../InterestThemePicker';
import { CompanionAvatar } from '../CompanionAvatar';
import { DifficultySentencePicker } from '../DifficultySentencePicker';
import { MiniProgramHeader } from '../MiniProgramHeader';
import { TypedLine } from '../TypedLine';
import { COMPANION_TYPING_INTERVAL_MS } from '../speechTiming';

export type CefrLevelKey = 'A1-' | 'A2' | 'B1' | 'B2+';

// 02 兴趣, then 03 阅读难度.
export const INTEREST_STEP = 1;
export const DIFFICULTY_STEP = 2;

const BUBBLE_LINES: Record<number, string> = {
  [INTEREST_STEP]: '你平时喜欢读些什么呀？',
  [DIFFICULTY_STEP]: '左右滑滑，挑句读着舒服的'
};

// 03 types its lines slower than 02, so each one can be read before the card changes again.
const DIFFICULTY_TYPING_INTERVAL_MS = COMPANION_TYPING_INTERVAL_MS * 2.5;

// Pause after confirming interests so the ripple on the avatar registers before the next screen.
const INTEREST_CONFIRM_MS = 640;

interface Stage02AiChatProps {
  companion: Companion;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onBack: () => void;
  onComplete: (selectedInterests: string[], level: CefrLevelKey) => void;
}

// 02 兴趣 + 03 阅读难度, both laid out like the reader (mini-program header, companion bubble).
export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  initialStep,
  onStepChange,
  onBack,
  onComplete
}) => {
  const [step, setStep] = useState<number>(initialStep ?? INTEREST_STEP);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Companion Dynamic Speech State
  const [companionBubbleText, setCompanionBubbleText] = useState<string>('');
  // The whole line being typed, laid out in full from the first character.
  const [bubbleFullText, setBubbleFullText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isConfirmingInterest, setIsConfirmingInterest] = useState(false);

  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const completionTimerRef = useRef<number | null>(null);

  const updateStep = (nextStep: number) => {
    setStep(nextStep);
    onStepChange?.(nextStep);
  };

  useLayoutEffect(() => {
    if (initialStep !== undefined && initialStep !== step) {
      updateStep(initialStep);
    }
  }, [initialStep, step]);

  // Dynamic typewriter for companion speech bubble
  const triggerBubbleSpeech = (
    text: string,
    typingIntervalMs = COMPANION_TYPING_INTERVAL_MS
  ) => {
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    setBubbleFullText(text);
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCompanionBubbleText(text);
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    const characters = Array.from(text);
    let idx = 0;
    setCompanionBubbleText('');

    typewriterTimerRef.current = setInterval(() => {
      idx += 1;
      setCompanionBubbleText(characters.slice(0, idx).join(''));
      if (idx >= characters.length) {
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
        setIsTyping(false);
      }
    }, typingIntervalMs);
  };

  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (completionTimerRef.current !== null) window.clearTimeout(completionTimerRef.current);
    };
  }, []);

  // Sync companion bubble text when step changes
  useLayoutEffect(() => {
    triggerBubbleSpeech(
      BUBBLE_LINES[step] || '',
      step === INTEREST_STEP ? COMPANION_TYPING_INTERVAL_MS * 2 : DIFFICULTY_TYPING_INTERVAL_MS
    );
  }, [step, companion.name]);

  // Interest selection supports adding and removing themes before the pause completes.
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) return prev.filter((item) => item !== tag);
      return prev.length >= MAX_INTERESTS ? prev : [...prev, tag];
    });
  };

  // Confirm selected themes and move on to the difficulty question.
  const handleConfirmInterests = (tags: string[]) => {
    setSelectedTags(tags);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateStep(DIFFICULTY_STEP);
      return;
    }

    setIsConfirmingInterest(true);
    completionTimerRef.current = window.setTimeout(() => {
      completionTimerRef.current = null;
      setIsConfirmingInterest(false);
      updateStep(DIFFICULTY_STEP);
    }, INTEREST_CONFIRM_MS);
  };

  // Back Navigation
  const handlePrevStep = () => {
    if (completionTimerRef.current !== null) {
      window.clearTimeout(completionTimerRef.current);
      completionTimerRef.current = null;
    }
    setIsConfirmingInterest(false);
    if (step === INTEREST_STEP) {
      onBack();
      return;
    }
    updateStep(INTEREST_STEP);
  };

  if (step === DIFFICULTY_STEP) {
    return (
      <div
        className="rj-page"
        style={{ '--rj-bg': `url(${import.meta.env.BASE_URL}assets/journey-bg.jpg)` } as React.CSSProperties}
      >
        <MiniProgramHeader title="选择阅读难度" onBack={handlePrevStep} />
        <div className="rj-companion-row dp-companion-row">
          <CompanionAvatar companion={companion} size={44} alt={companion.name} frameless className="rj-avatar" />
          <div className="rj-bubble" role="status" aria-atomic="true">
            <TypedLine text={bubbleFullText} typed={companionBubbleText} isTyping={isTyping} />
          </div>
        </div>
        <DifficultySentencePicker
          onConfirm={(level) => onComplete(selectedTags, level)}
          onSpeak={(text) => triggerBubbleSpeech(text, DIFFICULTY_TYPING_INTERVAL_MS)}
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-full w-full select-none flex-col overflow-hidden bg-[#F4F1FA] font-sans text-stone-900">
      <div className="no-scrollbar mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col overflow-hidden p-0">
        <InterestThemePicker
          companion={companion}
          bubbleText={companionBubbleText}
          bubbleFullText={bubbleFullText}
          bubbleIsTyping={isTyping}
          selectedTags={selectedTags}
          isConfirming={isConfirmingInterest}
          onToggleTag={handleToggleTag}
          onConfirm={handleConfirmInterests}
          onBack={handlePrevStep}
        />
      </div>
    </div>
  );
};
