"use client";

import { MapPin, ChevronDown } from "lucide-react";
import { useProvinces } from "../../lib/hooks/useProvinces";

interface Props {
  value: string;
  onChange: (id: string) => void;
  className?: string;
}

export default function ProvinceSelector({ value, onChange, className = "" }: Props) {
  const { data: provinces, isLoading } = useProvinces();

  return (
    <div
      className={`flex items-center gap-2 rounded-xl px-4 ${className}`}
      style={{ background: "#0d1526", border: "1px solid #1e3a5f" }}
    >
      <MapPin size={15} style={{ color: "#6b7fa3", flexShrink: 0 }} />
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={isLoading}
        className="flex-1 py-3 outline-none text-sm bg-transparent appearance-none cursor-pointer"
        style={{ color: value ? "#f0f4ff" : "#6b7fa3" }}
      >
        <option value="" style={{ background: "#0d1526", color: "#6b7fa3" }}>
          {isLoading ? "Chargement..." : "Toutes les provinces"}
        </option>
        {(provinces || []).map((p: any) => (
          <option key={p.id} value={p.id} style={{ background: "#0d1526", color: "#f0f4ff" }}>
            {p.nom}{p.chefLieu ? ` — ${p.chefLieu}` : ""}
          </option>
        ))}
      </select>
      <ChevronDown size={14} style={{ color: "#6b7fa3", flexShrink: 0 }} />
    </div>
  );
}
