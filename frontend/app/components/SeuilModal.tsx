"use client";

import { useState } from 'react';
import { X, DollarSign, AlertCircle, CheckCircle, Calculator } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (threshold: number) => void;
  currentThreshold?: number;
}

export default function SeuilModal({ isOpen, onClose, onSave, currentThreshold = 50000 }: Props) {
  const [threshold, setThreshold] = useState(currentThreshold);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    onSave(threshold);
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-sm w-full max-h-[80vh]">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Seuil minimum</h3>
              <p className="text-sm text-gray-400">Paiements < seuil = fin de mois</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-all">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-white mb-3">
              Montant seuil (CDF)
            </label>
            <div className="relative">
              <DollarSign size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400" />
              <input
                type="number"
                min="0"
                step="1000"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-2xl text-white text-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/50 focus:outline-none transition-all"
                placeholder="50000"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Ex: Commissions < 50.000 CDF payées fin de mois
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-400">Seuil actuel</span>
              <span className="font-mono text-emerald-400">{currentThreshold.toLocaleString()} CDF</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl">
              <span className="text-gray-400">Nouveau seuil</span>
              <span className="font-mono text-white font-semibold">{threshold.toLocaleString()} CDF</span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3.5 px-6 rounded-xl font-semibold transition-all"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || threshold === currentThreshold}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Enregistrer seuil
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

