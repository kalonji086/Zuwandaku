"use client";

import { useState } from 'react';
import { Search, Filter, Plus, Users, Shield, Clock, CheckCircle, AlertCircle, TrendingUp, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
import Link from 'next/link';

const STAFF_MOCK = [
  { id: '1', name: 'Marie Kabila', role: 'Réceptionniste', status: 'Active', shift: 'Matin', salary: 450, joinDate: '2024-01-15' },
  { id: '2', name: 'Jean-Pierre Muteba', role: 'Housekeeping', status: 'Active', shift: 'Après-midi', salary: 380, joinDate: '2024-02-10' },
  { id: '3', name: 'Sophie Lumu', role: 'Manager', status: 'Active', shift: 'Complet', salary: 1200, joinDate: '2023-11-01' },
  { id: '4', name: 'David Nsakala', role: 'Réceptionniste', status: 'En attente', shift: 'Soir', salary: 420, joinDate: '2024-03-20' },
  // ... more mocks (12 total)
];

export default function ManageStaffPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredStaff = STAFF_MOCK.filter(staff => {
    const matchesSearch = staff.name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const statusColors = {
    Active: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
    'En attente': 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-white to-blue-200/50 bg-clip-text text-transparent drop-shadow-2xl mb-2">Gestion Personnel</h1>
          <p className="text-2xl text-gray-400">Contrôlez vos équipes par fonction et demandes</p>
        </div>
        <Link href="/hotel/manage/new" className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transition-all whitespace-nowrap">
          <Plus size={24} className="inline mr-2" />
          Demander agent
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 backdrop-blur-xl p-8 rounded-3xl border border-blue-500/30 shadow-2xl text-center">
          <Users size={48} className="mx-auto mb-4 text-blue-400" />
          <p className="text-4xl font-black text-white">24</p>
          <p className="text-gray-400 font-medium">Personnel total</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 backdrop-blur-xl p-8 rounded-3xl border border-emerald-500/30 shadow-2xl text-center">
          <CheckCircle size={48} className="mx-auto mb-4 text-emerald-400" />
          <p className="text-4xl font-black text-white">20</p>
          <p className="text-gray-400 font-medium">Actifs</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-900/50 to-orange-900/50 backdrop-blur-xl p-8 rounded-3xl border border-yellow-500/30 shadow-2xl text-center">
          <Clock size={48} className="mx-auto mb-4 text-yellow-400" />
          <p className="text-4xl font-black text-white">4</p>
          <p className="text-gray-400 font-medium">En attente</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 backdrop-blur-xl p-8 rounded-3xl border border-purple-500/30 shadow-2xl text-center">
          <Shield size={48} className="mx-auto mb-4 text-purple-400" />
          <p className="text-4xl font-black text-white">3</p>
          <p className="text-gray-400 font-medium">Managers</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 mb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher nom, rôle..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-4 flex-wrap">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:ring-2 focus:ring-blue-500">
              <option value="all">Toutes rôles</option>
              <option value="Réceptionniste">Réception</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Manager">Manager</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white focus:ring-2 focus:ring-blue-500">
              <option value="all">Tous statuts</option>
              <option value="Active">Actifs</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-700 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="p-6 text-left font-bold text-lg text-white">Nom</th>
                <th className="p-6 text-left font-bold text-lg text-white">Rôle</th>
                <th className="p-6 text-left font-bold text-lg text-white">Statut</th>
                <th className="p-6 text-left font-bold text-lg text-white">Service</th>
                <th className="p-6 text-left font-bold text-lg text-white">Salaire</th>
                <th className="p-6 text-left font-bold text-lg text-white">Date</th>
                <th className="p-6 text-left font-bold text-lg text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="border-t border-gray-700/50 hover:bg-gray-800/30 transition-all">
                  <td className="p-6 font-semibold text-white">{staff.name}</td>
                  <td className="p-6">
                    <span className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 rounded-xl text-blue-300 font-medium">
                      {staff.role}
                    </span>
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-2 rounded-full border-2 font-bold text-sm capitalize ${statusColors[staff.status as keyof typeof statusColors]}`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="p-6 font-medium text-gray-300">{staff.shift}</td>
                  <td className="p-6 font-bold text-emerald-400">${staff.salary}</td>
                  <td className="p-6 text-sm text-gray-400">{staff.joinDate}</td>
                  <td className="p-6">
                    <div className="flex gap-2">
                      <Link href={`/hotel/manage/${staff.id}`} className="p-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 rounded-2xl text-blue-300 hover:text-blue-200 transition-all">
                        <Eye size={18} />
                      </Link>
                      <Link href={`/hotel/manage/${staff.id}/edit`} className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 rounded-2xl text-emerald-300 hover:text-emerald-200 transition-all">
                        <Edit size={18} />
                      </Link>
                      <button className="p-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 rounded-2xl text-red-300 hover:text-red-200 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStaff.length === 0 && (
          <div className="text-center py-20">
            <Users size={64} className="mx-auto mb-8 text-gray-600" />
            <h3 className="text-3xl font-bold text-white mb-4">Aucun personnel trouvé</h3>
            <p className="text-xl text-gray-500 mb-8">Modifiez vos filtres ou demandez un nouveau compte</p>
            <Link href="/hotel/manage/new" className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-3xl font-bold text-white shadow-2xl hover:shadow-emerald-500/25 transition-all">
              <UserPlus size={24} />
              Faire une demande
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

