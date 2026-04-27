"use client";

import { useState, useEffect } from 'react';
import { X, CreditCard, DollarSign, CheckCircle, Receipt, FileText, Save } from 'lucide-react';

export interface Invoice { id:string; guestName:string; guestEmail:string; guestPhone:string; roomNumber:string; checkIn:string; checkOut:string; nights:number; roomRate:number; extras:string[]; taxes:number; totalAmount:number; status:'pending'|'partial'|'paid'|'overdue'; paymentMethod:string; paidAmount:number; remaining:number; invoiceDate:string; notes:string; }
interface Props { isOpen:boolean; invoice:Invoice|null; onClose:()=>void; onUpdate:(inv:Invoice)=>void; }

export default function EditInvoiceModal({ isOpen, invoice, onClose, onUpdate }: Props) {
  const [form, setForm] = useState<Partial<Invoice>>({});
  useEffect(() => { if (invoice) setForm(invoice); }, [invoice]);

  if (!isOpen || !invoice) return null;
  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const total = invoice.totalAmount;
  const paid = form.paidAmount ?? 0;
  const remaining = Math.max(0, total - paid);

  const pct = total > 0 ? Math.min(100, (paid / total) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...invoice, ...form, remaining, status: remaining === 0 ? 'paid' : paid > 0 ? 'partial' : 'pending' } as Invoice);
    onClose();
  };

  const quickPay = (amount: number) => set('paidAmount', Math.min(total, (paid) + amount));

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 540 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              <Receipt size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Modifier #{invoice.id}</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>{invoice.guestName}</p>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Barre de progression paiement */}
          <div className="sl-card" style={{ border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.05)' }}>
            <div className="flex justify-between text-sm mb-3">
              <span style={{ color: 'var(--sl-muted)' }}>Progression paiement</span>
              <span className="font-bold text-blue-400">{pct.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--sl-border)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--sl-success)' : 'var(--sl-blue)', boxShadow: `0 0 8px ${pct >= 100 ? 'rgba(16,185,129,0.5)' : 'rgba(37,99,235,0.5)'}` }} />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
              <div><div className="font-bold text-white">${total.toLocaleString('fr-FR')}</div><div style={{ color: 'var(--sl-muted)' }}>Total</div></div>
              <div><div className="font-bold text-green-400">${paid.toLocaleString('fr-FR')}</div><div style={{ color: 'var(--sl-muted)' }}>Payé</div></div>
              <div><div className={`font-bold ${remaining > 0 ? 'text-yellow-400' : 'text-green-400'}`}>${remaining.toLocaleString('fr-FR')}</div><div style={{ color: 'var(--sl-muted)' }}>Restant</div></div>
            </div>
          </div>

          {/* Paiements rapides */}
          <div>
            <label className="sl-label"><CreditCard size={12} />Paiement rapide</label>
            <div className="grid grid-cols-3 gap-2">
              {[['Tout payer', total - paid], ['50%', total * 0.5], ['25%', total * 0.25]].map(([label, amt]) => (
                <button key={label as string} type="button" onClick={() => quickPay(amt as number)} className="sl-btn-ghost text-xs py-2" style={{ fontSize: '0.75rem' }}>
                  {label as string}<br /><span className="text-blue-400 font-bold">${Math.round(amt as number).toLocaleString('fr-FR')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Montant personnalisé */}
          <div>
            <label className="sl-label"><DollarSign size={12} />Montant payé (USD)</label>
            <input type="number" className="sl-input text-right font-bold text-lg" value={paid} onChange={e => set('paidAmount', parseFloat(e.target.value)||0)} min="0" max={total} step="10" />
          </div>

          {/* Méthode */}
          <div>
            <label className="sl-label"><CreditCard size={12} />Méthode de paiement</label>
            <select className="sl-select" value={form.paymentMethod || ''} onChange={e => set('paymentMethod', e.target.value)}>
              <option value="Carte">Carte bancaire</option>
              <option value="Espèces">Espèces</option>
              <option value="Virement">Virement bancaire</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="sl-label"><FileText size={12} />Notes</label>
            <textarea className="sl-textarea" rows={2} value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Commentaires sur le paiement..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" className="sl-btn-primary flex-1"><Save size={15} />Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
