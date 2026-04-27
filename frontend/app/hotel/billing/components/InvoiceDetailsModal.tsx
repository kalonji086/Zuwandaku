"use client";

import { X, User, Calendar, CreditCard, Receipt, FileText, Phone, DollarSign, CheckCircle, Clock, Edit2, Printer } from 'lucide-react';

export interface Invoice { id:string; guestName:string; guestEmail:string; guestPhone:string; roomNumber:string; checkIn:string; checkOut:string; nights:number; roomRate:number; extras:string[]; taxes:number; totalAmount:number; status:'pending'|'partial'|'paid'|'overdue'; paymentMethod:string; paidAmount:number; remaining:number; invoiceDate:string; notes:string; }
interface Props { isOpen:boolean; invoice:Invoice|null; onClose:()=>void; onEdit:(inv:Invoice)=>void; }

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR');

const STATUS_MAP = {
  paid:    { label:'Payée',      cls:'sl-badge-green' },
  partial: { label:'Partielle',  cls:'sl-badge-yellow' },
  pending: { label:'En attente', cls:'sl-badge-blue' },
  overdue: { label:'En retard',  cls:'sl-badge-red' },
};

export default function InvoiceDetailsModal({ isOpen, invoice, onClose, onEdit }: Props) {
  if (!isOpen || !invoice) return null;
  const st = STATUS_MAP[invoice.status];
  const pct = invoice.totalAmount > 0 ? Math.min(100, (invoice.paidAmount / invoice.totalAmount) * 100) : 0;

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 640 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}>
              <Receipt size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">Facture #{invoice.id}</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>{invoice.guestName} · {fmt(invoice.invoiceDate)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={st.cls}>{st.label}</span>
            <button className="sl-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Client + Séjour */}
          <div className="grid grid-cols-2 gap-4">
            <div className="sl-card space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--sl-muted)' }}>Client</p>
              <div className="flex items-center gap-2 text-sm"><User size={13} style={{ color: 'var(--sl-blue-2)' }} />{invoice.guestName}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-muted)' }}><Phone size={13} />{invoice.guestPhone}</div>
              <div className="text-xs" style={{ color: 'var(--sl-muted)' }}>{invoice.guestEmail}</div>
            </div>
            <div className="sl-card space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--sl-muted)' }}>Séjour</p>
              <div className="flex items-center gap-2 text-sm"><Calendar size={13} className="text-green-400" />{fmt(invoice.checkIn)} → {fmt(invoice.checkOut)}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-muted)' }}>Chambre #{invoice.roomNumber} · {invoice.nights} nuit{invoice.nights > 1 ? 's' : ''}</div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-muted)' }}><CreditCard size={13} />{invoice.paymentMethod}</div>
            </div>
          </div>

          {/* Détail facture */}
          <div className="sl-card overflow-hidden p-0">
            <table className="sl-table">
              <thead><tr><th>Description</th><th className="text-right">Qté</th><th className="text-right">P.U.</th><th className="text-right">Total</th></tr></thead>
              <tbody>
                <tr>
                  <td>Chambre #{invoice.roomNumber}</td>
                  <td className="text-right">{invoice.nights}</td>
                  <td className="text-right">${invoice.roomRate.toLocaleString('fr-FR')}</td>
                  <td className="text-right font-bold text-white">${(invoice.nights * invoice.roomRate).toLocaleString('fr-FR')}</td>
                </tr>
                {invoice.extras.map((ex, i) => (
                  <tr key={i}>
                    <td>{ex}</td><td className="text-right">1</td><td className="text-right">$50</td><td className="text-right font-bold text-white">$50</td>
                  </tr>
                ))}
                <tr style={{ borderTop: '1px solid var(--sl-border)' }}>
                  <td colSpan={3} className="font-semibold" style={{ color: 'var(--sl-muted)' }}>TVA {invoice.taxes}%</td>
                  <td className="text-right" style={{ color: 'var(--sl-muted)' }}>${Math.round((invoice.nights * invoice.roomRate + invoice.extras.length * 50) * invoice.taxes / 100).toLocaleString('fr-FR')}</td>
                </tr>
                <tr style={{ background: 'rgba(37,99,235,0.08)' }}>
                  <td colSpan={3} className="font-black text-white text-base">TOTAL</td>
                  <td className="text-right font-black text-blue-400 text-lg">${invoice.totalAmount.toLocaleString('fr-FR')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Barre paiement */}
          <div className="sl-card" style={{ border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.05)' }}>
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'var(--sl-muted)' }}>Paiement</span>
              <span className="font-bold text-blue-400">{pct.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden mb-3" style={{ background: 'var(--sl-border)' }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--sl-success)' : 'var(--sl-blue)' }} />
            </div>
            <div className="grid grid-cols-2 gap-3 text-center text-sm">
              <div><div className="font-bold text-green-400">${invoice.paidAmount.toLocaleString('fr-FR')}</div><div style={{ color: 'var(--sl-muted)' }}>Payé</div></div>
              <div><div className={`font-bold ${invoice.remaining > 0 ? 'text-yellow-400' : 'text-green-400'}`}>${invoice.remaining.toLocaleString('fr-FR')}</div><div style={{ color: 'var(--sl-muted)' }}>Restant</div></div>
            </div>
          </div>

          {invoice.notes && (
            <div className="sl-card" style={{ borderLeft: '3px solid var(--sl-blue)', background: 'rgba(37,99,235,0.05)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--sl-muted)' }}>Notes</p>
              <p className="text-sm" style={{ color: 'var(--sl-text)' }}>{invoice.notes}</p>
            </div>
          )}
        </div>

        <div className="sl-panel-footer flex gap-3">
          <button className="sl-btn-ghost" onClick={onClose}>Fermer</button>
          <button className="sl-btn-ghost flex-1"><Printer size={15} />Imprimer</button>
          <button className="sl-btn-primary flex-1" onClick={() => onEdit(invoice)}><Edit2 size={15} />Modifier paiement</button>
        </div>
      </div>
    </div>
  );
}
