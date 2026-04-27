"use client";

import { useState } from 'react';
import { X, UserPlus, Mail, Phone, MapPin, Save } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; onSave: (c: any) => void; }

export default function NewClientModal({ isOpen, onClose, onSave }: Props) {
  const [form, setForm] = useState({ name:'', email:'', phone:'', address:'', lastStay: new Date().toISOString().split('T')[0], notes:'' });

  if (!isOpen) return null;
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    setForm({ name:'', email:'', phone:'', address:'', lastStay: new Date().toISOString().split('T')[0], notes:'' });
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 520 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 0 16px rgba(16,185,129,0.35)' }}>
              <UserPlus size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-white text-base">Nouveau client</h2>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="sl-label"><UserPlus size={12} />Nom complet *</label>
            <input className="sl-input" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Marie Dubois" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Mail size={12} />Email *</label>
              <input type="email" className="sl-input" value={form.email} onChange={e => set('email', e.target.value)} placeholder="marie@email.com" required />
            </div>
            <div>
              <label className="sl-label"><Phone size={12} />Téléphone</label>
              <input type="tel" className="sl-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+243 812 345 678" />
            </div>
          </div>

          <div>
            <label className="sl-label"><MapPin size={12} />Adresse</label>
            <input className="sl-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Kinshasa, Gombe" />
          </div>

          <div>
            <label className="sl-label">Notes</label>
            <textarea className="sl-textarea" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Préférences, allergies, commentaires..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" className="sl-btn-success flex-1"><Save size={15} />Créer client</button>
          </div>
        </form>
      </div>
    </div>
  );
}
