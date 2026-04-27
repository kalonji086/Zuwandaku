'use client';
import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Search, MapPin, DollarSign, Grid3x3, X, Check } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

const PARCELLES = [
  { id:'PC001', name:'Parcelle Gombe Centre', location:'Gombe', price:'$35,000', size:'500m²', type:'RESIDENTIAL', status:'FOR_SALE', owner:'Jean Dupont', zoning:'Zone résidentielle' },
  { id:'PC002', name:'Terrain Lingwala', location:'Lingwala', price:'$25,000', size:'350m²', type:'COMMERCIAL', status:'FOR_SALE', owner:'Marie Kabila', zoning:'Zone commerciale' },
  { id:'PC003', name:'Parcelle Ngaliema', location:'Ngaliema', price:'$18,000', size:'300m²', type:'INDUSTRIAL', status:'SOLD', owner:'Pierre Mbutu', zoning:'Zone industrielle' },
  { id:'PC004', name:'Terrain Kalamu Premium', location:'Kalamu', price:'$55,000', size:'800m²', type:'RESIDENTIAL', status:'FOR_SALE', owner:'Sophie Martin', zoning:'Zone résidentielle premium' },
];

const STATUS_COLOR: Record<string,string> = { FOR_SALE:'#00e5a0', SOLD:'#666', RESERVED:'#1a6dff' };
const STATUS_LABEL: Record<string,string> = { FOR_SALE:'À vendre', SOLD:'Vendu', RESERVED:'Réservé' };
const TYPE_LABEL: Record<string,string> = { RESIDENTIAL:'Résidentiel', COMMERCIAL:'Commercial', INDUSTRIAL:'Industriel', MIXED:'Mixte' };

const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };

export default function GestionParcellesPage() {
  const [parcelles, setParcelles] = useState(PARCELLES);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [modal, setModal] = useState<'view'|'edit'|'delete'|'add'|null>(null);
  const [selected, setSelected] = useState<typeof PARCELLES[0]|null>(null);
  const [form, setForm] = useState<any>(null);
  const [toast, setToast] = useState('');

  const showToast = (msg:string) => { setToast(msg); setTimeout(()=>setToast(''),3000); };
  const close = () => { setModal(null); setSelected(null); setForm(null); };

  const filtered = parcelles.filter(p=>`${p.name} ${p.owner}`.toLowerCase().includes(search.toLowerCase())&&(filterStatus==='ALL'||p.status===filterStatus));

  const handleSave = () => {
    if (modal==='add') { setParcelles(p=>[{...form, id:`PC${String(p.length+1).padStart(3,'0')}`},...p]); showToast('Parcelle ajoutée'); }
    else { setParcelles(p=>p.map(x=>x.id===selected?.id?{...x,...form}:x)); showToast('Parcelle modifiée'); }
    close();
  };
  const handleDelete = () => { setParcelles(p=>p.filter(x=>x.id!==selected?.id)); showToast('Parcelle supprimée'); close(); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast&&<div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>{toast}</div>}

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Gestion</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Parcelles</h1>
        </div>
        <button onClick={()=>{setForm({name:'',location:'Gombe',price:'',size:'',type:'RESIDENTIAL',status:'FOR_SALE',owner:'',zoning:''});setModal('add');}} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14}/>Ajouter
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[{label:'Total',value:parcelles.length,color:'#1a6dff'},{label:'À vendre',value:parcelles.filter(p=>p.status==='FOR_SALE').length,color:'#00e5a0'},{label:'Vendues',value:parcelles.filter(p=>p.status==='SOLD').length,color:'#7b61ff'},{label:'Réservées',value:parcelles.filter(p=>p.status==='RESERVED').length,color:'#ffcc00'}].map(s=>(
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
          <option value="ALL">Tous statuts</option><option value="FOR_SALE">À vendre</option><option value="SOLD">Vendu</option><option value="RESERVED">Réservé</option>
        </select>
      </div>

      {/* Grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:16 }}>
        {filtered.map(p=>(
          <div key={p.id} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, overflow:'hidden' }}>
            <div style={{ height:120, background:'linear-gradient(135deg,#0a0a14,#111118)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Grid3x3 size={40} style={{ color:'rgba(255,255,255,0.1)' }}/>
            </div>
            <div style={{ padding:'14px 16px' }}>
              <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:'0 0 4px' }}>{p.name}</p>
              <div style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'rgba(255,255,255,0.35)', marginBottom:12 }}>
                <MapPin size={11}/>{p.location}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:12 }}>
                {[{label:'Taille',value:p.size},{label:'Type',value:TYPE_LABEL[p.type]},{label:'Zone',value:p.zoning,col:2}].map(({label,value,col})=>(
                  <div key={label} style={{ background:'rgba(255,255,255,0.03)', borderRadius:6, padding:'6px 8px', gridColumn:col?`span ${col}`:undefined }}>
                    <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:'0 0 2px' }}>{label}</p>
                    <p style={{ fontSize:12, fontWeight:600, color:'#fff', margin:0 }}>{value}</p>
                  </div>
                ))}
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12, paddingTop:10, borderTop:'1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize:13, fontWeight:700, color:'#00e5a0', display:'flex', alignItems:'center', gap:4 }}><DollarSign size={12}/>{p.price}</span>
                <span style={{ background:`${STATUS_COLOR[p.status]||'#666'}18`, border:`1px solid ${STATUS_COLOR[p.status]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:STATUS_COLOR[p.status]||'#aaa' }}>{STATUS_LABEL[p.status]||p.status}</span>
              </div>
              <div style={{ display:'flex', gap:6 }}>
                {[{label:'Voir',color:'#1a6dff',action:()=>{setSelected(p);setModal('view');}},{label:'Modifier',color:'#ffcc00',action:()=>{setSelected(p);setForm({...p});setModal('edit');}},{label:'Supprimer',color:'#f87171',action:()=>{setSelected(p);setModal('delete');}}].map(({label,color,action})=>(
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
                {[['Nom',selected.name],['Localisation',selected.location],['Prix',selected.price],['Taille',selected.size],['Type',TYPE_LABEL[selected.type]],['Zone',selected.zoning],['Propriétaire',selected.owner],['Statut',STATUS_LABEL[selected.status]]].map(([k,v])=>(
                  <div key={String(k)} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:13 }}>
                    <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span><span style={{ color:'#fff' }}>{String(v)}</span>
                  </div>
                ))}
                <button onClick={close} style={{ width:'100%', marginTop:16, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
              </div>
            )}
            {(modal==='add'||modal==='edit')&&form&&(
              <div style={{ padding:20, display:'flex', flexDirection:'column', gap:10 }}>
                {[{label:'Nom',k:'name'},{label:'Localisation',k:'location'},{label:'Prix',k:'price'},{label:'Taille',k:'size'},{label:'Zone',k:'zoning'},{label:'Propriétaire',k:'owner'}].map(({label,k})=>(
                  <div key={k}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    <input value={form[k]||''} onChange={e=>setForm((f:any)=>({...f,[k]:e.target.value}))} style={inp}/>
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                  <div>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Type</label>
                    <select value={form.type||'RESIDENTIAL'} onChange={e=>setForm((f:any)=>({...f,type:e.target.value}))} style={inp}>
                      <option value="RESIDENTIAL">Résidentiel</option><option value="COMMERCIAL">Commercial</option><option value="INDUSTRIAL">Industriel</option><option value="MIXED">Mixte</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Statut</label>
                    <select value={form.status||'FOR_SALE'} onChange={e=>setForm((f:any)=>({...f,status:e.target.value}))} style={inp}>
                      <option value="FOR_SALE">À vendre</option><option value="SOLD">Vendu</option><option value="RESERVED">Réservé</option>
                    </select>
                  </div>
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
