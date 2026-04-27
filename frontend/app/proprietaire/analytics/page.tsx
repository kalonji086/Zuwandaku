'use client';

import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Eye, Heart, DollarSign, Calendar } from 'lucide-react';

const analyticsData = [
  { month: 'Jan', views: 400, inquiries: 240, bookings: 120 },
  { month: 'Fév', views: 600, inquiries: 320, bookings: 180 },
  { month: 'Mar', views: 800, inquiries: 400, bookings: 240 },
  { month: 'Avr', views: 1000, inquiries: 500, bookings: 320 },
  { month: 'Mai', views: 1200, inquiries: 600, bookings: 400 },
  { month: 'Juin', views: 1400, inquiries: 700, bookings: 480 },
];

const propertyStats = [
  { name: 'Visites', value: 8500, trend: '+25%', icon: Eye, color: 'text-blue-400' },
  { name: 'Intérêts', value: 342, trend: '+18%', icon: Heart, color: 'text-red-400' },
  { name: 'Revenus', value: 12500, trend: '+42%', icon: DollarSign, color: 'text-emerald-400', suffix: ' USD' },
  { name: 'Jours en ligne', value: 156, trend: '+5%', icon: Calendar, color: 'text-purple-400', suffix: ' j' },
];

export default function ProprietaireAnalytics() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <TrendingUp size={28} />
          Statistiques et performance
        </h1>
        <p className="text-gray-400 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {propertyStats.map((stat) => (
          <div key={stat.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-white">
                  {stat.value.toLocaleString()}{stat.suffix || ''}
                </p>
              </div>
              <div className={`p-3 bg-gray-800 rounded-lg ${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <p className="text-sm font-semibold text-emerald-400">{stat.trend} ce mois</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart - Traffic */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Évolution du trafic</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Visites" strokeWidth={2} />
              <Line type="monotone" dataKey="inquiries" stroke="#8b5cf6" name="Demandes" strokeWidth={2} />
              <Line type="monotone" dataKey="bookings" stroke="#10b981" name="Réservations" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart - Revenue */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Revenus par mois</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#3b82f6" name="Réservations" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-bold text-white mb-6">Biens les plus performants</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-4 px-4 text-gray-400 font-semibold">Bien</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">Visites</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">Demandes</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">Revenus</th>
                <th className="text-right py-4 px-4 text-gray-400 font-semibold">Taux conv.</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Maison Gombe', visits: 2456, inquiries: 142, revenue: 5200, conversion: '5.8%' },
                { name: 'Appartement Kinshasa', visits: 1823, inquiries: 98, revenue: 3800, conversion: '5.4%' },
                { name: 'Parcelle Mont-Ngafula', visits: 1456, inquiries: 76, revenue: 2100, conversion: '5.2%' },
                { name: 'Bureau Plateau', visits: 1234, inquiries: 64, revenue: 1800, conversion: '5.1%' },
              ].map((prop, idx) => (
                <tr key={idx} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all">
                  <td className="py-4 px-4 text-white font-medium">{prop.name}</td>
                  <td className="py-4 px-4 text-right text-gray-300">{prop.visits.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right text-gray-300">{prop.inquiries}</td>
                  <td className="py-4 px-4 text-right text-emerald-400 font-semibold">${prop.revenue.toLocaleString()}</td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-emerald-400 font-semibold">{prop.conversion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
