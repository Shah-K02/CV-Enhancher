import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, MessageSquare, ArrowRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#09101f] text-white relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
      
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-indigo-500" />
          <span className="text-2xl font-bold gradient-text">CV Assistant</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="text-slate-300 hover:text-white px-4 py-2 font-medium transition-colors">Sign In</Link>
          <Link to="/register" className="btn-primary py-2 px-5 text-sm">Get Started</Link>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Powered by GPT-4o
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Your AI-Powered <br/>
          <span className="gradient-text">Career Assistant</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload your CV and let AI analyse, optimise, and tailor it for every job application. Stop guessing and start landing interviews.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-24">
          <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2">
            Get Started Free <ArrowRight size={20} />
          </Link>
          <a href="#features" className="btn-secondary text-lg px-8 py-4">View Features</a>
        </div>

        <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
            <div className="h-12 w-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
              <Brain size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Deep AI Analysis</h3>
            <p className="text-slate-400 leading-relaxed">Get comprehensive feedback on your CV structure, impact, and wording. Uncover strengths and fix weaknesses instantly.</p>
          </div>
          
          <div className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
            <div className="h-12 w-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6">
              <Target size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Job Matching</h3>
            <p className="text-slate-400 leading-relaxed">Paste any job description and let our AI compare it against your CV to find missing keywords and tailor your application perfectly.</p>
          </div>
          
          <div className="glass p-8 rounded-3xl hover:-translate-y-1 transition-transform duration-300">
            <div className="h-12 w-12 bg-violet-500/20 text-violet-400 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-3">Interactive Chat</h3>
            <p className="text-slate-400 leading-relaxed">Ask your CV anything. Prepare for interview questions, generate cover letters, or ask for specific rewrites in real-time.</p>
          </div>
        </div>
      </main>
    </div>
  );
};
