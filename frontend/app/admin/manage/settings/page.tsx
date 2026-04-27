"use client";

import { useState } from 'react';
import { Settings, Shield, Users, Clock, DollarSign, Mail, Database, Zap, Save, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

const TABS = ['Général', 'Rôles', 'Planning', 'Salaires', 'Notifications', 'Intégrations'] as const;
type TabType = typeof TABS[number];

export default function AdminManageSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('Général');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Général':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                <Settings size={36} />
                Configuration générale
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/20 backdrop-blur-xl p-8 rounded-4xl border border-blue-500/30 shadow-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Users size={24} className="text-white" />
                    </div>
                  </div>
                  <label className="block text-lg font-semibold text-gray-300 mb-6">
                    Limite max utilisateurs hôtel
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="number" defaultValue="150" className="flex-1 px-6 py-4 bg-slate-800/70 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-blue-500/40 font-mono text-2xl" />
                    <span className="text-gray-400 font-mono">/hôtel</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/20 backdrop-blur-xl p-8 rounded-4xl border border-emerald-500/30 shadow-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
                      <Clock size={24} className="text-white" />
                    </div>
                  </div>
                  <label className="block text-lg font-semibold text-gray-300 mb-6">
                    Délai auto-rejet (jours)
                  </label>
                  <input type="number" defaultValue="7" className="w-full px-6 py-4 bg-slate-800/70 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-emerald-500/40 font-mono text-xl" />
                </div>

                <div className="bg-gradient-to-br from-slate-900/80 to-orange-900/20 backdrop-blur-xl p-8 rounded-4xl border border-orange-500/30 shadow-3xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
                      <DollarSign size={24} className="text-white" />
                    </div>
                  </div>
                  <label className="block text-lg font-semibold text-gray-300 mb-6">
                    Frais traitement premium
                  </label>
                  <div className="flex items-center gap-4">
                    <input type="number" defaultValue="25" className="flex-1 px-6 py-4 bg-slate-800/70 border border-slate-600 rounded-3xl text-emerald-400 focus:ring-4 focus:ring-orange-500/40 font-mono text-2xl font-bold" />
                    <span className="text-gray-400 font-mono">USD</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
                <Mail size={36} />
                Notifications automatiques
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-blue-500/50 transition-all shadow-lg">
                    <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-2 border-blue-500 bg-blue-500/20 focus:ring-blue-500" />
                    <div>
                      <div className="font-bold text-white text-lg group-hover:text-blue-400">Email approbation</div>
                      <div className="text-gray-500 text-sm">Notification immédiate + résumé quotidien</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-emerald-500/50 transition-all shadow-lg">
                    <input type="checkbox" className="w-6 h-6 rounded-xl border-2 border-emerald-500 bg-emerald-500/20 focus:ring-emerald-500" />
                    <div>
                      <div className="font-bold text-white text-lg group-hover:text-emerald-400">SMS urgences</div>
                      <div className="text-gray-500 text-sm">Priorité haute uniquement (+243)</div>
                    </div>
                  </label>
                </div>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-orange-500/50 transition-all shadow-lg">
                    <input type="checkbox" defaultChecked className="w-6 h-6 rounded-xl border-2 border-orange-500 bg-orange-500/20 focus:ring-orange-500" />
                    <div>
                      <div className="font-bold text-white text-lg group-hover:text-orange-400">Slack Admin</div>
                      <div className="text-gray-500 text-sm">#approbations channel</div>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-purple-500/50 transition-all shadow-lg">
                    <input type="checkbox" className="w-6 h-6 rounded-xl border-2 border-purple-500 bg-purple-500/20 focus:ring-purple-500" />
                    <div>
                      <div className="font-bold text-white text-lg group-hover:text-purple-400">Dashboard realtime</div>
                      <div className="text-gray-500 text-sm">Mises à jour live Admin Principal</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Rôles':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
              <Shield size={36} />
              Permissions GroupWorks
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 backdrop-blur-xl p-8 rounded-4xl border border-purple-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Permissions sensibles</h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl cursor-pointer group hover:border-purple-500/50 transition-all">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-purple-500 bg-purple-500/20" />
                    <span className="font-semibold text-white group-hover:text-purple-400">Suppression comptes</span>
                  </label>
                  <label className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl cursor-pointer group hover:border-purple-500/50 transition-all">
                    <input type="checkbox" className="w-5 h-5 rounded border-2 border-purple-500 bg-purple-500/20" />
                    <span className="font-semibold text-white group-hover:text-purple-400">Accès financiers complet</span>
                  </label>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/20 backdrop-blur-xl p-8 rounded-4xl border border-emerald-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Logs audit</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Durée rétention</span>
                    <select className="bg-slate-800/70 border border-slate-600 rounded-2xl px-4 py-2 text-white">
                      <option>90 jours</option>
                      <option>180 jours</option>
                      <option>365 jours</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-700 rounded-2xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-emerald-500" />
                    <span className="text-white">Alertes activité suspecte</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Planning':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
              <Clock size={36} />
              Gestion plannings RH
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-cyan-900/20 backdrop-blur-xl p-8 rounded-4xl border border-cyan-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Règles planning</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <span className="font-semibold text-white">Jours ouvrés/semaine</span>
                    <span className="font-mono text-2xl font-bold text-cyan-400">6</span>
                  </div>
                  <div className="flex items-center justify-between p-5 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <span className="font-semibold text-white">Heures/jour</span>
                    <span className="font-mono text-2xl font-bold text-emerald-400">8h</span>
                  </div>
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-cyan-500/50">
                    <input type="checkbox" defaultChecked className="w-6 h-6 border-2 border-cyan-500 rounded-xl" />
                    <span className="font-semibold text-white group-hover:text-cyan-400">Congés automatiques</span>
                  </label>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-2xl font-bold text-white mb-6">Jours fériés 2024</h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-700 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-400 font-bold text-sm">1<sup>er</sup> Jan</div>
                        <span className="font-semibold text-white">Jour de l'An</span>
                      </div>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl bg-red-600/50 text-white hover:bg-red-600">
                        <XCircle size={16} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-2xl hover:bg-slate-700 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400 font-bold text-sm">4<sup>th</sup> Avr</div>
                        <span className="font-semibold text-white">Pâques</span>
                      </div>
                      <button className="p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl bg-red-600/50 text-white hover:bg-red-600">
                        <XCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Salaires':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
              <DollarSign size={36} />
              Gestion salaires & primes
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/20 backdrop-blur-xl p-8 rounded-4xl border border-emerald-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Grille salariale</h4>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 items-center gap-6 p-6 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <span className="font-semibold text-gray-300">Rôle</span>
                    <span className="font-semibold text-gray-300">Salaire base</span>
                    <span className="font-semibold text-gray-300">Prime perf.</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-6 p-6 bg-slate-800/30 border border-slate-700 rounded-3xl hover:bg-slate-700">
                    <span className="font-medium text-white">Réceptionniste</span>
                    <span className="font-mono text-emerald-400 font-bold">$450</span>
                    <span className="font-mono text-emerald-400">$75</span>
                  </div>
                  <div className="grid grid-cols-3 items-center gap-6 p-6 bg-slate-800/30 border border-slate-700 rounded-3xl hover:bg-slate-700">
                    <span className="font-medium text-white">Housekeeping</span>
                    <span className="font-mono text-emerald-400 font-bold">$420</span>
                    <span className="font-mono text-emerald-400">$60</span>
                  </div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900/80 to-orange-900/20 backdrop-blur-xl p-8 rounded-4xl border border-orange-500/30 shadow-3xl">
                  <h4 className="text-2xl font-bold text-white mb-6">Paie globale</h4>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center p-8 bg-slate-800/50 rounded-3xl border border-slate-700">
                      <div>
                        <p className="text-3xl font-black text-emerald-400 mb-2">$185,420</p>
                        <p className="text-sm text-gray-400">Mois courant</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-orange-400 mb-2">+$8,240</p>
                        <p className="text-sm text-gray-400">Primes</p>
                      </div>
                      <div>
                        <p className="text-3xl font-black text-blue-400 mb-2">142</p>
                        <p className="text-sm text-gray-400">Employés payés</p>
                      </div>
                    </div>
                    <button className="w-full py-5 px-8 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-orange-500/50 transition-all">
                      Lancer paie automatique
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Notifications':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-4">
              <Mail size={36} />
              Système notifications
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/20 backdrop-blur-xl p-8 rounded-4xl border border-blue-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Templates email</h4>
                <div className="space-y-4">
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-blue-500/50">
                    <input type="checkbox" defaultChecked className="w-6 h-6 border-2 border-blue-500 rounded-xl" />
                    <span className="font-semibold text-white group-hover:text-blue-400">Approbation demandée</span>
                  </label>
                  <label className="flex items-center gap-4 p-5 bg-slate-800/50 border border-slate-700 rounded-3xl cursor-pointer group hover:border-emerald-500/50">
                    <input type="checkbox" className="w-6 h-6 border-2 border-emerald-500 rounded-xl" />
                    <span className="font-semibold text-white group-hover:text-emerald-400">Compte créé</span>
                  </label>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 backdrop-blur-xl p-8 rounded-4xl border border-purple-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Destinataires</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-5 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <span className="font-semibold text-white">Admin Principal</span>
                    <select className="bg-transparent border-none outline-none text-purple-400 font-semibold">
                      <option>admin@groupworks.cd</option>
                    </select>
                  </div>
                  <button className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-purple-500/50">
                    + Ajouter destinataire
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'Intégrations':
        return (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-4">
              <Zap size={36} />
              API & Intégrations externes
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-slate-900/80 to-green-900/20 backdrop-blur-xl p-8 rounded-4xl border border-green-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Supabase DB</h4>
                <div className="space-y-4">
                  <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-semibold text-emerald-400">✅ Connecté</span>
                      <span className="text-sm text-gray-400">Sync live</span>
                    </div>
                    <button className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-2xl hover:shadow-emerald-500/50">
                      Vérifier connexion
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/20 backdrop-blur-xl p-8 rounded-4xl border border-blue-500/30 shadow-3xl">
                <h4 className="text-2xl font-bold text-white mb-6">Slack Webhook</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-6 bg-slate-800/50 border border-slate-700 rounded-3xl">
                    <span className="font-semibold text-blue-400">#approbations</span>
                    <span className="text-xs px-3 py-1 bg-blue-500/20 rounded-full text-blue-300">Actif</span>
                  </div>
                  <input 
                    placeholder="https://hooks.slack.com/services/..."
                    className="w-full px-6 py-4 bg-slate-800/70 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-blue-500/40"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-3xl text-gray-400 hover:text-white transition-all lg:hidden"
          >
            {isSidebarOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
          <h1 className="text-4xl font-black bg-gradient-to-r from-gray-400 to-slate-300 bg-clip-text text-transparent drop-shadow-xl">
            Configuration avancée
          </h1>
        </div>
        <button className="px-12 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold rounded-4xl shadow-3xl hover:shadow-emerald-500/50 transition-all text-xl flex items-center gap-3">
          <Save size={24} />
          Sauvegarder tout
        </button>
      </div>

      <div className="flex gap-8">
        <aside className={`bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-xl rounded-4xl border border-slate-700/50 shadow-3xl p-8 transition-all duration-300 ${isSidebarOpen ? 'w-80 min-w-[320px]' : 'w-20'}`}>
          <nav className="space-y-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                className={`w-full flex items-center gap-4 p-5 rounded-3xl font-bold transition-all group hover:shadow-2xl ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-3xl scale-105'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50 hover:shadow-xl border border-slate-700/50'
                } ${!isSidebarOpen && 'justify-center'}`}
                onClick={() => setActiveTab(tab)}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${
                  activeTab === tab ? 'bg-white/20' : 'bg-slate-800/50 group-hover:bg-white/10'
                }`}>
                  {tab === 'Général' && <Settings size={20} />}
                  {tab === 'Rôles' && <Shield size={20} />}
                  {tab === 'Planning' && <Clock size={20} />}
                  {tab === 'Salaires' && <DollarSign size={20} />}
                  {tab === 'Notifications' && <Mail size={20} />}
                  {tab === 'Intégrations' && <Database size={20} />}
                </div>
                {isSidebarOpen && <span>{tab}</span>}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

