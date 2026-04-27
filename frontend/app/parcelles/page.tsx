"use client";

import { useState } from "react";
import { Landmark, Maximize2 } from "lucide-react";
import ListingLayout from "../components/ListingLayout";
import ParcelleCard from "../components/ParcelleCard";
import { useProperties } from "../../lib/hooks";

export default function ParcellesPage() {
  const [search, setSearch] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [minSurface, setMinSurface] = useState("");

  const { data, isLoading } = useProperties({ type: "PARCELLE", provinceId: provinceId || undefined });
  const arr: any[] = Array.isArray(data) ? data : [];

  const filtered = arr.filter(p => {
    const hay = `${p.description} ${p.commune} ${p.quartier} ${p.ville?.nom}`.toLowerCase();
    const matchSearch  = hay.includes(search.toLowerCase());
    const matchSurface = !minSurface || (p.surface && p.surface >= Number(minSurface));
    return matchSearch && matchSurface;
  });

  const extraFilters = (
    <div className="flex items-center gap-2 rounded-xl px-4"
      style={{ background: "#0d1526", border: "1px solid #1e3a5f", minWidth: 180 }}>
      <Maximize2 size={13} style={{ color: "#6b7fa3" }} />
      <input type="number" placeholder="Surface min (m²)" value={minSurface}
        onChange={e => setMinSurface(e.target.value)}
        className="w-36 py-3 outline-none text-sm bg-transparent" style={{ color: "#f0f4ff" }} />
    </div>
  );

  return (
    <ListingLayout
      icon={<Landmark size={26} />}
      title="Parcelles"
      subtitle="Terrains et parcelles disponibles à travers la RDC"
      accent="#10b981"
      search={search} onSearch={setSearch}
      provinceId={provinceId} onProvince={setProvinceId}
      extraFilters={extraFilters}
      count={filtered.length}
      label=" parcelle(s) trouvée(s)"
      loading={isLoading}
      emptyIcon={<Landmark size={32} />}
      emptyText="Aucune parcelle trouvée."
    >
      {filtered.map(p => <ParcelleCard key={p.id} p={p} />)}
    </ListingLayout>
  );
}
