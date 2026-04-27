"use client";

import { useState } from 'react';
import { X, UserPlus, CheckCircle, XCircle, Calendar, Briefcase, User, Download } from 'lucide-react';

interface Request { id:string; name:string; role:string; requestedBy:string; date:string; status:'pending'|'approved'|'rejected'; priority:string; }
interface Props { isOpen:boolean; request:Request|null; onClose:()=>void; }

const STATUS_MAP = {
  pending:  { label:'En attente', cls:'sl-badge-yellow' },
  approved: { label:'Approuvée',  cls:'sl-badge-green' },
  rejected: { label:'Rejetée',    cls:'sl-badge-red' },
};

export default function RequestDetailsModal({ isOpen, request, onClose }: Props) {
  const [status, setStatus] = useState<'pending'|'approved'|'rejected'>(request?.status || 'pending');
  const [note, setNote] = useState('');

  if (!isOpen || !request) return null;
  const st = STATUS_MAP[status];

  const handleAction = (action: 'approved'|'rejected') => {
    setStatus(action);
    alert(`Demande ${action === 'approved' ? 'approuvée' : 'rejetée'} !`);
    onClose();
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 500 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)', boxShadow: '0 0 16px rgba(245,158,11,0.35)' }}>
              <UserPlus size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-base">Demande #{request.id}</h2>
              <span className={st.cls}>{st.label}</span>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {/* Candidat */}
          <div className="sl-card space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--sl-muted)' }}>Candidat</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg,#d97706,#f59e0b)' }}>
                {request.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-white">{request.name}</p>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--sl-muted)' }}>
                  <Briefcase size={11} />{request.role}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-text)' }}>
              <User size={13} style={{ color: 'var(--sl-blue-2)' }} />Demandé par <span className="font-semibold ml-1">{request.requestedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-muted)' }}>
              <Calendar size={13} />{request.date}
            </div>
          </div>

          {/* Priorité */}
          <div className="sl-card flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--sl-muted)' }}>Priorité</span>
            <span className={request.priority === 'high' ? 'sl-badge-red' : 'sl-badge-yellow'}>
              {request.priority === 'high' ? 'Haute' : 'Moyenne'}
            </span>
          </div>

          {/* Description */}
          <div className="sl-card" style={{ borderLeft: '3px solid var(--sl-blue)', background: 'rgba(37,99,235,0.05)' }}>
            <p className="text-sm" style={{ color: 'var(--sl-text)' }}>
              Demande de création de compte pour le poste de <strong>{request.role}</strong>. Validation RH et formation initiale recommandée avant prise de poste.
            </p>
          </div>

          {/* Note de décision */}
          {status === 'pending' && (
            <div>
              <label className="sl-label">Note de décision (optionnel)</label>
              <textarea className="sl-textarea" rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Raison de l'approbation ou du rejet..." />
            </div>
          )}

          {/* CV */}
          <button className="sl-btn-ghost w-full"><Download size={15} />Télécharger CV / Documents</button>
        </div>

        <div className="sl-panel-footer flex gap-3">
          <button className="sl-btn-ghost flex-1" onClick={onClose}>Fermer</button>
          {status === 'pending' && (
            <>
              <button className="sl-btn-danger flex-1" onClick={() => handleAction('rejected')}><XCircle size={15} />Rejeter</button>
              <button className="sl-btn-success flex-1" onClick={() => handleAction('approved')}><CheckCircle size={15} />Approuver</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
