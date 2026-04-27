"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Home, Mail, Lock, User, UserPlus, Eye, EyeOff, ShieldCheck, Phone, FileText, MapPin, Briefcase } from "lucide-react";
import { useRegister } from "../../lib/hooks/useRegister";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    role: "CLIENT" as "" | "CLIENT" | "PROPRIETAIRE" | "COMMISSIONNAIRE" | "HOTEL",
    phone: "",
    address: "",
    cni: "",
    siret: "",
    licenseNumber: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const registerMutation = useRegister();

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [field]: e.target.value });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Le nom complet est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    if (!formData.password || formData.password.length < 8) newErrors.password = "Le mot de passe doit contenir au moins 8 caractères (majuscules, chiffres recommandés)";
    if (!formData.role) newErrors.role = "Veuillez sélectionner votre rôle";
    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.address.trim()) newErrors.address = "L'adresse complète est requise (incluez commune, avenue etc.)";
    
    if (formData.role === "PROPRIETAIRE") {
      if (!formData.cni.trim()) newErrors.cni = "Numéro CNI requis pour propriétaire";
      if (!formData.siret.trim()) newErrors.siret = "Numéro SIRET requis";
    }
    
    if (formData.role === "COMMISSIONNAIRE") {
      if (!formData.cni.trim()) newErrors.cni = "Numéro CNI requis pour commissionnaire";
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = "Numéro de licence requis";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    registerMutation.mutate(formData as any, { 
      onSuccess: (data: any) => {
        // Attendre 1 seconde avant de rediriger
        setTimeout(() => {
          const r = data?.user?.role;
          if (r === 'PROPRIETAIRE') {
            router.push('/proprietaire');
          } else if (r === 'COMMISSIONNAIRE') {
            router.push('/commissionnaire');
          } else if (r === 'HOTEL') {
            router.push('/hotel');
          } else {
            router.push('/client');
          }
        }, 1000);
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black overflow-hidden relative">
      <div className="absolute inset-0 hero-bg"
        style={{ backgroundImage: "url('/designer.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="ZUWAndaku" width={56} height={56} className="rounded-xl mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Inscription</h1>
          <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">Créez votre compte gratuitement</p>
        </div>

        <Link href="/" className="inline-flex items-center justify-center gap-2 text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-xl py-2 transition-all mb-6 w-full text-sm">
          <Home size={16} /> Retour à l'accueil
        </Link>

        {registerMutation.isError && (
          <div className="border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            {(registerMutation.error as any)?.response?.data?.message || "Une erreur est survenue."}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 form-scroll max-h-[60vh] overflow-y-auto">
          {([
            { field: "name",    label: "Nom complet",    type: "text",  icon: User,      placeholder: "Jean Dupont" },
            { field: "email",   label: "Email",          type: "email", icon: Mail,      placeholder: "votre@email.com" },
            { field: "phone",   label: "Téléphone",      type: "tel",   icon: Phone,     placeholder: "+243 812 345 678" },
            { field: "address", label: "Adresse",        type: "text",  icon: MapPin,    placeholder: "123 Rue de la Paix, Kinshasa" },
          ] as const).map(({ field, label, type, icon: Icon, placeholder }) => (
            <div key={field}>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">{label} *</label>
              <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors[field] ? "border-red-500/50" : "border-white/10"}`}>
                <Icon size={16} className="text-white/30" />
                <input type={type} value={(formData as any)[field]} onChange={set(field)}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder={placeholder} required />
              </div>
              {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Mot de passe *</label>
            <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.password ? "border-red-500/50" : "border-white/10"}`}>
              <Lock size={16} className="text-white/30" />
              <input type={showPassword ? "text" : "password"} value={formData.password} onChange={set("password")}
                className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder="••••••••" minLength={6} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Rôle *</label>
            <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.role ? "border-red-500/50" : "border-white/10"}`}>
              <ShieldCheck size={16} className="text-white/30" />
              <select value={formData.role} onChange={set("role")} className="flex-1 py-3 outline-none text-white bg-transparent text-sm" required>
                <option value="" className="bg-black">-- Sélectionner un rôle --</option>
                <option value="CLIENT" className="bg-black">Client</option>
                <option value="PROPRIETAIRE" className="bg-black">Propriétaire</option>
                <option value="COMMISSIONNAIRE" className="bg-black">Commissionnaire</option>
                <option value="HOTEL" className="bg-black">Hôtel</option>
              </select>
            </div>
            {errors.role && <p className="text-red-400 text-xs mt-1">{errors.role}</p>}
          </div>

          {(formData.role === "PROPRIETAIRE" || formData.role === "COMMISSIONNAIRE") && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Numéro CNI *</label>
              <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.cni ? "border-red-500/50" : "border-white/10"}`}>
                <FileText size={16} className="text-white/30" />
                <input type="text" value={formData.cni} onChange={set("cni")}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder="Ex: CNI-2024-1234567" required />
              </div>
              {errors.cni && <p className="text-red-400 text-xs mt-1">{errors.cni}</p>}
            </div>
          )}

          {formData.role === "PROPRIETAIRE" && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Numéro SIRET *</label>
              <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.siret ? "border-red-500/50" : "border-white/10"}`}>
                <Briefcase size={16} className="text-white/30" />
                <input type="text" value={formData.siret} onChange={set("siret")}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder="Ex: DE123456789" required />
              </div>
              {errors.siret && <p className="text-red-400 text-xs mt-1">{errors.siret}</p>}
            </div>
          )}

          {formData.role === "COMMISSIONNAIRE" && (
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Numéro de Licence *</label>
              <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.licenseNumber ? "border-red-500/50" : "border-white/10"}`}>
                <Briefcase size={16} className="text-white/30" />
                <input type="text" value={formData.licenseNumber} onChange={set("licenseNumber")}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder="Ex: LIC-2024-98765" required />
              </div>
              {errors.licenseNumber && <p className="text-red-400 text-xs mt-1">{errors.licenseNumber}</p>}
            </div>
          )}

          <button type="submit" disabled={registerMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-semibold transition-all disabled:opacity-40 mt-2">
            <UserPlus size={18} />{registerMutation.isPending ? "Inscription..." : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-white/30 mt-6 text-sm">
          Déjà inscrit ?{" "}
          <Link href="/login" className="text-white hover:underline font-semibold">Se connecter</Link>
        </p>
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-3 text-xs text-center">
            <Link href="/politique-confidentialite" className="text-white/30 hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="/mentions-legales" className="text-white/30 hover:text-white transition-colors">Mentions légales</Link>
            <Link href="/parametres-confidentialite" className="text-white/30 hover:text-white transition-colors">Paramètres</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
