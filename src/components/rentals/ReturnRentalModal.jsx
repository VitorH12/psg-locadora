import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Car, 
  ClipboardCheck, 
  Gauge, 
  Fuel, 
  Plus, 
  Trash2 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export function ReturnRentalModal({ rental, isOpen, onClose }) {
  const { 
    getVehicleById, 
    getDriverById, 
    finishContract, 
    addInspection 
  } = useApp();

  const [kmFinal, setKmFinal] = useState(0);
  const [dataEncerramento, setDataEncerramento] = useState('');
  const [nivelCombustivel, setNivelCombustivel] = useState('Cheio (100%)');
  const [vistoriador, setVistoriador] = useState('Vistoriador PSG');
  const [resultadoVistoria, setResultadoVistoria] = useState('Aprovado');
  const [observacoesEncerramento, setObservacoesEncerramento] = useState('');
  const [avariasNovas, setAvariasNovas] = useState([]);
  const [novaAvariaTexto, setNovaAvariaTexto] = useState('');
  const [novaAvariaLocal, setNovaAvariaLocal] = useState('Frente');
  const [errors, setErrors] = useState({});

  const vehicle = rental ? getVehicleById(rental.veiculoId) : null;
  const driver = rental ? getDriverById(rental.motoristaId) : null;

  useEffect(() => {
    if (rental && vehicle) {
      const today = new Date().toISOString().split('T')[0];
      setDataEncerramento(today);
      setKmFinal(vehicle.kmAtual);
      setNivelCombustivel('Cheio (100%)');
      setAvariasNovas([]);
      setResultadoVistoria('Aprovado');
      setObservacoesEncerramento('');
      setErrors({});
    }
  }, [rental, vehicle, isOpen]);

  if (!rental || !vehicle) return null;

  const handleAddAvaria = () => {
    if (!novaAvariaTexto.trim()) return;
    setAvariasNovas(prev => [
      ...prev,
      {
        id: `av-${Date.now()}`,
        local: novaAvariaLocal,
        posicao: novaAvariaLocal,
        tipo: 'Avaria apontada no encerramento',
        gravidade: 'Média',
        observacao: novaAvariaTexto
      }
    ]);
    setNovaAvariaTexto('');
    setResultadoVistoria('Aprovado com Ressalvas');
  };

  const handleRemoveAvaria = (index) => {
    setAvariasNovas(prev => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    const errs = {};
    if (Number(kmFinal) < rental.kmInicial) {
      errs.kmFinal = `O Km final (${kmFinal}) não pode ser inferior ao Km inicial (${rental.kmInicial})`;
    }
    if (!vistoriador.trim()) {
      errs.vistoriador = 'Informe o vistoriador responsável';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalize = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Emite vistoria de devolução
    const novaVistoria = addInspection({
      veiculoId: vehicle.id,
      locacaoId: rental.id,
      tipo: 'Devolução',
      dataHora: new Date().toISOString(),
      vistoriador,
      odometro: Number(kmFinal),
      nivelCombustivel,
      resultado: avariasNovas.length > 0 ? resultadoVistoria : 'Aprovado',
      checklist: {
        lataria: avariasNovas.length > 0 ? 'Com ressalva' : 'Conforme',
        pintura: 'Conforme',
        pneus: 'Conforme',
        estepe: 'Conforme',
        vidros: 'Conforme',
        farois: 'Conforme',
        arCondicionado: 'Conforme',
        painelEletrica: 'Conforme',
        limpezaInterna: 'Conforme',
        limpezaExterna: 'Conforme',
        kitSeguranca: 'Conforme',
        documentos: 'Conforme'
      },
      avarias: avariasNovas,
      parecerGeral: observacoesEncerramento || `Contrato mensal ${rental.numeroContrato} encerrado. Veículo devolvido com ${Number(kmFinal) - rental.kmInicial} km rodados durante a vigência.`,
      assinaturaCliente: driver?.nome || 'Motorista',
      assinaturaVistoriador: vistoriador
    });

    // Encerra o contrato mensal
    finishContract(rental.id, {
      kmFinal: Number(kmFinal),
      dataEncerramento,
      vistoriaDevolucaoId: novaVistoria.id,
      observacoesEncerramento
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Encerramento do Contrato ${rental.numeroContrato}`}
      subtitle={`Devolução e conferência final do veículo ${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})`}
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleFinalize} className="space-y-5 text-xs">
        {/* Summary Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <span className="text-slate-400 block font-medium">Motorista (CNH B):</span>
            <span className="font-bold text-slate-800 text-sm">{driver?.nome}</span>
            <span className="text-slate-400 text-[11px] block">CPF: {driver?.cpf}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Veículo:</span>
            <span className="font-bold text-slate-800 text-sm">{vehicle.marca} {vehicle.modelo}</span>
            <span className="font-mono font-bold text-slate-700 text-xs block">{vehicle.placa}</span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Km Inicial do Contrato:</span>
            <span className="font-bold text-slate-800 text-sm">{rental.kmInicial?.toLocaleString('pt-BR')} km</span>
          </div>
        </div>

        {/* Odômetro e Data */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-700" />
            <span>1. Odômetro Final & Data de Encerramento</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Data de Encerramento *</label>
              <input
                type="date"
                value={dataEncerramento}
                onChange={(e) => setDataEncerramento(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Quilometragem Final de Retorno (km) *
              </label>
              <input
                type="number"
                value={kmFinal}
                onChange={(e) => setKmFinal(e.target.value)}
                className={`w-full p-2.5 bg-slate-50 border rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                  errors.kmFinal ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                }`}
              />
              {errors.kmFinal ? (
                <span className="text-rose-500 text-[11px] mt-0.5 block font-semibold">{errors.kmFinal}</span>
              ) : (
                <span className="text-slate-500 text-[11px] mt-0.5 block">
                  Total percorrido: <strong className="text-slate-800">{Math.max(0, Number(kmFinal) - rental.kmInicial)} km</strong>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Vistoria de Devolução */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-emerald-600" />
            <span>2. Vistoria de Devolução & Combustível</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-slate-500" />
                <span>Nível de Combustível</span>
              </label>
              <select
                value={nivelCombustivel}
                onChange={(e) => setNivelCombustivel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="Cheio (100%)">Cheio (100%)</option>
                <option value="3/4 (75%)">3/4 (75%)</option>
                <option value="1/2 (50%)">1/2 (50%)</option>
                <option value="1/4 (25%)">1/4 (25%)</option>
                <option value="Vazio (0%)">Vazio (0%)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Vistoriador PSG Responsável *</label>
              <input
                type="text"
                value={vistoriador}
                onChange={(e) => setVistoriador(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {errors.vistoriador && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.vistoriador}</span>}
            </div>
          </div>

          {/* Novas avarias */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-xs block">
              Registro de Avarias na Devolução (se houver)
            </span>

            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={novaAvariaLocal}
                onChange={(e) => setNovaAvariaLocal(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="Frente">Frente</option>
                <option value="Traseira">Traseira</option>
                <option value="Lateral Esquerda">Lateral Esquerda</option>
                <option value="Lateral Direita">Lateral Direita</option>
                <option value="Teto">Teto</option>
                <option value="Vidros">Vidros</option>
                <option value="Interior">Interior</option>
                <option value="Pneus">Pneus / Rodas</option>
              </select>

              <input
                type="text"
                placeholder="Descreva a avaria encontrada no veículo..."
                value={novaAvariaTexto}
                onChange={(e) => setNovaAvariaTexto(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />

              <button
                type="button"
                onClick={handleAddAvaria}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs flex items-center justify-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Registrar</span>
              </button>
            </div>

            {avariasNovas.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {avariasNovas.map((av, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                    <span>
                      <strong>{av.local}:</strong> {av.observacao}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAvaria(idx)}
                      className="text-amber-700 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observações do Encerramento</label>
            <input
              type="text"
              placeholder="Ex: Veículo entregue higienizado, manual e chaves devolvidos..."
              value={observacoesEncerramento}
              onChange={(e) => setObservacoesEncerramento(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition active:scale-95 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finalizar Contrato & Liberar Veículo</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
