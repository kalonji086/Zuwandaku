"use client";

import { useState } from "react";
import { Building2, DollarSign } from "lucide-react";
import ListingLayout from "../components/ListingLayout";
import AppartementCard from "../components/AppartementCard";
import { useProperties } from "../../lib/hooks";

export default function AppartementsPage() {
  const [search, setSearch] = useState("");
  const [provinceId, setProvinceId] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data, isLoading } = useProperties({ type: "APPARTEMENT", provinceId: provinceId || undefined });
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
      icon={<Building2 size={26} />}
      title="Appartements"
      subtitle="Appartements modernes à louer ou acheter en RDC"
      accent="#3b82f6"
      search={search} onSearch={setSearch}
      provinceId={provinceId} onProvince={setProvinceId}
      extraFilters={extraFilters}
      count={filtered.length}
      label=" appartement(s) trouvé(s)"
      loading={isLoading}
      emptyIcon={<Building2 size={32} />}
      emptyText="Aucun appartement trouvé."
    >
      {filtered.map(p => <AppartementCard key={p.id} p={p} />)}
    </ListingLayout>
  );
}
