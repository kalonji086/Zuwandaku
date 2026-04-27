"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Users, Search, UserPlus, X, Crown, ChevronDown,
  Loader2, Filter, RefreshCw, UserMinus, CheckCircle2,
  Briefcase, Clock, AlertCircle, FolderOpen, Mail
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Dossier {
  id: string;
  reference: string;
  type: string;
  status: string;
  client: { id: string; name: string; email: string };
  responsable: User | null;
  tasks: { id: string; assignee: User | null }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ROLE_COLORS: Record<string, string> = {
  ADMIN: 'bg-red-500/20 text-red-300 border-red-500/30',
  PROPRIETAIRE: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  CLIENT: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  COMMISSIONNAIRE: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  HOTELIER: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  EN_ATTENTE: { label: 'En attente', color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', icon: <Clock className="w-3 h-3" /> },
  EN_COURS: { label: 'En cours', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', icon: <AlertCircle className="w-3 h-3" /> },
  FINALISE: { label: 'Finalisé', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', icon: <CheckCircle2 className="w-3 h-3" /> },
  ANNULE: { label: 'Annulé', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: <X className="w-3 h-3" /> },
};

const TYPE_LABELS: Record<string, string> = {
  LOCATION_MAISON: 'Location Maison',
  LOCATION_VEHICULE: 'Location Véhicule',
  VENTE: 'Vente',
  MAINTENANCE: 'Maintenance',
  LITIGE: 'Litige',
  HOTEL_BOOKING: 'Hôtel',
};

function Avatar({ name, size = 'md', ring }: { name: string; size?: 'sm' | 'md' | 'lg'; ring?: string }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-amber-600', 'bg-rose-600', 'bg-cyan-600'];
  const color = colors[name?.charCodeAt(0) % colors.length] || 'bg-gray-600';
  const sz = size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-11 h-11 text-base' : 'w-9 h-9 text-sm';
  return (
    <div className={`${sz} ${color} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${ring ? `ring-2 ${ring}` : ''}`}>
      {initials}
    </div>
  );
}

function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MemberAssignationPage() {
  const [dossiers, setDossiers] = useState<Dossier[]>([]);
  const [selectedDossier, setSelectedDossier] = useState<Dossier | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loadingDossiers, setLoadingDossiers] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Filters
  const [dossierSearch, setDossierSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedDossierSearch = useDebounce(dossierSearch);
  const debouncedUserSearch = useDebounce(userSearch);

  // ── Load dossiers ──────────────────────────────────────────────────────────
  const loadDossiers = useCallback(async () => {
    setLoadingDossiers(true);
    try {
      const res = await apiClient.getAssignationDossiers({
        search: debouncedDossierSearch || undefined,
        status: statusFilter || undefined,
        type: typeFilter || undefined,
      });
      setDossiers(res.data || []);
    } catch { setDossiers([]); }
    finally { setLoadingDossiers(false); }
  }, [debouncedDossierSearch, statusFilter, typeFilter]);

  useEffect(() => { loadDossiers(); }, [loadDossiers]);

  // ── Load available users ───────────────────────────────────────────────────
  const loadUsers = useCallback(async () => {
    if (!selectedDossier) return;
    setLoadingUsers(true);
    // Exclude already-assigned members + responsable
    const assignedIds = [
      selectedDossier.responsable?.id,
      ...selectedDossier.tasks.map(t => t.assignee?.id),
    ].filter(Boolean).join(',');
    try {
      const res = await apiClient.getAssignationUsers(
        debouncedUserSearch,
        roleFilter || undefined,
        assignedIds || undefined,
      );
      setUsers(res.data || []);
    } catch { setUsers([]); }
    finally { setLoadingUsers(false); }
  }, [selectedDossier, debouncedUserSearch, roleFilter]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // ── Sync selected dossier from list ───────────────────────────────────────
  useEffect(() => {
    if (selectedDossier) {
      const updated = dossiers.find(d => d.id === selectedDossier.id);
      if (updated) setSelectedDossier(updated);
    }
  }, [dossiers]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const setResponsable = async (user: User) => {
    if (!selectedDossier) return;
    setActionLoading(`resp-${user.id}`);
    try {
      await apiClient.setDossierResponsable(selectedDossier.id, user.id);
      await loadDossiers();
    } finally { setActionLoading(null); }
  };

  const removeResponsable = async () => {
    if (!selectedDossier) return;
    setActionLoading('resp-remove');
    try {
      await apiClient.setDossierResponsable(selectedDossier.id, null);
      await loadDossiers();
    } finally { setActionLoading(null); }
  };

  const assignMember = async (user: User) => {
    if (!selectedDossier) return;
    setActionLoading(`member-${user.id}`);
    try {
      await apiClient.assignDossierMember(selectedDossier.id, { userId: user.id, type: 'member' });
      await loadDossiers();
    } finally { setActionLoading(null); }
  };

  const removeMember = async (userId: string) => {
    if (!selectedDossier) return;
    setActionLoading(`remove-${userId}`);
    try {
      await apiClient.removeDossierMember(selectedDossier.id, userId);
      await loadDossiers();
    } finally { setActionLoading(null); }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const members = selectedDossier?.tasks.map(t => t.assignee).filter(Boolean) as User[] || [];
  const totalAssigned = members.length + (selectedDossier?.responsable ? 1 : 0);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Header ── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Assignation Membres</h1>
              <p className="text-sm text-gray-400">Gérez les responsables et membres par dossier</p>
            </div>
          </div>
          <button onClick={loadDossiers} className="p-2.5 rounded-xl bg-gray-800/60 border border-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ══ LEFT: Dossiers list ══════════════════════════════════════════ */}
          <div className="lg:col-span-2 flex flex-col gap-3">

            {/* Search + filters */}
            <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-4 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Rechercher un dossier..."
                  value={dossierSearch}
                  onChange={e => setDossierSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-800/60 text-white text-sm border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 placeholder-gray-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowFilters(v => !v)}
                className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                Filtres
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="py-2 px-3 bg-gray-800/60 text-white text-xs border border-gray-600/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="">Tous statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="EN_COURS">En cours</option>
                    <option value="FINALISE">Finalisé</option>
                    <option value="ANNULE">Annulé</option>
                  </select>
                  <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="py-2 px-3 bg-gray-800/60 text-white text-xs border border-gray-600/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="">Tous types</option>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Dossier cards */}
            <div className="flex-1 space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1 scrollbar-thin">
              {loadingDossiers ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
                </div>
              ) : dossiers.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p className="text-sm">Aucun dossier trouvé</p>
                </div>
              ) : dossiers.map(d => {
                const st = STATUS_CONFIG[d.status] || STATUS_CONFIG.EN_ATTENTE;
                const memberCount = d.tasks.filter(t => t.assignee).length;
                const isSelected = selectedDossier?.id === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDossier(d)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500/50 shadow-lg shadow-blue-500/10'
                        : 'bg-gray-900/40 border-gray-700/40 hover:bg-gray-800/50 hover:border-gray-600/60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-semibold text-blue-400">{d.reference}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${st.color}`}>
                        {st.icon}{st.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white truncate mb-1">{d.client.name}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{TYPE_LABELS[d.type] || d.type}</span>
                      <div className="flex items-center gap-2">
                        {d.responsable && (
                          <div title={`Responsable: ${d.responsable.name}`}>
                            <Avatar name={d.responsable.name} size="sm" ring="ring-amber-400/60" />
                          </div>
                        )}
                        {memberCount > 0 && (
                          <span className="text-xs bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full">
                            +{memberCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══ RIGHT: Detail panel ══════════════════════════════════════════ */}
          <div className="lg:col-span-3">
            {!selectedDossier ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-900/30 rounded-2xl border border-dashed border-gray-700/50 text-gray-500">
                <Briefcase className="w-12 h-12 mb-4 opacity-30" />
                <p className="font-medium text-gray-400">Sélectionnez un dossier</p>
                <p className="text-sm mt-1">pour gérer ses membres</p>
              </div>
            ) : (
              <div className="space-y-4">

                {/* Dossier header */}
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-sm font-bold text-blue-400">{selectedDossier.reference}</span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${STATUS_CONFIG[selectedDossier.status]?.color}`}>
                          {STATUS_CONFIG[selectedDossier.status]?.icon}
                          {STATUS_CONFIG[selectedDossier.status]?.label}
                        </span>
                      </div>
                      <p className="text-white font-semibold">{selectedDossier.client.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Mail className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-xs text-gray-400">{selectedDossier.client.email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 mb-1">{TYPE_LABELS[selectedDossier.type] || selectedDossier.type}</p>
                      <p className="text-xs text-gray-400">{totalAssigned} membre{totalAssigned > 1 ? 's' : ''} assigné{totalAssigned > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>

                {/* Responsable */}
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-4 h-4 text-amber-400" />
                    <h3 className="font-semibold text-white text-sm">Responsable</h3>
                  </div>
                  {selectedDossier.responsable ? (
                    <div className="flex items-center justify-between p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Avatar name={selectedDossier.responsable.name} size="md" ring="ring-amber-400/50" />
                        <div>
                          <p className="text-sm font-semibold text-white">{selectedDossier.responsable.name}</p>
                          <p className="text-xs text-gray-400">{selectedDossier.responsable.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_COLORS[selectedDossier.responsable.role] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                          {selectedDossier.responsable.role}
                        </span>
                        <button
                          onClick={removeResponsable}
                          disabled={actionLoading === 'resp-remove'}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                          title="Retirer le responsable"
                        >
                          {actionLoading === 'resp-remove' ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserMinus className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Aucun responsable assigné</p>
                  )}
                </div>

                {/* Members */}
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      <h3 className="font-semibold text-white text-sm">Membres <span className="text-gray-500 font-normal">({members.length})</span></h3>
                    </div>
                  </div>
                  {members.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucun membre assigné</p>
                  ) : (
                    <div className="space-y-2">
                      {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-800/40 border border-gray-700/30 rounded-xl group">
                          <div className="flex items-center gap-3">
                            <Avatar name={member.name} size="md" />
                            <div>
                              <p className="text-sm font-medium text-white">{member.name}</p>
                              <p className="text-xs text-gray-400">{member.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${ROLE_COLORS[member.role] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                              {member.role}
                            </span>
                            <button
                              onClick={() => removeMember(member.id)}
                              disabled={actionLoading === `remove-${member.id}`}
                              className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 disabled:opacity-40"
                              title="Retirer ce membre"
                            >
                              {actionLoading === `remove-${member.id}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add users panel */}
                <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-semibold text-white text-sm">Ajouter des membres</h3>
                  </div>

                  {/* User search + role filter */}
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        placeholder="Rechercher un utilisateur..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-800/60 text-white text-sm border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/50 placeholder-gray-500 outline-none"
                      />
                    </div>
                    <select
                      value={roleFilter}
                      onChange={e => setRoleFilter(e.target.value)}
                      className="py-2.5 px-3 bg-gray-800/60 text-white text-sm border border-gray-600/50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/40 min-w-[130px]"
                    >
                      <option value="">Tous rôles</option>
                      <option value="ADMIN">Admin</option>
                      <option value="PROPRIETAIRE">Propriétaire</option>
                      <option value="CLIENT">Client</option>
                      <option value="COMMISSIONNAIRE">Commissionnaire</option>
                      <option value="HOTELIER">Hôtelier</option>
                    </select>
                  </div>

                  {/* User list */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {loadingUsers ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 animate-spin text-blue-400" />
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-sm">Aucun utilisateur disponible</p>
                      </div>
                    ) : users.map(user => {
                      const isAssigningResp = actionLoading === `resp-${user.id}`;
                      const isAssigningMember = actionLoading === `member-${user.id}`;
                      const busy = isAssigningResp || isAssigningMember;
                      return (
                        <div key={user.id} className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-700/30 rounded-xl hover:bg-gray-800/60 hover:border-gray-600/50 transition-all group">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar name={user.name} size="md" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-white truncate">{user.name}</p>
                              <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                            <span className={`text-xs px-2 py-0.5 rounded-full border hidden sm:inline-flex ${ROLE_COLORS[user.role] || 'bg-gray-700 text-gray-300 border-gray-600'}`}>
                              {user.role}
                            </span>
                            {/* Assign as responsable */}
                            {!selectedDossier.responsable && (
                              <button
                                onClick={() => setResponsable(user)}
                                disabled={busy}
                                title="Définir comme responsable"
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-all disabled:opacity-40"
                              >
                                {isAssigningResp ? <Loader2 className="w-3 h-3 animate-spin" /> : <Crown className="w-3 h-3" />}
                                <span className="hidden sm:inline">Resp.</span>
                              </button>
                            )}
                            {/* Assign as member */}
                            <button
                              onClick={() => assignMember(user)}
                              disabled={busy}
                              title="Ajouter comme membre"
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-xs font-medium transition-all disabled:opacity-40"
                            >
                              {isAssigningMember ? <Loader2 className="w-3 h-3 animate-spin" /> : <UserPlus className="w-3 h-3" />}
                              <span className="hidden sm:inline">Membre</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
