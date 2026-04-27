"use client";
import Image from "next/image";
import { useState } from "react";
import { Car, Calendar, Fuel, Gauge, Settings, Tag, KeyRound, Zap, Eye, Phone, Heart, LogIn } from "lucide-react";
import ViewModal from "./ViewModal";
import ContactModal from "./ContactModal";

const SL = { bg:"#0d1526", bgDeep:"#060d1a", border:"#1e3a5f", muted:"#6b7fa3", text:"#f0f4ff", green:"#10b981", yellow:"#f59e0b", red:"#ef4444" };
const ACCENT  = "#8b5cf6";
const ACCENT2 = "#a78bfa";

function Placeholder({ marque }: { marque?: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative overflow-hidden"
      style={{ background:`linear-gradient(135deg,${SL.bgDeep} 0%,#0f0a1e 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:`linear-gradient(${ACCENT} 1px,transparent 1px),linear-gradient(90deg,${ACCENT} 1px,transparent 1px)`, backgroundSize:"30px 30px" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full blur-2xl opacity-20" style={{ background:ACCENT }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background:`${ACCENT}18`, border:`1px solid ${ACCENT}35`, boxShadow:`0 0 20px ${ACCENT}25` }}>
            <Image src="/logo.png" alt="ZUWAndaku" width={32} height={32} className="rounded-xl opacity-85" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background:ACCENT, boxShadow:`0 0 8px ${ACCENT}70` }}>
            <Car size={12} className="text-white" />
          </div>
        </div>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color:ACCENT2 }}>ZUWAndaku</p>
        <p className="text-xs" style={{ color:SL.muted }}>{marque || "Véhicule"}</p>
      </div>
    </div>
  );
}

function useAuth() {
  if (typeof window === "undefined") return { user: null };
  try { return { user: JSON.parse(localStorage.getItem("user") || "null") }; }
  catch { return { user: null }; }
}

export default function VehicleCard({ v, onFavoriteToggle, isFav }: { v: any; onFavoriteToggle?: (v:any)=>void; isFav?: boolean }) {
  const [showView, setShowView]       = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [fav, setFav]                 = useState(isFav ?? false);
  const { user } = useAuth();

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { window.location.href = "/login"; return; }
    setFav(f => !f);
    onFavoriteToggle?.(v);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowView(true);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContact(true);
  };

  const isLocation = v.type === "LOCATION";
  const available  = v.availability !== false;
  const item = { ...v, _kind: "vehicle" as const };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
        style={{ background:SL.bg, borderColor:SL.border, boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow=`0 8px 32px ${ACCENT}20`; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor=SL.border; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.5)"; }}>

        <div className="relative h-48 overflow-hidden" style={{ background:SL.bgDeep }} onClick={handleView}>
          {v.photos?.[0] ? (
            <>
              <img src={v.photos[0]} alt={`${v.marque} ${v.modele}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="text-white font-bold text-sm drop-shadow">{v.marque} {v.modele}</span>
              </div>
            </>
          ) : <Placeholder marque={v.marque} />}

          {/* Badge dispo */}
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:available?"rgba(16,185,129,0.2)":"rgba(239,68,68,0.2)", border:`1px solid ${available?"rgba(16,185,129,0.5)":"rgba(239,68,68,0.5)"}`, color:available?SL.green:SL.red, backdropFilter:"blur(6px)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:available?SL.green:SL.red }} />
            {available ? "Disponible" : "Indisponible"}
          </span>

          {/* Bouton favori */}
          <button onClick={handleFav}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background:fav?"rgba(239,68,68,0.25)":"rgba(0,0,0,0.45)", border:`1px solid ${fav?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.15)"}`, backdropFilter:"blur(6px)" }}
            title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <Heart size={14} fill={fav?"#ef4444":"none"} color={fav?"#ef4444":"#fff"} />
          </button>

          {/* Overlay login si non connecté */}

        </div>

        <div className="flex flex-col flex-1 p-4 gap-2.5">
          {!v.photos?.[0] && <h3 className="font-bold text-base" style={{ color:SL.text }}>{v.marque} {v.modele}</h3>}
          <div className="flex flex-wrap gap-1.5">
            {v.annee        && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:`${ACCENT}12`, color:ACCENT2, border:`1px solid ${ACCENT}25` }}><Calendar size={10}/>{v.annee}</span>}
            {v.carburant    && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.25)" }}><Fuel size={10}/>{v.carburant}</span>}
            {v.kilometrage  && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(245,158,11,0.1)", color:"#fbbf24", border:"1px solid rgba(245,158,11,0.25)" }}><Gauge size={10}/>{v.kilometrage.toLocaleString("fr-FR")} km</span>}
            {v.transmission && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(37,99,235,0.1)", color:"#60a5fa", border:"1px solid rgba(37,99,235,0.25)" }}><Settings size={10}/>{v.transmission}</span>}
            {v.electrique   && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.25)" }}><Zap size={10}/>Électrique</span>}
          </div>
          {v.description && <p className="text-xs line-clamp-1" style={{ color:SL.muted }}>{v.description}</p>}

          <div className="mt-auto pt-2.5 border-t" style={{ borderColor:SL.border }}>
            <div className="mb-2.5">
              <p className="text-lg font-extrabold leading-none" style={{ color:ACCENT2 }}>
                {isLocation ? `$${v.pricePerDay?.toLocaleString("fr-FR")??"—"}` : `$${v.priceSale?.toLocaleString("fr-FR")??"—"}`}
              </p>
              {isLocation && <p className="text-xs mt-0.5" style={{ color:SL.muted }}>/ jour</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={handleView}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background:`${ACCENT}15`, color:ACCENT2, border:`1px solid ${ACCENT}30` }}
                onMouseEnter={e=>e.currentTarget.style.background=`${ACCENT}25`}
                onMouseLeave={e=>e.currentTarget.style.background=`${ACCENT}15`}>
<Eye size={13}/>
                Voir
              </button>
              <button onClick={handleContact}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.3)" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(16,185,129,0.2)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(16,185,129,0.1)"}>
Contact
              </button>
            </div>
          </div>
        </div>
      </div>

      <ViewModal    isOpen={showView}    item={item} onClose={() => setShowView(false)}    onContact={() => { setShowView(false); setShowContact(true); }} />
      <ContactModal isOpen={showContact} item={item} onClose={() => setShowContact(false)} />
    </>
  );
}
