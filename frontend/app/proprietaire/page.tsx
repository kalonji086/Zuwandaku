'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Home, Car, FileText, Plus, User, TrendingUp,
  DollarSign, Eye, Edit, Trash2, CheckCircle, Clock, XCircle, AlertCircle, MessageSquare,
} from 'lucide-react';
import PublishBienModal from '../components/PublishBienModal';
import AddVehicleModal from '../components/AddVehicleModal';
import ProfilePhotoModal from '../components/ProfilePhotoModal';
import NotificationBell from '../components/NotificationBell';
import ViewPropertyModal from '../components/ViewPropertyModal';
import ViewVehicleModal from '../components/ViewVehicleModal';
import ContactModal from '../components/ContactModal';
import DeletePropertyModal from '../components/DeletePropertyModal';
import DeleteVehicleModal from '../components/DeleteVehicleModal';
import { useMyProperties, useMyVehicles, useContracts, useOwnerStats, useUpdateContract, useDeleteProperty, useDeleteVehicle } from '../../lib/hooks/index.ts';

const statusColor: Record<string, string> = {
  AVAILABLE: 'bg-green-500/20 text-green-400 border-green-500/30',
  RENTED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  SOLD: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  RESERVED: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

const contractStatusColor: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400',
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  TERMINATED: 'bg-gray-500/20 text-gray-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

const contractStatusIcon = (s: string) =>
  s === 'ACTIVE' ? <CheckCircle size={14} /> :
  s === 'PENDING' ? <Clock size={14} /> :
  s === 'CANCELLED' ? <XCircle size={14} /> :
  <AlertCircle size={14} />;

type Tab = 'overview' | 'properties' | 'vehicles' | 'contracts';

export default function ProprietaireDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const user = { name: 'Propriétaire', email: 'proprietaire@zuwandaku.com', role: 'PROPRIETAIRE' };
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);
  
  // Modales pour Vue d'ensemble
  const [viewPropertyModal, setViewPropertyModal] = useState<any>(null);
  const [viewVehicleModal, setViewVehicleModal] = useState<any>(null);
  const [contactModal, setContactModal] = useState<any>(null);
  const [deletePropertyModal, setDeletePropertyModal] = useState<any>(null);
  const [deleteVehicleModal, setDeleteVehicleModal] = useState<any>(null);

  const { data: properties = [], isLoading: loadingProps } = useMyProperties();
  const { data: vehicles = [], isLoading: loadingVehs } = useMyVehicles();
  const { data: contracts = [], isLoading: loadingContracts } = useContracts({ role: 'PROPRIETAIRE' });
  const { data: stats } = useOwnerStats();
  const updateContract = useUpdateContract();
  const deleteProperty = useDeleteProperty();
  const deleteVehicle = useDeleteVehicle();

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: <TrendingUp size={16} /> },
    { id: 'properties', label: `Biens (${properties.length})`, icon: <Home size={16} /> },
    { id: 'vehicles', label: `Véhicules (${vehicles.length})`, icon: <Car size={16} /> },
    { id: 'contracts', label: `Contrats (${contracts.length})`, icon: <FileText size={16} /> },
  ];

  return (
    <div className="text-white">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 rounded-xl p-1 mb-8 w-fit">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${tab === t.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Biens publiés', value: stats?.properties ?? properties.length, icon: <Home size={20} />, color: 'from-blue-600 to-blue-700' },
                { label: 'Véhicules', value: stats?.vehicles ?? vehicles.length, icon: <Car size={20} />, color: 'from-purple-600 to-purple-700' },
                { label: 'Contrats actifs', value: contracts.filter((c: any) => c.status === 'ACTIVE').length, icon: <FileText size={20} />, color: 'from-green-600 to-green-700' },
                { label: 'Revenus actifs', value: `$${(stats?.revenue ?? 0).toLocaleString()}`, icon: <DollarSign size={20} />, color: 'from-orange-600 to-orange-700' },
              ].map(s => (
                <div key={s.label} className={`bg-gradient-to-br ${s.color} rounded-xl p-5`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/70 uppercase tracking-wider">{s.label}</span>
                    <span className="text-white/60">{s.icon}</span>
                  </div>
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Contrats récents */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="font-bold text-white mb-4 flex items-center gap-2"><FileText size={18} className="text-blue-400" />Contrats récents</h2>
              {loadingContracts ? <p className="text-gray-500 text-sm">Chargement...</p> : contracts.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">Aucun contrat pour le moment</p>
              ) : (
                <div className="space-y-3">
                  {contracts.slice(0, 5).map((c: any) => (
                    <div key={c.id} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {c.property ? `${c.property.type} — ${c.property.ville?.nom}` : c.vehicle ? `${c.vehicle.marque} ${c.vehicle.modele}` : 'Contrat'}
                        </p>
                        <p className="text-xs text-gray-400">Client: {c.client?.name} · {c.type}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-green-400">${c.amount.toLocaleString()}</span>
                        <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${contractStatusColor[c.status]}`}>
                          {contractStatusIcon(c.status)}{c.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setShowPublishModal(true)} className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-blue-500 rounded-xl p-5 transition-all group">
                <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600/40 transition-colors">
                  <Plus size={22} className="text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white">Publier un bien</p>
                  <p className="text-sm text-gray-400">Maison, parcelle, appartement...</p>
                </div>
              </button>
              <button onClick={() => setShowVehicleModal(true)} className="flex items-center gap-4 bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 transition-all group">
                <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center group-hover:bg-purple-600/40 transition-colors">
                  <Plus size={22} className="text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Ajouter un véhicule</p>
                  <p className="text-sm text-gray-400">Location ou vente</p>
                </div>
              </button>
            </div>

            {/* Biens récents */}
            {properties.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Home size={18} className="text-blue-400" />Biens ({properties.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {properties.slice(0, 3).map((p: any) => (
                    <div key={p.id} className="bg-gray-800 rounded-lg overflow-hidden hover:border-blue-500 border border-gray-700 transition-all">
                      <div className="h-24 bg-gray-700 flex items-center justify-center overflow-hidden">
                        {p.photos?.[0] ? (
                          <img src={p.photos[0]} alt={p.type} className="w-full h-full object-cover" />
                        ) : (
                          <Home size={24} className="text-gray-600" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-white truncate">{p.type} — {p.ville?.nom}</p>
                        <p className="text-blue-400 font-bold text-sm">${p.price.toLocaleString()}</p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <button 
                            onClick={() => setViewPropertyModal(p)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded transition-colors">
                            <Eye size={11} />Voir
                          </button>
                          <button 
                            onClick={() => setContactModal({ ...p, _kind: 'property' })}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-blue-300 hover:text-blue-200 bg-blue-500/20 hover:bg-blue-500/30 px-2 py-1.5 rounded transition-colors">
                            <MessageSquare size={11} />Contacter
                          </button>
                          <button 
                            onClick={() => setDeletePropertyModal(p)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-red-300 hover:text-red-200 bg-red-500/20 hover:bg-red-500/30 px-2 py-1.5 rounded transition-colors">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Véhicules récents */}
            {vehicles.length > 0 && (
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
                <h2 className="font-bold text-white mb-4 flex items-center gap-2"><Car size={18} className="text-purple-400" />Véhicules ({vehicles.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vehicles.slice(0, 2).map((v: any) => (
                    <div key={v.id} className="bg-gray-800 rounded-lg overflow-hidden hover:border-purple-500 border border-gray-700 transition-all">
                      <div className="h-24 bg-gray-700 flex items-center justify-center overflow-hidden">
                        {v.photos?.[0] ? (
                          <img src={v.photos[0]} alt={v.marque} className="w-full h-full object-cover" />
                        ) : (
                          <Car size={24} className="text-gray-600" />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-semibold text-white truncate">{v.marque} {v.modele} ({v.annee})</p>
                        <p className="text-purple-400 font-bold text-sm">
                          {v.pricePerDay ? `$${v.pricePerDay}/jour` : ''}{v.priceSale ? ` · $${v.priceSale.toLocaleString()}` : ''}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2">
                          <button 
                            onClick={() => setViewVehicleModal(v)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1.5 rounded transition-colors">
                            <Eye size={11} />Voir
                          </button>
                          <button 
                            onClick={() => setContactModal({ ...v, _kind: 'vehicle' })}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-purple-300 hover:text-purple-200 bg-purple-500/20 hover:bg-purple-500/30 px-2 py-1.5 rounded transition-colors">
                            <MessageSquare size={11} />Contacter
                          </button>
                          <button 
                            onClick={() => setDeleteVehicleModal(v)}
                            className="flex-1 flex items-center justify-center gap-1 text-xs text-red-300 hover:text-red-200 bg-red-500/20 hover:bg-red-500/30 px-2 py-1.5 rounded transition-colors">
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {tab === 'properties' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Mes biens immobiliers</h2>
              <button onClick={() => setShowPublishModal(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} />Ajouter
              </button>
            </div>
            {loadingProps ? <p className="text-gray-500">Chargement...</p> : properties.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                <Home size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Aucun bien publié</p>
                <button onClick={() => setShowPublishModal(true)} className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30">
                  <Plus size={18} />Publier mon premier bien
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {properties.map((p: any) => (
                  <div key={p.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
                    <div className="h-36 bg-gray-800 flex items-center justify-center">
                      {p.photos?.[0] ? (
                        <img src={p.photos[0]} alt={p.type} className="w-full h-full object-cover" />
                      ) : (
                        <Home size={32} className="text-gray-600" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">{p.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${statusColor[p.status]}`}>{p.status}</span>
                      </div>
                      <p className="font-semibold text-white text-sm">{p.ville?.nom}{p.quartier ? ` — ${p.quartier.nom}` : ''}</p>
                      <p className="text-blue-400 font-bold text-sm mt-1">${p.price.toLocaleString()}</p>
                      {p.surface && <p className="text-xs text-gray-500 mt-0.5">{p.surface} m²</p>}
                      <div className="flex items-center gap-2 mt-3">
                        <Link href={`/proprietaire/properties/${p.id}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                          <Eye size={12} />Voir
                        </Link>
                        <Link href={`/proprietaire/properties/${p.id}/edit`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                          <Edit size={12} />Modifier
                        </Link>
                        <button onClick={() => { if (confirm('Supprimer ce bien ?')) deleteProperty.mutate(p.id); }}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Vehicles */}
        {tab === 'vehicles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Mes véhicules</h2>
              <button onClick={() => setShowVehicleModal(true)} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
                <Plus size={16} />Ajouter
              </button>
            </div>
            {loadingVehs ? <p className="text-gray-500">Chargement...</p> : vehicles.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                <Car size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Aucun véhicule enregistré</p>
                <button onClick={() => setShowVehicleModal(true)} className="mt-4 inline-block text-purple-400 hover:text-purple-300 text-sm">Ajouter votre premier véhicule →</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {vehicles.map((v: any) => (
                  <div key={v.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
                    <div className="h-36 bg-gray-800 flex items-center justify-center">
                      {v.photos?.[0] ? (
                        <img src={v.photos[0]} alt={v.marque} className="w-full h-full object-cover" />
                      ) : (
                        <Car size={32} className="text-gray-600" />
                      )}
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-400">{v.type}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${v.availability ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {v.availability ? 'Disponible' : 'Indisponible'}
                        </span>
                      </div>
                      <p className="font-semibold text-white">{v.marque} {v.modele} <span className="text-gray-400 font-normal">({v.annee})</span></p>
                      <p className="text-purple-400 font-bold text-sm mt-1">
                        {v.pricePerDay ? `$${v.pricePerDay}/jour` : ''}{v.priceSale ? ` · $${v.priceSale.toLocaleString()}` : ''}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Link href={`/proprietaire/vehicles/${v.id}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors">
                          <Eye size={12} />Voir
                        </Link>
                        <Link href={`/proprietaire/vehicles/${v.id}/edit`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 px-3 py-1.5 rounded-lg transition-colors">
                          <Edit size={12} />Modifier
                        </Link>
                        <button onClick={() => { if (confirm('Supprimer ce véhicule ?')) deleteVehicle.mutate(v.id); }}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors ml-auto">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contracts */}
        {tab === 'contracts' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Mes contrats</h2>
            {loadingContracts ? <p className="text-gray-500">Chargement...</p> : contracts.length === 0 ? (
              <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
                <FileText size={40} className="text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">Aucun contrat</p>
              </div>
            ) : (
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Bien / Véhicule</th>
                      <th className="px-4 py-3 text-left">Client</th>
                      <th className="px-4 py-3 text-left">Type</th>
                      <th className="px-4 py-3 text-left">Montant</th>
                      <th className="px-4 py-3 text-left">Période</th>
                      <th className="px-4 py-3 text-left">Statut</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {contracts.map((c: any) => (
                      <tr key={c.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-4 py-3 text-white font-medium">
                          {c.property ? `${c.property.type} — ${c.property.ville?.nom}` : c.vehicle ? `${c.vehicle.marque} ${c.vehicle.modele}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-white">{c.client?.name}</p>
                          <p className="text-gray-500 text-xs">{c.client?.phone}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-300">{c.type}</td>
                        <td className="px-4 py-3 text-green-400 font-bold">${c.amount.toLocaleString()} <span className="text-gray-500 font-normal text-xs">{c.currency}</span></td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {c.startDate ? new Date(c.startDate).toLocaleDateString('fr-FR') : '—'}
                          {c.endDate ? ` → ${new Date(c.endDate).toLocaleDateString('fr-FR')}` : ''}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`flex items-center gap-1 w-fit text-xs px-2 py-1 rounded-full ${contractStatusColor[c.status]}`}>
                            {contractStatusIcon(c.status)}{c.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {c.status === 'PENDING' && (
                            <button onClick={() => updateContract.mutate({ id: c.id, data: { status: 'ACTIVE' } })}
                              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors">
                              Accepter
                            </button>
                          )}
                          {c.status === 'ACTIVE' && (
                            <button onClick={() => updateContract.mutate({ id: c.id, data: { status: 'TERMINATED' } })}
                              className="text-xs bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg transition-colors">
                              Terminer
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      <PublishBienModal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} />
      <AddVehicleModal isOpen={showVehicleModal} onClose={() => setShowVehicleModal(false)} />
      <ProfilePhotoModal 
        isOpen={showProfilePhotoModal} 
        onClose={() => setShowProfilePhotoModal(false)}
        onUpload={(file) => {
          console.log("Photo téléchargée:", file);
          // TODO: Implémenter l'upload de la photo de profil
        }}
      />

      {/* Modales pour Vue d'ensemble */}
      <ViewPropertyModal isOpen={!!viewPropertyModal} onClose={() => setViewPropertyModal(null)} property={viewPropertyModal} />
      <ViewVehicleModal isOpen={!!viewVehicleModal} onClose={() => setViewVehicleModal(null)} vehicle={viewVehicleModal} />
      <ContactModal isOpen={!!contactModal} onClose={() => setContactModal(null)} item={contactModal} />
      <DeletePropertyModal 
        isOpen={!!deletePropertyModal} 
        onClose={() => setDeletePropertyModal(null)} 
        property={deletePropertyModal}
        onConfirm={(id) => {
          deleteProperty.mutate(id);
          setDeletePropertyModal(null);
        }}
        isLoading={deleteProperty.isPending}
      />
      <DeleteVehicleModal 
        isOpen={!!deleteVehicleModal} 
        onClose={() => setDeleteVehicleModal(null)} 
        vehicle={deleteVehicleModal}
        onConfirm={(id) => {
          deleteVehicle.mutate(id);
          setDeleteVehicleModal(null);
        }}
        isLoading={deleteVehicle.isPending}
      />
    </div>
  );
}

