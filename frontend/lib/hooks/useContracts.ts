import { useQuery } from '@tanstack/react-query';

export const useContracts = (filters?: { role?: string }) => useQuery({
  queryKey: ['contracts', filters],
  queryFn: async () => {
    const contracts = [
      { id: '1', title: 'Location Villa Gombe - Jean Dupont', status: 'ACTIVE', client: 'Jean Dupont', amount: 2500000, startDate: '2024-01-15', endDate: '2024-12-31', type: 'Location' },
      { id: '2', title: 'Vente Toyota Prado - Marie Kabila', status: 'PENDING', client: 'Marie Kabila', amount: 45000000, startDate: '2024-03-10', endDate: '2024-09-10', type: 'Vente' },
    ];
    return contracts;
  },
});
