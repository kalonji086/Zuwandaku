'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Mail, Lock, Phone, Building, User, Eye, EyeOff, Check, Edit, Trash2, Search, X } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

const ROLES = ['PROPRIETAIRE','CLIENT','COMMISSIONNAIRE','ADMIN'];
const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

type Account = { id:number; fullName:string; email:string; phone:string; company:string; role:string; date:string };

export default function CreateAccountPage() {
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', company:'', role:'CLIENT', password:'', confirmPassword:'' });
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});
  const [success, setSuccess] = useState('');
  const [lastId, setLastId] = useState('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'view'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Account|null>(null);
  const [editForm, setEditForm] = useState<Account|null>(null);

  useEffect(() => {
    try { const s=localStorage.getItem('adminAccounts'); if(s) setAccounts(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem('adminAccounts',JSON.stringify(accounts)); } catch {}
  }, [accounts]);

  const validate = () => {
    const e: Record<string,string> = {};
    if (!form.fullName.trim()) e.fullName='Requis';
    if (!form.email.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email='Email invalide';
    if (!form.phone.trim()) e.phone='Requis';
    if (!form.password||form.password.length<6) e.password='Min 6 caractères';
    if (form.password!==form.confirmPassword) e.confirmPassword='Ne correspond pas';
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const id = Math.max(...accounts.map(a=>a.id),0)+1;
    const newAcc: Account = { id, fullName:form.fullName, email:form.email, phone:form.phone, company:form.company, role:form.role, date:new Date().toLocaleDateString('fr-FR') };
    setAccounts(p=>[newAcc,...p]);
    setLastId(String(id));
    setSuccess(`Compte créé pour ${form.fullName}`);
    setForm({ fullName:'', email:'', phone:'', company:'', role:'CLIENT', password:'', confirmPassword:'' });
    setErrors({});
    setTimeout(()=>setSuccess(''),10000);
  };

  const filtered = accounts.filter(a=>`${a.fullName} ${a.email}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Administration</p>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Création de compte</h1>
      </div>

      {success&&(
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ background:'rgba(0,229,160,0.1)', border:'1px solid rgba(0,229,160,0.3)', borderRadius:10, padding:'12px 16px', display:'flex', alignItems:'center', gap:8 }}>
            <Check size={14} style={{ color:'#00e5a0', flexShrink:0 }}/><span style={{ fontSize:13, color:'#00e5a0' }}>{success}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {[{label:'Assignation',href:`/admin/groups?userId=${lastId}`,color:'#ff6b35'},{label:'Groupes',href:`/admin/groups?userId=${lastId}`,color:'#7b61ff'}].map(({label,href,color})=>(
              <Link key={label} href={href} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', borderRadius:8, background:`${color}18`, border:`1px solid ${color}30`, color, fontSize:13, fontWeight:600, textDecoration:'none' }}>
                <Users size={14}/>{label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Form */}
      <div style={C.card}>
        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[{label:'Nom complet *',k:'fullName',icon:User},{label:'Email *',k:'email',type:'email',icon:Mail},{label:'Téléphone *',k:'phone',type:'tel',icon:Phone},{label:'Entreprise',k:'company',icon:Building}].map(({label,k,type,icon:Icon})=>(
              <div key={k}>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#111118', border:`1px solid ${(errors as any)[k]?'rgba(248,113,113,0.5)':'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'0 12px' }}>
                  <Icon size={13} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}/>
                  <input type={type||'text'} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, padding:'9px 0' }}/>
                </div>
                {(errors as any)[k]&&<p style={{ fontSize:11, color:'#f87171', marginTop:3 }}>{(errors as any)[k]}</p>}
              </div>
            ))}
          </div>

          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:8, display:'block' }}>Rôle</label>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
              {ROLES.map(r=>(
                <button key={r} type="button" onClick={()=>setForm(f=>({...f,role:r}))} style={{ padding:'8px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', border:'1px solid', background:form.role===r?'#1a6dff':'transparent', borderColor:form.role===r?'#1a6dff':'rgba(255,255,255,0.1)', color:form.role===r?'#fff':'rgba(255,255,255,0.4)' }}>{r}</button>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[{label:'Mot de passe *',k:'password',show:showPwd,toggle:()=>setShowPwd(v=>!v)},{label:'Confirmer *',k:'confirmPassword',show:showConfirm,toggle:()=>setShowConfirm(v=>!v)}].map(({label,k,show,toggle})=>(
              <div key={k}>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'#111118', border:`1px solid ${(errors as any)[k]?'rgba(248,113,113,0.5)':'rgba(255,255,255,0.1)'}`, borderRadius:8, padding:'0 12px' }}>
                  <Lock size={13} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}/>
                  <input type={show?'text':'password'} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} placeholder="••••••••" style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, padding:'9px 0' }}/>
                  <button type="button" onClick={toggle} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.3)' }}>{show?<EyeOff size={13}/>:<Eye size={13}/>}</button>
                </div>
                {(errors as any)[k]&&<p style={{ fontSize:11, color:'#f87171', marginTop:3 }}>{(errors as any)[k]}</p>}
              </div>
            ))}
          </div>

          <button type="submit" style={{ padding:'11px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
            <Check size={14}/>Créer le compte
          </button>
        </form>
      </div>

      {/* Accounts list */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Comptes créés ({accounts.length})</p>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0 10px' }}>
            <Search size={13} style={{ color:'rgba(255,255,255,0.3)' }}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:12, padding:'7px 0', width:160 }}/>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {filtered.map(acc=>(
            <div key={acc.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>{acc.fullName[0]}</div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{acc.fullName}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{acc.email}</p>
                </div>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ background:'rgba(26,109,255,0.15)', border:'1px solid rgba(26,109,255,0.3)', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:'#1a6dff' }}>{acc.role}</span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.25)' }}>{acc.date}</span>
                <div style={{ display:'flex', gap:5 }}>
                  {[{icon:Eye,color:'#1a6dff',action:()=>{setSelected(acc);setModal('view');}},{icon:Edit,color:'#ffcc00',action:()=>{setSelected(acc);setEditForm({...acc});setModal('edit');}},{icon:Trash2,color:'#f87171',action:()=>{setSelected(acc);setModal('delete');}}].map(({icon:Icon,color,action},j)=>(
                    <button key={j} onClick={action} style={{ width:26, height:26, borderRadius:6, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                      <Icon size={12} style={{color}}/>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0&&<div style={{ textAlign:'center', padding:'24px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucun compte</div>}
        </div>
      </div>

      {/* Modal */}
      {modal&&selected&&(
        <DraggableModal onClose={()=>{setModal(null);setSelected(null);setEditForm(null);}} maxWidth={420}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{modal==='view'?'Détails':modal==='edit'?'Modifier':'Supprimer'}</p>
              <button onClick={()=>{setModal(null);setSelected(null);setEditForm(null);}} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>
            {modal==='view'&&(
              <div style={{ padding:20 }}>
                {[['Nom',selected.fullName],['Email',selected.email],['Téléphone',selected.phone],['Entreprise',selected.company||'—'],['Rôle',selected.role],['Date',selected.date]].map(([k,v])=>(
                  <div key={String(k)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span><span style={{ color:'#fff' }}>{String(v)}</span>
                  </div>
                ))}
                <button onClick={()=>{setModal(null);setSelected(null);}} style={{ width:'100%', marginTop:16, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
              </div>
            )}
            {modal==='edit'&&editForm&&(
              <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
                {[{label:'Nom',k:'fullName'},{label:'Email',k:'email'},{label:'Téléphone',k:'phone'},{label:'Entreprise',k:'company'}].map(({label,k})=>(
                  <div key={k}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    <input value={(editForm as any)[k]||''} onChange={e=>setEditForm(f=>f?{...f,[k]:e.target.value}:f)} style={inp}/>
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Rôle</label>
                  <select value={editForm.role} onChange={e=>setEditForm(f=>f?{...f,role:e.target.value}:f)} style={inp}>
                    {ROLES.map(r=><option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={()=>{setModal(null);setSelected(null);setEditForm(null);}} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={()=>{ setAccounts(p=>p.map(a=>a.id===selected.id?editForm!:a)); setModal(null); setSelected(null); setEditForm(null); }} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Check size={13}/>Enregistrer
                  </button>
                </div>
              </div>
            )}
            {modal==='delete'&&(
              <div style={{ padding:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>Supprimer le compte de <strong style={{color:'#fff'}}>{selected.fullName}</strong> ?</p>
                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={()=>{setModal(null);setSelected(null);}} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={()=>{ setAccounts(p=>p.filter(a=>a.id!==selected.id)); setModal(null); setSelected(null); }} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>
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
