import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Companion, CompanionId } from '../../types';
import { CompanionScene } from '../CompanionScene';

interface StageRecommendingProps {
  companion: Companion;
  onBack: () => void;
  onDone: () => void;
}

const SERIF = '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif';
const PAGE_BG = '#F7F6FB';
const DURATION_MS = 2600;

const PICKING_LINES: Record<CompanionId, string> = {
  wick: '灯芯正踮着小蹄子，在书架间帮你挑文章…',
  pal: '帕利甩着星图尾巴，正帮你翻找最有趣的一篇…',
  tuanzi: '团子趴在书堆上，认真帮你挑一篇刚刚好的…'
};

// Same night-sky gradient as the recommend page's primary button.
const STARRY_FILL = [
  'radial-gradient(1px 1px at 18% 40%, rgba(255,255,255,0.85), transparent)',
  'radial-gradient(1px 1px at 52% 60%, rgba(255,255,255,0.7), transparent)',
  'radial-gradient(1px 1px at 82% 35%, rgba(255,255,255,0.8), transparent)',
  'linear-gradient(90deg, #2A3479 0%, #1E2768 50%, #2E3B88 100%)'
].join(', ');

// V2 only: a short beat after the questions while the companion "picks" the first article.
export const StageRecommending: React.FC<StageRecommendingProps> = ({ companion, onBack, onDone }) => {
  const [progress, setProgress] = useState(0);
  // Keep the latest callback without restarting the timer on every progress re-render.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const ratio = Math.min((now - startedAt) / DURATION_MS, 1);
      setProgress(ratio);
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const doneTimer = window.setTimeout(() => onDoneRef.current(), DURATION_MS + 350);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(doneTimer);
    };
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden text-[#1B2150]" style={{ backgroundColor: PAGE_BG }}>
      <section className="relative h-[250px] shrink-0 overflow-hidden">
        <CompanionScene companion={companion} portraitPosition="left" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#141A3D]/55 to-transparent" />
        <header className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between px-3 text-white">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBack}
              aria-label="返回上一步"
              className="flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft size={26} strokeWidth={2} />
            </button>
            <span className="text-[20px] font-semibold drop-shadow" style={{ fontFamily: SERIF }}>
              一鹿知
            </span>
          </div>
          <span className="pr-1 text-[15px] font-medium drop-shadow">为你推荐</span>
        </header>
      </section>

      <div className="relative z-10 -mt-6 flex min-h-0 flex-1 flex-col">
        <svg aria-hidden="true" viewBox="0 0 393 26" preserveAspectRatio="none" className="block h-[26px] w-full shrink-0">
          <path d="M0 26 L0 14 C 70 2, 150 0, 230 10 C 300 18, 350 16, 393 4 L393 26 Z" fill={PAGE_BG} />
        </svg>

        <div className="flex flex-1 flex-col items-center justify-center px-8 pb-24" style={{ backgroundColor: PAGE_BG }}>
          <div
            className="h-2.5 w-full overflow-hidden rounded-full bg-[#E3E1EF]"
            role="progressbar"
            aria-label="正在推荐文章"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress * 100)}
          >
            <div className="h-full rounded-full" style={{ width: `${progress * 100}%`, backgroundImage: STARRY_FILL }} />
          </div>
          <p className="mt-5 text-center text-[16px] leading-relaxed text-[#2A2F55]" aria-live="polite">
            {PICKING_LINES[companion.id]}
          </p>
        </div>
      </div>
    </div>
  );
};
