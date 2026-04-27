'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FileText, Download, Printer, RefreshCw, Edit3, Eye,
  CheckCircle, ChevronRight, Loader2, RotateCcw, Save,
  FileCheck, Car, Home, Receipt, AlertTriangle, IdCard,
  Award, ClipboardList, X
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL || '/backend';

const CATEGORIES = [
  { value: 'CONTRAT_LOCATION_BIEN',     label: 'Contrat de Bail',           icon: Home,          group: 'Immobilier' },
  { value: 'CONTRAT_VENTE_BIEN',        label: 'Acte de Vente Immobilière', icon: Home,          group: 'Immobilier' },
  { value: 'CONTRAT_LOCATION_VEHICULE', label: 'Location Véhicule',         icon: Car,           group: 'Véhicule'   },
  { value: 'CONTRAT_VENTE_VEHICULE',    label: 'Cession Véhicule',          icon: Car,           group: 'Véhicule'   },
  { value: 'RECU_PAIEMENT',             label: 'Reçu de Paiement',          icon: Receipt,       group: 'Finance'    },
  { value: 'MISE_EN_DEMEURE',           label: 'Mise en Demeure',           icon: AlertTriangle, group: 'Juridique'  },
  { value: 'CERTIFICAT_IMMATRICULATION',label: "Certificat d'Immat.",       icon: FileCheck,     group: 'Véhicule'   },
  { value: 'CNI_PROPRIETAIRE',          label: "Carte d'Identité",          icon: IdCard,        group: 'Identité'   },
  { value: 'LICENCE_PROFESSIONNELLE',   label: 'Licence Professionnelle',   icon: Award,         group: 'Identité'   },
  { value: 'PV_ASSEMBLEE',              label: 'PV Assemblée Générale',     icon: ClipboardList, group: 'Juridique'  },
] as const;

type CategoryValue = typeof CATEGORIES[number]['value'];

const SAMPLES: Record<string, any> = {
  CONTRAT_LOCATION_BIEN: {
    bailleurNom: 'Jean Kabila Mukeba', bailleurCni: 'CNI-2025-1234567', bailleurAdresse: 'Av. Kasa-Vubu n°45, Gombe, Kinshasa',
    locataireNom: 'Marie Tshisekedi Lumumba', locataireCni: 'CNI-2025-7654321', locataireAdresse: 'Av. Victoire n°12, Lubumbashi',
    bienAdresse: 'Av. Kasai n°89, Quartier Matonge, Kinshasa', bienDescription: 'Maison R+1 — 3 chambres, salon, cuisine équipée, 2 SDB, garage, 250m²',
    montant: 500, devise: 'USD', dateDebut: '2025-02-01', dateFin: '2026-01-31', lieuSignature: 'Kinshasa',
  },
  CONTRAT_VENTE_BIEN: {
    bailleurNom: 'Paul Mwamba Invest', bailleurCni: 'CNI-2025-1111111', bailleurAdresse: 'Av. du Commerce, Gombe, Kinshasa',
    locataireNom: 'Jacques Chirac SARL', locataireCni: 'CNI-2025-2222222', locataireAdresse: 'Av. de la Paix, Limete, Kinshasa',
    bienAdresse: 'Bd. du 30 Juin n°234, Centre-Ville, Kinshasa', bienDescription: 'Parcelle commerciale 500m², titre foncier CF/2025/789',
    montant: 45000, devise: 'USD', dateDebut: '2025-03-01', dateFin: '2025-03-01', lieuSignature: 'Kinshasa',
  },
  CONTRAT_LOCATION_VEHICULE: {
    bailleurNom: 'ZUWAndaku Auto SARL', bailleurCni: 'RC-KIN-2025-001', bailleurAdresse: 'Av. de la Démocratie n°12, Kinshasa',
    locataireNom: 'Société Minière du Congo', locataireCni: 'CNI-2025-3333333', locataireAdresse: 'Av. Industrielle, Lubumbashi',
    vehiculeMarque: 'Toyota', vehiculeModele: 'Land Cruiser VX 4.5L', vehiculePlaque: 'KIN-456-CD',
    montant: 150, devise: 'USD', dateDebut: '2025-04-01', dateFin: '2025-04-30', lieuSignature: 'Kinshasa',
  },
  CONTRAT_VENTE_VEHICULE: {
    bailleurNom: 'Auto Prestige Kinshasa', bailleurCni: 'CNI-2025-4444444', bailleurAdresse: 'Av. Colonel Mondjiba, Ngaliema',
    locataireNom: 'Fiston Lukeba', locataireCni: 'CNI-2025-5555555', locataireAdresse: 'Av. Pumbu n°7, Kalamu, Kinshasa',
    vehiculeMarque: 'Mercedes-Benz', vehiculeModele: 'Sprinter 516 CDI', vehiculePlaque: 'KIN-789-AB',
    montant: 35000, devise: 'USD', dateDebut: '2025-03-15', dateFin: '2025-03-15', lieuSignature: 'Kinshasa',
  },
  RECU_PAIEMENT: {
    bailleurNom: 'Jean Kabila Mukeba', bailleurCni: 'CNI-2025-1234567', bailleurAdresse: 'Av. Kasa-Vubu n°45, Gombe',
    locataireNom: 'Marie Tshisekedi Lumumba', locataireCni: 'CNI-2025-7654321', locataireAdresse: 'Av. Victoire n°12, Lubumbashi',
    bienAdresse: 'Av. Kasai n°89, Matonge', bienDescription: 'Loyer mensuel — Maison R+1',
    montant: 500, devise: 'USD', dateDebut: '2025-04-01', dateFin: '2025-04-30', lieuSignature: 'Kinshasa',
  },
  MISE_EN_DEMEURE: {
    bailleurNom: 'Jean Kabila Mukeba', bailleurCni: 'CNI-2025-1234567', bailleurAdresse: 'Av. Kasa-Vubu n°45, Gombe',
    locataireNom: 'Marie Tshisekedi Lumumba', locataireCni: 'CNI-2025-7654321', locataireAdresse: 'Av. Victoire n°12, Lubumbashi',
    bienAdresse: 'Av. Kasai n°89, Matonge', bienDescription: 'Arriérés de loyer — 3 mois impayés',
    montant: 1500, devise: 'USD', dateDebut: '2025-01-01', dateFin: '2025-03-31', lieuSignature: 'Kinshasa',
  },
  CERTIFICAT_IMMATRICULATION: {
    bailleurNom: 'Fiston Lukeba', bailleurCni: 'CNI-2025-5555555', bailleurAdresse: 'Av. Pumbu n°7, Kalamu',
    locataireNom: '', locataireCni: '', locataireAdresse: '',
    vehiculeMarque: 'Toyota', vehiculeModele: 'Land Cruiser VX', vehiculePlaque: 'KIN-456-CD',
    montant: 0, devise: 'USD', dateDebut: '2025-01-20', dateFin: '2025-01-20', lieuSignature: 'Kinshasa',
  },
  CNI_PROPRIETAIRE: {
    bailleurNom: 'Jean Kabila Mukeba', bailleurCni: 'CNI-2025-1234567', bailleurAdresse: 'Av. Kasa-Vubu n°45, Gombe, Kinshasa',
    locataireNom: '', locataireCni: '', locataireAdresse: '',
    montant: 0, devise: 'USD', dateDebut: '2020-01-01', dateFin: '2030-01-01', lieuSignature: 'Kinshasa',
  },
  LICENCE_PROFESSIONNELLE: {
    bailleurNom: 'Agence Immobilière Prestige', bailleurCni: 'LIC-2025-001', bailleurAdresse: 'Av. de la Démocratie, Gombe, Kinshasa',
    locataireNom: '', locataireCni: '', locataireAdresse: '',
    montant: 0, devise: 'USD', dateDebut: '2025-01-01', dateFin: '2025-12-31', lieuSignature: 'Kinshasa',
  },
  PV_ASSEMBLEE: {
    bailleurNom: 'Directeur Général — Jean Kabila', bailleurCni: 'CNI-2025-1234567', bailleurAdresse: 'Siège Social, Gombe, Kinshasa',
    locataireNom: 'Secrétaire — Marie Tshisekedi', locataireCni: 'CNI-2025-7654321', locataireAdresse: 'Av. Victoire, Lubumbashi',
    montant: 50000, devise: 'USD', dateDebut: '2025-03-31', dateFin: '18h30', lieuSignature: 'Kinshasa',
  },
};

const defaultForm = {
  category: 'CONTRAT_LOCATION_BIEN' as CategoryValue,
  bailleurNom: '', bailleurCni: '', bailleurAdresse: '',
  locataireNom: '', locataireCni: '', locataireAdresse: '',
  bienAdresse: '', bienDescription: '',
  vehiculeMarque: '', vehiculeModele: '', vehiculePlaque: '',
  montant: 0, devise: 'USD',
  dateDebut: '', dateFin: '', lieuSignature: 'Kinshasa',
};

const isBien = (c: string) => c.includes('BIEN');
const isVehicule = (c: string) => c.includes('VEHICULE') || c === 'CERTIFICAT_IMMATRICULATION';
const needsPartyB = (c: string) => !['CERTIFICAT_IMMATRICULATION', 'CNI_PROPRIETAIRE', 'LICENCE_PROFESSIONNELLE'].includes(c);

// ─── EditForm ─────────────────────────────────────────────────────────────────
function EditForm({ form, setForm, onApply }: {
  form: typeof defaultForm;
  setForm: React.Dispatch<React.SetStateAction<typeof defaultForm>>;
  onApply: () => void;
}) {
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  const inp = "w-full bg-gray-800/80 border border-gray-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 placeholder-gray-600 transition-colors";

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-white">Modifier les champs</p>
          <button
            onClick={onApply}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg font-medium transition-all"
          >
            <Save className="w-3.5 h-3.5" /> Appliquer
          </button>
        </div>

        {/* Partie A */}
        <p className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">Bailleur / Émetteur</p>
        {(['bailleurNom','bailleurCni','bailleurAdresse'] as const).map(k => (
          <div key={k}>
            <label className="block text-xs text-gray-500 mb-1">{k}</label>
            <input value={(form as any)[k] ?? ''} onChange={e => set(k, e.target.value)} className={inp} />
          </div>
        ))}

        {needsPartyB(form.category) && (
          <>
            <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider pt-1">Locataire / Payeur</p>
            {(['locataireNom','locataireCni','locataireAdresse'] as const).map(k => (
              <div key={k}>
                <label className="block text-xs text-gray-500 mb-1">{k}</label>
                <input value={(form as any)[k] ?? ''} onChange={e => set(k, e.target.value)} className={inp} />
              </div>
            ))}
          </>
        )}

        {isBien(form.category) && (
          <>
            <p className="text-xs font-semibold text-violet-400/80 uppercase tracking-wider pt-1">Bien Immobilier</p>
            {(['bienAdresse','bienDescription'] as const).map(k => (
              <div key={k}>
                <label className="block text-xs text-gray-500 mb-1">{k}</label>
                <input value={(form as any)[k] ?? ''} onChange={e => set(k, e.target.value)} className={inp} />
              </div>
            ))}
          </>
        )}

        {isVehicule(form.category) && (
          <>
            <p className="text-xs font-semibold text-amber-400/80 uppercase tracking-wider pt-1">Véhicule</p>
            {(['vehiculeMarque','vehiculeModele','vehiculePlaque'] as const).map(k => (
              <div key={k}>
                <label className="block text-xs text-gray-500 mb-1">{k}</label>
                <input value={(form as any)[k] ?? ''} onChange={e => set(k, e.target.value)} className={inp} />
              </div>
            ))}
          </>
        )}

        <p className="text-xs font-semibold text-rose-400/80 uppercase tracking-wider pt-1">Financier & Dates</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Montant</label>
            <input type="number" value={form.montant} onChange={e => set('montant', Number(e.target.value))} className={inp} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Devise</label>
            <select value={form.devise} onChange={e => set('devise', e.target.value)} className={inp}>
              <option>USD</option><option>CDF</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date début</label>
            <input type="date" value={form.dateDebut} onChange={e => set('dateDebut', e.target.value)} className={inp} />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Date fin</label>
            <input type="date" value={form.dateFin} onChange={e => set('dateFin', e.target.value)} className={inp} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Lieu de signature</label>
          <input value={form.lieuSignature} onChange={e => set('lieuSignature', e.target.value)} className={inp} />
        </div>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DocumentsPage() {
  const [form, setForm] = useState({ ...defaultForm, ...SAMPLES.CONTRAT_LOCATION_BIEN });
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'preview' | 'edit'>('preview');
  const [saved, setSaved] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const groups = [...new Set(CATEGORIES.map(c => c.group))];

  // ── Generate from backend ──────────────────────────────────────────────────
  const generate = useCallback(async (data: typeof form) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/documents/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const text = await res.text();
      setHtml(text);
      setMode('preview');
    } catch {
      setHtml('<div style="padding:40px;text-align:center;color:#ef4444;font-family:sans-serif"><h2>Erreur de connexion au serveur</h2><p>Vérifiez que le backend est démarré sur le port 3000</p></div>');
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Load sample on category change ────────────────────────────────────────
  useEffect(() => {
    const sample = SAMPLES[form.category];
    if (sample) {
      const next = { ...defaultForm, ...sample, category: form.category };
      setForm(next);
    }
  }, [form.category]);

  // ── Debounced auto-preview ─────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => generate(form), 600);
    return () => clearTimeout(debounceRef.current);
  }, [form, generate]);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  // ── Download ───────────────────────────────────────────────────────────────
  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cat = CATEGORIES.find(c => c.value === form.category);
    a.download = `${cat?.label.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    iframeRef.current?.contentWindow?.print();
  };

  // ── Field component ────────────────────────────────────────────────────────
  const Field = ({ label, k, type = 'text', placeholder = '', half = false }: {
    label: string; k: string; type?: string; placeholder?: string; half?: boolean;
  }) => (
    <div className={half ? '' : ''}>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={(form as any)[k] ?? ''}
        onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-800/80 border border-gray-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/30 placeholder-gray-600 transition-colors"
      />
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-80px)] gap-0 bg-gray-950">

      {/* ══ LEFT SIDEBAR ════════════════════════════════════════════════════ */}
      <div className="w-72 shrink-0 flex flex-col border-r border-gray-800/60 bg-gray-900/40">

        {/* Category picker */}
        <div className="p-4 border-b border-gray-800/60">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Type de document</p>
          <div className="space-y-3">
            {groups.map(group => (
              <div key={group}>
                <p className="text-xs text-gray-600 mb-1.5 px-1">{group}</p>
                <div className="space-y-1">
                  {CATEGORIES.filter(c => c.group === group).map(cat => {
                    const Icon = cat.icon;
                    const active = form.category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        onClick={() => set('category', cat.value)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                          active
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-400 hover:bg-gray-800/60 hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{cat.label}</span>
                        {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form fields */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">

          {/* Partie A */}
          <p className="text-xs font-semibold text-blue-400/80 uppercase tracking-wider">
            {form.category.includes('VENTE') ? 'Vendeur / Cédant' : 'Bailleur / Émetteur'}
          </p>
          <Field label="Nom complet" k="bailleurNom" placeholder="Jean Kabila Mukeba" />
          <Field label="N° CNI / RC" k="bailleurCni" placeholder="CNI-2025-XXXXXXX" />
          <Field label="Adresse" k="bailleurAdresse" placeholder="Av. Kasa-Vubu, Gombe" />

          {/* Partie B */}
          {needsPartyB(form.category) && (
            <>
              <p className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider pt-1">
                {form.category.includes('VENTE') ? 'Acquéreur / Cessionnaire' : 'Locataire / Payeur'}
              </p>
              <Field label="Nom complet" k="locataireNom" placeholder="Marie Tshisekedi" />
              <Field label="N° CNI" k="locataireCni" placeholder="CNI-2025-XXXXXXX" />
              <Field label="Adresse" k="locataireAdresse" placeholder="Av. Victoire, Lubumbashi" />
            </>
          )}

          {/* Bien */}
          {isBien(form.category) && (
            <>
              <p className="text-xs font-semibold text-violet-400/80 uppercase tracking-wider pt-1">Bien Immobilier</p>
              <Field label="Adresse du bien" k="bienAdresse" placeholder="Av. Kasai n°89, Matonge" />
              <Field label="Description" k="bienDescription" placeholder="Maison 3 chambres, salon..." />
            </>
          )}

          {/* Véhicule */}
          {isVehicule(form.category) && (
            <>
              <p className="text-xs font-semibold text-amber-400/80 uppercase tracking-wider pt-1">Véhicule</p>
              <Field label="Marque" k="vehiculeMarque" placeholder="Toyota" />
              <Field label="Modèle" k="vehiculeModele" placeholder="Land Cruiser VX" />
              <Field label="Plaque" k="vehiculePlaque" placeholder="KIN-456-CD" />
            </>
          )}

          {/* Finance */}
          <p className="text-xs font-semibold text-rose-400/80 uppercase tracking-wider pt-1">Financier & Dates</p>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Montant" k="montant" type="number" />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Devise</label>
              <select
                value={form.devise}
                onChange={e => set('devise', e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700/60 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500/70"
              >
                <option>USD</option>
                <option>CDF</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Date début" k="dateDebut" type="date" />
            <Field label="Date fin" k="dateFin" type="date" />
          </div>
          <Field label="Lieu de signature" k="lieuSignature" placeholder="Kinshasa" />
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-gray-800/60 space-y-2">
          <button
            onClick={handleDownload}
            disabled={!html}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2.5 rounded-xl font-medium transition-all"
          >
            <Download className="w-4 h-4" /> Télécharger HTML
          </button>
          <button
            onClick={handlePrint}
            disabled={!html}
            className="w-full flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm py-2.5 rounded-xl font-medium transition-all"
          >
            <Printer className="w-4 h-4" /> Imprimer / PDF
          </button>
        </div>
      </div>

      {/* ══ RIGHT: PREVIEW + EDITOR ══════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60 bg-gray-900/30">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">
              {CATEGORIES.find(c => c.value === form.category)?.label}
            </span>
            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Génération...
              </span>
            )}
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-emerald-400">
                <CheckCircle className="w-3 h-3" /> Sauvegardé
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Mode toggle */}
            <div className="flex bg-gray-800/60 rounded-lg p-1 gap-1">
              <button
                onClick={() => setMode('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === 'preview' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Aperçu
              </button>
              <button
                onClick={() => setMode('edit')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  mode === 'edit' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" /> Modifier
              </button>
            </div>



            <button
              onClick={() => generate(form)}
              title="Régénérer"
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/60 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden">
          {!html && !loading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <FileText className="w-14 h-14 mb-4 opacity-20" />
              <p className="text-sm">Remplissez le formulaire pour générer le document</p>
            </div>
          ) : mode === 'preview' ? (
            <iframe
              ref={iframeRef}
              srcDoc={html}
              className="w-full h-full border-0 bg-white"
              title="Aperçu document"
            />
          ) : (
            /* ── EDIT MODE ── */
            <EditForm form={form} setForm={setForm} onApply={() => { generate(form); setMode('preview'); }} />
          )}
        </div>
      </div>
    </div>
  );
}
