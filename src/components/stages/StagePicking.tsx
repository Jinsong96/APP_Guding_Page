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

// Clip version: the companion's picking video (front-facing gestures on a cream background) in the
// lower left, the C-01 reading carriage on the rails at the upper right. The covers, their flight and the
// carriage are drawn over the video, timed to its beats (ms from when the video starts playing).
// Layout in px on the 393px-wide screen; see picking-transition.css (.pk-train, .pk-clip-video).
interface PickingClip {
  src: string;
  poster: string;
  // When the companion considers each of the other covers, before settling on the pick.
  lookAtMs: number[];
  // The pick lifts and glows.
  pickAtMs: number;
  // Wick only: the pick drops into his paws, then gets stamped 第1站 like a ticket.
  holdAtMs?: number;
  stampAtMs?: number;
  // The companion sends it off to the right: it flies into the carriage window, which lights up.
  sendAtMs: number;
  // The carriage pulls out to the right, then the reading home opens.
  departAtMs: number;
  endMs: number;
}

// Floating spots for up to three covers, above the companion and left of the carriage.
const CLIP_SPOTS = [
  { x: 62, y: 112, r: -8 },
  { x: 140, y: 64, r: 4 },
  { x: 196, y: 168, r: 9 }
];
// Wick's paws in front of his chest.
const HOLD_SPOT = { x: 136, y: 446, r: -4 };
// Centre of the carriage's left window (the carriage sits at left 238, top 70, 280 wide).
const WINDOW_SPOT = { x: 309, y: 142, r: 0 };
const FLIGHT_MS = 650;

const clipUrl = (file: string) => `${import.meta.env.BASE_URL}assets/companions/${file}`;

const PICKING_CLIPS: Record<CompanionId, PickingClip> = {
  // 星光车票: paws out, the pick lands in them, a stamp of starlight, then he tosses it to the right.
  wick: {
    src: clipUrl('wick-picking-v2.mp4'),
    poster: clipUrl('wick-picking-v2.jpg'),
    lookAtMs: [],
    pickAtMs: 250,
    holdAtMs: 600,
    stampAtMs: 2500,
    sendAtMs: 4400,
    departAtMs: 6300,
    endMs: 7300
  },
  // 星图连线: he links the covers like stars, points at the last one and flicks it to the right.
  pal: {
    src: clipUrl('pal-picking-v2.mp4'),
    poster: clipUrl('pal-picking-v2.jpg'),
    lookAtMs: [1500, 2500, 3500],
    pickAtMs: 4400,
    sendAtMs: 5400,
    departAtMs: 6700,
    endMs: 7700
  },
  // 嘴硬心软: he shakes his head at the covers, his sunglasses slip at the pick, then he pushes it over.
  tuanzi: {
    src: clipUrl('tuanzi-picking-v2.mp4'),
    poster: clipUrl('tuanzi-picking-v2.jpg'),
    lookAtMs: [300, 900, 1500],
    pickAtMs: 2000,
    sendAtMs: 3800,
    departAtMs: 5300,
    endMs: 6300
  }
};

const PICKED_LINES: Record<CompanionId, string> = {
  wick: '车票盖好啦，我们从这一站出发吧。',
  pal: '破案啦，就是这篇文章！',
  tuanzi: '……给你留了个靠窗的位置。'
};

const CARRIAGE_URL = `${import.meta.env.BASE_URL}assets/picking-carriage.png`;
// Departure chime: starts as the carriage pulls out and fades away over the reading home, so it is not
// tied to this page's lifetime.
const DEPART_SOUND_URL = `${import.meta.env.BASE_URL}assets/train-depart.m4a`;
const DEPART_SOUND_VOLUME = 0.8;
const DEPART_FADE_START_MS = 1800;
const DEPART_FADE_MS = 1200;

const playDepartSound = (sound: HTMLAudioElement) => {
  sound.volume = DEPART_SOUND_VOLUME;
  // Sound can be refused without a user gesture; the departure still runs silently then.
  sound.play().catch(() => {});
  window.setTimeout(() => {
    const started = performance.now();
    const fade = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - started) / DEPART_FADE_MS);
      sound.volume = DEPART_SOUND_VOLUME * (1 - progress);
      if (progress === 1) {
        window.clearInterval(fade);
        sound.pause();
      }
    }, 50);
  }, DEPART_FADE_START_MS);
};

// 04 为你挑选: between the difficulty question and the reading home. The companion picks one article
// and sends it into the window of the C-01 reading carriage, which then pulls out. Without a playable
// clip (or with reduced motion) the figure version runs instead. Tap anywhere to skip.
// Styles: picking-transition.css.
export const StagePicking: React.FC<StagePickingProps> = ({ companion, covers, onDone }) => {
  const clip = PICKING_CLIPS[companion.id];
  const [clipFailed, setClipFailed] = useState(false);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (clip && !clipFailed && !reducedMotion) {
    return <PickingWithClip clip={clip} companion={companion} covers={covers} onDone={onDone} onFail={() => setClipFailed(true)} />;
  }
  return <PickingWithFigure companion={companion} covers={covers} onDone={onDone} />;
};

const PickingWithFigure: React.FC<StagePickingProps> = ({ companion, covers, onDone }) => {
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

interface PickingWithClipProps extends StagePickingProps {
  clip: PickingClip;
  // The video could not play: fall back to the figure version.
  onFail: () => void;
}

type Flight = 'spot' | 'held' | 'flying' | 'in-window';

// The beats start when the video actually starts playing, so the covers move with the companion.
const PickingWithClip: React.FC<PickingWithClipProps> = ({ clip, companion, covers, onDone, onFail }) => {
  // covers[0] is the pick; the others are considered first, in order.
  const shown = covers.slice(0, CLIP_SPOTS.length);
  const others = shown.map((_, index) => index).filter((index) => index !== 0);
  const [look, setLook] = useState<number | null>(null);
  const [picked, setPicked] = useState(false);
  const [flight, setFlight] = useState<Flight>('spot');
  const [stamped, setStamped] = useState(false);
  const [departing, setDeparting] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const doneRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  // Loaded up front so the chime starts exactly with the departure.
  const departSoundRef = useRef<HTMLAudioElement | null>(null);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    departSoundRef.current = new Audio(DEPART_SOUND_URL);
    departSoundRef.current.preload = 'auto';
    videoRef.current?.play().catch(() => {
      // Sound needs a user gesture; try again muted before giving up on the clip.
      const video = videoRef.current;
      if (!video) return onFail();
      video.muted = true;
      video.play().catch(onFail);
    });
    return () => timersRef.current.forEach((timer) => window.clearTimeout(timer));
  }, []);

  const startBeats = () => {
    if (timersRef.current.length) return;
    const at = (ms: number, run: () => void) => timersRef.current.push(window.setTimeout(run, ms));
    clip.lookAtMs.forEach((ms, step) => at(ms, () => setLook(step % others.length)));
    at(clip.pickAtMs, () => setPicked(true));
    if (clip.holdAtMs !== undefined) at(clip.holdAtMs, () => setFlight('held'));
    if (clip.stampAtMs !== undefined) at(clip.stampAtMs, () => setStamped(true));
    at(clip.sendAtMs, () => setFlight('flying'));
    at(clip.sendAtMs + FLIGHT_MS, () => setFlight('in-window'));
    at(clip.departAtMs, () => {
      setDeparting(true);
      if (departSoundRef.current) playDepartSound(departSoundRef.current);
    });
    at(clip.endMs, finish);
  };

  const lookingAt = look === null || picked ? null : others[look];
  const inWindow = flight === 'in-window';
  const chosenSpot = flight === 'held' ? HOLD_SPOT : flight === 'flying' || inWindow ? WINDOW_SPOT : CLIP_SPOTS[0];

  return (
    <div
      className={`pk-page has-clip ${picked ? 'is-picked' : ''}`}
      role="button"
      tabIndex={0}
      aria-label="正在为你挑选文章，轻点跳过"
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') finish();
      }}
    >
      <div className="pk-clip-stage">
        <i className="pk-rails" aria-hidden="true" />

        <div className={`pk-train ${departing ? 'is-departing' : ''}`} aria-hidden="true">
          <span className="pk-window is-right" />
          <span className={`pk-window ${inWindow ? 'is-lit' : ''}`}>
            {inWindow && <img src={shown[0].coverUrl} alt="" draggable={false} />}
          </span>
          <img className="pk-carriage" src={CARRIAGE_URL} alt="" draggable={false} />
          <span className="pk-plate">C-01 读物车厢</span>
          {inWindow && <span className="pk-stop-tag">第 1 站</span>}
        </div>

        <video
          ref={videoRef}
          className="pk-clip-video"
          src={clip.src}
          poster={clip.poster}
          playsInline
          preload="auto"
          onPlaying={startBeats}
          onError={onFail}
          aria-hidden="true"
        />

        {shown.map((cover, index) => {
          const isChosen = index === 0;
          const place = isChosen ? chosenSpot : CLIP_SPOTS[index];
          return (
            <div
              key={cover.id}
              className={`pk-cover is-on-clip ${isChosen ? 'is-chosen' : ''} ${lookingAt === index ? 'is-looking' : ''} ${
                isChosen ? `is-${flight}` : ''
              }`}
              style={
                {
                  '--pk-x': `${place.x}px`,
                  '--pk-y': `${place.y}px`,
                  '--pk-r': `${place.r}deg`,
                  '--pk-delay': `${200 + index * 90}ms`
                } as React.CSSProperties
              }
            >
              <span className="pk-cover-float" style={{ animationDelay: `${index * -500}ms` }}>
                <img src={cover.coverUrl} alt="" draggable={false} />
                {isChosen && stamped && <span className="pk-stamp">第1站</span>}
              </span>
            </div>
          );
        })}
      </div>

      <p className="pk-caption" aria-live="polite">
        {inWindow ? PICKED_LINES[companion.id] : `${companion.name}正在帮你挑选文章…`}
      </p>
      <p className="pk-skip">轻点跳过</p>
    </div>
  );
};
