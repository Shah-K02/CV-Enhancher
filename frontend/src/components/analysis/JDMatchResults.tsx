import React from 'react';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import { JDMatchResponse } from '../../types';

export const JDMatchResults: React.FC<{ result: JDMatchResponse }> = ({ result }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <Card glow className="text-center p-8">
        <h3 className="text-xl text-slate-300 font-medium mb-2">Match Score</h3>
        <div className="text-6xl font-bold gradient-text mb-6">{result.match_score}%</div>
        <ProgressBar score={result.match_score} className="h-3 max-w-md mx-auto" />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <XCircle className="text-red-400" />
            <h4 className="text-lg font-semibold text-white">Missing Keywords</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((kw, i) => (
              <Badge key={i} variant="error">{kw}</Badge>
            ))}
            {result.missing_keywords.length === 0 && <span className="text-slate-400 text-sm">No critical keywords missing!</span>}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-amber-400" />
            <h4 className="text-lg font-semibold text-white">Tailoring Summary</h4>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
            {result.tailoring_summary}
          </p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="text-emerald-400" />
          <h4 className="text-lg font-semibold text-white">Actionable Recommendations</h4>
        </div>
        <div className="space-y-3">
          {result.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-3 p-3 glass rounded-xl">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </div>
              <p className="text-sm text-slate-200">{rec}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
