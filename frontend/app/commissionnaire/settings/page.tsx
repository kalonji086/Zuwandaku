"use client";

import { useState } from "react";
import Link from "next/link";
import { useDisableAccount } from "../../../lib/hooks/useDisableAccount";
import {
  X,
  Lock,
  AlertTriangle,
  Bell,
  Shield,
  CreditCard,
  Globe,
  LogOut,
  Download,
  DollarSign,
  TrendingUp,
  Calculator,
} from "lucide-react";

interface SwitchProps {
  checked: boolean;
  onChange: () => void;
}

const Switch = ({ checked, onChange }: SwitchProps) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
      checked ? "bg-emerald-600" : "bg-gray-700"
    }`}
  >
    <span className="sr-only">Toggle</span>
    <span
      className={`pointer-events-none absolute mx-0.5 inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default function CommissionnaireSettings() {
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [showRibModal, setShowRibModal] = useState(false);
  const [showSeuilModal, setShowSeuilModal] = useState(false);
  const [threshold, setThreshold] = useState(50000);
  const [newRib, setNewRib] = useState("");
  const [password, setPassword] = useState(""); 
  const disableAccountMutation = useDisableAccount();

  const handleDisableAccount = () => {
    disableAccountMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Paramètres Commissionnaire</h1>
        </div>

        <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-gray-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <DollarSign size={24} />
              Taux de commission
            </h2>
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-emerald-400">5%</span>
                  <span className="text-sm text-gray-400">standard</span>
                </div>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all">
                  Modifier taux
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Votre taux actuel est de 5% sur toutes les transactions. Minimum 3%.
              </p>
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Bell size={22} />
                  Notifications
                </h2>
                <p className="text-gray-400 mt-1">Alertes transactionnelles et activité</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-gray-800 rounded-xl">
                <div>
                  <label className="block text-lg font-semibold text-white">Nouvelles transactions</label>
                  <p className="text-sm text-gray-400 mt-1">Alerte pour chaque nouveau contrat signé</p>
                </div>
                <Switch checked onChange={() => {}} />
              </div>
              
              <div className="flex items-center justify-between p-6 bg-gray-800 rounded-xl">
                <div>
                  <label className="block text-lg font-semibold text-white">Paiements reçus</label>
                  <p className="text-sm text-gray-400 mt-1">Confirmation commission versée</p>
                </div>
                <Switch checked onChange={() => {}} />
              </div>

              <div className="flex items-center justify-between p-6 bg-gray-800 rounded-xl">
                <div>
                  <label className="block text-lg font-semibold text-white">Contrats en retard</label>
                  <p className="text-sm text-gray-400 mt-1">Plus de 30 jours sans paiement</p>
                </div>
                <Switch checked={false} onChange={() => {}} />
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-gray-800">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              📊 Rapports et exports
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button className="group flex items-center gap-4 p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all border-2 border-transparent hover:border-emerald-500">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-xl group-hover:bg-emerald-500/40 p-3 flex items-center justify-center transition-all">
                  <Download size={20} className="text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Rapport mensuel</h3>
                  <p className="text-gray-400">Transactions + commissions du mois</p>
                </div>
              </button>
              
              <button className="group flex items-center gap-4 p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all border-2 border-transparent hover:border-blue-500">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl group-hover:bg-blue-500/40 p-3 flex items-center justify-center transition-all">
                  <TrendingUp size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg mb-1">Statistiques annuelles</h3>
                  <p className="text-gray-400">Performance sur 12 mois</p>
                </div>
              </button>
            </div>
          </div>

          <div className="p-8 border-t border-gray-800">
            <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
              <Shield size={22} />
              Compte bancaire
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                    ECO
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">ECOBANK CD</div>
                    <div className="text-gray-400">**** **** **** 1234</div>
                  </div>
                </div>
                <button 
                  onClick={() => setShowRibModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center gap-2 justify-center"
                >
                  <CreditCard size={16} />
                  Modifier RIB
                </button>
              </div>

              <div className="bg-gray-800 rounded-xl p-6">
                <h4 className="font-bold text-emerald-400 text-lg mb-4">Seuil minimum</h4>
                <div className="flex items-center gap-3 mb-6">
                <input 
                    type="number" 
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-lg"
                    placeholder="50000"
                  />
                  <span className="text-gray-400 font-mono">CDF</span>
                </div>
                <button 
                  onClick={() => setShowSeuilModal(true)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-xl font-semibold transition-all flex items-center gap-2 justify-center"
                >
                  <Calculator size={16} />
                  Enregistrer seuil
                </button>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Commissions inférieures au seuil payées fin de mois
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-gray-800/50 border-t border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <LogOut size={24} />
              Désactiver compte
            </h2>
            <div className="bg-gray-900/50 border border-red-500/30 rounded-2xl p-8">
              <p className="text-gray-300 mb-6 leading-relaxed">
                Désactiver votre compte commissionnaire arrêtera tous les paiements de commission. 
                Vos statistiques seront archivées pendant 12 mois.
              </p>
              <button 
                onClick={() => setShowDisableModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
              >
                Désactiver définitivement
              </button>
            </div>

{showRibModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CreditCard size={20} className="text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Modifier RIB</h3>
        </div>
        <button onClick={() => setShowRibModal(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <X size={20} className="text-gray-400" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Nouveau numéro de compte</label>
          <input
            type="text"
            value={newRib}
            onChange={(e) => setNewRib(e.target.value)}
            placeholder="CD00 0000 0000 0000 0000"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowRibModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors">
            Annuler
          </button>
          <button
            disabled={!newRib}
            onClick={() => { alert("RIB mis à jour"); setShowRibModal(false); setNewRib(""); }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showSeuilModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl max-w-md w-full">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <DollarSign size={20} className="text-emerald-400" />
          <h3 className="text-xl font-bold text-white">Confirmer le seuil</h3>
        </div>
        <button onClick={() => setShowSeuilModal(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <X size={20} className="text-gray-400" />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <p className="text-gray-300 text-sm">
          Nouveau seuil minimum : <span className="text-emerald-400 font-bold">{threshold.toLocaleString()} CDF</span>.<br />
          Les commissions inférieures à ce montant seront versées en fin de mois.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowSeuilModal(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors">
            Annuler
          </button>
          <button
            onClick={() => { alert(`Seuil mis à jour : ${threshold} CDF`); setShowSeuilModal(false); }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold transition-colors"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showDisableModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gray-900 border border-red-500/50 rounded-2xl max-w-md w-full">
      <div className="p-6 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle size={22} className="text-red-400" />
          <div>
            <h3 className="text-xl font-bold text-white">Désactiver compte</h3>
            <p className="text-sm text-gray-400">Cette action est irréversible</p>
          </div>
        </div>
        <button onClick={() => setShowDisableModal(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
          <X size={20} className="text-gray-400" />
        </button>
      </div>
      <div className="p-6 space-y-5">
        <p className="text-gray-300 text-sm leading-relaxed">
          Tous les paiements de commission seront arrêtés. Vos statistiques seront archivées pendant 12 mois.
        </p>
        <div>
          <label className="block text-sm font-semibold text-white mb-2">Confirmer mot de passe</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowDisableModal(false)}
            disabled={disableAccountMutation.isPending}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleDisableAccount}
            disabled={!password || disableAccountMutation.isPending}
            className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            {disableAccountMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Désactivation...
              </>
            ) : "Désactiver"}
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-800">
        <Link href="/commissionnaire/export" className="group bg-gray-800 hover:bg-gray-700 p-8 rounded-2xl border-2 border-transparent hover:border-emerald-500 transition-all text-center block">
          <Download size={32} className="text-emerald-400 group-hover:scale-110 transition-transform mx-auto mb-4" />
          <h3 className="font-bold text-white text-xl mb-2">Export annuel</h3>
          <p className="text-gray-400">Télécharger 2024 complet</p>
        </Link>
        <Link href="/commissionnaire/historique-paiements" className="group bg-gray-800 hover:bg-gray-700 p-8 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all text-center block">
          <CreditCard size={32} className="text-blue-400 group-hover:scale-110 transition-transform mx-auto mb-4" />
          <h3 className="font-bold text-white text-xl mb-2">Historique paiements</h3>
          <p className="text-gray-400">Suivi commissions versées</p>
        </Link>
        <Link href="/commissionnaire/performance" className="group bg-gray-800 hover:bg-gray-700 p-8 rounded-2xl border-2 border-transparent hover:border-purple-500 transition-all text-center block">
          <Globe size={32} className="text-purple-400 group-hover:scale-110 transition-transform mx-auto mb-4" />
          <h3 className="font-bold text-white text-xl mb-2">Performance réseau</h3>
          <p className="text-gray-400">Classement commissionnaires</p>
        </Link>
      </div>
    </div>
  );
}
