"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, Home, MapPin, Car, Building2, Landmark, Shield, Zap, ChevronDown, CheckCircle, ArrowRight, UserPlus, LogIn, LayoutGrid, Tag, KeyRound, BedDouble, Heart } from "lucide-react";
import ProvinceSelector from "./components/ProvinceSelector";
import Navbar from "./components/Navbar";
import { useProperties, useVehicles } from "../lib/hooks";
import PropertyCard from "./components/PropertyCard";
import VehicleCard from "./components/VehicleCard";
import ReservationModal from "./components/ReservationModal";
import FavoritesModal from "./components/FavoritesModal";
import ViewModal from "./components/ViewModal";
import ContactModal from "./components/ContactModal";

const CATEGORIES = [
  { label: "Maisons", icon: <Home size={18} />, href: "/maisons" },
  { label: "Parcelles", icon: <MapPin size={18} />, href: "/parcelles" },
  { label: "Appartements", icon: <Building2 size={18} />, href: "/appartements" },
  { label: "Véhicules", icon: <Car size={18} />, href: "/vehicles" },
  { label: "Tous les biens", icon: <LayoutGrid size={18} />, href: "/biens" },
];

const STATS = [
  { value: "500+", label: "Biens disponibles" },
  { value: "1200+", label: "Clients satisfaits" },
  { value: "24", label: "Communes couvertes" },
  { value: "98%", label: "Taux de satisfaction" },
];

const FEATURES = [
  { icon: <Shield size={36} className="text-blue-600" />, title: "Sécurisé & Fiable", desc: "Tous les biens sont vérifiés par notre équipe avant publication." },
  { icon: <Zap size={36} className="text-blue-600" />, title: "Rapide & Simple", desc: "Trouvez votre bien en quelques clics, sans paperasse inutile." },
  { icon: <MapPin size={36} className="text-blue-600" />, title: "Local & Précis", desc: "Couverture complète des 24 communes de Kinshasa." },
];

export default function Page() {
  const [search, setSearch] = useState("");
  const [provinceId, setProvinceId] = useState(""); 
  const [activeTab, setActiveTab] = useState<"properties" | "vehicles">("properties");
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal]     = useState(false);
  const [viewItem,    setViewItem]    = useState<any>(null);
  const [contactItem, setContactItem] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);

  const toggleFavorite = (p: any) => setFavorites(prev => prev.find(f => f.id === p.id) ? prev.filter(f => f.id !== p.id) : [...prev, p]);
  const isFavorite = (id: string) => favorites.some(f => f.id === id);

  const { data: properties, isLoading: loadingProps } = useProperties({ limit: 8, sort: "createdAt desc", provinceId });

  const { data: vehicles, isLoading: loadingVehicles } = useVehicles();

  const propertiesArray = Array.isArray(properties) ? properties : [];
  const vehiclesArray = Array.isArray(vehicles) ? vehicles : [];

  const filteredProperties = propertiesArray.filter((p: any) => {
    const searchLower = search.toLowerCase();
    return [p.ville, p.province, p.commune, p.quartier, p.rue, p.avenue, p.type, p.description].some(field => 
      field && field.toString().toLowerCase().includes(searchLower)
    );
  });

  const filteredVehicles = vehiclesArray.filter((v: any) => {
    const s = search.toLowerCase();
    return `${v.marque} ${v.modele} ${v.annee} ${v.description}`.toLowerCase().includes(s);
  });
  
  return (
    <div className="min-h-screen bg-black">
      <Navbar transparent={true} />

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background animé */}
        <div className="absolute inset-0 hero-bg"
          style={{ backgroundImage: "url('/designer.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
        {/* Overlay Starlink : noir profond */}
        <div className="absolute inset-0 bg-black/70" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tight">ZUWAndaku</h1>
          <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto font-light">
            La plateforme #1 pour louer ou acheter maisons, parcelles et véhicules à{" "}
            <span className="text-white font-semibold">Kinshasa</span>
          </p>

            <div className="flex flex-col lg:flex-row gap-3 max-w-4xl mx-auto bg-white/5 backdrop-blur-md p-3 rounded-2xl border border-white/10">
              <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-4 border border-white/10">
                <Search size={18} className="text-white/50" />
                <input
                  type="text"
                  placeholder="Ville, commune, quartier, avenue, rue..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 py-3 outline-none text-white placeholder-white/40 text-base bg-transparent"
                />
              </div>
              <ProvinceSelector value={provinceId || ''} onChange={setProvinceId} className="flex-1 bg-white/10 rounded-xl border border-white/10 text-white" />
              <button className="bg-white hover:bg-white/90 text-black font-semibold px-8 py-3 rounded-xl transition-all flex items-center gap-2 justify-center whitespace-nowrap">
                <Search size={18} /> Rechercher
              </button>
            </div>


          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/properties?type=vente" className="flex items-center gap-2 bg-white text-black font-semibold px-8 py-3 rounded-full transition-all hover:bg-white/90 text-base">
              <Tag size={18} /> À Vendre
            </Link>
            <Link href="/properties?type=location" className="flex items-center gap-2 border border-white/40 text-white font-semibold px-8 py-3 rounded-full transition-all hover:bg-white/10 text-base">
              <KeyRound size={18} /> À Louer
            </Link>
            <button onClick={() => setShowReservationModal(true)} className="flex items-center gap-2 border border-white/40 text-white font-semibold px-8 py-3 rounded-full transition-all hover:bg-white/10 text-base">
              <BedDouble size={18} /> Réservation
            </button>
            <ReservationModal isOpen={showReservationModal} onClose={() => setShowReservationModal(false)} onSubmit={(data) => console.log('Réservation:', data)} />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {CATEGORIES.map((cat) => (
              <Link key={cat.label} href={cat.href} className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-5 py-2 rounded-full font-medium transition-all border border-white/10">
                {cat.icon}{cat.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70 flex flex-col items-center gap-1 text-sm">
          <span>Défiler</span>
          <ChevronDown size={20} />
        </div>
      </section>

      {/* STATS */}
      <section className="bg-black border-y border-white/10 py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold text-white">{s.value}</p>
              <p className="text-white/40 mt-1 text-sm uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* LISTINGS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white mb-2 text-center tracking-tight">Produits récents</h2>
        <p className="text-white/40 text-center mb-8 uppercase tracking-widest text-sm">Découvrez les biens les plus récents de nos propriétaires</p>

        <div className="flex justify-center gap-4 mb-10">
          {(["properties", "vehicles"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === tab ? "bg-white text-black" : "border border-white/20 text-white/60 hover:text-white hover:border-white/40"
              }`}>
              {tab === "properties" ? <><Home size={18} /> Biens immobiliers</> : <><Car size={18} /> Véhicules</>}
            </button>
          ))}
        </div>

        {activeTab === "properties" && (
          loadingProps ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="rounded-2xl animate-pulse h-72" style={{ background:"#0d1526" }} />)}
            </div>
          ) : filteredProperties.length === 0 ? (
            <p className="text-center py-16" style={{ color:"#6b7fa3" }}>Aucun bien trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProperties.slice(0, 8).map((p: any) => (
                <PropertyCard key={p.id} p={p} onFavoriteToggle={toggleFavorite} isFav={isFavorite(p.id)} />
              ))}
            </div>
          )
        )}

        {activeTab === "vehicles" && (
          loadingVehicles ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => <div key={i} className="rounded-2xl animate-pulse h-72" style={{ background:"#0d1526" }} />)}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <p className="text-center py-16" style={{ color:"#6b7fa3" }}>Aucun véhicule trouvé.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVehicles.slice(0, 8).map((v: any) => <VehicleCard key={v.id} v={v} />)}
            </div>
          )
        )}

        <ViewModal
          isOpen={!!viewItem}
          item={viewItem}
          onClose={() => setViewItem(null)}
          onContact={() => { setContactItem(viewItem); setViewItem(null); }}
        />
        <ContactModal
          isOpen={!!contactItem}
          item={contactItem}
          onClose={() => setContactItem(null)}
        />
        <FavoritesModal
          isOpen={showFavoritesModal}
          onClose={() => setShowFavoritesModal(false)}
          favorites={favorites}
          onRemove={(id) => setFavorites(prev => prev.filter(f => f.id !== id))}
          onView={(p) => { setViewItem({ ...p, _kind: "property" }); setShowFavoritesModal(false); }}
        />

        <div className="flex justify-center gap-4 mt-10">
          <Link href={activeTab === "properties" ? "/properties" : "/vehicles"}
            className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white px-8 py-3 rounded-full font-semibold transition-all">
            Voir toutes les annonces <ArrowRight size={18} />
          </Link>
          <button onClick={() => setShowFavoritesModal(true)}
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white px-8 py-3 rounded-full font-semibold transition-all">
            <Heart size={18} /> Mes favoris {favorites.length > 0 && <span className="bg-white text-black text-xs font-bold px-2 py-0.5 rounded-full">{favorites.length}</span>}
          </button>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-black border-t border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Pourquoi choisir ZUWAndaku ?</h2>
          <p className="text-white/40 uppercase tracking-widest text-sm mb-12">Simple. Rapide. Fiable.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-[#111] rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all">
                <div className="flex justify-center mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black border-t border-white/10 py-16 text-center">
        <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Prêt à trouver votre bien ?</h2>
        <p className="text-white/40 text-base mb-8">Rejoignez des milliers de Kinois qui font confiance à ZUWAndaku</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="inline-flex items-center gap-2 justify-center bg-white text-black font-semibold px-10 py-4 rounded-full hover:bg-white/90 transition-all text-base">
            <UserPlus size={20} />Créer un compte gratuit
          </Link>
          <Link href="/properties" className="inline-flex items-center gap-2 justify-center border border-white/30 text-white font-semibold px-10 py-4 rounded-full hover:border-white transition-all text-base">
            <Search size={20} />Parcourir les annonces
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 text-white/40 pt-12 pb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="ZUWAndaku" width={36} height={36} className="rounded-lg" />
                <span className="text-white font-bold text-lg">ZUWAndaku</span>
              </div>
              <p className="text-sm leading-relaxed">La plateforme #1 de location et vente immobilière et véhicules à Kinshasa, RDC.</p>
            </div>
            {/* Annonces */}
            <div>
              <h4 className="text-white font-semibold mb-4">Annonces</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/maisons" className="hover:text-white transition-colors flex items-center gap-1"><Home size={13} />Maisons</Link></li>
                <li><Link href="/appartements" className="hover:text-white transition-colors flex items-center gap-1"><Building2 size={13} />Appartements</Link></li>
                <li><Link href="/parcelles" className="hover:text-white transition-colors flex items-center gap-1"><Landmark size={13} />Parcelles</Link></li>
                <li><Link href="/vehicles" className="hover:text-white transition-colors flex items-center gap-1"><Car size={13} />Véhicules</Link></li>
                <li><Link href="/biens" className="hover:text-white transition-colors flex items-center gap-1"><LayoutGrid size={13} />Tous les biens</Link></li>
              </ul>
            </div>
            {/* Aide */}
            <div>
              <h4 className="text-white font-semibold mb-4">Aide & Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/support" className="hover:text-white transition-colors">Support</Link></li>
                <li><Link href="/helpdesk" className="hover:text-white transition-colors">Helpdesk</Link></li>
              </ul>
            </div>
            {/* Légal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
                <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Politique de confidentialité</Link></li>
                <li><Link href="/parametres-confidentialite" className="hover:text-white transition-colors">Paramètres de confidentialité</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            © {new Date().getFullYear()} ZUWAndaku SARL — Kinshasa, République Démocratique du Congo. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
