import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Companion, CompanionId, ReadSummary, RideTicket } from '../types';
import { MiniProgramHeader } from './MiniProgramHeader';

export interface ReportQuote {
  text: string;
  translation: string;
}

// The "一路积累" block: everything read and saved so far, across all rides.
export interface ReportTotals {
  days: number;
  words: number;
  sentences: number;
  savedWords: number;
}

export interface ReportNextArticle {
  title: string;
  coverUrl: string;
  coverAlt?: string;
}

interface ReadingReportProps {
  companion: Companion;
  ticket: RideTicket;
  summary?: ReadSummary;
  quote?: ReportQuote;
  totals?: ReportTotals;
  nextArticle?: ReportNextArticle;
  onStartNext?: () => void;
  onBack: () => void;
  // 返回发现: back to the reading home.
  onHome: () => void;
}

// Past this many characters the quote would wrap at full size, so the ticket uses its compact rows.
const LONG_QUOTE_LENGTH = 18;
const TOAST_MS = 2000;

// Arrival celebration (report-celebrate in reading-journey.css): the station number flips like a
// station board while the metrics count up; on the first ride the companion also pops out of the stub.
const COUNT_UP_DELAY_MS = 400;
const COUNT_UP_MS = 900;
const COMPANION_POP_DELAY_MS = 1300;
const COMPANION_LINE_MS = 2400;

// Short enough to fit beside the avatar in the ticket stub; IP rule: celebrate arriving together.
const FIRST_RIDE_LINES: Record<CompanionId, string> = {
  wick: '第一站，我们一起到了。',
  pal: '到站啦！下一站我带路～',
  tuanzi: '（团子慢慢眨了眨眼）'
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Counts from 0 to target once, easing out; returns the target straight away for reduced motion.
const useCountUp = (target: number) => {
  const [value, setValue] = useState(() => (prefersReducedMotion() ? target : 0));
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current || prefersReducedMotion()) return;
    startedRef.current = true;
    let frame = 0;
    const startAt = performance.now() + COUNT_UP_DELAY_MS;
    const tick = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - startAt) / COUNT_UP_MS));
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  return value;
};

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// Etched double frame with corner marks; gaps line up with the ticket's side notches.
const TicketEtching = () => (
  <svg className="rj-ticket-etching" viewBox="0 0 357 620" fill="none" aria-hidden="true">
    <path
      d="M13 213V21Q13 13 21 13H336Q344 13 344 21V213M13 247V365M344 247V365M13 399V599Q13 607 21 607H336Q344 607 344 599V399"
      stroke="currentColor"
      strokeWidth=".7"
    />
    <path
      d="M17 213V25Q17 17 25 17H332Q340 17 340 25V213M17 247V365M340 247V365M17 399V595Q17 603 25 603H332Q340 603 340 595V399"
      stroke="currentColor"
      strokeWidth=".4"
      opacity=".5"
    />
    {[
      'translate(21 24) scale(1 1)',
      'translate(336 24) scale(-1 1)',
      'translate(21 596) scale(1 -1)',
      'translate(336 596) scale(-1 -1)'
    ].map((transform) => (
      <g key={transform} transform={transform} stroke="currentColor">
        <path d="M0 9V0h9" strokeWidth=".7" />
        <path d="M4 5h5M6.5 2.5v5" strokeWidth=".45" opacity=".65" />
      </g>
    ))}
  </svg>
);

const TrainEngine = () => (
  <svg viewBox="0 0 72 32" fill="none" aria-hidden="true">
    <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 23h64M9 21V12h30v9M12 12V6h7v6M15 6V3h8M33 12V5h14v16M31 5h18M37 9h6v7h-6zM50 21V10h17v11M49 9h19M54 13v4m5-4v4m5-4v4M9 21l-5 2m1 3h65M23 13v7m4-7v7M9 17h21" />
      <circle cx="16" cy="22" r="4" />
      <circle cx="29" cy="22" r="4" />
      <circle cx="41" cy="22" r="4" />
      <circle cx="55" cy="22" r="3" />
      <circle cx="64" cy="22" r="3" />
      <path d="M16 22h25" />
    </g>
  </svg>
);

// 阅读报告: the "到站车票" after any finished read, matched to the 一鹿知 reading demo.
export const ReadingReport: React.FC<ReadingReportProps> = ({
  companion,
  ticket,
  summary,
  quote = { text: ticket.title, translation: ticket.chineseTitle },
  totals,
  nextArticle,
  onStartNext,
  onBack,
  onHome
}) => {
  const [toast, setToast] = useState<string | null>(null);
  const isLongQuote = quote.text.length > LONG_QUOTE_LENGTH;
  const growth = totals || { days: 1, words: summary?.wordsRead ?? 0, sentences: 0, savedWords: 0 };
  const wordsShown = useCountUp(summary?.wordsRead ?? 0);
  const secondsShown = useCountUp(summary?.seconds ?? 0);
  const isFirstRide = ticket.rideNumber === 1;
  const [companionLine, setCompanionLine] = useState(false);

  useEffect(() => {
    if (!isFirstRide || prefersReducedMotion()) return;
    const show = window.setTimeout(() => setCompanionLine(true), COMPANION_POP_DELAY_MS);
    const hide = window.setTimeout(() => setCompanionLine(false), COMPANION_POP_DELAY_MS + COMPANION_LINE_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [isFirstRide]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div
      className="rj-page"
      style={{ '--rj-bg': `url(${import.meta.env.BASE_URL}assets/journey-bg.jpg)` } as React.CSSProperties}
    >
      <MiniProgramHeader title="阅读报告" onBack={onBack} onClose={onHome} onShare={() => setToast('车票链接已复制')} />

      <div className="rj-report-scroll">
        <div className="rj-ticket-wrap rj-celebrate">
          <article className={`rj-ticket ${isLongQuote ? 'is-long-quote' : ''}`} aria-label={`第 ${ticket.rideNumber} 站到站车票`}>
            <img className="rj-ticket-paper" src={`${import.meta.env.BASE_URL}assets/ticket-paper.jpg`} alt="" aria-hidden="true" />
            <TicketEtching />

            <header className="rj-ticket-brand">
              <div className="rj-ticket-identity">
                <TrainEngine />
                <span>到站车票</span>
              </div>
              <p className="rj-ticket-station">
                <span>第</span>
                <span className="rj-flap">
                  <strong className="rj-flap-old" aria-hidden="true">{ticket.rideNumber - 1}</strong>
                  <strong className="rj-flap-new">{ticket.rideNumber}</strong>
                  <span className="rj-flap-sparkles" aria-hidden="true">
                    {Array.from({ length: 6 }, (_, index) => (
                      <i key={index} style={{ '--rj-a': `${index * 60 + 15}deg` } as React.CSSProperties} />
                    ))}
                  </span>
                </span>
                <span>站</span>
              </p>
            </header>

            <section className="rj-ticket-main">
              <h2>{ticket.title}</h2>
              <p className="rj-ticket-subtitle">{ticket.chineseTitle}</p>
              <div className="rj-ticket-metrics">
                <div>
                  <b>
                    {wordsShown.toLocaleString('en-US')}
                    <small> 词</small>
                  </b>
                  <span>本篇阅读词汇</span>
                </div>
                <div>
                  <b>{formatDuration(secondsShown)}</b>
                  <span>本次阅读时长</span>
                </div>
              </div>
            </section>

            <div className="rj-perforation">
              <span>这一站的收获</span>
            </div>
            <section className="rj-ticket-quote">
              <div className="rj-quote-head">今日好句</div>
              <blockquote>
                <span className="rj-quote-mark">“</span>
                {quote.text}
                <span className="rj-quote-mark">”</span>
              </blockquote>
              <p>{quote.translation}</p>
            </section>

            <div className="rj-perforation">
              <span>一路积累</span>
            </div>
            <section className="rj-growth">
              <div className="rj-growth-grid">
                <div>
                  <b>{growth.days}<small> 天</small></b>
                  <span>累计阅读天数</span>
                </div>
                <div>
                  <b>{growth.words.toLocaleString('en-US')}<small> 词</small></b>
                  <span>累计阅读词数</span>
                </div>
                <div>
                  <b>{growth.sentences}<small> 句</small></b>
                  <span>已收藏金句</span>
                </div>
                <div>
                  <b>{growth.savedWords}<small> 词</small></b>
                  <span>已收藏单词</span>
                </div>
              </div>
            </section>

            <footer className="rj-ticket-stub">
              <img className="rj-ticket-landscape" src={`${import.meta.env.BASE_URL}assets/journey-bg.jpg`} alt="" aria-hidden="true" />
              <div
                className={`rj-ticket-companion ${companionLine ? 'is-popping' : ''}`}
                role="img"
                aria-label={`旅伴${companion.name}`}
              >
                <img src={companion.portraitUrl} alt="" draggable={false} />
              </div>
              {companionLine ? (
                <span className="rj-stub-bubble" role="status">
                  {FIRST_RIDE_LINES[companion.id]}
                </span>
              ) : (
                <span className="rj-ticket-companion-name">旅伴 · {companion.name}</span>
              )}
              <b className="rj-ticket-signature">一鹿知</b>
            </footer>
          </article>
        </div>

        <div className="rj-report-tools" aria-label="报告操作">
          <button type="button" onClick={() => setToast('车票已准备好，可以分享给朋友')}>分享车票</button>
          <span aria-hidden="true" />
          <button type="button" onClick={() => setToast('车票已保存')}>保存车票</button>
        </div>

        {nextArticle && onStartNext && (
          <section className="rj-next">
            <h2>下一篇推荐</h2>
            <button type="button" onClick={onStartNext} aria-label="开始阅读下一篇">
              <img src={nextArticle.coverUrl} alt={nextArticle.coverAlt || ''} draggable={false} />
              <div className="rj-next-copy">
                <strong>{nextArticle.title}</strong>
                <span className="rj-next-read">
                  开始阅读 <ArrowRight size={16} />
                </span>
              </div>
            </button>
          </section>
        )}

        <button type="button" className="rj-back-discovery" onClick={onHome}>
          返回发现
        </button>
      </div>

      {toast && (
        <div className="rj-toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
};
