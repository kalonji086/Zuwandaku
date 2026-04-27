"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Search, FileText, User, Settings,
  LogOut, Menu, X, ChevronRight, Bell, BedDouble, Lock, UtensilsCrossed, UserCheck, Briefcase,
} from 'lucide-react';
import NotificationModal from './components/NotificationModal';
import ProfilePhotoModal from './components/ProfilePhotoModal';

const BASE_NAV = [
  { href: '/client',           label: 'Dashboard',      icon: LayoutDashboard, module: null },
  { href: '/client/search',    label: 'Rechercher',     icon: Search,          module: null },
  { href: '/client/contracts', label: 'Mes contrats',   icon: FileText,        module: null },
  { href: '/client/profile',   label: 'Profil',         icon: User,            module: null },
  { href: '/client/settings',  label: 'Paramètres',     icon: Settings,        module: null },
  { href: '/client/hotel',       label: 'Hôtel',          icon: BedDouble,         module: 'hotel_client' },
  { href: '/client/restaurant',  label: 'Restaurant',     icon: UtensilsCrossed,   module: 'restaurant_client' },
  { href: '/proprietaire',       label: 'Propriétaire',   icon: UserCheck,         module: 'proprietaire_client' },
  { href: '/commissionnaire',    label: 'Commissionnaire',icon: Briefcase,         module: 'commissionnaire_client' },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  /* modules bloqués : tableau stocké dans user.blockedModules par l'admin */
  const blockedModules: string[] = user?.blockedModules ?? [];
  const hasModule = (mod: string | null) => !mod || !blockedModules.includes(mod);

  const handleLogoutButton = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
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

  const activeLabel = BASE_NAV.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label ?? 'Espace Client';

  return (
    <div className="flex min-h-screen bg-[#0a0a0f] text-white">
      {/* Sidebar */}
      <aside
        className={`flex flex-col bg-[#0d0d14] border-r border-white/5 transition-all duration-300 ${collapsed ? 'w-16' : 'w-60'}`}
        style={{ boxShadow: '1px 0 20px rgba(0,0,0,0.5)' }}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
          <Image src="/logo.png" alt="ZUWAndaku" width={36} height={36} className="rounded-xl shrink-0" />
          {!collapsed && (
            <div>
              <p className="font-bold text-white text-sm leading-tight tracking-wide">ZUWAndaku</p>
              <p className="text-[10px] text-white/30 uppercase tracking-widest">Espace Client</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {BASE_NAV.map(({ href, label, icon: Icon, module }) => {
            const active  = pathname === href || (href !== '/client' && pathname.startsWith(href + '/'));
            const enabled = hasModule(module);
            return (
              <div key={href} className="relative group/nav">
                <Link
                  href={enabled ? href : '#'}
                  onClick={e => !enabled && e.preventDefault()}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative
                    ${active && enabled
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : enabled
                        ? 'text-white/40 hover:text-white/80 hover:bg-white/5'
                        : 'text-white/20 cursor-not-allowed select-none'
                    }`}>
                  {/* flou sur l'icône si module désactivé */}
                  <span className={enabled ? '' : 'blur-[2px]'}>
                    <Icon size={17} className={`shrink-0 ${
                      active && enabled ? 'text-blue-400'
                      : enabled ? 'text-white/30 group-hover/nav:text-white/60'
                      : 'text-white/15'
                    }`} />
                  </span>
                  {!collapsed && (
                    <span className={enabled ? '' : 'blur-[3px] pointer-events-none'}>{label}</span>
                  )}
                  {!collapsed && active && enabled && <ChevronRight size={13} className="ml-auto text-blue-400/60" />}
                  {!collapsed && !enabled && (
                    <Lock size={11} className="ml-auto text-white/15 shrink-0" />
                  )}
                  {active && enabled && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-blue-400 rounded-r-full" />}
                </Link>
                {/* Tooltip si bloqué */}
                {!enabled && !collapsed && (
                  <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-50 hidden group-hover/nav:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d0d14] border border-white/10 text-[11px] text-white/40 whitespace-nowrap shadow-xl pointer-events-none">
                    <Lock size={10} />Bloqué par l'administrateur
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 space-y-0.5 border-t border-white/5 pt-3">
          <Link href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/30 hover:text-white/70 hover:bg-white/5 transition-all">
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span>Site public</span>}
          </Link>
          <button onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/20 hover:text-white/50 hover:bg-white/5 transition-all">
            {collapsed ? <Menu size={17} /> : <><X size={17} /><span>Réduire</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-[#0d0d14]/80 backdrop-blur border-b border-white/5 px-6 py-3.5 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="ZUWAndaku" width={28} height={28} className="rounded-lg" />
            <div>
              <h1 className="text-sm font-semibold text-white/90 tracking-wide">{activeLabel}</h1>
              <p className="text-[10px] text-white/25 uppercase tracking-widest">ZUWAndaku</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNotificationModalOpen(true)}
              className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
            >
              <Bell size={15} className="text-white/40" />
            </button>
            <button
              onClick={handleLogoutButton}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 text-white/40 hover:text-red-400 text-xs font-medium transition-all"
            >
              <LogOut size={13} />
              <span className="hidden sm:block">Déconnexion</span>
            </button>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
              ) : (
                user?.name?.charAt(0)?.toUpperCase() ?? 'C'
              )}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
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
        userName={user?.name || 'Client'}
        onUpload={handleProfilePhotoUpload}
      />
    </div>
  );
}
