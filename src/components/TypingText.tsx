import React, { useEffect, useState } from 'react';

interface TypingTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export const TypingText: React.FC<TypingTextProps> = ({
  text,
  className,
  speed = 28
}) => {
  const [visibleCount, setVisibleCount] = useState(0);
  const characters = Array.from(text);

  useEffect(() => {
    setVisibleCount(0);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisibleCount(characters.length);
      return;
    }

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleCount(index);

      if (index >= characters.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [text, speed, characters.length]);

  return (
    <span className={className}>
      {characters.slice(0, visibleCount).join('')}
      {visibleCount < characters.length && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block h-[1em] w-px translate-y-[2px] animate-pulse bg-current motion-reduce:animate-none"
        />
      )}
    </span>
  );
};
