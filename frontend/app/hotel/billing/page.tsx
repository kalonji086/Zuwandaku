"use client";

import { useState, useEffect } from 'react';
import { Search, Download, Filter, Eye, Edit, Plus, Receipt, DollarSign, CreditCard, FileText, Calendar, CheckCircle, XCircle, Clock, TrendingUp, Users, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import InvoiceDetailsModal from './components/InvoiceDetailsModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import EditInvoiceModal from './components/EditInvoiceModal';
import type { Invoice } from './components/EditInvoiceModal';

const initialInvoices: Invoice[] = [
  {
    id: 'INV001',
    guestName: 'Marie Dubois',
    guestEmail: 'marie.dubois@email.com',
    guestPhone: '+243 991234567',
    roomNumber: '101',
    checkIn: '2024-12-15',
    checkOut: '2024-12-18',
    nights: 3,
    roomRate: 250,
    extras: ['Petit-déjeuner', 'Service ménage'],
    taxes: 18,
    totalAmount: 930,
    status: 'paid',
    paymentMethod: 'Carte',
    paidAmount: 930,
    remaining: 0,
    invoiceDate: '2024-12-15',
    notes: 'Client VIP - petit-déjeuner inclus gratuit',
  },
  {
    id: 'INV002',
    guestName: 'Paul Martin',
    guestEmail: 'paul.martin@email.com',
    guestPhone: '+243 998765432',
    roomNumber: '203',
    checkIn: '2024-12-16',
    checkOut: '2024-12-19',
    nights: 3,
    roomRate: 180,
    extras: ['Mini-bar'],
    taxes: 18,
    totalAmount: 576,
    status: 'partial',
    paymentMethod: 'Espèces',
    paidAmount: 300,
    remaining: 276,
    invoiceDate: '2024-12-16',
    notes: '',
  },
  {
    id: 'INV003',
    guestName: 'Sophie Laurent',
    guestEmail: 'sophie@email.com',
    guestPhone: '+243 997654321',
    roomNumber: '105',
    checkIn: '2024-12-17',
    checkOut: '2024-12-20',
    nights: 3,
    roomRate: 150,
    extras: [],
    taxes: 18,
    totalAmount: 531,
    status: 'pending',
    paymentMethod: '-',
    paidAmount: 0,
    remaining: 531,
    invoiceDate: '2024-12-17',
    notes: 'À envoyer rappel dans 3 jours',
  },
  {
    id: 'INV004',
    guestName: 'Jean Kabila',
    guestEmail: 'jean.kabila@company.com',
    guestPhone: '+243 991112223',
    roomNumber: '301',
    checkIn: '2024-12-10',
    checkOut: '2024-12-14',
    nights: 4,
    roomRate: 300,
    extras: ['Petit-déjeuner', 'Transfert aéroport'],
    taxes: 18,
    totalAmount: 1416,
    status: 'paid',
    paymentMethod: 'Virement',
    paidAmount: 1416,
    remaining: 0,
    invoiceDate: '2024-12-10',
    notes: 'Entreprise - TVA récupérable',
  },
  {
    id: 'INV005',
    guestName: 'Lucie Mbuyi',
    guestEmail: 'lucie.mbuyi@email.com',
    guestPhone: '+243 995556677',
    roomNumber: '112',
    checkIn: '2024-12-18',
    checkOut: '2024-12-21',
    nights: 3,
    roomRate: 200,
    extras: ['Service blanchisserie'],
    taxes: 18,
    totalAmount: 678,
    status: 'overdue',
    paymentMethod: 'Mobile Money',
    paidAmount: 100,
    remaining: 578,
    invoiceDate: '2024-12-18',
    notes: 'Relance envoyée - 2 jours de retard',
  },
];

function generateMockInvoices(count: number): Invoice[] {
  const statuses: Invoice['status'][] = ['paid', 'partial', 'pending', 'overdue'];
  const methods = ['Carte', 'Espèces', 'Virement', 'Mobile Money'];
  const rooms = Array.from({length: 20}, (_, i) => `Room ${100 + i}`);
  
  return Array.from({length: count}, (_, i) => {
    const nights = 2 + Math.floor(Math.random() * 5);
    const rate = 120 + Math.floor(Math.random() * 180);
    const extrasCount = Math.floor(Math.random() * 3);
    const subtotal = nights * rate + extrasCount * 50;
    const taxes = 18;
    const total = subtotal + Math.round(subtotal * taxes / 100);
    const paid = Math.floor(Math.random() * total * 0.8);
    
    return {
      id: `INV00${i + 6}`,
      guestName: `Client ${i + 6}`,
      guestEmail: `client${i + 6}@hotel.com`,
      guestPhone: `+243 99${(i + 6) % 100}000000`,
      roomNumber: rooms[Math.floor(Math.random() * rooms.length)],
      checkIn: '2024-12-12',
      checkOut: '2024-12-15',
      nights,
      roomRate: rate,
      extras: Array.from({length: extrasCount}, () => ['Petit-déjeuner', 'Mini-bar', 'Blanchisserie'][Math.floor(Math.random() * 3)]),
      taxes,
      totalAmount: total,
      status: statuses[Math.floor(Math.random() * statuses.length)] as Invoice['status'],
      paymentMethod: methods[Math.floor(Math.random() * methods.length)],
      paidAmount: paid,
      remaining: total - paid,
      invoiceDate: '2024-12-12',
      notes: Math.random() > 0.7 ? 'Note importante' : '',
    };
  });
}

const mockInvoices: Invoice[] = [
  ...initialInvoices,
  ...generateMockInvoices(15)
];

export default function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Invoice['status']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'status'>('date');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setInvoices(mockInvoices.map(inv => ({
      ...inv,
      remaining: inv.totalAmount - inv.paidAmount,
    })));
  }, []);

  useEffect(() => {
    let filtered = [...invoices];

    // Search
    if (searchTerm.trim()) {
      filtered = filtered.filter(inv => 
        inv.guestName.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        inv.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        inv.roomNumber.toLowerCase().includes(searchTerm.toLowerCase().trim())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(inv => inv.status === statusFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime();
        case 'amount':
          return b.totalAmount - a.totalAmount;
        case 'status':
          const statusOrder = { 'paid': 3, 'partial': 2, 'pending': 1, 'overdue': 0 };
          return statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder];
        default:
          return 0;
      }
    });

    setFilteredInvoices(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sortBy, invoices]);

  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);

  const stats = {
    total: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
    paid: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.totalAmount, 0),
    pending: invoices.filter(inv => inv.status === 'pending').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.remaining, 0),
  };

  const exportCSV = () => {
    const csvContent = [
      ['ID Facture', 'Client', 'Chambre', 'Arrivée', 'Nuits', 'Montant Total', 'Payé', 'Restant', 'Statut', 'Méthode'],
      ...filteredInvoices.map(inv => [
        inv.id,
        inv.guestName,
        inv.roomNumber,
        inv.checkIn,
        inv.nights,
        inv.totalAmount.toLocaleString('fr-FR'),
        inv.paidAmount.toLocaleString('fr-FR'),
        inv.remaining.toLocaleString('fr-FR'),
        inv.status,
        inv.paymentMethod,
      ])
    ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `factures-${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewInvoice = (newInvoice: Invoice) => {
    setInvoices(prev => [newInvoice, ...prev]);
  };

  const handleUpdateInvoice = (updatedInvoice: Invoice) => {
    setInvoices(prev => prev.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
  };

  const getStatusBadge = (status: Invoice['status']) => {
    const colors = {
      paid: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-emerald-300/50',
      partial: 'bg-yellow-100 text-yellow-800 border-yellow-300 ring-yellow-300/50',
      pending: 'bg-blue-100 text-blue-800 border-blue-300 ring-blue-300/50',
      overdue: 'bg-red-100 text-red-800 border-red-300 ring-red-300/50',
    };
    const labels = {
      paid: 'Payée',
      partial: 'Partielle',
      pending: 'En attente',
      overdue: 'En retard',
    };
    
    return (
      <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold border ring-2 ring-inset ${colors[status]}`}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-500 bg-clip-text text-transparent drop-shadow-3xl mb-3">
            Facturation
          </h1>
          <p className="text-2xl text-gray-400 max-w-md">Gestion des factures, paiements et relances</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600/90 to-teal-600/90 backdrop-blur-sm border border-emerald-500/30 hover:from-emerald-700 text-white font-bold rounded-4xl shadow-xl hover:shadow-emerald-500/25 transition-all whitespace-nowrap"
          >
            <Download size={20} />
            <span>Exporter CSV</span>
          </button>
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600/90 to-indigo-600/90 backdrop-blur-sm border border-blue-500/30 hover:from-blue-700 text-white font-bold rounded-4xl shadow-xl hover:shadow-blue-500/25 transition-all whitespace-nowrap"
          >
            <Plus size={20} />
            <span>Nouvelle facture</span>
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/30 backdrop-blur-xl rounded-4xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher client, ID, chambre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-700/50 border border-slate-600 rounded-3xl text-white placeholder-slate-400 focus:ring-4 focus:ring-orange-500/30 focus:border-orange-500/50 text-lg font-medium"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-orange-500/30 font-medium text-lg"
          >
            <option value="all">Tous statuts ({filteredInvoices.length})</option>
            <option value="paid">Payées</option>
            <option value="partial">Partielles</option>
            <option value="pending">En attente</option>
            <option value="overdue">En retard</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('date')}
              className={`flex-1 p-4 rounded-3xl border font-medium transition-all ${sortBy === 'date' ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'}`}
            >
              <Calendar size={18} className="inline mr-2" />
              Date
            </button>
            <button
              onClick={() => setSortBy('amount')}
              className={`flex-1 p-4 rounded-3xl border font-medium transition-all ${sortBy === 'amount' ? 'bg-orange-500/20 border-orange-500 text-orange-300 shadow-md' : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:border-slate-500'}`}
            >
              <DollarSign size={18} className="inline mr-2" />
              Montant
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>{filteredInvoices.length} factures</span>
            <Filter size={16} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="group bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 backdrop-blur-xl p-10 rounded-4xl border border-emerald-500/30 shadow-3xl hover:shadow-emerald-500/25 hover:scale-[1.02] transition-all cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center group-hover:bg-emerald-500/30 transition-all shadow-lg">
              <DollarSign size={28} className="text-emerald-400" />
            </div>
          </div>
          <p className="text-5xl font-black text-white mb-3">${stats.total.toLocaleString('fr-FR')}</p>
          <p className="text-2xl text-emerald-300 font-bold">Total facturé</p>
          <p className="text-emerald-200 text-lg mt-1">Ce mois</p>
        </div>

        <div className="group bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-indigo-500/10 backdrop-blur-xl p-10 rounded-4xl border border-blue-500/30 shadow-3xl hover:shadow-blue-500/25 hover:scale-[1.02] transition-all cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-blue-500/20 rounded-3xl flex items-center justify-center group-hover:bg-blue-500/30 transition-all shadow-lg">
              <CheckCircle size={28} className="text-blue-400" />
            </div>
          </div>
          <p className="text-5xl font-black text-white mb-3">${stats.paid.toLocaleString('fr-FR')}</p>
          <p className="text-2xl text-blue-300 font-bold">Payé</p>
          <p className="text-blue-200 text-lg mt-1">{stats.pending} en attente</p>
        </div>

        <div className="group bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-orange-500/10 backdrop-blur-xl p-10 rounded-4xl border border-yellow-500/30 shadow-3xl hover:shadow-yellow-500/25 hover:scale-[1.02] transition-all cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-yellow-500/20 rounded-3xl flex items-center justify-center group-hover:bg-yellow-500/30 transition-all shadow-lg">
              <Clock size={28} className="text-yellow-400" />
            </div>
          </div>
          <p className="text-5xl font-black text-white mb-3">${stats.overdue.toLocaleString('fr-FR')}</p>
          <p className="text-2xl text-yellow-300 font-bold">En retard</p>
          <p className="text-yellow-200 text-lg mt-1">À relancer</p>
        </div>

        <div className="group bg-gradient-to-br from-slate-500/10 via-slate-500/5 to-slate-700/10 backdrop-blur-xl p-10 rounded-4xl border border-slate-500/30 shadow-3xl hover:shadow-slate-500/25 hover:scale-[1.02] transition-all cursor-default">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-slate-500/20 rounded-3xl flex items-center justify-center group-hover:bg-slate-500/30 transition-all shadow-lg">
              <Receipt size={28} className="text-slate-400" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-3">{invoices.length}</p>
          <p className="text-2xl text-slate-300 font-bold">Total factures</p>
          <p className="text-slate-200 text-lg mt-1">Toutes périodes</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/20 backdrop-blur-xl rounded-4xl border border-slate-700/50 overflow-hidden shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/70 sticky top-0 z-10">
              <tr>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">ID Facture</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Client</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Chambre</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Nuits</th>
                <th className="px-8 py-6 text-right text-xl font-bold text-white border-b border-slate-700/50">Total</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Statut</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Restant</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Date</th>
                <th className="px-8 py-6 text-left text-xl font-bold text-white border-b border-slate-700/50">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {paginatedInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-slate-800/50 group transition-all border-b border-slate-700/30">
                  <td className="px-8 py-6 font-mono text-lg font-bold text-white">
                    <span className="text-orange-400">#</span>{invoice.id}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-white text-lg">{invoice.guestName}</div>
                    <div className="text-slate-400 text-sm">{invoice.roomNumber}</div>
                  </td>
                  <td className="px-8 py-6 font-mono text-lg text-white">{invoice.nights}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="text-2xl font-black text-emerald-400">${invoice.totalAmount.toLocaleString('fr-FR')}</div>
                    <div className="text-slate-400 text-sm">{invoice.paymentMethod}</div>
                  </td>
                  <td className="px-8 py-6">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`text-xl font-bold ${
                      invoice.remaining === 0 ? 'text-emerald-400' : 'text-orange-400'
                    }`}>
                      ${invoice.remaining.toLocaleString('fr-FR')}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-mono">
                    {new Date(invoice.invoiceDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex gap-3 opacity-50 group-hover:opacity-100 transition-all">
                      <button 
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setIsDetailsOpen(true);
                        }}
                        className="p-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-300 hover:text-blue-200 rounded-2xl transition-all shadow-lg hover:shadow-blue-500/25"
                        title="Détails"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          setEditingInvoice(invoice);
                          setIsEditOpen(true);
                        }}
                        className="p-3 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/30 text-orange-300 hover:text-orange-200 rounded-2xl transition-all shadow-lg hover:shadow-orange-500/25"
                        title="Modifier"
                      >
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No results */}
      {filteredInvoices.length === 0 && (
        <div className="text-center py-32 border-2 border-dashed border-slate-700/50 rounded-4xl bg-slate-900/30">
          <Receipt size={96} className="mx-auto mb-8 text-slate-600 opacity-50" />
          <h3 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">Aucune facture</h3>
          <p className="text-2xl text-slate-500 mb-12 max-w-2xl mx-auto">Aucune facture ne correspond à vos filtres de recherche</p>
          <button 
            onClick={() => setIsNewModalOpen(true)}
            className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl rounded-4xl shadow-2xl hover:shadow-blue-500/50 transition-all"
          >
            Créer première facture
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredInvoices.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800/50 hover:bg-slate-700 border border-slate-600 rounded-2xl transition-all disabled:border-slate-700"
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages, currentPage - 2 + i));
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-12 h-12 rounded-2xl font-bold transition-all flex items-center justify-center ${
                  currentPage === pageNum
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-slate-800/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-3 disabled:opacity-50 disabled:cursor-not-allowed bg-slate-800/50 hover:bg-slate-700 border border-slate-600 rounded-2xl transition-all disabled:border-slate-700"
          >
            <ChevronRight size={20} />
          </button>
          <div className="text-slate-400 text-sm ml-6">
            Page {currentPage} sur {totalPages} ({filteredInvoices.length} factures)
          </div>
        </div>
      )}

      {/* Modals */}
      <InvoiceDetailsModal 
        isOpen={isDetailsOpen}
        invoice={selectedInvoice}
        onClose={() => setIsDetailsOpen(false)}
        onEdit={(inv) => {
          setSelectedInvoice(null);
          setEditingInvoice(inv);
          setIsDetailsOpen(false);
          setIsEditOpen(true);
        }}
      />
      <NewInvoiceModal 
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleNewInvoice}
      />
      <EditInvoiceModal 
        isOpen={isEditOpen}
        invoice={editingInvoice}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdateInvoice}
      />
    </div>
  );
}

