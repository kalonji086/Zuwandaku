"use client";

import { useState } from 'react';
import { X, Shield, Plus, Save, UserPlus, Users, Lock, Check, Trash2 } from 'lucide-react';

interface NewRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: any) => void;
}

export default function NewRoleModal({ isOpen, onClose, onSave }: NewRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const [availablePermissions, setAvailablePermissions] = useState([
    'user_management',
    'hotel_approval',
    'properties',
    'vehicles',
    'reports_admin',
    'financials',
    'groupworks_full',
  ]);

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/70 backdrop-blur-3xl border border-violet-500/30 rounded-4xl shadow-3xl max-w-2xl w-full animate-in zoom-in duration-200 max-h-[90vh] overflow-hidden">
        <div className="p-8 border-b border-violet-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                <Shield size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  Nouveau rôle
                </h2>
                <p className="text-xl text-gray-400">Créez un rôle GroupWorks personnalisé</p>
              </div>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-slate-800 rounded-2xl text-gray-400 hover:text-white transition-all shadow-lg">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-lg font-bold text-gray-300 mb-4 flex items-center gap-3">
              <Users size={20} />
              Nom du rôle *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-violet-500/40 font-semibold text-xl shadow-lg"
              placeholder="Ex: Agent Propriétés Lubumbashi"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-300 mb-4 flex items-center gap-3">
              <Lock size={20} />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-indigo-500/40 shadow-lg resize-vertical"
              placeholder="Rôle pour gérer les propriétés dans la région..."
            />
          </div>

          <div>
            <label className="block text-lg font-bold text-gray-300 mb-6 flex items-center gap-3">
              <Shield size={20} />
              Permissions ({formData.permissions.length} sélectionnées)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-4 bg-slate-800/50 rounded-3xl border border-slate-600/50">
              {availablePermissions.map(permission => (
                <button
                  key={permission}
                  type="button"
                  onClick={() => togglePermission(permission)}
                  className={`p-4 rounded-2xl border-2 font-medium text-sm transition-all shadow-md flex items-center gap-3 ${
                    formData.permissions.includes(permission)
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-emerald-300/50 hover:shadow-emerald-400/50 scale-105'
                      : 'bg-slate-700/50 border-slate-500/50 text-gray-300 hover:border-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10'
                  }`}
                >
                  <Check size={16} className={`transition-transform ${formData.permissions.includes(permission) ? 'scale-100' : 'scale-0'}`} />
                  <span className="capitalize">{permission.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700/50 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-5 border-2 border-slate-700 hover:border-slate-600 bg-slate-900/50 text-gray-300 hover:text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-all text-lg flex items-center justify-center gap-3 backdrop-blur-sm"
            >
              <X size={20} />
              Annuler
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim()}
              className="flex-1 px-8 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-violet-500/50 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              <Save size={20} />
              Créer rôle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

