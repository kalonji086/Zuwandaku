"use client";
import { ReactNode, Children } from "react";
import { Search, Loader2 } from "lucide-react";
import Navbar from "./Navbar";
import ProvinceSelector from "./ProvinceSelector";

interface Props {
  icon: ReactNode;
  title: string;
  subtitle: string;
  accent?: string;
  search: string;
  onSearch: (v: string) => void;
  provinceId: string;
  onProvince: (v: string) => void;
  extraFilters?: ReactNode;
  tabs?: ReactNode;
  count: number;
  label: string;
  loading: boolean;
  children: ReactNode;
  emptyIcon: ReactNode;
  emptyText: string;
}

export default function ListingLayout({
  icon, title, subtitle, accent = "#2563eb",
  search, onSearch, provinceId, onProvince,
  extraFilters, tabs, count, label, loading,
  children, emptyIcon, emptyText,
}: Props) {

  const childCount = Children.count(children);
  const isEmpty = !loading && (count === 0 || childCount === 0);

  return (
    <div className="min-h-screen" style={{ background: "#000" }}>
      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden py-14 px-4 text-center"
        style={{ background: "linear-gradient(135deg,#000 0%,#0a0f1e 50%,#000 100%)", borderBottom: "1px solid #1e3a5f" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 50% 100%,${accent}18,transparent)` }} />
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background:`${accent}20`, border:`1px solid ${accent}40`, boxShadow:`0 0 28px ${accent}30` }}>
              <span style={{ color: accent }}>{icon}</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">{title}</h1>
          <p className="text-sm" style={{ color: "#6b7fa3" }}>{subtitle}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-4"
            style={{ background: "#0d1526", border: "1px solid #1e3a5f" }}>
            <Search size={15} style={{ color: "#6b7fa3" }} />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              className="flex-1 py-3 outline-none text-sm bg-transparent"
              style={{ color: "#f0f4ff" }}
            />
          </div>
          <ProvinceSelector value={provinceId} onChange={onProvince} className="sm:w-56" />
          {extraFilters}
        </div>

        {tabs && <div className="mb-5">{tabs}</div>}

        {/* Compteur */}
        <p className="text-xs mb-5 flex items-center gap-1.5" style={{ color: "#6b7fa3" }}>
          {loading
            ? <><Loader2 size={13} className="animate-spin" />Chargement...</>
            : <><span className="font-bold text-sm" style={{ color: accent }}>{count}</span>{label}</>
          }
        </p>

        {/* Contenu */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl animate-pulse" style={{ background: "#0d1526", height: 300 }} />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: "#0d1526", border: "1px solid #1e3a5f" }}>
              <span style={{ color: "#1e3a5f", transform: "scale(1.4)" }}>{emptyIcon}</span>
            </div>
            <p className="font-semibold" style={{ color: "#6b7fa3" }}>{emptyText}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
