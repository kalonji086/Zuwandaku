"use client";
import { useState } from "react";
import Image from "next/image";
import { X, Phone, Mail, MessageSquare, User, Send, CheckCircle, Home, Building2, Landmark, Car, MapPin, Tag, KeyRound } from "lucide-react";

const SL = {
  bg:     "#0d1526",
  deep:   "#060d1a",
  border: "#1e3a5f",
  blue:   "#2563eb",
  blue2:  "#3b82f6",
  muted:  "#6b7fa3",
  text:   "#f0f4ff",
  green:  "#10b981",
  purple: "#8b5cf6",
};

type Item = { _kind: "property" | "vehicle" } & Record<string, any>;

interface Props {
  isOpen: boolean;
  item: Item | null;
  onClose: () => void;
}

const SUBJECTS = [
  "Je souhaite visiter ce bien",
  "Demande d'informations",
  "Négociation du prix",
  "Disponibilité immédiate",
  "Autre demande",
];

export default function ContactModal({ isOpen, item, onClose }: Props) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  if (!isOpen || !item) return null;

  const isVehicle = item._kind === "vehicle";
  const accent    = isVehicle ? SL.purple : (item.type === "PARCELLE" ? SL.green : SL.blue2);
  const isLocation = isVehicle ? item.type === "LOCATION" : (item.transactionType === "LOCATION" || !item.transactionType);

  const title = isVehicle
    ? `${item.marque} ${item.modele} ${item.annee}`
    : item.description || `${item.type} à ${item.commune || "Kinshasa"}`;

  const price = isVehicle
    ? (isLocation ? `$${item.pricePerDay?.toLocaleString("fr-FR")}/jour` : `$${item.priceSale?.toLocaleString("fr-FR")}`)
    : `$${item.price?.toLocaleString("fr-FR")}${isLocation ? "/mois" : ""}`;

  const typeIcon = isVehicle ? <Car size={14} /> : item.type === "APPARTEMENT" ? <Building2 size={14} /> : item.type === "PARCELLE" ? <Landmark size={14} /> : <Home size={14} />;

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  const handleClose = () => {
    setSent(false);
    setForm({ name: "", phone: "", email: "", subject: SUBJECTS[0], message: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(8px)" }}
      onClick={e => e.target === e.currentTarget && handleClose()}>

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-2xl"
        style={{ background: SL.bg, border: `1px solid ${SL.border}`, boxShadow: `0 0 80px ${accent}15, 0 32px 64px rgba(0,0,0,0.8)` }}>

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b"
          style={{ background: SL.bg, borderColor: SL.border }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: `${accent}20`, border: `1px solid ${accent}40` }}>
              <MessageSquare size={15} style={{ color: accent }} />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Contacter le vendeur</p>
              <p className="text-xs" style={{ color: SL.muted }}>Réponse sous 24h</p>
            </div>
          </div>
          <button onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ border: `1px solid ${SL.border}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.1)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.borderColor = SL.border; }}>
            <X size={15} style={{ color: SL.muted }} />
          </button>
        </div>

        {/* ── Récap bien ── */}
        <div className="mx-5 mt-5 p-4 rounded-xl flex items-center gap-3"
          style={{ background: `${accent}0a`, border: `1px solid ${accent}25` }}>
          {/* Miniature ou logo */}
          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 flex items-center justify-center"
            style={{ background: SL.deep, border: `1px solid ${SL.border}` }}>
            {item.photos?.[0]
              ? <img src={item.photos[0]} alt={title} className="w-full h-full object-cover" />
              : <Image src="/logo.png" alt="ZUWAndaku" width={32} height={32} className="rounded-lg opacity-80" />
            }
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs mb-0.5" style={{ color: SL.muted }}>
              <span style={{ color: accent }}>{typeIcon}</span>
              <span>{isLocation ? "Location" : "Vente"}</span>
              {!isVehicle && item.commune && <><span>·</span><MapPin size={10} /><span>{item.commune}</span></>}
            </div>
            <p className="font-semibold text-white text-sm truncate">{title}</p>
            <p className="text-sm font-bold mt-0.5" style={{ color: accent }}>{price}</p>
          </div>
          <span className="text-xs font-mono px-2 py-1 rounded-lg shrink-0"
            style={{ background: `${SL.border}`, color: SL.muted }}>
            #{item.id}
          </span>
        </div>

        {/* ── Succès ── */}
        {sent ? (
          <div className="px-5 py-10 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${SL.green}18`, border: `1px solid ${SL.green}40`, boxShadow: `0 0 24px ${SL.green}25` }}>
              <CheckCircle size={28} style={{ color: SL.green }} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Message envoyé !</h3>
              <p className="text-sm" style={{ color: SL.muted }}>
                Le vendeur recevra votre message et vous contactera sous 24h.
              </p>
            </div>

            <button type="button" onClick={handleClose}
              className="mt-2 px-8 py-3 rounded-xl font-bold text-white text-sm cursor-pointer"
              style={{ background: `linear-gradient(135deg,${SL.blue},${accent})`, boxShadow: `0 0 20px ${accent}30` }}>
              Fermer
            </button>

          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">

            {/* Nom + Téléphone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: SL.muted }}>
                  <User size={11} />Nom *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  placeholder="Votre nom"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: SL.deep, border: `1px solid ${SL.border}`, color: SL.text }}
                  onFocus={e => (e.currentTarget.style.borderColor = accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = SL.border)}
                />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: SL.muted }}>
                  <Phone size={11} />Téléphone *
                </label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={e => set("phone", e.target.value)}
                  placeholder="+243 99 000 0000"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: SL.deep, border: `1px solid ${SL.border}`, color: SL.text }}
                  onFocus={e => (e.currentTarget.style.borderColor = accent)}
                  onBlur={e => (e.currentTarget.style.borderColor = SL.border)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: SL.muted }}>
                <Mail size={11} />Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set("email", e.target.value)}
                placeholder="votre@email.com"
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: SL.deep, border: `1px solid ${SL.border}`, color: SL.text }}
                onFocus={e => (e.currentTarget.style.borderColor = accent)}
                onBlur={e => (e.currentTarget.style.borderColor = SL.border)}
              />
            </div>

            {/* Sujet */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: SL.muted }}>
                <Tag size={11} />Objet
              </label>
              <div className="flex flex-wrap gap-2">
                {SUBJECTS.map(s => (
                  <button key={s} type="button" onClick={() => set("subject", s)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: form.subject === s ? `${accent}20` : SL.deep,
                      border: `1px solid ${form.subject === s ? accent : SL.border}`,
                      color: form.subject === s ? "#fff" : SL.muted,
                      boxShadow: form.subject === s ? `0 0 10px ${accent}25` : "none",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: SL.muted }}>
                <MessageSquare size={11} />Message *
              </label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={e => set("message", e.target.value)}
                placeholder={`Bonjour, je suis intéressé(e) par ${isVehicle ? `le ${item.marque} ${item.modele}` : "ce bien"}. Pouvez-vous me donner plus d'informations ?`}
                className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none transition-all"
                style={{ background: SL.deep, border: `1px solid ${SL.border}`, color: SL.text }}
                onFocus={e => (e.currentTarget.style.borderColor = accent)}
                onBlur={e => (e.currentTarget.style.borderColor = SL.border)}
              />
            </div>

            {/* Canaux directs */}
            <div className="flex gap-2 pt-1">
              <a href="tel:+243999999999"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: SL.green }}>
                <Phone size={14} />Appeler
              </a>
              <a href="https://wa.me/243999999999" target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.3)", color: "#25d366" }}>
                <MessageSquare size={14} />WhatsApp
              </a>
            </div>

            {/* Submit */}
            <button type="submit" disabled={sending}
              className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: sending ? `${accent}60` : `linear-gradient(135deg,${SL.blue},${accent})`,
                boxShadow: sending ? "none" : `0 0 24px ${accent}30`,
                cursor: sending ? "not-allowed" : "pointer",
              }}>
              {sending ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Envoi en cours...</>
              ) : (
                <><Send size={15} />Envoyer le message</>
              )}
            </button>

            <p className="text-center text-xs" style={{ color: SL.muted }}>
              Vos données sont protégées et ne seront jamais partagées.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
