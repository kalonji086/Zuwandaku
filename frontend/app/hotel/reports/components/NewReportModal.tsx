"use client";

import { useState } from 'react';
import { X, Plus, Calendar, TrendingUp, Users, DollarSign, BarChart3 } from 'lucide-react';

export interface Report { id:string; title:string; type:'revenue'|'occupation'|'clients'|'bookings'; period:string; startDate:string; endDate:string; metrics:Record<string,number>; data:any[]; notes:string; createdAt:string; }
interface Props { isOpen:boolean; onClose:()=>void; onCreate:(r:Report)=>void; }

const TYPES = [
  { value:'revenue',    label:'Revenus',       icon: DollarSign, color:'#10b981' },
  { value:'occupation', label:'Occupation',    icon: BarChart3,  color:'#3b82f6' },
  { value:'clients',    label:'Clients',       icon: Users,      color:'#8b5cf6' },
  { value:'bookings',   label:'Réservations',  icon: TrendingUp, color:'#f59e0b' },
];

const MOCK_METRICS: Record<string, Record<string,number>> = {
  revenue:    { totalRevenue:45230, avgDaily:1459, growth:18 },
  occupation: { avgOccupation:92.5, peakDay:98, lowDay:85 },
  clients:    { totalClients:147, newClients:47, repeat:100 },
  bookings:   { totalBookings:89, avgStay:3, cancellation:5 },
};

export default function NewReportModal({ isOpen, onClose, onCreate }: Props) {
  const [form, setForm] = useState({ title:'', type:'revenue' as Report['type'], startDate:'', endDate:'', notes:'' });

  if (!isOpen) return null;
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      id: `RPT${Date.now().toString().slice(-4)}`,
      ...form,
      period: `${new Date(form.startDate).toLocaleDateString('fr-FR')} – ${new Date(form.endDate).toLocaleDateString('fr-FR')}`,
      metrics: MOCK_METRICS[form.type],
      data: [],
      createdAt: new Date().toISOString().split('T')[0],
    });
    setForm({ title:'', type:'revenue', startDate:'', endDate:'', notes:'' });
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 520 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', boxShadow: '0 0 16px rgba(124,58,237,0.35)' }}>
              <BarChart3 size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-white text-base">Nouveau rapport</h2>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="sl-label">Titre *</label>
            <input className="sl-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Rapport mensuel décembre 2024" required />
          </div>

          {/* Type selector */}
          <div>
            <label className="sl-label">Type de rapport</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES.map(({ value, label, icon: Icon, color }) => {
                const active = form.type === value;
                return (
                  <button key={value} type="button" onClick={() => set('type', value)}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-all text-left"
                    style={{ background: active ? `${color}15` : '#060d1a', borderColor: active ? color : 'var(--sl-border)', boxShadow: active ? `0 0 12px ${color}30` : 'none' }}>
                    <Icon size={16} style={{ color: active ? color : 'var(--sl-muted)' }} />
                    <span className="text-sm font-semibold" style={{ color: active ? '#fff' : 'var(--sl-muted)' }}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Calendar size={12} />Date début *</label>
              <input type="date" className="sl-input" value={form.startDate} onChange={e => set('startDate', e.target.value)} required />
            </div>
            <div>
              <label className="sl-label"><Calendar size={12} />Date fin *</label>
              <input type="date" className="sl-input" value={form.endDate} onChange={e => set('endDate', e.target.value)} required />
            </div>
          </div>

          <div>
            <label className="sl-label"><TrendingUp size={12} />Notes / Observations</label>
            <textarea className="sl-textarea" rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Commentaires importants..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" disabled={!form.title || !form.startDate || !form.endDate} className="sl-btn-primary flex-1">
              <Plus size={15} />Générer rapport
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
