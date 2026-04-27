'use client';

import { useState } from 'react';
import { Building2, MapPin, DollarSign, Users, Eye, Edit, Trash2, Plus, Filter, Search, Check } from 'lucide-react';

const RENTAL_PROPERTIES = [
  { id: 'RP001', name: 'Maison Luxe Gombe', location: 'Gombe', price: '$1200/mois', rooms: 3, status: 'ACTIVE', owner: 'Jean Dupont', bookings: 8 },
  { id: 'RP002', name: 'Appartement Lingwala', location: 'Lingwala', price: '$800/mois', rooms: 2, status: 'ACTIVE', owner: 'Marie Kabila', bookings: 5 },
  { id: 'RP003', name: 'Villa Ngaliema', location: 'Ngaliema', price: '$1800/mois', rooms: 4, status: 'MAINTENANCE', owner: 'Pierre Mbutu', bookings: 0 },
  { id: 'RP004', name: 'Studio Kalamu', location: 'Kalamu', price: '$500/mois', rooms: 1, status: 'ACTIVE', owner: 'Sophie Martin', bookings: 12 },
  { id: 'RP005', name: 'House Matete', location: 'Matete', price: '$950/mois', rooms: 2, status: 'INACTIVE', owner: 'Joseph K.', bookings: 2 },
];

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  ACTIVE: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
  MAINTENANCE: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  INACTIVE: { bg: 'bg-gray-500/20', text: 'text-gray-400', dot: 'bg-gray-500' },
};

export default function RentalPropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [properties, setProperties] = useState(RENTAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<typeof RENTAL_PROPERTIES[0] | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'delete' | 'add' | null>(null);
  const [addFormData, setAddFormData] = useState({
    id: '',
    name: '',
    location: '',
    price: '',
    rooms: 0,
    status: 'ACTIVE' as const,
    owner: '',
    bookings: 0
  });
  const [editFormData, setEditFormData] = useState<typeof RENTAL_PROPERTIES[0] | null>(null);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || p.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = () => {
    if (selectedProperty) {
      setProperties(properties.filter(p => p.id !== selectedProperty.id));
      setModalMode(null);
      setSelectedProperty(null);
    }
  };

  const handleOpenAddModal = () => {
    setModalMode('add');
  };

  const handleAddProperty = () => {
    if (!addFormData.name || !addFormData.location || !addFormData.price || !addFormData.owner || addFormData.rooms <= 0) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const newId = `RP${(properties.length + 1).toString().padStart(3, '0')}`;
    const newProperty = { 
      ...addFormData, 
      id: newId, 
      bookings: 0,
      status: 'ACTIVE' 
    };

    setProperties([...properties, newProperty]);
    setAddFormData({
      id: '',
      name: '',
      location: '',
      price: '',
      rooms: 0,
      status: 'ACTIVE' as const,
      owner: '',
      bookings: 0
    });
    setModalMode(null);
  };

  const handleSaveEdit = () => {
    if (editFormData && selectedProperty) {
      setProperties(properties.map(p => (p.id === selectedProperty.id ? editFormData : p)));
      setModalMode(null);
      setSelectedProperty(null);
      setEditFormData(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 size={28} className="text-blue-400" />
            Gestion des maisons à louer
          </h2>
          <p className="text-gray-400 text-sm mt-1">Gérez toutes les propriétés disponibles à la location</p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition-all flex items-center gap-2 shadow-lg">
          <Plus size={18} />
          Ajouter une propriété
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: properties.length, color: 'from-blue-600 to-blue-700' },
          { label: 'Actives', value: properties.filter(p => p.status === 'ACTIVE').length, color: 'from-green-600 to-green-700' },
          { label: 'En maintenance', value: properties.filter(p => p.status === 'MAINTENANCE').length, color: 'from-yellow-600 to-yellow-700' },
          { label: 'Réservations', value: properties.reduce((sum, p) => sum + p.bookings, 0), color: 'from-purple-600 to-purple-700' },
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
              placeholder="Rechercher par nom ou propriétaire..."
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
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50 border-b border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Propriété</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Localisation</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Propriétaire</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Réservations</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProperties.map((prop) => {
                const statusStyle = statusConfig[prop.status];
                return (
                  <tr key={prop.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-blue-600/20 flex items-center justify-center">
                          <Building2 size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{prop.name}</p>
                          <p className="text-gray-500 text-xs">{prop.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <MapPin size={16} className="text-gray-500" />
                        {prop.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{prop.owner}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-green-400 font-semibold text-sm">
                        <DollarSign size={16} />
                        {prop.price}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-xs ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`}></span>
                        {prop.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-purple-400 text-sm font-medium">
                        <Users size={16} />
                        {prop.bookings}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProperty(prop);
                            setModalMode('view');
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-blue-400 transition-colors"
                          title="Voir"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProperty(prop);
                            setEditFormData({ ...prop });
                            setModalMode('edit');
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProperty(prop);
                            setModalMode('delete');
                          }}
                          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 size={48} className="text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">Aucune propriété trouvée</p>
          </div>
        )}
      </div>

      {/* Modals */}
{modalMode === 'add' ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Plus size={24} className="text-green-400" />
              Ajouter une nouvelle propriété
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nom de la propriété *"
                value={addFormData.name}
                onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="text"
                placeholder="Localisation *"
                value={addFormData.location}
                onChange={(e) => setAddFormData({ ...addFormData, location: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="text"
                placeholder="Prix (ex: $1200/mois) *"
                value={addFormData.price}
                onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="number"
                min="1"
                placeholder="Nombre de chambres *"
                value={addFormData.rooms}
                onChange={(e) => setAddFormData({ ...addFormData, rooms: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <input
                type="text"
                placeholder="Nom du propriétaire *"
                value={addFormData.owner}
                onChange={(e) => setAddFormData({ ...addFormData, owner: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <label className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={addFormData.status === 'ACTIVE'}
                  onChange={(e) => setAddFormData({ ...addFormData, status: e.target.checked ? 'ACTIVE' : 'INACTIVE' })}
                  className="rounded"
                />
                <span className="text-sm text-gray-300">Publier immédiatement (statut Actif)</span>
              </label>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setModalMode(null);
                  setAddFormData({
                    id: '',
                    name: '',
                    location: '',
                    price: '',
                    rooms: 0,
                    status: 'ACTIVE' as const,
                    owner: '',
                    bookings: 0
                  });
                }}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleAddProperty}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                <Check size={16} />
                Publier propriété
              </button>
            </div>
          </div>
        </div>
      ) : modalMode && selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl max-w-md w-full p-6 space-y-4">
            {modalMode === 'view' && (
              <>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Eye size={24} className="text-blue-400" />
                  Détails de la propriété
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Propriété</p>
                    <p className="text-white font-semibold">{selectedProperty.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Localisation</p>
                      <p className="text-white font-semibold">{selectedProperty.location}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Chambres</p>
                      <p className="text-white font-semibold">{selectedProperty.rooms}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Prix</p>
                      <p className="text-white font-semibold">{selectedProperty.price}</p>
                    </div>
                    <div className="bg-gray-800/50 p-3 rounded-lg">
                      <p className="text-gray-400 text-xs">Réservations</p>
                      <p className="text-white font-semibold">{selectedProperty.bookings}</p>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Propriétaire</p>
                    <p className="text-white font-semibold">{selectedProperty.owner}</p>
                  </div>
                  <div className="bg-gray-800/50 p-3 rounded-lg">
                    <p className="text-gray-400 text-xs">Statut</p>
                    <p className="text-white font-semibold">{selectedProperty.status}</p>
                  </div>
                </div>
              </>
            )}

            {modalMode === 'edit' && editFormData && (
              <>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Edit size={24} className="text-yellow-400" />
                  Modifier la propriété
                </h3>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    placeholder="Nom de la propriété"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={editFormData.location}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    placeholder="Localisation"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                    placeholder="Prix"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    value={editFormData.rooms}
                    onChange={(e) => setEditFormData({ ...editFormData, rooms: parseInt(e.target.value) })}
                    placeholder="Chambres"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    value={editFormData.owner}
                    onChange={(e) => setEditFormData({ ...editFormData, owner: e.target.value })}
                    placeholder="Propriétaire"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <select
                    value={editFormData.status}
                    onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="ACTIVE">Actif</option>
                    <option value="MAINTENANCE">Maintenance</option>
                    <option value="INACTIVE">Inactif</option>
                  </select>
                </div>
              </>
            )}

            {modalMode === 'delete' && (
              <>
                <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                  <Trash2 size={24} />
                  Supprimer la propriété
                </h3>
                <p className="text-gray-300">Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{selectedProperty.name}</span> ? Cette action ne peut pas être annulée.</p>
              </>
            )}

            {/* Footer */}
            <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setModalMode(null);
                  setSelectedProperty(null);
                  setEditFormData(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                {modalMode === 'delete' ? 'Annuler' : 'Fermer'}
              </button>
              {modalMode === 'edit' && (
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-1 text-sm"
                >
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
