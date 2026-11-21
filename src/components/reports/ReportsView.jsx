import React from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  Car, 
  DollarSign, 
  ClipboardCheck, 
  ShieldAlert,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export function ReportsView() {
  const { vehicles, drivers, contracts, inspections, stats } = useApp();

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleExportData = () => {
    const backup = {
      timestamp: new Date().toISOString(),
      sistema: 'Sistema de Gerenciamento de Locação de Veículos PSG',
      veiculos: vehicles,
      motoristas: drivers,
      contratosMensais: contracts,
      vistorias: inspections
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `psg-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Relatórios Gerenciais & Auditoria</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Métricas de faturamento mensal recorrente (MRR), auditoria de habilitações (CNH B), Renavam, IPVA e exportação de dados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-xs transition"
          >
            <Download className="w-4 h-4 text-blue-700" />
            <span>Exportar Backup (JSON)</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition"
          >
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Imprimir Relatório</span>
          </button>
        </div>
      </div>

      {/* Printable Report */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900">Relatório Executivo Operacional - PSG</h2>
            <p className="text-xs text-slate-500">Sistema de Gerenciamento de Locação de Veículos PSG</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Gerado em: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>

        {/* 1. Indicadores Chave */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-700" />
            <span>1. Indicadores de Gestão (KPIs)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Frota Total Cadastrada</span>
              <span className="text-2xl font-black text-slate-900">{stats.totalVehicles}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {stats.availableVehicles} disponíveis para novo contrato
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Contratos Mensais Vigentes</span>
              <span className="text-2xl font-black text-slate-900">{stats.activeContracts}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {stats.closedContracts} encerrados no histórico
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Receita Mensal Recorrente (MRR)</span>
              <span className="text-2xl font-black text-emerald-600">{formatMoney(stats.monthlyRecurringRevenue)}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                Total de mensalidades ativas
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-1">Total de Vistorias Emitidas</span>
              <span className="text-2xl font-black text-slate-900">{stats.totalInspections}</span>
              <span className="text-[11px] text-slate-500 block mt-1">
                {inspections.filter(i => i.resultado === 'Aprovado').length} aprovadas 100%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Auditoria de CNH */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>2. Auditoria de Validade da CNH dos Motoristas (Categoria B)</span>
            </h3>
            <span className="text-xs text-slate-500">
              {stats.cnhAlerts.length} motorista(s) requerem atenção
            </span>
          </div>

          {drivers.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-xl">
              Nenhum motorista cadastrado no sistema.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Motorista</th>
                    <th className="p-3">CPF</th>
                    <th className="p-3">CNH (Cat. B)</th>
                    <th className="p-3">Data de Validade</th>
                    <th className="p-3">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drivers.map(driver => {
                    const validade = new Date(driver.validadeCnh);
                    const hoje = new Date();
                    const diffDays = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
                    const isExpired = diffDays < 0;
                    const isExpiring = diffDays >= 0 && diffDays <= 30;

                    return (
                      <tr key={driver.id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-bold text-slate-900">{driver.nome}</td>
                        <td className="p-3 font-mono text-slate-600">{driver.cpf}</td>
                        <td className="p-3 text-slate-700 font-mono">
                          {driver.cnh}
                        </td>
                        <td className="p-3">
                          <span className={isExpired ? 'text-rose-600 font-bold' : isExpiring ? 'text-amber-600 font-bold' : 'text-slate-700'}>
                            {validade.toLocaleDateString('pt-BR')}
                          </span>
                          {isExpired && <span className="ml-1 text-[10px] text-rose-600 font-bold">(VENCIDA)</span>}
                          {isExpiring && <span className="ml-1 text-[10px] text-amber-600 font-bold">({diffDays} dias)</span>}
                        </td>
                        <td className="p-3">
                          <Badge variant={driver.status} size="sm" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 3. Situação da Frota com Renavam e IPVA */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-700" />
            <span>3. Inventário da Frota, Documentação (Renavam / IPVA) e Status</span>
          </h3>

          {vehicles.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs border border-dashed rounded-xl">
              Nenhum veículo cadastrado na frota.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Veículo</th>
                    <th className="p-3">Placa</th>
                    <th className="p-3">RENAVAM</th>
                    <th className="p-3">IPVA Pago em</th>
                    <th className="p-3">Odômetro</th>
                    <th className="p-3">Mensalidade</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {vehicles.map(v => (
                    <tr key={v.id} className="hover:bg-slate-50/60">
                      <td className="p-3 font-bold text-slate-900">{v.marca} {v.modelo}</td>
                      <td className="p-3 font-mono font-bold text-slate-700">{v.placa}</td>
                      <td className="p-3 font-mono text-slate-600">{v.renavam || '-'}</td>
                      <td className="p-3 font-semibold text-emerald-700">{v.ipvaPagoEm || '-'}</td>
                      <td className="p-3 text-slate-700">{v.kmAtual?.toLocaleString('pt-BR')} km</td>
                      <td className="p-3 font-semibold text-blue-700">{formatMoney(v.valorMensal)}/mês</td>
                      <td className="p-3">
                        <Badge variant={v.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
