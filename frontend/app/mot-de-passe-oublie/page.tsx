"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft, Send, CheckCircle, Lock, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { apiClient } from "../../lib/api-client";

type Step = "email" | "code" | "reset" | "done";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ── Step 1 : email ── */
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiClient.forgotPassword(email);
      setStep("code");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 2 : code OTP ── */
  const handleCodeChange = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...code];
    next[i] = val;
    setCode(next);
    if (val && i < 5) document.getElementById(`otp-${i + 1}`)?.focus();
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) setCode(pasted.split(""));
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (code.join("").length < 6) return setError("Entrez le code à 6 chiffres.");
    setLoading(true);
    try {
      await apiClient.verifyOtp(email, code.join(""));
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Code invalide ou expiré.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setLoading(true);
    try {
      await apiClient.forgotPassword(email);
      setCode(["", "", "", "", "", ""]);
    } catch {
      // silencieux
    } finally {
      setLoading(false);
    }
  };

  /* ── Step 3 : nouveau mot de passe ── */
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) return setError("Le mot de passe doit contenir au moins 8 caractères.");
    if (password !== confirm) return setError("Les mots de passe ne correspondent pas.");
    setLoading(true);
    try {
      await apiClient.resetPassword(email, code.join(""), password);
      setStep("done");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const STEPS = ["email", "code", "reset", "done"];
  const stepIndex = STEPS.indexOf(step);

  const strength = password.length < 1 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : /[A-Z]/.test(password) && /\d/.test(password) ? 4 : 3;
  const strengthColor = ["", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-400"][strength];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden relative">
      <div className="absolute inset-0 hero-bg"
        style={{ backgroundImage: "url('/designer.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-10 w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="ZUWAndaku" width={56} height={56} className="rounded-xl mb-4" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Mot de passe oublié</h1>
          <p className="text-white/40 text-sm mt-1 uppercase tracking-widest">Réinitialisation sécurisée</p>
        </div>

        {/* Progress */}
        {step !== "done" && (
          <div className="flex items-center gap-2 mb-8">
            {["Email", "Code", "Nouveau mot de passe"].map((label, i) => (
              <div key={label} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-1 rounded-full transition-all duration-500 ${i <= stepIndex ? "bg-white" : "bg-white/15"}`} />
                <span className={`text-xs transition-colors ${i <= stepIndex ? "text-white/60" : "text-white/20"}`}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="border border-red-500/30 bg-red-500/10 text-red-400 rounded-xl px-4 py-3 text-sm mb-5">
            {error}
          </div>
        )}

        {/* ── STEP 1 : Email ── */}
        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <p className="text-white/50 text-sm leading-relaxed">
              Entrez l'adresse email associée à votre compte. Nous vous enverrons un code de vérification à 6 chiffres valable <strong className="text-white/70">10 minutes</strong>.
            </p>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Adresse email</label>
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors">
                <Mail size={16} className="text-white/30" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm"
                  placeholder="votre@email.com" required autoFocus />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-semibold transition-all disabled:opacity-40">
              <Send size={18} />{loading ? "Envoi en cours..." : "Envoyer le code"}
            </button>
            <Link href="/login" className="flex items-center justify-center gap-2 text-white/30 hover:text-white text-sm transition-colors">
              <ArrowLeft size={15} />Retour à la connexion
            </Link>
          </form>
        )}

        {/* ── STEP 2 : Code OTP ── */}
        {step === "code" && (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <p className="text-white/50 text-sm leading-relaxed">
              Un code à 6 chiffres a été envoyé à <span className="text-white font-medium">{email}</span>. Vérifiez votre boîte mail (et les spams).
            </p>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-3 uppercase tracking-widest">Code de vérification</label>
              <div className="flex gap-2 justify-center" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input key={i} id={`otp-${i}`} type="text" inputMode="numeric"
                    maxLength={1} value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && i > 0)
                        document.getElementById(`otp-${i - 1}`)?.focus();
                    }}
                    className="w-12 h-14 text-center text-xl font-bold text-white bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/50 transition-colors"
                  />
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading || code.join("").length < 6}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-semibold transition-all disabled:opacity-40">
              <ShieldCheck size={18} />{loading ? "Vérification..." : "Vérifier le code"}
            </button>
            <div className="flex items-center justify-between text-sm">
              <button type="button" onClick={() => setStep("email")} className="flex items-center gap-1 text-white/30 hover:text-white transition-colors">
                <ArrowLeft size={15} />Changer l'email
              </button>
              <button type="button" onClick={handleResend} disabled={loading} className="text-white/30 hover:text-white transition-colors disabled:opacity-40">
                {loading ? "Envoi..." : "Renvoyer le code"}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3 : Nouveau mot de passe ── */}
        {step === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-5">
            <p className="text-white/50 text-sm leading-relaxed">
              Choisissez un nouveau mot de passe sécurisé d'au moins 8 caractères.
            </p>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Nouveau mot de passe</label>
              <div className="flex items-center gap-2 border border-white/10 rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors">
                <Lock size={16} className="text-white/30" />
                <input type={showPwd ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm"
                  placeholder="••••••••" required autoFocus />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="text-white/30 hover:text-white/60">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {[1, 2, 3, 4].map((lvl) => (
                    <div key={lvl} className={`flex-1 h-1 rounded-full transition-all ${lvl <= strength ? strengthColor : "bg-white/10"}`} />
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-widest">Confirmer le mot de passe</label>
              <div className={`flex items-center gap-2 border rounded-xl px-4 bg-white/5 focus-within:border-white/40 transition-colors ${confirm && confirm !== password ? "border-red-500/50" : "border-white/10"}`}>
                <Lock size={16} className="text-white/30" />
                <input type={showConfirm ? "text" : "password"} value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="flex-1 py-3 outline-none text-white bg-transparent placeholder-white/20 text-sm"
                  placeholder="••••••••" required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-white/30 hover:text-white/60">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirm && confirm !== password && (
                <p className="text-red-400 text-xs mt-1">Les mots de passe ne correspondent pas.</p>
              )}
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-semibold transition-all disabled:opacity-40">
              <KeyRound size={18} />{loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
            </button>
          </form>
        )}

        {/* ── STEP 4 : Succès ── */}
        {step === "done" && (
          <div className="flex flex-col items-center text-center py-4 space-y-5">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)" }}>
              <CheckCircle size={40} style={{ color: "var(--sl-success)" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Mot de passe réinitialisé !</h2>
              <p className="text-white/40 text-sm">Votre mot de passe a été mis à jour avec succès. Vous pouvez maintenant vous connecter.</p>
            </div>
            <Link href="/login"
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-white/90 text-black py-3 rounded-xl font-semibold transition-all">
              <ArrowLeft size={18} />Se connecter
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            <Link href="/politique-confidentialite" className="text-white/30 hover:text-white transition-colors">Politique de confidentialité</Link>
            <Link href="/mentions-legales" className="text-white/30 hover:text-white transition-colors">Mentions légales</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
