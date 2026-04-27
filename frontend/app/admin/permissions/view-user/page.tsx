"use client";

import { Eye, Shield, Key, User } from 'lucide-react';
import Link from 'next/link';

export default function ViewUserPage({ searchParams }: { searchParams: { userId: string } }) {
  const userId = searchParams.userId;
  
  // Simulate user data
  const user = {
    id: userId,
    name: 'Jean Dupont',
    email: 'jean@exemple.com',
    role: 'PROPRIETAIRE',
    created: '2024-12-01',
    lastLogin: '2025-01-14',
    status: 'Actif',
    permissions: {
      dashboard: true,
      properties: true,
      vehicles: false,
      contracts: true
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/permissions" className="text-gray-500 hover:text-gray-900">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold">Détails utilisateur</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">{user.name}</h2>
          <p className="text-gray-500 text-center mb-6">{user.email}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {user.status}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {user.role}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-8 shadow-sm border">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Key size={20} /> Permissions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(user.permissions).map(([module, allowed]) => (
              <div key={module} className="flex items-center gap-3 p-4 border rounded-xl">
                <button className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${allowed ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-gray-400'}`}>
                  {allowed && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
                </button>
                <div>
                  <p className="font-medium capitalize">{module}</p>
                  <p className="text-sm text-gray-500">{module === 'dashboard' ? 'Accès dashboard' : module === 'properties' ? 'Gérer propriétés' : 'Autres'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <h3 className="text-xl font-bold mb-6">Activité récente</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="flex-1">
              <p className="font-medium">Connexion</p>
              <p className="text-sm text-gray-500">2026-01-14 15:32</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="flex-1">
              <p className="font-medium">Nouveau contrat créé</p>
              <p className="text-sm text-gray-500">2026-01-13 09:15</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

