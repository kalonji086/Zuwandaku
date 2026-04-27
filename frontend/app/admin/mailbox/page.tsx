'use client';
import { useState } from 'react';
import { Mail, Send, Search, Paperclip, Clock, CheckCheck, Archive, Flag, Trash2, X } from 'lucide-react';
import DraggableModal from '../components/DraggableModal';
import EmailComposer from '../../../src/components/EmailComposer';

const MESSAGES = [
  { id:1, senderName:'Jean Dupont', senderEmail:'jean@example.com', subject:'Inquiétude concernant la propriété P001', message:"Bonjour, j'aimerais avoir plus d'informations sur la propriété à Gombe...", time:'Il y a 2h', read:false, priority:'HIGH' },
  { id:2, senderName:'Marie Kabila', senderEmail:'marie@example.com', subject:'Réservation confirmée', message:'Merci pour votre attention. La réservation est confirmée pour le 15 avril...', time:'Il y a 3h', read:true, priority:'NORMAL' },
  { id:3, senderName:'Pierre Mbutu', senderEmail:'pierre@example.com', subject:'Problème avec le paiement', message:"Je ne peux pas finaliser le paiement, j'ai reçu une erreur...", time:'Hier', read:false, priority:'HIGH' },
  { id:4, senderName:'Sophie Martin', senderEmail:'sophie@example.com', subject:'Merci beaucoup!', message:'Votre service est excellent! Merci de votre aide...', time:'Hier', read:true, priority:'NORMAL' },
  { id:5, senderName:'Support System', senderEmail:'support@zuwandaku.com', subject:'Rapport quotidien', message:'Voici le rapport de synthèse du jour...', time:'2 jours', read:true, priority:'NORMAL' },
];

const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14 } as React.CSSProperties };

export default function MailboxPage() {
  const [messages, setMessages] = useState(MESSAGES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selectedId, setSelectedId] = useState<number|null>(1);
  const [showComposer, setShowComposer] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const filtered = messages.filter(m=>{
    const matchSearch = `${m.senderName} ${m.subject}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter==='ALL'||(filter==='UNREAD'&&!m.read)||(filter==='READ'&&m.read);
    return matchSearch&&matchFilter;
  });

  const selected = messages.find(m=>m.id===selectedId);
  const unread = messages.filter(m=>!m.read).length;

  const handleArchive = () => {
    setMessages(p=>p.filter(m=>m.id!==selectedId));
    setSelectedId(messages.find(m=>m.id!==selectedId)?.id||null);
  };
  const handleDelete = () => {
    setMessages(p=>p.filter(m=>m.id!==selectedId));
    setSelectedId(messages.find(m=>m.id!==selectedId)?.id||null);
    setDeleteModal(false);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Communication</p>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Mailbox</h1>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {[{label:'Total',value:messages.length,color:'#1a6dff'},{label:'Non lus',value:unread,color:'#f87171'},{label:'Lus',value:messages.filter(m=>m.read).length,color:'#00e5a0'},{label:'Importants',value:messages.filter(m=>m.priority==='HIGH').length,color:'#ffcc00'}].map(s=>(
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px' }}>
            <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:'0 0 2px' }}>{s.value}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ display:'grid', gridTemplateColumns:'300px 1fr', gap:16, minHeight:500 }}>
        {/* List */}
        <div style={{ ...C.card, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <div style={{ padding:'14px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0 10px', marginBottom:10 }}>
              <Search size={13} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }}/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:12, padding:'8px 0' }}/>
            </div>
            <div style={{ display:'flex', gap:6 }}>
              {[['ALL','Tous'],['UNREAD','Non lus'],['READ','Lus']].map(([v,l])=>(
                <button key={v} onClick={()=>setFilter(v)} style={{ padding:'4px 10px', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', border:'1px solid', background:filter===v?'#1a6dff':'transparent', borderColor:filter===v?'#1a6dff':'rgba(255,255,255,0.1)', color:filter===v?'#fff':'rgba(255,255,255,0.4)' }}>{l}</button>
              ))}
            </div>
          </div>
          <div style={{ flex:1, overflowY:'auto' }}>
            {filtered.map(msg=>(
              <button key={msg.id} onClick={()=>setSelectedId(msg.id)} style={{ width:'100%', textAlign:'left', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', background:selectedId===msg.id?'rgba(26,109,255,0.1)':msg.read?'transparent':'rgba(255,255,255,0.02)', border:'none', cursor:'pointer', display:'block' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:msg.priority==='HIGH'?'rgba(248,113,113,0.3)':'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color:'#fff', flexShrink:0 }}>{msg.senderName[0]}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <span style={{ fontSize:12, fontWeight:msg.read?400:700, color:msg.read?'rgba(255,255,255,0.5)':'#fff', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.senderName}</span>
                      {!msg.read&&<span style={{ width:6, height:6, borderRadius:'50%', background:'#1a6dff', flexShrink:0 }}/>}
                    </div>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{msg.subject}</p>
                  </div>
                </div>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', margin:0, textAlign:'right' }}>{msg.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        <div style={{ ...C.card, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {selected ? (
            <>
              <div style={{ padding:'16px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0 }}>{selected.senderName[0]}</div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{selected.senderName}</p>
                      <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{selected.senderEmail}</p>
                      <p style={{ fontSize:10, color:'rgba(255,255,255,0.2)', margin:'2px 0 0', display:'flex', alignItems:'center', gap:4 }}><Clock size={10}/>{selected.time}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {selected.read&&<CheckCheck size={14} style={{ color:'#00e5a0' }}/>}
                    {selected.priority==='HIGH'&&<Flag size={14} style={{ color:'#f87171' }}/>}
                  </div>
                </div>
                <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:'12px 0 0' }}>{selected.subject}</p>
              </div>
              <div style={{ flex:1, padding:'16px 20px', overflowY:'auto' }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', lineHeight:1.7 }}>{selected.message}</p>
              </div>
              <div style={{ padding:'14px 20px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
                <button onClick={()=>setShowComposer(true)} style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'10px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer', marginBottom:10 }}>
                  <Send size={14}/>Répondre
                </button>
                {showComposer&&<EmailComposer toEmail={selected.senderEmail} onClose={()=>setShowComposer(false)}/>}
                <div style={{ display:'flex', justifyContent:'flex-end', gap:8 }}>
                  <button onClick={handleArchive} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:7, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:12, cursor:'pointer' }}>
                    <Archive size={13}/>Archiver
                  </button>
                  <button onClick={()=>setDeleteModal(true)} style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:7, background:'rgba(248,113,113,0.1)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171', fontSize:12, cursor:'pointer' }}>
                    <Trash2 size={13}/>Supprimer
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.2)' }}>
              <Mail size={40} style={{ marginBottom:12, opacity:0.3 }}/>
              <p style={{ fontSize:13 }}>Sélectionnez un message</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleteModal&&selected&&(
        <DraggableModal onClose={()=>setDeleteModal(false)} maxWidth={400}>
            <div style={{ padding:24 }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#f87171', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}><Trash2 size={16}/>Supprimer le message</p>
              <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', marginBottom:20 }}>Supprimer le message de <strong style={{color:'#fff'}}>{selected.senderName}</strong> ?</p>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={()=>setDeleteModal(false)} style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>Annuler</button>
                <button onClick={handleDelete} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  <Trash2 size={13}/>Supprimer
                </button>
              </div>
            </div>
        </DraggableModal>
      )}
    </div>
  );
}
