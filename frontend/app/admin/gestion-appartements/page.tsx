'use client';
import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, Filter, MapPin, DollarSign, Boxes, X, Check } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

const APARTMENTS = [
  { id:'AP001', name:'Appart Luxe Gombe', location:'Gombe', price:'$1500/mois', rooms:3, bathrooms:2, sqm:120, status:'AVAILABLE', owner:'Jean Dupont', amenities:'WiFi, Clim, Cuisine' },
  { id:'AP002', name:'Studio Lingwala', location:'Lingwala', price:'$600/mois', rooms:1, bathrooms:1, sqm:45, status:'RENTED', owner:'Marie Kabila', amenities:'WiFi, Eau chaude' },
  { id:'AP003', name:'T2 Ngaliema', location:'Ngaliema', price:'$900/mois', rooms:2, bathrooms:1, sqm:75, status:'AVAILABLE', owner:'Pierre Mbutu', amenities:'Clim, Balcon' },
  { id:'AP004', name:'Penthouse Kinshasa', location:'Kinshasa', price:'$2500/mois', rooms:4, bathrooms:3, sqm:200, status:'RENTED', owner:'Sophie Martin', amenities:'Gym, Piscine, Parking' },
];

const STATUS_COLOR: Record<string,string> = { AVAILABLE:'#00e5a0', RENTED:'#1a6dff', MAINTENANCE:'#ffcc00' };
const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };

export default function GestionAppartementsPage() {
  const [apts, setApts] = useState(APARTMENTS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modal, setModal] = useState<'view'|'edit'|'delete'|'add'|null>(null);
  const [selected, setSelected] = useState<typeof APARTMENTS[0]|null>(null);
  const [form, setForm] = useState<any>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),3000); };
  const close = () => { setModal(null); setSelected(null); setForm(null); };

  const filtered = apts.filter(a=>`${a.name} ${a.owner}`.toLowerCase().includes(search.toLowerCase())&&(filterStatus==='ALL'||a.status===filterStatus));

  const handleSave = () => {
    if (modal==='add') { setApts(p=>[{...form, id:`AP${String(p.length+1).padStart(3,'0')}`},...p]); showToast('Appartement ajouté'); }
    else { setApts(p=>p.map(a=>a.id===selected?.id?{...a,...form}:a)); showToast('Appartement modifié'); }
    close();
  };
  const handleDelete = () => { setApts(p=>p.filter(a=>a.id!==selected?.id)); showToast('Appartement supprimé'); close(); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Gestion</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Appartements</h1>
        </div>
        <button onClick={()=>{setForm({name:'',location:'Gombe',price:'',rooms:1,bathrooms:1,sqm:0,status:'AVAILABLE',owner:'',amenities:''});setModal('add');}} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14}/>Ajouter
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[{label:'Total',value:apts.length,color:'#1a6dff'},{label:'Disponibles',value:apts.filter(a=>a.status==='AVAILABLE').length,color:'#00e5a0'},{label:'Loués',value:apts.filter(a=>a.status==='RENTED').length,color:'#7b61ff'},{label:'Maintenance',value:apts.filter(a=>a.status==='MAINTENANCE').length,color:'#ffcc00'}].map(s=>(
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
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none' }}>
          <option value="ALL">Tous statuts</option><option value="AVAILABLE">Disponible</option><option value="RENTED">Loué</option><option value="MAINTENANCE">Maintenance</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {filtered.map(apt=>(
          <div key={apt.id} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
            <div style={{ height:120, background:'linear-gradient(135deg,#0a0a14,#111118)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Boxes size={40} style={{ color:'rgba(255,255,255,0.1)' }}/>
            </div>
            <div style={{ padding:'14px 16px' }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>{apt.name}</p>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:12 }}>
                <MapPin size={11}/>{apt.location}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
                {[{label:'Chambres',value:apt.rooms},{label:'SDB',value:apt.bathrooms},{label:'Surface',value:`${apt.sqm} m²`,col:2}].map(({label,value,col})=>(
                  <div key={label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:6, padding:'6px 8px', gridColumn:col?`span ${col}`:undefined }}>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:'0 0 2px' }}>{label}</p>
                    <p style={{ fontSize:12, fontWeight:600, color:'#fff', margin:0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#00e5a0', display:'flex', alignItems:'center', gap:4 }}><DollarSign size={12}/>{apt.price}</span>
                <span style={{ background:`${STATUS_COLOR[apt.status]||'#666'}18`, border:`1px solid ${STATUS_COLOR[apt.status]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:STATUS_COLOR[apt.status]||'#aaa' }}>{apt.status}</span>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {[{label:'Voir',color:'#1a6dff',action:()=>{setSelected(apt);setModal('view');}},{label:'Modifier',color:'#ffcc00',action:()=>{setSelected(apt);setForm({...apt});setModal('edit');}},{label:'Supprimer',color:'#f87171',action:()=>{setSelected(apt);setModal('delete');}}].map(({label,color,action})=>(
                  <button key={label} onClick={action} style={{ flex:1, padding:'6px', borderRadius:7, background:`${color}12`, border:`1px solid ${color}25`, color, fontSize:11, fontWeight:600, cursor:'pointer' }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal&&(
        <DraggableModal onClose={close} maxWidth={480}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>{modal==='view'?'Détails':modal==='add'?'Ajouter':modal==='edit'?'Modifier':'Supprimer'}</p>
              <button onClick={close} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>
            {modal==='view'&&selected&&(
              <div style={{ padding:20 }}>
                {[['Nom',selected.name],['Localisation',selected.location],['Prix',selected.price],['Chambres',selected.rooms],['SDB',selected.bathrooms],['Surface',`${selected.sqm} m²`],['Propriétaire',selected.owner],['Commodités',selected.amenities]].map(([k,v])=>(
                  <div key={String(k)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span><span style={{ color:'#fff' }}>{String(v)}</span>
                  </div>
                ))}
                <button onClick={close} style={{ width:'100%', marginTop:16, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
              </div>
            )}
            {(modal==='add'||modal==='edit')&&form&&(
              <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
                {[{label:'Nom',k:'name'},{label:'Localisation',k:'location'},{label:'Prix',k:'price'},{label:'Propriétaire',k:'owner'},{label:'Commodités',k:'amenities'}].map(({label,k})=>(
                  <div key={k}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    <input value={form[k]||''} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.value}))} style={inp}/>
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                  {[{label:'Chambres',k:'rooms'},{label:'SDB',k:'bathrooms'},{label:'Surface m²',k:'sqm'}].map(({label,k})=>(
                    <div key={k}>
                      <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                      <input type="number" value={form[k]||0} onChange={e=>setForm((f:any)=>({...f,[k]:+e.target.value}))} style={inp}/>
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Statut</label>
                  <select value={form.status||'AVAILABLE'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))} style={inp}>
                    <option value="AVAILABLE">Disponible</option><option value="RENTED">Loué</option><option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={close} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                  <button onClick={handleSave} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Check size={13}/>{modal==='add'?'Ajouter':'Sauvegarder'}
                  </button>
                </div>
              </div>
            )}
            {modal==='delete'&&selected&&(
              <div style={{ padding:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>Supprimer <strong style={{color:'#fff'}}>{selected.name}</strong> ?</p>
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
