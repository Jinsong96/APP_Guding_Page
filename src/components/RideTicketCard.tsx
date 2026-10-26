import React from 'react';
import { ArrowRight, CalendarDays, Tag } from 'lucide-react';
import { RideTicket } from '../types';

interface RideTicketCardProps {
  ticket: RideTicket;
  // Background behind the ticket, used to cut the side notches.
  notchColor?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const SERIF = '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif';

// A keepsake train ticket for one finished read (one "ride").
export const RideTicketCard: React.FC<RideTicketCardProps> = ({
  ticket,
  notchColor = '#F7F6FB',
  actionLabel,
  onAction,
  className = ''
}) => (
  <div
    className={`relative flex overflow-hidden rounded-[16px] border border-[#E6E1EF] bg-[#FFFDF9] shadow-[0_10px_24px_rgba(35,48,94,0.12)] ${className}`}
  >
    <div className="flex min-w-0 flex-1 flex-col py-3 pl-4 pr-2">
      <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] text-[#9A95AE]">
        <span>READPAL</span>
        <span className="text-[#C9C3D8]">·</span>
        <span className="tracking-normal">第 {ticket.rideNumber} 站</span>
      </div>
      <p className="mt-1.5 truncate text-[13px] italic text-[#2A2F55]" style={{ fontFamily: SERIF }}>
        {ticket.title}
      </p>
      <p className="truncate text-[17px] font-bold leading-snug text-[#1B2150]" style={{ fontFamily: SERIF }}>
        {ticket.chineseTitle}
      </p>
      <div className="mt-1.5 space-y-0.5 text-[12px] text-[#5B5F7E]">
        <p className="flex items-center gap-1.5">
          <CalendarDays size={13} className="shrink-0 text-[#8A8CA3]" />
          {ticket.date}
        </p>
        <p className="flex items-center gap-1.5">
          <Tag size={13} className="shrink-0 text-[#8A8CA3]" />
          {ticket.theme}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-[#EEEDF7] px-3 py-1 text-[12px] font-medium text-[#2A3479] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
        >
          {actionLabel}
          <ArrowRight size={13} />
        </button>
      )}
    </div>

    <div className="relative w-[44%] shrink-0 border-l-2 border-dashed border-[#E2DCEC] p-2">
      <img src={ticket.coverUrl} alt="" className="h-full w-full rounded-[10px] object-cover" draggable={false} />
    </div>

    <span
      aria-hidden="true"
      className="absolute left-[-9px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full border border-[#E6E1EF]"
      style={{ backgroundColor: notchColor }}
    />
    <span
      aria-hidden="true"
      className="absolute right-[-9px] top-1/2 h-[18px] w-[18px] -translate-y-1/2 rounded-full border border-[#E6E1EF]"
      style={{ backgroundColor: notchColor }}
    />
  </div>
);
