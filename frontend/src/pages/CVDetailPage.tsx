import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useCVs } from '../hooks/useCVs';
import { formatRelativeTime } from '../utils/helpers';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const CVDetailPage: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>();
  const { cvs, isLoading } = useCVs();
  
  if (isLoading) return <div className="text-white p-8 text-center animate-pulse">Loading...</div>;
  
  const cv = cvs.find(c => c.id === cvId);
  if (!cv) return <Navigate to="/cvs" />;

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="flex items-center justify-between border-indigo-500/20 bg-indigo-500/5">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">{cv.filename}</h1>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 text-sm">Uploaded {formatRelativeTime(cv.upload_date)}</span>
            {cv.word_count && <Badge variant="ghost">{cv.word_count} words</Badge>}
            <Badge variant={cv.is_embedded ? 'success' : 'warning'}>{cv.is_embedded ? 'Ready for AI' : 'Processing...'}</Badge>
          </div>
        </div>
      </Card>
      {/* Content will be rendered by nested routes usually, but for simple routing we can just use the pages below directly via URL */}
    </div>
  );
};
