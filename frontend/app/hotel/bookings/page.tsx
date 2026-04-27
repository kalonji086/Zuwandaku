"use client";

import { useState } from 'react';
import {
  Search, Edit, Loader2, Calendar, UserCheck, BedDouble,
  TrendingUp, Plus, Eye, ChevronRight, Filter, X
} from 'lucide-react';
import type { Booking } from '../../../lib/hooks/useReservations';
import { useReservations } from '../../../lib/hooks/useReservations';
import ViewBookingModal from '../components/ViewBookingModal';
import CheckInTrigger from '../components/CheckInTrigger';
import EditBookingModal from '../components/EditBookingModal';
import NewReservationModal from '../components/NewReservationModal-fixed';

const STATUS_STYLES: Record<string, string> = {
  'Confirmée':  'text-cyan-300 bg-cyan-900/40 border-cyan-700/50',
  'En attente': 'text-yellow-300 bg-yellow-900/40 border-yellow-700/50',
  'Check-in':   'text-green-300 bg-green-900/40 border-green-700/50',
  'Check-out':  'text-orange-300 bg-orange-900/40 border-orange-700/50',
};

export default function BookingsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [localOverrides, setLocalOverrides] = useState<Record<string, Booking>>({});
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [isNewResOpen, setIsNewResOpen] = useState(false);

  const { bookings, loading, error } = useReservations({
    search,
    status: statusFilter === 'all' ? undefined : statusFilter,
  });

  const mergedBookings = bookings
    .filter(b => !deletedIds.has(b.id))
    .map(b => localOverrides[b.id] ?? b)
    .filter(b => {
      if (search && !b.guestName.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      return true;
    });

  const stats = [
    { label: 'Total', value: bookings.length, icon: Calendar, color: 'cyan' },
    { label: 'Confirmées', value: bookings.filter(b => b.status === 'Confirmée').length, icon: UserCheck, color: 'blue' },
    { label: 'Check-in', value: bookings.filter(b => b.status === 'Check-in').length, icon: BedDouble, color: 'green' },
    { label: 'En attente', value: bookings.filter(b => b.status === 'En attente').length, icon: TrendingUp, color: 'yellow' },
  ];

  const colorMap: Record<string, string> = {
    cyan:   'text-cyan-300 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]',
    blue:   'text-blue-300 bg-blue-500/10 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]',
    green:  'text-green-300 bg-green-500/10 border-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.1)]',
    yellow: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]',
  };
  const iconColorMap: Record<string, string> = {
    cyan: 'text-cyan-400', blue: 'text-blue-400', green: 'text-green-400', yellow: 'text-yellow-400',
  };
  const barColorMap: Record<string, string> = {
    cyan:   'bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent',
    blue:   'bg-gradient-to-r from-transparent via-blue-500/60 to-transparent',
    green:  'bg-gradient-to-r from-transparent via-green-500/60 to-transparent',
    yellow: 'bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent',
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white p-4 md:p-6 relative">

      {/* Starlink background */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(6,182,212,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 50%)' }} />

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Réservations <span className="text-cyan-400">Hotel</span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {mergedBookings.length} réservation{mergedBookings.length !== 1 ? 's' : ''} affichée{mergedBookings.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setIsNewResOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-white text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
        >
          <Plus size={16} /> Nouvelle réservation
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className={`relative bg-[#0a1628]/80 backdrop-blur rounded-2xl p-5 border transition-all duration-300 ${colorMap[s.color]}`}>
              <div className={`absolute top-0 left-0 right-0 h-px rounded-t-2xl ${barColorMap[s.color]}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-3xl font-black ${iconColorMap[s.color]}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-white/5`}>
                  <Icon size={20} className={iconColorMap[s.color]} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#0a1628]/80 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.1)] transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-gray-600" />
          {['all', 'Confirmée', 'En attente', 'Check-in', 'Check-out'].map(s => (
            <button key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                statusFilter === s
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                  : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10'
              }`}>
              {s === 'all' ? 'Tous' : s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-[#0a1628]/80 backdrop-blur rounded-2xl border border-white/5 overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)]">

        {/* Top accent bar */}
        <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-cyan-500" />
            <span className="text-gray-500 text-sm">Chargement des réservations...</span>
          </div>
        ) : error ? (
          <div className="m-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl text-red-400 text-sm">
            Erreur: {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['ID', 'Client', 'Chambre', 'Arrivée', 'Départ', 'Statut', 'Total', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {mergedBookings.map(booking => (
                  <tr key={booking.id} className="group hover:bg-cyan-500/[0.03] transition-all">

                    {/* ID */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-black text-cyan-500/70 font-mono">{booking.id}</span>
                    </td>

                    {/* Client */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-xs font-black text-cyan-300 shrink-0">
                          {booking.guestName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{booking.guestName}</p>
                          {booking.guestEmail && (
                            <p className="text-xs text-gray-600">{booking.guestEmail}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Chambre */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-900/30 border border-blue-700/40 rounded-lg w-fit">
                        <BedDouble size={12} className="text-blue-400" />
                        <span className="text-xs font-semibold text-blue-300">{booking.roomNumber}</span>
                      </div>
                    </td>

                    {/* Arrivée */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(booking.checkInDate).toLocaleDateString('fr-FR')}
                    </td>

                    {/* Départ */}
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(booking.checkOutDate).toLocaleDateString('fr-FR')}
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLES[booking.status] ?? 'text-gray-400 bg-gray-900/40 border-gray-700/50'}`}>
                        {booking.status}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="font-black text-cyan-300">${booking.totalAmount.toLocaleString('fr-FR')}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setViewingBooking(booking)}
                          className="p-2 rounded-lg text-gray-500 hover:text-cyan-300 hover:bg-cyan-900/30 transition-all"
                          title="Voir"
                        >
                          <Eye size={15} />
                        </button>
                        <CheckInTrigger booking={booking} />
                        <button
                          onClick={() => setEditingBooking(booking)}
                          className="p-2 rounded-lg text-gray-500 hover:text-orange-300 hover:bg-orange-900/30 transition-all"
                          title="Modifier"
                        >
                          <Edit size={15} />
                        </button>
                        <ChevronRight size={13} className="text-gray-700 group-hover:text-gray-500 transition-all" />
                      </div>
                    </td>
                  </tr>
                ))}

                {mergedBookings.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-5 py-16 text-center">
                      <Calendar size={36} className="mx-auto mb-3 text-gray-700" />
                      <p className="text-gray-600 text-sm">Aucune réservation trouvée</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <ViewBookingModal
        isOpen={!!viewingBooking}
        booking={viewingBooking}
        onClose={() => setViewingBooking(null)}
      />
      <EditBookingModal
        isOpen={!!editingBooking}
        booking={editingBooking}
        onSave={updated => {
          setLocalOverrides(prev => ({ ...prev, [updated.id]: updated }));
          setEditingBooking(null);
        }}
        onDelete={id => {
          setDeletedIds(prev => new Set([...prev, id]));
          setEditingBooking(null);
        }}
        onClose={() => setEditingBooking(null)}
      />
      <NewReservationModal
        isOpen={isNewResOpen}
        onClose={() => setIsNewResOpen(false)}
        onSave={() => setIsNewResOpen(false)}
      />
    </div>
  );
}
