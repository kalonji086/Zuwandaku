'use client';

import { useState, useEffect } from 'react';
import {
  UtensilsCrossed, ShoppingCart, Plus, Minus, Trash2,
  Star, Clock, CheckCircle, ChefHat, Heart, Flame,
  Leaf, AlertCircle, X,
} from 'lucide-react';

/* ─── Types ─── */
type Category = 'Tous' | 'Entrées' | 'Plats' | 'Boissons' | 'Desserts';
type DietTag = 'Végétarien' | 'Épicé' | 'Populaire' | 'Nouveau';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<Category, 'Tous'>;
  tags: DietTag[];
  available: boolean;
  rating: number;
  prepTime: number; // minutes
}

interface CartItem extends MenuItem { qty: number; }

interface Preferences {
  dietaryRestrictions: string[];
  favoriteCategories: string[];
  spiceLevel: 'Doux' | 'Moyen' | 'Épicé';
  notes: string;
}

/* ─── Static menu data ─── */
const MENU: MenuItem[] = [
  { id: '1', name: 'Salade Niçoise', description: 'Thon, olives, tomates, œufs durs', price: 8, category: 'Entrées', tags: ['Végétarien'], available: true, rating: 4.3, prepTime: 10 },
  { id: '2', name: 'Soupe du jour', description: 'Légumes frais de saison', price: 5, category: 'Entrées', tags: ['Végétarien', 'Populaire'], available: true, rating: 4.6, prepTime: 8 },
  { id: '3', name: 'Poulet Moambé', description: 'Spécialité congolaise, sauce palme, riz', price: 15, category: 'Plats', tags: ['Populaire'], available: true, rating: 4.8, prepTime: 25 },
  { id: '4', name: 'Poisson Braisé', description: 'Tilapia grillé, plantain, légumes', price: 18, category: 'Plats', tags: ['Nouveau'], available: true, rating: 4.5, prepTime: 30 },
  { id: '5', name: 'Riz Sauté Épicé', description: 'Riz, légumes, piment, crevettes', price: 12, category: 'Plats', tags: ['Épicé'], available: true, rating: 4.2, prepTime: 20 },
  { id: '6', name: 'Steak Haché', description: 'Bœuf local, frites maison, sauce', price: 16, category: 'Plats', tags: [], available: false, rating: 4.4, prepTime: 22 },
  { id: '7', name: 'Jus de Maracuja', description: 'Fruit de la passion frais pressé', price: 4, category: 'Boissons', tags: ['Populaire', 'Nouveau'], available: true, rating: 4.9, prepTime: 3 },
  { id: '8', name: 'Eau Minérale', description: '50cl, fraîche', price: 2, category: 'Boissons', tags: [], available: true, rating: 4.0, prepTime: 1 },
  { id: '9', name: 'Bière Primus', description: 'Bière locale congolaise 65cl', price: 3, category: 'Boissons', tags: ['Populaire'], available: true, rating: 4.5, prepTime: 2 },
  { id: '10', name: 'Gâteau Manioc', description: 'Dessert traditionnel, sucre de canne', price: 6, category: 'Desserts', tags: ['Végétarien', 'Nouveau'], available: true, rating: 4.7, prepTime: 5 },
  { id: '11', name: 'Glace Maison', description: 'Vanille, chocolat ou fraise', price: 5, category: 'Desserts', tags: ['Populaire'], available: true, rating: 4.6, prepTime: 4 },
];

const CATEGORIES: Category[] = ['Tous', 'Entrées', 'Plats', 'Boissons', 'Desserts'];

const TAG_STYLE: Record<DietTag, string> = {
  'Végétarien': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Épicé':      'bg-red-500/10 text-red-400 border-red-500/20',
  'Populaire':  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Nouveau':    'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

const TAG_ICON: Record<DietTag, React.ReactNode> = {
  'Végétarien': <Leaf size={9} />,
  'Épicé':      <Flame size={9} />,
  'Populaire':  <Star size={9} />,
  'Nouveau':    <AlertCircle size={9} />,
};

const PREF_KEY = 'zuwandaku_restaurant_prefs';
const ORDERS_KEY = 'zuwandaku_restaurant_orders';

/* ─── Sub-components ─── */
function TagBadge({ tag }: { tag: DietTag }) {
  return (
    <span className={`flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border ${TAG_STYLE[tag]}`}>
      {TAG_ICON[tag]}{tag}
    </span>
  );
}

function MenuCard({ item, qty, onAdd, onRemove }: {
  item: MenuItem; qty: number;
  onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div className={`rounded-2xl border bg-[#0d0d14] p-4 transition-all ${item.available ? 'border-white/5 hover:border-orange-500/20' : 'border-white/3 opacity-50'}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <p className="font-semibold text-white/90 text-sm truncate">{item.name}</p>
            {!item.available && <span className="text-[9px] text-red-400 border border-red-500/20 bg-red-500/10 px-1.5 py-0.5 rounded-full">Indisponible</span>}
          </div>
          <p className="text-[11px] text-white/35 mb-2 leading-relaxed">{item.description}</p>
          <div className="flex items-center gap-2 flex-wrap">
            {item.tags.map(t => <TagBadge key={t} tag={t} />)}
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-white/25">
              <Star size={9} className="text-amber-400" />{item.rating}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-white/25">
              <Clock size={9} />{item.prepTime} min
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-orange-400 font-bold text-base">${item.price}</p>
          {item.available && (
            qty === 0 ? (
              <button onClick={onAdd}
                className="flex items-center gap-1 text-[11px] bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={11} />Ajouter
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button onClick={onRemove} className="w-6 h-6 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/50 transition-colors">
                  <Minus size={11} />
                </button>
                <span className="text-sm font-bold text-white/80 w-5 text-center">{qty}</span>
                <button onClick={onAdd} className="w-6 h-6 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 flex items-center justify-center text-orange-400 transition-colors">
                  <Plus size={11} />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
type Tab = 'menu' | 'commandes' | 'preferences';

export default function RestaurantPage() {
  const [tab, setTab] = useState<Tab>('menu');
  const [category, setCategory] = useState<Category>('Tous');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<Preferences>({
    dietaryRestrictions: [],
    favoriteCategories: [],
    spiceLevel: 'Moyen',
    notes: '',
  });

  useEffect(() => {
    try {
      const p = localStorage.getItem(PREF_KEY);
      if (p) setPrefs(JSON.parse(p));
      const o = localStorage.getItem(ORDERS_KEY);
      if (o) setOrders(JSON.parse(o));
    } catch {}
  }, []);

  const savePrefs = (p: Preferences) => {
    setPrefs(p);
    localStorage.setItem(PREF_KEY, JSON.stringify(p));
  };

  const filtered = category === 'Tous' ? MENU : MENU.filter(m => m.category === category);

  const getQty = (id: string) => cart.find(c => c.id === id)?.qty ?? 0;

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === id);
      if (!existing) return prev;
      if (existing.qty === 1) return prev.filter(c => c.id !== id);
      return prev.map(c => c.id === id ? { ...c, qty: c.qty - 1 } : c);
    });
  };

  const totalItems = cart.reduce((s, c) => s + c.qty, 0);
  const totalPrice = cart.reduce((s, c) => s + c.price * c.qty, 0);

  const placeOrder = () => {
    if (cart.length === 0) return;
    const order = {
      id: Date.now().toString(),
      items: cart,
      total: totalPrice,
      status: 'En préparation',
      date: new Date().toISOString(),
      notes: prefs.notes,
    };
    const updated = [order, ...orders];
    setOrders(updated);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    setCart([]);
    setCartOpen(false);
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 4000);
  };

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'menu',       label: 'Menu',       icon: <UtensilsCrossed size={14} /> },
    { id: 'commandes',  label: `Commandes (${orders.length})`, icon: <ShoppingCart size={14} /> },
    { id: 'preferences',label: 'Préférences', icon: <Heart size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d14] p-6">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 via-transparent to-red-500/5 pointer-events-none" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Module</p>
            <h1 className="text-2xl font-bold text-white mb-1">Restaurant <span className="text-orange-400">·</span></h1>
            <p className="text-sm text-white/40">Consultez le menu, passez une commande</p>
          </div>
          <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 items-center justify-center">
            <ChefHat size={24} className="text-orange-400" />
          </div>
        </div>
      </div>

      {/* Success toast */}
      {orderPlaced && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-5 py-3 text-emerald-400 text-sm font-semibold">
          <CheckCircle size={16} />Commande passée avec succès ! En cours de préparation…
        </div>
      )}

      {/* Tabs + Cart button */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-white/3 border border-white/5 rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all tracking-wide
                ${tab === t.id
                  ? 'bg-orange-500/15 text-orange-400 border border-orange-500/20 shadow-sm'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        {tab === 'menu' && (
          <button onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 transition-all">
            <ShoppingCart size={13} />Panier
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center bg-orange-500 text-white">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── MENU ── */}
      {tab === 'menu' && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold border transition-all
                  ${category === c
                    ? 'bg-orange-500/15 text-orange-400 border-orange-500/25'
                    : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
                {c}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(item => (
              <MenuCard key={item.id} item={item} qty={getQty(item.id)}
                onAdd={() => addToCart(item)} onRemove={() => removeFromCart(item.id)} />
            ))}
          </div>
        </div>
      )}

      {/* ── COMMANDES ── */}
      {tab === 'commandes' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#0d0d14]">
              <ShoppingCart size={36} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">Aucune commande passée</p>
              <button onClick={() => setTab('menu')}
                className="mt-4 text-xs text-orange-400 border border-orange-500/20 px-4 py-2 rounded-lg hover:bg-orange-500/10 transition-colors">
                Voir le menu →
              </button>
            </div>
          ) : orders.map(order => (
            <div key={order.id} className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold border bg-amber-500/10 text-amber-400 border-amber-500/20">
                    <Clock size={9} />{order.status}
                  </span>
                  <span className="text-[10px] text-white/25">{new Date(order.date).toLocaleString('fr-FR')}</span>
                </div>
                <p className="font-bold text-orange-400">${order.total.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                {order.items.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center justify-between text-xs text-white/50">
                    <span>{item.qty}× {item.name}</span>
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              {order.notes && (
                <p className="mt-2 text-[11px] text-white/25 italic">Note : {order.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PRÉFÉRENCES ── */}
      {tab === 'preferences' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5 space-y-5">
            {/* Niveau épice */}
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Niveau d'épice préféré</p>
              <div className="flex gap-2">
                {(['Doux', 'Moyen', 'Épicé'] as const).map(level => (
                  <button key={level} onClick={() => savePrefs({ ...prefs, spiceLevel: level })}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all
                      ${prefs.spiceLevel === level
                        ? 'bg-orange-500/15 text-orange-400 border-orange-500/25'
                        : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70'}`}>
                    {level === 'Épicé' ? '🌶️' : level === 'Moyen' ? '🔥' : '🌿'} {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Restrictions alimentaires */}
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Restrictions alimentaires</p>
              <div className="flex gap-2 flex-wrap">
                {['Végétarien', 'Sans gluten', 'Sans lactose', 'Halal', 'Casher'].map(r => {
                  const active = prefs.dietaryRestrictions.includes(r);
                  return (
                    <button key={r} onClick={() => savePrefs({
                      ...prefs,
                      dietaryRestrictions: active
                        ? prefs.dietaryRestrictions.filter(x => x !== r)
                        : [...prefs.dietaryRestrictions, r],
                    })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                        ${active
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                          : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70'}`}>
                      {r}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Catégories favorites */}
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Catégories favorites</p>
              <div className="flex gap-2 flex-wrap">
                {(['Entrées', 'Plats', 'Boissons', 'Desserts'] as const).map(cat => {
                  const active = prefs.favoriteCategories.includes(cat);
                  return (
                    <button key={cat} onClick={() => savePrefs({
                      ...prefs,
                      favoriteCategories: active
                        ? prefs.favoriteCategories.filter(x => x !== cat)
                        : [...prefs.favoriteCategories, cat],
                    })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all
                        ${active
                          ? 'bg-blue-500/15 text-blue-400 border-blue-500/25'
                          : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70'}`}>
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes spéciales */}
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Notes spéciales (allergies, etc.)</p>
              <textarea
                value={prefs.notes}
                onChange={e => savePrefs({ ...prefs, notes: e.target.value })}
                placeholder="Ex: allergie aux arachides, sans sel…"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/70 placeholder-white/20 focus:border-orange-500/40 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-4 py-2.5">
              <CheckCircle size={12} />Préférences sauvegardées automatiquement
            </div>
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="w-80 bg-[#0d0d14] border-l border-white/5 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <ShoppingCart size={16} className="text-orange-400" />
                <h2 className="font-semibold text-white/80 text-sm">Mon panier</h2>
              </div>
              <button onClick={() => setCartOpen(false)} className="text-white/30 hover:text-white/70 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-2">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={28} className="text-white/10 mx-auto mb-2" />
                  <p className="text-white/25 text-xs">Panier vide</p>
                </div>
              ) : cart.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/3 rounded-xl px-3 py-2.5 border border-white/5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/80 truncate">{item.name}</p>
                    <p className="text-[10px] text-white/30">${item.price} × {item.qty}</p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <button onClick={() => removeFromCart(item.id)} className="w-5 h-5 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 transition-colors">
                      <Minus size={9} />
                    </button>
                    <span className="text-xs font-bold text-white/70 w-4 text-center">{item.qty}</span>
                    <button onClick={() => addToCart(item)} className="w-5 h-5 rounded bg-orange-500/15 hover:bg-orange-500/25 flex items-center justify-center text-orange-400 transition-colors">
                      <Plus size={9} />
                    </button>
                    <button onClick={() => setCart(prev => prev.filter(c => c.id !== item.id))} className="w-5 h-5 rounded bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors ml-1">
                      <Trash2 size={9} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">Total</span>
                  <span className="text-lg font-bold text-orange-400">${totalPrice.toFixed(2)}</span>
                </div>
                <button onClick={placeOrder}
                  className="w-full bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 text-orange-400 font-semibold py-3 rounded-xl text-sm transition-all">
                  Passer la commande
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
