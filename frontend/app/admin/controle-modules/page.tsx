"use client";

import { useState, useEffect, useCallback } from 'react';
import { Shield, Users, Search, ChevronRight, X, LayoutDashboard, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

const ROLES = ['ADMIN', 'PROPRIETAIRE', 'CLIENT', 'COMMISSIONNAIRE', 'HOTELIER'] as const;
type Role = typeof ROLES[number];

const MODULES: { name: string; label: string; dashboardAccess: string[] }[] = [
  { name: 'MemberAssignation', label: 'Assignation Membres', dashboardAccess: ['Assigner des membres aux dossiers', 'Voir les membres assignés', 'Retirer des membres'] },
  { name: 'Documents', label: 'Documents', dashboardAccess: ['Uploader des documents', 'Télécharger des documents', 'Supprimer des documents', 'Voir les catégories'] },
  { name: 'Dossiers', label: 'Dossiers', dashboardAccess: ['Créer des dossiers', 'Modifier des dossiers', 'Archiver des dossiers', 'Voir tous les dossiers'] },
  { name: 'Properties', label: 'Propriétés', dashboardAccess: ['Ajouter une propriété', 'Modifier une propriété', 'Supprimer une propriété', 'Voir les propriétés'] },
  { name: 'Vehicles', label: 'Véhicules', dashboardAccess: ['Ajouter un véhicule', 'Modifier un véhicule', 'Supprimer un véhicule', 'Voir les véhicules'] },
  { name: 'Users', label: 'Utilisateurs', dashboardAccess: ['Voir la liste des utilisateurs', 'Créer un compte', 'Suspendre un compte', 'Supprimer un compte'] },
  { name: 'Mail', label: 'Messagerie', dashboardAccess: ['Envoyer des emails', 'Voir la boîte de réception', 'Gérer les modèles'] },
  { name: 'Procedure', label: 'Procédures', dashboardAccess: ['Créer une procédure', 'Modifier une procédure', 'Voir les procédures', 'Valider une étape'] },
];

const ROLE_COLORS: Record<Role, string> = {
  ADMIN: 'blue',
  PROPRIETAIRE: 'emerald',
  CLIENT: 'violet',
  COMMISSIONNAIRE: 'amber',
  HOTELIER: 'rose',
};

export default function ControleModulesPage() {
  const [permissions, setPermissions] = useState<Record<Role, string[]>>({} as any);
  const [loadingToggles, setLoadingToggles] = useState<Set<string>>(new Set());
  const [loadingRoles, setLoadingRoles] = useState<Set<Role>>(new Set());
  const [selectedRole, setSelectedRole] = useState<Role>('ADMIN');
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [usersByRole, setUsersByRole] = useState<Record<Role, any[]>>({} as any);
  const [search, setSearch] = useState('');

  const loadPermissions = useCallback(async (role: Role) => {
    setLoadingRoles(prev => new Set(prev).add(role));
    try {
      const res = await apiClient.getRolePermissions(role);
      setPermissions(prev => ({ ...prev, [role]: res.data || [] }));
    } catch { /* silently fail */ }
    finally { setLoadingRoles(prev => { const s = new Set(prev); s.delete(role); return s; }); }
  }, []);

  const loadUsers = useCallback(async (role: Role) => {
    if (usersByRole[role]) return;
    try {
      const res = await apiClient.getUsersByRole(role);
      setUsersByRole(prev => ({ ...prev, [role]: res.data || [] }));
    } catch { setUsersByRole(prev => ({ ...prev, [role]: [] })); }
  }, [usersByRole]);

  useEffect(() => { ROLES.forEach(loadPermissions); }, []);

  const togglePermission = async (role: Role, module: string) => {
    const key = `${role}:${module}`;
    if (loadingToggles.has(key)) return;

    const wasEnabled = permissions[role]?.includes(module) ?? false;
    // Optimistic update
    setPermissions(prev => ({
      ...prev,
      [role]: wasEnabled
        ? (prev[role] || []).filter(p => p !== module)
        : [...(prev[role] || []), module],
    }));
    setLoadingToggles(prev => new Set(prev).add(key));

    try {
      await apiClient.toggleRolePermission({ role, module });
    } catch {
      // Revert on error
      setPermissions(prev => ({
        ...prev,
        [role]: wasEnabled
          ? [...(prev[role] || []), module]
          : (prev[role] || []).filter(p => p !== module),
      }));
    } finally {
      setLoadingToggles(prev => { const s = new Set(prev); s.delete(key); return s; });
    }
  };

  const openModule = (moduleName: string) => {
    setSelectedModule(moduleName);
    ROLES.forEach(loadUsers);
  };

  const color = ROLE_COLORS[selectedRole];
  const filteredModules = MODULES.filter(m => m.label.toLowerCase().includes(search.toLowerCase()) || m.name.toLowerCase().includes(search.toLowerCase()));
  const activeCount = (permissions[selectedRole] || []).length;
  const moduleDetail = MODULES.find(m => m.name === selectedModule);

  return (
    <div className="min-h-screen bg-gray-950 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Contrôle Modules</h1>
            <p className="text-gray-400 text-sm">Activez/désactivez les modules par rôle</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/60 rounded-2xl p-4 border border-gray-700/50 sticky top-24">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Rôles</p>
              <div className="space-y-1">
                {ROLES.map(role => {
                  const c = ROLE_COLORS[role];
                  const count = (permissions[role] || []).length;
                  const isLoading = loadingRoles.has(role);
                  return (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                        selectedRole === role
                          ? `bg-${c}-500/20 text-${c}-300 border border-${c}-500/40`
                          : 'text-gray-400 hover:bg-gray-800/60 hover:text-white border border-transparent'
                      }`}
                    >
                      <span>{role}</span>
                      {isLoading
                        ? <Loader2 className="w-3 h-3 animate-spin opacity-50" />
                        : <span className={`text-xs px-2 py-0.5 rounded-full ${selectedRole === role ? `bg-${c}-500/30 text-${c}-300` : 'bg-gray-700 text-gray-400'}`}>{count}</span>
                      }
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Modules grid */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900/40 rounded-2xl p-6 border border-gray-700/50">
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedRole}</h2>
                  <p className="text-sm text-gray-400">{activeCount} / {MODULES.length} modules actifs</p>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    placeholder="Rechercher..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-gray-800/60 text-white text-sm border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredModules.map(module => {
                  const enabled = permissions[selectedRole]?.includes(module.name) ?? false;
                  const key = `${selectedRole}:${module.name}`;
                  const isToggling = loadingToggles.has(key);

                  return (
                    <div key={module.name} className={`rounded-xl border transition-all ${enabled ? 'border-blue-500/30 bg-blue-950/20' : 'border-gray-700/50 bg-gray-800/30'}`}>
                      <div className="flex items-center justify-between p-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">{module.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{module.dashboardAccess.length} accès</p>
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          {/* Toggle button */}
                          <button
                            onClick={() => togglePermission(selectedRole, module.name)}
                            disabled={isToggling}
                            className={`relative w-11 h-6 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                              enabled ? 'bg-blue-500 focus:ring-blue-500' : 'bg-gray-600 focus:ring-gray-500'
                            } ${isToggling ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            title={enabled ? 'Désactiver' : 'Activer'}
                          >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center ${enabled ? 'translate-x-5' : 'translate-x-0'}`}>
                              {isToggling && <Loader2 className="w-3 h-3 text-gray-400 animate-spin" />}
                            </span>
                          </button>
                          {/* Detail button */}
                          <button
                            onClick={() => openModule(module.name)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-700/60 transition-all"
                            title="Voir les détails"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Detail Modal */}
      {selectedModule && moduleDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                  <LayoutDashboard className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{moduleDetail.label}</h3>
                  <p className="text-xs text-gray-400">Accès & utilisateurs concernés</p>
                </div>
              </div>
              <button onClick={() => setSelectedModule(null)} className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* Dashboard accesses */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Accès Dashboard</p>
                <div className="space-y-2">
                  {moduleDetail.dashboardAccess.map(access => (
                    <div key={access} className="flex items-center gap-3 p-3 bg-gray-800/40 rounded-xl border border-gray-700/30">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-gray-200">{access}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Roles with this module */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rôles ayant accès à ce module</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROLES.map(role => {
                    const hasAccess = permissions[role]?.includes(moduleDetail.name) ?? false;
                    const roleUsers = usersByRole[role] || [];
                    const c = ROLE_COLORS[role];
                    return (
                      <div key={role} className={`p-4 rounded-xl border transition-all ${hasAccess ? `border-${c}-500/30 bg-${c}-950/20` : 'border-gray-700/30 bg-gray-800/20 opacity-50'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-semibold ${hasAccess ? `text-${c}-300` : 'text-gray-500'}`}>{role}</span>
                          {hasAccess
                            ? <CheckCircle className="w-4 h-4 text-emerald-400" />
                            : <XCircle className="w-4 h-4 text-gray-600" />
                          }
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-xs text-gray-400">
                            {roleUsers.length > 0 ? `${roleUsers.length} utilisateur${roleUsers.length > 1 ? 's' : ''}` : 'Chargement...'}
                          </span>
                        </div>
                        {hasAccess && roleUsers.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {roleUsers.slice(0, 3).map((u: any) => (
                              <span key={u.id} className="text-xs bg-gray-700/60 text-gray-300 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                                {u.name || u.email || u.id}
                              </span>
                            ))}
                            {roleUsers.length > 3 && (
                              <span className="text-xs text-gray-500">+{roleUsers.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
