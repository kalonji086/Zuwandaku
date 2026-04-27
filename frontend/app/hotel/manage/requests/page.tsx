"use client";

import { useState } from 'react';
import { Clock, UserPlus, CheckCircle, X, Eye, Mail, Download, Calendar } from 'lucide-react';
import RequestDetailsModal from './RequestDetailsModal';
import type { ReactNode } from 'react';

const REQUESTS_MOCK = [
  {
    id: '1',
    name: 'Jean Kabila',
    role: 'Réceptionniste',
    requestedBy: 'Sophie Lumu',
    date: '2024-04-15',
    status: 'pending',
    priority: 'high'
  },
  {
    id: '2',
    name: 'Marie Dupont',
    role: 'Housekeeping',
    requestedBy: 'David Nsakala',
    date: '2024-04-14',
    status: 'approved',
    priority: 'medium'
  },
  {
    id: '3',
    name: 'Pierre Muteba',
    role: 'Sécurité',
    requestedBy: 'Sophie Lumu',
    date: '2024-04-13',
    status: 'rejected',
    priority: 'high'
  },
];

interface Request {
  id: string;
  name: string;
  role: string;
  requestedBy: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  priority: string;
}

type RequestDetailsModalProps = {
  isOpen: boolean;
  request: Request | null;
  onClose: () => void;
};

export default function ManageRequestsPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const openDetails = (request: Request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const filteredRequests = REQUESTS_MOCK.filter(req => 
    statusFilter === 'all' || req.status === statusFilter
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'approved': return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
      case 'rejected': return 'bg-red-500/20 border-red-500 text-red-400';
      default: return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };

  return (
    <div>
      <div className="flex items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl mb-2">Demandes en attente</h1>
          <p className="text-2xl text-gray-400">Approuvez ou rejetez les créations de comptes</p>
        </div>
      </div>

      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-gray-700 flex items-center gap-6">
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-3xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        >
          <option value="all">Toutes (12)</option>
          <option value="pending">En attente (3)</option>
          <option value="approved">Approuvées (5)</option>
          <option value="rejected">Rejetées (4)</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredRequests.map((req) => (
          <div key={req.id} className="bg-gradient-to-r from-gray-900/80 to-gray-900/20 backdrop-blur-xl rounded-4xl border border-gray-700/50 p-8 shadow-3xl hover:shadow-orange-500/20 group transition-all">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-start gap-6 mb-6 lg:mb-0">
                  <div className="flex flex-col items-center p-4 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-3xl border-2 border-orange-400/30">
                    <UserPlus size={32} className="text-orange-400 mb-2" />
                    <span className="text-sm text-orange-300 font-bold px-3 py-1 bg-orange-500/20 rounded-xl border border-orange-500/30">{req.role}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white mb-2">{req.name}</h3>
                    <p className="text-xl text-gray-400 mb-4">Demandé par <span className="font-semibold text-white">{req.requestedBy}</span></p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{req.date}</span>
                      </div>
                      <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm capitalize ${getStatusBadge(req.status)}`}>
                        {req.status === 'pending' && 'En attente'}
                        {req.status === 'approved' && 'Approuvée'}
                        {req.status === 'rejected' && 'Rejetée'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button onClick={() => openDetails(req)} className="flex items-center justify-center gap-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 hover:text-blue-200 font-bold py-4 px-8 rounded-3xl transition-all shadow-lg hover:shadow-blue-500/25">
                  <Eye size={20} />
                  Détails
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-32">
          <Clock size={72} className="mx-auto mb-8 text-gray-600 opacity-50" />
          <h3 className="text-3xl font-bold text-white mb-4">Aucune demande</h3>
          <p className="text-xl text-gray-500 mb-8 max-w-lg mx-auto">Toutes les demandes ont été traitées ou il n'y en a pas pour le moment.</p>
        </div>
      )}
    </div>
  );
}

