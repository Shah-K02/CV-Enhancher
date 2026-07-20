import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Brain, LogOut } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, clearAuth } = useAuthStore();
  const location = useLocation();

  const handleLogout = () => {
    clearAuth();
    window.location.href = '/login';
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-strong border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <div className="p-2 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
                <Brain className="h-6 w-6 text-indigo-400" />
              </div>
              <span className="text-xl font-bold gradient-text hidden sm:block">CV Assistant</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/dashboard' ? 'text-indigo-400' : 'text-slate-300'}`}>Dashboard</Link>
            <Link to="/cvs" className={`text-sm font-medium transition-colors hover:text-indigo-400 ${location.pathname === '/cvs' ? 'text-indigo-400' : 'text-slate-300'}`}>My CVs</Link>
            {user && (
              <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold text-white shadow-lg shadow-indigo-500/20">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <button onClick={handleLogout} className="text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
