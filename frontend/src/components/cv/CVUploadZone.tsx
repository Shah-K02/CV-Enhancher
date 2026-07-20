import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileType, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '../ui/Button';

interface Props {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export const CVUploadZone: React.FC<Props> = ({ onUpload, isUploading }) => {
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: any[]) => {
    setError(null);
    if (fileRejections.length > 0) {
      setError(fileRejections[0].errors[0].message);
      return;
    }
    if (acceptedFiles.length > 0) {
      try {
        await onUpload(acceptedFiles[0]);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Upload failed');
      }
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    }
  });

  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={cn(
          'glass rounded-2xl border-2 border-dashed p-10 transition-all duration-300 text-center cursor-pointer',
          isDragActive ? 'border-indigo-400 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-white/20 hover:border-indigo-500/50 hover:bg-white/5',
          isUploading && 'opacity-50 cursor-not-allowed pointer-events-none'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-4">
          {isUploading ? (
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent" />
          ) : (
            <div className="p-4 bg-white/5 rounded-full">
              <UploadCloud className="h-8 w-8 text-indigo-400" />
            </div>
          )}
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">
              {isDragActive ? 'Drop your CV here' : isUploading ? 'Uploading...' : 'Click or drag to upload'}
            </h3>
            <p className="text-slate-400 text-sm">PDF or DOCX up to 10MB</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      
      {acceptedFiles.length > 0 && !error && !isUploading && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400 text-sm">
          <CheckCircle size={16} />
          {acceptedFiles[0].name} uploaded successfully!
        </div>
      )}
    </div>
  );
};
