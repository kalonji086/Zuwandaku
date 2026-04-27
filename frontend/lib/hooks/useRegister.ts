import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../api-client';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'CLIENT' | 'PROPRIETAIRE' | 'COMMISSIONNAIRE';
  phone: string;
  address: string;
  cni?: string;
  siret?: string;
  licenseNumber?: string;
}

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await apiClient.register(data);
      return response.data;
    },
  });
};

