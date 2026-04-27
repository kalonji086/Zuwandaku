'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home, Car, FileText, Users, User, TrendingUp,
  DollarSign, CheckCircle, Clock, XCircle, AlertCircle,
  BarChart3, Activity, MapPin, Phone, Mail, MessageSquare, Send, X,
} from 'lucide-react';
import ProfilePhotoModal from '../components/ProfilePhotoModal';
import NotificationBell from '../components/NotificationBell';
import { useContracts, useProperties, useVehicles } from '../../lib/hooks';
import { useGlobalStats } from '../../lib/hooks/useGlobalStats';

const contractStatusColor: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  TERMINATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const contractStatusIcon = (s: string) =>
  s === 'ACTIVE' ? <CheckCircle size={14} /> :
  s === 'PENDING' ? <Clock size={14} /> :
  s === 'CANCELLED' ? <XCircle size={14} /> :
  <AlertCircle size={14} />;

// Commission rate: 5% sur chaque transaction
const COMMISSION_RATE = 0.05;

type Tab = 'overview' | 'transactions' | 'biens' | 'clients';

export default function CommissionnaireDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const user = { name: 'Commissionnaire', email: 'commissionnaire@zuwandaku.com', role: 'COMMISSIONNAIRE' };
  const [contractFilter, setContractFilter] = useState('');
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [messages, setMessages] = useState<{ text: string; isMe: boolean; time: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const router = useRouter();

  const { data: contracts = [], isLoading: loadingContracts } = useContracts();
  const { data: properties = [], isLoading: loadingProps } = useProperties();
  const { data: vehicles = [], isLoading: loadingVehs } = useVehicles();
const globalStatsQuery = useGlobalStats();
const stats = globalStatsQuery.data;

  // Ensure arrays
  const contractsArray = Array.isArray(contracts) ? contracts : [];
  const propertiesArray = Array.isArray(properties) ? properties : [];
  const vehiclesArray = Array.isArray(vehicles) ? vehicles : [];



  const totalRevenue = stats?.totalRevenue ?? contractsArray.filter((c: any) => c.status === 'ACTIVE').reduce((s: number, c: any) => s + c.amount, 0);
  const totalCommission = totalRevenue * COMMISSION_RATE;
  const activeContracts = contractsArray.filter((c: any) => c.status === 'ACTIVE');
  const pendingContracts = contractsArray.filter((c: any) => c.status === 'PENDING');

  // Clients uniques extraits des contrats
  const uniqueClients = Array.from(
    new Map(contractsArray.map((c: any) => [c.client?.id, c.client])).values()
  ).filter(Boolean);

  // Propriétaires uniques
  const uniqueOwners = Array.from(
    new Map(contractsArray.map((c: any) => [c.owner?.id, c.owner])).values()
  ).filter(Boolean);

  const filteredContracts = contractFilter
    ? contractsArray.filter((c: any) => c.status === contractFilter)
    : contractsArray;

  // Répartition par type de bien
  const propsByType = (propertiesArray).reduce((acc: any, p: any) => {
    acc[p.type] = (acc[p.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-8 w-full max-w-4xl border border-gray-800 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1 min-w-max">
            {([
              { id: 'overview' as Tab, label: 'Vue globale', icon: <Activity size={16} /> },
              { id: 'transactions' as Tab, label: `Transactions (${contractsArray.length})`, icon: <FileText size={16} /> },
              { id: 'biens' as Tab, label: `Biens & Véhicules`, icon: <Home size={16} /> },
              { id: 'clients' as Tab, label: `Clients (${uniqueClients.length})`, icon: <Users size={16} /> },
              { id: 'acteurs' as Tab, label: `Acteurs (${uniqueOwners.length})`, icon: <Users size={16} /> },
            ]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                  ${tab === t.id ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                {t.icon}{t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            {/* KPIs principaux */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Volume total', value: `$${totalRevenue.toLocaleString()}`, icon: <DollarSign size={20} />, color: 'from-emerald-600 to-emerald-700', sub: 'Contrats actifs' },
                { label: 'Commissions (5%)', value: `$${totalCommission.toLocaleString()}`, icon: <TrendingUp size={20} />, color: 'from-blue-600 to-blue-700', sub: 'Revenus commissionnaire' },
                { label: 'Contrats actifs', value: activeContracts.length, icon: <CheckCircle size={20} />, color: 'from-green-600 to-green-700', sub: `${pendingContracts.length} en attente` },
                { label: 'Biens & Véhicules', value: (stats?.totalProperties ?? propertiesArray.length) + (stats?.totalVehicles ?? vehiclesArray.length), icon: <Home size={20} />, color: 'from-purple-600 to-purple-700', sub: `${stats?.totalProperties ?? propertiesArray.length} biens · ${stats?.totalVehicles ?? vehiclesArray.length} véhicules` },
              ].map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-5`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70 uppercase tracking-wider">{s.label}</span>
                    <span className="text-white/60">{s.icon}</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs text-white/60 mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Répartition biens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Home size={18} className="text-emerald-400" />Répartition des biens</h2>
                <div className="space-y-3">
                  {Object.entries(propsByType).map(([type, count]: any) => {
                    const pct = Math.round((count / propertiesArray.length) * 100);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-300">{type}</span>
                          <span className="text-gray-400">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  {propertiesArray.length === 0 && <p className="text-gray-500 text-sm">Aucun bien enregistré</p>}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Activity size={18} className="text-blue-400" />Statut des contrats</h2>
                <div className="space-y-3">
                  {(['ACTIVE', 'PENDING', 'TERMINATED', 'CANCELLED'] as const).map(status => {
                    const count = contracts.filter((c: any) => c.status === status).length;
                    const pct = contracts.length ? Math.round((count / contracts.length) * 100) : 0;
                    const barColor = { ACTIVE: 'bg-green-500', PENDING: 'bg-yellow-500', TERMINATED: 'bg-gray-500', CANCELLED: 'bg-red-500' }[status];
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-300">{status}</span>
                          <span className="text-gray-400">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Dernières transactions */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-400" />Dernières transactions</h2>
              {loadingContracts ? <p className="text-gray-500 text-sm">Chargement...</p> : (
                <div className="space-y-2">
                  {contracts.slice(0, 6).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {c.property ? `${c.property.type} — ${c.property.ville?.nom}` : c.vehicle ? `${c.vehicle.marque} ${c.vehicle.modele}` : 'Contrat'}
                        </p>
                        <p className="text-xs text-gray-400">{c.client?.name} → {c.owner?.name} · {c.type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-400">${c.amount.toLocaleString()}</p>
                          <p className="text-xs text-emerald-500">+${(c.amount * COMMISSION_RATE).toFixed(0)} comm.</p>
                        </div>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${contractStatusColor[c.status]}`}>
                          {contractStatusIcon(c.status)}{c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transactions */}
        {tab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold text-white">Toutes les transactions</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Filtrer:</span>
                {['', 'ACTIVE', 'PENDING', 'TERMINATED', 'CANCELLED'].map(s => (
                  <button key={s} onClick={() => setContractFilter(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                      ${contractFilter === s ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
                    {s || 'Tous'}
                  </button>
                ))}
              </div>
            </div>

            {/* Résumé financier */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Volume filtré</p>
                <p className="text-xl font-extrabold text-white">${filteredContracts.reduce((s: number, c: any) => s + c.amount, 0).toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Commissions (5%)</p>
                <p className="text-xl font-extrabold text-emerald-400">${(filteredContracts.reduce((s: number, c: any) => s + c.amount, 0) * COMMISSION_RATE).toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Nombre</p>
                <p className="text-xl font-extrabold text-white">{filteredContracts.length}</p>
              </div>
            </div>

            {loadingContracts ? <p className="text-gray-500">Chargement...</p> : filteredContracts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                <FileText size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Aucune transaction</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Bien / Véhicule</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Propriétaire</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-right">Montant</th>
                      <th className="px-4 py-3 text-right">Commission</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {filteredContracts.map((c: any) => (
                      <tr key={c.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          {c.property ? `${c.property.type} — ${c.property.ville?.nom}` : c.vehicle ? `${c.vehicle.marque} ${c.vehicle.modele}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white">{c.client?.name}</p>
                          <p className="text-gray-500 text-xs">{c.client?.phone}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white">{c.owner?.name ?? '—'}</p>
                          <p className="text-gray-500 text-xs">{c.owner?.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{c.type}</td>
                        <td className="px-4 py-3 text-right text-green-400 font-bold">${c.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-semibold">${(c.amount * COMMISSION_RATE).toFixed(0)}</td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit text-xs px-2 py-1 rounded-full border ${contractStatusColor[c.status]}`}>
                            {contractStatusIcon(c.status)}{c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.createdAt).toLocaleDateString('fr-FR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Biens & Véhicules */}
        {tab === 'biens' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Biens */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Home size={18} className="text-blue-400" />Biens immobiliers ({propertiesArray.length})</h2>
                {loadingProps ? <p className="text-gray-500 text-sm">Chargement...</p> : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {propertiesArray.map((p: any) => (
                      <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white text-sm">{p.type} — {p.ville?.nom}</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />{p.province?.nom}
                              {p.owner && <span className="ml-2">· {p.owner.name}</span>}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-bold text-sm">${p.price.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                              p.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400' :
                              p.status === 'RENTED' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-gray-500/20 text-gray-400'
                            }`}>{p.status}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {propertiesArray.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Aucun bien</p>}
                  </div>
                )}
              </div>

              {/* Véhicules */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Car size={18} className="text-purple-400" />Véhicules ({vehiclesArray.length})</h2>
                {loadingVehs ? <p className="text-gray-500 text-sm">Chargement...</p> : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {vehiclesArray.map((v: any) => (
                      <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-all">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-white text-sm">{v.marque} {v.modele} ({v.annee})</p>
                            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                              <MapPin size={10} />{v.ville?.nom}
                              {v.owner && <span className="ml-2">· {v.owner.name}</span>}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-purple-400 font-bold text-sm">
                              {v.pricePerDay ? `$${v.pricePerDay}/j` : `$${v.priceSale?.toLocaleString()}`}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${v.availability ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {v.availability ? 'Dispo' : 'Indispo'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {vehiclesArray.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Aucun véhicule</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Acteurs */}
        {tab === 'clients' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Clients */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Users size={18} className="text-blue-400" />Clients ({uniqueClients.length})
                </h2>
                <div className="space-y-2">
{uniqueClients.map((client: any) => {
                    const clientContracts = contracts.filter((c: any) => c.client?.id === client.id);
                    const totalSpent = clientContracts.reduce((s: number, c: any) => s + c.amount, 0);
                    return (
                      <div key={client.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-emerald-600 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <User size={16} className="text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-white truncate">{client.name}</p>
                              <div className="flex flex-col gap-1 text-xs text-gray-400 mt-1">
                                {client.email && <span className="flex items-center gap-1"><Mail size={10} />{client.email}</span>}
                                {client.phone && <span className="flex items-center gap-1"><Phone size={10} />{client.phone}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <p className="text-green-400 font-bold text-sm text-right">${totalSpent.toLocaleString()}</p>
                            <p className="text-xs text-gray-500 text-right w-20">{clientContracts.length} contrats</p>
                            <div className="flex gap-1">
                              <a href={`tel:${client.phone}`} className="p-2 hover:bg-emerald-600/20 rounded-lg transition-colors">
                                <Phone size={16} className="text-emerald-400" />
                              </a>
                              <button onClick={() => setSelectedClient(client)} className="p-2 hover:bg-blue-600/20 rounded-lg transition-colors">
                                <MessageSquare size={16} className="text-blue-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {uniqueClients.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Aucun client</p>}
                </div>
              </div>

              {/* Propriétaires */}
              <div>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Home size={18} className="text-emerald-400" />Propriétaires ({uniqueOwners.length})
                </h2>
                <div className="space-y-2">
                  {uniqueOwners.map((owner: any) => {
                    const ownerContracts = contracts.filter((c: any) => c.owner?.id === owner.id);
                    const totalRevenue = ownerContracts.filter((c: any) => c.status === 'ACTIVE').reduce((s: number, c: any) => s + c.amount, 0);
                    return (
                      <div key={owner.id} className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 hover:border-gray-700 transition-all">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-emerald-600/20 rounded-full flex items-center justify-center">
                              <User size={16} className="text-emerald-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{owner.name}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                {owner.email && <span className="flex items-center gap-1"><Mail size={10} />{owner.email}</span>}
                                {owner.phone && <a href={`tel:${owner.phone}`} className="flex items-center gap-1 hover:text-emerald-400 transition-colors"><Phone size={10} />{owner.phone}</a>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-emerald-400 font-bold text-sm">${totalRevenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{ownerContracts.length} contrat{ownerContracts.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {uniqueOwners.length === 0 && <p className="text-gray-500 text-sm text-center py-8">Aucun propriétaire</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ProfilePhotoModal 
        isOpen={showProfilePhotoModal} 
        onClose={() => setShowProfilePhotoModal(false)}
        onUpload={(file) => {
          console.log("Photo téléchargée:", file);
        }}
      />
      {/* Client Chat Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <User size={18} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-bold text-white">{selectedClient.name}</p>
                  <p className="text-xs text-gray-400">{selectedClient.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <a href={`tel:${selectedClient.phone}`} className="p-2 hover:bg-emerald-600/20 rounded-lg transition-colors">
                  <Phone size={18} className="text-emerald-400" />
                </a>
                <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl ${msg.isMe ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-white'}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && e.shiftKey === false && sendMessage()}
                  placeholder="Tapez votre message..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                  rows={1}
                />
                <button onClick={sendMessage} className="w-12 bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center justify-center transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const sendMessage = () => {
  if (!chatInput.trim()) return;
  const newMsg = { text: chatInput, isMe: true, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
  setMessages(prev => [...prev, newMsg]);
  setChatInput('');
  // Mock response
  setTimeout(() => {
    const response = { text: `Merci pour votre message ${user.name}! Je vous réponds sous peu.`, isMe: false, time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, response]);
  }, 1500);
};
