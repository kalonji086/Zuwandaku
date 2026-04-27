"use client";

import { useState } from "react";
import { Car, Loader2, Search } from "lucide-react";
import Navbar from "../components/Navbar";
import ProvinceSelector from "../components/ProvinceSelector";
import VehicleCard from "../components/VehicleCard";
import { useVehicles } from "../../lib/hooks";

const TYPES = [
  { label: "Tous",     value: "" },
  { label: "Location", value: "LOCATION" },
  { label: "Vente",    value: "VENTE" },
];

export default function VehiclesPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [provinceId, setProvinceId] = useState("");

  const { data, isLoading } = useVehicles({ type: typeFilter || undefined, provinceId: provinceId || undefined });
  const arr: any[] = Array.isArray(data) ? data : [];

  const filtered = arr.filter(v => {
    const hay = `${v.marque} ${v.modele} ${v.annee} ${v.description}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 text-center"
        style={{ background: "linear-gradient(135deg,#000 0%,#0a0f1e 50%,#000 100%)", borderBottom: "1px solid #1e3a5f" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%,rgba(139,92,246,0.15),transparent)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background:"rgba(139,92,246,0.15)", border:"1px solid rgba(139,92,246,0.4)", boxShadow:"0 0 28px rgba(139,92,246,0.3)" }}>
              <Car size={26} style={{ color:"#a78bfa" }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Véhicules</h1>
          <p className="text-sm" style={{ color:"#6b7fa3" }}>Location et vente de véhicules à travers la RDC</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-4"
            style={{ background:"#0d1526", border:"1px solid #1e3a5f" }}>
            <Search size={15} style={{ color:"#6b7fa3" }} />
            <input type="text" placeholder="Marque, modèle, année..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 py-3 outline-none text-sm bg-transparent" style={{ color:"#f0f4ff" }} />
          </div>
          <ProvinceSelector value={provinceId} onChange={setProvinceId} className="sm:w-56" />
        </div>

        {/* Tabs type */}
        <div className="flex gap-2 mb-5">
          {TYPES.map(t => {
            const active = typeFilter === t.value;
            return (
              <button key={t.value} onClick={() => setTypeFilter(t.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: active ? "#7c3aed" : "#0d1526",
                  color:      active ? "#fff"    : "#6b7fa3",
                  border:     `1px solid ${active ? "#8b5cf6" : "#1e3a5f"}`,
                  boxShadow:  active ? "0 0 16px rgba(124,58,237,0.35)" : "none",
                }}>
                <Car size={13} />{t.label}
              </button>
            );
          })}
        </div>

        {/* Compteur */}
        <p className="text-xs mb-5 flex items-center gap-1.5" style={{ color:"#6b7fa3" }}>
          {isLoading
            ? <><Loader2 size={13} className="animate-spin" />Chargement...</>
            : <><span className="font-bold text-sm" style={{ color:"#a78bfa" }}>{filtered.length}</span> véhicule(s) trouvé(s)</>
          }
        </p>

        {/* Grille */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background:"#0d1526", height:300 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background:"#0d1526", border:"1px solid #1e3a5f" }}>
              <Car size={32} style={{ color:"#1e3a5f" }} />
            </div>
            <p className="font-semibold" style={{ color:"#6b7fa3" }}>Aucun véhicule trouvé.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(v => <VehicleCard key={v.id} v={v} />)}
          </div>
        )}
      </div>
    </div>
  );
}
