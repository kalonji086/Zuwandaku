"use client";

import { useState } from "react";
import { Home, DollarSign } from "lucide-react";
import ListingLayout from "../components/ListingLayout";
import MaisonCard from "../components/MaisonCard";
import { useProperties } from "../../lib/hooks";

export default function MaisonsPage() {
  const [search, setSearch] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading } = useProperties({ type: "MAISON", provinceId: provinceId || undefined });
  const arr: any[] = Array.isArray(data) ? data : [];

  const filtered = arr.filter(p => {
    const hay = `${p.description} ${p.commune} ${p.quartier} ${p.ville?.nom}`.toLowerCase();
    const matchSearch = hay.includes(search.toLowerCase());
    const matchPrice  = !maxPrice || p.price <= Number(maxPrice);
    return matchSearch && matchPrice;
  });

  const extraFilters = (
    <div className="flex items-center gap-2 rounded-xl px-4"
      style={{ background: "#0d1526", border: "1px solid #1e3a5f", minWidth: 160 }}>
      <DollarSign size={13} style={{ color: "#6b7fa3" }} />
      <input type="number" placeholder="Prix max" value={maxPrice}
        onChange={e => setMaxPrice(e.target.value)}
        className="w-28 py-3 outline-none text-sm bg-transparent" style={{ color: "#f0f4ff" }} />
    </div>
  );

  return (
    <ListingLayout
      icon={<Home size={26} />}
      title="Maisons"
      subtitle="Trouvez la maison de vos rêves en RDC"
      accent="#2563eb"
      search={search} onSearch={setSearch}
      provinceId={provinceId} onProvince={setProvinceId}
      extraFilters={extraFilters}
      count={filtered.length}
      label=" maison(s) trouvée(s)"
      loading={isLoading}
      emptyIcon={<Home size={32} />}
      emptyText="Aucune maison trouvée."
    >
      {filtered.map(p => <MaisonCard key={p.id} p={p} />)}
    </ListingLayout>
  );
}
