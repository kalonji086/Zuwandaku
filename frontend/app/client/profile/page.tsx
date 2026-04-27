'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, Shield, Save, Camera, CheckCircle } from 'lucide-react';

export default function ClientProfile() {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', cni: '' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed);
      setForm({ name: parsed.name ?? '', email: parsed.email ?? '', phone: parsed.phone ?? '', address: '', cni: '' });
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setTimeout(() => {
      const updated = { ...user, ...form };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setEditing(false);
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1200);
  };

  const inputClass = (active: boolean) =>
    `w-full px-4 py-3 rounded-xl text-sm border transition-all bg-white/3 text-white/80 focus:outline-none ${
      active ? 'border-blue-500/40 focus:border-blue-400 focus:ring-1 focus:ring-blue-500/20' : 'border-white/5 text-white/40 cursor-default'
    }`;

  if (!user) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      {/* Avatar + nom */}
      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-blue-500/20">
          {user.name?.charAt(0)?.toUpperCase() ?? 'C'}
        </div>
        <div>
          <h1 className="text-xl font-bold text-white/90">{user.name}</h1>
          <p className="text-xs text-white/30 mt-0.5">Client · {user.email}</p>
        </div>
        {saved && (
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
            <CheckCircle size={12} />Sauvegardé
          </div>
        )}
      </div>

      {/* Infos personnelles */}
      <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Informations personnelles</h2>
          <button onClick={() => { setEditing(!editing); }}
            className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all ${
              editing
                ? 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                : 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/15'
            }`}>
            {editing ? 'Annuler' : 'Modifier'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-2"><User size={11} />Nom complet</label>
            <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              disabled={!editing} className={inputClass(editing)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-2"><Mail size={11} />Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                disabled={!editing} className={inputClass(editing)} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-2"><Phone size={11} />Téléphone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                disabled={!editing} className={inputClass(editing)} />
            </div>
          </div>

          {editing && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-white/30 uppercase tracking-widest mb-2 block">Adresse</label>
                <input type="text" placeholder="Ex: Gombe, Kinshasa" value={form.address}
                  onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className={inputClass(true)} />
              </div>
              <div>
                <label className="flex items-center gap-1.5 text-[11px] text-white/30 uppercase tracking-widest mb-2"><Shield size={11} />Numéro CNI</label>
                <input type="text" placeholder="Ex: CD123456" value={form.cni}
                  onChange={e => setForm(f => ({ ...f, cni: e.target.value }))} className={inputClass(true)} />
              </div>
            </div>
          )}

          {editing && (
            <button onClick={handleSave} disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-blue-500/15 hover:bg-blue-500/20 disabled:opacity-50 text-blue-400 border border-blue-500/20 py-3 rounded-xl font-semibold text-sm transition-all mt-2">
              {saving
                ? <><div className="w-4 h-4 border-2 border-blue-400/50 border-t-blue-400 rounded-full animate-spin" />Enregistrement...</>
                : <><Save size={15} />Enregistrer</>}
            </button>
          )}
        </div>
      </div>

      {/* Sécurité + Photo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2"><Shield size={13} />Sécurité</h3>
          <div className="space-y-2">
            {[
              { label: 'Email vérifié', status: '✓', color: 'text-emerald-400' },
              { label: 'Téléphone vérifié', status: 'En attente', color: 'text-amber-400' },
              { label: '2FA', status: 'Non activé', color: 'text-white/25' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between px-3 py-2.5 bg-white/3 rounded-lg border border-white/5">
                <span className="text-xs text-white/50">{item.label}</span>
                <span className={`text-xs font-semibold ${item.color}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/5 bg-[#0d0d14] p-5">
          <h3 className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2"><Camera size={13} />Photo de profil</h3>
          <div className="text-center py-4">
            <div className="w-20 h-20 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center">
              <Camera size={24} className="text-white/15" />
            </div>
            <p className="text-[11px] text-white/25 mb-3">JPG ou PNG · max 5 Mo</p>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-white/5 hover:bg-white/8 text-white/40 hover:text-white/60 border border-white/10 py-2 px-4 rounded-lg text-xs font-medium transition-all">
              <Camera size={12} />Changer
              <input type="file" className="hidden" accept="image/*" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
