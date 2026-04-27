"use client";

import { useState, useEffect } from 'react';
import { X, User, Mail, Phone, MapPin, Save, Trash2 } from 'lucide-react';

interface Client { id: string; name: string; email: string; phone: string; address: string; notes?: string; status: 'active'|'vip'|'inactive'; lastStay?: string; totalStays?: number; totalSpent?: number; }
interface Props { isOpen: boolean; client: Client|null; onClose: () => void; onSave: (c: Client) => void; onDelete: () => void; }

export default function EditClientModal({ isOpen, client, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<Client|null>(null);
  useEffect(() => { if (client) setForm({ ...client }); }, [client]);

  if (!isOpen || !form) return null;
  const set = (k: string, v: string) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 520 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              <User size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-white text-base">Modifier — {form.name}</h2>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="sl-label"><User size={12} />Nom complet *</label>
            <input className="sl-input" value={form.name} onChange={e => set('name', e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Mail size={12} />Email *</label>
              <input type="email" className="sl-input" value={form.email} onChange={e => set('email', e.target.value)} required />
            </div>
            <div>
              <label className="sl-label"><Phone size={12} />Téléphone</label>
              <input type="tel" className="sl-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="sl-label"><MapPin size={12} />Adresse</label>
            <input className="sl-input" value={form.address} onChange={e => set('address', e.target.value)} />
          </div>

          <div>
            <label className="sl-label">Statut</label>
            <select className="sl-select" value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="active">Actif</option>
              <option value="vip">VIP</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <div>
            <label className="sl-label">Notes</label>
            <textarea className="sl-textarea" rows={3} value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Préférences, allergies..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-danger" onClick={onDelete}><Trash2 size={15} />Supprimer</button>
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" className="sl-btn-primary flex-1"><Save size={15} />Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
