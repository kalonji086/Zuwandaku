'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home, Car, FileText, Search, User, MapPin, DollarSign,
  CheckCircle, Clock, XCircle, AlertCircle, Phone, Filter,
  TrendingUp, Satellite, ArrowRight, Star, Zap, Eye, Share2, MessageSquare, Heart, UtensilsCrossed,
} from 'lucide-react';
import { useContracts } from '../../lib/hooks';
import { useClientStats } from '../../lib/hooks/useClientStats';
import { useProvinces } from '../../lib/hooks/useProvinces';
import { useProperties, useVehicles } from '../../lib/hooks';
import ViewModal from '../components/ViewModal';
import ContactModal from '../components/ContactModal';
import FavoritesModal from '../components/FavoritesModal';

/* ─── helpers ─── */
const statusColor: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  TERMINATED: 'bg-white/5 text-white/30 border-white/10',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
};
const statusIcon = (s: string) =>
  s === 'ACTIVE' ? <CheckCircle size={12} /> :
  s === 'PENDING' ? <Clock size={12} /> :
  s === 'CANCELLED' ? <XCircle size={12} /> :
  <AlertCircle size={12} />;

type Tab = 'overview' | 'search' | 'contracts' | 'restaurant';

/* ─── Stat Card ─── */
function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: React.ReactNode; accent: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d14] p-5 group hover:border-white/10 transition-all`}>
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${accent} pointer-events-none`} />
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-white/30 uppercase tracking-widest font-medium">{label}</span>
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">{icon}</div>
        </div>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

/* ─── Property Card ─── */
function PropertyCard({ p, onView, onContact }: { p: any; onView: (item: any) => void; onContact: (item: any) => void }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d0d14] overflow-hidden hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
      <div className="h-40 bg-white/3 flex items-center justify-center overflow-hidden">
        {p.photos?.[0]
          ? <img src={p.photos[0]} alt={p.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <Home size={28} className="text-white/10" />}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{p.type}</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold">{p.status}</span>
        </div>
        <p className="font-semibold text-white/90 text-sm">{p.ville?.nom}{p.quartier ? `, ${p.quartier.nom}` : ''}</p>
        <p className="flex items-center gap-1 text-[11px] text-white/30 mt-0.5"><MapPin size={10} />{p.province?.nom}</p>
        <p className="text-blue-400 font-bold text-lg mt-2">${p.price?.toLocaleString()}</p>
        {p.surface && <p className="text-[11px] text-white/25">{p.surface} m²</p>}
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => onView({ ...p, _kind: 'property' })}
            className="flex items-center gap-1 text-[11px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
            <Eye size={10} />Voir
          </button>
          <button onClick={() => onContact({ ...p, _kind: 'property' })}
            className="flex items-center gap-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
            <MessageSquare size={10} />Contact
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Vehicle Card ─── */
function VehicleCard({ v, onView, onContact }: { v: any; onView: (item: any) => void; onContact: (item: any) => void }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d0d14] overflow-hidden hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all group">
      <div className="h-40 bg-white/3 flex items-center justify-center overflow-hidden">
        {v.photos?.[0]
          ? <img src={v.photos[0]} alt={v.marque} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          : <Car size={28} className="text-white/10" />}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{v.type}</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${v.availability ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
            {v.availability ? 'Disponible' : 'Indisponible'}
          </span>
        </div>
        <p className="font-semibold text-white/90 text-sm">{v.marque} {v.modele} <span className="text-white/30">({v.annee})</span></p>
        <p className="flex items-center gap-1 text-[11px] text-white/30 mt-0.5"><MapPin size={10} />{v.ville?.nom}, {v.province?.nom}</p>
        <p className="text-purple-400 font-bold text-lg mt-2">
          {v.pricePerDay ? `$${v.pricePerDay}/j` : ''}{v.priceSale ? ` · $${v.priceSale?.toLocaleString()}` : ''}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => onView({ ...v, _kind: 'vehicle' })}
            className="flex items-center gap-1 text-[11px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-colors">
            <Eye size={10} />Voir
          </button>
          <button onClick={() => onContact({ ...v, _kind: 'vehicle' })}
            className="flex items-center gap-1 text-[11px] bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/70 border border-white/10 px-3 py-1.5 rounded-lg transition-colors">
            <MessageSquare size={10} />Contact
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ─── */
export default function ClientDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [searchType, setSearchType] = useState<'properties' | 'vehicles'>('properties');
  const [filters, setFilters] = useState({ type: '', provinceId: '', status: 'AVAILABLE' });
  const [user, setUser] = useState<any>(null);

  const [viewItem, setViewItem] = useState<any>(null);
  const [contactItem, setContactItem] = useState<any>(null);
  const [favOpen, setFavOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const update = () => {
      try { setFavCount(JSON.parse(localStorage.getItem('zuwandaku_favorites') ?? '[]').length); } catch {}
    };
    update();
    window.addEventListener('zuwandaku_favorites_changed', update);
    return () => window.removeEventListener('zuwandaku_favorites_changed', update);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const { data: contracts = [], isLoading: loadingContracts } = useContracts({ role: 'CLIENT' });
  const { data: stats } = useClientStats();
  const { data: provinces = [] } = useProvinces();
  const { data: properties = [], isLoading: loadingProps } = useProperties(
    searchType === 'properties' ? { type: filters.type || undefined, provinceId: filters.provinceId || undefined, status: filters.status || undefined } : undefined
  );
  const { data: vehicles = [], isLoading: loadingVehs } = useVehicles(
    searchType === 'vehicles' ? { provinceId: filters.provinceId || undefined } : undefined
  );

  const activeContracts = contracts.filter((c: any) => c.status === 'ACTIVE');
  const pendingContracts = contracts.filter((c: any) => c.status === 'PENDING');

  const TABS = [
    { id: 'overview' as Tab, label: 'Vue d\'ensemble', icon: <Satellite size={14} /> },
    { id: 'search' as Tab, label: 'Rechercher', icon: <Search size={14} /> },
    { id: 'contracts' as Tab, label: `Contrats (${contracts.length})`, icon: <FileText size={14} /> },
    { id: 'restaurant' as Tab, label: 'Restaurant', icon: <UtensilsCrossed size={14} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Modals */}
      <ViewModal
        isOpen={!!viewItem}
        item={viewItem}
        onClose={() => setViewItem(null)}
        onContact={() => { setContactItem(viewItem); setViewItem(null); }}
      />
      <ContactModal
        isOpen={!!contactItem}
        item={contactItem}
        onClose={() => setContactItem(null)}
      />
      <FavoritesModal
        isOpen={favOpen}
        onClose={() => setFavOpen(false)}
        onView={item => { setViewItem(item); setFavOpen(false); }}
      />

      {/* Tabs + Favoris */}
      <div className="flex items-center justify-between gap-3">
      <div className="flex gap-1 bg-white/3 border border-white/5 rounded-xl p-1 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all tracking-wide
              ${tab === t.id
                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-sm'
                : 'text-white/30 hover:text-white/60 hover:bg-white/5'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>
      <button onClick={() => setFavOpen(true)}
        className="relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-white/3 border border-white/5 text-white/40 hover:text-red-400 hover:border-red-500/20 transition-all">
        <Heart size={13} />
        Favoris
        {favCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center bg-red-500 text-white">
            {favCount > 9 ? '9+' : favCount}
          </span>
        )}
      </button>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'overview' && (
        <div className="space-y-6">
          {/* Hero banner */}
          <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#0d0d14] p-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-cyan-500/5 pointer-events-none" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">Bienvenue</p>
                <h1 className="text-2xl font-bold text-white mb-1">
                  {user?.name ?? 'Client'} <span className="text-blue-400">·</span>
                </h1>
                <p className="text-sm text-white/40">Trouvez votre bien idéal à Kinshasa, RDC</p>
              </div>
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 items-center justify-center">
                <Satellite size={24} className="text-blue-400" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              label="Contrats actifs"
              value={stats?.activeContracts ?? activeContracts.length}
              icon={<CheckCircle size={16} className="text-emerald-400" />}
              accent="from-emerald-500/5 to-transparent"
            />
            <StatCard
              label="En attente"
              value={stats?.totalContracts ? stats.totalContracts - (stats.activeContracts ?? 0) : pendingContracts.length}
              icon={<Clock size={16} className="text-amber-400" />}
              accent="from-amber-500/5 to-transparent"
            />
            <StatCard
              label="Total dépensé"
              value={`$${(stats?.totalSpent ?? 0).toLocaleString()}`}
              icon={<DollarSign size={16} className="text-blue-400" />}
              accent="from-blue-500/5 to-transparent"
            />
          </div>

          {/* Contrats actifs */}
          {activeContracts.length > 0 && (
            <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={15} className="text-blue-400" />
                <h2 className="text-sm font-semibold text-white/80 tracking-wide">Locations / Achats en cours</h2>
              </div>
              <div className="space-y-2">
                {activeContracts.map((c: any) => (
                  <div key={c.id} className="flex items-center justify-between bg-white/3 hover:bg-white/5 rounded-xl px-4 py-3 border border-white/5 transition-colors">
                    <div>
                      <p className="font-semibold text-white/80 text-sm">
                        {c.property ? `${c.property.type} — ${c.property.ville?.nom}` : c.vehicle ? `${c.vehicle.marque} ${c.vehicle.modele}` : 'Contrat'}
                      </p>
                      <p className="text-[11px] text-white/30 mt-0.5">
                        {c.owner?.name}
                        {c.owner?.phone && <span> · <a href={`tel:${c.owner.phone}`} className="text-blue-400 hover:underline">{c.owner.phone}</a></span>}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-400">${c.amount?.toLocaleString()}</p>
                      <p className="text-[10px] text-white/25">{c.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button onClick={() => setTab('search')}
              className="flex items-center justify-between gap-3 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 text-blue-400 font-semibold py-4 px-5 rounded-2xl transition-all group">
              <div className="flex items-center gap-3">
                <Search size={18} />
                <span className="text-sm">Rechercher un bien</span>
              </div>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setTab('contracts')}
              className="flex items-center justify-between gap-3 bg-white/3 hover:bg-white/5 border border-white/5 text-white/50 hover:text-white/70 font-semibold py-4 px-5 rounded-2xl transition-all group">
              <div className="flex items-center gap-3">
                <FileText size={18} />
                <span className="text-sm">Voir mes contrats</span>
              </div>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => setTab('restaurant')}
              className="flex items-center justify-between gap-3 bg-orange-500/10 hover:bg-orange-500/15 border border-orange-500/20 text-orange-400 font-semibold py-4 px-5 rounded-2xl transition-all group">
              <div className="flex items-center gap-3">
                <UtensilsCrossed size={18} />
                <span className="text-sm">Commander au restaurant</span>
              </div>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      )}

      {/* ── SEARCH ── */}
      {tab === 'search' && (
        <div className="space-y-5">
          {/* Type toggle */}
          <div className="flex gap-2">
            <button onClick={() => setSearchType('properties')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border
                ${searchType === 'properties'
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/25 shadow-sm shadow-blue-500/10'
                  : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
              <Home size={15} />Biens immobiliers
            </button>
            <button onClick={() => setSearchType('vehicles')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border
                ${searchType === 'vehicles'
                  ? 'bg-purple-500/15 text-purple-400 border-purple-500/25 shadow-sm shadow-purple-500/10'
                  : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
              <Car size={15} />Véhicules
            </button>
          </div>

          {/* Filtres */}
          <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-4 flex flex-wrap gap-3 items-center">
            <Filter size={14} className="text-white/25" />
            {searchType === 'properties' && (
              <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:border-blue-500/50 focus:outline-none">
                <option value="">Tous les types</option>
                <option value="MAISON">Maison</option>
                <option value="APPARTEMENT">Appartement</option>
                <option value="PARCELLE">Parcelle</option>
                <option value="BUREAU">Bureau</option>
              </select>
            )}
            <select value={filters.provinceId} onChange={e => setFilters(f => ({ ...f, provinceId: e.target.value }))}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:border-blue-500/50 focus:outline-none">
              <option value="">Toutes les provinces</option>
              {provinces.map((p: any) => <option key={p.id} value={p.id}>{p.nom}</option>)}
            </select>
            {searchType === 'properties' && (
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/60 focus:border-blue-500/50 focus:outline-none">
                <option value="AVAILABLE">Disponible</option>
                <option value="">Tous</option>
                <option value="RESERVED">Réservé</option>
              </select>
            )}
            <button onClick={() => setFilters({ type: '', provinceId: '', status: 'AVAILABLE' })}
              className="text-xs text-white/25 hover:text-white/50 underline transition-colors">Réinitialiser</button>
          </div>

          {/* Résultats */}
          {(loadingProps || loadingVehs) ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
            </div>
          ) : searchType === 'properties' ? (
            properties.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#0d0d14]">
                <Home size={36} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Aucun bien trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((p: any) => <PropertyCard key={p.id} p={p} onView={setViewItem} onContact={setContactItem} />)}
              </div>
            )
          ) : (
            vehicles.length === 0 ? (
              <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#0d0d14]">
                <Car size={36} className="text-white/10 mx-auto mb-3" />
                <p className="text-white/30 text-sm">Aucun véhicule trouvé</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((v: any) => <VehicleCard key={v.id} v={v} onView={setViewItem} onContact={setContactItem} />)}
              </div>
            )
          )}
        </div>
      )}

      {/* ── RESTAURANT ── */}
      {tab === 'restaurant' && (
        <div className="rounded-2xl border border-orange-500/10 bg-[#0d0d14] p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/10 border border-orange-500/20 flex items-center justify-center mx-auto">
            <UtensilsCrossed size={28} className="text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white/80 mb-1">Module Restaurant</h2>
            <p className="text-sm text-white/35">Consultez le menu complet, passez une commande et gérez vos préférences</p>
          </div>
          <a href="/client/restaurant"
            className="inline-flex items-center gap-2 bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/25 text-orange-400 font-semibold px-6 py-3 rounded-xl text-sm transition-all">
            <UtensilsCrossed size={15} />Ouvrir le restaurant <ArrowRight size={14} />
          </a>
        </div>
      )}

      {/* ── CONTRACTS ── */}
      {tab === 'contracts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/70 tracking-wide uppercase">Mes contrats</h2>
            <div className="flex items-center gap-3 text-[11px] text-white/30">
              <span className="flex items-center gap-1"><CheckCircle size={11} className="text-emerald-400" />{activeContracts.length} actifs</span>
              <span className="flex items-center gap-1"><Clock size={11} className="text-amber-400" />{pendingContracts.length} en attente</span>
            </div>
          </div>

          {loadingContracts ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
            </div>
          ) : contracts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-white/5 bg-[#0d0d14]">
              <FileText size={36} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm mb-4">Aucun contrat</p>
              <button onClick={() => setTab('search')}
                className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 px-4 py-2 rounded-lg transition-colors">
                Rechercher un bien →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {contracts.map((c: any) => (
                <div key={c.id} className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5 hover:border-white/10 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-full font-semibold border ${statusColor[c.status] ?? statusColor.TERMINATED}`}>
                          {statusIcon(c.status)}{c.status}
                        </span>
                        <span className="text-[10px] text-white/25 bg-white/5 border border-white/5 px-2 py-1 rounded-full">{c.type}</span>
                      </div>
                      <p className="font-bold text-white/80 text-base">
                        {c.property ? `${c.property.type} — ${c.property.ville?.nom}` : c.vehicle ? `${c.vehicle.marque} ${c.vehicle.modele} (${c.vehicle.annee})` : 'Contrat'}
                      </p>
                      {c.property?.ville && (
                        <p className="flex items-center gap-1 text-[11px] text-white/30 mt-0.5"><MapPin size={10} />{c.property.ville.nom}</p>
                      )}
                      {c.owner && (
                        <div className="flex items-center gap-2 text-[11px] text-white/30 mt-2">
                          <User size={10} />
                          <span>{c.owner.name}</span>
                          {c.owner.phone && (
                            <a href={`tel:${c.owner.phone}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-1">
                              <Phone size={10} />{c.owner.phone}
                            </a>
                          )}
                        </div>
                      )}
                      {(c.startDate || c.endDate) && (
                        <p className="text-[11px] text-white/20 mt-1">
                          {c.startDate ? new Date(c.startDate).toLocaleDateString('fr-FR') : ''}
                          {c.endDate ? ` → ${new Date(c.endDate).toLocaleDateString('fr-FR')}` : ''}
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-bold text-blue-400">${c.amount?.toLocaleString()}</p>
                      <p className="text-[10px] text-white/25">{c.currency}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
