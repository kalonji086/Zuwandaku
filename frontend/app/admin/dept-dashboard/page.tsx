'use client';
import { useState } from 'react';
import { Home, Car, Hotel, DollarSign, Headphones, UserCheck, Briefcase, UtensilsCrossed, Users } from 'lucide-react';
import ImmobilierModule from './immobilier/page';
import VehiculesModule from './vehicules/page';
import HotelModule from './hotel/page';
import FinanceModule from './finance/page';
import SupportModule from './support/page';
import RestaurantModule from './restaurant/page';
import RHModule from './rh/page';
import ProprietaireModule from './proprietaire/page';
import CommissionnaireModule from './commissionnaire/page';
import ClientModule from './client/page';

const DEPTS = [
  { id: 'immobilier',      label: 'Immobilier',      icon: Home,            color: '#1a6dff', component: ImmobilierModule      },
  { id: 'vehicules',       label: 'Véhicules',       icon: Car,             color: '#00e5a0', component: VehiculesModule       },
  { id: 'hotel',           label: 'Hôtel',           icon: Hotel,           color: '#7b61ff', component: HotelModule           },
  { id: 'finance',         label: 'Finance',         icon: DollarSign,      color: '#ffcc00', component: FinanceModule         },
  { id: 'support',         label: 'Support',         icon: Headphones,      color: '#f87171', component: SupportModule         },
  { id: 'restaurant',      label: 'Restaurant',      icon: UtensilsCrossed, color: '#ff6b35', component: RestaurantModule      },
  { id: 'rh',              label: 'RH',              icon: Users,           color: '#00c2ff', component: RHModule              },
  { id: 'proprietaire',    label: 'Propriétaire',    icon: UserCheck,       color: '#00c2ff', component: ProprietaireModule    },
  { id: 'commissionnaire', label: 'Commissionnaire', icon: Briefcase,       color: '#ff6b35', component: CommissionnaireModule },
  { id: 'client',          label: 'Client',          icon: Users,           color: '#00c2ff', component: ClientModule          },
];

const EXTERNAL: { href: string; label: string; icon: React.ElementType; color: string }[] = [];

export default function DeptDashboard() {
  const [active, setActive] = useState('immobilier');
  const dept = DEPTS.find(d => d.id === active)!;
  const Module = dept.component;

  return (
    <div style={{ display: 'flex', gap: 0, minHeight: '100%' }}>

      {/* Sidebar latérale */}
      <aside style={{
        width: 200, flexShrink: 0, background: '#0a0a0f',
        border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14,
        display: 'flex', flexDirection: 'column', padding: '8px 0',
        alignSelf: 'flex-start', position: 'sticky', top: 0,
      }}>

        {/* Groupe Départements */}
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.25)', padding: '8px 16px 10px', textTransform: 'uppercase' }}>
          Départements
        </p>
        {DEPTS.map(d => {
          const isActive = active === d.id;
          return (
            <button key={d.id} onClick={() => setActive(d.id)} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', margin: '1px 8px', borderRadius: 8,
              fontSize: 13, fontWeight: isActive ? 600 : 400,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
              background: isActive ? `${d.color}18` : 'transparent',
              borderLeft: isActive ? `2px solid ${d.color}` : '2px solid transparent',
              border: 'none', cursor: 'pointer', transition: 'all 0.15s',
              textAlign: 'left', width: '100%',
            }}>
              <d.icon size={16} style={{ color: isActive ? d.color : 'inherit', flexShrink: 0 }} />
              <span>{d.label}</span>
              {isActive && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: d.color, boxShadow: `0 0 6px ${d.color}` }} />}
            </button>
          );
        })}


      </aside>

      {/* Contenu principal */}
      <div style={{ flex: 1, minWidth: 0, paddingLeft: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: `${dept.color}0d`, border: `1px solid ${dept.color}25`, borderRadius: 12, padding: '12px 18px', marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: `${dept.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <dept.icon size={18} style={{ color: dept.color }} />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0 }}>Département {dept.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Gestion complète — CRUD & statistiques</p>
          </div>
        </div>

        <Module />
      </div>
    </div>
  );
}
