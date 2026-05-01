import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'PROPRIETAIRE' | 'COMMISSIONNAIRE' | 'HOTEL';
  phone: string;
  address: string;
  cni?: string;
  siret?: string;
  licenseNumber?: string;
}

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.register(data);
      const { access_token, user } = response.data;
      // Stocker token dans localStorage ET cookie pour le middleware
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      document.cookie = `access_token=${access_token}; path=/; max-age=${7 * 24 * 3600}; SameSite=Strict`;
      return response.data;
    },
  });
};

