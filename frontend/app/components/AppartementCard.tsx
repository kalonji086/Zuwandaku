"use client";
import Image from "next/image";
import { useState } from "react";
import { MapPin, BedDouble, Bath, Maximize2, Building2, Tag, KeyRound, Layers, Eye, Phone } from "lucide-react";
import ViewModal from "./ViewModal";
import ContactModal from "./ContactModal";

const SL = { bg:"#0d1526", bgDeep:"#060d1a", border:"#1e3a5f", blue:"#2563eb", blue2:"#3b82f6", muted:"#6b7fa3", text:"#f0f4ff", green:"#10b981", yellow:"#f59e0b", red:"#ef4444" };
const STATUS: Record<string,{label:string;color:string}> = { AVAILABLE:{label:"Disponible",color:SL.green}, RENTED:{label:"Loué",color:SL.yellow}, SOLD:{label:"Vendu",color:SL.red}, RESERVED:{label:"Réservé",color:"#8b5cf6"} };
const ACCENT = "#3b82f6";

function Placeholder() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-2 relative overflow-hidden"
      style={{ background:`linear-gradient(135deg,${SL.bgDeep} 0%,#091525 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage:`linear-gradient(${ACCENT} 1px,transparent 1px),linear-gradient(90deg,${ACCENT} 1px,transparent 1px)`, backgroundSize:"28px 28px" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-28 h-14 rounded-full blur-2xl opacity-20" style={{ background:ACCENT }} />
      <div className="relative z-10 flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background:`${ACCENT}18`, border:`1px solid ${ACCENT}35`, boxShadow:`0 0 20px ${ACCENT}25` }}>
            <Image src="/logo.png" alt="ZUWAndaku" width={32} height={32} className="rounded-xl opacity-85" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center"
            style={{ background:ACCENT, boxShadow:`0 0 8px ${ACCENT}70` }}>
            <Building2 size={12} className="text-white" />
          </div>
        </div>
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color:ACCENT }}>ZUWAndaku</p>
        <p className="text-xs" style={{ color:SL.muted }}>Appartement</p>
      </div>
    </div>
  );
}

export default function AppartementCard({ p }: { p: any }) {
  const [showView, setShowView]       = useState(false);
  const [showContact, setShowContact] = useState(false);

  const st = STATUS[p.status] ?? STATUS.AVAILABLE;
  const isLocation = p.transactionType === "LOCATION" || !p.transactionType;
  const item = { ...p, _kind: "property" as const };

  return (
    <>
      <div className="group flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
        style={{ background:SL.bg, borderColor:SL.border, boxShadow:"0 4px 24px rgba(0,0,0,0.5)" }}
        onMouseEnter={e=>{ e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow=`0 8px 32px ${ACCENT}20`; }}
        onMouseLeave={e=>{ e.currentTarget.style.borderColor=SL.border; e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.5)"; }}>

        <div className="relative h-48 overflow-hidden" style={{ background:SL.bgDeep }} onClick={() => setShowView(true)}>
          {p.photos?.[0] ? (
            <>
              <Image src={p.photos[0]} alt={p.description||"Appartement"} width={400} height={300}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" quality={85}
                sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </>
          ) : <Placeholder />}
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:`${st.color}20`, border:`1px solid ${st.color}50`, color:st.color, backdropFilter:"blur(6px)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:st.color }} />{st.label}
          </span>
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background:`${ACCENT}25`, border:`1px solid ${ACCENT}50`, color:"#fff", backdropFilter:"blur(6px)" }}>
            {isLocation ? <><KeyRound size={10} />Location</> : <><Tag size={10} />Vente</>}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-4 gap-2.5">
          <div className="flex items-center gap-1.5 text-xs truncate" style={{ color:SL.muted }}>
            <MapPin size={11} /><span className="truncate">{[p.commune,p.quartier,p.ville?.nom].filter(Boolean).join(", ")||"Kinshasa"}</span>
          </div>
          <h3 className="font-semibold text-sm line-clamp-2 leading-snug" style={{ color:SL.text }}>
            {p.description || `Appartement à ${p.commune||"louer"}`}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {p.chambres    && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:`${ACCENT}12`, color:ACCENT, border:`1px solid ${ACCENT}25` }}><BedDouble size={10} />{p.chambres} ch.</span>}
            {p.sallesDeBain && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(139,92,246,0.1)", color:"#a78bfa", border:"1px solid rgba(139,92,246,0.25)" }}><Bath size={10} />{p.sallesDeBain} sdb</span>}
            {p.surface     && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.25)" }}><Maximize2 size={10} />{p.surface} m²</span>}
            {p.etage != null && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md" style={{ background:"rgba(245,158,11,0.1)", color:"#fbbf24", border:"1px solid rgba(245,158,11,0.25)" }}><Layers size={10} />Ét. {p.etage}</span>}
          </div>
          <div className="mt-auto pt-2.5 border-t" style={{ borderColor:SL.border }}>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p className="text-lg font-extrabold leading-none" style={{ color:ACCENT }}>${p.price?.toLocaleString("fr-FR")??"—"}</p>
                {isLocation && <p className="text-xs mt-0.5" style={{ color:SL.muted }}>/ mois</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowView(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background:`${ACCENT}15`, color:ACCENT, border:`1px solid ${ACCENT}30` }}
                onMouseEnter={e=>e.currentTarget.style.background=`${ACCENT}25`}
                onMouseLeave={e=>e.currentTarget.style.background=`${ACCENT}15`}>
                <Eye size={13} />Voir
              </button>
              <button onClick={() => setShowContact(true)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all"
                style={{ background:"rgba(16,185,129,0.1)", color:"#34d399", border:"1px solid rgba(16,185,129,0.3)" }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(16,185,129,0.2)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(16,185,129,0.1)"}>
                <Phone size={13} />Contact
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
