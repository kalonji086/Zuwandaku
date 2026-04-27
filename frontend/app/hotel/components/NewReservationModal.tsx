"use client";

import { useState, useEffect } from 'react';
import { X, Calendar, BedDouble, User, Phone, Mail, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import type { Room } from '../../../../lib/hooks/useRooms';
import { useRooms } from '../../../../lib/hooks/useRooms';

interface NewReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function NewReservationModal({ isOpen, onClose, onSave }: NewReservationModalProps) {
const [formData, setFormData] = useState({
    guestName: '',
    guestPhone: '',
    guestEmail: '',
    roomType: '',
    checkInDate: '',
    checkOutDate: '',
    pricePerNight: '',
    nights: 0,
    totalAmount: '0.00',
    deposit: '',
    notes: '',
  });
  const [errors, setErrors] = useState({});
const [rooms, setRooms] = useState<string[]>([]);
  const { rooms: availableRooms, loading: roomsLoading } = useRooms({ status: 'AVAILABLE' });
  
  useEffect(() => {
    if (availableRooms.length > 0) {
      setRooms(availableRooms.map(r => `${r.number} - ${r.type}`));
    }
  }, [availableRooms]);
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!formData.guestName.trim()) newErrors.guestName = 'Nom du client requis';
    if (!formData.roomType) newErrors.roomType = 'Chambre requise';
    if (!formData.checkInDate || !formData.checkOutDate || new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) newErrors.dates = 'Dates de séjour invalides';
    if (!formData.pricePerNight || parseFloat(formData.pricePerNight) <= 0) newErrors.pricePerNight = 'Prix par nuit valide requis';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSave(formData);
    onClose();
  };

const calculateTotal = () => {
    if (!formData.checkInDate || !formData.checkOutDate || new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
      setFormData(prev => ({ ...prev, nights: 0, totalAmount: '0.00' }));
      return;
    }
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const price = parseFloat(formData.pricePerNight) || 0;
    const total = nights * price;
    setFormData(prev => ({ ...prev, nights, totalAmount: total.toFixed(2) }));
  };

  const steps = [
    {
      title: 'Client',
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <User size={16} />
              Nom complet *
            </label>
              <input
              type="text"
              value={formData.guestName}
              onChange={(e) => setFormData(prev => ({ ...prev, guestName: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="John Doe"
            />
            {errors.guestName && <p className="text-red-400 text-sm mt-1 ml-2">{errors.guestName}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Phone size={16} />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, guestPhone: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+243 999 123 456"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email
              </label>
              <input
                type="email"
                value={formData.guestEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, guestEmail: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Chambre & Dates',
      icon: BedDouble,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <BedDouble size={16} />
              Type de chambre *
            </label>
            <select
              value={formData.roomType}
              onChange={(e) => setFormData(prev => ({ ...prev, roomType: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={roomsLoading}
            >
              <option value="">Sélectionner une chambre</option>
              {rooms.map((room) => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
            {roomsLoading && <p className="text-blue-400 text-sm mt-1">Chargement des chambres disponibles...</p>}
            {errors.roomType && <p className="text-red-400 text-sm mt-1 ml-2">{errors.roomType}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Arrivée *
              </label>
              <input
                type="date"
                value={formData.checkInDate}
onChange={(e) => {
                  setFormData(prev => ({ ...prev, checkInDate: e.target.value }));
                  calculateTotal();
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
                <Calendar size={16} />
                Départ *
              </label>
              <input
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, checkOutDate: e.target.value }));
                  calculateTotal();
                }}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Tarif & Notes',
      icon: DollarSign,
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              Prix/nuit (USD) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.pricePerNight}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, pricePerNight: e.target.value }));
                calculateTotal();
              }}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="250"
            />
          </div>
          <div className="bg-gray-800/50 p-4 rounded-xl">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Sous-total ({formData.nights} nuit{formData.nights !== 1 ? 's' : ''})</span>
              <span>USD {parseFloat(formData.totalAmount || '0').toLocaleString('fr-FR')}</span>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total TTC</span>
                <span className="text-blue-400">USD {parseFloat(formData.totalAmount || '0').toLocaleString('fr-FR')}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center gap-2">
              <DollarSign size={16} />
              Acompte / Dépôt (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.deposit}
              onChange={(e) => setFormData(prev => ({ ...prev, deposit: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100.00"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">Notes (optionnel)</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="Préférences spéciales, allergies..."
            />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-200">
      <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/100 border-b border-gray-700 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={24} className="text-green-400" />
              <div>
                <h2 className="text-2xl font-bold text-white">Nouvelle réservation</h2>
                <p className="text-sm text-gray-400">Étape {step}/3</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors">
              <X size={24} className="text-gray-400 hover:text-white" />
            </button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mt-6 bg-gray-800 rounded-full p-1">
            {[1,2,3].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition-all ${s <= step ? 'bg-blue-500' : 'bg-gray-600'}`} />
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="min-h-[300px]">
            {steps[step - 1].content}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            {step > 1 && (
                <button 
                  type="button" 
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all font-medium"
                >
                  ← Précédent
                </button>
            )}
            <div className="flex-1" />
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl"
              >
                Suivant →
              </button>
            ) : (
              <button 
                type="submit" 
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl w-full max-w-sm justify-center"
              >
                <CheckCircle size={20} />
                Confirmer réservation
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

