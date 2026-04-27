'use client';

import { Home, Car, MapPin, DollarSign, Users } from 'lucide-react';
import { useProperties, useVehicles } from '../../../lib/hooks';
import { useProvinces } from '../../../lib/hooks/useProvinces';

export default function BiensPage() {
  const { data: properties = [] } = useProperties();
  const { data: vehicles = [] } = useVehicles();
  const { data: provinces = [] } = useProvinces();

  const stats = {
    properties: properties.length,
    vehicles: vehicles.length,
    provinces: provinces.length,
    totalValue: properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0) + vehicles.reduce((sum: number, v: any) => sum + (v.priceSale || 0), 0)
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Biens & Véhicules</h1>
        <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
          <span className="px-3 py-1 text-xs bg-emerald-600 text-white rounded-md font-medium">Live</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Home size={24} className="text-blue-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Biens</p>
              <p className="text-3xl font-bold text-white">{stats.properties}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Car size={24} className="text-purple-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Véhicules</p>
              <p className="text-3xl font-bold text-white">{stats.vehicles}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MapPin size={24} className="text-emerald-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Provinces</p>
              <p className="text-3xl font-bold text-white">{stats.provinces}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign size={24} className="text-yellow-400" />
            <div>
              <p className="text-sm text-gray-400 uppercase tracking-wide font-semibold">Valeur totale</p>
              <p className="text-3xl font-bold text-yellow-400">${Math.round(stats.totalValue).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Provinces Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Properties by Province */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Home size={22} className="text-blue-400" />
            Biens par province
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {provinces.slice(0, 8).map((province: any) => {
              const count = properties.filter((p: any) => p.provinceId === province.id).length;
              const percentage = properties.length ? Math.round((count / properties.length) * 100) : 0;
              return (
                <div key={province.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <span className="font-semibold text-white">{province.nom}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-400">{count}</div>
                    <div className="text-sm text-gray-400">({percentage}%)</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Vehicles */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <Car size={22} className="text-purple-400" />
            Top véhicules
          </h3>
          <div className="space-y-4">
            {vehicles.slice(0, 5).map((vehicle: any, index: number) => (
              <div key={vehicle.id} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                <span className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  #{index + 1}
                </span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{vehicle.marque} {vehicle.modele}</div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin size={14} />
                    {vehicle.province?.nom}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">
                    {vehicle.pricePerDay ? `$${vehicle.pricePerDay}/j` : `$${vehicle.priceSale?.toLocaleString()}`}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    vehicle.availability ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {vehicle.availability ? 'Dispo' : 'Indispo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
          <Users size={22} className="text-emerald-400" />
          Activité récente
        </h3>
        <div className="space-y-4">
          {[
            { type: 'property', action: 'Ajouté', name: 'Maison Gombe', province: 'Kinshasa', time: '2min' },
            { type: 'vehicle', action: 'Mis à jour', name: 'Toyota Hilux 2023', province: 'Kinshasa', time: '5min' },
            { type: 'property', action: 'Statut changé', name: 'Appart Lingwala', province: 'Kinshasa', time: '12min' },
            { type: 'vehicle', action: 'Nouveau', name: 'BMW X5 2022', province: 'Lualaba', time: '1h' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700">
              <div className={`w-2 h-2 rounded-full ${activity.type === 'property' ? 'bg-blue-400' : 'bg-purple-400'}`} />
              <div className="flex-1">
                <div className="font-semibold text-white">{activity.action} {activity.name}</div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin size={14} />
                  {activity.province}
                </div>
              </div>
              <span className="text-xs text-gray-500 font-mono">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

