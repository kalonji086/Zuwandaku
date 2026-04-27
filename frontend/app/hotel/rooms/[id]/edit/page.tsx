"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, X, Users, Wifi, Tv, ImagePlus, Loader2 } from 'lucide-react';
import { useRoom, useUpdateRoom } from '../../../../../lib/hooks';

const amenitiesList = ['AC', 'WiFi', 'TV', 'Mini-bar', 'Jacuzzi', 'Vue jardin', 'Balcon', 'Cuisine', 'Bureau', 'Fer à repasser', 'Séchoir', 'Coffre-fort'];

export default function EditRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.id as string;
  const { room, loading } = useRoom(roomId);
  const updateRoom = useUpdateRoom();

  const [formData, setFormData] = useState({ number: '', type: '', price: '', maxGuests: 2, status: 'AVAILABLE' });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);

  useEffect(() => {
    if (!room) return;
    setFormData({
      number: room.number,
      type: room.type,
      price: String(room.pricePerNight ?? (room as any).price ?? ''),
      maxGuests: room.maxGuests,
      status: room.status,
    });
    setSelectedAmenities(room.amenities ?? []);
    setPhotoPreviews(room.photos ?? []);
  }, [room]);

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setPhotoPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
    setPhotoFiles(prev => [...prev, ...files]);
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateRoom.mutateAsync({
      id: roomId,
      data: { ...formData, price: parseFloat(formData.price), amenities: selectedAmenities },
    });
    router.push(`/hotel/rooms/${roomId}`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="h-12 w-12 animate-spin text-blue-400" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-2xl border border-gray-700 transition-all">
          <ArrowLeft size={20} className="text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">Modifier chambre {formData.number}</h1>
          <p className="text-gray-400">Mettez à jour les informations</p>
        </div>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Numéro', key: 'number', type: 'text', placeholder: '101' },
              { label: 'Type', key: 'type', type: 'text', placeholder: 'Suite Deluxe' },
              { label: 'Prix/nuit (USD)', key: 'price', type: 'number', placeholder: '250' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-300 mb-2">{label}</label>
                <input
                  type={type}
                  value={(formData as any)[key]}
                  onChange={(e) => setFormData(prev => ({ ...prev, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Statut</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800/70 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="AVAILABLE">Disponible</option>
              <option value="OCCUPIED">Occupée</option>
              <option value="RESERVED">Réservée</option>
              <option value="MAINTENANCE">Maintenance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Capacité</label>
            <div className="flex gap-3">
              {[1, 2, 3, 4].map(n => (
                <button key={n} type="button" onClick={() => setFormData(prev => ({ ...prev, maxGuests: n }))}
                  className={`flex-1 p-4 rounded-xl border-2 font-bold transition-all ${formData.maxGuests === n ? 'bg-blue-600 border-blue-500 text-white' : 'border-gray-700 hover:border-blue-500 text-gray-300'}`}>
                  <Users size={20} className="mx-auto mb-1" />{n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Équipements</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {amenitiesList.map(amenity => (
                <label key={amenity} className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${selectedAmenities.includes(amenity) ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}>
                  <input type="checkbox" checked={selectedAmenities.includes(amenity)}
                    onChange={() => setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity])}
                    className="sr-only" />
                  {amenity === 'WiFi' && <Wifi size={14} />}
                  {amenity === 'TV' && <Tv size={14} />}
                  <span className="text-sm font-medium">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Photos</label>
            <div className="border-2 border-dashed border-gray-600 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all"
              onClick={() => document.getElementById('photo-upload-edit')?.click()}>
              <input id="photo-upload-edit" type="file" multiple accept="image/*" onChange={handlePhotosChange} className="sr-only" />
              <ImagePlus size={32} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400">Cliquer pour ajouter des photos</p>
            </div>
            {photoPreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {photoPreviews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <img src={preview} alt={`Preview ${i}`} className="w-full aspect-square object-cover rounded-xl" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={() => router.back()}
              className="flex-1 py-4 border border-gray-700 text-gray-300 font-bold rounded-2xl hover:bg-gray-800 transition-all">
              Annuler
            </button>
            <button type="submit" disabled={updateRoom.isPending}
              className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <CheckCircle size={20} />
              {updateRoom.isPending ? 'Mise à jour...' : 'Mettre à jour'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
