import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis';
import { AnalysisResults } from '../components/analysis/AnalysisResults';
import { Button } from '../components/ui/Button';
import { Brain, ArrowLeft } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';

export const AnalysisPage: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>();
  const { history, isLoadingHistory, analyseCV, isAnalysing } = useAnalysis(cvId);

  const latestResult = history.length > 0 ? history[0] : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/cvs" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-4"><ArrowLeft size={16} /> Back to CVs</Link>
      
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold text-white">CV Analysis</h1>
          <p className="text-slate-400">Get detailed feedback and actionable suggestions</p>
        </div>
        <Button onClick={() => analyseCV()} isLoading={isAnalysing} icon={<Brain size={18} />}>
          {latestResult ? 'Run New Analysis' : 'Analyse My CV'}
        </Button>
      </div>

      {isLoadingHistory || isAnalysing ? (
        <div className="py-24 flex flex-col items-center text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mb-4" />
          <h3 className="text-lg font-semibold text-white">Analysing your CV...</h3>
          <p className="text-slate-400 text-sm mt-2">Our AI is reading your experience and generating feedback. This takes about 15 seconds.</p>
        </div>
      ) : latestResult ? (
        <AnalysisResults result={latestResult} />
      ) : (
        <EmptyState 
          icon={Brain}
          title="No analysis yet"
          description="Run an analysis to get a comprehensive review of your CV."
        />
      )}
    </div>
  );
};
