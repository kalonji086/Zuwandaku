'use client';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, Filter, Users, ShieldCheck, User, Briefcase, X, Save, AlertTriangle } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

type UserRow = { id:string; name:string; email:string; phone:string; role:string; cni:string; properties:number; vehicles:number; createdAt:string };

const INIT: UserRow[] = [
  { id:'U001', name:'Jean Mukendi', email:'jean@example.com', phone:'+243 81 234 5678', role:'PROPRIETAIRE', cni:'CNI-001-2020', properties:3, vehicles:1, createdAt:'2024-11-01' },
  { id:'U002', name:'Marie Kabila', email:'marie@example.com', phone:'+243 99 876 5432', role:'CLIENT', cni:'CNI-002-2021', properties:0, vehicles:0, createdAt:'2024-12-15' },
  { id:'U003', name:'Paul Lumumba', email:'paul@example.com', phone:'+243 82 345 6789', role:'PROPRIETAIRE', cni:'CNI-003-2019', properties:5, vehicles:2, createdAt:'2024-10-20' },
  { id:'U004', name:'Sophie Tshisekedi', email:'sophie@example.com', phone:'+243 97 654 3210', role:'ADMIN', cni:'CNI-004-2018', properties:0, vehicles:0, createdAt:'2024-09-01' },
  { id:'U005', name:'David Mobutu', email:'david@example.com', phone:'+243 84 567 8901', role:'CLIENT', cni:'CNI-005-2022', properties:0, vehicles:0, createdAt:'2025-01-05' },
];

const EMPTY = { name:'', email:'', phone:'', role:'CLIENT', cni:'' };

const ROLE_COLOR: Record<string,string> = { ADMIN:'#f87171', PROPRIETAIRE:'#7b61ff', CLIENT:'#1a6dff', COMMISSIONNAIRE:'#ffcc00' };

const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function UtilisateursPage() {
  const [data, setData] = useState<UserRow[]>(INIT);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [modal, setModal] = useState<'add'|'view'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<UserRow|null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [toast, setToast] = useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),3000); };
  const close = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleAdd = () => {
    if (!form.name||!form.email) return;
    setData(p=>[{ ...form, id:`U${String(p.length+1).padStart(3,'0')}`, properties:0, vehicles:0, createdAt:new Date().toISOString().split('T')[0] },...p]);
    showToast('Utilisateur ajouté'); close();
  };
  const handleEdit = () => {
    if (!selected) return;
    setData(p=>p.map(u=>u.id===selected.id?{...u,...form}:u));
    showToast('Utilisateur modifié'); close();
  };
  const handleDelete = () => {
    if (!selected) return;
    setData(p=>p.filter(u=>u.id!==selected.id));
    showToast('Utilisateur supprimé'); close();
  };

  const filtered = data.filter(u=>`${u.name} ${u.email}`.toLowerCase().includes(search.toLowerCase())&&(filterRole==='ALL'||u.role===filterRole));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast && <div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Gestion</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Utilisateurs</h1>
        </div>
        <button onClick={()=>{setForm(EMPTY);setModal('add');}}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14} />Ajouter
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {(['ADMIN','PROPRIETAIRE','CLIENT'] as const).map(role=>(
          <div key={role} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`${ROLE_COLOR[role]}18`, display:'flex', alignItems:'center', justifyContent:'center' }}>
              {role==='ADMIN'?<ShieldCheck size={16} style={{color:ROLE_COLOR[role]}}/>:role==='PROPRIETAIRE'?<Briefcase size={16} style={{color:ROLE_COLOR[role]}}/>:<User size={16} style={{color:ROLE_COLOR[role]}}/>}
            </div>
            <div>
              <p style={{ fontSize:20, fontWeight:800, color:'#fff', margin:0 }}>{data.filter(u=>u.role===role).length}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{role}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10 }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0 12px' }}>
          <Search size={14} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }} />
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, padding:'9px 0' }} />
        </div>
        <select value={filterRole} onChange={e=>setFilterRole(e.target.value)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none' }}>
          <option value="ALL">Tous rôles</option>
          <option value="ADMIN">Admin</option>
          <option value="PROPRIETAIRE">Propriétaire</option>
          <option value="CLIENT">Client</option>
        </select>
      </div>

      {/* Table */}
      <div style={C.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['ID','Nom','Email','Téléphone','Rôle','Biens','Véhicules','Date','Actions'].map(h=>(
                  <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u,i)=>(
                <tr key={u.id} style={{ background: i%2?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'12px 14px', fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{u.id}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>{u.name.charAt(0)}</div>
                      <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{u.email}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{u.phone}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:`${ROLE_COLOR[u.role]||'#666'}18`, border:`1px solid ${ROLE_COLOR[u.role]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:ROLE_COLOR[u.role]||'#aaa' }}>{u.role}</span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{u.properties}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', textAlign:'center', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{u.vehicles}</td>
                  <td style={{ padding:'12px 14px', fontSize:11, color:'rgba(255,255,255,0.25)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{u.createdAt}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      {[{icon:Eye,color:'#1a6dff',action:()=>{setSelected(u);setModal('view');}},{icon:Pencil,color:'#ffcc00',action:()=>{setSelected(u);setForm({name:u.name,email:u.email,phone:u.phone,role:u.role,cni:u.cni});setModal('edit');}},{icon:Trash2,color:'#f87171',action:()=>{setSelected(u);setModal('delete');}}].map(({icon:Icon,color,action},j)=>(
                        <button key={j} onClick={action} style={{ width:28, height:28, borderRadius:6, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                          <Icon size={13} style={{ color }} />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucun utilisateur trouvé</div>}
        </div>
      </div>

      {/* Modal */}
      {modal&&(
        <DraggableModal onClose={close} maxWidth={480}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>
                {modal==='view'?'Profil':modal==='add'?'Ajouter utilisateur':modal==='edit'?'Modifier':'Supprimer'}
              </p>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>

            {modal==='view'&&selected&&(
              <div style={{ padding:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff' }}>{selected.name.charAt(0)}</div>
                  <div>
                    <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{selected.name}</p>
                    <span style={{ background:`${ROLE_COLOR[selected.role]||'#666'}18`, border:`1px solid ${ROLE_COLOR[selected.role]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:ROLE_COLOR[selected.role]||'#aaa' }}>{selected.role}</span>
                  </div>
                </div>
                {[['Email',selected.email],['Téléphone',selected.phone],['CNI',selected.cni],['Propriétés',selected.properties],['Véhicules',selected.vehicles],['Inscrit le',selected.createdAt]].map(([k,v])=>(
                  <div key={String(k)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span>
                    <span style={{ color:'#fff', fontWeight:500 }}>{String(v)}</span>
                  </div>
                ))}
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <button onClick={()=>{close();setSelected(selected);setForm({name:selected.name,email:selected.email,phone:selected.phone,role:selected.role,cni:selected.cni});setModal('edit');}} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,204,0,0.12)', border:'1px solid rgba(255,204,0,0.3)', color:'#ffcc00', fontSize:13, fontWeight:600, cursor:'pointer' }}>Éditer</button>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
                </div>
              </div>
            )}

            {(modal==='add'||modal==='edit')&&(
              <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[{label:'Nom complet *',k:'name',col:2},{label:'Email *',k:'email'},{label:'Téléphone',k:'phone'},{label:'CNI',k:'cni'}].map(({label,k,col})=>(
                  <div key={k} style={{ gridColumn:col?`span ${col}`:undefined }}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    <input value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={inp} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Rôle</label>
                  <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} style={inp}>
                    <option value="CLIENT">Client</option>
                    <option value="PROPRIETAIRE">Propriétaire</option>
                    <option value="ADMIN">Admin</option>
                    <option value="COMMISSIONNAIRE">Commissionnaire</option>
                  </select>
                </div>
                <div style={{ gridColumn:'span 2', display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={modal==='add'?handleAdd:handleEdit} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Save size={13}/>{modal==='add'?'Ajouter':'Sauvegarder'}
                  </button>
                </div>
              </div>
            )}

            {modal==='delete'&&selected&&(
              <div style={{ padding:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>Supprimer <strong style={{color:'#fff'}}>{selected.name}</strong> ?</p>
                <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                  <AlertTriangle size={14} style={{ color:'#f87171', flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'#f87171' }}>Cette action est irréversible.</span>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={handleDelete} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Trash2 size={13}/>Supprimer
                  </button>
                </div>
              </div>
            )}
        </DraggableModal>
      )}
    </div>
  );
}
