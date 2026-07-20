import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="h-16 w-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-4">
      <Icon className="h-8 w-8 text-indigo-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-slate-400 max-w-sm mx-auto mb-6">{description}</p>
    {action && <Button onClick={action.onClick}>{action.label}</Button>}
  </div>
);
