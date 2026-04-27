"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { BedDouble, Users, DollarSign, Edit3, Trash2, ArrowLeft, Wifi, Tv, CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRoom, useDeleteRoom, useUpdateRoom } from '../../../../lib/hooks';

const statusColors = {
  AVAILABLE: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  OCCUPIED: 'border-orange-500/50 bg-orange-500/10 text-orange-400',
  MAINTENANCE: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  RESERVED: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
} as const;

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Disponible', OCCUPIED: 'Occupée', MAINTENANCE: 'Maintenance', RESERVED: 'Réservée',
};

export default function RoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;

  const { room, loading, error } = useRoom(roomId);
  const deleteRoom = useDeleteRoom();
  const updateRoom = useUpdateRoom();

  const [showStatusEdit, setShowStatusEdit] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
    </div>
  );

  if (error || !room) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-red-400">Chambre introuvable</p>
      <button onClick={() => router.push('/hotel/rooms')} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Retour</button>
    </div>
  );

  const price = room.pricePerNight ?? (room as any).price ?? 0;

  const handleStatusUpdate = async () => {
    await updateRoom.mutateAsync({ id: roomId, data: { status: newStatus } });
    setShowStatusEdit(false);
    router.refresh();
  };

  const handleDelete = async () => {
    await deleteRoom.mutateAsync(roomId);
    router.push('/hotel/rooms');
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-2xl border border-gray-700 transition-all">
            <ArrowLeft size={20} className="text-gray-400" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Chambre {room.number}</h1>
            <p className="text-gray-400">{room.type}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => { setNewStatus(room.status); setShowStatusEdit(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all">
            <Edit3 size={16} /> Statut
          </button>
          <Link href={`/hotel/rooms/${roomId}/edit`}
            className="flex items-center gap-2 px-5 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all">
            <Edit3 size={16} /> Éditer
          </Link>
          <button onClick={() => setDeleteConfirm(true)}
            className="flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all">
            <Trash2 size={16} /> Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {room.photos?.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {room.photos.map((photo, i) => (
                <img key={i} src={photo} alt={`Chambre ${room.number}`} className="w-full h-52 object-cover rounded-2xl shadow-xl" />
              ))}
            </div>
          ) : (
            <div className="h-52 bg-gray-800/50 rounded-2xl flex items-center justify-center border border-gray-700">
              <BedDouble size={48} className="text-gray-600" />
            </div>
          )}

          {room.amenities?.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4">Équipements</h3>
              <div className="flex flex-wrap gap-3">
                {room.amenities.map((a, i) => (
                  <span key={i} className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-sm text-gray-300 flex items-center gap-2">
                    {a === 'WiFi' && <Wifi size={14} />}
                    {a === 'TV' && <Tv size={14} />}
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className={`p-6 rounded-2xl border-2 ${statusColors[room.status] ?? 'border-gray-700 bg-gray-800/50 text-gray-400'}`}>
            <p className="text-xs font-medium mb-1 opacity-70">Statut</p>
            <p className="text-2xl font-black">{statusLabels[room.status] ?? room.status}</p>
          </div>
          <div className="bg-emerald-900/30 border border-emerald-500/30 rounded-2xl p-6 text-center">
            <DollarSign size={28} className="mx-auto mb-2 text-emerald-400" />
            <p className="text-3xl font-black text-emerald-400">${price}</p>
            <p className="text-sm text-emerald-300 mt-1">Par nuit</p>
          </div>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-2xl p-6 text-center">
            <Users size={28} className="mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-black text-blue-400">{room.maxGuests}</p>
            <p className="text-sm text-blue-300 mt-1">Capacité max</p>
          </div>
        </div>
      </div>

      {showStatusEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Modifier le statut</h3>
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6">
              <option value="AVAILABLE">🟢 Disponible</option>
              <option value="OCCUPIED">🟠 Occupée</option>
              <option value="RESERVED">🔵 Réservée</option>
              <option value="MAINTENANCE">🟡 Maintenance</option>
            </select>
            <div className="flex gap-4">
              <button onClick={() => setShowStatusEdit(false)} className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all">Annuler</button>
              <button onClick={handleStatusUpdate} disabled={updateRoom.isPending}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <CheckCircle size={16} />
                {updateRoom.isPending ? 'Mise à jour...' : 'Confirmer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-red-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <Trash2 size={48} className="mx-auto text-red-400 mb-3" />
              <h3 className="text-xl font-bold text-white">Supprimer la chambre {room.number} ?</h3>
              <p className="text-gray-400 mt-2">Cette action est irréversible.</p>
            </div>
            <div className="flex gap-4">
              <button onClick={() => setDeleteConfirm(false)} className="flex-1 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition-all">Annuler</button>
              <button onClick={handleDelete} disabled={deleteRoom.isPending}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-50">
                {deleteRoom.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
