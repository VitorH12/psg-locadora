import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Car, 
  Fuel, 
  Gauge, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export function InspectionModal({ isOpen, onClose, preselectedVehicle = null }) {
  const { vehicles, addInspection } = useApp();

  const [veiculoId, setVeiculoId] = useState('');
  const [tipo, setTipo] = useState('Saída');
  const [vistoriador, setVistoriador] = useState('Vistoriador PSG');
  const [odometro, setOdometro] = useState(0);
  const [nivelCombustivel, setNivelCombustivel] = useState('Cheio (100%)');
  const [resultado, setResultado] = useState('Aprovado');
  const [parecerGeral, setParecerGeral] = useState('');
  const [assinaturaVistoriador, setAssinaturaVistoriador] = useState('Vistoriador PSG');
  const [assinaturaCliente, setAssinaturaCliente] = useState('');

  const [checklist, setChecklist] = useState({
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
  });

  const [avarias, setAvarias] = useState([]);
  const [selectedZone, setSelectedZone] = useState('Frente');
  const [avariaTipo, setAvariaTipo] = useState('Arranhão');
  const [avariaGravidade, setAvariaGravidade] = useState('Leve');
  const [avariaObs, setAvariaObs] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const vId = preselectedVehicle?.id || vehicles[0]?.id || '';
      setVeiculoId(vId);
      const selV = vehicles.find(v => v.id === vId);
      setOdometro(selV ? selV.kmAtual : 0);
      setTipo('Saída');
      setVistoriador('Vistoriador PSG');
      setNivelCombustivel('Cheio (100%)');
      setResultado('Aprovado');
      setParecerGeral('');
      setAssinaturaVistoriador('Vistoriador PSG');
      setAssinaturaCliente('');
      setAvarias([]);
      setAvariaObs('');
      setChecklist({
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
      });
      setErrors({});
    }
  }, [isOpen, preselectedVehicle, vehicles]);

  const handleVehicleChange = (vId) => {
    setVeiculoId(vId);
    const selV = vehicles.find(v => v.id === vId);
    if (selV) {
      setOdometro(selV.kmAtual);
    }
  };

  const handleChecklistChange = (item, val) => {
    setChecklist(prev => ({ ...prev, [item]: val }));
  };

  const handleAddAvaria = () => {
    if (!avariaObs.trim()) {
      alert('Por favor, descreva a avaria encontrada.');
      return;
    }

    const nova = {
      id: `av-${Date.now()}`,
      local: selectedZone,
      posicao: selectedZone,
      tipo: avariaTipo,
      gravidade: avariaGravidade,
      observacao: avariaObs
    };

    setAvarias(prev => [...prev, nova]);
    setAvariaObs('');

    if (avariaGravidade === 'Grave') {
      setResultado('Reprovado');
    } else if (resultado === 'Aprovado') {
      setResultado('Aprovado com Ressalvas');
    }
  };

  const handleRemoveAvaria = (id) => {
    setAvarias(prev => prev.filter(a => a.id !== id));
  };

  const validate = () => {
    const errs = {};
    if (!veiculoId) errs.veiculoId = 'Selecione um veículo cadastrado';
    if (!vistoriador.trim()) errs.vistoriador = 'Informe o nome do vistoriador';
    if (odometro < 0) errs.odometro = 'Quilometragem inválida';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    addInspection({
      veiculoId,
      locacaoId: null,
      tipo,
      dataHora: new Date().toISOString(),
      vistoriador,
      odometro: Number(odometro),
      nivelCombustivel,
      resultado,
      checklist,
      avarias,
      parecerGeral: parecerGeral || `Vistoria de ${tipo.toLowerCase()} realizada pela equipe técnica PSG. Parecer: ${resultado}.`,
      assinaturaCliente: assinaturaCliente || 'Locatário Titular',
      assinaturaVistoriador
    });

    onClose();
  };

  const checklistItems = [
    { key: 'lataria', label: 'Lataria Geral' },
    { key: 'pintura', label: 'Pintura & Verniz' },
    { key: 'pneus', label: 'Pneus & Calibragem' },
    { key: 'estepe', label: 'Estepe' },
    { key: 'vidros', label: 'Vidros & Para-brisa' },
    { key: 'farois', label: 'Faróis & Lanternas' },
    { key: 'arCondicionado', label: 'Ar-condicionado' },
    { key: 'painelEletrica', label: 'Painel & Elétrica' },
    { key: 'limpezaInterna', label: 'Higienização Interna' },
    { key: 'limpezaExterna', label: 'Lavagem Externa' },
    { key: 'kitSeguranca', label: 'Triângulo, Macaco & Chave' },
    { key: 'documentos', label: 'Documento CRLV' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registro de Vistoria Veicular PSG"
      subtitle="Checklist operacional, medição de combustível e mapeamento de avarias"
      maxWidth="max-w-4xl"
    >
      {vehicles.length === 0 ? (
        <div className="p-8 text-center text-slate-500 space-y-3">
          <p className="text-sm">Não há veículos cadastrados para realizar vistoria.</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold text-xs"
          >
            Fechar e Cadastrar Veículo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* 1. Informações Básicas */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-700" />
              <span>1. Identificação do Veículo & Vistoriador</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Veículo da Frota *</label>
                <select
                  value={veiculoId}
                  onChange={(e) => handleVehicleChange(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.marca} {v.modelo} - Placa: {v.placa} ({v.categoria}) - {v.kmAtual?.toLocaleString('pt-BR')} km
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Vistoria *</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Saída">Saída (Entrega das Chaves)</option>
                  <option value="Devolução">Devolução (Recebimento)</option>
                  <option value="Periódica">Periódica / Preventiva</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vistoriador PSG *</label>
                <input
                  type="text"
                  value={vistoriador}
                  onChange={(e) => {
                    setVistoriador(e.target.value);
                    setAssinaturaVistoriador(e.target.value);
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-slate-500" />
                  <span>Odômetro no Ato (km) *</span>
                </label>
                <input
                  type="number"
                  value={odometro}
                  onChange={(e) => setOdometro(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-slate-500" />
                  <span>Nível de Combustível</span>
                </label>
                <select
                  value={nivelCombustivel}
                  onChange={(e) => setNivelCombustivel(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Cheio (100%)">Cheio (100%)</option>
                  <option value="3/4 (75%)">3/4 (75%)</option>
                  <option value="1/2 (50%)">1/2 (50%)</option>
                  <option value="1/4 (25%)">1/4 (25%)</option>
                  <option value="Vazio (0%)">Vazio (0%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. Diagrama de Avarias */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span>2. Mapeamento de Avarias</span>
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Selecione a região no veículo para apontar arranhões, mossas ou avarias estéticas.
                </p>
              </div>
              <span className="px-2 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-lg font-bold text-[11px]">
                {avarias.length} avaria(s) marcada(s)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {[
                { id: 'Frente', label: '🚗 Frente' },
                { id: 'Lateral Esquerda', label: '🚪 Lateral Esq.' },
                { id: 'Lateral Direita', label: '🚪 Lateral Dir.' },
                { id: 'Traseira', label: '🚙 Traseira' },
                { id: 'Teto', label: '☀️ Teto' },
                { id: 'Vidros', label: '🪟 Vidros' },
                { id: 'Interior', label: '💺 Interior' }
              ].map(zone => (
                <button
                  key={zone.id}
                  type="button"
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-2 rounded-xl font-bold text-center border transition ${
                    selectedZone === zone.id
                      ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {zone.label}
                </button>
              ))}
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-500 block mb-1">Tipo:</label>
                  <select
                    value={avariaTipo}
                    onChange={(e) => setAvariaTipo(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="Arranhão">Arranhão / Risco</option>
                    <option value="Amassado">Amassado / Mossa</option>
                    <option value="Quebrado/Trinca">Quebrado / Trinca</option>
                    <option value="Ralado">Ralado de Guia / Roda</option>
                    <option value="Mancha">Mancha</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Gravidade:</label>
                  <select
                    value={avariaGravidade}
                    onChange={(e) => setAvariaGravidade(e.target.value)}
                    className="w-full p-1.5 bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="Leve">Leve</option>
                    <option value="Média">Média</option>
                    <option value="Grave">Grave</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-500 block mb-1">Descrição:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: Risco de 5cm..."
                      value={avariaObs}
                      onChange={(e) => setAvariaObs(e.target.value)}
                      className="flex-1 p-1.5 bg-white border border-slate-200 rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={handleAddAvaria}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shrink-0 flex items-center gap-1 shadow-xs transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Marcar</span>
                    </button>
                  </div>
                </div>
              </div>

              {avarias.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {avarias.map(a => (
                      <div
                        key={a.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-amber-200 text-amber-900 text-xs shadow-xs"
                      >
                        <div>
                          <strong>{a.local}:</strong> {a.tipo} ({a.gravidade})
                          <div className="text-[11px] text-slate-500">{a.observacao}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAvaria(a.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. Checklist */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-blue-700" />
              <span>3. Checklist Operacional</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {checklistItems.map(item => (
                <div key={item.key} className="p-2.5 bg-white rounded-xl border border-slate-200 space-y-1.5">
                  <span className="font-semibold text-slate-800 block">{item.label}</span>
                  <div className="flex gap-1">
                    {['Conforme', 'Com ressalva', 'Não conforme'].map(st => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => handleChecklistChange(item.key, st)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold transition ${
                          checklist[item.key] === st
                            ? st === 'Conforme'
                              ? 'bg-emerald-600 text-white'
                              : st === 'Com ressalva'
                              ? 'bg-amber-500 text-white'
                              : 'bg-rose-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {st === 'Conforme' ? 'OK' : st === 'Com ressalva' ? 'Ressalva' : 'Falha'}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Parecer e Assinaturas */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>4. Parecer Técnico & Assinaturas</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Resultado Final do Laudo *</label>
                <select
                  value={resultado}
                  onChange={(e) => setResultado(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Aprovado">Aprovado (Sem restrições)</option>
                  <option value="Aprovado com Ressalvas">Aprovado com Ressalvas</option>
                  <option value="Reprovado">Reprovado (Encaminhar Oficina)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nome do Locatário / Condutor</label>
                <input
                  type="text"
                  placeholder="Nome do motorista titular"
                  value={assinaturaCliente}
                  onChange={(e) => setAssinaturaCliente(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Parecer Geral do Vistoriador</label>
              <textarea
                rows={2}
                placeholder="Observações técnicas do laudo..."
                value={parecerGeral}
                onChange={(e) => setParecerGeral(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
              />
            </div>
          </div>

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
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition active:scale-95"
            >
              Gravar Laudo de Vistoria
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
