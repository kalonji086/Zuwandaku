"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Ticket, Plus, Clock, CheckCircle, AlertCircle, ArrowLeft, Send, ChevronRight } from "lucide-react";

const MOCK_TICKETS = [
  { id: "TKT-001", subject: "Problème de connexion", status: "RESOLVED", date: "2025-01-10", priority: "HIGH" },
  { id: "TKT-002", subject: "Annonce non publiée", status: "OPEN", date: "2025-01-14", priority: "MEDIUM" },
  { id: "TKT-003", subject: "Question sur les tarifs", status: "PENDING", date: "2025-01-15", priority: "LOW" },
];

const STATUS_CONFIG: Record<string, { label: string; badgeClass: string; icon: any }> = {
  OPEN:     { label: "Ouvert",     badgeClass: "sl-badge-blue",   icon: AlertCircle },
  PENDING:  { label: "En attente", badgeClass: "sl-badge-yellow", icon: Clock },
  RESOLVED: { label: "Résolu",     badgeClass: "sl-badge-green",  icon: CheckCircle },
};

const PRIORITY_COLOR: Record<string, string> = {
  HIGH:   "var(--sl-danger)",
  MEDIUM: "var(--sl-warning)",
  LOW:    "var(--sl-muted)",
};

export default function HelpdeskPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", priority: "MEDIUM", category: "", description: "" });
  const [submitted, setSubmitted] = useState(false);

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
    setForm({ subject: "", priority: "MEDIUM", category: "", description: "" });
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--sl-bg)", color: "var(--sl-text)" }}>
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="py-14 px-4 text-center" style={{ background: "var(--sl-surface)", borderBottom: "1px solid var(--sl-border)" }}>
          <div className="flex justify-center mb-3" style={{ color: "var(--sl-blue-2)" }}><Ticket size={48} /></div>
          <h1 className="text-4xl font-extrabold mb-2" style={{ color: "var(--sl-text)" }}>Helpdesk</h1>
          <p style={{ color: "var(--sl-muted)" }}>Gérez vos tickets de support</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-12">

          {submitted && (
            <div className="flex items-center gap-2 rounded-xl px-4 py-3 mb-8" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", color: "var(--sl-success)" }}>
              <CheckCircle size={18} />
              <span className="font-medium">Ticket créé avec succès ! Notre équipe vous répondra sous 24h.</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Tickets ouverts", value: 1, color: "var(--sl-blue-2)" },
              { label: "En attente",       value: 1, color: "var(--sl-warning)" },
              { label: "Résolus",          value: 1, color: "var(--sl-success)" },
            ].map((s) => (
              <div key={s.label} className="sl-stat">
                <p className="sl-stat-value" style={{ color: s.color }}>{s.value}</p>
                <p className="sl-stat-label">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold" style={{ color: "var(--sl-text)" }}>Mes tickets</h2>
            <button onClick={() => setShowForm(!showForm)} className="sl-btn-primary">
              <Plus size={18} />Nouveau ticket
            </button>
          </div>

          {/* New ticket form */}
          {showForm && (
            <div className="sl-panel p-6 mb-8">
              <h3 className="text-lg font-bold mb-5" style={{ color: "var(--sl-text)" }}>Créer un nouveau ticket</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="sl-label">Sujet</label>
                    <input type="text" value={form.subject} onChange={set("subject")} required className="sl-input" placeholder="Résumé du problème" />
                  </div>
                  <div>
                    <label className="sl-label">Catégorie</label>
                    <select value={form.category} onChange={set("category")} required className="sl-select">
                      <option value="">Choisir...</option>
                      <option>Compte & Connexion</option>
                      <option>Annonces</option>
                      <option>Paiements</option>
                      <option>Technique</option>
                      <option>Autre</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="sl-label">Priorité</label>
                  <div className="flex gap-3">
                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                      <button key={p} type="button" onClick={() => setForm({ ...form, priority: p })}
                        className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${form.priority === p ? "sl-btn-primary" : "sl-btn-ghost"}`}>
                        {p === "LOW" ? "Faible" : p === "MEDIUM" ? "Moyenne" : "Haute"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="sl-label">Description</label>
                  <textarea value={form.description} onChange={set("description")} required rows={4} className="sl-textarea" placeholder="Décrivez votre problème en détail..." />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="sl-btn-primary"><Send size={16} />Soumettre</button>
                  <button type="button" onClick={() => setShowForm(false)} className="sl-btn-ghost">Annuler</button>
                </div>
              </form>
            </div>
          )}

          {/* Tickets list */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--sl-border)" }}>
            {MOCK_TICKETS.map((ticket, i) => {
              const status = STATUS_CONFIG[ticket.status];
              const StatusIcon = status.icon;
              return (
                <div key={ticket.id}
                  className="flex items-center gap-4 px-5 py-4 cursor-pointer transition-colors"
                  style={{
                    background: "var(--sl-card)",
                    borderBottom: i < MOCK_TICKETS.length - 1 ? "1px solid var(--sl-border)" : "none",
                  }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.15)" }}>
                    <Ticket size={18} style={{ color: "var(--sl-blue-2)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-mono" style={{ color: "var(--sl-muted)" }}>{ticket.id}</span>
                      <span className="text-xs font-bold" style={{ color: PRIORITY_COLOR[ticket.priority] }}>● {ticket.priority}</span>
                    </div>
                    <p className="font-semibold truncate" style={{ color: "var(--sl-text)" }}>{ticket.subject}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--sl-muted)" }}>{ticket.date}</p>
                  </div>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${status.badgeClass}`}>
                    <StatusIcon size={12} />{status.label}
                  </span>
                  <ChevronRight size={16} style={{ color: "var(--sl-muted)" }} className="shrink-0" />
                </div>
              );
            })}
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
