import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnalysis } from '../hooks/useAnalysis';
import { JDMatchResults } from '../components/analysis/JDMatchResults';
import { Button } from '../components/ui/Button';
import { Target, ArrowLeft } from 'lucide-react';

export const JDMatchPage: React.FC = () => {
  const { cvId } = useParams<{ cvId: string }>();
  const { matchJD, isMatching } = useAnalysis(cvId);
  const [jd, setJd] = useState('');
  const [result, setResult] = useState<any>(null);

  const handleMatch = async () => {
    if (!jd.trim()) return;
    const res = await matchJD(jd);
    setResult(res);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <Link to="/cvs" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm mb-2"><ArrowLeft size={16} /> Back to CVs</Link>
      
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-4"><Target size={32} /></div>
        <h1 className="text-3xl font-bold text-white mb-2">Job Description Match</h1>
        <p className="text-slate-400">See how well your CV aligns with a specific role</p>
      </div>

      {!result && (
        <div className="glass p-6 rounded-3xl space-y-4">
          <textarea
            value={jd}
            onChange={e => setJd(e.target.value)}
            placeholder="Paste the full job description here..."
            className="w-full h-64 bg-black/20 border border-white/10 rounded-2xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
          />
          <div className="flex justify-end">
            <Button onClick={handleMatch} disabled={!jd.trim()} isLoading={isMatching} className="bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25">
              Analyse Match
            </Button>
          </div>
        </div>
      )}

      {isMatching && (
        <div className="py-12 text-center text-slate-400 animate-pulse">
          Comparing your CV against the job description...
        </div>
      )}

      {result && !isMatching && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button variant="secondary" size="sm" onClick={() => setResult(null)}>Run Another Match</Button>
          </div>
          <JDMatchResults result={result} />
        </div>
      )}
    </div>
  );
};
