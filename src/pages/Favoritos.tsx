import React from 'react';
import { useFavoritos } from '../widgets/favorites-list/model/useFavoritos';
import JobCard from '../widgets/job-card/JobCard';

const Favoritos: React.FC = () => {
  const { jobs, loading, removerFavorito } = useFavoritos();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Meus Favoritos
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Vagas de estágio que você salvou como interesse.
        </p>
      </div>

      {loading && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-10">Carregando favoritos...</p>
      )}

      {!loading && jobs.length === 0 && (
        <div className="text-center py-10 text-slate-500 dark:text-slate-400">
          Você ainda não favoritou nenhuma vaga. Vá até a página de Vagas e clique no coração das oportunidades de seu interesse.
        </div>
      )}

      {!loading && jobs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              favoritado={true}
              onToggleFavorito={removerFavorito}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favoritos;