"use client";

import { useState } from 'react';
import { X, Users, TrendingUp, Crown, Award, Star, Trophy } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PerformanceModal({ isOpen, onClose }: Props) {
  const [tab, setTab] = useState('classement');

  const classement = [
    { rank: 1, name: 'Marie Kabila', commissions: 4_250_000, transactions: 12, avatar: '👩‍💼' },
    { rank: 2, name: 'Paul Tshisekedi', commissions: 3_850_000, transactions: 10, avatar: '👨‍💼' },
    { rank: 3, name: 'Jean Dupont', commissions: 2_150_000, transactions: 8, avatar: '👨' },
    { rank: 4, name: 'Société XYZ', commissions: 1_750_000, transactions: 6, avatar: '🏢' },
    { rank: 5, name: 'Vous', commissions: 1_250_000, transactions: 5, avatar: '⭐' },
  ];

  const stats = {
    totalRéseau: 156,
    top5: 23_050_000,
    votreRang: 5,
    votrePart: '8.4%'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/30 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-purple-500/20 sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                <Crown size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Performance Réseau
                </h3>
                <p className="text-gray-400">Classement commissionnaires 2024</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-purple-500/20 rounded-2xl transition-all group">
              <X size={24} className="text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Stats globales */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <Users size={20} className="text-purple-400" />
                <span className="text-sm text-purple-400 font-medium">Total réseau</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalRéseau}</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp size={20} className="text-emerald-400" />
                <span className="text-sm text-emerald-400 font-medium">Top 5 total</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400">{stats.top5.toLocaleString()}</div>
              <p className="text-xs text-emerald-400/80 mt-1">CDF</p>
            </div>
          </div>

          {/* Onglets */}
          <div className="flex bg-gray-800/50 rounded-2xl p-1">
            <button 
              onClick={() => setTab('classement')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                tab === 'classement' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Classement Général
            </button>
            <button 
              onClick={() => setTab('vos-stats')}
              className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                tab === 'vos-stats' 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Vos Statistiques
            </button>
          </div>

          {tab === 'classement' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">Top 5 commissionnaires (commissions 2024)</p>
              {classement.map((user, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-800 border border-gray-700 transition-all group">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all flex-shrink-0">
                    <span className="text-2xl">{user.rank === 1 ? <Trophy size={20} className="text-yellow-400" /> : user.rank === 2 ? <Award size={20} className="text-gray-400" /> : <span className="font-bold text-white">{user.rank}</span>}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{user.avatar}</span>
                      <h4 className="font-bold text-white truncate">{user.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">TX: {user.transactions}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                      {user.commissions.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">CDF</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'vos-stats' && (
            <div className="space-y-6">
              <div className="text-center p-8 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-2 border-emerald-500/30 rounded-3xl">
                <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                  <Star size={32} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">Rang #{stats.votreRang}</h3>
                <div className="text-2xl font-bold text-emerald-400 mb-4">{stats.votrePart}</div>
                <p className="text-gray-400">Part des Top 5 commissions réseau</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <TrendingUp size={20} className="text-emerald-400" />
                    <span className="font-semibold text-white">Vos commissions</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400">1 250 000 CDF</div>
                </div>
                <div className="p-6 bg-gray-800 rounded-2xl border border-gray-700">
                  <div className="flex items-center gap-3 mb-3">
                    <Users size={20} className="text-blue-400" />
                    <span className="font-semibold text-white">Transactions</span>
                  </div>
                  <div className="text-3xl font-bold text-blue-400">5</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

