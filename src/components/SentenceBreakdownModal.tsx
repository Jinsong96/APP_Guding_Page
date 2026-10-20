import React from 'react';
import { X, Sparkles, Layers } from 'lucide-react';
import { SentenceChunk, Companion } from '../types';

interface SentenceBreakdownModalProps {
  sentenceData: {
    original: string;
    analysis: string;
    chunks: SentenceChunk[];
  };
  companion: Companion;
  onClose: () => void;
}

export const SentenceBreakdownModal: React.FC<SentenceBreakdownModalProps> = ({
  sentenceData,
  companion,
  onClose
}) => {
  const getRoleBadgeStyle = (role: SentenceChunk['role']) => {
    switch (role) {
      case '主语':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case '谓语':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case '宾语/状语':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case '修饰分句':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#F0F8F4] border border-[#DCEBE5] rounded-3xl p-5 shadow-2xl relative text-stone-900 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DCEBE5]">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-emerald-700" />
            <h3 className="text-sm font-bold text-stone-900">长难句 AI 结构拆解</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-[#EAF4EF] flex items-center justify-center text-stone-500 hover:text-stone-900 border border-[#DCEBE5] transition-colors cursor-pointer shadow-xs"
          >
            <X size={16} />
          </button>
        </div>

        {/* Original Sentence */}
        <div className="mt-4 p-3.5 rounded-2xl bg-white border border-[#DCEBE5] shadow-xs">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1.5 font-mono">
            原句 Original
          </span>
          <p className="text-sm font-serif text-stone-900 leading-relaxed italic">
            "{sentenceData.original}"
          </p>
        </div>

        {/* High-level Analysis */}
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 mb-1">
            <Sparkles size={13} />
            <span>核心主干透视</span>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed">
            {sentenceData.analysis}
          </p>
        </div>

        {/* Syntax Chunks */}
        <div className="mt-4 space-y-2.5">
          <span className="text-xs font-bold text-stone-700 block">
            语法成分逐层切分
          </span>

          {sentenceData.chunks.map((chunk, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-[#DCEBE5] hover:border-emerald-400/70 transition-colors shadow-xs"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono border ${getRoleBadgeStyle(chunk.role)}`}>
                  {chunk.role}
                </span>
                <span className="text-[11px] text-stone-400 font-mono">0{idx + 1}</span>
              </div>
              <p className="text-xs font-serif font-semibold text-stone-900 mb-1">
                {chunk.text}
              </p>
              <p className="text-xs text-stone-600 leading-relaxed">
                {chunk.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Companion Tip */}
        <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex gap-2.5 items-center">
          <img
            src={companion.avatarUrl}
            alt={companion.name}
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-emerald-300"
          />
          <p className="text-xs text-emerald-900 leading-relaxed">
            <strong className="text-emerald-800 font-bold">{companion.name} 的避坑提示：</strong>
            遇到长句子别慌，先把状语和破折号后修饰遮住，先抓出主干，再补读环境细节。
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium transition-colors shadow-xs cursor-pointer"
        >
          我弄懂了，返回阅读
        </button>
      </div>
    </div>
  );
};
