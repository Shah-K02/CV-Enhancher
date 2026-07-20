import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { cn } from '../ui/Button';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput: React.FC<Props> = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto w-full">
      <div className="relative glass rounded-2xl flex items-end p-2 border border-white/10 focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question about your CV..."
          disabled={disabled}
          className="w-full max-h-[120px] bg-transparent text-white placeholder-slate-500 resize-none outline-none py-2 px-3 disabled:opacity-50"
          rows={1}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className={cn(
            "p-2.5 rounded-xl ml-2 transition-all flex-shrink-0",
            input.trim() && !disabled ? "bg-indigo-600 text-white hover:bg-indigo-500" : "bg-white/5 text-slate-500 cursor-not-allowed"
          )}
        >
          <Send size={18} />
        </button>
      </div>
      <div className="mt-2 text-center text-xs text-slate-500">
        Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-sans">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-white/10 rounded font-sans">Shift + Enter</kbd> for newline
      </div>
    </div>
  );
};
