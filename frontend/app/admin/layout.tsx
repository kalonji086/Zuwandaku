'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BarChart3, Home, Car, Users, FileText,
  MessageCircle, Settings, LogOut, Menu, X, ChevronRight,
  FolderOpen, UserPlus, Building2, Mail, Truck, Boxes,
  Combine, CheckCircle, Shield, Workflow, Key, Bell, Hotel,
  Briefcase, UserCheck,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import ProfilePhotoModal from './components/ProfilePhotoModal';
import NotificationModal from './components/NotificationModal';

const NAV_GROUPS = [
  {
    label: 'Vue générale',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/statistiques', label: 'Statistiques', icon: BarChart3 },
      { href: '/admin/dept-dashboard', label: 'Dashboard Département', icon: Hotel },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { href: '/admin/approve', label: 'Approbations', icon: CheckCircle },
      { href: '/admin/manage', label: 'Personnel', icon: Users },
      { href: '/admin/permissions', label: 'Permissions', icon: Shield },
      { href: '/admin/controle-modules', label: 'Modules', icon: Key },
      { href: '/admin/member-assignation', label: 'Assignations', icon: Users },
    ],
  },
  {
    label: 'Utilisateurs',
    items: [
      { href: '/admin/utilisateurs', label: 'Utilisateurs', icon: Users },
      { href: '/admin/groups', label: 'Groupes', icon: Users },
      { href: '/admin/create-account', label: 'Créer compte', icon: UserPlus },
    ],
  },
  {
    label: 'Biens & Véhicules',
    items: [
      { href: '/admin/proprietes', label: 'Propriétés', icon: Home },
      { href: '/admin/gestion-appartements', label: 'Appartements', icon: Boxes },
      { href: '/admin/gestion-parcelles', label: 'Parcelles', icon: Combine },
      { href: '/admin/rental-properties', label: 'Maisons à louer', icon: Building2 },
      { href: '/admin/vehicules', label: 'Véhicules', icon: Car },
      { href: '/admin/gestion-vehicules', label: 'Gestion véhicules', icon: Truck },
    ],
  },
  {
    label: 'Espaces',
    items: [
      { href: '/admin/espaces/proprietaire',    label: 'Propriétaire',    icon: UserCheck },
      { href: '/admin/espaces/commissionnaire', label: 'Commissionnaire', icon: Briefcase },
    ],
  },
  {
    label: 'Communication',
    items: [
      { href: '/admin/mailbox', label: 'Mailbox', icon: Mail },
      { href: '/admin/supports', label: 'Support', icon: MessageCircle },
    ],
  },
  {
    label: 'Système',
    items: [
      { href: '/admin/procedure', label: 'Procédures', icon: Workflow },
      { href: '/admin/documents', label: 'Documents', icon: FolderOpen },
      { href: '/admin/parametres', label: 'Paramètres', icon: Settings },
    ],
  },
];

const ALL_NAV = NAV_GROUPS.flatMap(g => g.items);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [userName, setUserName] = useState('Administrateur');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userRole, setUserRole] = useState('');
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationModalOpen, setNotificationModalOpen] = useState(false);

  useEffect(() => {
    const load = () => {
      try {
        const u = JSON.parse(localStorage.getItem('user') || '{}');
        setUserName(u.name || 'Administrateur');
        setAvatarUrl(u.avatar || '');
        setUserRole(u.role || '');
      } catch { /* ignore */ }
    };
    load();
    window.addEventListener('storage', load);
    return () => window.removeEventListener('storage', load);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    document.cookie = 'access_token=; path=/; max-age=0';
    window.location.href = '/login';
  };

  const handleProfilePhotoUpload = async (file: File) => {
    // Convertir en data URL pour stocker localement (dans un cas réel, envoyer au serveur)
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.avatar = dataUrl;
        localStorage.setItem('user', JSON.stringify(user));
        setAvatarUrl(dataUrl);
        window.dispatchEvent(new Event('storage'));
      } catch (error) {
        console.error('Profile update failed:', error);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentLabel = ALL_NAV.find(n => n.href === pathname)?.label ?? 'Admin';

  return (
    <div className="flex min-h-screen" style={{ background: '#050508', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col shrink-0 transition-all duration-300"
        style={{
          width: collapsed ? 64 : 240,
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#0a0a0f',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-4 shrink-0"
          style={{
            height: 64,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            justifyContent: collapsed ? 'center' : 'flex-start',
          }}
        >
          <div
            className="shrink-0 flex items-center justify-center rounded-xl overflow-hidden"
            style={{ width: 34, height: 34, background: 'linear-gradient(135deg,#1a6dff,#0040cc)' }}
          >
            <Image src="/logo.png" alt="ZUWAndaku" width={34} height={34} style={{ objectFit: 'cover' }} />
          </div>
          {!collapsed && (
            <div>
              <p style={{ fontWeight: 800, fontSize: 13, letterSpacing: '0.04em', color: '#fff' }}>ZUWANDAKU</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>ADMIN PANEL</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav
          className="flex-1 py-4"
          style={{
            overflowY: 'auto',
            overflowX: 'hidden',
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(26,109,255,0.5) transparent',
          }}
        >
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="mb-2">
              {!collapsed && (
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', padding: '8px 16px 4px', textTransform: 'uppercase' }}>
                  {group.label}
                </p>
              )}
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: collapsed ? '10px 0' : '9px 14px',
                      margin: '1px 8px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                      background: active ? 'linear-gradient(90deg,#1a6dff22,#1a6dff11)' : 'transparent',
                      borderLeft: active ? '2px solid #1a6dff' : '2px solid transparent',
                      textDecoration: 'none',
                      transition: 'all 0.15s',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; }}
                  >
                    <Icon size={16} style={{ shrink: 0, color: active ? '#1a6dff' : 'inherit' }} />
                    {!collapsed && <span>{label}</span>}
                    {!collapsed && active && <ChevronRight size={12} style={{ marginLeft: 'auto', color: '#1a6dff' }} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 8px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: collapsed ? '10px 0' : '9px 14px',
              borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.4)',
              background: 'transparent', border: 'none', cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#ff4d4d')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
          >
            <LogOut size={16} />
            {!collapsed && <span>Déconnexion</span>}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: collapsed ? '10px 0' : '9px 14px',
              borderRadius: 8, fontSize: 13, color: 'rgba(255,255,255,0.3)',
              background: 'transparent', border: 'none', cursor: 'pointer',
              justifyContent: collapsed ? 'center' : 'flex-start',
              marginTop: 2,
            }}
          >
            {collapsed ? <Menu size={16} /> : <><X size={16} /><span>Réduire</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header
          style={{
            height: 64,
            background: '#0a0a0f',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            flexShrink: 0,
          }}
        >
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{currentLabel}</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0, letterSpacing: '0.04em' }}>
              ZUWAndaku — Panneau d'administration
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setNotificationModalOpen(true)}
              style={{ 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: 8, 
                padding: '6px 8px', 
                cursor: 'pointer', 
                color: 'rgba(255,255,255,0.5)',
                position: 'relative',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(26, 109, 255, 0.15)';
                e.currentTarget.style.color = '#1a6dff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: '#ff6b6b',
                color: '#fff',
                borderRadius: '50%',
                width: 18,
                height: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 10,
                fontWeight: 700,
              }}>3</span>
            </button>
            <button
              onClick={() => setProfileModalOpen(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 10, 
                background: 'rgba(255,255,255,0.04)', 
                border: '1px solid rgba(255,255,255,0.08)', 
                borderRadius: 10, 
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(26, 109, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(26, 109, 255, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#1a6dff,#0040cc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.2 }}>{userName}</p>
                {userRole && <p style={{ fontSize: 10, color: '#1a6dff', margin: 0, letterSpacing: '0.06em' }}>{userRole}</p>}
              </div>
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#050508' }}>
          {children}
        </main>
      </div>

      {/* Modals */}
      <ProfilePhotoModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        currentAvatar={avatarUrl}
        userName={userName}
        onUpload={handleProfilePhotoUpload}
      />
      <NotificationModal
        isOpen={notificationModalOpen}
        onClose={() => setNotificationModalOpen(false)}
      />
    </div>
  );
}
