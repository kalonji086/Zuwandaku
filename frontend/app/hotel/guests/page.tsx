"use client";

import { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, UserCheck, Users, Award, Eye, Edit3, Trash2, UserPlus, DollarSign, Phone, MapPin, Calendar } from 'lucide-react';
import ClientDetailsModal from './components/ClientDetailsModal';
import NewClientModal from './components/NewClientModal';
import EditClientModal from './components/EditClientModal';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  lastStay: string;
  totalStays: number;
  totalSpent: number;
  status: 'active' | 'vip' | 'inactive';
  notes: string;
}

const MOCK_CLIENTS: Client[] = [
  {
    id: 'G001',
    name: 'Marie Dubois',
    email: 'marie.dubois@email.com',
    phone: '+243 812 345 678',
    address: 'Kinshasa, Gombe',
    lastStay: '2024-12-15',
    totalStays: 12,
    totalSpent: 2450,
    status: 'vip',
    notes: 'Client fidèle, chambre deluxe préférée, allergies: arachides'
  },
  {
    id: 'G002',
    name: 'Paul Martin',
    email: 'paul.martin@email.com',
    phone: '+243 999 123 456',
    address: 'Lubumbashi, Katanga',
    lastStay: '2024-12-10',
    totalStays: 5,
    totalSpent: 850,
    status: 'active',
    notes: 'Business traveler, toujours petit-déjeuner continental'
  },
  {
    id: 'G003',
    name: 'Sophie Laurent',
    email: 'sophie.laurent@email.com',
    phone: '+243 817 789 012',
    address: 'Goma, Nord-Kivu',
    lastStay: '2024-12-12',
    totalStays: 3,
    totalSpent: 450,
    status: 'active',
    notes: 'Famille avec 2 enfants, chambre familiale recommandée'
  },
  {
    id: 'G004',
    name: 'Jean-Pierre Muteba',
    email: 'jean.muteba@email.com',
    phone: '+243 985 654 321',
    address: 'Kinshasa, Limete',
    lastStay: '2024-11-28',
    totalStays: 8,
    totalSpent: 1200,
    status: 'inactive',
    notes: 'Dernière visite annulaire, contacter pour promo'
  },
  // Add more for pagination demo
  {
    id: 'G005',
    name: 'Fatima Kabongo',
    email: 'fatima.kabongo@email.com',
    phone: '+243 821 456 789',
    address: 'Bukavu',
    lastStay: '2024-12-08',
    totalStays: 7,
    totalSpent: 980,
    status: 'vip',
    notes: 'VIP corporate, toujours suite exécutive'
  },
];

const formatNum = (n: number) => n.toLocaleString('fr-FR');

export default function GuestsPage() {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [filteredClients, setFilteredClients] = useState<Client[]>(MOCK_CLIENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'vip' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [clientsPerPage] = useState(10);
  
  // Modals state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Stats
  const totalClients = clients.length;
  const vipClients = clients.filter(c => c.status === 'vip').length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalRevenue = clients.reduce((sum, c) => sum + c.totalSpent, 0);

  useEffect(() => {
    let filtered = [...clients];

    if (searchTerm) {
      filtered = filtered.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(client => client.status === statusFilter);
    }

    setFilteredClients(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, clients]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const openDetails = (client: Client) => {
    setSelectedClient(client);
    setIsDetailsOpen(true);
  };

  const openEdit = (client: Client) => {
    setSelectedClient(client);
    setIsEditOpen(true);
  };

  const deleteClient = (id: string) => {
    setClients(clients.filter(c => c.id !== id));
  };

  const addClient = (newClient: Omit<Client, 'id' | 'totalStays' | 'totalSpent'>) => {
    const client: Client = {
      ...newClient,
      id: `G${String(Math.random()).slice(2,7)}`,
      totalStays: 0,
      totalSpent: 0,
      status: 'active' as const
    };
    setClients([client, ...clients]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(clients.map(c => c.id === updatedClient.id ? updatedClient : c));
  };

  const exportCSV = () => {
    const csv = [
      ['ID', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Statut', 'Séjours', 'Dépensé'],
      ...filteredClients.map(c => [c.id, c.name, c.email, c.phone, c.address, c.status, c.totalStays, c.totalSpent])
    ].map(row => row.join(',')).join('\\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent drop-shadow-3xl mb-2">
            Clients
          </h1>
          <p className="text-2xl text-gray-400">Gestion complète des clients hôtel</p>
        </div>
        <button 
          onClick={() => setIsNewOpen(true)}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold px-10 py-6 rounded-4xl shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center gap-4 text-xl"
        >
          <UserPlus size={28} />
          Nouveau client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-slate-900/80 to-blue-900/20 backdrop-blur-xl p-8 rounded-4xl border border-blue-500/30 shadow-3xl group hover:shadow-blue-500/30">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{totalClients}</p>
          <p className="text-xl text-blue-400 font-bold">Total clients</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-emerald-900/20 backdrop-blur-xl p-8 rounded-4xl border border-emerald-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <UserCheck size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{vipClients}</p>
          <p className="text-xl text-emerald-400 font-bold">VIP</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-yellow-900/20 backdrop-blur-xl p-8 rounded-4xl border border-yellow-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Award size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{activeClients}</p>
          <p className="text-xl text-yellow-400 font-bold">Actifs</p>
        </div>

        <div className="bg-gradient-to-br from-slate-900/80 to-purple-900/20 backdrop-blur-xl p-8 rounded-4xl border border-purple-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <DollarSign size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">${formatNum(totalRevenue)}</p>
          <p className="text-xl text-purple-400 font-bold">CA généré</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-r from-slate-900/50 to-gray-900/20 backdrop-blur-xl rounded-4xl p-8 border border-gray-700/50 flex flex-col md:flex-row gap-6 items-stretch md:items-center">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-gray-800/60 border border-gray-700 rounded-4xl text-white placeholder-gray-400 text-lg focus:ring-4 focus:ring-orange-500/40 focus:border-orange-500/50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-8 py-5 bg-gray-800/60 border border-gray-700 rounded-4xl text-white focus:ring-4 focus:ring-orange-500/40 font-medium"
          >
            <option value="all">Tous statuts</option>
            <option value="active">Actifs</option>
            <option value="vip">VIP</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={exportCSV}
            className="px-8 py-5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 text-white font-bold rounded-4xl shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center gap-3"
          >
            <Download size={20} />
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-r from-slate-900/20 to-gray-900/10 backdrop-blur-xl rounded-4xl border border-gray-700/30 overflow-hidden shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-gray-700/50">ID</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-gray-700/50">Client</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-gray-700/50">Contact</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-gray-700/50">Adresse</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-gray-700/50">Stats</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-gray-700/50">Statut</th>
                <th className="w-44"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {currentClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-800/50 transition-all">
                  <td className="px-8 py-6 font-mono text-lg text-gray-300">{client.id}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {client.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-xl text-white">{client.name}</p>
                        <p className="text-sm text-gray-400">{client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-gray-300">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone size={18} />
                      <span className="font-medium">{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={18} />
                      <span>{client.lastStay}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={18} />
                      <span className="text-gray-300">{client.address}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-emerald-400 font-bold">
                        <Users size={16} />
                        {client.totalStays} séjours
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-400 font-bold">
                        <DollarSign size={16} />
                        ${formatNum(client.totalSpent)}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-2 rounded-full border-2 font-bold text-sm capitalize ${
                      client.status === 'vip' ? 'bg-emerald-100/80 border-emerald-400 text-emerald-800' :
                      client.status === 'active' ? 'bg-blue-100/80 border-blue-400 text-blue-800' :
                      'bg-gray-100/80 border-gray-400 text-gray-800'
                    }`}>
                      {client.status === 'vip' ? 'VIP' : client.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openDetails(client)}
                        className="p-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 hover:text-blue-200 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center gap-2"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => openEdit(client)}
                        className="p-3 bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 rounded-2xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center gap-2"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => deleteClient(client.id)}
                        className="p-3 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 hover:text-red-200 rounded-2xl transition-all shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-800/50 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Page {currentPage} de {totalPages} ({filteredClients.length} clients)
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Précédent
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all ${
                    currentPage === number
                      ? 'bg-orange-600 text-white shadow-lg'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ClientDetailsModal
        isOpen={isDetailsOpen}
        client={selectedClient}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={() => {
          setIsDetailsOpen(false);
          openEdit(selectedClient!);
        }}
      />
      <NewClientModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onSave={addClient}
      />
      <EditClientModal
        isOpen={isEditOpen}
        client={selectedClient}
        onClose={() => setIsEditOpen(false)}
        onSave={updateClient}
        onDelete={() => {
          if (selectedClient) deleteClient(selectedClient.id);
          setIsEditOpen(false);
        }}
      />
    </div>
  );
}

