"use client";

import React, { useState } from 'react';
import { BarChart3, Download, Filter, TrendingUp, Users, DollarSign, Clock } from 'lucide-react';

export default function ManageReportsPage() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black/50 to-gray-900">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl mb-2">Rapports Personnel</h1>
            <p className="text-2xl text-gray-400">Performance, présence et productivité</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 backdrop-blur-xl rounded-4xl border border-indigo-500/30 p-8 shadow-3xl">
            <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
              <TrendingUp size={32} className="text-indigo-400" />
              Performances du mois
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Taux présence</span>
                <span className="text-3xl font-black text-indigo-400">98.2%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Heures totales</span>
                <span className="text-3xl font-black text-emerald-400">2,450h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Agents top performants</span>
                <span className="text-3xl font-black text-purple-400">Sophie Lumu</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl rounded-4xl border border-gray-700 p-8 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Filtres</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-2 flex items-center gap-2">
                  <Clock size={18} />
                  Période
                </label>
                <select 
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-3xl text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="week">Semaine</option>
                  <option value="month">Mois</option>
                  <option value="quarter">Trimestre</option>
                  <option value="year">Année</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 mb-2 flex items-center gap-2">
                  Type de rapport
                </label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-3xl text-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="overview">Vue d'ensemble</option>
                  <option value="presence">Présence</option>
                  <option value="performance">Performance</option>
                  <option value="turnover">Rotation</option>
                </select>
              </div>
              <button className="w-full p-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 text-white font-bold rounded-3xl shadow-xl hover:shadow-indigo-500/25 transition-all flex items-center gap-3">
                <Download size={20} />
                Exporter PDF
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-900/20 backdrop-blur-xl rounded-4xl border border-gray-700/50 p-8 shadow-3xl h-[500px]">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <Users size={24} className="text-blue-400" />
              Présence par rôle
            </h4>
            <div className="h-[400px] bg-gray-800/50 rounded-3xl p-6 border border-gray-700/30">
              <div className="h-full flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Users size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-2xl font-semibold">Graphique présence</p>
                  <p className="mt-2">Réceptionniste: 98% | Housekeeping: 95%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 backdrop-blur-xl rounded-4xl border border-emerald-500/30 p-8 shadow-3xl h-[500px]">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <DollarSign size={24} className="text-emerald-400" />
              Coût salarial
            </h4>
            <div className="h-[400px] bg-gray-800/50 rounded-3xl p-6 border border-gray-700/30">
              <div className="h-full flex items-center justify-center text-emerald-400">
                <div className="text-center">
                  <DollarSign size={64} className="mx-auto mb-4 opacity-30" />
                  <p className="text-2xl font-semibold">Graphique coûts</p>
                  <p className="mt-2 font-bold text-3xl">$28,500 / mois</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-900/50 backdrop-blur-xl rounded-4xl border border-gray-700 p-8">
          <h4 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <Clock size={24} className="text-yellow-400" />
            Activité récente
          </h4>
          <div className="space-y-4">
            {[
              'Sophie Lumu approuve demande Jean Kabila',
              'David Nsakala marque présence housekeeping',
              'Marie Dupont rejetée (CV insuffisant)',
              'Manager modifie permissions sécurité'
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-3xl border border-gray-700/50 hover:bg-gray-800 transition-all">
                <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                <span className="flex-1 text-gray-300">{activity}</span>
                <span className="text-xs text-gray-500">2min</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

