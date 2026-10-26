import React, { useState } from 'react';
import { Companion, CompanionId } from '../types';

interface CompanionFigureProps {
  companion: Companion;
  // Idle motion and the tap reaction run only on the card in focus.
  active: boolean;
}

// Figure height per companion so each sits at a similar visual size on the card.
const FIGURE_HEIGHT: Record<CompanionId, number> = {
  wick: 214,
  pal: 172,
  tuanzi: 168
};
const CHEER_MS = 650;

// A companion standing on the card, front view, with a light idle motion in its own character
// (companion-select.css): Wick breathes slowly under softly glowing antlers, Pal hops now and then,
// Tuanzi breathes in a slow squish. Tap for a small happy bounce.
export const CompanionFigure: React.FC<CompanionFigureProps> = ({ companion, active }) => {
  const [cheerKey, setCheerKey] = useState(0);

  return (
    <button
      type="button"
      className={`cs-figure is-${companion.id} ${active ? 'is-active' : ''}`}
      aria-label={`和${companion.name}打个招呼`}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        // An inactive card's click selects that card instead (handled by the card).
        if (!active) return;
        event.stopPropagation();
        setCheerKey((key) => key + 1);
      }}
    >
      <span className="cs-figure-body" style={{ height: FIGURE_HEIGHT[companion.id] }}>
        <span
          key={cheerKey}
          className={`cs-figure-cheer ${cheerKey ? 'is-cheering' : ''}`}
          style={{ animationDuration: `${CHEER_MS}ms` }}
        >
          <img src={companion.figureUrl} alt="" draggable={false} className="cs-figure-img" />
          {companion.id === 'wick' && <span className="cs-antler-glow" aria-hidden="true" />}
        </span>
      </span>
      <span className="cs-ground" aria-hidden="true" />
    </button>
  );
};
