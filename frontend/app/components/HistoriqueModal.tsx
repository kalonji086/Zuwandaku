"use client";

import { useState } from 'react';
import { X, TrendingUp, DollarSign, Calendar, FileText, Filter, Download } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function HistoriqueModal({ isOpen, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  const commissions = [
    { date: '2024-12-15', amount: 1_250_000, type: 'Location villa Gombe', status: 'Payé' },
    { date: '2024-12-10', amount: 2_250_000, type: 'Vente Toyota Prado', status: 'Payé' },
    { date: '2024-12-05', amount: 600_000, type: 'Appart Limete F3', status: 'Payé' },
    { date: '2024-11-28', amount: 225_000, type: 'Parcelle Ngaliema', status: 'Payé' },
  ];

  const filteredCommissions = commissions.filter(c => filter === 'all' || c.status === filter);

  const handleExport = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'historique-commissions.csv';
    link.click();
    
    alert('Historique commissions téléchargé!');
    onClose();
  };

  const statusColors = {
    Payé: 'bg-green-500/20 text-green-400 border-green-500/30',
    En attente: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <DollarSign size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Historique Commissions</h3>
                <p className="text-gray-400">Suivi paiements 2024</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-gray-800 rounded-2xl transition-all">
              <X size={24} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-4 bg-gray-800/50 p-4 rounded-2xl">
            <div className="flex gap-2">
              <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'all' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                Toutes ({commissions.length})
              </button>
              <button onClick={() => setFilter('Payé')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === 'Payé' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>
                Payées ({commissions.filter(c => c.status === 'Payé').length})
              </button>
            </div>
            <div className="ml-auto">
              <button 
                onClick={handleExport}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg"
              >
                <Download size={16} />
                Exporter CSV
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {filteredCommissions.map((commission, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-800 rounded-2xl hover:bg-gray-750 transition-all border border-gray-700">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-white truncate">{commission.type}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${commission.status === 'Payé' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {commission.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{commission.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-emerald-400">
                    {commission.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">CDF</div>
                </div>
              </div>
            ))}
          </div>

          {filteredCommissions.length === 0 && (
            <div className="text-center py-16 border-2 border-dashed border-gray-700 rounded-3xl">
              <FileText size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">Aucune commission</h3>
              <p className="text-gray-500">Filtrez ou ajoutez des transactions</p>
            </div>
          )}

          <div className="pt-6 border-t border-gray-800">
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>Total {filter === 'all' ? commissions.length : filteredCommissions.length} commissions</p>
              <p>Total: {filteredCommissions.reduce((sum, c) => sum + c.amount, 0).toLocaleString()} CDF</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

