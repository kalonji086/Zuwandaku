"use client";

import { useState } from 'react';
import { X, Shield, Home, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';

interface BloquerPropertiesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BloquerPropertiesModal({ isOpen, onClose }: BloquerPropertiesModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleBlockProperties = async () => {
    setLoading(true);
    try {
      // API call to disable all properties modules for all roles
      const response = await fetch('/api/admin/batch/properties/block', {
        method: 'POST',
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error blocking properties:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 rounded-3xl max-w-md w-full shadow-3xl">
        <div className="p-8 border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Bloquer Properties</h3>
                <p className="text-gray-400">Désactiver tous modules Properties</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl text-gray-400 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center">
              <CheckCircle size={64} className="mx-auto mb-4 text-emerald-400" />
              <h4 className="text-2xl font-bold text-emerald-400 mb-2">Modules bloqués</h4>
              <p className="text-gray-400">Tous Properties désactivés avec succès</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-4 mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl">
                <AlertTriangle size={24} className="text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-orange-300">Action irréversible</h4>
                  <p className="text-orange-200 text-sm">Désactive 'properties' pour TOUS les rôles. Utilisez Actions rapides pour réactiver.</p>
                </div>
              </div>
              <button
                onClick={handleBlockProperties}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-orange-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Blocage en cours...
                  </>
                ) : (
                  <>
                    <Home size={20} />
                    Bloquer tous Properties
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

