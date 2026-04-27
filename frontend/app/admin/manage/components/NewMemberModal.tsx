"use client";

import { useState } from 'react';
import { X, UserPlus, Mail, Phone, Shield, Calendar, DollarSign, Upload, Save, Users } from 'lucide-react';

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (memberData: any) => void;
}

export default function NewMemberModal({ isOpen, onClose, onSave }: NewMemberModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    group: '',
    salary: '',
    startDate: '',
    cvFile: null as File | null,
  });

  const roles = ['Réceptionniste', 'Housekeeping', 'Manager', 'Maintenance', 'Sécurité', 'Cuisine'];
  const groups = ['Hotel Kinshasa', 'Hotel Lubumbashi', 'Central'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cvFile: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-6">
      <div className="bg-gradient-to-b from-slate-900/95 to-slate-900/70 backdrop-blur-3xl border border-emerald-500/30 rounded-4xl shadow-3xl max-w-2xl w-full animate-in zoom-in duration-200">
        <div className="p-8 border-b border-emerald-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <UserPlus size={28} className="text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                  Nouveau membre
                </h2>
                <p className="text-xl text-gray-400">Ajoutez un agent au rôle</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-slate-800 rounded-2xl text-gray-400 hover:text-white transition-all shadow-lg"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Users size={20} />
                Nom complet *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-emerald-500/40 font-semibold text-xl shadow-lg"
                placeholder="Jean Kabila"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Mail size={20} />
                Email professionnel *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-500/40 shadow-lg"
                placeholder="jean@hotel.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Phone size={20} />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-indigo-500/40 shadow-lg"
                placeholder="+243 99 123 4567"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Shield size={20} />
                Rôle *
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-purple-500/40 shadow-lg font-semibold"
                required
              >
                <option value="">Sélectionner rôle</option>
                <option>Réceptionniste</option>
                <option>Housekeeping</option>
                <option>Manager</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Users size={20} />
                Groupe *
              </label>
              <select
                value={formData.group}
                onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-orange-500/40 shadow-lg"
                required
              >
                <option value="">Sélectionner groupe</option>
                <option>Hotel Kinshasa</option>
                <option>Hotel Lubumbashi</option>
                <option>Central</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <DollarSign size={20} />
                Salaire (USD/mois)
              </label>
              <input
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-emerald-400 focus:ring-4 focus:ring-emerald-500/40 font-bold text-2xl shadow-lg"
                placeholder="450"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
              <Calendar size={20} />
              Date début souhaitée
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full px-6 py-5 bg-slate-800/70 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-indigo-500/40 shadow-lg text-lg"
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
              <Upload size={20} />
              CV / Pièces justificatives (optionnel)
            </label>
            <div className="border-2 border-dashed border-slate-600/50 rounded-4xl p-12 text-center group cursor-pointer hover:border-emerald-500/70 hover:bg-emerald-500/5 transition-all shadow-xl">
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-slate-800/50 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500/30 border-4 border-dashed border-slate-700/50 group-hover:border-emerald-400 transition-all shadow-lg">
                  <Upload size={32} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">Glisser ou cliquer</p>
                  <p className="text-gray-500 text-sm">Max 10Mb - PDF, JPG, DOC</p>
                </div>
              </div>
              {formData.cvFile && (
                <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl flex items-center gap-3">
                  <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-400 font-medium truncate">{formData.cvFile.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-12 border-t border-slate-700/50">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-12 py-6 border-2 border-slate-700/50 hover:border-slate-600 bg-slate-900/50 text-gray-300 hover:text-white font-bold rounded-4xl shadow-2xl hover:shadow-3xl transition-all text-xl flex items-center justify-center gap-3 backdrop-blur-sm"
              >
                <X size={24} />
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-16 py-6 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-4xl shadow-3xl hover:shadow-emerald-500/50 transition-all text-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!formData.name || !formData.email || !formData.role || !formData.group}
              >
                <Save size={26} />
                Créer membre
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

