"use client";

import { useState } from 'react';
import {
  BedDouble, Users, DollarSign, TrendingUp, ShoppingCart, ChefHat,
  Plus, Minus, Trash2, Send, X, CheckCircle, Clock, Wifi
} from 'lucide-react';
import NewReservationModal from './components/NewReservationModal-fixed';
import CheckInModal from './components/CheckInModal';
import CheckOutModal from './components/CheckOutModal';

// ─── Types ───────────────────────────────────────────────────────────────────
interface MenuItem { id: number; name: string; price: number; category: string; emoji: string; }
interface CartItem extends MenuItem { qty: number; }
interface KitchenOrder { id: string; items: CartItem[]; table: string; time: string; status: 'pending' | 'preparing' | 'ready'; }

// ─── Data ─────────────────────────────────────────────────────────────────────
const STATS = [
  { value: '24', label: 'Chambres', icon: BedDouble, trend: '+12%', color: 'cyan' },
  { value: '18', label: 'Occupées', icon: Users, trend: '+8%', color: 'blue' },
  { value: '$4,250', label: 'Revenus', icon: DollarSign, trend: '+15%', color: 'cyan' },
  { value: '92%', label: 'Taux occ.', icon: TrendingUp, trend: '+5%', color: 'blue' },
];

const MENU: MenuItem[] = [
  { id: 1, name: 'Poulet rôti', price: 12, category: 'Plats', emoji: '🍗' },
  { id: 2, name: 'Poisson braisé', price: 15, category: 'Plats', emoji: '🐟' },
  { id: 3, name: 'Riz sauce', price: 8, category: 'Plats', emoji: '🍚' },
  { id: 4, name: 'Salade mixte', price: 6, category: 'Entrées', emoji: '🥗' },
  { id: 5, name: 'Soupe légumes', price: 5, category: 'Entrées', emoji: '🍲' },
  { id: 6, name: 'Jus de fruits', price: 3, category: 'Boissons', emoji: '🥤' },
  { id: 7, name: 'Eau minérale', price: 2, category: 'Boissons', emoji: '💧' },
  { id: 8, name: 'Bière locale', price: 4, category: 'Boissons', emoji: '🍺' },
  { id: 9, name: 'Gâteau choco', price: 7, category: 'Desserts', emoji: '🍰' },
  { id: 10, name: 'Glace vanille', price: 5, category: 'Desserts', emoji: '🍦' },
];

const BOOKINGS = [
  { id: 'RB001', guest: 'Jean Mukendi', room: 'Suite 101', amount: '$250', status: 'Check-in' },
  { id: 'RB002', guest: 'Marie Kabila', room: 'Chambre 205', amount: '$120', status: 'Réservé' },
  { id: 'RB003', guest: 'Paul Lumumba', room: 'Suite 302', amount: '$350', status: 'Check-out' },
];

const STATUS_COLORS: Record<string, string> = {
  'Check-in': 'text-cyan-300 bg-cyan-900/40 border-cyan-700/50',
  'Réservé': 'text-blue-300 bg-blue-900/40 border-blue-700/50',
  'Check-out': 'text-orange-300 bg-orange-900/40 border-orange-700/50',
};

// ─── Starlink glow helper ─────────────────────────────────────────────────────
const glow = (color: string) =>
  color === 'cyan'
    ? 'shadow-[0_0_20px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]'
    : 'shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]';

// ─── Component ────────────────────────────────────────────────────────────────
export default function HotelDashboard() {
  const [isNewResOpen, setIsNewResOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [table, setTable] = useState('Table 1');
  const [kitchenOrders, setKitchenOrders] = useState<KitchenOrder[]>([]);
  const [sentNotif, setSentNotif] = useState(false);
  const [activeCategory, setActiveCategory] = useState('Tous');

  const categories = ['Tous', ...Array.from(new Set(MENU.map(m => m.category)))];
  const filtered = activeCategory === 'Tous' ? MENU : MENU.filter(m => m.category === activeCategory);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      return existing
        ? prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c)
        : [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c)
          .filter(c => c.qty > 0)
    );
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cartCount = cart.reduce((s, c) => s + c.qty, 0);

  const sendToKitchen = () => {
    if (!cart.length) return;
    const order: KitchenOrder = {
      id: 'CMD' + Math.floor(Math.random() * 9000 + 1000),
      items: [...cart],
      table,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending',
    };
    setKitchenOrders(prev => [order, ...prev]);
    setCart([]);
    setCartOpen(false);
    setSentNotif(true);
    setTimeout(() => setSentNotif(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050a14] text-white p-4 md:p-6 relative overflow-x-hidden">

      {/* Starlink background grid */}
      <div className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(6,182,212,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.04) 0%, transparent 50%)' }} />

      {/* Sent notification */}
      {sentNotif && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-cyan-900/90 border border-cyan-500/50 text-cyan-200 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse">
          <CheckCircle size={18} className="text-cyan-400" />
          <span className="font-semibold text-sm">Commande envoyée à la cuisine !</span>
        </div>
      )}

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-md" />
            <img src="/logo.png" alt="ZUWAndaku" width={44} height={44} className="relative rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Dashboard <span className="text-cyan-400">Hotel</span></h1>
            <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
              <Wifi size={11} className="text-cyan-500" /> Réceptionniste • En ligne
            </p>
          </div>
        </div>

        {/* Cart button */}
        <button onClick={() => setCartOpen(true)}
          className="relative flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl hover:bg-cyan-500/20 hover:border-cyan-400/60 transition-all shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <ShoppingCart size={18} className="text-cyan-400" />
          <span className="text-sm font-semibold text-cyan-300 hidden sm:block">Panier</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-cyan-500 text-black text-xs font-black rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.8)]">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((s, i) => {
          const Icon = s.icon;
          const isCyan = s.color === 'cyan';
          return (
            <div key={i} className={`relative bg-[#0a1628]/80 backdrop-blur rounded-2xl p-5 border border-white/5 transition-all duration-300 cursor-default ${glow(s.color)}`}>
              <div className={`absolute top-0 left-0 right-0 h-px rounded-t-2xl ${isCyan ? 'bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-500/60 to-transparent'}`} />
              <div className="flex items-start justify-between">
                <div>
                  <p className={`text-3xl font-black ${isCyan ? 'text-cyan-300' : 'text-blue-300'}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
                </div>
                <div className={`p-2.5 rounded-xl ${isCyan ? 'bg-cyan-500/10' : 'bg-blue-500/10'}`}>
                  <Icon size={22} className={isCyan ? 'text-cyan-400' : 'text-blue-400'} />
                </div>
              </div>
              <div className={`mt-3 inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg ${isCyan ? 'text-cyan-400 bg-cyan-900/30' : 'text-blue-400 bg-blue-900/30'}`}>
                <TrendingUp size={11} /> {s.trend}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Quick Actions */}
        <div className="bg-[#0a1628]/80 backdrop-blur rounded-2xl p-5 border border-white/5 shadow-[0_0_20px_rgba(6,182,212,0.05)]">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-5 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
            <h3 className="font-bold text-white">Actions rapides</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: '➕ Nouvelle réservation', fn: () => setIsNewResOpen(true), border: 'border-cyan-700/40 hover:border-cyan-400/60 hover:bg-cyan-900/20' },
              { label: '✅ Check-in', fn: () => setIsCheckInOpen(true), border: 'border-blue-700/40 hover:border-blue-400/60 hover:bg-blue-900/20' },
              { label: '🚪 Check-out', fn: () => setIsCheckOutOpen(true), border: 'border-orange-700/40 hover:border-orange-400/60 hover:bg-orange-900/20' },
              { label: '🍽️ Commander repas', fn: () => setCartOpen(true), border: 'border-purple-700/40 hover:border-purple-400/60 hover:bg-purple-900/20' },
            ].map((a, i) => (
              <button key={i} onClick={a.fn}
                className={`w-full p-3.5 border border-dashed rounded-xl text-left text-sm font-medium text-gray-300 transition-all ${a.border}`}>
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="xl:col-span-2 bg-[#0a1628]/80 backdrop-blur rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <h3 className="font-bold text-white">Réservations récentes</h3>
          </div>
          <div className="space-y-3">
            {BOOKINGS.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/5 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center text-xs font-black text-cyan-300">
                    {b.guest.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{b.guest}</p>
                    <p className="text-xs text-gray-500">{b.id} • {b.room}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1.5">
                  <p className="font-black text-cyan-300">{b.amount}</p>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Menu Restaurant ── */}
      <div className="bg-[#0a1628]/80 backdrop-blur rounded-2xl p-5 border border-white/5 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            <h3 className="font-bold text-white">Menu Restaurant</h3>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeCategory === cat ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-gray-500 hover:text-gray-300 border border-white/5'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => (
            <button key={item.id} onClick={() => addToCart(item)}
              className="group relative p-4 bg-white/[0.03] border border-white/5 rounded-xl hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all text-left">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <p className="text-sm font-semibold text-white leading-tight">{item.name}</p>
              <p className="text-xs text-cyan-400 font-bold mt-1">${item.price}</p>
              <div className="absolute top-2 right-2 w-5 h-5 bg-cyan-500/0 group-hover:bg-cyan-500/20 rounded-full flex items-center justify-center transition-all">
                <Plus size={12} className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Kitchen Orders ── */}
      {kitchenOrders.length > 0 && (
        <div className="bg-[#0a1628]/80 backdrop-blur rounded-2xl p-5 border border-white/5">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1.5 h-5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            <ChefHat size={18} className="text-orange-400" />
            <h3 className="font-bold text-white">Commandes Cuisine</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {kitchenOrders.map(order => (
              <div key={order.id} className="p-4 bg-white/[0.03] border border-orange-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-black text-orange-300 text-sm">{order.id}</span>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={11} /> {order.time}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2 font-medium">{order.table}</p>
                <div className="space-y-1">
                  {order.items.map(item => (
                    <div key={item.id} className="flex justify-between text-xs">
                      <span className="text-gray-300">{item.emoji} {item.name} ×{item.qty}</span>
                      <span className="text-cyan-400 font-semibold">${item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-black text-white">Total: ${order.items.reduce((s, i) => s + i.price * i.qty, 0)}</span>
                  <span className="px-2 py-0.5 bg-orange-900/40 text-orange-300 border border-orange-700/40 rounded-full text-xs font-semibold">En préparation</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Cart Drawer ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-[#070d1a] border-l border-cyan-500/20 flex flex-col shadow-[0_0_60px_rgba(6,182,212,0.15)]">

            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-cyan-400" />
                <h3 className="font-bold text-white">Panier</h3>
                {cartCount > 0 && <span className="w-5 h-5 bg-cyan-500 text-black text-xs font-black rounded-full flex items-center justify-center">{cartCount}</span>}
              </div>
              <button onClick={() => setCartOpen(false)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
                <X size={18} />
              </button>
            </div>

            {/* Table selector */}
            <div className="px-5 py-3 border-b border-white/5">
              <label className="text-xs text-gray-500 font-medium block mb-1.5">Table / Chambre</label>
              <select value={table} onChange={e => setTable(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50">
                {['Table 1','Table 2','Table 3','Table 4','Chambre 101','Chambre 205','Suite 302'].map(t => (
                  <option key={t} value={t} className="bg-[#0a1628]">{t}</option>
                ))}
              </select>
            </div>

            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-600">
                  <ShoppingCart size={36} className="mb-3 opacity-30" />
                  <p className="text-sm">Panier vide</p>
                  <p className="text-xs mt-1">Ajoutez des plats depuis le menu</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-xl">
                  <span className="text-xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{item.name}</p>
                    <p className="text-xs text-cyan-400 font-bold">${item.price * item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => updateQty(item.id, -1)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-red-900/30 flex items-center justify-center transition-all">
                      {item.qty === 1 ? <Trash2 size={11} className="text-red-400" /> : <Minus size={11} className="text-gray-400" />}
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-cyan-900/30 flex items-center justify-center transition-all">
                      <Plus size={11} className="text-cyan-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart footer */}
            <div className="px-5 py-4 border-t border-white/5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total</span>
                <span className="text-xl font-black text-cyan-300">${total}</span>
              </div>
              <button onClick={sendToKitchen} disabled={!cart.length}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                <ChefHat size={18} />
                Envoyer à la cuisine
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      <NewReservationModal isOpen={isNewResOpen} onClose={() => setIsNewResOpen(false)}
        onSave={(d: any) => { alert('Réservation #RB' + Math.floor(Math.random() * 1000)); setIsNewResOpen(false); }} />
      <CheckInModal isOpen={isCheckInOpen} onClose={() => setIsCheckInOpen(false)}
        onCheckIn={(d: any) => { alert('Check-in OK pour ' + d.guestName); setIsCheckInOpen(false); }} />
      <CheckOutModal isOpen={isCheckOutOpen} onClose={() => setIsCheckOutOpen(false)}
        onCheckOut={(d: any) => { alert('Check-out OK. Monnaie: $' + d.changeDue); setIsCheckOutOpen(false); }} />
    </div>
  );
}
