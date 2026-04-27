"use client";

import { useState } from 'react';
import EditRoleModal from '../components/EditRoleModal';
import ViewMembersModal from '../components/ViewMembersModal';
import DeleteRoleModal from '../components/DeleteRoleModal';

import NewMemberModal from '../components/NewMemberModal';
import NewRoleModal from '../components/NewRoleModal';

import { Shield, Plus, Edit3, Trash2, Search, Filter, Users } from 'lucide-react';

const ADMIN_ROLES_MOCK = [

  {
    id: '1',
    name: 'Admin Principal',
    permissions: ['all', 'user_management', 'groupworks_full', 'hotel_approval', 'financials', 'reports_admin'],
    groupCount: 1,
    userCount: 1,
    color: 'violet'
  },
  {
    id: '2',
    name: 'Hotel Manager',
    permissions: ['hotel_staff', 'requests_view', 'reports_hotel', 'billing'],
    groupCount: 3,
    userCount: 42,
    color: 'purple'
  },
  {
    id: '3',
    name: 'Property Agent',
    permissions: ['properties', 'contracts', 'clients'],
    groupCount: 2,
    userCount: 25,
    color: 'indigo'
  },
  {
    id: '4',
    name: 'Vehicle Manager',
    permissions: ['vehicles', 'maintenance'],
    groupCount: 1,
    userCount: 12,
    color: 'cyan'
  },
];

export default function AdminManageRolesPage() {
  const [search, setSearch] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewMembersModalOpen, setViewMembersModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [newMemberModalOpen, setNewMemberModalOpen] = useState(false);
  const [newRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null as any);

  const filteredRoles = ADMIN_ROLES_MOCK.filter(role =>
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  const permissionCategories = [
    'user_management',
    'hotel_approval',
    'financials', 
    'groupworks_full',
    'reports_admin'
  ];

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setEditModalOpen(true);
  };

  const handleViewMembers = (role: any) => {
    setSelectedRole(role);
    setViewMembersModalOpen(true);
  };

  const onMembersModalReturn = () => {
    // Refresh roles list or perform any return action
    console.log('Returned from ViewMembers modal for role:', selectedRole?.name);
    // Could trigger refetch here if using real data
  };

  const handleNewMember = () => {
    setNewMemberModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditModalOpen(false);
    setViewMembersModalOpen(false);
    setDeleteModalOpen(false);
    setNewMemberModalOpen(false);
    setSelectedRole(null);
  };

  const handleSaveRole = (roleData: any) => {
    console.log('Role saved:', roleData);
    // Update logic here
  };

  const handleSaveNewMember = (memberData: any) => {
    console.log('New member saved:', memberData);
    // Save logic here
  };

  return (

    <div>
      
      <DeleteRoleModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        roleName={selectedRole?.name || ''}
        userCount={selectedRole?.userCount || 0}
        onDelete={() => {
          console.log('Role deleted:', selectedRole?.name);
          setDeleteModalOpen(false);
        }}
      />

      <EditRoleModal 
        isOpen={editModalOpen}
        onClose={handleCloseModal}
        roleId={selectedRole?.id || ''}
        roleName={selectedRole?.name || ''}
        onSave={handleSaveRole}
      />

      <ViewMembersModal 
        isOpen={viewMembersModalOpen}
        onClose={handleCloseModal}
        onReturn={onMembersModalReturn}
        roleName={selectedRole?.name || ''}
        roleId={selectedRole?.id || ''}
        memberCount={selectedRole?.userCount || 0}
      />


      <NewMemberModal 
        isOpen={newMemberModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNewMember}
      />

      <NewRoleModal 
        isOpen={newRoleModalOpen}
        onClose={() => setNewRoleModalOpen(false)}
        onSave={(roleData) => {
          console.log('New role created:', roleData);
          // Add to ADMIN_ROLES_MOCK or API call
          setNewRoleModalOpen(false);
        }}
      />


      <div className="flex items-center gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-3xl mb-2">Rôles & Permissions GroupWorks</h1>
          <p className="text-2xl text-gray-400">Gestion centralisée des accès et approbations</p>
        </div>

        <button className="px-10 py-5 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 text-white font-bold rounded-3xl shadow-3xl hover:shadow-violet-500/50 transition-all whitespace-nowrap" onClick={() => setNewRoleModalOpen(true)}>
          <Plus className="inline mr-3" size={24} />
          Nouveau rôle
        </button>

      </div>

      {/* Search & Filter */}
      <div className="bg-gradient-to-r from-slate-900/70 to-slate-900/30 backdrop-blur-xl rounded-4xl p-8 border border-purple-500/30 mb-12 shadow-3xl">
        <div className="flex items-center gap-6">
          <div className="relative flex-1 max-w-lg">
            <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-400" />
            <input
              type="text"
              placeholder="Rechercher rôle ou permission..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-slate-800/60 border border-slate-700/50 rounded-3xl text-white placeholder-gray-500 text-lg font-medium focus:outline-none focus:ring-4 focus:ring-violet-500/40 focus:border-violet-500/60 shadow-xl"
            />
          </div>
          <div className="flex gap-3">
            <button className="p-4 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-3xl text-gray-400 hover:text-white transition-all shadow-lg flex items-center gap-2">
              <Filter size={20} />
              <span>Filtres</span>
            </button>
            <button className="p-4 bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/50 border border-emerald-500/40 rounded-3xl text-emerald-300 hover:text-emerald-200 transition-all shadow-lg flex items-center gap-2">
              <Users size={20} />
              <span>Membres</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRoles.map((role) => (

          <div key={role.id} className="group bg-gradient-to-br from-slate-900/80 via-purple-900/20 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-6 shadow-2xl hover:shadow-[0_25px_40px_-10px_rgba(168,85,247,0.3)] hover:border-purple-500/60 hover:scale-[1.01] transition-all duration-300 overflow-hidden relative">

              {/* No top buttons - moved to bottom above member button */}
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-shrink-0 p-4 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl border-2 border-violet-400/40 shadow-xl">
                    <Shield size={28} className="text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent drop-shadow-xl truncate">{role.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                      <span>{role.userCount} users</span>
                      <span>{role.groupCount} groupes</span>
                    </div>
                  </div>
                </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-violet-400 rounded-full"></div>
                <span>{role.permissions.length} permissions</span>
              </div>

              <div className="flex flex-col gap-2 pt-4 mt-auto">
                <div className="flex gap-1">
                  <button className="flex-1 p-2 bg-gradient-to-r from-violet-600/70 to-purple-600/70 hover:from-violet-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-violet-400/30 transition-all flex items-center gap-1 justify-center" onClick={() => handleEditRole(role)}>
                    <Edit3 size={12} />
                    Modifier
                  </button>
                <button className="flex-1 p-2 bg-gradient-to-r from-red-600/70 to-rose-600/70 hover:from-red-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-red-400/30 transition-all flex items-center gap-1 justify-center" onClick={() => setDeleteModalOpen(true)}>
                    <Trash2 size={12} />
                    Supprimer
                  </button>
                </div>
                <button className="w-full p-3 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 hover:from-emerald-500 text-white rounded-2xl text-sm font-bold shadow-lg hover:shadow-emerald-500/50 transition-all flex items-center gap-2 justify-center" onClick={() => handleViewMembers(role)}>
                  <Users size={14} />
                  Voir membres ({role.userCount})
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRoles.length === 0 && (
        <div className="text-center py-40">
          <Shield size={96} className="mx-auto mb-12 text-gray-600 opacity-40" />
          <h3 className="text-4xl font-bold text-white mb-6 drop-shadow-2xl">Aucun rôle trouvé</h3>
          <p className="text-2xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">Ajustez votre recherche ou créez le premier rôle GroupWorks pour organiser les permissions</p>
          <button className="px-16 py-8 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 text-white font-black rounded-4xl shadow-3xl hover:shadow-violet-500/50 transition-all text-2xl flex items-center gap-4 mx-auto" onClick={handleNewMember}>
            <Users size={32} />
            Nouveau membre
          </button>
        </div>
      )}
    </div>
  );
}

