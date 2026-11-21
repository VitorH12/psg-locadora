import React from 'react';
import { 
  Printer, 
  Car, 
  CheckCircle2, 
  X,
  FileCheck2
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { useApp } from '../../context/AppContext';

export function InspectionReportModal({ inspection, isOpen, onClose }) {
  const { getVehicleById, getContractById, getDriverById } = useApp();

  if (!isOpen || !inspection) return null;

  const vehicle = getVehicleById(inspection.veiculoId);
  const contract = inspection.locacaoId ? getContractById(inspection.locacaoId) : null;
  const driver = contract ? getDriverById(contract.motoristaId) : null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity no-print"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div 
          className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full max-w-4xl border border-slate-200 flex flex-col my-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Action Bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white no-print">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <span className="font-bold text-sm">Laudo Técnico de Vistoria Veicular PSG</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition active:scale-95"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Salvar PDF</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Document Body */}
          <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-laudo">
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-900 flex items-center justify-center text-white font-black text-sm">
                    PSG
                  </div>
                  <span className="text-xl font-black text-slate-900 tracking-tight">
                    SISTEMA DE GERENCIAMENTO DE LOCAÇÃO DE VEÍCULOS PSG
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Laudo Oficial de Vistoria de Entrega e Devolução de Veículos • PSG Locações
                </p>
              </div>

              <div className="text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">
                  LAUDO Nº
                </span>
                <span className="text-lg font-black font-mono text-slate-900">{inspection.codigo}</span>
                <div className="text-xs text-slate-500">
                  Data: {new Date(inspection.dataHora).toLocaleString('pt-BR')}
                </div>
              </div>
            </div>

            {/* Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 uppercase font-bold block">Finalidade</span>
                <span className="text-base font-extrabold text-slate-900">
                  VISTORIA DE {inspection.tipo.toUpperCase()}
                  {contract && ` (Contrato Mensal: ${contract.numeroContrato})`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Parecer:</span>
                <Badge variant={inspection.resultado} />
              </div>
            </div>

            {/* Vehicle Specs & Driver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5 flex items-center justify-between">
                  <span>Dados do Veículo</span>
                  <span className="font-mono font-bold text-slate-900">{vehicle?.placa}</span>
                </h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Marca / Modelo:</span>
                    <strong className="text-slate-900">{vehicle?.marca} {vehicle?.modelo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Categoria / Ano:</span>
                    <strong>{vehicle?.categoria} • {vehicle?.ano}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Odômetro:</span>
                    <strong className="text-slate-900">{inspection.odometro?.toLocaleString('pt-BR')} km</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Combustível:</span>
                    <strong className="text-slate-900">{inspection.nivelCombustivel}</strong>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] border-b border-slate-100 pb-1.5">
                  Partes Responsáveis
                </h4>
                <div className="space-y-1.5 text-slate-700">
                  <div>
                    <span className="text-slate-400 block">Vistoriador PSG:</span>
                    <strong className="text-slate-900">{inspection.vistoriador}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Motorista Titular (CNH B):</span>
                    <strong className="text-slate-900">{driver?.nome || inspection.assinaturaCliente || 'Locatário'}</strong>
                    {driver?.cpf && <span className="text-slate-500"> (CPF: {driver.cpf})</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                Conferência de Checklist Operacional
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {inspection.checklist && Object.entries(inspection.checklist).map(([key, val]) => {
                  const labels = {
                    lataria: 'Lataria Geral',
                    pintura: 'Pintura & Verniz',
                    pneus: 'Pneus / Rodas',
                    estepe: 'Estepe',
                    vidros: 'Vidros / Para-brisa',
                    farois: 'Faróis & Lanternas',
                    arCondicionado: 'Ar-condicionado',
                    painelEletrica: 'Painel & Elétrica',
                    limpezaInterna: 'Limpeza Interna',
                    limpezaExterna: 'Lavagem Externa',
                    kitSeguranca: 'Triângulo / Macaco',
                    documentos: 'Documento (CRLV)'
                  };

                  return (
                    <div key={key} className="p-2 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between">
                      <span className="text-slate-600 font-medium text-[11px]">{labels[key] || key}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        val === 'Conforme'
                          ? 'bg-emerald-100 text-emerald-800'
                          : val === 'Com ressalva'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {val}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Avarias */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 pb-1">
                Mapeamento de Avarias e Não Conformidades
              </h4>
              {inspection.avarias && inspection.avarias.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 font-bold text-slate-600 border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Localização</th>
                        <th className="p-2.5">Tipo</th>
                        <th className="p-2.5">Gravidade</th>
                        <th className="p-2.5">Descrição Técnica</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {inspection.avarias.map((av, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-900">{av.local}</td>
                          <td className="p-2.5 text-slate-700">{av.tipo}</td>
                          <td className="p-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {av.gravidade}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{av.observacao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Nenhuma avaria estética ou mecânica identificada nesta vistoria.</span>
                </div>
              )}
            </div>

            {/* Parecer */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Parecer Conclusivo:</span>
              <p className="text-slate-700 italic">
                {inspection.parecerGeral || 'Veículo inspecionado e liberado para circulação em condições normais.'}
              </p>
            </div>

            {/* Assinaturas */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-12 text-center text-xs">
              <div>
                <div className="border-b border-slate-400 mb-2 h-10 flex items-end justify-center font-serif italic text-slate-700">
                  {inspection.assinaturaVistoriador || inspection.vistoriador}
                </div>
                <span className="font-bold text-slate-900 block">Vistoriador PSG</span>
                <span className="text-slate-400 text-[10px]">Controle Operacional</span>
              </div>

              <div>
                <div className="border-b border-slate-400 mb-2 h-10 flex items-end justify-center font-serif italic text-slate-700">
                  {inspection.assinaturaCliente || driver?.nome || 'Assinatura do Locatário'}
                </div>
                <span className="font-bold text-slate-900 block">Locatário / Condutor (CNH B)</span>
                <span className="text-slate-400 text-[10px]">De acordo com as condições apontadas</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end no-print">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
