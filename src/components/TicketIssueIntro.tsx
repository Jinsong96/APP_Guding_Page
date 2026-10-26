import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { Companion } from '../types';
import { FirstReadArticle } from '../firstReadArticles';
import { CefrLevelKey } from './stages/Stage02AiChat';

interface TicketIssueIntroProps {
  companion: Companion;
  article: FirstReadArticle;
  // The interest this article matches, shown on the 兴趣 row.
  theme: string;
  level: CefrLevelKey;
  onDone: () => void;
}

// Plain-word difficulty names, the same as V2's difficulty question.
const LEVEL_LABELS: Record<CefrLevelKey, string> = {
  'A1-': '入门',
  'A2': '基础',
  'B1': '进阶',
  'B2+': '高阶'
};

// Whole sequence: print → three ticks → stamp → hold → fly away. Timings mirror recommend-intro.css.
const INTRO_DURATION_MS = 5400;

// One-shot "your ticket is printed" moment before the recommendation: a 3D ticket slides out of a
// slot, three reasons tick in (兴趣 / 难度 / 时长), then a 为你挑选 stamp lands. Tap anywhere to skip.
export const TicketIssueIntro: React.FC<TicketIssueIntroProps> = ({ companion, article, theme, level, onDone }) => {
  const doneRef = useRef(false);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finish();
      return;
    }
    const timer = window.setTimeout(finish, INTRO_DURATION_MS);
    return () => window.clearTimeout(timer);
    // Plays once per mount.
  }, []);

  const reasons = [
    { label: '兴趣', value: theme },
    { label: '难度', value: `${LEVEL_LABELS[level]} · 刚刚好` },
    { label: '时长', value: `约 ${article.minutes} 分钟` }
  ];

  return (
    <div
      className="ti-overlay"
      role="button"
      tabIndex={0}
      aria-label={`已为你推荐《${article.chineseTitle}》，轻点跳过`}
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') finish();
      }}
    >
      <div className="ti-stage">
        <div className="ti-slot" aria-hidden="true">
          <span />
        </div>

        <div className="ti-print-window">
          <div className="ti-ticket">
            <header className="ti-ticket-head">
              <span>一鹿知 · 第一站车票</span>
              <span>No.001</span>
            </header>
            <div className="ti-ticket-title">
              <img src={article.coverUrl} alt="" draggable={false} />
              <div>
                <strong>{article.chineseTitle}</strong>
                <em>{article.title}</em>
              </div>
            </div>
            <div className="ti-perforation" aria-hidden="true" />
            <ul className="ti-reasons">
              {reasons.map((reason, index) => (
                <li key={reason.label} style={{ '--ti-i': index } as React.CSSProperties}>
                  <span className="ti-reason-label">{reason.label}</span>
                  <span className="ti-reason-value">{reason.value}</span>
                  <span className="ti-check">
                    <Check size={13} strokeWidth={3.5} />
                  </span>
                </li>
              ))}
            </ul>
            <footer className="ti-ticket-foot">
              <img src={companion.portraitUrl} alt="" draggable={false} />
              <span>旅伴{companion.name}为你挑选</span>
            </footer>
            <div className="ti-stamp" aria-hidden="true">
              <span>为你挑选</span>
            </div>
          </div>
        </div>

        <div className="ti-sparkles" aria-hidden="true">
          {Array.from({ length: 8 }, (_, index) => (
            <i key={index} style={{ '--ti-a': `${index * 45}deg` } as React.CSSProperties} />
          ))}
        </div>

        <p className="ti-caption">这一篇，刚好适合你</p>
      </div>
      <p className="ti-skip">轻点跳过</p>
    </div>
  );
};
