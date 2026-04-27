"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Trash2, User, Mail, Phone, Briefcase, Clock, DollarSign, MapPin } from 'lucide-react';

const STAFF_MOCK: Record<string, any> = {
  '1': { id: '1', name: 'Marie Kabila', role: 'Réceptionniste', status: 'Active', shift: 'Matin (6h-14h)', salary: '450', joinDate: '2024-01-15', email: 'marie.kabila@hotel.com', phone: '+243 812 345 678', address: 'Kinshasa, Gombe', notes: 'Excellente performance, ponctuelle.' },
  '2': { id: '2', name: 'Jean-Pierre Muteba', role: 'Housekeeping', status: 'Active', shift: 'Après-midi (14h-22h)', salary: '380', joinDate: '2024-02-10', email: 'jp.muteba@hotel.com', phone: '+243 999 123 456', address: 'Kinshasa, Limete', notes: 'Travail soigné.' },
  '3': { id: '3', name: 'Sophie Lumu', role: 'Manager', status: 'Active', shift: 'Complet (8h-20h)', salary: '1200', joinDate: '2023-11-01', email: 'sophie.lumu@hotel.com', phone: '+243 817 789 012', address: 'Kinshasa, Ngaliema', notes: 'Manager senior.' },
  '4': { id: '4', name: 'David Nsakala', role: 'Réceptionniste', status: 'En attente', shift: 'Soir (22h-6h)', salary: '420', joinDate: '2024-03-20', email: 'david.nsakala@hotel.com', phone: '+243 985 654 321', address: 'Kinshasa, Kintambo', notes: "Nouveau, en période d'essai." },
};

const ROLES = ['Réceptionniste', 'Housekeeping', 'Manager', 'Maintenance', 'Sécurité', 'Cuisine'];
const SHIFTS = ['Matin (6h-14h)', 'Après-midi (14h-22h)', 'Soir (22h-6h)', 'Complet (8h-20h)'];

export default function StaffEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const initial = STAFF_MOCK[id];

  const [form, setForm] = useState(initial ?? {});
  const [saving, setSaving] = useState(false);

  if (!initial) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-400 mb-6">Agent introuvable</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl">Retour</button>
      </div>
    );
  }

  const set = (key: string, val: string) => setForm((p: any) => ({ ...p, [key]: val }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Modifications sauvegardées!');
      router.push(`/hotel/manage/${id}`);
    }, 800);
  };

  const handleDelete = () => {
    if (confirm(`Supprimer ${form.name} du personnel?`)) {
      alert('Agent supprimé.');
      router.push('/hotel/manage');
    }
  };

  const field = (label: string, icon: React.ReactNode, key: string, type = 'text', opts?: string[]) => (
    <div>
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">{icon}{label}</label>
      {opts ? (
        <select value={form[key] ?? ''} onChange={e => set(key, e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500">
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key] ?? ''} onChange={e => set(key, e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500" />
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all">
          <ArrowLeft size={18} /> Retour
        </button>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 rounded-xl transition-all">
          <Trash2 size={16} /> Supprimer
        </button>
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 shadow-2xl">
        <h1 className="text-2xl font-black text-white mb-8">Modifier — {initial.name}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {field('Nom complet', <User size={16} />, 'name')}
            {field('Email', <Mail size={16} />, 'email', 'email')}
            {field('Téléphone', <Phone size={16} />, 'phone', 'tel')}
            {field('Adresse', <MapPin size={16} />, 'address')}
            {field('Rôle', <Briefcase size={16} />, 'role', 'text', ROLES)}
            {field('Service', <Clock size={16} />, 'shift', 'text', SHIFTS)}
            {field('Salaire (USD/mois)', <DollarSign size={16} />, 'salary', 'number')}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-2">Statut</label>
              <select value={form.status ?? ''} onChange={e => set('status', e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500">
                <option value="Active">Actif</option>
                <option value="En attente">En attente</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Notes</label>
            <textarea rows={3} value={form.notes ?? ''} onChange={e => set('notes', e.target.value)} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-700">
            <button type="button" onClick={() => router.back()} className="flex-1 py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-xl transition-all font-medium">
              Annuler
            </button>
            <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition-all">
              <Save size={18} />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
