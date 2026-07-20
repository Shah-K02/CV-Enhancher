import React, { useState } from 'react';
import { useCVs } from '../hooks/useCVs';
import { CVList } from '../components/cv/CVList';
import { CVUploadZone } from '../components/cv/CVUploadZone';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export const CVsListPage: React.FC = () => {
  const { cvs, isLoading, deleteCV, isDeleting, uploadCV, isUploading } = useCVs();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">My CVs</h1>
          <p className="text-slate-400">Manage all your uploaded resumes</p>
        </div>
        {!showUpload && (
          <Button onClick={() => setShowUpload(true)} icon={<Plus size={18} />}>
            Upload New
          </Button>
        )}
      </div>

      {(showUpload || (cvs.length === 0 && !isLoading)) && (
        <div className="mb-8">
          <CVUploadZone onUpload={async (file) => { await uploadCV(file); setShowUpload(false); }} isUploading={isUploading} />
        </div>
      )}

      <CVList cvs={cvs} isLoading={isLoading} onDelete={deleteCV} isDeleting={isDeleting} />
    </div>
  );
};
