import React from 'react';
import { Companion } from '../types';

interface CompanionSceneProps {
  companion: Companion;
  className?: string;
  // Where the portrait sits when the companion has no dedicated scene illustration.
  portraitPosition?: 'center' | 'left' | 'right';
}

const NIGHT_WINDOW_URL = `${import.meta.env.BASE_URL}assets/night-train-window.png`;

export const CompanionScene: React.FC<CompanionSceneProps> = ({
  companion,
  className = '',
  portraitPosition = 'center'
}) => {
  if (companion.sceneUrl) {
    return (
      <img
        src={companion.sceneUrl}
        alt={`夜行列车包厢里的${companion.name}`}
        className={`object-cover object-center ${className}`}
      />
    );
  }

  const portraitStyle: React.CSSProperties =
    portraitPosition === 'right'
      ? { height: '62%', right: '4%', bottom: '10%' }
      : portraitPosition === 'left'
      ? { height: '64%', left: '9%', bottom: '14%' }
      : { height: '80%', left: '50%', bottom: '8%', transform: 'translateX(-50%)' };

  return (
    <div
      className={`overflow-hidden ${className.includes('absolute') ? '' : 'relative'} ${className}`}
      style={{ backgroundColor: '#1D2347' }}
    >
      <img
        src={NIGHT_WINDOW_URL}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <img
        src={companion.avatarUrl}
        alt={`夜行列车包厢里的${companion.name}`}
        className="absolute object-contain"
        style={{
          ...portraitStyle,
          aspectRatio: '98 / 108',
          borderRadius: 14,
          filter: 'drop-shadow(0 8px 18px rgba(16, 18, 40, 0.45))'
        }}
      />
    </div>
  );
};
