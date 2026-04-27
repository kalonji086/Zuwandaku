"use client";

import { useState, useEffect } from 'react';
import { X, Home, DollarSign, Ruler, BedDouble, Bath, Car, MapPin, Upload, Plus, Phone, MessageCircle, Mail, Facebook, Instagram, Twitter, Globe, Check } from 'lucide-react';

const IMMO_TYPES = ['MAISON', 'APPARTEMENT', 'PARCELLE', 'COMMERCIAL', 'BUREAU'];
const TRANSACTION = ['VENTE', 'LOCATION'];
const PROVINCES = ['Kinshasa', 'Kongo Central', 'Haut-Katanga', 'Nord-Kivu', 'Sud-Kivu', 'Kasaï', 'Kasaï Central', 'Kasaï Oriental', 'Lualaba', 'Ituri', 'Tshopo', 'Équateur'];
const COMMUNES_KIN = ['Gombe', 'Barumbu', 'Kasa-Vubu', 'Kalamu', 'Ngaliema', 'Limete', 'Kinshasa', 'Ngiri-Ngiri', 'Makala', 'Selembao', 'Mont-Ngafula', 'Bumbu', 'Masina', 'Ndjili', 'Kimbanseke'];

const CONTACT_METHODS = [
  { key: 'contactPhone',     label: 'Téléphone',  icon: <Phone size={15} />,        placeholder: '+243 999 000 000',      color: 'border-white/20 text-white/70' },
  { key: 'contactWhatsapp',  label: 'WhatsApp',   icon: <MessageCircle size={15} />, placeholder: '+243 999 000 000',      color: 'border-green-500/30 text-green-400' },
  { key: 'contactEmail',     label: 'Email',      icon: <Mail size={15} />,          placeholder: 'contact@email.com',     color: 'border-white/20 text-white/70' },
  { key: 'contactFacebook',  label: 'Facebook',   icon: <Facebook size={15} />,      placeholder: 'facebook.com/page',     color: 'border-blue-500/30 text-blue-400' },
  { key: 'contactInstagram', label: 'Instagram',  icon: <Instagram size={15} />,     placeholder: '@moncompte',            color: 'border-pink-500/30 text-pink-400' },
  { key: 'contactTwitter',   label: 'X / Twitter',icon: <Twitter size={15} />,       placeholder: '@moncompte',            color: 'border-white/20 text-white/70' },
  { key: 'contactWebsite',   label: 'Site web',   icon: <Globe size={15} />,         placeholder: 'https://monsite.com',   color: 'border-white/20 text-white/70' },
];

const emptyForm = {
  type: 'MAISON', transaction: 'VENTE', price: '', surface: '', rooms: '', bathrooms: '',
  parking: false, province: 'Kinshasa', commune: '', quartier: '', avenue: '', description: '',
  contactPhone: '', contactWhatsapp: '', contactEmail: '',
  contactFacebook: '', contactInstagram: '', contactTwitter: '', contactWebsite: '',
  photos: [] as File[],
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  onSave: (data: any) => void;
  isLoading?: boolean;
}

export default function EditPropertyModal({ isOpen, onClose, property, onSave, isLoading }: Props) {
  const [form, setForm] = useState({ ...emptyForm });
  const [previews, setPreviews] = useState<string[]>([]);
  const [activeContacts, setActiveContacts] = useState<string[]>(['contactPhone', 'contactWhatsapp']);

  useEffect(() => {
    if (property) {
      setForm({
        ...emptyForm,
        type:        property.type        || 'MAISON',
        transaction: property.transaction || 'VENTE',
        price:       property.price       ? String(property.price) : '',
        surface:     property.surface     ? String(property.surface) : '',
        rooms:       property.rooms       ? String(property.rooms) : '',
        bathrooms:   property.bathrooms   ? String(property.bathrooms) : '',
        parking:     property.parking     || false,
        province:    property.province    || 'Kinshasa',
        commune:     property.commune     || '',
        quartier:    property.quartier?.nom || property.quartier || '',
        avenue:      property.avenue      || '',
        description: property.description || '',
        contactPhone:     property.contactPhone     || '',
        contactWhatsapp:  property.contactWhatsapp  || '',
        contactEmail:     property.contactEmail     || '',
        contactFacebook:  property.contactFacebook  || '',
        contactInstagram: property.contactInstagram || '',
        contactTwitter:   property.contactTwitter   || '',
        contactWebsite:   property.contactWebsite   || '',
        photos: [],
      });
      setPreviews(property.photos || []);
      const active = CONTACT_METHODS.filter(m => property[m.key]).map(m => m.key);
      setActiveContacts(active.length ? active : ['contactPhone', 'contactWhatsapp']);
    }
  }, [property]);

  if (!isOpen || !property) return null;

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

  const toggleContact = (key: string) => {
    setActiveContacts(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:border-white/40 outline-none transition-colors";
  const labelCls = "block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Modifier le bien</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{property.type} — {property.commune}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        <div className="p-6 space-y-6">

          {/* Type & Transaction */}
          <div>
            <p className={labelCls}>Type de bien *</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
              {IMMO_TYPES.map(t => (
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

          {/* Prix & Surface */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prix (USD) *</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
                  placeholder="50000" className={`${inputCls} pl-9`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Surface (m²)</label>
              <div className="relative">
                <Ruler size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="number" value={form.surface} onChange={e => set('surface', e.target.value)}
                  placeholder="250" className={`${inputCls} pl-9`} />
              </div>
            </div>
          </div>

          {/* Chambres, SDB, Parking */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Chambres</label>
              <div className="relative">
                <BedDouble size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="number" value={form.rooms} onChange={e => set('rooms', e.target.value)}
                  placeholder="3" className={`${inputCls} pl-9`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Salles de bain</label>
              <div className="relative">
                <Bath size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                <input type="number" value={form.bathrooms} onChange={e => set('bathrooms', e.target.value)}
                  placeholder="2" className={`${inputCls} pl-9`} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Parking</label>
              <button type="button" onClick={() => set('parking', !form.parking)}
                className={`w-full py-3 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${form.parking ? 'bg-white text-black border-white' : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                <Car size={14} /> {form.parking ? 'Oui' : 'Non'}
              </button>
            </div>
          </div>

          {/* Localisation */}
          <div>
            <p className={labelCls}>Localisation *</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <select value={form.province} onChange={e => set('province', e.target.value)} className={inputCls}>
                  {PROVINCES.map(p => <option key={p} value={p} className="bg-gray-900">{p}</option>)}
                </select>
              </div>
              <div>
                <select value={form.commune} onChange={e => set('commune', e.target.value)} className={inputCls}>
                  <option value="" className="bg-gray-900">Commune</option>
                  {COMMUNES_KIN.map(c => <option key={c} value={c} className="bg-gray-900">{c}</option>)}
                </select>
              </div>
              <div>
                <input type="text" value={form.quartier} onChange={e => set('quartier', e.target.value)}
                  placeholder="Quartier" className={inputCls} />
              </div>
              <div>
                <input type="text" value={form.avenue} onChange={e => set('avenue', e.target.value)}
                  placeholder="Avenue / Rue" className={inputCls} />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Décrivez votre bien..." rows={3}
              className={`${inputCls} resize-none`} />
          </div>

          {/* Moyens de contact */}
          <div>
            <p className={labelCls}>Moyens de contact</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {CONTACT_METHODS.map(m => (
                <button key={m.key} type="button" onClick={() => toggleContact(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                    activeContacts.includes(m.key)
                      ? `bg-white/10 ${m.color}`
                      : 'border-white/10 text-white/30 hover:border-white/20'
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
                  <input
                    type="text"
                    value={(form as any)[m.key]}
                    onChange={e => set(m.key, e.target.value)}
                    placeholder={m.placeholder}
                    className="flex-1 bg-transparent outline-none text-white placeholder-white/20 text-sm"
                  />
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
                    <img src={p} alt="" className="w-full h-20 object-cover rounded-lg border border-white/10" />
                    <button type="button" onClick={() => { setPreviews(prev => prev.filter((_, j) => j !== i)); }}
                      className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-all">
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
          <button onClick={() => onSave({ ...form, id: property.id })} disabled={isLoading || !form.price}
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
