'use client';
import { useState } from 'react';
import {
  LayoutDashboard, Headphones, FileText, Users, Settings, Search,
  User, BedDouble, UtensilsCrossed, ExternalLink, ToggleLeft, ToggleRight,
  CheckCircle, XCircle, Mail, HelpCircle
} from 'lucide-react';

type Module = { id:string; label:string; description:string; href:string; icon:React.ElementType; color:string; groupe:string; actif:boolean; };

const INIT: Module[] = [
  // Admin support
  { id:'as-supports',  label:'Support Admin',       description:'Gestion des tickets support, assignation, résolution.',         href:'/admin/supports',          icon:Headphones,      color:'#f87171', groupe:'Admin Support',   actif:true  },
  { id:'as-mailbox',   label:'Boîte mail',          description:'Messagerie interne, emails entrants et sortants.',              href:'/admin/mailbox',           icon:Mail,            color:'#f87171', groupe:'Admin Support',   actif:true  },
  { id:'as-users',     label:'Utilisateurs',        description:'Gestion des comptes utilisateurs, rôles, accès.',              href:'/admin/users',             icon:Users,           color:'#f87171', groupe:'Admin Support',   actif:true  },
  { id:'as-utilisateurs',label:'Utilisateurs (v2)', description:'Vue alternative de gestion des utilisateurs.',                 href:'/admin/utilisateurs',      icon:User,            color:'#f87171', groupe:'Admin Support',   actif:false },
  { id:'as-dossiers',  label:'Dossiers',            description:'Gestion des dossiers clients et procédures.',                  href:'/admin/dossiers',          icon:FileText,        color:'#f87171', groupe:'Admin Support',   actif:true  },
  { id:'as-documents', label:'Documents',           description:'Gestion documentaire, upload, validation.',                   href:'/admin/documents',         icon:FileText,        color:'#f87171', groupe:'Admin Support',   actif:true  },
  // Espace client
  { id:'cl-dashboard', label:'Dashboard Client',    description:'Vue d\'ensemble de l\'espace client.',                        href:'/client',                  icon:LayoutDashboard, color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  { id:'cl-search',    label:'Recherche',           description:'Moteur de recherche biens et véhicules pour les clients.',    href:'/client/search',           icon:Search,          color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  { id:'cl-contracts', label:'Mes Contrats',        description:'Contrats du client, téléchargement, suivi.',                 href:'/client/contracts',        icon:FileText,        color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  { id:'cl-hotel',     label:'Hôtel Client',        description:'Réservations hôtel depuis l\'espace client.',                href:'/client/hotel',            icon:BedDouble,       color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  { id:'cl-restaurant',label:'Restaurant Client',   description:'Commandes restaurant depuis l\'espace client.',              href:'/client/restaurant',       icon:UtensilsCrossed, color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  { id:'cl-profile',   label:'Profil Client',       description:'Gestion du profil et informations personnelles.',            href:'/client/profile',          icon:User,            color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  { id:'cl-settings',  label:'Paramètres Client',   description:'Paramètres et préférences du compte client.',               href:'/client/settings',         icon:Settings,        color:'#00c2ff', groupe:'Espace Client',   actif:true  },
  // Aide publique
  { id:'pub-faq',      label:'FAQ',                 description:'Page FAQ publique, questions fréquentes.',                   href:'/faq',                     icon:HelpCircle,      color:'#666',    groupe:'Public',          actif:true  },
  { id:'pub-support',  label:'Support Public',      description:'Page de support accessible sans connexion.',                href:'/support',                 icon:Headphones,      color:'#666',    groupe:'Public',          actif:true  },
  { id:'pub-helpdesk', label:'Helpdesk',            description:'Centre d\'aide et documentation utilisateur.',              href:'/helpdesk',                icon:HelpCircle,      color:'#666',    groupe:'Public',          actif:false },
];

const GROUPE_COLOR: Record<string,string> = { 'Admin Support':'#f87171', 'Espace Client':'#00c2ff', 'Public':'#666' };

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

export default function SupportModule() {
  const [modules, setModules] = useState<Module[]>(INIT);
  const [toast, setToast] = useState('');
  const showToast = (m:string) => { setToast(m); setTimeout(()=>setToast(''),2500); };
  const toggle = (id:string) => setModules(prev=>prev.map(m=>{ if(m.id!==id) return m; const next=!m.actif; showToast(`${m.label} ${next?'activé':'désactivé'}`); return {...m,actif:next}; }));
  const actifs = modules.filter(m=>m.actif).length;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:200, background:'#f87171', color:'#fff', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[{label:'Total modules',value:modules.length,color:'#f87171',icon:Headphones},{label:'Actifs',value:actifs,color:'#00e5a0',icon:CheckCircle},{label:'Désactivés',value:modules.length-actifs,color:'#f87171',icon:XCircle}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:34, height:34, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}><s.icon size={16} style={{ color:s.color }}/></div>
            <div><p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>{s.value}</p><p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{s.label}</p></div>
          </div>
        ))}
      </div>
      {['Admin Support','Espace Client','Public'].map(groupe=>{
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
