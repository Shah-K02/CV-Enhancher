import React, { useState } from 'react';
import { Check, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { AnalysisSectionFeedback } from '../../types';

export const SectionCard: React.FC<{ section: AnalysisSectionFeedback }> = ({ section }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="flex flex-col animate-fade-in p-5">
      <div 
        className="flex items-center justify-between cursor-pointer group mb-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="w-full pr-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">{section.name}</h4>
            <span className="text-sm font-medium text-slate-300">{section.score}/100</span>
          </div>
          <ProgressBar score={section.score} className="h-1.5" />
        </div>
        <div className="p-1.5 bg-white/5 rounded-lg text-slate-400 group-hover:bg-white/10 group-hover:text-white transition-all">
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-5 mt-2 pt-4 border-t border-white/5 animate-slide-in">
          {section.feedback.length > 0 && (
            <div>
              <h5 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Strengths & Feedback</h5>
              <ul className="space-y-2">
                {section.feedback.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {section.suggestions.length > 0 && (
            <div>
              <h5 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Actionable Suggestions</h5>
              <ul className="space-y-2">
                {section.suggestions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300 bg-indigo-500/5 p-2 rounded-lg">
                    <ArrowRight size={16} className="text-indigo-400 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
