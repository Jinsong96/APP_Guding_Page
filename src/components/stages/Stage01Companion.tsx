import React from 'react';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { CompanionId } from '../../types';
import { COMPANIONS } from '../../data';

type CompanionStyle = '热闹一点' | '刚刚好' | '安静一点';

interface Stage01CompanionProps {
  selectedCompanionId: CompanionId;
  selectedStyle?: string;
  onSelectCompanion: (id: CompanionId) => void;
  onSelectStyle?: (style: CompanionStyle) => void;
  onBack?: () => void;
  onNext: () => void;
}

const COMPANION_STYLES: CompanionStyle[] = ['热闹一点', '刚刚好', '安静一点'];

const COMPANION_TAGLINES: Record<CompanionId, string> = {
  wick: '安静陪着你，慢慢读。',
  pal: '机灵探索，陪你发现新线索。',
  tuanzi: '安静在场，按自己的节奏陪你。'
};

const CARD_TAGLINES: Record<CompanionId, string> = {
  wick: '静默引路',
  pal: '机灵探索',
  tuanzi: '安静在场'
};

export const Stage01Companion: React.FC<Stage01CompanionProps> = ({
  selectedCompanionId,
  selectedStyle,
  onSelectCompanion,
  onSelectStyle,
  onBack,
  onNext
}) => {
  const selectedCompanion =
    COMPANIONS.find((companion) => companion.id === selectedCompanionId) || COMPANIONS[0];
  const activeStyle = COMPANION_STYLES.includes(selectedStyle as CompanionStyle)
    ? (selectedStyle as CompanionStyle)
    : '刚刚好';

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#fbfbfd] px-4 pb-1 pt-0 text-[#192b4d]">
      <header className="relative flex h-[38px] shrink-0 items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          aria-label="返回启动页"
          className="flex h-9 w-9 items-center justify-center text-[#172747] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83c2a]"
        >
          <ArrowLeft size={21} strokeWidth={1.8} />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 text-[14px] font-semibold">
          选择旅伴
        </span>
        <span className="pr-1 text-[13px] font-medium">1 / 2</span>
      </header>

      <section className="flex h-[67px] shrink-0 flex-col items-center justify-center text-center">
        <h1
          className="text-[23px] font-semibold leading-[1.2]"
          style={{ fontFamily: '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif' }}
        >
          这一程，想和谁同行？
        </h1>
        <p className="mt-1 text-[13px] text-[#344867]">学习功能相同，陪伴方式由你选择。</p>
      </section>

      <div className="-mx-4 aspect-[2/1] w-[calc(100%+2rem)] shrink-0 overflow-hidden bg-[#dbe1ea]">
        <img
          src={`${import.meta.env.BASE_URL}assets/companion-train-scene.png`}
          alt="夜行列车 B-01 卧铺包厢，灯芯在月色窗景前安静休息"
          className="h-full w-full object-fill"
        />
      </div>

      <section className="flex h-[52px] shrink-0 flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center gap-2">
          <h2
            className="text-[20px] font-semibold leading-tight"
            style={{ fontFamily: '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif' }}
          >
            {selectedCompanion.name}
          </h2>
          <span className="text-[14px] font-medium">{selectedCompanion.nameEn}</span>
        </div>
        <p className="mt-0.5 text-[13px] text-[#596b89]">
          {COMPANION_TAGLINES[selectedCompanion.id]}
        </p>
      </section>

      <div className="grid h-[167px] shrink-0 grid-cols-3 gap-2" role="group" aria-label="选择一位旅伴">
        {COMPANIONS.map((companion) => {
          const isSelected = companion.id === selectedCompanionId;

          return (
            <button
              key={companion.id}
              type="button"
              onClick={() => onSelectCompanion(companion.id)}
              aria-pressed={isSelected}
              className={`relative box-border flex h-[167px] min-h-[167px] max-h-[167px] min-w-0 flex-col items-center overflow-hidden rounded-[14px] border-2 px-[7px] pt-[7px] text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83c2a] ${
                isSelected
                  ? 'border-[#b43a27] bg-[#fffaf5]'
                  : 'border-[#d9deea] bg-white'
              }`}
            >
              {isSelected && (
                <span className="absolute right-[5px] top-[5px] z-10 flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#b43a27] text-white shadow-sm">
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                </span>
              )}
              <img
                src={
                  companion.id === 'wick'
                    ? `${import.meta.env.BASE_URL}assets/companion-train-scene.png`
                    : companion.avatarUrl
                }
                alt=""
                className={`h-[108px] w-full shrink-0 rounded-[11px] ${
                  companion.id === 'wick' ? 'object-cover object-center' : 'object-fill'
                }`}
              />
              <span className="mt-[6px] text-[14px] font-semibold leading-tight text-[#192b4d]">
                {companion.name}
              </span>
              <span className="mt-[5px] text-[11px] leading-none text-[#73809a]">
                {CARD_TAGLINES[companion.id]}
              </span>
            </button>
          );
        })}
      </div>

      <section className="shrink-0">
        <h3 className="mb-[7px] text-[14px] font-semibold">你喜欢怎样的陪伴？</h3>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="陪伴风格">
          {COMPANION_STYLES.map((style) => {
            const isActive = activeStyle === style;
            return (
              <button
                key={style}
                type="button"
                onClick={() => onSelectStyle?.(style)}
                aria-pressed={isActive}
                className={`h-[39px] rounded-full border px-2 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83c2a] ${
                  isActive
                    ? 'border-[#28576b] bg-[#28576b] text-white'
                    : 'border-[#d9dfeb] bg-[#eef0f6] text-[#273957]'
                }`}
              >
                {style}
              </button>
            );
          })}
        </div>
      </section>

      <div className="shrink-0 pt-2">
        <button
          type="button"
          onClick={onNext}
          className="flex h-[51px] w-full items-center justify-center gap-3 rounded-full bg-[#192b4d] px-4 text-[16px] font-semibold text-white transition-colors hover:bg-[#233b64] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b83c2a] focus-visible:ring-offset-2"
        >
          <span>和{selectedCompanion.name}一起出发</span>
          <ArrowRight size={20} aria-hidden="true" />
        </button>
        <p className="pb-1 pt-[7px] text-center text-[12px] text-[#8792a9]">
          以后可以更换，已有的共同经历会保留
        </p>
      </div>
    </div>
  );
};
