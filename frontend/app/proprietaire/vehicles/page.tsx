'use client';

import { useState } from 'react';
import { Car, Eye, Edit, Trash2, Plus, Filter, Gauge, DollarSign, MessageCircle } from 'lucide-react';
import { useMyVehicles } from '../../../lib/hooks/index';
import { useDeleteVehicle } from '../../../lib/hooks/useDeleteVehicle';
import AddVehicleModal    from '../../components/AddVehicleModal';
import ViewVehicleModal   from '../../components/ViewVehicleModal';
import EditVehicleModal   from '../../components/EditVehicleModal';
import DeleteVehicleModal from '../../components/DeleteVehicleModal';

export default function ProprietaireVehicles() {
  const { data: vehicles = [], isLoading } = useMyVehicles();
  const deleteMutation = useDeleteVehicle();

  const [showAdd,     setShowAdd]     = useState(false);
  const [showView,    setShowView]    = useState(false);
  const [showEdit,    setShowEdit]    = useState(false);
  const [showDelete,  setShowDelete]  = useState(false);
  const [selected,    setSelected]    = useState<any>(null);

  const open = (modal: 'view' | 'contact' | 'edit' | 'delete', vehicle: any) => {
    setSelected(vehicle);
    if (modal === 'view' || modal === 'contact') setShowView(true);
    if (modal === 'edit') setShowEdit(true);
    if (modal === 'delete') setShowDelete(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Mes véhicules</h1>
            <p className="text-white/40 text-sm mt-0.5">{vehicles.length} véhicule{vehicles.length !== 1 ? 's' : ''} publié{vehicles.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-black px-5 py-2.5 rounded-xl font-semibold transition-all text-sm">
            <Plus size={16} /> Ajouter un véhicule
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 flex-wrap">
          <Filter size={16} className="text-white/40 shrink-0" />
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-white/30 outline-none">
            <option className="bg-gray-900">Tous types</option>
            <option className="bg-gray-900">SUV</option>
            <option className="bg-gray-900">SEDAN</option>
            <option className="bg-gray-900">TRUCK</option>
            <option className="bg-gray-900">MOTO</option>
          </select>
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-white/30 outline-none">
            <option className="bg-gray-900">Vente & Location</option>
            <option className="bg-gray-900">Vente</option>
            <option className="bg-gray-900">Location</option>
          </select>
          <input type="text" placeholder="Rechercher marque, modèle..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-white/30 outline-none min-w-[200px]" />
          <button className="px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-xl font-semibold text-sm transition-all">
            Filtrer
          </button>
        </div>

        {/* Grille */}
        {vehicles.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-xl border border-dashed border-white/10">
            <Car size={48} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun véhicule publié</h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">Publiez votre premier véhicule en location ou vente.</p>
            <button onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black px-6 py-3 rounded-xl font-semibold transition-all text-sm">
              <Plus size={16} /> Publier mon premier véhicule
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {(vehicles as any[]).map((vehicle) => (
              <div key={vehicle.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300">

                {/* Image */}
                <div className="h-48 bg-white/5 overflow-hidden relative">
                  {vehicle.photos?.[0] ? (
                    <img src={vehicle.photos[0]} alt={vehicle.marque}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car size={40} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-white/10 border-white/20 text-white/70">
                      {vehicle.type}
                    </span>
                    {vehicle.pricePerDay && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-blue-500/10 border-blue-500/20 text-blue-400">
                        Location
                      </span>
                    )}
                    {vehicle.priceSale && (
                      <span className="px-2.5 py-1 text-xs font-medium rounded-full border bg-green-500/10 border-green-500/20 text-green-400">
                        Vente
                      </span>
                    )}
                  </div>
                  <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full border ${
                    vehicle.availability
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-white/10 border-white/20 text-white/50'
                  }`}>
                    {vehicle.availability ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <h3 className="font-semibold text-white truncate">{vehicle.marque} {vehicle.modele}</h3>
                  <div className="flex items-center gap-3 text-white/40 text-xs mt-1 mb-3">
                    <span className="flex items-center gap-1"><Gauge size={11} /> {vehicle.annee}</span>
                    {vehicle.mileage && <span>{vehicle.mileage?.toLocaleString()} km</span>}
                  </div>
                  <div className="mb-4">
                    {vehicle.priceSale   && <p className="text-lg font-bold text-white">${vehicle.priceSale?.toLocaleString()}</p>}
                    {vehicle.pricePerDay && <p className="text-sm text-white/60">${vehicle.pricePerDay}<span className="text-white/30">/jour</span></p>}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button onClick={() => open('view', vehicle)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition-all">
                      <Eye size={13} /> Voir
                    </button>
                    <button onClick={() => open('contact', vehicle)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/30 text-green-400 hover:text-green-300 px-3 py-2 rounded-xl text-xs font-medium transition-all">
                      <MessageCircle size={13} /> Contacter
                    </button>
                    <button onClick={() => open('edit', vehicle)}
                      className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition-all">
                      <Edit size={13} /> Modifier
                    </button>
                    <button onClick={() => open('delete', vehicle)}
                      className="p-2 bg-red-500/5 hover:bg-red-500/15 border border-red-500/10 hover:border-red-500/30 text-red-400/60 hover:text-red-400 rounded-xl transition-all shrink-0">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddVehicleModal isOpen={showAdd} onClose={() => setShowAdd(false)} />

      <ViewVehicleModal
        isOpen={showView}
        onClose={() => setShowView(false)}
        vehicle={selected}
      />

      <EditVehicleModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        vehicle={selected}
        onSave={(data) => { setShowEdit(false); }}
        isLoading={false}
      />

      <DeleteVehicleModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        vehicle={selected}
        onConfirm={(id) => { deleteMutation.mutate(id); setShowDelete(false); }}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
