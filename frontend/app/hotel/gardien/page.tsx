"use client";
import { useState } from 'react';
import { Shield, Plus, X, MapPin, Clock } from 'lucide-react';

const ZONES = ['Entrée principale', 'Parking', 'Piscine', 'Couloir 1er', 'Couloir 2e', 'Terrasse', 'Réception'];
const SHIFTS = ['06h-14h', '14h-22h', '22h-06h'];

const INIT = [
  { id: 'G001', name: 'Fiston Mbala', zone: 'Entrée principale', shift: '06h-14h', status: 'En poste', incidents: 0 },
  { id: 'G002', name: 'Roger Tshimanga', zone: 'Parking', shift: '14h-22h', status: 'En poste', incidents: 1 },
  { id: 'G003', name: 'Alain Kasongo', zone: 'Piscine', shift: '22h-06h', status: 'Repos', incidents: 0 },
  { id: 'G004', name: 'Fiston Mbala', zone: 'Terrasse', shift: '14h-22h', status: 'En poste', incidents: 2 },
];

const INCIDENTS_INIT = [
  { id: 'INC001', guard: 'Roger Tshimanga', zone: 'Parking', desc: 'Véhicule suspect signalé', time: '16:42', resolved: false },
  { id: 'INC002', guard: 'Alain Kasongo', zone: 'Piscine', desc: 'Accès non autorisé', time: '23:15', resolved: true },
  { id: 'INC003', guard: 'Fiston Mbala', zone: 'Terrasse', desc: 'Bagarre entre clients', time: '20:05', resolved: false },
];

export default function GardienPage() {
  const [guards, setGuards] = useState(INIT);
  const [incidents, setIncidents] = useState(INCIDENTS_INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', zone: ZONES[0], shift: SHIFTS[0] });

  const addGuard = () => {
    if (!form.name) return;
    setGuards(prev => [...prev, { ...form, id: 'G' + String(prev.length + 1).padStart(3, '0'), status: 'En poste', incidents: 0 }]);
    setShowAdd(false);
    setForm({ name: '', zone: ZONES[0], shift: SHIFTS[0] });
  };

  const toggleIncident = (i: number) =>
    setIncidents(prev => prev.map((inc, idx) => idx === i ? { ...inc, resolved: !inc.resolved } : inc));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <Shield size={20} className="text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Gardien</h2>
            <p className="text-xs text-gray-500">Sécurité & surveillance</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-300 text-sm font-semibold hover:bg-blue-500/20 transition-all">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {/* Guards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {guards.map(g => (
          <div key={g.id} className="bg-[#0a1628]/80 border border-white/5 rounded-2xl p-4 hover:border-blue-500/20 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-600/30 border border-blue-500/20 flex items-center justify-center font-black text-blue-300">
                {g.name.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-white text-sm truncate">{g.name}</p>
                <p className="text-xs text-gray-500">{g.id}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-gray-400"><MapPin size={11} className="text-blue-400" /> {g.zone}</div>
              <div className="flex items-center gap-1.5 text-gray-400"><Clock size={11} className="text-cyan-400" /> {g.shift}</div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${g.status === 'En poste' ? 'text-cyan-300 bg-cyan-900/30 border-cyan-700/40' : 'text-gray-400 bg-gray-800/30 border-gray-700/40'}`}>
                {g.status}
              </span>
              {g.incidents > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold border text-red-300 bg-red-900/30 border-red-700/40">
                  {g.incidents} incident{g.incidents > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Incidents */}
      <div className="bg-[#0a1628]/80 border border-white/5 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-1.5 h-5 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <h3 className="font-bold text-white">Incidents signalés</h3>
        </div>
        <div className="space-y-3">
          {incidents.map((inc, i) => (
            <div key={inc.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${inc.resolved ? 'border-white/5 bg-white/[0.02] opacity-60' : 'border-red-500/20 bg-red-500/5'}`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs text-gray-500 font-mono">{inc.id}</span>
                  <span className="text-xs text-gray-500">{inc.time}</span>
                </div>
                <p className="font-semibold text-white text-sm">{inc.desc}</p>
                <p className="text-xs text-gray-500">{inc.guard} • {inc.zone}</p>
              </div>
              <button onClick={() => toggleIncident(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${inc.resolved ? 'text-cyan-300 bg-cyan-900/30 border-cyan-700/40' : 'text-red-300 bg-red-900/30 border-red-700/40 hover:bg-red-900/50'}`}>
                {inc.resolved ? 'Résolu' : 'Résoudre'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#070d1a] border border-blue-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(59,130,246,0.1)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Nouveau gardien</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Nom complet</label>
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50" />
              </div>
              {[['Zone', 'zone', ZONES], ['Horaire', 'shift', SHIFTS]].map(([label, key, opts]) => (
                <div key={key as string}>
                  <label className="text-xs text-gray-500 mb-1 block">{label as string}</label>
                  <select value={form[key as 'zone' | 'shift']} onChange={e => setForm(p => ({ ...p, [key as string]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/50">
                    {(opts as string[]).map(o => <option key={o} value={o} className="bg-[#0a1628]">{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={addGuard}
              className="mt-5 w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl font-bold text-white text-sm transition-all">
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
