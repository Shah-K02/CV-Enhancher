import React from 'react';
import { cn } from './Button';

export const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => {
  return <div className={cn('bg-white/5 animate-pulse rounded-md', className)} />;
};
