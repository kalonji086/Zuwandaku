'use client';
import { useState } from 'react';
import { MessageCircle, Trash2, ChevronLeft, Check, Plus, Edit, UserCheck, GripVertical, ShieldAlert, X } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';

type Priority = 'HIGH'|'MEDIUM'|'LOW';
type Status = 'open'|'in_progress'|'waiting_approval'|'approved'|'rejected';
type Task = { id:string; title:string; description:string; completed:boolean; comment:string; assignedTo?:string };
type Procedure = { id:string; name:string; tasks:Task[]; status:Status };
type Ticket = { id:string; user:string; email:string; subject:string; priority:Priority; status:Status; procedure?:Procedure };

const MOCK_TICKETS: Ticket[] = [
  { id:'#HD-001', user:'Jean Dupont', email:'jean@email.com', subject:'Problème publication bien', priority:'HIGH', status:'open' },
  { id:'#HD-002', user:'Marie Kabila', email:'marie@example.com', subject:'Question paiement', priority:'MEDIUM', status:'waiting_approval',
    procedure:{ id:'proc1', name:'Vérification paiement', status:'waiting_approval', tasks:[
      { id:'t1', title:'Vérifier compte bancaire', description:'Contrôler infos bancaires', completed:true, comment:'Vérifié OK', assignedTo:'Sophie Martin' },
      { id:'t2', title:'Contacter banque', description:'Appeler confirmation', completed:true, comment:'Confirmé', assignedTo:'Sophie Martin' },
      { id:'t3', title:'Mettre à jour statut', description:'Changer validé', completed:false, comment:'', assignedTo:undefined },
    ]}
  },
];

const AGENTS = ['Sophie Martin','Pierre Dubois','Admin Principal'];
const APPROVERS = ['Approbateur 1','Approbateur 2','Super Admin'];

const PRIORITY_COLOR: Record<Priority,string> = { HIGH:'#f87171', MEDIUM:'#ffcc00', LOW:'#00e5a0' };
const STATUS_COLOR: Record<string,string> = { open:'#1a6dff', in_progress:'#7b61ff', waiting_approval:'#ffcc00', approved:'#00e5a0', rejected:'#f87171' };

const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function SupportsPage() {
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [activeModal, setActiveModal] = useState<'none'|'procedure'|'approval'>('none');
  const [selectedTicket, setSelectedTicket] = useState<Ticket|null>(null);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure|null>(null);
  const [selectedApprovers, setSelectedApprovers] = useState<string[]>([]);

  const close = () => { setActiveModal('none'); setSelectedTicket(null); setSelectedProcedure(null); setSelectedApprovers([]); };

  const toggleTask = (id:string) => {
    if (!selectedProcedure) return;
    setSelectedProcedure({...selectedProcedure, tasks:selectedProcedure.tasks.map(t=>t.id===id?{...t,completed:!t.completed}:t)});
  };
  const updateComment = (id:string, comment:string) => {
    if (!selectedProcedure) return;
    setSelectedProcedure({...selectedProcedure, tasks:selectedProcedure.tasks.map(t=>t.id===id?{...t,comment}:t)});
  };
  const assignTask = (id:string, agent:string) => {
    if (!selectedProcedure) return;
    setSelectedProcedure({...selectedProcedure, tasks:selectedProcedure.tasks.map(t=>t.id===id?{...t,assignedTo:agent}:t)});
  };

  if (activeModal==='approval'&&selectedProcedure) return (
    <DraggableModal onClose={close} maxWidth={420}>
      <div style={{ padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0 }}>Demande d'approbation</p>
      </div>
      <div style={{ padding:20 }}>
        {APPROVERS.map(a=>(
          <label key={a} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', cursor:'pointer' }}>
            <input type="checkbox" checked={selectedApprovers.includes(a)} onChange={e=>setSelectedApprovers(p=>e.target.checked?[...p,a]:p.filter(x=>x!==a))} style={{ accentColor:'#1a6dff' }}/>
            <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)' }}>{a}</span>
          </label>
        ))}
        <button onClick={()=>{ alert(`Envoyé à: ${selectedApprovers.join(', ')}`); close(); }} disabled={selectedApprovers.length===0} style={{ width:'100%', marginTop:16, padding:'10px', borderRadius:8, background:selectedApprovers.length?'linear-gradient(135deg,#1a6dff,#0040cc)':'rgba(255,255,255,0.05)', border:'none', color:selectedApprovers.length?'#fff':'rgba(255,255,255,0.3)', fontSize:13, fontWeight:600, cursor:selectedApprovers.length?'pointer':'not-allowed' }}>
          Envoyer ({selectedApprovers.length})
        </button>
      </div>
    </DraggableModal>
  );

  if (activeModal==='procedure'&&selectedProcedure) return (
    <DraggableModal onClose={close} maxWidth={680}>
      <div style={{ display:'flex', alignItems:'center', gap:10, padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={close} style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:7, padding:'6px 8px', cursor:'pointer', color:'rgba(255,255,255,0.5)', position:'relative', zIndex:30 }}><ChevronLeft size={16}/></button>
        <div>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Procédure #{selectedProcedure.id} — {selectedProcedure.name}</p>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{selectedTicket?.subject}</p>
        </div>
      </div>
      <div style={{ overflowY:'auto', padding:20, display:'flex', flexDirection:'column', gap:12 }}>
        {selectedProcedure.tasks.map(task=>(
          <div key={task.id} style={{ background:'rgba(255,255,255,0.03)', border:`1px solid ${task.completed?'rgba(0,229,160,0.2)':'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:'14px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <button onClick={()=>toggleTask(task.id)} style={{ width:28, height:28, borderRadius:7, background:task.completed?'rgba(0,229,160,0.2)':'rgba(255,255,255,0.05)', border:`1px solid ${task.completed?'rgba(0,229,160,0.4)':'rgba(255,255,255,0.1)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <Check size={14} style={{ color:task.completed?'#00e5a0':'rgba(255,255,255,0.3)' }}/>
              </button>
              <p style={{ fontSize:13, fontWeight:600, color:task.completed?'#00e5a0':'#fff', margin:0, textDecoration:task.completed?'line-through':'none' }}>{task.title}</p>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.4)', margin:'0 0 10px' }}>{task.description}</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
              <div>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Assigné</label>
                <select value={task.assignedTo||''} onChange={e=>assignTask(task.id,e.target.value)} style={{ width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'7px 10px', color:'#fff', fontSize:12, outline:'none' }}>
                  <option value="">-- Choisir agent --</option>
                  {AGENTS.map(a=><option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.25)', textTransform:'uppercase', marginBottom:4, display:'block' }}>Commentaire</label>
                <input value={task.comment} onChange={e=>updateComment(task.id,e.target.value)} disabled={task.completed} placeholder="Notes..." style={{ width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:7, padding:'7px 10px', color:'#fff', fontSize:12, outline:'none', boxSizing:'border-box' }}/>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', gap:10 }}>
        <button onClick={()=>setActiveModal('approval')} style={{ flex:1, padding:'10px', borderRadius:8, background:'linear-gradient(135deg,#7b61ff,#1a6dff)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <ShieldAlert size={14}/>Soumettre pour approbation
        </button>
        <button onClick={close} style={{ padding:'10px 16px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Fermer</button>
      </div>
    </DraggableModal>
  );

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Communication</p>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Support Utilisateurs</h1>
      </div>

      <div style={C.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['ID','Sujet','Priorité','Statut','Actions'].map(h=>(
                <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {tickets.map((t,i)=>(
                <tr key={t.id} style={{ background:i%2?'rgba(255,255,255,0.01)':'transparent' }}>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#1a6dff', fontFamily:'monospace', fontWeight:700, borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{t.id}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{t.subject}</p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{t.user} · {t.email}</p>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:`${PRIORITY_COLOR[t.priority]}18`, border:`1px solid ${PRIORITY_COLOR[t.priority]}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700, color:PRIORITY_COLOR[t.priority] }}>{t.priority}</span>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:`${STATUS_COLOR[t.status]||'#666'}18`, border:`1px solid ${STATUS_COLOR[t.status]||'#666'}40`, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:STATUS_COLOR[t.status]||'#aaa' }}>{t.status.replace('_',' ').toUpperCase()}</span>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>{ if(t.procedure){setSelectedTicket(t);setSelectedProcedure(t.procedure!);setActiveModal('procedure');}else alert('Aucune procédure liée'); }} style={{ width:30, height:30, borderRadius:7, background:'rgba(123,97,255,0.15)', border:'1px solid rgba(123,97,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <ShieldAlert size={13} style={{ color:'#7b61ff' }}/>
                      </button>
                      <button onClick={()=>setTickets(p=>p.filter(x=>x.id!==t.id))} style={{ width:30, height:30, borderRadius:7, background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.25)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <Trash2 size={13} style={{ color:'#f87171' }}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {tickets.length===0&&<div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucun ticket</div>}
        </div>
      </div>
    </div>
  );
}
