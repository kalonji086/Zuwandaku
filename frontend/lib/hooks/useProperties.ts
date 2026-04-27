import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api-client';

interface PropertyFilters {
  type?: string;
  provinceId?: string;
  status?: string;
}

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      try {
        const res = await apiClient.getProperties(filters);
        return res.data ?? [];
      } catch {
        return [];
      }
    },
    enabled: filters !== undefined,
  });
}
