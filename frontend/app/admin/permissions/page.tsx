'use client';
import { useState, useEffect } from 'react';
import { Search, Trash2, Shield, Settings, Eye, Users, Key, Download } from 'lucide-react';
import { useAdminUsers } from '../../../lib/hooks/useAdminUsers';

const MODULES = [
  { id:'dashboard', label:'Dashboard' },
  { id:'properties', label:'Propriétés' },
  { id:'vehicles', label:'Véhicules' },
  { id:'users', label:'Utilisateurs' },
  { id:'approve', label:'Approbations' },
  { id:'reports', label:'Rapports' },
  { id:'settings', label:'Paramètres' },
];

const ROLES = ['ADMIN','PROPRIETAIRE','CLIENT','COMMISSIONNAIRE'];
const ROLE_COLOR: Record<string,string> = { ADMIN:'#f87171', PROPRIETAIRE:'#7b61ff', CLIENT:'#1a6dff', COMMISSIONNAIRE:'#ffcc00' };

const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function PermissionsPage() {
  const { data: usersData, isLoading } = useAdminUsers();
  const users = (usersData || []) as any[];
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [rolePerms, setRolePerms] = useState<Record<string,Record<string,boolean>>>({});

  useEffect(() => {
    const init: Record<string,Record<string,boolean>> = {};
    ROLES.forEach(role => {
      init[role] = {};
      MODULES.forEach(m => { init[role][m.id] = role==='ADMIN'||Math.random()>0.4; });
    });
    setRolePerms(init);
  }, []);

  const togglePerm = (role:string, mod:string) => setRolePerms(p=>({ ...p, [role]:{ ...p[role], [mod]:!p[role]?.[mod] } }));
  const toggleUser = (id:string) => setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const filteredUsers = users.filter((u:any)=>`${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Administration</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Permissions & Accès</h1>
        </div>
        {selected.length>0&&(
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {[{label:`Suspendre (${selected.length})`,color:'#ffcc00'},{label:`Supprimer (${selected.length})`,color:'#f87171'},{label:'Accès Admin',color:'#1a6dff'},{label:'Accès Propriétaire',color:'#7b61ff'}].map(({label,color})=>(
              <button key={label} style={{ padding:'7px 12px', borderRadius:7, background:`${color}15`, border:`1px solid ${color}30`, color, fontSize:12, fontWeight:600, cursor:'pointer' }}>{label}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Users */}
        <div style={C.card}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Utilisateurs ({filteredUsers.length})</p>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0 10px' }}>
              <Search size={13} style={{ color:'rgba(255,255,255,0.3)' }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:12, padding:'7px 0', width:140 }}/>
            </div>
          </div>
          {isLoading ? (
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'24px 0' }}>Chargement...</p>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6, maxHeight:400, overflowY:'auto' }}>
              {filteredUsers.map((u:any)=>(
                <div key={u.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 10px', background:selected.includes(u.id)?'rgba(26,109,255,0.08)':'rgba(255,255,255,0.02)', border:`1px solid ${selected.includes(u.id)?'rgba(26,109,255,0.25)':'rgba(255,255,255,0.04)'}`, borderRadius:9, cursor:'pointer' }} onClick={()=>toggleUser(u.id)}>
                  <div style={{ width:18, height:18, borderRadius:4, background:selected.includes(u.id)?'#1a6dff':'rgba(255,255,255,0.08)', border:`1px solid ${selected.includes(u.id)?'#1a6dff':'rgba(255,255,255,0.15)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {selected.includes(u.id)&&<div style={{ width:8, height:8, background:'#fff', borderRadius:2 }}/>}
                  </div>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#7b61ff)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>{u.name?.charAt(0)||'?'}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <p style={{ fontSize:12, fontWeight:600, color:'#fff', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.name}</p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{u.email}</p>
                  </div>
                  <span style={{ background:`${ROLE_COLOR[u.role]||'#666'}18`, border:`1px solid ${ROLE_COLOR[u.role]||'#666'}30`, borderRadius:5, padding:'1px 6px', fontSize:10, fontWeight:600, color:ROLE_COLOR[u.role]||'#aaa', flexShrink:0 }}>{u.role}</span>
                </div>
              ))}
              {filteredUsers.length===0&&<p style={{ fontSize:13, color:'rgba(255,255,255,0.2)', textAlign:'center', padding:'24px 0' }}>Aucun utilisateur</p>}
            </div>
          )}
        </div>

        {/* Permissions matrix */}
        <div style={C.card}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
            <Shield size={16} style={{ color:'#1a6dff' }}/>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Matrice des permissions</p>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding:'8px 10px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>Module</th>
                  {ROLES.map(r=>(
                    <th key={r} style={{ padding:'8px 10px', fontSize:10, fontWeight:700, letterSpacing:'0.06em', color:ROLE_COLOR[r]||'#aaa', textTransform:'uppercase', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{r.slice(0,4)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MODULES.map(mod=>(
                  <tr key={mod.id}>
                    <td style={{ padding:'8px 10px', fontSize:12, color:'rgba(255,255,255,0.6)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{mod.label}</td>
                    {ROLES.map(role=>{
                      const allowed = rolePerms[role]?.[mod.id]??false;
                      return (
                        <td key={role} style={{ padding:'8px 10px', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                          <button onClick={()=>togglePerm(role,mod.id)} title={allowed?'Désactiver':'Activer'}
                            style={{ width:36, height:22, borderRadius:11, background:allowed?'#1a6dff':'rgba(255,255,255,0.08)', border:'none', cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
                            <span style={{ position:'absolute', top:3, left:allowed?17:3, width:16, height:16, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.4)' }}/>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Audit logs */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <Key size={16} style={{ color:'#7b61ff' }}/>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Logs d'audit</p>
          </div>
          <button style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:7, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.4)', fontSize:12, cursor:'pointer' }}>
            <Download size={12}/>Exporter CSV
          </button>
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['Action','Utilisateur','Rôle','Date'].map(h=>(
                <th key={h} style={{ padding:'8px 12px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {Array(5).fill(0).map((_,i)=>(
                <tr key={i}>
                  <td style={{ padding:'10px 12px', fontSize:12, color:'rgba(255,255,255,0.6)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>Permission modifiée</td>
                  <td style={{ padding:'10px 12px', fontSize:12, color:'rgba(255,255,255,0.6)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>Admin Principal</td>
                  <td style={{ padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:'rgba(123,97,255,0.15)', border:'1px solid rgba(123,97,255,0.3)', borderRadius:5, padding:'1px 7px', fontSize:10, fontWeight:600, color:'#7b61ff' }}>ADMIN</span>
                  </td>
                  <td style={{ padding:'10px 12px', fontSize:11, color:'rgba(255,255,255,0.25)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>14 janv. 2025, 15:3{i}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
