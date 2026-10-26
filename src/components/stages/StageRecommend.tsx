import React, { useRef, useState } from 'react';
import { ChevronLeft, Clock3, RefreshCw, Sprout, Telescope } from 'lucide-react';
import { Companion } from '../../types';
import { CompanionScene } from '../CompanionScene';
import { SceneSpeechBubble } from '../SceneSpeechBubble';
import { FirstReadArticle, rankArticlesForInterests } from '../../firstReadArticles';
import { TicketIssueIntro } from '../TicketIssueIntro';
import { CefrLevelKey } from './Stage02AiChat';

interface StageRecommendProps {
  companion: Companion;
  selectedThemes?: string[];
  // Starting level the first read will use, shown on the intro ticket.
  level: CefrLevelKey;
  onBack: () => void;
  onSelectArticle: (article: FirstReadArticle) => void;
}

const SERIF = '"Songti SC", "STSong", "Iowan Old Style", Georgia, serif';

const THEME_SHORT: Record<string, string> = {
  世界热点: '世界',
  科学探索: '科学',
  文化故事: '文化',
  商业观察: '商业',
  自我成长: '成长',
  趣味故事: '故事'
};

// Night-sky CTA: a few scattered star dots over a navy gradient.
const STARRY_BUTTON_BG = [
  'radial-gradient(1.2px 1.2px at 12% 30%, rgba(255,255,255,0.9), transparent)',
  'radial-gradient(1px 1px at 28% 72%, rgba(255,255,255,0.7), transparent)',
  'radial-gradient(1.4px 1.4px at 63% 24%, rgba(255,255,255,0.85), transparent)',
  'radial-gradient(1px 1px at 78% 66%, rgba(255,255,255,0.7), transparent)',
  'radial-gradient(1.2px 1.2px at 91% 38%, rgba(255,255,255,0.8), transparent)',
  'linear-gradient(90deg, #2A3479 0%, #1E2768 50%, #2E3B88 100%)'
].join(', ');

export const StageRecommend: React.FC<StageRecommendProps> = ({
  companion,
  selectedThemes = [],
  level,
  onBack,
  onSelectArticle
}) => {
  const articles = rankArticlesForInterests(selectedThemes);
  const [index, setIndex] = useState(0);
  // The ticket-printing intro plays each time the screen opens, then reveals the recommendation.
  const [showIntro, setShowIntro] = useState(true);
  const pointerStartX = useRef<number | null>(null);
  const article = articles[index];

  const matchedTheme = article.themes.find((theme) => selectedThemes.includes(theme));
  const displayTheme = matchedTheme || article.themes[0];
  const shortTheme = THEME_SHORT[displayTheme] || displayTheme;
  const bubbleText = matchedTheme
    ? `从你喜欢的${shortTheme}，\n开始这一程。`
    : `换个口味，\n读读${shortTheme}吧。`;

  const showArticle = (next: number) => setIndex((next + articles.length) % articles.length);

  // Horizontal swipe on the article area switches between recommendations.
  const handlePointerUp = (event: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const deltaX = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(deltaX) > 48) showArticle(index + (deltaX < 0 ? 1 : -1));
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#F7F6FB] text-[#1B2150]">
      <section className="relative h-[250px] shrink-0 overflow-hidden">
        <CompanionScene companion={companion} portraitPosition="left" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#141A3D]/55 to-transparent" />
        <header className="absolute inset-x-0 top-0 z-10 flex h-12 items-center justify-between px-3 text-white">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onBack}
              aria-label="返回上一步"
              className="flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <ChevronLeft size={26} strokeWidth={2} />
            </button>
            <span className="text-[20px] font-semibold drop-shadow" style={{ fontFamily: SERIF }}>
              一鹿知
            </span>
          </div>
          <span className="pr-1 text-[15px] font-medium drop-shadow">为你推荐</span>
        </header>
        <SceneSpeechBubble
          key={`bubble-${article.id}`}
          companion={companion}
          text={bubbleText}
          frameWidth={393}
          frameHeight={250}
          className="speech-content-enter"
        />
      </section>

      <div className="relative z-10 -mt-6 flex min-h-0 flex-1 flex-col">
        <svg
          aria-hidden="true"
          viewBox="0 0 393 26"
          preserveAspectRatio="none"
          className="block h-[26px] w-full shrink-0"
        >
          <path d="M0 26 L0 14 C 70 2, 150 0, 230 10 C 300 18, 350 16, 393 4 L393 26 Z" fill="#F7F6FB" />
        </svg>

        <div className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#F7F6FB] px-4 pb-2">
          <article
            key={article.id}
            className="animate-in fade-in duration-300"
            onPointerDown={(event) => {
              pointerStartX.current = event.clientX;
            }}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
          >
            <button
              type="button"
              onClick={() => onSelectArticle(article)}
              aria-label={`阅读 ${article.title}`}
              className="relative block w-full overflow-hidden rounded-[18px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479] focus-visible:ring-offset-2"
            >
              <img
                src={article.coverUrl}
                alt=""
                draggable={false}
                className="aspect-[2/1] w-full object-cover"
              />
              <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5" aria-hidden="true">
                {articles.map((item, dotIndex) => (
                  <span
                    key={item.id}
                    className="h-1.5 rounded-full transition-all"
                    style={{
                      width: dotIndex === index ? 14 : 6,
                      backgroundColor: dotIndex === index ? '#FFFFFF' : 'rgba(255,255,255,0.55)'
                    }}
                  />
                ))}
              </span>
            </button>

            <h1 className="mt-3 text-[30px] font-bold leading-[1.2] tracking-wide" style={{ fontFamily: SERIF }}>
              {article.chineseTitle}
            </h1>
            <p className="mt-0.5 text-[15px] text-[#2A2F55]" style={{ fontFamily: SERIF }}>
              {article.title}
            </p>

            <div className="mt-3 flex gap-2">
              <span className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#E4EEF6] px-3 text-[13px] font-medium text-[#27486B]">
                <Telescope size={15} />
                {displayTheme}
              </span>
              <span className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#E6F0E4] px-3 text-[13px] font-medium text-[#3D6140]">
                <Sprout size={15} />
                轻松起步
              </span>
              <span className="inline-flex h-[34px] items-center gap-1.5 rounded-full bg-[#ECEBF5] px-3 text-[13px] font-medium text-[#34385A]">
                <Clock3 size={15} />
                约{article.minutes}分钟
              </span>
            </div>

            <div className="mt-3 border-t border-[#E3E1EC] pt-2.5">
              <p className="text-[15px] text-[#2A2F55]">{article.hook}</p>
            </div>
          </article>
        </div>

        <footer className="shrink-0 bg-[#F7F6FB] px-4 pb-2 pt-2">
          <button
            type="button"
            onClick={() => onSelectArticle(article)}
            className="flex h-[50px] w-full items-center justify-center gap-2 rounded-full text-[17px] font-semibold tracking-wide text-white shadow-[0_8px_20px_rgba(30,39,104,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479] focus-visible:ring-offset-2"
            style={{ backgroundImage: STARRY_BUTTON_BG }}
          >
            <span>开始这一程</span>
          </button>
          <button
            type="button"
            onClick={() => showArticle(index + 1)}
            className="mt-2 flex h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#2A3479]/70 bg-transparent text-[15px] font-medium text-[#1B2150] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A3479]"
          >
            <RefreshCw size={16} />
            <span>换一篇看看</span>
          </button>
          <p className="mt-1.5 text-center text-[12px] text-[#8A8CA3]">阅读时可随时切换难度</p>
        </footer>
      </div>

      {showIntro && (
        <TicketIssueIntro
          companion={companion}
          article={article}
          themes={selectedThemes.length ? selectedThemes : [displayTheme]}
          level={level}
          onDone={() => setShowIntro(false)}
        />
      )}
    </div>
  );
};
