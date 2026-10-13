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
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case '谓语':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case '宾语/状语':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case '修饰分句':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-700 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#161A23] border border-[#272D3B] rounded-3xl p-5 shadow-2xl relative text-slate-100 max-h-[85vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">长难句 AI 结构拆解</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Original Sentence */}
        <div className="mt-4 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
            原句 Original
          </span>
          <p className="text-sm font-serif text-slate-200 leading-relaxed italic">
            "{sentenceData.original}"
          </p>
        </div>

        {/* High-level Analysis */}
        <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
            <Sparkles size={13} />
            <span>核心主干透视</span>
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed">
            {sentenceData.analysis}
          </p>
        </div>

        {/* Syntax Chunks */}
        <div className="mt-4 space-y-2.5">
          <span className="text-xs font-semibold text-slate-400 block">
            语法成分逐层切分
          </span>

          {sentenceData.chunks.map((chunk, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#1C212E] border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className={`text-[11px] px-2 py-0.5 rounded-md font-mono border ${getRoleBadgeStyle(chunk.role)}`}>
                  {chunk.role}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">0{idx + 1}</span>
              </div>
              <p className="text-xs font-serif font-medium text-white mb-1">
                {chunk.text}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {chunk.explanation}
              </p>
            </div>
          ))}
        </div>

        {/* Companion Tip */}
        <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-2.5 items-center">
          <img
            src={companion.avatarUrl}
            alt={companion.name}
            className="w-8 h-8 rounded-full object-cover shrink-0"
          />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="text-amber-300 font-medium">{companion.name} 的避坑提示：</strong> 
            遇到长句子别慌，先把状语和破折号后修饰遮住，先抓出主干，再补读环境细节。
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
        >
          我弄懂了，返回阅读
        </button>
      </div>
    </div>
  );
};
