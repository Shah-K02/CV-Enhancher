import React, { useEffect, useState } from 'react';
import { getScoreColor } from '../../utils/helpers';

export const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const [progress, setProgress] = useState(0);
  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(score), 300);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className="relative flex flex-col items-center justify-center animate-fade-in" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/10"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={`transition-all duration-1000 ease-out ${getScoreColor(score)}`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-white">{Math.round(progress)}</span>
        <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">Score</span>
      </div>
    </div>
  );
};
