import React, { useState, useEffect } from 'react';
import { 
  Car, 
  Wrench, 
  Check, 
  Calendar, 
  FileText, 
  ShieldCheck, 
  Clock 
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp, DEFAULT_MAINTENANCE } from '../../context/AppContext';

export function VehicleFormModal({ isOpen, onClose, vehicleToEdit = null }) {
  const { addVehicle, updateVehicle } = useApp();

  const [activeTab, setActiveTab] = useState('dados'); // 'dados' | 'manutencoes'

  const [formData, setFormData] = useState({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    placa: '',
    renavam: '',
    ipvaPagoEm: new Date().getFullYear().toString(),
    categoria: 'Econômico',
    cor: 'Branco',
    combustivel: 'Flex',
    kmAtual: 0,
    valorMensal: 2500,
    status: 'Disponível',
    foto: '',
    observacoes: '',
    manutencoes: { ...DEFAULT_MAINTENANCE }
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicleToEdit) {
      setFormData({
        marca: vehicleToEdit.marca || '',
        modelo: vehicleToEdit.modelo || '',
        ano: vehicleToEdit.ano || new Date().getFullYear(),
        placa: vehicleToEdit.placa || '',
        renavam: vehicleToEdit.renavam || '',
        ipvaPagoEm: vehicleToEdit.ipvaPagoEm || new Date().getFullYear().toString(),
        categoria: vehicleToEdit.categoria || 'Econômico',
        cor: vehicleToEdit.cor || 'Branco',
        combustivel: vehicleToEdit.combustivel || 'Flex',
        kmAtual: vehicleToEdit.kmAtual || 0,
        valorMensal: vehicleToEdit.valorMensal || 2500,
        status: vehicleToEdit.status || 'Disponível',
        foto: vehicleToEdit.foto || '',
        observacoes: vehicleToEdit.observacoes || '',
        manutencoes: vehicleToEdit.manutencoes ? { ...DEFAULT_MAINTENANCE, ...vehicleToEdit.manutencoes } : { ...DEFAULT_MAINTENANCE }
      });
    } else {
      setFormData({
        marca: '',
        modelo: '',
        ano: new Date().getFullYear(),
        placa: '',
        renavam: '',
        ipvaPagoEm: new Date().getFullYear().toString(),
        categoria: 'Econômico',
        cor: 'Branco',
        combustivel: 'Flex',
        kmAtual: 0,
        valorMensal: 2500,
        status: 'Disponível',
        foto: '',
        observacoes: '',
        manutencoes: { ...DEFAULT_MAINTENANCE }
      });
    }
    setActiveTab('dados');
    setErrors({});
  }, [vehicleToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'placa' ? value.toUpperCase().trim() : value
    }));
  };

  const handleMaintenanceChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      manutencoes: {
        ...prev.manutencoes,
        [field]: value
      }
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.marca.trim()) newErrors.marca = 'Informe a marca';
    if (!formData.modelo.trim()) newErrors.modelo = 'Informe o modelo do veículo';
    if (!formData.placa.trim()) {
      newErrors.placa = 'Informe a placa';
    } else if (formData.placa.length < 7) {
      newErrors.placa = 'Placa deve ter no mínimo 7 caracteres';
    }
    if (!formData.ano || formData.ano < 1990 || formData.ano > new Date().getFullYear() + 1) {
      newErrors.ano = 'Ano de fabricação inválido';
    }
    if (Number(formData.valorMensal) <= 0) {
      newErrors.valorMensal = 'A mensalidade deve ser maior que zero';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      setActiveTab('dados'); // volta para a aba com erros caso haja
      return;
    }

    if (vehicleToEdit) {
      updateVehicle(vehicleToEdit.id, formData);
    } else {
      addVehicle(formData);
    }
    onClose();
  };

  // Os 15 itens de manutenção extraídos exatamente do anexo do usuário
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
      title={vehicleToEdit ? `Editar Veículo: ${vehicleToEdit.marca} ${vehicleToEdit.modelo}` : 'Cadastrar Novo Veículo na Frota'}
      subtitle="Dados cadastrais, documentação (Renavam / IPVA) e ficha de manutenções"
      maxWidth="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-4 font-semibold text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('dados')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'dados'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Dados do Veículo & Documentação</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manutencoes')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition ${
              activeTab === 'manutencoes'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Manutenções do Veículo (15 Itens)</span>
          </button>
        </div>

        {/* Tab 1: Dados do Veículo & Documentação */}
        {activeTab === 'dados' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Marca / Fabricante *</label>
                <input
                  type="text"
                  name="marca"
                  placeholder="Ex: Chevrolet, Fiat, Toyota, Renault..."
                  value={formData.marca}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                    errors.marca ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.marca && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.marca}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Modelo do Veículo *</label>
                <input
                  type="text"
                  name="modelo"
                  placeholder="Ex: Onix 1.0 Turbo, Strada Freedom, Creta..."
                  value={formData.modelo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                    errors.modelo ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.modelo && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.modelo}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Placa *</label>
                <input
                  type="text"
                  name="placa"
                  maxLength={8}
                  placeholder="Ex: BRA2E19"
                  value={formData.placa}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border font-mono font-bold uppercase rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                    errors.placa ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                  }`}
                />
                {errors.placa && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.placa}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ano Fab/Mod *</label>
                <input
                  type="number"
                  name="ano"
                  value={formData.ano}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                {errors.ano && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.ano}</span>}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cor</label>
                <input
                  type="text"
                  name="cor"
                  placeholder="Ex: Branco, Prata, Preto, Vermelho..."
                  value={formData.cor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            {/* Documentação: Renavam e Ano IPVA pago em */}
            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200/80 space-y-3">
              <span className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                Documentação do Veículo (Renavam & IPVA)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código RENAVAM</label>
                  <input
                    type="text"
                    name="renavam"
                    maxLength={11}
                    placeholder="Ex: 00123456789 (11 dígitos)"
                    value={formData.renavam}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 font-mono rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Registro Nacional de Veículos Automotores</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ano IPVA pago em</label>
                  <input
                    type="text"
                    name="ipvaPagoEm"
                    placeholder="Ex: 2026 (ou data de quitação)"
                    value={formData.ipvaPagoEm}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-200 font-semibold rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Ano de exercício ou data em que o IPVA foi quitado</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Categoria *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Econômico">Econômico</option>
                  <option value="Sedã">Sedã</option>
                  <option value="SUV">SUV</option>
                  <option value="Utilitário">Utilitário</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Combustível</label>
                <select
                  name="combustivel"
                  value={formData.combustivel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Flex">Flex (Álcool/Gasolina)</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Elétrico">Elétrico</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Operacional</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                >
                  <option value="Disponível">Disponível</option>
                  <option value="Alugado">Alugado</option>
                  <option value="Em Manutenção">Em Manutenção</option>
                  <option value="Em Vistoria">Em Vistoria</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quilometragem Atual (Odômetro) *</label>
                <input
                  type="number"
                  name="kmAtual"
                  value={formData.kmAtual}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Valor da Mensalidade (R$/mês) *</label>
                <input
                  type="number"
                  name="valorMensal"
                  step="0.01"
                  value={formData.valorMensal}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 bg-slate-50 border font-bold text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                    errors.valorMensal ? 'border-rose-400' : 'border-slate-200'
                  }`}
                />
                {errors.valorMensal && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.valorMensal}</span>}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">URL da Imagem do Veículo (Opcional)</label>
              <input
                type="url"
                name="foto"
                placeholder="https://exemplo.com/foto.jpg"
                value={formData.foto}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Observações Internas</label>
              <textarea
                name="observacoes"
                rows={2}
                placeholder="Ex: Revisões na concessionária, histórico do veículo..."
                value={formData.observacoes}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Manutenções do Veículo (Baseado no Anexo do Usuário) */}
        {activeTab === 'manutencoes' && (
          <div className="space-y-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 text-xs block">
                  Ficha de Manutenções Preventivas e Mecânicas
                </span>
                <span className="text-[11px] text-slate-500">
                  Preencha a data, quilometragem ou anotação da última substituição de cada componente.
                </span>
              </div>
              <span className="text-[11px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded">
                15 Componentes
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
              {maintenanceFields.map(field => (
                <div key={field.key} className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition">
                  <label className="font-semibold text-slate-700 text-xs w-1/2 truncate" title={field.label}>
                    {field.label}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 50.000 km ou 10/2026"
                    value={formData.manutencoes[field.key] || ''}
                    onChange={(e) => handleMaintenanceChange(field.key, e.target.value)}
                    className="w-1/2 px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-slate-400 text-[11px]">
            {activeTab === 'dados' ? 'Próximo: configure as manutenções na 2ª aba' : 'Preenchimento livre para controle de trocas'}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{vehicleToEdit ? 'Salvar Alterações' : 'Cadastrar Veículo'}</span>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
