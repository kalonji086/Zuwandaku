'use client';

import { useState } from 'react';
import { apiClient } from '../../../../lib/api-client';
import { useRouter } from 'next/navigation';
import { FolderOpen, X, Check, Loader2, FileText, Clock, AlertTriangle, Plus } from 'lucide-react';

export default function CreateDossierPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    reference: '',
    type: 'LOCATION_MAISON' as const,
    clientId: '',
    responsableId: '',
    bienPropertyId: '',
    bienVehicleId: '',
    status: 'EN_ATTENTE' as const,
    notes: '',
  });

  const predefinedProcedures = [
    {
      name: 'Location Maison',
      type: 'LOCATION_MAISON',
      tasks: [
        { titre: 'Inspection du logement', description: 'Vérifier état général', assigneeRole: 'AGENT_TECHNIQUE' },
        { titre: 'Validation contrat', description: 'Signature et vérification', assigneeRole: 'ADMIN' },
        { titre: 'Encaissement paiement', description: 'Paiement initial', assigneeRole: 'COMPTABLE' },
        { titre: 'Remise des clés', description: 'Livraison au client', assigneeRole: 'AGENT_TERRAIN' },
        { titre: 'Nettoyage après départ', description: 'Préparation pour prochain', assigneeRole: 'MAINTENANCE' },
      ],
    },
    {
      name: 'Location Véhicule',
      type: 'LOCATION_VEHICULE',
      tasks: [
        { titre: 'Vérification mécanique', description: 'Contrôle technique', assigneeRole: 'MECANICIEN' },
        { titre: 'Nettoyage véhicule', description: 'Intérieur/extérieur', assigneeRole: 'AGENT' },
        { titre: 'Photos avant remise', description: 'État départ', assigneeRole: 'AGENT_TERRAIN' },
        { titre: 'Signature contrat', description: 'Documents légaux', assigneeRole: 'ADMIN' },
        { titre: 'Contrôle au retour', description: 'État restitution', assigneeRole: 'AGENT' },
      ],
    },
    {
      name: 'Vente',
      type: 'VENTE',
      tasks: [
        { titre: 'Vérification documents', description: 'Papiers administratifs', assigneeRole: 'ADMIN' },
        { titre: 'Publication annonce', description: 'Plateforme + réseaux', assigneeRole: 'MARKETING' },
        { titre: 'Visite client', description: 'Rendez-vous sur site', assigneeRole: 'AGENT_COMMERCIAL' },
        { titre: 'Encaissement', description: 'Paiement total', assigneeRole: 'COMPTABLE' },
        { titre: 'Livraison/Remise', description: 'Transfert propriété', assigneeRole: 'RESPONSABLE' },
      ],
    },
  ];

  const [selectedProcedure, setSelectedProcedure] = useState(0);
  const [tasks, setTasks] = useState(predefinedProcedures[0].tasks);

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create dossier
      const dossierData = {
        ...formData,
        reference: formData.reference || `DOS-${Date.now()}`,
      };
      const { data: dossier } = await apiClient.createDossier(dossierData);

      // Create tasks
      for (const task of tasks) {
        await apiClient.client.post(`/dossiers/${dossier.id}/tasks`, {
          ...task,
        });
      }

      alert('Dossier créé avec succès avec toutes les tâches!');
      router.push('/admin/dossiers');
    } catch (error) {
      alert('Erreur: ' + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
            <FolderOpen size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white mb-2">Nouveau Dossier Transaction</h1>
            <p className="text-xl text-gray-400">Sélectionnez une procédure complète avec tâches prédéfinies</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type / Procédure */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white font-semibold">Type de dossier</Label>
              <Select value={predefinedProcedures[selectedProcedure].type} onValueChange={(value) => {
                const index = predefinedProcedures.findIndex(p => p.type === value);
                setSelectedProcedure(index);
                setTasks(predefinedProcedures[index].tasks);
                setFormData({ ...formData, type: value as any });
              }}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white placeholder-gray-400">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20 text-white">
                  {predefinedProcedures.map((proc, index) => (
                    <SelectItem key={index} value={proc.type}>
                      {proc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-semibold">Référence (auto si vide)</Label>
              <Input
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="LOC-2024-001"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Client & Responsable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white font-semibold">Client (ID)</Label>
              <Input
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                placeholder="client-uuid"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white font-semibold">Responsable (ID)</Label>
              <Input
                value={formData.responsableId}
                onChange={(e) => setFormData({ ...formData, responsableId: e.target.value })}
                placeholder="admin-uuid"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Bien */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-white font-semibold">Bien Immobilier (ID, optionnel)</Label>
              <Input
                value={formData.bienPropertyId}
                onChange={(e) => setFormData({ ...formData, bienPropertyId: e.target.value })}
                placeholder="property-uuid"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white font-semibold">Véhicule (ID, optionnel)</Label>
              <Input
                value={formData.bienVehicleId}
                onChange={(e) => setFormData({ ...formData, bienVehicleId: e.target.value })}
                placeholder="vehicle-uuid"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-white font-semibold">Notes</Label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Informations supplémentaires..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-xl p-4 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            />
          </div>

          {/* Tâches générées */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <FileText size={24} className="text-blue-400" />
              Tâches de la procédure ({tasks.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
              {tasks.map((task, index) => (
                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-all">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-white text-lg">{task.titre}</h4>
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-700 text-gray-300">
                      {task.assigneeRole}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-gray-400 text-sm mb-2">{task.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 h-14 text-lg font-bold border-white/20 hover:bg-white/10">
              <X size={20} className="mr-2" />
              Annuler
            </Button>
            <Button type="submit" disabled={loading} className="flex-1 h-14 text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl">
              {loading ? (
                <>
                  <Loader2 size={20} className="mr-2 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Check size={20} className="mr-2" />
                  Créer dossier + tâches
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

