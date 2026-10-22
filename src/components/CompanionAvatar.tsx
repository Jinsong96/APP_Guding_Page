import React from 'react';
import { Companion } from '../types';

interface CompanionAvatarProps {
  companion: Companion;
  size: number;
  className?: string;
  imgClassName?: string;
  alt?: string;
  onClick?: () => void;
  // Overlays such as a completion ripple render inside the frame.
  children?: React.ReactNode;
}

// The companion's face in a rounded avatar frame, used wherever the companion "speaks".
export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  companion,
  size,
  className = '',
  imgClassName = '',
  alt = '',
  onClick,
  children
}) => {
  const radius = Math.round(size * 0.28);
  const inset = size >= 64 ? 3 : 2;

  return (
    <div
      className={`relative shrink-0 overflow-hidden border border-[#DCCFE8] bg-white ${className}`}
      style={{ width: size, height: size, borderRadius: radius, padding: inset }}
      onClick={onClick}
    >
      <img
        src={companion.portraitUrl}
        alt={alt}
        className={`h-full w-full object-cover ${imgClassName}`}
        style={{ borderRadius: radius - inset }}
        draggable={false}
      />
      {children}
    </div>
  );
};
