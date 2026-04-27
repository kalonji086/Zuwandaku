"use client";

import { useState } from 'react';
import { X, Calendar, BedDouble, User, Phone, Mail, CheckCircle, DollarSign } from 'lucide-react';

interface Props { isOpen: boolean; onClose: () => void; onSave: (data: any) => void; }

const ROOMS = ['101 - Standard','102 - Deluxe','103 - Suite','201 - Standard','202 - Deluxe','301 - Suite Présidentielle'];

export default function NewReservationModal({ isOpen, onClose, onSave }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ guestName:'', guestPhone:'', guestEmail:'', roomType:'', checkInDate:'', checkOutDate:'', pricePerNight:'', deposit:'', notes:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});

  if (!isOpen) return null;

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const nights = form.checkInDate && form.checkOutDate
    ? Math.max(0, Math.ceil((new Date(form.checkOutDate).getTime() - new Date(form.checkInDate).getTime()) / 86400000))
    : 0;
  const total = nights * (parseFloat(form.pricePerNight) || 0);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.guestName.trim()) e.guestName = 'Requis';
    if (step === 2) {
      if (!form.roomType) e.roomType = 'Requis';
      if (!form.checkInDate || !form.checkOutDate || nights <= 0) e.dates = 'Dates invalides';
    }
    if (step === 3 && (!form.pricePerNight || parseFloat(form.pricePerNight) <= 0)) e.price = 'Requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, nights, totalAmount: total });
    setForm({ guestName:'', guestPhone:'', guestEmail:'', roomType:'', checkInDate:'', checkOutDate:'', pricePerNight:'', deposit:'', notes:'' });
    setStep(1);
    onClose();
  };

  const inputCls = (err?: string) =>
    `sl-input ${err ? 'border-red-500/60 focus:border-red-400' : ''}`;

  const steps = [
    { label: 'Client', icon: User },
    { label: 'Chambre', icon: BedDouble },
    { label: 'Tarif', icon: DollarSign },
  ];

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 560 }}>
        {/* Header */}
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
              <CheckCircle size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Nouvelle réservation</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>Étape {step} / 3</p>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        {/* Step indicators */}
        <div className="px-6 pt-4 pb-2 flex items-center gap-2">
          {steps.map((s, i) => {
            const n = i + 1;
            const active = n === step;
            const done = n < step;
            return (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                  done ? 'bg-blue-600 text-white' : active ? 'text-white sl-pulse' : 'text-gray-500'
                }`} style={active ? { background: 'var(--sl-blue)', boxShadow: '0 0 12px rgba(37,99,235,0.5)' } : done ? {} : { background: 'var(--sl-border)' }}>
                  {done ? '✓' : n}
                </div>
                <span className={`text-xs font-semibold ${active ? 'text-blue-400' : done ? 'text-blue-600' : 'text-gray-600'}`}>{s.label}</span>
                {i < 2 && <div className="flex-1 h-px" style={{ background: done ? 'var(--sl-blue)' : 'var(--sl-border)' }} />}
              </div>
            );
          })}
        </div>

        {/* Body */}
        <form onSubmit={submit}>
          <div className="px-6 py-4 space-y-4" style={{ minHeight: 260 }}>

            {step === 1 && (
              <>
                <div>
                  <label className="sl-label"><User size={12} />Nom complet *</label>
                  <input className={inputCls(errors.guestName)} value={form.guestName} onChange={e => set('guestName', e.target.value)} placeholder="Marie Dubois" />
                  {errors.guestName && <p className="text-xs text-red-400 mt-1">{errors.guestName}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="sl-label"><Phone size={12} />Téléphone</label>
                    <input className="sl-input" value={form.guestPhone} onChange={e => set('guestPhone', e.target.value)} placeholder="+243 99 123 4567" />
                  </div>
                  <div>
                    <label className="sl-label"><Mail size={12} />Email</label>
                    <input type="email" className="sl-input" value={form.guestEmail} onChange={e => set('guestEmail', e.target.value)} placeholder="marie@email.com" />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="sl-label"><BedDouble size={12} />Chambre *</label>
                  <select className={`sl-select ${errors.roomType ? 'border-red-500/60' : ''}`} value={form.roomType} onChange={e => set('roomType', e.target.value)}>
                    <option value="">Sélectionner une chambre</option>
                    {ROOMS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {errors.roomType && <p className="text-xs text-red-400 mt-1">{errors.roomType}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="sl-label"><Calendar size={12} />Arrivée *</label>
                    <input type="date" className="sl-input" value={form.checkInDate} onChange={e => set('checkInDate', e.target.value)} />
                  </div>
                  <div>
                    <label className="sl-label"><Calendar size={12} />Départ *</label>
                    <input type="date" className="sl-input" value={form.checkOutDate} onChange={e => set('checkOutDate', e.target.value)} />
                  </div>
                </div>
                {errors.dates && <p className="text-xs text-red-400">{errors.dates}</p>}
                {nights > 0 && (
                  <div className="sl-card flex items-center justify-between">
                    <span style={{ color: 'var(--sl-muted)' }} className="text-sm">Durée du séjour</span>
                    <span className="font-bold text-blue-400">{nights} nuit{nights > 1 ? 's' : ''}</span>
                  </div>
                )}
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label className="sl-label"><DollarSign size={12} />Prix / nuit (USD) *</label>
                  <input type="number" step="0.01" className={inputCls(errors.price)} value={form.pricePerNight} onChange={e => set('pricePerNight', e.target.value)} placeholder="250" />
                  {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
                </div>
                <div>
                  <label className="sl-label"><DollarSign size={12} />Acompte (USD)</label>
                  <input type="number" step="0.01" className="sl-input" value={form.deposit} onChange={e => set('deposit', e.target.value)} placeholder="100" />
                </div>
                {total > 0 && (
                  <div className="sl-card" style={{ border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.06)' }}>
                    <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--sl-muted)' }}>
                      <span>{nights} nuit{nights > 1 ? 's' : ''} × ${form.pricePerNight}</span>
                      <span>${total.toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t pt-2" style={{ borderColor: 'var(--sl-border)' }}>
                      <span className="text-white">Total TTC</span>
                      <span className="text-blue-400">${total.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                )}
                <div>
                  <label className="sl-label">Notes</label>
                  <textarea className="sl-textarea" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Préférences, allergies..." />
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sl-panel-footer flex gap-3">
            {step > 1
              ? <button type="button" className="sl-btn-ghost flex-1" onClick={prev}>← Précédent</button>
              : <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            }
            {step < 3
              ? <button type="button" className="sl-btn-primary flex-1" onClick={next}>Suivant →</button>
              : <button type="submit" className="sl-btn-success flex-1"><CheckCircle size={16} />Confirmer</button>
            }
          </div>
        </form>
      </div>
    </div>
  );
}
