import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, ArrowRight, Check, Compass } from 'lucide-react';
import { CONTENT_DOMAINS, ContentCategory } from '../data';
import { StardustCanvas } from './StardustCanvas';

interface GalaxyCompassPickerProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
  companionAccent?: string;
  targetDomainIndex?: number | null;
  onDomainChange?: (domainIndex: number) => void;
}

export const GalaxyCompassPicker: React.FC<GalaxyCompassPickerProps> = ({
  selectedTags,
  onToggleTag,
  onConfirm,
  companionAccent = '#F59E0B',
  targetDomainIndex,
  onDomainChange
}) => {
  // Current rotation angle of the 360° astrolabe (in degrees)
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [activeDomainIndex, setActiveDomainIndex] = useState<number>(1); // default to 科学 (science)
  const [tagOffset, setTagOffset] = useState<number>(0);
  const [coreRipple, setCoreRipple] = useState<number>(0);
  const lastTargetDomainRef = useRef<number | null | undefined>(undefined);

  // Progressive unfolding animation steps on mount:
  const [animStep, setAnimStep] = useState<number>(0);

  useEffect(() => {
    const t1 = setTimeout(() => setAnimStep(1), 80);
    const t2 = setTimeout(() => setAnimStep(2), 240);
    const t3 = setTimeout(() => setAnimStep(3), 480);
    const t4 = setTimeout(() => setAnimStep(4), 720);
    const t5 = setTimeout(() => setAnimStep(5), 950);
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
  const domains = CONTENT_DOMAINS; // 6 domains, total 81 official tags
  const stepAngle = 360 / domains.length; // 60°

  // Current active domain based on activeDomainIndex
  const currentDomain = domains[activeDomainIndex] || domains[0];

  // Align activeDomainIndex whenever rotation settles or changes
  const updateActiveDomainFromRotation = useCallback((currentRot: number) => {
    const normalized = ((-currentRot - 90) % 360 + 360) % 360;
    const closestIdx = Math.round(normalized / stepAngle) % domains.length;
    setActiveDomainIndex((prevIdx) => {
      if (prevIdx !== closestIdx) {
        onDomainChange?.(closestIdx);
      }
      return closestIdx;
    });
  }, [domains.length, stepAngle, onDomainChange]);

  // Rotate to specific domain on node tap or AI auto-match
  const rotateToDomain = useCallback((idx: number, fromUserAction = false) => {
    const targetBase = 270 - idx * stepAngle;
    const currentBase = rotationDeg % 360;
    let diff = (targetBase - currentBase) % 360;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const newRot = rotationDeg + diff;
    setRotationDeg(newRot);
    setActiveDomainIndex(idx);
    setTagOffset(0);
    setCoreRipple((r) => r + 1);

    if (fromUserAction) {
      onDomainChange?.(idx);
    }
  }, [rotationDeg, stepAngle, onDomainChange]);

  // Respond to external AI intention auto-recognition targetDomainIndex
  useEffect(() => {
    if (
      targetDomainIndex !== undefined &&
      targetDomainIndex !== null &&
      targetDomainIndex !== lastTargetDomainRef.current
    ) {
      lastTargetDomainRef.current = targetDomainIndex;
      rotateToDomain(targetDomainIndex);
    } else if (targetDomainIndex === null || targetDomainIndex === undefined) {
      lastTargetDomainRef.current = targetDomainIndex;
    }
  }, [targetDomainIndex, rotateToDomain]);

  // Pointer drag calculations for 360-degree astrolabe rotation
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
    setDragPos({ x: e.clientX - cx + 145, y: e.clientY - cy + 145 });
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
    setDragPos({ x: dx + 145, y: dy + 145 });
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setDragPos(null);
    updateActiveDomainFromRotation(rotationDeg);
  };

  // Active tags to display for current domain (2 rows x 3 tags = 6 tags)
  const visibleTags = useMemo(() => {
    const all = currentDomain.tags;
    const selectedInDomain = all.filter((t) => selectedTags.includes(t));
    const unselectedInDomain = all.filter((t) => !selectedTags.includes(t));
    const ordered = [...selectedInDomain, ...unselectedInDomain];
    const sliceLen = 6;
    const result: string[] = [];
    for (let i = 0; i < Math.min(sliceLen, ordered.length); i++) {
      const idx = (tagOffset + i) % ordered.length;
      result.push(ordered[idx]);
    }
    return result;
  }, [currentDomain, tagOffset, selectedTags]);

  // Tag Selection Trigger
  const handleTagClick = (tag: string) => {
    const isAlreadySelected = selectedTags.includes(tag);
    if (!isAlreadySelected) {
      setCoreRipple((r) => r + 1);
    }
    onToggleTag(tag);
  };

  return (
    <div
      ref={containerRef}
      className="w-full relative select-none flex flex-col items-center justify-start bg-transparent font-sans"
    >
      {/* Subtle pinpoint floating stardust particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute top-6 left-8 w-1 h-1 bg-amber-200 rounded-full animate-ping" />
        <div className="absolute top-20 right-10 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
        <div className="absolute bottom-28 left-12 w-1 h-1 bg-amber-400 rounded-full animate-pulse" />
        <div className="absolute top-36 left-1/4 w-0.5 h-0.5 bg-white rounded-full" />
        <div className="absolute bottom-16 right-16 w-1 h-1 bg-purple-300 rounded-full animate-pulse" />
      </div>

      {/* Top HUD: Current Domain Header */}
      <div className={`w-full flex items-center justify-between px-2 pt-0 pb-1 z-10 transition-all duration-500 ${
        animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full shadow-xs"
            style={{ backgroundColor: currentDomain.color }}
          />
          <span className="text-[14.5px] sm:text-[15px] font-bold tracking-tight text-stone-900">
            {currentDomain.name}领域
          </span>
        </div>
      </div>

      {/* Top Content Tags (上方的内容标签): 2 rows x 3 tags */}
      <div className="w-full z-20 py-1 px-1">
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full max-w-sm sm:max-w-md mx-auto">
          {visibleTags.map((tag, i) => {
            const isSelected = selectedTags.includes(tag);
            const isVisible = animStep >= 4;
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                style={{
                  transitionDelay: animStep < 5 ? `${i * 45}ms` : '0ms',
                  borderColor: isSelected ? currentDomain.color : '#E2D8C6',
                  backgroundColor: isSelected ? currentDomain.color : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#1C1E24',
                  boxShadow: isSelected
                    ? `0 3px 12px ${currentDomain.color}45`
                    : '0 1px 3px rgba(0,0,0,0.04)'
                }}
                className={`relative group px-2 py-2 sm:py-2.5 rounded-xl text-[13px] sm:text-[13.5px] font-medium tracking-normal transition-all duration-300 flex items-center justify-center gap-1.5 active:scale-95 border cursor-pointer ${
                  isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-2'
                } ${
                  isSelected ? 'font-bold scale-102 shadow-xs' : 'hover:scale-102 hover:bg-[#FDFBF7]'
                }`}
              >
                {isSelected ? (
                  <Check size={12.5} className="stroke-[3] shrink-0" />
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
                    className="absolute inset-0 rounded-xl animate-ping opacity-25 pointer-events-none"
                    style={{ backgroundColor: currentDomain.color }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Left-bottom hint below content tag buttons */}
        <div className={`w-full max-w-sm sm:max-w-md mx-auto mt-2 mb-0.5 px-0.5 flex items-center justify-start transition-opacity duration-500 ${
          animStep >= 4 ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="text-[11px] sm:text-[11.5px] text-stone-500 font-medium tracking-wide">
            试试点击星盘
          </span>
        </div>
      </div>

      {/* 360° PRECISION ASTROLABE (星盘设计：细腻黄铜刻度光轨与星尘微光粒子流) */}
      <div
        className="relative w-full flex items-center justify-center my-1 sm:my-2 touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Top Alignment Focus Reticle Needle with Brass Shimmer */}
        <div className={`absolute -top-4 z-30 flex flex-col items-center pointer-events-none transition-all duration-500 ${
          animStep >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}>
          {/* Luminous beacon dot */}
          <div
            className="w-2 h-2 rounded-full mb-0.5 animate-pulse shadow-xs"
            style={{ backgroundColor: currentDomain.color, boxShadow: `0 0 8px ${currentDomain.color}` }}
          />
          {/* Brass Needle Arrow */}
          <div
            className="w-3 h-3 rotate-45 border-t-2 border-l-2 shadow-sm transition-colors duration-300"
            style={{
              borderColor: currentDomain.color,
              backgroundColor: '#FAF6ED'
            }}
          />
          <div
            className="w-1 h-3.5 shadow-md transition-colors duration-300 rounded-b-xs"
            style={{
              backgroundColor: currentDomain.color,
              boxShadow: `0 2px 6px ${currentDomain.color}66`
            }}
          />
        </div>

        {/* Astrolabe Wheel Container (290px x 290px) */}
        <div
          ref={wheelRef}
          className={`relative w-[290px] h-[290px] flex items-center justify-center transition-all duration-700 ease-out ${
            animStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-85'
          }`}
        >
          {/* Real-time Dynamic Stardust Particle Field (星尘微光粒子流) */}
          <StardustCanvas
            active={isDragging}
            intensity={isDragging ? 'vibrant' : 'gentle'}
            emitterPos={dragPos}
            className="absolute inset-0 z-10 pointer-events-none rounded-full overflow-hidden"
          />

          {/* Delicate Brass Graduation Rings & 48 Precision Astronomical Ticks (细腻黄铜刻度光轨) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="astrolabeBrassOuter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#DFD1B8" />
                <stop offset="35%" stopColor="#C4AA7A" />
                <stop offset="50%" stopColor="#F5E7CA" />
                <stop offset="75%" stopColor="#BA9D6B" />
                <stop offset="100%" stopColor="#DFD1B8" />
              </linearGradient>
              <linearGradient id="astrolabeBrassInner" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C4AA7A" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#EAD8B8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#B3935E" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Heavy outer brass bevel rim */}
            <circle cx="145" cy="145" r="141" stroke="url(#astrolabeBrassOuter)" strokeWidth="2.5" fill="none" opacity="0.9" />
            <circle cx="145" cy="145" r="138" stroke="#D1C3AB" strokeWidth="0.8" fill="none" opacity="0.6" />
            <circle cx="145" cy="145" r="130" stroke="url(#astrolabeBrassInner)" strokeWidth="1" fill="none" opacity="0.75" />

            {/* Constellation planetary orbit track */}
            <circle cx="145" cy="145" r="100" stroke="#E5DAC7" strokeWidth="1.2" fill="none" opacity="0.85" strokeDasharray="4 3" />
            
            {/* Inner focal core astrolabe rings */}
            <circle cx="145" cy="145" r="65" stroke="url(#astrolabeBrassOuter)" strokeWidth="1.2" fill="none" opacity="0.75" />
            <circle cx="145" cy="145" r="61" stroke="#D9CCA8" strokeWidth="0.6" fill="none" opacity="0.5" strokeDasharray="3 2" />

            {/* 48 Precision Brass Astronomical Degree Ticks */}
            {Array.from({ length: 48 }).map((_, i) => {
              const a = (i * 7.5 * Math.PI) / 180;
              const isMajor = i % 8 === 0; // Every 60 degrees (Domain alignments)
              const isMedium = i % 4 === 0 && !isMajor; // Every 30 degrees
              const tickLength = isMajor ? 10 : isMedium ? 6 : 3.5;
              const rInner = 140 - tickLength;
              const rOuter = 140;

              const x1 = 145 + rInner * Math.cos(a);
              const y1 = 145 + rInner * Math.sin(a);
              const x2 = 145 + rOuter * Math.cos(a);
              const y2 = 145 + rOuter * Math.sin(a);

              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isMajor ? '#A0804D' : isMedium ? '#BFA981' : '#D6C8B2'}
                  strokeWidth={isMajor ? '2' : isMedium ? '1.2' : '0.8'}
                  strokeLinecap="round"
                />
              );
            })}

            {/* 4 Cardinal Brass Diamonds (N, E, S, W) */}
            {[0, 90, 180, 270].map((deg) => {
              const a = (deg * Math.PI) / 180;
              const cx = 145 + 125 * Math.cos(a);
              const cy = 145 + 125 * Math.sin(a);
              return (
                <polygon
                  key={deg}
                  points={`${cx},${cy - 2.5} ${cx + 2.5},${cy} ${cx},${cy + 2.5} ${cx - 2.5},${cy}`}
                  fill="#B3935E"
                  opacity="0.8"
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
            {/* Astrolabe Orbit Circle Track */}
            <div className="absolute inset-2 rounded-full border border-[#DCD2C1] shadow-2xs" />

            {/* 6 Planetary Domain Nodes */}
            {domains.map((dom, idx) => {
              const nodeAngleDeg = idx * stepAngle;
              const nodeAngleRad = (nodeAngleDeg * Math.PI) / 180;
              const radius = 100; // distance from center
              const x = 145 + radius * Math.cos(nodeAngleRad);
              const y = 145 + radius * Math.sin(nodeAngleRad);
              const isCurrent = idx === activeDomainIndex;

              return (
                <button
                  key={dom.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    rotateToDomain(idx, true);
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
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-500 z-20 border-2 cursor-pointer ${
                    animStep >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  } ${
                    isCurrent ? 'scale-115 ring-2 ring-amber-400/40' : 'hover:scale-105 opacity-85 hover:opacity-100'
                  }`}
                  title={`转动至${dom.name}领域`}
                >
                  {/* Clean domain name counter-rotated so it always stays right-side up */}
                  <span
                    className={`text-[14px] sm:text-[14.5px] leading-none tracking-tight text-center ${
                      isCurrent ? 'font-black text-stone-900' : 'font-semibold text-stone-600'
                    }`}
                    style={{
                      transform: `rotate(${-rotationDeg}deg)`
                    }}
                  >
                    {dom.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Golden Astrolabe Core (星盘亮黄焦点核心：与萌宠星盘一致的明亮金黄) */}
          <div className={`absolute z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${
            animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            {/* Shockwave ripple when particle is absorbed */}
            {coreRipple > 0 && (
              <div
                key={coreRipple}
                className="absolute w-28 h-28 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none"
              />
            )}

            {/* Glowing Celestial Bright Yellow Core */}
            <div
              className="w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-lg relative transition-all duration-500 border-2"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #FFFBEB 0%, #FEF08A 35%, #FDE047 65%, #F59E0B 100%)',
                borderColor: '#F59E0B',
                boxShadow: '0 0 22px rgba(245, 158, 11, 0.55), 0 4px 12px rgba(217, 119, 6, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.9)'
              }}
            >
              {/* Internal Pulsing Bright Yellow Halo */}
              <div
                className="absolute inset-1 rounded-full opacity-35 animate-pulse bg-amber-300"
              />

              {/* Orbiting miniature light beads for absorbed tags */}
              {selectedTags.length > 0 && (
                <div className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '9s' }}>
                  {selectedTags.slice(0, 4).map((_, i) => {
                    const beadAngle = (i * (360 / Math.min(selectedTags.length, 4)) * Math.PI) / 180;
                    const bx = 32 + 25 * Math.cos(beadAngle);
                    const by = 32 + 25 * Math.sin(beadAngle);
                    return (
                      <span
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-xs"
                        style={{
                          left: `${bx}px`,
                          top: `${by}px`,
                          backgroundColor: '#B45309',
                          boxShadow: '0 0 6px #F59E0B'
                        }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Core Domain Indicator */}
              <span className="text-[13px] font-black tracking-tight text-amber-950 relative z-10 select-none font-mono">
                {currentDomain.name}
              </span>
              <span className="text-[8.5px] text-amber-900/80 font-bold font-mono -mt-0.5 relative z-10 select-none">
                星盘焦点
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Tags Preview Chips & Bright Yellow Confirm Action Button */}
      <div className={`w-full px-2 pt-1 z-10 transition-all duration-500 ${
        animStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs text-stone-600 shrink-0 font-medium">已选:</span>
            {selectedTags.map((t) => (
              <span
                key={t}
                onClick={() => onToggleTag(t)}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-white border border-[#E2D8C6] text-amber-800 shrink-0 cursor-pointer hover:bg-[#F4ECE0] transition-colors shadow-2xs font-medium"
                title="点击移出"
              >
                <span>{t}</span>
                <span className="text-stone-400 hover:text-stone-700 ml-0.5">×</span>
              </span>
            ))}
          </div>
        )}

        {/* Departure Warp Action Button in Bright Yellow */}
        <button
          onClick={() => {
            if (selectedTags.length > 0) {
              onConfirm(selectedTags);
            } else {
              onConfirm(visibleTags.slice(0, 2));
            }
          }}
          style={{
            background: 'linear-gradient(135deg, #FCD34D 0%, #F59E0B 50%, #D97706 100%)',
            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)'
          }}
          className="w-full mt-2 py-3.5 px-4 rounded-xl font-black text-stone-950 text-[15.5px] sm:text-[16px] flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-105 active:scale-[0.98] cursor-pointer shadow-md"
        >
          <Sparkles size={16} className="text-stone-950" />
          <span>{selectedTags.length > 0 ? `兴趣星盘已就绪 (${selectedTags.length})` : '兴趣星盘已就绪'}</span>
          <ArrowRight size={16} className="text-stone-950" />
        </button>
      </div>
    </div>
  );
};
