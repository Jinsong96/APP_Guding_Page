import React, { useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import { FirstReadArticle } from '../firstReadArticles';
import { TrainEngine } from './ReadingReport';
import { CefrLevelKey } from './stages/Stage02AiChat';

interface TicketIssueIntroProps {
  article: FirstReadArticle;
  // The user's picked interests, in order; the 兴趣 row has room for the first two.
  themes: string[];
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

const MAX_INTEREST_THEMES = 2;

// Whole sequence: print → three ticks → stamp → hold → fly away. Timings mirror recommend-intro.css.
const INTRO_DURATION_MS = 7400;

// Etched double frame for the 357×470 issue ticket; its gaps line up with the side notches at 220px.
const IssueEtching = () => (
  <svg className="rj-ticket-etching" viewBox="0 0 357 470" fill="none" aria-hidden="true">
    <path
      d="M13 203V21Q13 13 21 13H336Q344 13 344 21V203M13 237V449Q13 457 21 457H336Q344 457 344 449V237"
      stroke="currentColor"
      strokeWidth=".7"
    />
    <path
      d="M17 203V25Q17 17 25 17H332Q340 17 340 25V203M17 237V445Q17 453 25 453H332Q340 453 340 445V237"
      stroke="currentColor"
      strokeWidth=".4"
      opacity=".5"
    />
    {['translate(21 24) scale(1 1)', 'translate(336 24) scale(-1 1)', 'translate(21 446) scale(1 -1)', 'translate(336 446) scale(-1 -1)'].map(
      (transform) => (
        <g key={transform} transform={transform} stroke="currentColor">
          <path d="M0 9V0h9" strokeWidth=".7" />
          <path d="M4 5h5M6.5 2.5v5" strokeWidth=".45" opacity=".65" />
        </g>
      )
    )}
  </svg>
);

// One-shot "your ticket is printed" moment before the recommendation: a ticket in the reading report's
// style slides out of a slot, three reasons tick in (兴趣 / 难度 / 时长), then a 为你挑选 stamp lands.
// Tap anywhere to skip.
export const TicketIssueIntro: React.FC<TicketIssueIntroProps> = ({ article, themes, level, onDone }) => {
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
    { label: '兴趣', value: themes.slice(0, MAX_INTEREST_THEMES).join('、') },
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
            <article className="rj-ticket is-issue">
              <img className="rj-ticket-paper" src={`${import.meta.env.BASE_URL}assets/ticket-paper.jpg`} alt="" aria-hidden="true" />
              <IssueEtching />
              <header className="rj-ticket-brand">
                <div className="rj-ticket-identity">
                  <TrainEngine />
                  <span>出发车票</span>
                </div>
                <p className="rj-ticket-station">
                  <span>第</span>
                  <strong>1</strong>
                  <span>站</span>
                </p>
              </header>
              <section className="rj-ticket-main">
                <h2>{article.title}</h2>
                <p className="rj-ticket-subtitle">{article.chineseTitle}</p>
              </section>
              <div className="rj-perforation">
                <span>为你挑选的理由</span>
              </div>
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
              <footer className="rj-ticket-stub">
                <img className="rj-ticket-landscape" src={`${import.meta.env.BASE_URL}assets/journey-bg.jpg`} alt="" aria-hidden="true" />
                <b className="rj-ticket-signature">一鹿知</b>
              </footer>
              <div className="ti-stamp" aria-hidden="true">
                <span>为你挑选</span>
              </div>
            </article>
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
