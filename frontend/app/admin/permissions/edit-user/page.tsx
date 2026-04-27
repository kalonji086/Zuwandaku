"use client";

import { useState, useEffect } from 'react';
import { Shield, X, Check, Save, User, Mail, Phone, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function EditUserPage({ searchParams }: { searchParams: { userId: string } }) {
  const userId = searchParams.userId;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'CLIENT',
    status: 'ACTIF'
  });
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load user data
    setFormData({
      name: 'Jean Dupont',
      email: 'jean@exemple.com',
      phone: '+243 812 345 678',
      role: 'PROPRIETAIRE',
      status: 'ACTIF'
    });
    setPermissions({
      dashboard: true,
      properties: true,
      vehicles: false,
      users: false,
      contracts: true,
      approve: false,
      reports: true,
      settings: false
    });
  }, []);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmModule, setConfirmModule] = useState('');
  const [confirmAction, setConfirmAction] = useState<'activate' | 'deactivate'>('activate');
  const [message, setMessage] = useState('');

  const togglePermission = (module: string) => {
    const current = permissions[module];
    const action = current ? 'deactivate' : 'activate';
    setConfirmModule(module);
    setConfirmAction(action);
    setMessage(current ? `Désactiver l'accès "${module.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}"? L'utilisateur perdra cette permission.` : `Activer l'accès "${module.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}"?`);
    setShowConfirm(true);
  };

  const confirmToggle = () => {
    setPermissions(prev => ({
      ...prev,
      [confirmModule]: !permissions[confirmModule]
    }));
    setMessage(confirmAction === 'activate' ? '✅ Accès activé avec succès!' : '❌ Accès désactivé avec succès!');
    setShowConfirm(false);
    setTimeout(() => setMessage(''), 3000);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Utilisateur mis à jour!');
    }, 1000);
  };

  const MODULE_GROUPS = [
    { title: 'Core', modules: ['dashboard', 'properties', 'vehicles'] },
    { title: 'Gestion', modules: ['users', 'contracts', 'approve'] },
    { title: 'Admin', modules: ['reports', 'settings'] }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/permissions" className="flex items-center gap-2 text-gray-500 hover:text-gray-900">
          <X size={16} /> Retour
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User size={24} /> Editer utilisateur
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-xl font-bold mb-6">Informations</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} />
                Nom complet
              </label>
              <input 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                type="email"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Téléphone
              </label>
              <input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                type="tel"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Shield size={16} />
                Rôle
              </label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CLIENT">Client</option>
                <option value="PROPRIETAIRE">Propriétaire</option>
                <option value="COMMISSIONNAIRE">Commissionnaire</option>
                <option value="ADMIN">Administrateur</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <KeyRound size={16} />
                Statut
              </label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ACTIF">Actif</option>
                <option value="SUSPENDU">Suspendu</option>
                <option value="INACTIF">Inactif</option>
              </select>
            </div>
            <button 
              type="submit" 
              disabled={saving}
              className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save size={20} />
                  Sauvegarder
                </>
              )}
            </button>
          </form>
        </div>

        {/* Permissions Matrix */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Shield size={20} />
            Permissions détaillées
          </h2>
          <div className="space-y-6">
            {MODULE_GROUPS.map(({ title, modules }) => (
              <div key={title}>
                <h3 className="font-semibold text-gray-900 mb-4 px-2">{title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {modules.map(module => (
                    <div key={module} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                      <div className="flex items-center gap-3">
                        <button 
                          className={`w-12 h-8 rounded-lg border-2 flex items-center justify-center transition-all font-medium text-xs shadow-sm ${permissions[module] ? 'bg-green-500 border-green-500 text-white shadow-green-200' : 'bg-gray-100 border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-200'}`}
                          onClick={() => togglePermission(module)}
                        >
                          {permissions[module] ? 'ACTIF' : 'INACTIF'}
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium capitalize">{module}</p>
                          <p className="text-sm text-gray-500">{module === 'dashboard' ? 'Tableau de bord' : module === 'properties' ? 'Propriétés' : 'Autres'}</p>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 capitalize">{module}</p>
                        <p className="text-sm text-gray-500">{module === 'dashboard' ? 'Tableau de bord' : module === 'properties' ? 'Propriétés' : 'Autres'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))} 
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{confirmAction === 'activate' ? 'Activer accès' : 'Désactiver accès'}</h3>
              <p className="text-gray-600 mb-6">{message}</p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-6 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmToggle}
                  className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                >
                  {confirmAction === 'activate' ? 'Activer' : 'Désactiver'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {message && !showConfirm && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-in slide-in-from-top-2 fade-in duration-300 max-w-sm">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}


