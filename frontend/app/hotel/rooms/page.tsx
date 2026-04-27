"use client";

import { useState } from 'react';
import { Search, Plus, BedDouble, Users, DollarSign, KeyRound, Loader2 } from 'lucide-react';
import Link from 'next/link';
import RoomCard from '../../components/RoomCard';
import type { Room } from '../../../lib/hooks/useRooms';
import { useRooms } from '../../../lib/hooks/useRooms';

export default function RoomsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { rooms, loading, error } = useRooms({ search, status: statusFilter === 'all' ? undefined : statusFilter });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900/20 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900/20 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Erreur: {error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-3 bg-blue-600 text-white rounded-xl">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900/20">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 p-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Gestion des chambres</h1>
          <p className="text-gray-400">Contrôlez vos chambres et leur disponibilité ({rooms.length} chambres)</p>
        </div>
        <Link href="/hotel/rooms/new" className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
          <Plus size={20} />
          Nouvelle chambre
        </Link>
      </div>

      {/* Stats - from real data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-xl rounded-2xl p-6 border border-blue-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <BedDouble size={24} className="text-blue-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{rooms.length}</p>
              <p className="text-sm text-gray-400 font-medium">Total</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 backdrop-blur-xl rounded-2xl p-6 border border-green-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Users size={24} className="text-green-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{rooms.filter((r) => r.status === 'OCCUPIED').length}</p>
              <p className="text-sm text-gray-400 font-medium">Occupées</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-900/50 to-red-900/50 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 shadow-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-500/20 rounded-xl">
              <KeyRound size={24} className="text-orange-400" />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{rooms.filter((r) => r.status === 'AVAILABLE').length}</p>
              <p className="text-sm text-gray-400 font-medium">Disponibles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-end">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par numéro ou type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous statuts</option>
              <option value="AVAILABLE">Disponibles</option>
              <option value="OCCUPIED">Occupées</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="RESERVED">Réservées</option>
            </select>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {rooms.map(room => (
          <RoomCard key={room.id} room={room as any} />
        ))}
        {rooms.length === 0 && (
          <div className="col-span-full text-center py-20">
            <BedDouble size={64} className="mx-auto text-gray-600 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Aucune chambre trouvée</h3>
            <p className="text-gray-500 mb-8">Modifiez vos filtres ou ajoutez une nouvelle chambre</p>
            <Link href="/hotel/rooms/new" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all">
              <Plus size={20} />
              Ajouter la première chambre
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

