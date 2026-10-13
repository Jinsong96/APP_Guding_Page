import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Wifi, Battery, Signal, ZoomIn, ZoomOut, Maximize2, Smartphone } from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
}

// iPhone 15 Standard Viewport Dimensions (6.1-inch Super Retina XDR)
// Logical points: 393 × 852 pt (aspect ratio ~19.5:9)
const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const BEZEL_THICKNESS = 6; // Ultra-thin aerospace-grade aluminum/titanium perimeter
const BASE_WIDTH = SCREEN_WIDTH + BEZEL_THICKNESS * 2; // 405px
const BASE_HEIGHT = SCREEN_HEIGHT + BEZEL_THICKNESS * 2; // 864px

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ children }) => {
  // Stored scale or calculated default
  const [scale, setScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('ai-reader-phone-scale-v3');
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 0.55 && val <= 1.15) return val;
      }
    } catch {
      // ignore
    }
    // Default to 0.75 so the entire iPhone 15 (648px rendered) fits easily inside standard browser viewports without scrolling
    return 0.75;
  });

  const [isAutoFit, setIsAutoFit] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-fit calculator based on available window viewport height
  const calculateAutoFitScale = useCallback(() => {
    // Header is ~48px, scale bar ~32px, margins ~24px => available height ~ innerHeight - 110
    const availableHeight = typeof window !== 'undefined' ? window.innerHeight - 110 : 680;
    const availableWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 400;

    const scaleByHeight = availableHeight / BASE_HEIGHT;
    const scaleByWidth = availableWidth / BASE_WIDTH;
    const fitScale = Math.min(scaleByHeight, scaleByWidth, 1.0);

    // Clamp between 0.55 and 1.0, rounded to 2 decimals
    return Math.max(0.55, Math.min(1.0, Math.round(fitScale * 100) / 100));
  }, []);

  // Update scale on window resize if in auto-fit mode
  useEffect(() => {
    const handleResize = () => {
      if (isAutoFit) {
        setScale(calculateAutoFitScale());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isAutoFit, calculateAutoFitScale]);

  // Persist scale
  const applyScale = (newScale: number, auto = false) => {
    const clamped = Math.max(0.55, Math.min(1.10, Math.round(newScale * 100) / 100));
    setScale(clamped);
    setIsAutoFit(auto);
    try {
      localStorage.setItem('ai-reader-phone-scale-v3', clamped.toString());
    } catch {
      // ignore
    }
  };

  const handleZoomIn = () => {
    applyScale(scale + 0.05);
  };

  const handleZoomOut = () => {
    applyScale(scale - 0.05);
  };

  const handleAutoFit = () => {
    const fit = calculateAutoFitScale();
    applyScale(fit, true);
  };

  const scaledW = Math.round(BASE_WIDTH * scale);
  const scaledH = Math.round(BASE_HEIGHT * scale);

  return (
    <div ref={containerRef} className="relative flex flex-col items-center select-none py-0.5">
      {/* Sleek iPhone 15 Model & Scale Adjustment Bar */}
      <div className="mb-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/95 border border-slate-800 text-slate-300 shadow-xl backdrop-blur-md text-[11px] font-medium z-30">
        <div className="flex items-center gap-1 text-slate-400 mr-1 text-[11px] font-medium">
          <Smartphone size={12} className="text-amber-400" />
          <span className="font-semibold text-slate-200">iPhone 15</span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">(393×852)</span>
        </div>

        <span className="w-px h-3 bg-slate-800 mx-0.5" />

        {/* Quick Presets */}
        <button
          onClick={() => applyScale(0.75)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            !isAutoFit && Math.abs(scale - 0.75) < 0.02
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="75% 满屏免滚视图（推荐）"
        >
          75% <span className="text-[9px] opacity-80">(推荐)</span>
        </button>

        <button
          onClick={() => applyScale(0.80)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            !isAutoFit && Math.abs(scale - 0.80) < 0.02
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="80% 适中视图"
        >
          80%
        </button>

        <button
          onClick={() => applyScale(0.90)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            !isAutoFit && Math.abs(scale - 0.90) < 0.02
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="90% 放大视图"
        >
          90%
        </button>

        <button
          onClick={() => applyScale(1.0)}
          className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            !isAutoFit && Math.abs(scale - 1.0) < 0.02
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="100% 1:1 原机尺寸"
        >
          100%
        </button>

        <span className="w-px h-3 bg-slate-800 mx-0.5" />

        {/* Auto fit to window height */}
        <button
          onClick={handleAutoFit}
          className={`flex items-center gap-1 px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
            isAutoFit
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'hover:bg-slate-800 text-slate-400 hover:text-white'
          }`}
          title="根据当前窗口高度自动填充最佳尺寸"
        >
          <Maximize2 size={11} />
          <span>自适应</span>
        </button>

        <span className="w-px h-3 bg-slate-800 mx-0.5" />

        {/* Fine-tuning +/- */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={handleZoomOut}
            disabled={scale <= 0.55}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="缩小"
          >
            <ZoomOut size={12} />
          </button>
          <span className="font-mono text-[10px] text-slate-300 w-8 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={scale >= 1.10}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-40 transition-colors cursor-pointer"
            title="放大"
          >
            <ZoomIn size={12} />
          </button>
        </div>
      </div>

      {/* Scaled Wrapper Container with exact bounded dimensions */}
      <div
        className="relative transition-[width,height] duration-200 ease-out"
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`
        }}
      >
        {/* iPhone 15 Outer Hardware Shell (Contoured aerospace aluminum frame) */}
        <div
          style={{
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
          className="relative rounded-[50px] bg-[#1A1D27] p-[6px] shadow-[0_25px_70px_rgba(0,0,0,0.85)] border-[2.5px] border-[#363B4D] ring-1 ring-white/10 overflow-hidden flex flex-col"
        >
          {/* iPhone 15 Left buttons: Action button & Volume rocker */}
          <div className="absolute top-24 -left-[3px] w-[3px] h-7 bg-[#4E566F] rounded-l-xs" />
          <div className="absolute top-36 -left-[3px] w-[3px] h-12 bg-[#4E566F] rounded-l-xs" />
          <div className="absolute top-52 -left-[3px] w-[3px] h-12 bg-[#4E566F] rounded-l-xs" />

          {/* iPhone 15 Right button: Side power key */}
          <div className="absolute top-36 -right-[3px] w-[3px] h-16 bg-[#4E566F] rounded-r-xs" />

          {/* iPhone 15 Screen Display Viewport (Exact 393 × 852 px) */}
          <div className="relative w-[393px] h-[852px] rounded-[44px] bg-[#0B0D13] overflow-hidden flex flex-col shadow-inner">
            {/* iOS Top Status Bar with iPhone 15 Dynamic Island (灵动岛) */}
            <div className="h-11 px-7 pt-2 flex items-center justify-between text-slate-200 text-xs font-semibold z-40 select-none bg-[#0B0D13]/90 backdrop-blur-sm shrink-0">
              <span className="font-mono text-[13px] tracking-tight">9:41</span>
              
              {/* Precision iPhone 15 Dynamic Island */}
              <div className="w-[122px] h-[33px] bg-black rounded-full mx-auto -mt-1 flex items-center justify-between px-3 shadow-lg border border-white/10">
                {/* Front camera lens reflection */}
                <span className="w-2.5 h-2.5 rounded-full bg-[#181B26] ring-1 ring-white/10 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#0C101B]" />
                </span>
                {/* Microphone / Sensor indicator */}
                <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>

              <div className="flex items-center gap-1.5 text-slate-300">
                <Signal size={12} />
                <span className="font-mono text-[10px] text-slate-400 font-bold">5G</span>
                <Wifi size={12} />
                <Battery size={13} className="text-emerald-400" />
              </div>
            </div>

            {/* Screen Content Viewport */}
            <div className="flex-1 overflow-hidden relative">
              {children}
            </div>

            {/* Bottom Home Indicator Bar (iPhone 15 ergonomic safe area) */}
            <div className="h-6 bg-[#0B0D13] flex items-center justify-center shrink-0 z-40 select-none">
              <div className="w-36 h-1 bg-slate-500/60 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
