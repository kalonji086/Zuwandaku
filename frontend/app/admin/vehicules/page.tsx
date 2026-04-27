'use client';
import { useState } from 'react';
import { Search, Plus, Eye, Pencil, Trash2, Filter, Car, X, Save, AlertTriangle } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

type Vehicle = { id:string; marque:string; modele:string; annee:number; type:string; pricePerDay:number|null; priceSale:number|null; commune:string; owner:string; available:boolean; description:string; createdAt:string };

const INIT: Vehicle[] = [
  { id:'V001', marque:'Toyota', modele:'Hilux', annee:2022, type:'LOCATION', pricePerDay:80, priceSale:null, commune:'Gombe', owner:'Jean Mukendi', available:true, description:'Toyota Hilux double cabine, climatisé, GPS.', createdAt:'2025-01-12' },
  { id:'V002', marque:'Mercedes', modele:'Sprinter', annee:2021, type:'VENTE', pricePerDay:null, priceSale:35000, commune:'Lingwala', owner:'Marie Kabila', available:true, description:'Mercedes Sprinter 20 places, parfait état.', createdAt:'2025-01-20' },
  { id:'V003', marque:'Land Rover', modele:'Defender', annee:2023, type:'LOCATION', pricePerDay:150, priceSale:null, commune:'Ngaliema', owner:'Paul Lumumba', available:false, description:'Land Rover Defender 4x4.', createdAt:'2025-02-05' },
  { id:'V004', marque:'Mitsubishi', modele:'Pajero', annee:2020, type:'VENTE', pricePerDay:null, priceSale:28000, commune:'Kalamu', owner:'Sophie Tshisekedi', available:true, description:'Mitsubishi Pajero V6, 7 places.', createdAt:'2025-02-15' },
];

const EMPTY = { marque:'', modele:'', annee:new Date().getFullYear(), type:'LOCATION', pricePerDay:0 as number|null, priceSale:null as number|null, commune:'', owner:'', available:true, description:'' };

const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function VehiculesPage() {
  const [data, setData] = useState<Vehicle[]>(INIT);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [filterAvail, setFilterAvail] = useState('ALL');
  const [modal, setModal] = useState<'add'|'view'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Vehicle|null>(null);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [toast, setToast] = useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),3000); };
  const close = () => { setModal(null); setSelected(null); setForm(EMPTY); };

  const handleAdd = () => {
    if (!form.marque||!form.modele||!form.owner) return;
    setData(p=>[{...form, id:`V${String(p.length+1).padStart(3,'0')}`, createdAt:new Date().toISOString().split('T')[0]},...p]);
    showToast('Véhicule ajouté'); close();
  };
  const handleEdit = () => {
    if (!selected) return;
    setData(p=>p.map(v=>v.id===selected.id?{...v,...form}:v));
    showToast('Véhicule modifié'); close();
  };
  const handleDelete = () => {
    if (!selected) return;
    setData(p=>p.filter(v=>v.id!==selected.id));
    showToast('Véhicule supprimé'); close();
  };

  const filtered = data.filter(v=>`${v.marque} ${v.modele} ${v.commune} ${v.owner}`.toLowerCase().includes(search.toLowerCase())&&(filterType==='ALL'||v.type===filterType)&&(filterAvail==='ALL'||(filterAvail==='YES'?v.available:!v.available)));

  const priceLabel = (v:Vehicle) => v.type==='LOCATION'?`$${v.pricePerDay}/jour`:`$${v.priceSale?.toLocaleString()}`;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Gestion</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Véhicules</h1>
        </div>
        <button onClick={()=>{setForm(EMPTY);setModal('add');}} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14}/>Ajouter
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[{label:'Total',value:data.length,color:'#1a6dff'},{label:'Location',value:data.filter(v=>v.type==='LOCATION').length,color:'#00c2ff'},{label:'Vente',value:data.filter(v=>v.type==='VENTE').length,color:'#7b61ff'},{label:'Disponibles',value:data.filter(v=>v.available).length,color:'#00e5a0'}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px' }}>
            <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 2px' }}>{s.value}</p>
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
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none' }}>
          <option value="ALL">Tous types</option><option value="LOCATION">Location</option><option value="VENTE">Vente</option>
        </select>
        <select value={filterAvail} onChange={e=>setFilterAvail(e.target.value)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none' }}>
          <option value="ALL">Disponibilité</option><option value="YES">Disponible</option><option value="NO">Indisponible</option>
        </select>
      </div>

      {/* Table */}
      <div style={C.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['ID','Véhicule','Année','Type','Prix','Commune','Propriétaire','Dispo','Date','Actions'].map(h=>(
                <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {filtered.map((v,i)=>(
                <tr key={v.id} style={{ background:i%2?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'12px 14px', fontSize:11, color:'rgba(255,255,255,0.3)', fontFamily:'monospace', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{v.id}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:600, color:'#fff', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{v.marque} {v.modele}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{v.annee}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:v.type==='LOCATION'?'rgba(26,109,255,0.15)':'rgba(0,229,160,0.15)', border:`1px solid ${v.type==='LOCATION'?'rgba(26,109,255,0.3)':'rgba(0,229,160,0.3)'}`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:v.type==='LOCATION'?'#1a6dff':'#00e5a0' }}>{v.type}</span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:13, fontWeight:700, color:'#1a6dff', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{priceLabel(v)}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{v.commune}</td>
                  <td style={{ padding:'12px 14px', fontSize:13, color:'rgba(255,255,255,0.5)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{v.owner}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:v.available?'rgba(0,229,160,0.12)':'rgba(248,113,113,0.12)', border:`1px solid ${v.available?'rgba(0,229,160,0.3)':'rgba(248,113,113,0.3)'}`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:v.available?'#00e5a0':'#f87171' }}>{v.available?'Oui':'Non'}</span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:11, color:'rgba(255,255,255,0.25)', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{v.createdAt}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      {[{icon:Eye,color:'#1a6dff',action:()=>{setSelected(v);setModal('view');}},{icon:Pencil,color:'#ffcc00',action:()=>{setSelected(v);setForm({marque:v.marque,modele:v.modele,annee:v.annee,type:v.type,pricePerDay:v.pricePerDay,priceSale:v.priceSale,commune:v.commune,owner:v.owner,available:v.available,description:v.description});setModal('edit');}},{icon:Trash2,color:'#f87171',action:()=>{setSelected(v);setModal('delete');}}].map(({icon:Icon,color,action},j)=>(
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
          {filtered.length===0&&<div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucun véhicule trouvé</div>}
        </div>
      </div>

      {/* Modal */}
      {modal&&(
        <DraggableModal onClose={close} maxWidth={520}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>
                {modal==='view'?`Détails — ${selected?.id}`:modal==='add'?'Ajouter véhicule':modal==='edit'?`Modifier — ${selected?.id}`:'Supprimer'}
              </p>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>

            {modal==='view'&&selected&&(
              <div style={{ padding:20 }}>
                {[['Véhicule',`${selected.marque} ${selected.modele}`],['Année',selected.annee],['Type',selected.type],['Prix',priceLabel(selected)],['Commune',selected.commune],['Propriétaire',selected.owner],['Disponible',selected.available?'✅ Oui':'❌ Non'],['Date',selected.createdAt]].map(([k,v])=>(
                  <div key={String(k)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span>
                    <span style={{ color:'#fff' }}>{String(v)}</span>
                  </div>
                ))}
                {selected.description&&<p style={{ marginTop:12, fontSize:12, color:'rgba(255,255,255,0.4)', background:'rgba(255,255,255,0.03)', borderRadius:8, padding:'10px 12px' }}>{selected.description}</p>}
                <div style={{ display:'flex', gap:10, marginTop:16 }}>
                  <button onClick={()=>{close();setSelected(selected);setForm({marque:selected.marque,modele:selected.modele,annee:selected.annee,type:selected.type,pricePerDay:selected.pricePerDay,priceSale:selected.priceSale,commune:selected.commune,owner:selected.owner,available:selected.available,description:selected.description});setModal('edit');}} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,204,0,0.12)', border:'1px solid rgba(255,204,0,0.3)', color:'#ffcc00', fontSize:13, fontWeight:600, cursor:'pointer' }}>Éditer</button>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
                </div>
              </div>
            )}

            {(modal==='add'||modal==='edit')&&(
              <div style={{ padding:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                {[{label:'Marque *',k:'marque'},{label:'Modèle *',k:'modele'},{label:'Année',k:'annee',type:'number'},{label:'Type',k:'type',type:'select',opts:['LOCATION','VENTE']}].map(({label,k,type,opts})=>(
                  <div key={k}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    {type==='select'?<select value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value,pricePerDay:e.target.value==='LOCATION'?0:null,priceSale:e.target.value==='VENTE'?0:null}))} style={inp}>{opts!.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input type={type||'text'} value={(form as any)[k]} onChange={e=>setForm(f=>({...f,[k]:type==='number'?+e.target.value:e.target.value}))} style={inp}/>}
                  </div>
                ))}
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{form.type==='LOCATION'?'Prix/jour ($)':'Prix vente ($)'}</label>
                  <input type="number" value={form.type==='LOCATION'?(form.pricePerDay??0):(form.priceSale??0)} onChange={e=>setForm(f=>({...f,pricePerDay:f.type==='LOCATION'?+e.target.value:null,priceSale:f.type==='VENTE'?+e.target.value:null}))} style={inp}/>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Commune</label>
                  <input value={form.commune} onChange={e=>setForm(f=>({...f,commune:e.target.value}))} style={inp}/>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Propriétaire *</label>
                  <input value={form.owner} onChange={e=>setForm(f=>({...f,owner:e.target.value}))} style={inp}/>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Disponible</label>
                  <select value={form.available?'true':'false'} onChange={e=>setForm(f=>({...f,available:e.target.value==='true'}))} style={inp}>
                    <option value="true">Oui</option><option value="false">Non</option>
                  </select>
                </div>
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
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:14 }}>Supprimer <strong style={{color:'#fff'}}>{selected.marque} {selected.modele}</strong> ?</p>
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
