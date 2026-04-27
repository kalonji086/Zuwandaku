"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Données collectées",
    text: "Lors de votre utilisation de ZUWAndaku, nous collectons les données suivantes :",
    items: [
      "Nom complet et adresse email (lors de l'inscription)",
      "Numéro de téléphone (optionnel)",
      "Numéro CNI (pour les propriétaires)",
      "Données de navigation (pages visitées, durée de session)",
      "Adresse IP et type de navigateur",
    ],
  },
  {
    title: "2. Utilisation des données",
    text: "Vos données sont utilisées pour :",
    items: [
      "Gérer votre compte et vos annonces",
      "Vous contacter en cas de besoin",
      "Améliorer nos services",
      "Prévenir les fraudes et abus",
      "Respecter nos obligations légales",
    ],
  },
  {
    title: "3. Partage des données",
    text: "Nous ne vendons jamais vos données personnelles. Elles peuvent être partagées uniquement avec nos prestataires techniques (hébergement, paiement) dans le strict cadre de l'exécution de nos services, et avec les autorités compétentes si la loi l'exige.",
    items: null,
  },
  {
    title: "4. Conservation des données",
    text: "Vos données sont conservées pendant toute la durée de votre compte actif, puis pendant 3 ans après sa suppression, conformément aux obligations légales congolaises.",
    items: null,
  },
  {
    title: "5. Vos droits",
    text: "Conformément à la loi, vous disposez des droits suivants :",
    items: [
      "Droit d'accès à vos données",
      "Droit de rectification",
      "Droit à l'effacement (droit à l'oubli)",
      "Droit à la portabilité",
      "Droit d'opposition au traitement",
    ],
    footer: "Pour exercer ces droits, contactez-nous à : privacy@zuwandaku.cd",
  },
  {
    title: "6. Cookies",
    text: "Nous utilisons des cookies techniques nécessaires au fonctionnement du site et des cookies analytiques pour améliorer votre expérience.",
    items: null,
    link: { href: "/parametres-confidentialite", label: "Gérer mes paramètres de confidentialité" },
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--sl-bg)", color: "var(--sl-text)" }}>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--sl-surface)", borderBottom: "1px solid var(--sl-border)" }}>
          <div className="flex justify-center mb-3" style={{ color: "var(--sl-blue-2)" }}><ShieldCheck size={48} /></div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--sl-text)" }}>Politique de Confidentialité</h1>
          <p style={{ color: "var(--sl-muted)" }}>Dernière mise à jour : janvier 2025</p>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
          {SECTIONS.map((s) => (
            <div key={s.title} className="sl-card">
              <h2 className="text-lg font-bold mb-4 pb-3" style={{ color: "var(--sl-text)", borderBottom: "1px solid var(--sl-border)" }}>{s.title}</h2>
              <p className="mb-3" style={{ color: "var(--sl-muted)" }}>{s.text}</p>
              {s.items && (
                <ul className="space-y-1.5 mb-3">
                  {s.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: "var(--sl-muted)" }}>
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--sl-blue)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {"footer" in s && s.footer && (
                <p className="text-sm mt-2" style={{ color: "var(--sl-muted)" }}>
                  {s.footer.split("privacy@zuwandaku.cd")[0]}
                  <span style={{ color: "var(--sl-blue-2)" }}>privacy@zuwandaku.cd</span>
                </p>
              )}
              {"link" in s && s.link && (
                <Link href={s.link.href} className="inline-flex items-center gap-1 text-sm transition-colors hover:text-white" style={{ color: "var(--sl-blue-2)" }}>
                  {s.link.label} →
                </Link>
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
