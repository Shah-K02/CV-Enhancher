import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyseCV, fetchAnalysisHistory, matchJD } from '../api/analysis';

export const useAnalysis = (cvId?: string) => {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ['analysis-history', cvId],
    queryFn: () => fetchAnalysisHistory(cvId!),
    enabled: !!cvId,
  });

  const analyseMutation = useMutation({
    mutationFn: () => analyseCV(cvId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['analysis-history', cvId] }),
  });

  const matchMutation = useMutation({
    mutationFn: (jd: string) => matchJD(cvId!, jd),
  });

  return {
    history: historyQuery.data || [],
    isLoadingHistory: historyQuery.isLoading,
    analyseCV: analyseMutation.mutateAsync,
    isAnalysing: analyseMutation.isPending,
    matchJD: matchMutation.mutateAsync,
    isMatching: matchMutation.isPending,
  };
};
