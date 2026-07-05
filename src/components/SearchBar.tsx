import React from 'react';

interface SearchBarProps {
  valor: string;
  onChange: (valor: string) => void;
}

/**
 * Barra de busca textual (UC03, fluxo principal). Componente puramente
 * visual — toda a lógica de filtragem fica no hook useJobs.
 */
const SearchBar: React.FC<SearchBarProps> = ({ valor, onChange }) => {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por cargo, empresa ou palavra-chave..."
        className="w-full pl-12 pr-4 py-3 rounded-control bg-white dark:bg-ink-800 border border-slate-200 dark:border-ink-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-radar-500 transition-all duration-200"
      />
    </div>
  );
};

export default SearchBar;
