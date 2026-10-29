import React, { useEffect, useRef, useState } from 'react';

export type LaunchMode = 'day' | 'night';

// Daytime train from 6:00 until 18:00 local time, the night train otherwise.
export const launchModeForNow = (date = new Date()): LaunchMode => {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
};

interface Stage00StartProps {
  mode: LaunchMode;
  onStart: () => void;
  onBrowse: () => void;
}

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

const ARRIVAL: Record<LaunchMode, { video: string; poster: string }> = {
  night: { video: 'start-train-arrival.mp4', poster: 'start-train-arrival-poster.jpg' },
  day: { video: 'start-train-arrival-day.mp4', poster: 'start-train-arrival-day-poster.jpg' }
};

// The train really pulls in (start-train-arrival*.mp4: it enters from the left, engine first, and
// brakes at the platform). Once the video ends on the resting frame, the night engine's headlight flares
// and lets off steam; by day the sun glints off the engine instead (start-arrival.css). Reduced motion
// or a video that can't play skips straight to that resting frame.
export const Stage00Start: React.FC<Stage00StartProps> = ({ mode, onStart, onBrowse }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [arrived, setArrived] = useState(false);
  const { video, poster } = ARRIVAL[mode];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setArrived(true);
      return;
    }
    video.play().catch(() => setArrived(true));
  }, []);

  return (
    <div
      className={`st-root st-${mode} relative h-full w-full overflow-hidden${arrived ? ' st-arrived' : ''}`}
    >
      <div className="st-stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="st-video"
          src={asset(video)}
          poster={asset(poster)}
          muted
          playsInline
          preload="auto"
          onEnded={() => setArrived(true)}
          onError={() => setArrived(true)}
        />
        <span className="st-headlight-beam" />
        <span className="st-headlight" />
        <span className="st-steam">
          <i />
          <i />
          <i />
        </span>
      </div>
      <div className="st-scrim" aria-hidden="true" />
      <div className="st-night-fade" aria-hidden="true" />

      <div className="st-content">
        <header className="st-title">
          <span className="st-title-star" aria-hidden="true">
            ✦
          </span>
          <h1 className="st-logo">ReadPal</h1>
          <p className="st-tag">阅读，自有同路人</p>
        </header>

        <div className="st-bottom">
          <h2 className="st-headline">下一程，一起读</h2>
          <p className="st-sub">选一位旅伴，按自己的节奏出发</p>
          <button type="button" onClick={onStart} className="st-primary">
            遇见我的旅伴
            <span aria-hidden="true">→</span>
          </button>
          <button type="button" onClick={onBrowse} className="st-secondary">
            先随便看看
          </button>
        </div>
      </div>
    </div>
  );
};
