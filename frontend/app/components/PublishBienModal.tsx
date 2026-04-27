'use client';

import { useState } from 'react';
import { X, Home, MapPin, DollarSign, FileText, Layers, Maximize2, BedDouble } from 'lucide-react';
import { useCreateProperty } from '../../lib/hooks/useCreateProperty';
import { useProvinces } from '../../lib/hooks/useProvinces';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const PROPERTY_TYPES = ['MAISON', 'PARCELLE', 'APPARTEMENT', 'VILLA', 'BUREAU', 'ENTREPOT'];
const LISTING_TYPES = ['LOCATION', 'VENTE'];

const VILLES_BY_PROVINCE: Record<string, string[]> = {
  '1': ['Kinshasa', 'Gombe', 'Limete', 'Ngaliema', 'Kintambo', 'Barumbu', 'Kalamu', 'Lemba', 'Matete', 'Ndjili', 'Masina', 'Kimbanseke'],
  '3': ['Lubumbashi', 'Likasi', 'Kolwezi', 'Kipushi'],
  '4': ['Matadi', 'Boma', 'Muanda'],
  default: ['Ville principale'],
};

export default function PublishBienModal({ isOpen, onClose }: Props) {
  const { data: provinces = [] } = useProvinces();
  const createProperty = useCreateProperty();

  const [form, setForm] = useState({
    type: 'MAISON',
    listingType: 'LOCATION',
    price: '',
    surface: '',
    chambres: '',
    description: '',
    provinceId: '',
    commune: '',
    quartier: '',
    rue: '',
  });

  const villes = VILLES_BY_PROVINCE[form.provinceId] ?? VILLES_BY_PROVINCE['default'];

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.price || !form.provinceId || !form.commune) return;
    createProperty.mutate(
      {
        type: form.type,
        price: parseFloat(form.price),
        description: form.description,
        commune: form.commune,
        quartier: form.quartier,
        rue: form.rue,
        surface: form.surface ? parseFloat(form.surface) : undefined,
        chambres: form.chambres ? parseInt(form.chambres) : undefined,
        status: 'AVAILABLE',
        provinceId: form.provinceId,
      },
      {
        onSuccess: () => {
          onClose();
          setForm({ type: 'MAISON', listingType: 'LOCATION', price: '', surface: '', chambres: '', description: '', provinceId: '', commune: '', quartier: '', rue: '' });
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Home size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Publier un bien</h2>
              <p className="text-xs text-gray-400">Maison, parcelle, appartement...</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Type de bien + Type annonce */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Type de bien *</label>
              <div className="relative">
                <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                  className="w-full pl-9 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  {PROPERTY_TYPES.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Annonce *</label>
              <div className="flex gap-2">
                {LISTING_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set('listingType', t)}
                    className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      form.listingType === t
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prix + Surface + Chambres */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Prix (USD) *</label>
              <div className="relative">
                <DollarSign size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={e => set('price', e.target.value)}
                  placeholder="5000"
                  className="w-full pl-8 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Surface (m²)</label>
              <div className="relative">
                <Maximize2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={form.surface}
                  onChange={e => set('surface', e.target.value)}
                  placeholder="120"
                  className="w-full pl-8 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Chambres</label>
              <div className="relative">
                <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="number"
                  value={form.chambres}
                  onChange={e => set('chambres', e.target.value)}
                  placeholder="3"
                  className="w-full pl-8 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Province + Commune */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Province *</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  required
                  value={form.provinceId}
                  onChange={e => { set('provinceId', e.target.value); set('commune', ''); }}
                  className="w-full pl-9 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="" className="bg-gray-900">Sélectionner</option>
                  {provinces.map((p: any) => <option key={p.id} value={p.id} className="bg-gray-900">{p.nom}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Commune *</label>
              <div className="relative">
                <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <select
                  required
                  value={form.commune}
                  onChange={e => set('commune', e.target.value)}
                  disabled={!form.provinceId}
                  className="w-full pl-9 pr-3 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="" className="bg-gray-900">Sélectionner</option>
                  {villes.map(v => <option key={v} value={v} className="bg-gray-900">{v}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Quartier + Rue */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quartier</label>
              <input
                value={form.quartier}
                onChange={e => set('quartier', e.target.value)}
                placeholder="Gombe"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Rue / Adresse</label>
              <input
                value={form.rue}
                onChange={e => set('rue', e.target.value)}
                placeholder="Avenue de l'Équateur"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Description</label>
            <div className="relative">
              <FileText size={15} className="absolute left-3 top-3 text-gray-500" />
              <textarea
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Décrivez votre bien : état, équipements, accès..."
                rows={3}
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors border border-gray-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={createProperty.isPending}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {createProperty.isPending ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Publication...</>
              ) : 'Publier le bien'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
