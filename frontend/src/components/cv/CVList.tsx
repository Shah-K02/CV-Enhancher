import React from 'react';
import { FileQuestion } from 'lucide-react';
import { CVCard } from './CVCard';
import { EmptyState } from '../ui/EmptyState';
import { SkeletonLoader } from '../ui/SkeletonLoader';
import { CVDocument } from '../../types';

interface Props {
  cvs: CVDocument[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const CVList: React.FC<Props> = ({ cvs, isLoading, onDelete, isDeleting }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-48" />)}
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <EmptyState 
        icon={FileQuestion}
        title="No CVs yet"
        description="Upload your first CV to start analysing and improving your profile."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cvs.map(cv => (
        <CVCard key={cv.id} cv={cv} onDelete={onDelete} isDeleting={isDeleting} />
      ))}
    </div>
  );
};
