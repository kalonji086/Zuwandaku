import { useQuery } from '@tanstack/react-query';

export interface ClientStats {
  activeContracts: number;
  totalContracts: number;
  totalSpent: number;
}

const CLIENT_STATS_MOCK: ClientStats = {
  activeContracts: 2,
  totalContracts: 4,
  totalSpent: 28500000
};

export const useClientStats = () => {
  return useQuery({
    queryKey: ['clientStats'],
    queryFn: () => Promise.resolve(CLIENT_STATS_MOCK),
  });
};
