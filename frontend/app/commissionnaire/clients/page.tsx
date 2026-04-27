'use client';

import { Users, User, Phone, Mail, MapPin, DollarSign, TrendingUp } from 'lucide-react';
import { useContracts } from '../../../lib/hooks';

export default function ClientsPage() {
  const { data: contracts = [] } = useContracts();

  // Extract unique clients and owners from contracts
  const clients = Array.from(
    new Map(contracts.map((c: any) => [c.client?.id, c.client])).values()
  ).filter(Boolean) as any[];

  const owners = Array.from(
    new Map(contracts.map((c: any) => [c.owner?.id, c.owner])).values()
  ).filter(Boolean) as any[];

  const getClientStats = (clientId: string) => {
    const clientContracts = contracts.filter((c: any) => c.client?.id === clientId);
    return {
      totalSpent: clientContracts.reduce((sum: number, c: any) => sum + c.amount, 0),
      contractsCount: clientContracts.length,
      active: clientContracts.filter((c: any) => c.status === 'ACTIVE').length,
    };
  };

  const getOwnerStats = (ownerId: string) => {
    const ownerContracts = contracts.filter((c: any) => c.owner?.id === ownerId);
    return {
      totalRevenue: ownerContracts.filter((c: any) => c.status === 'ACTIVE').reduce((sum: number, c: any) => sum + c.amount, 0),
      contractsCount: ownerContracts.length,
    };
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Acteurs</h1>
        <span className="px-4 py-2 bg-emerald-600/20 text-emerald-400 text-sm font-semibold rounded-full border border-emerald-500/30">
          {clients.length + owners.length} participants
        </span>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Clients</p>
              <p className="text-3xl font-bold text-white">{clients.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={24} className="text-emerald-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Propriétaires</p>
              <p className="text-3xl font-bold text-white">{owners.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={24} className="text-purple-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Total dépensé</p>
              <p className="text-3xl font-bold text-purple-400">
                ${clients.reduce((sum: number, client: any) => {
                  return sum + getClientStats(client.id).totalSpent;
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={24} className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Revenus total</p>
              <p className="text-3xl font-bold text-yellow-400">
                ${owners.reduce((sum: number, owner: any) => {
                  return sum + getOwnerStats(owner.id).totalRevenue;
                }, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Clients */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <Users size={22} className="text-blue-400" />
            Top 8 Clients
          </h3>
          
          <div className="space-y-4">
            {clients.slice(0, 8).sort((a: any, b: any) => 
              getClientStats(b.id).totalSpent - getClientStats(a.id).totalSpent
            ).map((client: any, index: number) => {
              const stats = getClientStats(client.id);
              return (
                <div key={`client-${client.id || index}`} className="flex items-center gap-4 p-5 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all border border-gray-700/50">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{client.name}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        {client.email}
                      </div>
                      {client.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {client.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">${stats.totalSpent.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{stats.contractsCount} contrat{stats.contractsCount > 1 ? 's' : ''}</div>
                    <div className="text-xs text-gray-400">{stats.active} actif(s)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Owners */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <Users size={22} className="text-emerald-400" />
            Top Propriétaires
          </h3>
          
          <div className="space-y-4">
            {owners.slice(0, 8).sort((a: any, b: any) => 
              getOwnerStats(b.id).totalRevenue - getOwnerStats(a.id).totalRevenue
            ).map((owner: any, index: number) => {
              const stats = getOwnerStats(owner.id);
              return (
                <div key={`owner-${owner.id || index}`} className="flex items-center gap-4 p-5 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all border border-gray-700/50">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                    <User size={20} className="text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{owner.name}</div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      {owner.phone && (
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {owner.phone}
                        </div>
                      )}
                      {owner.email && (
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          {owner.email}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-yellow-400">${stats.totalRevenue.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">{stats.contractsCount} bien{stats.contractsCount > 1 ? 's' : ''}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Contracts by Client */}
      {contracts.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6">Contrats récents par client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.slice(0, 6).map((client: any, index: number) => {
              const recentContracts = contracts
                .filter((c: any) => c.client?.id === client.id)
                .slice(0, 2);
              const stats = getClientStats(client.id);
              return (
                <div key={`client-card-${client.id || index}`} className="bg-gray-800 rounded-xl p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <User size={20} className="text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white">{client.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        {client.phone && <span>📞 {client.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {recentContracts.map((contract: any) => (
                      <div key={contract.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                        <div className="text-sm">
                          {contract.property ? contract.property.type : contract.vehicle?.marque} 
                          {contract.property ? ` — ${contract.property.ville?.nom}` : ''}
                        </div>
                        <div className="text-emerald-400 font-semibold">
                          ${contract.amount.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-600">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Total dépensé</span>
                      <span className="font-bold text-emerald-400">${stats.totalSpent.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

