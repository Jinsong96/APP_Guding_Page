import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CompanionId, ReadSummary, RideTicket } from '../types';
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
  ticket: RideTicket;
  summary?: ReadSummary;
  quote?: ReportQuote;
  totals?: ReportTotals;
  nextArticle?: ReportNextArticle;
  onStartNext?: () => void;
  onBack: () => void;
  // 返回发现: back to the reading home.
  onHome: () => void;
  // 为你出票: on a dark screen the companion's paws hand the ticket down, then the report fades in
  // around it without remounting. onIssued fires when the hand-over ends.
  issuing?: boolean;
  onIssued?: () => void;
  // Whose paws hand the ticket over.
  companionId?: CompanionId;
}

// Past this many characters the quote would wrap at full size, so the ticket uses its compact rows.
const LONG_QUOTE_LENGTH = 18;
const TOAST_MS = 2000;

// Arrival celebration (report-celebrate in reading-journey.css): the station number flips like a
// station board while the metrics count up.
const COUNT_UP_DELAY_MS = 400;
const COUNT_UP_MS = 900;
// Hand-over length before the report appears (matches rj-deliver, rj-paw-release and rj-paw-gesture
// in reading-journey.css).
const ISSUE_MS = 2550;
// Let the 1s companion cue finish before the report stamp lands.
// The stamp sound begins with its 720ms visual animation; its impact is ~500ms later.
const STAMP_AFTER_ISSUE_MS = 550;
const STAMP_AFTER_ARRIVAL_MS = 1500;
// One shared arrival celebration for every companion: stamp hit followed by the selected train bell.
const STAMP_SOUND_URL = `${import.meta.env.BASE_URL}assets/reading-completion-arrival-bell.wav`;
type TicketSoundCue = 'deliver' | 'release' | 'approach' | 'contact' | 'retreat';
const ticketSoundUrl = (cue: TicketSoundCue, companionId: CompanionId) =>
  `${import.meta.env.BASE_URL}assets/${cue === 'contact' ? `ticket-handover-${companionId}` : {
    deliver: 'ticket-paws-deliver',
    release: 'ticket-paws-release',
    approach: 'ticket-paw-approach',
    retreat: 'ticket-paw-retreat'
  }[cue]}.wav?v=paw-cues-6`;

const pawUrl = (companionId: CompanionId, part: 'left' | 'right' | 'tap') =>
  `${import.meta.env.BASE_URL}assets/paws/${companionId}-${part}.png`;

// Matches .rj-ticket's width.
const TICKET_WIDTH = 357;

// Each paw image (public/assets/paws/*-left|right.png) was cut from a picture of both paws holding a
// chroma-green card that was keyed out, so the real ticket shows where the card was: thumb in front,
// fingers behind its top edge. Per companion: the shown width of each paw image (px), its height /
// width, and where the card's top corner sits in the left and right image (fractions of width/height).
interface PawGrip {
  width: number;
  aspect: number;
  left: { x: number; y: number };
  right: { x: number; y: number };
}

const PAW_GRIPS: Record<CompanionId, PawGrip> = {
  wick: { width: 210, aspect: 0.7008, left: { x: 0.2469, y: 0.6812 }, right: { x: 0.7523, y: 0.6812 } },
  pal: { width: 262, aspect: 0.6923, left: { x: 0.5002, y: 0.7441 }, right: { x: 0.5006, y: 0.7441 } },
  tuanzi: { width: 247, aspect: 0.67, left: { x: 0.393, y: 0.7318 }, right: { x: 0.6063, y: 0.7318 } }
};

// Places a paw image so its card corner lands on the ticket's matching top corner.
const pawStyle = (companionId: CompanionId, side: 'left' | 'right'): React.CSSProperties => {
  const grip = PAW_GRIPS[companionId];
  const corner = grip[side];
  const cornerX = side === 'left' ? 0 : TICKET_WIDTH;
  return { width: grip.width, left: cornerX - corner.x * grip.width, top: -corner.y * grip.width * grip.aspect };
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

export const TrainEngine = () => (
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
  ticket,
  summary,
  quote = { text: ticket.title, translation: ticket.chineseTitle },
  totals,
  nextArticle,
  onStartNext,
  onBack,
  onHome,
  issuing = false,
  onIssued,
  companionId = 'wick'
}) => {
  const [toast, setToast] = useState<string | null>(null);
  const [isPrinting, setIsPrinting] = useState(issuing);
  const [isStamped, setIsStamped] = useState(false);
  // Whether this report arrived by a print-out (the arrival rise is skipped then).
  const [arrivedByPrint, setArrivedByPrint] = useState(issuing);
  const stampSoundRef = useRef<HTMLAudioElement | null>(null);
  const ticketSoundsRef = useRef<Partial<Record<TicketSoundCue, HTMLAudioElement>>>({});

  useEffect(() => {
    const sound = new Audio(STAMP_SOUND_URL);
    sound.preload = 'auto';
    sound.volume = 0.70;
    stampSoundRef.current = sound;
    return () => {
      sound.pause();
      stampSoundRef.current = null;
    };
  }, []);

  // The sound starts with the visual stamp, including on a direct visit to 07.
  useEffect(() => {
    if (!isStamped) return;
    const sound = stampSoundRef.current;
    if (!sound) return;
    sound.currentTime = 0;
    // Autoplay can be refused when the report was opened without a user gesture.
    sound.play().catch(() => {});
  }, [isStamped]);

  useEffect(() => () => {
    Object.values(ticketSoundsRef.current).forEach((sound) => sound.pause());
    ticketSoundsRef.current = {};
  }, []);

  // Prepare all cues before their CSS animations begin. Keep their tails playing
  // through the transition from 出票 to 阅读报告; only navigation stops them.
  useEffect(() => {
    if (!issuing || prefersReducedMotion()) return;
    Object.values(ticketSoundsRef.current).forEach((sound) => sound.pause());
    for (const cue of ['deliver', 'release', 'approach', 'contact', 'retreat'] as const) {
      const sound = new Audio(ticketSoundUrl(cue, companionId));
      sound.preload = 'auto';
      sound.volume = cue === 'contact' ? 0.44 : 0.28; // The completion motif lifts above the paw movements.
      ticketSoundsRef.current[cue] = sound;
    }
  }, [issuing, companionId]);

  // These events are emitted by the browser's animation timeline, not by a
  // separate JS timeout that can drift from the paw position.
  const playTicketCue = (cue: TicketSoundCue) => {
    if (!issuing || prefersReducedMotion()) return;
    const sound = ticketSoundsRef.current[cue];
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
  };

  // Print the ticket whenever issuing turns on (including a repeat visit to 为你出票).
  useEffect(() => {
    if (!issuing) return;
    setArrivedByPrint(true);
    setIsStamped(false);
    // A repeat visit should not overlap the previous report celebration.
    stampSoundRef.current?.pause();
    if (prefersReducedMotion()) {
      setIsPrinting(false);
      setIsStamped(true);
      onIssued?.();
      return;
    }
    setIsPrinting(true);
    const done = window.setTimeout(() => {
      setIsPrinting(false);
      onIssued?.();
    }, ISSUE_MS);
    return () => window.clearTimeout(done);
  }, [issuing]);

  useEffect(() => {
    if (isPrinting || isStamped) return;
    const delay = prefersReducedMotion() ? 0 : arrivedByPrint ? STAMP_AFTER_ISSUE_MS : STAMP_AFTER_ARRIVAL_MS;
    const timer = window.setTimeout(() => setIsStamped(true), delay);
    return () => window.clearTimeout(timer);
  }, [isPrinting, isStamped, arrivedByPrint]);
  const isLongQuote = quote.text.length > LONG_QUOTE_LENGTH;
  const growth = totals || { days: 1, words: summary?.wordsRead ?? 0, sentences: 0, savedWords: 0 };
  const wordsShown = useCountUp(summary?.wordsRead ?? 0);
  const secondsShown = useCountUp(summary?.seconds ?? 0);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [toast]);

  return (
    <div
      className={`rj-page ${isPrinting ? 'is-issuing' : ''}`}
      style={{ '--rj-bg': `url(${import.meta.env.BASE_URL}assets/journey-bg.jpg)` } as React.CSSProperties}
    >
      {arrivedByPrint && <div className="rj-issue-backdrop" aria-hidden="true" />}
      <MiniProgramHeader title="阅读报告" onBack={onBack} onClose={onHome} onShare={() => setToast('车票链接已复制')} />

      <div className="rj-report-scroll">
        <div
          className={`rj-ticket-wrap ${arrivedByPrint ? 'rj-printed' : 'rj-celebrate'} ${isPrinting ? 'is-printing' : ''}`}
          onAnimationStart={(event) => {
            if (event.target === event.currentTarget && event.animationName === 'rj-deliver') playTicketCue('deliver');
          }}
        >
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
              <b className="rj-ticket-signature">一鹿知</b>
            </footer>
            <div className={`rj-done-stamp ${isStamped ? 'is-stamped' : ''}`} aria-hidden={!isStamped}>
              <span>已完成</span>
              <span>阅读</span>
            </div>
          </article>
          {isPrinting && (
            // Both paws grip the ticket's top corners, let go, then one paw taps it.
            <div className={`rj-paws is-${companionId}`} aria-hidden="true">
              <img className="rj-paw-grip" src={pawUrl(companionId, 'left')} style={pawStyle(companionId, 'left')} alt="" draggable={false} onAnimationStart={(event) => {
                if (event.animationName === 'rj-paw-release') playTicketCue('release');
              }} />
              <img className="rj-paw-grip" src={pawUrl(companionId, 'right')} style={pawStyle(companionId, 'right')} alt="" draggable={false} />
              <img className="rj-paw-gesture" src={pawUrl(companionId, 'tap')} alt="" draggable={false} onAnimationStart={(event) => {
                if (event.animationName === 'rj-paw-tap') playTicketCue('approach');
              }} />
              <span className="rj-paw-contact-cue" onAnimationStart={(event) => {
                if (event.animationName === 'rj-paw-contact') playTicketCue('contact');
              }} />
              <span className="rj-paw-retreat-cue" onAnimationStart={(event) => {
                if (event.animationName === 'rj-paw-retreat') playTicketCue('retreat');
              }} />
            </div>
          )}
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
