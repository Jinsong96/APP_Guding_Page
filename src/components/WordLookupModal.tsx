import React from 'react';
import { Volume2, Bookmark, Check, X, Sparkles } from 'lucide-react';
import { VocabItem, Companion } from '../types';

interface WordLookupModalProps {
  vocab: VocabItem;
  companion: Companion;
  isBookmarked: boolean;
  onToggleBookmark: (word: string) => void;
  onClose: () => void;
}

export const WordLookupModal: React.FC<WordLookupModalProps> = ({
  vocab,
  companion,
  isBookmarked,
  onToggleBookmark,
  onClose
}) => {
  const handlePronounce = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(vocab.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#161A23] border border-[#272D3B] rounded-3xl p-5 shadow-2xl relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: companion.accentColor }} />
            <span className="text-xs font-medium text-slate-400">词汇即时解析</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            aria-label="关闭"
          >
            <X size={16} />
          </button>
        </div>

        {/* Word and Phonetics */}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold font-serif text-white tracking-wide">{vocab.word}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-mono">
                {vocab.partOfSpeech}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-slate-400">{vocab.phonetic}</span>
              <button
                onClick={handlePronounce}
                className="p-1 rounded-md text-amber-400 hover:bg-amber-400/10 transition-colors"
                title="发音朗读"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={() => onToggleBookmark(vocab.word)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isBookmarked
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            {isBookmarked ? <Check size={13} /> : <Bookmark size={13} />}
            {isBookmarked ? '已收录' : '生词本'}
          </button>
        </div>

        {/* Chinese & English Definition */}
        <div className="mt-4 space-y-2">
          <div className="p-3 rounded-xl bg-[#1C212E] border border-slate-800">
            <p className="text-base font-medium text-emerald-400">{vocab.chinese}</p>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{vocab.englishDef}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              例句 Context
            </span>
            <p className="text-xs text-slate-300 font-serif italic leading-relaxed">
              "{vocab.example}"
            </p>
          </div>
        </div>

        {/* Companion Note */}
        <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
          <img
            src={companion.avatarUrl}
            alt={companion.name}
            className="w-9 h-9 rounded-full object-cover shrink-0 border border-amber-500/30"
          />
          <div className="text-xs">
            <div className="flex items-center gap-1 font-semibold text-amber-300">
              <Sparkles size={12} />
              <span>{companion.name} 的伴读碎碎念</span>
            </div>
            <p className="text-slate-300 mt-1 leading-relaxed">
              {vocab.companionNote}
            </p>
          </div>
        </div>

        {/* Bottom Done button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
        >
          继续阅读
        </button>
      </div>
    </div>
  );
};
