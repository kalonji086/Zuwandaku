"use client";
import {
  X, Heart, MapPin, Trash2, Eye, Car, Building2, Landmark, Home,
  KeyRound, Tag, Sparkles,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const SL = {
  bg:     "#0d1526",
  deep:   "#060d1a",
  border: "#1e3a5f",
  blue:   "#2563eb",
  blue2:  "#3b82f6",
  muted:  "#6b7fa3",
  text:   "#f0f4ff",
  green:  "#10b981",
  yellow: "#f59e0b",
  red:    "#ef4444",
  purple: "#8b5cf6",
};

const LS_IDS   = "zuwandaku_favorites";
const LS_ITEMS = "zuwandaku_favorites_items";

function loadItems(): any[] {
  try { return JSON.parse(localStorage.getItem(LS_ITEMS) ?? "[]"); } catch { return []; }
}

function removeFromStorage(id: string) {
  try {
    const ids: string[] = JSON.parse(localStorage.getItem(LS_IDS) ?? "[]");
    const items: any[]  = JSON.parse(localStorage.getItem(LS_ITEMS) ?? "[]");
    localStorage.setItem(LS_IDS,   JSON.stringify(ids.filter(x => x !== id)));
    localStorage.setItem(LS_ITEMS, JSON.stringify(items.filter(x => x.id !== id)));
    window.dispatchEvent(new Event("zuwandaku_favorites_changed"));
  } catch {}
}

function typeAccent(item: any) {
  if (item._kind === "vehicle") return SL.purple;
  if (item.type === "PARCELLE") return SL.green;
  return SL.blue2;
}

function TypeIcon({ item, size = 14 }: { item: any; size?: number }) {
  if (item._kind === "vehicle")    return <Car size={size} />;
  if (item.type === "APPARTEMENT") return <Building2 size={size} />;
  if (item.type === "PARCELLE")    return <Landmark size={size} />;
  return <Home size={size} />;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onView: (item: any) => void;
}

export default function FavoritesModal({ isOpen, onClose, onView }: Props) {
  const [items, setItems] = useState<any[]>([]);

  const refresh = useCallback(() => setItems(loadItems()), []);

  /* Charge à l'ouverture + écoute les changements depuis ViewModal */
  useEffect(() => {
    if (!isOpen) return;
    refresh();
    window.addEventListener("zuwandaku_favorites_changed", refresh);
    return () => window.removeEventListener("zuwandaku_favorites_changed", refresh);
  }, [isOpen, refresh]);

  const remove = (id: string) => {
    removeFromStorage(id);
    setItems(prev => prev.filter(x => x.id !== id));
  };

  const clearAll = () => {
    localStorage.setItem(LS_IDS,   "[]");
    localStorage.setItem(LS_ITEMS, "[]");
    window.dispatchEvent(new Event("zuwandaku_favorites_changed"));
    setItems([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(10px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="w-full max-w-xl max-h-[88vh] flex flex-col rounded-2xl overflow-hidden"
        style={{
          background: SL.bg,
          border: `1px solid ${SL.border}`,
          boxShadow: `0 0 0 1px ${SL.border}, 0 0 80px rgba(239,68,68,0.08), 0 32px 64px rgba(0,0,0,0.85)`,
        }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0"
          style={{ borderColor: SL.border, background: `linear-gradient(180deg,${SL.deep} 0%,${SL.bg} 100%)` }}>
          <div className="flex items-center gap-3">
            {/* Icône animée */}
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", boxShadow: "0 0 20px rgba(239,68,68,0.12)" }}>
              <Heart size={18} style={{ color: SL.red, fill: SL.red }} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
                  style={{ background: SL.red, color: "#fff", boxShadow: `0 0 8px ${SL.red}60` }}>
                  {items.length > 9 ? "9+" : items.length}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Mes Favoris</h2>
              <p className="text-xs uppercase tracking-widest" style={{ color: SL.muted }}>
                {items.length === 0
                  ? "Aucun bien sauvegardé"
                  : `${items.length} bien${items.length > 1 ? "s" : ""} sauvegardé${items.length > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button onClick={clearAll}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: SL.red }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}>
                Tout effacer
              </button>
            )}
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "transparent", border: `1px solid ${SL.border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = SL.border; }}>
              <X size={15} style={{ color: SL.muted }} />
            </button>
          </div>
        </div>

        {/* ── Liste ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center select-none">
              {/* Illustration vide */}
              <div className="relative mb-5">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.12)" }}>
                  <Heart size={32} style={{ color: "rgba(239,68,68,0.25)" }} />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ background: SL.deep, border: `1px solid ${SL.border}` }}>
                  <Sparkles size={12} style={{ color: SL.muted }} />
                </div>
              </div>
              <p className="text-sm font-semibold text-white mb-1">Aucun favori pour l'instant</p>
              <p className="text-xs max-w-[220px] leading-relaxed" style={{ color: SL.muted }}>
                Cliquez sur <Heart size={10} className="inline" style={{ color: SL.red }} /> dans un bien ou véhicule pour le sauvegarder ici
              </p>
            </div>
          ) : (
            items.map(item => {
              const accent    = typeAccent(item);
              const isVehicle = item._kind === "vehicle";
              const isLoc     = isVehicle ? item.type === "LOCATION" : (item.transactionType === "LOCATION" || !item.transactionType);
              const label     = isVehicle ? `${item.marque} ${item.modele}` : (item.description || item.type);
              const sub       = isVehicle ? item.annee : [item.commune, item.quartier].filter(Boolean).join(", ");
              const price     = isVehicle
                ? (isLoc ? `$${item.pricePerDay?.toLocaleString("fr-FR")}/j` : `$${item.priceSale?.toLocaleString("fr-FR")}`)
                : `$${item.price?.toLocaleString("fr-FR")}${isLoc ? "/mois" : ""}`;

              return (
                <div key={item.id}
                  className="flex gap-3 rounded-xl p-3.5 transition-all group cursor-default"
                  style={{ background: SL.deep, border: `1px solid ${SL.border}` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${accent}45`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = SL.border)}>

                  {/* Thumbnail */}
                  <div className="w-[68px] h-[68px] rounded-xl overflow-hidden shrink-0 relative"
                    style={{ border: `1px solid ${SL.border}` }}>
                    {item.photos?.[0]
                      ? <img src={item.photos[0]} alt={label} className="w-full h-full object-cover" />
                      : (
                        <div className="w-full h-full flex items-center justify-center"
                          style={{ background: `${accent}10` }}>
                          <span style={{ color: accent }}><TypeIcon item={item} size={22} /></span>
                        </div>
                      )
                    }
                    {/* Badge type transaction */}
                    <span className="absolute bottom-1 left-1 flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{ background: `${accent}cc`, color: "#fff" }}>
                      {isLoc ? <KeyRound size={7} /> : <Tag size={7} />}
                      {isLoc ? "Loc" : "Vente"}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span style={{ color: accent }}><TypeIcon item={item} /></span>
                        <p className="text-white font-semibold text-sm truncate leading-tight">{label}</p>
                      </div>
                      {sub && (
                        <div className="flex items-center gap-1 text-xs" style={{ color: SL.muted }}>
                          <MapPin size={10} />{sub}
                        </div>
                      )}
                    </div>
                    <p className="text-base font-black mt-1" style={{ color: accent }}>{price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 shrink-0 justify-center">
                    <button
                      onClick={() => { onView(item); onClose(); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}
                      title="Voir les détails"
                      onMouseEnter={e => (e.currentTarget.style.background = `${accent}25`)}
                      onMouseLeave={e => (e.currentTarget.style.background = `${accent}12`)}>
                      <Eye size={13} style={{ color: accent }} />
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "transparent", border: `1px solid ${SL.border}` }}
                      title="Retirer des favoris"
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = SL.border; }}>
                      <Trash2 size={13} style={{ color: SL.muted }} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        {items.length > 0 && (
          <div className="flex items-center justify-between px-5 py-4 border-t shrink-0"
            style={{ borderColor: SL.border, background: `linear-gradient(0deg,${SL.deep} 0%,${SL.bg} 100%)` }}>
            <p className="text-xs" style={{ color: SL.muted }}>
              {items.length} bien{items.length > 1 ? "s" : ""} sauvegardé{items.length > 1 ? "s" : ""}
            </p>
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all"
              style={{ background: `linear-gradient(135deg,${SL.blue},${SL.blue2})`, boxShadow: `0 0 20px ${SL.blue}30` }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 32px ${SL.blue}50`)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 20px ${SL.blue}30`)}>
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
