import React, { useLayoutEffect, useRef } from 'react';

interface TypedLineProps {
  // The whole line; each \n marks where it may break, so a phrase is never split across rows.
  text: string;
  // The part typed so far (a prefix of `text`).
  typed: string;
  isTyping: boolean;
}

// A companion line typed out in place inside .rj-bubble. The whole line is laid out from the start and
// untyped characters stay invisible, so the bubble never reflows while typing. Phrases between \n are
// kept whole: the line sits on one row when it fits and otherwise wraps between phrases. Screen readers
// get the whole line once, not one character at a time.
export const TypedLine: React.FC<TypedLineProps> = ({ text, typed, isTyping }) => {
  const lineRef = useRef<HTMLParagraphElement>(null);

  // Text that wraps keeps the full available width, leaving a gap after the shorter row. Size the
  // text to its widest row instead, so the bubble hugs the words.
  useLayoutEffect(() => {
    const line = lineRef.current;
    const area = line?.parentElement?.parentElement;
    if (!line || !area) return;
    const fit = () => {
      line.style.width = '';
      const phrases = Array.from(line.querySelectorAll<HTMLElement>('.rj-typed-phrase'));
      const widest = Math.max(0, ...phrases.map((phrase) => phrase.offsetLeft + phrase.offsetWidth));
      // +1: offset sizes are rounded, and a row a fraction too narrow would wrap again.
      if (widest > 0) line.style.width = `${widest + 1}px`;
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(area);
    return () => observer.disconnect();
  }, [text]);

  let remaining = Array.from(typed.replace(/\n/g, '')).length;
  const caret = (
    <span aria-hidden="true" className="rj-typed-caret">
      <span className="animate-pulse motion-reduce:animate-none" />
    </span>
  );
  let caretPlaced = false;

  return (
    <p ref={lineRef}>
      <span aria-hidden="true">
        {text.split('\n').map((phrase, phraseIndex) => {
          const chars = Array.from(phrase);
          const shown = Math.min(remaining, chars.length);
          remaining -= shown;
          // The caret follows the last typed character; it takes no width, so nothing shifts.
          const showCaret = isTyping && !caretPlaced && (remaining === 0 || shown < chars.length);
          if (showCaret) caretPlaced = true;
          return (
            <span key={phraseIndex} className="rj-typed-phrase">
              {chars.slice(0, shown).join('')}
              {showCaret && caret}
              <span className="rj-typed-rest">{chars.slice(shown).join('')}</span>
            </span>
          );
        })}
      </span>
      <span className="sr-only">{text.replace(/\n/g, '')}</span>
    </p>
  );
};
