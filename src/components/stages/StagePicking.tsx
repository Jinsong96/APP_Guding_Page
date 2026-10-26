import React, { useEffect, useRef, useState } from 'react';
import { Companion, CompanionId } from '../../types';
import { CompanionFigure } from '../CompanionFigure';

interface PickingCover {
  id: string;
  coverUrl: string;
}

interface StagePickingProps {
  companion: Companion;
  // The picked article first, then others to look through alongside it.
  covers: PickingCover[];
  onDone: () => void;
}

// Spots behind the companion (px from the stage centre), in an arc; one per article.
const COVER_SPOTS = [
  { x: -124, y: -32, r: -10 },
  { x: -60, y: -138, r: -4 },
  { x: 60, y: -142, r: 5 },
  { x: 124, y: -40, r: 10 }
];

// Covers the companion looks at, in order, re-checking some as if comparing; the last one is the
// pick (index 0 = picked article).
const LOOK_ORDER = [2, 1, 3, 2, 1, 0];
const SCAN_START_MS = 700;
const LOOK_MS = 430;
// The covers swap spots every this many looks, like flipping through.
const LOOKS_PER_SHUFFLE = 2;
const PICK_AT_MS = SCAN_START_MS + LOOK_ORDER.length * LOOK_MS;
// How long the pick stays on screen before the reading home opens.
const PICKED_HOLD_MS = 1800;

const PICKED_LINES: Record<CompanionId, string> = {
  wick: '找到了，我们从这篇文章一起出发吧。',
  pal: '破案啦，就是这篇文章！',
  tuanzi: '（团子把这篇文章推到你面前）'
};

// V2 04 为你挑选: between the difficulty question and the reading home. The companion looks through
// article covers one by one (each lifts as it is considered, the pile reshuffles), settles on one and
// it lands beside the companion. Tap anywhere to skip. Styles: picking-transition.css.
export const StagePicking: React.FC<StagePickingProps> = ({ companion, covers, onDone }) => {
  const shown = covers.slice(0, COVER_SPOTS.length);
  // Index into LOOK_ORDER of the cover being considered, or null before scanning starts.
  const [look, setLook] = useState<number | null>(null);
  const [picked, setPicked] = useState(false);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    const timers: number[] = [];
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPicked(true);
      timers.push(window.setTimeout(finish, PICKED_HOLD_MS));
    } else {
      LOOK_ORDER.forEach((_, step) => {
        timers.push(window.setTimeout(() => setLook(step), SCAN_START_MS + step * LOOK_MS));
      });
      timers.push(window.setTimeout(() => setPicked(true), PICK_AT_MS));
      timers.push(window.setTimeout(finish, PICK_AT_MS + PICKED_HOLD_MS));
    }
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const shuffle = look === null ? 0 : Math.floor(look / LOOKS_PER_SHUFFLE);
  const lookingAt = look === null || picked ? null : LOOK_ORDER[look];

  return (
    <div
      className={`pk-page ${picked ? 'is-picked' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="正在为你挑选文章，轻点跳过"
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') finish();
      }}
    >
      <div className="pk-stage">
        {shown.map((cover, index) => {
          const spot = COVER_SPOTS[(index + shuffle) % COVER_SPOTS.length];
          return (
            <div
              key={cover.id}
              className={`pk-cover ${index === 0 ? 'is-chosen' : ''} ${lookingAt === index ? 'is-looking' : ''}`}
              style={
                {
                  '--pk-x': `${spot.x}px`,
                  '--pk-y': `${spot.y}px`,
                  '--pk-r': `${spot.r}deg`,
                  '--pk-delay': `${index * 70}ms`
                } as React.CSSProperties
              }
            >
              <span className="pk-cover-float" style={{ animationDelay: `${index * -500}ms` }}>
                <img src={cover.coverUrl} alt="" draggable={false} />
              </span>
            </div>
          );
        })}
        <div className="pk-figure">
          <CompanionFigure companion={companion} active cheerSignal={picked ? 1 : 0} />
        </div>
      </div>

      <p className="pk-caption" aria-live="polite">
        {picked ? PICKED_LINES[companion.id] : `${companion.name}正在书架上帮你找文章…`}
      </p>
      <div className="pk-progress" aria-hidden="true">
        {LOOK_ORDER.map((_, step) => (
          <i key={step} className={picked || (look !== null && step <= look) ? 'is-on' : undefined} />
        ))}
      </div>
      <p className="pk-skip">轻点跳过</p>
    </div>
  );
};
