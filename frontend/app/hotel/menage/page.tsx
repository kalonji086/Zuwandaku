"use client";
import { useState } from 'react';
import { Sparkles, CheckCircle, Clock, AlertCircle, Plus, X } from 'lucide-react';

const ROOMS = ['101','102','103','201','202','203','Suite 301','Suite 302'];
const STATUS_STYLE: Record<string, string> = {
  'Propre':     'text-cyan-300 bg-cyan-900/30 border-cyan-700/40',
  'En cours':   'text-yellow-300 bg-yellow-900/30 border-yellow-700/40',
  'À nettoyer': 'text-red-300 bg-red-900/30 border-red-700/40',
};
const STATUS_ICON: Record<string, any> = {
  'Propre': CheckCircle, 'En cours': Clock, 'À nettoyer': AlertCircle,
};

const INIT = ROOMS.map((r, i) => ({
  room: r,
  agent: ['Amina K.','Béatrice M.','Clarisse N.','Amina K.','Béatrice M.','Clarisse N.','Amina K.','Béatrice M.'][i],
  status: (['Propre','En cours','À nettoyer','Propre','En cours','Propre','À nettoyer','En cours'] as const)[i],
  lastCleaned: '08:30',
}));

export default function MenagePage() {
  const [tasks, setTasks] = useState(INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ room: ROOMS[0], agent: '', status: 'À nettoyer' });

  const cycleStatus = (i: number) => {
    const cycle = ['À nettoyer', 'En cours', 'Propre'];
    setTasks(prev => prev.map((t, idx) => idx === i
      ? { ...t, status: cycle[(cycle.indexOf(t.status) + 1) % 3] as any }
      : t));
  };

  const addTask = () => {
    if (!form.agent) return;
    setTasks(prev => [...prev, { ...form, lastCleaned: '--:--' } as any]);
    setShowAdd(false);
    setForm({ room: ROOMS[0], agent: '', status: 'À nettoyer' });
  };

  const counts = { 'Propre': 0, 'En cours': 0, 'À nettoyer': 0 };
  tasks.forEach(t => counts[t.status]++);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
            <Sparkles size={20} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Ménage</h2>
            <p className="text-xs text-gray-500">Suivi nettoyage des chambres</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-300 text-sm font-semibold hover:bg-cyan-500/20 transition-all">
          <Plus size={15} /> Ajouter
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[['Propre', 'text-cyan-300', 'bg-cyan-500/10 border-cyan-500/20'],
          ['En cours', 'text-yellow-300', 'bg-yellow-500/10 border-yellow-500/20'],
          ['À nettoyer', 'text-red-300', 'bg-red-500/10 border-red-500/20']].map(([s, tc, bg]) => (
          <div key={s} className={`rounded-2xl p-4 border ${bg} text-center`}>
            <p className={`text-3xl font-black ${tc}`}>{counts[s as keyof typeof counts]}</p>
            <p className="text-xs text-gray-500 mt-1">{s}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#0a1628]/80 border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3">Chambre</th>
              <th className="text-left px-5 py-3">Agent</th>
              <th className="text-left px-5 py-3">Statut</th>
              <th className="text-left px-5 py-3">Dernière MAJ</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => {
              const Icon = STATUS_ICON[t.status];
              return (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-all">
                  <td className="px-5 py-3.5 font-semibold text-white">#{t.room}</td>
                  <td className="px-5 py-3.5 text-gray-300">{t.agent}</td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => cycleStatus(i)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:opacity-80 ${STATUS_STYLE[t.status]}`}>
                      <Icon size={11} /> {t.status}
                    </button>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500">{t.lastCleaned}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#070d1a] border border-cyan-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Nouvelle tâche ménage</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[['Chambre', 'room', ROOMS, true], ['Agent', 'agent', null, false]].map(([label, key, opts, isSelect]) => (
                <div key={key as string}>
                  <label className="text-xs text-gray-500 mb-1 block">{label as string}</label>
                  {isSelect ? (
                    <select value={form[key as 'room']} onChange={e => setForm(p => ({ ...p, [key as string]: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                      {(opts as string[]).map(o => <option key={o} value={o} className="bg-[#0a1628]">{o}</option>)}
                    </select>
                  ) : (
                    <input value={form[key as 'agent']} onChange={e => setForm(p => ({ ...p, [key as string]: e.target.value }))}
                      placeholder="Nom de l'agent"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50" />
                  )}
                </div>
              ))}
            </div>
            <button onClick={addTask}
              className="mt-5 w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl font-bold text-white text-sm transition-all">
              Ajouter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
