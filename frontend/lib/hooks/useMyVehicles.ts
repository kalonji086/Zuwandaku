import { useQuery } from '@tanstack/react-query';

export const useMyVehicles = () => useQuery({
  queryKey: ['myVehicles'],
  queryFn: () => Promise.resolve([
    { id: '1', marque: 'Toyota', modele: 'Prado TX', annee: 2022, type: 'SUV', availability: true, pricePerDay: 150, priceSale: 45000, photos: ['https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400'] },
    { id: '2', marque: 'Mercedes', modele: 'Sprinter', annee: 2021, type: 'Van', availability: false, priceSale: 35000, photos: ['https://images.unsplash.com/photo-1595113316347-602f71ce94af?w=400'] },
  ]),
});
