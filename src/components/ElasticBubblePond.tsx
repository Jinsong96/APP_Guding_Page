import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, Dices } from 'lucide-react';
import { CONTENT_DOMAINS, ContentCategory } from '../data';

interface ElasticBubblePondProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
  onConfirm: (tags: string[]) => void;
}

// 4 diverse batches crafted from the 81 tags library for rich variety
const CURATED_BATCHES: { tag: string; catId: string }[][] = [
  // Batch 0: Popular cross-domain mix
  [
    { tag: '人工智能', catId: 'science' },
    { tag: '商业故事', catId: 'business' },
    { tag: '全球热点', catId: 'world' },
    { tag: '短篇故事', catId: 'story' },
    { tag: '影视娱乐', catId: 'culture' },
    { tag: '高效思维', catId: 'growth' },
    { tag: '宇宙太空', catId: 'science' },
    { tag: '奇幻冒险', catId: 'story' },
    { tag: '心理探索', catId: 'science' }
  ],
  // Batch 1: Lifestyle & Society
  [
    { tag: '自然地理', catId: 'science' },
    { tag: '职场生存', catId: 'business' },
    { tag: '经典名著', catId: 'story' },
    { tag: '旅行故事', catId: 'culture' },
    { tag: '习惯养成', catId: 'growth' },
    { tag: '国际局势', catId: 'world' },
    { tag: '数码科技', catId: 'science' },
    { tag: '饮食文化', catId: 'culture' },
    { tag: '悬疑推理', catId: 'story' }
  ],
  // Batch 2: Growth & Insight
  [
    { tag: '前沿科技', catId: 'science' },
    { tag: '创业故事', catId: 'business' },
    { tag: '社会观察', catId: 'world' },
    { tag: '游戏世界', catId: 'culture' },
    { tag: '沟通表达', catId: 'growth' },
    { tag: '科幻故事', catId: 'story' },
    { tag: '情绪调节', catId: 'growth' },
    { tag: '品牌营销', catId: 'business' },
    { tag: '动物世界', catId: 'science' }
  ],
  // Batch 3: Culture & Humanity
  [
    { tag: '中国文化', catId: 'culture' },
    { tag: '环境环保', catId: 'world' },
    { tag: '投资理财', catId: 'business' },
    { tag: '教育观察', catId: 'growth' },
    { tag: '童话寓言', catId: 'story' },
    { tag: '科普冷知识', catId: 'science' },
    { tag: '艺术设计', catId: 'culture' },
    { tag: '人生思考', catId: 'growth' },
    { tag: '幽默喜剧', catId: 'story' }
  ]
];

export const ElasticBubblePond: React.FC<ElasticBubblePondProps> = ({
  selectedTags,
  onToggleTag,
  onConfirm
}) => {
  const [batchIndex, setBatchIndex] = useState(0);
  const [flickKey, setFlickKey] = useState(0);

  const currentDroplets = CURATED_BATCHES[batchIndex % CURATED_BATCHES.length];

  const getCategory = (catId: string): ContentCategory => {
    return CONTENT_DOMAINS.find((c) => c.id === catId) || CONTENT_DOMAINS[0];
  };

  const handleFlickNext = () => {
    setBatchIndex((prev) => (prev + 1) % CURATED_BATCHES.length);
    setFlickKey((k) => k + 1);
  };

  const handleRandomPickOne = () => {
    const unselected = currentDroplets.filter((d) => !selectedTags.includes(d.tag));
    const pick = unselected[Math.floor(Math.random() * unselected.length)] || currentDroplets[0];
    if (pick) {
      onToggleTag(pick.tag);
    }
  };

  const hasSelected = selectedTags.length >= 1;

  return (
    <div className="w-full relative py-1 select-none">
      {/* Top Controls Bar - Minimal, transparent, no card background */}
      <div className="flex items-center justify-between pb-2 mb-2 px-1">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-400" />
          <span>戳任意气泡，随心选 1~4 个：</span>
        </span>

        <div className="flex items-center gap-2">
          {/* Quick random pick */}
          <button
            onClick={handleRandomPickOne}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-300 transition-colors py-0.5 px-2 rounded-full hover:bg-slate-800"
            title="帮我随性挑一个"
          >
            <Dices size={12} />
            <span>随性挑</span>
          </button>

          {/* Flick / refresh button */}
          <button
            onClick={handleFlickNext}
            className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 transition-colors py-0.5 px-2.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 active:scale-95"
            title="轻弹换一批气泡"
          >
            <span>换一批 ✦</span>
          </button>
        </div>
      </div>

      {/* Floating Droplets Pond (Directly on canvas with organic float animations) */}
      <div
        key={flickKey}
        className="relative py-3 px-1 min-h-[220px] flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
      >
        {currentDroplets.map((item, idx) => {
          const isSelected = selectedTags.includes(item.tag);
          const cat = getCategory(item.catId);
          // Alternate float rhythm for organic swaying
          const floatClass = idx % 2 === 0 ? 'animate-droplet-1' : 'animate-droplet-2';

          return (
            <div
              key={item.tag}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={`animate-droplet-pop transition-transform ${floatClass}`}
            >
              <button
                onClick={() => onToggleTag(item.tag)}
                className={`group min-h-[44px] px-4 py-2 rounded-full flex items-center gap-2 text-[13px] sm:text-sm font-medium transition-all duration-300 active:scale-90 ${
                  isSelected
                    ? 'scale-105 font-bold shadow-lg ring-2 ring-white/90'
                    : 'hover:scale-105 hover:border-slate-500 shadow-sm'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.color : cat.bgColor,
                  borderColor: isSelected ? '#FFFFFF' : cat.borderColor,
                  borderWidth: '1.5px',
                  color: isSelected ? '#000000' : '#F8FAFC',
                  boxShadow: isSelected ? `0 6px 20px ${cat.bgColor}` : undefined
                }}
              >
                {/* Glowing pearl indicator */}
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 border transition-all"
                  style={{
                    backgroundColor: isSelected ? '#000000' : 'rgba(255,255,255,0.12)',
                    borderColor: isSelected ? '#000000' : cat.dotColor
                  }}
                >
                  {isSelected ? (
                    <Check size={10} className="text-white stroke-[3]" />
                  ) : (
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.dotColor }}
                    />
                  )}
                </span>

                {/* Tag label */}
                <span className="whitespace-nowrap tracking-wide">{item.tag}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Zero-Pressure Confirmation CTA (Enabled with just 1 tag!) */}
      <div className="mt-3 pt-1">
        <button
          onClick={() => onConfirm(selectedTags)}
          disabled={!hasSelected}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
            hasSelected
              ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 shadow-xl shadow-amber-500/20 hover:brightness-105'
              : 'bg-slate-800/60 text-slate-500 border border-slate-750 cursor-not-allowed opacity-60'
          }`}
        >
          <span>
            {hasSelected
              ? selectedTags.length === 1
                ? `就按【${selectedTags[0]}】出发 (选更多更懂你) →`
                : `就按这 ${selectedTags.length} 个方向出发 →`
              : '戳 1 个喜欢的气泡即可出发'}
          </span>
          {hasSelected && <ArrowRight size={15} />}
        </button>
      </div>
    </div>
  );
};
