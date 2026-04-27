'use client';

import { useEffect, useState } from 'react';
import {
  Home, Car, Users, FileText, DollarSign, Clock,
  TrendingUp, TrendingDown, Activity, Globe, CheckCircle,
  AlertCircle, ArrowUpRight,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { apiClient } from '../../lib/api-client';

const STARLINK_BLUE = '#1a6dff';
const COLORS = ['#1a6dff', '#00c2ff', '#7b61ff', '#00e5a0', '#ff6b35'];

const CARD_STYLE: React.CSSProperties = {
  background: '#0d0d14',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
  padding: '20px 24px',
};

const monthlyData = [
  { m: 'Jan', biens: 12, vehicules: 8, users: 24 },
  { m: 'Fév', biens: 19, vehicules: 15, users: 31 },
  { m: 'Mar', biens: 25, vehicules: 22, users: 45 },
  { m: 'Avr', biens: 32, vehicules: 18, users: 52 },
  { m: 'Mai', biens: 28, vehicules: 24, users: 48 },
  { m: 'Jun', biens: 38, vehicules: 30, users: 67 },
];

const provinceData = [
  { name: 'Kinshasa', value: 45 },
  { name: 'Haut-Katanga', value: 22 },
  { name: 'Kasaï', value: 18 },
  { name: 'Nord-Kivu', value: 15 },
];

interface KPI {
  label: string;
  value: string | number;
  sub: string;
  up: boolean;
  icon: React.ElementType;
  color: string;
}

const DEFAULT_KPIS: KPI[] = [
  { label: 'Propriétés', value: '—', sub: 'actives', up: true, icon: Home, color: '#1a6dff' },
  { label: 'Véhicules', value: '—', sub: 'listés', up: true, icon: Car, color: '#00c2ff' },
  { label: 'Utilisateurs', value: '—', sub: 'inscrits', up: true, icon: Users, color: '#7b61ff' },
  { label: 'Contrats', value: '—', sub: 'en cours', up: false, icon: FileText, color: '#00e5a0' },
  { label: 'Revenus', value: '—', sub: 'CDF ce mois', up: true, icon: DollarSign, color: '#ff6b35' },
  { label: 'En attente', value: '—', sub: 'approbations', up: false, icon: Clock, color: '#ffcc00' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#13131e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color, margin: '2px 0' }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI[]>(DEFAULT_KPIS);
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => setTime(new Date().toLocaleTimeString('fr-FR')), 1000);
    setTime(new Date().toLocaleTimeString('fr-FR'));
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    apiClient.getGlobalStats()
      .then(({ data }) => {
        setKpis([
          { label: 'Propriétés', value: data.properties ?? '—', sub: 'actives', up: true, icon: Home, color: '#1a6dff' },
          { label: 'Véhicules', value: data.vehicles ?? '—', sub: 'listés', up: true, icon: Car, color: '#00c2ff' },
          { label: 'Utilisateurs', value: data.users ?? '—', sub: 'inscrits', up: true, icon: Users, color: '#7b61ff' },
          { label: 'Contrats', value: data.contracts ?? '—', sub: 'en cours', up: false, icon: FileText, color: '#00e5a0' },
          { label: 'Revenus', value: data.revenue ? `${(data.revenue / 1_000_000).toFixed(1)}M` : '—', sub: 'CDF ce mois', up: true, icon: DollarSign, color: '#ff6b35' },
          { label: 'En attente', value: data.pending ?? '—', sub: 'approbations', up: false, icon: Clock, color: '#ffcc00' },
        ]);
      })
      .catch(() => { /* keep defaults */ })
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 24,
      position: 'relative',
      backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.85)), url(/logo.png)',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '20px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>
            Tableau de bord
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>
            Vue d'ensemble
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#0d0d14', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '8px 16px' }}>
          <Activity size={14} style={{ color: STARLINK_BLUE }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{today}</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>{time}</span>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00e5a0', boxShadow: '0 0 6px #00e5a0' }} />
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ ...CARD_STYLE, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '50%', background: k.color, opacity: 0.06, transform: 'translate(20px,-20px)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${k.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <k.icon size={18} style={{ color: k.color }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: k.up ? '#00e5a0' : '#ff6b6b' }}>
                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              </div>
            </div>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {loading ? <span style={{ opacity: 0.3 }}>—</span> : k.value}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{k.label}</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', margin: '2px 0 0' }}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Line chart */}
        <div style={CARD_STYLE}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Évolution mensuelle</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>Biens, véhicules & utilisateurs</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(26,109,255,0.1)', border: '1px solid rgba(26,109,255,0.2)', borderRadius: 6, padding: '4px 10px', fontSize: 11, color: STARLINK_BLUE }}>
              <ArrowUpRight size={12} /> +18%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="biens" stroke="#1a6dff" strokeWidth={2} dot={false} name="Biens" />
              <Line type="monotone" dataKey="vehicules" stroke="#00c2ff" strokeWidth={2} dot={false} name="Véhicules" />
              <Line type="monotone" dataKey="users" stroke="#7b61ff" strokeWidth={2} dot={false} name="Utilisateurs" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div style={CARD_STYLE}>
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Répartition provinces</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>Distribution géographique</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={provinceData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3}>
                  {provinceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {provinceData.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', flex: 1 }}>{p.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bar chart full width */}
      <div style={CARD_STYLE}>
        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>Publications par province</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>Nombre de biens publiés</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={provinceData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Biens">
              {provinceData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Status row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {[
          { label: 'Système opérationnel', icon: CheckCircle, color: '#00e5a0', desc: 'Tous les services actifs' },
          { label: 'API Backend', icon: Globe, color: '#1a6dff', desc: 'Connecté — port 3000' },
          { label: 'Alertes actives', icon: AlertCircle, color: '#ffcc00', desc: '2 approbations en attente' },
        ].map((s, i) => (
          <div key={i} style={{ ...CARD_STYLE, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: 0 }}>{s.label}</p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '2px 0 0' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
