"use client";

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Mail, Phone, Calendar, Briefcase, Clock, DollarSign, Shield, CheckCircle, XCircle } from 'lucide-react';

const STAFF_MOCK: Record<string, any> = {
  '1': { id: '1', name: 'Marie Kabila', role: 'Réceptionniste', status: 'Active', shift: 'Matin (6h-14h)', salary: 450, joinDate: '2024-01-15', email: 'marie.kabila@hotel.com', phone: '+243 812 345 678', address: 'Kinshasa, Gombe', notes: 'Excellente performance, ponctuelle.', absences: 1, hoursThisMonth: 168 },
  '2': { id: '2', name: 'Jean-Pierre Muteba', role: 'Housekeeping', status: 'Active', shift: 'Après-midi (14h-22h)', salary: 380, joinDate: '2024-02-10', email: 'jp.muteba@hotel.com', phone: '+243 999 123 456', address: 'Kinshasa, Limete', notes: 'Travail soigné.', absences: 0, hoursThisMonth: 160 },
  '3': { id: '3', name: 'Sophie Lumu', role: 'Manager', status: 'Active', shift: 'Complet (8h-20h)', salary: 1200, joinDate: '2023-11-01', email: 'sophie.lumu@hotel.com', phone: '+243 817 789 012', address: 'Kinshasa, Ngaliema', notes: 'Manager senior, gère 3 équipes.', absences: 0, hoursThisMonth: 240 },
  '4': { id: '4', name: 'David Nsakala', role: 'Réceptionniste', status: 'En attente', shift: 'Soir (22h-6h)', salary: 420, joinDate: '2024-03-20', email: 'david.nsakala@hotel.com', phone: '+243 985 654 321', address: 'Kinshasa, Kintambo', notes: 'Nouveau, en période d\'essai.', absences: 2, hoursThisMonth: 144 },
};

export default function StaffDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const staff = STAFF_MOCK[id];

  if (!staff) {
    return (
      <div className="text-center py-20">
        <p className="text-2xl text-gray-400 mb-6">Agent introuvable</p>
        <button onClick={() => router.back()} className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl">Retour</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-300 hover:text-white transition-all">
          <ArrowLeft size={18} /> Retour
        </button>
        <Link href={`/hotel/manage/${id}/edit`} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white font-bold rounded-xl shadow-lg transition-all">
          <Edit size={18} /> Modifier
        </Link>
      </div>

      {/* Header card */}
      <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/50 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 mb-6 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
            {staff.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black text-white mb-1">{staff.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-4 py-1.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl font-semibold text-sm">{staff.role}</span>
              <span className={`px-4 py-1.5 rounded-xl font-semibold text-sm border-2 ${staff.status === 'Active' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-yellow-500/20 border-yellow-500 text-yellow-400'}`}>
                {staff.status === 'Active' ? <><CheckCircle size={14} className="inline mr-1" />Actif</> : <><XCircle size={14} className="inline mr-1" />En attente</>}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Contact */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <Mail size={18} className="text-blue-400 shrink-0" />
              <span>{staff.email}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Phone size={18} className="text-green-400 shrink-0" />
              <span>{staff.phone}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Shield size={18} className="text-purple-400 shrink-0" />
              <span>{staff.address}</span>
            </div>
          </div>
        </div>

        {/* Poste */}
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-4">Poste</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <Briefcase size={18} className="text-orange-400 shrink-0" />
              <span>{staff.role}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Clock size={18} className="text-yellow-400 shrink-0" />
              <span>{staff.shift}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <Calendar size={18} className="text-indigo-400 shrink-0" />
              <span>Depuis le {staff.joinDate}</span>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign size={18} className="text-emerald-400 shrink-0" />
              <span className="text-2xl font-black text-emerald-400">${staff.salary}<span className="text-sm text-gray-400 font-normal">/mois</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats du mois */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5 text-center">
          <p className="text-3xl font-black text-blue-400">{staff.hoursThisMonth}h</p>
          <p className="text-sm text-gray-400 mt-1">Heures ce mois</p>
        </div>
        <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5 text-center">
          <p className="text-3xl font-black text-red-400">{staff.absences}</p>
          <p className="text-sm text-gray-400 mt-1">Absences</p>
        </div>
        <div className="bg-gray-900/60 rounded-2xl border border-gray-700/50 p-5 text-center">
          <p className="text-3xl font-black text-emerald-400">${staff.salary}</p>
          <p className="text-sm text-gray-400 mt-1">Salaire mensuel</p>
        </div>
      </div>

      {/* Notes */}
      {staff.notes && (
        <div className="bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 shadow-xl">
          <h3 className="text-lg font-bold text-white mb-3">Notes</h3>
          <p className="text-gray-300">{staff.notes}</p>
        </div>
      )}
    </div>
  );
}
