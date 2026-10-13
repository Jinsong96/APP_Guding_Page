import React, { useState } from 'react';
import { X, Send, Sparkles, MessageSquare } from 'lucide-react';
import { Companion } from '../types';

interface AskCompanionModalProps {
  companion: Companion;
  onClose: () => void;
}

export const AskCompanionModal: React.FC<AskCompanionModalProps> = ({ companion, onClose }) => {
  const [messages, setMessages] = useState<{ sender: 'companion' | 'user'; text: string }[]>([
    {
      sender: 'companion',
      text: `嗨！我是你的阅读旅伴${companion.name}。读到哪里觉得别扭了？随便问，我替你把把关。`
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const quickQuestions = [
    '这句话里的 emerged 能换成 showed up 吗？',
    '火星城市的 emergency system 怎么会失效？',
    '这段最值得积累的地道表达是哪句？'
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputVal.trim();
    if (!text) return;

    const newMessages = [...messages, { sender: 'user' as const, text }];
    setMessages(newMessages);
    if (!textToSend) setInputVal('');

    setTimeout(() => {
      let reply = '';
      if (text.includes('emerged') || text.includes('showed up')) {
        reply = `好眼力！showed up 主要是“露面、到场”，而 emerged 带有“从幽暗隐秘的地方缓缓显露”的电影质感，用在黑漆漆的地下隧道特别有沉浸感！`;
      } else if (text.includes('emergency') || text.includes('失效')) {
        reply = `这就是科幻悬念所在啦！在 21:47 整个城市的能源网（grid）完全瘫痪，说明这绝不是单纯的跳闸，而是有更大的未知危机在酝酿中！`;
      } else if (text.includes('地道表达') || text.includes('积累')) {
        reply = `强烈推荐积累“dissolved into the red dust”（消融在漫天红沙中）以及“unhurried”（从容不迫），破折号后单放一个形容词既高级又利落！`;
      } else {
        reply = `收到！这句话在不同难度下用词很有讲究，如果你觉得现在节奏有点赶，随时点击下方的“有点难了”，我立刻帮你简化句式！`;
      }

      setMessages((prev) => [...prev, { sender: 'companion', text: reply }]);
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#161A23] border border-[#272D3B] rounded-3xl p-5 shadow-2xl relative text-slate-100 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="w-6 h-6 rounded-full object-cover border border-amber-400/30"
            />
            <div className="text-xs">
              <span className="font-semibold text-white">问问 {companion.name}</span>
              <span className="text-[10px] text-slate-400 ml-1.5">{companion.type}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Message Flow */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 no-scrollbar min-h-[180px] max-h-[260px]">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'companion' && (
                <img
                  src={companion.avatarUrl}
                  alt={companion.name}
                  className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                />
              )}
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-sm'
                    : 'bg-[#1F2432] text-slate-200 border border-slate-800 rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="py-2 border-t border-slate-800/70">
          <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-1.5">
            <Sparkles size={11} className="text-amber-400" />
            <span>大家常问</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-750 transition-colors text-left truncate max-w-full"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Composer */}
        <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-slate-800">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={`问问 ${companion.name} 关于这段文字的疑问...`}
            className="flex-1 bg-slate-900 border border-slate-750 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-450 text-slate-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
