import React from 'react';
import { Companion } from '../types';

interface CompanionAvatarProps {
  companion: Companion;
  size: number;
  className?: string;
  imgClassName?: string;
  alt?: string;
  onClick?: () => void;
  // Drops the white mat and border; the caller gives it depth instead (companion rows use .rj-avatar).
  frameless?: boolean;
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
  frameless = false,
  children
}) => {
  const radius = Math.round(size * 0.28);
  const inset = frameless ? 0 : size >= 64 ? 3 : 2;

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-white ${frameless ? '' : 'border border-[#DCCFE8]'} ${className}`}
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
