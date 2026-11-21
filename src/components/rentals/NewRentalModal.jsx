import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Users, 
  Calendar, 
  DollarSign, 
  ClipboardCheck,
  Check,
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export function NewRentalModal({ isOpen, onClose }) {
  const { vehicles, drivers, createContract, addInspection } = useApp();

  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [mesesVigencia, setMesesVigencia] = useState(12);
  const [valorMensal, setValorMensal] = useState(2500);
  const [diaVencimento, setDiaVencimento] = useState(10);
  const [caucao, setCaucao] = useState(0);
  const [franquiaKm, setFranquiaKm] = useState('2.500 km/mês');
  const [realizarVistoriaSaida, setRealizarVistoriaSaida] = useState(true);
  const [nomeVistoriador, setNomeVistoriador] = useState('Responsável Operacional PSG');
  const [observacoesContrato, setObservacoesContrato] = useState('');
  const [errors, setErrors] = useState({});

  const availableVehicles = vehicles.filter(v => v.status === 'Disponível');
  const eligibleDrivers = drivers.filter(d => d.status !== 'Bloqueado');

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split('T')[0];
      setDataInicio(today);
      setSelectedDriverId(eligibleDrivers[0]?.id || '');
      const firstVehicle = availableVehicles[0];
      setSelectedVehicleId(firstVehicle?.id || '');
      if (firstVehicle) {
        setValorMensal(firstVehicle.valorMensal || 2500);
      }
      setMesesVigencia(12);
      setDiaVencimento(10);
      setCaucao(0);
      setFranquiaKm('2.500 km/mês');
      setObservacoesContrato('');
      setErrors({});
    }
  }, [isOpen, vehicles, drivers]);

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId);
  const selectedDriver = drivers.find(d => d.id === selectedDriverId);

  // When vehicle selection changes, auto-fill monthly price
  const handleVehicleChange = (vId) => {
    setSelectedVehicleId(vId);
    const v = vehicles.find(veh => veh.id === vId);
    if (v && v.valorMensal) {
      setValorMensal(v.valorMensal);
    }
  };

  const isCnhExpired = selectedDriver ? new Date(selectedDriver.validadeCnh) < new Date() : false;

  // Compute calculated end date
  const computeEndDate = () => {
    if (!dataInicio) return '';
    const d = new Date(dataInicio);
    d.setMonth(d.getMonth() + Number(mesesVigencia));
    return d.toISOString().split('T')[0];
  };

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  const validate = () => {
    const errs = {};
    if (!selectedDriverId) errs.driver = 'Selecione um motorista habilitado';
    if (isCnhExpired) errs.driver = 'Este motorista está com a CNH vencida!';
    if (!selectedVehicleId) errs.vehicle = 'Selecione um veículo disponível';
    if (!dataInicio) errs.dataInicio = 'Informe a data de início do contrato';
    if (!valorMensal || Number(valorMensal) <= 0) errs.valorMensal = 'Informe o valor da mensalidade';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let vistoriaSaidaId = null;

    if (realizarVistoriaSaida && selectedVehicle) {
      const novaVistoria = addInspection({
        veiculoId: selectedVehicle.id,
        tipo: 'Saída',
        dataHora: new Date().toISOString(),
        vistoriador: nomeVistoriador || 'Vistoriador PSG',
        odometro: selectedVehicle.kmAtual,
        nivelCombustivel: 'Cheio (100%)',
        resultado: 'Aprovado',
        checklist: {
          lataria: 'Conforme',
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
        avarias: [],
        parecerGeral: `Vistoria inicial de entrega das chaves para início do contrato de locação mensal do veículo ${selectedVehicle.placa}.`,
        assinaturaCliente: selectedDriver?.nome || 'Locatário',
        assinaturaVistoriador: nomeVistoriador || 'Responsável Pátio PSG'
      });
      vistoriaSaidaId = novaVistoria.id;
    }

    createContract({
      veiculoId: selectedVehicleId,
      motoristaId: selectedDriverId,
      dataInicio,
      dataTermino: computeEndDate(),
      mesesVigencia: Number(mesesVigencia),
      valorMensal: Number(valorMensal),
      diaVencimento: Number(diaVencimento),
      caucao: Number(caucao) || 0,
      franquiaKm,
      kmInicial: selectedVehicle?.kmAtual || 0,
      vistoriaSaidaId,
      observacoesContrato
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Abertura de Contrato de Locação Mensal"
      subtitle="Defina o condutor com CNH B, veículo disponível e condições financeiras mensais"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-xs">
        {/* 1. Motorista */}
        <div className="space-y-2">
          <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-700" />
            <span>1. Motorista Responsável (CNH Categoria B) *</span>
          </label>

          {eligibleDrivers.length === 0 ? (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs">
              Nenhum motorista ativo cadastrado no sistema. Por favor, cadastre um motorista primeiro.
            </div>
          ) : (
            <select
              value={selectedDriverId}
              onChange={(e) => setSelectedDriverId(e.target.value)}
              className={`w-full p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                errors.driver ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
              }`}
            >
              <option value="">-- Selecione o motorista titular --</option>
              {eligibleDrivers.map(d => (
                <option key={d.id} value={d.id}>
                  {d.nome} - CPF: {d.cpf} - CNH: {d.cnh} (Cat. B)
                </option>
              ))}
            </select>
          )}

          {selectedDriver && (
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isCnhExpired ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div>
                <strong>{selectedDriver.nome}</strong> • Contato: {selectedDriver.telefone}
              </div>
              <div>
                Validade CNH:{' '}
                <strong className={isCnhExpired ? 'text-rose-600' : 'text-slate-800'}>
                  {new Date(selectedDriver.validadeCnh).toLocaleDateString('pt-BR')}
                </strong>{' '}
                {isCnhExpired && <span className="font-bold text-rose-600">(VENCIDA!)</span>}
              </div>
            </div>
          )}
          {errors.driver && <span className="text-rose-500 text-[11px] font-semibold">{errors.driver}</span>}
        </div>

        {/* 2. Veículo */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-700" />
            <span>2. Veículo da Frota Disponível *</span>
          </label>

          {availableVehicles.length === 0 ? (
            <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs">
              Nenhum veículo disponível no momento. Todos estão em contrato mensal ativo ou em manutenção.
            </div>
          ) : (
            <select
              value={selectedVehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              className={`w-full p-2.5 bg-slate-50 border rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                errors.vehicle ? 'border-rose-400' : 'border-slate-200'
              }`}
            >
              <option value="">-- Selecione o veículo disponível --</option>
              {availableVehicles.map(v => (
                <option key={v.id} value={v.id}>
                  {v.marca} {v.modelo} - Placa: {v.placa} ({v.categoria}) - {formatMoney(v.valorMensal)}/mês
                </option>
              ))}
            </select>
          )}

          {selectedVehicle && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img 
                  src={selectedVehicle.foto} 
                  alt="" 
                  className="w-12 h-10 object-cover rounded-lg border border-slate-200" 
                />
                <div>
                  <div className="font-bold text-slate-900">{selectedVehicle.marca} {selectedVehicle.modelo}</div>
                  <div className="text-slate-500">
                    Placa: <span className="font-mono font-bold text-slate-800">{selectedVehicle.placa}</span> • {selectedVehicle.kmAtual?.toLocaleString('pt-BR')} km
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mensalidade Sugerida</span>
                <span className="font-extrabold text-blue-700 text-sm">{formatMoney(selectedVehicle.valorMensal)}/mês</span>
              </div>
            </div>
          )}
          {errors.vehicle && <span className="text-rose-500 text-[11px] font-semibold">{errors.vehicle}</span>}
        </div>

        {/* 3. Termos Financeiros e Vigência Mensal */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-blue-700" />
            <span>3. Condições do Contrato Mensal</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Data de Início do Contrato *</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {errors.dataInicio && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.dataInicio}</span>}
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Vigência Contratual</label>
              <select
                value={mesesVigencia}
                onChange={(e) => setMesesVigencia(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value={1}>1 Mês (Renovável)</option>
                <option value={3}>3 Meses</option>
                <option value={6}>6 Meses</option>
                <option value={12}>12 Meses (1 Ano)</option>
                <option value={24}>24 Meses (2 Anos)</option>
                <option value={36}>36 Meses (3 Anos)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Término Previsto</label>
              <input
                type="date"
                value={computeEndDate()}
                disabled
                className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Valor da Mensalidade (R$/mês) *</label>
              <input
                type="number"
                step="0.01"
                value={valorMensal}
                onChange={(e) => setValorMensal(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm text-blue-700 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
              {errors.valorMensal && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.valorMensal}</span>}
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Dia do Vencimento Mensal</label>
              <select
                value={diaVencimento}
                onChange={(e) => setDiaVencimento(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value={5}>Dia 05 de cada mês</option>
                <option value={10}>Dia 10 de cada mês</option>
                <option value={15}>Dia 15 de cada mês</option>
                <option value={20}>Dia 20 de cada mês</option>
                <option value={25}>Dia 25 de cada mês</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Franquia de Km</label>
              <select
                value={franquiaKm}
                onChange={(e) => setFranquiaKm(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="1.500 km/mês">1.500 km/mês</option>
                <option value="2.500 km/mês">2.500 km/mês</option>
                <option value="3.500 km/mês">3.500 km/mês</option>
                <option value="5.000 km/mês">5.000 km/mês</option>
                <option value="Livre (Sem limite)">Livre (Sem limite)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 4. Vistoria de Saída */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="vistoriaSaida"
                checked={realizarVistoriaSaida}
                onChange={(e) => setRealizarVistoriaSaida(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
              />
              <label htmlFor="vistoriaSaida" className="cursor-pointer">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <ClipboardCheck className="w-4 h-4 text-blue-700" />
                  Emitir Laudo de Vistoria de Saída Automático
                </span>
                <span className="text-blue-700 text-[11px]">
                  Gera o laudo inicial com checklist de conformidade e odômetro de entrega das chaves.
                </span>
              </label>
            </div>

            {realizarVistoriaSaida && (
              <input
                type="text"
                placeholder="Vistoriador PSG"
                value={nomeVistoriador}
                onChange={(e) => setNomeVistoriador(e.target.value)}
                className="px-2.5 py-1 bg-white border border-blue-300 rounded-lg text-xs font-semibold text-slate-800 w-44"
              />
            )}
          </div>
        </div>

        <div>
          <label className="block text-slate-600 font-semibold mb-1">Cláusulas Específicas / Observações</label>
          <input
            type="text"
            placeholder="Ex: Contrato corporativo, segundo condutor autorizado..."
            value={observacoesContrato}
            onChange={(e) => setObservacoesContrato(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        {/* Resumo do Contrato */}
        <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="space-y-1">
            <span className="text-xs text-slate-400">Resumo da Fatura Mensal</span>
            <div className="text-xs text-slate-300">
              Vigência de {mesesVigencia} mês(es) • Franquia: {franquiaKm} • Vencimento: Dia {diaVencimento}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Valor Mensal Recorrente</span>
            <span className="text-2xl font-black text-emerald-400">{formatMoney(valorMensal)}/mês</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={availableVehicles.length === 0 || isCnhExpired}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold shadow-md transition active:scale-95 flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Emitir Contrato & Liberar Veículo</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
