"use client";
import { useState } from 'react';
import { Zap, Plus, X, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const PRIORITIES = ['Urgent', 'Normal', 'Faible'];
const STATUS_STYLE: Record<string, string> = {
  'Résolu':    'text-cyan-300 bg-cyan-900/30 border-cyan-700/40',
  'En cours':  'text-yellow-300 bg-yellow-900/30 border-yellow-700/40',
  'En attente':'text-red-300 bg-red-900/30 border-red-700/40',
};
const PRIO_STYLE: Record<string, string> = {
  'Urgent': 'text-red-300 bg-red-900/30 border-red-700/40',
  'Normal': 'text-blue-300 bg-blue-900/30 border-blue-700/40',
  'Faible': 'text-gray-400 bg-gray-800/30 border-gray-700/40',
};

const INIT = [
  { id: 'EL001', location: 'Chambre 102', issue: 'Prise électrique défectueuse', priority: 'Urgent', status: 'En attente', tech: 'Didier M.' },
  { id: 'EL002', location: 'Couloir 2e étage', issue: 'Éclairage grillé', priority: 'Normal', status: 'En cours', tech: 'Didier M.' },
  { id: 'EL003', location: 'Salle de conférence', issue: 'Climatisation HS', priority: 'Urgent', status: 'En cours', tech: 'Serge K.' },
  { id: 'EL004', location: 'Cuisine', issue: 'Disjoncteur déclenché', priority: 'Urgent', status: 'Résolu', tech: 'Didier M.' },
  { id: 'EL005', location: 'Parking', issue: 'Lampadaire éteint', priority: 'Faible', status: 'En attente', tech: 'Serge K.' },
];

export default function ElectricienPage() {
  const [tickets, setTickets] = useState(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ location: '', issue: '', priority: 'Normal', tech: '' });

  const cycleStatus = (i: number) => {
    const cycle = ['En attente', 'En cours', 'Résolu'];
    setTickets(prev => prev.map((t, idx) => idx === i
      ? { ...t, status: cycle[(cycle.indexOf(t.status) + 1) % 3] }
      : t));
  };

  const addTicket = () => {
    if (!form.location || !form.issue) return;
    setTickets(prev => [...prev, { ...form, id: 'EL' + String(prev.length + 1).padStart(3, '0'), status: 'En attente' }]);
    setShowAdd(false);
    setForm({ location: '', issue: '', priority: 'Normal', tech: '' });
  };

  const counts = { 'En attente': 0, 'En cours': 0, 'Résolu': 0 };
  tickets.forEach(t => counts[t.status as keyof typeof counts]++);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <Zap size={20} className="text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Électricien</h2>
            <p className="text-xs text-gray-500">Tickets de maintenance électrique</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-300 text-sm font-semibold hover:bg-yellow-500/20 transition-all">
          <Plus size={15} /> Nouveau ticket
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[['En attente', 'text-red-300', 'bg-red-500/10 border-red-500/20'],
          ['En cours', 'text-yellow-300', 'bg-yellow-500/10 border-yellow-500/20'],
          ['Résolu', 'text-cyan-300', 'bg-cyan-500/10 border-cyan-500/20']].map(([s, tc, bg]) => (
          <div key={s} className={`rounded-2xl p-4 border ${bg} text-center`}>
            <p className={`text-3xl font-black ${tc}`}>{counts[s as keyof typeof counts]}</p>
            <p className="text-xs text-gray-500 mt-1">{s}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {tickets.map((t, i) => (
          <div key={t.id} className="bg-[#0a1628]/80 border border-white/5 rounded-2xl p-4 flex items-center gap-4 hover:border-yellow-500/20 transition-all">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <Zap size={16} className="text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs text-gray-500 font-mono">{t.id}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIO_STYLE[t.priority]}`}>{t.priority}</span>
              </div>
              <p className="font-semibold text-white text-sm truncate">{t.issue}</p>
              <p className="text-xs text-gray-500">{t.location} • {t.tech}</p>
            </div>
            <button onClick={() => cycleStatus(i)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:opacity-80 shrink-0 ${STATUS_STYLE[t.status]}`}>
              {t.status}
            </button>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#070d1a] border border-yellow-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(234,179,8,0.1)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Nouveau ticket</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[['Localisation', 'location'], ['Problème', 'issue'], ['Technicien', 'tech']].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input value={form[key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Priorité</label>
                <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500/50">
                  {PRIORITIES.map(p => <option key={p} value={p} className="bg-[#0a1628]">{p}</option>)}
                </select>
              </div>
            </div>
            <button onClick={addTicket}
              className="mt-5 w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-xl font-bold text-white text-sm transition-all">
              Créer le ticket
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
