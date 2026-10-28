import React, { useEffect, useRef, useState } from 'react';
import { Companion, CompanionId } from '../types';

interface CompanionClipProps {
  companion: Companion;
  // The card in focus plays its signature move, then idles; others show the still poster.
  active: boolean;
}

interface ClipSet {
  // Without a signature clip the card shows the still only (it breathes in CSS while in focus).
  signature?: string;
  // First frame of the signature move: the still shown on inactive cards and while loading.
  poster: string;
  // Last frame of the signature, shown after it when there is no idle loop (defaults to the poster).
  rest?: string;
  // Seamless idle loop (forward-then-back); without one the still poster breathes in CSS instead.
  idle?: string;
  // Where the idle loop starts so it picks up from the signature's last frame (seconds).
  idleStart?: number;
  // The signature clip has its own sound effect.
  sound?: boolean;
}

const clipUrl = (file: string) => `${import.meta.env.BASE_URL}assets/companions/${file}`;

// Designs follow the 2026-10-27 IP sheet (银河夜行专列 · IP 三视图). A companion without a clip can fall
// back to a still cut from that sheet (*-card-v2.jpg); the older *-signature.mp4 / *-idle.mp4 show the previous designs.
const CLIPS: Record<CompanionId, ClipSet> = {
  // 凑近镜头: he runs up to the lens, leaves a glowing hoof print, hops back and waves.
  // No idle clip: the old idle shows the previous model, so he rests on the last frame and breathes.
  wick: {
    signature: clipUrl('wick-v3-signature.mp4'),
    poster: clipUrl('wick-v3-signature.jpg'),
    rest: clipUrl('wick-v3-still.jpg'),
    sound: true
  },
  pal: {
    signature: clipUrl('pal-v2-signature.mp4'),
    poster: clipUrl('pal-v2-signature.jpg'),
    idle: clipUrl('pal-v2-idle.mp4'),
    idleStart: 43 / 24,
    sound: true
  },
  tuanzi: {
    signature: clipUrl('tuanzi-v2-signature.mp4'),
    poster: clipUrl('tuanzi-v2-signature.jpg'),
    idle: clipUrl('tuanzi-v2-idle.mp4'),
    idleStart: 43 / 24,
    sound: true
  }
};

type Phase = 'still' | 'signature' | 'idle';

// V2 01 选伴: the companion's 3D motion clip (or a still in a rounded night-window frame when it has none).
// On focus it plays its signature move once with sound (Wick runs up to the lens and leaves a hoof print, Pal spins with a sparkle
// trail, Tuanzi's sunglasses slip and he pushes them back), then idles; tap to see the signature move again.
// Styles: companion-select.css (.cs-clip).
export const CompanionClip: React.FC<CompanionClipProps> = ({ companion, active }) => {
  const clips = CLIPS[companion.id];
  const [phase, setPhase] = useState<Phase>('still');
  // The signature has just finished and there is no idle loop to take over.
  const [resting, setResting] = useState(false);
  const signatureRef = useRef<HTMLVideoElement | null>(null);
  const idleRef = useRef<HTMLVideoElement | null>(null);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const playSignature = () => {
    const video = signatureRef.current;
    if (!video || reducedMotion) return;
    idleRef.current?.pause();
    video.currentTime = 0;
    video.muted = !clips.sound;
    setResting(false);
    setPhase('signature');
    // Sound needs a user gesture: if the browser refuses, play muted; if that is refused too
    // (e.g. power saving), stay on the still.
    video.play().catch(() => {
      if (video.muted) return setPhase('still');
      video.muted = true;
      video.play().catch(() => setPhase('still'));
    });
  };

  const startIdle = () => {
    const idle = idleRef.current;
    if (!idle) {
      setResting(true);
      setPhase('still');
      return;
    }
    setPhase('idle');
    idle.currentTime = clips.idleStart ?? 0;
    idle.play().catch(() => setPhase('still'));
  };

  useEffect(() => {
    if (active) {
      playSignature();
    } else {
      signatureRef.current?.pause();
      idleRef.current?.pause();
      setResting(false);
      setPhase('still');
    }
  }, [active]);

  return (
    <button
      type="button"
      className={`cs-clip is-${companion.id} is-${phase} ${clips.signature ? 'has-motion' : ''} ${active ? 'is-active' : ''}`}
      aria-label={clips.signature ? `看${companion.name}的招牌动作` : companion.name}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        // An inactive card's click selects that card instead (handled by the card).
        if (!active) return;
        event.stopPropagation();
        playSignature();
      }}
    >
      <img className="cs-clip-still" src={resting && clips.rest ? clips.rest : clips.poster} alt="" draggable={false} />
      {clips.signature && (
        <video
          ref={signatureRef}
          className="cs-clip-video is-signature"
          src={clips.signature}
          poster={clips.poster}
          muted={!clips.sound}
          playsInline
          preload={active ? 'auto' : 'metadata'}
          onEnded={startIdle}
          aria-hidden="true"
        />
      )}
      {clips.idle && (
        <video
          ref={idleRef}
          className="cs-clip-video is-idle"
          src={clips.idle}
          muted
          playsInline
          loop
          preload={active ? 'auto' : 'none'}
          aria-hidden="true"
        />
      )}
    </button>
  );
};
