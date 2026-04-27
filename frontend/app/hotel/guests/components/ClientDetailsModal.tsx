"use client";

import { X, Mail, Phone, MapPin, Calendar, DollarSign, User, Edit2, Star } from 'lucide-react';

interface Client { id: string; name: string; email: string; phone: string; address: string; lastStay: string; totalStays: number; totalSpent: number; status: 'active'|'vip'|'inactive'; notes: string; }
interface Props { isOpen: boolean; client: Client|null; onClose: () => void; onEdit: () => void; }

export default function ClientDetailsModal({ isOpen, client, onClose, onEdit }: Props) {
  if (!isOpen || !client) return null;

  const statusBadge = client.status === 'vip'
    ? 'sl-badge-green' : client.status === 'active' ? 'sl-badge-blue' : 'sl-badge-yellow';
  const statusLabel = client.status === 'vip' ? 'VIP' : client.status === 'active' ? 'Actif' : 'Inactif';

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 580 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
              {client.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-bold text-white">{client.name}</h2>
              <span className={statusBadge}>{client.status === 'vip' && <Star size={10} className="mr-1" />}{statusLabel}</span>
            </div>
          </div>
          <button className="sl-close" onClick={onClose}><X size={16} /></button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Contact */}
          <div className="sl-card space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--sl-muted)' }}>Contact</p>
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sl-text)' }}>
              <Mail size={15} style={{ color: 'var(--sl-blue-2)' }} />{client.email}
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sl-text)' }}>
              <Phone size={15} className="text-green-400" />{client.phone}
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sl-text)' }}>
              <MapPin size={15} className="text-purple-400" />{client.address}
            </div>
            <div className="flex items-center gap-3 text-sm" style={{ color: 'var(--sl-text)' }}>
              <Calendar size={15} className="text-yellow-400" />Dernier séjour : {client.lastStay}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="sl-stat">
              <div className="sl-stat-value text-blue-400">{client.totalStays}</div>
              <div className="sl-stat-label">Séjours</div>
            </div>
            <div className="sl-stat">
              <div className="sl-stat-value text-green-400">${client.totalSpent.toLocaleString('fr-FR')}</div>
              <div className="sl-stat-label">CA généré</div>
            </div>
          </div>

          {/* Notes */}
          {client.notes && (
            <div className="sl-card" style={{ borderLeft: '3px solid var(--sl-blue)', background: 'rgba(37,99,235,0.05)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--sl-muted)' }}>Notes</p>
              <p className="text-sm" style={{ color: 'var(--sl-text)' }}>{client.notes}</p>
            </div>
          )}
        </div>

        <div className="sl-panel-footer flex gap-3">
          <button className="sl-btn-ghost flex-1" onClick={onClose}>Fermer</button>
          <button className="sl-btn-primary flex-1" onClick={onEdit}><Edit2 size={15} />Modifier</button>
        </div>
      </div>
    </div>
  );
}
