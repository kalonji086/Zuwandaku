"use client";
import { useState } from 'react';
import { Settings, Hotel, Bell, Shield, Palette, Save, CheckCircle } from 'lucide-react';

export default function ParametresPage() {
  const [saved, setSaved] = useState(false);
  const [config, setConfig] = useState({
    hotelName: 'ZUWAndaku Hotel',
    address: 'Avenue Kasa-Vubu, Kinshasa, RDC',
    phone: '+243 81 000 0000',
    email: 'hotel@zuwandaku.cd',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    currency: 'USD',
    taxRate: '16',
    notifReservation: true,
    notifCheckIn: true,
    notifCheckOut: true,
    notifKitchen: true,
    notifIncident: true,
    twoFactor: false,
    sessionTimeout: '30',
  });

  const update = (key: string, value: any) => setConfig(p => ({ ...p, [key]: value }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const Section = ({ icon: Icon, title, color, children }: any) => (
    <div className="bg-[#0a1628]/80 border border-white/5 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className={`w-1.5 h-5 rounded-full shadow-[0_0_8px_currentColor] ${color}`} />
        <Icon size={16} className="text-gray-400" />
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );

  const Field = ({ label, value, onChange, type = 'text' }: any) => (
    <div>
      <label className="text-xs text-gray-500 mb-1.5 block">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-all" />
    </div>
  );

  const Toggle = ({ label, desc, value, onChange }: any) => (
    <div className="flex items-center justify-between py-1">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <button onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-500/10 border border-gray-500/20 rounded-xl">
            <Settings size={20} className="text-gray-400" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white">Paramètres</h2>
            <p className="text-xs text-gray-500">Configuration de l'hôtel</p>
          </div>
        </div>
        <button onClick={save}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]">
          {saved ? <><CheckCircle size={15} /> Sauvegardé</> : <><Save size={15} /> Sauvegarder</>}
        </button>
      </div>

      {/* Hôtel */}
      <Section icon={Hotel} title="Informations hôtel" color="bg-cyan-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nom de l'hôtel" value={config.hotelName} onChange={(v: string) => update('hotelName', v)} />
          <Field label="Email" value={config.email} onChange={(v: string) => update('email', v)} type="email" />
          <Field label="Téléphone" value={config.phone} onChange={(v: string) => update('phone', v)} />
          <Field label="Adresse" value={config.address} onChange={(v: string) => update('address', v)} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Check-in</label>
            <input type="time" value={config.checkInTime} onChange={e => update('checkInTime', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Check-out</label>
            <input type="time" value={config.checkOutTime} onChange={e => update('checkOutTime', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Devise</label>
            <select value={config.currency} onChange={e => update('currency', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50">
              {['USD', 'CDF', 'EUR'].map(c => <option key={c} value={c} className="bg-[#0a1628]">{c}</option>)}
            </select>
          </div>
          <Field label="Taxe (%)" value={config.taxRate} onChange={(v: string) => update('taxRate', v)} type="number" />
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" color="bg-blue-500">
        <Toggle label="Nouvelle réservation" desc="Alerte à chaque réservation" value={config.notifReservation} onChange={(v: boolean) => update('notifReservation', v)} />
        <Toggle label="Check-in / Check-out" value={config.notifCheckIn} onChange={(v: boolean) => update('notifCheckIn', v)} />
        <Toggle label="Commandes cuisine" desc="Quand une commande est envoyée" value={config.notifKitchen} onChange={(v: boolean) => update('notifKitchen', v)} />
        <Toggle label="Incidents sécurité" desc="Alertes du gardien" value={config.notifIncident} onChange={(v: boolean) => update('notifIncident', v)} />
      </Section>

      {/* Sécurité */}
      <Section icon={Shield} title="Sécurité" color="bg-purple-500">
        <Toggle label="Double authentification" desc="Recommandé pour les comptes admin" value={config.twoFactor} onChange={(v: boolean) => update('twoFactor', v)} />
        <div>
          <label className="text-xs text-gray-500 mb-1.5 block">Timeout de session (minutes)</label>
          <select value={config.sessionTimeout} onChange={e => update('sessionTimeout', e.target.value)}
            className="w-48 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50">
            {['15', '30', '60', '120'].map(t => <option key={t} value={t} className="bg-[#0a1628]">{t} min</option>)}
          </select>
        </div>
      </Section>

      {/* Apparence */}
      <Section icon={Palette} title="Apparence" color="bg-orange-500">
        <div className="flex items-center gap-3">
          <p className="text-sm text-gray-400">Thème actuel :</p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
            <span className="text-xs font-bold text-cyan-300">Starlink Dark</span>
          </div>
        </div>
        <div className="flex gap-3">
          {[
            { name: 'Starlink', from: 'from-cyan-500', to: 'to-blue-600', active: true },
            { name: 'Sunset', from: 'from-orange-500', to: 'to-red-600', active: false },
            { name: 'Forest', from: 'from-green-500', to: 'to-emerald-600', active: false },
          ].map(theme => (
            <div key={theme.name} className={`flex flex-col items-center gap-2 cursor-pointer group`}>
              <div className={`w-12 h-8 rounded-lg bg-gradient-to-br ${theme.from} ${theme.to} ${theme.active ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0a1628]' : 'opacity-50 group-hover:opacity-80'} transition-all`} />
              <span className="text-xs text-gray-500">{theme.name}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
