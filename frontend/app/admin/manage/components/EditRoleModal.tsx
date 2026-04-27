"use client";

import { useState } from 'react';
import { X, Shield, Save, Plus, Trash2, Search } from 'lucide-react';

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

const PERMISSIONS_MOCK: Permission[] = [
  { id: 'user_create', name: 'Créer utilisateur', description: 'Création de nouveaux comptes', category: 'Utilisateurs' },
  { id: 'user_delete', name: 'Supprimer utilisateur', description: 'Suppression définitive', category: 'Utilisateurs' },
  { id: 'hotel_approve', name: 'Approuver hôtel', description: 'Validation demandes hôtel', category: 'Hôtel' },
  { id: 'financial_view', name: 'Voir finances', description: 'Rapports financiers', category: 'Finances' },
  { id: 'groupworks_full', name: 'GroupWorks complet', description: 'Accès total plateforme', category: 'GroupWorks' },
];

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  roleId: string;
  roleName: string;
  onSave: (roleData: { name: string; permissions: string[] }) => void;
}

export default function EditRoleModal({ isOpen, onClose, roleId, roleName, onSave }: EditRoleModalProps) {
  const [roleData, setRoleData] = useState({
    name: roleName,
    permissions: [] as string[],
  });
  const [searchPerm, setSearchPerm] = useState('');
  const [tab, setTab] = useState('permissions');

  const filteredPermissions = PERMISSIONS_MOCK.filter(p => 
    p.name.toLowerCase().includes(searchPerm.toLowerCase()) || p.category.toLowerCase().includes(searchPerm.toLowerCase())
  );

  const togglePermission = (permId: string) => {
    setRoleData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permId)
        ? prev.permissions.filter(id => id !== permId)
        : [...prev.permissions, permId]
    }));
  };

  const handleSave = () => {
    onSave(roleData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
      <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/70 backdrop-blur-3xl border border-purple-500/30 rounded-4xl shadow-3xl max-w-6xl max-h-[90vh] w-full overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        <div className="p-8 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Shield size={28} className="text-white drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Modifier rôle
                </h2>
                <p className="text-xl text-gray-400">{roleData.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-400/40 rounded-2xl font-bold text-sm shadow-lg">
                {roleData.permissions.length} permissions
              </span>
              <button 
                onClick={onClose}
                className="p-3 hover:bg-slate-800/50 rounded-2xl text-gray-400 hover:text-white transition-all group"
              >
                <X size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Role Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4">Nom du rôle</label>
                <input
                  type="text"
                  value={roleData.name}
                  onChange={(e) => setRoleData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full p-5 bg-gradient-to-r from-slate-800/50 to-slate-800/30 border border-slate-700/50 rounded-3xl text-white placeholder-gray-500 font-semibold text-xl focus:ring-4 focus:ring-violet-500/40 focus:border-violet-500/60 shadow-xl transition-all"
                  placeholder="Nom du rôle..."
                />
              </div>

              {/* Permission Stats */}
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 p-6 rounded-3xl border border-slate-700/50">
                <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Shield size={20} />
                  Statistiques
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Utilisateurs</span>
                    <span className="font-bold text-purple-400">42</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Groupes</span>
                    <span className="font-bold text-emerald-400">3</span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-3">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-3 rounded-full shadow-lg" style={{ width: '78%' }}></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center">78% utilisation</p>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <h4 className="text-2xl font-bold text-white flex-1">Permissions ({roleData.permissions.length}/50)</h4>
                  <div className="flex items-center gap-2 p-3 bg-slate-800/50 rounded-2xl border border-slate-700">
                    <input
                      type="text"
                      value={searchPerm}
                      onChange={(e) => setSearchPerm(e.target.value)}
                      placeholder="Rechercher permission..."
                      className="bg-transparent border-none outline-none text-white placeholder-gray-500 flex-1"
                    />
                    <Search size={18} className="text-gray-400" />
                  </div>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {filteredPermissions.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-4 p-5 bg-gradient-to-r from-slate-800/30 to-slate-800/10 rounded-3xl border-2 border-slate-700/30 cursor-pointer group hover:border-purple-500/50 hover:bg-purple-500/10 transition-all shadow-md hover:shadow-purple-400/20">
                      <input
                        type="checkbox"
                        checked={roleData.permissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="w-6 h-6 text-purple-600 bg-slate-800/50 border-2 border-slate-600 rounded-xl focus:ring-purple-500 focus:ring-2 peer transition-all group-hover:scale-110"
                      />
                      <div>
                        <div className="font-bold text-white text-lg peer-checked:text-purple-400 transition-colors">{perm.name}</div>
                        <div className="text-gray-500 text-sm">{perm.description}</div>
                        <div className="text-xs bg-slate-700/50 px-3 py-1 rounded-full text-purple-400 font-medium mt-1">
                          {perm.category}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 pt-0 border-t border-purple-500/20 bg-gradient-to-t from-slate-900/50">
          <div className="flex gap-4 justify-end">
            <button 
              onClick={onClose}
              className="px-12 py-5 border border-slate-700/50 hover:border-slate-600 bg-slate-900/50 text-gray-300 hover:text-white font-bold rounded-3xl transition-all shadow-xl hover:shadow-2xl flex items-center gap-3"
            >
              <X size={20} />
              Annuler
            </button>
            <button 
              onClick={handleSave}
              className="px-16 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-3xl shadow-3xl hover:shadow-violet-500/50 transition-all flex items-center gap-3 text-lg"
              disabled={roleData.permissions.length === 0}
            >
              <Save size={22} />
              Sauvegarder rôle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

