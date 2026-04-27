"use client";

import { useState } from 'react';
import { X, Shield, Building2, CheckCircle, Loader2, AlertTriangle } from 'lucide-react';

interface TemplateHotelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplateHotelModal({ isOpen, onClose }: TemplateHotelModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleApplyHotelTemplate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/template/hotel/apply', {
        method: 'POST',
      });
      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error applying hotel template:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-yellow-500/30 rounded-3xl max-w-md w-full shadow-3xl">
        <div className="p-8 border-b border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <Building2 size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Template Hôtel</h3>
                <p className="text-gray-400">Appliquer template HOTELIER complet</p>
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
              <h4 className="text-2xl font-bold text-emerald-400 mb-2">Template appliqué</h4>
              <p className="text-gray-400">Configuration HOTELIER déployée</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start gap-4 mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl">
                <AlertTriangle size={24} className="text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-300">Template complet</h4>
                  <p className="text-yellow-200 text-sm">Active hôtel, staff, approbations, rapports pour HOTELIER.</p>
                </div>
              </div>
              <button
                onClick={handleApplyHotelTemplate}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-yellow-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Application...
                  </>
                ) : (
                  <>
                    <Building2 size={20} />
                    Appliquer Template Hôtel
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

