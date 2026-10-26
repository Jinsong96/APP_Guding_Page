import React, { useEffect, useRef, useState } from 'react';
import { Languages, RotateCcw, Volume2 } from 'lucide-react';
import { CefrLevelKey } from './stages/Stage02AiChat';

interface DifficultySentencePickerProps {
  onConfirm: (level: CefrLevelKey) => void;
}

export interface LevelSample {
  level: CefrLevelKey;
  label: string;
  sentence: string;
  translation: string;
  // Card back (解读): one reading tip and the key phrases.
  note: string;
  phrases: { phrase: string; meaning: string }[];
}

// The same idea written at four levels, so only the difficulty changes between stops.
// Also used by the example-list version of the question (DifficultyExampleList).
export const LEVEL_SAMPLES: LevelSample[] = [
  {
    level: 'A1-',
    label: '入门',
    sentence: 'My cat sleeps in the sun.',
    translation: '我的猫在阳光下睡觉。',
    note: '一个主语加一个动词的简单句：My cat 是主语，sleeps 是动作。',
    phrases: [{ phrase: 'in the sun', meaning: '在阳光下' }]
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
    ]
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
    ]
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
    ]
  }
];

const DEFAULT_INDEX = 1;
// Drag (or trackpad swipe) distance that switches the level.
const SWIPE_THRESHOLD_PX = 50;
// Movement before a press becomes a drag; anything shorter stays a tap on the card's buttons.
const DRAG_START_PX = 6;
// Dragging past the first or last level only moves the card this fraction of the finger.
const EDGE_RESISTANCE = 0.3;
// After a trackpad swipe switches the level, ignore the rest of that gesture's wheel events.
const WHEEL_COOLDOWN_MS = 450;
// Stagger between words as the new sentence fades in.
const WORD_STAGGER_MS = 45;

const stopSpeaking = () => {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
};

// V2 03 阅读难度: one reader card whose sentence rewrites itself as the user moves along four stops
// (入门 → 高阶). The card reuses the reader's card styles (reading-journey.css) and tools; layout and
// the stops live in difficulty-picker.css.
export const DifficultySentencePicker: React.FC<DifficultySentencePickerProps> = ({ onConfirm }) => {
  const [index, setIndex] = useState(DEFAULT_INDEX);
  // Tilt direction of the last change, for the card's 3D lean.
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // Press position; the press only turns into a drag after DRAG_START_PX.
  const pressStartXRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // How far the card is currently dragged, so it follows the finger before snapping.
  const [dragX, setDragX] = useState(0);
  const wheelDeltaRef = useRef(0);
  const wheelLockedUntilRef = useRef(0);
  const sample = LEVEL_SAMPLES[index];

  useEffect(() => stopSpeaking, []);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(LEVEL_SAMPLES.length - 1, next));
    if (clamped === index) return;
    stopSpeaking();
    setIsSpeaking(false);
    setIsFlipped(false);
    setDirection(clamped > index ? 'up' : 'down');
    setIndex(clamped);
  };

  const speak = () => {
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

  const endPress = (commit: boolean) => {
    pressStartXRef.current = null;
    if (!isDragging) return;
    setIsDragging(false);
    if (commit && Math.abs(dragX) > SWIPE_THRESHOLD_PX) goTo(index + (dragX < 0 ? 1 : -1));
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
        className="dp-card-area"
        onPointerDown={(event) => {
          pressStartXRef.current = event.clientX;
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
          if (!isDragging) {
            if (Math.abs(deltaX) < DRAG_START_PX) return;
            // Capture only once it is a drag, so taps still reach the card's buttons.
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
          }
          const atEdge = (deltaX > 0 && index === 0) || (deltaX < 0 && index === LEVEL_SAMPLES.length - 1);
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
          if (now < wheelLockedUntilRef.current) return;
          wheelDeltaRef.current += event.deltaX;
          if (Math.abs(wheelDeltaRef.current) > SWIPE_THRESHOLD_PX) {
            goTo(index + (wheelDeltaRef.current > 0 ? 1 : -1));
            wheelDeltaRef.current = 0;
            wheelLockedUntilRef.current = now + WHEEL_COOLDOWN_MS;
          }
        }}
      >
        <div aria-hidden="true" className="dp-underlay" />
        <div
          key={sample.level}
          className={`dp-card ${direction ? `is-${direction}` : ''} ${isDragging ? 'is-dragging' : ''}`}
          style={{ translate: `${dragX}px 0`, rotate: `${dragX * 0.04}deg` }}
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
                  <button type="button" onClick={() => setShowTranslation((visible) => !visible)} aria-pressed={showTranslation}>
                    <Languages size={18} strokeWidth={1.6} />
                    <span>{showTranslation ? '收起' : '译文'}</span>
                  </button>
                  <button type="button" onClick={() => setIsFlipped(true)}>
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
                  <button type="button" onClick={() => setIsFlipped(false)}>
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

      <div
        className="dp-stops"
        role="radiogroup"
        aria-label="阅读难度"
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') goTo(index + 1);
          if (event.key === 'ArrowLeft') goTo(index - 1);
        }}
      >
        <span
          aria-hidden="true"
          className="dp-thumb"
          style={{ transform: `translateX(${index * 100}%)` }}
        />
        {LEVEL_SAMPLES.map((item, itemIndex) => (
          <button
            key={item.level}
            type="button"
            role="radio"
            aria-checked={itemIndex === index}
            onClick={() => goTo(itemIndex)}
            className={itemIndex === index ? 'is-active' : undefined}
          >
            {item.label}
          </button>
        ))}
      </div>
      <p className="dp-tip">左右滑动卡片，换一档看看</p>

      <div className="dp-footer">
        <button type="button" className="dp-confirm" onClick={() => onConfirm(sample.level)}>
          就读「{sample.label}」难度
        </button>
      </div>
    </div>
  );
};
