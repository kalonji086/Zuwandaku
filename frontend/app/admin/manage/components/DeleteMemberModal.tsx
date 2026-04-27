"use client";

import { useState } from 'react';
import { X, User, Shield, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

interface DeleteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  roleName: string;
  onDelete: () => void;
}

export default function DeleteMemberModal({ isOpen, onClose, memberName, roleName, onDelete }: DeleteMemberModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsConfirming(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsConfirming(false);
    onDelete();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950/90 backdrop-blur-3xl border border-red-500/30 rounded-3xl shadow-3xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center border-2 border-red-400/40">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Supprimer membre</h3>
              <p className="text-sm text-gray-400">{memberName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-gray-400 hover:text-white" disabled={isConfirming}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <AlertTriangle size={56} className="mx-auto text-orange-400 mb-4" />
            <h4 className="text-xl font-bold text-white mb-2">Retirer du rôle</h4>
            <p className="text-gray-300 mb-6">
              <strong>{memberName}</strong> perdra tous privilèges <strong>{roleName}</strong>.<br />
              Il restera "Membre standard".
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50">
            <div className="text-center p-3">
              <User size={20} className="mx-auto mb-2 text-emerald-400" />
              <p className="text-sm font-medium text-emerald-400">Compte préservé</p>
            </div>
            <div className="text-center p-3">
              <Shield size={20} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-300">Permissions perdues</p>
            </div>
          </div>

          <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-xl">
            <p className="text-sm text-orange-300">
              Action réversible dans 24h via logs audit. Notification RH automatique.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            disabled={isConfirming}
            className="px-8 py-3 border border-slate-700/50 hover:border-slate-600 bg-slate-900/50 text-gray-300 hover:text-white font-bold rounded-xl transition-all shadow-lg flex items-center gap-2"
          >
            <X size={16} />
            Annuler
          </button>
          <button 
            onClick={handleDelete}
            disabled={isConfirming}
            className="px-8 py-3 bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-500 text-white font-bold rounded-xl shadow-xl hover:shadow-red-400/30 transition-all flex items-center gap-2 min-w-[140px] justify-center"
          >
            {isConfirming ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Retrait...
              </>
            ) : (
              <>
                <Trash2 size={16} />
                Retirer rôle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

