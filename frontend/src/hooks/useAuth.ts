import { useMutation, useQuery } from '@tanstack/react-query';
import { login as loginApi, register as registerApi, getCurrentUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  const userQuery = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    enabled: isAuthenticated && !user,
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => setAuth(data.user, data.access_token),
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
  });

  return {
    user: user || userQuery.data,
    isAuthenticated,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    logout: clearAuth,
  };
};
