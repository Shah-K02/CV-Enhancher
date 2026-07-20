import fs from 'fs';
import path from 'path';

const files = {
  "src/index.css": `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-[#09101f] text-white font-inter antialiased;
    font-family: 'Inter', system-ui, sans-serif;
  }
  
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #09101f; }
  ::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.4); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(99, 102, 241, 0.7); }
}

@layer components {
  .glass {
    background: rgba(255, 255, 255, 0.04);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  
  .glass-strong {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.12);
  }
  
  .gradient-text {
    background: linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .btn-primary {
    @apply bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl px-6 py-3 transition-all duration-200 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98];
  }
  
  .btn-secondary {
    @apply glass hover:bg-white/10 text-white font-medium rounded-xl px-6 py-3 transition-all duration-200 hover:border-indigo-500/40;
  }
  
  .input-field {
    @apply w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/8 transition-all duration-200;
  }
  
  .card {
    @apply glass rounded-2xl p-6;
  }
  
  .score-green { @apply text-emerald-400; }
  .score-amber { @apply text-amber-400; }
  .score-red { @apply text-red-400; }
}

@layer utilities {
  .font-inter { font-family: 'Inter', system-ui, sans-serif; }
  .bg-white\\/8 { background: rgba(255,255,255,0.08); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-12px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.5); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
.animate-slide-in { animation: slideIn 0.3s ease-out forwards; }
.animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
.animate-spin-slow { animation: spin-slow 3s linear infinite; }

.shimmer {
  background: linear-gradient(90deg, rgba(255,255,255,0.0) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.0) 100%);
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}`,

  "src/utils/constants.ts": `export const API_ROUTES = {
  AUTH: { REGISTER: '/api/v1/auth/register', LOGIN: '/api/v1/auth/login', ME: '/api/v1/auth/me' },
  CVS: { BASE: '/api/v1/cvs', UPLOAD: '/api/v1/cvs/upload' },
  ANALYSIS: (cvId: string) => ({ 
    ANALYSE: \`/api/v1/analysis/\${cvId}/analyse\`,
    HISTORY: \`/api/v1/analysis/\${cvId}/history\`,
    MATCH_JD: \`/api/v1/analysis/\${cvId}/match-jd\`
  }),
  CHAT: (cvId: string) => ({
    MESSAGE: \`/api/v1/chat/\${cvId}/message\`,
    HISTORY: \`/api/v1/chat/\${cvId}/history\`,
    CLEAR: \`/api/v1/chat/\${cvId}/history\`
  })
};

export const SCORE_THRESHOLDS = { GOOD: 70, FAIR: 40 };

export const EXAMPLE_CHAT_PROMPTS = [
  "Do I have enough experience for a junior software engineer role?",
  "What are the biggest weaknesses in my CV?",
  "Rewrite my most recent job description to be more impactful",
  "What skills should I learn to improve my employability?",
  "How does my CV compare to typical software engineer requirements?",
  "What achievements could I highlight more strongly?"
];

export const MAX_FILE_SIZE_MB = 10;
export const ACCEPTED_FILE_TYPES = { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] };
`,

  "src/utils/helpers.ts": `export const formatDate = (dateString: string): string => { 
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
export const formatRelativeTime = (dateString: string): string => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return \`\${hours} hours ago\`;
  return \`\${Math.floor(hours/24)} days ago\`;
}
export const getScoreColor = (score: number): string => { 
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-amber-400';
  return 'text-red-400';
}
export const getScoreBg = (score: number): string => { 
  if (score >= 70) return 'bg-emerald-400';
  if (score >= 40) return 'bg-amber-400';
  return 'bg-red-400';
}
export const getScoreLabel = (score: number): string => { 
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Work';
}
export const truncateText = (text: string, maxLength: number): string => { 
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
export const formatFileSize = (bytes: number): string => { 
  const mb = bytes / (1024 * 1024);
  return \`\${mb.toFixed(1)} MB\`;
}
export const getFileTypeIcon = (filename: string): 'pdf' | 'docx' => { 
  return filename.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
}
`,

  "src/api/client.ts": `import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (!['/login', '/register', '/'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
`,

  "src/store/authStore.ts": `import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => set({ user, token, isAuthenticated: true }),
      clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'cv_enhancer_token' }
  )
);
`,

  "src/types/index.ts": `export interface User { id: string; name: string; email: string; created_at: string; }
export interface TokenResponse { access_token: string; token_type: string; user: User; }
export interface CVDocument { id: string; filename: string; word_count: number | null; upload_date: string; is_embedded: boolean; extracted_text_preview?: string; }
export interface AnalysisSectionFeedback { name: string; score: number; feedback: string[]; suggestions: string[]; }
export interface CVAnalysisResponse { id: string; cv_id: string; overall_score: number; sections: AnalysisSectionFeedback[]; analysis_type: string; created_at: string; }
export interface JDMatchResponse { match_score: number; missing_keywords: string[]; recommendations: string[]; tailoring_summary: string; }
export interface ChatMessage { id: string; role: 'user' | 'assistant'; content: string; created_at: string; }
export interface ChatHistoryResponse { cv_id: string; messages: ChatMessage[]; }
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(process.cwd(), filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log("gen1 done");
