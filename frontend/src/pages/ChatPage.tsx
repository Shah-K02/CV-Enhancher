import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useChat } from '../hooks/useChat';
import { ChatWindow } from '../components/chat/ChatWindow';
import { ChatInput } from '../components/chat/ChatInput';
import { ArrowLeft, Trash2 } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>();
  const { messages, isLoadingHistory, isSending, sendMessage, clearHistory } = useChat(cvId);

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-dark-900 border border-white/10 rounded-3xl overflow-hidden animate-fade-in relative">
      <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5 glass z-10">
        <Link to="/cvs" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium"><ArrowLeft size={16} /> Back</Link>
        <div className="text-white font-medium">CV Chat Assistant</div>
        <button onClick={() => clearHistory()} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Clear Chat">
          <Trash2 size={18} />
        </button>
      </div>

      {isLoadingHistory ? (
        <div className="flex-1 flex items-center justify-center text-slate-400">Loading chat history...</div>
      ) : (
        <ChatWindow messages={messages} isLoading={isSending} onSendPrompt={sendMessage} />
      )}
      
      <div className="p-4 bg-dark-900/80 backdrop-blur-xl border-t border-white/10">
        <ChatInput onSend={sendMessage} disabled={isSending} />
      </div>
    </div>
  );
};
