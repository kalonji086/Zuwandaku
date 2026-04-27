"use client";

import { useState } from 'react';
import { X, MapPin, Home, DollarSign, Ruler, BedDouble, Bath, Car, Calendar, CheckCircle, Phone, Mail, User, MessageCircle, Facebook, Instagram, Twitter, Youtube, Globe, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  property: any;
}

function ContactModal({ property, onClose }: { property: any; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // Données propriétaire — fallback sur des valeurs de démo si absentes
  const owner = {
    name:      property.ownerName  || property.owner?.name  || 'Propriétaire ZUWAndaku',
    phone:     property.ownerPhone || property.owner?.phone || '+243 999 000 000',
    phone2:    property.ownerPhone2 || property.owner?.phone2 || null,
    email:     property.ownerEmail || property.owner?.email || null,
    whatsapp:  property.ownerWhatsapp || property.owner?.whatsapp || property.ownerPhone || property.owner?.phone || '+243 999 000 000',
    facebook:  property.ownerFacebook  || property.owner?.facebook  || null,
    instagram: property.ownerInstagram || property.owner?.instagram || null,
    twitter:   property.ownerTwitter   || property.owner?.twitter   || null,
    youtube:   property.ownerYoutube   || property.owner?.youtube   || null,
    website:   property.ownerWebsite   || property.owner?.website   || null,
  };

  const phones = [owner.phone, owner.phone2].filter(Boolean);

  const socials = [
    { key: 'whatsapp',  label: 'WhatsApp',  href: `https://wa.me/${owner.whatsapp?.replace(/\D/g,'')}`, color: 'bg-green-500/10 border-green-500/20 text-green-400', icon: <MessageCircle size={18} /> },
    { key: 'facebook',  label: 'Facebook',  href: owner.facebook  ? `https://facebook.com/${owner.facebook}`  : null, color: 'bg-blue-500/10 border-blue-500/20 text-blue-400',    icon: <Facebook size={18} /> },
    { key: 'instagram', label: 'Instagram', href: owner.instagram ? `https://instagram.com/${owner.instagram}` : null, color: 'bg-pink-500/10 border-pink-500/20 text-pink-400',   icon: <Instagram size={18} /> },
    { key: 'twitter',   label: 'X / Twitter', href: owner.twitter ? `https://twitter.com/${owner.twitter}` : null, color: 'bg-white/5 border-white/10 text-white/60',             icon: <Twitter size={18} /> },
    { key: 'youtube',   label: 'YouTube',   href: owner.youtube   ? `https://youtube.com/@${owner.youtube}`   : null, color: 'bg-red-500/10 border-red-500/20 text-red-400',       icon: <Youtube size={18} /> },
    { key: 'website',   label: 'Site web',  href: owner.website,                                                       color: 'bg-white/5 border-white/10 text-white/60',           icon: <Globe size={18} /> },
  ].filter(s => s.href);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-black/95 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-sm">

        {/* Header */}
        <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Contacter le propriétaire</h3>
            <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{owner.name}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X size={16} className="text-white/50" />
          </button>
        </div>

        <div className="p-5 space-y-5">

          {/* Téléphones */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Téléphone</p>
            <div className="space-y-2">
              {phones.map((phone, i) => (
                <div key={i} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Phone size={15} className="text-white/40" />
                    <span className="text-white text-sm font-medium">{phone}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => copy(phone!, `phone${i}`)}
                      className="p-1.5 hover:bg-white/10 rounded-lg transition-colors" title="Copier">
                      {copied === `phone${i}` ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-white/40" />}
                    </button>
                    <a href={`tel:${phone}`}
                      className="px-3 py-1 bg-white hover:bg-white/90 text-black text-xs font-semibold rounded-lg transition-all">
                      Appeler
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email */}
          {owner.email && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Email</p>
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Mail size={15} className="text-white/40 shrink-0" />
                  <span className="text-white text-sm truncate">{owner.email}</span>
                </div>
                <div className="flex gap-2 ml-2 shrink-0">
                  <button onClick={() => copy(owner.email!, 'email')}
                    className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                    {copied === 'email' ? <Check size={13} className="text-green-400" /> : <Copy size={13} className="text-white/40" />}
                  </button>
                  <a href={`mailto:${owner.email}`}
                    className="px-3 py-1 bg-white hover:bg-white/90 text-black text-xs font-semibold rounded-lg transition-all">
                    Écrire
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Réseaux sociaux */}
          {socials.length > 0 && (
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Réseaux sociaux</p>
              <div className="grid grid-cols-2 gap-2">
                {socials.map((s) => (
                  <a key={s.key} href={s.href!} target="_blank" rel="noopener noreferrer"
                    className={`flex items-center gap-2.5 border rounded-xl px-3 py-2.5 transition-all hover:opacity-80 text-sm font-medium ${s.color}`}>
                    {s.icon}
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <button onClick={onClose}
            className="w-full py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl transition-all text-sm">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PropertyDetailModal({ isOpen, onClose, property }: Props) {
  const [showContact, setShowContact] = useState(false);

  if (!isOpen || !property) return null;

  const details = [
    { icon: DollarSign, label: 'Prix',          value: `$${property.price?.toLocaleString()}` },
    { icon: Home,       label: 'Type',           value: property.type },
    { icon: MapPin,     label: 'Commune',        value: property.commune },
    { icon: MapPin,     label: 'Quartier',       value: property.quartier },
    { icon: MapPin,     label: 'Avenue/Rue',     value: property.avenue || property.rue || null },
    { icon: MapPin,     label: 'Ville',          value: property.ville },
    { icon: Ruler,      label: 'Superficie',     value: property.superficie ? `${property.superficie} m²` : null },
    { icon: BedDouble,  label: 'Chambres',       value: property.bedrooms != null ? String(property.bedrooms) : null },
    { icon: Bath,       label: 'Salles de bain', value: property.bathrooms != null ? String(property.bathrooms) : null },
    { icon: Car,        label: 'Parking',        value: property.parking != null ? (property.parking ? 'Oui' : 'Non') : null },
    { icon: Calendar,   label: 'Disponible',     value: property.available != null ? (property.available ? 'Oui' : 'Non') : null },
  ].filter(d => d.value);

  const photos: string[] = property.photos?.length ? property.photos : ['https://placehold.co/800x400?text=Bien'];

  return (
    <>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

          {/* Header */}
          <div className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between rounded-t-2xl">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight truncate max-w-sm">
                {property.description || property.type}
              </h2>
              <p className="text-white/40 text-xs uppercase tracking-widest mt-0.5">
                {property.commune}, {property.quartier}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors ml-4 shrink-0">
              <X size={18} className="text-white/50" />
            </button>
          </div>

          {/* Photo hero */}
          <div className="relative h-56 overflow-hidden">
            <img src={photos[0]} alt={property.type} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/10 backdrop-blur border border-white/20 text-white text-xs px-3 py-1.5 rounded-full">
              <CheckCircle size={12} /> Disponible
            </span>
            <span className="absolute bottom-4 right-4 text-2xl font-bold text-white">
              ${property.price?.toLocaleString()}
            </span>
            {photos.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/50 text-white/70 text-xs px-2 py-1 rounded-full">
                +{photos.length - 1} photos
              </div>
            )}
          </div>

          {/* Galerie miniatures */}
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

          {/* Détails grille */}
          {details.length > 0 && (
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Détails</p>
              <div className="grid grid-cols-2 gap-3">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                    <Icon size={15} className="text-white/40 shrink-0" />
                    <div>
                      <p className="text-white/40 text-xs">{label}</p>
                      <p className="text-white text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aperçu propriétaire */}
          <div className="px-6 py-4 border-b border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-3">Propriétaire</p>
            <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/10 border border-white/10 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white/50" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">
                    {property.ownerName || property.owner?.name || 'Propriétaire ZUWAndaku'}
                  </p>
                  <p className="text-white/40 text-xs">
                    {property.ownerPhone || property.owner?.phone || '+243 999 000 000'}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowContact(true)}
                className="px-4 py-2 bg-white hover:bg-white/90 text-black text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5">
                <Phone size={13} /> Contacter
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
            <button onClick={onClose}
              className="px-5 py-2.5 border border-white/10 text-white/50 hover:text-white hover:border-white/30 rounded-xl transition-all text-sm">
              Fermer
            </button>
            <button onClick={() => setShowContact(true)}
              className="px-5 py-2.5 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all text-sm flex items-center gap-2">
              <MessageCircle size={15} /> Voir les contacts
            </button>
          </div>
        </div>
      </div>

      {showContact && (
        <ContactModal property={property} onClose={() => setShowContact(false)} />
      )}
    </>
  );
}
