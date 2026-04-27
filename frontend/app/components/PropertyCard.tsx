"use client";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Maximize2, BedDouble, Bath, Home, Building2, Landmark, LayoutGrid, Tag, Eye, Phone, Heart, LogIn } from "lucide-react";
import ViewModal from "./ViewModal";
import ContactModal from "./ContactModal";

const SL = { bg:"#0d1526", bgDeep:"#060d1a", border:"#1e3a5f", blue:"#2563eb", blue2:"#3b82f6", muted:"#6b7fa3", text:"#f0f4ff", green:"#10b981", yellow:"#f59e0b", red:"#ef4444", purple:"#8b5cf6" };

const STATUS: Record<string,{label:string;color:string}> = {
  AVAILABLE:{label:"Disponible",color:SL.green}, RENTED:{label:"Loué",color:SL.yellow},
  SOLD:{label:"Vendu",color:SL.red}, RESERVED:{label:"Réservé",color:SL.purple},
};

const TYPE_CFG: Record<string,{label:string;icon:React.ReactNode;accent:string}> = {
  MAISON:      {label:"Maison",      icon:<Home size={14}/>,      accent:SL.blue  },
  APPARTEMENT: {label:"Appartement", icon:<Building2 size={14}/>, accent:SL.blue2 },
  PARCELLE:    {label:"Parcelle",    icon:<Landmark size={14}/>,  accent:SL.green },
  BUREAU:      {label:"Bureau",      icon:<Building2 size={14}/>, accent:SL.purple},
};

function Placeholder({ type, accent }: { type: string; accent: string }) {
  const cfg = TYPE_CFG[type] ?? { label: type, icon: <LayoutGrid size={14}/>, accent };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative overflow-hidden"
      style={{ background:`linear-gradient(135deg,${SL.bgDeep} 0%,#0a1628 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:`linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize:"32px 32px" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-14 rounded-full blur-2xl opacity-20" style={{ background:accent }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background:`${accent}18`, border:`1px solid ${accent}35`, boxShadow:`0 0 20px ${accent}20` }}>
            <Image src="/logo.png" alt="ZUWAndaku" width={32} height={32} className="rounded-xl opacity-85" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background:accent, boxShadow:`0 0 8px ${accent}60` }}>
            <span className="text-white" style={{ transform:"scale(0.75)" }}>{cfg.icon}</span>
          </div>
        </div>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color:accent }}>ZUWAndaku</p>
        <p className="text-xs" style={{ color:SL.muted }}>{cfg.label}</p>
      </div>
    </div>
  );
}

function useAuth() {
  if (typeof window === "undefined") return { user: null };
  try { return { user: JSON.parse(localStorage.getItem("user") || "null") }; }
  catch { return { user: null }; }
}

export default function PropertyCard({ p, onFavoriteToggle, isFav }: { p: any; onFavoriteToggle?: (p:any)=>void; isFav?: boolean }) {
  const [showView, setShowView]       = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [fav, setFav]                 = useState(isFav ?? false);
  const { user } = useAuth();

  // Sync avec prop externe (ex: suppression depuis FavoritesModal)
  if (fav !== (isFav ?? false) && isFav !== undefined) setFav(isFav);

  const handleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) { window.location.href = "/login"; return; }
    setFav(v => !v);
    onFavoriteToggle?.(p);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowView(true);
  };

  const handleContact = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowContact(true);
  };

  const st     = STATUS[p.status] ?? STATUS.AVAILABLE;
  const typCfg = TYPE_CFG[p.type] ?? { label:p.type||"Bien", icon:<LayoutGrid size={14}/>, accent:SL.blue };
  const isLocation = p.transactionType === "LOCATION" || !p.transactionType;
  const item = { ...p, _kind: "property" as const };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
        style={{ background:SL.bg, borderColor:SL.border, boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor=typCfg.accent; e.currentTarget.style.boxShadow=`0 8px 32px ${typCfg.accent}20`; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor=SL.border; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.5)"; }}>

        {/* Image */}
        <div className="relative overflow-hidden h-48" style={{ background:SL.bgDeep }} onClick={handleView}>
          {p.photos?.[0] ? (
            <>
              <Image src={p.photos[0]} alt={p.description||p.type} width={400} height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                quality={85} sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </>
          ) : <Placeholder type={p.type} accent={typCfg.accent} />}

          {/* Badge statut */}
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:`${st.color}20`, border:`1px solid ${st.color}50`, color:st.color, backdropFilter:"blur(6px)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:st.color }} />{st.label}
          </span>

          {/* Bouton favori */}
          <button onClick={handleFav}
            className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{ background:fav?"rgba(239,68,68,0.25)":"rgba(0,0,0,0.45)", border:`1px solid ${fav?"rgba(239,68,68,0.5)":"rgba(255,255,255,0.15)"}`, backdropFilter:"blur(6px)" }}
            title={fav ? "Retirer des favoris" : "Ajouter aux favoris"}>
            <Heart size={14} fill={fav?"#ef4444":"none"} color={fav?"#ef4444":"#fff"} />
          </button>

          {!isLocation && (
            <span className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{ background:"rgba(245,158,11,0.2)", border:"1px solid rgba(245,158,11,0.4)", color:"#fbbf24" }}>
              <Tag size={10} />Vente
            </span>
          )}

          {/* Overlay login si non connecté */}

        </div>

        {/* Contenu */}
        <div className="flex flex-col flex-1 p-4 gap-2.5">
          <div className="flex items-center gap-1.5 text-xs" style={{ color:SL.muted }}>
            <MapPin size={11} />
            <span className="truncate">{[p.commune,p.quartier,p.ville?.nom].filter(Boolean).join(", ")||"Kinshasa"}</span>
          </div>
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug" style={{ color:SL.text }}>
            {p.description || `${typCfg.label} à ${p.commune||"Kinshasa"}`}
          </h3>
          <div className="flex flex-wrap gap-1.5 text-xs" style={{ color:SL.muted }}>
            {p.surface      && <span className="flex items-center gap-1"><Maximize2 size={10}/>{p.surface} m²</span>}
            {p.chambres     && <span className="flex items-center gap-1"><BedDouble size={10}/>{p.chambres} ch.</span>}
            {p.sallesDeBain && <span className="flex items-center gap-1"><Bath size={10}/>{p.sallesDeBain} sdb</span>}
          </div>

          <div className="mt-auto pt-2.5 border-t" style={{ borderColor:SL.border }}>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-lg font-extrabold leading-none" style={{ color:typCfg.accent }}>
                  ${p.price?.toLocaleString("fr-FR")??"—"}
                </p>
                {isLocation && <p className="text-xs mt-0.5" style={{ color:SL.muted }}>/ mois</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handleView}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background:`${typCfg.accent}15`, color:typCfg.accent, border:`1px solid ${typCfg.accent}30` }}
                onMouseEnter={e=>e.currentTarget.style.background=`${typCfg.accent}28`}
                onMouseLeave={e=>e.currentTarget.style.background=`${typCfg.accent}15`}>
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
