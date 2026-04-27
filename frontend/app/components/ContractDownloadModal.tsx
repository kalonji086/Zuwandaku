'use client';

import { X, Download, FileText, FileSpreadsheet } from 'lucide-react';

interface Contract {
  id: string;
  title?: string;
  type: string;
  status: string;
  amount: number;
  currency?: string;
  startDate: string;
  endDate?: string;
  client?: { name: string; phone?: string; email?: string };
  owner?: { name: string; phone?: string };
  property?: { type: string; ville?: { nom: string } };
  vehicle?: { marque: string; modele: string; annee: number };
}

interface Props {
  contract: Contract | null;
  onClose: () => void;
}

function downloadCSV(contract: Contract) {
  const asset = contract.property
    ? `${contract.property.type} - ${contract.property.ville?.nom ?? ''}`
    : contract.vehicle
    ? `${contract.vehicle.marque} ${contract.vehicle.modele} (${contract.vehicle.annee})`
    : '';

  const rows = [
    ['Champ', 'Valeur'],
    ['ID Contrat', contract.id],
    ['Titre', contract.title ?? 'Contrat'],
    ['Type', contract.type],
    ['Statut', contract.status],
    ['Bien / Véhicule', asset],
    ['Client', contract.client?.name ?? ''],
    ['Téléphone client', contract.client?.phone ?? ''],
    ['Propriétaire', contract.owner?.name ?? ''],
    ['Montant', `${contract.amount} ${contract.currency ?? 'USD'}`],
    ['Date début', new Date(contract.startDate).toLocaleDateString('fr-FR')],
    ['Date fin', contract.endDate ? new Date(contract.endDate).toLocaleDateString('fr-FR') : ''],
  ];

  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contrat_${contract.id.slice(0, 8)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPDF(contract: Contract) {
  const asset = contract.property
    ? `${contract.property.type} — ${contract.property.ville?.nom ?? ''}`
    : contract.vehicle
    ? `${contract.vehicle.marque} ${contract.vehicle.modele} (${contract.vehicle.annee})`
    : '—';

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8"/>
  <title>Contrat ${contract.id.slice(0, 8).toUpperCase()}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1a1a1a; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 3px solid #2563eb; padding-bottom: 20px; }
    .logo { font-size: 24px; font-weight: 900; color: #2563eb; }
    .logo span { color: #1a1a1a; }
    .badge { padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; background: #dcfce7; color: #16a34a; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .ref { font-size: 12px; color: #6b7280; }
    .section { margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; margin-bottom: 12px; }
    .card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; }
    .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
    .row:last-child { border-bottom: none; }
    .row .label { color: #6b7280; }
    .row .value { font-weight: 600; }
    .amount { color: #16a34a; font-size: 18px; font-weight: 800; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; }
    .sig-box { border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
    .sig-line { border-top: 1px solid #374151; margin-top: 48px; margin-bottom: 8px; }
    .sig-label { font-size: 11px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="logo">ZUWAN<span>DAKU</span></div>
      <div style="font-size:11px;color:#6b7280;margin-top:4px;">Plateforme immobilière & véhicules — Kinshasa, RDC</div>
    </div>
    <div style="text-align:right">
      <div class="badge">${contract.status}</div>
      <div style="font-size:11px;color:#6b7280;margin-top:8px;">Émis le ${new Date().toLocaleDateString('fr-FR')}</div>
    </div>
  </div>

  <div class="section">
    <h1>${contract.title ?? 'Contrat de ' + contract.type}</h1>
    <div class="ref">Référence : #${contract.id.slice(0, 12).toUpperCase()}</div>
  </div>

  <div class="section">
    <div class="section-title">Objet du contrat</div>
    <div class="card">
      <div class="row"><span class="label">Bien / Véhicule</span><span class="value">${asset}</span></div>
      <div class="row"><span class="label">Type</span><span class="value">${contract.type}</span></div>
      <div class="row"><span class="label">Montant</span><span class="value amount">${contract.amount.toLocaleString()} ${contract.currency ?? 'USD'}</span></div>
      <div class="row"><span class="label">Date début</span><span class="value">${new Date(contract.startDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
      ${contract.endDate ? `<div class="row"><span class="label">Date fin</span><span class="value">${new Date(contract.endDate).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Parties</div>
    <div class="grid">
      <div class="card">
        <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">CLIENT</div>
        <div style="font-weight:700;font-size:14px;">${contract.client?.name ?? '—'}</div>
        ${contract.client?.phone ? `<div style="font-size:12px;color:#6b7280;margin-top:4px;">${contract.client.phone}</div>` : ''}
        ${contract.client?.email ? `<div style="font-size:12px;color:#6b7280;">${contract.client.email}</div>` : ''}
      </div>
      <div class="card">
        <div style="font-size:11px;color:#6b7280;margin-bottom:8px;">PROPRIÉTAIRE</div>
        <div style="font-weight:700;font-size:14px;">${contract.owner?.name ?? '—'}</div>
        ${contract.owner?.phone ? `<div style="font-size:12px;color:#6b7280;margin-top:4px;">${contract.owner.phone}</div>` : ''}
      </div>
    </div>
  </div>

  <div class="section" style="margin-top:40px;">
    <div class="grid">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Signature Client — ${contract.client?.name ?? ''}</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Signature Propriétaire — ${contract.owner?.name ?? ''}</div>
      </div>
    </div>
  </div>

  <div class="footer">
    <span>ZuwanDaku · Kinshasa, RDC</span>
    <span>Document généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onload = () => {
      win.print();
      URL.revokeObjectURL(url);
    };
  }
}

export { downloadCSV, downloadPDF };

export default function ContractDownloadModal({ contract, onClose }: Props) {
  if (!contract) return null;

  const title = contract.title ?? `Contrat #${contract.id.slice(0, 8).toUpperCase()}`;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Download size={20} className="text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Télécharger</h2>
              <p className="text-xs text-gray-400 truncate max-w-[180px]">{title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <button
            onClick={() => { downloadPDF(contract); onClose(); }}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-red-500/10 border border-gray-700 hover:border-red-500/50 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center group-hover:bg-red-500/30 transition-colors flex-shrink-0">
              <FileText size={20} className="text-red-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Télécharger PDF</p>
              <p className="text-xs text-gray-400">Document imprimable avec signatures</p>
            </div>
          </button>

          <button
            onClick={() => { downloadCSV(contract); onClose(); }}
            className="w-full flex items-center gap-4 p-4 bg-gray-800 hover:bg-green-500/10 border border-gray-700 hover:border-green-500/50 rounded-xl transition-all group"
          >
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors flex-shrink-0">
              <FileSpreadsheet size={20} className="text-green-400" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-white">Télécharger Excel / CSV</p>
              <p className="text-xs text-gray-400">Données tabulaires compatibles Excel</p>
            </div>
          </button>
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose} className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors">
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
}
