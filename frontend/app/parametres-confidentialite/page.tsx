"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Settings, ArrowLeft, Save, CheckCircle } from "lucide-react";

const SETTINGS = [
  { id: "analytics",      title: "Cookies analytiques",              desc: "Nous permettent de comprendre comment vous utilisez le site pour l'améliorer.", default: true },
  { id: "marketing",      title: "Cookies marketing",                desc: "Utilisés pour vous proposer des annonces personnalisées selon vos préférences.", default: false },
  { id: "notifications",  title: "Notifications par email",          desc: "Recevoir des alertes pour les nouvelles annonces correspondant à vos critères.", default: true },
  { id: "profile_visible",title: "Profil visible publiquement",      desc: "Votre nom et numéro de téléphone sont visibles par les autres utilisateurs.", default: true },
  { id: "data_sharing",   title: "Partage de données avec partenaires", desc: "Autoriser le partage de données anonymisées avec nos partenaires de confiance.", default: false },
];

export default function ParametresConfidentialitePage() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>(
    Object.fromEntries(SETTINGS.map((s) => [s.id, s.default]))
  );
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setPrefs((p) => ({ ...p, [id]: !p[id] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--sl-bg)", color: "var(--sl-text)" }}>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--sl-surface)", borderBottom: "1px solid var(--sl-border)" }}>
          <div className="flex justify-center mb-3" style={{ color: "var(--sl-blue-2)" }}><Settings size={48} /></div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--sl-text)" }}>Paramètres de Confidentialité</h1>
          <p style={{ color: "var(--sl-muted)" }}>Gérez vos préférences de confidentialité</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-12">

          {saved && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-8" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--sl-success)" }}>
              <CheckCircle size={18} />
              <span className="font-medium">Préférences sauvegardées avec succès !</span>
            </div>
          )}

          <div className="rounded-xl overflow-hidden mb-8" style={{ border: "1px solid var(--sl-border)" }}>
            {SETTINGS.map((s, i) => (
              <div key={s.id} className="flex items-center justify-between p-5"
                style={{
                  background: "var(--sl-card)",
                  borderBottom: i < SETTINGS.length - 1 ? "1px solid var(--sl-border)" : "none",
                }}>
                <div className="flex-1 pr-4">
                  <p className="font-semibold" style={{ color: "var(--sl-text)" }}>{s.title}</p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--sl-muted)" }}>{s.desc}</p>
                </div>
                <button
                  onClick={() => toggle(s.id)}
                  className="relative w-12 h-6 rounded-full transition-all duration-300 shrink-0"
                  style={{ background: prefs[s.id] ? "var(--sl-blue)" : "var(--sl-border)" }}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${prefs[s.id] ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleSave} className="sl-btn-primary flex-1 justify-center">
              <Save size={18} />Sauvegarder mes préférences
            </button>
            <button onClick={() => setPrefs(Object.fromEntries(SETTINGS.map((s) => [s.id, false])))} className="sl-btn-ghost flex-1 justify-center">
              Tout refuser
            </button>
          </div>

          <p className="text-sm text-center mt-6" style={{ color: "var(--sl-muted)" }}>
            En savoir plus dans notre{" "}
            <Link href="/politique-confidentialite" className="transition-colors hover:text-white" style={{ color: "var(--sl-blue-2)" }}>
              politique de confidentialité
            </Link>.
          </p>

          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-white" style={{ color: "var(--sl-blue-2)" }}>
              <ArrowLeft size={16} />Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
