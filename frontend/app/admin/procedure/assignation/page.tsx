'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Clock, Calendar, FileText, CheckCircle, AlertTriangle, Edit3, ArrowUpDown, X, Plus, Key, Clipboard 
} from 'lucide-react';

type Task = {
  id: string;
  name: string;
  assignee: string;
  comment: string;
  date: string;
};

type Incident = {
  id: string;
  creator: string;
  procedureName: string;
  taskCount: number;
  createdDate: string;
  daysElapsed: number;
  status: 'open' | 'assigned' | 'in_progress' | 'completed';
  assignedTo: string;
  tasks: Task[];
};

type Profile = {
  fullName: string;
  birthDate: string;
  province: string;
  nationalID: string;
  email: string;
  phone: string;
  role: string;
  permissions: string[];
  competencies: string[];
  details: string;
};

const MOCK_INCIDENTS: Incident[] = [
  {
    id: '#INC-001',
    creator: 'Admin Principal',
    procedureName: 'Urgence Technique',
    taskCount: 3,
    createdDate: '15/10/2024 10:30',
    daysElapsed: 2,
    status: 'open' as const,
    assignedTo: 'Non assigné',
    tasks: [
      { id: 't1', name: 'Vérifier documents', assignee: '', comment: '', date: '15/10/2024' },
      { id: 't2', name: 'Contacter client', assignee: 'Sophie Martin', comment: 'Appel effectué', date: '16/10/2024' },
      { id: 't3', name: 'Approuver', assignee: '', comment: '', date: '' },
    ],
  },
  {
    id: '#INC-002',
    creator: 'Sophie Martin',
    procedureName: 'Vente - Paiement',
    taskCount: 5,
    createdDate: '14/10/2024 16:45',
    daysElapsed: 3,
    status: 'in_progress' as const,
    assignedTo: 'Pierre Dubois',
    tasks: [
      { id: 't1', name: 'Vérifier paiement', assignee: 'Pierre Dubois', comment: 'Paiement confirmé', date: '15/10/2024' },
      { id: 't2', name: 'Mettre à jour contrat', assignee: 'Pierre Dubois', comment: 'En attente signature', date: '16/10/2024' },
    ],
  },
  {
    id: '#INC-003',
    creator: 'Approbateur 1',
    procedureName: 'Location - Dossier',
    taskCount: 4,
    createdDate: '13/10/2024 09:15',
    daysElapsed: 4,
    status: 'assigned' as const,
    assignedTo: 'Sophie Martin',
    tasks: [
      { id: 't1', name: 'Préparer dossier', assignee: 'Sophie Martin', comment: 'Dossier prêt', date: '14/10/2024' },
      { id: 't2', name: 'Vérifier état', assignee: '', comment: '', date: '' },
    ],
  },
];

export default function AssignationPage() {
  const [incidents, setIncidents] = useState<Incident[]>(MOCK_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [attributionOpen, setAttributionOpen] = useState(false);
  const [taskCompleteModalOpen, setTaskCompleteModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [completeComment, setCompleteComment] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const STATUS_COLORS: Record<Incident['status'], string> = {
    open: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    assigned: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    completed: 'bg-green-500/20 text-green-400 border-green-500/30',
  };

  const assignees = ['Non assigné', 'Admin Principal', 'Sophie Martin', 'Pierre Dubois', 'Approbateur 1'];

  const profiles: Record<string, Profile> = {
    'Non assigné': {
      fullName: 'N/A',
      birthDate: 'N/A',
      province: 'N/A',
      nationalID: 'N/A',
      email: 'N/A',
      phone: 'N/A',
      role: 'Non Assigné',
      permissions: [],
      competencies: [],
      details: 'Aucune personne assignée actuellement.',
    },
    'Admin Principal': {
      fullName: 'Jean Dupont',
      birthDate: '1975-03-15',
      province: 'Île-de-France',
      nationalID: '7501012345678',
      email: 'admin@company.com',
      phone: '+33 1 23 45 67 89',
      role: 'Super Admin',
      permissions: ['Full Access', 'Manage Users', 'Approve All', 'Procedures Admin', 'Documents Admin'],
      competencies: ['Workflow Management', 'User Administration', 'Contract Review', 'Emergency Handling'],
      details: "Administrateur principal avec 10 ans d'expérience en gestion immobilière. Responsable de tous les workflows critiques et approbations.",
    },
    'Sophie Martin': {
      fullName: 'Sophie Martin',
      birthDate: '1985-07-22',
      province: 'Normandie',
      nationalID: '7602987654321',
      email: 'sophie.martin@company.com',
      phone: '+33 6 12 34 56 78',
      role: 'Approbateur Senior',
      permissions: ['Procedures Read/Write', 'Documents Read', 'Assign Tasks', 'Approve Location'],
      competencies: ['Dossier Location', 'Client Relations', 'Document Verification'],
      details: 'Spécialiste des locations avec excellent taux de satisfaction client. Gère 50+ dossiers par mois.',
    },
    'Pierre Dubois': {
      fullName: 'Pierre Dubois',
      birthDate: '1982-11-08',
      province: 'Provence-Alpes-Côte d\'Azur',
      nationalID: '1304567890123',
      email: 'pierre.dubois@company.com',
      phone: '+33 6 98 76 54 32',
      role: 'Technicien Ventes',
      permissions: ['Procedures Vente', 'Properties Read', 'Vehicles Read', 'Mail Access'],
      competencies: ['Ventes Appartements', 'Paiements', 'Contrats Vente'],
      details: 'Expert en transactions de vente. Gère les étapes critiques de paiement et closing.',
    },
    'Approbateur 1': {
      fullName: 'Marie Leclerc',
      birthDate: '1990-04-30',
      province: 'Bretagne',
      nationalID: '2901234567890',
      email: 'approb1@company.com',
      phone: '+33 1 98 76 54 32',
      role: 'Approbateur Technique',
      permissions: ['Approve Technical', 'Documents Write', 'Supports'],
      competencies: ['Maintenance', 'Urgences Techniques'],
      details: 'Spécialiste technique pour approbation des incidents urgents.',
    },
  };

  const openEditModal = (incident: Incident) => {
    setSelectedIncident({...incident});
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedIncident(null);
  };

  const openAttributionModal = (assignee: string) => {
    setSelectedAssignee(assignee);
    setAttributionOpen(true);
  };

  const closeAttributionModal = () => {
    setAttributionOpen(false);
    setSelectedAssignee('');
  };

  const updateLocalTask = (taskId: string, field: keyof Task, value: string) => {
    if (!selectedIncident) return;
    const newTasks = selectedIncident.tasks.map(task =>
      task.id === taskId 
        ? { ...task, [field]: value }
        : task
    );
    setSelectedIncident({ ...selectedIncident, tasks: newTasks });
  };

  const removeLocalTask = (taskId: string) => {
    if (!selectedIncident) return;
    const newTasks = selectedIncident.tasks.filter(task => task.id !== taskId);
    setSelectedIncident({ ...selectedIncident, tasks: newTasks });
  };

  const addLocalTask = () => {
    if (!selectedIncident) return;
    const newTask: Task = {
      id: `t${Date.now()}`,
      name: '',
      assignee: '',
      comment: '',
      date: ''
    };
    setSelectedIncident({ ...selectedIncident, tasks: [...selectedIncident.tasks, newTask] });
  };

  const saveChanges = () => {
    if (!selectedIncident) return;
    const index = incidents.findIndex(inc => inc.id === selectedIncident.id);
    if (index !== -1) {
      const newIncidents = [...incidents];
      newIncidents[index] = { ...selectedIncident, taskCount: selectedIncident.tasks.length };
      setIncidents(newIncidents);
    }
    closeEditModal();
  };

  if (editModalOpen && selectedIncident) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-3xl border-4 border-blue-500/50 max-w-6xl w-full max-h-[95vh] overflow-auto p-8 shadow-2xl backdrop-blur-xl">
          <button 
            onClick={closeEditModal}
            className="absolute top-6 right-6 p-3 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all"
          >
            <X size={28} className="text-gray-400 hover:text-white" />
          </button>
          <h2 className="text-4xl font-bold text-white mb-12 flex items-center gap-4 justify-center">
            <Edit3 size={48} className="text-blue-500" />
            Modifier Incident {selectedIncident.id}
          </h2>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div>
                <label className="block text-xl font-bold text-white mb-4">Date Création</label>
                <input
                  type="date"
                  value={selectedIncident.createdDate.split(' ')[0]}
                  onChange={(e) => setSelectedIncident({ ...selectedIncident, createdDate: e.target.value + ' 10:30', daysElapsed: Math.floor(Math.random() * 10) + 1 })}
                  className="w-full bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 text-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xl font-bold text-white mb-4">Jours Écoulés</label>
                <input
                  type="number"
                  value={selectedIncident.daysElapsed}
                  onChange={(e) => setSelectedIncident({ ...selectedIncident, daysElapsed: parseInt(e.target.value) || 0 })}
                  className="w-full bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 text-xl focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <label className="text-3xl font-bold text-white flex-1">Tâches ({selectedIncident.tasks.length})</label>
                <button
                  type="button"
                  onClick={addLocalTask}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-8 py-4 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center gap-3"
                >
                  <Plus size={24} />
                  Nouvelle Tâche
                </button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedIncident.tasks.map((task) => (
                  <div key={task.id} className="bg-gray-800/50 border border-gray-600 rounded-2xl p-8 group hover:border-blue-500/50">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
                      <span className="text-2xl font-bold text-blue-400 bg-blue-500/20 px-4 py-2 rounded-xl">Tâche</span>
                      <button
                        type="button"
                        onClick={() => removeLocalTask(task.id)}
                        className="ml-auto p-3 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-2xl transition-all group-hover:scale-110"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-lg font-bold text-white mb-3">Nom Tâche</label>
                        <input
                          type="text"
                          value={task.name}
                          onChange={(e) => updateLocalTask(task.id, 'name', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-xl p-5 text-lg focus:border-blue-400 focus:outline-none"
                          placeholder="Nom de la tâche"
                        />
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-white mb-3">Assigné à</label>
                        <select
                          value={task.assignee}
                          onChange={(e) => updateLocalTask(task.id, 'assignee', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-xl p-5 text-lg focus:border-blue-400 focus:outline-none"
                        >
                          {assignees.map((person) => (
                            <option key={person} value={person}>{person}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-lg font-bold text-white mb-3">Date</label>
                        <input
                          type="date"
                          value={task.date}
                          onChange={(e) => updateLocalTask(task.id, 'date', e.target.value)}
                          className="w-full bg-gray-900 border border-gray-600 rounded-xl p-5 text-lg focus:border-blue-400 focus:outline-none"
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-lg font-bold text-white mb-3">Commentaire</label>
                        <textarea
                          value={task.comment}
                          onChange={(e) => updateLocalTask(task.id, 'comment', e.target.value)}
                          className="w-full h-24 bg-gray-900 border border-gray-600 rounded-xl p-5 text-lg focus:border-blue-400 resize-vertical focus:outline-none"
                          placeholder="Ajouter un commentaire..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={saveChanges}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 py-8 px-12 rounded-3xl text-2xl font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-4 mt-12 border-4 border-transparent hover:border-blue-400"
            >
              <CheckCircle size={36} />
              Sauvegarder Modifications
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (taskCompleteModalOpen && selectedIncident) {
    return (
      <div className="fixed inset-0 bg-black/80 z-[1001] flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-3xl border-4 border-green-500/50 max-w-4xl w-full max-h-[90vh] overflow-auto p-8 shadow-2xl backdrop-blur-xl">
          <button 
            onClick={() => setTaskCompleteModalOpen(false)}
            className="absolute top-6 right-6 p-3 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all"
          >
            <X size={28} className="text-gray-400 hover:text-white" />
          </button>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4 justify-center">
            <CheckCircle size={48} className="text-green-500" />
            Marquer Tâche comme Terminée - {selectedIncident.id}
          </h2>
          
          <div className="space-y-6">
            <div className="max-h-60 overflow-y-auto bg-gray-800/30 rounded-2xl p-6 border border-gray-600">
              <label className="block text-xl font-bold text-white mb-4">Sélectionner une tâche à cocher:</label>
              {selectedIncident.tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl mb-3 hover:bg-gray-700 cursor-pointer transition-all group">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="flex-1 text-left p-3 hover:bg-blue-600/30 rounded-xl group-hover:translate-x-2 transition-all"
                  >
                    <div className="font-semibold text-white">{task.name}</div>
                    <div className="text-sm text-gray-400">
                      {task.assignee || 'Non assignée'} • {task.date || 'Sans date'}
                    </div>
                    {task.comment && <div className="text-xs text-gray-500 mt-1 italic">{task.comment}</div>}
                  </button>
                  {selectedTask?.id === task.id && (
                    <CheckCircle size={24} className="text-green-400 ml-auto" />
                  )}
                </div>
              ))}
            </div>

            {selectedTask && (
              <div className="pt-4 border-t border-gray-700">
                <label className="block text-xl font-bold text-white mb-4">Tâche sélectionnée: {selectedTask.name}</label>
                <p className="text-lg text-gray-300 mb-6">Commentaire de validation (requis pour tracer):</p>
                <textarea
                  value={completeComment}
                  onChange={(e) => setCompleteComment(e.target.value)}
                  className="w-full h-28 bg-gray-800 border-2 border-gray-600 rounded-2xl p-6 text-lg placeholder-gray-500 focus:border-green-500 focus:outline-none resize-vertical"
                  placeholder="Décrivez pourquoi cette tâche est terminée (actions faites, résultats...)"
                  required
                />
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button 
                onClick={() => {
                  if (selectedTask && completeComment.trim()) {
                    console.log('Task Completed:', selectedTask.name, 'Comment:', completeComment);
                    // TODO: Mark task as completed in backend
                    // Update local state: add completion timestamp to task
                    setTaskCompleteModalOpen(false);
                    setCompleteComment('');
                    setSelectedTask(null);
                  }
                }}
                disabled={!selectedTask || !completeComment.trim()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 py-6 px-8 rounded-2xl text-xl font-bold shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle size={32} />
                Cocher Terminée
              </button>
              <button 
                onClick={() => {
                  setTaskCompleteModalOpen(false);
                  setCompleteComment('');
                  setSelectedTask(null);
                }}
                className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 py-6 px-8 rounded-2xl text-xl font-bold shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3"
              >
                <X size={32} />
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (attributionOpen && selectedAssignee) {
    const profile = profiles[selectedAssignee as keyof typeof profiles];
    return (
      <div className="fixed inset-0 bg-black/80 z-[1000] flex items-center justify-center p-4">
        <div className="bg-gray-900 rounded-3xl border-4 border-purple-500/50 max-w-2xl w-full max-h-[90vh] overflow-auto p-8 shadow-2xl backdrop-blur-xl">
          <button 
            onClick={closeAttributionModal}
            className="absolute top-6 right-6 p-3 bg-gray-800 rounded-2xl hover:bg-gray-700 transition-all"
          >
            <X size={28} className="text-gray-400 hover:text-white" />
          </button>
          <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-4 justify-center">
            <Users size={48} className="text-purple-500" />
            Profil: {selectedAssignee}
          </h2>
          <div className="space-y-6 text-lg">
            <div className="flex justify-between items-center">
              <label className="block font-bold text-purple-400">Nom Complet:</label>
<button 
                type="button"
                onClick={() => navigator.clipboard.writeText(profile.fullName)}
                className="p-1 text-gray-400 hover:text-white"
                title="Copier"
              >
                <Clipboard size={18} />
              </button>
            </div>
            <p className="text-white">{profile.fullName}</p>

            <div className="flex justify-between items-center">
              <label className="block font-bold text-purple-400">Date de Naissance:</label>
<button 
                type="button"
                onClick={() => navigator.clipboard.writeText(profile.birthDate)}
                className="p-1 text-gray-400 hover:text-white"
                title="Copier"
              >
                <Clipboard size={18} />
              </button>
            </div>
            <p className="text-white">{profile.birthDate}</p>

            <div className="flex justify-between items-center">
              <label className="block font-bold text-purple-400">Province d'Origine:</label>
<button 
                type="button"
                onClick={() => navigator.clipboard.writeText(profile.province)}
                className="p-1 text-gray-400 hover:text-white"
                title="Copier"
              >
                <Clipboard size={18} />
              </button>
            </div>
            <p className="text-white">{profile.province}</p>

            <div className="flex justify-between items-center">
              <label className="block font-bold text-purple-400">ID National:</label>
<button 
                type="button"
                onClick={() => navigator.clipboard.writeText(profile.nationalID)}
                className="p-1 text-gray-400 hover:text-white"
                title="Copier"
              >
                <Clipboard size={18} />
              </button>
            </div>
            <p className="text-white font-mono">{profile.nationalID}</p>

            <div>
              <label className="block font-bold text-purple-400 mb-2">Rôle:</label>
              <p className="text-white">{profile.role}</p>
            </div>
            <div>
              <label className="block font-bold text-purple-400 mb-2">Email:</label>
              <p className="text-white">{profile.email}</p>
            </div>
            <div>
              <label className="block font-bold text-purple-400 mb-2">Téléphone:</label>
              <p className="text-white">{profile.phone}</p>
            </div>
            <div>
              <label className="block font-bold text-purple-400 mb-2">Permissions:</label>
              <div className="bg-gray-800 p-4 rounded-xl space-y-1">
                {profile.permissions.map((perm, i) => (
                  <div key={i} className="flex items-center gap-2 text-blue-400">
                    <CheckCircle size={16} />
                    <span>{perm}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-bold text-purple-400 mb-2">Compétences:</label>
              <div className="bg-gray-800 p-4 rounded-xl space-y-1">
                {profile.competencies.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-green-400">
                    <CheckCircle size={16} />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-bold text-purple-400 mb-2">Détails:</label>
              <p className="text-white italic bg-gray-800 p-4 rounded-xl">{profile.details}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Users size={40} className="text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">Assignations</h1>
          <p className="text-gray-400">Gestion incidents & procédures - tous créateurs</p>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50 sticky top-0">
              <tr>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Créateur</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Procédure</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Tâches</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Date</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Jours</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Assigné</th>
                <th className="px-6 py-5 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {incidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-mono bg-gray-800 px-3 py-1 rounded-full text-blue-400 text-sm font-bold">
                      {incident.id}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        AD
                      </div>
                      <span className="font-semibold text-white">{incident.creator}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-white">{incident.procedureName}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <span className="font-mono text-gray-300">{incident.taskCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm">
                      <div className="font-semibold text-white">{incident.createdDate}</div>
                      <div className="text-gray-500 text-xs">Créé</div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-orange-400 bg-orange-500/20`}>
                      {incident.daysElapsed}j
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_COLORS[incident.status]}`}>
                      {incident.status === 'in_progress' ? 'En cours' : incident.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30`}>
                      {incident.assignedTo}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(incident)}
                        className="p-2 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => {
                          if (incident.tasks.length > 0) {
                            setSelectedTask(incident.tasks[0]);
                            setTaskCompleteModalOpen(true);
                          }
                        }}
                        className="p-2 hover:bg-green-600 rounded-xl text-green-400 hover:text-white transition-all"
                        title="Cocher Action (marquer comme faite)"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedIncident(incident);
                          setTaskCompleteModalOpen(true);
                        }}
                        className="p-2 hover:bg-green-600 rounded-xl text-green-400 hover:text-white transition-all"
                        title="Cocher Action (voir toutes tâches)"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <Link href={`/admin/procedure/${incident.id}`} className="p-2 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-all">
                        <ArrowUpDown size={16} />
                      </Link>
                      <button 
                        onClick={() => openAttributionModal(incident.assignedTo)}
                        className="p-2 hover:bg-purple-600 rounded-xl text-purple-400 hover:text-white transition-all"
                        title="Attribu - Voir profil et accès"
                      >
                        <Key size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl p-8 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-2">{incidents.filter((i) => i.status === 'open').length}</div>
          <div className="text-gray-400 text-sm uppercase tracking-wider">Ouverts</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 rounded-2xl p-8 text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{incidents.filter((i) => i.status === 'in_progress').length}</div>
          <div className="text-gray-400 text-sm uppercase tracking-wider">En cours</div>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 border border-green-500/30 rounded-2xl p-8 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">{incidents.filter((i) => i.status === 'completed').length}</div>
          <div className="text-gray-400 text-sm uppercase tracking-wider">Terminés</div>
        </div>
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl p-8 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-2">{incidents.length}</div>
          <div className="text-gray-400 text-sm uppercase tracking-wider">Total</div>
        </div>
      </div>
    </div>
  );
}

