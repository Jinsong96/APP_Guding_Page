import React from 'react';

// The single progress system shared by every onboarding screen before the result page.
export const ONBOARDING_PHASES = ['选旅伴', '阅读兴趣', '目标与习惯', '首篇阅读'] as const;

interface OnboardingProgressProps {
  phase: number;
  // How far into the current phase the user is (0–1); single-screen phases are full.
  phaseProgress?: number;
  tone?: 'light' | 'dark';
  className?: string;
}

export const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  phase,
  phaseProgress = 1,
  tone = 'light',
  className = ''
}) => {
  const isDark = tone === 'dark';
  const label = ONBOARDING_PHASES[phase];

  return (
    <div
      className={`w-full ${className}`}
      role="progressbar"
      aria-label="引导进度"
      aria-valuemin={0}
      aria-valuemax={ONBOARDING_PHASES.length}
      aria-valuenow={phase + phaseProgress}
      aria-valuetext={`第 ${phase + 1} 步，共 ${ONBOARDING_PHASES.length} 步：${label}`}
    >
      <div
        className="flex items-center justify-between text-[12px] font-medium leading-4"
        style={{ color: isDark ? 'rgba(255, 255, 255, 0.92)' : '#596B89' }}
      >
        <span>{label}</span>
        <span className="tabular-nums">
          {phase + 1}/{ONBOARDING_PHASES.length} 步
        </span>
      </div>
      <div className="mt-1.5 flex gap-1">
        {ONBOARDING_PHASES.map((name, index) => {
          const fill = index < phase ? 1 : index === phase ? Math.min(Math.max(phaseProgress, 0), 1) : 0;
          return (
            <span
              key={name}
              className="h-1 flex-1 overflow-hidden rounded-full"
              style={{ backgroundColor: isDark ? 'rgba(255, 255, 255, 0.28)' : '#E1DCEB' }}
            >
              <span
                className="block h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${fill * 100}%`, backgroundColor: isDark ? '#FFFFFF' : '#C83E26' }}
              />
            </span>
          );
        })}
      </div>
    </div>
  );
};
