import React, { useEffect, useState } from 'react';
import { Companion } from '../types';
import { CHAT_TYPING_INTERVAL_MS } from './speechTiming';

interface SceneSpeechBubbleProps {
  companion: Companion;
  text: string;
  // Size of the hero box the scene image fills with object-cover (centred).
  frameWidth: number;
  frameHeight: number;
  // Type the text out character by character (the bubble keeps its final size while typing).
  typing?: boolean;
  // The scene is drawn shifted right by this many px (see CompanionScene shiftX); when set, the
  // bubble sits left of the mouth instead of right of it.
  sceneShiftX?: number;
  className?: string;
}

const SCENE_ASPECT = 2; // scene images are 2:1
// Breathing room between the mouth and the bubble's tail, and a slight lift above mouth level.
const MOUTH_GAP = 28;
const LIFT = 10;
const EDGE_GAP = 10;
const MAX_WIDTH = 168;

// Speech bubble that reads as coming from the companion's mouth in its scene image.
export const SceneSpeechBubble: React.FC<SceneSpeechBubbleProps> = ({
  companion,
  text,
  frameWidth,
  frameHeight,
  typing = false,
  sceneShiftX = 0,
  className = ''
}) => {
  // Map image-space points into the frame, matching object-cover + object-center.
  const imageWidth = Math.max(frameWidth, frameHeight * SCENE_ASPECT);
  const imageHeight = imageWidth / SCENE_ASPECT;
  const toFrame = (point: { x: number; y: number }) => ({
    x: point.x * imageWidth - (imageWidth - frameWidth) / 2 + sceneShiftX,
    y: point.y * imageHeight - (imageHeight - frameHeight) / 2
  });
  const [typedCount, setTypedCount] = useState(typing ? 0 : Array.from(text).length);

  useEffect(() => {
    const characters = Array.from(text);
    if (!typing || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedCount(characters.length);
      return;
    }
    setTypedCount(0);
    const timer = window.setInterval(() => {
      setTypedCount((count) => {
        if (count + 1 >= characters.length) window.clearInterval(timer);
        return Math.min(count + 1, characters.length);
      });
    }, CHAT_TYPING_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [text, typing]);

  const characters = Array.from(text);
  const isTyping = typedCount < characters.length;
  // The invisible full text reserves the final size; the typed text is laid over it.
  const bubbleBody = (
    <p className="relative whitespace-pre-line text-[13px] font-medium leading-[1.45] text-[#2A2F55]">
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0" aria-label={text}>
        {characters.slice(0, typedCount).join('')}
        {isTyping && (
          <span
            aria-hidden="true"
            className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-[2px] animate-pulse bg-[#C83E26] motion-reduce:animate-none"
          />
        )}
      </span>
    </p>
  );
  const bubbleClass = `relative rounded-[16px] bg-white/95 px-3 py-2 shadow-[0_6px_18px_rgba(20,24,60,0.18)] ${className}`;

  // Outer layers position the bubble; the inner layer carries any entrance animation, whose
  // transform would otherwise override the positioning.
  if (sceneShiftX > 0) {
    const mouth = toFrame(companion.sceneMouth || { x: 0.4, y: 0.5 });
    const right = frameWidth - mouth.x + MOUTH_GAP;
    return (
      <div
        className="absolute z-10"
        style={{ right, top: mouth.y - LIFT, transform: 'translateY(-50%)', maxWidth: Math.min(MAX_WIDTH, frameWidth - right - EDGE_GAP) }}
        aria-live="polite"
      >
        <div className={bubbleClass}>
          <span aria-hidden="true" className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white/95" />
          {bubbleBody}
        </div>
      </div>
    );
  }

  const point = toFrame(companion.sceneBubbleAnchors?.side || companion.sceneMouth || { x: 0.4, y: 0.5 });
  const left = point.x + MOUTH_GAP;
  return (
    <div
      className="absolute z-10"
      style={{ left, top: point.y - LIFT, transform: 'translateY(-50%)', maxWidth: Math.min(MAX_WIDTH, frameWidth - left - EDGE_GAP) }}
      aria-live="polite"
    >
      <div className={bubbleClass}>
        <span aria-hidden="true" className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 bg-white/95" />
        {bubbleBody}
      </div>
    </div>
  );
};
