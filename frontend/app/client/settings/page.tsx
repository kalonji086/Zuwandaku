'use client';

import { useState } from 'react';
import { Bell, Shield, Globe, CreditCard, LogOut, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AddPaymentMethodModal from '../../components/AddPaymentMethodModal';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-500' : 'bg-white/10'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function Section({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
        <div>
          <h2 className="text-sm font-semibold text-white/80">{title}</h2>
          <p className="text-xs text-white/30 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div>
        <p className="text-sm text-white/70 font-medium">{label}</p>
        <p className="text-xs text-white/25 mt-0.5">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function ClientSettings() {
  const router = useRouter();
  const [notifs, setNotifs] = useState({ contracts: true, status: false, payments: true });
  const [privacy, setPrivacy] = useState({ publicProfile: true, phone: false });
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [payModal, setPayModal] = useState(false);
  const [payMethods, setPayMethods] = useState([{ type: 'card', label: 'Visa · **** 1234', sub: 'Carte par défaut' }]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="max-w-2xl space-y-4">
      <AddPaymentMethodModal isOpen={payModal} onClose={() => setPayModal(false)} onAdd={m => setPayMethods(prev => [...prev, { ...m, sub: '' }])} />
      <div className="mb-2">
        <h1 className="text-lg font-bold text-white/90">Paramètres</h1>
        <p className="text-xs text-white/30 mt-0.5">Gérez vos préférences et notifications</p>
      </div>

      {/* Notifications */}
      <Section icon={<Bell size={15} className="text-blue-400" />} title="Notifications" subtitle="Contrôlez les alertes email et push">
        <ToggleRow label="Nouveaux contrats" desc="Alerte pour chaque nouveau contrat proposé" checked={notifs.contracts} onChange={() => setNotifs(n => ({ ...n, contracts: !n.contracts }))} />
        <ToggleRow label="Changement de statut" desc="Quand le statut de vos contrats change" checked={notifs.status} onChange={() => setNotifs(n => ({ ...n, status: !n.status }))} />
        <ToggleRow label="Paiements" desc="Confirmation de chaque paiement reçu" checked={notifs.payments} onChange={() => setNotifs(n => ({ ...n, payments: !n.payments }))} />
      </Section>

      {/* Confidentialité */}
      <Section icon={<Shield size={15} className="text-purple-400" />} title="Confidentialité" subtitle="Contrôlez la visibilité de vos données">
        <ToggleRow label="Profil public" desc="Votre nom visible par les propriétaires" checked={privacy.publicProfile} onChange={() => setPrivacy(p => ({ ...p, publicProfile: !p.publicProfile }))} />
        <ToggleRow label="Numéro de téléphone" desc="Visible par les propriétaires pour contact direct" checked={privacy.phone} onChange={() => setPrivacy(p => ({ ...p, phone: !p.phone }))} />
      </Section>

      {/* Langue */}
      <Section icon={<Globe size={15} className="text-cyan-400" />} title="Langue" subtitle="Langue d'affichage de l'application">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'fr', label: 'Français', sub: 'Par défaut' },
            { id: 'en', label: 'English', sub: 'English' },
          ].map(l => (
            <button key={l.id} onClick={() => setLang(l.id as any)}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                lang === l.id
                  ? 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                  : 'bg-white/3 border-white/5 text-white/40 hover:bg-white/5 hover:text-white/60'
              }`}>
              <span className="text-lg">{l.id === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
              <div>
                <p className="text-sm font-semibold">{l.label}</p>
                <p className="text-[10px] opacity-60">{l.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {/* Paiements */}
      <Section icon={<CreditCard size={15} className="text-emerald-400" />} title="Paiements" subtitle="Méthodes de paiement et facturation">
        <div className="space-y-2 mb-3">
          {payMethods.map((pm, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5 bg-white/3 rounded-xl border border-white/5">
              <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/20 rounded-xl flex items-center justify-center text-[10px] font-bold text-blue-400">
                {pm.type === 'card' ? 'VISA' : pm.type === 'mobile' ? '📱' : '🏦'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/70 font-medium">{pm.label}</p>
                {pm.sub && <p className="text-[11px] text-white/25">{pm.sub}</p>}
              </div>
              {i > 0 && (
                <button onClick={() => setPayMethods(prev => prev.filter((_, j) => j !== i))}
                  className="text-white/20 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>
        <button onClick={() => setPayModal(true)}
          className="w-full border border-white/5 hover:border-blue-500/20 bg-white/3 hover:bg-blue-500/5 text-white/30 hover:text-blue-400 py-3 px-4 rounded-xl text-sm transition-all">
          + Ajouter un moyen de paiement
        </button>
      </Section>

      {/* Déconnexion */}
      <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-5 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-red-400 flex items-center gap-2"><LogOut size={15} />Déconnexion</h2>
          <p className="text-xs text-white/25 mt-0.5">Se déconnecter de tous les appareils</p>
        </div>
        <button onClick={handleLogout}
          className="bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 px-5 py-2 rounded-xl text-sm font-semibold transition-all">
          Déconnecter
        </button>
      </div>
    </div>
  );
}
