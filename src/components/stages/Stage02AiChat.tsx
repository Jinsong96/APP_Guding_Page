import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Volume2,
  Check,
  Sparkle,
  Sparkles
} from 'lucide-react';
import { Companion, GoalTrackDetails } from '../../types';
import { GalaxyCompassPicker } from '../GalaxyCompassPicker';

export type CefrLevelKey = 'A1-' | 'A2' | 'B1' | 'B2+';
export type GoalCategory = 'exam' | 'workplace' | 'original' | 'interest';

export interface SurveyAnswers {
  goal?: string;
  challenge?: string;
  duration?: string;
  readingState?: string;
  initialLevel?: CefrLevelKey;
  companionStyle?: string;
  goalTrack?: GoalTrackDetails;
}

export interface SurveyOptionItem {
  label: string;
  category?: GoalCategory;
  isRecommended?: boolean;
  aiReasoning: string; // Dynamic AI insight expressed when selected
}

export interface SurveyQuestionDef {
  step: number; // 11: Q1, 12: Q2 (focus), 15: Q3 (hurdle), 13: Q4 (duration), 14: Q5 (reading state / starting level)
  number: number;
  total: number;
  stageName: string;
  title: string;
  defaultPrompt: string;
  options: SurveyOptionItem[];
}

export const getSurveyQuestions = (companionName: string, goalCat: GoalCategory = 'exam'): SurveyQuestionDef[] => [
  {
    step: 11,
    number: 1,
    total: 5,
    stageName: '核心目标',
    title: '平时读英语，你最想达成什么目标？',
    defaultPrompt: `嗨！告诉我你的主要阅读方向，${companionName}将据此调配全套篇目与梯度～`,
    options: [
      {
        label: '备考升学',
        category: 'exam',
        aiReasoning: '锁定靶向备考：精准匹配真题考点与核心长难句语料，助你高效突破！'
      },
      {
        label: '职场应用',
        category: 'workplace',
        aiReasoning: '强化实战应用：精炼外贸出海、商务邮件与深度外刊等实战语料！'
      },
      {
        label: '国际视野',
        category: 'original',
        aiReasoning: '拓展原版视野：精选全球热点、跨文化透视与地道原汁原味篇目！'
      },
      {
        label: '兴趣爱好',
        category: 'interest',
        aiReasoning: '轻松无痛输入：零压力微阅读，在故事与百科中自然吸纳地道语感！'
      }
    ]
  },
  {
    step: 12,
    number: 2,
    total: 5,
    stageName: '场景定位',
    title:
      goalCat === 'exam'
        ? '你在准备哪个考试？'
        : goalCat === 'workplace'
        ? '工作里，你主要用英语做什么？'
        : goalCat === 'original'
        ? '读完一篇文章，你最希望收获的是？'
        : '你更喜欢哪种读法？',
    defaultPrompt: '精准锁定具体场景，匹配专属词库与篇目语料～',
    options:
      goalCat === 'exam'
        ? [
            {
              label: 'KET/PET',
              aiReasoning: '通用能力打底：夯实原版阅读基础，稳步建立英语综合自信！'
            },
            {
              label: '中考',
              aiReasoning: '初中考纲攻坚：锁定中考核心高频词，轻松拿捏阅读与完形填空！'
            },
            {
              label: '高考',
              aiReasoning: '高考长难句拔高：训练七选五主干抓取与长篇速读提分技巧！'
            },
            {
              label: '四六级',
              aiReasoning: '大学四六级冲刺：突击考纲高频核心词汇与段落主旨快速定位！'
            },
            {
              label: '考研',
              aiReasoning: '考研学术长难句攻关：深度剖析学术论证逻辑框架与解题切入点！'
            },
            {
              label: '雅思或托福',
              aiReasoning: '学术原版快速跃迁：专项强化学术论证逻辑与学术高阶词汇！'
            }
          ]
        : goalCat === 'workplace'
        ? [
            {
              label: '外贸与跨境电商',
              aiReasoning: '出海实战聚焦：精读爆款 Listing、海外买家询盘与精准商业磋商！'
            },
            {
              label: '邮件与日常沟通',
              aiReasoning: '日常高效协同：掌握本土原生用词，告别中式生硬翻译腔！'
            },
            {
              label: '会议与商务谈判',
              aiReasoning: '商务沟通实战：商业条款磋商、英文会议表达与跨国项目推进！'
            },
            {
              label: '行业资讯与报告',
              aiReasoning: '前沿资讯敏锐度：快速扫读研报核心数据与全球行业动态！'
            }
          ]
        : goalCat === 'original'
        ? [
            {
              label: '弄懂来龙去脉',
              aiReasoning: '全景通透掌握：梳理事件完整时间轴与核心逻辑脉络！'
            },
            {
              label: '积累地道表达',
              aiReasoning: '原生好词好句：随文点拨本土固定搭配与高阶修辞金句！'
            },
            {
              label: '了解文化观点',
              aiReasoning: '跨文化视角透视：随文拓展欧美文化典故与多元思维碰撞！'
            },
            {
              label: '读懂复杂长句',
              aiReasoning: '长难句拆解通关：多层嵌套从句也能像积木一样清晰直观！'
            }
          ]
        : [
            {
              label: '一篇读透，弄懂每句话',
              aiReasoning: '精读深耕模式：逐句拆解核心词与句法细节，每一句都读通读透！'
            },
            {
              label: '多读几篇，懂个大概就好',
              aiReasoning: '泛读心流模式：顺畅抓取大意与剧情起伏，享受无压力轻松阅读！'
            }
          ]
  },
  {
    step: 15,
    number: 3,
    total: 5,
    stageName: '核心卡点',
    title: '读英文时，最让你头疼的是？',
    defaultPrompt: `${companionName}会在后续阅读中专门标注破解支架与攻坚技巧～`,
    options:
      goalCat === 'exam'
        ? [
            {
              label: '长难句看不懂',
              aiReasoning: '激活句法支架：后续长难句将提供分层染色与逻辑主干拆解！'
            },
            {
              label: '核心词记不住',
              aiReasoning: '语境记忆加持：高频考点词随文高亮解析，彻底告别死记硬背！'
            },
            {
              label: '阅读速度太慢',
              aiReasoning: '意群速读训练：引导视线快速定位主谓宾，大幅提升做题效率！'
            },
            {
              label: '抓不住文章主旨',
              aiReasoning: '段落脉络导引：重点点拨段落首尾论点与转折过渡词！'
            }
          ]
        : goalCat === 'workplace'
        ? [
            {
              label: '表达不够地道',
              aiReasoning: '地道表达置换：自动标注本土原生用词，职场表达更自信！'
            },
            {
              label: '专业术语看不懂',
              aiReasoning: '行业黑话精析：专业术语与行业缩写即点即查、智能速记！'
            },
            {
              label: '长文抓不住重点',
              aiReasoning: '关键信息抓取：以数据和核心结论为锚点，迅速抓住决策重点！'
            },
            {
              label: '读得慢效率低',
              aiReasoning: '结构化速读法：先看结论后看论据，成倍提升文献阅读速度！'
            }
          ]
        : goalCat === 'original'
        ? [
            {
              label: '生词打断节奏',
              aiReasoning: '智能释义浮窗：轻量提示高亮，无需跳出查词打断阅读心流！'
            },
            {
              label: '长句容易绕晕',
              aiReasoning: '多层从句拆解：抽丝剥茧还原主干，长句子也能一眼看懂！'
            },
            {
              label: '背景文化看不懂',
              aiReasoning: '背景百科卡片：随文补充西方历史文化、政治与社会背景！'
            },
            {
              label: '长篇阅读容易疲劳',
              aiReasoning: '意群微步推进：舒适分段阅读，长文读起来轻盈不费力！'
            }
          ]
        : [
            {
              label: '很难坚持下去',
              aiReasoning: '微习惯正向反馈：每天几分钟无痛打卡，让进步清晰可见！'
            },
            {
              label: '文章内容太难',
              aiReasoning: '智能难度降阶：随时根据你的状态自动调配最友善的版本！'
            },
            {
              label: '感觉不到进步',
              aiReasoning: '多维成长勋章：即时记录新学词汇与阅读里程碑，满满成就感！'
            },
            {
              label: '找不到想读的',
              aiReasoning: '兴趣星系推送：紧密围绕你的专属星盘，精准推荐心仪佳作！'
            }
          ]
  },
  {
    step: 13,
    number: 4,
    total: 5,
    stageName: '专注节奏',
    title: '每天留一段专注阅读时间，你更习惯哪种时长？',
    defaultPrompt: '选择最契合当前生活节奏的打卡时长，可持续才是硬道理～',
    options: [
      {
        label: '3-5 分钟',
        aiReasoning: '碎片化微阅读：零负担打卡，排队通勤随时读完 1 篇精巧短文。'
      },
      {
        label: '5-20 分钟',
        isRecommended: true,
        aiReasoning: '黄金阅读时长：精读 1-2 篇完整短文，深度与轻松感兼顾。'
      },
      {
        label: '20 分钟以上',
        aiReasoning: '深度心流沉浸：适合长篇探究与全景输入，快速积累大体量语料。'
      }
    ]
  },
  {
    step: 14,
    number: 5,
    total: 5,
    stageName: '当前状态',
    title: '读英文文章时，你一般是什么状态？',
    defaultPrompt: '选出你的真实状态，我们将据此为你锁定最适宜的起步试读！',
    options: [
      {
        label: '只能看懂简单的句子',
        aiReasoning: '从基础短句起步：词汇高频、句式简短，零压力开启第一步！'
      },
      {
        label: '能读懂短文，但要查不少词',
        aiReasoning: '稳固日常语感：涵盖实用复合句与生活叙事，查词更智能省心！'
      },
      {
        label: '大部分能读懂，偶尔卡住',
        aiReasoning: '进阶地道流畅：适应丰富从句与主流资讯，快速突破阅读瓶颈！'
      },
      {
        label: '读外刊、原版书比较轻松',
        aiReasoning: '原生深度阅读：品读细腻修辞与复杂论证，享受母语级阅读快感！'
      }
    ]
  }
];

export const LEVEL_METAS: Record<
  CefrLevelKey,
  { levelLabel: string; code: string; color: string; tagline: string; description: string }
> = {
  'A1-': {
    levelLabel: 'A1- 入门启蒙',
    code: 'L1',
    color: '#38BDF8',
    tagline: '短句高频词，零负担轻松读',
    description: '核心词汇 800 以内，以基础日常会话与简短叙事短句为主，帮助你轻松找回英语语感。'
  },
  'A2': {
    levelLabel: 'A2 基础衔接',
    code: 'L4',
    color: '#34D399',
    tagline: '生活语境叙事，自然建立语感',
    description: '词汇量约 1500-2000，涵盖常见复合句与生活叙事，能在熟悉的题材中流畅获取核心信息。'
  },
  'B1': {
    levelLabel: 'B1 地道流畅',
    code: 'L7',
    color: '#FBBF24',
    tagline: '复合从句与地道短语，畅读原版',
    description: '词汇量约 3500-4500，适应复合从句、地道成语与时事科普，可从容阅读国外主流媒体原版短文。'
  },
  'B2+': {
    levelLabel: 'B2+ 原汁原味',
    code: 'L10',
    color: '#F472B6',
    tagline: '原生文笔与细腻修辞，深度探究',
    description: '词汇量 6000 以上，面对复杂论证、学术专论与原生文笔游刃有余，享受母语级沉浸体验。'
  }
};

// 4 Levels x 4 Sentences dataset
export const SENTENCES_BY_LEVEL: Record<CefrLevelKey, string[]> = {
  'A1-': [
    'We all remember our favourite teddy bear. It gave us comfort.',
    'Later, we grow up and forget our teddy. But this is not true for everyone.',
    'One survey says one in ten people need a teddy in bed.',
    'Some adults take their soft toys everywhere.'
  ],
  'A2': [
    'We all remember our favourite teddy bear from childhood. It was our soft friend and gave us comfort.',
    'As we grow up, we usually put our teddy away or give it away. But this doesn\'t happen to everyone.',
    'It seems that some adults still need their teddy. One survey says one in ten people in the UK need a teddy in bed.',
    'Some adults even take their soft toys everywhere.'
  ],
  'B1': [
    'One thing we always remember from childhood is our favourite teddy bear. This soft toy was our comfort and friend.',
    'As we grow up, we usually leave childish things behind, and our teddy often ends up in a box. But that\'s not the case for everyone.',
    'It seems that some adults still need their cuddly toy. One sleep survey suggested that a tenth of people in the UK need a teddy bear in bed.',
    'For some adults, soft toys are so important that they take them everywhere.'
  ],
  'B2+': [
    'One thing we always remember from our childhood is our favourite teddy bear. This soft, ragged toy was our comfort and companion.',
    'As we grow up, we normally give up our childish ways, and our furry friend often ends up in storage or at a jumble sale. But that\'s not the case for everyone.',
    'It seems that some grown-ups continue to need their cuddly toy by their sides. One sleep survey suggested a tenth of people in the UK need a teddy bear in bed.',
    'And for some adults, soft toys remain an essential presence – they take them wherever they go.'
  ]
};

interface Stage02AiChatProps {
  companion: Companion;
  onBack: () => void;
  onComplete: (selectedInterests: string[], determinedLevel: CefrLevelKey, surveyAnswers?: SurveyAnswers) => void;
  onSkip: () => void;
}

export const Stage02AiChat: React.FC<Stage02AiChatProps> = ({
  companion,
  onBack,
  onComplete,
  onSkip: _onSkip
}) => {
  // Navigation Steps:
  // 0: Entry Welcome Animation Screen (多邻国经典角色登场视频动效)
  // 1: 360° Galaxy Compass (兴趣星盘 · 去除顶部对话框)
  // 2: Transition 1: 星盘 ➔ 习惯过渡动画屏 (精简文案)
  // 11: Q1 核心目标
  // 12: Q2 场景定位
  // 15: Q3 核心卡点
  // 13: Q4 专注节奏
  // 14: Q5 当前状态（语感自评 ➔ 决定试读起步等级）
  // 16: Transition 2: 习惯 ➔ 语感试读过渡动画屏 (精简文案)
  // 3: 句子 1/4 试读评测 (进度条 25%)
  // 4: 句子 2/4 试读评测 (进度条 50%)
  // 5: 句子 3/4 试读评测 (进度条 75%)
  // 6: 句子 4/4 试读评测 (进度条 100%)
  // 7: 定级达成完成屏 (直接开启专属定制按钮 ➔ 切换到 03 定制画像)
  const [step, setStep] = useState<number>(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [astrolabeTargetDomain, setAstrolabeTargetDomain] = useState<number | null>(null);

  const [currentLevel, setCurrentLevel] = useState<CefrLevelKey>('A2');
  const [surveyAnswers, setSurveyAnswers] = useState<SurveyAnswers>({});
  const [goalCategory, setGoalCategory] = useState<GoalCategory>('exam');

  // Currently selected option in the active screen (before clicking Continue)
  const [selectedOptionLabel, setSelectedOptionLabel] = useState<string | null>(null);
  const [selectedOptionItem, setSelectedOptionItem] = useState<SurveyOptionItem | null>(null);

  // Companion Dynamic Speech State
  const [companionBubbleText, setCompanionBubbleText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Reading assessment state
  const [_sentenceFeedbacks, setSentenceFeedbacks] = useState<
    Record<number, { text: string; direction: 'up' | 'down' | 'keep' }>
  >({});
  const [selectedFeeling, setSelectedFeeling] = useState<'down' | 'keep' | 'up' | null>(null);
  const [sentenceLevelHistory, setSentenceLevelHistory] = useState<Record<number, CefrLevelKey>>({ 0: 'A2' });
  const [playingSentenceIdx, setPlayingSentenceIdx] = useState<number | null>(null);


  const typewriterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Dynamic typewriter for companion speech bubble
  const triggerBubbleSpeech = (text: string) => {
    if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
    setIsTyping(true);
    let idx = 0;
    setCompanionBubbleText('');

    typewriterTimerRef.current = setInterval(() => {
      idx += 2;
      setCompanionBubbleText(text.slice(0, idx));
      if (idx >= text.length) {
        if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
        typewriterTimerRef.current = null;
        setIsTyping(false);
      }
    }, 16);
  };

  useEffect(() => {
    return () => {
      if (typewriterTimerRef.current) clearInterval(typewriterTimerRef.current);
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Sync companion bubble text when step changes
  useEffect(() => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setSelectedOptionLabel(null);
    setSelectedOptionItem(null);
    setSelectedFeeling(null);

    const questions = getSurveyQuestions(companion.name, goalCategory);
    const q = questions.find((item) => item.step === step);
    if (step === 0) {
      triggerBubbleSpeech(`嗨！初次见面，我是 ${companion.name}！快挑挑你喜欢看的内容吧～`);
    } else if (step === 2) {
      triggerBubbleSpeech(`太棒啦，你选的兴趣我都记下啦！接下来回答 5 个阅读小问题，我们将为你定制专属学习旅程！`);
    } else if (step === 16) {
      triggerBubbleSpeech(`接下来进行 4 句微试读，感受一下难度，我们就能为你锁定建议起步等级！`);
    } else if (q) {
      triggerBubbleSpeech(q.title);
    } else if (step >= 3 && step <= 6) {
      const sIdx = step - 3;
      const initialMsgs = [
        `这是第 1/4 句，品读生词与长句节奏，选出你的真实感受：`,
        `表现不错！来看第 2/4 句，体会一下句意理解是否顺畅？`,
        `渐入佳境！来看第 3/4 句，体会一下从句与语感契合度：`,
        `最后第 4 句收尾！读完这句，我们就能锁定你的专属起步等级。`
      ];
      triggerBubbleSpeech(initialMsgs[sIdx] || '仔细品读这句英文，选出你的真实感受：');
    }
  }, [step, goalCategory, companion.name]);

  // Audio Playback
  const handlePlayAudio = (text: string, sIdx?: number) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.92;
      if (typeof sIdx === 'number') {
        setPlayingSentenceIdx(sIdx);
        utterance.onend = () => setPlayingSentenceIdx(null);
        utterance.onerror = () => setPlayingSentenceIdx(null);
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Tag selection helper for Astrolabe
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 10) return prev;
      return [...prev, tag];
    });
  };

  // Confirm tags from Astrolabe -> Proceed to Step 2 (Transition 1)
  const handleConfirmAstrolabe = (tags: string[]) => {
    const finalTags = tags.length > 0 ? tags : (selectedTags.length > 0 ? selectedTags : ['前沿科技', '天文探索']);
    setSelectedTags(finalTags);
    setStep(2); // Transition Screen 1
  };

  // Auto Commit Helper for Survey Options
  const commitOptionAndAdvance = (opt: SurveyOptionItem, currentStep: number) => {
    if (currentStep === 11) {
      const detectedCategory: GoalCategory =
        opt.category ||
        (opt.label.includes('升学') || opt.label.includes('备考')
          ? 'exam'
          : opt.label.includes('职场')
          ? 'workplace'
          : opt.label.includes('国际') || opt.label.includes('视野')
          ? 'original'
          : 'interest');

      setGoalCategory(detectedCategory);
      setSurveyAnswers((prev) => ({
        ...prev,
        goal: opt.label,
        goalTrack: {
          category: detectedCategory,
          categoryLabel: opt.label,
          targetFocus: '',
          targetHurdle: ''
        }
      }));
      setStep(12);
      return;
    }

    if (currentStep === 12) {
      setSurveyAnswers((prev) => ({
        ...prev,
        goalTrack: {
          category: prev.goalTrack?.category || goalCategory,
          categoryLabel: prev.goalTrack?.categoryLabel || prev.goal || '目标冲刺',
          targetFocus: opt.label,
          targetHurdle: prev.goalTrack?.targetHurdle || ''
        }
      }));
      setStep(15);
      return;
    }

    if (currentStep === 15) {
      setSurveyAnswers((prev) => ({
        ...prev,
        challenge: opt.label,
        goalTrack: {
          category: prev.goalTrack?.category || goalCategory,
          categoryLabel: prev.goalTrack?.categoryLabel || prev.goal || '目标冲刺',
          targetFocus: prev.goalTrack?.targetFocus || '核心专项',
          targetHurdle: opt.label
        }
      }));
      setStep(13);
      return;
    }

    if (currentStep === 13) {
      const defaultCompanionStyle = companion.type || '智能点拨';
      setSurveyAnswers((prev) => ({
        ...prev,
        duration: opt.label,
        companionStyle: defaultCompanionStyle
      }));
      setStep(14); // Proceed to Q5 Reading State
      return;
    }

    if (currentStep === 14) {
      // Q5 Reading State maps directly to initial placement testing level:
      // 只能看懂简单的句子 ➔ A1-
      // 能读懂短文，但要查不少词 ➔ A2
      // 大部分能读懂，偶尔卡住 ➔ B1
      // 读外刊、原版书比较轻松 ➔ B2+
      const levelMap: Record<string, CefrLevelKey> = {
        '只能看懂简单的句子': 'A1-',
        '能读懂短文，但要查不少词': 'A2',
        '大部分能读懂，偶尔卡住': 'B1',
        '读外刊、原版书比较轻松': 'B2+'
      };
      const determinedStartLevel: CefrLevelKey = levelMap[opt.label] || 'A2';

      setSurveyAnswers((prev) => ({
        ...prev,
        readingState: opt.label,
        initialLevel: determinedStartLevel
      }));
      setCurrentLevel(determinedStartLevel);
      setSentenceLevelHistory({ 0: determinedStartLevel });
      setSentenceFeedbacks({});
      setStep(16); // Direct to Transition 2 (语感微试读过渡动画屏)
      return;
    }
  };

  // Option Click in Survey Questions: Instant AI dynamic reasoning (user confirms with Continue button)
  const handleSelectOption = (opt: SurveyOptionItem) => {
    setSelectedOptionLabel(opt.label);
    setSelectedOptionItem(opt);
    // Instant companion intelligent response
    triggerBubbleSpeech(opt.aiReasoning);

    // Cancel any previous timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  // Auto Commit Helper for Sentence Feelings
  const commitFeelingAndAdvance = (feeling: 'down' | 'keep' | 'up', currentStep: number) => {
    if (currentStep >= 3 && currentStep <= 5) {
      const sIdx = currentStep - 3; // 0, 1, 2
      const feedbackMap = {
        down: '偏难吃力，调至轻量版本',
        keep: '顺畅适中，节奏契合心流',
        up: '轻松有余，挑战更高阶篇目'
      };
      setSentenceFeedbacks((prev) => ({
        ...prev,
        [sIdx]: { text: feedbackMap[feeling], direction: feeling }
      }));

      const nextLvl = getNextLevel(currentLevel, feeling);
      setSentenceLevelHistory((prev) => ({
        ...prev,
        [sIdx + 1]: nextLvl
      }));
      setCurrentLevel(nextLvl);
      setStep(currentStep + 1);
      return;
    }

    if (currentStep === 6) {
      setSentenceFeedbacks((prev) => ({
        ...prev,
        3: { text: feeling, direction: feeling }
      }));
      const finalLvl = getNextLevel(currentLevel, feeling);
      setCurrentLevel(finalLvl);
      setStep(7);
      return;
    }
  };

  // Difficulty Feedback Click in 4-Sentence Placement (用户再次点击选中项直接确认进入下一句，无倒计时)
  const handleSelectFeeling = (feeling: 'down' | 'keep' | 'up') => {
    // 倘若用户再次点击已选中的同一个选项，确认选择并立即进入下一题
    if (selectedFeeling === feeling) {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
      commitFeelingAndAdvance(feeling, step);
      return;
    }

    // 首次点击：选中该选项并触发伴读反馈，等待用户再次点击确认
    setSelectedFeeling(feeling);
    if (feeling === 'down') {
      triggerBubbleSpeech(`收到！这句难度略高，为你调配更轻盈的基础句式，保证流畅理解。`);
    } else if (feeling === 'keep') {
      triggerBubbleSpeech(`刚刚好！你的语感节奏非常平稳，继续保持这个舒适心流。`);
    } else {
      triggerBubbleSpeech(`游刃有余！感觉很轻松，为你提升句式丰富度与地道挑战。`);
    }

    // 清除可能存在的遗留计时器
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  };

  // Level adjustment helper
  const getNextLevel = (current: CefrLevelKey, direction: 'up' | 'down' | 'keep'): CefrLevelKey => {
    if (direction === 'keep') return current;
    if (direction === 'up') {
      if (current === 'A1-') return 'A2';
      if (current === 'A2') return 'B1';
      return 'B2+';
    } else {
      if (current === 'B2+') return 'B1';
      if (current === 'B1') return 'A2';
      return 'A1-';
    }
  };

  // Continue Button Click Action
  const handleContinue = () => {
    // Clear any running timer
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    // 0. From Entry Welcome (Step 0) -> 360° Astrolabe (Step 1)
    if (step === 0) {
      setStep(1);
      return;
    }

    // 1. From Transition 1 (Step 2) -> Q1 (Step 11)
    if (step === 2) {
      setStep(11);
      return;
    }

    // 2. From Q1 (Step 11) -> Q2 (Step 12)
    if (step === 11 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 11);
      return;
    }

    // 3. From Q2 (Step 12) -> Q3 (Step 15)
    if (step === 12 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 12);
      return;
    }

    // 4. From Q3 (Step 15) -> Q4 (Step 13)
    if (step === 15 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 15);
      return;
    }

    // 5. From Q4 (Step 13) -> Q5 (Step 14)
    if (step === 13 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 13);
      return;
    }

    // 6. From Q5 (Step 14) -> Transition 2 (Step 16) directly
    if (step === 14 && selectedOptionItem) {
      commitOptionAndAdvance(selectedOptionItem, 14);
      return;
    }

    // 7. From Transition 2 (Step 16) -> Sentence 1 (Step 3)
    if (step === 16) {
      setStep(3); // Start sentence 1!
      return;
    }

    // 8. From Sentences 1, 2, 3 -> Next Sentence
    if (step >= 3 && step <= 5 && selectedFeeling) {
      commitFeelingAndAdvance(selectedFeeling, step);
      return;
    }

    // 9. From Sentence 4 (Step 6) -> Complete Step 7
    if (step === 6 && selectedFeeling) {
      commitFeelingAndAdvance(selectedFeeling, 6);
      return;
    }

    // 10. From Step 7 -> Complete to Stage 03 定制画像
    if (step === 7) {
      onComplete(selectedTags, currentLevel, surveyAnswers);
    }
  };

  // Back Navigation
  const handlePrevStep = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (step === 0) {
      onBack();
      return;
    }
    if (step === 1) {
      setStep(0);
      return;
    }
    if (step === 2) {
      setStep(1);
      return;
    }
    if (step === 11) {
      setStep(2);
      return;
    }
    if (step === 12) {
      setStep(11);
      return;
    }
    if (step === 15) {
      setStep(12);
      return;
    }
    if (step === 13) {
      setStep(15);
      return;
    }
    if (step === 14) {
      setStep(13); // Back to Q4
      return;
    }
    if (step === 16) {
      setStep(14); // Back to Q5
      return;
    }
    if (step === 3) {
      setStep(16);
      return;
    }
    if (step === 4) {
      const prevLvl = sentenceLevelHistory[0] || 'A2';
      setCurrentLevel(prevLvl);
      setStep(3);
      return;
    }
    if (step === 5) {
      const prevLvl = sentenceLevelHistory[1] || 'A2';
      setCurrentLevel(prevLvl);
      setStep(4);
      return;
    }
    if (step === 6) {
      const prevLvl = sentenceLevelHistory[2] || 'A2';
      setCurrentLevel(prevLvl);
      setStep(5);
      return;
    }
    if (step === 7) {
      setStep(6);
    }
  };

  // Questions dataset
  const surveyQuestions = getSurveyQuestions(companion.name, goalCategory);
  const currentQ = surveyQuestions.find((q) => q.step === step);
  const sentenceIdx = step >= 3 && step <= 6 ? step - 3 : -1;

  // Calculate top progress percentage:
  // During survey (Q1..Q5): 20% -> 40% -> 60% -> 80% -> 100%
  // During reading sentence test (Sentences 1..4): 25% -> 50% -> 75% -> 100%
  const progressPercentage =
    step === 0 || step === 1 ? 0 :
    step === 2 ? 5 :
    step === 11 ? 20 :
    step === 12 ? 40 :
    step === 15 ? 60 :
    step === 13 ? 80 :
    step === 14 ? 100 :
    step === 16 ? 10 :
    sentenceIdx !== -1 ? Math.round(((sentenceIdx + 1) / 4) * 100) : 100;

  // Show bottom sticky bar only for interstitial/welcome/completion steps (hidden during survey and sentence test)
  const showBottomBar = step === 0 || step === 2 || step === 16 || step === 7;

  // Can the bottom Continue button be clicked?
  const canContinue =
    step === 0 ||
    step === 2 ||
    step === 16 ||
    step === 7;

  return (
    <div className="w-full h-full flex flex-col bg-[#FAF6ED] text-stone-900 select-none overflow-hidden relative font-sans">
      {/* ================= TOP HEADER (Step 0: Back Button Only) ================= */}
      {step === 0 && (
        <div className="shrink-0 h-14 px-4 sm:px-6 flex items-center justify-between border-b border-[#E8DFC8] bg-[#FAF6ED]/95 backdrop-blur-md z-30 max-w-xl w-full mx-auto">
          <button
            onClick={onBack}
            className="p-1 -ml-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="返回上一页"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* ================= TOP HEADER (Step 1: Astrolabe Clean Navigation) ================= */}
      {step === 1 && (
        <div className="shrink-0 h-14 px-4 sm:px-6 flex items-center justify-between border-b border-[#E8DFC8] bg-[#FAF6ED]/95 backdrop-blur-md z-30 max-w-xl w-full mx-auto">
          <button
            onClick={() => setStep(0)}
            className="p-1 -ml-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="返回欢迎页"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>
          <div className="w-5" />
        </div>
      )}

      {/* ================= TOP HEADER (Step 2..16, Sentences: Duolingo Progress Bar) ================= */}
      {step !== 0 && step !== 1 && (
        <div className="shrink-0 h-14 px-4 sm:px-6 flex items-center gap-3.5 border-b border-[#E8DFC8] bg-[#FAF6ED]/95 backdrop-blur-md z-30 max-w-xl w-full mx-auto">
          {/* Back Arrow */}
          <button
            onClick={handlePrevStep}
            className="p-1 -ml-1 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer active:scale-95 shrink-0"
            aria-label="返回上一屏"
          >
            <ArrowLeft size={20} className="stroke-[2.5]" />
          </button>

          {/* Duolingo Smooth Capsule Progress Bar */}
          <div className="flex-1 h-3 rounded-full bg-[#E5DFC8] p-0.5 overflow-hidden shadow-inner relative">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 100%)',
                boxShadow: '0 0 8px rgba(245, 158, 11, 0.4)'
              }}
            />
          </div>

          {/* Step Pill */}
          <span className="text-xs font-bold text-amber-900 font-mono shrink-0">
            {step === 2 || step === 16 ? '准备' :
             currentQ ? `${currentQ.number}/5` :
             sentenceIdx !== -1 ? `${sentenceIdx + 1}/4` : '完成'}
          </span>
        </div>
      )}

      {/* ================= MAIN CONTENT CANVAS ================= */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center justify-between p-4 sm:p-5 w-full max-w-xl mx-auto">
        {/* ================= SCREEN 0: ENTRY WELCOME ANIMATION (参考用户视频) ================= */}
        {step === 0 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Duolingo Speech Bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#E5E0D5] p-5 shadow-sm mb-6 inline-block text-left animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-[18px] font-bold tracking-tight leading-snug animate-title-gradient">
                  {companionBubbleText}
                  {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-600 ml-1 animate-pulse" />}
                </p>
                {/* Speech Bubble Arrow Notch pointing downward */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[14px] border-t-[#E5E0D5] -z-10" />
              </div>

              {/* Mascot Center Glow Avatar with celebratory wave */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
                {/* Floating Soft Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute -top-1 -right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={18} />
                  </span>
                  <span className="absolute top-1/2 -left-3 text-amber-400 animate-sparkle-soft-2">
                    <Sparkle size={14} className="fill-amber-400" />
                  </span>
                  <span className="absolute -bottom-1 right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={16} />
                  </span>
                </div>
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain relative z-10 animate-celebrate-action drop-shadow-md select-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREEN 1: GALAXY COMPASS (往上移适配整体布局，去除大片空白) ================= */}
        {step === 1 && (
          <div className="w-full flex-1 flex flex-col items-center justify-start pt-1 sm:pt-2 animate-in fade-in zoom-in-95 duration-300">
            {/* Galaxy Compass Wheel Clean */}
            <div className="w-full">
              <GalaxyCompassPicker
                selectedTags={selectedTags}
                onToggleTag={handleToggleTag}
                onConfirm={handleConfirmAstrolabe}
                companionAccent={companion.accentColor}
                targetDomainIndex={astrolabeTargetDomain}
                onDomainChange={() => setAstrolabeTargetDomain(null)}
              />
            </div>
          </div>
        )}

        {/* ================= TRANSITION 1: 星盘 ➔ 阅读习惯过渡动画屏 (精简文案，呈现小灯happy形态) ================= */}
        {step === 2 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Duolingo Speech Bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#E5E0D5] p-5 shadow-sm mb-6 inline-block text-left animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-[17px] font-bold tracking-tight leading-snug animate-title-gradient">
                  {companionBubbleText || '太棒啦，你选的兴趣我都记下啦！接下来回答 5 个阅读小问题，我们将为你定制专属学习旅程！'}
                  {isTyping && <span className="inline-block w-1.5 h-3.5 bg-amber-600 ml-1 animate-pulse" />}
                </p>
                {/* Speech Bubble Arrow Notch pointing downward */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[14px] border-t-[#E5E0D5] -z-10" />
              </div>

              {/* Mascot Center Glow Avatar with celebratory action (Happy Form) */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/25 blur-xl animate-pulse" />
                {/* Floating Soft Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute -top-1 -right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={18} />
                  </span>
                  <span className="absolute top-1/2 -left-3 text-amber-400 animate-sparkle-soft-2">
                    <Sparkle size={14} className="fill-amber-400" />
                  </span>
                  <span className="absolute -bottom-1 right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={16} />
                  </span>
                </div>
                <img
                  src={companion.id === 'light' ? '/assets/light_happy.png' : companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain relative z-10 animate-celebrate-action drop-shadow-md select-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREENS 3..7: SURVEY QUESTIONS (Duolingo Vertical Stack Cards, Zero Truncation) ================= */}
        {currentQ && (
          <div className="w-full flex-1 flex flex-col justify-start animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Duolingo Companion Speech Header (Mascot left + Speech bubble right) */}
            <div className="flex items-start gap-3 mb-4 sm:mb-5 w-full">
              <div className="relative shrink-0 mt-0.5">
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-13 h-13 rounded-full object-cover ring-2 ring-amber-300 shadow-sm"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500" />
              </div>

              {/* Pointing Speech Bubble with Notch */}
              <div className="relative flex-1 bg-white rounded-2xl border-2 border-[#E5E0D5] p-3.5 sm:p-4 shadow-sm">
                <div className="absolute top-4 -left-2.5 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[10px] border-r-white z-10" />
                <div className="absolute top-3.5 -left-3.5 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[12px] border-r-[#E5E0D5]" />

                <div className="text-[15px] sm:text-[16px] font-bold text-stone-900 leading-snug">
                  {companionBubbleText}
                  {isTyping && <span className="inline-block w-1.5 h-3 bg-amber-600 ml-1 animate-pulse" />}
                </div>
              </div>
            </div>

            {/* Vertical Stack List (Duolingo Reference: Full Width, Complete Text, Zero Ellipsis) */}
            <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOptionLabel === opt.label;
                const isRecommended = opt.isRecommended;

                return (
                  <button
                    key={opt.label}
                    onClick={() => handleSelectOption(opt)}
                    className={`group relative w-full rounded-2xl px-4 py-3.5 sm:py-4 text-left transition-all duration-150 cursor-pointer flex items-center justify-between border-2 active:scale-[0.99] ${
                      isSelected
                        ? 'border-amber-500 bg-[#FFFDF7] shadow-[0_3px_0_#D97706] ring-2 ring-amber-400/20 translate-y-0.5'
                        : 'border-[#E5E0D5] bg-white hover:border-amber-400/80 hover:bg-[#FFFDF9] shadow-[0_3px_0_#E0D9C8] hover:shadow-[0_1px_0_#E0D9C8] hover:translate-y-0.5 active:translate-y-1 active:shadow-none'
                    }`}
                  >
                    {/* RECOMMENDED Badge (Visual hierarchy & priority) */}
                    {isRecommended && (
                      <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 text-[10px] font-black tracking-wider uppercase shadow-xs flex items-center gap-1 font-mono">
                        <Sparkle size={10} className="fill-stone-950" />
                        <span>推荐</span>
                      </span>
                    )}

                    {/* Left: Number + Complete Label (Never truncated!) */}
                    <div className="flex items-center gap-3 min-w-0 pr-3 flex-1">
                      <span className="text-xs font-mono font-bold text-stone-400 shrink-0">
                        0{idx + 1}
                      </span>
                      <span
                        className={`text-[15px] sm:text-[16px] font-bold leading-normal break-words transition-colors ${
                          isSelected ? 'text-amber-950 font-black' : 'text-stone-900 group-hover:text-amber-900'
                        }`}
                      >
                        {opt.label}
                      </span>
                    </div>

                    {/* Right: Tactile Selection Circle */}
                    <span
                      className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 shadow-xs scale-105'
                          : 'border-2 border-[#DCD3C0] bg-[#FAF6ED] text-transparent group-hover:border-amber-400'
                      }`}
                    >
                      <Check size={14} className="stroke-[3]" />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Continue Button placed right below the options list (avoiding large empty space) */}
            <div className="mt-4 sm:mt-5 w-full">
              <button
                onClick={handleContinue}
                disabled={!selectedOptionItem}
                style={
                  selectedOptionItem
                    ? {
                        background: 'linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%)',
                        boxShadow: '0 4px 0 #D97706'
                      }
                    : undefined
                }
                className={`w-full h-12 sm:h-13 rounded-2xl font-black text-[15px] sm:text-base flex items-center justify-center gap-2 transition-all duration-150 ${
                  selectedOptionItem
                    ? 'text-stone-950 cursor-pointer active:translate-y-0.5 active:shadow-none'
                    : 'bg-[#E5DFC8] text-stone-400 cursor-not-allowed shadow-none'
                }`}
              >
                <span>继续</span>
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* ================= TRANSITION 2: 习惯完成 ➔ 语感试读过渡动画屏 (去除下方标签) ================= */}
        {step === 16 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Duolingo Speech Bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#E5E0D5] p-5 shadow-sm mb-6 inline-block text-left animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-[17px] font-bold tracking-tight leading-snug animate-title-gradient">
                  接下来进行 4 句微试读，感受一下难度，我们就能为你锁定建议起步等级！
                </p>
                {/* Speech Bubble Arrow Notch pointing downward */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[14px] border-t-[#E5E0D5] -z-10" />
              </div>

              {/* Mascot Center Glow Avatar with celebratory action */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
                {/* Floating Soft Sparkles */}
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute -top-1 -right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={18} />
                  </span>
                  <span className="absolute top-1/2 -left-3 text-amber-400 animate-sparkle-soft-2">
                    <Sparkle size={14} className="fill-amber-400" />
                  </span>
                  <span className="absolute -bottom-1 right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={16} />
                  </span>
                </div>
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain relative z-10 animate-celebrate-action drop-shadow-md select-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SCREENS 8..11: 4-SENTENCE PLACEMENT TEST (选项整体上移，去除中空缝隙) ================= */}
        {sentenceIdx !== -1 && (
          <div className="w-full flex-1 flex flex-col justify-start gap-2.5 sm:gap-3.5 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* TIER 1: TOP IS THE SENTENCE (扬声器icon移至右下角) */}
            <div className="w-full bg-white rounded-3xl border-2 border-[#E7DFC8] p-3.5 sm:p-4 shadow-xs shrink-0 relative flex flex-col justify-between min-h-[95px] sm:min-h-[105px]">
              {/* The Sentence Text */}
              <p className="text-[16px] sm:text-[18px] font-serif leading-relaxed text-stone-900 tracking-wide selection:bg-amber-200">
                "{SENTENCES_BY_LEVEL[currentLevel][sentenceIdx]}"
              </p>

              {/* Speaker icon only (Bottom Right) */}
              <div className="flex items-center justify-end mt-1.5 pt-0.5">
                <button
                  onClick={() => handlePlayAudio(SENTENCES_BY_LEVEL[currentLevel][sentenceIdx], sentenceIdx)}
                  className="w-7.5 h-7.5 rounded-full bg-[#FAF6ED] hover:bg-amber-50 text-stone-700 border border-[#E2D8C6] hover:border-amber-400 transition-all cursor-pointer flex items-center justify-center active:scale-95 shadow-2xs"
                  title="播放发音"
                  aria-label="播放发音"
                >
                  <Volume2
                    size={15}
                    className={playingSentenceIdx === sentenceIdx ? 'text-amber-600 animate-pulse scale-110' : 'text-stone-600'}
                  />
                </button>
              </div>
            </div>

            {/* TIER 2: MIDDLE IS THE MASCOT (紧密衔接，去除大空白) + SPEECH BUBBLE */}
            <div className="w-full py-0.5 sm:py-1 flex items-center justify-center gap-3 shrink-0">
              {/* Mascot Character without circle ring or cropping */}
              <div className="relative shrink-0 w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/15 blur-lg animate-pulse pointer-events-none" />
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain relative z-10 drop-shadow-md select-none animate-celebrate-action"
                />
              </div>

              {/* Mascot Pointing Speech Bubble */}
              <div className="relative flex-1 max-w-sm bg-white rounded-2xl border-2 border-[#E5E0D5] p-3 sm:p-3.5 shadow-xs">
                {/* Speech bubble notch pointing left */}
                <div className="absolute top-1/2 -translate-y-1/2 -left-2.5 w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[10px] border-r-white z-10" />
                <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-[#E5E0D5]" />

                <div className="text-[13.5px] sm:text-[14px] font-bold text-stone-900 leading-snug">
                  {companionBubbleText}
                  {isTyping && <span className="inline-block w-1.5 h-3 bg-amber-600 ml-1 animate-pulse" />}
                </div>
              </div>
            </div>

            {/* TIER 3: USER INTERACTION OPTIONS (上移紧贴萌宠下方，无间隙断层) */}
            <div className="w-full shrink-0 mt-0 sm:mt-0.5">
              <div className="flex flex-col gap-2 sm:gap-2.5 w-full">
                {/* 1. 顺畅适中 */}
                <button
                  onClick={() => handleSelectFeeling('keep')}
                  className={`group relative w-full rounded-2xl px-4 py-2.5 sm:py-3 text-left transition-all duration-150 cursor-pointer flex items-center justify-between border-2 active:scale-[0.99] ${
                    selectedFeeling === 'keep'
                      ? 'border-amber-500 bg-[#FFFDF7] shadow-[0_3px_0_#D97706] ring-2 ring-amber-400/20 translate-y-0.5'
                      : 'border-[#E5E0D5] bg-white hover:border-amber-400 hover:bg-[#FFFDF9] shadow-[0_3px_0_#E0D9C8] hover:shadow-[0_1px_0_#E0D9C8] hover:translate-y-0.5 active:translate-y-1 active:shadow-none'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[15px] sm:text-[16px] font-bold text-stone-900 group-hover:text-stone-950">
                      顺畅适中
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${selectedFeeling === 'keep' ? 'font-bold text-amber-700 animate-pulse' : 'text-stone-400'}`}>
                      {selectedFeeling === 'keep' ? '再点一次确认' : '契合心流'}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        selectedFeeling === 'keep'
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'border border-[#DCD3C0] bg-[#FAF6ED] text-transparent'
                      }`}
                    >
                      <Check size={12} className="stroke-[3]" />
                    </span>
                  </div>
                </button>

                {/* 2. 偏难吃力 */}
                <button
                  onClick={() => handleSelectFeeling('down')}
                  className={`group relative w-full rounded-2xl px-4 py-2.5 sm:py-3 text-left transition-all duration-150 cursor-pointer flex items-center justify-between border-2 active:scale-[0.99] ${
                    selectedFeeling === 'down'
                      ? 'border-amber-500 bg-amber-50/80 shadow-[0_3px_0_#D97706] ring-2 ring-amber-400/20 translate-y-0.5'
                      : 'border-[#E5E0D5] bg-white hover:border-amber-400 hover:bg-amber-50/20 shadow-[0_3px_0_#E0D9C8] hover:shadow-[0_1px_0_#E0D9C8] hover:translate-y-0.5 active:translate-y-1 active:shadow-none'
                  }`}
                >
                  <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-900 group-hover:text-stone-950">
                    偏难吃力
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${selectedFeeling === 'down' ? 'font-bold text-amber-700 animate-pulse' : 'text-stone-400'}`}>
                      {selectedFeeling === 'down' ? '再点一次确认' : '降阶调轻'}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        selectedFeeling === 'down'
                          ? 'bg-amber-500 text-stone-950'
                          : 'border border-[#DCD3C0] bg-[#FAF6ED] text-transparent'
                      }`}
                    >
                      <Check size={12} className="stroke-[3]" />
                    </span>
                  </div>
                </button>

                {/* 3. 轻松有余 */}
                <button
                  onClick={() => handleSelectFeeling('up')}
                  className={`group relative w-full rounded-2xl px-4 py-2.5 sm:py-3 text-left transition-all duration-150 cursor-pointer flex items-center justify-between border-2 active:scale-[0.99] ${
                    selectedFeeling === 'up'
                      ? 'border-sky-500 bg-sky-50/80 shadow-[0_3px_0_#0284C7] ring-2 ring-sky-400/20 translate-y-0.5'
                      : 'border-[#E5E0D5] bg-white hover:border-sky-400 hover:bg-sky-50/20 shadow-[0_3px_0_#E0D9C8] hover:shadow-[0_1px_0_#E0D9C8] hover:translate-y-0.5 active:translate-y-1 active:shadow-none'
                  }`}
                >
                  <span className="text-[14.5px] sm:text-[15px] font-bold text-stone-900 group-hover:text-stone-950">
                    轻松有余
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${selectedFeeling === 'up' ? 'font-bold text-sky-700 animate-pulse' : 'text-stone-400'}`}>
                      {selectedFeeling === 'up' ? '再点一次确认' : '加档拔高'}
                    </span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                        selectedFeeling === 'up'
                          ? 'bg-sky-500 text-white'
                          : 'border border-[#DCD3C0] bg-[#FAF6ED] text-transparent'
                      }`}
                    >
                      <Check size={12} className="stroke-[3]" />
                    </span>
                  </div>
                </button>
              </div>

              {/* Click-to-confirm instruction indicator without 3.5s countdown */}
              {selectedFeeling && (
                <div className="w-full flex items-center justify-center gap-1.5 pt-1.5 text-xs font-semibold text-amber-900/90 animate-in fade-in duration-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>再次点击已选选项即可确认进入下一句</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SCREEN 7: PLACEMENT COMPLETE (删除冗余框，直接开启专属定制按钮) ================= */}
        {step === 7 && (
          <div className="w-full flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-400 my-auto">
            <div className="relative mb-6 max-w-xs sm:max-w-sm w-full">
              {/* Speech bubble pointing downwards to mascot */}
              <div className="relative bg-white rounded-3xl border-2 border-[#E5E0D5] p-5 shadow-sm mb-6 inline-block text-center animate-in zoom-in-95 fade-in duration-300">
                <p className="text-base sm:text-lg font-bold tracking-tight leading-snug animate-title-gradient">
                  太棒了！语感试读已完成！
                  <br />
                  准备生成你的专属定制画像
                </p>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-white" />
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[11px] border-l-transparent border-r-[11px] border-r-transparent border-t-[14px] border-t-[#E5E0D5] -z-10" />
              </div>

              {/* Mascot Center Glow Avatar */}
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl animate-pulse" />
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute -top-1 -right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={18} />
                  </span>
                  <span className="absolute top-1/2 -left-3 text-amber-400 animate-sparkle-soft-2">
                    <Sparkle size={14} className="fill-amber-400" />
                  </span>
                  <span className="absolute -bottom-1 right-2 text-amber-500 animate-sparkle-soft-1">
                    <Sparkles size={16} />
                  </span>
                </div>
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-full h-full object-contain relative z-10 animate-celebrate-action drop-shadow-md select-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= STICKY BOTTOM ACTION BAR (Duolingo CONTINUE Button) ================= */}
      {showBottomBar && (
        <div className="shrink-0 p-4 sm:p-5 bg-[#FAF6ED]/95 backdrop-blur-md border-t border-[#E8DFC8] z-30 w-full">
          <div className="max-w-xl mx-auto w-full">
            <button
              onClick={handleContinue}
              disabled={!canContinue}
              style={
                canContinue
                  ? {
                      background: 'linear-gradient(180deg, #FCD34D 0%, #F59E0B 100%)',
                      boxShadow: '0 4px 0 #D97706'
                    }
                  : undefined
              }
              className={`w-full h-13 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all duration-150 ${
                canContinue
                  ? 'text-stone-950 cursor-pointer active:translate-y-0.5 active:shadow-none'
                  : 'bg-[#E5DFC8] text-stone-400 cursor-not-allowed shadow-none'
              }`}
            >
              <span>
                {step === 0 ? '继续' :
                 step === 2 ? '开始定制' :
                 step === 16 ? '开始试读' :
                 step === 7 ? '开启专属定制' : '继续'}
              </span>
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
