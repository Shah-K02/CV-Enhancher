import React from 'react';
import { ScoreCircle } from './ScoreCircle';
import { SectionCard } from './SectionCard';
import { CVAnalysisResponse } from '../../types';
import { formatDate } from '../../utils/helpers';

export const AnalysisResults: React.FC<{ result: CVAnalysisResponse }> = ({ result }) => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center justify-center p-8 glass-strong rounded-3xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-violet-500/20 blur-3xl rounded-full" />
        
        <ScoreCircle score={result.overall_score} />
        
        <div className="mt-6 text-center z-10">
          <h3 className="text-2xl font-bold text-white mb-2">Overall Analysis</h3>
          <p className="text-slate-400">Generated on {formatDate(result.created_at)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.sections.map((section, i) => (
          <SectionCard key={i} section={section} />
        ))}
      </div>
    </div>
  );
};
