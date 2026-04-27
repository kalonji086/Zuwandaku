import { createClient } from '../utils/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const supabase = createClient();

export const useReservations = () => {
  return useQuery({
    queryKey: ['reservations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reservation: any) => {
      const { data, error } = await supabase
        .from('reservations')
        .insert(reservation)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] });
      // Real-time notify hotel dashboard
      supabase.channel('reservations').send({
        type: 'broadcast',
        event: 'new_reservation',
        payload: { message: 'New reservation received!' },
      });
    },
  });
};

// Real-time subscription hook
export const useRealtimeReservations = (onNew: (reservation: any) => void) => {
  useEffect(() => {
    const channel = supabase
      .channel('reservations')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reservations' },
        (payload) => onNew(payload.new)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onNew]);
};

