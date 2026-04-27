"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { HeadphonesIcon, Mail, Phone, Clock, MessageSquare, ArrowLeft, Send, CheckCircle } from "lucide-react";

export default function SupportPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--sl-bg)", color: "var(--sl-text)" }}>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--sl-surface)", borderBottom: "1px solid var(--sl-border)" }}>
          <div className="flex justify-center mb-3" style={{ color: "var(--sl-blue-2)" }}><HeadphonesIcon size={48} /></div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--sl-text)" }}>Support</h1>
          <p style={{ color: "var(--sl-muted)" }}>Notre équipe est là pour vous aider</p>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          {/* Contact cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: <Mail size={28} style={{ color: "var(--sl-blue-2)" }} />, title: "Email", value: "support@zuwandaku.cd", sub: "Réponse sous 24h" },
              { icon: <Phone size={28} style={{ color: "var(--sl-success)" }} />, title: "Téléphone", value: "+243 XXX XXX XXX", sub: "Lun–Ven, 8h–18h" },
              { icon: <Clock size={28} style={{ color: "var(--sl-warning)" }} />, title: "Horaires", value: "Lun–Sam", sub: "8h00 – 20h00 (CAT)" },
            ].map((c) => (
              <div key={c.title} className="sl-card text-center">
                <div className="flex justify-center mb-3">{c.icon}</div>
                <p className="font-bold text-lg" style={{ color: "var(--sl-text)" }}>{c.title}</p>
                <p className="font-medium mt-1" style={{ color: "var(--sl-text)" }}>{c.value}</p>
                <p className="text-sm mt-1" style={{ color: "var(--sl-muted)" }}>{c.sub}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="sl-panel p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: "var(--sl-text)" }}>
              <MessageSquare size={24} style={{ color: "var(--sl-blue-2)" }} />Envoyer un message
            </h2>

            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <CheckCircle size={56} className="mb-4" style={{ color: "var(--sl-success)" }} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--sl-text)" }}>Message envoyé !</h3>
                <p className="mb-6" style={{ color: "var(--sl-muted)" }}>Notre équipe vous répondra dans les 24 heures.</p>
                <button onClick={() => setSent(false)} className="sl-btn-primary">Envoyer un autre message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="sl-label">Nom complet</label>
                    <input type="text" value={form.name} onChange={set("name")} required className="sl-input" placeholder="Jean Dupont" />
                  </div>
                  <div>
                    <label className="sl-label">Email</label>
                    <input type="email" value={form.email} onChange={set("email")} required className="sl-input" placeholder="votre@email.com" />
                  </div>
                </div>
                <div>
                  <label className="sl-label">Sujet</label>
                  <select value={form.subject} onChange={set("subject")} required className="sl-select">
                    <option value="">Choisir un sujet...</option>
                    <option>Problème avec mon compte</option>
                    <option>Annonce frauduleuse</option>
                    <option>Problème de paiement</option>
                    <option>Question sur une annonce</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="sl-label">Message</label>
                  <textarea value={form.message} onChange={set("message")} required rows={5} className="sl-textarea" placeholder="Décrivez votre problème en détail..." />
                </div>
                <button type="submit" className="sl-btn-primary">
                  <Send size={18} />Envoyer le message
                </button>
              </form>
            )}
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
