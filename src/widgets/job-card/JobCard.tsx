import React from 'react';
import type { Job } from '../../entities/job/model/types';
import Card from '../../shared/ui/Card';
import Badge from '../../shared/ui/Badge';

interface JobCardProps {
  job: Job;
  favoritado: boolean;
  onToggleFavorito: (jobId: string) => void;
}

const variantePorModalidade: Record<Job['modalidade'], 'success' | 'brand' | 'neutral'> = {
  Remoto: 'success',
  Híbrido: 'brand',
  Presencial: 'neutral',
};

const JobCard: React.FC<JobCardProps> = ({ job, favoritado, onToggleFavorito }) => {
  return (
    <Card hoverable className="p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">{job.titulo}</h3>
          <p className="text-sm font-semibold text-radar-600 dark:text-radar-400">{job.empresa}</p>
        </div>
        <button
          onClick={() => onToggleFavorito(job.id)}
          aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className="shrink-0 w-9 h-9 flex items-center justify-center rounded-full hover:bg-radar-500/10 transition-all duration-200"
        >
          <svg
            className={`w-6 h-6 transition-all duration-200 ${favoritado ? 'fill-radar-500 text-radar-500' : 'fill-none text-slate-400'}`}
            stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 line-clamp-2">{job.descricao}</p>
      <div className="flex flex-wrap items-center gap-2 mt-4">
        <Badge variant="neutral">{job.cidade}</Badge>
        <Badge variant={variantePorModalidade[job.modalidade]}>{job.modalidade}</Badge>
        <Badge variant="neutral">{job.area_atuacao}</Badge>
      </div>
      <a
        href={job.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 text-sm font-semibold text-radar-600 dark:text-radar-400 hover:underline"
      >
        Ver vaga original →
      </a>
    </Card>
  );
};

export default JobCard;