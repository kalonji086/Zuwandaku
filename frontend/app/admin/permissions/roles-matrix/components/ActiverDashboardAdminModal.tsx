"use client";

import { useState } from 'react';
import { X, Shield, LayoutDashboard, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface ActiverDashboardAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActiverDashboardAdminModal({ isOpen, onClose }: ActiverDashboardAdminModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleActivateDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/batch/dashboard/enable', {
        method: 'POST',
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error activating dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 rounded-3xl max-w-md w-full shadow-3xl">
        <div className="p-8 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                <LayoutDashboard size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Dashboard Admin</h3>
                <p className="text-gray-400">Activer module Dashboard pour tous admins</p>
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
              <h4 className="text-2xl font-bold text-emerald-400 mb-2">Dashboard activé</h4>
              <p className="text-gray-400">Module Dashboard activé pour tous admins</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-4 mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                <AlertTriangle size={24} className="text-emerald-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-emerald-300">Activation globale</h4>
                  <p className="text-emerald-200 text-sm">Active 'dashboard' pour tous rôles ADMIN.</p>
                </div>
              </div>
              <button
                onClick={handleActivateDashboard}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-emerald-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Activation...
                  </>
                ) : (
                  <>
                    <LayoutDashboard size={20} />
                    Activer Dashboard Admin
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

