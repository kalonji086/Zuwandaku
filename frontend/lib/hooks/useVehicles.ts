import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

interface VehicleFilters {
  provinceId?: string;
  type?: string;
}

export function useVehicles(filters?: VehicleFilters) {
  return useQuery({
    queryKey: ['vehicles', filters],
    queryFn: async () => {
      try {
        const res = await apiClient.getVehicles(filters);
        return res.data ?? [];
      } catch {
        return [];
      }
    },
    enabled: filters !== undefined,
  });
}
