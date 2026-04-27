'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Home, Car, FileText, Plus, Settings,
  LogOut, Menu, X, ChevronRight, TrendingUp, Bell, DollarSign, MessageSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationModal from './components/NotificationModal';
import ProfilePhotoModal from './components/ProfilePhotoModal';

const NAV_GROUPS = [
  {
    label: 'Vue générale',
    items: [
      { href: '/proprietaire',             label: 'Dashboard',      icon: LayoutDashboard },
      { href: '/proprietaire/analytics',   label: 'Statistiques',   icon: TrendingUp },
    ],
  },
  {
    label: 'Mes biens',
    items: [
      { href: '/proprietaire/properties',  label: 'Propriétés',     icon: Home },
      { href: '/proprietaire/vehicles',    label: 'Véhicules',      icon: Car },
      { href: '/proprietaire/add-property',label: 'Ajouter bien',   icon: Plus },
    ],
  },
  {
    label: 'Gestion',
    items: [
      { href: '/proprietaire/contracts',   label: 'Contrats',       icon: FileText },
      { href: '/proprietaire/settings',    label: 'Paramètres',     icon: Settings },
    ],
  },
];

const ALL_NAV = NAV_GROUPS.flatMap(g => g.items);
const ACCENT = '#1a6dff';

export default function ProprietaireLayout({ children }: { children: React.ReactNode }) {
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

  const currentLabel = ALL_NAV.find(n => pathname === n.href || pathname.startsWith(n.href + '/'))?.label ?? 'Propriétaire';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#050508', color: '#fff', fontFamily: "'Inter', sans-serif" }}>

      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 240, flexShrink: 0,
        height: '100vh', position: 'sticky', top: 0,
        background: '#0a0a0f', borderRight: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', flexDirection: 'column', transition: 'width 0.25s',
      }}>

        {/* Logo */}
        <div style={{
          height: 64, display: 'flex', alignItems: 'center', gap: 12,
          padding: collapsed ? '0' : '0 16px', justifyContent: collapsed ? 'center' : 'flex-start',
          borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0,
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: `linear-gradient(135deg,${ACCENT},#0040cc)` }}>
            <Image src="/logo.png" alt="ZUWAndaku" width={34} height={34} style={{ objectFit: 'cover' }} />
          </div>
          {!collapsed && (
            <div>
              <p style={{ fontWeight: 800, fontSize: 13, color: '#fff', letterSpacing: '0.04em' }}>ZUWANDAKU</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em' }}>PROPRIÉTAIRE</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 0', scrollbarWidth: 'thin', scrollbarColor: `${ACCENT}40 transparent` }}>
          {NAV_GROUPS.map(group => (
            <div key={group.label} style={{ marginBottom: 8 }}>
              {!collapsed && (
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', padding: '8px 16px 4px', textTransform: 'uppercase' }}>
                  {group.label}
                </p>
              )}
              {group.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== '/proprietaire' && pathname.startsWith(href + '/'));
                return (
                  <Link key={href} href={href} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: collapsed ? '10px 0' : '9px 14px',
                    margin: '1px 8px', borderRadius: 8,
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    background: active ? `${ACCENT}20` : 'transparent',
                    borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent',
                    textDecoration: 'none', transition: 'all 0.15s',
                    justifyContent: collapsed ? 'center' : 'flex-start',
                  }}>
                    <Icon size={16} style={{ flexShrink: 0, color: active ? ACCENT : 'inherit' }} />
                    {!collapsed && <span>{label}</span>}
                    {!collapsed && active && <ChevronRight size={12} style={{ marginLeft: 'auto', color: ACCENT }} />}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '12px 8px', flexShrink: 0 }}>
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: collapsed ? '10px 0' : '9px 14px', borderRadius: 8,
            fontSize: 13, color: 'rgba(255,255,255,0.4)', background: 'transparent',
            border: 'none', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
            <LogOut size={16} />{!collapsed && <span>Déconnexion</span>}
          </button>
          <button onClick={() => setCollapsed(!collapsed)} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: collapsed ? '10px 0' : '9px 14px', borderRadius: 8,
            fontSize: 13, color: 'rgba(255,255,255,0.25)', background: 'transparent',
            border: 'none', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', marginTop: 2,
          }}>
            {collapsed ? <Menu size={16} /> : <><X size={16} /><span>Réduire</span></>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <header style={{
          height: 64, background: '#0a0a0f', borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: 0 }}>{currentLabel}</h1>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>ZUWAndaku — Espace propriétaire</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              onClick={() => setNotificationModalOpen(true)}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '6px 8px', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s' }}
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
            </button>
            <button
              onClick={() => setProfileModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(26, 109, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(26, 109, 255, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              }}
            >
              {user?.avatar ? (
                <img src={user.avatar} alt="avatar" style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `linear-gradient(135deg,${ACCENT},#0040cc)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>
                  {user?.name?.charAt(0)?.toUpperCase() ?? 'P'}
                </div>
              )}
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.2 }}>{user?.name ?? 'Propriétaire'}</p>
                <p style={{ fontSize: 10, color: ACCENT, margin: 0 }}>Propriétaire</p>
              </div>
            </button>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, overflowY: 'auto', background: '#050508' }}>
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
        userName={user?.name || 'Propriétaire'}
        onUpload={handleProfilePhotoUpload}
      />
    </div>
  );
}
