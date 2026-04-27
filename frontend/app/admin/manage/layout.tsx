"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { Users, Shield, Clock, FileBarChart, Settings, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminManageLayoutProps {
  children: ReactNode;
}

export default function AdminManageLayout({ children }: AdminManageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <nav className="bg-gradient-to-r from-slate-900/95 to-slate-800/95 backdrop-blur-xl border-b border-purple-500/20 shadow-2xl p-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 justify-center lg:justify-start">
          <Link href="/admin/manage" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 text-blue-300 font-bold rounded-3xl hover:bg-blue-600/40 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/25 whitespace-nowrap">
            <Users size={20} />
            <span>Personnel hotel</span>
          </Link>
          <Link href="/admin/manage/roles" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600/20 to-violet-600/20 border border-purple-500/30 text-purple-300 font-bold rounded-3xl hover:bg-purple-600/40 hover:border-purple-500/50 transition-all shadow-lg hover:shadow-purple-500/25">
            <Shield size={20} />
            <span>Rôles & Permissions</span>
          </Link>
          <Link href="/admin/manage/requests" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-orange-600/20 to-yellow-600/20 border border-orange-500/30 text-orange-300 font-bold rounded-3xl hover:bg-orange-600/40 hover:border-orange-500/50 transition-all shadow-lg hover:shadow-orange-500/25">
            <Clock size={20} />
            <span>Demandes approbation</span>
          </Link>
          <Link href="/admin/manage/reports" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/30 text-emerald-300 font-bold rounded-3xl hover:bg-emerald-600/40 hover:border-emerald-500/50 transition-all shadow-lg hover:shadow-emerald-500/25">
            <FileBarChart size={20} />
            <span>Rapports RH</span>
          </Link>
          <Link href="/admin/manage/settings" className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-gray-600/20 to-slate-600/20 border border-gray-500/30 text-gray-300 font-bold rounded-3xl hover:bg-gray-600/40 hover:border-gray-500/50 transition-all shadow-lg hover:shadow-gray-500/25">
            <Settings size={20} />
            <span>Configuration avancée</span>
          </Link>
        </div>
      </nav>
      <div className="max-w-7xl mx-auto p-8 pt-4">
        {children}
      </div>
    </div>
  );
}

