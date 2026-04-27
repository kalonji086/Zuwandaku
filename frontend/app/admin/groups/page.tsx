'use client';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, X, Save, AlertTriangle, Users, Key, Shield, CheckCircle } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

type Group = { id:string; name:string; description:string; permissions:string[]; members:string[]; createdAt:string };

const INIT_GROUPS: Group[] = [
  { id:'g1', name:'INBOXzuwandaku Commissionnaires Lubumbashi', description:'Groupe commissionnaires Haut-Katanga', permissions:['properties.view','vehicles.view','contracts.read'], members:['user1','user2'], createdAt:'2024-01-15' },
  { id:'g2', name:'INBOXzuwandaku Propriétaires Kisangani', description:'Propriétaires Tshopo', permissions:['properties.manage','contracts.sign'], members:['user3'], createdAt:'2024-02-10' },
];

const ALL_PERMS = ['properties.view','properties.edit','vehicles.view','contracts.read','contracts.sign','users.manage'];

const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>(INIT_GROUPS);
  const [modal, setModal] = useState<'add'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Group|null>(null);
  const [form, setForm] = useState({ name:'', description:'', permissions:[] as string[] });
  const [toast, setToast] = useState('');
  const [nameError, setNameError] = useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),3000); };
  const close = () => { setModal(null); setSelected(null); setForm({name:'',description:'',permissions:[]}); setNameError(''); };

  const togglePerm = (p:string) => setForm(f=>({ ...f, permissions:f.permissions.includes(p)?f.permissions.filter(x=>x!==p):[...f.permissions,p] }));

  const validate = (name:string) => {
    if (!name.startsWith('INBOXzuwandaku ')) { setNameError('Le nom doit commencer par "INBOXzuwandaku "'); return false; }
    setNameError(''); return true;
  };

  const handleAdd = () => {
    if (!validate(form.name)) return;
    setGroups(p=>[{...form, id:`g${Date.now()}`, members:[], createdAt:new Date().toISOString().split('T')[0]},...p]);
    showToast('Groupe créé'); close();
  };
  const handleEdit = () => {
    if (!selected||!validate(form.name)) return;
    setGroups(p=>p.map(g=>g.id===selected.id?{...g,...form}:g));
    showToast('Groupe modifié'); close();
  };
  const handleDelete = () => {
    if (!selected) return;
    setGroups(p=>p.filter(g=>g.id!==selected.id));
    showToast('Groupe supprimé'); close();
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Administration</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Groupes</h1>
        </div>
        <button onClick={()=>setModal('add')} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14}/>Nouveau groupe
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[{label:'Groupes actifs',value:groups.length,color:'#1a6dff',icon:Users},{label:'Membres total',value:groups.reduce((a,g)=>a+g.members.length,0),color:'#7b61ff',icon:Shield},{label:'Permissions total',value:groups.reduce((a,g)=>a+g.permissions.length,0),color:'#00e5a0',icon:Key}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={16} style={{ color:s.color }}/>
            </div>
            <div>
              <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>{s.value}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Groups list */}
      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
        {groups.map(g=>(
          <div key={g.id} style={C.card}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>{g.name}</p>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:'0 0 10px' }}>{g.description}</p>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                  <span style={{ background:'rgba(26,109,255,0.12)', border:'1px solid rgba(26,109,255,0.25)', borderRadius:6, padding:'2px 8px', fontSize:11, color:'#1a6dff' }}>{g.members.length} membres</span>
                  <span style={{ background:'rgba(0,229,160,0.12)', border:'1px solid rgba(0,229,160,0.25)', borderRadius:6, padding:'2px 8px', fontSize:11, color:'#00e5a0' }}>{g.permissions.length} permissions</span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>{g.createdAt}</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                {[{icon:Pencil,color:'#ffcc00',action:()=>{setSelected(g);setForm({name:g.name,description:g.description,permissions:g.permissions});setModal('edit');}},{icon:Trash2,color:'#f87171',action:()=>{setSelected(g);setModal('delete');}}].map(({icon:Icon,color,action},j)=>(
                  <button key={j} onClick={action} style={{ width:30, height:30, borderRadius:7, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                    <Icon size={13} style={{color}}/>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
        {groups.length===0&&<div style={{ textAlign:'center', padding:'48px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucun groupe créé</div>}
      </div>

      {/* Modal */}
      {modal&&(
        <DraggableModal onClose={close} maxWidth={520}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{modal==='add'?'Nouveau groupe':modal==='edit'?'Modifier groupe':'Supprimer groupe'}</p>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>

            {(modal==='add'||modal==='edit')&&(
              <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Nom du groupe *</label>
                  <input value={form.name} onChange={e=>{setForm(f=>({...f,name:e.target.value}));setNameError('');}} placeholder="INBOXzuwandaku NomDuGroupe" style={inp}/>
                  {nameError&&<p style={{ fontSize:11, color:'#f87171', marginTop:4 }}>{nameError}</p>}
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', marginTop:4 }}>Doit commencer par "INBOXzuwandaku "</p>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Description</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} style={{ ...inp, resize:'none' }}/>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:8, display:'block' }}>Permissions</label>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                    {ALL_PERMS.map(p=>(
                      <label key={p} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 10px', background:'rgba(255,255,255,0.03)', border:`1px solid ${form.permissions.includes(p)?'rgba(26,109,255,0.4)':'rgba(255,255,255,0.06)'}`, borderRadius:8, cursor:'pointer' }}>
                        <input type="checkbox" checked={form.permissions.includes(p)} onChange={()=>togglePerm(p)} style={{ accentColor:'#1a6dff' }}/>
                        <span style={{ fontSize:12, color:form.permissions.includes(p)?'#fff':'rgba(255,255,255,0.4)' }}>{p}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={modal==='add'?handleAdd:handleEdit} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Save size={13}/>{modal==='add'?'Créer':'Sauvegarder'}
                  </button>
                </div>
              </div>
            )}

            {modal==='delete'&&selected&&(
              <div style={{ padding:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>Supprimer le groupe <strong style={{color:'#fff'}}>{selected.name}</strong> ?</p>
                <div style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'12px 14px', display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                  <AlertTriangle size={14} style={{ color:'#f87171', flexShrink:0 }}/>
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
