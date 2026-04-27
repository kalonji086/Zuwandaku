'use client';
import { useState } from 'react';
import { Save, Globe, CreditCard, Bell, Shield, Mail, Phone, User, LogOut, Camera, Key } from 'lucide-react';
import PhotoUploadModal from '../components/PhotoUploadModal';
import { useLogout } from '../../../lib/hooks';
import Link from 'next/link';

const inp: React.CSSProperties = { width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box' };
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

function Toggle({ value, onChange }: { value:boolean; onChange:(v:boolean)=>void }) {
  return (
    <button onClick={()=>onChange(!value)} style={{ position:'relative', width:42, height:24, borderRadius:12, background:value?'#1a6dff':'rgba(255,255,255,0.1)', border:'none', cursor:'pointer', transition:'background 0.2s', flexShrink:0 }}>
      <span style={{ position:'absolute', top:3, left:value?21:3, width:18, height:18, borderRadius:'50%', background:'#fff', transition:'left 0.2s', boxShadow:'0 1px 4px rgba(0,0,0,0.4)' }}/>
    </button>
  );
}

export default function ParametresPage() {
  const { logout } = useLogout();
  const [siteName, setSiteName] = useState('ZUWAndaku');
  const [siteEmail, setSiteEmail] = useState('contact@zuwandaku.cd');
  const [sitePhone, setSitePhone] = useState('+243 81 000 0000');
  const [currency, setCurrency] = useState('USD');
  const [notifs, setNotifs] = useState({ email:true, sms:false, contract:true, user:true });
  const [saved, setSaved] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [avatar, setAvatar] = useState('');

  const handleSave = () => { setSaved(true); setTimeout(()=>setSaved(false),2500); };

  const handlePhotoUpload = (url:string) => {
    setAvatar(url);
    try { const u=JSON.parse(localStorage.getItem('user')||'{}'); u.avatar=url; localStorage.setItem('user',JSON.stringify(u)); } catch {}
    setModalOpen(false);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:720 }}>
      {saved&&<div style={{ background:'rgba(0,229,160,0.12)', border:'1px solid rgba(0,229,160,0.3)', color:'#00e5a0', padding:'10px 16px', borderRadius:10, fontSize:13, display:'flex', alignItems:'center', gap:8 }}><Save size={14}/>Paramètres sauvegardés</div>}

      <div>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Configuration</p>
        <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Paramètres</h1>
      </div>

      {/* Site */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <Globe size={16} style={{ color:'#1a6dff' }}/>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Informations du site</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Nom du site</label>
            <input value={siteName} onChange={e=>setSiteName(e.target.value)} style={inp}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Email contact</label>
              <input value={siteEmail} onChange={e=>setSiteEmail(e.target.value)} style={inp}/>
            </div>
            <div>
              <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Téléphone</label>
              <input value={sitePhone} onChange={e=>setSitePhone(e.target.value)} style={inp}/>
            </div>
          </div>
        </div>
      </div>

      {/* Paiement */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <CreditCard size={16} style={{ color:'#00e5a0' }}/>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Paramètres de paiement</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Devise</label>
            <select value={currency} onChange={e=>setCurrency(e.target.value)} style={inp}>
              <option value="USD">USD</option><option value="CDF">CDF</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Commission location (%)</label>
            <input type="number" defaultValue={5} min={0} max={100} style={inp}/>
          </div>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Commission vente (%)</label>
            <input type="number" defaultValue={3} min={0} max={100} style={inp}/>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <Bell size={16} style={{ color:'#ffcc00' }}/>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Notifications</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {[{label:'Notifications par email',k:'email'},{label:'Notifications par SMS',k:'sms'},{label:'Alerte nouveau contrat',k:'contract'},{label:'Alerte nouvel utilisateur',k:'user'}].map(({label,k})=>(
            <div key={k} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize:13, color:'rgba(255,255,255,0.6)' }}>{label}</span>
              <Toggle value={(notifs as any)[k]} onChange={v=>setNotifs(n=>({...n,[k]:v}))}/>
            </div>
          ))}
        </div>
      </div>

      {/* Sécurité */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <Shield size={16} style={{ color:'#f87171' }}/>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Sécurité</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Nouveau mot de passe</label>
            <input type="password" placeholder="••••••••" style={inp}/>
          </div>
          <div>
            <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Confirmer</label>
            <input type="password" placeholder="••••••••" style={inp}/>
          </div>
        </div>
      </div>

      {/* Profil */}
      <div style={C.card}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
          <User size={16} style={{ color:'#7b61ff' }}/>
          <p style={{ fontSize:14, fontWeight:700, color:'#fff', margin:0 }}>Mon profil</p>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ width:64, height:64, borderRadius:'50%', background:'linear-gradient(135deg,#7b61ff,#1a6dff)', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {avatar?<img src={avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }}/>:<User size={28} style={{ color:'rgba(255,255,255,0.6)' }}/>}
          </div>
          <button onClick={()=>setModalOpen(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'rgba(123,97,255,0.15)', border:'1px solid rgba(123,97,255,0.3)', color:'#7b61ff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            <Camera size={14}/>Changer photo
          </button>
        </div>
      </div>

      {/* API Keys */}
      <div style={C.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Key size={16} style={{ color: '#ffcc00' }} />
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Clés API Dashboards</p>
          </div>
          <Link href="/admin/parametres/apikeys" style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, background: 'rgba(255,204,0,0.1)', border: '1px solid rgba(255,204,0,0.25)', color: '#ffcc00', fontSize: 12, fontWeight: 600, textDecoration: 'none' }}>
            Gérer les clés →
          </Link>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '8px 0 0' }}>Connectez les dashboards départements. Les modules désactivés sont floutés en temps réel.</p>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:12 }}>
        <button onClick={handleSave} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'11px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Save size={14}/>Sauvegarder
        </button>
        <button onClick={logout} style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'11px', borderRadius:8, background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.25)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <LogOut size={14}/>Déconnexion
        </button>
      </div>

      <PhotoUploadModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} onUpload={handlePhotoUpload}/>
    </div>
  );
}
