'use client';

import { useState, useEffect } from 'react';
import { Truck, Plus, Eye, Edit, Trash2, Search, Filter, MapPin, DollarSign, Calendar, Check, X } from 'lucide-react';
import VehicleCreateModal from './VehicleCreateModal';

const VEHICLES = [
  { id: 'V001', brand: 'Toyota', model: 'Hilux', year: 2022, mileage: 15000, price: '$25,000', status: 'ACTIVE', owner: 'Jean Dupont', location: 'Gombe' },
  { id: 'V002', brand: 'Honda', model: 'CR-V', year: 2021, mileage: 22000, price: '$18,500', status: 'RENTED', owner: 'Marie Kabila', location: 'Lingwala' },
  { id: 'V003', brand: 'Mercedes', model: 'C300', year: 2023, mileage: 8000, price: '$42,000', status: 'ACTIVE', owner: 'Pierre Mbutu', location: 'Kinshasa' },
  { id: 'V004', brand: 'Peugeot', model: '3008', year: 2020, mileage: 35000, price: '$12,000', status: 'SOLD', owner: 'Sophie Martin', location: 'Ngaliema' },
  { id: 'V005', brand: 'Suzuki', model: 'Swift', year: 2022, mileage: 12000, price: '$9,500', status: 'ACTIVE', owner: 'Joseph K.', location: 'Kalamu' },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  ACTIVE: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
  RENTED: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
  SOLD: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-500' },
};

export default function GestionVehiculesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedVehicle, setSelectedVehicle] = useState<typeof VEHICLES[0] | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [vehicles, setVehicles] = useState(VEHICLES);

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.brand.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || v.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (selectedVehicle) {
      setVehicles(vehicles.filter(v => v.id !== selectedVehicle.id));
      setModalMode(null);
      setSelectedVehicle(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Truck size={28} className="text-blue-400" />
            Gestion de véhicules
          </h2>
          <p className="text-gray-400 text-sm mt-1">Gérez tous les véhicules disponibles</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center gap-2 shadow-lg">
          <Plus size={18} />
          Ajouter un véhicule
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: vehicles.length, color: 'from-blue-600 to-blue-700' },
          { label: 'Actifs', value: vehicles.filter(v => v.status === 'ACTIVE').length, color: 'from-green-600 to-green-700' },
          { label: 'En location', value: vehicles.filter(v => v.status === 'RENTED').length, color: 'from-orange-600 to-orange-700' },
          { label: 'Vendus', value: vehicles.filter(v => v.status === 'SOLD').length, color: 'from-purple-600 to-purple-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`bg-gradient-to-br ${color} rounded-xl p-4 shadow-lg`}>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{label}</p>
            <p className="text-2xl font-bold text-white mt-2">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par marque, modèle ou propriétaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="RENTED">En location</option>
              <option value="SOLD">Vendu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVehicles.map((vehicle) => {
          const statusStyle = statusConfig[vehicle.status];
          return (
            <div key={vehicle.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all">
              {/* Vehicle Image Area */}
              <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <Truck size={48} className="text-gray-700" />
              </div>

              {/* Vehicle Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-white font-bold text-lg">{vehicle.brand} {vehicle.model}</h3>
                  <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                    <MapPin size={14} />
                    {vehicle.location}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-gray-800/50 p-2 rounded">
                    <p className="text-gray-500">Année</p>
                    <p className="text-white font-semibold">{vehicle.year}</p>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded">
                    <p className="text-gray-500">Kilométrage</p>
                    <p className="text-white font-semibold">{vehicle.mileage} km</p>
                  </div>
                  <div className="bg-gray-800/50 p-2 rounded col-span-2">
                    <p className="text-gray-500">Propriétaire</p>
                    <p className="text-white font-semibold">{vehicle.owner}</p>
                  </div>
                </div>

                {/* Price & Status */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-800">
                  <div className="flex items-center gap-1 text-green-400 font-semibold">
                    <DollarSign size={14} />
                    {vehicle.price}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                    {vehicle.status}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setModalMode('view');
                    }}
                    className="flex-1 p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size={14} />
                    Voir
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setModalMode('edit');
                    }}
                    className="flex-1 p-2 bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    Modifier
                  </button>
                  <button
                    onClick={() => {
                      setSelectedVehicle(vehicle);
                      setModalMode('delete');
                    }}
                    className="flex-1 p-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 size={14} />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Truck size={48} className="text-gray-600 mb-3" />
          <p className="text-gray-400 text-sm">Aucun véhicule trouvé</p>
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <VehicleCreateModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { 
            // Refresh vehicles list
            alert('Véhicule créé et publié!');
            setShowCreateModal(false);
          }} 
        />
      )}
      {modalMode && selectedVehicle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 space-y-4">
            {modalMode === 'view' && (
              <>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Eye size={24} className="text-blue-400" />
                  Détails du véhicule
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Véhicule</p>
                    <p className="text-white font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Année</p>
                      <p className="text-white font-semibold">{selectedVehicle.year}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Kilométrage</p>
                      <p className="text-white font-semibold">{selectedVehicle.mileage} km</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Prix</p>
                      <p className="text-white font-semibold">{selectedVehicle.price}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Statut</p>
                      <p className="text-white font-semibold">{selectedVehicle.status}</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Propriétaire</p>
                    <p className="text-white font-semibold">{selectedVehicle.owner}</p>
                  </div>
                </div>
              </>
            )}

            {modalMode === 'edit' && (
              <>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit size={24} className="text-yellow-400" />
                  Modifier le véhicule
                </h3>
                <div className="space-y-3">
                  <input type="text" defaultValue={selectedVehicle.brand} placeholder="Marque" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  <input type="text" defaultValue={selectedVehicle.model} placeholder="Modèle" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  <input type="number" defaultValue={selectedVehicle.year} placeholder="Année" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  <input type="number" defaultValue={selectedVehicle.mileage} placeholder="Kilométrage" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                </div>
              </>
            )}

            {modalMode === 'delete' && (
              <>
                <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                  <Trash2 size={24} />
                  Supprimer le véhicule
                </h3>
                <p className="text-gray-300">Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{selectedVehicle.brand} {selectedVehicle.model}</span> ? Cette action ne peut pas être annulée.</p>
              </>
            )}

            {/* Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setModalMode(null);
                  setSelectedVehicle(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                {modalMode === 'delete' ? 'Annuler' : 'Fermer'}
              </button>
              {modalMode === 'edit' && (
                <button className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm">
                  <Check size={16} />
                  Enregistrer
                </button>
              )}
              {modalMode === 'delete' && (
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
