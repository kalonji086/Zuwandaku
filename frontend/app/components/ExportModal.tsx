"use client";

import { useState } from 'react';
import { X, Download, Calendar, FileText, BarChart3, CheckCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('xlsx');

  const handleExport = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    // Mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `rapport-annuel-2024.${format}`;
    link.click();
    
    alert('Rapport annuel 2024 téléchargé!');
    onClose();
  };

  const formats = [
    { id: 'xlsx', label: 'Excel (.xlsx)', icon: '📊' },
    { id: 'pdf', label: 'PDF', icon: '📄' },
    { id: 'csv', label: 'CSV', icon: '📈' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-lg w-full">
        <div className="p-8 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Download size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Export Annuel 2024</h3>
              <p className="text-gray-400">Télécharger rapport complet</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-all">
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <Calendar size={16} />
              <span>Période: 1er Janvier - 31 Décembre 2024</span>
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <FileText size={16} />
              <span>Contenu: 42 transactions, 28 biens, 15 véhicules</span>
            </div>
            <div className="text-sm text-gray-400 flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Volume: 285 000 000 CDF (commissions incluses)</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-3">Format d'export</label>
            <div className="grid grid-cols-3 gap-2">
              {formats.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    format === f.id
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <span className="text-2xl">{f.icon}</span>
                  <span className="text-xs font-medium">{f.label.split(' ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleExport}
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-8 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Préparation...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Télécharger Rapport 2024
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="p-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleExport}
              disabled={loading}
              className="p-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Confirmer export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

