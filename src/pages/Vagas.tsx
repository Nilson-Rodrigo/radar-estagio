import React from 'react';
import { useJobs } from '../widgets/job-board/model/useJobs';
import SearchBar from '../features/job-search/ui/SearchBar';
import Filters from '../features/job-filter/ui/Filters';
import JobCard from '../widgets/job-card/JobCard';

const Vagas: React.FC = () => {
  const {
    jobs, loading, erro, termoBusca, filters, favoritosIds,
    opcoesFiltro, setTermoBusca, atualizarFiltro, limparFiltros, alternarFavorito,
  } = useJobs();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Vagas de Estágio
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Mural Principal de Oportunidades de Estágio.
        </p>
      </div>

      <SearchBar valor={termoBusca} onChange={setTermoBusca} />
      <Filters filters={filters} opcoes={opcoesFiltro} onAlterarFiltro={atualizarFiltro} onLimparFiltros={limparFiltros} />

      {loading && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-10">Carregando vagas...</p>
      )}

      {erro && (
        <p className="text-center text-danger-600 py-10">{erro}</p>
      )}

      {!loading && !erro && jobs.length === 0 && (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          Nenhuma vaga corresponde aos critérios selecionados. Modifique os termos ou limpe os filtros.
        </div>
      )}

      {!loading && !erro && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              favoritado={favoritosIds.includes(job.id)}
              onToggleFavorito={alternarFavorito}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Vagas;