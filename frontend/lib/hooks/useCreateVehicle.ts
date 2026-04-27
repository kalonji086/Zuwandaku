import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CreateVehiclePayload {
  marque: string;
  modele: string;
  annee: number;
  type: string;
  pricePerDay?: number;
  priceSale?: number;
  provinceId?: string;
  description?: string;
  availability: boolean;
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateVehiclePayload) => {
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Erreur lors de la création');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-vehicles'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
}
