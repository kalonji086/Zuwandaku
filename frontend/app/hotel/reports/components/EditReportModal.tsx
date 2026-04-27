"use client";

import { useState, useEffect } from 'react';
import { X, Save, Trash2, Calendar, BarChart3 } from 'lucide-react';

export interface Report { id:string; title:string; type:'revenue'|'occupation'|'clients'|'bookings'; period:string; startDate:string; endDate:string; metrics:Record<string,number>; data:any[]; notes:string; createdAt:string; }
interface Props { isOpen:boolean; report:Report|null; onClose:()=>void; onUpdate:(r:Report)=>void; onDelete:()=>void; }

export default function EditReportModal({ isOpen, report, onClose, onUpdate, onDelete }: Props) {
  const [form, setForm] = useState<Report>({} as Report);
  useEffect(() => { if (report) setForm({ ...report }); }, [report]);

  if (!isOpen || !report) return null;
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...form, period: `${new Date(form.startDate).toLocaleDateString('fr-FR')} – ${new Date(form.endDate).toLocaleDateString('fr-FR')}` });
    onClose();
  };

  const handleDelete = () => {
    if (confirm('Supprimer ce rapport ?')) { onDelete(); onClose(); }
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 480 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}>
              <BarChart3 size={18} className="text-white" />
            </div>
            <h2 className="font-bold text-white text-base">Modifier rapport</h2>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="sl-label">Titre *</label>
            <input className="sl-input" value={form.title || ''} onChange={e => set('title', e.target.value)} required />
          </div>

          <div>
            <label className="sl-label">Type</label>
            <select className="sl-select" value={form.type || 'revenue'} onChange={e => set('type', e.target.value)}>
              <option value="revenue">Revenus</option>
              <option value="occupation">Occupation</option>
              <option value="clients">Clients</option>
              <option value="bookings">Réservations</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="sl-label"><Calendar size={12} />Date début</label>
              <input type="date" className="sl-input" value={form.startDate || ''} onChange={e => set('startDate', e.target.value)} />
            </div>
            <div>
              <label className="sl-label"><Calendar size={12} />Date fin</label>
              <input type="date" className="sl-input" value={form.endDate || ''} onChange={e => set('endDate', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="sl-label">Notes</label>
            <textarea className="sl-textarea" rows={3} value={form.notes || ''} onChange={e => set('notes', e.target.value)} placeholder="Observations..." />
          </div>

          <div className="sl-panel-footer -mx-6 -mb-5 flex gap-3">
            <button type="button" className="sl-btn-danger" onClick={handleDelete}><Trash2 size={15} /></button>
            <button type="button" className="sl-btn-ghost flex-1" onClick={onClose}>Annuler</button>
            <button type="submit" className="sl-btn-primary flex-1"><Save size={15} />Enregistrer</button>
          </div>
        </form>
      </div>
    </div>
  );
}
