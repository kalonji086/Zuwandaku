"use client";

import { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Edit3, Download, MessageCircle, FileText, Calendar, Search, X } from 'lucide-react';

interface RequestDetailsModalProps {
  isOpen: boolean;
  request: ApprovalRequest | null;
  onClose: () => void;
}

function RequestDetailsModal({ isOpen, request, onClose }: RequestDetailsModalProps) {
  if (!isOpen || !request) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-2xl">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold">Détails demande #{request.id}</h2>
          <button onClick={onClose} className="float-right p-2">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p><strong>Demandeur:</strong> {request.requester}</p>
          <p><strong>Type:</strong> {request.type}</p>
          <p><strong>Détails:</strong> {request.details}</p>
        </div>
      </div>
    </div>
  );
}

interface ApprovalRequest {
  id: string;
  type: 'account_creation' | 'role_change' | 'hotel_staff' | 'permission_upgrade';
  requester: string;
  requesterRole: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  details: string;
  hotel: string;
  priority: 'low' | 'medium' | 'high';
  documents: number;
}

const REQUESTS_MOCK: ApprovalRequest[] = [
  {
    id: '1',
    type: 'hotel_staff',
    requester: 'Sophie Lumu',
    requesterRole: 'Hotel Manager',
    date: '2024-04-20 09:30',
    status: 'pending',
    details: 'Demande création 3 réceptionnistes + 2 housekeeping pour Hotel Kinshasa',
    hotel: 'Hotel Kinshasa Gombe',
    priority: 'high',
    documents: 2
  },
  {
    id: '2',
    type: 'account_creation',
    requester: 'Jean-Pierre Muteba',
    requesterRole: 'RH Manager',
    date: '2024-04-19 16:45',
    status: 'pending',
    details: 'Nouveau compte Property Agent pour parcelle Ndjili',
    hotel: 'N/A',
    priority: 'medium',
    documents: 1
  },
  {
    id: '3',
    type: 'role_change',
    requester: 'David Nsakala',
    requesterRole: 'Maintenance',
    date: '2024-04-20 11:15',
    status: 'approved',
    details: 'Upgrade vers Vehicle Manager (4 véhicules)',
    hotel: 'Hotel Lubumbashi',
    priority: 'low',
    documents: 0
  },
  {
    id: '4',
    type: 'permission_upgrade',
    requester: 'Marie Kabila',
    requesterRole: 'Réceptionniste',
    date: '2024-04-19 14:20',
    status: 'rejected',
    details: 'Demande accès financials refusé (niveau insuffisant)',
    hotel: 'Hotel Kinshasa Gombe',
    priority: 'medium',
    documents: 3
  },
];

const PRIORITY_COLORS = {
  low: 'bg-blue-500/20 border-blue-500 text-blue-400',
  medium: 'bg-yellow-500/20 border-yellow-500 text-yellow-400',
  high: 'bg-red-500/20 border-red-500 text-red-400'
};

export default function AdminManageRequestsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredRequests = REQUESTS_MOCK.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    const matchesSearch = request.requester.toLowerCase().includes(search.toLowerCase()) || 
                          request.details.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const stats = {
    pending: REQUESTS_MOCK.filter(r => r.status === 'pending').length,
    approved: REQUESTS_MOCK.filter(r => r.status === 'approved').length,
    rejected: REQUESTS_MOCK.filter(r => r.status === 'rejected').length,
    total: REQUESTS_MOCK.length
  };

  const handleDetails = (request: ApprovalRequest) => {
    setSelectedRequest(request);
    setIsDetailsOpen(true);
  };

  return (
    <div>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-3xl mb-2">
              Demandes d'approbation
            </h1>
            <p className="text-2xl text-gray-400">Gestion workflow Admin Principal - {stats.total} demandes</p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all whitespace-nowrap">
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-slate-900/80 to-orange-900/20 backdrop-blur-xl p-8 rounded-4xl border border-orange-500/30 shadow-3xl group hover:shadow-orange-500/30 transition-all">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Clock size={24} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{stats.pending}</p>
            <p className="text-xl text-orange-400 font-bold">En attente</p>
            <p className="text-sm text-gray-400 mt-2">{stats.pending > 0 && `${Math.round((stats.pending/stats.total)*100)}% des demandes`}</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/20 backdrop-blur-xl p-8 rounded-4xl border border-emerald-500/30 shadow-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <CheckCircle size={24} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{stats.approved}</p>
            <p className="text-xl text-emerald-400 font-bold">Approuvées</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-red-900/20 backdrop-blur-xl p-8 rounded-4xl border border-red-500/30 shadow-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <XCircle size={24} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{stats.rejected}</p>
            <p className="text-xl text-red-400 font-bold">Rejetées</p>
          </div>

          <div className="bg-gradient-to-br from-slate-900/80 to-slate-900/20 backdrop-blur-xl p-8 rounded-4xl border border-slate-600/30 shadow-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <FileText size={24} className="text-white drop-shadow-lg" />
              </div>
            </div>
            <p className="text-4xl font-black text-white mb-2">{stats.total}</p>
            <p className="text-xl text-blue-400 font-bold">Total</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-r from-slate-900/70 to-slate-900/30 backdrop-blur-xl rounded-4xl p-8 border border-orange-500/30 mb-8 shadow-3xl">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="relative">
              <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, hôtel..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-slate-800/60 border border-slate-700 rounded-3xl text-white placeholder-gray-500 text-lg font-medium focus:ring-4 focus:ring-orange-500/40"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-6 py-5 bg-slate-800/60 border border-slate-700 rounded-3xl text-white focus:ring-4 focus:ring-orange-500/40 font-medium"
            >
              <option value="all">Tous statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvées</option>
              <option value="rejected">Rejetées</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-6 py-5 bg-slate-800/60 border border-slate-700 rounded-3xl text-white focus:ring-4 focus:ring-orange-500/40 font-medium"
            >
              <option value="all">Toutes types</option>
              <option value="hotel_staff">Personnel hôtel</option>
              <option value="account_creation">Création compte</option>
              <option value="role_change">Changement rôle</option>
            </select>
            <div className="flex gap-3">
              <button className="flex-1 p-5 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-3xl text-gray-400 hover:text-white transition-all shadow-lg flex items-center gap-2 justify-center">
                <Calendar size={20} />
                <span>Date</span>
              </button>
              <button className="p-5 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-orange-500/50 transition-all flex items-center gap-2 justify-center">
                <Download size={20} />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-gradient-to-r from-slate-900/50 to-slate-900/20 backdrop-blur-xl rounded-4xl border border-slate-700/50 overflow-hidden shadow-3xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/70">
                <tr>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Demandeur / Hôtel</th>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Type</th>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Détails</th>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Date</th>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Priorité</th>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Statut</th>
                  <th className="p-6 text-left font-bold text-xl text-white border-b border-slate-700/50">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="border-b border-slate-700/30 hover:bg-slate-800/50 transition-all group">
                    <td className="p-6">
                      <div className="font-bold text-white text-lg">{request.requester}</div>
                      <div className="text-gray-400 text-sm">{request.requesterRole}</div>
                      <div className="text-orange-400 font-medium mt-1">{request.hotel}</div>
                    </td>
                    <td className="p-6">
                      <span className="px-4 py-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/40 rounded-2xl text-orange-400 font-semibold">
                        {request.type === 'hotel_staff' && 'Personnel hôtel'}
                        {request.type === 'account_creation' && 'Compte'}
                        {request.type === 'role_change' && 'Rôle'}
                        {request.type === 'permission_upgrade' && 'Permissions'}
                      </span>
                    </td>
                    <td className="p-6 max-w-md">
                      <p className="text-white font-medium line-clamp-2">{request.details}</p>
                      {request.documents > 0 && (
                        <span className="inline-flex items-center gap-2 text-sm text-gray-400 mt-2">
                          <FileText size={14} />
                          {request.documents} document{request.documents > 1 ? 's' : ''}
                        </span>
                      )}
                    </td>
                    <td className="p-6 font-mono text-gray-400 text-sm">{request.date}</td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-full border-2 font-bold text-sm capitalize ${PRIORITY_COLORS[request.priority as keyof typeof PRIORITY_COLORS]}`}>
                        {request.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-4 py-2 rounded-full border-2 font-bold text-sm capitalize ${
                        request.status === 'pending' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
                        request.status === 'approved' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' :
                        'bg-red-500/20 border-red-500 text-red-400'
                      }`}>
                        {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button className="p-3 bg-blue-600/20 hover:bg-blue-600/40 rounded-2xl border border-blue-500/30 text-blue-300 hover:text-blue-200 transition-all" onClick={() => handleDetails(request)}>
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-40 border-2 border-dashed border-slate-700/50 rounded-4xl">
            <CheckCircle size={96} className="mx-auto mb-8 text-emerald-500 opacity-50" />
            <h3 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Aucune demande</h3>
            <p className="text-2xl text-gray-500 mb-12 max-w-2xl mx-auto">Toutes les demandes d'approbation ont été traitées ou il n'y a actuellement aucune nouvelle demande en attente</p>
          </div>
        )}
      </div>
  );
}

