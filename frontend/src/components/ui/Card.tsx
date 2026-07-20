import React from 'react';
import { cn } from './Button';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable, glow, children, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(
          'card', 
          hoverable && 'hover:bg-white/10 hover:border-white/20 transition-all duration-300',
          glow && 'relative before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-indigo-500/20 before:blur-xl',
          className
        )} 
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';
