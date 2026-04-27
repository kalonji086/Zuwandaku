"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck, Home } from "lucide-react";
import { useLogin } from "../../lib/hooks/useLogin";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CLIENT" | "PROPRIETAIRE" | "COMMISSIONNAIRE" | "HOTEL">("CLIENT");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const loginMutation = useLogin();
  const queryClient = loginMutation.queryClient;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = "L'email est requis";
    if (!password) newErrors.password = "Le mot de passe est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    loginMutation.mutate({ email, password }, { 
      onSuccess: (data: any) => {
        queryClient.invalidateQueries({ queryKey: ['admin-users'] });
        setTimeout(() => {
          const role = data?.user?.role;
          if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
            router.push('/admin');
          } else if (role === 'DEPT_ADMIN') {
            router.push('/admin/dept-dashboard');
          } else if (role === 'PROPRIETAIRE') {
            router.push('/proprietaire');
          } else if (role === 'COMMISSIONNAIRE') {
            router.push('/commissionnaire');
          } else if (role === 'HOTEL') {
            router.push('/hotel');
          } else {
            router.push('/client');
          }
        }, 500);
      }
    });

  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden relative">
      {/* Background animé */}
      <div className="absolute inset-0 hero-bg"
        style={{ backgroundImage: "url('/designer.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="ZUWAndaku" width={56} height={56} className="rounded-xl mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Connexion</h1>
          <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">Bienvenue sur ZUWAndaku</p>
        </div>

        <Link href="/" className="inline-flex items-center justify-center gap-2 text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded-xl py-2 transition-all mb-6 w-full text-sm">
          <Home size={16} /> Retour à l'accueil
        </Link>

        {loginMutation.isError && (
          <div className="border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl px-4 py-3 text-sm mb-6">
            Email ou mot de passe incorrect.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 form-scroll max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Email *</label>
            <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.email ? "border-red-500/50" : "border-white/10"}`}>
              <Mail size={16} className="text-white/30" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder="votre@email.com" required />
            </div>
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Mot de passe *</label>
            <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${errors.password ? "border-red-500/50" : "border-white/10"}`}>
              <Lock size={16} className="text-white/30" />
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/30 hover:text-white/60">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Connecter en tant que *</label>
            <div className="flex items-center gap-2 border border-white/10 rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors">
              <ShieldCheck size={16} className="text-white/30" />
              <select value={role} onChange={(e) => setRole(e.target.value as any)} className="flex-1 py-3 outline-none text-white bg-transparent text-sm">
                <option value="CLIENT" className="bg-black">Client</option>
                <option value="PROPRIETAIRE" className="bg-black">Propriétaire</option>
                <option value="COMMISSIONNAIRE" className="bg-black">Commissionnaire</option>
                <option value="HOTEL" className="bg-black">Hôtel</option>
              </select>
            </div>
          </div>

          <button type="submit" disabled={loginMutation.isPending}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-semibold transition-all disabled:opacity-40 mt-2">
            <LogIn size={18} />{loginMutation.isPending ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center text-white/30 mt-4 text-sm">
          <Link href="/mot-de-passe-oublie" className="text-white/50 hover:text-white transition-colors">Mot de passe oublié ?</Link>
        </p>
        <p className="text-center text-white/30 mt-3 text-sm">
          Pas de compte ?{" "}
          <Link href="/register" className="text-white hover:underline font-semibold">S'inscrire</Link>
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
