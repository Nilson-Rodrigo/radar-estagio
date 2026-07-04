import React from 'react';
import type { Job } from '../types/Job';

interface JobCardProps {
  job: Job;
  favoritado: boolean;
  onToggleFavorito: (jobId: string) => void;
}

const corModalidade: Record<Job['modalidade'], string> = {
  Remoto: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  Híbrido: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Presencial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

/** Cartão individual de vaga (RF07 - Visualização de Detalhes / UC04 - Favoritar). */
const JobCard: React.FC<JobCardProps> = ({ job, favoritado, onToggleFavorito }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-2xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.titulo}</h3>
          <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">{job.empresa}</p>
        </div>

        <button
          onClick={() => onToggleFavorito(job.id)}
          aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200"
        >
          <svg
            className={`w-6 h-6 transition-all duration-200 ${favoritado ? 'fill-pink-600 text-pink-600' : 'fill-none text-slate-400'}`}
            stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">{job.descricao}</p>

      <div className="flex flex-wrap items-center gap-2 mt-4">
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {job.cidade}
        </span>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${corModalidade[job.modalidade]}`}>
          {job.modalidade}
        </span>
        <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {job.area_atuacao}
        </span>
      </div>

      <a href={job.link} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">
        Ver vaga original →
      </a>
    </div>
  );
};

export default JobCard;