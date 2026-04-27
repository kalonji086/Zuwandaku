"use client";

import { useState } from 'react';
import { X, User, BedDouble, Calendar, DollarSign, FileText, Edit2, Printer, MapPin } from 'lucide-react';
import EditBookingModal from './EditBookingModal';
import PrintPreviewModal from './PrintPreviewModal';

interface Booking { id:string; guestName:string; guestEmail?:string; guestPhone?:string; roomNumber:string; roomType:string; checkInDate:string; checkOutDate:string; nights:number; pricePerNight:number; totalAmount:number; deposit:number; balanceDue:number; status:string; notes?:string; }
interface Props { isOpen:boolean; booking:Booking|null; onClose:()=>void; }

const STATUS_MAP: Record<string,string> = {
  'Confirmée':'sl-badge-green','En attente':'sl-badge-yellow','Check-in':'sl-badge-blue','Check-out':'sl-badge-red',
};

const fmt = (d: string) => new Date(d).toLocaleDateString('fr-FR');

export default function ViewBookingModal({ isOpen, booking, onClose }: Props) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);

  if (!isOpen || !booking) return null;
  const badgeCls = STATUS_MAP[booking.status] || 'sl-badge-blue';

  return (
    <>
      <div className="sl-overlay">
        <div className="sl-panel sl-animate" style={{ maxWidth: 580 }}>
          <div className="sl-panel-header">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#1d4ed8,#2563eb)', boxShadow: '0 0 16px rgba(37,99,235,0.4)' }}>
                <FileText size={18} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base">Réservation #{booking.id}</h2>
                <span className={badgeCls}>{booking.status}</span>
              </div>
            </div>
            <button className="sl-close" onClick={onClose}><X size={16} /></button>
          </div>

          <div className="px-6 py-5 space-y-4">
            {/* Client */}
            <div className="sl-card space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--sl-muted)' }}>Client</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)' }}>
                  {booking.guestName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white">{booking.guestName}</p>
                  <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>{booking.guestEmail} · {booking.guestPhone}</p>
                </div>
              </div>
            </div>

            {/* Chambre & Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="sl-card space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--sl-muted)' }}>Chambre</p>
                <div className="flex items-center gap-2 text-sm"><BedDouble size={13} style={{ color: 'var(--sl-blue-2)' }} />#{booking.roomNumber}</div>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--sl-muted)' }}><MapPin size={11} />{booking.roomType}</div>
              </div>
              <div className="sl-card space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--sl-muted)' }}>Séjour</p>
                <div className="flex items-center gap-2 text-sm"><Calendar size={13} className="text-green-400" />{fmt(booking.checkInDate)}</div>
                <div className="flex items-center gap-2 text-sm"><Calendar size={13} className="text-red-400" />{fmt(booking.checkOutDate)}</div>
                <div className="text-xs text-blue-400 font-bold">{booking.nights} nuit{booking.nights > 1 ? 's' : ''}</div>
              </div>
            </div>

            {/* Finances */}
            <div className="grid grid-cols-3 gap-3">
              <div className="sl-stat">
                <div className="sl-stat-value text-blue-400">${(booking.pricePerNight||0).toLocaleString('fr-FR')}</div>
                <div className="sl-stat-label">Prix/nuit</div>
              </div>
              <div className="sl-stat">
                <div className="sl-stat-value text-green-400">${(booking.deposit||0).toLocaleString('fr-FR')}</div>
                <div className="sl-stat-label">Acompte</div>
              </div>
              <div className="sl-stat">
                <div className="sl-stat-value text-yellow-400">${(booking.balanceDue||0).toLocaleString('fr-FR')}</div>
                <div className="sl-stat-label">Solde</div>
              </div>
            </div>

            <div className="sl-card flex justify-between items-center" style={{ border: '1px solid rgba(37,99,235,0.3)', background: 'rgba(37,99,235,0.06)' }}>
              <span className="font-bold text-white">Total</span>
              <span className="text-xl font-black text-blue-400">${(booking.totalAmount||0).toLocaleString('fr-FR')}</span>
            </div>

            {booking.notes && (
              <div className="sl-card" style={{ borderLeft: '3px solid var(--sl-blue)', background: 'rgba(37,99,235,0.05)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--sl-muted)' }}>Notes</p>
                <p className="text-sm" style={{ color: 'var(--sl-text)' }}>{booking.notes}</p>
              </div>
            )}
          </div>

          <div className="sl-panel-footer flex gap-3">
            <button className="sl-btn-ghost" onClick={onClose}>Fermer</button>
            <button className="sl-btn-ghost flex-1" onClick={() => setIsPrintOpen(true)}><Printer size={15} />Imprimer</button>
            <button className="sl-btn-primary flex-1" onClick={() => setIsEditOpen(true)}><Edit2 size={15} />Modifier</button>
          </div>
        </div>
      </div>

      <EditBookingModal isOpen={isEditOpen} booking={booking} onSave={() => setIsEditOpen(false)} onDelete={() => { setIsEditOpen(false); onClose(); }} onClose={() => setIsEditOpen(false)} />
      <PrintPreviewModal isOpen={isPrintOpen} booking={booking} onClose={() => setIsPrintOpen(false)} />
    </>
  );
}
