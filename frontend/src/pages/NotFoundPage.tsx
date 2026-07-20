import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => (
  <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-9xl font-bold gradient-text mb-4">404</h1>
    <h2 className="text-3xl font-bold text-white mb-6">Page not found</h2>
    <p className="text-slate-400 mb-8 max-w-md mx-auto">The page you are looking for doesn't exist or has been moved.</p>
    <Link to="/" className="btn-primary flex items-center gap-2">
      Back to Home <ArrowRight size={18} />
    </Link>
  </div>
);
