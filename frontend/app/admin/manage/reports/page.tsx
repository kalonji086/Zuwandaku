"use client";

import { useState } from 'react';
import {
  BarChart3, LineChart, PieChart, Users, CheckCircle, Clock, TrendingUp, DollarSign,
  Download, Filter, CalendarDays, Activity, FileText
} from 'lucide-react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell } from 'recharts';

interface ReportData {
  month: string;
  approvals: number;
  rejections: number;
  pending: number;
}

const MONTHLY_DATA: ReportData[] = [
  { month: 'Jan', approvals: 25, rejections: 3, pending: 5 },
  { month: 'Fév', approvals: 32, rejections: 2, pending: 8 },
  { month: 'Mar', approvals: 28, rejections: 4, pending: 12 },
  { month: 'Avr', approvals: 41, rejections: 1, pending: 6 },
  { month: 'Mai', approvals: 35, rejections: 3, pending: 10 },
  { month: 'Juin', approvals: 48, rejections: 2, pending: 4 },
];

const ROLE_DATA = [
  { name: 'Admin Principal', value: 2, color: '#8B5CF6' },
  { name: 'Hotel Manager', value: 15, color: '#A78BFA' },
  { name: 'Property Agent', value: 28, color: '#C4B5FD' },
  { name: 'Vehicle Manager', value: 12, color: '#E879F9' },
];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

export default function AdminManageReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('30d');

  const stats = {
    totalRequests: 248,
    approvalRate: 89.5,
    avgProcessingTime: '2.3j',
    hotelsWithRequests: 14,
    highPriority: 23
  };

  const handleExport = (format: 'pdf' | 'excel' | 'csv') => {
    console.log(`Export ${format.toUpperCase()} reports`);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-3xl mb-2">
            Rapports RH & Approbations
          </h1>
          <p className="text-2xl text-gray-400">Analytics temps réel et export</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => handleExport('pdf')}
            className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-indigo-500/50 transition-all flex items-center gap-3"
          >
            <Download size={20} />
            PDF
          </button>
          <button 
            onClick={() => handleExport('excel')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all flex items-center gap-3"
          >
            <Download size={20} />
            Excel
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        <div className="group bg-gradient-to-br from-slate-900/80 to-indigo-900/20 backdrop-blur-xl p-8 rounded-4xl border border-indigo-500/30 shadow-3xl hover:shadow-indigo-400/30 transition-all">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <BarChart3 size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{stats.totalRequests}</p>
          <p className="text-xl text-indigo-400 font-bold">Demandes totales</p>
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
            <TrendingUp size={16} className="text-emerald-400" />
            +12% vs mois dernier
          </div>
        </div>

        <div className="group bg-gradient-to-br from-slate-900/80 to-emerald-900/20 backdrop-blur-xl p-8 rounded-4xl border border-emerald-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <CheckCircle size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{stats.approvalRate}%</p>
          <p className="text-xl text-emerald-400 font-bold">Taux approbation</p>
        </div>

        <div className="group bg-gradient-to-br from-slate-900/80 to-blue-900/20 backdrop-blur-xl p-8 rounded-4xl border border-blue-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Clock size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{stats.avgProcessingTime}</p>
          <p className="text-xl text-blue-400 font-bold">Temps traitement</p>
        </div>

        <div className="group bg-gradient-to-br from-slate-900/80 to-orange-900/20 backdrop-blur-xl p-8 rounded-4xl border border-orange-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Activity size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{stats.hotelsWithRequests}</p>
          <p className="text-xl text-orange-400 font-bold">Hôtels actifs</p>
        </div>

        <div className="group bg-gradient-to-br from-slate-900/80 to-red-900/20 backdrop-blur-xl p-8 rounded-4xl border border-red-500/30 shadow-3xl">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl flex items-center justify-center shadow-2xl">
              <Users size={24} className="text-white" />
            </div>
          </div>
          <p className="text-4xl font-black text-white mb-2">{stats.highPriority}</p>
          <p className="text-xl text-red-400 font-bold">Priorité haute</p>
        </div>
      </div>

      {/* Reports Tabs */}
      <div className="bg-gradient-to-r from-slate-900/50 to-slate-900/20 backdrop-blur-xl rounded-4xl border border-slate-700/50 p-8 shadow-3xl mb-12">
        <div className="flex flex-wrap gap-4 border-b border-slate-700/50 pb-8 mb-8">
          <button 
            className={`px-8 py-4 font-bold rounded-3xl transition-all ${activeTab === 'overview' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-2xl' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 size={20} className="inline mr-2" />
            Vue d'ensemble
          </button>
          <button 
            className={`px-8 py-4 font-bold rounded-3xl transition-all ${activeTab === 'monthly' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-2xl' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('monthly')}
          >
            <LineChart size={20} className="inline mr-2" />
            Mensuel
          </button>
          <button 
            className={`px-8 py-4 font-bold rounded-3xl transition-all ${activeTab === 'roles' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-2xl' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('roles')}
          >
            <PieChart size={20} className="inline mr-2" />
            Rôles
          </button>
          <button 
            className={`px-8 py-4 font-bold rounded-3xl transition-all ${activeTab === 'hotels' ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-2xl' : 'text-gray-400 hover:text-white hover:bg-slate-800'}`}
            onClick={() => setActiveTab('hotels')}
          >
            <Users size={20} className="inline mr-2" />
            Hôtels
          </button>
        </div>

        {activeTab === 'overview' && (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={MONTHLY_DATA}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" fontSize={14} />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              <Bar dataKey="approvals" fill="#10B981" radius={[8, 8, 0, 0]} name="Approuvées" />
              <Bar dataKey="pending" fill="#F59E0B" radius={[8, 8, 0, 0]} name="En attente" />
              <Bar dataKey="rejections" fill="#EF4444" radius={[8, 8, 0, 0]} name="Rejetées" />
            </BarChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'monthly' && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={MONTHLY_DATA}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="approvals" stroke="#10B981" strokeWidth={4} dot={{ fill: '#10B981', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={4} dot={{ fill: '#F59E0B', strokeWidth: 2 }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeTab === 'roles' && (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={ROLE_DATA} cx="50%" cy="50%" outerRadius={100} dataKey="value" nameKey="name">
                {ROLE_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Filters & Export */}
      <div className="flex gap-6 mb-12">
        <select className="px-6 py-4 bg-slate-800/70 border border-slate-700 rounded-3xl text-white focus:ring-4 focus:ring-indigo-500/40 font-medium">
          <option>Période : 30 derniers jours</option>
          <option>Ce mois</option>
          <option>Année en cours</option>
        </select>
        <div className="flex-1" />
        <button className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-3xl shadow-2xl hover:shadow-indigo-500/50 transition-all">
          Générer rapport complet
        </button>
      </div>
    </div>
  );
}

