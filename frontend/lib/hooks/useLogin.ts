import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

interface LoginData {
  email: string;
  password: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.login(data);
      const { access_token, user } = response.data;
      // Stocker token dans localStorage ET cookie pour le middleware
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `access_token=${access_token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
      return response.data;
    },
  });
  return { ...mutation, queryClient };
};

export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.cookie = 'access_token=; path=/; max-age=0';
    window.location.href = '/login';
  };
  return { logout };
};
