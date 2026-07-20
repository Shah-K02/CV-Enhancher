export const API_ROUTES = {
  AUTH: { REGISTER: '/api/v1/auth/register', LOGIN: '/api/v1/auth/login', ME: '/api/v1/auth/me' },
  CVS: { BASE: '/api/v1/cvs', UPLOAD: '/api/v1/cvs/upload' },
  ANALYSIS: (cvId: string) => ({ 
    ANALYSE: `/api/v1/analysis/${cvId}/analyse`,
    HISTORY: `/api/v1/analysis/${cvId}/history`,
    MATCH_JD: `/api/v1/analysis/${cvId}/match-jd`
  }),
  CHAT: (cvId: string) => ({
    MESSAGE: `/api/v1/chat/${cvId}/message`,
    HISTORY: `/api/v1/chat/${cvId}/history`,
    CLEAR: `/api/v1/chat/${cvId}/history`
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
