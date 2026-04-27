'use client';
import { useState, useEffect, useCallback } from 'react';
import { Key, Plus, Trash2, Copy, Check, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';

const ROLES = ['COMMISSIONNAIRE', 'PROPRIETAIRE', 'CLIENT', 'HOTELIER', 'DEPT_ADMIN'] as const;
type ApiRole = typeof ROLES[number];

const ROLE_COLOR: Record<ApiRole, string> = {
  COMMISSIONNAIRE: '#ff6b35',
  PROPRIETAIRE: '#1a6dff',
  CLIENT: '#7b61ff',
  HOTELIER: '#00e5a0',
  DEPT_ADMIN: '#ffcc00',
};

interface ApiKey {
  id: string;
  role: ApiRole;
  expires: string | null;
  lastUsed: string | null;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<ApiRole>('DEPT_ADMIN');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.getApiKeys();
      setKeys(res.data || []);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async () => {
    setCreating(true);
    try {
      const res = await apiClient.createApiKey(selectedRole);
      setNewKey(res.data.key);
      await load();
    } catch {}
    finally { setCreating(false); }
  };

  const remove = async (id: string) => {
    setDeletingId(id);
    try {
      await apiClient.deleteApiKey(id);
      setKeys(prev => prev.filter(k => k.id !== id));
    } catch {}
    finally { setDeletingId(null); }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const C = {
    card: { background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px 24px' } as React.CSSProperties,
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 760 }}>
      <div>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Sécurité</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0 }}>Clés API</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          Connectez les dashboards départements avec l'Admin via clé API. Les modules désactivés sont floutés en temps réel.
        </p>
      </div>

      {/* Générer une clé */}
      <div style={C.card}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Key size={16} style={{ color: '#ffcc00' }} />
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Générer une nouvelle clé</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', marginBottom: 6, display: 'block' }}>Rôle / Département</label>
            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value as ApiRole)}
              style={{ width: '100%', background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '9px 12px', color: '#fff', fontSize: 13, outline: 'none' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <button
            onClick={create}
            disabled={creating}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 8, background: 'linear-gradient(135deg,#1a6dff,#0040cc)', border: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: creating ? 'not-allowed' : 'pointer', opacity: creating ? 0.7 : 1, whiteSpace: 'nowrap' }}
          >
            {creating ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
            Générer
          </button>
        </div>

        {/* Afficher la clé générée */}
        {newKey && (
          <div style={{ marginTop: 14, background: 'rgba(0,229,160,0.08)', border: '1px solid rgba(0,229,160,0.25)', borderRadius: 10, padding: '12px 16px' }}>
            <p style={{ fontSize: 11, color: '#00e5a0', fontWeight: 700, marginBottom: 8 }}>✓ Clé générée — copiez-la maintenant, elle ne sera plus affichée</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <code style={{ flex: 1, fontSize: 12, color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '8px 12px', borderRadius: 6, wordBreak: 'break-all' }}>{newKey}</code>
              <button onClick={() => copy(newKey)} style={{ padding: '8px 12px', borderRadius: 6, background: copied ? 'rgba(0,229,160,0.2)' : 'rgba(255,255,255,0.08)', border: `1px solid ${copied ? 'rgba(0,229,160,0.4)' : 'rgba(255,255,255,0.1)'}`, color: copied ? '#00e5a0' : '#fff', cursor: 'pointer', flexShrink: 0 }}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des clés */}
      <div style={C.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Clés actives ({keys.length})</p>
          <button onClick={load} style={{ padding: '6px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>
            <RefreshCw size={13} />
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Chargement...</p>
        ) : keys.length === 0 ? (
          <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>Aucune clé API générée</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {keys.map(k => {
              const color = ROLE_COLOR[k.role] || '#888';
              return (
                <div key={k.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0, boxShadow: `0 0 6px ${color}` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color, background: `${color}15`, border: `1px solid ${color}30`, padding: '2px 8px', borderRadius: 5 }}>{k.role}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>ID: {k.id.slice(0, 8)}…</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Créée: {new Date(k.createdAt).toLocaleDateString('fr-FR')}</span>
                      {k.lastUsed && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Dernière utilisation: {new Date(k.lastUsed).toLocaleDateString('fr-FR')}</span>}
                      {k.expires && <span style={{ fontSize: 10, color: new Date(k.expires) < new Date() ? '#f87171' : 'rgba(255,255,255,0.25)' }}>Expire: {new Date(k.expires).toLocaleDateString('fr-FR')}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => remove(k.id)}
                    disabled={deletingId === k.id}
                    style={{ padding: '6px 8px', borderRadius: 6, background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171', cursor: 'pointer', opacity: deletingId === k.id ? 0.5 : 1 }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info realtime */}
      <div style={{ background: 'rgba(26,109,255,0.06)', border: '1px solid rgba(26,109,255,0.2)', borderRadius: 12, padding: '14px 18px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>⚡</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>Connexion temps réel active</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
            Quand un module est désactivé depuis <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Contrôle Modules</strong>, tous les dashboards connectés via clé API voient le module flouté instantanément via SSE.
          </p>
        </div>
      </div>
    </div>
  );
}
