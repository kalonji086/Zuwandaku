'use client';

import { useState } from 'react';
import {
  BedDouble, Calendar, Clock, CheckCircle, XCircle,
  MapPin, Star, Phone, ArrowRight, Plus, Search,
} from 'lucide-react';

const ROOMS = [
  { id: '1', number: '101', type: 'Standard', price: 80, floor: 1, capacity: 2, amenities: ['WiFi', 'TV', 'Clim'], available: true, photo: null },
  { id: '2', number: '205', type: 'Deluxe', price: 150, floor: 2, capacity: 2, amenities: ['WiFi', 'TV', 'Clim', 'Minibar'], available: true, photo: null },
  { id: '3', number: '301', type: 'Suite', price: 280, floor: 3, capacity: 4, amenities: ['WiFi', 'TV', 'Clim', 'Minibar', 'Jacuzzi'], available: false, photo: null },
  { id: '4', number: '102', type: 'Standard', price: 80, floor: 1, capacity: 2, amenities: ['WiFi', 'TV'], available: true, photo: null },
];

const TYPE_COLOR: Record<string, string> = {
  Standard: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Deluxe:   'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Suite:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

function RoomCard({ room, onBook }: { room: typeof ROOMS[0]; onBook: (r: typeof ROOMS[0]) => void }) {
  return (
    <div className={`rounded-2xl border bg-[#0d0d14] overflow-hidden transition-all group
      ${room.available ? 'border-white/5 hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5' : 'border-white/5 opacity-60'}`}>
      <div className="h-36 bg-white/3 flex items-center justify-center">
        <BedDouble size={32} className="text-white/10" />
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_COLOR[room.type] ?? TYPE_COLOR.Standard}`}>
            {room.type}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border
            ${room.available ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {room.available ? 'Disponible' : 'Occupée'}
          </span>
        </div>
        <div>
          <p className="font-bold text-white text-sm">Chambre {room.number}</p>
          <p className="text-[11px] text-white/30 mt-0.5">Étage {room.floor} · {room.capacity} pers.</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {room.amenities.map(a => (
            <span key={a} className="text-[9px] bg-white/5 border border-white/5 text-white/30 px-1.5 py-0.5 rounded">{a}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <p className="text-blue-400 font-bold">${room.price}<span className="text-white/25 text-[10px] font-normal">/nuit</span></p>
          <button
            disabled={!room.available}
            onClick={() => onBook(room)}
            className={`flex items-center gap-1 text-[11px] px-3 py-1.5 rounded-lg border transition-colors
              ${room.available
                ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border-blue-500/20'
                : 'bg-white/3 text-white/20 border-white/5 cursor-not-allowed'}`}>
            <Plus size={10} />Réserver
          </button>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ room, onClose, onConfirm }: {
  room: typeof ROOMS[0];
  onClose: () => void;
  onConfirm: (data: { checkIn: string; checkOut: string; guests: number }) => void;
}) {
  const [form, setForm] = useState({ checkIn: '', checkOut: '', guests: 1 });

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl bg-[#0d1526] border border-[#1e3a5f]"
        style={{ boxShadow: '0 0 80px rgba(37,99,235,0.1), 0 32px 64px rgba(0,0,0,0.8)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e3a5f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
              <BedDouble size={15} className="text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Réserver — Chambre {room.number}</p>
              <p className="text-xs text-[#6b7fa3]">{room.type} · ${room.price}/nuit</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg border border-[#1e3a5f] flex items-center justify-center text-[#6b7fa3] hover:text-red-400 hover:border-red-500/40 transition-all">✕</button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7fa3] mb-1.5 block">Arrivée *</label>
              <input type="date" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-[#060d1a] border border-[#1e3a5f] text-[#f0f4ff] outline-none focus:border-blue-500/50" />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7fa3] mb-1.5 block">Départ *</label>
              <input type="date" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                min={form.checkIn || new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2.5 rounded-xl text-sm bg-[#060d1a] border border-[#1e3a5f] text-[#f0f4ff] outline-none focus:border-blue-500/50" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[#6b7fa3] mb-1.5 block">Nombre de personnes</label>
            <select value={form.guests} onChange={e => setForm(f => ({ ...f, guests: +e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-[#060d1a] border border-[#1e3a5f] text-[#f0f4ff] outline-none focus:border-blue-500/50">
              {Array.from({ length: room.capacity }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          {nights > 0 && (
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#6b7fa3]">{nights} nuit{nights > 1 ? 's' : ''} × ${room.price}</p>
                <p className="text-xl font-black text-blue-400">${(nights * room.price).toLocaleString()}</p>
              </div>
              <Calendar size={24} className="text-blue-400/40" />
            </div>
          )}

          <button
            disabled={!form.checkIn || !form.checkOut || nights === 0}
            onClick={() => onConfirm(form)}
            className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg,#2563eb,#3b82f6)', boxShadow: '0 0 24px rgba(37,99,235,0.3)' }}>
            Confirmer la réservation
          </button>
        </div>
      </div>
    </div>
  );
}

const MY_BOOKINGS = [
  { id: 'RB001', room: '205', type: 'Deluxe', checkIn: '2025-06-10', checkOut: '2025-06-13', nights: 3, total: 450, status: 'CONFIRMED' },
  { id: 'RB002', room: '101', type: 'Standard', checkIn: '2025-05-01', checkOut: '2025-05-03', nights: 2, total: 160, status: 'COMPLETED' },
];

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PENDING:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  COMPLETED: 'bg-white/5 text-white/30 border-white/10',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function ClientHotelPage() {
  const [tab, setTab] = useState<'rooms' | 'mybookings'>('rooms');
  const [search, setSearch] = useState('');
  const [bookingRoom, setBookingRoom] = useState<typeof ROOMS[0] | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const filtered = ROOMS.filter(r =>
    r.number.includes(search) || r.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = (data: any) => {
    setBookingRoom(null);
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 4000);
  };

  return (
    <div className="space-y-6">
      {bookingRoom && (
        <BookingModal room={bookingRoom} onClose={() => setBookingRoom(null)} onConfirm={handleConfirm} />
      )}

      {confirmed && (
        <div className="fixed top-6 right-6 z-[400] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#0d1526] border border-emerald-500/30 shadow-2xl animate-in slide-in-from-top-2">
          <CheckCircle size={18} className="text-emerald-400" />
          <p className="text-sm font-semibold text-white">Réservation confirmée ! Nous vous contacterons sous 24h.</p>
        </div>
      )}

      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d14] p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/8 via-transparent to-orange-500/5 pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Module</p>
            <h1 className="text-2xl font-bold text-white mb-1">Hôtel <span className="text-amber-400">·</span></h1>
            <p className="text-sm text-white/40">Réservez une chambre à Kinshasa, RDC</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 items-center justify-center">
            <BedDouble size={24} className="text-amber-400" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/3 border border-white/5 rounded-xl p-1 w-fit">
        {([['rooms', 'Chambres disponibles', <BedDouble size={13} />], ['mybookings', `Mes réservations (${MY_BOOKINGS.length})`, <Calendar size={13} />]] as const).map(([id, label, icon]) => (
          <button key={id} onClick={() => setTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all tracking-wide
              ${tab === id ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20 shadow-sm' : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Chambres */}
      {tab === 'rooms' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-[#0d0d14] border border-white/5 rounded-xl px-4 py-2.5 w-full max-w-xs">
            <Search size={14} className="text-white/25 shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Chercher chambre ou type..."
              className="bg-transparent text-sm text-white/70 placeholder:text-white/20 outline-none w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(r => <RoomCard key={r.id} room={r} onBook={setBookingRoom} />)}
          </div>
        </div>
      )}

      {/* Mes réservations */}
      {tab === 'mybookings' && (
        <div className="space-y-3">
          {MY_BOOKINGS.map(b => (
            <div key={b.id} className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] px-2 py-1 rounded-full font-semibold border ${STATUS_STYLE[b.status]}`}>
                      {b.status === 'CONFIRMED' ? 'Confirmée' : b.status === 'COMPLETED' ? 'Terminée' : b.status}
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded-full border ${TYPE_COLOR[b.type] ?? TYPE_COLOR.Standard}`}>{b.type}</span>
                  </div>
                  <p className="font-bold text-white/80">Chambre {b.room} <span className="text-white/25 font-normal text-sm">#{b.id}</span></p>
                  <p className="text-[11px] text-white/30 mt-1 flex items-center gap-1">
                    <Calendar size={10} />
                    {new Date(b.checkIn).toLocaleDateString('fr-FR')} → {new Date(b.checkOut).toLocaleDateString('fr-FR')}
                    <span className="ml-1">· {b.nights} nuit{b.nights > 1 ? 's' : ''}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-2xl font-bold text-amber-400">${b.total.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
