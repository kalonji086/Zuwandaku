import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useDisableAccount = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (password: string) => {
      // Mock API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (password !== 'commissionnaire123') {
        throw new Error('Mot de passe incorrect');
      }

      // Mock success
      return { success: true, message: 'Compte désactivé définitivement' };
    },
    onSuccess: (data) => {
      queryClient.clear(); // Clear cache
      alert(data.message);
      router.push('/login');
      router.refresh();
    },
    onError: (error) => {
      alert(error.message);
    }
  });
};

