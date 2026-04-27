'use client';

import { FileText, CheckCircle, Clock, XCircle, AlertCircle, Phone, Download, MapPin, User } from 'lucide-react';
import Link from 'next/link';
import { useContracts } from '../../../lib/hooks';

const statusColor: Record<string, string> = {
  ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  TERMINATED: 'bg-white/5 text-white/30 border-white/10',
  CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const statusIcon = (s: string) =>
  s === 'ACTIVE' ? <CheckCircle size={12} /> :
  s === 'PENDING' ? <Clock size={12} /> :
  s === 'CANCELLED' ? <XCircle size={12} /> :
  <AlertCircle size={12} />;

export default function ClientContracts() {
  const { data: contracts = [], isLoading } = useContracts({ role: 'CLIENT' });

  const active = contracts.filter((c: any) => c.status === 'ACTIVE');
  const pending = contracts.filter((c: any) => c.status === 'PENDING');

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white/90">Mes contrats</h1>
          <p className="text-xs text-white/30 mt-0.5">Historique de vos locations et achats</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-white/30">
          <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-emerald-400" />{active.length} actifs</span>
          <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-400" />{pending.length} en attente</span>
        </div>
      </div>

      {contracts.length === 0 ? (
        <div className="text-center py-24 rounded-2xl border border-white/5 bg-[#0d0d14]">
          <FileText size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 font-semibold mb-2">Aucun contrat</p>
          <p className="text-white/20 text-sm mb-6">Commencez par rechercher un bien ou véhicule.</p>
          <Link href="/client/search"
            className="inline-flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/15 text-blue-400 border border-blue-500/20 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all">
            Rechercher
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {contracts.map((c: any) => (
            <div key={c.id} className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full font-semibold border ${statusColor[c.status] ?? statusColor.TERMINATED}`}>
                      {statusIcon(c.status)}{c.status}
                    </span>
                    <span className="text-[10px] text-white/25 bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">{c.type}</span>
                  </div>

                  <h2 className="text-base font-bold text-white/80 mb-2">
                    {c.property
                      ? `${c.property.type} — ${c.property.ville?.nom}`
                      : c.vehicle
                      ? `${c.vehicle.marque} ${c.vehicle.modele}`
                      : 'Contrat'}
                  </h2>

                  <div className="space-y-1">
                    {c.property && (
                      <p className="flex items-center gap-1.5 text-xs text-white/30">
                        <MapPin size={11} />
                        {c.property.quartier?.nom ? `${c.property.quartier.nom}, ` : ''}{c.property.ville?.nom}
                      </p>
                    )}
                    {c.owner && (
                      <div className="flex items-center gap-2 text-xs text-white/30">
                        <User size={11} />
                        <span>Propriétaire: <span className="text-white/50 font-medium">{c.owner.name}</span></span>
                        {c.owner.phone && (
                          <a href={`tel:${c.owner.phone}`} className="flex items-center gap-1 text-blue-400 hover:text-blue-300 ml-1">
                            <Phone size={11} />{c.owner.phone}
                          </a>
                        )}
                      </div>
                    )}
                    {(c.startDate || c.endDate) && (
                      <p className="text-xs text-white/20">
                        Du {c.startDate ? new Date(c.startDate).toLocaleDateString('fr-FR') : '—'}
                        {c.endDate ? ` au ${new Date(c.endDate).toLocaleDateString('fr-FR')}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-bold text-blue-400 mb-0.5">${c.amount?.toLocaleString()}</div>
                  <div className="text-[10px] text-white/25">{c.currency}</div>
                  {c.id && (
                    <Link href={`/documents/contract/${c.id}`}
                      className="flex items-center gap-1 mt-3 text-[10px] bg-white/5 hover:bg-white/8 text-white/30 hover:text-white/50 border border-white/5 px-3 py-1.5 rounded-lg transition-colors w-fit ml-auto">
                      <Download size={11} />PDF
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
