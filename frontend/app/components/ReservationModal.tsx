"use client";

import { useState } from 'react';
import { X, Calendar, BedDouble, User, Phone, Mail, Users, CheckCircle, ArrowRight, CreditCard, Smartphone, Building } from 'lucide-react';

const ROOMS = [
  { id: '101', type: 'Suite Deluxe', price: 250, maxGuests: 2 },
  { id: '102', type: 'Chambre Standard', price: 150, maxGuests: 2 },
  { id: '201', type: 'Suite Présidentielle', price: 450, maxGuests: 4 },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function ReservationModal({ isOpen, onClose, onSubmit }: Props) {
  const [step, setStep] = useState<'details' | 'rooms' | 'payment'>('details');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', guests: 1,
    checkIn: '', checkOut: '', roomId: '', specialRequests: '', paymentMethod: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const nextStep = () => {
    if (step === 'details') setStep('rooms');
    else if (step === 'rooms' && form.roomId) setStep('payment');
  };
  const prevStep = () => setStep(step === 'payment' ? 'rooms' : 'details');

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit(form);
    alert('Nous avons recu votre demande. Nous allons vous appeler dans quelques heures.');
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  const totalNights = form.checkIn && form.checkOut
    ? Math.max(0, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  const selectedRoom = ROOMS.find(r => r.id === form.roomId);
  const totalPrice = (selectedRoom?.price ?? 0) * totalNights;

  const inputCls = "w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:border-white/40 outline-none text-white placeholder-white/20 text-sm transition-colors";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-white/10 p-5 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center">
              <BedDouble size={18} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Nouvelle Réservation</h2>
              <p className="text-white/40 text-xs uppercase tracking-widest">
                Étape {step === 'details' ? '1/3' : step === 'rooms' ? '2/3' : '3/3'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pb-12">

          {step === 'details' && (
            <div className="space-y-4">
              {([
                { field: 'name',  label: 'Nom complet', type: 'text',  icon: User,     placeholder: 'Dupont Marie' },
                { field: 'email', label: 'Email',        type: 'email', icon: Mail,     placeholder: 'marie@example.com' },
                { field: 'phone', label: 'Téléphone',    type: 'tel',   icon: Phone,    placeholder: '+243 999 123 456' },
              ] as const).map(({ field, label, type, icon: Icon, placeholder }) => (
                <div key={field}>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest flex items-center gap-2">
                    <Icon size={13} /> {label} *
                  </label>
                  <input type={type} value={(form as any)[field]} onChange={(e) => handleChange(field, e.target.value)}
                    className={inputCls} placeholder={placeholder} />
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={13} /> Arrivée *
                  </label>
                  <input type="date" value={form.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => { handleChange('checkIn', e.target.value); if (form.checkOut && e.target.value >= form.checkOut) handleChange('checkOut', ''); }}
                    className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest flex items-center gap-2">
                    <Calendar size={13} /> Départ *
                  </label>
                  <input type="date" value={form.checkOut}
                    min={form.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleChange('checkOut', e.target.value)}
                    className={inputCls} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest flex items-center gap-2">
                  <Users size={13} /> Nombre de personnes
                </label>
                <select value={form.guests} onChange={(e) => handleChange('guests', parseInt(e.target.value))} className={inputCls}>
                  {[1,2,3,4].map(n => <option key={n} value={n} className="bg-black">{n} personne{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
            </div>
          )}

          {step === 'rooms' && (
            <div>
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Choisissez votre chambre</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {ROOMS.map((room) => (
                  <div key={room.id}
                    className={`p-5 border rounded-xl cursor-pointer transition-all ${
                      form.roomId === room.id ? 'border-white/40 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                    onClick={() => handleChange('roomId', room.id)}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-lg flex items-center justify-center">
                        <BedDouble size={16} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-sm">{room.type}</h4>
                        <p className="text-white font-bold text-sm">${room.price}<span className="text-white/40 text-xs">/nuit</span></p>
                      </div>
                    </div>
                    <p className="text-white/40 text-xs">Max {room.maxGuests} personne{room.maxGuests > 1 ? 's' : ''}</p>
                    {totalNights > 0 && <p className="text-white/60 text-xs mt-1">Total: ${room.price * totalNights}</p>}
                  </div>
                ))}
              </div>
              <textarea value={form.specialRequests} onChange={(e) => handleChange('specialRequests', e.target.value)}
                placeholder="Demandes spéciales..."
                className={`${inputCls} resize-none`} rows={3} />
            </div>
          )}

          {step === 'payment' && (
            <div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-5">
                <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Résumé</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>{selectedRoom?.type || 'Non sélectionnée'}</span>
                    <span>${selectedRoom?.price ?? 0} × {totalNights} nuit{totalNights > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex justify-between font-bold text-white pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span>${totalPrice}</span>
                  </div>
                </div>
              </div>

              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Méthode de paiement</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'card',    label: 'Carte bancaire', icon: <CreditCard size={18} /> },
                  { id: 'mobile',  label: 'Airtel Money',   icon: <Smartphone size={18} /> },
                  { id: 'vodacom', label: 'M-Pesa',         icon: <Smartphone size={18} /> },
                  { id: 'bank',    label: 'Virement',       icon: <Building size={18} /> },
                ].map((method) => (
                  <button key={method.id} onClick={() => handleChange('paymentMethod', method.id)}
                    className={`p-4 border rounded-xl flex items-center gap-3 text-left transition-all text-sm ${
                      form.paymentMethod === method.id
                        ? 'border-white/40 bg-white/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20'
                    }`}>
                    {method.icon}
                    <span>{method.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-black/90 backdrop-blur-xl border-t border-white/10 p-5 rounded-b-2xl flex gap-3 justify-end">
          {step !== 'details' && (
            <button onClick={prevStep}
              className="px-6 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 font-medium rounded-xl transition-all text-sm">
              Précédent
            </button>
          )}
          {step === 'payment' ? (
            <button onClick={handleSubmit} disabled={loading || !form.paymentMethod}
              className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all disabled:opacity-40 flex items-center gap-2 text-sm">
              {loading
                ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Confirmation...</>
                : <><CheckCircle size={16} />Confirmer la réservation</>
              }
            </button>
          ) : (
            <button onClick={nextStep}
              disabled={
                step === 'details'
                  ? !form.name || !form.email || !form.phone || !form.checkIn || !form.checkOut || totalNights <= 0
                  : !form.roomId
              }
              className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all disabled:opacity-40 flex items-center gap-2 text-sm">
              Suivant <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
