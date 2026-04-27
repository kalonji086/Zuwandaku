"use client";

import { useState } from 'react';
import { X, CheckCircle, User, BedDouble, Clock, CreditCard, Phone, DollarSign, Key } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; onCheckIn: (data: any) => void; }

export default function CheckInModal({ isOpen, onClose, onCheckIn }: Props) {
  const [form, setForm] = useState({ bookingId:'', roomNumber:'', guestName:'', guestPhone:'', checkInTime: new Date().toTimeString().slice(0,5), paymentMethod:'cash', totalAmount:'', notes:'' });

  if (!isOpen) return null;
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckIn(form);
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 480 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 0 16px rgba(16,185,129,0.35)' }}>
              <CheckCircle size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Check-in</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>Enregistrement client</p>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Key size={12} />N° Réservation *</label>
              <input className="sl-input" value={form.bookingId} onChange={e => set('bookingId', e.target.value)} placeholder="RB001" required />
            </div>
            <div>
              <label className="sl-label"><BedDouble size={12} />Chambre *</label>
              <input className="sl-input" value={form.roomNumber} onChange={e => set('roomNumber', e.target.value)} placeholder="101" required />
            </div>
          </div>

          <div>
            <label className="sl-label"><User size={12} />Nom client *</label>
            <input className="sl-input" value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="Marie Dubois" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Phone size={12} />Téléphone</label>
              <input type="tel" className="sl-input" value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} placeholder="+243 99 123 4567" />
            </div>
            <div>
              <label className="sl-label"><Clock size={12} />Heure arrivée</label>
              <input type="time" className="sl-input" value={form.checkInTime} onChange={e => set('checkInTime', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="sl-label"><CreditCard size={12} />Mode paiement *</label>
            <select className="sl-select" value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)} required>
              <option value="cash">Espèces</option>
              <option value="card">Carte bancaire</option>
              <option value="mobile">Mobile Money</option>
              <option value="bank">Virement bancaire</option>
            </select>
          </div>

          <div>
            <label className="sl-label"><DollarSign size={12} />Montant total (USD) *</label>
            <input type="number" step="0.01" className="sl-input" value={form.totalAmount} onChange={e => set('totalAmount', e.target.value)} placeholder="250.00" required />
          </div>

          <div>
            <label className="sl-label">Notes</label>
            <textarea className="sl-textarea" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Observations..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" className="sl-btn-success flex-1"><CheckCircle size={16} />Confirmer check-in</button>
          </div>
        </form>
      </div>
    </div>
  );
}
