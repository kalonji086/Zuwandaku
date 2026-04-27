"use client";

import { useState } from 'react';
import { X, Shield, User, RotateCw, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface ResetClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ResetClientModal({ isOpen, onClose }: ResetClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleResetClient = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/reset/client', {
        method: 'POST',
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error resetting CLIENT:', error);
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
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
                <RotateCw size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Reset CLIENT</h3>
                <p className="text-gray-400">Réinitialiser permissions CLIENT par défaut</p>
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
              <h4 className="text-2xl font-bold text-emerald-400 mb-2">CLIENT réinitialisé</h4>
              <p className="text-gray-400">Permissions CLIENT remises à zéro</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-4 mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                <AlertTriangle size={24} className="text-purple-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-purple-300">Réinitialisation complète</h4>
                  <p className="text-purple-200 text-sm">Supprime TOUTES permissions CLIENT et applique template par défaut.</p>
                </div>
              </div>
              <button
                onClick={handleResetClient}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Réinitialisation...
                  </>
                ) : (
                  <>
                    <User size={20} />
                    Reset CLIENT
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

