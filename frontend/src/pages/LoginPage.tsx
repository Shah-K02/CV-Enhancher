import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Brain, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-[#09101f] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md animate-fade-in z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="p-2 bg-indigo-500/20 rounded-xl"><Brain className="text-indigo-400" /></div>
            <span className="text-2xl font-bold gradient-text">CV Assistant</span>
          </Link>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-slate-400">Sign in to continue optimizing your career</p>
        </div>

        <div className="glass-strong rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
            
            <Input 
              type="email" 
              label="Email Address" 
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={18} />}
              required
            />
            
            <Input 
              type="password" 
              label="Password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={18} />}
              required
            />
            
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-white/5 border-white/10 text-indigo-500 focus:ring-indigo-500/50" />
                <span className="text-slate-300">Remember me</span>
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300">Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" className="w-full mt-6" isLoading={isLoggingIn} icon={<ArrowRight size={18} />} iconPosition="right">
              Sign In
            </Button>
          </form>

          <p className="text-center text-slate-400 mt-6 text-sm">
            Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
