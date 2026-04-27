'use client';

import { useState, useEffect } from 'react';
import { X, Bell, Trash2, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Bienvenue',
      message: 'Bienvenue dans le tableau de bord administrateur',
      type: 'info',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: '2',
      title: 'Nouvel utilisateur',
      message: '5 nouveaux utilisateurs se sont inscrits',
      type: 'success',
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: '3',
      title: 'Vérification requise',
      message: '2 propriétés attendent vérification',
      type: 'warning',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#00e5a0';
      case 'warning':
        return '#ffc107';
      case 'error':
        return '#ff6b6b';
      default:
        return '#1a6dff';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'À l\'instant';
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        zIndex: 1000,
        paddingTop: 80,
        paddingRight: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0d0d14',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16,
          width: '90%',
          maxWidth: 420,
          maxHeight: 'calc(100vh - 120px)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 20,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Bell size={20} style={{ color: '#1a6dff' }} />
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#fff', margin: 0 }}>Notifications</h2>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', letterSpacing: '0.04em' }}>
                {unreadCount} non lue{unreadCount > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: 'none',
              borderRadius: 8,
              padding: '6px 8px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.6)',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            <X size={18} />
          </button>
        </div>

        {/* Notifications List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {notifications.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 40,
              color: 'rgba(255,255,255,0.4)',
              textAlign: 'center',
            }}>
              <Bell size={40} style={{ opacity: 0.2, marginBottom: 12 }} />
              <p style={{ margin: 0, fontSize: 14 }}>Aucune notification</p>
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleMarkAsRead(notif.id)}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.04)',
                  display: 'flex',
                  gap: 12,
                  cursor: 'pointer',
                  background: notif.read ? 'transparent' : 'rgba(26, 109, 255, 0.1)',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                onMouseLeave={e => (e.currentTarget.style.background = notif.read ? 'transparent' : 'rgba(26, 109, 255, 0.1)')}
              >
                <div style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: `${getTypeColor(notif.type)}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: getTypeColor(notif.type),
                  flexShrink: 0,
                }}>
                  {getIcon(notif.type)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: '#fff',
                    margin: 0,
                    marginBottom: 4,
                  }}>
                    {notif.title}
                  </p>
                  <p style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.5)',
                    margin: 0,
                    lineHeight: 1.4,
                  }}>
                    {notif.message}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.3)',
                    margin: '6px 0 0',
                    letterSpacing: '0.02em',
                  }}>
                    {formatTime(notif.timestamp)}
                  </p>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(notif.id);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: 6,
                    padding: '4px 6px',
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#ff6b6b20';
                    e.currentTarget.style.color = '#ff6b6b';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div style={{
            padding: 16,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            flexShrink: 0,
          }}>
            <button
              onClick={handleClearAll}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: 8,
                padding: '10px 16px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = '#ff6b6b';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              Effacer tout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
