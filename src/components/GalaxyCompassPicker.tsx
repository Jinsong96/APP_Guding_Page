import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Sparkles, ArrowRight, RotateCw, Check, Compass } from 'lucide-react';
import { CONTENT_DOMAINS, ContentCategory } from '../data';

interface GalaxyCompassPickerProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
  companionAccent?: string;
}

interface InfluxParticle {
  id: number;
  startX: number;
  startY: number;
  color: string;
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
  const [influxParticles, setInfluxParticles] = useState<InfluxParticle[]>([]);
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

  // Gravitational Influx Attraction Trigger
  const handleTagClick = (tag: string, event: React.MouseEvent<HTMLButtonElement>) => {
    const isAlreadySelected = selectedTags.includes(tag);
    
    if (!isAlreadySelected && containerRef.current) {
      // Create particle flying from bubble center to compass core
      const btnRect = event.currentTarget.getBoundingClientRect();
      const contRect = containerRef.current.getBoundingClientRect();
      const scaleX = contRect.width / (containerRef.current.offsetWidth || 1);
      const scaleY = contRect.height / (containerRef.current.offsetHeight || 1);
      const startX = (btnRect.left + btnRect.width / 2 - contRect.left) / (scaleX || 1);
      const startY = (btnRect.top + btnRect.height / 2 - contRect.top) / (scaleY || 1);

      const pId = Date.now() + Math.random();
      setInfluxParticles((prev) => [
        ...prev,
        { id: pId, startX, startY, color: currentDomain.color }
      ]);

      // Trigger core shockwave ripple after slight travel delay
      setTimeout(() => {
        setCoreRipple((r) => r + 1);
        setInfluxParticles((prev) => prev.filter((p) => p.id !== pId));
      }, 380);
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

      {/* Top HUD: Current Galaxy Info & Tag Shuffle */}
      <div className={`w-full flex items-center justify-between px-2 pt-1 pb-1 z-10 transition-all duration-500 ${
        animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: currentDomain.color }}
          />
          <span className="text-[12px] font-mono tracking-wider font-semibold text-slate-300 uppercase flex items-center gap-1.5">
            <span>{currentDomain.icon}</span>
            <span style={{ color: currentDomain.color }}>{currentDomain.name}星系</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffleTags}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors py-1 px-2.5 rounded-full bg-slate-800/60 hover:bg-slate-700/80 cursor-pointer"
            title="换一批该星系标签"
          >
            <RotateCw size={11} className="text-amber-400" />
            <span>换一批</span>
          </button>

          {selectedTags.length > 0 && (
            <div className="flex items-center gap-1 bg-slate-900/60 rounded-full px-2.5 py-0.5 text-[11px] font-mono">
              <span className="text-amber-400 font-bold">{selectedTags.length}</span>
              <span className="text-slate-400 text-[10px]">/10</span>
              <span className="text-slate-500">已吸纳</span>
            </div>
          )}
        </div>
      </div>

      {/* Floating Inspiration Bubbles without '#' prefix and without blur frames */}
      <div className="w-full z-20 py-2 px-1">
        {/* 6 Curated Floating Bubbles */}
        <div className="flex flex-wrap items-center justify-center gap-2 px-1">
          {visibleTags.map((tag, i) => {
            const isSelected = selectedTags.includes(tag);
            const isVisible = animStep >= 4;
            return (
              <button
                key={tag}
                onClick={(e) => handleTagClick(tag, e)}
                style={{
                  transitionDelay: animStep < 5 ? `${i * 60}ms` : '0ms',
                  borderColor: isSelected ? currentDomain.color : 'rgba(255, 255, 255, 0.12)',
                  backgroundColor: isSelected
                    ? currentDomain.color
                    : 'rgba(255, 255, 255, 0.05)',
                  color: isSelected ? '#0B0D13' : '#F1F5F9',
                  boxShadow: isSelected
                    ? `0 0 16px ${currentDomain.color}88, inset 0 0 8px ${currentDomain.color}66`
                    : 'none'
                }}
                className={`relative group px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 flex items-center gap-1.5 active:scale-95 border cursor-pointer ${
                  isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-2'
                } ${
                  isSelected ? 'font-bold scale-105' : 'hover:scale-102 hover:bg-white/10'
                }`}
              >
                {isSelected ? (
                  <Check size={12} className="stroke-[3]" />
                ) : (
                  <span
                    className="w-1.5 h-1.5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: currentDomain.color }}
                  />
                )}
                <span>{tag}</span>

                {/* Subtle gravity ping ring when selected */}
                {isSelected && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-30 pointer-events-none"
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
              backgroundColor: '#0B0D13'
            }}
          />
          <div
            className="w-0.5 h-3 shadow-md transition-colors duration-300"
            style={{ backgroundColor: currentDomain.color }}
          />
        </div>

        {/* Outer Orbital Disc / Compass SVG Ring */}
        <div
          ref={wheelRef}
          className={`relative w-[270px] h-[270px] flex items-center justify-center transition-all duration-700 ease-out ${
            animStep >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-85'
          }`}
        >
          {/* Static Concentric Grid & Cosmic Ticks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <circle cx="135" cy="135" r="130" stroke="#334155" strokeWidth="1" fill="none" strokeDasharray="3 4" />
            <circle cx="135" cy="135" r="95" stroke="#1E293B" strokeWidth="1" fill="none" />
            <circle cx="135" cy="135" r="60" stroke="#334155" strokeWidth="0.8" fill="none" strokeDasharray="2 3" />
            {/* Compass degree ticks */}
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i * 15 * Math.PI) / 180;
              const x1 = 135 + 124 * Math.cos(a);
              const y1 = 135 + 124 * Math.sin(a);
              const x2 = 135 + 130 * Math.cos(a);
              const y2 = 135 + 130 * Math.sin(a);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 6 === 0 ? '#64748B' : '#334155'}
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
            <div className="absolute inset-3 rounded-full border border-slate-700/60 shadow-inner" />

            {/* 6 Galaxy Nodes */}
            {domains.map((dom, idx) => {
              const nodeAngleDeg = idx * stepAngle;
              const nodeAngleRad = (nodeAngleDeg * Math.PI) / 180;
              const radius = 96; // distance from center
              const x = 135 + radius * Math.cos(nodeAngleRad);
              const y = 135 + radius * Math.sin(nodeAngleRad);
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
                    borderColor: isCurrent ? dom.color : 'rgba(51, 65, 85, 0.8)',
                    boxShadow: isCurrent
                      ? `0 0 16px ${dom.color}99, inset 0 0 8px ${dom.color}44`
                      : '0 2px 6px rgba(0,0,0,0.5)',
                    backgroundColor: '#0B0D13'
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex flex-col items-center justify-center transition-all duration-500 z-20 border-2 ${
                    animStep >= 3 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                  } ${
                    isCurrent ? 'scale-115 ring-2 ring-white/30' : 'hover:scale-105 opacity-80 hover:opacity-100'
                  }`}
                  title={`转动至${dom.name}星系`}
                >
                  {/* Keep icon counter-rotated so it stays upright */}
                  <span
                    className="text-base leading-none transition-transform duration-75"
                    style={{ transform: `rotate(${-rotationDeg}deg)` }}
                  >
                    {dom.icon}
                  </span>
                  <span
                    className="text-[9px] font-bold leading-none mt-0.5"
                    style={{
                      transform: `rotate(${-rotationDeg}deg)`,
                      color: isCurrent ? dom.color : '#94A3B8'
                    }}
                  >
                    {dom.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* CENTRAL GRAVITATIONAL SINGULARITY (星核 · Gravitational Core) */}
          <div className={`absolute z-20 flex flex-col items-center justify-center pointer-events-none transition-all duration-500 ${
            animStep >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          }`}>
            {/* Shockwave ripple when particle is absorbed */}
            {coreRipple > 0 && (
              <div
                key={coreRipple}
                className="absolute w-28 h-28 rounded-full border-2 border-white animate-ping opacity-60 pointer-events-none"
                style={{ borderColor: currentDomain.color }}
              />
            )}

            {/* Glowing Gravitational Singularity Core */}
            <div
              className="w-18 h-18 rounded-full flex flex-col items-center justify-center shadow-2xl relative transition-all duration-500 border"
              style={{
                backgroundColor: '#0B0D13',
                borderColor: currentDomain.color,
                boxShadow: `0 0 24px ${currentDomain.color}66, inset 0 0 12px ${currentDomain.color}44`
              }}
            >
              {/* Internal Pulsing Singularity Halo */}
              <div
                className="absolute inset-1.5 rounded-full opacity-40 animate-pulse"
                style={{ backgroundColor: currentDomain.color }}
              />

              {/* Orbiting miniature light beads for already absorbed tags */}
              {selectedTags.length > 0 && (
                <div className="absolute inset-0 w-full h-full animate-spin" style={{ animationDuration: '8s' }}>
                  {selectedTags.slice(0, 4).map((_, i) => {
                    const beadAngle = (i * (360 / Math.min(selectedTags.length, 4)) * Math.PI) / 180;
                    const bx = 36 + 28 * Math.cos(beadAngle);
                    const by = 36 + 28 * Math.sin(beadAngle);
                    return (
                      <span
                        key={i}
                        className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-sm"
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

              {/* Center Icon */}
              <Compass size={22} className="relative z-10 animate-spin" style={{ color: currentDomain.color, animationDuration: '24s' }} />
              <span className="text-[9px] font-mono tracking-tighter text-slate-300 font-bold relative z-10 mt-0.5">
                {selectedTags.length > 0 ? `${selectedTags.length} 粒子` : '星核'}
              </span>
            </div>
          </div>

          {/* SVG Influx Flying Particle Light Trails */}
          {influxParticles.map((p) => {
            const cx = 135;
            const cy = 135;
            return (
              <svg key={p.id} className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-visible">
                {/* Curved streaming arc trail */}
                <path
                  d={`M ${p.startX} ${p.startY} Q ${(p.startX + cx) / 2 + 20} ${(p.startY + cy) / 2 - 20} ${cx} ${cy}`}
                  fill="none"
                  stroke={p.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="animate-in fade-in duration-75"
                  strokeDasharray="12 4"
                />
                <circle cx={cx} cy={cy} r="4" fill="#FFFFFF" className="animate-ping" />
              </svg>
            );
          })}
        </div>

      </div>

      {/* Selected Tags Preview & Action Button */}
      <div className={`w-full px-2 pt-2 z-10 transition-all duration-500 ${
        animStep >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}>
        {selectedTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] text-slate-400 shrink-0 font-mono">已选:</span>
            {selectedTags.map((t) => (
              <span
                key={t}
                onClick={() => onToggleTag(t)}
                className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800/70 text-amber-300 shrink-0 cursor-pointer hover:bg-slate-700 transition-colors"
                title="点击移出"
              >
                <span>{t}</span>
                <span className="text-[10px] text-slate-400 hover:text-white">×</span>
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
            backgroundColor: companionAccent,
            color: '#0B0D13',
            boxShadow: `0 0 24px ${companionAccent}50, 0 4px 14px rgba(0,0,0,0.4)`
          }}
          className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:brightness-110 active:scale-[0.98] cursor-pointer"
        >
          <Sparkles size={15} />
          <span>{selectedTags.length > 0 ? `兴趣罗盘已就绪 (${selectedTags.length})` : '兴趣罗盘已就绪'}</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
