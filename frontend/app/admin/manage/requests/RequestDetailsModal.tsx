"use client";

import { X, User, FileText, Calendar, Hotel, Gauge, File, Clock, AlertTriangle } from 'lucide-react';

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

interface RequestDetailsModalProps {
  isOpen: boolean;
  request: ApprovalRequest | null;
  onClose: () => void;
}

export default function RequestDetailsModal({ isOpen, request, onClose }: RequestDetailsModalProps) {
  if (!isOpen || !request) return null;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'approved': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 mx-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-slate-900 to-gray-800 p-6 rounded-t-3xl border-b border-gray-200 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/20 rounded-2xl">
                <FileText size={24} className="text-orange-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Détails demande #{request.id}</h2>
                <p className="text-orange-300 font-semibold">{request.requester}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-2xl transition-all">
              <X size={24} className="text-gray-300 hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Demandeur */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 p-6 rounded-2xl border border-blue-200">
              <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
                <User size={24} />
                Demandeur
              </h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3 text-lg font-semibold text-gray-900">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                    {request.requester.slice(0,2).toUpperCase()}
                  </div>
                  {request.requester}
                </p>
                <p className="text-gray-600 font-medium">{request.requesterRole}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-orange-50 p-6 rounded-2xl border border-orange-200">
              <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
                <Gauge size={24} className="text-orange-500" />
                Priorité & Statut
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-semibold text-gray-900">Priorité</span>
                  <span className={`px-4 py-2 rounded-full border font-bold capitalize text-sm ${request.priority === 'high' ? 'bg-red-100 text-red-800 border-red-300' : request.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-green-100 text-green-800 border-green-300'}`}>
                    {request.priority}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-semibold text-gray-900">Statut</span>
                  <span className={`px-4 py-2 rounded-full font-bold text-sm ${getStatusStyle(request.status)}`}>
                    {request.status === 'pending' ? 'En attente' : request.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm">
                  <span className="font-semibold text-gray-900">Date</span>
                  <span className="text-gray-900 font-mono text-sm">{request.date}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Détails demande */}
          <div className="bg-gradient-to-br from-slate-50 to-indigo-50 p-8 rounded-3xl border border-indigo-200">
            <h3 className="flex items-center gap-3 text-xl font-bold text-gray-900 mb-6">
              <FileText size={24} />
              Détails de la demande
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Type</p>
                <span className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-400/40 rounded-2xl text-indigo-700 font-semibold">
                  {request.type === 'hotel_staff' ? 'Personnel hôtel' :
                   request.type === 'account_creation' ? 'Création compte' :
                   request.type === 'role_change' ? 'Changement rôle' :
                   'Permissions'}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Hôtel concerné</p>
                <p className="text-2xl font-bold text-gray-900">{request.hotel}</p>
              </div>
            </div>
            <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border">
              <h4 className="font-bold text-lg text-gray-900 mb-4">Description complète</h4>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">{request.details}</p>
            </div>
            {request.documents > 0 && (
              <div className="p-6 bg-indigo-50 border border-indigo-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <File size={24} className="text-indigo-600" />
                  <span className="font-bold text-indigo-900">Documents joints ({request.documents})</span>
                </div>
                <p className="text-indigo-700">Fichiers disponibles au téléchargement dans le dossier joint</p>
              </div>
            )}
          </div>

          {/* Actions (view only) */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 text-white font-bold rounded-2xl shadow-lg hover:shadow-slate-500/50 transition-all whitespace-nowrap"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

