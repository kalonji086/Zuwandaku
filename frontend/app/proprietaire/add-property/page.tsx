'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, Plus, X } from 'lucide-react';
import { useCreateProperty } from '../../../lib/hooks';

const PROPERTY_TYPES = ['HOUSE', 'APARTMENT', 'LAND', 'COMMERCIAL', 'OFFICE'];
const PROVINCES = ['Kinshasa', 'Kasai', 'Katanga', 'Nord-Kivu', 'Sud-Kivu'];
const COMMUNES = ['Gombe', 'Kinshasa', 'Ngaliema', 'Kalamu', 'Mont-Ngafula', 'Makala', 'Limete', 'Lingala', 'Kasavubu'];
const QUARTIERS = ['Downtown', 'Plateau', 'Binza', 'Selembao', 'Kintambo', 'Kitambo', 'Kasanga', 'Bandalungwa', 'Masina'];

export default function AddProperty() {
  const [formData, setFormData] = useState({
    type: 'HOUSE',
    province: 'Kinshasa',
    commune: 'Gombe',
    quartier: 'Downtown',
    price: '',
    surface: '',
    rooms: '',
    bathrooms: '',
    description: '',
    photos: [] as File[],
  });

  const [photoPreview, setPhotoPreview] = useState<string[]>([]);
  const createProperty = useCreateProperty();

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: any) => {
    const files = Array.from(e.target.files || []) as File[];
    setFormData(prev => ({ ...prev, photos: [...prev.photos, ...files] }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(prev => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
    setPhotoPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Submission logic will be implemented with API integration
    console.log('Form submitted:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/proprietaire/properties" className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all">
          <ArrowLeft size={20} className="text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Ajouter un bien</h1>
          <p className="text-gray-400">Publiez votre propriété immobilière</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Informations de base</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Type de bien *</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {PROPERTY_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Prix (USD) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="50000"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Surface */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Surface (m²)</label>
              <input
                type="number"
                name="surface"
                value={formData.surface}
                onChange={handleInputChange}
                placeholder="250"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Rooms */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Chambres</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleInputChange}
                placeholder="3"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Salles de bain</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleInputChange}
                placeholder="2"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Localisation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Province */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Province *</label>
              <select
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {PROVINCES.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>

            {/* Commune */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Commune *</label>
              <select
                name="commune"
                value={formData.commune}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {COMMUNES.map(com => (
                  <option key={com} value={com}>{com}</option>
                ))}
              </select>
            </div>

            {/* Quartier */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Quartier *</label>
              <select
                name="quartier"
                value={formData.quartier}
                onChange={handleInputChange}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              >
                {QUARTIERS.map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Description</h2>
          
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Décrivez votre bien en détail (équipements, commodités, etc.)"
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-32 resize-none"
          />
        </div>

        {/* Photos */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Photos</h2>
          
          {/* Upload Area */}
          <label className="flex items-center justify-center w-full p-8 bg-gray-800/50 border-2 border-dashed border-gray-700 rounded-xl hover:border-blue-500 hover:bg-blue-500/5 transition-all cursor-pointer">
            <div className="text-center">
              <Upload size={32} className="text-gray-400 mx-auto mb-3" />
              <p className="text-white font-semibold mb-1">Cliquez pour ajouter des photos</p>
              <p className="text-sm text-gray-400">ou glissez-déposez</p>
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>

          {/* Photo Gallery */}
          {photoPreview.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Photos ajoutées ({photoPreview.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {photoPreview.map((preview, idx) => (
                  <div key={idx} className="relative group rounded-lg overflow-hidden">
                    <img src={preview} alt={`Photo ${idx + 1}`} className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                    >
                      <X size={24} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 justify-end">
          <Link
            href="/proprietaire/properties"
            className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
          >
            Annuler
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Publier le bien
          </button>
        </div>
      </form>
    </div>
  );
}
