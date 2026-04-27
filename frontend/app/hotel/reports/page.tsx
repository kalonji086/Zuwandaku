"use client";

import { useState, useEffect } from 'react';
import { Search, Download, Filter, Eye, Edit, Plus, Trash2, Receipt, DollarSign, Users, Bed, TrendingUp, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import ReportDetailsModal from './components/ReportDetailsModal';
import NewReportModal from './components/NewReportModal';
import EditReportModal from './components/EditReportModal';
import type { Report } from './components/ReportDetailsModal';

const mockReports: Report[] = [
  {
    id: 'RPT001',
    title: 'Rapport Mensuel Décembre 2024',
    type: 'revenue',
    period: '1-31 Décembre 2024',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    metrics: { totalRevenue: 45230, avgDaily: 1459, growth: 18.5 },
    data: [
      { date: '2024-12-01', revenue: 1200 },
      { date: '2024-12-15', revenue: 1650 },
      // more data...
    ],
    notes: 'Pic pendant fêtes, excellente performance.',
    createdAt: '2025-01-05',
  },
  {
    id: 'RPT002',
    title: 'Analyse Occupation Chambres',
    type: 'occupation',
    period: 'Q4 2024',
    startDate: '2024-10-01',
    endDate: '2024-12-31',
    metrics: { avgOccupation: 92.5, peakDay: 98.2, lowDay: 85.1 },
    data: [],
    notes: 'Taux record, stratégie pricing efficace.',
    createdAt: '2025-01-03',
  },
  // more mock...
];

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Report['type']>('all');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setReports(mockReports);
  }, []);

  useEffect(() => {
    let filtered = [...reports];
    if (searchTerm.trim()) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.period.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter);
    }
    filtered.sort((a, b) => sortBy === 'date' ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() : 0);
    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [searchTerm, typeFilter, sortBy, reports]);

  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const exportCSV = () => {
    const csvContent = [
      ['ID', 'Titre', 'Type', 'Période', 'Créé le'],
      ...filteredReports.map(r => [r.id, r.title, r.type, r.period, r.createdAt])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rapports-${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
  };

  const handleNewReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
  };

  const handleUpdateReport = (updatedReport: Report) => {
    setReports(prev => prev.map(r => r.id === updatedReport.id ? updatedReport : r));
  };

  const handleDeleteReport = () => {
    if (editingReport) {
      setReports(prev => prev.filter(r => r.id !== editingReport.id));
      setEditingReport(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent drop-shadow-3xl mb-3">
            Rapports
          </h1>
          <p className="text-2xl text-gray-400 max-w-md">Analytics et statistiques détaillées</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button onClick={exportCSV} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-500/30 hover:from-emerald-700 text-white font-bold rounded-4xl shadow-xl hover:shadow-emerald-500/25 transition-all">
            <Download size={20} />
            Exporter CSV
          </button>
          <button onClick={() => setIsNewModalOpen(true)} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-500/30 hover:from-blue-700 text-white font-bold rounded-4xl shadow-xl hover:shadow-blue-500/25 transition-all">
            <Plus size={20} />
            Nouveau rapport
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/30 backdrop-blur-xl rounded-4xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input type="text" placeholder="Rechercher titre ou période..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-6 py-4 bg-slate-700/50 border border-slate-600 rounded-3xl text-white placeholder-slate-400 focus:ring-4 focus:ring-orange-500/30" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-3xl text-white focus:ring-4 focus:ring-orange-500/30 font-medium">
            <option value="all">Tous types ({filteredReports.length})</option>
            <option value="revenue">Revenus</option>
            <option value="occupation">Occupation</option>
            <option value="clients">Clients</option>
            <option value="bookings">Réservations</option>
          </select>
          <button onClick={() => setSortBy(sortBy === 'date' ? 'title' : 'date')} className="flex items-center gap-3 px-6 py-4 bg-slate-700/50 border border-slate-600 rounded-3xl hover:bg-slate-600 text-white font-medium">
            {sortBy === 'date' ? 'Titre' : 'Date'} ▼
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <div className="group bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-10 rounded-4xl border border-emerald-500/30 shadow-3xl hover:shadow-emerald-500/25 transition-all">
          <DollarSign size={32} className="text-emerald-400 mb-4" />
          <p className="text-4xl font-black text-white mb-2">${reports.reduce((sum, r) => sum + (r.metrics.totalRevenue || 0), 0).toLocaleString('fr-FR')}</p>
          <p className="text-emerald-300 font-bold text-xl">Total revenus</p>
        </div>
        <div className="group bg-gradient-to-br from-blue-500/10 to-indigo-500/10 p-10 rounded-4xl border border-blue-500/30 shadow-3xl hover:shadow-blue-500/25 transition-all">
          <Bed size={32} className="text-blue-400 mb-4" />
          <p className="text-4xl font-black text-white mb-2">{reports.filter(r => r.type === 'occupation').reduce((sum, r) => sum + (r.metrics.avgOccupation || 0), 0) / Math.max(1, reports.filter(r => r.type === 'occupation').length)}%</p>
          <p className="text-blue-300 font-bold text-xl">Occupation moyenne</p>
        </div>
        <div className="group bg-gradient-to-br from-purple-500/10 to-violet-500/10 p-10 rounded-4xl border border-purple-500/30 shadow-3xl hover:shadow-purple-500/25 transition-all">
          <Users size={32} className="text-purple-400 mb-4" />
          <p className="text-4xl font-black text-white mb-2">{reports.filter(r => r.type === 'clients').length}</p>
          <p className="text-purple-300 font-bold text-xl">Rapports clients</p>
        </div>
        <div className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 p-10 rounded-4xl border border-orange-500/30 shadow-3xl hover:shadow-orange-500/25 transition-all">
          <Receipt size={32} className="text-orange-400 mb-4" />
          <p className="text-4xl font-black text-white mb-2">{reports.length}</p>
          <p className="text-orange-300 font-bold text-xl">Total rapports</p>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/20 backdrop-blur-xl rounded-4xl border border-slate-700/50 overflow-hidden shadow-3xl">
        <table className="w-full">
          <thead className="bg-slate-800/70">
            <tr>
              <th className="px-8 py-6 text-left text-xl font-bold text-white">Titre</th>
              <th className="px-8 py-6 text-left text-xl font-bold text-white">Type</th>
              <th className="px-8 py-6 text-left text-xl font-bold text-white">Période</th>
              <th className="px-8 py-6 text-left text-xl font-bold text-white">Créé le</th>
              <th className="px-8 py-6 text-right text-xl font-bold text-white">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {paginatedReports.map((report) => (
              <tr key={report.id} className="hover:bg-slate-800/50 group transition-all">
                <td className="px-8 py-6 font-bold text-white">{report.title}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                    report.type === 'revenue' ? 'bg-emerald-200 text-emerald-800' :
                    report.type === 'occupation' ? 'bg-blue-200 text-blue-800' :
                    report.type === 'clients' ? 'bg-purple-200 text-purple-800' :
                    'bg-orange-200 text-orange-800'
                  }`}>
                    {report.type === 'revenue' ? 'Revenus' : report.type === 'occupation' ? 'Occupation' : report.type === 'clients' ? 'Clients' : 'Réservations'}
                  </span>
                </td>
                <td className="px-8 py-6 text-slate-300">{report.period}</td>
                <td className="px-8 py-6 text-sm text-slate-400 font-mono">{new Date(report.createdAt).toLocaleDateString('fr-FR')}</td>
                <td className="px-8 py-6">
                  <div className="flex gap-2 opacity-50 group-hover:opacity-100">
                    <button onClick={() => { setSelectedReport(report); setIsDetailsOpen(true); }} className="p-3 bg-blue-600/20 hover:bg-blue-600/40 border rounded-xl text-blue-300 hover:text-blue-200 transition-all">
                      <Eye size={18} />
                    </button>
                    <button onClick={() => { setEditingReport(report); setIsEditOpen(true); }} className="p-3 bg-orange-600/20 hover:bg-orange-600/40 border rounded-xl text-orange-300 hover:text-orange-200 transition-all">
                      <Edit size={18} />
                    </button>
                    <button className="p-3 bg-red-600/20 hover:bg-red-600/40 border rounded-xl text-red-300 hover:text-red-200 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-32 border-2 border-dashed border-slate-700/50 rounded-4xl bg-slate-900/30">
          <BarChart3 size={96} className="mx-auto mb-8 text-slate-600" />
          <h3 className="text-4xl font-bold text-white mb-6">Aucun rapport</h3>
          <p className="text-2xl text-slate-500 mb-12">Créez votre premier rapport d'analyse</p>
          <button onClick={() => setIsNewModalOpen(true)} className="px-12 py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl rounded-4xl shadow-2xl hover:shadow-blue-500/50">
            <Plus size={24} />
            Nouveau rapport
          </button>
        </div>
      )}

      {/* Pagination */}
      {filteredReports.length > ITEMS_PER_PAGE && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} className="p-3 disabled:opacity-50 bg-slate-800/50 hover:bg-slate-700 border border-slate-600 rounded-2xl">
            <ChevronLeft size={20} />
          </button>
          {Array.from({length: 5}, (_, i) => {
            const pageNum = Math.max(1, Math.min(filteredReports.length / ITEMS_PER_PAGE, currentPage - 2 + i));
            return <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`w-12 h-12 rounded-2xl font-bold ${currentPage === pageNum ? 'bg-indigo-500 text-white' : 'bg-slate-800/50 hover:bg-slate-700 text-slate-300'}`}>{pageNum}</button>;
          })}
          <button disabled={currentPage === Math.ceil(filteredReports.length / ITEMS_PER_PAGE)} onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredReports.length / ITEMS_PER_PAGE)))} className="p-3 disabled:opacity-50 bg-slate-800/50 hover:bg-slate-700 border border-slate-600 rounded-2xl">
            <ChevronRight size={20} />
          </button>
          <span className="text-slate-400 ml-6">Page {currentPage} / {Math.ceil(filteredReports.length / ITEMS_PER_PAGE)} ({filteredReports.length} rapports)</span>
        </div>
      )}

      <ReportDetailsModal isOpen={isDetailsOpen} report={selectedReport} onClose={() => setIsDetailsOpen(false)} />
      <NewReportModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} onCreate={handleNewReport} />
      <EditReportModal isOpen={isEditOpen} report={editingReport} onClose={() => setIsEditOpen(false)} onUpdate={handleUpdateReport} onDelete={handleDeleteReport} />
    </div>
  );
}


