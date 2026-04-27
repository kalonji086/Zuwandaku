"use client";

import { useState } from 'react';
import { X, Shield, CheckCircle, EyeOff, LayoutDashboard, Home, Car, Users2, FileText, BarChart3, Settings, MessageCircle, Mail, Building2 } from 'lucide-react';

interface ModuleAssignmentModalProps {
  isOpen: boolean;
  role: string;
  currentModules: string[];
  onAssign: (modules: string[]) => void;
  onClose: () => void;
}

const MODULES = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'properties', label: 'Propriétés', icon: Home },
  { id: 'vehicles', label: 'Véhicules', icon: Car },
  { id: 'users', label: 'Utilisateurs', icon: Users2 },
  { id: 'contracts', label: 'Contrats', icon: FileText },
  { id: 'approve', label: 'Approbations', icon: CheckCircle },
  { id: 'reports', label: 'Rapports', icon: BarChart3 },
  { id: 'settings', label: 'Paramètres', icon: Settings },
  { id: 'supports', label: 'Support', icon: MessageCircle },
  { id: 'mailbox', label: 'Mailbox', icon: Mail },
  { id: 'admin', label: 'Admin', icon: Shield },
  { id: 'hotel', label: 'Hôtel', icon: Building2 },
] as const;

type ModuleId = (typeof MODULES)[number]['id'];

export default function ModuleAssignmentModal({ isOpen, role, currentModules, onAssign, onClose }: ModuleAssignmentModalProps) {
  const [selectedModules, setSelectedModules] = useState<ModuleId[]>(currentModules as ModuleId[]);
  const [saving, setSaving] = useState(false);

  const toggleModule = (module: ModuleId) => {
    setSelectedModules(prev =>
      prev.includes(module) 
        ? prev.filter(m => m !== module)
        : [...prev, module]
    );
  };

  const handleAssign = async () => {
    setSaving(true);
    try {
      await onAssign(selectedModules);
      onClose();
    } catch (e) {
      console.error('Assignment failed:', e);
    }
    setSaving(false);
  };

  const ModuleIcon = ({ id }: { id: ModuleId }) => {
    const mod = MODULES.find(m => m.id === id);
    const Icon = mod?.icon;
    return Icon ? <Icon size={20} className="text-blue-400 opacity-75 flex-shrink-0" /> : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[999] flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950/50 backdrop-blur-3xl border border-purple-500/30 rounded-4xl shadow-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-8 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-2 border-emerald-400/40 rounded-2xl flex items-center justify-center">
              <Shield size={24} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white drop-shadow-lg">
                Contrôle Modules - {role}
              </h2>
              <p className="text-lg text-gray-400 mt-1">Attribuez 1+ module → Flou automatique autres</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-slate-800/50 rounded-xl text-gray-400 hover:text-white transition-all group"
          >
            <X size={24} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        {/* Modules Grid */}
        <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MODULES.map(({ id, label }) => {
              const active = selectedModules.includes(id);
              return (
                <div 
                  key={id}
                  className={`
                    group p-6 rounded-3xl border-2 cursor-pointer transition-all hover:scale-105 hover:shadow-2xl flex items-center gap-4
                    ${active 
                      ? 'border-emerald-500/50 bg-emerald-500/10 shadow-emerald-500/25' 
                      : 'border-slate-700/50 bg-slate-800/30 shadow-slate-800/50 hover:border-blue-500/50 hover:bg-blue-500/10'
                    }
                  `}
                  onClick={() => toggleModule(id)}
                >
                  <div className={`
                    p-3 rounded-2xl border-2 flex-shrink-0 transition-all
                    ${active 
                      ? 'border-emerald-500 bg-emerald-500/20 shadow-emerald-500/25' 
                      : 'border-slate-600/50 bg-slate-700/30 hover:border-blue-400 hover:bg-blue-500/20 shadow-slate-700/25'
                    }
                  `}>
                    <ModuleIcon id={id} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-lg capitalize">{label}</h3>
                    <p className="text-gray-400 text-sm mt-1">Contrôle total {label.toLowerCase()}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    active 
                      ? 'bg-emerald-500 shadow-emerald-500/50' 
                      : 'bg-slate-700/50 group-hover:bg-blue-500 shadow-blue-500/25'
                  }`}>
                    {active ? <CheckCircle size={16} className="text-white" /> : <EyeOff size={14} className="text-gray-500" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-700/50 bg-gradient-to-t from-slate-950">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Modules sélectionnés: <span className="font-bold text-emerald-400">{selectedModules.length}</span> / {MODULES.length}
            </div>
            <div className="flex-1" />
            <button
              onClick={onClose}
              className="px-8 py-3 border border-slate-700/50 hover:border-slate-600 bg-slate-900/50 text-gray-300 hover:text-white font-bold rounded-3xl shadow-xl hover:shadow-2xl transition-all"
            >
              Annuler
            </button>
            <button
              onClick={handleAssign}
              disabled={saving || selectedModules.length === 0}
              className="px-12 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Attribution...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Attribuer & Flouter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

