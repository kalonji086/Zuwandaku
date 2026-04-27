import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './api-client';

export const useLogout = () => {
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };
  return { logout };
};

// ROOMS
const ROOMS_MOCK = [
  { id: '1', number: '101', type: 'Suite Deluxe', price: 250, status: 'AVAILABLE' as const, maxGuests: 2, amenities: ['AC', 'WiFi', 'TV', 'Mini-bar'], photos: ['https://images.unsplash.com/photo-1571896349840-6480a9a536ef?w=400'] },
  { id: '2', number: '102', type: 'Chambre Standard', price: 150, status: 'OCCUPIED' as const, maxGuests: 1, amenities: ['AC', 'WiFi'], photos: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'], guest: 'Jean Dupont' },
  { id: '3', number: '201', type: 'Suite Présidentielle', price: 450, status: 'AVAILABLE' as const, maxGuests: 4, amenities: ['AC', 'WiFi', 'TV', 'Jacuzzi', 'Vue lac'], photos: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'] },
  { id: '4', number: '103', type: 'Chambre Economy', price: 100, status: 'MAINTENANCE' as const, maxGuests: 1, amenities: ['WiFi'], photos: ['https://images.unsplash.com/photo-1578683015141-399f1e8aaf6f?w=400'] }
];

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  maxGuests: number;
  amenities: string[];
  photos: string[];
  guest?: string;
}

export const useRooms = (filters?: { status?: Room['status']; search?: string }) => useQuery({
  queryKey: ['rooms', filters],
  queryFn: () => {
    let data = ROOMS_MOCK as Room[];
    if (filters?.status) data = data.filter(room => room.status === filters.status);
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(room => room.number.toLowerCase().includes(searchLower) || room.type.toLowerCase().includes(searchLower));
    }
    return data;
  }
});

export const useRoom = (id: string) => useQuery({
  queryKey: ['room', id],
  queryFn: () => (ROOMS_MOCK as Room[]).find(room => room.id === id),
  enabled: !!id,
});

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Room, 'id'>) => {
      const newRoom = { id: Math.random().toString(36).slice(2), ...data };
      return newRoom;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Room> }) => ({ id, ...data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
};

// VEHICLES
export interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: number;
  province: string;
  price: number;
  status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE';
  photos: string[];
}

const VEHICLES_MOCK = [
  { id: '1', marque: 'Toyota', modele: 'Prado TX', annee: 2022, carburant: 'Diesel', transmission: 'Auto', kilometrage: 45000, province: 'Kinshasa', pricePerDay: 120, priceSale: null, type: 'LOCATION', availability: true, photos: [], description: 'SUV 4x4 climatisé, idéal pour la ville et la brousse' },
  { id: '2', marque: 'Mercedes', modele: 'Sprinter', annee: 2021, carburant: 'Diesel', transmission: 'Manuel', kilometrage: 80000, province: 'Lubumbashi', pricePerDay: 200, priceSale: null, type: 'LOCATION', availability: false, photos: [], description: 'Minibus 15 places, parfait pour les transferts' },
  { id: '3', marque: 'Honda', modele: 'CR-V', annee: 2023, carburant: 'Essence', transmission: 'Auto', kilometrage: 12000, province: 'Kinshasa', pricePerDay: null, priceSale: 38000, type: 'VENTE', availability: true, photos: [], description: 'SUV compact en excellent état, première main' },
  { id: '4', marque: 'Mitsubishi', modele: 'L200', annee: 2020, carburant: 'Diesel', transmission: 'Manuel', kilometrage: 95000, province: 'Kinshasa', pricePerDay: 90, priceSale: null, type: 'LOCATION', availability: true, photos: [], description: 'Pick-up robuste pour tous terrains' },
  { id: '5', marque: 'Hyundai', modele: 'Tucson', annee: 2022, carburant: 'Essence', transmission: 'Auto', kilometrage: 30000, province: 'Goma', pricePerDay: null, priceSale: 28000, type: 'VENTE', availability: true, photos: [], description: 'Crossover moderne, très bon état général' },
  { id: '6', marque: 'Ford', modele: 'Ranger', annee: 2021, carburant: 'Diesel', transmission: 'Auto', kilometrage: 55000, province: 'Kinshasa', pricePerDay: 110, priceSale: null, type: 'LOCATION', availability: true, photos: [], description: 'Pick-up double cabine, idéal chantier' },
  { id: '7', marque: 'Nissan', modele: 'Patrol', annee: 2019, carburant: 'Diesel', transmission: 'Auto', kilometrage: 120000, province: 'Kinshasa', pricePerDay: null, priceSale: 22000, type: 'VENTE', availability: true, photos: [], description: 'Grand SUV 7 places, moteur V8' },
  { id: '8', marque: 'Kia', modele: 'Sportage', annee: 2023, carburant: 'Essence', transmission: 'Auto', kilometrage: 8000, province: 'Lubumbashi', pricePerDay: 85, priceSale: null, type: 'LOCATION', availability: true, photos: [], description: 'SUV compact neuf, confort premium' },
];

export const useVehicles = (filters?: { provinceId?: string; type?: string; search?: string }) => useQuery({
  queryKey: ['vehicles', filters],
  queryFn: async () => {
    let data = [...VEHICLES_MOCK];
    if (filters?.type) data = data.filter(v => v.type === filters.type);
    if (filters?.provinceId) data = data.filter(v => v.province.toLowerCase().includes(filters.provinceId!.toLowerCase()));
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(v => v.marque.toLowerCase().includes(s) || v.modele.toLowerCase().includes(s) || String(v.annee).includes(s));
    }
    return data;
  }
});

export const useVehicle = (id: string) => useQuery({
  queryKey: ['vehicle', id],
  queryFn: () => (VEHICLES_MOCK as Vehicle[]).find(v => v.id === id),
  enabled: !!id,
});

// PROPERTIES
export interface Property {
  id: string;
  quartier: string;
  commune: string;
  description: string;
  price: number;
  type: 'HOUSE' | 'APARTMENT' | 'LAND';
  status: 'AVAILABLE' | 'SOLD';
  photos: string[];
}

const PROPERTIES_MOCK = [
  { id: '1', quartier: 'Gombe', commune: 'Gombe', description: 'Villa moderne 4 chambres avec piscine et garage', price: 250000, type: 'MAISON', status: 'AVAILABLE', photos: [], chambres: 4, sallesDeBain: 2, surface: 350, parking: true, transactionType: 'VENTE' },
  { id: '2', quartier: 'Limete', commune: 'Limete', description: 'Appartement F3 rénové au 2ème étage', price: 1200, type: 'APPARTEMENT', status: 'AVAILABLE', photos: [], chambres: 3, sallesDeBain: 1, surface: 95, etage: 2, transactionType: 'LOCATION' },
  { id: '3', quartier: 'Ngaliema', commune: 'Ngaliema', description: 'Parcelle 15×30m terrain plat vue lac', price: 45000, type: 'PARCELLE', status: 'AVAILABLE', photos: [], surface: 450, titreFoncier: true, transactionType: 'VENTE' },
  { id: '4', quartier: 'Masina', commune: 'Masina', description: 'Maison 3 chambres terrain 800m² clôturée', price: 800, type: 'MAISON', status: 'AVAILABLE', photos: [], chambres: 3, sallesDeBain: 1, surface: 800, transactionType: 'LOCATION' },
  { id: '5', quartier: 'Kalamu', commune: 'Kalamu', description: 'Appartement F2 meublé avec balcon', price: 650, type: 'APPARTEMENT', status: 'RENTED', photos: [], chambres: 2, surface: 65, etage: 1, transactionType: 'LOCATION' },
  { id: '6', quartier: 'Lubumbashi Centre', commune: 'Lubumbashi', description: 'Bureau commercial 200m² rez-de-chaussée', price: 2500, type: 'BUREAU', status: 'AVAILABLE', photos: [], surface: 200, transactionType: 'LOCATION' },
  { id: '7', quartier: 'Montagne', commune: 'Gombe', description: 'Villa de luxe 5 chambres infinity pool', price: 850000, type: 'MAISON', status: 'AVAILABLE', photos: [], chambres: 5, sallesDeBain: 3, surface: 600, parking: true, transactionType: 'VENTE' },
  { id: '8', quartier: 'Kingasani', commune: 'Ndjili', description: 'Parcelle commerciale 30×50m près aéroport', price: 75000, type: 'PARCELLE', status: 'AVAILABLE', photos: [], surface: 1500, titreFoncier: false, transactionType: 'VENTE' },
  { id: '9', quartier: 'Kintambo', commune: 'Kintambo', description: 'Appartement neuf 4 pièces avec ascenseur', price: 1800, type: 'APPARTEMENT', status: 'AVAILABLE', photos: [], chambres: 3, sallesDeBain: 2, surface: 120, etage: 5, transactionType: 'LOCATION' },
  { id: '10', quartier: 'Binza', commune: 'Ngaliema', description: 'Maison familiale 5 chambres avec jardin', price: 1500, type: 'MAISON', status: 'AVAILABLE', photos: [], chambres: 5, sallesDeBain: 2, surface: 400, parking: true, transactionType: 'LOCATION' },
  { id: '11', quartier: 'Lemba', commune: 'Lemba', description: 'Parcelle résidentielle 20×25m viabilisée', price: 28000, type: 'PARCELLE', status: 'AVAILABLE', photos: [], surface: 500, titreFoncier: true, viabilisee: true, transactionType: 'VENTE' },
  { id: '12', quartier: 'Bandalungwa', commune: 'Bandalungwa', description: 'Studio meublé tout confort', price: 400, type: 'APPARTEMENT', status: 'AVAILABLE', photos: [], chambres: 1, surface: 35, etage: 3, transactionType: 'LOCATION' },
];

export const useProperties = (filters?: { type?: string; status?: string; search?: string; provinceId?: string; limit?: number; sort?: string }) => useQuery({
  queryKey: ['properties', filters],
  queryFn: async () => {
    let data = [...PROPERTIES_MOCK];
    if (filters?.type) data = data.filter(p => p.type === filters.type);
    if (filters?.status) data = data.filter(p => p.status === filters.status);
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      data = data.filter(p => p.quartier.toLowerCase().includes(s) || p.commune.toLowerCase().includes(s) || p.description.toLowerCase().includes(s));
    }
    if (filters?.provinceId) data = data.filter(p => p.commune.toLowerCase().includes(filters.provinceId!.toLowerCase()));
    if (filters?.limit) data = data.slice(0, filters.limit);
    return data;
  }
});

export const useProperty = (id: string) => useQuery({
  queryKey: ['property', id],
  queryFn: () => (PROPERTIES_MOCK as Property[]).find(p => p.id === id),
  enabled: !!id,
});

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Omit<Property, 'id'>) => {
      const newProperty = { id: Math.random().toString(36).slice(2), ...data };
      return newProperty;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => ({ id, ...data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => id,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['properties'] }),
  });
};

// CONTRACTS
export interface Contract {
  id: string;
  title: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  client: string;
  amount: number;
  startDate: string;
  endDate: string;
}

const CONTRACTS_MOCK = [
  { id: '1', title: 'Location Villa Gombe - Jean Dupont', status: 'ACTIVE' as const, client: 'Jean Dupont', amount: 2500000, startDate: '2024-01-15', endDate: '2024-12-31' },
  { id: '2', title: 'Vente Toyota Prado - Marie Kabila', status: 'PENDING' as const, client: 'Marie Kabila', amount: 45000000, startDate: '2024-03-10', endDate: '2024-09-10' },
  { id: '3', title: 'Location Appart Limete - Paul Tshisekedi', status: 'ACTIVE' as const, client: 'Paul Tshisekedi', amount: 1200000, startDate: '2024-02-01', endDate: '2024-11-30' },
  { id: '4', title: 'Parcelle Ngaliema - Société XYZ', status: 'EXPIRED' as const, client: 'Société XYZ', amount: 45000000, startDate: '2023-06-01', endDate: '2024-01-31' }
];

export const useContracts = (filters?: { status?: Contract['status']; search?: string; role?: string }) => useQuery({
  queryKey: ['contracts', filters],
  queryFn: async () => {
    let data = CONTRACTS_MOCK as Contract[];
    if (filters?.status) data = data.filter(c => c.status === filters.status);
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      data = data.filter(c => c.title.toLowerCase().includes(searchLower) || c.client.toLowerCase().includes(searchLower));
    }
    return data;
  }
});

// CLIENT STATS
export interface ClientStats {
  activeContracts: number;
  totalContracts: number;
  totalSpent: number;
}

const CLIENT_STATS_MOCK: ClientStats = { activeContracts: 2, totalContracts: 4, totalSpent: 28500000 };

export const useClientStats = () => useQuery({
  queryKey: ['clientStats'],
  queryFn: () => Promise.resolve(CLIENT_STATS_MOCK),
});
