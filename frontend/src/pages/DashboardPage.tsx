import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Activity, Upload, Brain } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCVs } from '../hooks/useCVs';
import { Card } from '../components/ui/Card';
import { CVCard } from '../components/cv/CVCard';
import { CVUploadZone } from '../components/cv/CVUploadZone';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { cvs, isLoading, deleteCV, isDeleting, uploadCV, isUploading } = useCVs();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">{greeting}, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-400 mt-2">Here's what's happening with your job applications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
          <div className="p-4 bg-indigo-500/20 rounded-2xl text-indigo-400"><FileText size={24} /></div>
          <div><p className="text-sm text-slate-400">Total CVs</p><h3 className="text-2xl font-bold text-white">{isLoading ? '-' : cvs.length}</h3></div>
        </Card>
        <Card className="flex items-center gap-4 bg-gradient-to-br from-violet-500/10 to-transparent border-violet-500/20">
          <div className="p-4 bg-violet-500/20 rounded-2xl text-violet-400"><Activity size={24} /></div>
          <div><p className="text-sm text-slate-400">Analyses Run</p><h3 className="text-2xl font-bold text-white">0</h3></div>
        </Card>
        <Card className="flex items-center gap-4 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <div className="p-4 bg-emerald-500/20 rounded-2xl text-emerald-400"><Brain size={24} /></div>
          <div><p className="text-sm text-slate-400">AI Readiness</p><h3 className="text-2xl font-bold text-white">100%</h3></div>
        </Card>
      </div>

      {cvs.length === 0 && !isLoading ? (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Let's get started</h2>
          <CVUploadZone onUpload={uploadCV} isUploading={isUploading} />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Recent CVs</h2>
            <Link to="/cvs" className="text-sm text-indigo-400 hover:text-indigo-300">View all</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [1, 2, 3].map(i => <SkeletonLoader key={i} className="h-48" />)
            ) : (
              cvs.slice(0, 3).map(cv => (
                <CVCard key={cv.id} cv={cv} onDelete={deleteCV} isDeleting={isDeleting} />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
