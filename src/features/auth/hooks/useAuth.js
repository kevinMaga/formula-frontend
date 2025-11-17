import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setUser, setToken, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      navigate('/dashboard');
    },
  });

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setToken(data.access_token);
      setUser(data.user);
      navigate('/dashboard');
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: () => {
      logout();
      navigate('/login');
    },
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error: loginMutation.error || registerMutation.error,
  };
};