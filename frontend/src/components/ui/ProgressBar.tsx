import React, { useEffect, useState } from 'react';
import { cn } from './Button';
import { getScoreBg } from '../../utils/helpers';

export const ProgressBar: React.FC<{ score: number; className?: string }> = ({ score, className }) => {
  const [width, setWidth] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => setWidth(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  return (
    <div className={cn('h-2 w-full bg-white/5 rounded-full overflow-hidden', className)}>
      <div 
        className={cn('h-full transition-all duration-1000 ease-out rounded-full', getScoreBg(score))}
        style={{ width: `${width}%` }}
      />
    </div>
  );
};
