"use client";
import Image from "next/image";
import {
  X, MapPin, BedDouble, Bath, Maximize2, Home, Building2, Landmark, Car,
  Calendar, Fuel, Gauge, Settings, Tag, KeyRound, FileCheck, Compass,
  TreePine, Zap, Phone, Share2, Heart, ChevronLeft, ChevronRight,
  MessageCircle, Facebook, Twitter, Send, Copy, Check,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

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

const STATUS: Record<string, { label: string; color: string }> = {
  AVAILABLE: { label: "Disponible",  color: SL.green  },
  RENTED:    { label: "Loué",        color: SL.yellow },
  SOLD:      { label: "Vendu",       color: SL.red    },
  RESERVED:  { label: "Réservé",     color: SL.purple },
};

const LS_IDS   = "zuwandaku_favorites";
const LS_ITEMS = "zuwandaku_favorites_items";

/* ── Helpers localStorage ── */
function readIds(): string[]  { try { return JSON.parse(localStorage.getItem(LS_IDS)   ?? "[]"); } catch { return []; } }
function readItems(): any[]   { try { return JSON.parse(localStorage.getItem(LS_ITEMS) ?? "[]"); } catch { return []; } }

function saveToggle(item: any): boolean {
  const ids   = readIds();
  const items = readItems();
  const id    = item.id as string;
  const liked = ids.includes(id);
  const nextIds   = liked ? ids.filter(x => x !== id)   : [...ids, id];
  const nextItems = liked ? items.filter(x => x.id !== id) : [...items.filter(x => x.id !== id), item];
  localStorage.setItem(LS_IDS,   JSON.stringify(nextIds));
  localStorage.setItem(LS_ITEMS, JSON.stringify(nextItems));
  return !liked;
}

/* ── Placeholder ── */
function Placeholder({ accent, icon }: { accent: string; icon: React.ReactNode }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-3 relative"
      style={{ background: `linear-gradient(135deg,${SL.deep} 0%,#0a1628 100%)` }}>
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: `linear-gradient(${accent} 1px,transparent 1px),linear-gradient(90deg,${accent} 1px,transparent 1px)`, backgroundSize: "32px 32px" }} />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-20 rounded-full blur-3xl opacity-20"
        style={{ background: accent }} />
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{ background: `${accent}18`, border: `1px solid ${accent}35`, boxShadow: `0 0 32px ${accent}25` }}>
            <Image src="/logo.png" alt="ZUWAndaku" width={44} height={44} className="rounded-xl opacity-85" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: accent, boxShadow: `0 0 12px ${accent}70` }}>
            <span className="text-white" style={{ transform: "scale(0.75)" }}>{icon}</span>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: accent }}>ZUWAndaku</p>
          <p className="text-xs mt-0.5" style={{ color: SL.muted }}>Photo à venir</p>
        </div>
      </div>
    </div>
  );
}

/* ── Spec badge ── */
function Spec({ icon, label, color = SL.blue2, bg = `${SL.blue}15`, border = `${SL.blue}30` }: {
  icon: React.ReactNode; label: string; color?: string; bg?: string; border?: string;
}) {
  return (
    <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {icon}{label}
    </span>
  );
}

/* ── Share Panel ── */
function SharePanel({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const enc      = encodeURIComponent(url);
  const encTitle = encodeURIComponent(title);

  const links = [
    { label: "WhatsApp",    icon: <MessageCircle size={15} />, color: "#25d366", href: `https://wa.me/?text=${encTitle}%20${enc}` },
    { label: "Facebook",    icon: <Facebook size={15} />,      color: "#1877f2", href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
    { label: "Twitter / X", icon: <Twitter size={15} />,       color: "#1da1f2", href: `https://twitter.com/intent/tweet?text=${encTitle}&url=${enc}` },
    { label: "Telegram",    icon: <Send size={15} />,          color: "#2aabee", href: `https://t.me/share/url?url=${enc}&text=${encTitle}` },
  ];

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={ref}
      className="absolute right-0 top-10 z-50 rounded-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150"
      style={{ background: SL.deep, border: `1px solid ${SL.border}`, minWidth: 210 }}>
      <p className="px-4 py-2.5 text-xs font-bold uppercase tracking-widest"
        style={{ color: SL.muted, borderBottom: `1px solid ${SL.border}` }}>
        Partager via
      </p>
      {links.map(l => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
          style={{ color: SL.text }}>
          <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
            style={{ background: `${l.color}20`, color: l.color }}>
            {l.icon}
          </span>
          {l.label}
        </a>
      ))}
      <button onClick={copy}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors hover:bg-white/5"
        style={{ color: SL.text, borderTop: `1px solid ${SL.border}` }}>
        <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
          style={{ background: copied ? `${SL.green}20` : `${SL.muted}15`, color: copied ? SL.green : SL.muted }}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </span>
        {copied ? "Lien copié !" : "Copier le lien"}
      </button>
    </div>
  );
}

/* ── Types ── */
type Item = { _kind: "property" | "vehicle" } & Record<string, any>;

interface Props {
  isOpen: boolean;
  item: Item | null;
  onClose: () => void;
  onContact: () => void;
}

/* ── ViewModal ── */
export default function ViewModal({ isOpen, item, onClose, onContact }: Props) {
  const [photoIdx,   setPhotoIdx]   = useState(0);
  const [shareOpen,  setShareOpen]  = useState(false);
  const [liked,      setLiked]      = useState(false);

  /* Sync liked state when item changes */
  useEffect(() => {
    if (!item?.id) return;
    setLiked(readIds().includes(item.id));
    setPhotoIdx(0);
    setShareOpen(false);
  }, [item?.id]);

  const toggleFav = useCallback(() => {
    if (!item) return;
    const next = saveToggle(item);
    setLiked(next);
    /* Notify other tabs / components */
    window.dispatchEvent(new Event("zuwandaku_favorites_changed"));
  }, [item]);

  if (!isOpen || !item) return null;

  const isVehicle  = item._kind === "vehicle";
  const photos: string[] = item.photos?.filter(Boolean) ?? [];
  const hasPhotos  = photos.length > 0;
  const accent     = isVehicle ? SL.purple : (item.type === "PARCELLE" ? SL.green : SL.blue2);
  const st         = STATUS[item.status ?? (item.availability !== false ? "AVAILABLE" : "RENTED")] ?? STATUS.AVAILABLE;
  const isLocation = isVehicle
    ? item.type === "LOCATION"
    : (item.transactionType === "LOCATION" || !item.transactionType);

  const prevPhoto = () => setPhotoIdx(i => (i - 1 + photos.length) % photos.length);
  const nextPhoto = () => setPhotoIdx(i => (i + 1) % photos.length);

  const typeIcon  = isVehicle
    ? <Car size={18} />
    : item.type === "APPARTEMENT" ? <Building2 size={18} />
    : item.type === "PARCELLE"    ? <Landmark size={18} />
    : <Home size={18} />;

  const typeLabel = isVehicle
    ? `${item.marque} ${item.modele}`
    : (item.type ?? "Bien");

  const price = isVehicle
    ? (isLocation ? `$${item.pricePerDay?.toLocaleString("fr-FR")}/jour` : `$${item.priceSale?.toLocaleString("fr-FR")}`)
    : `$${item.price?.toLocaleString("fr-FR")}${isLocation ? " / mois" : ""}`;

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && onClose()}>

      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl flex flex-col"
        style={{ background: SL.bg, border: `1px solid ${SL.border}`, boxShadow: `0 0 80px ${accent}18, 0 32px 64px rgba(0,0,0,0.8)` }}>

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ background: SL.bg, borderColor: SL.border }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
              <span style={{ color: accent }}>{typeIcon}</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-tight">{typeLabel}</p>
              <p className="text-xs" style={{ color: SL.muted }}>
                {isVehicle
                  ? item.annee
                  : [item.commune, item.quartier].filter(Boolean).join(", ") || "Kinshasa"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Favori */}
            <button onClick={toggleFav}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{
                background: liked ? "rgba(239,68,68,0.15)" : "transparent",
                border: `1px solid ${liked ? "rgba(239,68,68,0.45)" : SL.border}`,
              }}
              title={liked ? "Retirer des favoris" : "Ajouter aux favoris"}>
              <Heart size={15} style={{ color: liked ? SL.red : SL.muted, fill: liked ? SL.red : "none", transition: "all .2s" }} />
            </button>

            {/* Partage */}
            <div className="relative">
              <button onClick={() => setShareOpen(o => !o)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                style={{
                  background: shareOpen ? `${SL.blue}20` : "transparent",
                  border: `1px solid ${shareOpen ? SL.blue : SL.border}`,
                }}>
                <Share2 size={15} style={{ color: shareOpen ? SL.blue2 : SL.muted }} />
              </button>
              {shareOpen && (
                <SharePanel url={shareUrl} title={typeLabel} onClose={() => setShareOpen(false)} />
              )}
            </div>

            <button onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
              style={{ background: "transparent", border: `1px solid ${SL.border}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = SL.border; }}>
              <X size={15} style={{ color: SL.muted }} />
            </button>
          </div>
        </div>

        {/* ── Photo ── */}
        <div className="relative h-64 sm:h-80 shrink-0" style={{ background: SL.deep }}>
          {hasPhotos ? (
            <>
              <img src={photos[photoIdx]} alt={typeLabel} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {photos.length > 1 && (
                <>
                  <button onClick={prevPhoto}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)", border: `1px solid ${SL.border}` }}>
                    <ChevronLeft size={18} className="text-white" />
                  </button>
                  <button onClick={nextPhoto}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,0,0,0.6)", border: `1px solid ${SL.border}` }}>
                    <ChevronRight size={18} className="text-white" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_, i) => (
                      <button key={i} onClick={() => setPhotoIdx(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{ background: i === photoIdx ? "#fff" : "rgba(255,255,255,0.4)" }} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <Placeholder accent={accent} icon={typeIcon} />
          )}

          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: `${st.color}22`, border: `1px solid ${st.color}55`, color: st.color, backdropFilter: "blur(6px)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: st.color }} />
            {st.label}
          </span>
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: `${accent}28`, border: `1px solid ${accent}55`, color: "#fff", backdropFilter: "blur(6px)" }}>
            {isLocation ? <><KeyRound size={10} />Location</> : <><Tag size={10} />Vente</>}
          </span>

          <div className="absolute bottom-3 left-4">
            <p className="text-2xl font-black text-white drop-shadow-lg">{price}</p>
          </div>
        </div>

        {/* ── Corps ── */}
        <div className="p-5 space-y-5">
          {!isVehicle && (
            <div>
              <div className="flex items-center gap-1.5 text-sm mb-1" style={{ color: SL.muted }}>
                <MapPin size={13} />
                <span>{[item.commune, item.quartier, item.ville?.nom].filter(Boolean).join(", ") || "Kinshasa, RDC"}</span>
              </div>
              <h2 className="text-lg font-bold text-white leading-snug">
                {item.description || `${item.type} à ${item.commune || "Kinshasa"}`}
              </h2>
            </div>
          )}

          {isVehicle && item.description && (
            <p className="text-sm" style={{ color: SL.muted }}>{item.description}</p>
          )}

          <div className="flex flex-wrap gap-2">
            {!isVehicle && item.chambres      && <Spec icon={<BedDouble size={13} />} label={`${item.chambres} chambres`} />}
            {!isVehicle && item.sallesDeBain  && <Spec icon={<Bath size={13} />} label={`${item.sallesDeBain} sdb`} color="#a78bfa" bg="rgba(139,92,246,0.1)" border="rgba(139,92,246,0.3)" />}
            {!isVehicle && item.surface       && <Spec icon={<Maximize2 size={13} />} label={`${item.surface} m²`} color="#34d399" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.3)" />}
            {!isVehicle && item.etage != null  && <Spec icon={<Building2 size={13} />} label={`Étage ${item.etage}`} color="#fbbf24" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.3)" />}
            {!isVehicle && item.parking       && <Spec icon={<Car size={13} />} label="Parking" color="#fbbf24" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.3)" />}
            {!isVehicle && item.titreFoncier  && <Spec icon={<FileCheck size={13} />} label="Titre foncier" />}
            {!isVehicle && item.viabilisee    && <Spec icon={<TreePine size={13} />} label="Viabilisée" color="#34d399" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.3)" />}
            {!isVehicle && item.orientation   && <Spec icon={<Compass size={13} />} label={item.orientation} color="#fbbf24" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.3)" />}
            {isVehicle  && item.annee         && <Spec icon={<Calendar size={13} />} label={String(item.annee)} color="#a78bfa" bg="rgba(139,92,246,0.1)" border="rgba(139,92,246,0.3)" />}
            {isVehicle  && item.carburant     && <Spec icon={<Fuel size={13} />} label={item.carburant} color="#34d399" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.3)" />}
            {isVehicle  && item.kilometrage   && <Spec icon={<Gauge size={13} />} label={`${item.kilometrage.toLocaleString("fr-FR")} km`} color="#fbbf24" bg="rgba(245,158,11,0.1)" border="rgba(245,158,11,0.3)" />}
            {isVehicle  && item.transmission  && <Spec icon={<Settings size={13} />} label={item.transmission} />}
            {isVehicle  && item.electrique    && <Spec icon={<Zap size={13} />} label="Électrique" color="#34d399" bg="rgba(16,185,129,0.1)" border="rgba(16,185,129,0.3)" />}
          </div>

          <hr style={{ borderColor: SL.border }} />

          <div className="flex items-center justify-between p-4 rounded-xl"
            style={{ background: `${accent}0a`, border: `1px solid ${accent}25` }}>
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: SL.muted }}>
                {isLocation ? "Tarif" : "Prix de vente"}
              </p>
              <p className="text-2xl font-black" style={{ color: accent }}>{price}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: SL.muted }}>Référence</p>
              <p className="text-sm font-mono font-bold text-white">#{item.id}</p>
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="sticky bottom-0 px-5 py-4 flex gap-3 border-t"
          style={{ background: SL.bg, borderColor: SL.border }}>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl font-semibold text-sm transition-all"
            style={{ background: "transparent", border: `1px solid ${SL.border}`, color: SL.muted }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = SL.blue)}
            onMouseLeave={e => (e.currentTarget.style.borderColor = SL.border)}>
            Fermer
          </button>
          <button onClick={onContact}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg,${SL.blue},${accent})`, boxShadow: `0 0 20px ${accent}30` }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 32px ${accent}50`)}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = `0 0 20px ${accent}30`)}>
            <Phone size={15} />Contacter le vendeur
          </button>
        </div>
      </div>
    </div>
  );
}
