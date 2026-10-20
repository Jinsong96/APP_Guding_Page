import React, { useState } from 'react';
import { RotateCw, Check, ArrowRight } from 'lucide-react';
import { CONTENT_DOMAINS, SEED_SETS, BubbleSeed, ContentCategory } from '../data';

interface ConstellationBubblePickerProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
}

export const ConstellationBubblePicker: React.FC<ConstellationBubblePickerProps> = ({
  selectedTags,
  onToggleTag,
  onConfirm
}) => {
  const [seedSetIndex, setSeedSetIndex] = useState(0);
  const currentSeeds = SEED_SETS[seedSetIndex];

  const getCategory = (catId: string): ContentCategory => {
    return CONTENT_DOMAINS.find((c) => c.id === catId) || CONTENT_DOMAINS[0];
  };

  const handleCycleSeeds = () => {
    setSeedSetIndex((prev) => (prev + 1) % SEED_SETS.length);
  };

  // Pre-grouped seeds matching the screenshot
  const row1 = currentSeeds.slice(0, 2);   // 2 bubbles
  const row2 = currentSeeds.slice(2, 5);   // 3 bubbles
  const row3 = currentSeeds.slice(5, 7);   // 2 bubbles
  const row4 = currentSeeds.slice(7, 10);  // 3 bubbles
  const row5 = currentSeeds.slice(10, 12); // 2 bubbles

  const canProceed = selectedTags.length >= 2 && selectedTags.length <= 4;

  return (
    <div className="w-full relative py-1 select-none">
      {/* Minimal Top Header - No box, just clean typography */}
      <div className="flex items-center justify-between pb-2 mb-2 px-1">
        <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase font-bold">
          DISCOVER
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCycleSeeds}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors py-0.5 px-2 rounded-full hover:bg-slate-800"
            title="换一批灵感气泡"
          >
            <RotateCw size={11} className="text-emerald-400" />
            <span>换一批</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400">
            {selectedTags.length}/4
          </span>
        </div>
      </div>

      {/* Constellation Field (Unboxed, floating directly on background) */}
      <div className="relative py-2 px-1 flex flex-col gap-3">
        {/* Subtle background constellation network paths */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 90 25 C 160 20, 200 45, 230 40"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            fill="none"
          />
          <path
            d="M 80 50 C 70 85, 120 90, 160 85"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            fill="none"
          />
          <path
            d="M 160 85 C 210 80, 240 85, 260 90"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            fill="none"
          />
          <path
            d="M 100 135 C 140 140, 170 135, 210 140"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            fill="none"
          />
          <path
            d="M 80 185 C 130 180, 160 190, 240 185"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            fill="none"
          />
          <path
            d="M 110 235 C 150 240, 180 235, 220 240"
            stroke="#94A3B8"
            strokeWidth="1.2"
            strokeDasharray="3 3"
            fill="none"
          />
        </svg>

        {/* Row 1: 2 Bubbles */}
        <div className="flex items-center justify-around gap-2 z-10 px-3">
          {row1.map((seed) => renderBubblePill(seed))}
        </div>

        {/* Row 2: 3 Bubbles */}
        <div className="flex items-center justify-between gap-1.5 z-10">
          {row2.map((seed) => renderBubblePill(seed))}
        </div>

        {/* Row 3: 2 Bubbles */}
        <div className="flex items-center justify-around gap-3 z-10 px-1">
          {row3.map((seed) => renderBubblePill(seed))}
        </div>

        {/* Row 4: 3 Bubbles */}
        <div className="flex items-center justify-between gap-1.5 z-10">
          {row4.map((seed) => renderBubblePill(seed))}
        </div>

        {/* Row 5: 2 Bubbles */}
        <div className="flex items-center justify-around gap-2 z-10 px-3">
          {row5.map((seed) => renderBubblePill(seed))}
        </div>
      </div>

      {/* Bottom Minimal Confirmation Button */}
      <div className="mt-4 pt-1">
        <button
          onClick={() => onConfirm(selectedTags)}
          disabled={!canProceed}
          className="w-full py-3 px-4 rounded-2xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: canProceed ? '#A3E635' : '#1E2330',
            color: canProceed ? '#0F172A' : '#64748B'
          }}
        >
          <span>
            {canProceed
              ? '确定这些方向，继续 →'
              : selectedTags.length === 0
              ? '请点选 2 ~ 4 个气泡'
              : `再选 ${2 - selectedTags.length} 个气泡`}
          </span>
          {canProceed && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );

  // Helper rendering each bubble pill (matching screenshot)
  function renderBubblePill(seed: BubbleSeed) {
    const isSelected = selectedTags.includes(seed.tag);
    const cat = getCategory(seed.categoryId);

    return (
      <button
        key={seed.tag}
        onClick={() => onToggleTag(seed.tag)}
        className={`px-3 py-2 rounded-full flex items-center gap-2 text-xs sm:text-[13px] font-medium transition-all duration-200 active:scale-95 ${
          isSelected
            ? 'ring-2 ring-white/90 shadow-md scale-105 font-bold'
            : 'hover:scale-[1.02]'
        }`}
        style={{
          backgroundColor: isSelected ? cat.color : cat.bgColor,
          borderColor: isSelected ? '#FFFFFF' : cat.borderColor,
          borderWidth: '1.5px',
          color: isSelected ? '#000000' : '#F1F5F9'
        }}
      >
        {/* Inner colored dot with outer ring */}
        <span
          className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: isSelected ? '#000000' : 'rgba(255,255,255,0.15)',
            borderColor: isSelected ? '#000000' : cat.dotColor
          }}
        >
          {isSelected ? (
            <Check size={9} className="text-white stroke-[3]" />
          ) : (
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: cat.dotColor }}
            />
          )}
        </span>

        {/* Tag text */}
        <span className="whitespace-nowrap">{seed.tag}</span>
      </button>
    );
  }
};
