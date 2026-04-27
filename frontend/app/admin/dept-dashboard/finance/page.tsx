'use client';
import { useState } from 'react';
import {
  LayoutDashboard, DollarSign, FileText, TrendingUp, BarChart3,
  History, Home, Users, Settings, ExternalLink, ToggleLeft, ToggleRight,
  CheckCircle, XCircle, Download
} from 'lucide-react';

type Module = { id:string; label:string; description:string; href:string; icon:React.ElementType; color:string; groupe:string; actif:boolean; };

const INIT: Module[] = [
  // Commissionnaire
  { id:'c-dashboard',  label:'Dashboard Commissionnaire', description:'Vue d\'ensemble commissions, transactions, performance.',      href:'/commissionnaire',                       icon:LayoutDashboard, color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-perf',       label:'Performance',               description:'Indicateurs de performance, objectifs, classements.',          href:'/commissionnaire/performance',           icon:TrendingUp,      color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-stats',      label:'Statistiques',              description:'Graphiques détaillés, évolution des commissions.',             href:'/commissionnaire/statistiques',          icon:BarChart3,       color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-trans',      label:'Transactions',              description:'Historique de toutes les transactions et commissions.',        href:'/commissionnaire/transactions',          icon:FileText,        color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-histo',      label:'Historique Paiements',      description:'Suivi des paiements reçus et en attente.',                    href:'/commissionnaire/historique-paiements',  icon:History,         color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-biens',      label:'Biens & Véhicules',         description:'Biens et véhicules gérés par le commissionnaire.',            href:'/commissionnaire/biens',                 icon:Home,            color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-clients',    label:'Acteurs',                   description:'Clients, propriétaires et contacts du commissionnaire.',      href:'/commissionnaire/clients',               icon:Users,           color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  { id:'c-export',     label:'Export',                    description:'Export des données financières en CSV/PDF.',                  href:'/commissionnaire/export',                icon:Download,        color:'#ffcc00', groupe:'Espace Commissionnaire', actif:false },
  { id:'c-settings',   label:'Paramètres',                description:'Paramètres du compte commissionnaire.',                      href:'/commissionnaire/settings',              icon:Settings,        color:'#ffcc00', groupe:'Espace Commissionnaire', actif:true  },
  // Admin finance
  { id:'af-stats',     label:'Statistiques Admin',        description:'Statistiques financières globales de la plateforme.',        href:'/admin/statistiques',                    icon:BarChart3,       color:'#ff6b35', groupe:'Admin Finance',          actif:true  },
];

const GROUPE_COLOR: Record<string,string> = { 'Espace Commissionnaire':'#ffcc00', 'Admin Finance':'#ff6b35' };

const ModuleCard = ({ m, onToggle }:{ m:Module; onToggle:(id:string)=>void }) => {
  const Icon = m.icon;
  return (
    <div style={{ background:m.actif?'#0d0d14':'rgba(255,255,255,0.02)', border:`1px solid ${m.actif?`${m.color}25`:'rgba(255,255,255,0.05)'}`, borderRadius:12, padding:'14px 16px', opacity:m.actif?1:0.55, transition:'all 0.2s' }}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, flex:1, minWidth:0 }}>
          <div style={{ width:36, height:36, borderRadius:9, background:`${m.color}18`, border:`1px solid ${m.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <Icon size={16} style={{ color:m.actif?m.color:'rgba(255,255,255,0.2)' }}/>
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:700, color:m.actif?'#fff':'rgba(255,255,255,0.3)', margin:'0 0 3px' }}>{m.label}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', margin:0, lineHeight:1.4 }}>{m.description}</p>
          </div>
        </div>
        <button onClick={()=>onToggle(m.id)} style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0, padding:0, marginTop:2 }}>
          {m.actif?<ToggleRight size={28} style={{ color:m.color, filter:`drop-shadow(0 0 4px ${m.color}80)` }}/>:<ToggleLeft size={28} style={{ color:'rgba(255,255,255,0.2)' }}/>}
        </button>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:5, background:m.actif?`${m.color}15`:'rgba(255,255,255,0.05)', border:`1px solid ${m.actif?`${m.color}30`:'rgba(255,255,255,0.08)'}`, color:m.actif?m.color:'rgba(255,255,255,0.2)' }}>
          {m.actif?'● Actif':'○ Inactif'}
        </span>
        {m.actif&&(
          <a href={m.href} target="_blank" rel="noreferrer"
            style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'4px 10px', borderRadius:6, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}
            onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#fff';(e.currentTarget as HTMLElement).style.background=`${m.color}15`;(e.currentTarget as HTMLElement).style.borderColor=`${m.color}30`;}}
            onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)';}}>
            Accéder<ExternalLink size={10}/>
          </a>
        )}
      </div>
    </div>
  );
};

export default function FinanceModule() {
  const [modules, setModules] = useState<Module[]>(INIT);
  const [toast, setToast] = useState('');
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),2500); };
  const toggle = (id:string) => setModules(prev=>prev.map(m=>{ if(m.id!==id) return m; const next=!m.actif; showToast(`${m.label} ${next?'activé':'désactivé'}`); return {...m,actif:next}; }));
  const actifs = modules.filter(m=>m.actif).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:200, background:'#ffcc00', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[{label:'Total modules',value:modules.length,color:'#ffcc00',icon:DollarSign},{label:'Actifs',value:actifs,color:'#00e5a0',icon:CheckCircle},{label:'Désactivés',value:modules.length-actifs,color:'#f87171',icon:XCircle}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><s.icon size={16} style={{ color:s.color }}/></div>
            <div><p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>{s.value}</p><p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{s.label}</p></div>
          </div>
        ))}
      </div>
      {['Espace Commissionnaire','Admin Finance'].map(groupe=>{
        const items = modules.filter(m=>m.groupe===groupe);
        const gColor = GROUPE_COLOR[groupe];
        return (
          <div key={groupe}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ width:3, height:16, borderRadius:2, background:gColor }}/>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', margin:0 }}>{groupe}</p>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.05)', borderRadius:4, padding:'1px 6px' }}>{items.filter(m=>m.actif).length}/{items.length} actifs</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
              {items.map(m=><ModuleCard key={m.id} m={m} onToggle={toggle}/>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
