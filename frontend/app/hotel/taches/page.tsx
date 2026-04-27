"use client";
import { useState } from 'react';
import { ClipboardList, Plus, X, CheckCircle, Circle, Trash2 } from 'lucide-react';

type Priority = 'Urgent' | 'Normal' | 'Faible';
type Dept = 'Ménage' | 'Électricien' | 'Gardien' | 'Cuisine' | 'Réception' | 'Tous';

interface Task {
  id: string; title: string; dept: Dept; priority: Priority;
  assignee: string; done: boolean; date: string;
}

const DEPTS: Dept[] = ['Ménage', 'Électricien', 'Gardien', 'Cuisine', 'Réception'];
const PRIORITIES: Priority[] = ['Urgent', 'Normal', 'Faible'];
const PRIO_STYLE: Record<Priority, string> = {
  'Urgent': 'text-red-300 bg-red-900/30 border-red-700/40',
  'Normal': 'text-blue-300 bg-blue-900/30 border-blue-700/40',
  'Faible': 'text-gray-400 bg-gray-800/30 border-gray-700/40',
};
const DEPT_COLOR: Record<string, string> = {
  'Ménage': 'text-cyan-400', 'Électricien': 'text-yellow-400',
  'Gardien': 'text-blue-400', 'Cuisine': 'text-orange-400', 'Réception': 'text-purple-400',
};

const INIT: Task[] = [
  { id: 'T001', title: 'Nettoyer chambres 101-105', dept: 'Ménage', priority: 'Urgent', assignee: 'Amina K.', done: false, date: 'Aujourd\'hui' },
  { id: 'T002', title: 'Réparer prise chambre 102', dept: 'Électricien', priority: 'Urgent', assignee: 'Didier M.', done: false, date: 'Aujourd\'hui' },
  { id: 'T003', title: 'Ronde de sécurité parking', dept: 'Gardien', priority: 'Normal', assignee: 'Roger T.', done: true, date: 'Aujourd\'hui' },
  { id: 'T004', title: 'Préparer buffet petit-déjeuner', dept: 'Cuisine', priority: 'Normal', assignee: 'Chef Paul', done: false, date: 'Demain' },
  { id: 'T005', title: 'Accueillir groupe VIP 14h', dept: 'Réception', priority: 'Urgent', assignee: 'Marie K.', done: false, date: 'Aujourd\'hui' },
  { id: 'T006', title: 'Changer ampoules couloir 3e', dept: 'Électricien', priority: 'Faible', assignee: 'Serge K.', done: true, date: 'Hier' },
];

export default function TachesPage() {
  const [tasks, setTasks] = useState<Task[]>(INIT);
  const [filter, setFilter] = useState<Dept | 'Tous'>('Tous');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', dept: DEPTS[0], priority: 'Normal' as Priority, assignee: '', date: 'Aujourd\'hui' });

  const filtered = filter === 'Tous' ? tasks : tasks.filter(t => t.dept === filter);
  const done = filtered.filter(t => t.done).length;

  const toggle = (id: string) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  const addTask = () => {
    if (!form.title) return;
    setTasks(prev => [...prev, { ...form, id: 'T' + String(prev.length + 1).padStart(3, '0'), done: false }]);
    setShowAdd(false);
    setForm({ title: '', dept: DEPTS[0], priority: 'Normal', assignee: '', date: 'Aujourd\'hui' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl">
            <ClipboardList size={20} className="text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Gestion de tâches</h2>
            <p className="text-xs text-gray-500">{done}/{filtered.length} tâches complétées</p>
          </div>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-semibold hover:bg-purple-500/20 transition-all">
          <Plus size={15} /> Nouvelle tâche
        </button>
      </div>

      {/* Progress bar */}
      <div className="bg-[#0a1628]/80 border border-white/5 rounded-2xl p-4">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Progression globale</span>
          <span className="text-purple-300 font-bold">{filtered.length ? Math.round(done / filtered.length * 100) : 0}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
            style={{ width: `${filtered.length ? (done / filtered.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Dept filters */}
      <div className="flex gap-2 flex-wrap">
        {(['Tous', ...DEPTS] as (Dept | 'Tous')[]).map(d => (
          <button key={d} onClick={() => setFilter(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${filter === d ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'text-gray-500 border-white/5 hover:text-gray-300 hover:border-white/10'}`}>
            {d}
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {filtered.map(task => (
          <div key={task.id} className={`flex items-center gap-3 p-4 rounded-xl border transition-all group ${task.done ? 'bg-white/[0.01] border-white/[0.03] opacity-50' : 'bg-[#0a1628]/80 border-white/5 hover:border-purple-500/20'}`}>
            <button onClick={() => toggle(task.id)} className="shrink-0">
              {task.done
                ? <CheckCircle size={20} className="text-cyan-400" />
                : <Circle size={20} className="text-gray-600 hover:text-purple-400 transition-all" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold text-sm ${task.done ? 'line-through text-gray-500' : 'text-white'}`}>{task.title}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xs font-medium ${DEPT_COLOR[task.dept]}`}>{task.dept}</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className="text-xs text-gray-500">{task.assignee}</span>
                <span className="text-gray-600 text-xs">•</span>
                <span className="text-xs text-gray-500">{task.date}</span>
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border shrink-0 ${PRIO_STYLE[task.priority]}`}>{task.priority}</span>
            <button onClick={() => remove(task.id)} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all text-gray-600 hover:text-red-400">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <ClipboardList size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucune tâche</p>
          </div>
        )}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#070d1a] border border-purple-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(168,85,247,0.1)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Nouvelle tâche</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[['Titre', 'title'], ['Assigné à', 'assignee'], ['Échéance', 'date']].map(([label, key]) => (
                <div key={key}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input value={form[key as keyof typeof form] as string} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-purple-500/50" />
                </div>
              ))}
              {[['Département', 'dept', DEPTS], ['Priorité', 'priority', PRIORITIES]].map(([label, key, opts]) => (
                <div key={key as string}>
                  <label className="text-xs text-gray-500 mb-1 block">{label as string}</label>
                  <select value={form[key as 'dept' | 'priority']} onChange={e => setForm(p => ({ ...p, [key as string]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50">
                    {(opts as string[]).map(o => <option key={o} value={o} className="bg-[#0a1628]">{o}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <button onClick={addTask}
              className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-xl font-bold text-white text-sm transition-all">
              Créer la tâche
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
