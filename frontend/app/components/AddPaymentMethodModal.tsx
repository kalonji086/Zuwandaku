'use client';

import { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Check } from 'lucide-react';

type Method = 'card' | 'mobile' | 'bank';

const METHODS = [
  { id: 'card' as Method, label: 'Carte bancaire', sub: 'Visa, Mastercard', icon: <CreditCard size={18} />, color: 'blue' },
  { id: 'mobile' as Method, label: 'Mobile Money', sub: 'M-Pesa, Airtel Money', icon: <Smartphone size={18} />, color: 'emerald' },
  { id: 'bank' as Method, label: 'Virement bancaire', sub: 'Compte bancaire local', icon: <Building2 size={18} />, color: 'purple' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
  emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  purple: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
};
const iconBg: Record<string, string> = {
  blue: 'bg-blue-500/15 border-blue-500/20 text-blue-400',
  emerald: 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400',
  purple: 'bg-purple-500/15 border-purple-500/20 text-purple-400',
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (method: any) => void;
}

export default function AddPaymentMethodModal({ isOpen, onClose, onAdd }: Props) {
  const [step, setStep] = useState<'choose' | 'form'>('choose');
  const [selected, setSelected] = useState<Method>('card');
  const [form, setForm] = useState({ number: '', name: '', expiry: '', cvv: '', phone: '', operator: 'mpesa', iban: '', bankName: '' });
  const [done, setDone] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('choose'); setDone(false);
    setForm({ number: '', name: '', expiry: '', cvv: '', phone: '', operator: 'mpesa', iban: '', bankName: '' });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = selected === 'card'
      ? { type: 'card', label: `Visa · **** ${form.number.slice(-4)}`, name: form.name }
      : selected === 'mobile'
      ? { type: 'mobile', label: `${form.operator === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} · ${form.phone}` }
      : { type: 'bank', label: `${form.bankName} · ${form.iban.slice(-4)}` };
    onAdd?.(payload);
    setDone(true);
  };

  const m = METHODS.find(x => x.id === selected)!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <CreditCard size={16} className="text-emerald-400" />
            <h2 className="text-sm font-semibold text-white/80">Ajouter un moyen de paiement</h2>
          </div>
          <button onClick={handleClose} className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors">
            <X size={14} />
          </button>
        </div>

        <div className="p-6">
          {done ? (
            /* ── Succès ── */
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Check size={24} className="text-emerald-400" />
              </div>
              <p className="text-white/80 font-semibold">Moyen de paiement ajouté !</p>
              <p className="text-xs text-white/30">Il apparaîtra dans vos méthodes de paiement.</p>
              <button onClick={handleClose}
                className="mt-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/20 text-emerald-400 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all">
                Fermer
              </button>
            </div>
          ) : step === 'choose' ? (
            /* ── Choix du type ── */
            <div className="space-y-3">
              <p className="text-xs text-white/30 mb-4">Choisissez le type de moyen de paiement</p>
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setSelected(m.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                    selected === m.id ? colorMap[m.color] : 'bg-white/3 border-white/5 text-white/50 hover:bg-white/5 hover:text-white/70'
                  }`}>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${selected === m.id ? iconBg[m.color] : 'bg-white/5 border-white/10 text-white/30'}`}>
                    {m.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{m.label}</p>
                    <p className="text-[11px] opacity-60 mt-0.5">{m.sub}</p>
                  </div>
                  {selected === m.id && <Check size={14} className="ml-auto" />}
                </button>
              ))}
              <button onClick={() => setStep('form')}
                className="w-full mt-2 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/20 text-blue-400 py-3 rounded-xl text-sm font-semibold transition-all">
                Continuer →
              </button>
            </div>
          ) : (
            /* ── Formulaire ── */
            <form onSubmit={handleSubmit} className="space-y-4">
              <button type="button" onClick={() => setStep('choose')} className="text-xs text-white/30 hover:text-white/50 transition-colors">← Retour</button>
              <div className={`flex items-center gap-3 p-3 rounded-xl border ${colorMap[m.color]}`}>
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${iconBg[m.color]}`}>{m.icon}</div>
                <div>
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-[10px] opacity-60">{m.sub}</p>
                </div>
              </div>

              {selected === 'card' && (
                <>
                  <Field label="Numéro de carte" placeholder="1234 5678 9012 3456"
                    value={form.number} onChange={v => setForm(f => ({ ...f, number: v }))} maxLength={19} required />
                  <Field label="Nom sur la carte" placeholder="JEAN DUPONT"
                    value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Expiration" placeholder="MM/AA"
                      value={form.expiry} onChange={v => setForm(f => ({ ...f, expiry: v }))} maxLength={5} required />
                    <Field label="CVV" placeholder="123"
                      value={form.cvv} onChange={v => setForm(f => ({ ...f, cvv: v }))} maxLength={4} required />
                  </div>
                </>
              )}

              {selected === 'mobile' && (
                <>
                  <div>
                    <label className="text-xs text-white/40 mb-1.5 block">Opérateur</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[{ id: 'mpesa', label: 'M-Pesa' }, { id: 'airtel', label: 'Airtel Money' }].map(op => (
                        <button key={op.id} type="button" onClick={() => setForm(f => ({ ...f, operator: op.id }))}
                          className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                            form.operator === op.id ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' : 'bg-white/3 border-white/5 text-white/40 hover:bg-white/5'
                          }`}>
                          {op.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Field label="Numéro de téléphone" placeholder="+243 8XX XXX XXX"
                    value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} required />
                </>
              )}

              {selected === 'bank' && (
                <>
                  <Field label="Nom de la banque" placeholder="Rawbank, Equity, ..."
                    value={form.bankName} onChange={v => setForm(f => ({ ...f, bankName: v }))} required />
                  <Field label="IBAN / Numéro de compte" placeholder="CD00 0000 0000 0000"
                    value={form.iban} onChange={v => setForm(f => ({ ...f, iban: v }))} required />
                </>
              )}

              <button type="submit"
                className="w-full bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/20 text-blue-400 py-3 rounded-xl text-sm font-semibold transition-all">
                Ajouter ce moyen de paiement
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, placeholder, value, onChange, maxLength, required }: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; maxLength?: number; required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs text-white/40 mb-1.5 block">{label}</label>
      <input
        value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} maxLength={maxLength} required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/80 placeholder-white/20 focus:border-blue-500/50 focus:outline-none transition-colors"
      />
    </div>
  );
}
