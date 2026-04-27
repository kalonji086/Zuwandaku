"use client";

import { X, BarChart3, TrendingUp, Users, DollarSign, Download, Calendar } from 'lucide-react';

export interface Report { id:string; title:string; type:'revenue'|'occupation'|'clients'|'bookings'; period:string; startDate:string; endDate:string; metrics:Record<string,number>; data:any[]; notes:string; createdAt:string; }
interface Props { isOpen:boolean; report:Report|null; onClose:()=>void; }

const TYPE_CONFIG = {
  revenue:    { label:'Revenus',      color:'#10b981', icon: DollarSign },
  occupation: { label:'Occupation',   color:'#3b82f6', icon: BarChart3 },
  clients:    { label:'Clients',      color:'#8b5cf6', icon: Users },
  bookings:   { label:'Réservations', color:'#f59e0b', icon: TrendingUp },
};

export default function ReportDetailsModal({ isOpen, report, onClose }: Props) {
  if (!isOpen || !report) return null;
  const cfg = TYPE_CONFIG[report.type];
  const Icon = cfg.icon;

  const metricEntries = Object.entries(report.metrics).filter(([,v]) => v !== undefined && v !== null);

  const metricLabel: Record<string,string> = {
    totalRevenue:'Revenus totaux', avgDaily:'Moy. journalière', growth:'Croissance (%)',
    avgOccupation:'Occupation moy.', peakDay:'Pic (%)', lowDay:'Creux (%)',
    totalClients:'Total clients', newClients:'Nouveaux', repeat:'Fidèles',
    totalBookings:'Réservations', avgStay:'Durée moy. (j)', cancellation:'Annulations',
  };

  return (
    <div className="sl-overlay">
      <div className="sl-panel sl-animate" style={{ maxWidth: 640 }}>
        <div className="sl-panel-header">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg,${cfg.color}cc,${cfg.color})`, boxShadow: `0 0 16px ${cfg.color}40` }}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white">{report.title}</h2>
              <p className="text-xs" style={{ color: 'var(--sl-muted)' }}>{report.period}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="sl-badge-blue">{cfg.label}</span>
            <button className="sl-close" onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Métriques */}
          <div className="grid grid-cols-3 gap-3">
            {metricEntries.map(([key, val]) => (
              <div key={key} className="sl-stat" style={{ borderColor: `${cfg.color}30`, background: `${cfg.color}08` }}>
                <div className="sl-stat-value" style={{ color: cfg.color, fontSize: '1.5rem' }}>
                  {key.includes('Revenue') || key.includes('Daily') ? `$${Number(val).toLocaleString('fr-FR')}` : `${Number(val).toLocaleString('fr-FR')}${key.includes('Occupation') || key.includes('Day') || key.includes('growth') ? '%' : ''}`}
                </div>
                <div className="sl-stat-label">{metricLabel[key] || key}</div>
              </div>
            ))}
          </div>

          {/* Graphique simulé */}
          <div className="sl-card">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--sl-muted)' }}>Évolution sur la période</p>
            <div className="flex items-end gap-1 h-24">
              {Array.from({ length: 20 }, (_, i) => {
                const h = 20 + Math.random() * 80;
                return (
                  <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{ height: `${h}%`, background: `linear-gradient(to top, ${cfg.color}80, ${cfg.color})`, minWidth: 4 }} />
                );
              })}
            </div>
            <div className="flex justify-between text-xs mt-2" style={{ color: 'var(--sl-muted)' }}>
              <span>{report.startDate}</span><span>{report.endDate}</span>
            </div>
          </div>

          {/* Infos */}
          <div className="sl-card space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--sl-muted)' }}>Informations</p>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-text)' }}>
              <Calendar size={13} style={{ color: 'var(--sl-blue-2)' }} />Créé le {new Date(report.createdAt).toLocaleDateString('fr-FR')}
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--sl-text)' }}>
              <Icon size={13} style={{ color: cfg.color }} />Type : {cfg.label}
            </div>
          </div>

          {report.notes && (
            <div className="sl-card" style={{ borderLeft: `3px solid ${cfg.color}`, background: `${cfg.color}08` }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--sl-muted)' }}>Observations</p>
              <p className="text-sm" style={{ color: 'var(--sl-text)' }}>{report.notes}</p>
            </div>
          )}
        </div>

        <div className="sl-panel-footer flex gap-3">
          <button className="sl-btn-ghost flex-1" onClick={onClose}>Fermer</button>
          <button className="sl-btn-primary flex-1"><Download size={15} />Exporter PDF</button>
        </div>
      </div>
    </div>
  );
}
