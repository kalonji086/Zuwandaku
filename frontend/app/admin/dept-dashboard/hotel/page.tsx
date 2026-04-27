'use client';
import { useState } from 'react';
import {
  LayoutDashboard, BedDouble, Calendar, User, DollarSign, FileBarChart,
  Users, Sparkles, Zap, Shield, ChefHat, ClipboardList, Settings,
  ExternalLink, ToggleLeft, ToggleRight, Hotel, CheckCircle, XCircle, Eye
} from 'lucide-react';

type Module = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
  groupe: string;
  actif: boolean;
};

const INIT_MODULES: Module[] = [
  // Principal
  { id:'h-dashboard',   label:'Dashboard',         description:'Vue d\'ensemble, stats, réservations récentes, menu restaurant.',  href:'/hotel',             icon:LayoutDashboard, color:'#00c2ff', groupe:'Principal', actif:true  },
  { id:'h-rooms',       label:'Chambres',           description:'Gestion des chambres, types, tarifs, disponibilités.',             href:'/hotel/rooms',       icon:BedDouble,       color:'#1a6dff', groupe:'Principal', actif:true  },
  { id:'h-bookings',    label:'Réservations',       description:'Suivi des réservations, check-in, check-out.',                    href:'/hotel/bookings',    icon:Calendar,        color:'#7b61ff', groupe:'Principal', actif:true  },
  { id:'h-guests',      label:'Clients',            description:'Fiche clients, historique séjours, contacts.',                    href:'/hotel/guests',      icon:User,            color:'#00e5a0', groupe:'Principal', actif:true  },
  { id:'h-billing',     label:'Facturation',        description:'Factures, paiements, reçus, suivi financier.',                    href:'/hotel/billing',     icon:DollarSign,      color:'#ffcc00', groupe:'Principal', actif:true  },
  { id:'h-reports',     label:'Rapports',           description:'Rapports d\'activité, statistiques, exports.',                    href:'/hotel/reports',     icon:FileBarChart,    color:'#ff6b35', groupe:'Principal', actif:true  },
  // Équipes
  { id:'h-manage',      label:'Personnel',          description:'Gestion du personnel, rôles, accès, membres.',                    href:'/hotel/manage',      icon:Users,           color:'#1a6dff', groupe:'Équipes',   actif:true  },
  { id:'h-menage',      label:'Ménage',             description:'Tâches de ménage, planning, suivi des chambres nettoyées.',       href:'/hotel/menage',      icon:Sparkles,        color:'#00e5a0', groupe:'Équipes',   actif:true  },
  { id:'h-electricien', label:'Électricien',        description:'Interventions électriques, pannes, maintenance.',                 href:'/hotel/electricien', icon:Zap,             color:'#ffcc00', groupe:'Équipes',   actif:false },
  { id:'h-gardien',     label:'Gardien',            description:'Rondes, incidents de sécurité, accès.',                          href:'/hotel/gardien',     icon:Shield,          color:'#f87171', groupe:'Équipes',   actif:true  },
  { id:'h-chef',        label:'Chef Cuisine',       description:'Menu, commandes cuisine, gestion des plats.',                    href:'/hotel/chef-cuisine', icon:ChefHat,         color:'#ff6b35', groupe:'Équipes',   actif:true  },
  // Gestion
  { id:'h-taches',      label:'Gestion de tâches',  description:'Assignation et suivi des tâches inter-équipes.',                 href:'/hotel/taches',      icon:ClipboardList,   color:'#7b61ff', groupe:'Gestion',   actif:true  },
  { id:'h-parametres',  label:'Paramètres',         description:'Configuration de l\'hôtel, tarifs, politiques.',                 href:'/hotel/parametres',  icon:Settings,        color:'#666',    groupe:'Gestion',   actif:true  },
];

const GROUPE_COLOR: Record<string,string> = { Principal:'#1a6dff', Équipes:'#00e5a0', Gestion:'#7b61ff' };

export default function HotelModule() {
  const [modules, setModules] = useState<Module[]>(INIT_MODULES);
  const [toast, setToast] = useState('');

  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),2500); };

  const toggle = (id:string) => {
    setModules(prev => prev.map(m => {
      if (m.id !== id) return m;
      const next = !m.actif;
      showToast(`${m.label} ${next ? 'activé' : 'désactivé'}`);
      return { ...m, actif: next };
    }));
  };

  const groupes = ['Principal','Équipes','Gestion'];
  const actifs = modules.filter(m=>m.actif).length;
  const inactifs = modules.filter(m=>!m.actif).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:200, background:'#7b61ff', color:'#fff', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[
          { label:'Total modules', value:modules.length, color:'#7b61ff', icon:Hotel },
          { label:'Actifs', value:actifs, color:'#00e5a0', icon:CheckCircle },
          { label:'Désactivés', value:inactifs, color:'#f87171', icon:XCircle },
        ].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={16} style={{ color:s.color }}/>
            </div>
            <div>
              <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>{s.value}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Groupes */}
      {groupes.map(groupe => {
        const items = modules.filter(m=>m.groupe===groupe);
        const gColor = GROUPE_COLOR[groupe];
        return (
          <div key={groupe}>
            {/* Groupe header */}
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <div style={{ width:3, height:16, borderRadius:2, background:gColor }}/>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:'0.1em', color:'rgba(255,255,255,0.4)', textTransform:'uppercase', margin:0 }}>{groupe}</p>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.05)', borderRadius:4, padding:'1px 6px' }}>
                {items.filter(m=>m.actif).length}/{items.length} actifs
              </span>
            </div>

            {/* Cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
              {items.map(m=>{
                const Icon = m.icon;
                return (
                  <div key={m.id} style={{
                    background: m.actif ? '#0d0d14' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${m.actif ? `${m.color}25` : 'rgba(255,255,255,0.05)'}`,
                    borderRadius:12, padding:'14px 16px',
                    opacity: m.actif ? 1 : 0.55,
                    transition:'all 0.2s',
                  }}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
                      {/* Icon + info */}
                      <div style={{ display:'flex', alignItems:'flex-start', gap:12, flex:1, minWidth:0 }}>
                        <div style={{ width:36, height:36, borderRadius:9, background:`${m.color}18`, border:`1px solid ${m.color}25`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <Icon size={16} style={{ color: m.actif ? m.color : 'rgba(255,255,255,0.2)' }}/>
                        </div>
                        <div style={{ minWidth:0 }}>
                          <p style={{ fontSize:13, fontWeight:700, color: m.actif ? '#fff' : 'rgba(255,255,255,0.3)', margin:'0 0 3px' }}>{m.label}</p>
                          <p style={{ fontSize:11, color:'rgba(255,255,255,0.25)', margin:0, lineHeight:1.4 }}>{m.description}</p>
                        </div>
                      </div>

                      {/* Toggle */}
                      <button
                        onClick={()=>toggle(m.id)}
                        title={m.actif?'Désactiver':'Activer'}
                        style={{ background:'none', border:'none', cursor:'pointer', flexShrink:0, padding:0, marginTop:2 }}
                      >
                        {m.actif
                          ? <ToggleRight size={28} style={{ color:m.color, filter:`drop-shadow(0 0 4px ${m.color}80)` }}/>
                          : <ToggleLeft size={28} style={{ color:'rgba(255,255,255,0.2)' }}/>
                        }
                      </button>
                    </div>

                    {/* Footer */}
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{
                        fontSize:10, fontWeight:700, padding:'2px 8px', borderRadius:5,
                        background: m.actif ? `${m.color}15` : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${m.actif ? `${m.color}30` : 'rgba(255,255,255,0.08)'}`,
                        color: m.actif ? m.color : 'rgba(255,255,255,0.2)',
                      }}>
                        {m.actif ? '● Actif' : '○ Inactif'}
                      </span>

                      {m.actif && (
                        <a
                          href={m.href}
                          target="_blank"
                          rel="noreferrer"
                          style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, fontWeight:600, color:'rgba(255,255,255,0.4)', textDecoration:'none', padding:'4px 10px', borderRadius:6, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', transition:'all 0.15s' }}
                          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.color='#fff';(e.currentTarget as HTMLElement).style.background=`${m.color}15`;(e.currentTarget as HTMLElement).style.borderColor=`${m.color}30`;}}
                          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color='rgba(255,255,255,0.4)';(e.currentTarget as HTMLElement).style.background='rgba(255,255,255,0.04)';(e.currentTarget as HTMLElement).style.borderColor='rgba(255,255,255,0.08)';}}
                        >
                          <Eye size={11}/>Accéder<ExternalLink size={10}/>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
