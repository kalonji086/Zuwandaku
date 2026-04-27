"use client";

import { useState, useEffect } from 'react';
import { X, Save, Edit3, User, BedDouble, Calendar, Phone, Mail, DollarSign, Trash2, Loader2 } from 'lucide-react';

interface Props { isOpen: boolean; booking: any; onSave: (b: any) => void; onDelete: (id: string) => void; onClose: () => void; }

export default function EditBookingModal({ isOpen, booking, onSave, onDelete, onClose }: Props) {
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (booking) setForm(booking); }, [booking]);

  if (!isOpen) return null;
  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const nights = form.checkInDate && form.checkOutDate
    ? Math.max(0, Math.ceil((new Date(form.checkOutDate).getTime() - new Date(form.checkInDate).getTime()) / 86400000))
    : form.nights || 0;
  const total = nights * (parseFloat(form.pricePerNight) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { onSave({ ...form, nights, totalAmount: total || form.totalAmount }); setLoading(false); onClose(); }, 600);
  };

  const handleDelete = () => {
    if (confirm('Supprimer cette réservation ?')) { onDelete(form.id); onClose(); }
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 560 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              <Edit3 size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Modifier réservation</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>#{form.id}</p>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><User size={12} />Client *</label>
              <input className="sl-input" value={form.guestName || ''} onChange={e => set('guestName', e.target.value)} required />
            </div>
            <div>
              <label className="sl-label"><Phone size={12} />Téléphone</label>
              <input type="tel" className="sl-input" value={form.guestPhone || ''} onChange={e => set('guestPhone', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><BedDouble size={12} />Chambre *</label>
              <input className="sl-input" value={form.roomNumber || ''} onChange={e => set('roomNumber', e.target.value)} required />
            </div>
            <div>
              <label className="sl-label"><Mail size={12} />Email</label>
              <input type="email" className="sl-input" value={form.guestEmail || ''} onChange={e => set('guestEmail', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Calendar size={12} />Arrivée</label>
              <input type="date" className="sl-input" value={form.checkInDate || ''} onChange={e => set('checkInDate', e.target.value)} />
            </div>
            <div>
              <label className="sl-label"><Calendar size={12} />Départ</label>
              <input type="date" className="sl-input" value={form.checkOutDate || ''} onChange={e => set('checkOutDate', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="sl-label"><DollarSign size={12} />Prix / nuit (USD)</label>
            <input type="number" step="0.01" className="sl-input" value={form.pricePerNight || ''} onChange={e => set('pricePerNight', parseFloat(e.target.value) || 0)} />
          </div>

          {total > 0 && (
            <div className="sl-card" style={{ border: '1px solid rgba(37,99,235,0.25)', background: 'rgba(37,99,235,0.05)' }}>
              <div className="flex justify-between font-bold">
                <span style={{ color: 'var(--sl-muted)' }}>{nights} nuit{nights > 1 ? 's' : ''}</span>
                <span className="text-blue-400">${total.toLocaleString('fr-FR')}</span>
              </div>
            </div>
          )}

          <div>
            <label className="sl-label">Notes</label>
            <textarea className="sl-textarea" rows={2} value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Préférences spéciales..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-danger" onClick={handleDelete}><Trash2 size={15} /></button>
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={loading} className="sl-btn-primary flex-1">
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
