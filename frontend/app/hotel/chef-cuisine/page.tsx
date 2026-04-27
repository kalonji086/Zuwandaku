"use client";
import { useState } from 'react';
import { ChefHat, Plus, X, Clock, CheckCircle, Flame } from 'lucide-react';

const CATEGORIES = ['Entrées', 'Plats', 'Desserts', 'Boissons'];
const STATUS_STYLE: Record<string, string> = {
  'Disponible':    'text-cyan-300 bg-cyan-900/30 border-cyan-700/40',
  'En préparation':'text-yellow-300 bg-yellow-900/30 border-yellow-700/40',
  'Rupture':       'text-red-300 bg-red-900/30 border-red-700/40',
};

const MENU_INIT = [
  { id: 1, name: 'Poulet rôti', category: 'Plats', price: 12, prepTime: '25 min', status: 'Disponible', emoji: '🍗' },
  { id: 2, name: 'Poisson braisé', category: 'Plats', price: 15, prepTime: '30 min', status: 'Disponible', emoji: '🐟' },
  { id: 3, name: 'Riz sauce', category: 'Plats', price: 8, prepTime: '15 min', status: 'En préparation', emoji: '🍚' },
  { id: 4, name: 'Salade mixte', category: 'Entrées', price: 6, prepTime: '10 min', status: 'Disponible', emoji: '🥗' },
  { id: 5, name: 'Soupe légumes', category: 'Entrées', price: 5, prepTime: '20 min', status: 'Rupture', emoji: '🍲' },
  { id: 6, name: 'Gâteau choco', category: 'Desserts', price: 7, prepTime: '5 min', status: 'Disponible', emoji: '🍰' },
];

const ORDERS_INIT = [
  { id: 'CMD1042', table: 'Table 3', items: ['Poulet rôti ×2', 'Riz sauce ×2'], time: '12:35', status: 'En préparation' },
  { id: 'CMD1043', table: 'Chambre 205', items: ['Poisson braisé ×1', 'Salade mixte ×1'], time: '12:41', status: 'En attente' },
  { id: 'CMD1044', table: 'Table 1', items: ['Gâteau choco ×3'], time: '12:50', status: 'Prêt' },
];

const ORDER_STATUS_STYLE: Record<string, string> = {
  'En attente':    'text-gray-300 bg-gray-800/40 border-gray-700/40',
  'En préparation':'text-yellow-300 bg-yellow-900/30 border-yellow-700/40',
  'Prêt':          'text-cyan-300 bg-cyan-900/30 border-cyan-700/40',
};

export default function ChefCuisinePage() {
  const [menu, setMenu] = useState(MENU_INIT);
  const [orders, setOrders] = useState(ORDERS_INIT);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', category: CATEGORIES[0], price: '', prepTime: '', emoji: '🍽️' });
  const [activeTab, setActiveTab] = useState<'commandes' | 'menu'>('commandes');

  const cycleMenuStatus = (i: number) => {
    const cycle = ['Disponible', 'En préparation', 'Rupture'];
    setMenu(prev => prev.map((m, idx) => idx === i ? { ...m, status: cycle[(cycle.indexOf(m.status) + 1) % 3] } : m));
  };

  const cycleOrderStatus = (i: number) => {
    const cycle = ['En attente', 'En préparation', 'Prêt'];
    setOrders(prev => prev.map((o, idx) => idx === i ? { ...o, status: cycle[(cycle.indexOf(o.status) + 1) % 3] } : o));
  };

  const addDish = () => {
    if (!form.name || !form.price) return;
    setMenu(prev => [...prev, { id: prev.length + 1, ...form, price: Number(form.price), status: 'Disponible' }]);
    setShowAdd(false);
    setForm({ name: '', category: CATEGORIES[0], price: '', prepTime: '', emoji: '🍽️' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl">
            <ChefHat size={20} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Chef Cuisine</h2>
            <p className="text-xs text-gray-500">Gestion menu & commandes</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
            {(['commandes', 'menu'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${activeTab === tab ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'text-gray-500 hover:text-gray-300'}`}>
                {tab === 'commandes' ? '🍽️ Commandes' : '📋 Menu'}
              </button>
            ))}
          </div>
          {activeTab === 'menu' && (
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-sm font-semibold hover:bg-orange-500/20 transition-all">
              <Plus size={15} /> Plat
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          ['En attente', orders.filter(o => o.status === 'En attente').length, 'text-gray-300', 'bg-gray-800/30 border-gray-700/30'],
          ['En préparation', orders.filter(o => o.status === 'En préparation').length, 'text-yellow-300', 'bg-yellow-500/10 border-yellow-500/20'],
          ['Prêt', orders.filter(o => o.status === 'Prêt').length, 'text-cyan-300', 'bg-cyan-500/10 border-cyan-500/20'],
        ].map(([label, count, tc, bg]) => (
          <div key={label as string} className={`rounded-2xl p-4 border ${bg} text-center`}>
            <p className={`text-3xl font-black ${tc}`}>{count as number}</p>
            <p className="text-xs text-gray-500 mt-1">{label as string}</p>
          </div>
        ))}
      </div>

      {activeTab === 'commandes' ? (
        <div className="space-y-3">
          {orders.map((o, i) => (
            <div key={o.id} className={`bg-[#0a1628]/80 border rounded-2xl p-4 flex items-center gap-4 transition-all ${o.status === 'En préparation' ? 'border-yellow-500/20' : o.status === 'Prêt' ? 'border-cyan-500/20' : 'border-white/5'}`}>
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                <Flame size={16} className="text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-black text-orange-300 text-sm">{o.id}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {o.time}</span>
                </div>
                <p className="text-xs text-gray-400 font-medium">{o.table}</p>
                <p className="text-xs text-gray-500 mt-0.5">{o.items.join(' • ')}</p>
              </div>
              <button onClick={() => cycleOrderStatus(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 hover:opacity-80 ${ORDER_STATUS_STYLE[o.status]}`}>
                {o.status}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {menu.map((m, i) => (
            <div key={m.id} className="bg-[#0a1628]/80 border border-white/5 rounded-2xl p-4 hover:border-orange-500/20 transition-all">
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{m.emoji}</span>
                <button onClick={() => cycleMenuStatus(i)}
                  className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all hover:opacity-80 ${STATUS_STYLE[m.status]}`}>
                  {m.status}
                </button>
              </div>
              <p className="font-bold text-white">{m.name}</p>
              <p className="text-xs text-gray-500 mb-2">{m.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 font-black">${m.price}</span>
                <span className="text-xs text-gray-500 flex items-center gap-1"><Clock size={10} /> {m.prepTime}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#070d1a] border border-orange-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(249,115,22,0.1)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-white">Nouveau plat</h3>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[['Nom du plat', 'name', 'text'], ['Emoji', 'emoji', 'text'], ['Prix ($)', 'price', 'number'], ['Temps préparation', 'prepTime', 'text']].map(([label, key, type]) => (
                <div key={key as string}>
                  <label className="text-xs text-gray-500 mb-1 block">{label as string}</label>
                  <input type={type as string} value={form[key as keyof typeof form]} onChange={e => setForm(p => ({ ...p, [key as string]: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50" />
                </div>
              ))}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Catégorie</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500/50">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0a1628]">{c}</option>)}
                </select>
              </div>
            </div>
            <button onClick={addDish}
              className="mt-5 w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-xl font-bold text-white text-sm transition-all">
              Ajouter au menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
