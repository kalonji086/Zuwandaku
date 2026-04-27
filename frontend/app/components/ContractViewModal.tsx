'use client';

import { X, FileText, User, Home, Car, Calendar, DollarSign, CheckCircle, Clock, XCircle, AlertCircle, Download, Phone, Mail } from 'lucide-react';

interface Contract {
  id: string;
  title?: string;
  type: string;
  status: string;
  amount: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  createdAt?: string;
  client?: { name: string; phone?: string; email?: string };
  owner?: { name: string; phone?: string; email?: string };
  property?: { type: string; ville?: { nom: string }; quartier?: { nom: string }; price: number };
  vehicle?: { marque: string; modele: string; annee: number; pricePerDay?: number };
}

interface Props {
  contract: Contract | null;
  onClose: () => void;
  onDownload: (contract: Contract) => void;
}

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  TERMINATED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Actif', PENDING: 'En attente', TERMINATED: 'Terminé', CANCELLED: 'Annulé',
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'ACTIVE') return <CheckCircle size={14} />;
  if (status === 'PENDING') return <Clock size={14} />;
  if (status === 'CANCELLED') return <XCircle size={14} />;
  return <AlertCircle size={14} />;
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between py-3 border-b border-gray-800 last:border-0">
    <span className="text-sm text-gray-500 flex-shrink-0 w-36">{label}</span>
    <span className="text-sm text-white font-medium text-right">{value}</span>
  </div>
);

export default function ContractViewModal({ contract, onClose, onDownload }: Props) {
  if (!contract) return null;

  const asset = contract.property
    ? `${contract.property.type} — ${contract.property.ville?.nom ?? ''}${contract.property.quartier ? ` / ${contract.property.quartier.nom}` : ''}`
    : contract.vehicle
    ? `${contract.vehicle.marque} ${contract.vehicle.modele} (${contract.vehicle.annee})`
    : '—';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <FileText size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{contract.title || 'Contrat'}</h2>
              <p className="text-xs text-gray-400">#{contract.id.slice(0, 12).toUpperCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-semibold ${STATUS_STYLES[contract.status]}`}>
              <StatusIcon status={contract.status} />
              {STATUS_LABELS[contract.status] ?? contract.status}
            </span>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors ml-1">
              <X size={20} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Bien / Véhicule */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              {contract.property ? <Home size={13} /> : <Car size={13} />}
              {contract.property ? 'Bien immobilier' : 'Véhicule'}
            </p>
            <div className="bg-gray-800 rounded-xl p-4">
              <Row label="Désignation" value={asset} />
              <Row label="Type de contrat" value={<span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs">{contract.type}</span>} />
              <Row label="Montant" value={<span className="text-emerald-400 font-bold">{contract.amount.toLocaleString()} {contract.currency ?? 'USD'}</span>} />
            </div>
          </div>

          {/* Dates */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Calendar size={13} /> Période
            </p>
            <div className="bg-gray-800 rounded-xl p-4">
              <Row label="Date début" value={new Date(contract.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} />
              {contract.endDate && (
                <Row label="Date fin" value={new Date(contract.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} />
              )}
              {contract.createdAt && (
                <Row label="Créé le" value={new Date(contract.createdAt).toLocaleDateString('fr-FR')} />
              )}
            </div>
          </div>

          {/* Parties */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <User size={13} /> Parties
            </p>
            <div className="grid grid-cols-2 gap-3">
              {contract.client && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Client</p>
                  <p className="text-white font-semibold text-sm">{contract.client.name}</p>
                  {contract.client.phone && (
                    <a href={`tel:${contract.client.phone}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-400 mt-1 transition-colors">
                      <Phone size={11} />{contract.client.phone}
                    </a>
                  )}
                  {contract.client.email && (
                    <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                      <Mail size={11} />{contract.client.email}
                    </p>
                  )}
                </div>
              )}
              {contract.owner && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-2">Propriétaire</p>
                  <p className="text-white font-semibold text-sm">{contract.owner.name}</p>
                  {contract.owner.phone && (
                    <a href={`tel:${contract.owner.phone}`} className="flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-400 mt-1 transition-colors">
                      <Phone size={11} />{contract.owner.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex gap-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
            Fermer
          </button>
          <button
            onClick={() => onDownload(contract)}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download size={16} /> Télécharger
          </button>
        </div>
      </div>
    </div>
  );
}
