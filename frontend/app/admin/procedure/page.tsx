'use client';
import { useState } from 'react';
import { ClipboardList, Plus, AlertTriangle, Users, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import DraggableModal from '../components/DraggableModal';

const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };
const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };

const MOCK_PROCEDURES = [
  { id:'INC-001', name:'Urgence Technique', status:'En cours', assignee:'Sophie Martin', days:3, color:'#ffcc00' },
  { id:'PROC-045', name:'Vente Appartement', status:'Terminé', assignee:'Pierre Dubois', days:1, color:'#00e5a0' },
  { id:'INC-007', name:'Paiement en retard', status:'Retard', assignee:'En attente', days:5, color:'#f87171' },
];

export default function ProcedurePage() {
  const [procedureModal, setProcedureModal] = useState(false);
  const [incidentModal, setIncidentModal] = useState(false);
  const [form, setForm] = useState({ name:'', category:'', description:'', tasks:[] as {name:string;assignee:string;approbateur:string}[] });

  const addTask = () => setForm(f=>({...f, tasks:[...f.tasks,{name:'',assignee:'',approbateur:''}]}));
  const removeTask = (i:number) => setForm(f=>({...f, tasks:f.tasks.filter((_,j)=>j!==i)}));
  const updateTask = (i:number, k:string, v:string) => setForm(f=>({...f, tasks:f.tasks.map((t,j)=>j===i?{...t,[k]:v}:t)}));

  const handleSubmit = (e:React.FormEvent) => { e.preventDefault(); setProcedureModal(false); setForm({name:'',category:'',description:'',tasks:[]}); };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Système</p>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Procédures</h1>
      </div>

      {/* Actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
        {[
          { label:'Nouvelle Procédure', sub:'Créer un workflow', color:'#1a6dff', icon:Plus, action:()=>setProcedureModal(true) },
          { label:'Créer Incident', sub:'Signaler un problème', color:'#f87171', icon:AlertTriangle, action:()=>setIncidentModal(true) },
          { label:'Gestion Assignation', sub:'Voir les assignations', color:'#00e5a0', icon:Users, href:'/admin/procedure/assignation' },
        ].map((btn,i)=>(
          btn.href ? (
            <Link key={i} href={btn.href} style={{ background:'#0d0d14', border:`1px solid ${btn.color}25`, borderRadius:14, padding:'20px 24px', textDecoration:'none', display:'flex', alignItems:'center', gap:14, transition:'border-color 0.15s' }}>
              <div style={{ width:44, height:44, borderRadius:11, background:`${btn.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <btn.icon size={20} style={{ color:btn.color }}/>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{btn.label}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{btn.sub}</p>
              </div>
            </Link>
          ) : (
            <button key={i} onClick={btn.action} style={{ background:'#0d0d14', border:`1px solid ${btn.color}25`, borderRadius:14, padding:'20px 24px', cursor:'pointer', display:'flex', alignItems:'center', gap:14, textAlign:'left' }}>
              <div style={{ width:44, height:44, borderRadius:11, background:`${btn.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <btn.icon size={20} style={{ color:btn.color }}/>
              </div>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{btn.label}</p>
                <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{btn.sub}</p>
              </div>
            </button>
          )
        ))}
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
        {[{label:'Incidents ouverts',value:12,color:'#1a6dff'},{label:'Assignés aujourd\'hui',value:28,color:'#00e5a0'},{label:'En retard',value:3,color:'#f87171'}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px' }}>
            <p style={{ fontSize:28, fontWeight:800, color:s.color, margin:'0 0 4px', fontVariantNumeric:'tabular-nums' }}>{s.value}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Procedures list */}
      <div style={C.card}>
        <p style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:14 }}>Procédures récentes</p>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {MOCK_PROCEDURES.map(p=>(
            <div key={p.id} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', background:'rgba(255,255,255,0.02)', border:'1px solid rgba(255,255,255,0.05)', borderRadius:10 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:9, background:`${p.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <ClipboardList size={16} style={{ color:p.color }}/>
                </div>
                <div>
                  <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{p.id} — {p.name}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{p.assignee} · {p.days} jour(s)</p>
                </div>
              </div>
              <span style={{ background:`${p.color}18`, border:`1px solid ${p.color}40`, borderRadius:6, padding:'2px 10px', fontSize:11, fontWeight:600, color:p.color }}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Procédure */}
      {procedureModal&&(
        <DraggableModal onClose={()=>setProcedureModal(false)} maxWidth={600}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:8 }}><Plus size={16} style={{color:'#1a6dff'}}/>Nouvelle Procédure</p>
              <button onClick={()=>setProcedureModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Nom de la procédure *</label>
                <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Ex: Urgence Technique" required style={inp}/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Catégorie</label>
                  <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} required style={inp}>
                    <option value="">Sélectionner...</option>
                    <option value="Urgence Technique">Urgence Technique</option>
                    <option value="Vente - Paiement">Vente - Paiement</option>
                    <option value="Location - Dossier">Location - Dossier</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Contrat">Contrat</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Description</label>
                  <textarea value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} rows={2} style={{ ...inp, resize:'none' }}/>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase' }}>Tâches du workflow</label>
                  <button type="button" onClick={addTask} style={{ display:'flex', alignItems:'center', gap:5, padding:'6px 12px', borderRadius:7, background:'rgba(0,229,160,0.12)', border:'1px solid rgba(0,229,160,0.25)', color:'#00e5a0', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                    <Plus size={12}/>Ajouter tâche
                  </button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {form.tasks.map((task,i)=>(
                    <div key={i} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'12px 14px' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                        <span style={{ fontSize:12, fontWeight:600, color:'#1a6dff' }}>Tâche {i+1}</span>
                        <button type="button" onClick={()=>removeTask(i)} style={{ background:'none', border:'none', cursor:'pointer', color:'#f87171' }}><Trash2 size={13}/></button>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                        <input value={task.name} onChange={e=>updateTask(i,'name',e.target.value)} placeholder="Nom tâche" style={inp}/>
                        <select value={task.assignee} onChange={e=>updateTask(i,'assignee',e.target.value)} style={inp}>
                          <option value="">Assigné à</option>
                          <option>Admin Principal</option><option>Sophie Martin</option><option>Pierre Dubois</option>
                        </select>
                        <select value={task.approbateur} onChange={e=>updateTask(i,'approbateur',e.target.value)} style={inp}>
                          <option value="">Approbateur</option>
                          <option>Admin Principal</option><option>Super Admin</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button type="submit" style={{ padding:'11px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <ClipboardList size={14}/>Créer & Lancer Procédure
              </button>
            </form>
        </DraggableModal>
      )}

      {/* Modal Incident */}
      {incidentModal&&(
        <DraggableModal onClose={()=>setIncidentModal(false)} maxWidth={480}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:8 }}><AlertTriangle size={16} style={{color:'#f87171'}}/>Créer Incident</p>
              <button onClick={()=>setIncidentModal(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', position:'relative', zIndex:30 }}><X size={18}/></button>
            </div>
            <div style={{ padding:20, display:'flex', flexDirection:'column', gap:12 }}>
              <textarea placeholder="Description complète de l'incident..." rows={4} style={{ ...inp, resize:'none' }}/>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <select style={inp}><option>Urgence</option><option>Technique</option></select>
                <select style={inp}><option>Approbateur 1</option><option>Super Admin</option></select>
              </div>
              <button onClick={()=>setIncidentModal(false)} style={{ padding:'11px', borderRadius:8, background:'linear-gradient(135deg,#f87171,#dc2626)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
                <AlertTriangle size={14}/>Créer & Lancer Workflow
              </button>
            </div>
        </DraggableModal>
      )}
    </div>
  );
}
