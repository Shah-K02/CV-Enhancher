import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchChatHistory, sendChatMessage, clearChatHistory } from '../api/chat';

export const useChat = (cvId?: string) => {
  const queryClient = useQueryClient();

  const historyQuery = useQuery({
    queryKey: ['chat-history', cvId],
    queryFn: () => fetchChatHistory(cvId!),
    enabled: !!cvId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => sendChatMessage(cvId!, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat-history', cvId] }),
  });

  const clearMutation = useMutation({
    mutationFn: () => clearChatHistory(cvId!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat-history', cvId] }),
  });

  return {
    messages: historyQuery.data?.messages || [],
    isLoadingHistory: historyQuery.isLoading,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
    clearHistory: clearMutation.mutateAsync,
  };
};
