"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, BedDouble, Users, DollarSign, Wifi, ImagePlus, Upload, X, CheckCircle, Wind, Tv } from 'lucide-react';
import { useCreateRoom } from '@/lib/hooks';

export default function NewRoomPage() {
  const router = useRouter();
  const createRoom = useCreateRoom();
  
  const [formData, setFormData] = useState({
    number: '',
    type: '',
    price: '',
    maxGuests: 2,
    amenities: [],
    photos: [] as File[],
    status: 'AVAILABLE' as const,
  });
  
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const amenitiesList = [
    'AC', 'WiFi', 'TV', 'Mini-bar', 'Jacuzzi', 'Vue jardin', 'Balcon', 'Cuisine',
    'Bureau', 'Fer à repasser', 'Séchoir', 'Coffre-fort'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPhotoPreviews(newPreviews);
    setFormData(prev => ({ ...prev, photos: files }));
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, photos: newPhotos }));
    setPhotoPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      amenities: selectedAmenities,
      price: parseFloat(formData.price),
      photos: photoPreviews, // URLs for now
    };
    
    try {
      await createRoom.mutateAsync(data);
      router.push('/hotel/rooms');
      router.refresh();
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900/20 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-gray-800/50 hover:bg-gray-700 rounded-2xl border border-gray-700 transition-all backdrop-blur-sm"
          >
            <ArrowLeft size={20} className="text-gray-400 hover:text-white" />
          </button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Nouvelle chambre
            </h1>
            <p className="text-xl text-gray-400 mt-2">Remplissez les informations de la chambre</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4">
                  Numéro *
                </label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                  placeholder="101"
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm text-xl font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4">
                  Type *
                </label>
                <input
                  type="text"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  placeholder="Suite Deluxe"
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50 backdrop-blur-sm text-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4">
                  Prix/nuit (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="250"
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 backdrop-blur-sm text-xl font-bold text-emerald-400"
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4">
                Capacité maximale
              </label>
              <div className="flex gap-4">
                {[1,2,3,4].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, maxGuests: n }))}
                    className={`flex-1 p-5 rounded-2xl border-4 font-bold text-xl transition-all ${
                      formData.maxGuests === n
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 border-blue-500 shadow-2xl shadow-blue-500/25 text-white scale-105'
                        : 'bg-gray-800/50 border-gray-700 hover:border-blue-500 hover:bg-blue-500/10 text-gray-300'
                    }`}
                  >
                    <Users size={28} className="mx-auto mb-2" />
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-6">
                Équipements
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {amenitiesList.map(amenity => (
                  <label key={amenity} className="group relative p-6 rounded-2xl border-2 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-500/5">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="sr-only peer"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gray-800/50 peer-checked:bg-blue-500/10 peer-checked:border-blue-500 border-2 border-transparent transition-all" />
                    <div className="relative z-10 flex items-center gap-3 text-gray-300 group-hover:text-blue-400 transition-colors">
                      {amenity === 'AC' && <Wind size={24} />}
                      {amenity === 'WiFi' && <Wifi size={24} />}
                      {amenity === 'TV' && <Tv size={24} />}
                      {amenity === 'Mini-bar' && <DollarSign size={24} />}
{amenity === 'Jacuzzi' && <BedDouble size={24} />}
                      <span className="font-medium">{amenity}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-6">
                Photos de la chambre
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-3xl p-12 text-center group cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 transition-all" onClick={() => document.getElementById('photo-upload')?.click()}>
                <input
                  id="photo-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotosChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-all border-4 border-dashed border-gray-700 group-hover:border-blue-400">
                    <ImagePlus size={32} className="text-gray-500 group-hover:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white mb-1 group-hover:text-blue-400">Cliquer pour ajouter</p>
                    <p className="text-gray-500">PNG, JPG jusqu'à 5Mb (recommandé 1200x800)</p>
                  </div>
                </div>
              </div>
              
              {photoPreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
                  {photoPreviews.map((preview, i) => (
                    <div key={i} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${i + 1}`}
                        className="w-full aspect-square object-cover rounded-2xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-6 pt-8 border-t border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 h-16 border-2 border-gray-700 hover:border-gray-600 bg-gray-900/50 text-gray-300 font-bold text-lg rounded-3xl transition-all backdrop-blur-sm hover:bg-gray-800/50 shadow-xl hover:shadow-2xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={createRoom.isPending}
                className="flex-1 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-lg rounded-3xl transition-all shadow-2xl hover:shadow-3xl disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <CheckCircle size={24} />
                {createRoom.isPending ? 'Création...' : 'Créer la chambre'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

