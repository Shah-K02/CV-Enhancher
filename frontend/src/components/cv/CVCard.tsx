import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, FileBadge, Trash2, Brain, MessageSquare, Target, Clock, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CVDocument } from '../../types';
import { formatRelativeTime, formatFileSize } from '../../utils/helpers';

interface Props {
  cv: CVDocument;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const CVCard: React.FC<Props> = ({ cv, onDelete, isDeleting }) => {
  const isPdf = cv.filename.toLowerCase().endsWith('.pdf');

  return (
    <Card hoverable className="group flex flex-col h-full animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className={`p-2.5 rounded-xl ${isPdf ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {isPdf ? <FileText size={24} /> : <FileBadge size={24} />}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white font-medium truncate text-lg" title={cv.filename}>{cv.filename}</h4>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Clock size={12} />
              <span>{formatRelativeTime(cv.upload_date)}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => onDelete(cv.id)}
          disabled={isDeleting}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Badge variant={cv.is_embedded ? 'success' : 'warning'}>
          {cv.is_embedded ? 'Ready' : <><RefreshCw size={10} className="mr-1 animate-spin inline" /> Processing</>}
        </Badge>
        {cv.word_count && <Badge variant="ghost">{cv.word_count} words</Badge>}
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2">
        <Link to={`/cvs/${cv.id}/analyse`} className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors text-slate-300 text-xs gap-1">
          <Brain size={16} /> Analyse
        </Link>
        <Link to={`/cvs/${cv.id}/chat`} className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-violet-500/20 hover:text-violet-300 transition-colors text-slate-300 text-xs gap-1">
          <MessageSquare size={16} /> Chat
        </Link>
        <Link to={`/cvs/${cv.id}/match`} className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors text-slate-300 text-xs gap-1">
          <Target size={16} /> Match JD
        </Link>
      </div>
    </Card>
  );
};
