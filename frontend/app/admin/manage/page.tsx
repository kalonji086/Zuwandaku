'use client';
import { useState } from 'react';
import { Search, Plus, Eye, Edit3, Trash2, Users, CheckCircle, Clock, Shield, X, Save, AlertTriangle, Phone, Mail, Key, GripHorizontal } from 'lucide-react';
import CreateAgentModal from './components/CreateAgentModal';
import DraggableModal from '../components/DraggableModal';

type Staff = { id:string; name:string; role:string; status:string; email:string; phone:string; permissions:number };

const INIT_STAFF: Staff[] = [
  { id:'1', name:'Marie Kabila',      role:'Réceptionniste', status:'Active',     email:'marie@hotel.com',  phone:'+243 991 234 567', permissions:12 },
  { id:'2', name:'Jean-Pierre Muteba',role:'Housekeeping',   status:'Active',     email:'jean@hotel.com',   phone:'+243 998 765 432', permissions:5  },
  { id:'3', name:'Sophie Lumu',       role:'Hotel Manager',  status:'Active',     email:'sophie@hotel.com', phone:'+243 991 111 111', permissions:24 },
  { id:'4', name:'David Nsakala',     role:'Maintenance',    status:'En attente', email:'david@hotel.com',  phone:'+243 992 222 222', permissions:3  },
  { id:'5', name:'Pierre Mvula',      role:'Sécurité',       status:'Active',     email:'pierre@hotel.com', phone:'+243 993 333 333', permissions:4  },
];

const ROLES_OPTIONS = ['Réceptionniste','Housekeeping','Hotel Manager','Maintenance','Sécurité','Chef Cuisine','Electricien','Gardien'];

const inp: React.CSSProperties = {
  width:'100%', background:'#111118', border:'1px solid rgba(255,255,255,0.1)',
  borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none', boxSizing:'border-box',
};
const C = { card: { background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:'20px 24px' } as React.CSSProperties };

export default function AdminManageStaffPage() {
  const [staff, setStaff] = useState<Staff[]>(INIT_STAFF);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [createOpen, setCreateOpen] = useState(false);
  const [toast, setToast] = useState('');

  // Modal state
  const [modal, setModal] = useState<'view'|'edit'|'delete'|null>(null);
  const [selected, setSelected] = useState<Staff|null>(null);
  const [editForm, setEditForm] = useState<Staff|null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openView   = (s: Staff) => { setSelected(s); setModal('view'); };
  const openEdit   = (s: Staff) => { setSelected(s); setEditForm({ ...s }); setModal('edit'); };
  const openDelete = (s: Staff) => { setSelected(s); setModal('delete'); };
  const closeModal = () => { setModal(null); setSelected(null); setEditForm(null); };

  const handleSaveEdit = () => {
    if (!editForm) return;
    setStaff(p => p.map(s => s.id === editForm.id ? editForm : s));
    showToast('Agent modifié avec succès');
    closeModal();
  };

  const handleDelete = () => {
    if (!selected) return;
    setStaff(p => p.filter(s => s.id !== selected.id));
    showToast('Agent supprimé');
    closeModal();
  };

  const filtered = staff.filter(s =>
    `${s.name} ${s.email} ${s.role}`.toLowerCase().includes(search.toLowerCase()) &&
    (filterStatus === 'ALL' || s.status === filterStatus)
  );

  const stats = [
    { label:'Agents actifs',    value: staff.filter(s => s.status === 'Active').length,     icon: Users,       color:'#00e5a0' },
    { label:'En attente',       value: staff.filter(s => s.status === 'En attente').length, icon: Clock,       color:'#ffcc00' },
    { label:'Permissions moy.', value: Math.round(staff.reduce((a,s) => a + s.permissions, 0) / staff.length), icon: Shield, color:'#7b61ff' },
    { label:'Total personnel',  value: staff.length,                                         icon: CheckCircle, color:'#1a6dff' },
  ];

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
      {toast && (
        <div style={{ position:'fixed', top:20, right:20, zIndex:100, background:'#00e5a0', color:'#000', padding:'10px 18px', borderRadius:10, fontSize:13, fontWeight:600 }}>
          {toast}
        </div>
      )}

      <CreateAgentModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={(d: any) => {
          setStaff(p => [{
            id: String(Date.now()),
            name: d.name || 'Nouvel agent',
            role: d.role || 'Agent',
            status: 'En attente',
            email: d.email || '',
            phone: d.phone || '',
            permissions: 0,
          }, ...p]);
          showToast('Agent créé avec succès');
          setCreateOpen(false);
        }}
      />

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>Administration</p>
          <h1 style={{ fontSize:24, fontWeight:800, color:'#fff', margin:0 }}>Gestion Personnel</h1>
        </div>
        <button onClick={() => setCreateOpen(true)}
          style={{ display:'flex', alignItems:'center', gap:6, padding:'9px 16px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
          <Plus size={14} />Créer agent
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:'#0d0d14', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:36, height:36, borderRadius:9, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={16} style={{ color:s.color }} />
            </div>
            <div>
              <p style={{ fontSize:22, fontWeight:800, color:'#fff', margin:0 }}>{s.value}</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:0 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:10 }}>
        <div style={{ flex:1, display:'flex', alignItems:'center', gap:8, background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'0 12px' }}>
          <Search size={14} style={{ color:'rgba(255,255,255,0.3)', flexShrink:0 }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher nom, email, rôle..."
            style={{ flex:1, background:'transparent', border:'none', outline:'none', color:'#fff', fontSize:13, padding:'9px 0' }} />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          style={{ background:'#111118', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'9px 12px', color:'#fff', fontSize:13, outline:'none' }}>
          <option value="ALL">Tous statuts</option>
          <option value="Active">Actif</option>
          <option value="En attente">En attente</option>
        </select>
      </div>

      {/* Table */}
      <div style={C.card}>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Nom / Email','Rôle','Statut','Téléphone','Permissions','Actions'].map(h => (
                  <th key={h} style={{ padding:'10px 14px', fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.3)', textTransform:'uppercase', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ background: i % 2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:32, height:32, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color:'#fff', flexShrink:0 }}>
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize:13, fontWeight:600, color:'#fff', margin:0 }}>{s.name}</p>
                        <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:0 }}>{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ background:'rgba(26,109,255,0.15)', border:'1px solid rgba(26,109,255,0.3)', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:'#1a6dff' }}>{s.role}</span>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{
                      background: s.status === 'Active' ? 'rgba(0,229,160,0.12)' : 'rgba(255,204,0,0.12)',
                      border: `1px solid ${s.status === 'Active' ? 'rgba(0,229,160,0.3)' : 'rgba(255,204,0,0.3)'}`,
                      borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600,
                      color: s.status === 'Active' ? '#00e5a0' : '#ffcc00',
                    }}>{s.status}</span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'rgba(255,255,255,0.4)', fontFamily:'monospace', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>{s.phone}</td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:'#00e5a0' }} />
                      <span style={{ fontSize:13, fontWeight:700, color:'#00e5a0' }}>{s.permissions}</span>
                    </div>
                  </td>
                  <td style={{ padding:'12px 14px', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openView(s)}
                        title="Voir"
                        style={{ width:28, height:28, borderRadius:6, background:'rgba(26,109,255,0.15)', border:'1px solid rgba(26,109,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <Eye size={13} style={{ color:'#1a6dff' }} />
                      </button>
                      <button onClick={() => openEdit(s)}
                        title="Modifier"
                        style={{ width:28, height:28, borderRadius:6, background:'rgba(255,204,0,0.12)', border:'1px solid rgba(255,204,0,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <Edit3 size={13} style={{ color:'#ffcc00' }} />
                      </button>
                      <button onClick={() => openDelete(s)}
                        title="Supprimer"
                        style={{ width:28, height:28, borderRadius:6, background:'rgba(248,113,113,0.12)', border:'1px solid rgba(248,113,113,0.3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                        <Trash2 size={13} style={{ color:'#f87171' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px 0', color:'rgba(255,255,255,0.2)', fontSize:13 }}>Aucun personnel trouvé</div>
          )}
        </div>
      </div>

      {/* ── MODALS DÉPLAÇABLES ── */}
      {modal && (
        <DraggableModal onClose={closeModal} maxWidth={480}>
            {/* Header — zone de drag (handle invisible positionné dessus) */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', position:'relative' }}>
              <p style={{ fontSize:15, fontWeight:700, color:'#fff', margin:0, display:'flex', alignItems:'center', gap:8 }}>
                {modal === 'view'   && <><Eye size={16} style={{ color:'#1a6dff' }} />Profil agent</>}
                {modal === 'edit'   && <><Edit3 size={16} style={{ color:'#ffcc00' }} />Modifier agent</>}
                {modal === 'delete' && <><AlertTriangle size={16} style={{ color:'#f87171' }} />Supprimer agent</>}
              </p>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <GripHorizontal size={14} style={{ color:'rgba(255,255,255,0.2)' }} />
                <button onClick={closeModal} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.4)', zIndex:20, position:'relative' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ── VOIR ── */}
            {modal === 'view' && selected && (
              <div style={{ padding:20 }}>
                {/* Avatar + nom */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:20, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:800, color:'#fff', flexShrink:0 }}>
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize:16, fontWeight:700, color:'#fff', margin:'0 0 6px' }}>{selected.name}</p>
                    <div style={{ display:'flex', gap:8 }}>
                      <span style={{ background:'rgba(26,109,255,0.15)', border:'1px solid rgba(26,109,255,0.3)', borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, color:'#1a6dff' }}>{selected.role}</span>
                      <span style={{
                        background: selected.status === 'Active' ? 'rgba(0,229,160,0.12)' : 'rgba(255,204,0,0.12)',
                        border: `1px solid ${selected.status === 'Active' ? 'rgba(0,229,160,0.3)' : 'rgba(255,204,0,0.3)'}`,
                        borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600,
                        color: selected.status === 'Active' ? '#00e5a0' : '#ffcc00',
                      }}>{selected.status}</span>
                    </div>
                  </div>
                </div>

                {/* Infos */}
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {[
                    { icon: Mail,  label:'Email',       value: selected.email },
                    { icon: Phone, label:'Téléphone',   value: selected.phone },
                    { icon: Key,   label:'Permissions', value: `${selected.permissions} accès actifs` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.04)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <Icon size={14} style={{ color:'rgba(255,255,255,0.4)' }} />
                      </div>
                      <div>
                        <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', margin:'0 0 2px', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:700 }}>{label}</p>
                        <p style={{ fontSize:13, color:'#fff', margin:0, fontWeight:500 }}>{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:10, marginTop:20 }}>
                  <button onClick={() => { closeModal(); openEdit(selected); }}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'rgba(255,204,0,0.12)', border:'1px solid rgba(255,204,0,0.3)', color:'#ffcc00', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Edit3 size={13} />Modifier
                  </button>
                  <button onClick={closeModal}
                    style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>
                    Fermer
                  </button>
                </div>
              </div>
            )}

            {/* ── MODIFIER ── */}
            {modal === 'edit' && editForm && (
              <div style={{ padding:20, display:'flex', flexDirection:'column', gap:14 }}>
                {/* Avatar preview */}
                <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#fff', flexShrink:0 }}>
                    {editForm.name.charAt(0) || '?'}
                  </div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', margin:0 }}>Modification de <strong style={{ color:'#fff' }}>{selected?.name}</strong></p>
                </div>

                {/* Champs */}
                {[
                  { label:'Nom complet *', k:'name', type:'text' },
                  { label:'Email *',       k:'email', type:'email' },
                  { label:'Téléphone',     k:'phone', type:'tel' },
                ].map(({ label, k, type }) => (
                  <div key={k}>
                    <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>{label}</label>
                    <input
                      type={type}
                      value={(editForm as any)[k]}
                      onChange={e => setEditForm(f => f ? { ...f, [k]: e.target.value } : f)}
                      style={inp}
                    />
                  </div>
                ))}

                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Rôle</label>
                  <select value={editForm.role} onChange={e => setEditForm(f => f ? { ...f, role: e.target.value } : f)} style={inp}>
                    {ROLES_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Statut</label>
                  <select value={editForm.status} onChange={e => setEditForm(f => f ? { ...f, status: e.target.value } : f)} style={inp}>
                    <option value="Active">Actif</option>
                    <option value="En attente">En attente</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.35)', textTransform:'uppercase', marginBottom:6, display:'block' }}>Nombre de permissions</label>
                  <input
                    type="number"
                    min={0}
                    value={editForm.permissions}
                    onChange={e => setEditForm(f => f ? { ...f, permissions: +e.target.value } : f)}
                    style={inp}
                  />
                </div>

                <div style={{ display:'flex', gap:10, marginTop:4 }}>
                  <button onClick={closeModal}
                    style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>
                    Annuler
                  </button>
                  <button onClick={handleSaveEdit}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'linear-gradient(135deg,#1a6dff,#0040cc)', border:'none', color:'#fff', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Save size={13} />Sauvegarder
                  </button>
                </div>
              </div>
            )}

            {/* ── SUPPRIMER ── */}
            {modal === 'delete' && selected && (
              <div style={{ padding:20 }}>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.6)', marginBottom:16 }}>
                  Voulez-vous vraiment supprimer cet agent ?
                </p>

                {/* Card agent */}
                <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'12px 14px', marginBottom:16 }}>
                  <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#1a6dff,#0040cc)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color:'#fff', flexShrink:0 }}>
                    {selected.name.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#fff', margin:0 }}>{selected.name}</p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.35)', margin:'2px 0 0' }}>{selected.email} · {selected.role}</p>
                  </div>
                </div>

                {/* Warning */}
                <div style={{ display:'flex', alignItems:'center', gap:8, background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.2)', borderRadius:10, padding:'10px 14px', marginBottom:20 }}>
                  <AlertTriangle size={14} style={{ color:'#f87171', flexShrink:0 }} />
                  <span style={{ fontSize:12, color:'#f87171' }}>Cette action est irréversible. L'agent sera définitivement supprimé.</span>
                </div>

                <div style={{ display:'flex', gap:10 }}>
                  <button onClick={closeModal}
                    style={{ flex:1, padding:'9px', borderRadius:8, background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)', fontSize:13, cursor:'pointer' }}>
                    Annuler
                  </button>
                  <button onClick={handleDelete}
                    style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, padding:'9px', borderRadius:8, background:'rgba(248,113,113,0.15)', border:'1px solid rgba(248,113,113,0.3)', color:'#f87171', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                    <Trash2 size={13} />Supprimer
                  </button>
                </div>
              </div>
            )}
        </DraggableModal>
      )}
    </div>
  );
}
