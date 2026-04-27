"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { Users, UserPlus, Shield, Clock, CheckCircle, AlertCircle, Settings } from 'lucide-react';

interface ManageLayoutProps {
  children: ReactNode;
}

export default function ManageLayout({ children }: ManageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-7xl mx-auto p-8">
        <nav className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700/50 shadow-2xl mb-12 p-6 flex flex-wrap gap-4 justify-center lg:justify-start">
          <Link href="/hotel/manage" className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 font-bold rounded-2xl transition-all group">
            <Users size={20} />
            <span>Personnel</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
          <Link href="/hotel/manage/new" className="flex items-center gap-2 px-6 py-3 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 font-bold rounded-2xl transition-all">
            <UserPlus size={20} />
            <span>Demande compte</span>
          </Link>

          <Link href="/hotel/manage/requests" className="flex items-center gap-2 px-6 py-3 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/30 text-orange-300 font-bold rounded-2xl transition-all">
            <Clock size={20} />
            <span>Demandes en attente</span>
          </Link>
          <Link href="/hotel/manage/reports" className="flex items-center gap-2 px-6 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 font-bold rounded-2xl transition-all">
            <CheckCircle size={20} />
            <span>Rapports</span>
          </Link>
          <Link href="/hotel/manage/settings" className="flex items-center gap-2 px-6 py-3 bg-gray-600/20 hover:bg-gray-600/40 border border-gray-500/30 text-gray-300 font-bold rounded-2xl transition-all">
            <Settings size={20} />
            <span>Paramètres</span>
          </Link>
        </nav>
        {children}
      </div>
    </div>
  );
}

