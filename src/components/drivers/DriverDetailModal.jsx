import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  FileText
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export function DriverDetailModal({ driver, isOpen, onClose }) {
  const { getContractsForDriver, getVehicleById } = useApp();

  if (!driver) return null;

  const driverContracts = getContractsForDriver(driver.id);

  const validade = new Date(driver.validadeCnh);
  const hoje = new Date();
  const diffDays = Math.ceil((validade - hoje) / (1000 * 60 * 60 * 24));
  const isExpired = diffDays < 0;
  const isExpiringSoon = diffDays >= 0 && diffDays <= 30;

  const formatMoney = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={driver.nome}
      subtitle={`CPF: ${driver.cpf} • CNH: ${driver.cnh} (Categoria B)`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-xs">
        {/* Top Info Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-500">Status Cadastral:</span>
              <Badge variant={driver.status} />
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{driver.telefone}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{driver.email || 'Não informado'}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-700">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{driver.endereco || 'Endereço não cadastrado'}</span>
            </div>
          </div>

          <div className="space-y-2 border-t md:border-t-0 md:border-l border-slate-200 md:pl-4 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-500">Habilitação:</span>
              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                isExpired
                  ? 'bg-rose-100 text-rose-800'
                  : isExpiringSoon
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isExpired ? 'CNH VENCIDA' : isExpiringSoon ? `VENCE EM ${diffDays} DIAS` : 'CNH VÁLIDA'}
              </span>
            </div>

            <div className="text-slate-800 font-medium">
              Vencimento: {new Date(driver.validadeCnh).toLocaleDateString('pt-BR')} (Cat. B)
            </div>

            <div className="pt-2">
              <span className="text-slate-400 block mb-0.5">Observações Internas:</span>
              <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-200">
                {driver.historicoNotas || 'Sem anotações cadastradas.'}
              </p>
            </div>
          </div>
        </div>

        {/* Histórico de Contratos do Motorista */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-700" />
            <span>Contratos Mensais deste Motorista ({driverContracts.length})</span>
          </h4>

          {driverContracts.length === 0 ? (
            <div className="p-6 text-center text-slate-500 border border-dashed rounded-xl">
              Nenhum contrato de locação mensal vinculado a este motorista ainda.
            </div>
          ) : (
            <div className="space-y-2">
              {driverContracts.map(ctr => {
                const vehicle = getVehicleById(ctr.veiculoId);
                return (
                  <div 
                    key={ctr.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{ctr.numeroContrato}</span>
                        <Badge variant={ctr.status} size="sm" />
                      </div>
                      <div className="text-slate-700 font-semibold mt-1">
                        {vehicle?.marca} {vehicle?.modelo} ({vehicle?.placa})
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Início: {new Date(ctr.dataInicio).toLocaleDateString('pt-BR')} • 
                        {ctr.dataEncerramento ? ` Encerrado em: ${new Date(ctr.dataEncerramento).toLocaleDateString('pt-BR')}` : ` Vigência: ${ctr.mesesVigencia || 1} mês(es)`}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-blue-700 text-sm">
                        {formatMoney(ctr.valorMensal)}/mês
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Vencimento todo dia {ctr.diaVencimento || '10'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}
