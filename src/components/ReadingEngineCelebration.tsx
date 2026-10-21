import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Companion } from '../types';

export type ReadingEngineCelebrationMode = 'interest' | 'profile';

interface ReadingEngineCelebrationProps {
  companion: Companion;
  mode: ReadingEngineCelebrationMode;
  topics: string[];
  onContinue: () => void;
}

export const ReadingEngineCelebration: React.FC<ReadingEngineCelebrationProps> = ({
  companion,
  mode,
  topics,
  onContinue
}) => {
  const continueRef = useRef(onContinue);
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    continueRef.current = onContinue;
  }, [onContinue]);

  useEffect(() => {
    continueButtonRef.current?.focus();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timer = window.setTimeout(() => continueRef.current(), 1750);
    return () => window.clearTimeout(timer);
  }, []);

  const isInterest = mode === 'interest';
  const signals = isInterest
    ? [...topics.slice(0, 3), ...(topics.length > 3 ? [`+${topics.length - 3}`] : [])]
    : ['兴趣', '目标', '习惯'];

  return (
    <section
      className={`reading-celebration reading-celebration--${mode}`}
      role="dialog"
      aria-modal="true"
      aria-label={isInterest ? '兴趣信号已接入，阅读引擎启动' : '阅读画像校准完成'}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault();
          continueButtonRef.current?.focus();
        } else if (event.key === 'Escape') {
          event.preventDefault();
          continueRef.current();
        }
      }}
    >
      <div className="reading-celebration__grid" aria-hidden="true" />

      <div className="reading-celebration__content">
        <div className="reading-celebration__status">
          <span className="reading-celebration__status-light" />
          <span>{isInterest ? 'READING ENGINE / 01' : 'PROFILE CALIBRATION / 02'}</span>
        </div>

        <div className="reading-celebration__core" aria-hidden="true">
          <span className="reading-celebration__ring reading-celebration__ring--outer" />
          <span className="reading-celebration__ring reading-celebration__ring--middle" />
          <span className="reading-celebration__ring reading-celebration__ring--inner" />
          <span className="reading-celebration__orbit-dot" />
          <div className="reading-celebration__mascot-frame">
            <img src={companion.avatarUrl} alt="" className="reading-celebration__mascot" />
          </div>
          <span className="reading-celebration__core-label">READ / AI</span>
        </div>

        <div className="reading-celebration__copy">
          <p className="reading-celebration__eyebrow">
            {isInterest ? 'INTEREST SIGNAL CONNECTED' : 'READING PROFILE READY'}
          </p>
          <h2>{isInterest ? '阅读引擎启动' : '画像校准完成'}</h2>
          <p className="reading-celebration__description">
            {isInterest ? '你的兴趣，正在接入阅读旅程' : '兴趣、目标与习惯，已同步完成'}
          </p>
        </div>

        <div className="reading-celebration__signals" aria-label="已同步的信息">
          {signals.map((signal, index) => (
            <span
              className="reading-celebration__signal"
              key={`${signal}-${index}`}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <span className="reading-celebration__signal-index">0{index + 1}</span>
              <span>{signal}</span>
            </span>
          ))}
        </div>

        <button
          ref={continueButtonRef}
          className="reading-celebration__continue"
          type="button"
          onClick={onContinue}
        >
          继续
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};
