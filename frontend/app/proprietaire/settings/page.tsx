'use client';

import { useState } from 'react';
import { Settings, Lock, Bell, Eye, LogOut, CreditCard, Save, X, AlertTriangle, KeyRound, Building2, Phone, User } from 'lucide-react';

interface SwitchProps { checked: boolean; onChange: () => void; }
const Switch = ({ checked, onChange }: SwitchProps) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-gray-700'}`}
  >
    <span className={`pointer-events-none absolute mx-0.5 inline-block h-4 w-4 rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const BANKS = ['ECOBANK CD', 'Rawbank', 'TMB', 'Equity BCDC', 'FBNBank', 'Afriland First Bank', 'Autre'];

// ── Modal Compte Bancaire ──────────────────────────────────────────────────────
function BankModal({ bank, onClose, onSave }: {
  bank: { bankName: string; accountNumber: string; accountHolder: string; currency: string };
  onClose: () => void;
  onSave: (b: typeof bank) => void;
}) {
  const [form, setForm] = useState(bank);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Modifier compte bancaire</h2>
              <p className="text-xs text-gray-400">Informations de paiement</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Banque *</label>
            <div className="relative">
              <Building2 size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <select
                value={form.bankName}
                onChange={e => set('bankName', e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              >
                {BANKS.map(b => <option key={b} value={b} className="bg-gray-900">{b}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Titulaire du compte *</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={form.accountHolder}
                onChange={e => set('accountHolder', e.target.value)}
                placeholder="Nom complet"
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Numéro de compte *</label>
            <div className="relative">
              <CreditCard size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={form.accountNumber}
                onChange={e => set('accountNumber', e.target.value)}
                placeholder="CD00 0000 0000 0000 0000"
                className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Devise</label>
            <div className="flex gap-2">
              {['USD', 'CDF', 'EUR'].map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => set('currency', c)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-colors ${form.currency === c ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
            Annuler
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            disabled={!form.bankName || !form.accountNumber || !form.accountHolder}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Réinitialiser mot de passe ──────────────────────────────────────────
function ResetPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.next.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    if (form.next !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setStep('success');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center">
              <KeyRound size={20} className="text-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Réinitialiser le mot de passe</h2>
              <p className="text-xs text-gray-400">Choisissez un nouveau mot de passe sécurisé</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {step === 'success' ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <KeyRound size={28} className="text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Mot de passe mis à jour</h3>
            <p className="text-gray-400 text-sm">Votre mot de passe a été modifié avec succès.</p>
            <button onClick={onClose} className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors mt-2">
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {[
              { key: 'current', label: 'Mot de passe actuel', placeholder: '••••••••' },
              { key: 'next', label: 'Nouveau mot de passe', placeholder: 'Min. 8 caractères' },
              { key: 'confirm', label: 'Confirmer le nouveau', placeholder: '••••••••' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    required
                    value={form[key as keyof typeof form]}
                    onChange={e => set(key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-yellow-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">{error}</p>
            )}

            {form.next && (
              <div className="flex gap-1">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full transition-colors ${
                    form.next.length >= i * 3
                      ? i <= 1 ? 'bg-red-500' : i <= 2 ? 'bg-yellow-500' : i <= 3 ? 'bg-blue-500' : 'bg-green-500'
                      : 'bg-gray-700'
                  }`} />
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Mise à jour...</> : 'Confirmer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Modal Désactiver compte ────────────────────────────────────────────────────
function DisableAccountModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<'confirm' | 'password'>('confirm');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    if (!password) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    alert('Compte désactivé. Vous allez être déconnecté.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-red-500/40 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Désactiver mon compte</h2>
              <p className="text-xs text-red-400">Action irréversible</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {step === 'confirm' ? (
          <div className="p-6 space-y-5">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
              <p className="text-sm font-semibold text-red-400">Ce qui sera supprimé :</p>
              <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                <li>Tous vos biens et véhicules publiés</li>
                <li>Vos contrats actifs seront suspendus</li>
                <li>Votre profil ne sera plus visible</li>
                <li>Vos données seront archivées 30 jours</li>
              </ul>
            </div>
            <p className="text-sm text-gray-400">
              Cette action est <span className="text-red-400 font-semibold">définitive</span>. Vous ne pourrez pas récupérer votre compte après 30 jours.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
                Annuler
              </button>
              <button
                onClick={() => setStep('password')}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            <p className="text-sm text-gray-300">Confirmez votre identité en saisissant votre mot de passe.</p>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  className="w-full pl-9 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-red-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep('confirm')} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
                Retour
              </button>
              <button
                onClick={handleDisable}
                disabled={!password || loading}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Désactivation...</> : 'Désactiver définitivement'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page principale ────────────────────────────────────────────────────────────
export default function ProprietaireSettings() {
  const [showBankModal, setShowBankModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);

  const [profile, setProfile] = useState({
    fullName: 'Jean Propriétaire',
    email: 'jean@proprietaire.com',
    phone: '+243 999 999 999',
    company: 'Mon Immobilier SARL',
    bio: 'Propriétaire immobilier expérimenté à Kinshasa',
  });

  const [notifications, setNotifications] = useState({
    newInquiries: true, bookingConfirmation: true, paymentReceived: true, weeklyReport: true, newMessages: true,
  });

  const [privacy, setPrivacy] = useState({
    showPhone: true, showEmail: false, showLocation: true, publicProfile: true,
  });

  const [bank, setBank] = useState({
    bankName: 'ECOBANK CD', accountNumber: '****1234', accountHolder: 'Jean Mukongo', currency: 'USD',
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3"><Settings size={26} />Paramètres du compte</h1>
        <p className="text-gray-400 mt-1">Gérez votre profil et vos préférences</p>
      </div>

      {/* Profil */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Eye size={22} />Profil public</h2>
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: 'fullName', label: 'Nom complet', type: 'text', icon: <User size={15} /> },
              { key: 'phone', label: 'Téléphone', type: 'tel', icon: <Phone size={15} /> },
              { key: 'email', label: 'Email', type: 'email', icon: <User size={15} /> },
              { key: 'company', label: 'Entreprise', type: 'text', icon: <Building2 size={15} /> },
            ].map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                <input
                  type={type}
                  value={profile[key as keyof typeof profile]}
                  onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Biographie</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Bell size={22} />Notifications</h2>
        <div className="space-y-3">
          {[
            { key: 'newInquiries', label: 'Nouvelles demandes', desc: 'Alerte pour chaque demande de client' },
            { key: 'bookingConfirmation', label: 'Confirmation de réservation', desc: 'Confirmations de réservation' },
            { key: 'paymentReceived', label: 'Paiements reçus', desc: 'Notifications de paiement' },
            { key: 'weeklyReport', label: 'Rapport hebdomadaire', desc: 'Résumé de votre activité' },
            { key: 'newMessages', label: 'Nouveaux messages', desc: 'Messages des clients' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div>
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Switch checked={notifications[key as keyof typeof notifications]} onChange={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Confidentialité */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><Lock size={22} />Confidentialité</h2>
        <div className="space-y-3">
          {[
            { key: 'showPhone', label: 'Afficher téléphone', desc: 'Visible dans votre profil public' },
            { key: 'showEmail', label: 'Afficher email', desc: 'Visible aux clients intéressés' },
            { key: 'showLocation', label: 'Afficher localisation', desc: 'Montrer vos biens sur la carte' },
            { key: 'publicProfile', label: 'Profil public', desc: 'Permettre aux autres de voir votre profil' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700">
              <div>
                <p className="font-semibold text-white text-sm">{label}</p>
                <p className="text-xs text-gray-400">{desc}</p>
              </div>
              <Switch checked={privacy[key as keyof typeof privacy]} onChange={() => setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof p] }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Compte bancaire */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3"><CreditCard size={22} />Compte bancaire</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Banque</p>
            <p className="font-bold text-white">{bank.bankName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Titulaire</p>
            <p className="font-bold text-white">{bank.accountHolder}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Numéro</p>
            <p className="font-mono text-white">{bank.accountNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Devise</p>
            <p className="font-bold text-white">{bank.currency}</p>
          </div>
        </div>
        <button
          onClick={() => setShowBankModal(true)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors"
        >
          Modifier compte bancaire
        </button>
      </div>

      {/* Zone danger */}
      <div className="bg-red-500/5 border border-red-500/30 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-red-400 mb-2 flex items-center gap-3"><AlertTriangle size={22} />Zone danger</h2>
        <p className="text-gray-400 text-sm mb-6">Les actions dans cette section sont irréversibles. Procédez avec prudence.</p>
        <div className="space-y-3">
          <button
            onClick={() => setShowResetModal(true)}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Réinitialiser le mot de passe
          </button>
          <button
            onClick={() => setShowDisableModal(true)}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Désactiver mon compte
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors">
          <Save size={18} /> Enregistrer les modifications
        </button>
      </div>

      {showBankModal && <BankModal bank={bank} onClose={() => setShowBankModal(false)} onSave={setBank} />}
      {showResetModal && <ResetPasswordModal onClose={() => setShowResetModal(false)} />}
      {showDisableModal && <DisableAccountModal onClose={() => setShowDisableModal(false)} />}
    </div>
  );
}
