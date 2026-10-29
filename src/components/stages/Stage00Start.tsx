import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

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

const ARRIVAL: Record<LaunchMode, { video: string; poster: string; sound: string }> = {
  night: {
    video: 'start-train-arrival.mp4',
    poster: 'start-train-arrival-poster.jpg',
    sound: 'start-train-arrival-night.wav'
  },
  day: {
    video: 'start-train-arrival-day.mp4',
    poster: 'start-train-arrival-day-poster.jpg',
    sound: 'start-train-arrival-day.wav'
  }
};

// The train really pulls in (start-train-arrival*.mp4: it enters from the left, engine first, and
// brakes at the platform). Once the video ends on the resting frame, the night engine's headlight flares
// and lets off steam; by day the sun glints off the engine instead (start-arrival.css). Reduced motion
// or a video that can't play skips straight to that resting frame.
export const Stage00Start: React.FC<Stage00StartProps> = ({ mode, onStart, onBrowse }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const soundRef = useRef<HTMLAudioElement>(null);
  const soundRequestedRef = useRef(true);
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [arrived, setArrived] = useState(false);
  const { video, poster, sound } = ARRIVAL[mode];

  const pauseSound = () => {
    soundRef.current?.pause();
    setSoundPlaying(false);
  };

  const playSoundAtVideoTime = () => {
    const audio = soundRef.current;
    if (!audio) return;
    const time = videoRef.current?.currentTime ?? 0;
    audio.currentTime = Math.min(time, Number.isFinite(audio.duration) ? audio.duration : time);
    audio.play().then(() => {
      if (soundRequestedRef.current) setSoundPlaying(true);
      else audio.pause();
    }).catch(() => setSoundPlaying(false)); // Browsers can block audible autoplay.
  };

  const toggleSound = () => {
    if (soundPlaying) {
      soundRequestedRef.current = false;
      pauseSound();
      return;
    }
    soundRequestedRef.current = true;
    const video = videoRef.current;
    if (video && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (video.ended || (video.duration && video.currentTime >= video.duration - 0.3)) {
        video.currentTime = 0;
        setArrived(false);
      }
      if (video.paused) video.play().catch(() => setArrived(true));
    } else if (soundRef.current) {
      soundRef.current.currentTime = 0;
    }
    // This call is inside the click gesture, so sound works even when autoplay was denied.
    playSoundAtVideoTime();
  };

  useEffect(() => {
    const video = videoRef.current;
    const audio = soundRef.current;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setArrived(true);
    } else {
      video?.play().catch(() => setArrived(true));
    }
    return () => audio?.pause();
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
          onPlaying={() => {
            if (soundRequestedRef.current) playSoundAtVideoTime();
          }}
          onPause={pauseSound}
          onEnded={() => {
            soundRequestedRef.current = false;
            setArrived(true);
            pauseSound();
          }}
          onError={() => {
            soundRequestedRef.current = false;
            setArrived(true);
            pauseSound();
          }}
        />
        <span className="st-headlight-beam" />
        <span className="st-headlight" />
        <span className="st-steam">
          <i />
          <i />
          <i />
        </span>
      </div>
      <audio ref={soundRef} src={asset(sound)} preload="auto" onEnded={() => setSoundPlaying(false)} />
      <div className="st-scrim" aria-hidden="true" />
      <div className="st-night-fade" aria-hidden="true" />
      <button
        type="button"
        className="st-sound"
        aria-label={soundPlaying ? '关闭火车音效' : arrived ? '重播火车进站音效' : '播放火车进站音效'}
        aria-pressed={soundPlaying}
        onClick={toggleSound}
      >
        {soundPlaying ? <Volume2 size={17} /> : <VolumeX size={17} />}
      </button>

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
