import React from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Companion, RideTicket } from '../types';
import { CompanionScene } from './CompanionScene';
import { RideTicketCard } from './RideTicketCard';

export interface ArrivalStat {
  value: string;
  label: string;
}

interface JourneyArrivalProps {
  companion: Companion;
  ticket: RideTicket;
  stats: ArrivalStat[];
  memoryLine?: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
  onBack: () => void;
}

const SERIF = '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif';
const PAGE_BG = '#F7F6FB';

// "旅程到站": the screen after any finished read. The learning line (what you read) and the
// companion line (the ticket and what the companion remembers) meet here.
export const JourneyArrival: React.FC<JourneyArrivalProps> = ({
  companion,
  ticket,
  stats,
  memoryLine,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
  onBack
}) => (
  <div className="flex h-full w-full select-none flex-col overflow-hidden text-[#1B2150]" style={{ backgroundColor: PAGE_BG }}>
    <header className="relative flex h-11 shrink-0 items-center justify-center px-3">
      <button
        type="button"
        onClick={onBack}
        aria-label="返回上一步"
        className="absolute left-2 flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
      >
        <ChevronLeft size={24} />
      </button>
      <h1 className="text-[16px] font-semibold">旅程到站</h1>
    </header>

    <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-3">
      <div className="relative h-[172px] shrink-0 overflow-hidden rounded-[20px] shadow-[0_8px_20px_rgba(35,48,94,0.12)]">
        <CompanionScene companion={companion} className="absolute inset-0 h-full w-full" />
        <div
          className="absolute inset-x-0 bottom-0 h-10"
          style={{ background: `linear-gradient(to bottom, transparent, ${PAGE_BG}66)` }}
        />
      </div>

      <h2 className="mt-3 text-center text-[25px] font-bold tracking-wide" style={{ fontFamily: SERIF }}>
        这一程，你们读完了。
      </h2>
      <p className="mt-0.5 text-center text-[13px] text-[#6C7090]">
        《{ticket.chineseTitle}》 · 第 {ticket.rideNumber} 程
      </p>
      {memoryLine && (
        <p className="mx-auto mt-2 rounded-full bg-[#EEEDF7] px-3 py-1 text-[12px] text-[#3B4170]">{memoryLine}</p>
      )}

      <div className="mt-3 grid shrink-0 grid-cols-3 divide-x divide-[#DCDDEB] rounded-2xl bg-[#EEF0F8] py-2.5">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center">
            <span className="text-[18px] font-bold leading-tight">{stat.value}</span>
            <span className="mt-0.5 text-[11px] text-[#6C7090]">{stat.label}</span>
          </div>
        ))}
      </div>

      <h3 className="mt-4 text-[13px] font-bold">本次纪念车票</h3>
      <RideTicketCard ticket={ticket} notchColor={PAGE_BG} className="mt-2 h-[132px] shrink-0" />
    </div>

    <footer className="shrink-0 px-4 pb-2 pt-2" style={{ backgroundColor: PAGE_BG }}>
      <button
        type="button"
        onClick={onPrimary}
        className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#23305E] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(30,39,104,0.25)] transition-colors hover:bg-[#1B2650] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479] focus-visible:ring-offset-2"
      >
        <span>{primaryLabel}</span>
        <ArrowRight size={18} />
      </button>
      {secondaryLabel && onSecondary && (
        <button
          type="button"
          onClick={onSecondary}
          className="mx-auto mt-1.5 flex items-center gap-0.5 px-2 py-1 text-[13px] font-medium text-[#3B4170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
        >
          {secondaryLabel}
          <ChevronRight size={15} />
        </button>
      )}
    </footer>
  </div>
);
