'use client';
import { useModuleStatus } from '@/lib/hooks/useModuleStatus';

interface Props {
  role: string;
  module: string;
  children: React.ReactNode;
}

export default function ModuleGuard({ role, module, children }: Props) {
  const { isEnabled } = useModuleStatus();
  const enabled = isEnabled(role, module);

  return (
    <div style={{ position: 'relative' }}>
      {children}
      {!enabled && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          backdropFilter: 'blur(8px)',
          background: 'rgba(0,0,0,0.55)',
          borderRadius: 12,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(248,113,113,0.15)',
            border: '1px solid rgba(248,113,113,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20,
          }}>🔒</div>
          <p style={{ color: '#f87171', fontSize: 13, fontWeight: 700, margin: 0 }}>Module désactivé</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, margin: 0 }}>Contactez l'administrateur</p>
        </div>
      )}
    </div>
  );
}
