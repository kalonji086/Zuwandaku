"use client";

import { useState } from 'react';
import { X, Receipt, User, Mail, Phone, Calendar, DollarSign, Hash, Plus, Shield } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; onCreate: (inv: any) => void; }

export default function NewInvoiceModal({ isOpen, onClose, onCreate }: Props) {
  const [form, setForm] = useState({ guestName:'', guestEmail:'', guestPhone:'', roomNumber:'', checkIn:'', checkOut:'', roomRate:150, extras:[] as string[], taxes:18, paymentMethod:'Carte', notes:'', paidAmount:0 });

  if (!isOpen) return null;
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const nights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000))
    : 0;
  const subtotal = nights * form.roomRate + form.extras.length * 50;
  const taxAmt = Math.round(subtotal * form.taxes / 100);
  const total = subtotal + taxAmt;
  const remaining = Math.max(0, total - form.paidAmount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({ ...form, id: `INV${Date.now().toString().slice(-4)}`, nights, totalAmount: total, remaining, status: remaining === 0 ? 'paid' : form.paidAmount > 0 ? 'partial' : 'pending', invoiceDate: new Date().toISOString().split('T')[0] });
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 620 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#059669,#10b981)', boxShadow: '0 0 16px rgba(16,185,129,0.35)' }}>
              <Receipt size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Nouvelle facture</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>Créer facture pour séjour</p>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Client */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><User size={12} />Nom client *</label>
              <input className="sl-input" value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="Marie Dubois" required />
            </div>
            <div>
              <label className="sl-label"><Mail size={12} />Email</label>
              <input type="email" className="sl-input" value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} placeholder="marie@email.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Phone size={12} />Téléphone</label>
              <input type="tel" className="sl-input" value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} placeholder="+243 99 123 4567" />
            </div>
            <div>
              <label className="sl-label"><Hash size={12} />Chambre *</label>
              <input className="sl-input" value={form.roomNumber} onChange={e => set('roomNumber', e.target.value)} placeholder="101" required />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Calendar size={12} />Arrivée *</label>
              <input type="date" className="sl-input" value={form.checkIn} onChange={e => set('checkIn', e.target.value)} required />
            </div>
            <div>
              <label className="sl-label"><Calendar size={12} />Départ *</label>
              <input type="date" className="sl-input" value={form.checkOut} onChange={e => set('checkOut', e.target.value)} required />
            </div>
          </div>

          {nights > 0 && <div className="sl-badge-blue w-fit">{nights} nuit{nights > 1 ? 's' : ''}</div>}

          {/* Tarifs */}
          <div className="sl-card space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--sl-muted)' }}>Tarification</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="sl-label"><DollarSign size={12} />Tarif/nuit</label>
                <input type="number" className="sl-input text-right" value={form.roomRate} onChange={e => set('roomRate', parseFloat(e.target.value)||0)} min="0" step="10" />
              </div>
              <div>
                <label className="sl-label">TVA (%)</label>
                <input type="number" className="sl-input text-right" value={form.taxes} onChange={e => set('taxes', parseFloat(e.target.value)||0)} min="0" max="100" />
              </div>
              <div>
                <label className="sl-label">Paiement</label>
                <select className="sl-select" value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)}>
                  <option>Carte</option><option>Espèces</option><option>Virement</option><option>Mobile Money</option>
                </select>
              </div>
            </div>

            {/* Extras */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="sl-label mb-0">Services supplémentaires (+$50 chacun)</label>
                <button type="button" onClick={() => set('extras', [...form.extras, 'Petit-déjeuner'])} className="sl-btn-ghost" style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}>
                  <Plus size={12} />Ajouter
                </button>
              </div>
              {form.extras.map((ex, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input className="sl-input flex-1" value={ex} onChange={e => { const arr = [...form.extras]; arr[i] = e.target.value; set('extras', arr); }} placeholder="Service..." />
                  <button type="button" className="sl-btn-danger" style={{ padding: '0.5rem' }} onClick={() => set('extras', form.extras.filter((_,j) => j !== i))}><X size={14} /></button>
                </div>
              ))}
            </div>
          </div>

          {/* Récap */}
          {total > 0 && (
            <div className="sl-card" style={{ border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.06)' }}>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between" style={{ color: 'var(--sl-muted)' }}><span>Sous-total</span><span>${subtotal.toLocaleString('fr-FR')}</span></div>
                <div className="flex justify-between" style={{ color: 'var(--sl-muted)' }}><span>TVA {form.taxes}%</span><span>${taxAmt.toLocaleString('fr-FR')}</span></div>
                <hr className="sl-divider my-1" />
                <div className="flex justify-between font-bold text-base"><span className="text-white">Total</span><span className="text-blue-400">${total.toLocaleString('fr-FR')}</span></div>
              </div>
            </div>
          )}

          {/* Paiement reçu */}
          <div>
            <label className="sl-label"><DollarSign size={12} />Paiement reçu (USD)</label>
            <input type="number" className="sl-input text-right font-bold" value={form.paidAmount} onChange={e => set('paidAmount', parseFloat(e.target.value)||0)} min="0" step="10" />
            {remaining > 0 && <p className="text-xs text-yellow-400 mt-1">Restant : ${remaining.toLocaleString('fr-FR')}</p>}
          </div>

          <div>
            <label className="sl-label">Notes</label>
            <textarea className="sl-textarea" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Instructions spéciales..." />
          </div>
        </form>

        <div className="sl-panel-footer flex gap-3">
          <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
          <button type="button" onClick={handleSubmit} disabled={!form.guestName || !form.roomNumber || !form.checkIn || !form.checkOut} className="sl-btn-success flex-1">
            <Shield size={15} />Créer facture {total > 0 ? `($${total.toLocaleString('fr-FR')})` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}
