'use client';

import { useState } from 'react';
import { Home, Car, Filter, MapPin, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useProperties, useVehicles } from '../../../lib/hooks';
import { useProvinces } from '../../../lib/hooks/useProvinces';

export default function ClientSearch() {
  const [searchType, setSearchType] = useState<'properties' | 'vehicles'>('properties');
  const [filters, setFilters] = useState({ type: '', provinceId: '', status: 'AVAILABLE' as string });

  const { data: properties = [], isLoading: loadingProps } = useProperties(
    searchType === 'properties' ? { type: filters.type || undefined, provinceId: filters.provinceId || undefined, status: filters.status || undefined } : undefined
  );
  const { data: vehicles = [], isLoading: loadingVehs } = useVehicles(
    searchType === 'vehicles' ? { provinceId: filters.provinceId || undefined } : undefined
  );
  const { data: provinces = [] } = useProvinces();

  const reset = () => setFilters({ type: '', provinceId: '', status: 'AVAILABLE' });
  const loading = loadingProps || loadingVehs;

  return (
    <div className="space-y-5">
      {/* Toggle */}
      <div className="flex gap-2">
        {[
          { id: 'properties', label: 'Biens immobiliers', icon: <Home size={15} />, active: 'bg-blue-500/15 text-blue-400 border-blue-500/25 shadow-blue-500/10' },
          { id: 'vehicles', label: 'Véhicules', icon: <Car size={15} />, active: 'bg-purple-500/15 text-purple-400 border-purple-500/25 shadow-purple-500/10' },
        ].map(t => (
          <button key={t.id} onClick={() => setSearchType(t.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border shadow-sm
              ${searchType === t.id ? t.active : 'bg-white/3 border-white/5 text-white/40 hover:text-white/70 hover:bg-white/5'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Filtres */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-4 flex flex-wrap gap-3 items-center">
        <Filter size={13} className="text-white/20" />
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
        <button onClick={reset} className="text-xs text-white/25 hover:text-white/50 underline transition-colors">Réinitialiser</button>
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
        </div>
      ) : searchType === 'properties' ? (
        properties.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-white/5 bg-[#0d0d14]">
            <Home size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm mb-4">Aucun bien trouvé</p>
            <button onClick={reset} className="text-xs text-blue-400 border border-blue-500/20 px-4 py-2 rounded-lg hover:bg-blue-500/10 transition-colors">Voir tout</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {properties.map((p: any) => (
              <div key={p.id} className="rounded-2xl border border-white/5 bg-[#0d0d14] overflow-hidden hover:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/5 transition-all group">
                <div className="h-44 bg-white/3 flex items-center justify-center overflow-hidden">
                  {p.photos?.[0]
                    ? <img src={p.photos[0]} alt={p.type} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <Home size={28} className="text-white/10" />}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{p.type}</span>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">{p.status}</span>
                  </div>
                  <p className="font-semibold text-white/80 text-sm">{p.ville?.nom}{p.quartier ? `, ${p.quartier.nom}` : ''}</p>
                  <p className="flex items-center gap-1 text-[11px] text-white/30 mt-0.5"><MapPin size={10} />{p.province?.nom}</p>
                  <p className="text-blue-400 font-bold text-xl mt-2">${p.price?.toLocaleString()}</p>
                  {p.surface && <p className="text-[11px] text-white/25">{p.surface} m²</p>}
                  <div className="mt-3 flex items-center justify-between">
                    {p.owner?.phone && (
                      <a href={`tel:${p.owner.phone}`} className="flex items-center gap-1 text-[11px] text-white/30 hover:text-blue-400 transition-colors">
                        <Phone size={10} />{p.owner.phone}
                      </a>
                    )}
                    <Link href={`/properties/${p.id}`}
                      className="ml-auto flex items-center gap-1 text-[11px] bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                      Voir <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        vehicles.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-white/5 bg-[#0d0d14]">
            <Car size={36} className="text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm mb-4">Aucun véhicule trouvé</p>
            <button onClick={reset} className="text-xs text-purple-400 border border-purple-500/20 px-4 py-2 rounded-lg hover:bg-purple-500/10 transition-colors">Voir tout</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {vehicles.map((v: any) => (
              <div key={v.id} className="rounded-2xl border border-white/5 bg-[#0d0d14] overflow-hidden hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-500/5 transition-all group">
                <div className="h-44 bg-white/3 flex items-center justify-center overflow-hidden">
                  {v.photos?.[0]
                    ? <img src={v.photos[0]} alt={v.marque} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <Car size={28} className="text-white/10" />}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{v.type}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${v.availability ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {v.availability ? 'Disponible' : 'Indisponible'}
                    </span>
                  </div>
                  <p className="font-semibold text-white/80 text-sm">{v.marque} {v.modele} <span className="text-white/30">({v.annee})</span></p>
                  <p className="flex items-center gap-1 text-[11px] text-white/30 mt-0.5"><MapPin size={10} />{v.ville?.nom}, {v.province?.nom}</p>
                  <p className="text-purple-400 font-bold text-xl mt-2">
                    {v.pricePerDay ? `$${v.pricePerDay}/j` : ''}{v.priceSale ? ` · $${v.priceSale?.toLocaleString()}` : ''}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    {v.owner?.phone && (
                      <a href={`tel:${v.owner.phone}`} className="flex items-center gap-1 text-[11px] text-white/30 hover:text-purple-400 transition-colors">
                        <Phone size={10} />{v.owner.phone}
                      </a>
                    )}
                    <Link href={`/vehicles/${v.id}`}
                      className="ml-auto flex items-center gap-1 text-[11px] bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 px-3 py-1.5 rounded-lg transition-colors">
                      Voir <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
