import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneSimulatorProps {
  children: React.ReactNode;
  darkChrome?: boolean;
}

// iPhone 15 Standard Viewport Dimensions (6.1-inch Super Retina XDR)
// Logical points: 393 × 852 pt (aspect ratio ~19.5:9)
const SCREEN_WIDTH = 393;
const SCREEN_HEIGHT = 852;
const BEZEL_THICKNESS = 6; // Ultra-thin aerospace-grade aluminum/titanium perimeter
const BASE_WIDTH = SCREEN_WIDTH + BEZEL_THICKNESS * 2; // 405px
const BASE_HEIGHT = SCREEN_HEIGHT + BEZEL_THICKNESS * 2; // 864px

// Vertical breathing room kept around the phone inside the page.
const PAGE_MARGIN = 24;

// Largest scale at which the whole phone fits the space below the page header.
const fitScale = () => {
  if (typeof window === 'undefined') return 0.75;
  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 96;
  const availableHeight = window.innerHeight - headerHeight - PAGE_MARGIN;
  const availableWidth = window.innerWidth - PAGE_MARGIN;
  const scale = Math.min(availableHeight / BASE_HEIGHT, availableWidth / BASE_WIDTH, 1);
  return Math.max(0.4, Math.floor(scale * 100) / 100);
};

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({ children, darkChrome = false }) => {
  // Always fits the browser window; recalculated whenever the window size changes.
  const [scale, setScale] = useState<number>(fitScale);

  useEffect(() => {
    const handleResize = () => setScale(fitScale());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scaledW = Math.round(BASE_WIDTH * scale);
  const scaledH = Math.round(BASE_HEIGHT * scale);

  return (
    <div className="relative flex flex-col items-center select-none py-0.5">
      {/* Scaled Wrapper Container with exact bounded dimensions */}
      <div
        className="relative transition-[width,height] duration-200 ease-out"
        style={{
          width: `${scaledW}px`,
          height: `${scaledH}px`
        }}
      >
        {/* iPhone 15 Outer Hardware Shell (Space Black Aerospace Titanium Frame) */}
        <div
          style={{
            width: `${BASE_WIDTH}px`,
            height: `${BASE_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformOrigin: 'top left'
          }}
          className="relative rounded-[50px] bg-[#16181F] p-[6px] shadow-[0_25px_70px_rgba(0,0,0,0.4)] border-[2.5px] border-[#2A2E39] ring-1 ring-black/40 overflow-hidden flex flex-col"
        >
          {/* iPhone 15 Left buttons: Action button & Volume rocker (Midnight Titanium) */}
          <div className="absolute top-24 -left-[3px] w-[3px] h-7 bg-[#2A2E39] rounded-l-xs" />
          <div className="absolute top-36 -left-[3px] w-[3px] h-12 bg-[#2A2E39] rounded-l-xs" />
          <div className="absolute top-52 -left-[3px] w-[3px] h-12 bg-[#2A2E39] rounded-l-xs" />

          {/* iPhone 15 Right button: Side power key */}
          <div className="absolute top-36 -right-[3px] w-[3px] h-16 bg-[#2A2E39] rounded-r-xs" />

          {/* iPhone 15 Screen Display Viewport (Warm Paper Ivory #F4F1FA) */}
          <div className="relative w-[393px] h-[852px] rounded-[44px] bg-[#F4F1FA] overflow-hidden flex flex-col shadow-inner border border-[#E7E1F0]">
            {/* iOS Top Status Bar with iPhone 15 Dynamic Island (灵动岛) */}
            <div className={`h-11 px-7 pt-2 flex items-center justify-between text-xs font-semibold z-40 select-none backdrop-blur-sm shrink-0 border-b ${
              darkChrome
                ? 'bg-[#101b35]/80 text-white border-white/10'
                : 'bg-[#F4F1FA]/95 text-stone-800 border-[#E7E1F0]/60'
            }`}>
              <span className={`font-mono text-[13px] tracking-tight font-bold ${darkChrome ? 'text-white' : 'text-stone-800'}`}>9:41</span>
              
              {/* Precision iPhone 15 Dynamic Island */}
              <div className="w-[122px] h-[33px] bg-[#000000] rounded-full mx-auto -mt-1 flex items-center justify-between px-3 shadow-md border border-white/10">
                {/* Front camera lens reflection */}
                <span className="w-2.5 h-2.5 rounded-full bg-[#1A1C22] ring-1 ring-white/10 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#0A0B0E]" />
                </span>
                {/* Microphone / Sensor indicator */}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className={`flex items-center gap-1.5 ${darkChrome ? 'text-white' : 'text-stone-700'}`}>
                <Wifi size={12} />
                <Battery size={13} className={darkChrome ? 'text-white' : 'text-emerald-600'} />
              </div>
            </div>

            {/* Screen Content Viewport (Warm Paper Ivory) */}
            <div className="flex-1 overflow-hidden relative bg-[#F4F1FA]">
              {children}
            </div>

            {/* Bottom Home Indicator Bar (iPhone 15 ergonomic safe area) */}
            <div className={`h-6 flex items-center justify-center shrink-0 z-40 select-none ${darkChrome ? 'bg-[#101b35]' : 'bg-[#F4F1FA]'}`}>
              <div className={`w-36 h-1 rounded-full ${darkChrome ? 'bg-white/75' : 'bg-stone-700/30'}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
