'use client';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, Filter, Home, MapPin, X, Save, AlertTriangle } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

type Property = { id:string; type:string; commune:string; quartier:string; price:number; currency:string; status:string; owner:string; surface:number; description:string; createdAt:string };

const INIT: Property[] = [
  { id:'P001', type:'MAISON', commune:'Gombe', quartier:'Socimat', price:1200, currency:'USD', status:'AVAILABLE', owner:'Jean Mukendi', surface:180, description:'Belle maison avec jardin, 4 chambres.', createdAt:'2025-01-10' },
  { id:'P002', type:'APPARTEMENT', commune:'Lingwala', quartier:'Kintambo', price:800, currency:'USD', status:'RENTED', owner:'Marie Kabila', surface:90, description:'Appartement moderne au 3ème étage.', createdAt:'2025-01-15' },
  { id:'P003', type:'PARCELLE', commune:'Ngaliema', quartier:'Binza', price:45000, currency:'USD', status:'AVAILABLE', owner:'Paul Lumumba', surface:500, description:'Grande parcelle viabilisée.', createdAt:'2025-02-01' },
  { id:'P004', type:'BUREAU', commune:'Kinshasa', quartier:'Centre-ville', price:2500, currency:'USD', status:'RESERVED', owner:'Sophie Tshisekedi', surface:120, description:'Bureau climatisé, parking inclus.', createdAt:'2025-02-10' },
  { id:'P005', type:'MAISON', commune:'Kalamu', quartier:'Matonge', price:600, currency:'USD', status:'AVAILABLE', owner:'David Mobutu', surface:140, description:'Maison familiale, quartier calme.', createdAt:'2025-02-20' },
];

const EMPTY: Omit<Property,'id'|'createdAt'> = { type:'MAISON', commune:'', quartier:'', price:0, currency:'USD', status:'AVAILABLE', owner:'', surface:0, description:'' };

const STATUS_COLOR: Record<string,string> = { AVAILABLE:'#00e5a0', RENTED:'#1a6dff', SOLD:'#666', RESERVED:'#ffcc00' };
const TYPE_COLOR: Record<string,string> = { MAISON:'#1a6dff', APPARTEMENT:'#7b61ff', PARCELLE:'#00c2ff', BUREAU:'#ff6b35' };

const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function ProprietesPage() {
  const [data, setData] = useState<Property[]>(INIT);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [modal, setModal] = useState<'add'|'view'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Property|null>(null);
  const [form, setForm] = useState<Omit<Property,'id'|'createdAt'>>(EMPTY);
  const [toast, setToast] = useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),3000); };
  const close = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleAdd = () => {
    if (!form.commune||!form.owner) return;
    setData(p=>[{...form, id:`P${String(p.length+1).padStart(3,'0')}`, createdAt:new Date().toISOString().split('T')[0]},...p]);
    showToast('Propriété ajoutée'); close();
  };
  const handleEdit = () => {
    if (!selected) return;
    setData(p=>p.map(x=>x.id===selected.id?{...x,...form}:x));
    showToast('Propriété modifiée'); close();
  };
  const handleDelete = () => {
    if (!selected) return;
    setData(p=>p.filter(x=>x.id!==selected.id));
    showToast('Propriété supprimée'); close();
  };

  const filtered = data.filter(p=>`${p.commune} ${p.quartier} ${p.owner} ${p.type}`.toLowerCase().includes(search.toLowerCase())&&(filterStatus==='ALL'||p.status===filterStatus)&&(filterType==='ALL'||p.type===filterType));

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Gestion</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Propriétés</h1>
        </div>
        <button onClick={()=>{setForm(EMPTY);setModal('add');}} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14}/>Ajouter
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[{label:'Total',value:data.length,color:'#1a6dff'},{label:'Disponibles',value:data.filter(p=>p.status==='AVAILABLE').length,color:'#00e5a0'},{label:'Loués',value:data.filter(p=>p.status==='RENTED').length,color:'#7b61ff'},{label:'Réservés',value:data.filter(p=>p.status==='RESERVED').length,color:'#ffcc00'}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px' }}>
            <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 2px', fontVariantNumeric:'tabular-nums' }}>{s.value}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10 }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0 12px' }}>
          <Search size={14} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, padding:'9px 0' }}/>
        </div>
        {[{val:filterStatus,set:setFilterStatus,opts:[['ALL','Tous statuts'],['AVAILABLE','Disponible'],['RENTED','Loué'],['SOLD','Vendu'],['RESERVED','Réservé']]},{val:filterType,set:setFilterType,opts:[['ALL','Tous types'],['MAISON','Maison'],['APPARTEMENT','Appartement'],['PARCELLE','Parcelle'],['BUREAU','Bureau']]}].map((f,i)=>(
          <select key={i} value={f.val} onChange={e=>f.set(e.target.value)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none' }}>
            {f.opts.map(([v,l])=><option key={v} value={v}>{l}</option>)}
          </select>
        ))}
      </div>

      {/* Table */}
      <div style={C.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['ID','Type','Localisation','Surface','Prix','Propriétaire','Statut','Date','Actions'].map(h=>(
                <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((p,i)=>(
                <tr key={p.id} style={{ background:i%2?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'12px 14px', fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{p.id}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:`${TYPE_COLOR[p.type]||'#666'}18`, border:`1px solid ${TYPE_COLOR[p.type]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:TYPE_COLOR[p.type]||'#aaa' }}>{p.type}</span>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:13, color:'#fff', fontWeight:500 }}><MapPin size={11} style={{color:'rgba(255,255,255,0.3)'}}/>{p.commune}</div>
                    <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)' }}>{p.quartier}</div>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{p.surface} m²</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#1a6dff', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>${p.price.toLocaleString()}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{p.owner}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:`${STATUS_COLOR[p.status]||'#666'}18`, border:`1px solid ${STATUS_COLOR[p.status]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:STATUS_COLOR[p.status]||'#aaa' }}>{p.status}</span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:11, color:'rgba(255,255,255,0.25)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{p.createdAt}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      {[{icon:Eye,color:'#1a6dff',action:()=>{setSelected(p);setModal('view');}},{icon:Pencil,color:'#ffcc00',action:()=>{setSelected(p);setForm({type:p.type,commune:p.commune,quartier:p.quartier,price:p.price,currency:p.currency,status:p.status,owner:p.owner,surface:p.surface,description:p.description});setModal('edit');}},{icon:Trash2,color:'#f87171',action:()=>{setSelected(p);setModal('delete');}}].map(({icon:Icon,color,action},j)=>(
                        <button key={j} onClick={action} style={{ width:28, height:28, borderRadius:6, background:`${color}15`, border:`1px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                          <Icon size={13} style={{color}}/>
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucune propriété trouvée</div>}
        </div>
      </div>

      {/* Modal */}
      {modal&&(
        <DraggableModal onClose={close} maxWidth={520}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>
                {modal==='view'?`Détails — ${selected?.id}`:modal==='add'?'Ajouter propriété':modal==='edit'?`Modifier — ${selected?.id}`:'Supprimer'}
              </p>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>

            {modal==='view'&&selected&&(
              <div style={{ padding:20 }}>
                {[['Type',<span style={{ background:`${TYPE_COLOR[selected.type]}18`, border:`1px solid ${TYPE_COLOR[selected.type]}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:TYPE_COLOR[selected.type] }}>{selected.type}</span>],['Commune',selected.commune],['Quartier',selected.quartier],['Surface',`${selected.surface} m²`],['Prix',`$${selected.price.toLocaleString()} ${selected.currency}`],['Propriétaire',selected.owner],['Statut',selected.status],['Date',selected.createdAt]].map(([k,v])=>(
                  <div key={String(k)} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span>
                    <span style={{ color:'#fff' }}>{v as any}</span>
                  </div>
                ))}
                {selected.description&&<p style={{ marginTop:12, fontSize:12, color:'rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'10px 12px' }}>{selected.description}</p>}
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <button onClick={()=>{close();setSelected(selected);setForm({type:selected.type,commune:selected.commune,quartier:selected.quartier,price:selected.price,currency:selected.currency,status:selected.status,owner:selected.owner,surface:selected.surface,description:selected.description});setModal('edit');}} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,204,0,0.12)', border:'1px solid rgba(255,204,0,0.3)', color:'#ffcc00', fontSize:13, fontWeight:600, cursor:'pointer' }}>Éditer</button>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
                </div>
              </div>
            )}

            {(modal==='add'||modal==='edit')&&(
              <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[{label:'Type',k:'type',type:'select',opts:['MAISON','APPARTEMENT','PARCELLE','BUREAU']},{label:'Statut',k:'status',type:'select',opts:['AVAILABLE','RENTED','SOLD','RESERVED']},{label:'Commune *',k:'commune'},{label:'Quartier',k:'quartier'},{label:'Prix *',k:'price',type:'number'},{label:'Devise',k:'currency',type:'select',opts:['USD','CDF']},{label:'Surface (m²)',k:'surface',type:'number'},{label:'Propriétaire *',k:'owner'}].map(({label,k,type,opts})=>(
                  <div key={k}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    {type==='select'?<select value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} style={inp}>{opts!.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={type||'text'} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:type==='number'?+e.target.value:e.target.value}))} style={inp}/>}
                  </div>
                ))}
                <div style={{ gridColumn:'span 2' }}>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Description</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={3} style={{ ...inp, resize:'none' }}/>
                </div>
                <div style={{ gridColumn:'span 2', display:'flex', gap:10 }}>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={modal==='add'?handleAdd:handleEdit} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Save size={13}/>{modal==='add'?'Ajouter':'Sauvegarder'}
                  </button>
                </div>
              </div>
            )}

            {modal==='delete'&&selected&&(
              <div style={{ padding:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>Supprimer <strong style={{color:'#fff'}}>{selected.type} — {selected.commune}</strong> ?</p>
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
