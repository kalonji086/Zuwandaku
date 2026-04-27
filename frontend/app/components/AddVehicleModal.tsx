"use client";

import { useState } from 'react';
import { X, Car, DollarSign, Gauge, Calendar, Upload, Phone, MessageCircle, Mail, Facebook, Instagram, Twitter, Globe, Check, Plus, ChevronRight, Users, Fuel } from 'lucide-react';
import { useCreateVehicle } from '../../lib/hooks/useCreateVehicle';

const VEHICLE_TYPES  = ['SUV', 'SEDAN', 'UTILITY', 'TRUCK', 'MOTO', 'VAN', 'BUS'];
const FUEL_TYPES     = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
const TRANSMISSIONS  = ['Manuelle', 'Automatique'];
const TRANSACTION    = ['VENTE', 'LOCATION'];
const STEPS          = ['Type', 'Infos', 'Contact', 'Photos'];

const CONTACT_METHODS = [
  { key: 'contactPhone',     label: 'Téléphone',   icon: <Phone size={14} />,         placeholder: '+243 999 000 000',    color: 'border-white/20 text-white/70' },
  { key: 'contactWhatsapp',  label: 'WhatsApp',    icon: <MessageCircle size={14} />, placeholder: '+243 999 000 000',    color: 'border-green-500/30 text-green-400' },
  { key: 'contactEmail',     label: 'Email',       icon: <Mail size={14} />,          placeholder: 'contact@email.com',   color: 'border-white/20 text-white/70' },
  { key: 'contactFacebook',  label: 'Facebook',    icon: <Facebook size={14} />,      placeholder: 'facebook.com/page',   color: 'border-blue-500/30 text-blue-400' },
  { key: 'contactInstagram', label: 'Instagram',   icon: <Instagram size={14} />,     placeholder: '@moncompte',          color: 'border-pink-500/30 text-pink-400' },
  { key: 'contactTwitter',   label: 'X / Twitter', icon: <Twitter size={14} />,       placeholder: '@moncompte',          color: 'border-white/20 text-white/70' },
  { key: 'contactWebsite',   label: 'Site web',    icon: <Globe size={14} />,         placeholder: 'https://monsite.com', color: 'border-white/20 text-white/70' },
];

const emptyForm = {
  type: 'SUV', transaction: 'VENTE',
  marque: '', modele: '', annee: '', priceSale: '', pricePerDay: '',
  mileage: '', fuel: '', transmission: '', seats: '', color: '', description: '',
  contactPhone: '', contactWhatsapp: '', contactEmail: '',
  contactFacebook: '', contactInstagram: '', contactTwitter: '', contactWebsite: '',
  photos: [] as File[],
};

interface Props { isOpen: boolean; onClose: () => void; }

export default function AddVehicleModal({ isOpen, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ...emptyForm });
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeContacts, setActiveContacts] = useState<string[]>(['contactPhone', 'contactWhatsapp']);
  const createVehicle = useCreateVehicle();

  if (!isOpen) return null;

  const set = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    setForm(prev => ({ ...prev, photos: [...prev.photos, ...files].slice(0, 10) }));
    files.forEach(f => {
      const r = new FileReader();
      r.onload = ev => setPreviews(p => [...p, ev.target!.result as string]);
      r.readAsDataURL(f);
    });
  };

  const toggleContact = (key: string) =>
    setActiveContacts(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);

  const canNext = () => {
    if (step === 0) return !!form.type && !!form.transaction;
    if (step === 1) return !!form.marque && !!form.modele && !!(form.priceSale || form.pricePerDay);
    if (step === 2) return activeContacts.some(k => !!(form as any)[k]);
    return true;
  };

  const handleSubmit = () => {
    createVehicle.mutate({
      marque: form.marque, modele: form.modele,
      annee: form.annee ? parseInt(form.annee) : undefined,
      type: form.type as any,
      pricePerDay: form.pricePerDay ? parseFloat(form.pricePerDay) : undefined,
      priceSale:   form.priceSale   ? parseFloat(form.priceSale)   : undefined,
      availability: true, photos: [],
    } as any, {
      onSuccess: () => { onClose(); setForm({ ...emptyForm }); setPreviews([]); setStep(0); }
    });
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:border-white/40 outline-none transition-colors";
  const labelCls = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Ajouter un véhicule</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">Étape {step + 1} / {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-3 border-b border-white/10 shrink-0">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all ${i <= step ? 'bg-white' : 'bg-white/10'}`} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-xs transition-colors ${i === step ? 'text-white' : 'text-white/20'}`}>{s}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* STEP 0 — Type */}
          {step === 0 && (
            <div className="space-y-5">
              <div>
                <p className={labelCls}>Type de véhicule *</p>
                <div className="grid grid-cols-4 gap-2">
                  {VEHICLE_TYPES.map(t => (
                    <button key={t} type="button" onClick={() => set('type', t)}
                      className={`py-3 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-2 ${form.type === t ? 'bg-white text-black border-white' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                      <Car size={18} /> {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className={labelCls}>Transaction *</p>
                <div className="grid grid-cols-2 gap-3">
                  {TRANSACTION.map(t => (
                    <button key={t} type="button" onClick={() => set('transaction', t)}
                      className={`py-3 rounded-xl text-sm font-medium border transition-all ${form.transaction === t ? 'bg-white text-black border-white' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                      {t === 'VENTE' ? '🏷️ Vente' : '🔑 Location'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Infos */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelCls}>Marque *</label>
                  <input type="text" value={form.marque} onChange={e => set('marque', e.target.value)} placeholder="Toyota" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Modèle *</label>
                  <input type="text" value={form.modele} onChange={e => set('modele', e.target.value)} placeholder="Prado" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>Année</label>
                  <div className="relative">
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="number" value={form.annee} onChange={e => set('annee', e.target.value)} placeholder="2022" className={`${inputCls} pl-9`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>{form.transaction === 'VENTE' ? 'Prix de vente (USD) *' : 'Prix / jour (USD) *'}</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="number"
                      value={form.transaction === 'VENTE' ? form.priceSale : form.pricePerDay}
                      onChange={e => set(form.transaction === 'VENTE' ? 'priceSale' : 'pricePerDay', e.target.value)}
                      placeholder="50000" className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Kilométrage</label>
                  <div className="relative">
                    <Gauge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="45000" className={`${inputCls} pl-9`} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Carburant</label>
                  <select value={form.fuel} onChange={e => set('fuel', e.target.value)} className={inputCls}>
                    <option value="" className="bg-gray-900">Sélectionner</option>
                    {FUEL_TYPES.map(f => <option key={f} value={f} className="bg-gray-900">{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Transmission</label>
                  <select value={form.transmission} onChange={e => set('transmission', e.target.value)} className={inputCls}>
                    <option value="" className="bg-gray-900">Sélectionner</option>
                    {TRANSMISSIONS.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Places</label>
                  <div className="relative">
                    <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="number" value={form.seats} onChange={e => set('seats', e.target.value)} placeholder="5" className={`${inputCls} pl-9`} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Couleur</label>
                  <input type="text" value={form.color} onChange={e => set('color', e.target.value)} placeholder="Blanc" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Description</label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)}
                  placeholder="Décrivez votre véhicule..." rows={3} className={`${inputCls} resize-none`} />
              </div>
            </div>
          )}

          {/* STEP 2 — Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <p className={labelCls}>Choisissez vos moyens de contact *</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {CONTACT_METHODS.map(m => (
                    <button key={m.key} type="button" onClick={() => toggleContact(m.key)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                        activeContacts.includes(m.key) ? `bg-white/10 ${m.color}` : 'border-white/10 text-white/30 hover:border-white/20'
                      }`}>
                      {activeContacts.includes(m.key) && <Check size={11} />}
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {CONTACT_METHODS.filter(m => activeContacts.includes(m.key)).map(m => (
                  <div key={m.key} className={`flex items-center gap-3 border rounded-xl px-4 py-3 bg-white/5 focus-within:border-white/30 transition-colors ${m.color}`}>
                    {m.icon}
                    <input type="text" value={(form as any)[m.key]} onChange={e => set(m.key, e.target.value)}
                      placeholder={m.placeholder} className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3 — Photos */}
          {step === 3 && (
            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center w-full p-8 bg-white/5 border border-dashed border-white/10 rounded-xl hover:border-white/30 transition-all cursor-pointer">
                <Upload size={28} className="text-white/30 mb-2" />
                <p className="text-white/50 text-sm font-medium">Cliquez pour ajouter des photos</p>
                <p className="text-white/20 text-xs mt-1">Max 10 photos — JPG, PNG</p>
                <input type="file" multiple accept="image/*" onChange={handlePhotos} className="hidden" />
              </label>
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {previews.map((p, i) => (
                    <div key={i} className="relative group">
                      <img src={p} alt="" className="w-full h-24 object-cover rounded-xl border border-white/10" />
                      <button type="button"
                        onClick={() => { setPreviews(prev => prev.filter((_, j) => j !== i)); setForm(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) })); }}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-all">
                        <X size={18} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-4 flex gap-3 shrink-0">
          <button onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}
            className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl transition-all text-sm disabled:opacity-30">
            Précédent
          </button>
          <div className="flex-1" />
          {step < STEPS.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
              className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all text-sm flex items-center gap-2 disabled:opacity-40">
              Suivant <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={createVehicle.isPending}
              className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all text-sm flex items-center gap-2 disabled:opacity-40">
              {createVehicle.isPending
                ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Publication...</>
                : <><Plus size={15} />Publier le véhicule</>
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
