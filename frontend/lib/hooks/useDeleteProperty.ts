import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['myProperties'] }),
  });
};
