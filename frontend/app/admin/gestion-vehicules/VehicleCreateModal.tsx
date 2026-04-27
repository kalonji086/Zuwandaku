'use client';

import { useState } from 'react';
import { X, Truck, MapPin, DollarSign, Calendar, ImagePlus, Check, Loader2 } from "lucide-react";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VehicleCreateModal({ isOpen, onClose, onSuccess }: Props) {
  const [formData, setFormData] = useState({
    marque: '',
    modele: '',
    annee: 2024,
    type: 'LOCATION',
    pricePerDay: 0,
    priceSale: 0,
    provinceId: '',
    villeId: '',
    photos: [] as File[],
    availability: true
  });
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [villes, setVilles] = useState([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
data.append('marque', formData.marque);
data.append('modele', formData.modele);
    data.append('annee', formData.annee.toString());
data.append('type', formData.type);
data.append('provinceId', formData.provinceId);
data.append('villeId', formData.villeId);
data.append('availability', formData.availability.toString());
    
data.append('pricePerDay', formData.pricePerDay.toString());
data.append('priceSale', formData.priceSale.toString());
    
    formData.photos.forEach((photo, index) => {
      data.append(`photos[${index}]`, photo);
    });

    try {
      const response = await fetch('/api/vehicles', {
        method: 'POST',
        body: data,
      });
      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        alert('Erreur lors de la création');
      }
      onSuccess();
      onClose();
    } catch (error) {
console.error('Error creating vehicle:', error);
alert('Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Truck className="text-blue-400" size={28} />
            Nouveau véhicule
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex-1 overflow-y-auto space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Marque *</label>
              <input
                required
                value={formData.marque}
                onChange={(e) => setFormData({...formData, marque: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Modèle *</label>
              <input
                required
                value={formData.modele}
                onChange={(e) => setFormData({...formData, modele: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Hilux"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Année *</label>
              <input
                required
                type="number"
                value={formData.annee}
                onChange={(e) => setFormData({...formData, annee: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="2024"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Type *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="LOCATION">Location</option>
                <option value="VENTE">Vente</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Province *</label>
              <select
                required
                value={formData.provinceId}
                onChange={(e) => setFormData({...formData, provinceId: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Sélectionner</option>
                {/* Dynamic provinces */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Ville *</label>
              <select
                required
                value={formData.villeId}
                onChange={(e) => setFormData({...formData, villeId: e.target.value})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Sélectionner</option>
                {/* Dynamic villes */}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Prix/jour (USD)</label>
              <input
                type="number"
                value={formData.pricePerDay}
                onChange={(e) => setFormData({...formData, pricePerDay: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Prix vente (USD)</label>
              <input
                type="number"
                value={formData.priceSale}
                onChange={(e) => setFormData({...formData, priceSale: Number(e.target.value)})}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="25000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Photos (optionnel)</label>
            <div className="border-2 border-dashed border-gray-700 rounded-2xl p-8 text-center hover:border-blue-500 hover:bg-gray-800/50 transition-all">
              <ImagePlus size={48} className="mx-auto text-gray-500 mb-4" />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFormData({...formData, photos: Array.from(e.target.files || [])})}
                className="hidden"
                id="photos"
              />
              <label htmlFor="photos" className="cursor-pointer">
                <p className="text-white font-semibold">Cliquer ou glisser images</p>
                <p className="text-gray-400 text-sm mt-1">Max 10 photos, JPG/PNG jusqu\'à 5Mo</p>
              </label>
              {formData.photos.length > 0 && (
                <p className="text-green-400 mt-2 font-medium">{formData.photos.length} image(s) sélectionnée(s)</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.availability}
                onChange={(e) => setFormData({...formData, availability: e.target.checked})}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              Publier immédiatement (disponible)
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all text-sm border border-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Check size={20} />
                  Créer & Publier
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
