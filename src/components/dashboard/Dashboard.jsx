import React from 'react';
import { 
  Car, 
  FileText, 
  DollarSign, 
  ClipboardCheck, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Clock,
  TrendingUp,
  Plus,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export function Dashboard({ 
  onOpenNewRental, 
  onOpenNewInspection, 
  onOpenNewVehicle, 
  onOpenNewDriver, 
  onOpenReturnRental, 
  onSelectInspection 
}) {
  const { 
    vehicles, 
    drivers, 
    contracts, 
    inspections, 
    stats, 
    setCurrentView,
    getVehicleById, 
    getDriverById 
  } = useApp();

  const activeContractsList = contracts.filter(c => c.status === 'Ativo');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const totalFleet = stats.totalVehicles || 0;
  const availablePercent = totalFleet > 0 ? Math.round((stats.availableVehicles / totalFleet) * 100) : 0;
  const rentedPercent = totalFleet > 0 ? Math.round((stats.rentedVehicles / totalFleet) * 100) : 0;
  const maintPercent = totalFleet > 0 ? Math.round(((stats.inMaintenanceVehicles + stats.inInspectionVehicles) / totalFleet) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Painel Operacional PSG
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sistema de Gerenciamento de Locação de Veículos PSG
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Plataforma para gestão de contratos mensais de locação, controle de frota, motoristas habilitados (CNH B) e emissão de laudos de vistoria veicular.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={onOpenNewRental}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>Novo Contrato Mensal</span>
            </button>
            <button
              onClick={onOpenNewInspection}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/15 backdrop-blur transition active:scale-95"
            >
              <ClipboardCheck className="w-4 h-4 text-emerald-400" />
              <span>Nova Vistoria</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Frota Total */}
        <div 
          onClick={() => setCurrentView('vehicles')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frota Total</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalVehicles}</div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-emerald-600">{stats.availableVehicles} disp.</span>
              <span>•</span>
              <span className="font-semibold text-blue-600">{stats.rentedVehicles} alugados</span>
              <span>•</span>
              <span className="font-semibold text-amber-600">{stats.inMaintenanceVehicles} manut.</span>
            </div>
          </div>
        </div>

        {/* Contratos Mensais Ativos */}
        <div 
          onClick={() => setCurrentView('rentals')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contratos Mensais Ativos</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{stats.activeContracts}</div>
            <div className="mt-2 text-xs text-slate-600">
              <span>{stats.closedContracts} contrato(s) encerrado(s)</span>
            </div>
          </div>
        </div>

        {/* Receita Recorrente Mensal (MRR) */}
        <div 
          onClick={() => setCurrentView('reports')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Receita Mensal Recorrente</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {formatMoney(stats.monthlyRecurringRevenue)}
            </div>
            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Soma das mensalidades vigentes</span>
            </div>
          </div>
        </div>

        {/* Vistorias Realizadas */}
        <div 
          onClick={() => setCurrentView('inspections')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laudos de Vistoria</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition">
              <ClipboardCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{stats.totalInspections}</div>
            <div className="mt-2 text-xs text-slate-500">
              <span>Saídas, Devoluções & Manutenções</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas de CNH / Contratos */}
      {(stats.cnhAlerts.length > 0 || stats.expiringContracts?.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="text-sm font-bold text-amber-900">
                Atenção Operacional Requerida ({stats.cnhAlerts.length + (stats.expiringContracts?.length || 0)} pendência(s))
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {stats.cnhAlerts.length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      {stats.cnhAlerts.length} motorista(s) com CNH vencida ou próxima do vencimento
                    </span>
                    <p className="text-slate-600 mt-1">
                      {stats.cnhAlerts.map(d => `${d.nome} (venc: ${new Date(d.validadeCnh).toLocaleDateString('pt-BR')})`).join(', ')}
                    </p>
                    <button
                      onClick={() => setCurrentView('drivers')}
                      className="mt-2 font-semibold text-blue-700 hover:underline flex items-center gap-1 text-xs"
                    >
                      Acessar cadastro de motoristas <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {stats.expiringContracts?.length > 0 && (
                  <div className="bg-white p-3 rounded-xl border border-amber-200">
                    <span className="font-bold text-amber-800 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-600" />
                      {stats.expiringContracts.length} contrato(s) com término previsto em breve
                    </span>
                    <p className="text-slate-600 mt-1">
                      {stats.expiringContracts.map(c => `${c.numeroContrato} (até ${new Date(c.dataTermino).toLocaleDateString('pt-BR')})`).join(', ')}
                    </p>
                    <button
                      onClick={() => setCurrentView('rentals')}
                      className="mt-2 font-semibold text-blue-700 hover:underline flex items-center gap-1 text-xs"
                    >
                      Ver contratos para renovação ou encerramento <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Taxa de Ocupação da Frota */}
      {totalFleet > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">Taxa de Ocupação da Frota</h2>
              <p className="text-xs text-slate-500">Distribuição atual dos {stats.totalVehicles} veículos cadastrados</p>
            </div>
            <button
              onClick={() => setCurrentView('vehicles')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Ver todos os veículos <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div style={{ width: `${rentedPercent}%` }} className="bg-blue-600 transition-all duration-500" />
            <div style={{ width: `${availablePercent}%` }} className="bg-emerald-500 transition-all duration-500" />
            <div style={{ width: `${maintPercent}%` }} className="bg-amber-400 transition-all duration-500" />
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-600 pt-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-blue-600"></span>
              <span className="font-semibold text-slate-800">Alugados Mensalmente:</span>
              <span>{stats.rentedVehicles} ({rentedPercent}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="font-semibold text-slate-800">Disponíveis:</span>
              <span>{stats.availableVehicles} ({availablePercent}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-400"></span>
              <span className="font-semibold text-slate-800">Manutenção / Vistoria:</span>
              <span>{stats.inMaintenanceVehicles + stats.inInspectionVehicles} ({maintPercent}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Two columns: Active Monthly Contracts + Recent Inspections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contratos Ativos (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900">Contratos Mensais em Andamento</h2>
            </div>
            <button
              onClick={() => setCurrentView('rentals')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Ver todos ({contracts.length})
            </button>
          </div>

          <div className="p-0 flex-1 overflow-x-auto">
            {activeContractsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs sm:text-sm space-y-3">
                <p>Nenhum contrato de locação mensal ativo no momento.</p>
                <button
                  onClick={onOpenNewRental}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Cadastrar Primeiro Contrato Mensal</span>
                </button>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Contrato</th>
                    <th className="px-5 py-3">Veículo</th>
                    <th className="px-5 py-3">Motorista (CNH B)</th>
                    <th className="px-5 py-3">Mensalidade</th>
                    <th className="px-5 py-3">Dia Venc.</th>
                    <th className="px-5 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeContractsList.map((contract) => {
                    const vehicle = getVehicleById(contract.veiculoId);
                    const driver = getDriverById(contract.motoristaId);

                    return (
                      <tr key={contract.id} className="hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          {contract.numeroContrato}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-semibold text-slate-800">
                            {vehicle ? `${vehicle.marca} ${vehicle.modelo}` : 'Veículo não encontrado'}
                          </div>
                          <div className="text-slate-400 font-mono text-[11px]">
                            {vehicle?.placa}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-slate-800">{driver?.nome}</div>
                          <div className="text-slate-400 text-[11px]">CPF: {driver?.cpf}</div>
                        </td>
                        <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                          {formatMoney(contract.valorMensal)}/mês
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 whitespace-nowrap">
                          Dia {contract.diaVencimento || '10'}
                        </td>
                        <td className="px-5 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => onOpenReturnRental(contract)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-xs transition"
                          >
                            Encerrar / Vistoria
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Últimas Vistorias (1 Col) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Últimas Vistorias</h2>
            </div>
            <button
              onClick={() => setCurrentView('inspections')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
            >
              Ver todas ({inspections.length})
            </button>
          </div>

          <div className="mt-4 space-y-3 flex-1 overflow-y-auto">
            {inspections.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Nenhuma vistoria cadastrada ainda.
              </div>
            ) : (
              inspections.slice(0, 4).map((ins) => {
                const vehicle = getVehicleById(ins.veiculoId);
                return (
                  <div 
                    key={ins.id}
                    onClick={() => onSelectInspection(ins)}
                    className="p-3 rounded-xl border border-slate-100 hover:border-blue-300 hover:bg-slate-50/70 transition cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={ins.tipo} size="sm" />
                          <span className="font-bold text-xs text-slate-900">{ins.codigo}</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-800 mt-1">
                          {vehicle?.marca} {vehicle?.modelo}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Placa: {vehicle?.placa} • {ins.odometro?.toLocaleString('pt-BR')} km
                        </div>
                      </div>
                      <Badge variant={ins.resultado} size="sm" />
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Vistoriador: {ins.vistoriador}</span>
                      <span>{new Date(ins.dataHora).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <button
            onClick={onOpenNewInspection}
            className="mt-4 w-full py-2.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 text-xs font-bold text-slate-600 hover:text-blue-600 transition flex items-center justify-center gap-1.5"
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Registrar Nova Vistoria</span>
          </button>
        </div>
      </div>
    </div>
  );
}
