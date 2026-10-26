import React, { useState } from 'react';
import { ChevronLeft, Forward, MoreHorizontal } from 'lucide-react';

interface MiniProgramHeaderProps {
  title: string;
  onBack: () => void;
  // The capsule's close mark leaves the mini program; the demo treats it like back.
  onClose?: () => void;
  // Runs from the "···" menu's 转发文章 item.
  onShare?: () => void;
}

// WeChat mini-program style top bar shared by the reader and the reading report:
// back arrow, left-aligned title and the "··· | ◎" capsule. Styles live in reading-journey.css.
export const MiniProgramHeader: React.FC<MiniProgramHeaderProps> = ({ title, onBack, onClose, onShare }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="rj-header">
      <button type="button" onClick={onBack} aria-label="返回" className="rj-header-back">
        <ChevronLeft size={21} strokeWidth={1.5} />
      </button>
      <h1>{title}</h1>
      <div className="rj-capsule">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="更多"
          aria-expanded={menuOpen}
        >
          <MoreHorizontal size={21} strokeWidth={1.8} />
        </button>
        <span aria-hidden="true" />
        <button type="button" onClick={onClose || onBack} aria-label="关闭">
          <i className="rj-close-mark" />
        </button>
      </div>

      {menuOpen && (
        <>
          <div className="rj-menu-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />
          <div role="menu" className="rj-menu">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setMenuOpen(false);
                onShare?.();
              }}
            >
              <Forward size={20} strokeWidth={1.6} />
              转发文章
            </button>
          </div>
        </>
      )}
    </header>
  );
};
