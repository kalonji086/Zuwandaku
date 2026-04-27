'use client';

import { Globe, Trophy, TrendingUp, Users, DollarSign, Medal } from 'lucide-react';
import { useContracts } from '../../../lib/hooks';

const COMMISSION_RATE = 0.05;

const rankColors = ['text-yellow-400', 'text-gray-300', 'text-amber-600'];
const rankBg = ['bg-yellow-500/10 border-yellow-500/30', 'bg-gray-500/10 border-gray-500/30', 'bg-amber-600/10 border-amber-600/30'];

export default function PerformanceReseauPage() {
  const { data: contracts = [], isLoading } = useContracts({});

  // Regrouper par commissionnaire (owner simulé comme commissionnaire ici)
  // On simule un classement basé sur les propriétaires/clients les plus actifs
  const ownerMap = new Map<string, { name: string; phone: string; contracts: number; volume: number }>();
  contracts.forEach((c: any) => {
    if (!c.owner) return;
    const id = c.owner.id;
    const existing = ownerMap.get(id) ?? { name: c.owner.name, phone: c.owner.phone ?? '', contracts: 0, volume: 0 };
    existing.contracts += 1;
    existing.volume += c.amount;
    ownerMap.set(id, existing);
  });

  const ranking = Array.from(ownerMap.values())
    .sort((a, b) => b.volume - a.volume);

  const totalVolume = contracts.reduce((s: number, c: any) => s + c.amount, 0);
  const totalActeurs = ownerMap.size;
  const topVolume = ranking[0]?.volume ?? 0;

  if (isLoading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Globe size={22} className="text-purple-400" /> Performance réseau
        </h1>
        <p className="text-gray-400 mt-1">Classement des acteurs par volume de transactions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Acteurs réseau', value: String(totalActeurs), icon: <Users size={20} />, color: 'text-purple-400' },
          { label: 'Volume réseau', value: `${totalVolume.toLocaleString()} CDF`, icon: <DollarSign size={20} />, color: 'text-emerald-400' },
          { label: 'Commissions réseau', value: `${Math.round(totalVolume * COMMISSION_RATE).toLocaleString()} CDF`, icon: <TrendingUp size={20} />, color: 'text-blue-400' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`flex items-center gap-2 mb-2 ${s.color}`}>{s.icon}<span className="text-sm text-gray-400">{s.label}</span></div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Top 3 podium */}
      {ranking.length >= 3 && (
        <div className="grid grid-cols-3 gap-4">
          {ranking.slice(0, 3).map((actor, i) => (
            <div key={actor.name} className={`border rounded-xl p-5 text-center ${rankBg[i]}`}>
              <div className={`text-3xl font-black mb-2 ${rankColors[i]}`}>
                {i === 0 ? <Trophy size={32} className="mx-auto" /> : <Medal size={28} className="mx-auto" />}
              </div>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${rankColors[i]}`}>#{i + 1}</p>
              <p className="font-bold text-white truncate">{actor.name}</p>
              <p className="text-xs text-gray-400 mt-1">{actor.contracts} contrats</p>
              <p className="text-sm font-bold text-emerald-400 mt-2">{actor.volume.toLocaleString()} CDF</p>
            </div>
          ))}
        </div>
      )}

      {/* Classement complet */}
      {ranking.length === 0 ? (
        <div className="text-center py-16 bg-gray-900 rounded-xl border border-gray-800">
          <Globe size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucune donnée de performance disponible</p>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Trophy size={18} className="text-yellow-400" />
            <h2 className="font-bold text-white">Classement complet</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-5 py-3 text-left">Rang</th>
                <th className="px-5 py-3 text-left">Acteur</th>
                <th className="px-5 py-3 text-right">Contrats</th>
                <th className="px-5 py-3 text-right">Volume (CDF)</th>
                <th className="px-5 py-3 text-right">Commission (CDF)</th>
                <th className="px-5 py-3 text-left">Part réseau</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {ranking.map((actor, i) => {
                const pct = topVolume > 0 ? Math.round((actor.volume / totalVolume) * 100) : 0;
                return (
                  <tr key={actor.name} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`font-bold text-lg ${i < 3 ? rankColors[i] : 'text-gray-500'}`}>#{i + 1}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-white font-medium">{actor.name}</p>
                      {actor.phone && <p className="text-gray-500 text-xs">{actor.phone}</p>}
                    </td>
                    <td className="px-5 py-4 text-right text-gray-300">{actor.contracts}</td>
                    <td className="px-5 py-4 text-right text-emerald-400 font-bold">{actor.volume.toLocaleString()}</td>
                    <td className="px-5 py-4 text-right text-blue-400 font-semibold">{Math.round(actor.volume * COMMISSION_RATE).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
