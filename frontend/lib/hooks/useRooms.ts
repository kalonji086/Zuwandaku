"use client";

import { useState, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

export interface Room {
  id: string;
  number: string;
  type: string;
  pricePerNight: number;
  price?: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED' | 'MAINTENANCE';
  maxGuests: number;
  amenities: string[];
  photos: string[];
  guest?: string;
}

export function useRooms(filters: { search?: string; status?: string } = {}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const key = JSON.stringify(filters);

  const fetchRooms = useCallback(() => {
    setLoading(true);
    apiClient.getRooms(filters)
      .then((res: any) => setRooms(Array.isArray(res.data) ? res.data : []))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  return { rooms, loading, error, refetch: fetchRooms };
}

export function useRoom(id: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient.getRoom(id)
      .then((res: any) => setRoom(res.data ?? null))
      .catch((err: any) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { room, loading, error };
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.createRoom(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
}

export function useUpdateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiClient.updateRoom(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.deleteRoom(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }),
  });
}
