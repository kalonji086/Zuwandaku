"use client";

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, BedDouble, Calendar, Users, User,
  DollarSign, FileBarChart, LogOut, Menu, X, ChevronRight, Wifi,
  Sparkles, Zap, Shield, ChefHat, ClipboardList, Settings, Bell
} from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationModal from './components/NotificationModal';
import ProfilePhotoModal from './components/ProfilePhotoModal';

const NAV_GROUPS = [
  {
    label: 'Principal',
    items: [
      { href: '/hotel', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/hotel/rooms', label: 'Chambres', icon: BedDouble },
      { href: '/hotel/bookings', label: 'Réservations', icon: Calendar },
      { href: '/hotel/guests', label: 'Clients', icon: User },
      { href: '/hotel/billing', label: 'Facturation', icon: DollarSign },
      { href: '/hotel/reports', label: 'Rapports', icon: FileBarChart },
    ],
  },
  {
    label: 'Équipes',
    items: [
      { href: '/hotel/manage', label: 'Personnel', icon: Users },
      { href: '/hotel/menage', label: 'Ménage', icon: Sparkles },
      { href: '/hotel/electricien', label: 'Électricien', icon: Zap },
      { href: '/hotel/gardien', label: 'Gardien', icon: Shield },
      { href: '/hotel/chef-cuisine', label: 'Chef Cuisine', icon: ChefHat },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { href: '/hotel/taches', label: 'Gestion de tâches', icon: ClipboardList },
      { href: '/hotel/parametres', label: 'Paramètres', icon: Settings },
    ],
  },
];

// flat list for header label lookup
const NAV_ALL = NAV_GROUPS.flatMap(g => g.items);

export default function HotelLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('user') || '{}')); } catch {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    document.cookie = 'access_token=; path=/; max-age=0';
    router.push('/login');
  };

  const handleProfilePhotoUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        currentUser.avatar = dataUrl;
        localStorage.setItem('user', JSON.stringify(currentUser));
        setUser(currentUser);
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex min-h-screen bg-[#050a14] text-white">

      {/* Sidebar */}
      <aside className={`flex flex-col bg-[#070d1a] border-r border-cyan-500/10 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}>

        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-cyan-500/10 ${collapsed ? 'justify-center' : ''}`}>
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-xl bg-cyan-500/20 blur-sm" />
            <Image src="/logo.png" alt="ZUWAndaku" width={34} height={34} className="relative rounded-xl" />
          </div>
          {!collapsed && (
            <div>
              <p className="font-black text-white text-sm leading-tight">ZUWAndaku</p>
              <p className="text-xs text-cyan-500/70 flex items-center gap-1"><Wifi size={9} /> Hotel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 overflow-y-auto space-y-4">
          {NAV_GROUPS.map(group => (
            <div key={group.label}>
              {!collapsed && (
                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest px-3 mb-1.5">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(href + '/');
                  return (
                    <Link key={href} href={href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                        ${active
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                          : 'text-gray-500 hover:bg-white/5 hover:text-gray-200 border border-transparent'}`}>
                      <Icon size={17} className={`shrink-0 ${active ? 'text-cyan-400' : ''}`} />
                      {!collapsed && <span>{label}</span>}
                      {!collapsed && active && <ChevronRight size={13} className="ml-auto text-cyan-500" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-cyan-500/10 pt-4">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:bg-white/5 hover:text-gray-200 transition-all border border-transparent">
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Site public</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-white/5 hover:text-gray-300 transition-all border border-transparent">
            {collapsed ? <Menu size={17} /> : <><X size={17} /><span>Réduire</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-[#070d1a]/80 backdrop-blur border-b border-cyan-500/10 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-white">
              {NAV_ALL.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label ?? 'Hotel'}
            </h1>
            <p className="text-xs text-gray-600">ZUWAndaku — Gestion hôtelière</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 flex items-center justify-center transition-colors border border-cyan-500/20 text-cyan-400"
            >
              <Bell size={16} />
            </button>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-lg object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-600/40 to-blue-600/40 flex items-center justify-center text-xs font-black text-cyan-300">
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'H'}
                </div>
              )}
              <span className="text-xs text-cyan-300 font-semibold hidden sm:block">{user?.name || 'Hotel'}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors border border-red-500/20 text-red-400"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Modals */}
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
      <ProfilePhotoModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentAvatar={user?.avatar}
        userName={user?.name || 'Hotel'}
        onUpload={handleProfilePhotoUpload}
      />
    </div>
  );
}
