"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { HelpCircle, ChevronDown, ChevronUp, ArrowLeft, Search } from "lucide-react";

const FAQS = [
  {
    category: "Compte",
    items: [
      { q: "Comment créer un compte sur ZUWAndaku ?", a: "Cliquez sur 'S'inscrire' en haut de la page, remplissez le formulaire avec votre nom, email et mot de passe, puis choisissez votre rôle (Client ou Propriétaire)." },
      { q: "J'ai oublié mon mot de passe, que faire ?", a: "Sur la page de connexion, cliquez sur 'Mot de passe oublié' et entrez votre email. Vous recevrez un lien de réinitialisation." },
      { q: "Puis-je changer mon rôle après inscription ?", a: "Oui, contactez notre support à support@zuwandaku.cd pour modifier votre rôle." },
    ],
  },
  {
    category: "Biens immobiliers",
    items: [
      { q: "Comment publier une annonce de bien ?", a: "Connectez-vous, allez dans votre Dashboard et cliquez sur 'Ajouter un bien'. Remplissez les informations (type, province, ville, prix, photos) et publiez." },
      { q: "Combien coûte la publication d'une annonce ?", a: "La publication est gratuite pour les 3 premières annonces. Au-delà, des forfaits sont disponibles." },
      { q: "Comment contacter le propriétaire d'un bien ?", a: "Sur la page de détail du bien, cliquez sur 'Contacter le propriétaire'. Vous devez être connecté pour envoyer un message." },
      { q: "Les biens sont-ils vérifiés ?", a: "Oui, notre équipe vérifie chaque annonce avant publication pour garantir l'authenticité des informations." },
    ],
  },
  {
    category: "Véhicules",
    items: [
      { q: "Comment louer un véhicule ?", a: "Trouvez le véhicule souhaité, vérifiez sa disponibilité et contactez le propriétaire via la plateforme pour convenir des modalités." },
      { q: "Quelle est la différence entre location et vente ?", a: "La location est un contrat temporaire avec un prix par jour. La vente est un transfert définitif de propriété." },
    ],
  },
  {
    category: "Paiements",
    items: [
      { q: "Quels modes de paiement sont acceptés ?", a: "Nous acceptons les paiements en USD et CDF via Mobile Money (M-Pesa, Airtel Money), virement bancaire et paiement en espèces." },
      { q: "ZUWAndaku prend-il une commission ?", a: "Oui, une commission de 2% est prélevée sur chaque transaction finalisée via la plateforme." },
    ],
  },
  {
    category: "Sécurité",
    items: [
      { q: "Comment signaler une annonce frauduleuse ?", a: "Sur la page de l'annonce, cliquez sur 'Signaler' et décrivez le problème. Notre équipe traitera votre signalement sous 24h." },
      { q: "Mes données personnelles sont-elles sécurisées ?", a: "Oui, toutes vos données sont chiffrées et stockées de manière sécurisée. Consultez notre politique de confidentialité pour plus de détails." },
    ],
  },
];

export default function FAQPage() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = FAQS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(search.toLowerCase()) ||
        item.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--sl-bg)", color: "var(--sl-text)" }}>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--sl-surface)", borderBottom: "1px solid var(--sl-border)" }}>
          <div className="flex justify-center mb-3" style={{ color: "var(--sl-blue-2)" }}><HelpCircle size={48} /></div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--sl-text)" }}>Questions Fréquentes</h1>
          <p style={{ color: "var(--sl-muted)" }}>Trouvez rapidement les réponses à vos questions</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-10">
          {/* Search */}
          <div className="flex items-center gap-2 rounded-xl px-4 mb-10" style={{ background: "var(--sl-card)", border: "1px solid var(--sl-border)" }}>
            <Search size={18} style={{ color: "var(--sl-muted)" }} />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 py-3 outline-none bg-transparent"
              style={{ color: "var(--sl-text)" }}
            />
          </div>

          {filtered.length === 0 ? (
            <p className="text-center py-10" style={{ color: "var(--sl-muted)" }}>Aucune question trouvée.</p>
          ) : (
            filtered.map((cat) => (
              <div key={cat.category} className="mb-8">
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: "var(--sl-text)" }}>
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: "var(--sl-blue)" }} />
                  {cat.category}
                </h2>
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--sl-border)" }}>
                  {cat.items.map((item, i) => {
                    const key = `${cat.category}-${i}`;
                    const isOpen = openItem === key;
                    return (
                      <div key={key} style={i < cat.items.length - 1 ? { borderBottom: "1px solid var(--sl-border)" } : {}}>
                        <button
                          onClick={() => setOpenItem(isOpen ? null : key)}
                          className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors"
                          style={{ background: isOpen ? "var(--sl-card)" : "transparent", color: "var(--sl-text)" }}
                        >
                          <span className="font-medium pr-4">{item.q}</span>
                          {isOpen
                            ? <ChevronUp size={18} style={{ color: "var(--sl-blue-2)" }} className="shrink-0" />
                            : <ChevronDown size={18} style={{ color: "var(--sl-muted)" }} className="shrink-0" />}
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "var(--sl-muted)", background: "var(--sl-card)" }}>
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}

          {/* CTA */}
          <div className="rounded-xl p-6 text-center mt-10" style={{ background: "var(--sl-card)", border: "1px solid var(--sl-border)" }}>
            <p className="font-medium mb-4" style={{ color: "var(--sl-text)" }}>Vous n'avez pas trouvé votre réponse ?</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/support" className="sl-btn-primary">Contacter le support</Link>
              <Link href="/helpdesk" className="sl-btn-ghost">Ouvrir un ticket</Link>
            </div>
          </div>

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
