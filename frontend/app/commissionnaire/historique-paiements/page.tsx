'use client';

import { useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle, DollarSign, TrendingUp, Filter } from 'lucide-react';
import { useContracts } from '../../../lib/hooks';

const COMMISSION_RATE = 0.05;

type StatusFilter = '' | 'ACTIVE' | 'PENDING' | 'TERMINATED' | 'CANCELLED';

const statusStyles: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  TERMINATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'ACTIVE') return <CheckCircle size={13} />;
  if (status === 'PENDING') return <Clock size={13} />;
  if (status === 'CANCELLED') return <XCircle size={13} />;
  return <Clock size={13} />;
};

export default function HistoriquePaiementsPage() {
  const [filter, setFilter] = useState<StatusFilter>('');
  const { data: contracts = [], isLoading } = useContracts({});

  const filtered = filter ? contracts.filter((c: any) => c.status === filter) : contracts;
  const totalVolume = filtered.reduce((s: number, c: any) => s + c.amount, 0);
  const totalCommission = totalVolume * COMMISSION_RATE;
  const versees = filtered.filter((c: any) => c.status === 'ACTIVE').reduce((s: number, c: any) => s + c.amount * COMMISSION_RATE, 0);
  const enAttente = filtered.filter((c: any) => c.status === 'PENDING').reduce((s: number, c: any) => s + c.amount * COMMISSION_RATE, 0);

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CreditCard size={22} className="text-blue-400" /> Historique paiements
        </h1>
        <p className="text-gray-400 mt-1">Suivi des commissions versées et en attente</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total commissions', value: `${Math.round(totalCommission).toLocaleString()} CDF`, icon: <DollarSign size={20} />, color: 'text-white' },
          { label: 'Versées', value: `${Math.round(versees).toLocaleString()} CDF`, icon: <CheckCircle size={20} />, color: 'text-green-400' },
          { label: 'En attente', value: `${Math.round(enAttente).toLocaleString()} CDF`, icon: <TrendingUp size={20} />, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-sm text-gray-400">{s.label}</span></div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <Filter size={16} className="text-gray-400" />
        <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
          {(['', 'ACTIVE', 'PENDING', 'TERMINATED', 'CANCELLED'] as StatusFilter[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === s ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {s || 'Tous'}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} entrée{filtered.length > 1 ? 's' : ''}</span>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
          <CreditCard size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucun paiement trouvé</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Contrat</th>
                <th className="px-5 py-3 text-left">Client</th>
                <th className="px-5 py-3 text-left">Type</th>
                <th className="px-5 py-3 text-right">Montant</th>
                <th className="px-5 py-3 text-right">Commission</th>
                <th className="px-5 py-3 text-left">Statut</th>
                <th className="px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((c: any) => (
                <tr key={c.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-4 text-white font-medium">
                    {c.property
                      ? `${c.property.type} — ${c.property.ville?.nom}`
                      : c.vehicle
                      ? `${c.vehicle.marque} ${c.vehicle.modele}`
                      : `#${c.id.slice(0, 8)}`}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-white">{c.client?.name ?? '—'}</p>
                    <p className="text-gray-500 text-xs">{c.client?.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">{c.type}</span>
                  </td>
                  <td className="px-5 py-4 text-right text-emerald-400 font-bold">{c.amount.toLocaleString()} CDF</td>
                  <td className="px-5 py-4 text-right text-blue-400 font-semibold">{Math.round(c.amount * COMMISSION_RATE).toLocaleString()} CDF</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1 w-fit text-xs px-2 py-1 rounded-full border ${statusStyles[c.status]}`}>
                      <StatusIcon status={c.status} />{c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
