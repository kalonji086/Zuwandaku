'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, CheckCircle, DollarSign, TrendingUp } from 'lucide-react';
import { useContracts } from '../../../lib/hooks';

const COMMISSION_RATE = 0.05;
const MONTHS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

export default function ExportAnnuelPage() {
  const [year, setYear] = useState(2024);
  const { data: contracts = [], isLoading } = useContracts({});

  const contractsOfYear = contracts.filter((c: any) => new Date(c.createdAt).getFullYear() === year);

  const byMonth = MONTHS.map((month, i) => {
    const mc = contractsOfYear.filter((c: any) => new Date(c.createdAt).getMonth() === i);
    const volume = mc.reduce((s: number, c: any) => s + c.amount, 0);
    return { month, count: mc.length, volume, commission: volume * COMMISSION_RATE };
  });

  const totalVolume = contractsOfYear.reduce((s: number, c: any) => s + c.amount, 0);
  const totalCommission = totalVolume * COMMISSION_RATE;
  const activeCount = contractsOfYear.filter((c: any) => c.status === 'ACTIVE').length;

  function downloadCSV() {
    const rows = [
      ['Mois', 'Contrats', 'Volume (CDF)', 'Commission (CDF)'],
      ...byMonth.map(r => [r.month, r.count, r.volume, Math.round(r.commission)]),
      ['TOTAL', contractsOfYear.length, totalVolume, Math.round(totalCommission)],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `export_commissionnaire_${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Download size={22} className="text-emerald-400" /> Export annuel
          </h1>
          <p className="text-gray-400 mt-1">Rapport complet de l&apos;année sélectionnée</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-xl px-4 py-2">
            <Calendar size={16} className="text-gray-400" />
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="bg-transparent text-white text-sm focus:outline-none"
            >
              {[2024, 2023, 2022].map(y => <option key={y} value={y} className="bg-gray-900">{y}</option>)}
            </select>
          </div>
          <button
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors"
          >
            <Download size={16} /> Télécharger CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Volume total', value: `${totalVolume.toLocaleString()} CDF`, icon: <DollarSign size={20} />, color: 'text-emerald-400' },
          { label: 'Commissions (5%)', value: `${Math.round(totalCommission).toLocaleString()} CDF`, icon: <TrendingUp size={20} />, color: 'text-blue-400' },
          { label: 'Contrats actifs', value: String(activeCount), icon: <CheckCircle size={20} />, color: 'text-green-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-sm text-gray-400">{s.label}</span></div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
          <FileText size={18} className="text-gray-400" />
          <h2 className="font-bold text-white">Détail mensuel {year}</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
            <tr>
              <th className="px-6 py-3 text-left">Mois</th>
              <th className="px-6 py-3 text-right">Contrats</th>
              <th className="px-6 py-3 text-right">Volume (CDF)</th>
              <th className="px-6 py-3 text-right">Commission (CDF)</th>
              <th className="px-6 py-3 text-left">Part</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {byMonth.map((row) => {
              const pct = totalVolume > 0 ? Math.round((row.volume / totalVolume) * 100) : 0;
              return (
                <tr key={row.month} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 text-white font-medium">{row.month}</td>
                  <td className="px-6 py-4 text-right text-gray-300">{row.count}</td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-semibold">{row.volume.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-blue-400 font-semibold">{Math.round(row.commission).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-800/50 border-t border-gray-700">
            <tr>
              <td className="px-6 py-4 font-bold text-white">TOTAL</td>
              <td className="px-6 py-4 text-right font-bold text-white">{contractsOfYear.length}</td>
              <td className="px-6 py-4 text-right font-bold text-emerald-400">{totalVolume.toLocaleString()}</td>
              <td className="px-6 py-4 text-right font-bold text-blue-400">{Math.round(totalCommission).toLocaleString()}</td>
              <td className="px-6 py-4" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
