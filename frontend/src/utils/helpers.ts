export const formatDate = (dateString: string): string => { 
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
export const formatRelativeTime = (dateString: string): string => {
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours/24)} days ago`;
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
  return `${mb.toFixed(1)} MB`;
}
export const getFileTypeIcon = (filename: string): 'pdf' | 'docx' => { 
  return filename.toLowerCase().endsWith('.pdf') ? 'pdf' : 'docx';
}
