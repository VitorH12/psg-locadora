import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

export function DriverFormModal({ isOpen, onClose, driverToEdit = null }) {
  const { addDriver, updateDriver } = useApp();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    cnh: '',
    categoriaCnh: 'B', // Fixo Categoria B
    validadeCnh: '',
    telefone: '',
    email: '',
    endereco: '',
    status: 'Ativo',
    historicoNotas: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (driverToEdit) {
      setFormData({
        nome: driverToEdit.nome || '',
        cpf: driverToEdit.cpf || '',
        cnh: driverToEdit.cnh || '',
        categoriaCnh: 'B',
        validadeCnh: driverToEdit.validadeCnh || '',
        telefone: driverToEdit.telefone || '',
        email: driverToEdit.email || '',
        endereco: driverToEdit.endereco || '',
        status: driverToEdit.status || 'Ativo',
        historicoNotas: driverToEdit.historicoNotas || ''
      });
    } else {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 5);
      const defaultValidade = futureDate.toISOString().split('T')[0];

      setFormData({
        nome: '',
        cpf: '',
        cnh: '',
        categoriaCnh: 'B',
        validadeCnh: defaultValidade,
        telefone: '',
        email: '',
        endereco: '',
        status: 'Ativo',
        historicoNotas: ''
      });
    }
    setErrors({});
  }, [driverToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Informe o nome completo do motorista';
    if (!formData.cpf.trim()) newErrors.cpf = 'Informe o CPF';
    if (!formData.cnh.trim()) newErrors.cnh = 'Informe o número de registro da CNH';
    if (!formData.validadeCnh) newErrors.validadeCnh = 'Informe a data de validade da CNH';
    if (!formData.telefone.trim()) newErrors.telefone = 'Informe o telefone de contato';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (driverToEdit) {
      updateDriver(driverToEdit.id, formData);
    } else {
      addDriver(formData);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={driverToEdit ? 'Editar Dados do Motorista' : 'Cadastrar Novo Motorista'}
      subtitle="Dados cadastrais, habilitação (CNH Categoria B) e contato"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1">Nome Completo do Motorista *</label>
          <input
            type="text"
            name="nome"
            placeholder="Ex: Carlos Eduardo Silveira"
            value={formData.nome}
            onChange={handleChange}
            className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
              errors.nome ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
            }`}
          />
          {errors.nome && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.nome}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">CPF *</label>
            <input
              type="text"
              name="cpf"
              placeholder="000.000.000-00"
              value={formData.cpf}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50 border font-mono rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                errors.cpf ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.cpf && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.cpf}</span>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Telefone / WhatsApp *</label>
            <input
              type="text"
              name="telefone"
              placeholder="(00) 90000-0000"
              value={formData.telefone}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                errors.telefone ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.telefone && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.telefone}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nº Registro CNH (Categoria B) *</label>
            <div className="relative">
              <input
                type="text"
                name="cnh"
                placeholder="00000000000"
                value={formData.cnh}
                onChange={handleChange}
                className={`w-full pl-3 pr-16 py-2 bg-slate-50 border font-mono rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                  errors.cnh ? 'border-rose-400' : 'border-slate-200'
                }`}
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Cat. B
              </span>
            </div>
            {errors.cnh && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.cnh}</span>}
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Data de Validade da CNH *</label>
            <input
              type="date"
              name="validadeCnh"
              value={formData.validadeCnh}
              onChange={handleChange}
              className={`w-full px-3 py-2 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
                errors.validadeCnh ? 'border-rose-400' : 'border-slate-200'
              }`}
            />
            {errors.validadeCnh && <span className="text-rose-500 text-[11px] mt-0.5 block">{errors.validadeCnh}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="cliente@email.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status Cadastral</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
            >
              <option value="Ativo">Ativo (Apto para locação)</option>
              <option value="Bloqueado">Bloqueado (Restrição)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Endereço Residencial</label>
          <input
            type="text"
            name="endereco"
            placeholder="Rua, número, bairro, cidade - UF"
            value={formData.endereco}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Observações Internas</label>
          <textarea
            name="historicoNotas"
            rows={2}
            placeholder="Anotações internas sobre o motorista..."
            value={formData.historicoNotas}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:outline-none resize-none"
          />
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs transition active:scale-95"
          >
            {driverToEdit ? 'Salvar Alterações' : 'Cadastrar Motorista'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
