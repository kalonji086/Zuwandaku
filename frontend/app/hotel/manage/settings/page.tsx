"use client";

import { useState } from 'react';
import { Settings, Save, Shield, Clock, Users, DollarSign, Mail, Database } from 'lucide-react';

export default function ManageSettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'roles', label: 'Rôles & Permissions', icon: Shield },
    { id: 'schedules', label: 'Planning', icon: Clock },
    { id: 'salaries', label: 'Salaires', icon: DollarSign },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'database', label: 'Base données', icon: Database },
  ];

  const saveSettings = () => {
    alert('Paramètres sauvegardés!');
  };

  return (
    <div>
      <div className="flex items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent drop-shadow-2xl mb-2">Paramètres Personnel</h1>
          <p className="text-2xl text-gray-400">Configurez le système RH hotel</p>
        </div>
        <button 
          onClick={saveSettings}
          className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/25 transition-all ml-auto whitespace-nowrap"
        >
          <Save className="inline mr-2" size={24} />
          Sauvegarder
        </button>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-4xl border border-gray-700 overflow-hidden shadow-3xl">
        {/* Tab Navigation */}
        <div className="bg-gray-900/80 p-1 rounded-t-3xl border-b border-gray-700/50">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActiveTab = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-8 py-4 font-bold rounded-3xl transition-all flex-1 ${
                    isActiveTab
                      ? 'bg-gradient-to-r from-gray-700 to-gray-600 text-white shadow-2xl shadow-gray-500/25 scale-105'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50 hover:scale-105'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-12">
          {activeTab === 'general' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Configuration générale</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-4">Nombre max d'agents par service</label>
                    <select className="w-full p-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white focus:ring-4 focus:ring-blue-500/30">
                      <option>8</option>
                      <option>10</option>
                      <option>12</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-4">Notifications automatiques</label>
                    <label className="flex items-center gap-3 p-5 bg-gray-800/70 border border-gray-600 rounded-3xl cursor-pointer group hover:border-blue-500 hover:bg-blue-500/5">
                      <input type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded-lg focus:ring-blue-500" />
                      <span className="text-white font-medium group-hover:text-blue-400">Email fin de service</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-8">Permissions par rôle</h3>
              <div className="space-y-6">
                {['Réceptionniste', 'Housekeeping', 'Manager'].map((role) => (
                  <div key={role} className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="text-xl font-bold text-white">{role}</h4>
                      <span className="px-4 py-2 bg-purple-600/30 text-purple-300 rounded-xl font-medium text-sm">12 agents</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {['Check-in', 'Réservations', 'Facturation', 'Nettoyage', 'Maintenance'].map((perm) => (
                        <label key={perm} className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-2xl border-2 border-gray-700/50 cursor-pointer hover:border-blue-500 hover:bg-blue-500/5 group">
                          <input type="checkbox" className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded-lg focus:ring-blue-500 peer" />
                          <span className="text-gray-300 peer-checked:text-blue-400 font-medium">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedules' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6">Gestion planning</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-semibold text-gray-300 mb-4">Service matin</label>
                  <select multiple className="w-full p-5 bg-gray-800/70 border border-gray-600 rounded-3xl h-48 text-white">
                    <option>Jean Kabila</option>
                    <option>Marie Dupont</option>
                  </select>
                </div>
                <div>
                  <label className="block text-lg font-semibold text-gray-300 mb-4">Service après-midi</label>
                  <select multiple className="w-full p-5 bg-gray-800/70 border border-gray-600 rounded-3xl h-48 text-white">
                    <option>Sophie Lumu</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs similar structure */}
          {activeTab === 'salaries' && (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Structure salariale</h3>
              <p className="text-lg text-gray-400 mb-8">Configurez salaires et primes par rôle</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="p-6 bg-gray-800/50 rounded-3xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Réceptionniste</span>
                      <span className="text-2xl font-black text-emerald-400">$450/mois</span>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-800/50 rounded-3xl border border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Manager</span>
                      <span className="text-2xl font-black text-emerald-400">$1,200/mois</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-300 mb-4">Prime performance (%)</label>
                  <input type="range" min="0" max="20" className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                  <span className="text-3xl font-black text-emerald-400 block text-right">12%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

