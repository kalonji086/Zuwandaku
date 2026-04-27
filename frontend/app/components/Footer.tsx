import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--sl-surface)", borderTop: "1px solid var(--sl-border)" }} className="mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-bold text-lg tracking-wide" style={{ color: "var(--sl-text)" }}>ZUWAndaku</p>
            <p className="text-xs mt-1" style={{ color: "var(--sl-muted)" }}>Immobilier & Véhicules · Kinshasa, RDC</p>
          </div>

          <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--sl-muted)" }}>Aide</span>
              <Link href="/faq" className="transition-colors hover:text-white" style={{ color: "var(--sl-muted)" }}>FAQ</Link>
              <Link href="/support" className="transition-colors hover:text-white" style={{ color: "var(--sl-muted)" }}>Support</Link>
              <Link href="/helpdesk" className="transition-colors hover:text-white" style={{ color: "var(--sl-muted)" }}>Helpdesk</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold" style={{ color: "var(--sl-muted)" }}>Légal</span>
              <Link href="/mentions-legales" className="transition-colors hover:text-white" style={{ color: "var(--sl-muted)" }}>Mentions légales</Link>
              <Link href="/politique-confidentialite" className="transition-colors hover:text-white" style={{ color: "var(--sl-muted)" }}>Politique de confidentialité</Link>
              <Link href="/parametres-confidentialite" className="transition-colors hover:text-white" style={{ color: "var(--sl-muted)" }}>Paramètres de confidentialité</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs" style={{ borderTop: "1px solid var(--sl-border)", color: "var(--sl-muted)" }}>
          <p>© {new Date().getFullYear()} ZUWAndaku SARL. Tous droits réservés.</p>
          <p>Kinshasa · République Démocratique du Congo</p>
        </div>
      </div>
    </footer>
  );
}
