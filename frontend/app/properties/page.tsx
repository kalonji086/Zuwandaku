"use client";

import { useState } from "react";
import { Search, Home, Building2, Landmark, LayoutGrid, Car, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import ProvinceSelector from "../components/ProvinceSelector";
import PropertyCard from "../components/PropertyCard";
import MaisonCard from "../components/MaisonCard";
import AppartementCard from "../components/AppartementCard";
import ParcelleCard from "../components/ParcelleCard";
import { useProperties } from "../../lib/hooks";

const TYPES = [
  { label: "Tous",         value: "",            icon: <LayoutGrid size={13} /> },
  { label: "Maisons",      value: "MAISON",       icon: <Home size={13} /> },
  { label: "Appartements", value: "APPARTEMENT",  icon: <Building2 size={13} /> },
  { label: "Parcelles",    value: "PARCELLE",     icon: <Landmark size={13} /> },
  { label: "Bureaux",      value: "BUREAU",       icon: <Building2 size={13} /> },
];

const TRANSACTIONS = [
  { label: "Tous",      value: "" },
  { label: "À Louer",   value: "LOCATION" },
  { label: "À Vendre",  value: "VENTE" },
];

const CARD_MAP: Record<string, React.ComponentType<{ p: any }>> = {
  MAISON:      MaisonCard,
  APPARTEMENT: AppartementCard,
  PARCELLE:    ParcelleCard,
};

function SmartCard({ p }: { p: any }) {
  const Card = CARD_MAP[p.type] ?? PropertyCard;
  return <Card p={p} />;
}

export default function PropertiesPage() {
  const [search, setSearch]           = useState("");
  const [typeFilter, setTypeFilter]   = useState("");
  const [txFilter, setTxFilter]       = useState("");
  const [provinceId, setProvinceId]   = useState("");

  const { data, isLoading } = useProperties({ type: typeFilter || undefined, provinceId: provinceId || undefined });
  const arr: any[] = Array.isArray(data) ? data : [];

  const filtered = arr.filter((p: any) => {
    const hay = `${p.description} ${p.commune} ${p.quartier} ${p.ville?.nom}`.toLowerCase();
    const matchSearch = hay.includes(search.toLowerCase());
    const matchTx     = !txFilter || p.transactionType === txFilter;
    return matchSearch && matchTx;
  });

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 text-center"
        style={{ background: "linear-gradient(135deg,#000 0%,#0a0f1e 50%,#000 100%)", borderBottom: "1px solid #1e3a5f" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 100%,rgba(37,99,235,0.18),transparent)" }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(37,99,235,0.15)", border: "1px solid rgba(37,99,235,0.4)", boxShadow: "0 0 28px rgba(37,99,235,0.3)" }}>
              <LayoutGrid size={26} style={{ color: "#3b82f6" }} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">Parcourir les annonces</h1>
          <p className="text-sm" style={{ color: "#6b7fa3" }}>Maisons, appartements, parcelles et bureaux à travers la RDC</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Barre de recherche + province */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-4"
            style={{ background: "#0d1526", border: "1px solid #1e3a5f" }}>
            <Search size={15} style={{ color: "#6b7fa3" }} />
            <input type="text" placeholder="Quartier, commune, description..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="flex-1 py-3 outline-none text-sm bg-transparent" style={{ color: "#f0f4ff" }} />
          </div>
          <ProvinceSelector value={provinceId} onChange={setProvinceId} className="sm:w-56" />
        </div>

        {/* Tabs type */}
        <div className="flex flex-wrap gap-2 mb-3">
          {TYPES.map(t => {
            const active = typeFilter === t.value;
            return (
              <button key={t.value} onClick={() => setTypeFilter(t.value)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all"
                style={{
                  background: active ? "#2563eb" : "#0d1526",
                  color:      active ? "#fff"    : "#6b7fa3",
                  border:     `1px solid ${active ? "#3b82f6" : "#1e3a5f"}`,
                  boxShadow:  active ? "0 0 16px rgba(37,99,235,0.35)" : "none",
                }}>
                {t.icon}{t.label}
              </button>
            );
          })}
        </div>

        {/* Tabs transaction */}
        <div className="flex gap-2 mb-5">
          {TRANSACTIONS.map(t => {
            const active = txFilter === t.value;
            return (
              <button key={t.value} onClick={() => setTxFilter(t.value)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={{
                  background: active ? "rgba(37,99,235,0.2)" : "transparent",
                  color:      active ? "#3b82f6" : "#6b7fa3",
                  border:     `1px solid ${active ? "#3b82f6" : "#1e3a5f"}`,
                }}>
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Compteur */}
        <p className="text-xs mb-5 flex items-center gap-1.5" style={{ color: "#6b7fa3" }}>
          {isLoading
            ? <><Loader2 size={13} className="animate-spin" />Chargement...</>
            : <><span className="font-bold text-sm" style={{ color: "#3b82f6" }}>{filtered.length}</span> annonce(s) trouvée(s)</>
          }
        </p>

        {/* Grille */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: "#0d1526", height: 300 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "#0d1526", border: "1px solid #1e3a5f" }}>
              <LayoutGrid size={32} style={{ color: "#1e3a5f" }} />
            </div>
            <p className="font-semibold" style={{ color: "#6b7fa3" }}>Aucune annonce trouvée.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((p: any) => <SmartCard key={p.id} p={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
