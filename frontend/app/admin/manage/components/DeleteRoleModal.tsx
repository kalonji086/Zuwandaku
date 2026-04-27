"use client";

import { useState } from 'react';
import { X, Shield, AlertTriangle, CheckCircle, Trash2 } from 'lucide-react';

interface DeleteRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleName: string;
  userCount: number;
  onDelete: () => void;
}

export default function DeleteRoleModal({ isOpen, onClose, roleName, userCount, onDelete }: DeleteRoleModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    setIsConfirming(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsConfirming(false);
    onDelete();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950/90 backdrop-blur-3xl border border-red-500/30 rounded-3xl shadow-3xl max-w-md w-full mx-4 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-red-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500/20 to-rose-500/20 rounded-2xl flex items-center justify-center border-2 border-red-400/40 shadow-xl">
                <Trash2 size={28} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white drop-shadow-xl">Supprimer rôle</h2>
                <p className="text-xl text-gray-400">{roleName}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800/50 rounded-xl text-gray-400 hover:text-white transition-all"
              disabled={isConfirming}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Warning Content */}
        <div className="p-8 pb-12 max-h-[400px]">
          <div className="text-center mb-8">
            <AlertTriangle size={64} className="mx-auto text-red-400 mb-6 drop-shadow-lg" />
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">Attention ! Action irréversible</h3>
            <p className="text-lg text-gray-300 mb-6 max-w-lg mx-auto leading-relaxed">
              Cette action supprimera définitivement le rôle <strong className="text-red-400">{roleName}</strong> et ses 
              <span className="font-bold text-red-400"> {userCount} utilisateur(s)</span> seront rétrogradés vers "Membre standard".
            </p>
          </div>

          <div className="space-y-4 bg-slate-800/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 mb-8">
            <div className="flex items-center gap-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <Shield size={20} className="text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Permissions perdues</p>
                <ul className="text-sm text-gray-300 space-y-1 mt-1">
                  <li>• Tous les accès spéciaux seront révoqués</li>
                  <li>• Historique audité conservé 90 jours</li>
                  <li>• Notifications automatiques vers RH</li>
                </ul>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <span className="font-semibold text-amber-400">Backup disponible</span>
              <span className="text-xs bg-amber-500/20 px-3 py-1 rounded-full text-amber-300 border border-amber-500/40">Restaurable 7 jours</span>
            </div>
          </div>

          {userCount > 0 && (
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6 mb-6">
              <h4 className="font-bold text-xl text-orange-400 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} />
                Impact sur {userCount} utilisateur(s)
              </h4>
              <p className="text-orange-300 text-sm leading-relaxed">
                Les membres perdent leurs privilèges. Re-assigner dans <strong>5 min</strong> via drag & drop interface.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-red-500/20 bg-gradient-to-t from-slate-950/80">
          <div className="flex gap-4 justify-end">
            <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-900/50 border border-slate-700 hover:border-slate-600 text-gray-300 hover:text-white font-bold rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 justify-center disabled:opacity-50"
              disabled={isConfirming}
            >
              <X size={20} />
              Annuler
            </button>
            <button 
              onClick={handleDelete}
              disabled={isConfirming}
              className="flex-1 px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-red-500/50 transition-all flex items-center gap-3 justify-center disabled:opacity-50"
            >
              {isConfirming ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Suppression...
                </>
              ) : (
                <>
                  <Trash2 size={20} />
                  Supprimer définitivement
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

