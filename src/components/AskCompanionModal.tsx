import React, { useState } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Companion } from '../types';
import { TypingText } from './TypingText';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#F4F1FA] border border-[#E7E1F0] rounded-3xl p-5 shadow-2xl relative text-stone-900 flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E7E1F0]">
          <div className="flex items-center gap-2">
            <img
              src={companion.avatarUrl}
              alt={companion.name}
              className="w-6 h-6 rounded-full object-cover border border-emerald-500/40"
            />
            <div className="text-xs">
              <span className="font-bold text-stone-900">问问 {companion.name}</span>
              <span className="text-[10px] text-stone-500 ml-1.5">{companion.type}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white hover:bg-[#F0ECF8] flex items-center justify-center text-stone-500 hover:text-stone-900 border border-[#E7E1F0] transition-colors cursor-pointer shadow-xs"
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
                    ? 'bg-emerald-600 text-white font-medium rounded-tr-xs shadow-xs'
                    : 'bg-white text-stone-800 border border-[#E7E1F0] rounded-tl-xs shadow-xs'
                }`}
              >
                {msg.sender === 'companion' ? <TypingText text={msg.text} /> : msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="py-2 border-t border-[#E7E1F0]">
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mb-1.5 font-medium">
            <Sparkles size={11} className="text-emerald-600" />
            <span>大家常问</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-[#F0ECF8] text-stone-700 hover:text-stone-900 border border-[#E7E1F0] transition-colors text-left truncate max-w-full shadow-xs cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Composer */}
        <div className="mt-2 flex items-center gap-1.5 pt-2 border-t border-[#E7E1F0]">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder={`问问 ${companion.name} 关于这段文字的疑问...`}
            className="flex-1 bg-white border border-[#E7E1F0] rounded-xl px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 shadow-xs"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim()}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-550 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
