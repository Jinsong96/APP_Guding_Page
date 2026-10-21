import React from 'react';
import { Check } from 'lucide-react';

interface CompletionRippleProps {
  active: boolean;
  showCheck?: boolean;
}

export const CompletionRipple: React.FC<CompletionRippleProps> = ({
  active,
  showCheck = false
}) => {
  if (!active) return null;

  return (
    <span className="completion-ripple" aria-hidden="true">
      <span className="completion-ripple__ring completion-ripple__ring--first" />
      <span className="completion-ripple__ring completion-ripple__ring--second" />
      {showCheck && (
        <span className="completion-ripple__mark">
          <Check size={12} strokeWidth={3} />
        </span>
      )}
    </span>
  );
};
