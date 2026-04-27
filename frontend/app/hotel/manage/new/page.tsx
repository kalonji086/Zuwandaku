"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, UserPlus, Mail, Phone, Calendar, Briefcase, Shield, Clock, MapPin, Upload, Users, DollarSign } from 'lucide-react';

export default function ManageNewStaffPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    shift: '',
    salary: '',
    startDate: '',
    cvFile: null as File | null,
    notes: '',
  });

  const roles = ['Réceptionniste', 'Housekeeping', 'Manager', 'Maintenance', 'Sécurité', 'Cuisine'];
  const shifts = ['Matin (6h-14h)', 'Après-midi (14h-22h)', 'Soir (22h-6h)', 'Complet (8h-20h)'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate send to admin
    console.log('Request sent:', formData);
    alert('Demande envoyée à l\'Admin pour approbation!');
    router.push('/hotel/manage');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, cvFile: file }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-8">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-12 p-4 bg-gray-800/50 hover:bg-gray-700 rounded-3xl border border-gray-700 transition-all flex items-center gap-3 text-gray-300 hover:text-white"
        >
          <ArrowLeft size={24} />
          <span>Retour</span>
        </button>

        <div className="bg-gray-900/80 backdrop-blur-xl rounded-4xl border border-gray-700/50 shadow-3xl p-12">
          <div className="text-center mb-12">
            <UserPlus size={64} className="mx-auto mb-6 bg-emerald-500/20 p-6 rounded-3xl text-emerald-400 border-4 border-emerald-500/30" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Demande nouveau personnel
            </h1>
            <p className="text-xl text-gray-400 max-w-md mx-auto">
              Remplissez le formulaire. L'Admin recevra la demande pour approbation et création du compte.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
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
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500/50 text-xl font-semibold"
                  placeholder="Marie Kabila"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                  <Mail size={20} />
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500/50"
                  placeholder="marie@hotel.com"
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
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-indigo-500/30"
                  placeholder="+243 99 123 4567"
                />
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                  <Briefcase size={20} />
                  Rôle souhaité *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white focus:ring-4 focus:ring-purple-500/30"
                  required
                >
                  <option value="">Sélectionner rôle</option>
                  {roles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                  <Clock size={20} />
                  Service
                </label>
                <select
                  value={formData.shift}
                  onChange={(e) => setFormData(prev => ({ ...prev, shift: e.target.value }))}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white focus:ring-4 focus:ring-orange-500/30"
                >
                  <option value="">Choisir service</option>
                  {shifts.map(shift => (
                    <option key={shift} value={shift}>{shift}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                  <DollarSign size={20} />
                  Salaire proposé (USD/mois)
                </label>
                <input
                  type="number"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                  className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-emerald-400 focus:ring-4 focus:ring-emerald-500/30 font-bold text-xl"
                  placeholder="450"
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Calendar size={20} />
                Date souhaitée
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white focus:ring-4 focus:ring-indigo-500/30"
              />
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <Upload size={20} />
                CV / Documents (optionnel)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-3xl p-12 text-center group cursor-pointer hover:border-emerald-500 hover:bg-emerald-500/5 transition-all">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-gray-800/50 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500/20 border-4 border-dashed border-gray-700 group-hover:border-emerald-400">
                    <Upload size={32} className="text-gray-500 group-hover:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-white mb-1 group-hover:text-emerald-400">Cliquer pour uploader</p>
                    <p className="text-gray-500">PDF, DOC jusqu'à 5Mb</p>
                  </div>
                </div>
                {formData.cvFile && (
                  <p className="mt-4 text-emerald-400 font-medium flex items-center gap-2">
                    <CheckCircle size={20} />
                    {formData.cvFile.name}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-lg font-semibold text-gray-300 mb-4 flex items-center gap-3">
                <MapPin size={20} />
                Notes supplémentaires
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={4}
                className="w-full px-6 py-5 bg-gray-800/70 border border-gray-600 rounded-3xl text-white placeholder-gray-500 focus:ring-4 focus:ring-violet-500/30 resize-vertical"
                placeholder="Expérience pertinente, compétences spéciales, etc..."
              />
            </div>

            <div className="flex gap-6 pt-12 border-t border-gray-700">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 h-20 border-2 border-gray-700 hover:border-gray-600 bg-gray-900/50 text-gray-300 font-bold text-xl rounded-4xl transition-all backdrop-blur-sm hover:bg-gray-800/50 shadow-2xl hover:shadow-3xl"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 h-20 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-xl rounded-4xl shadow-3xl hover:shadow-emerald-500/50 transition-all flex items-center justify-center gap-4"
              >
                <Shield size={28} />
                Envoyer demande à Admin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

