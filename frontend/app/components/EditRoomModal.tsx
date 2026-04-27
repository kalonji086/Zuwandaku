"use client";

import { useState } from 'react';
import { X, DollarSign, Users, Wifi, Tv } from 'lucide-react';

interface EditRoomModalProps {
  room: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EditRoomModal({ room, isOpen, onClose, onSave }: EditRoomModalProps) {
  const [formData, setFormData] = useState(room);
  const amenitiesList = ['AC', 'WiFi', 'TV', 'Mini-bar', 'Jacuzzi', 'Balcon'];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-8">
      <div className="bg-gray-900/95 backdrop-blur-xl rounded-4xl p-12 max-w-2xl w-full border border-gray-700 shadow-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-12">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Éditer {room.number}
          </h3>
          <button 
            onClick={onClose} 
            className="p-3 hover:bg-gray-800/50 rounded-3xl border border-gray-700 transition-all group"
          >
            <X size={28} className="text-gray-400 group-hover:text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Numéro & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <label className="block text-xl font-bold text-gray-300 mb-4">Numéro</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full p-6 bg-gray-800/50 border-2 border-gray-600 rounded-3xl text-2xl font-bold text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-gray-300 mb-4">Type</label>
              <input
                type="text"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-6 bg-gray-800/50 border-2 border-gray-600 rounded-3xl text-xl font-semibold text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition-all"
                required
              />
            </div>
          </div>

          {/* Prix & Capacité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <label className="block text-xl font-bold text-gray-300 mb-4">Prix/nuit ($)</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                className="w-full p-6 bg-gray-800/50 border-2 border-gray-600 rounded-3xl text-3xl font-black text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/30 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xl font-bold text-gray-300 mb-4">Capacité max</label>
              <select
                value={formData.maxGuests}
                onChange={(e) => setFormData(prev => ({ ...prev, maxGuests: parseInt(e.target.value) }))}
                className="w-full p-6 bg-gray-800/50 border-2 border-gray-600 rounded-3xl text-2xl font-semibold text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/30 transition-all"
              >
                {[1,2,3,4,5,6].map(n => (
                  <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-12">
            <label className="block text-xl font-bold text-gray-300 mb-8">
              Équipements inclus
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {amenitiesList.map(amenity => (
                <label key={amenity} className="flex items-center gap-4 p-8 rounded-3xl border-2 cursor-pointer group hover:border-blue-500 hover:bg-blue-500/10 transition-all">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-7 h-7 rounded-lg border-2 text-blue-600 focus:ring-blue-500 focus:ring-2 bg-gray-800/50"
                  />
                  <div className="flex items-center gap-4 text-xl">
{amenity === 'AC' && <Wifi size={32} className="text-blue-400" />}
                    {amenity === 'WiFi' && <Wifi size={32} />}
                    {amenity === 'TV' && <Tv size={32} />}
                    <span className="font-bold text-white">{amenity}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-8 pt-12 border-t-2 border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-20 border-2 border-gray-700 hover:border-gray-500 bg-gray-900/50 text-gray-300 font-bold text-2xl rounded-4xl transition-all hover:shadow-2xl hover:bg-gray-800/50 backdrop-blur-xl shadow-xl"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 h-20 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-2xl rounded-4xl shadow-2xl hover:shadow-emerald-500/25 transition-all"
            >
              💾 Sauvegarder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

