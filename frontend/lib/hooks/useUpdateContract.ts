import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => ({ id, ...data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contracts'] }),
  });
};
