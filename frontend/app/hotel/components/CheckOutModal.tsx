"use client";

import { useState } from 'react';
import { X, LogOut, BedDouble, User, Clock, DollarSign, Receipt, Key, ArrowLeftRight } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; onCheckOut: (data: any) => void; }

export default function CheckOutModal({ isOpen, onClose, onCheckOut }: Props) {
  const [form, setForm] = useState({ bookingId:'', roomNumber:'', guestName:'', finalAmount:'', paymentReceived:'', checkoutTime: new Date().toTimeString().slice(0,5), notes:'' });

  if (!isOpen) return null;
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const final = parseFloat(form.finalAmount) || 0;
  const received = parseFloat(form.paymentReceived) || 0;
  const change = received - final;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheckOut({ ...form, changeDue: change.toFixed(2) });
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 480 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}>
              <LogOut size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Check-out</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>Clôturer le séjour</p>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><User size={12} />Nom client</label>
              <input className="sl-input" value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="Marie Dubois" />
            </div>
            <div>
              <label className="sl-label"><Clock size={12} />Heure départ</label>
              <input type="time" className="sl-input" value={form.checkoutTime} onChange={e => set('checkoutTime', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="sl-label"><DollarSign size={12} />Montant final (USD) *</label>
            <input type="number" step="0.01" className="sl-input" value={form.finalAmount} onChange={e => set('finalAmount', e.target.value)} placeholder="250.00" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Receipt size={12} />Montant reçu *</label>
              <input type="number" step="0.01" className="sl-input" value={form.paymentReceived} onChange={e => set('paymentReceived', e.target.value)} placeholder="300.00" required />
            </div>
            <div>
              <label className="sl-label"><ArrowLeftRight size={12} />Monnaie à rendre</label>
              <div className="sl-input flex items-center justify-center font-bold text-lg" style={{ color: change < 0 ? 'var(--sl-danger)' : 'var(--sl-success)' }}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)} $
              </div>
            </div>
          </div>

          {/* Récap */}
          {final > 0 && (
            <div className="sl-card" style={{ border: '1px solid rgba(245,158,11,0.25)', background: 'rgba(245,158,11,0.05)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--sl-muted)' }}>Solde</span>
                <span className={`font-bold ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {change >= 0 ? `Rendre $${change.toFixed(2)}` : `Manque $${Math.abs(change).toFixed(2)}`}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="sl-label">Notes départ</label>
            <textarea className="sl-textarea" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="État chambre, dommages, extras..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" className="sl-btn-primary flex-1" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', borderColor: '#fbbf24', boxShadow: '0 0 20px rgba(245,158,11,0.3)' }}>
              <Receipt size={16} />Clôturer & Imprimer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
