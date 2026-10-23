import React from 'react';
import { ArrowLeftRight, Bookmark, ChevronLeft, ChevronRight, MoreHorizontal, Ticket } from 'lucide-react';
import { Companion, RideTicket, SharedEvent } from '../../types';
import { CompanionScene } from '../CompanionScene';
import { RideTicketCard } from '../RideTicketCard';

interface StageCompanionHomeProps {
  companion: Companion;
  tickets: RideTicket[];
  events: SharedEvent[];
  favouriteTheme?: string;
  onBack: () => void;
  onContinue: () => void;
  onSwitchCompanion: () => void;
  onManageMemory: () => void;
}

const SERIF = '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif';
const PAGE_BG = '#F4F3FA';

// "我的旅伴": the companion's berth, the shared ticket book and the real moments you shared.
export const StageCompanionHome: React.FC<StageCompanionHomeProps> = ({
  companion,
  tickets,
  events,
  favouriteTheme,
  onBack,
  onContinue,
  onSwitchCompanion,
  onManageMemory
}) => {
  const newestFirst = [...tickets].sort((a, b) => b.rideNumber - a.rideNumber);
  const [frontTicket, ...olderTickets] = newestFirst;
  const timeline = [...events].reverse();

  return (
    <div className="flex h-full w-full select-none flex-col overflow-hidden text-[#1B2150]" style={{ backgroundColor: PAGE_BG }}>
      <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto pb-3">
        <section className="relative h-[230px] shrink-0">
          <CompanionScene companion={companion} className="absolute inset-0 h-full w-full" />
          <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#141A3D]/50 to-transparent" />
          <header className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between px-3 text-white">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onBack}
                aria-label="返回"
                className="flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft size={26} />
              </button>
              <h1 className="text-[20px] font-bold drop-shadow" style={{ fontFamily: SERIF }}>
                我的旅伴
              </h1>
            </div>
            <MoreHorizontal size={22} className="mr-1 drop-shadow" aria-hidden="true" />
          </header>
        </section>

        <div className="relative z-10 mx-4 -mt-8 flex shrink-0 items-center justify-between gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_8px_20px_rgba(35,48,94,0.10)]">
          <div className="min-w-0">
            <p className="text-[20px] font-bold leading-tight" style={{ fontFamily: SERIF }}>
              {companion.seat} {companion.name} {companion.nameEn}
            </p>
            <p className="mt-1.5 w-fit rounded-full bg-[#EEEDF7] px-2.5 py-1 text-[12px] text-[#3B4170]">
              {favouriteTheme ? `它开始记得，你喜欢${favouriteTheme}。` : '它安静地待在你的铺位旁。'}
            </p>
          </div>
          <button
            type="button"
            onClick={onSwitchCompanion}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#EEEDF7] px-3 py-2 text-[12px] font-medium text-[#2A3479] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
          >
            <ArrowLeftRight size={14} />
            更换旅伴
          </button>
        </div>

        <h2 className="mx-4 mt-5 text-[19px] font-bold" style={{ fontFamily: SERIF }}>
          我们的车票册
        </h2>
        {frontTicket ? (
          <div className="relative mx-4 mt-3 h-[142px] shrink-0">
            {olderTickets.slice(0, 2).map((ticket, index) => (
              <div
                key={ticket.id}
                aria-hidden="true"
                className="absolute top-1 h-[132px] w-[34%] overflow-hidden rounded-[14px] border border-[#E6E1EF] bg-[#FFFDF9] p-1.5 shadow-md"
                style={{ right: index * 22, transform: `rotate(${4 + index * 3}deg)`, zIndex: 2 - index }}
              >
                <img src={ticket.coverUrl} alt="" className="h-full w-full rounded-[10px] object-cover" draggable={false} />
              </div>
            ))}
            <RideTicketCard
              ticket={frontTicket}
              notchColor={PAGE_BG}
              className={`absolute left-0 top-0 z-10 h-[136px] ${olderTickets.length ? 'w-[86%]' : 'w-full'}`}
            />
          </div>
        ) : (
          <div className="mx-4 mt-3 flex h-[110px] shrink-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#D9D6E8] text-[13px] text-[#7A7D99]">
            <Ticket size={22} className="mb-1.5 text-[#A9A6C2]" />
            读完第一篇，就会得到第一张车票。
          </div>
        )}

        <section className="mx-4 mt-5 shrink-0 rounded-2xl bg-white px-4 py-3 shadow-[0_6px_16px_rgba(35,48,94,0.06)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold" style={{ fontFamily: SERIF }}>
              共同经历
            </h2>
            <button
              type="button"
              onClick={onManageMemory}
              className="flex items-center text-[12px] text-[#3B4170] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
            >
              管理共同记忆
              <ChevronRight size={14} />
            </button>
          </div>
          {timeline.length ? (
            <ol className="relative mt-2 space-y-3 border-l border-[#DCDDEB] pl-4">
              {timeline.map((event) => (
                <li key={event.id} className="relative flex gap-3">
                  <span className="absolute -left-[21px] top-5 h-2.5 w-2.5 rounded-full bg-[#8E92B8]" aria-hidden="true" />
                  <div className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-[#EEEDF7]">
                    {event.kind === 'ride' ? (
                      <img src={companion.portraitUrl} alt="" className="h-full w-full object-cover" draggable={false} />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[#5B5F8E]">
                        <Bookmark size={20} />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8A8CA3]">{event.date}</p>
                    <p className="text-[14px] font-bold leading-snug" style={{ fontFamily: SERIF }}>
                      {event.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#5B5F7E]">{event.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-[12px] text-[#7A7D99]">一起读完一篇、收藏一句话，都会留在这里。</p>
          )}
        </section>
      </div>

      <footer className="shrink-0 px-4 pb-2 pt-2" style={{ backgroundColor: PAGE_BG }}>
        <button
          type="button"
          onClick={onContinue}
          className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full bg-[#23305E] text-[16px] font-semibold text-white shadow-[0_8px_20px_rgba(30,39,104,0.25)] transition-colors hover:bg-[#1B2650] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479] focus-visible:ring-offset-2"
        >
          <span>和{companion.name}继续阅读</span>
        </button>
      </footer>
    </div>
  );
};
