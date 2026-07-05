import React from 'react';
import type { JobFilters } from '../services/jobs.service';
import type { FilterOptions } from '../services/jobs.service';

interface FiltersProps {
  filters: JobFilters;
  opcoes: FilterOptions;
  onAlterarFiltro: (campo: keyof JobFilters, valor: string) => void;
  onLimparFiltros: () => void;
}

/**
 * Filtros combinados por cidade, modalidade, empresa e área (UC03/RF06).
 * O botão "Limpar Filtros" implementa o Fluxo Alternativo FA01 do UC03.
 */
const Filters: React.FC<FiltersProps> = ({ filters, opcoes, onAlterarFiltro, onLimparFiltros }) => {
  const baseSelect =
    'px-4 py-2 rounded-control bg-white dark:bg-ink-800 border border-slate-200 dark:border-ink-700 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-radar-500 transition-all duration-200';

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select className={baseSelect} value={filters.cidade} onChange={(e) => onAlterarFiltro('cidade', e.target.value)}>
        <option value="">Todas as cidades</option>
        {opcoes.cidades.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={baseSelect} value={filters.modalidade} onChange={(e) => onAlterarFiltro('modalidade', e.target.value)}>
        <option value="">Todas as modalidades</option>
        {opcoes.modalidades.map((m) => <option key={m} value={m}>{m}</option>)}
      </select>
      <select className={baseSelect} value={filters.empresa} onChange={(e) => onAlterarFiltro('empresa', e.target.value)}>
        <option value="">Todas as empresas</option>
        {opcoes.empresas.map((e) => <option key={e} value={e}>{e}</option>)}
      </select>
      <select className={baseSelect} value={filters.areaAtuacao} onChange={(e) => onAlterarFiltro('areaAtuacao', e.target.value)}>
        <option value="">Todas as áreas</option>
        {opcoes.areasAtuacao.map((a) => <option key={a} value={a}>{a}</option>)}
      </select>
      <button
        onClick={onLimparFiltros}
        className="px-4 py-2 rounded-control text-sm font-semibold text-radar-600 dark:text-radar-400 hover:bg-radar-500/10 transition-all duration-200"
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default Filters;
