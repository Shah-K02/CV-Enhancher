import React, { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '../ui/Button';
import { ChatMessage } from '../../types';
import { EXAMPLE_CHAT_PROMPTS } from '../../utils/constants';

interface Props {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendPrompt: (prompt: string) => void;
}

export const ChatWindow: React.FC<Props> = ({ messages, isLoading, onSendPrompt }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-fade-in">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Bot className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ask your CV anything</h2>
          <p className="text-slate-400 mb-8">I've read your CV and I'm ready to answer questions, suggest improvements, or help you prepare for interviews.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {EXAMPLE_CHAT_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSendPrompt(prompt)}
                className="text-left p-4 glass rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors border border-white/5 hover:border-indigo-500/30"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={cn('flex gap-4 animate-slide-in', msg.role === 'user' ? 'flex-row-reverse' : '')}>
              <div className={cn('flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1', msg.role === 'user' ? 'bg-indigo-600' : 'bg-violet-500/20')}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-violet-400" />}
              </div>
              <div className={cn('px-5 py-3.5 rounded-2xl max-w-[85%] shadow-sm', msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'glass text-slate-200 rounded-tl-sm')}>
                <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center mt-1">
                <Bot size={16} className="text-violet-400" />
              </div>
              <div className="px-5 py-4 rounded-2xl glass rounded-tl-sm flex items-center gap-1.5">
                <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-violet-400/50 rounded-full animate-bounce" />
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}
    </div>
  );
};
