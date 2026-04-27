"use client";

import Link from 'next/link';
import { Eye, Edit3, Trash2, CheckCircle, XCircle, BedDouble, Users, DollarSign, KeyRound, Wifi, Tv } from 'lucide-react';

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';
  maxGuests: number;
  amenities: string[];
  photos: string[];
  guest?: string;
}

interface RoomCardProps {
  room: Room;
}

const statusColors = {
  AVAILABLE: 'bg-emerald-500/20 border-emerald-500 text-emerald-400',
  OCCUPIED: 'bg-orange-500/20 border-orange-500 text-orange-400',
  MAINTENANCE: 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
};

export default function RoomCard({ room }: RoomCardProps) {
  const StatusIcon = room.status === 'AVAILABLE' ? CheckCircle : room.status === 'OCCUPIED' ? Users : XCircle;

  return (
    <Link href={`/hotel/rooms/${room.id}`} className="group bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700/50 hover:border-blue-500/50 hover:shadow-blue-500/20 transition-all hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
      <div className="relative h-32 mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <img 
          src={room.photos[0] || '/room-placeholder.jpg'} 
          alt={room.type}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border-2 flex items-center gap-1 ${statusColors[room.status as keyof typeof statusColors]}`}>
          <StatusIcon size={12} />
          {room.status === 'AVAILABLE' ? 'Libre' : room.status === 'OCCUPIED' ? 'Occupée' : 'Maintenance'}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{room.number}</h3>
          <div className="flex items-center gap-1 text-sm font-bold text-emerald-400">
            <DollarSign size={16} />
            ${room.price}/nuit
          </div>
        </div>

        <p className="text-gray-400 line-clamp-1">{room.type}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users size={14} />
          {room.maxGuests} max
        </div>

        {room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.amenities.slice(0, 4).map((amenity, i) => {
              const Icon = amenity.includes('WiFi') ? Wifi : amenity.includes('AC') ? Wifi : Tv;
              return (
                <div key={i} className="px-2 py-1 bg-gray-800/50 rounded-lg text-xs flex items-center gap-1 border border-gray-700">
                  <Icon size={12} />
                  {amenity}
                </div>
              );
            })}
            {room.amenities.length > 4 && (
              <div className="px-2 py-1 bg-gray-800/50 rounded-lg text-xs text-gray-500 border border-gray-700">
                +{room.amenities.length - 4}
              </div>
            )}
          </div>
        )}

        {room.status === 'OCCUPIED' && room.guest && (
          <div className="text-xs text-orange-400 bg-orange-900/30 p-2 rounded-lg border border-orange-900/50">
            Occupée par: {room.guest}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-800">
          <Link href={`/hotel/rooms/${room.id}`} className="flex-1 text-center text-blue-400 hover:text-blue-300 text-sm font-medium py-2 px-4 border border-blue-500/30 rounded-xl hover:bg-blue-500/10 transition-all">
            <Eye size={16} className="inline-block mr-1" />
            Détails
          </Link>
          <Link href={`/hotel/rooms/${room.id}/edit`} className="p-2 hover:bg-blue-500/20 rounded-xl border border-gray-700 transition-all">
            <Edit3 size={16} className="text-gray-400 group-hover:text-blue-400" />
          </Link>
          <button className="p-2 hover:bg-red-500/20 rounded-xl border border-gray-700 transition-all">
            <Trash2 size={16} className="text-gray-400 hover:text-red-400" />
          </button>
        </div>
      </div>
    </Link>
  );
}

