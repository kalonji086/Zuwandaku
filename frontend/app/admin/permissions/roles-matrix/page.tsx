"use client";

import { useState, useEffect } from 'react';
import BloquerPropertiesModal from './components/BloquerPropertiesModal';
import ActiverDashboardAdminModal from './components/ActiverDashboardAdminModal';
import ResetClientModal from './components/ResetClientModal';
import TemplateHotelModal from './components/TemplateHotelModal';
import { Shield, Key, Lock, Eye, EyeOff, Download, Users2, Settings, CheckCircle, LayoutDashboard, Home, Car, FileText, BarChart3, MessageCircle, Mail, Building2 } from 'lucide-react';

const ROLES = ['ADMIN', 'PROPRIETAIRE', 'CLIENT', 'COMMISSIONNAIRE', 'HOTELIER'] as const;

const MODULES = [
  { id: 'dashboard',    label: 'Dashboard',      desc: 'Tableau de bord principal' },
  { id: 'properties',   label: 'Propriétés',     desc: 'Biens immobiliers' },
  { id: 'vehicles',     label: 'Véhicules',      desc: 'Location/vente véhicules' },
  { id: 'users',        label: 'Utilisateurs',   desc: 'Gestion comptes' },
  { id: 'contracts',    label: 'Contrats',       desc: 'Location/vente contrats' },
  { id: 'approve',      label: 'Approbations',   desc: 'Demandes approbation' },
  { id: 'reports',      label: 'Rapports',       desc: 'Statistiques et exports' },
  { id: 'settings',     label: 'Paramètres',     desc: 'Configuration compte' },
  { id: 'supports',     label: 'Support',        desc: 'Tickets support' },
  { id: 'admin',        label: 'Admin Panel',    desc: 'Panneau administration' },
  { id: 'mailbox',      label: 'Mailbox',        desc: 'Boîte mail' },
  { id: 'hotel',        label: 'Hôtel (staff)',  desc: 'Gestion hôtel staff' },
  { id: 'hotel_client', label: 'Hôtel (client)', desc: 'Réservation chambre client' },
] as const;

type Role = typeof ROLES[number];
type Module = typeof MODULES[number]['id'];

export default function RolesMatrixPage() {
  const [permissions, setPermissions] = useState<Record<Role, Module[]>>({});
  const [bloquerPropertiesModalOpen, setBloquerPropertiesModalOpen] = useState(false);
  const [activerDashboardAdminModalOpen, setActiverDashboardAdminModalOpen] = useState(false);
  const [resetClientModalOpen, setResetClientModalOpen] = useState(false);
  const [templateHotelModalOpen, setTemplateHotelModalOpen] = useState(false);
  const [loading, setLoading] = useState<Record<Role, boolean>>({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    ROLES.forEach(async (role) => {
      try {
        const res = await fetch(`/api/admin/roles/${role}/permissions`);
        if (res.ok) {
          const mods = await res.json();
          setPermissions(prev => ({ ...prev, [role]: mods }));
        }
      } catch (e) {
        console.error(`Error loading ${role}:`, e);
      }
    });
  }, []);

  const togglePermission = async (role: Role, module: Module) => {
    setLoading(prev => ({ ...prev, [role]: true }));
    try {
      const res = await fetch(`/api/admin/roles/${role}/permissions/${module}`, {
        method: 'PATCH',
      });
      if (res.ok) {
        const result = await res.json();
        setPermissions(prev => ({
          ...prev,
          [role]: result.allowed 
            ? [...(prev[role] || []), module]
            : (prev[role] || []).filter(m => m !== module)
        }));
        setMessage(`✅ ${role} → ${result.allowed ? 'Autorisé' : 'Bloqué'} ${module}`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (e) {
      setMessage(`❌ Erreur: ${e}`);
    }
    setLoading(prev => ({ ...prev, [role]: false }));
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-500 to-indigo-600 bg-clip-text text-transparent">
            <Key className="inline -ml-1 mr-3" size={48} />
            Contrôle Modules par Rôle
          </h1>
          <p className="text-xl text-gray-600 mt-2">Matrice permissions - Actions batch</p>
        </div>
        <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-3xl shadow-xl">
          <Download className="inline mr-2" size={20} /> Exporter
        </button>
      </div>

      {message && (
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-3xl text-green-400 font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Matrix */}
        <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 text-white">
            <Shield size={28} />
            Matrice Rôles/Modules
          </h2>
          <div className="overflow-x-auto max-h-[70vh]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-4 font-bold text-white">Module</th>
                  {ROLES.map(role => (
                    <th key={role} className="p-4 text-center font-bold text-white/80 w-24">{role}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map(({ id, label }) => (
                  <tr key={id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="p-4 font-medium text-white">{label}</td>
                    {ROLES.map(role => {
                      const allowed = (permissions[role] || []).includes(id);
                      return (
                        <td key={role} className="p-2">
                          <button
                            disabled={loading[role]}
                            onClick={() => togglePermission(role, id as Module)}
                            className={`
                              w-20 h-10 rounded-2xl font-bold transition-all mx-auto shadow-lg flex items-center justify-center
                              ${allowed 
                                ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/50 hover:shadow-emerald-500/25 hover:scale-105' 
                                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:border-gray-500 hover:bg-gray-700 hover:text-gray-300 shadow-gray-800/50 hover:shadow-gray-700/25 hover:scale-105'
                              }
                              ${loading[role] ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {loading[role] ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : allowed ? (
                              <CheckCircle size={18} />
                            ) : (
                              <Lock size={18} />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-white/10 p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Users2 size={24} />
              Rôles Stats
            </h3>
            <div className="space-y-4">
              {ROLES.map(role => (
                <div key={role} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl">
                  <span className="font-medium text-white capitalize">{role}</span>
                  <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl text-sm font-bold">
                    {(permissions[role] || []).length}/{MODULES.length}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white/5 backdrop-blur-xl rounded-4xl border border-white/10 p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
              <Settings size={24} />
              Actions rapides
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-300 hover:from-orange-500/30 rounded-2xl font-medium transition-all hover:scale-105"
                onClick={() => setBloquerPropertiesModalOpen(true)}
              >
                Bloquer tous Properties
              </button>
              <button 
                className="p-4 bg-gradient-to-r from-emerald-500/20 to-green-500/20 border border-emerald-500/30 text-emerald-300 hover:from-emerald-500/30 rounded-2xl font-medium transition-all hover:scale-105"
                onClick={() => setActiverDashboardAdminModalOpen(true)}
              >
                Activer Dashboard Admin
              </button>
              <button 
                className="p-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 text-purple-300 hover:from-purple-500/30 rounded-2xl font-medium transition-all hover:scale-105"
                onClick={() => setResetClientModalOpen(true)}
              >
                Reset CLIENT
              </button>
              <button 
                className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-300 hover:from-yellow-500/30 rounded-2xl font-medium transition-all hover:scale-105"
                onClick={() => setTemplateHotelModalOpen(true)}
              >
                Template Hôtel
              </button>
            </div>
          </div>
        </div>
      </div>

      <BloquerPropertiesModal 
        isOpen={bloquerPropertiesModalOpen}
        onClose={() => setBloquerPropertiesModalOpen(false)}
      />
      <ActiverDashboardAdminModal 
        isOpen={activerDashboardAdminModalOpen}
        onClose={() => setActiverDashboardAdminModalOpen(false)}
      />
      <ResetClientModal 
        isOpen={resetClientModalOpen}
        onClose={() => setResetClientModalOpen(false)}
      />
      <TemplateHotelModal 
        isOpen={templateHotelModalOpen}
        onClose={() => setTemplateHotelModalOpen(false)}
      />
    </div>
  );
}

