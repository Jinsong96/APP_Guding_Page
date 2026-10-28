import React, { useEffect, useRef, useState } from 'react';
import { Languages, RotateCcw, Volume2 } from 'lucide-react';
import { CefrLevelKey } from './stages/Stage02AiChat';

interface DifficultySentencePickerProps {
  onConfirm: (level: CefrLevelKey) => void;
  // Puts a line in the companion's bubble above the card.
  onSpeak: (text: string) => void;
}

interface LevelSample {
  level: CefrLevelKey;
  label: string;
  sentence: string;
  translation: string;
  // Card back (解读): one reading tip and the key phrases.
  note: string;
  phrases: { phrase: string; meaning: string }[];
  // What the companion says when the card lands on this level.
  companionLine: string;
}

// The same idea written at four levels, so only the difficulty changes between stops.
const LEVEL_SAMPLES: LevelSample[] = [
  {
    level: 'A1-',
    label: '入门',
    sentence: 'My cat sleeps in the sun.',
    translation: '我的猫在阳光下睡觉。',
    note: '一个主语加一个动词的简单句：My cat 是主语，sleeps 是动作。',
    phrases: [{ phrase: 'in the sun', meaning: '在阳光下' }],
    companionLine: '这是「入门」难度，\n像跟朋友聊天那么轻松。'
  },
  {
    level: 'A2',
    label: '基础',
    sentence: 'Every morning, my cat waits for me by the door.',
    translation: '每天早上，我的猫都在门边等我。',
    note: 'Every morning 放在句首，说明这件事每天都会发生。',
    phrases: [
      { phrase: 'wait for', meaning: '等待某人' },
      { phrase: 'by the door', meaning: '在门边' }
    ],
    companionLine: '「基础」难度，\n日常小故事大多是这个样子。'
  },
  {
    level: 'B1',
    label: '进阶',
    sentence: "Scientists say cats can recognise their owners' voices.",
    translation: '科学家说，猫能认出主人的声音。',
    note: 'Scientists say + 一句话，用来转述别人的观点，新闻和科普里很常见。',
    phrases: [
      { phrase: 'recognise', meaning: '认出（美式拼写 recognize）' },
      { phrase: "owners' voices", meaning: '主人们的声音' }
    ],
    companionLine: '「进阶」了，\n新闻和科普常是这种句子。'
  },
  {
    level: 'B2+',
    label: '高阶',
    sentence: 'Despite their aloof reputation, cats form surprisingly strong bonds with their owners.',
    translation: '尽管猫以高冷著称，它们和主人之间的感情却出奇地深。',
    note: 'Despite + 名词短语，表示“尽管……”，引出和后半句相反的情况。',
    phrases: [
      { phrase: 'aloof', meaning: '冷淡的，疏远的' },
      { phrase: 'form a bond with', meaning: '与……建立感情' }
    ],
    companionLine: '「高阶」！\n原版文章的味道出来了。'
  }
];

// Proactive nudges; each fires at most once per visit. Two invite a switch; the continue nudges
// share one slot, so a visit hears at most three proactive lines (the IP's per-session cap).
// Companion lines break at their natural pause with \n, so the bubble never splits a phrase.
const NUDGES = {
  idle: '读着有点费劲？\n往右滑，换句简单的试试。',
  tooEasy: '这句是不是太轻松了？\n往左滑，挑战一下？',
  // Continue nudges: the 继续 button glows along with them.
  settled: (label: string) => `就读「${label}」这样的？\n点继续，我照这个难度挑文章～`,
  ready: '读着刚好的话，\n点继续就行～',
  topLevel: '哇，这句你也能读？\n那就高阶吧，点继续出发！'
} as const;
type NudgeKey = keyof typeof NUDGES;
const CONTINUE_NUDGES: NudgeKey[] = ['settled', 'ready', 'topLevel'];

const DEFAULT_INDEX = 1;
const EASIEST_INDEX = 0;
const HARDEST_INDEX = LEVEL_SAMPLES.length - 1;
// Drag (or trackpad swipe) distance that switches the level.
const SWIPE_THRESHOLD_PX = 40;
// A quick flick switches with less distance: release speed (px/ms) and the minimum distance for it.
const FLICK_VELOCITY = 0.35;
const FLICK_MIN_PX = 16;
// The old card flies out this long before the new one comes in.
const EXIT_MS = 220;
// Movement before a press becomes a drag; anything shorter stays a tap on the card's buttons.
const DRAG_START_PX = 6;
// Dragging past the first or last level only moves the card this fraction of the finger.
const EDGE_RESISTANCE = 0.3;
// After a trackpad swipe switches, the rest of that gesture's momentum is ignored this long, so
// one swipe can't skip a sentence. Finger and mouse drags are never locked.
const WHEEL_LOCK_MS = 700;
// Stagger between words as the new sentence fades in.
const WORD_STAGGER_MS = 90;
// The companion comments once the new sentence has mostly appeared.
const LEVEL_LINE_DELAY_MS = 700;
// Before any switch, no interaction for this long counts as "reading with effort".
const IDLE_NUDGE_MS = 6000;
// Still no interaction this long after the idle nudge: the level is probably fine, invite continuing.
const READY_NUDGE_MS = 8000;
// After at least one switch, resting on a level this long reads as a decision.
const SETTLED_NUDGE_MS = 5000;
// Confirming 入门 sooner than this after it appeared suggests it was too easy.
const QUICK_CONFIRM_MS = 3000;
// The card sways once after the opening line, to show it can be swiped.
const SWAY_HINT_DELAY_MS = 2600;

const stopSpeaking = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

// 03 阅读难度: one reader card whose sentence rewrites itself as the user swipes — left for a
// harder sentence, right for an easier one. There are no level buttons: the companion names each
// level and nudges the user toward an easier one when the reading looks effortful. The card reuses
// the reader's card styles (reading-journey.css); layout lives in difficulty-picker.css.
export const DifficultySentencePicker: React.FC<DifficultySentencePickerProps> = ({ onConfirm, onSpeak }) => {
  const [index, setIndex] = useState(DEFAULT_INDEX);
  // Tilt direction of the last change, for the card's 3D lean.
  const [direction, setDirection] = useState<'harder' | 'easier' | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSwayHint, setIsSwayHint] = useState(false);
  // Press position; the press only turns into a drag after DRAG_START_PX.
  const pressStartXRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // How far the card is currently dragged, so it follows the finger before snapping.
  const [dragX, setDragX] = useState(0);
  // Last pointer sample, for the release velocity.
  const lastMoveRef = useRef<{ x: number; t: number; v: number } | null>(null);
  // Where the old card flies to while the next level is on its way; null when no switch is running.
  const [exitX, setExitX] = useState<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);
  const cardAreaRef = useRef<HTMLDivElement>(null);
  const wheelDeltaRef = useRef(0);
  const wheelLockedUntilRef = useRef(0);
  const hasInteractedRef = useRef(false);
  const levelShownAtRef = useRef(performance.now());
  const usedNudgesRef = useRef<Set<NudgeKey>>(new Set());
  // Whether the user has moved off the starting level at least once (swipe, dot or key).
  const hasSwitchedRef = useRef(false);
  const [isConfirmGlow, setIsConfirmGlow] = useState(false);
  // Bumped on every interaction so the idle timer restarts.
  const [activityTick, setActivityTick] = useState(0);
  const lineTimerRef = useRef<number | null>(null);
  const onSpeakRef = useRef(onSpeak);
  onSpeakRef.current = onSpeak;
  const sample = LEVEL_SAMPLES[index];

  const clearLineTimer = () => {
    if (lineTimerRef.current !== null) window.clearTimeout(lineTimerRef.current);
    lineTimerRef.current = null;
  };

  useEffect(() => () => {
    stopSpeaking();
    clearLineTimer();
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
  }, []);

  const markActivity = () => {
    hasInteractedRef.current = true;
    setActivityTick((tick) => tick + 1);
  };

  // Returns false when this nudge was already used (or, for a continue nudge, another one was).
  const nudge = (key: NudgeKey) => {
    const used = usedNudgesRef.current;
    const isContinue = CONTINUE_NUDGES.includes(key);
    if (used.has(key) || (isContinue && CONTINUE_NUDGES.some((other) => used.has(other)))) return false;
    used.add(key);
    clearLineTimer();
    const line = NUDGES[key];
    onSpeakRef.current(typeof line === 'function' ? line(LEVEL_SAMPLES[index].label) : line);
    if (isContinue) setIsConfirmGlow(true);
    return true;
  };

  // Sway once after the opening line unless the user already started.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setTimeout(() => {
      if (!hasInteractedRef.current) setIsSwayHint(true);
    }, SWAY_HINT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  // Resting on a sentence. At 高阶: cheer and invite continuing. After a switch: treat the rest as a
  // decision and invite continuing (or, once that was said, suggest an easier level). Before any
  // switch: suggest an easier level first, then, if still nothing happens, invite continuing.
  useEffect(() => {
    const timers: number[] = [];
    const later = (ms: number, run: () => void) => timers.push(window.setTimeout(run, ms));
    if (index === HARDEST_INDEX) {
      later(IDLE_NUDGE_MS, () => nudge('topLevel'));
    } else if (hasSwitchedRef.current) {
      later(SETTLED_NUDGE_MS, () => {
        if (!nudge('settled') && index !== EASIEST_INDEX) later(IDLE_NUDGE_MS - SETTLED_NUDGE_MS, () => nudge('idle'));
      });
    } else {
      later(IDLE_NUDGE_MS, () => {
        nudge('idle');
        later(READY_NUDGE_MS, () => nudge('ready'));
      });
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [index, activityTick]);

  const showLevel = (clamped: number) => {
    levelShownAtRef.current = performance.now();
    hasSwitchedRef.current = true;
    setIsConfirmGlow(false);
    setDragX(0);
    stopSpeaking();
    setIsSpeaking(false);
    setIsFlipped(false);
    setIsSwayHint(false);
    setDirection(clamped > index ? 'harder' : 'easier');
    setIndex(clamped);
    markActivity();
    clearLineTimer();
    lineTimerRef.current = window.setTimeout(() => {
      lineTimerRef.current = null;
      onSpeakRef.current(LEVEL_SAMPLES[clamped].companionLine);
    }, LEVEL_LINE_DELAY_MS);
  };

  // The current card flies out the way the finger moved (left for harder, right for easier), then
  // the next level comes in from the other side.
  const goTo = (next: number) => {
    const clamped = Math.max(EASIEST_INDEX, Math.min(HARDEST_INDEX, next));
    if (clamped === index || exitTimerRef.current !== null) return;
    markActivity();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      showLevel(clamped);
      return;
    }
    const width = cardAreaRef.current?.offsetWidth ?? 320;
    setExitX((clamped > index ? -1 : 1) * (width + 60));
    exitTimerRef.current = window.setTimeout(() => {
      exitTimerRef.current = null;
      setExitX(null);
      showLevel(clamped);
    }, EXIT_MS);
  };

  // Swiping left brings a harder sentence, swiping right an easier one.
  const easier = () => goTo(index - 1);
  const harder = () => goTo(index + 1);

  const speak = () => {
    markActivity();
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(sample.sentence);
    utterance.lang = 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    stopSpeaking();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const toggleTranslation = () => {
    markActivity();
    setShowTranslation((visible) => !visible);
  };

  const openAnalysis = () => {
    markActivity();
    setIsFlipped(true);
  };

  const confirm = () => {
    // A very quick 入门 pick gets one invitation to try harder; a second tap goes ahead.
    const isQuickEasyPick =
      index === EASIEST_INDEX && performance.now() - levelShownAtRef.current < QUICK_CONFIRM_MS;
    if (isQuickEasyPick && nudge('tooEasy')) {
      markActivity();
      return;
    }
    clearLineTimer();
    onConfirm(sample.level);
  };

  const endPress = (commit: boolean) => {
    pressStartXRef.current = null;
    const velocity = lastMoveRef.current?.v ?? 0;
    lastMoveRef.current = null;
    if (!isDragging) return;
    setIsDragging(false);
    const distance = Math.abs(dragX);
    // A flick only counts when it moves the same way as the drag.
    const isFlick = distance > FLICK_MIN_PX && Math.abs(velocity) > FLICK_VELOCITY && Math.sign(velocity) === Math.sign(dragX);
    const target = dragX < 0 ? index + 1 : index - 1;
    const canMove = target >= EASIEST_INDEX && target <= HARDEST_INDEX;
    if (commit && canMove && (distance > SWIPE_THRESHOLD_PX || isFlick)) {
      goTo(target);
      // The card leaves from where the finger let go.
      return;
    }
    setDragX(0);
  };

  const speakLabel = (
    <>
      <Volume2 size={18} strokeWidth={1.6} />
      <span>{isSpeaking ? '停止' : '朗读'}</span>
    </>
  );

  return (
    <div className="dp-root">
      <div
        ref={cardAreaRef}
        className="dp-card-area"
        tabIndex={0}
        role="group"
        aria-roledescription="难度卡片"
        aria-label={`阅读难度：${sample.label}。左方向键换简单一档，右方向键换难一档，与下方圆点的顺序一致`}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft') easier();
          if (event.key === 'ArrowRight') harder();
        }}
        onPointerDown={(event) => {
          if (exitTimerRef.current !== null) return;
          pressStartXRef.current = event.clientX;
          lastMoveRef.current = { x: event.clientX, t: event.timeStamp, v: 0 };
          markActivity();
          setIsSwayHint(false);
        }}
        onPointerMove={(event) => {
          if (pressStartXRef.current === null) return;
          // A press that ended outside the card leaves no pointerup here; a move with no button
          // held must not turn into a drag.
          if (event.pointerType === 'mouse' && event.buttons === 0) {
            endPress(false);
            return;
          }
          const deltaX = event.clientX - pressStartXRef.current;
          const last = lastMoveRef.current;
          if (last && event.timeStamp > last.t) {
            // Smoothed so one jittery sample doesn't decide the flick.
            const instant = (event.clientX - last.x) / (event.timeStamp - last.t);
            lastMoveRef.current = { x: event.clientX, t: event.timeStamp, v: last.v * 0.4 + instant * 0.6 };
          }
          if (!isDragging) {
            if (Math.abs(deltaX) < DRAG_START_PX) return;
            // Capture only once it is a drag, so taps still reach the card's buttons.
            try {
              event.currentTarget.setPointerCapture(event.pointerId);
            } catch {
              // The pointer is already gone; the drag still follows the moves we get.
            }
            setIsDragging(true);
          }
          const atEdge = (deltaX < 0 && index === HARDEST_INDEX) || (deltaX > 0 && index === EASIEST_INDEX);
          setDragX(atEdge ? deltaX * EDGE_RESISTANCE : deltaX);
        }}
        onPointerUp={() => endPress(true)}
        onPointerCancel={() => endPress(false)}
        onPointerLeave={() => {
          if (!isDragging) pressStartXRef.current = null;
        }}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
          const now = performance.now();
          if (now < wheelLockedUntilRef.current) {
            wheelDeltaRef.current = 0;
            return;
          }
          wheelDeltaRef.current += event.deltaX;
          if (Math.abs(wheelDeltaRef.current) > SWIPE_THRESHOLD_PX) {
            // A trackpad swipe to the left scrolls with positive deltaX.
            if (wheelDeltaRef.current > 0) harder();
            else easier();
            wheelDeltaRef.current = 0;
            wheelLockedUntilRef.current = now + WHEEL_LOCK_MS;
          }
        }}
      >
        <div aria-hidden="true" className="dp-underlay" />
        <div
          key={sample.level}
          className={`dp-card ${direction ? `is-${direction}` : ''} ${isDragging ? 'is-dragging' : ''} ${exitX !== null ? 'is-exiting' : ''} ${isSwayHint ? 'is-sway-hint' : ''}`}
          style={{ translate: `${exitX ?? dragX}px 0`, rotate: `${(exitX ?? dragX) * 0.04}deg` }}
          onAnimationEnd={(event) => {
            if (event.animationName === 'dp-sway-hint') setIsSwayHint(false);
          }}
        >
          <div className="rj-flip">
            <div className={`rj-flip-inner ${isFlipped ? 'is-flipped' : ''}`}>
              <article className="rj-card" aria-hidden={isFlipped} aria-live="polite">
                <div className="rj-reading-area">
                  <div className="rj-prose">
                    <p className="rj-english dp-sentence" lang="en">
                      {sample.sentence.split(' ').map((word, wordIndex) => (
                        <span key={wordIndex} style={{ animationDelay: `${wordIndex * WORD_STAGGER_MS}ms` }}>
                          {word}{' '}
                        </span>
                      ))}
                    </p>
                    {showTranslation && <p className="rj-translation">{sample.translation}</p>}
                  </div>
                </div>
                <div className="rj-card-tools">
                  <button type="button" onClick={speak} className={isSpeaking ? 'is-active' : undefined}>
                    {speakLabel}
                  </button>
                  <button type="button" onClick={toggleTranslation} aria-pressed={showTranslation}>
                    <Languages size={18} strokeWidth={1.6} />
                    <span>{showTranslation ? '收起' : '译文'}</span>
                  </button>
                  <button type="button" onClick={openAnalysis}>
                    <RotateCcw size={18} strokeWidth={1.6} />
                    <span>解读</span>
                  </button>
                </div>
              </article>

              <article className="rj-card rj-card-back" aria-hidden={!isFlipped}>
                <div className="rj-reading-area rj-analysis">
                  <p className="rj-analysis-label">AI 解读</p>
                  <h2>读懂这一句</h2>
                  <p className="rj-analysis-text">{sample.note}</p>
                  <hr />
                  {sample.phrases.map((item) => (
                    <p key={item.phrase} className="dp-phrase">
                      <strong>{item.phrase}</strong>
                      <span>{item.meaning}</span>
                    </p>
                  ))}
                </div>
                <div className="rj-card-tools">
                  <button
                    type="button"
                    onClick={() => {
                      markActivity();
                      setIsFlipped(false);
                    }}
                  >
                    <RotateCcw size={18} strokeWidth={1.6} />
                    <span>返回原文</span>
                  </button>
                  <button type="button" onClick={speak} className={isSpeaking ? 'is-active' : undefined}>
                    <Volume2 size={18} strokeWidth={1.6} />
                    <span>{isSpeaking ? '停止' : '朗读本卡'}</span>
                  </button>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>

      {/* No visible labels: 入门 on the left through 高阶 on the right. Tapping one jumps to it. */}
      <div className="dp-dots" role="group" aria-label="切换阅读难度">
        {LEVEL_SAMPLES.map((item, itemIndex) => (
          <button
            key={item.level}
            type="button"
            aria-label={item.label}
            aria-current={itemIndex === index ? 'true' : undefined}
            className={itemIndex === index ? 'is-active' : undefined}
            onClick={() => goTo(itemIndex)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="dp-footer">
        <button
          type="button"
          className={`dp-confirm ${isConfirmGlow ? 'is-glow' : ''}`}
          onClick={confirm}
          onAnimationEnd={() => setIsConfirmGlow(false)}
        >
          继续
        </button>
      </div>
    </div>
  );
};
