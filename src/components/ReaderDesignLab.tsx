import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  Headphones,
  Minus,
  Plus,
  VolumeX
} from 'lucide-react';
import { FIRST_STORY, COMPANIONS } from '../data';

type ReaderStyle = {
  id: string;
  name: string;
  note: string;
  principle: string;
};

const styles: ReaderStyle[] = [
  {
    id: 'swiss',
    name: '瑞士网格',
    note: '清晰、克制、可快速定位',
    principle: '网格和对齐建立秩序，让标题、正文、译文各有位置。'
  },
  {
    id: 'quiet',
    name: '安静极简',
    note: '少装饰，多留白',
    principle: '收起装饰和次要动作，把注意力还给句子本身。'
  },
  {
    id: 'editorial',
    name: '编辑部刊物',
    note: '像读一页短篇故事',
    principle: '用编辑式标题和衬线正文，带来更沉浸的叙事节奏。'
  },
  {
    id: 'bilingual',
    name: '双语分层',
    note: '英文与中文自然对照',
    principle: '两种语言分区呈现，减少来回寻找对应句子的负担。'
  },
  {
    id: 'storybook',
    name: '轻故事卡',
    note: '温和陪伴，不催促',
    principle: '保留轻巧的角色陪伴，用明确的卡片边界稳住阅读区域。'
  },
  {
    id: 'accessible',
    name: '清晰高对比',
    note: '字更大，控制更直接',
    principle: '强调可读性和可调节性，让阅读节奏由读者掌握。'
  }
];

const companion = COMPANIONS.find((item) => item.id === 'wick') || COMPANIONS[0];
const translations = [
  '晚上21:47，整座城市的灯光突然熄灭。玻璃大楼消失在红色尘土中。',
  '玛拉等着应急系统启动。什么也没有发生。随后，一台老旧的维修机器人从街道下方的隧道里出现。',
  '“我知道另一条路，”它说。那条路更远一些，但不依赖城市网络。'
];

interface ReaderPreviewProps {
  style: ReaderStyle;
}

const ReaderPreview: React.FC<ReaderPreviewProps> = ({ style }) => {
  const [paragraphIndex, setParagraphIndex] = useState(0);
  const [translationVisible, setTranslationVisible] = useState(true);
  const [fontScale, setFontScale] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const paragraphs = FIRST_STORY.levels.mid.paragraphs;
  const paragraph = paragraphs[paragraphIndex];

  useEffect(() => () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, []);

  const move = (direction: -1 | 1) => {
    setParagraphIndex((current) => (current + direction + paragraphs.length) % paragraphs.length);
    setShowNote(false);
  };

  const swipeStartX = React.useRef<number | null>(null);

  const handleCardTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    swipeStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleCardTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (swipeStartX.current === null) return;
    const deltaX = event.changedTouches[0]?.clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (deltaX <= -52) move(1);
    if (deltaX >= 52) move(-1);
  };

  const toggleSpeech = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(paragraph);
    utterance.lang = 'en-US';
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <div className={`reader-screen reader-screen--${style.id}`}>
      <div className="reader-topline">
        <button type="button" className="reader-icon-button" aria-label="返回上一页">
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <span className="reader-story-title">{FIRST_STORY.title}</span>
        <button
          type="button"
          className="reader-icon-button reader-more-button"
          onClick={() => setTranslationVisible((visible) => !visible)}
          aria-label={translationVisible ? '隐藏中文译文' : '显示中文译文'}
          aria-pressed={translationVisible}
        >
          <span aria-hidden="true">{translationVisible ? '中' : 'EN'}</span>
        </button>
      </div>

      <div className="reader-progress-row">
        <div
          className="reader-progress"
          role="progressbar"
          aria-label="章节阅读进度"
          aria-valuemin={1}
          aria-valuemax={paragraphs.length}
          aria-valuenow={paragraphIndex + 1}
        >
          <span style={{ width: `${((paragraphIndex + 1) / paragraphs.length) * 100}%` }} />
        </div>
        <span className="reader-progress-count">{String(paragraphIndex + 1).padStart(2, '0')} / 03</span>
      </div>

      <div
        className="reader-copy-area"
        onTouchStart={handleCardTouchStart}
        onTouchEnd={handleCardTouchEnd}
        onTouchCancel={() => {
          swipeStartX.current = null;
        }}
        aria-label="阅读卡片，向左或向右滑动翻页"
      >
        {style.id === 'swiss' && (
          <div className="reader-swiss-label">
            <span>SCIENCE STORIES</span>
            <span>火星系列　/　01</span>
          </div>
        )}
        {style.id === 'editorial' && (
          <div className="reader-editorial-meta">
            <BookOpen size={15} aria-hidden="true" />
            <span>{FIRST_STORY.series}</span>
          </div>
        )}
        {style.id === 'bilingual' ? (
          <div className="reader-language-pair">
            <section>
              <span className="reader-language-label">ENGLISH</span>
              <p className="reader-english" style={{ fontSize: `${22 * fontScale}px` }}>{paragraph}</p>
            </section>
            {translationVisible && (
              <section className="reader-translation-block">
                <span className="reader-language-label">中文</span>
                <p className="reader-translation">{translations[paragraphIndex]}</p>
              </section>
            )}
          </div>
        ) : (
          <>
            {style.id === 'accessible' && (
              <div className="reader-type-controls" aria-label="调整字号">
                <span>字号</span>
                <button
                  type="button"
                  onClick={() => setFontScale((size) => Math.max(0.9, size - 0.1))}
                  aria-label="缩小字号"
                  disabled={fontScale <= 0.9}
                >
                  <Minus size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setFontScale((size) => Math.min(1.3, size + 0.1))}
                  aria-label="放大字号"
                  disabled={fontScale >= 1.3}
                >
                  <Plus size={16} aria-hidden="true" />
                </button>
              </div>
            )}
            <p
              className="reader-english"
              style={style.id === 'accessible' ? { fontSize: `${22 * fontScale}px` } : undefined}
            >
              {style.id === 'editorial' && <span className="reader-dropcap">{paragraph.charAt(0)}</span>}
              {style.id === 'editorial' ? paragraph.slice(1).trimStart() : paragraph}
            </p>
            {translationVisible && (
              <p className="reader-translation">{translations[paragraphIndex]}</p>
            )}
            {style.id === 'storybook' && (
              <div className="reader-companion">
                <img src={companion.portraitUrl} alt={`${companion.name}安静地陪伴阅读`} />
                <span>慢慢读，我在这里。</span>
              </div>
            )}
          </>
        )}
        {showNote && (
          <p className="reader-inline-note">
            先读懂停电发生了什么，再留意转折词 <em>Then</em> 带来的新线索。
          </p>
        )}
      </div>

      <div className="reader-bottom-area">
        <div className="reader-page-controls">
          <button type="button" onClick={() => move(-1)} aria-label="上一段">
            <ArrowLeft size={17} aria-hidden="true" />
          </button>
          <span>{paragraphIndex + 1} / {paragraphs.length}</span>
          <button type="button" onClick={() => move(1)} aria-label="下一段">
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
        <div className="reader-actions">
          <button type="button" onClick={toggleSpeech} aria-pressed={speaking}>
            {speaking ? <VolumeX size={17} aria-hidden="true" /> : <Headphones size={17} aria-hidden="true" />}
            <span>{speaking ? '停止' : '听这一段'}</span>
          </button>
          <button type="button" onClick={() => setShowNote((shown) => !shown)} aria-pressed={showNote}>
            <Check size={17} aria-hidden="true" />
            <span>{showNote ? '收起提示' : '阅读提示'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const ReaderDesignLab: React.FC = () => (
  <div className="reader-lab">
    <header className="reader-lab-header">
      <a className="reader-lab-brand" href="/" aria-label="返回一鹿知预览">
        <span className="reader-lab-brand-icon"><BookOpen size={17} aria-hidden="true" /></span>
        <span>一鹿知 <span className="reader-lab-brand-divider">/</span> 阅读设计实验室</span>
      </a>
      <a className="reader-lab-back" href="/">返回产品预览</a>
    </header>

    <main className="reader-lab-main">
      <section className="reader-lab-intro">
        <p className="reader-lab-kicker">READING, AT YOUR PACE</p>
        <h1>同一段故事，六种阅读节奏</h1>
        <p className="reader-lab-description">
          从信息秩序到陪伴感，比较六种阅读页面方向。每个方案都保留相同内容，方便把注意力放在版式与阅读感受上。
        </p>
        <div className="reader-lab-meta">
          <span>{FIRST_STORY.title}</span>
          <span>{FIRST_STORY.part}</span>
          <span>约 2 分钟</span>
        </div>
      </section>

      <section className="reader-design-grid" aria-label="六种阅读页面方案">
        {styles.map((style, index) => (
          <article key={style.id} className={`reader-design-item reader-design-item--${style.id}`}>
            <div className="reader-design-heading">
              <span className="reader-design-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h2>{style.name}</h2>
                <p>{style.note}</p>
              </div>
            </div>
            <ReaderPreview style={style} />
            <p className="reader-design-principle">{style.principle}</p>
          </article>
        ))}
      </section>

      <footer className="reader-lab-footer">
        <p>以舒适、低压力为共同目标，具体样式仍应通过真实读者试用验证。</p>
      </footer>
    </main>
  </div>
);
