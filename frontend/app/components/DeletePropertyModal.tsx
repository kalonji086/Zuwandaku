"use client";

import { X, Trash2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  onConfirm: (id: string) => void;
  isLoading?: boolean;
}

export default function DeletePropertyModal({ isOpen, onClose, property, onConfirm, isLoading }: Props) {
  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-md">

        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center">
              <Trash2 size={16} className="text-red-400" />
            </div>
            <h2 className="text-base font-bold text-white">Supprimer le bien</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={16} className="text-white/50" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
            <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-white text-sm font-medium mb-1">Cette action est irréversible</p>
              <p className="text-white/50 text-xs">Le bien et toutes ses données associées seront définitivement supprimés.</p>
            </div>
          </div>

          {/* Aperçu du bien */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
            <img
              src={property.photos?.[0] || 'https://placehold.co/60x60?text=Bien'}
              alt={property.type}
              className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0"
            />
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{property.description || property.type}</p>
              <p className="text-white/40 text-xs mt-0.5">{property.commune} — {property.quartier?.nom || property.quartier}</p>
              <p className="text-white font-bold text-sm mt-1">${property.price?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 flex gap-3 justify-end">
          <button onClick={onClose}
            className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl transition-all text-sm">
            Annuler
          </button>
          <button
            onClick={() => onConfirm(property.id)}
            disabled={isLoading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all text-sm flex items-center gap-2 disabled:opacity-50">
            {isLoading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Suppression...</>
              : <><Trash2 size={15} />Supprimer définitivement</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
