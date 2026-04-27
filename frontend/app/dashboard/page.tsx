"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Home, Car, FileText, LogOut, Plus, User, LayoutDashboard, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import PublishBienModal from "../components/PublishBienModal";
import ProfilePhotoModal from "../components/ProfilePhotoModal";
import NotificationBell from "../components/NotificationBell";
import { useProperties, useVehicles, useContracts } from "../../lib/hooks";

export default function DashboardPage() {
  const router = useRouter();
  const user = { name: 'Utilisateur', email: 'user@zuwandaku.com', role: 'USER' };
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showProfilePhotoModal, setShowProfilePhotoModal] = useState(false);

  const { data: properties } = useProperties();
  const { data: vehicles } = useVehicles();
  const { data: contracts } = useContracts();

  // Free access - no auth check needed

  const handleLogout = () => {
    // Mock logout - refresh page
    window.location.reload();
  };

  const STATS = [
    { label: "Mes biens", value: properties?.length ?? 0, icon: <Home size={24} className="text-blue-600" />, href: "/properties", color: "bg-blue-50" },
    { label: "Mes véhicules", value: vehicles?.length ?? 0, icon: <Car size={24} className="text-purple-600" />, href: "/vehicles", color: "bg-purple-50" },
    { label: "Contrats actifs", value: contracts?.length ?? 0, icon: <FileText size={24} className="text-green-600" />, href: "#", color: "bg-green-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Custom Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowProfilePhotoModal(true)}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer flex-shrink-0"
              >
                <User size={24} className="text-white" />
              </button>
              <div>
                <h2 className="text-lg font-bold text-gray-800">{user?.name || "Utilisateur"}</h2>
                <p className="text-sm text-gray-500">{user?.role}</p>
              </div>
            </div>
            <NotificationBell />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-10 px-4">
          <div className="max-w-5xl mx-auto flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Bienvenue, {user?.name} 👋</h1>
              <p className="text-white/70 text-sm">{user?.email} • {user?.role}</p>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {STATS.map((s) => (
              <Link key={s.label} href={s.href} className={`${s.color} rounded-2xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition-all`}>
                <div>
                  <p className="text-gray-500 text-sm mb-1">{s.label}</p>
                  <p className="text-4xl font-extrabold text-gray-800">{s.value}</p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {s.icon}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><LayoutDashboard size={20} />Actions rapides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
            <button onClick={() => setShowPublishModal(true)} className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all hover:border-blue-300">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><Plus size={20} className="text-blue-600" /></div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Publier un bien</p>
                <p className="text-gray-500 text-sm">Maison, parcelle, appartement...</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 ml-auto" />
            </button>
            <Link href="/vehicles/create" className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all hover:border-purple-300">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center"><Plus size={20} className="text-purple-600" /></div>
              <div className="text-left">
                <p className="font-semibold text-gray-800">Ajouter un véhicule</p>
                <p className="text-gray-500 text-sm">Mettre en vente ou location...</p>
              </div>
              <ChevronRight size={18} className="text-gray-400 ml-auto" />
            </Link>
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors">
            <LogOut size={18} />Se déconnecter
          </button>
        </div>
      </div>

      <PublishBienModal isOpen={showPublishModal} onClose={() => setShowPublishModal(false)} />
      <ProfilePhotoModal 
        isOpen={showProfilePhotoModal} 
        onClose={() => setShowProfilePhotoModal(false)}
        onUpload={(file) => {
          console.log("Photo téléchargée:", file);
          // TODO: Implémenter l'upload de la photo de profil
        }}
      />
    </div>
  );
}
