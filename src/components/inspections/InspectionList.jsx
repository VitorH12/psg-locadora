import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Plus, 
  Search, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Fuel, 
  Gauge 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export function InspectionList({ onOpenNewInspection, onSelectInspection, onSelectVehicle }) {
  const { inspections, getVehicleById } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('Todas');
  const [resultFilter, setResultFilter] = useState('Todos');

  const filteredInspections = inspections.filter(ins => {
    const vehicle = getVehicleById(ins.veiculoId);
    const matchesSearch = 
      ins.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ins.vistoriador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle && `${vehicle.marca} ${vehicle.modelo} ${vehicle.placa}`.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'Todas' || ins.tipo === typeFilter;
    const matchesResult = resultFilter === 'Todos' || ins.resultado === resultFilter;

    return matchesSearch && matchesType && matchesResult;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Vistorias & Laudos Veiculares PSG</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Registro de laudos de vistoria de entrega (saída), encerramento (devolução) e manutenção preventiva.
          </p>
        </div>

        <button
          onClick={onOpenNewInspection}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Realizar Nova Vistoria</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por código do laudo, vistoriador ou placa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Resultado:</span>
            <select
              value={resultFilter}
              onChange={(e) => setResultFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Todos">Todos os Resultados</option>
              <option value="Aprovado">Aprovado</option>
              <option value="Aprovado com Ressalvas">Aprovado com Ressalvas</option>
              <option value="Reprovado">Reprovado</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="font-semibold text-slate-400 shrink-0">Tipo:</span>
          {['Todas', 'Saída', 'Devolução', 'Periódica'].map(tp => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-xl font-medium transition whitespace-nowrap ${
                typeFilter === tp
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tp} {tp !== 'Todas' && `(${inspections.filter(i => i.tipo === tp).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {inspections.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <ClipboardCheck className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Nenhum laudo de vistoria cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Realize a primeira vistoria de um veículo com checklist operacional de 12 itens e mapeamento visual de avarias.
            </p>
          </div>
          <button
            onClick={onOpenNewInspection}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Emitir Primeiro Laudo</span>
          </button>
        </div>
      ) : filteredInspections.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          Nenhuma vistoria encontrada com os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInspections.map(ins => {
            const vehicle = getVehicleById(ins.veiculoId);

            return (
              <div
                key={ins.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={ins.tipo} />
                      <span className="font-extrabold text-slate-900 text-sm">{ins.codigo}</span>
                    </div>
                    <Badge variant={ins.resultado} size="sm" />
                  </div>

                  {vehicle && (
                    <div 
                      onClick={() => onSelectVehicle(vehicle)}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-blue-200 cursor-pointer transition space-y-1"
                    >
                      <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                        <span>{vehicle.marca} {vehicle.modelo}</span>
                        <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold text-slate-800 text-[10px]">
                          {vehicle.placa}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Categoria: {vehicle.categoria} • Ano: {vehicle.ano}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 bg-slate-50/80 p-2 rounded-lg">
                      <Gauge className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ins.odometro?.toLocaleString('pt-BR')} km</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50/80 p-2 rounded-lg">
                      <Fuel className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{ins.nivelCombustivel}</span>
                    </div>
                  </div>

                  {ins.avarias && ins.avarias.length > 0 ? (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                      <span className="font-bold block flex items-center gap-1 mb-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {ins.avarias.length} avaria(s) registrada(s):
                      </span>
                      <p className="text-[11px] text-amber-800 truncate">
                        {ins.avarias.map(a => `${a.local} (${a.tipo})`).join(', ')}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Sem avarias apontadas
                    </div>
                  )}

                  {ins.parecerGeral && (
                    <p className="text-xs text-slate-500 line-clamp-2 italic">
                      "{ins.parecerGeral}"
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Vistoriador: <strong className="text-slate-600">{ins.vistoriador}</strong></span>
                    <span>{new Date(ins.dataHora).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <button
                    onClick={() => onSelectInspection(ins)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Visualizar & Imprimir Laudo</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
