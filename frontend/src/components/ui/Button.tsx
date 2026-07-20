import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, icon, iconPosition = 'left', children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      danger: 'bg-red-500/20 text-red-500 hover:bg-red-500/30 border border-red-500/30',
      ghost: 'hover:bg-white/10 text-white',
    };
    
    const sizes = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-6 py-3',
      lg: 'text-lg px-8 py-4',
    };

    return (
      <button ref={ref} className={cn(baseStyles, variants[variant], sizes[size], className)} disabled={disabled || isLoading} {...props}>
        {isLoading && <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {!isLoading && icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
        {children}
        {!isLoading && icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
      </button>
    );
  }
);
Button.displayName = 'Button';
