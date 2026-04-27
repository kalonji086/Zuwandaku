'use client';

import { useState } from 'react';
import { FileText, Filter, DollarSign, Users, CheckCircle, Clock, XCircle, AlertCircle, Download } from 'lucide-react';
import { useContracts } from '../../../lib/hooks';
import { useGlobalStats } from '../../../lib/hooks/useGlobalStats';

const statusColors = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  TERMINATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusIcon = (status: string) => {
  switch (status) {
    case 'ACTIVE': return <CheckCircle size={14} />;
    case 'PENDING': return <Clock size={14} />;
    case 'CANCELLED': return <XCircle size={14} />;
    default: return <AlertCircle size={14} />;
  }
};

export default function TransactionsPage() {
  const [filterStatus, setFilterStatus] = useState('');
  const { data: contracts = [], isLoading } = useContracts({ status: filterStatus || undefined });
const globalStatsQuery = useGlobalStats();
const stats = globalStatsQuery.data;

  const filteredContracts = contracts.filter((c: any) => !filterStatus || c.status === filterStatus);
  const totalRevenue = filteredContracts.reduce((sum: number, c: any) => sum + c.amount, 0);
  const totalCommission = totalRevenue * 0.05; // 5% commission

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Transactions</h1>
          <p className="text-gray-400">Toutes les transactions de la plateforme</p>
        </div>
        <div className="flex items-center gap-2">
          <Download size={18} className="text-gray-400" />
          <span className="text-sm text-gray-400">Exporter CSV</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={20} className="text-emerald-400" />
            <span className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Volume</span>
          </div>
          <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users size={20} className="text-blue-400" />
            <span className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Contrats</span>
          </div>
          <p className="text-3xl font-bold text-white">{filteredContracts.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign size={20} className="text-green-400" />
            <span className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Commission (5%)</span>
          </div>
          <p className="text-3xl font-bold text-emerald-400">${Math.round(totalCommission).toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center gap-3 flex-wrap">
          <Filter size={20} className="text-gray-400" />
          <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
            {(['', 'ACTIVE', 'PENDING', 'TERMINATED', 'CANCELLED'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status === filterStatus ? '' : status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filterStatus === status
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {status || 'Tous'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      {filteredContracts.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-xl border border-gray-800">
          <FileText size={64} className="text-gray-600 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-300 mb-2">Aucune transaction</h3>
          <p className="text-gray-500 mb-8">Filtrez ou attendez de nouvelles transactions</p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Bien/Véhicule</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Propriétaire</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredContracts.map((contract: any) => (
                <tr key={contract.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-white">
                      {contract.property ? `${contract.property.type} — ${contract.property.ville?.nom}` : 
                       contract.vehicle ? `${contract.vehicle.marque} ${contract.vehicle.modele}` : '—'}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-white">{contract.client?.name}</div>
                    <div className="text-gray-400 text-sm">{contract.client?.phone}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-white">{contract.owner?.name || '—'}</div>
                    <div className="text-gray-400 text-sm">{contract.owner?.phone}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm">
                      {contract.type}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-emerald-400 font-bold text-lg">${contract.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-green-400 font-semibold">${Math.round(contract.amount * 0.05).toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium border ${statusColors[contract.status as keyof typeof statusColors]}`}>
                      {statusIcon(contract.status)}{contract.status}
                    </span>
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

