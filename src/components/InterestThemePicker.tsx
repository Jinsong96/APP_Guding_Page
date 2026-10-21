import React, { useMemo, useRef, useState } from 'react';
import {
  Award,
  Atom,
  Book,
  BookMarked,
  BookOpen,
  Bot,
  Brain,
  BriefcaseBusiness,
  Building2,
  Bus,
  Camera,
  Check,
  Clapperboard,
  CloudSun,
  Compass,
  ChevronDown,
  CookingPot,
  Cpu,
  Crown,
  Dog,
  Dumbbell,
  Flower2,
  FlaskConical,
  Gamepad2,
  Globe2,
  GraduationCap,
  Guitar,
  HandCoins,
  HandHeart,
  Headphones,
  Heart,
  HeartPulse,
  House,
  Hourglass,
  Landmark,
  Languages,
  Leaf,
  Lightbulb,
  Monitor,
  Mountain,
  Music,
  Orbit,
  PawPrint,
  Plane,
  Plus,
  Popcorn,
  PartyPopper,
  Paintbrush,
  Puzzle,
  Scale,
  Search,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Sprout,
  Swords,
  Target,
  TreePine,
  Trophy,
  Users,
  Video,
  Shirt,
  ScrollText
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Companion } from '../types';

interface InterestTheme {
  name: string;
  icon: LucideIcon;
  categoryId?: string;
}

interface InterestThemePickerProps {
  companion: Companion;
  bubbleText: string;
  bubbleIsTyping: boolean;
  selectedTags: string[];
  customTopics: string[];
  priorityTopics: string[];
  onToggleTag: (tag: string) => void;
  onApplyCustomTopics: (topics: string[], newlyCreated: string[]) => void;
  onConfirm: (tags: string[]) => void;
}

const DOMAIN_ICONS: Record<string, LucideIcon> = {
  world: Globe2,
  science: FlaskConical,
  culture: Clapperboard,
  business: BriefcaseBusiness,
  growth: GraduationCap,
  story: BookOpen
};

const THEME_CATEGORIES = [
  {
    id: 'world',
    title: '世界热点',
    icon: Globe2,
    topics: ['全球新闻', '时事热点', '法律与公平', '气候环保']
  },
  {
    id: 'science',
    title: '前沿科学',
    icon: FlaskConical,
    topics: ['AI与新科技', '宇宙太空', '动物与自然', '人体与健康', '心理与行为', '气候与能源']
  },
  {
    id: 'culture',
    title: '文化娱乐',
    icon: Clapperboard,
    topics: ['影视明星', '音乐', '体育', '游戏', '动漫', '美食', '旅行', '萌宠', '时尚美妆', '历史故事', '中国文化与节日', '艺术设计']
  },
  {
    id: 'business',
    title: '商业与领导力',
    icon: BriefcaseBusiness,
    topics: ['人物传记', '职场生存', '理财与财经', '消费与品牌', '行业趋势', '名人演讲']
  },
  {
    id: 'growth',
    title: '个人成长',
    icon: GraduationCap,
    topics: ['学习方法', '情绪与心态', '人际沟通', '运动健身', '自律与习惯', '人生思考']
  },
  {
    id: 'story',
    title: '故事小说',
    icon: BookOpen,
    topics: ['悬疑推理', '科幻', '奇幻冒险', '经典名著', '短篇小说', '童话寓言']
  }
] as const;

const TOPIC_ICONS: Record<string, LucideIcon> = {
  全球新闻: Globe2,
  全球热点: Globe2,
  社会观察: Users,
  时事热点: Users,
  法律法规: Scale,
  法律与公平: Scale,
  公平权利: HandCoins,
  战争冲突: Swords,
  灾难救援: HeartPulse,
  城市出行: Bus,
  慈善公益: HandHeart,
  环境环保: TreePine,
  气候环保: TreePine,
  'AI与新科技': Bot,
  前沿科技: Atom,
  人工智能: Bot,
  宇宙太空: Orbit,
  动物与自然: PawPrint,
  人体与健康: HeartPulse,
  心理与行为: Brain,
  气候与能源: CloudSun,
  自然地理: Globe2,
  动物世界: PawPrint,
  人体奥秘: HeartPulse,
  心理探索: Brain,
  气候能源: CloudSun,
  农业科技: Sprout,
  科学史话: BookMarked,
  科普冷知识: Lightbulb,
  数码科技: Cpu,
  医学健康: HeartPulse,
  社会科学: Users,
  影视明星: Clapperboard,
  影视娱乐: Video,
  音乐: Guitar,
  体育: Trophy,
  体育竞技: Trophy,
  动漫: Puzzle,
  动漫二次元: Puzzle,
  游戏: Gamepad2,
  游戏世界: Gamepad2,
  时尚美妆: Shirt,
  美食: CookingPot,
  饮食文化: CookingPot,
  旅行: Plane,
  旅行故事: Plane,
  历史故事: ScrollText,
  节日民俗: PartyPopper,
  '中国文化与节日': Landmark,
  文化现象: Globe2,
  艺术设计: Paintbrush,
  语言文字: Languages,
  网络热梗: Smartphone,
  宠物生活: Dog,
  名人明星: Crown,
  萌宠: PawPrint,
  中国文化: Landmark,
  人物传记: Users,
  商业故事: BriefcaseBusiness,
  创业故事: Lightbulb,
  职场生存: Building2,
  团队管理: Users,
  财经观察: Landmark,
  理财与财经: Landmark,
  消费观察: ShoppingCart,
  '消费与品牌': ShoppingCart,
  投资理财: HandCoins,
  品牌营销: Target,
  行业趋势: Globe2,
  名人演讲: Video,
  职业探索: Compass,
  办公方式: Monitor,
  领导力: Award,
  企业文化: Building2,
  校园升学: GraduationCap,
  教育观察: BookOpen,
  学习方法: BookMarked,
  高效思维: Brain,
  自我驱动: Target,
  习惯养成: Hourglass,
  沟通表达: Headphones,
  人际沟通: Users,
  人际关系: Users,
  情绪与心态: Heart,
  情绪调节: Heart,
  运动健身: Dumbbell,
  自律与习惯: Hourglass,
  人物故事: Users,
  家庭亲子: House,
  人生思考: Brain,
  留学海外: Plane,
  发展创造: Puzzle,
  亲密关系: Heart,
  家居生活: House,
  短篇故事: BookOpen,
  短篇小说: BookOpen,
  经典名著: Book,
  科幻: Orbit,
  科幻故事: Orbit,
  悬疑推理: Brain,
  奇幻冒险: Mountain,
  成长励志: Trophy,
  童话寓言: Sparkles,
  幽默喜剧: Popcorn,
  诗歌散文: BookMarked,
  演讲名篇: Video
};

const normalizeTopic = (value: string) =>
  value.toLocaleLowerCase().replace(/[\s，。！？、,.!?;；:：'"“”‘’（）()【】\[\]·\-_/]/g, '');

const resolveThemeIcon = (name: string, fallback: LucideIcon): LucideIcon => {
  if (TOPIC_ICONS[name]) return TOPIC_ICONS[name];
  if (/滑雪|登山|徒步/.test(name)) return Mountain;
  if (/滑板|骑行|篮球|足球|网球|游泳|跑步/.test(name)) return Trophy;
  if (/时间|效率|习惯|日程|管理/.test(name)) return Hourglass;
  if (/考试|雅思|托福|gre|sat|升学|学习|教育|校园/.test(name.toLocaleLowerCase())) return GraduationCap;
  if (/目标|计划|职业|创业|领导|驱动/.test(name)) return Target;
  if (/自信|成就|竞技|体育|运动/.test(name)) return Trophy;
  if (/游戏|电竞|二次元/.test(name)) return Gamepad2;
  if (/人际|关系|社交|沟通|家庭|亲子/.test(name)) return Users;
  if (/电影|影视|电视|明星|演讲|戏剧/.test(name)) return Clapperboard;
  if (/媒体|数码|手机|网络|人工智能|科技/.test(name)) return Smartphone;
  if (/花|植物|自然|环保|气候|能源|农业/.test(name)) return Flower2;
  if (/科学|医学|健康|人体|实验|研究/.test(name)) return FlaskConical;
  if (/书|阅读|名著|故事|文学|诗歌/.test(name)) return BookOpen;
  if (/饮食|烹饪|美食|餐饮/.test(name)) return CookingPot;
  if (/音乐|歌曲|乐器/.test(name)) return Music;
  if (/动物|宠物/.test(name)) return PawPrint;
  if (/旅行|旅游|海外|国际|全球|世界|地理/.test(name)) return Plane;
  if (/摄影|照片|视觉/.test(name)) return Camera;
  if (/购物|消费|时尚|品牌|营销/.test(name)) return ShoppingCart;
  if (/家居|生活|城市|出行/.test(name)) return House;
  if (/法律|历史|文化|社会|政治|经济|财经/.test(name)) return Landmark;
  if (/语言|文字|表达|翻译/.test(name)) return Languages;
  if (/艺术|设计|创作/.test(name)) return Puzzle;
  if (/电影|流行|娱乐|综艺/.test(name)) return Popcorn;
  if (/心理|情绪|思维|人生/.test(name)) return Brain;
  if (/商业|职场|企业|团队|行业|办公/.test(name)) return Building2;
  if (/爱|公益|慈善|公平/.test(name)) return Heart;
  if (/书籍|写作|名篇/.test(name)) return Book;
  if (/运动|健身/.test(name)) return Dumbbell;
  return fallback;
};

const CUSTOM_FALLBACK_ICONS: LucideIcon[] = [Sparkles, Lightbulb, Compass, Orbit, Puzzle, BookOpen];

const getCustomThemeIcon = (name: string): LucideIcon => {
  const matchedIcon = resolveThemeIcon(name, Sparkles);
  if (matchedIcon !== Sparkles) return matchedIcon;
  const hash = Array.from(name).reduce((value, char) => value + char.charCodeAt(0), 0);
  return CUSTOM_FALLBACK_ICONS[hash % CUSTOM_FALLBACK_ICONS.length];
};

export const InterestThemePicker: React.FC<InterestThemePickerProps> = ({
  companion,
  bubbleText,
  bubbleIsTyping,
  selectedTags,
  customTopics,
  priorityTopics,
  onToggleTag,
  onApplyCustomTopics,
  onConfirm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string>(THEME_CATEGORIES[0].id);
  const [showMoreTopics, setShowMoreTopics] = useState(false);
  const topicScrollRef = useRef<HTMLDivElement>(null);

  const officialTopics = useMemo(
    () =>
      THEME_CATEGORIES.flatMap((category) =>
        category.topics.map((name) => ({
          name,
          icon: resolveThemeIcon(name, DOMAIN_ICONS[category.id] || Sparkles),
          categoryId: category.id
        }))
      ),
    []
  );

  const themes = useMemo(() => {
    const officialByName = new Map<string, InterestTheme>(officialTopics.map((topic) => [topic.name, topic]));
    const customByName = new Map<string, InterestTheme>(
      customTopics.map((name) => [
        name,
        { name, icon: getCustomThemeIcon(name) }
      ])
    );
    const prioritized = priorityTopics
      .map((name) => customByName.get(name) || officialByName.get(name))
      .filter((topic): topic is InterestTheme => Boolean(topic));
    const ordered = [...prioritized, ...customTopics.map((name) => customByName.get(name)!) , ...officialTopics];
    return ordered.filter((topic, index) => ordered.findIndex((candidate) => candidate.name === topic.name) === index);
  }, [customTopics, officialTopics, priorityTopics]);

  const normalizedQuery = normalizeTopic(searchQuery.trim());
  const matchingThemes = useMemo(() => {
    if (!normalizedQuery) return [];
    return themes
      .map((theme, index) => ({ theme, index, normalizedName: normalizeTopic(theme.name) }))
      .filter(
        ({ normalizedName }) =>
          normalizedName === normalizedQuery ||
          normalizedName.includes(normalizedQuery) ||
          (normalizedQuery.length >= 2 && normalizedQuery.includes(normalizedName))
      )
      .sort((a, b) => {
        const aExact = a.normalizedName === normalizedQuery;
        const bExact = b.normalizedName === normalizedQuery;
        if (aExact !== bExact) return aExact ? -1 : 1;
        const aPrefix = a.normalizedName.startsWith(normalizedQuery);
        const bPrefix = b.normalizedName.startsWith(normalizedQuery);
        if (aPrefix !== bPrefix) return aPrefix ? -1 : 1;
        return a.index - b.index;
      })
      .map(({ theme }) => theme);
  }, [normalizedQuery, themes]);
  const canCreateTopic = Boolean(searchQuery.trim()) && matchingThemes.length === 0;
  const customThemes = [
    ...priorityTopics.filter((name) => customTopics.includes(name)),
    ...customTopics.filter((name) => !priorityTopics.includes(name))
  ].map((name) => ({
    name,
    icon: getCustomThemeIcon(name)
  }));
  const categories = [
    ...THEME_CATEGORIES.map((category) => ({
      id: category.id,
      title: category.title,
      icon: category.icon,
      topics: officialTopics.filter((topic) => topic.categoryId === category.id)
    })),
    ...(customThemes.length > 0
      ? [{ id: 'custom', title: '自定义主题', icon: Sparkles, topics: customThemes }]
      : [])
  ];
  const primaryCategories = categories.filter((category) => category.id !== 'custom');
  const customCategory = categories.find((category) => category.id === 'custom');
  const activeCategory = categories.find((category) => category.id === activeCategoryId) || categories[0];
  const activeTopics = activeCategory?.topics || [];
  const coreTopics = activeTopics.slice(0, 6);
  const additionalTopics = activeTopics.slice(6);
  const contentReady = !bubbleIsTyping && bubbleText === '选择你感兴趣的主题';

  const handleCreateTopic = () => {
    const topicName = Array.from(searchQuery.trim()).slice(0, 24).join('');
    if (!topicName || selectedTags.includes(topicName) || selectedTags.length >= 10) return;
    onApplyCustomTopics([topicName], [topicName]);
    setSearchQuery(topicName);
  };

  const handleSwitchCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setShowMoreTopics(false);
    if (topicScrollRef.current) topicScrollRef.current.scrollTop = 0;
  };

  const selectedCountForCategory = (categoryId: string) => {
    const names =
      categoryId === 'custom'
        ? customTopics
        : officialTopics.filter((topic) => topic.categoryId === categoryId).map((topic) => topic.name);
    return names.filter((name) => selectedTags.includes(name)).length;
  };

  const renderTopicCard = ({ name }: InterestTheme) => {
    const isSelected = selectedTags.includes(name);
    return (
      <button
        key={name}
        type="button"
        aria-pressed={isSelected}
        onClick={() => onToggleTag(name)}
        disabled={!isSelected && selectedTags.length >= 10}
        className={`flex min-h-[62px] min-w-0 items-center justify-between gap-3 rounded-[14px] border px-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45 ${
          isSelected
            ? 'border-[#AFC6B8] bg-[#DCE9E1] text-[#283C32]'
            : 'border-[#E0E8E3] bg-white text-[#2D3933] hover:border-[#B8CBBF]'
        }`}
      >
        <span className="min-w-0 break-words text-[14px] font-semibold leading-5">{name}</span>
        <span className={`flex h-5 w-5 shrink-0 items-center justify-center ${isSelected ? 'text-[#486A5B]' : 'text-[#83938A]'}`}>
          {isSelected ? <Check size={17} strokeWidth={2} /> : <Plus size={16} strokeWidth={1.7} />}
        </span>
      </button>
    );
  };

  const footer = (
    <div className="z-10 shrink-0 border-t border-[#DCE7E0] bg-[#F0F8F4] px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
      <button
        type="button"
        onClick={() => onConfirm(selectedTags)}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-[#526F65] px-3 text-[15px] font-semibold text-white transition-colors hover:bg-[#456257] active:bg-[#3D574D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F0F8F4]"
      >
        继续
      </button>
    </div>
  );

  return (
    <div className="flex h-full min-h-0 w-full flex-col bg-[#F0F8F4] text-[#27352F]">
      <div className="flex shrink-0 items-start gap-3 px-4 pb-3 pt-2">
        <img
          src={companion.avatarUrl}
          alt={companion.name}
          className="mt-0.5 h-[52px] w-[52px] shrink-0 object-contain"
        />
        <div className="relative min-h-[52px] w-fit max-w-[calc(100%_-_64px)] flex-none rounded-2xl border border-[#D7E4DC] bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(45,68,55,0.05)]">
          <span
            className="absolute top-4 -left-2.5 z-10 h-0 w-0 border-y-[7px] border-y-transparent border-r-[10px] border-r-white"
            aria-hidden="true"
          />
          <span
            className="absolute top-[13px] -left-3.5 h-0 w-0 border-y-[8px] border-y-transparent border-r-[12px] border-r-[#D7E4DC]"
            aria-hidden="true"
          />
          <p className="relative min-w-0 break-words text-[15px] font-semibold leading-6 text-[#2D3933]">
            {bubbleText}
            {bubbleIsTyping && (
              <span
                className="ml-1 inline-block h-4 w-[2px] translate-y-[2px] animate-pulse bg-[#526F65] motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
          </p>
        </div>
      </div>

      <div
        className={`flex min-h-0 flex-1 flex-col ${
          contentReady
            ? 'speech-content-enter'
            : 'hidden'
        }`}
      >
      <div className="shrink-0 px-4 pb-3">
        <div className="mb-2 flex items-end justify-between gap-3">
          <h1 className="text-[18px] font-bold leading-6 text-[#29362F]">{activeCategory?.title}</h1>
          <span className="text-[12px] text-[#718078]" aria-live="polite">
            已选 {selectedTags.length}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="切换兴趣方向">
          {primaryCategories.map((category) => {
            const isActive = category.id === activeCategoryId;
            const selectedCount = selectedCountForCategory(category.id);
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={isActive}
                onClick={() => handleSwitchCategory(category.id)}
                className={`flex min-h-11 min-w-0 items-center justify-between gap-1.5 rounded-[11px] border px-2.5 text-left text-[12px] leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-1 ${
                  isActive
                    ? 'border-[#779687] bg-[#DCE9E1] font-semibold text-[#2D4539]'
                    : 'border-[#DCE5DF] bg-white/55 text-[#66766D] hover:bg-white'
                }`}
              >
                <span className="min-w-0 break-words">{category.title}</span>
                {selectedCount > 0 && (
                  <span className="shrink-0 text-[11px] tabular-nums" aria-label={`已选 ${selectedCount} 个`}>
                    {selectedCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {customCategory && (
          <button
            type="button"
            aria-pressed={activeCategoryId === customCategory.id}
            onClick={() => handleSwitchCategory(customCategory.id)}
            className={`mt-2 flex min-h-11 w-full items-center gap-2 rounded-[11px] border px-3 text-left text-[12px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-1 ${
              activeCategoryId === customCategory.id
                ? 'border-[#779687] bg-[#DCE9E1] text-[#2D4539]'
                : 'border-dashed border-[#C8D7CE] bg-white/45 text-[#66766D] hover:bg-white'
            }`}
          >
            <Sparkles size={15} aria-hidden="true" />
            <span>{customCategory.title}</span>
            <span className="ml-auto text-[11px] tabular-nums">
              {selectedCountForCategory(customCategory.id)}
            </span>
          </button>
        )}
        <label className="relative mt-3 block">
          <span className="sr-only">搜索主题或关键词</span>
          <Search
            size={18}
            strokeWidth={1.8}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#74847B]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            maxLength={80}
            placeholder="搜索或添加感兴趣的主题"
            className="h-11 w-full rounded-xl border border-[#D8E4DC] bg-white pl-10 pr-4 text-[14px] text-[#27352F] outline-none placeholder:text-[#849189] focus:border-[#8EA99B] focus:ring-2 focus:ring-[#8EA99B]/20"
          />
        </label>
      </div>

      <div
        ref={topicScrollRef}
        className="no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-4 pt-1"
        aria-label={`${activeCategory?.title}主题`}
      >
        {normalizedQuery ? (
          <section aria-labelledby="topic-search-results-title">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 id="topic-search-results-title" className="text-[13px] font-semibold text-[#56675D]">
                搜索结果
              </h2>
              <span className="text-[11px] text-[#7B8981]">{matchingThemes.length} 个匹配</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="搜索匹配的主题">
              {matchingThemes.map(renderTopicCard)}
              {canCreateTopic && (
                <button
                  key="create-topic"
                  type="button"
                  onClick={handleCreateTopic}
                  disabled={selectedTags.length >= 10}
                  className="flex min-h-[62px] min-w-0 items-center justify-between gap-3 rounded-[14px] border border-dashed border-[#AFC6B8] bg-[#E7F0EA] px-3.5 text-left text-[#2D3933] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
                  aria-label={`创建自定义主题：${searchQuery.trim()}`}
                >
                  <span className="min-w-0 break-words text-[14px] font-semibold leading-5">
                    {Array.from(searchQuery.trim()).slice(0, 24).join('')}
                  </span>
                  <Plus size={17} className="shrink-0 text-[#526F65]" aria-hidden="true" />
                </button>
              )}
            </div>
          </section>
        ) : (
          <>
            <section aria-labelledby="core-topics-heading">
              <div className="mb-2.5 flex items-center justify-between">
                <h2 id="core-topics-heading" className="text-[13px] font-semibold text-[#56675D]">选择主题</h2>
                <span className="text-[11px] text-[#7B8981]">{activeTopics.length} 个</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5" role="group" aria-label="兴趣主题">
                {coreTopics.map(renderTopicCard)}
              </div>
            </section>

            {additionalTopics.length > 0 && (
              <section className="mt-3" aria-label="更多主题">
                <button
                  type="button"
                  aria-expanded={showMoreTopics}
                  onClick={() => setShowMoreTopics((value) => !value)}
                  className="flex min-h-[48px] w-full items-center justify-between rounded-[14px] border border-[#DCE5DF] bg-white px-3.5 text-left text-[13px] font-semibold text-[#35443B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#526F65] focus-visible:ring-offset-2"
                >
                  <span>更多{activeCategory?.title === '故事小说' ? '故事' : '主题'}</span>
                  <span className="ml-auto mr-3 text-[11px] font-normal text-[#7B8981]">{additionalTopics.length} 个</span>
                  <ChevronDown
                    size={16}
                    className={`text-[#718178] transition-transform ${showMoreTopics ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                {showMoreTopics && (
                  <div className="mt-2.5 grid grid-cols-2 gap-2.5" role="group" aria-label="更多主题">
                    {additionalTopics.map(renderTopicCard)}
                  </div>
                )}
              </section>
            )}
          </>
        )}
      </div>

      {footer}
      </div>
    </div>
  );
};
