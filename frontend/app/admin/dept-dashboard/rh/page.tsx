'use client';
import { useState } from 'react';
import {
  Users, UserCheck, Shield, Settings, ClipboardList, FileText,
  LayoutDashboard, Key, UserPlus, ExternalLink, ToggleLeft, ToggleRight,
  CheckCircle, XCircle, BarChart3
} from 'lucide-react';

type Module = { id:string; label:string; description:string; href:string; icon:React.ElementType; color:string; groupe:string; actif:boolean; };

const INIT: Module[] = [
  // Admin manage
  { id:'m-dashboard',   label:'Dashboard Manage',      description:'Vue d\'ensemble de la gestion du personnel et des rôles.',       href:'/admin/manage',                    icon:LayoutDashboard, color:'#00c2ff', groupe:'Gestion Personnel',  actif:true  },
  { id:'m-roles',       label:'Rôles',                 description:'Création et gestion des rôles et permissions.',                  href:'/admin/manage/roles',              icon:Shield,          color:'#00c2ff', groupe:'Gestion Personnel',  actif:true  },
  { id:'m-requests',    label:'Demandes',              description:'Demandes d\'accès et de modification de rôles.',                 href:'/admin/manage/requests',           icon:ClipboardList,   color:'#00c2ff', groupe:'Gestion Personnel',  actif:true  },
  { id:'m-reports',     label:'Rapports RH',           description:'Rapports d\'activité du personnel, présences, performances.',   href:'/admin/manage/reports',            icon:BarChart3,       color:'#00c2ff', groupe:'Gestion Personnel',  actif:true  },
  { id:'m-settings',    label:'Paramètres Manage',     description:'Configuration de la gestion du personnel.',                     href:'/admin/manage/settings',           icon:Settings,        color:'#00c2ff', groupe:'Gestion Personnel',  actif:true  },
  // Permissions & accès
  { id:'p-permissions', label:'Permissions',           description:'Matrice des permissions par rôle et par module.',               href:'/admin/permissions',               icon:Key,             color:'#7b61ff', groupe:'Accès & Permissions', actif:true  },
  { id:'p-roles-matrix',label:'Matrice des rôles',     description:'Vue matricielle complète des droits d\'accès.',                 href:'/admin/permissions/roles-matrix',  icon:Shield,          color:'#7b61ff', groupe:'Accès & Permissions', actif:true  },
  { id:'p-create',      label:'Créer un compte',       description:'Création de nouveaux comptes utilisateurs et agents.',          href:'/admin/create-account',            icon:UserPlus,        color:'#7b61ff', groupe:'Accès & Permissions', actif:true  },
  { id:'p-assignation', label:'Assignation membres',   description:'Assignation des membres aux équipes et départements.',          href:'/admin/member-assignation',        icon:UserCheck,       color:'#7b61ff', groupe:'Accès & Permissions', actif:true  },
  { id:'p-groups',      label:'Groupes',               description:'Gestion des groupes d\'utilisateurs.',                         href:'/admin/groups',                    icon:Users,           color:'#7b61ff', groupe:'Accès & Permissions', actif:false },
  // Procédures
  { id:'pr-procedure',  label:'Procédures',            description:'Gestion des procédures internes et workflows.',                 href:'/admin/procedure',                 icon:FileText,        color:'#ff6b35', groupe:'Procédures',          actif:true  },
  { id:'pr-assignation',label:'Assignation procédures',description:'Assignation des procédures aux agents responsables.',          href:'/admin/procedure/assignation',     icon:ClipboardList,   color:'#ff6b35', groupe:'Procédures',          actif:true  },
];

const GROUPE_COLOR: Record<string,string> = { 'Gestion Personnel':'#00c2ff', 'Accès & Permissions':'#7b61ff', 'Procédures':'#ff6b35' };

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

export default function RHModule() {
  const [modules, setModules] = useState<Module[]>(INIT);
  const [toast, setToast] = useState('');
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),2500); };
  const toggle = (id:string) => setModules(prev=>prev.map(m=>{ if(m.id!==id) return m; const next=!m.actif; showToast(`${m.label} ${next?'activé':'désactivé'}`); return {...m,actif:next}; }));
  const actifs = modules.filter(m=>m.actif).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:200, background:'#00c2ff', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[{label:'Total modules',value:modules.length,color:'#00c2ff',icon:Users},{label:'Actifs',value:actifs,color:'#00e5a0',icon:CheckCircle},{label:'Désactivés',value:modules.length-actifs,color:'#f87171',icon:XCircle}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><s.icon size={16} style={{ color:s.color }}/></div>
            <div><p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>{s.value}</p><p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{s.label}</p></div>
          </div>
        ))}
      </div>
      {['Gestion Personnel','Accès & Permissions','Procédures'].map(groupe=>{
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
