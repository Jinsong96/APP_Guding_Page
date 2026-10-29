import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import type { Companion } from '../types';
import { CompletionRipple } from './CompletionRipple';
import { CompanionAvatar } from './CompanionAvatar';
import { TypedLine } from './TypedLine';
import { MiniProgramHeader } from './MiniProgramHeader';
import '../interest-train.css';

interface InterestThemePickerProps {
  companion: Companion;
  bubbleText: string;
  // The whole line being typed.
  bubbleFullText: string;
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
  { name: '世界热点', reply: '好，我们一起看看更大的世界。' },
  { name: '科学探索', reply: '好，我们先从科学出发。' },
  { name: '文化故事', reply: '好，我们从文化故事出发。' },
  { name: '商业观察', reply: '好，我们从商业观察出发。' },
  { name: '自我成长', reply: '好，我们从自我成长出发。' },
  { name: '趣味故事', reply: '好，我们先读一个有趣的故事。' }
] as const;

export const InterestThemePicker: React.FC<InterestThemePickerProps> = ({
  companion,
  bubbleText,
  bubbleFullText,
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

      <div className="it-layout">
        <div className="rj-companion-row it-companion-row">
          <CompanionAvatar companion={companion} size={44} alt={companion.name} frameless className="rj-avatar">
            <CompletionRipple active={isConfirming} />
          </CompanionAvatar>
          <div className="rj-bubble" role="status" aria-atomic="true">
            <TypedLine text={bubbleFullText} typed={bubbleText} isTyping={bubbleIsTyping} />
          </div>
        </div>

        <div className="it-station-heading">
          <h2>选 1–3 个喜欢的主题</h2>
          <span className={`it-station-count ${limitHint ? 'is-limit' : ''}`} aria-live="polite">
            {limitHint ? (
              `最多 ${MAX_INTERESTS} 个，先取消一个`
            ) : (
              <>
                <span className="it-count-pips" aria-hidden="true">
                  {Array.from({ length: MAX_INTERESTS }, (_, pip) => (
                    <span key={pip} className={pip < selectedNames.length ? 'is-on' : undefined} />
                  ))}
                </span>
                已选 {selectedNames.length}/{MAX_INTERESTS}
              </>
            )}
          </span>
        </div>

        {/* A train route: each theme is a station, and ticking one makes it a stop. */}
        <div className="it-route-viewport">
          <div className="it-route" role="group" aria-label="阅读兴趣站点">
            {INTERESTS.map(({ name }, stopIndex) => {
              const isSelected = selectedTags.includes(name);
              const isBlocked = atLimit && !isSelected;
              return (
                <button
                  key={name}
                  type="button"
                  role="checkbox"
                  aria-checked={isSelected}
                  aria-disabled={isBlocked}
                  onClick={() => (isBlocked ? setLimitHint(true) : onToggleTag(name))}
                  disabled={isConfirming}
                  style={{ '--it-i': stopIndex } as React.CSSProperties}
                  className={`it-stop ${isSelected ? 'it-stop-selected' : ''} ${isBlocked ? 'it-stop-blocked' : ''}`}
                >
                  <span className="it-stop-name">{name}</span>
                  <span className="it-stop-check" aria-hidden="true">
                    {isSelected && <Check size={15} strokeWidth={3} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="it-footer">
        <button
          type="button"
          onClick={() => onConfirm(selectedTags)}
          disabled={!selectedNames.length || isConfirming}
          className="it-continue"
        >
          <span>继续</span>
        </button>
      </footer>
    </div>
  );
};
