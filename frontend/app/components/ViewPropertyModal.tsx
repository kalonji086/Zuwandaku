"use client";

import { X, MapPin, Home, DollarSign, Ruler, BedDouble, Bath, Car, CheckCircle, Phone, Mail, MessageCircle, Facebook, Instagram, Globe } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

export default function ViewPropertyModal({ isOpen, onClose, property }: Props) {
  if (!isOpen || !property) return null;

  const details = [
    { icon: Home,       label: 'Type',         value: property.type },
    { icon: DollarSign, label: 'Prix',          value: `$${property.price?.toLocaleString()}` },
    { icon: MapPin,     label: 'Commune',       value: property.commune },
    { icon: MapPin,     label: 'Quartier',      value: property.quartier?.nom || property.quartier },
    { icon: MapPin,     label: 'Ville',         value: property.ville?.nom || property.ville },
    { icon: Ruler,      label: 'Surface',       value: property.surface ? `${property.surface} m²` : null },
    { icon: BedDouble,  label: 'Chambres',      value: property.rooms != null ? String(property.rooms) : null },
    { icon: Bath,       label: 'Salles de bain',value: property.bathrooms != null ? String(property.bathrooms) : null },
    { icon: Car,        label: 'Parking',       value: property.parking != null ? (property.parking ? 'Oui' : 'Non') : null },
  ].filter(d => d.value);

  const photos: string[] = property.photos?.length ? property.photos : ['https://placehold.co/800x400?text=Bien'];

  const contacts = [
    { icon: <Phone size={15} />,       label: 'Téléphone',  value: property.contactPhone,    href: `tel:${property.contactPhone}`,           color: 'border-white/10 text-white/60' },
    { icon: <MessageCircle size={15}/>,label: 'WhatsApp',   value: property.contactWhatsapp, href: `https://wa.me/${property.contactWhatsapp?.replace(/\D/g,'')}`, color: 'border-green-500/20 text-green-400' },
    { icon: <Mail size={15} />,        label: 'Email',      value: property.contactEmail,    href: `mailto:${property.contactEmail}`,         color: 'border-white/10 text-white/60' },
    { icon: <Facebook size={15} />,    label: 'Facebook',   value: property.contactFacebook, href: property.contactFacebook,                  color: 'border-blue-500/20 text-blue-400' },
    { icon: <Instagram size={15} />,   label: 'Instagram',  value: property.contactInstagram,href: `https://instagram.com/${property.contactInstagram}`, color: 'border-pink-500/20 text-pink-400' },
    { icon: <Globe size={15} />,       label: 'Site web',   value: property.contactWebsite,  href: property.contactWebsite,                   color: 'border-white/10 text-white/60' },
  ].filter(c => c.value);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{property.description || property.type}</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
              {property.commune} — {property.quartier?.nom || property.quartier}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors ml-4 shrink-0">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        {/* Photo */}
        <div className="relative h-52 overflow-hidden">
          <img src={photos[0]} alt={property.type} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-3 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">
            <CheckCircle size={11} /> {property.status || 'Disponible'}
          </span>
          <span className="absolute bottom-3 right-4 text-xl font-bold text-white">${property.price?.toLocaleString()}</span>
        </div>

        {/* Galerie */}
        {photos.length > 1 && (
          <div className="flex gap-2 px-6 py-3 border-b border-white/10 overflow-x-auto">
            {photos.slice(1).map((p, i) => (
              <img key={i} src={p} alt="" className="h-14 w-20 object-cover rounded-lg border border-white/10 shrink-0" />
            ))}
          </div>
        )}

        {/* Description */}
        {property.description && (
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Description</p>
            <p className="text-white/70 text-sm leading-relaxed">{property.description}</p>
          </div>
        )}

        {/* Détails */}
        <div className="px-6 py-4 border-b border-white/10">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Détails</p>
          <div className="grid grid-cols-2 gap-3">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                <Icon size={14} className="text-white/40 shrink-0" />
                <div>
                  <p className="text-white/40 text-xs">{label}</p>
                  <p className="text-white text-sm font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacts */}
        {contacts.length > 0 && (
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Moyens de contact</p>
            <div className="grid grid-cols-2 gap-2">
              {contacts.map((c) => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer"
                  className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 text-sm font-medium transition-all hover:opacity-80 bg-white/5 ${c.color}`}>
                  {c.icon} {c.label}
                </a>
              ))}
            </div>
          </div>
        )}


        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-950 border-t border-white/10 px-6 py-4 flex justify-end rounded-b-2xl z-10">
          <button type="button" onClick={onClose}
            className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all text-sm cursor-pointer">
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
