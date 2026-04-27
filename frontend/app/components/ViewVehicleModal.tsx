"use client";

import { X, Car, DollarSign, Gauge, Calendar, CheckCircle, Phone, MessageCircle, Mail, Facebook, Instagram, Globe, Fuel, Users } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
}

export default function ViewVehicleModal({ isOpen, onClose, vehicle }: Props) {
  if (!isOpen || !vehicle) return null;

  const details = [
    { icon: Car,        label: 'Type',         value: vehicle.type },
    { icon: DollarSign, label: 'Prix vente',    value: vehicle.priceSale   ? `$${vehicle.priceSale?.toLocaleString()}`   : null },
    { icon: DollarSign, label: 'Prix/jour',     value: vehicle.pricePerDay ? `$${vehicle.pricePerDay?.toLocaleString()}/j` : null },
    { icon: Calendar,   label: 'Année',         value: vehicle.annee       ? String(vehicle.annee)   : null },
    { icon: Gauge,      label: 'Kilométrage',   value: vehicle.mileage     ? `${vehicle.mileage?.toLocaleString()} km`   : null },
    { icon: Fuel,       label: 'Carburant',     value: vehicle.fuel        || null },
    { icon: Users,      label: 'Places',        value: vehicle.seats       ? `${vehicle.seats} places` : null },
    { icon: Car,        label: 'Transmission',  value: vehicle.transmission || null },
    { icon: Car,        label: 'Couleur',       value: vehicle.color       || null },
  ].filter(d => d.value);

  const photos: string[] = vehicle.photos?.length ? vehicle.photos : ['https://placehold.co/800x400?text=Vehicule'];

  const contacts = [
    { icon: <Phone size={15} />,        label: 'Téléphone', value: vehicle.contactPhone,    href: `tel:${vehicle.contactPhone}`,                                    color: 'border-white/10 text-white/60' },
    { icon: <MessageCircle size={15} />,label: 'WhatsApp',  value: vehicle.contactWhatsapp, href: `https://wa.me/${vehicle.contactWhatsapp?.replace(/\D/g,'')}`,    color: 'border-green-500/20 text-green-400' },
    { icon: <Mail size={15} />,         label: 'Email',     value: vehicle.contactEmail,    href: `mailto:${vehicle.contactEmail}`,                                 color: 'border-white/10 text-white/60' },
    { icon: <Facebook size={15} />,     label: 'Facebook',  value: vehicle.contactFacebook, href: vehicle.contactFacebook,                                          color: 'border-blue-500/20 text-blue-400' },
    { icon: <Instagram size={15} />,    label: 'Instagram', value: vehicle.contactInstagram,href: `https://instagram.com/${vehicle.contactInstagram}`,              color: 'border-pink-500/20 text-pink-400' },
    { icon: <Globe size={15} />,        label: 'Site web',  value: vehicle.contactWebsite,  href: vehicle.contactWebsite,                                           color: 'border-white/10 text-white/60' },
  ].filter(c => c.value);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-950 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-gray-950 border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{vehicle.marque} {vehicle.modele}</h2>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{vehicle.type} — {vehicle.annee}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors ml-4 shrink-0">
            <X size={18} className="text-white/50" />
          </button>
        </div>

        {/* Photo */}
        <div className="relative h-52 overflow-hidden">
          <img src={photos[0]} alt={vehicle.marque} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-3 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">
            <CheckCircle size={11} /> {vehicle.availability ? 'Disponible' : 'Indisponible'}
          </span>
          <div className="absolute bottom-3 right-4 text-right">
            {vehicle.priceSale   && <p className="text-xl font-bold text-white">${vehicle.priceSale?.toLocaleString()}</p>}
            {vehicle.pricePerDay && <p className="text-sm text-white/70">${vehicle.pricePerDay}/jour</p>}
          </div>
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
        {vehicle.description && (
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Description</p>
            <p className="text-white/70 text-sm leading-relaxed">{vehicle.description}</p>
          </div>
        )}

        {/* Détails */}
        {details.length > 0 && (
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Caractéristiques</p>
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
        )}

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
        <div className="sticky bottom-0 bg-gray-950 border-t border-white/10 px-6 py-4 flex justify-end rounded-b-2xl">
          <button onClick={onClose}
            className="px-6 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
