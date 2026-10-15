import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, ArrowRight, Check, Compass } from 'lucide-react';
import { CONTENT_DOMAINS, ContentCategory } from '../data';

interface GalaxyCompassPickerProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
  companionAccent?: string;
}

export const GalaxyCompassPicker: React.FC<GalaxyCompassPickerProps> = ({
  selectedTags,
  onToggleTag,
  onConfirm,
  companionAccent = '#F59E0B'
}) => {
  // Current rotation angle of the 360° compass (in degrees)
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activeDomainIndex, setActiveDomainIndex] = useState<number>(1); // default to 科学 (science)
  const [tagOffset, setTagOffset] = useState<number>(0);
  const [coreRipple, setCoreRipple] = useState<number>(0);

  // Progressive unfolding animation steps on mount:
  // 0: Initial hidden state
  // 1: Center core light sparks up (80ms)
  // 2: Disc & astrolabe rings expand into view (260ms)
  // 3: 6 domain planetary nodes pop in with staggered bounce (520ms)
  // 4: Inspiration tag bubbles blossom into view (780ms)
  // 5: Complete & fully interactive (1050ms)
  const [animStep, setAnimStep] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStep(1), 80);
    const t2 = setTimeout(() => setAnimStep(2), 260);
    const t3 = setTimeout(() => setAnimStep(3), 520);
    const t4 = setTimeout(() => setAnimStep(4), 780);
    const t5 = setTimeout(() => setAnimStep(5), 1050);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const compassCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startDragAngleRef = useRef<number>(0);
  const startRotationRef = useRef<number>(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // 6 domain nodes arranged at 60 degree intervals (0°, 60°, 120°, 180°, 240°, 300°)
  const domains = CONTENT_DOMAINS; // 6 domains
  const stepAngle = 360 / domains.length; // 60°

  // Current active domain based on activeDomainIndex
  const currentDomain = domains[activeDomainIndex] || domains[0];

  // Align activeDomainIndex whenever rotation settles or changes
  const updateActiveDomainFromRotation = useCallback((currentRot: number) => {
    // Top pointer is at -90 degrees (12 o'clock).
    // Domain i is at angle = i * 60 + currentRot.
    // We want domain i where (i * 60 + currentRot) % 360 ≈ 270 (or -90).
    // That means i * 60 ≈ 270 - currentRot = -90 - currentRot.
    const normalized = ((-currentRot - 90) % 360 + 360) % 360;
    const closestIdx = Math.round(normalized / stepAngle) % domains.length;
    setActiveDomainIndex(closestIdx);
  }, [domains.length, stepAngle]);

  // Rotate to specific domain on node tap
  const rotateToDomain = (idx: number) => {
    // Target: make domain idx land at 12 o'clock (-90°)
    // idx * 60 + rot = 270 (mod 360) => rot = 270 - idx * 60
    const targetBase = 270 - idx * stepAngle;
    // Find closest rotation equivalent to targetBase
    const currentBase = rotationDeg % 360;
    let diff = (targetBase - currentBase) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const newRot = rotationDeg + diff;
    setRotationDeg(newRot);
    setActiveDomainIndex(idx);
    setTagOffset(0);
  };

  // Pointer drag calculations for 360-degree rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    let cx = 0;
    let cy = 0;
    if (wheelRef.current) {
      const rect = wheelRef.current.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height / 2;
    } else if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      cx = rect.left + rect.width / 2;
      cy = rect.top + rect.height * 0.55;
    } else {
      return;
    }
    compassCenterRef.current = { x: cx, y: cy };

    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    startDragAngleRef.current = angleDeg;
    startRotationRef.current = rotationDeg;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const { x: cx, y: cy } = compassCenterRef.current;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angleRad = Math.atan2(dy, dx);
    const angleDeg = (angleRad * 180) / Math.PI;

    const delta = angleDeg - startDragAngleRef.current;
    const newRot = startRotationRef.current + delta;
    setRotationDeg(newRot);
    updateActiveDomainFromRotation(newRot);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    updateActiveDomainFromRotation(rotationDeg);
  };

  // Switch batch of tags within current galaxy
  const handleShuffleTags = () => {
    setTagOffset((prev) => (prev + 5) % currentDomain.tags.length);
  };

  // Active tags to display for current galaxy (6 tags displayed in orbital arc)
  const visibleTags = useMemo(() => {
    const all = currentDomain.tags;
    const sliceLen = 6;
    const result: string[] = [];
    for (let i = 0; i < sliceLen; i++) {
      const idx = (tagOffset + i) % all.length;
      result.push(all[idx]);
    }
    return result;
  }, [currentDomain, tagOffset]);

  // Tag Selection Trigger
  const handleTagClick = (tag: string) => {
    const isAlreadySelected = selectedTags.includes(tag);
    if (!isAlreadySelected) {
      setCoreRipple((r) => r + 1);
    }
    onToggleTag(tag);
  };

  const canProceed = selectedTags.length >= 1;

  return (
    <div
      ref={containerRef}
      className="w-full relative select-none flex flex-col items-center justify-between min-h-[430px] bg-transparent"
    >
      {/* Subtle pinpoint floating stardust particles without block glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-6 left-8 w-1 h-1 bg-white rounded-full animate-ping" />
        <div className="absolute top-20 right-10 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        <div className="absolute bottom-28 left-12 w-1 h-1 bg-amber-300 rounded-full animate-pulse" />
        <div className="absolute top-36 left-1/4 w-0.5 h-0.5 bg-white rounded-full" />
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-purple-300 rounded-full animate-pulse" />
      </div>

      {/* Top HUD: Current Galaxy Info */}
      <div className={`w-full flex items-center justify-between px-2 pt-1 pb-1 z-10 transition-all duration-500 ${
        animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: currentDomain.color }}
          />
          <span className="text-[15px] sm:text-[15.5px] font-mono tracking-wide font-bold text-stone-900 flex items-center gap-1.5">
            <span style={{ color: currentDomain.color }}>{currentDomain.name}领域</span>
          </span>
        </div>

        {selectedTags.length > 0 && (
          <div className="flex items-center gap-1 bg-white border border-[#E2D8C6] rounded-full px-2.5 py-1 text-[13px] font-mono shadow-xs">
            <span className="text-amber-600 font-bold">{selectedTags.length}</span>
            <span className="text-stone-400 text-[11px]">/10</span>
            <span className="text-stone-600">已选</span>
          </div>
        )}
      </div>

      {/* Floating Secondary Tags - 2 rows x 3 tags */}
      <div className="w-full z-20 py-2 px-1">
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm sm:max-w-md mx-auto">
          {visibleTags.map((tag, i) => {
            const isSelected = selectedTags.includes(tag);
            const isVisible = animStep >= 4;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                style={{
                  transitionDelay: animStep < 5 ? `${i * 50}ms` : '0ms',
                  borderColor: isSelected ? currentDomain.color : '#E2D8C6',
                  backgroundColor: isSelected ? currentDomain.color : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#1C1E24',
                  boxShadow: isSelected
                    ? `0 4px 14px ${currentDomain.color}50`
                    : '0 1px 3px rgba(0,0,0,0.04)'
                }}
                className={`relative group px-2 py-2 sm:py-2.5 rounded-full text-[13.5px] sm:text-[14.5px] font-medium tracking-normal transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 border cursor-pointer ${
                  isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-2'
                } ${
                  isSelected ? 'font-bold scale-102 shadow-sm' : 'hover:scale-102 hover:bg-[#FDFBF7]'
                }`}
              >
                {isSelected ? (
                  <Check size={13} className="stroke-[3] shrink-0" />
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity shrink-0"
                    style={{ backgroundColor: currentDomain.color }}
                  />
                )}
                <span className="truncate">{tag}</span>

                {/* Subtle gravity ping ring when selected */}
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none"
                    style={{ backgroundColor: currentDomain.color }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 360° ORBITAL GALAXY ASTROLABE COMPASS (Interactive Touch / Drag Area) */}
      <div
        className="relative w-full flex items-center justify-center my-3 touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Top Alignment Focus Reticle Pointer */}
        <div className={`absolute -top-3.5 z-30 flex flex-col items-center pointer-events-none transition-all duration-500 ${
          animStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          <div
            className="w-2.5 h-2.5 rotate-45 border-t-2 border-l-2 shadow-sm transition-colors duration-300"
            style={{
              borderColor: currentDomain.color,
              backgroundColor: '#FAF6ED'
            }}
          />
          <div
            className="w-0.5 h-3 shadow-md transition-colors duration-300"
            style={{ backgroundColor: currentDomain.color }}
          />
        </div>

        {/* Outer Orbital Disc / Compass SVG Ring (Enlarged to 300px) */}
        <div
          ref={wheelRef}
          className={`relative w-[300px] h-[300px] flex items-center justify-center transition-all duration-700 ease-out ${
            animStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-85'
          }`}
        >
          {/* Static Concentric Grid & Cosmic Ticks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-55">
            <circle cx="150" cy="150" r="145" stroke="#D5CBB9" strokeWidth="1" fill="none" strokeDasharray="3 4" />
            <circle cx="150" cy="150" r="105" stroke="#E2D8C6" strokeWidth="1" fill="none" />
            <circle cx="150" cy="150" r="68" stroke="#D5CBB9" strokeWidth="0.8" fill="none" strokeDasharray="2 3" />
            {/* Compass degree ticks */}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * 15 * Math.PI) / 180;
              const x1 = 150 + 138 * Math.cos(a);
              const y1 = 150 + 138 * Math.sin(a);
              const x2 = 150 + 145 * Math.cos(a);
              const y2 = 150 + 145 * Math.sin(a);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 6 === 0 ? '#9C8E79' : '#C5B9A5'}
                  strokeWidth={i % 6 === 0 ? '1.5' : '1'}
                />
              );
            })}
          </svg>

          {/* Rotating Celestial Dial with the 6 Domains */}
          <div
            className={`absolute inset-0 w-full h-full rounded-full transition-transform ${
              isDragging ? 'duration-75' : 'duration-500 ease-out'
            }`}
            style={{
              transform: `rotate(${rotationDeg}deg)`
            }}
          >
            {/* Compass Orbit Circle */}
            <div className="absolute inset-2 rounded-full border border-[#DCD2C1] shadow-xs" />

            {/* 6 Galaxy Nodes - without emoji, with larger font consistent with chat */}
            {domains.map((dom, idx) => {
              const nodeAngleDeg = idx * stepAngle;
              const nodeAngleRad = (nodeAngleDeg * Math.PI) / 180;
              const radius = 105; // distance from center (scaled for 300px disc)
              const x = 150 + radius * Math.cos(nodeAngleRad);
              const y = 150 + radius * Math.sin(nodeAngleRad);
              const isCurrent = idx === activeDomainIndex;

              return (
                <button
                  key={dom.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    rotateToDomain(idx);
                  }}
                  style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transitionDelay: animStep < 5 ? `${idx * 60}ms` : '0ms',
                    borderColor: isCurrent ? dom.color : '#D8CEBD',
                    boxShadow: isCurrent
                      ? `0 0 16px ${dom.color}88, inset 0 0 8px ${dom.color}22`
                      : '0 2px 6px rgba(0,0,0,0.06)',
                    backgroundColor: '#FFFFFF'
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-13 h-13 rounded-full flex flex-col items-center justify-center transition-all duration-500 z-20 border-2 cursor-pointer ${
                    animStep >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  } ${
                    isCurrent ? 'scale-115 ring-2 ring-amber-400/40' : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                  title={`转动至${dom.name}领域`}
                >
                  {/* Clean text without emoji, prominently sized and counter-rotated */}
                  <span
                    className="text-[15px] sm:text-[15.5px] font-bold leading-none tracking-wide text-center"
                    style={{
                      transform: `rotate(${-rotationDeg}deg)`,
                      color: isCurrent ? dom.color : '#374151'
                    }}
                  >
                    {dom.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CENTRAL CORE (换为“兴趣” · Centered Interest Singularity) */}
          <div className={`absolute z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${
            animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            {/* Shockwave ripple when particle is absorbed */}
            {coreRipple > 0 && (
              <div
                key={coreRipple}
                className="absolute w-32 h-32 rounded-full border-2 border-white animate-ping opacity-60 pointer-events-none"
                style={{ borderColor: currentDomain.color }}
              />
            )}

            {/* Glowing Singularity Core */}
            <div
              className="w-20 h-20 rounded-full flex flex-col items-center justify-center shadow-lg relative transition-all duration-500 border"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: currentDomain.color,
                boxShadow: `0 4px 20px ${currentDomain.color}35, inset 0 0 10px ${currentDomain.color}15`
              }}
            >
              {/* Internal Pulsing Halo */}
              <div
                className="absolute inset-1.5 rounded-full opacity-30 animate-pulse"
                style={{ backgroundColor: currentDomain.color }}
              />

              {/* Orbiting miniature light beads for already absorbed tags */}
              {selectedTags.length > 0 && (
                <div className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
                  {selectedTags.slice(0, 4).map((_, i) => {
                    const beadAngle = (i * (360 / Math.min(selectedTags.length, 4)) * Math.PI) / 180;
                    const bx = 40 + 32 * Math.cos(beadAngle);
                    const by = 40 + 32 * Math.sin(beadAngle);
                    return (
                      <span
                        key={i}
                        className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-xs"
                        style={{
                          left: `${bx}px`,
                          top: `${by}px`,
                          backgroundColor: companionAccent,
                          boxShadow: `0 0 6px ${companionAccent}`
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Center "兴趣" Label cleanly centered without any icon or emoji */}
              <span className="text-[16px] font-bold tracking-wider text-stone-800 relative z-10 select-none">
                兴趣
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tags Preview & Action Button */}
      <div className={`w-full px-2 pt-2 z-10 transition-all duration-500 ${
        animStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[13px] text-stone-600 shrink-0 font-medium">已选:</span>
            {selectedTags.map((t) => (
              <span
                key={t}
                onClick={() => onToggleTag(t)}
                className="inline-flex items-center gap-1.5 text-[14px] px-3 py-1 rounded-full bg-white border border-[#E2D8C6] text-amber-700 shrink-0 cursor-pointer hover:bg-[#F4ECE0] transition-colors shadow-xs font-medium"
                title="点击移出"
              >
                <span>{t}</span>
                <span className="text-[13px] text-stone-400 hover:text-stone-700">×</span>
              </span>
            ))}
          </div>
        )}

        {/* Departure Warp Action Button */}
        <button
          onClick={() => {
            if (selectedTags.length > 0) {
              onConfirm(selectedTags);
            } else {
              onConfirm(visibleTags.slice(0, 2));
            }
          }}
          style={{
            backgroundColor: companionAccent || '#D97706',
            color: '#FFFFFF',
            boxShadow: `0 6px 20px rgba(180, 100, 20, 0.25)`
          }}
          className="w-full mt-2.5 py-3.5 px-4 rounded-xl font-bold text-[16px] sm:text-[16.5px] flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-md"
        >
          <Sparkles size={17} />
          <span>{selectedTags.length > 0 ? `兴趣罗盘已就绪 (${selectedTags.length})` : '兴趣罗盘已就绪'}</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </div>
  );
};
