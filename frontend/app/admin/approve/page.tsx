'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, User, FileText, Car, Home } from 'lucide-react';
import axios from 'axios';

const C = {
  card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties,
  BLUE:'#1a6dff', GREEN:'#00e5a0', RED:'#f87171', YELLOW:'#ffcc00',
};

const TABS = [
  { id:'account-creation', label:'Création compte', icon:User, type:'ACCOUNT_CREATION' },
  { id:'account-change', label:'Changement infos', icon:User, type:'ACCOUNT_CHANGE' },
  { id:'purchase', label:'Achats', icon:FileText, type:'PURCHASE' },
  { id:'rental-vehicle', label:'Location véhicules', icon:Car, type:'RENTAL_VEHICLE' },
  { id:'rental-property', label:'Location biens', icon:Home, type:'RENTAL_PROPERTY' },
  { id:'procedure', label:'Procédures', icon:Clock, type:'PROCEDURE' },
];

type Request = { id:string; type:string; details:any; status:string; adminNote?:string; user:{ id:string; name:string; email:string; role:string }; createdAt:string };

export default function ApprovePage() {
  const [activeTab, setActiveTab] = useState('account-creation');
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRequests(); }, [activeTab]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/admin/users/pending-requests?type=${TABS.find(t=>t.id===activeTab)?.type}`);
      setRequests(data);
    } catch { setRequests([]); }
    setLoading(false);
  };

  const handle = async (id: string, action: 'approve'|'reject') => {
    try {
      await axios.patch(`/api/admin/users/requests/${id}/${action}`, { adminNote: action === 'approve' ? 'Approved' : 'Rejected' });
      fetchRequests();
    } catch {}
  };

  const activeTabData = TABS.find(t=>t.id===activeTab)!;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      <div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Administration</p>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Approbations</h1>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', border:'1px solid', transition:'all 0.15s',
              background: activeTab===tab.id ? '#1a6dff' : 'rgba(255,255,255,0.04)',
              borderColor: activeTab===tab.id ? '#1a6dff' : 'rgba(255,255,255,0.08)',
              color: activeTab===tab.id ? '#fff' : 'rgba(255,255,255,0.5)',
            }}>
            <tab.icon size={13} />{tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:16, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          <activeTabData.icon size={18} style={{ color:C.BLUE }} />
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>{activeTabData.label}</p>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', margin:0 }}>{requests.length} demande(s) en attente</p>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.3)', fontSize:13 }}>Chargement...</div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <Clock size={36} style={{ color:'rgba(255,255,255,0.15)', margin:'0 auto 12px' }} />
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>Aucune demande en attente</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {requests.map(req => (
              <div key={req.id} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)', borderRadius:10, padding:'14px 16px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {req.user.name.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{req.user.name}</p>
                      <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{req.user.email} · {req.user.role}</p>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    <button onClick={() => handle(req.id,'approve')}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:7, background:'rgba(0,229,160,0.12)', border:'1px solid rgba(0,229,160,0.3)', color:'#00e5a0', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      <CheckCircle size={13} />Approuver
                    </button>
                    <button onClick={() => handle(req.id,'reject')}
                      style={{ display:'flex', alignItems:'center', gap:5, padding:'7px 14px', borderRadius:7, background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                      <XCircle size={13} />Rejeter
                    </button>
                  </div>
                </div>
                <div style={{ marginTop:10, display:'flex', gap:16, fontSize:11, color:'rgba(255,255,255,0.3)' }}>
                  <span>Type: {req.type.replace('_',' ')}</span>
                  <span>{new Date(req.createdAt).toLocaleDateString('fr-FR')}</span>
                  {req.adminNote && <span style={{ color:'rgba(255,255,255,0.2)', fontStyle:'italic' }}>Note: {req.adminNote}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
