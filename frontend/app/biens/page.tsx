"use client";

import { useState } from "react";
import { LayoutGrid, Home, Building2, Landmark } from "lucide-react";
import ListingLayout from "../components/ListingLayout";
import PropertyCard from "../components/PropertyCard";
import MaisonCard from "../components/MaisonCard";
import AppartementCard from "../components/AppartementCard";
import ParcelleCard from "../components/ParcelleCard";
import { useProperties } from "../../lib/hooks";

const CARD_MAP: Record<string, React.ComponentType<{ p: any }>> = {
  MAISON:      MaisonCard,
  APPARTEMENT: AppartementCard,
  PARCELLE:    ParcelleCard,
};

function SmartCard({ p }: { p: any }) {
  const Card = CARD_MAP[p.type] ?? PropertyCard;
  return <Card p={p} />;
}

const TYPES = [
  { label: "Tous",         value: "",            icon: <LayoutGrid size={14} /> },
  { label: "Maisons",      value: "MAISON",       icon: <Home size={14} /> },
  { label: "Appartements", value: "APPARTEMENT",  icon: <Building2 size={14} /> },
  { label: "Parcelles",    value: "PARCELLE",     icon: <Landmark size={14} /> },
  { label: "Bureaux",      value: "BUREAU",       icon: <Building2 size={14} /> },
];

export default function BiensPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [provinceId, setProvinceId] = useState("");

  const { data, isLoading } = useProperties({ type: typeFilter || undefined, provinceId: provinceId || undefined });
  const arr: any[] = Array.isArray(data) ? data : [];

  const filtered = arr.filter(p => {
    const hay = `${p.description} ${p.commune} ${p.quartier} ${p.ville?.nom} ${p.province?.nom}`.toLowerCase();
    return hay.includes(search.toLowerCase());
  });

  const tabs = (
    <div className="flex flex-wrap gap-2">
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
  );

  return (
    <ListingLayout
      icon={<LayoutGrid size={26} />}
      title="Tous les Biens"
      subtitle="Maisons, appartements, parcelles et bureaux à travers la RDC"
      accent="#2563eb"
      search={search} onSearch={setSearch}
      provinceId={provinceId} onProvince={setProvinceId}
      tabs={tabs}
      count={filtered.length}
      label=" bien(s) trouvé(s)"
      loading={isLoading}
      emptyIcon={<LayoutGrid size={32} />}
      emptyText="Aucun bien trouvé."
    >
      {filtered.map(p => <SmartCard key={p.id} p={p} />)}
    </ListingLayout>
  );
}
