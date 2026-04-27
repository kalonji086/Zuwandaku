"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Éditeur du site",
    content: null,
    list: [
      ["Raison sociale", "ZUWAndaku SARL"],
      ["Siège social", "Avenue du Commerce, Commune de la Gombe, Kinshasa, RDC"],
      ["RCCM", "CD/KIN/RCCM/25-B-XXXXX"],
      ["Numéro d'identification nationale", "01-93-N12345X"],
      ["Email", "contact@zuwandaku.cd"],
      ["Téléphone", "+243 XXX XXX XXX"],
    ],
  },
  {
    title: "2. Directeur de la publication",
    content: "Le directeur de la publication est le représentant légal de ZUWAndaku SARL.",
    list: null,
  },
  {
    title: "3. Hébergement",
    content: null,
    list: [
      ["Hébergeur", "Amazon Web Services (AWS)"],
      ["Adresse", "410 Terry Ave N, Seattle, WA 98109, États-Unis"],
      ["Site", "aws.amazon.com"],
    ],
  },
  {
    title: "4. Propriété intellectuelle",
    content: "L'ensemble du contenu de ce site (textes, images, logos, icônes, données) est la propriété exclusive de ZUWAndaku SARL et est protégé par les lois congolaises et internationales relatives à la propriété intellectuelle. Toute reproduction, distribution ou utilisation sans autorisation écrite préalable est strictement interdite.",
    list: null,
  },
  {
    title: "5. Responsabilité",
    content: "ZUWAndaku SARL s'efforce de fournir des informations exactes et à jour. Cependant, nous ne pouvons garantir l'exactitude, la complétude ou l'actualité des informations diffusées sur ce site. ZUWAndaku décline toute responsabilité pour les dommages directs ou indirects résultant de l'utilisation du site.",
    list: null,
  },
  {
    title: "6. Droit applicable",
    content: "Les présentes mentions légales sont soumises au droit congolais. En cas de litige, les tribunaux compétents de Kinshasa seront seuls compétents.",
    list: null,
  },
];

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--sl-bg)", color: "var(--sl-text)" }}>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--sl-surface)", borderBottom: "1px solid var(--sl-border)" }}>
          <div className="flex justify-center mb-3" style={{ color: "var(--sl-blue-2)" }}><Scale size={48} /></div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--sl-text)" }}>Mentions Légales</h1>
          <p style={{ color: "var(--sl-muted)" }}>Dernière mise à jour : janvier 2025</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="sl-card">
              <h2 className="text-lg font-bold mb-4 pb-3" style={{ color: "var(--sl-text)", borderBottom: "1px solid var(--sl-border)" }}>{s.title}</h2>
              {s.content && <p style={{ color: "var(--sl-muted)" }}>{s.content}</p>}
              {s.list && (
                <div className="space-y-2">
                  {s.list.map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-sm">
                      <span className="font-semibold shrink-0" style={{ color: "var(--sl-text)" }}>{k} :</span>
                      <span style={{ color: "var(--sl-muted)" }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-white" style={{ color: "var(--sl-blue-2)" }}>
            <ArrowLeft size={16} />Retour à l'accueil
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
