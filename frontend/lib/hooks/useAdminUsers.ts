import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api-client';

// ─── Admin Users & Permissions ──────────────────────────────────────────────

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/admin/users').then((res) => res.data),
  });
};

export const useAdminUser = (userId: string) => {
  return useQuery({
    queryKey: ['admin-user', userId],
    queryFn: () => apiClient.get(`/admin/users/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });
};

export const useAdminUserPermissions = (userId: string) => {
  return useQuery({
    queryKey: ['admin-user-permissions', userId],
    queryFn: () => apiClient.get(`/admin/users/${userId}/permissions`).then((res) => res.data),
    enabled: !!userId,
  });
};

export const useUpdateUserPermissions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, permissions }: { userId: string; permissions: string[] }) =>
      apiClient.patch(`/admin/users/${userId}/permissions`, { permissions }).then((res) => res.data),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      qc.invalidateQueries({ queryKey: ['admin-user', variables.userId] });
      qc.invalidateQueries({ queryKey: ['admin-user-permissions', variables.userId] });
    },
  });
};

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => apiClient.delete(`/admin/users/${userId}`).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

export const useSuspendUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => apiClient.patch(`/admin/users/${userId}/suspend`).then((res) => res.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });
};

