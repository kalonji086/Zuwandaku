"use client";

import { useState, useEffect } from 'react';

export interface Booking {
  id: string;
  guestName: string;
  guestEmail?: string;
  guestPhone?: string;
  roomNumber: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  totalAmount: number;
  status: 'Confirmée' | 'En attente' | 'Check-in' | 'Check-out';
}

export function useReservations(filters: { search?: string; status?: string } = {}) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    // Mock data - replace with apiClient.getBookings(filters)
    setTimeout(() => {
      setBookings([
        {
          id: 'RB001',
          guestName: 'Marie Dubois',
          guestEmail: 'marie@example.com',
          roomNumber: '101',
          roomId: '1',
          checkInDate: '2024-12-15',
          checkOutDate: '2024-12-18',
          totalAmount: 750,
          status: 'Confirmée'
        },
        {
          id: 'RB002',
          guestName: 'Paul Martin',
          roomNumber: '203',
          roomId: '2',
          checkInDate: '2024-12-16',
          checkOutDate: '2024-12-19',
          totalAmount: 450,
          status: 'En attente'
        },
        {
          id: 'RB003',
          guestName: 'Sophie Laurent',
          roomNumber: '105',
          roomId: '3',
          checkInDate: '2024-12-17',
          checkOutDate: '2024-12-20',
          totalAmount: 300,
          status: 'Check-in'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, [filters.search, filters.status]);

  return { bookings, loading, error };
}

