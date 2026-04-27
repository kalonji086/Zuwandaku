"use client";

import { useState } from 'react';
import { X, Users, Eye, Edit3, Trash2, CheckCircle, Clock, Shield, Plus } from 'lucide-react';
import DeleteMemberModal from './DeleteMemberModal';
import EditMemberModal from './EditMemberModal';
import ViewAccessModal from './ViewAccessModal';
import NewMemberModal from './NewMemberModal';

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'inactive';
  lastLogin: string;
  permissionsCount: number;
}

const MEMBERS_MOCK: Member[] = [
  { id: '1', name: 'Marie Kabila', email: 'marie@hotel.com', role: 'Réceptionniste', status: 'active', lastLogin: '2024-04-20 14:32', permissionsCount: 12 },
  { id: '2', name: 'Jean Muteba', email: 'jean@hotel.com', role: 'Housekeeping', status: 'pending', lastLogin: '2024-04-19 09:15', permissionsCount: 5 },
  { id: '3', name: 'Sophie Lumu', email: 'sophie@hotel.com', role: 'Manager', status: 'active', lastLogin: '2024-04-20 11:45', permissionsCount: 24 },
];

interface ViewMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReturn?: () => void;
  roleName: string;
  roleId: string;
  memberCount: number;
}

export default function ViewMembersModal({ isOpen, onClose, onReturn, roleName, roleId, memberCount }: ViewMembersModalProps) {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');
  const [searchMember, setSearchMember] = useState('');

  const [deleteMemberModalOpen, setDeleteMemberModalOpen] = useState(false);
  const [editMemberModalOpen, setEditMemberModalOpen] = useState(false);
  const [viewAccessModalOpen, setViewAccessModalOpen] = useState(false);
  const [newMemberModalOpen, setNewMemberModalOpen] = useState(false);


  const handleAddNewMember = () => {
    console.log('Opening NewMemberModal for role:', roleName);
    setNewMemberModalOpen(true);
  };



  const handleNewMemberSave = (newMember: any) => {
    console.log('Saving new member:', newMember, 'for role:', roleName);
    // Add to members list (mock)
    setNewMemberModalOpen(false);
    onClose();
    onReturn?.();
  };
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);



  const filteredMembers = MEMBERS_MOCK.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchMember.toLowerCase()) || member.email.toLowerCase().includes(searchMember.toLowerCase());
    const matchesStatus = filterStatus === 'all' || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });


  const getStatusColor = (status: Member['status']) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 border-emerald-500 text-emerald-400';
      case 'pending': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'inactive': return 'bg-gray-500/20 border-gray-500 text-gray-400';
    }
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-200" onClick={(e) => {
      onClose();
      onReturn?.();
    }}>
      <div className="bg-gradient-to-b from-slate-900 to-slate-950/50 backdrop-blur-3xl border border-purple-500/30 rounded-4xl shadow-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slide-in-from-bottom" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="p-8 border-b border-purple-500/20 bg-gradient-to-r from-slate-900 to-purple-900/20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Users size={28} className="text-white drop-shadow-lg" />
              </div>
              <div>
                <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl">
                  Membres du rôle
                </h2>
                <p className="text-xl text-gray-400">{roleName}</p>
              </div>
            </div>
            <span className="px-4 py-2 bg-gradient-to-r from-slate-500/30 to-slate-600/30 text-slate-300 border border-slate-500/50 rounded-2xl font-bold shadow-lg">
              {filteredMembers.length} / {memberCount}
            </span>
            <button 
              onClick={() => {
                onClose();
                onReturn?.();
              }} 
              className="p-3 hover:bg-slate-800/50 rounded-2xl text-gray-400 hover:text-white transition-all shadow-lg group flex-shrink-0 hover:scale-105 active:scale-95"
              title="Fermer (Échap)"
            >
              <X size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-6 mb-8 bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50">
            <div className="relative flex-1">
              <Users size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input
                type="text"
                placeholder="Rechercher membre par nom ou email..."
                value={searchMember}
                onChange={(e) => setSearchMember(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white placeholder-gray-500 font-medium focus:outline-none focus:ring-3 focus:ring-purple-500/40 shadow-lg transition-all"
              />
            </div>
            <div className="flex gap-3">
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-6 py-4 bg-slate-900/50 border border-slate-700/50 rounded-2xl text-white focus:ring-3 focus:ring-emerald-500/40 font-medium"
              >
                <option value="all">Tous statuts</option>
                <option value="active">Actifs ({MEMBERS_MOCK.filter(m => m.status === 'active').length})</option>
                <option value="pending">En attente ({MEMBERS_MOCK.filter(m => m.status === 'pending').length})</option>
                <option value="inactive">Inactifs</option>
              </select>
            </div>
          </div>

          {/* Members Table */}
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="group bg-gradient-to-r from-slate-800/50 to-slate-800/20 backdrop-blur-xl rounded-3xl p-6 border border-slate-700/50 shadow-xl hover:shadow-purple-500/20 hover:border-purple-500/50 hover:scale-[1.01] transition-all duration-200 overflow-hidden">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-6 flex-1">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg text-white font-bold text-lg">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xl font-bold text-white truncate">{member.name}</h4>
                      <p className="text-gray-400 text-sm truncate">{member.email}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full border-2 font-bold text-sm capitalize ${getStatusColor(member.status)}`}>
                      {member.status}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm opacity-70 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-1 text-purple-400 font-medium">
                      <Shield size={16} />
                      {member.permissionsCount}
                    </div>
                    <span className="text-gray-500 mx-4">•</span>
                    <span className="text-xs text-gray-500">{member.lastLogin}</span>
                    
                    <button className="p-3 bg-blue-600/30 hover:bg-blue-600/50 rounded-2xl border border-blue-500/40 text-blue-300 hover:text-blue-200 transition-all shadow-lg" onClick={() => {
                      setSelectedMember(member);
                      setViewAccessModalOpen(true);
                    }}>
                      <Eye size={16} />
                    </button>
                    <button className="p-3 bg-emerald-600/30 hover:bg-emerald-600/50 rounded-2xl border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-all shadow-lg" onClick={() => {
                      setSelectedMember(member);
                      setEditMemberModalOpen(true);
                    }}>
                      <Edit3 size={16} />
                    </button>
                    <button className="p-3 bg-red-600/30 hover:bg-red-600/50 rounded-2xl border border-red-500/40 text-red-300 hover:text-red-200 transition-all shadow-lg" onClick={() => {
                      setSelectedMember(member);
                      setDeleteMemberModalOpen(true);
                    }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-24 border-2 border-dashed border-slate-700/50 rounded-4xl">
              <Users size={80} className="mx-auto mb-8 text-gray-600 opacity-50" />
              <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">Aucun membre trouvé</h3>
              <p className="text-xl text-gray-500 mb-12 max-w-md mx-auto">Ajustez les filtres ou ajoutez le premier membre à ce rôle</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-slate-700/50 bg-gradient-to-t from-slate-950">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {filteredMembers.length} membres affichés de {memberCount} total
            </div>
            <button 
              onClick={handleAddNewMember}
              className="px-12 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-3"
            >
              <Plus size={20} />
              Ajouter membre
            </button>
          </div>
        </div>

        {/* Sub Modals */}
        <DeleteMemberModal 
          isOpen={deleteMemberModalOpen}
          onClose={() => setDeleteMemberModalOpen(false)}
          memberName={selectedMember?.name || ''}
          roleName={roleName}
          onDelete={() => {
            console.log('Member deleted');
            setDeleteMemberModalOpen(false);
            onClose();
            onReturn?.();
          }}
        />
        <EditMemberModal 
          isOpen={editMemberModalOpen}
          onClose={() => setEditMemberModalOpen(false)}
          member={selectedMember || null}
          onSave={(updated) => {
            console.log('Member updated:', updated);
            setEditMemberModalOpen(false);
            onClose();
            onReturn?.();
          }}
        />
        <ViewAccessModal 
          isOpen={viewAccessModalOpen}
          onClose={() => setViewAccessModalOpen(false)}
          memberName={selectedMember?.name || ''}
          permissions={['user_create', 'hotel_approve', 'financial_view']}
        />
        <NewMemberModal 
          isOpen={newMemberModalOpen}
          onClose={() => {
            console.log('Closing NewMemberModal');
            setNewMemberModalOpen(false);
            onClose();
            onReturn?.();
          }}
          onSave={handleNewMemberSave}
        />

      </div>
    </div>
  );
}

