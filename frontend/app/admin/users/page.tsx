"use client"

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

const ROLES: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  DEPT_ADMIN: 'Dept Admin',
  PROPRIETAIRE: 'Propriétaire',
  CLIENT: 'Client',
  COMMISSIONNAIRE: 'Commissionnaire',
};

const STATUS_COLORS: Record<string, string> = {
  APPROVED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SUSPENDED: 'bg-red-100 text-red-700',
  REJECTED: 'bg-gray-100 text-gray-500',
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/admin/users').then((r) => r.data),
    refetchInterval: 5000,
  });

  const approve = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/admin/${id}/approve`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const suspend = useMutation({
    mutationFn: (id: string) => apiClient.patch(`/admin/${id}/deactivate`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/admin/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  });

  const filtered = users.filter((u: any) =>
    [u.name, u.email, u.role].some((v) =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
        <span className="text-sm text-gray-400">
          {users.length} compte{users.length !== 1 ? 's' : ''} · actualisation auto
        </span>
      </div>

      <input
        type="text"
        placeholder="Rechercher par nom, email ou rôle…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full max-w-sm border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {isLoading ? (
        <p className="text-gray-400 text-sm">Chargement…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-100 shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-4 py-3 text-left">Nom</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Rôle</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Créé le</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filtered.map((u: any) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-800">{u.name || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600">{ROLES[u.role] ?? u.role}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[u.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {u.status !== 'APPROVED' && (
                      <button
                        onClick={() => approve.mutate(u.id)}
                        disabled={approve.isPending}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
                      >
                        Approuver
                      </button>
                    )}
                    {u.isActive && (
                      <button
                        onClick={() => suspend.mutate(u.id)}
                        disabled={suspend.isPending}
                        className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:opacity-50"
                      >
                        Suspendre
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm(`Supprimer ${u.name ?? u.email} ?`)) remove.mutate(u.id);
                      }}
                      disabled={remove.isPending}
                      className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
