import React, { useState } from 'react';
import { BellRing, Check, ChevronLeft } from 'lucide-react';
import { Companion, CompanionId, ReadSummary, RideTicket } from '../types';
import { CompanionScene } from './CompanionScene';
import { CompanionAvatar } from './CompanionAvatar';
import { RideTicketCard } from './RideTicketCard';

export interface ArrivalStat {
  value: string;
  label: string;
}

// Middle stat: words the user looked up if any, otherwise how many English words they read.
export const readEffortStat = (summary?: ReadSummary): ArrivalStat =>
  summary && summary.lookedUpWords > 0
    ? { value: `${summary.lookedUpWords} 个`, label: '查过的单词' }
    : { value: `${summary?.wordsRead ?? 0} 个`, label: '读过的英文单词' };

export interface NextRide {
  title: string;
  chineseTitle: string;
  coverUrl: string;
  minutes: number;
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
  // Tomorrow's teased article: the reason to come back.
  nextRide?: NextRide;
}

const SERIF = '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif';
const PAGE_BG = '#F7F6FB';

const NEXT_RIDE_LINES: Record<CompanionId, (title: string) => string> = {
  wick: (title) => `明天，我在前面带你去读《${title}》。`,
  pal: (title) => `下一站的线索是《${title}》，明天一起去破解！`,
  tuanzi: (title) => `（团子把《${title}》轻轻推到你面前：明天读这个吧）`
};

// "Same time tomorrow", rounded up to the next half hour.
const reminderTimeLabel = () => {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  const rounded = Math.ceil(minutes / 30) * 30;
  const hour = Math.floor(rounded / 60) % 24;
  return `${String(hour).padStart(2, '0')}:${rounded % 60 === 0 ? '00' : '30'}`;
};

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
  onBack,
  nextRide
}) => {
  const [reminderSet, setReminderSet] = useState(false);
  const [reminderTime] = useState(reminderTimeLabel);

  return (
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

        {nextRide && (
          <section className="mt-4 shrink-0" aria-label="下一程">
            <h3 className="text-[13px] font-bold">下一程</h3>
            <div className="mt-2 rounded-2xl bg-white px-3.5 py-3 shadow-[0_6px_16px_rgba(35,48,94,0.06)]">
              <div className="flex items-start gap-2.5">
                <CompanionAvatar companion={companion} size={36} />
                <p className="relative mt-0.5 rounded-[12px] bg-[#F1F0F8] px-3 py-2 text-[13px] leading-[1.5] text-[#2A2F55]">
                  {NEXT_RIDE_LINES[companion.id](nextRide.chineseTitle)}
                </p>
              </div>
              <div className="mt-2.5 flex items-center gap-3 rounded-xl border border-[#ECEAF4] p-2">
                <img src={nextRide.coverUrl} alt="" className="h-11 w-16 shrink-0 rounded-lg object-cover" draggable={false} />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold" style={{ fontFamily: SERIF }}>
                    {nextRide.chineseTitle}
                  </p>
                  <p className="truncate text-[11px] text-[#6C7090]">
                    {nextRide.title} · 明天 · 约 {nextRide.minutes} 分钟
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-[#F0EEF6] pt-2.5">
                <span className="flex items-center gap-1.5 text-[12px] text-[#3B4170]">
                  <BellRing size={14} className="text-[#8E92B8]" />
                  明天 {reminderTime}，我在车厢等你
                </span>
                <button
                  type="button"
                  onClick={() => setReminderSet((value) => !value)}
                  aria-pressed={reminderSet}
                  className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479] ${
                    reminderSet ? 'bg-[#EEEDF7] text-[#2A3479]' : 'bg-[#23305E] text-white'
                  }`}
                >
                  {reminderSet && <Check size={13} />}
                  {reminderSet ? '已约好' : '好，提醒我'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <footer className="shrink-0 px-4 pb-2 pt-2" style={{ backgroundColor: PAGE_BG }}>
        <button
          type="button"
          onClick={onPrimary}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#23305E] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(30,39,104,0.25)] transition-colors hover:bg-[#1B2650] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479] focus-visible:ring-offset-2"
        >
          <span>{primaryLabel}</span>
        </button>
        {secondaryLabel && onSecondary && (
          <button
            type="button"
            onClick={onSecondary}
            className="mx-auto mt-1.5 flex items-center px-2 py-1 text-[13px] font-medium text-[#3B4170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
          >
            {secondaryLabel}
          </button>
        )}
      </footer>
    </div>
  );
};
