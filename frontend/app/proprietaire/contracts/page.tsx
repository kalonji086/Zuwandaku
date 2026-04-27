"use client";

import { useState } from 'react';
import { FileText, Eye, Download, CheckCircle, Clock, XCircle, AlertCircle, Filter } from 'lucide-react';
import { useContracts } from '../../../lib/hooks';
import ContractViewModal from '../../components/ContractViewModal';
import ContractDownloadModal from '../../components/ContractDownloadModal';

const contractStatusColor: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  TERMINATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

type ContractStatus = 'ACTIVE' | 'PENDING' | 'TERMINATED' | 'CANCELLED';

const contractStatusIcons = {
  ACTIVE: CheckCircle,
  PENDING: Clock,
  CANCELLED: XCircle,
  TERMINATED: AlertCircle,
};

const STATUS_LABELS: Record<ContractStatus, string> = {
  ACTIVE: 'Actif', PENDING: 'En attente', TERMINATED: 'Terminé', CANCELLED: 'Annulé',
};

export default function ProprietaireContracts() {
  const { data: contracts = [], isLoading } = useContracts({ role: 'PROPRIETAIRE' });
  const [viewContract, setViewContract] = useState<any>(null);
  const [downloadContract, setDownloadContract] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const counts = { ACTIVE: 0, PENDING: 0, TERMINATED: 0, CANCELLED: 0 } as Record<ContractStatus, number>;
  contracts.forEach((c: any) => { if (counts[c.status as ContractStatus] !== undefined) counts[c.status as ContractStatus]++; });

  const stats = [
    { label: 'Actifs', count: counts.ACTIVE, color: 'bg-green-500/20 text-green-400 border-green-500/30', Icon: CheckCircle },
    { label: 'En attente', count: counts.PENDING, color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', Icon: Clock },
    { label: 'Terminés', count: counts.TERMINATED, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', Icon: AlertCircle },
    { label: 'Annulés', count: counts.CANCELLED, color: 'bg-red-500/20 text-red-400 border-red-500/30', Icon: XCircle },
  ];

  const filtered = contracts.filter((c: any) => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterType && c.type !== filterType) return false;
    return true;
  });

  const types = [...new Set(contracts.map((c: any) => c.type as string))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes contrats</h1>
          <p className="text-gray-400">{contracts.length} contrat{contracts.length !== 1 ? 's' : ''} total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.color} border rounded-2xl p-5 hover:shadow-lg transition-all`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.count}</p>
              </div>
              <s.Icon size={28} className="opacity-40" />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3 flex-wrap">
        <Filter size={18} className="text-gray-400" />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Tous statuts</option>
          {(['ACTIVE', 'PENDING', 'TERMINATED', 'CANCELLED'] as ContractStatus[]).map(s => (
            <option key={s} value={s} className="bg-gray-900">{STATUS_LABELS[s]}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="">Tous types</option>
          {types.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
        </select>
        {(filterStatus || filterType) && (
          <button onClick={() => { setFilterStatus(''); setFilterType(''); }} className="text-xs text-gray-400 hover:text-white transition-colors">
            Réinitialiser
          </button>
        )}
        <span className="ml-auto text-sm text-gray-500">{filtered.length} résultat{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 bg-gray-900 rounded-xl border border-gray-800 border-dashed">
          <FileText size={56} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">Aucun contrat</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-sm">
            Vos contrats apparaîtront ici une fois que des clients auront effectué une réservation.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((contract: any) => {
            const StatusIcon = contractStatusIcons[contract.status as ContractStatus] ?? AlertCircle;
            return (
              <div key={contract.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-white truncate">{contract.title || 'Contrat'}</h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {contract.client?.name ?? 'Client'} · {new Date(contract.startDate).toLocaleDateString('fr-FR')}
                      </p>
                      <div className="flex items-center gap-4 mt-3 text-sm flex-wrap">
                        <span className="text-emerald-400 font-bold">{contract.amount?.toLocaleString()} {contract.currency ?? 'USD'}</span>
                        <span className="text-gray-500">{contract.type}</span>
                        {contract.property && <span className="text-gray-500">{contract.property.type} — {contract.property.ville?.nom}</span>}
                        {contract.vehicle && <span className="text-gray-500">{contract.vehicle.marque} {contract.vehicle.modele}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold ${contractStatusColor[contract.status]}`}>
                      <StatusIcon size={13} />
                      {STATUS_LABELS[contract.status as ContractStatus] ?? contract.status}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewContract(contract)}
                        className="flex items-center gap-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-3 py-2 rounded-xl text-sm transition-colors"
                      >
                        <Eye size={15} /> Voir
                      </button>
                      <button
                        onClick={() => setDownloadContract(contract)}
                        className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                      >
                        <Download size={15} /> Exporter
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ContractViewModal
        contract={viewContract}
        onClose={() => setViewContract(null)}
        onDownload={(c) => { setViewContract(null); setDownloadContract(c); }}
      />
      <ContractDownloadModal
        contract={downloadContract}
        onClose={() => setDownloadContract(null)}
      />
    </div>
  );
}
