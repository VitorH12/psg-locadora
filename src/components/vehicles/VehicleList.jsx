import React, { useState } from 'react';
import { 
  Car, 
  Plus, 
  Search, 
  Gauge, 
  Eye, 
  Edit2, 
  Trash2, 
  LayoutGrid, 
  List, 
  Fuel,
  Wrench,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export function VehicleList({ onOpenNewVehicle, onEditVehicle, onSelectVehicle, onOpenNewInspectionForVehicle }) {
  const { vehicles, deleteVehicle } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [viewMode, setViewMode] = useState('grid');

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = 
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.renavam && v.renavam.includes(searchTerm));

    const matchesStatus = statusFilter === 'Todos' || v.status === statusFilter;
    const matchesCategory = categoryFilter === 'Todas' || v.categoria === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = ['Todas', 'Econômico', 'Sedã', 'SUV', 'Utilitário'];
  const statuses = ['Todos', 'Disponível', 'Alugado', 'Em Manutenção', 'Em Vistoria'];

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Frota de Veículos PSG</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Cadastre e monitore os veículos, controle de Renavam, IPVA, ficha de 15 manutenções mecânicas e laudos.
          </p>
        </div>

        <button
          onClick={onOpenNewVehicle}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Veículo</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por modelo, marca, placa ou RENAVAM..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Categoria:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
              title="Visualização em Grade"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow-xs text-blue-700' : 'text-slate-500 hover:text-slate-800'}`}
              title="Visualização em Tabela"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-400 shrink-0">Status:</span>
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-medium transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st} {st !== 'Todos' && `(${vehicles.filter(v => v.status === st).length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {vehicles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Nenhum veículo cadastrado na frota</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Cadastre os veículos com placa, Renavam, ano do IPVA pago e a ficha completa de 15 itens de manutenção preventiva.
            </p>
          </div>
          <button
            onClick={onOpenNewVehicle}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeiro Veículo</span>
          </button>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          Nenhum veículo encontrado com os filtros selecionados.
        </div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map(vehicle => (
                <div
                  key={vehicle.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-md hover:border-blue-300 transition flex flex-col group"
                >
                  <div className="relative h-44 bg-slate-100 overflow-hidden">
                    <img
                      src={vehicle.foto}
                      alt={`${vehicle.marca} ${vehicle.modelo}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant={vehicle.status} />
                    </div>
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg font-bold text-xs text-slate-900 shadow-xs">
                      {formatMoney(vehicle.valorMensal)}/mês
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {vehicle.categoria}
                        </span>
                        {vehicle.ipvaPagoEm && (
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                            IPVA {vehicle.ipvaPagoEm} OK
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1.5">
                        {vehicle.marca} {vehicle.modelo}
                      </h3>

                      {/* Mercosul Plate & Renavam */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex flex-col items-center border-2 border-slate-800 rounded bg-white px-2.5 py-0.5 shadow-xs">
                          <span className="text-[8px] font-bold text-blue-700 uppercase leading-none tracking-widest">BRASIL</span>
                          <span className="font-mono font-black text-sm text-slate-900 tracking-wider leading-tight">{vehicle.placa}</span>
                        </div>

                        <div className="text-right text-xs text-slate-500">
                          <div>Renavam: <span className="font-mono font-semibold text-slate-700">{vehicle.renavam || 'N/I'}</span></div>
                          <div>Ano: <span className="font-semibold text-slate-700">{vehicle.ano}</span></div>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-slate-400" />
                          <span>{vehicle.kmAtual?.toLocaleString('pt-BR')} km</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Fuel className="w-3.5 h-3.5 text-slate-400" />
                          <span>{vehicle.combustivel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        onClick={() => onSelectVehicle(vehicle)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Ficha & Manutenções</span>
                      </button>

                      <button
                        onClick={() => onEditVehicle(vehicle)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                        title="Editar Veículo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Excluir permanentemente o veículo ${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})?`)) {
                            deleteVehicle(vehicle.id);
                          }
                        }}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Excluir Veículo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Table View */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="px-5 py-3">Veículo</th>
                    <th className="px-5 py-3">Placa</th>
                    <th className="px-5 py-3">RENAVAM</th>
                    <th className="px-5 py-3">IPVA Pago</th>
                    <th className="px-5 py-3">Odômetro</th>
                    <th className="px-5 py-3">Mensalidade</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img 
                            src={vehicle.foto} 
                            alt="" 
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200" 
                          />
                          <div>
                            <div className="font-bold text-slate-900">{vehicle.marca} {vehicle.modelo}</div>
                            <div className="text-[11px] text-slate-400">{vehicle.categoria} • {vehicle.ano}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {vehicle.placa}
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-700 whitespace-nowrap">
                        {vehicle.renavam || '-'}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                          {vehicle.ipvaPagoEm || '-'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-700 whitespace-nowrap">
                        {vehicle.kmAtual?.toLocaleString('pt-BR')} km
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {formatMoney(vehicle.valorMensal)}/mês
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap">
                        <Badge variant={vehicle.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onSelectVehicle(vehicle)}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold text-xs transition"
                        >
                          Ficha & Manutenções
                        </button>
                        <button
                          onClick={() => onEditVehicle(vehicle)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Excluir o veículo ${vehicle.marca} ${vehicle.modelo}?`)) {
                              deleteVehicle(vehicle.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
