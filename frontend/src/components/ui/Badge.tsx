import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'ghost';
}

export const Badge: React.FC<BadgeProps> = ({ variant = 'default', className, children, ...props }) => {
  const variants = {
    default: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    success: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    error: 'bg-red-500/20 text-red-300 border-red-500/30',
    ghost: 'bg-white/5 text-slate-300 border-white/10',
  };

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', variants[variant], className)} {...props}>
      {children}
    </span>
  );
};
