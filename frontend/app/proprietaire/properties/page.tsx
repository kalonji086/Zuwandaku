'use client';

import { useState } from 'react';
import { Home, Eye, Edit, Trash2, Plus, Filter, MapPin, MessageCircle } from 'lucide-react';
import { useMyProperties } from '../../../lib/hooks/index';
import { useDeleteProperty } from '../../../lib/hooks/useDeleteProperty';
import BienMultiserviceModal from '../../components/BienMultiserviceModal';
import ViewPropertyModal from '../../components/ViewPropertyModal';
import EditPropertyModal from '../../components/EditPropertyModal';
import DeletePropertyModal from '../../components/DeletePropertyModal';

export default function ProprietaireProperties() {
  const { data: properties = [], isLoading } = useMyProperties();
  const deleteMutation = useDeleteProperty();

  const [showAdd,     setShowAdd]    = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showView,    setShowView]   = useState(false);
  const [showEdit,    setShowEdit]   = useState(false);
  const [showDelete,  setShowDelete] = useState(false);
  const [selected,   setSelected]   = useState<any>(null);

  const open = (modal: 'view' | 'contact' | 'edit' | 'delete', property: any) => {
    setSelected(property);
    if (modal === 'view')     setShowView(true);
    if (modal === 'contact')  setShowContact(true);
    if (modal === 'edit')     setShowEdit(true);
    if (modal === 'delete')   setShowDelete(true);
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
            <h1 className="text-2xl font-bold text-white tracking-tight">Mes biens immobiliers</h1>
            <p className="text-white/40 text-sm mt-0.5">{properties.length} bien{properties.length !== 1 ? 's' : ''} publié{properties.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-black px-5 py-2.5 rounded-xl font-semibold transition-all text-sm">
            <Plus size={16} /> Ajouter un bien
          </button>
        </div>

        {/* Filtres */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-3 flex-wrap">
          <Filter size={16} className="text-white/40 shrink-0" />
          <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-white/30 outline-none">
            <option className="bg-gray-900">Tous statuts</option>
            <option className="bg-gray-900">Disponible</option>
            <option className="bg-gray-900">Loué</option>
            <option className="bg-gray-900">Vendu</option>
          </select>
          <input type="text" placeholder="Rechercher par commune, quartier..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/20 text-sm focus:border-white/30 outline-none min-w-[200px]" />
          <button className="px-5 py-2.5 bg-white hover:bg-white/90 text-black rounded-xl font-semibold text-sm transition-all">
            Filtrer
          </button>
        </div>

        {/* Grille */}
        {properties.length === 0 ? (
          <div className="text-center py-24 bg-white/5 rounded-xl border border-dashed border-white/10">
            <Home size={48} className="text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Aucun bien publié</h3>
            <p className="text-white/40 text-sm mb-6 max-w-sm mx-auto">Publiez votre premier bien pour attirer des locataires ou acheteurs.</p>
            <button onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-2 bg-white hover:bg-white/90 text-black px-6 py-3 rounded-xl font-semibold transition-all text-sm">
              <Plus size={16} /> Publier mon premier bien
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            {(properties as any[]).map((property) => (
              <div key={property.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 hover:-translate-y-1 transition-all duration-300">

                {/* Image */}
                <div className="h-48 bg-white/5 overflow-hidden relative">
                  {property.photos?.[0] ? (
                    <img src={property.photos[0]} alt={property.type}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home size={40} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full border ${
                    property.status === 'AVAILABLE'
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-white/10 border-white/20 text-white/60'
                  }`}>
                    {property.status || 'AVAILABLE'}
                  </span>
                </div>

                {/* Contenu */}
                <div className="p-5">
                  <span className="text-xs font-medium text-white/40 uppercase tracking-widest">{property.type}</span>
                  <h3 className="font-semibold text-white mt-1 mb-1 truncate">
                    {property.ville?.nom || property.ville}, {property.quartier?.nom || property.quartier}
                  </h3>
                  <div className="flex items-center gap-1 text-white/40 text-xs mb-3">
                    <MapPin size={11} /> {property.commune}
                  </div>
                  <p className="text-xl font-bold text-white mb-4">${property.price?.toLocaleString()}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">

                    <button onClick={() => open('view', property)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition-all">
                      <Eye size={13} /> Voir
                    </button>
                    <button onClick={() => open('contact', property)}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 hover:border-green-500/30 text-green-400 hover:text-green-300 px-3 py-2 rounded-xl text-xs font-medium transition-all">
                      <MessageCircle size={13} /> Contacter
                    </button>
                    <button onClick={() => open('edit', property)}
                      className="flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white/70 hover:text-white px-3 py-2 rounded-xl text-xs font-medium transition-all">
                      <Edit size={13} /> Modifier
                    </button>
                    <button onClick={() => open('delete', property)}
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
      <BienMultiserviceModal isOpen={showAdd} onClose={() => setShowAdd(false)} />

      <ViewPropertyModal
        isOpen={showView || showContact}
        onClose={() => { setShowView(false); setShowContact(false); }}
        property={selected}
      />

      <EditPropertyModal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        property={selected}
        onSave={(data) => { console.log('Save:', data); setShowEdit(false); }}
        isLoading={false}
      />

      <DeletePropertyModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        property={selected}
        onConfirm={(id) => { deleteMutation.mutate(id); setShowDelete(false); }}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
