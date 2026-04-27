'use client';
import { useEffect, useRef, useState } from 'react';

export function useModuleStatus() {
  const [status, setStatus] = useState<Record<string, string[]>>({});
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Strictement côté client
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const token = localStorage.getItem('access_token');
    if (!token) return;

    // Charger l'état initial
    fetch(`${API}/admin/modules/status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => {});

    // SSE pour les mises à jour temps réel
    const es = new EventSource(`${API}/admin/modules/stream?token=${token}`);
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        const { role, module, enabled } = JSON.parse(e.data) as {
          role: string; module: string; enabled: boolean;
        };
        setStatus((prev) => ({
          ...prev,
          [role]: enabled
            ? [...(prev[role] || []), module]
            : (prev[role] || []).filter((m) => m !== module),
        }));
      } catch {}
    };

    return () => { es.close(); };
  }, []);

  const isEnabled = (role: string, module: string) =>
    status[role]?.includes(module) ?? true;

  return { status, isEnabled };
}
