"use client";

import { useState } from 'react';
import { X, User, Shield, Mail, Calendar, CheckCircle, Save } from 'lucide-react';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: 'active' | 'pending' | 'inactive';
    lastLogin: string;
    permissionsCount: number;
  };
  onSave: (updatedMember: any) => void;
}

export default function EditMemberModal({ isOpen, onClose, member, onSave }: EditMemberModalProps) {
  const [updatedMember, setUpdatedMember] = useState(member);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    onSave(updatedMember);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/70 backdrop-blur-3xl border border-indigo-500/30 rounded-3xl shadow-3xl max-w-lg w-full mx-4 max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="p-8 border-b border-indigo-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white drop-shadow-xl">Editer membre</h3>
              <p className="text-lg text-gray-400">{member.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-2xl text-gray-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Nom complet</label>
              <input
                type="text"
                value={updatedMember.name}
                onChange={(e) => setUpdatedMember({...updatedMember, name: e.target.value})}
                className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white font-medium focus:ring-4 focus:ring-indigo-500/40 focus:border-indigo-500 shadow-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={updatedMember.email}
                  onChange={(e) => setUpdatedMember({...updatedMember, email: e.target.value})}
                  className="w-full p-4 bg-slate-800/50 border border-slate-700 rounded-2xl text-white focus:ring-4 focus:ring-indigo-500/40"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Rôle actuel</label>
                <input
                  value={updatedMember.role}
                  readOnly
                  className="w-full p-4 bg-slate-700/50 border border-slate-600 rounded-2xl text-indigo-400 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                Statut
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['active', 'pending', 'inactive'] as const).map(status => (
                  <label key={status} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer group hover:bg-slate-800/50 border border-slate-700/50 hover:border-indigo-500/50 transition-all">
                    <input
                      type="radio"
                      name="status"
                      value={status}
                      checked={updatedMember.status === status}
                      onChange={() => setUpdatedMember({...updatedMember, status: status as any})}
                      className="w-5 h-5 text-indigo-600 bg-slate-800 border-2 border-slate-600 rounded-full focus:ring-indigo-500 focus:ring-2 cursor-pointer"
                    />
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                      status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                      'bg-gray-500/20 text-gray-400 border-gray-500/40'
                    }`}>
                      {status === 'active' ? 'Actif' : status === 'pending' ? 'En attente' : 'Inactif'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Last Login & Permissions */}
            <div className="grid grid-cols-2 gap-4 p-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50">
              <div>
                <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Dernière connexion</label>
                <div className="text-sm text-gray-400 font-mono">{updatedMember.lastLogin}</div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 uppercase font-bold tracking-wider mb-2">Permissions</label>
                <div className="text-indigo-400 font-semibold">{updatedMember.permissionsCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-700/50 flex gap-4 justify-end bg-gradient-to-t from-slate-950">
          <button 
            onClick={onClose}
            disabled={loading}
            className="px-8 py-4 bg-slate-900/50 border border-slate-700 hover:border-slate-600 text-gray-300 hover:text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3"
          >
            <X size={18} />
            Annuler
          </button>
          <button 
            onClick={handleSave}
            disabled={loading}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center gap-3 text-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={20} />
            )}
            {loading ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  );
}

