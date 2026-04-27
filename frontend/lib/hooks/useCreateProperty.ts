import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreatePropertyPayload {
  type: string;
  price: number;
  description?: string;
  commune: string;
  quartier: string;
  rue?: string;
  surface?: number;
  chambres?: number;
  status: string;
  provinceId?: string;
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreatePropertyPayload) => {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur lors de la publication');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-properties'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
}
