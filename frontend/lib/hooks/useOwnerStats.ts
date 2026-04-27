import { useQuery } from '@tanstack/react-query';

export const useOwnerStats = () => useQuery({
  queryKey: ['ownerStats'],
  queryFn: () => Promise.resolve({ properties: 8, vehicles: 2, revenue: 125000 }),
});
