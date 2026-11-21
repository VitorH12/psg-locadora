import React, { useState } from 'react';
import { 
  Car, 
  Gauge, 
  Fuel, 
  ClipboardCheck, 
  FileText, 
  CheckCircle2, 
  ExternalLink,
  PlusCircle,
  Wrench,
  ShieldCheck,
  Edit2,
  Check
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useApp, DEFAULT_MAINTENANCE } from '../../context/AppContext';

export function VehicleDetailModal({ vehicle, isOpen, onClose, onOpenNewInspectionForVehicle, onSelectInspection }) {
  const { 
    getInspectionsForVehicle, 
    getContractsForVehicle, 
    getDriverById, 
    updateVehicle,
    updateVehicleMaintenance 
  } = useApp();

  const [activeTab, setActiveTab] = useState('manutencoes'); // 'manutencoes' | 'vistorias' | 'contratos' | 'ficha'
  const [isEditingMaintenance, setIsEditingMaintenance] = useState(false);
  const [maintenanceForm, setMaintenanceForm] = useState({ ...DEFAULT_MAINTENANCE });

  if (!vehicle) return null;

  const inspectionsList = getInspectionsForVehicle(vehicle.id);
  const contractsList = getContractsForVehicle(vehicle.id);
  const vehicleMaintenance = vehicle.manutencoes || DEFAULT_MAINTENANCE;

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const handleStatusChange = (newStatus) => {
    updateVehicle(vehicle.id, { status: newStatus });
  };

  const handleStartEditMaintenance = () => {
    setMaintenanceForm({ ...DEFAULT_MAINTENANCE, ...(vehicle.manutencoes || {}) });
    setIsEditingMaintenance(true);
  };

  const handleSaveMaintenance = () => {
    updateVehicleMaintenance(vehicle.id, maintenanceForm);
    setIsEditingMaintenance(false);
  };

  const maintenanceFields = [
    { key: 'oleo', label: 'Óleo' },
    { key: 'correiaDentada', label: 'Correia dentada' },
    { key: 'filtros', label: 'Filtros (Cab. e Ar)' },
    { key: 'pastilhasFreio', label: 'Pastilhas de freio' },
    { key: 'discos', label: 'Discos' },
    { key: 'cabosVelas', label: 'Cabos de velas' },
    { key: 'velas', label: 'Velas' },
    { key: 'bobina', label: 'Bobina' },
    { key: 'embreagem', label: 'Embreagem' },
    { key: 'amortecedoresDianteiros', label: 'Amortecedores Dianteiros' },
    { key: 'amortecedoresTraseiros', label: 'Amortecedores Traseiros' },
    { key: 'radiador', label: 'Radiador' },
    { key: 'freio', label: 'Freio' },
    { key: 'bombaAgua', label: 'Bomba d\'água' },
    { key: 'valvulaTermostatica', label: 'Válvula Termostática' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${vehicle.marca} ${vehicle.modelo}`}
      subtitle={`Placa: ${vehicle.placa} • Renavam: ${vehicle.renavam || 'Não informado'}`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <img
            src={vehicle.foto}
            alt=""
            className="w-full sm:w-44 h-32 object-cover rounded-xl border border-slate-200 shadow-xs"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="inline-flex flex-col items-center border border-slate-800 rounded bg-white px-2 py-0.5">
                    <span className="text-[7px] font-bold text-blue-700 uppercase leading-none">BRASIL</span>
                    <span className="font-mono font-black text-xs text-slate-900 leading-tight">{vehicle.placa}</span>
                  </div>
                  {vehicle.renavam && (
                    <span className="text-[11px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                      Renavam: <strong className="text-slate-800">{vehicle.renavam}</strong>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">Status:</span>
                  <select
                    value={vehicle.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="text-xs font-semibold px-2 py-1 bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Disponível">Disponível</option>
                    <option value="Alugado">Alugado</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                    <option value="Em Vistoria">Em Vistoria</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                <div>
                  <span className="text-slate-400 block">Ano:</span>
                  <span className="font-semibold text-slate-800">{vehicle.ano}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Odômetro:</span>
                  <span className="font-semibold text-slate-800">{vehicle.kmAtual?.toLocaleString('pt-BR')} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ano IPVA pago em:</span>
                  <span className="font-bold text-emerald-700">{vehicle.ipvaPagoEm || 'Não informado'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Mensalidade:</span>
                  <span className="font-bold text-blue-700">{formatMoney(vehicle.valorMensal)}/mês</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Combustível: <strong className="text-slate-700">{vehicle.combustivel}</strong>
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenNewInspectionForVehicle(vehicle);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nova Vistoria para este Veículo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 gap-4 sm:gap-6 text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('manutencoes')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'manutencoes'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Manutenções do Veículo</span>
          </button>

          <button
            onClick={() => setActiveTab('vistorias')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'vistorias'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardCheck className="w-4 h-4" />
            <span>Histórico de Vistorias ({inspectionsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contratos')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'contratos'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Histórico de Contratos ({contractsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('ficha')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'ficha'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Ficha Técnica</span>
          </button>
        </div>

        {/* Tab 1: Manutenções do Veículo (Baseado no Anexo) */}
        {activeTab === 'manutencoes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-blue-700" />
                  <span>Controle de Manutenções do Veículo</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Registro da data, quilometragem ou parecer das últimas revisões e trocas de peças.
                </p>
              </div>

              {!isEditingMaintenance ? (
                <button
                  type="button"
                  onClick={handleStartEditMaintenance}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Editar Manutenções</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingMaintenance(false)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveMaintenance}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Salvar</span>
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {maintenanceFields.map(field => {
                const value = isEditingMaintenance
                  ? maintenanceForm[field.key] || ''
                  : vehicleMaintenance[field.key] || '';

                return (
                  <div
                    key={field.key}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition flex flex-col justify-between space-y-1.5"
                  >
                    <span className="font-bold text-slate-700 text-xs">
                      {field.label}
                    </span>

                    {isEditingMaintenance ? (
                      <input
                        type="text"
                        placeholder="Ex: 40.000 km ou 12/2026"
                        value={maintenanceForm[field.key] || ''}
                        onChange={(e) => setMaintenanceForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="text-xs">
                        {value ? (
                          <span className="font-semibold text-slate-900 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded block">
                            {value}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            Não informado
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Histórico de Vistorias */}
        {activeTab === 'vistorias' && (
          <div className="space-y-4">
            {inspectionsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed rounded-xl">
                Nenhuma vistoria registrada para este veículo até o momento.
              </div>
            ) : (
              <div className="space-y-3">
                {inspectionsList.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={ins.tipo} />
                        <span className="font-bold text-sm text-slate-900">{ins.codigo}</span>
                        <span className="text-xs text-slate-400">
                          {new Date(ins.dataHora).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={ins.resultado} />
                        <button
                          onClick={() => {
                            onClose();
                            onSelectInspection(ins);
                          }}
                          className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver Laudo Completo</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400">Vistoriador:</span>{' '}
                        <strong className="text-slate-700">{ins.vistoriador}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Odômetro:</span>{' '}
                        <strong className="text-slate-700">{ins.odometro?.toLocaleString('pt-BR')} km</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Combustível:</span>{' '}
                        <strong className="text-slate-700">{ins.nivelCombustivel}</strong>
                      </div>
                    </div>

                    {ins.avarias && ins.avarias.length > 0 ? (
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-xs">
                        <span className="font-bold text-amber-900 block mb-1">
                          Avarias registradas ({ins.avarias.length}):
                        </span>
                        <ul className="list-disc list-inside space-y-0.5 text-amber-800">
                          {ins.avarias.map((av, idx) => (
                            <li key={idx}>
                              <strong>{av.local}</strong>: {av.tipo} ({av.gravidade}) - {av.observacao}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Nenhuma avaria apontada nesta vistoria.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Histórico de Contratos */}
        {activeTab === 'contratos' && (
          <div className="space-y-4">
            {contractsList.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs border border-dashed rounded-xl">
                Nenhum contrato de locação mensal registrado para este veículo.
              </div>
            ) : (
              <div className="space-y-3">
                {contractsList.map((ctr) => {
                  const driver = getDriverById(ctr.motoristaId);
                  return (
                    <div
                      key={ctr.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{ctr.numeroContrato}</span>
                        <Badge variant={ctr.status} />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                        <div>
                          <span className="text-slate-400">Motorista:</span>{' '}
                          <strong>{driver?.nome || 'Motorista'}</strong> ({driver?.cpf})
                        </div>
                        <div>
                          <span className="text-slate-400">Mensalidade:</span>{' '}
                          <strong className="text-blue-700">{formatMoney(ctr.valorMensal)}/mês</strong> (Venc: dia {ctr.diaVencimento || '10'})
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-500">
                        <div>
                          Início: {new Date(ctr.dataInicio).toLocaleDateString('pt-BR')} (Km {ctr.kmInicial?.toLocaleString('pt-BR')})
                        </div>
                        <div>
                          Término/Encerramento: {ctr.dataEncerramento ? new Date(ctr.dataEncerramento).toLocaleDateString('pt-BR') : (ctr.dataTermino ? `Previsto: ${new Date(ctr.dataTermino).toLocaleDateString('pt-BR')}` : 'Vigente')}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Ficha Técnica */}
        {activeTab === 'ficha' && (
          <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 text-sm">Dados Técnicos & Documentais</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-400 block">Marca:</span>
                <span className="font-semibold text-slate-700">{vehicle.marca}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Modelo:</span>
                <span className="font-semibold text-slate-700">{vehicle.modelo}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ano Fab/Mod:</span>
                <span className="font-semibold text-slate-700">{vehicle.ano}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Placa:</span>
                <span className="font-mono font-bold text-slate-800">{vehicle.placa}</span>
              </div>
              <div>
                <span className="text-slate-400 block">RENAVAM:</span>
                <span className="font-mono font-bold text-slate-800">{vehicle.renavam || 'Não informado'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ano IPVA pago em:</span>
                <span className="font-bold text-emerald-700">{vehicle.ipvaPagoEm || 'Não informado'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Combustível:</span>
                <span className="font-semibold text-slate-700">{vehicle.combustivel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Categoria:</span>
                <span className="font-semibold text-slate-700">{vehicle.categoria}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Cor:</span>
                <span className="font-semibold text-slate-700">{vehicle.cor}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <span className="text-slate-400 block mb-1">Anotações Internas:</span>
              <p className="p-3 bg-slate-50 rounded-lg text-slate-700 italic">
                {vehicle.observacoes || 'Nenhuma anotação adicional informada.'}
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
