import React, { useEffect, useRef, useState } from 'react';

interface Stage00StartProps {
  onStart: () => void;
  onBrowse: () => void;
}

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

// The night train really pulls in (start-train-arrival.mp4: it enters from the left, engine first,
// and brakes at the platform). Once the video ends on the resting frame, the headlight flares and the
// engine lets off steam (start-arrival.css). Reduced motion or a video that can't play skips straight
// to that resting frame.
export const Stage00Start: React.FC<Stage00StartProps> = ({ onStart, onBrowse }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [arrived, setArrived] = useState(false);

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
      className={`st-root relative h-full w-full overflow-hidden bg-[#121a38] text-white${arrived ? ' st-arrived' : ''}`}
    >
      <div className="st-stage" aria-hidden="true">
        <video
          ref={videoRef}
          className="st-video"
          src={asset('start-train-arrival.mp4')}
          poster={asset('start-train-arrival-poster.jpg')}
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
