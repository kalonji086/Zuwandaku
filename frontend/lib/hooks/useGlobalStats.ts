import { useQuery } from '@tanstack/react-query';

export interface GlobalStats {
  totalProperties: number;
  totalVehicles: number;
  totalContracts: number;
  totalRevenue: number;
  activeUsers: number;
  commissionRate: number;
}

const GLOBAL_STATS_MOCK: GlobalStats = {
  totalProperties: 28,
  totalVehicles: 15,
  totalContracts: 42,
  totalRevenue: 285000000,
  activeUsers: 156,
  commissionRate: 0.05
};

export const useGlobalStats = () => useQuery<GlobalStats>({
  queryKey: ['globalStats'],
  queryFn: () => Promise.resolve(GLOBAL_STATS_MOCK),
});

