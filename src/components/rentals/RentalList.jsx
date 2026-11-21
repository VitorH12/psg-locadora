import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Car, 
  User, 
  CheckCircle2, 
  FileCheck2, 
  Ban,
  Calendar,
  CreditCard
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export function RentalList({ onOpenNewRental, onOpenReturnRental, onSelectInspection, onSelectVehicle, onSelectDriver }) {
  const { contracts, cancelContract, getVehicleById, getDriverById, getInspectionById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todas');

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const statuses = ['Todas', 'Ativo', 'Encerrado', 'Cancelado'];

  const filteredContracts = contracts.filter(c => {
    const vehicle = getVehicleById(c.veiculoId);
    const driver = getDriverById(c.motoristaId);

    const matchesSearch = 
      c.numeroContrato.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle && `${vehicle.marca} ${vehicle.modelo} ${vehicle.placa}`.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (driver && driver.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'Todas' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contratos de Locação Mensal</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gerenciamento de contratos de locação mensal, controle de vigência, vencimentos das mensalidades e vistorias de entrega/devolução.
          </p>
        </div>

        <button
          onClick={onOpenNewRental}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Contrato Mensal</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por número do contrato, motorista ou veículo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-400 shrink-0">Filtrar:</span>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st !== 'Todas' && `(${contracts.filter(c => c.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {contracts.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Nenhum contrato mensal cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Gere novos contratos de locação mensal vinculando um veículo disponível a um motorista cadastrado com CNH B.
            </p>
          </div>
          <button
            onClick={onOpenNewRental}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Primeiro Contrato Mensal</span>
          </button>
        </div>
      ) : filteredContracts.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          Nenhum contrato encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredContracts.map(contract => {
            const vehicle = getVehicleById(contract.veiculoId);
            const driver = getDriverById(contract.motoristaId);
            const vistoriaSaida = contract.vistoriaSaidaId ? getInspectionById(contract.vistoriaSaidaId) : null;
            const vistoriaDevolucao = contract.vistoriaDevolucaoId ? getInspectionById(contract.vistoriaDevolucaoId) : null;
            const isAtivo = contract.status === 'Ativo';

            return (
              <div
                key={contract.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4 hover:border-blue-200 transition"
              >
                {/* Header: Contract Number, Status, Value */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{contract.numeroContrato}</span>
                        <Badge variant={contract.status} />
                      </div>
                      <span className="text-xs text-slate-400">
                        Início: {new Date(contract.dataInicio).toLocaleDateString('pt-BR')} • Vigência: {contract.mesesVigencia || 1} mês(es)
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
                    <span className="text-xs text-slate-400">Mensalidade:</span>
                    <span className="text-xl font-extrabold text-blue-700">
                      {formatMoney(contract.valorMensal)}<span className="text-xs text-slate-500 font-normal">/mês</span>
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  {/* Veículo */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Veículo Locado</span>
                    {vehicle ? (
                      <div className="space-y-1">
                        <div 
                          onClick={() => onSelectVehicle(vehicle)}
                          className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                        >
                          <Car className="w-3.5 h-3.5 text-blue-600" />
                          <span>{vehicle.marca} {vehicle.modelo}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-800">
                            {vehicle.placa}
                          </span>
                          <span className="text-slate-500">{vehicle.categoria}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-rose-500">Veículo removido</span>
                    )}
                  </div>

                  {/* Motorista */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Motorista Titular (CNH B)</span>
                    {driver ? (
                      <div className="space-y-1">
                        <div 
                          onClick={() => onSelectDriver(driver)}
                          className="font-bold text-slate-900 hover:text-blue-700 cursor-pointer flex items-center gap-1"
                        >
                          <User className="w-3.5 h-3.5 text-blue-600" />
                          <span>{driver.nome}</span>
                        </div>
                        <div className="text-slate-500">
                          CPF: {driver.cpf} • CNH: {driver.cnh} (Cat. B)
                        </div>
                      </div>
                    ) : (
                      <span className="text-rose-500">Motorista removido</span>
                    )}
                  </div>

                  {/* Termos & Vencimento */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Faturamento & Prazos</span>
                    <div>
                      <span className="text-slate-500">Vencimento da Mensalidade:</span>{' '}
                      <strong className="text-slate-800">Todo dia {contract.diaVencimento || '10'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Franquia de Km:</span>{' '}
                      <strong className="text-slate-800">{contract.franquiaKm || '2.000 km/mês'}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Odômetro Inicial:</span>{' '}
                      <strong className="text-slate-800">{contract.kmInicial?.toLocaleString('pt-BR')} km</strong>
                    </div>
                  </div>

                  {/* Vistorias Vinculadas */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                    <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">Laudos de Vistoria</span>
                    {vistoriaSaida ? (
                      <button
                        onClick={() => onSelectInspection(vistoriaSaida)}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition"
                      >
                        <span className="flex items-center gap-1 font-semibold text-blue-800">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Saída: {vistoriaSaida.codigo}
                        </span>
                        <Badge variant={vistoriaSaida.resultado} size="sm" />
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic block">Sem laudo de saída vinculado</span>
                    )}

                    {vistoriaDevolucao ? (
                      <button
                        onClick={() => onSelectInspection(vistoriaDevolucao)}
                        className="w-full flex items-center justify-between p-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-400 text-slate-700 transition"
                      >
                        <span className="flex items-center gap-1 font-semibold text-emerald-800">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Retorno: {vistoriaDevolucao.codigo}
                        </span>
                        <Badge variant={vistoriaDevolucao.resultado} size="sm" />
                      </button>
                    ) : isAtivo ? (
                      <span className="text-[11px] text-slate-400 italic block">Contrato em vigência</span>
                    ) : null}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                  <span className="text-slate-500 italic text-[11px]">
                    {contract.observacoesContrato || 'Locação mensal regular.'}
                  </span>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    {isAtivo && (
                      <button
                        onClick={() => onOpenReturnRental(contract)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition active:scale-95"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Encerrar Contrato & Vistoria</span>
                      </button>
                    )}

                    {isAtivo && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Deseja cancelar o contrato ${contract.numeroContrato}? O veículo voltará ao status Disponível.`)) {
                            cancelContract(contract.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                        title="Cancelar Contrato"
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
