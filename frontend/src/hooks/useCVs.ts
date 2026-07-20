import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCVs, uploadCV, deleteCV } from '../api/cvs';

export const useCVs = () => {
  const queryClient = useQueryClient();

  const cvsQuery = useQuery({
    queryKey: ['cvs'],
    queryFn: fetchCVs,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadCV,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cvs'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCV,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cvs'] }),
  });

  return {
    cvs: cvsQuery.data || [],
    isLoading: cvsQuery.isLoading,
    isError: cvsQuery.isError,
    uploadCV: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteCV: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
};
