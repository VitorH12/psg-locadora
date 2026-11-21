import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  FileText, 
  ClipboardCheck, 
  BarChart3 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Navigation() {
  const { currentView, setCurrentView, stats } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Visão Geral',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'vehicles',
      label: 'Frota de Veículos',
      icon: Car,
      badge: stats.totalVehicles > 0 ? stats.totalVehicles : null
    },
    {
      id: 'drivers',
      label: 'Motoristas',
      icon: Users,
      badge: stats.cnhAlerts.length > 0 ? `${stats.cnhAlerts.length} alerta` : (stats.totalDrivers > 0 ? stats.totalDrivers : null),
      badgeVariant: stats.cnhAlerts.length > 0 ? 'warning' : 'neutral'
    },
    {
      id: 'rentals',
      label: 'Contratos de Locação',
      icon: FileText,
      badge: stats.activeContracts > 0 ? `${stats.activeContracts} ativo(s)` : null,
      badgeVariant: 'neutral'
    },
    {
      id: 'inspections',
      label: 'Vistorias & Laudos',
      icon: ClipboardCheck,
      badge: stats.totalInspections > 0 ? stats.totalInspections : null
    },
    {
      id: 'reports',
      label: 'Relatórios & Auditoria',
      icon: BarChart3,
      badge: null
    }
  ];

  return (
    <nav className="bg-white border-b border-slate-200 no-print sticky top-16 z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 shadow-xs ring-1 ring-blue-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ml-1 ${
                      item.badgeVariant === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : isActive
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
