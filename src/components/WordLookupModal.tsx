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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#F4F1FA] border border-[#E7E1F0] rounded-3xl p-5 shadow-2xl relative text-stone-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E1F0]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: companion.accentColor }} />
            <span className="text-xs font-semibold text-stone-600">词汇即时解析</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#F0ECF8] flex items-center justify-center text-stone-500 hover:text-stone-900 border border-[#E7E1F0] transition-colors cursor-pointer shadow-xs"
            aria-label="关闭"
          >
            <X size={16} />
          </button>
        </div>

        {/* Word and Phonetics */}
        <div className="mt-4 flex items-start justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold font-serif text-stone-900 tracking-wide">{vocab.word}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-medium">
                {vocab.partOfSpeech}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono text-stone-500">{vocab.phonetic}</span>
              <button
                onClick={handlePronounce}
                className="p-1 rounded-md text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="发音朗读"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>

          <button
            onClick={() => onToggleBookmark(vocab.word)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-xs ${
              isBookmarked
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                : 'bg-white hover:bg-[#F0ECF8] text-stone-700 border border-[#E7E1F0]'
            }`}
          >
            {isBookmarked ? <Check size={13} /> : <Bookmark size={13} />}
            {isBookmarked ? '已收录' : '生词本'}
          </button>
        </div>

        {/* Chinese & English Definition */}
        <div className="mt-4 space-y-2">
          <div className="p-3 rounded-xl bg-white border border-[#E7E1F0] shadow-xs">
            <p className="text-base font-bold text-emerald-800">{vocab.chinese}</p>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">{vocab.englishDef}</p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E7E1F0] shadow-xs">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1 font-mono">
              例句 Context
            </span>
            <p className="text-xs text-stone-800 font-serif italic leading-relaxed">
              "{vocab.example}"
            </p>
          </div>
        </div>

        {/* Companion Note */}
        <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex gap-3 items-start">
          <img
            src={companion.avatarUrl}
            alt={companion.name}
            className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-emerald-300"
          />
          <div className="text-xs">
            <div className="flex items-center gap-1 font-bold text-emerald-900">
              <Sparkles size={12} className="text-emerald-700" />
              <span>{companion.name} 的伴读碎碎念</span>
            </div>
            <p className="text-emerald-950 mt-1 leading-relaxed">
              {vocab.companionNote}
            </p>
          </div>
        </div>

        {/* Bottom Done button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
        >
          继续阅读
        </button>
      </div>
    </div>
  );
};
