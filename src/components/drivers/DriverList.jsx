import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  Edit2, 
  Trash2, 
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';

export function DriverList({ onOpenNewDriver, onEditDriver, onSelectDriver }) {
  const { drivers, deleteDriver, contracts } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const getCnhStatus = (validadeStr) => {
    if (!validadeStr) return { label: 'Sem data', type: 'neutral' };
    const validade = new Date(validadeStr);
    const hoje = new Date();
    const diffDays = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: 'CNH Vencida', type: 'danger', days: diffDays };
    }
    if (diffDays <= 30) {
      return { label: `Vence em ${diffDays}d`, type: 'warning', days: diffDays };
    }
    return { label: 'CNH Válida', type: 'success', days: diffDays };
  };

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = 
      d.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.cpf.includes(searchTerm) ||
      d.cnh.includes(searchTerm);

    const matchesStatus = statusFilter === 'Todos' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Motoristas Cadastrados (CNH B)</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Gerenciamento dos condutores habilitados categoria B, monitoramento de vencimento de CNH e histórico de contratos.
          </p>
        </div>

        <button
          onClick={onOpenNewDriver}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xs transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Motorista</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, CPF ou número da CNH..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Status:</span>
          {['Todos', 'Ativo', 'Bloqueado'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition ${
                statusFilter === st
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {drivers.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Nenhum motorista cadastrado</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Cadastre os condutores com CNH B, CPF, contatos e validade de habilitação para emissão de contratos de locação.
            </p>
          </div>
          <button
            onClick={onOpenNewDriver}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-md hover:bg-blue-700 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Primeiro Motorista</span>
          </button>
        </div>
      ) : filteredDrivers.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-xs text-slate-500">
          Nenhum motorista encontrado com os filtros aplicados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDrivers.map(driver => {
            const cnhInfo = getCnhStatus(driver.validadeCnh);
            const driverContracts = contracts.filter(c => c.motoristaId === driver.id);

            return (
              <div
                key={driver.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                        {driver.nome.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm">{driver.nome}</h3>
                        <div className="text-[11px] text-slate-400 font-mono">CPF: {driver.cpf}</div>
                      </div>
                    </div>

                    <Badge variant={driver.status} size="sm" />
                  </div>

                  {/* CNH B Pill */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        CNH: <strong className="font-mono text-slate-900">{driver.cnh}</strong>{' '}
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">Cat. B</span>
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        cnhInfo.type === 'danger'
                          ? 'bg-rose-100 text-rose-800'
                          : cnhInfo.type === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {cnhInfo.label}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Validade da CNH:{' '}
                      <strong className="text-slate-700">
                        {new Date(driver.validadeCnh).toLocaleDateString('pt-BR')}
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{driver.telefone}</span>
                    </div>
                    {driver.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{driver.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectDriver(driver)}
                    className="flex-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Contratos ({driverContracts.length})</span>
                  </button>

                  <button
                    onClick={() => onEditDriver(driver)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
                    title="Editar Motorista"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Excluir motorista ${driver.nome}?`)) {
                        deleteDriver(driver.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    title="Excluir Motorista"
                  >
                    <Trash2 className="w-4 h-4" />
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
