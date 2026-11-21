import React from 'react';

export function Badge({ children, variant = 'default', size = 'md' }) {
  const styles = {
    // Status de Veículos
    Disponível: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Alugado: 'bg-blue-50 text-blue-700 border-blue-200',
    'Em Manutenção': 'bg-amber-50 text-amber-700 border-amber-200',
    'Em Vistoria': 'bg-purple-50 text-purple-700 border-purple-200',
    Inativo: 'bg-slate-100 text-slate-600 border-slate-200',

    // Status de Locações
    Ativa: 'bg-blue-50 text-blue-700 border-blue-200',
    Agendada: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Concluída: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Atrasada: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse',
    Cancelada: 'bg-slate-100 text-slate-500 border-slate-200',

    // Status de Motoristas
    Ativo: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Bloqueado: 'bg-rose-50 text-rose-700 border-rose-200',

    // Vistorias
    Aprovado: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Aprovado com Ressalvas': 'bg-amber-50 text-amber-700 border-amber-200',
    Reprovado: 'bg-rose-50 text-rose-700 border-rose-200',

    // Tipos de Vistoria
    Saída: 'bg-sky-50 text-sky-700 border-sky-200',
    Devolução: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Periódica: 'bg-teal-50 text-teal-700 border-teal-200',

    // Variants genéricos
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const currentStyle = styles[variant] || styles.default;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border ${sizeClasses} ${currentStyle}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
      {children || variant}
    </span>
  );
}
