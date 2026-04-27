"use client";

import { useState } from 'react';
import { Shield, Plus, Edit3, Trash2, Search, Filter } from 'lucide-react';

const ROLES_MOCK = [
  {
    id: '1',
    name: 'Réceptionniste',
    permissions: ['checkin', 'checkout', 'reservations', 'billing_view'],
    staffCount: 8,
    color: 'blue'
  },
  {
    id: '2',
    name: 'Housekeeping',
    permissions: ['rooms_cleaning', 'inventory'],
    staffCount: 6,
    color: 'green'
  },
  {
    id: '3',
    name: 'Manager',
    permissions: ['all'],
    staffCount: 2,
    color: 'purple'
  },
  {
    id: '4',
    name: 'Maintenance',
    permissions: ['maintenance', 'inventory'],
    staffCount: 3,
    color: 'orange'
  },
  {
    id: '5',
    name: 'Sécurité',
    permissions: ['security'],
    staffCount: 4,
    color: 'red'
  },
];

export default function ManageRolesPage() {
  const [search, setSearch] = useState('');

  const filteredRoles = ROLES_MOCK.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl mb-2">Gestion des Rôles</h1>
          <p className="text-2xl text-gray-400">Configurez permissions et assignations</p>
        </div>
        <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all whitespace-nowrap ml-auto">
          <Plus className="inline mr-2" size={24} />
          Nouveau rôle
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-gray-700">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher rôle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-800/50 border border-gray-700 rounded-3xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <button className="p-4 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-3xl text-gray-400 hover:text-white transition-all">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredRoles.map((role) => (
          <div key={role.id} className="group bg-gradient-to-br from-gray-900/80 to-gray-900/20 backdrop-blur-xl rounded-4xl border border-gray-700/50 p-8 shadow-3xl hover:shadow-purple-500/20 hover:border-purple-500/50 hover:scale-[1.02] transition-all duration-500">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl border-4 border-${role.color}-500/30 bg-${role.color}-500/10 group-hover:bg-${role.color}-500/20 transition-all`}>
                  <Shield size={28} className={`text-${role.color}-400 group-hover:scale-110 transition-transform`} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">{role.name}</h3>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-400">{role.staffCount} agents</span>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all ml-4">
                <button className="p-3 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 rounded-2xl text-purple-300 hover:text-white transition-all">
                  <Edit3 size={18} />
                </button>
                <button className="p-3 bg-red-600/30 hover:bg-red-600/50 border border-red-500/30 rounded-2xl text-red-300 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                <span className="text-gray-400">Check-in / Check-out</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                <span className="text-gray-400">{role.permissions.length} permissions actives</span>
              </div>
              {role.permissions.includes('all') && (
                <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-purple-300">
                  <Shield size={16} />
                  <span className="font-semibold">Accès complet</span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-700/50 flex gap-4">
              <button className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-purple-500/25 transition-all text-sm">
                Modifier permissions
              </button>
              <button className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-2xl text-gray-300 hover:text-white transition-all text-sm">
                Voir agents
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-32">
          <Shield size={72} className="mx-auto mb-8 text-gray-600 opacity-50" />
          <h3 className="text-3xl font-bold text-white mb-4">Aucun rôle trouvé</h3>
          <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto">Modifiez votre recherche ou créez un nouveau rôle</p>
          <button className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white font-bold rounded-4xl shadow-2xl hover:shadow-purple-500/50 transition-all text-lg">
            <Plus size={24} className="inline mr-3" />
            Créer premier rôle
          </button>
        </div>
      )}
    </div>
  );
}

