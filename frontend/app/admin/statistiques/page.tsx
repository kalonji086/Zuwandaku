'use client';
import { useState, useEffect } from 'react';
import { BarChart3, Users, Home, Car, DollarSign, Clock, TrendingUp, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#1a6dff','#00c2ff','#7b61ff','#00e5a0'];
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

const evolution = [
  { m:'Jan', biens:12, vehicules:8, users:24 },
  { m:'Fév', biens:19, vehicules:15, users:31 },
  { m:'Mar', biens:25, vehicules:22, users:45 },
  { m:'Avr', biens:32, vehicules:18, users:52 },
  { m:'Mai', biens:28, vehicules:24, users:48 },
  { m:'Jun', biens:38, vehicules:30, users:67 },
];
const provinces = [
  { name:'Kinshasa', value:45 },
  { name:'Haut-Katanga', value:22 },
  { name:'Kasaï', value:18 },
  { name:'Nord-Kivu', value:15 },
];
const biensType = [
  { type:'Appartements', value:89 },
  { type:'Maisons', value:67 },
  { type:'Parcelles', value:45 },
  { type:'Véhicules', value:123 },
];

const Tip = ({ active, payload, label }: any) => active && payload?.length ? (
  <div style={{ background:'#13131e', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', fontSize:12 }}>
    <p style={{ color:'rgba(255,255,255,0.4)', marginBottom:4 }}>{label}</p>
    {payload.map((p: any) => <p key={p.name} style={{ color:p.color, margin:'2px 0' }}>{p.name}: <b>{p.value}</b></p>)}
  </div>
) : null;

export default function StatistiquesPage() {
  const [users, setUsers] = useState(1245);
  const [revenue, setRevenue] = useState(15600000);

  useEffect(() => {
    const t = setInterval(() => {
      setUsers(v => v + Math.floor(Math.random() * 3));
      setRevenue(v => v + Math.floor(Math.random() * 500000));
    }, 2500);
    return () => clearInterval(t);
  }, []);

  const kpis = [
    { label:'Utilisateurs', value: users.toLocaleString(), icon: Users, color:'#1a6dff' },
    { label:'Revenus', value: `${(revenue/1e6).toFixed(1)}M CDF`, icon: DollarSign, color:'#00e5a0' },
    { label:'Contrats', value:'89', icon: BarChart3, color:'#7b61ff' },
    { label:'En attente', value:'12', icon: Clock, color:'#ffcc00' },
    { label:'Biens actifs', value:'284', icon: Home, color:'#00c2ff' },
    { label:'Véhicules', value:'123', icon: Car, color:'#ff6b35' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Statistiques</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Tableau de bord analytique</h1>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'8px 14px' }}>
          <Calendar size={14} style={{ color:'#1a6dff' }} />
          <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)' }}>{new Date().toLocaleDateString('fr-FR')}</span>
          <span style={{ width:6, height:6, borderRadius:'50%', background:'#00e5a0', boxShadow:'0 0 6px #00e5a0' }} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:12 }}>
        {kpis.map((k,i) => (
          <div key={i} style={{ ...C.card, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:0, right:0, width:60, height:60, borderRadius:'50%', background:k.color, opacity:0.07, transform:'translate(15px,-15px)' }} />
            <div style={{ width:34, height:34, borderRadius:9, background:`${k.color}18`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:12 }}>
              <k.icon size={16} style={{ color:k.color }} />
            </div>
            <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 2px', fontVariantNumeric:'tabular-nums' }}>{k.value}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{k.label}</p>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={C.card}>
          <p style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:16 }}>Évolution mensuelle</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="m" stroke="rgba(255,255,255,0.2)" tick={{ fontSize:11 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize:11 }} />
              <Tooltip content={<Tip />} />
              <Line type="monotone" dataKey="biens" stroke="#1a6dff" strokeWidth={2} dot={false} name="Biens" />
              <Line type="monotone" dataKey="vehicules" stroke="#00c2ff" strokeWidth={2} dot={false} name="Véhicules" />
              <Line type="monotone" dataKey="users" stroke="#7b61ff" strokeWidth={2} dot={false} name="Utilisateurs" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={C.card}>
          <p style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:16 }}>Répartition provinces</p>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie data={provinces} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {provinces.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                </Pie>
                <Tooltip content={<Tip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8 }}>
              {provinces.map((p,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background:COLORS[i%COLORS.length], flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'rgba(255,255,255,0.5)', flex:1 }}>{p.name}</span>
                  <span style={{ fontSize:12, fontWeight:700, color:'#fff' }}>{p.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={C.card}>
        <p style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:16 }}>Publications par type</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={biensType} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="type" stroke="rgba(255,255,255,0.2)" tick={{ fontSize:11 }} />
            <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fontSize:11 }} />
            <Tooltip content={<Tip />} />
            <Bar dataKey="value" radius={[6,6,0,0]} name="Biens">
              {biensType.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
