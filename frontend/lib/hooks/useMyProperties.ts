'use client';

import { useQuery } from '@tanstack/react-query';

export function useMyProperties() {
  return useQuery({
    queryKey: ['myProperties'],
    queryFn: async () => {
      const properties = [
        { id: '1', ville: {nom: 'Kinshasa'}, quartier: {nom: 'Gombe'}, commune: 'Gombe', type: 'HOUSE', status: 'AVAILABLE', price: 250000, photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'] },
        { id: '2', ville: {nom: 'Kinshasa'}, quartier: {nom: 'Limete'}, commune: 'Limete', type: 'APARTMENT', status: 'AVAILABLE', price: 85000, photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'] },
        { id: '3', ville: {nom: 'Kinshasa'}, quartier: {nom: 'Ngaliema'}, commune: 'Ngaliema', type: 'LAND', status: 'AVAILABLE', price: 45000, surface: 450, photos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'] },
      ];
      return properties;
    },
  });
}

