import React from 'react';
import { 
  Car, 
  FileCheck2, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  CalendarCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Navbar({ onOpenNewRental, onOpenNewInspection }) {
  const { 
    notification, 
    stats, 
    setCurrentView 
  } = useApp();

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo & Name */}
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => setCurrentView('dashboard')}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 font-black text-lg">
                PSG
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                    PSG <span className="text-blue-400 font-semibold">Locadora</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                    Empresarial
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">
                  Sistema de Gerenciamento de Locação de Veículos PSG
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              {/* Warnings / Alerts badge */}
              {(stats.cnhAlerts.length > 0 || stats.expiringContracts?.length > 0) && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30 transition"
                  title="Ver alertas pendentes"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {stats.cnhAlerts.length + (stats.expiringContracts?.length || 0)} alerta(s)
                  </span>
                </button>
              )}

              {/* Action Buttons */}
              <button
                onClick={onOpenNewRental}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md transition active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Novo Contrato Mensal</span>
                <span className="sm:hidden">Contrato</span>
              </button>

              <button
                onClick={onOpenNewInspection}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm shadow-md transition active:scale-95"
              >
                <FileCheck2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Nova Vistoria</span>
                <span className="sm:hidden">Vistoria</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium ${
            notification.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : notification.type === 'info'
              ? 'bg-blue-50 border-blue-200 text-blue-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {notification.type === 'error' ? (
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            ) : notification.type === 'info' ? (
              <Info className="w-5 h-5 text-blue-500 shrink-0" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
