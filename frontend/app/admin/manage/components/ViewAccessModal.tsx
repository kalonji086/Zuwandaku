"use client";

import { useState } from 'react';
import { X, Shield, Lock, Eye, CheckCircle } from 'lucide-react';

interface ViewAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberName: string;
  permissions: string[];
}

export default function ViewAccessModal({ isOpen, onClose, memberName, permissions }: ViewAccessModalProps) {
  if (!isOpen) return null;

  const permissionGroups = [
    { category: 'Utilisateurs', perms: permissions.filter(p => p.includes('user')) },
    { category: 'Hôtel', perms: permissions.filter(p => p.includes('hotel')) },
    { category: 'Finances', perms: permissions.filter(p => p.includes('financial')) },
    { category: 'GroupWorks', perms: permissions.filter(p => p.includes('groupworks')) },
  ].filter(group => group.perms.length > 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/70 backdrop-blur-3xl border border-blue-500/30 rounded-3xl shadow-3xl max-w-2xl w-full mx-4 max-h-[85vh] overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-8 border-b border-blue-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border-2 border-blue-400/40 shadow-xl">
              <Eye size={24} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white drop-shadow-xl">Accès & Permissions</h3>
              <p className="text-lg text-gray-400">{memberName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-2xl text-gray-400 hover:text-white transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-6">
          {permissionGroups.map(({ category, perms }) => (
            <div key={category} className="group">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3 bg-gradient-to-r from-slate-800/50 to-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                <Shield size={22} className="text-blue-400 flex-shrink-0" />
                <span>{category}</span>
                <span className="ml-auto text-sm text-blue-400 font-semibold bg-blue-500/10 px-3 py-1 rounded-xl border border-blue-500/30">
                  {perms.length}
                </span>
              </h4>
              <div className="space-y-2">
                {perms.map(perm => (
                  <div key={perm} className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-800/30 to-slate-800/10 rounded-xl border border-slate-700/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group-hover:pl-2">
                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-white capitalize">{perm.replace('_', ' ')}</div>
                      <div className="text-xs text-gray-500">Accès complet</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {permissionGroups.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-slate-700/50 rounded-3xl">
              <Shield size={64} className="mx-auto mb-6 text-gray-600 opacity-50" />
              <h4 className="text-2xl font-bold text-gray-400 mb-2">Aucune permission spéciale</h4>
              <p className="text-lg text-gray-500">Ce membre a uniquement les accès de base.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-700/50 bg-gradient-to-t from-slate-950 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:from-slate-700 border border-slate-700 text-gray-300 hover:text-white font-bold rounded-2xl shadow-xl hover:shadow-slate-500/25 transition-all flex items-center gap-3"
          >
            <X size={20} />
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

