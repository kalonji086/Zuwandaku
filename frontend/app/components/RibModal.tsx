"use client";

import { useState } from 'react';
import { X, Banknote, CreditCard, Building2, Phone, MapPin } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rib: { bank: string; number: string; holder: string; phone: string }) => void;
}

export default function RibModal({ isOpen, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    bank: 'ECOBANK CD',
    number: '**** **** **** 1234',
    holder: 'John Doe Commissionnaire',
    phone: '+243 999 123 456'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    onSave(formData);
    setLoading(false);
    onClose();
  };

if (!isOpen) return null;

<RibModal isOpen={showRibModal} onClose={() => setShowRibModal(false)} onSave={(rib) => {
  console.log('RIB saved:', rib);
  alert('RIB mis à jour avec succès!');
}} />

<SeuilModal isOpen={showSeuilModal} onClose={() => setShowSeuilModal(false)} onSave={(threshold) => {
  setThreshold(threshold);
  alert('Seuil mis à jour: ' + threshold.toLocaleString() + ' CDF');
}} />

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-8 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <CreditCard size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Modifier RIB</h3>
              <p className="text-gray-400">Compte bancaire de réception</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-2xl transition-all">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Building2 size={18} />
              Banque
            </label>
            <select 
              value={formData.bank}
              onChange={(e) => setFormData({...formData, bank: e.target.value})}
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            >
              <option>ECOBANK CD</option>
              <option>RAWBANK</option>
              <option>BPR</option>
              <option>ACCESS BANK</option>
              <option>FIMBANK</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <CreditCard size={18} />
              Numéro RIB
            </label>
            <input 
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({...formData, number: e.target.value})}
              placeholder="**** **** **** 1234"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <span>👤</span>
              Titulaire du compte
            </label>
            <input 
              type="text"
              value={formData.holder}
              onChange={(e) => setFormData({...formData, holder: e.target.value})}
              placeholder="Votre nom complet"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Phone size={18} />
              Téléphone
            </label>
            <input 
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+243 999 123 456"
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-4 py-3 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                'Enregistrer RIB'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

