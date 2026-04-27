"use client";

import { useState, useEffect } from 'react';
import { X, Car, DollarSign, Gauge, Calendar, Upload, Phone, MessageCircle, Mail, Facebook, Instagram, Twitter, Globe, Check, Fuel, Users } from 'lucide-react';

const VEHICLE_TYPES  = ['SUV', 'SEDAN', 'UTILITY', 'TRUCK', 'MOTO', 'VAN', 'BUS'];
const FUEL_TYPES     = ['Essence', 'Diesel', 'Hybride', 'Électrique', 'GPL'];
const TRANSMISSIONS  = ['Manuelle', 'Automatique'];
const TRANSACTION    = ['VENTE', 'LOCATION'];

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
  marque: '', modele: '', annee: '', type: 'SUV', transaction: 'VENTE',
  priceSale: '', pricePerDay: '', mileage: '', fuel: '', transmission: '',
  seats: '', color: '', description: '',
  contactPhone: '', contactWhatsapp: '', contactEmail: '',
  contactFacebook: '', contactInstagram: '', contactTwitter: '', contactWebsite: '',
  photos: [] as File[],
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export default function EditVehicleModal({ isOpen, onClose, vehicle, onSave, isLoading }: Props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeContacts, setActiveContacts] = useState<string[]>(['contactPhone', 'contactWhatsapp']);

  useEffect(() => {
    if (vehicle) {
      setForm({
        ...emptyForm,
        marque:       vehicle.marque       || '',
        modele:       vehicle.modele       || '',
        annee:        vehicle.annee        ? String(vehicle.annee)        : '',
        type:         vehicle.type         || 'SUV',
        transaction:  vehicle.priceSale    ? 'VENTE' : 'LOCATION',
        priceSale:    vehicle.priceSale    ? String(vehicle.priceSale)    : '',
        pricePerDay:  vehicle.pricePerDay  ? String(vehicle.pricePerDay)  : '',
        mileage:      vehicle.mileage      ? String(vehicle.mileage)      : '',
        fuel:         vehicle.fuel         || '',
        transmission: vehicle.transmission || '',
        seats:        vehicle.seats        ? String(vehicle.seats)        : '',
        color:        vehicle.color        || '',
        description:  vehicle.description  || '',
        contactPhone:     vehicle.contactPhone     || '',
        contactWhatsapp:  vehicle.contactWhatsapp  || '',
        contactEmail:     vehicle.contactEmail     || '',
        contactFacebook:  vehicle.contactFacebook  || '',
        contactInstagram: vehicle.contactInstagram || '',
        contactTwitter:   vehicle.contactTwitter   || '',
        contactWebsite:   vehicle.contactWebsite   || '',
        photos: [],
      });
      setPreviews(vehicle.photos || []);
      const active = CONTACT_METHODS.filter(m => vehicle[m.key]).map(m => m.key);
      setActiveContacts(active.length ? active : ['contactPhone', 'contactWhatsapp']);
    }
  }, [vehicle]);

  if (!isOpen || !vehicle) return null;

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

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:border-white/40 outline-none transition-colors";
  const labelCls = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Modifier le véhicule</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{vehicle.marque} {vehicle.modele}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Type & Transaction */}
          <div>
            <p className={labelCls}>Type de véhicule *</p>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {VEHICLE_TYPES.map(t => (
                <button key={t} type="button" onClick={() => set('type', t)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${form.type === t ? 'bg-white text-black border-white' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                  {t}
                </button>
              ))}
            </div>
            <p className={labelCls}>Transaction *</p>
            <div className="grid grid-cols-2 gap-2">
              {TRANSACTION.map(t => (
                <button key={t} type="button" onClick={() => set('transaction', t)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${form.transaction === t ? 'bg-white text-black border-white' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Marque, Modèle, Année */}
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

          {/* Prix */}
          <div className="grid grid-cols-2 gap-4">
            {(form.transaction === 'VENTE' || form.transaction === 'LOCATION') && (
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
            )}
            <div>
              <label className={labelCls}>Kilométrage</label>
              <div className="relative">
                <Gauge size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="number" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="45000" className={`${inputCls} pl-9`} />
              </div>
            </div>
          </div>

          {/* Carburant, Transmission, Places, Couleur */}
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
              <label className={labelCls}>Nombre de places</label>
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

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Décrivez votre véhicule..." rows={3} className={`${inputCls} resize-none`} />
          </div>

          {/* Moyens de contact */}
          <div>
            <p className={labelCls}>Moyens de contact</p>
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

          {/* Photos */}
          <div>
            <label className={labelCls}>Photos</label>
            <label className="flex flex-col items-center justify-center w-full p-6 bg-white/5 border border-dashed border-white/10 rounded-xl hover:border-white/30 transition-all cursor-pointer">
              <Upload size={24} className="text-white/30 mb-2" />
              <p className="text-white/40 text-sm">Cliquez pour ajouter des photos</p>
              <input type="file" multiple accept="image/*" onChange={handlePhotos} className="hidden" />
            </label>
            {previews.length > 0 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative group">
                    <img src={p} alt="" className="w-full h-20 object-cover rounded-xl border border-white/10" />
                    <button type="button"
                      onClick={() => { setPreviews(prev => prev.filter((_, j) => j !== i)); setForm(prev => ({ ...prev, photos: prev.photos.filter((_, j) => j !== i) })); }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-all">
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-950 border-t border-white/10 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
          <button onClick={onClose}
            className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl transition-all text-sm">
            Annuler
          </button>
          <button onClick={() => onSave({ ...form, id: vehicle.id })} disabled={isLoading || !form.marque || !form.modele}
            className="px-5 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all text-sm flex items-center gap-2 disabled:opacity-40">
            {isLoading
              ? <><div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />Sauvegarde...</>
              : <><Check size={15} />Sauvegarder</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}
