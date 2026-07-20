import React from 'react';
import { cn } from './Button';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);
    
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
        <div className="relative">
          {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">{icon}</div>}
          <input
            id={inputId}
            ref={ref}
            className={cn('input-field', icon && 'pl-10', error && 'border-red-500/50 focus:border-red-500', className)}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-slate-400">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
