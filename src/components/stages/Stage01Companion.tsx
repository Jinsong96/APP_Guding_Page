import React, { useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { CompanionId } from '../../types';
import { COMPANIONS } from '../../data';
import { CompanionFigure } from '../CompanionFigure';

interface Stage01CompanionProps {
  selectedCompanionId: CompanionId;
  onSelectCompanion: (id: CompanionId) => void;
  onBack?: () => void;
  onNext: () => void;
}

// Three traits per companion, from each character sheet.
const COMPANION_TRAITS: Record<CompanionId, string[]> = {
  wick: ['温柔', '好奇', '治愈'],
  pal: ['机灵探索', '收藏好句', '星图长尾'],
  tuanzi: ['安静在场', '偶尔眨眼', '书角尾巴']
};

// Card width plus the gap to the next card; the track moves by this per companion.
const CARD_STEP_PX = 290 + 18;
const SWIPE_THRESHOLD_PX = 50;
// Movement before a press becomes a drag, so taps still reach the card's button.
const DRAG_START_PX = 6;
const EDGE_RESISTANCE = 0.3;
const WHEEL_COOLDOWN_MS = 450;

// 01 选伴: one swipeable card per companion (styles: companion-select.css). Swiping previews a
// companion; 选TA做旅伴 on the card picks it and moves on.
export const Stage01Companion: React.FC<Stage01CompanionProps> = ({
  selectedCompanionId,
  onSelectCompanion,
  onBack,
  onNext
}) => {
  const [index, setIndex] = useState(() =>
    Math.max(0, COMPANIONS.findIndex((companion) => companion.id === selectedCompanionId))
  );
  const pressStartXRef = useRef<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragX, setDragX] = useState(0);
  const wheelDeltaRef = useRef(0);
  const wheelLockedUntilRef = useRef(0);

  const goTo = (next: number) => {
    const clamped = Math.max(0, Math.min(COMPANIONS.length - 1, next));
    if (clamped === index) return;
    setIndex(clamped);
    onSelectCompanion(COMPANIONS[clamped].id);
  };

  const endPress = (commit: boolean) => {
    pressStartXRef.current = null;
    if (!isDragging) return;
    setIsDragging(false);
    if (commit && Math.abs(dragX) > SWIPE_THRESHOLD_PX) goTo(index + (dragX < 0 ? 1 : -1));
    setDragX(0);
  };

  const choose = (id: CompanionId) => {
    onSelectCompanion(id);
    onNext();
  };

  return (
    <div className="cs-page">
      <header className="cs-header">
        <button type="button" onClick={onBack} aria-label="返回启动页">
          <ChevronLeft size={24} strokeWidth={1.8} />
        </button>
      </header>

      <section className="cs-intro">
        <h1>选择旅伴</h1>
        <p>这一程，想和谁同行？</p>
        <p>学习功能相同，陪伴方式由你选择。</p>
      </section>

      <div
        className="cs-viewport"
        role="group"
        aria-roledescription="carousel"
        aria-label="选择一位旅伴"
        onPointerDown={(event) => {
          pressStartXRef.current = event.clientX;
        }}
        onPointerMove={(event) => {
          if (pressStartXRef.current === null) return;
          if (event.pointerType === 'mouse' && event.buttons === 0) {
            endPress(false);
            return;
          }
          const deltaX = event.clientX - pressStartXRef.current;
          if (!isDragging) {
            if (Math.abs(deltaX) < DRAG_START_PX) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            setIsDragging(true);
          }
          const atEdge = (deltaX > 0 && index === 0) || (deltaX < 0 && index === COMPANIONS.length - 1);
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
        onKeyDown={(event) => {
          if (event.key === 'ArrowRight') goTo(index + 1);
          if (event.key === 'ArrowLeft') goTo(index - 1);
        }}
      >
        <div
          className={`cs-track ${isDragging ? 'is-dragging' : ''}`}
          style={{ transform: `translateX(${-index * CARD_STEP_PX + dragX}px)` }}
        >
          {COMPANIONS.map((companion, cardIndex) => {
            const isActive = cardIndex === index;
            return (
              <article
                key={companion.id}
                className={`cs-card ${isActive ? 'is-active' : ''}`}
                aria-roledescription="slide"
                aria-label={`${cardIndex + 1} / ${COMPANIONS.length}：${companion.name}`}
                aria-hidden={!isActive}
                onClick={() => !isActive && goTo(cardIndex)}
              >
                <CompanionFigure companion={companion} active={isActive} />
                <h2>
                  {companion.name}
                  <span>{companion.nameEn}</span>
                </h2>
                <p className="cs-quote">{companion.description}</p>
                <div className="cs-traits">
                  {COMPANION_TRAITS[companion.id].map((trait) => (
                    <span key={trait}>{trait}</span>
                  ))}
                </div>
                <button
                  type="button"
                  className="cs-choose"
                  tabIndex={isActive ? 0 : -1}
                  onClick={(event) => {
                    event.stopPropagation();
                    choose(companion.id);
                  }}
                >
                  选TA做旅伴
                </button>
              </article>
            );
          })}
        </div>
      </div>

      <div className="cs-dots" role="tablist" aria-label="旅伴">
        {COMPANIONS.map((companion, dotIndex) => (
          <button
            key={companion.id}
            type="button"
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={companion.name}
            className={dotIndex === index ? 'is-active' : undefined}
            onClick={() => goTo(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
};
