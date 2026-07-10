import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../widgets/job-board/model/useJobs';
import Badge from '../shared/ui/Badge';
import RadarIcon from '../shared/ui/RadarIcon';

const VagaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { jobs, favoritosIds, alternarFavorito } = useJobs();

  const vaga = jobs.find((job) => job.id === id);

  if (!vaga) {
    return (
      <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Vaga não encontrada</p>
          <Link to="/vagas" className="mt-4 inline-block text-radar-600 hover:underline">
            Voltar para as vagas
          </Link>
        </div>
      </div>
    );
  }

  const favoritado = favoritosIds.includes(vaga.id);

  const variantePorModalidade: Record<'Remoto' | 'Híbrido' | 'Presencial', 'success' | 'brand' | 'neutral'> = {
    Remoto: 'success',
    Híbrido: 'brand',
    Presencial: 'neutral',
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Voltar
      </button>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{vaga.titulo}</h1>
            <p className="text-lg font-semibold text-radar-600">{vaga.empresa}</p>
          </div>
          <button
            onClick={() => alternarFavorito(vaga.id)}
            aria-label={favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full hover:bg-radar-500/10 transition-all duration-200"
          >
            <svg
              className={`w-7 h-7 transition-all duration-200 ${favoritado ? 'fill-radar-500 text-radar-500' : 'fill-none text-slate-400'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="neutral">{vaga.cidade}</Badge>
          <Badge variant={variantePorModalidade[vaga.modalidade]}>{vaga.modalidade}</Badge>
          <Badge variant="neutral">{vaga.area_atuacao}</Badge>
        </div>

        <div className="prose prose-slate max-w-none mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Descrição da vaga</h3>
          <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{vaga.descricao}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200">
          <a
            href={vaga.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-radar-500 text-white font-semibold rounded-xl hover:bg-radar-600 transition-colors"
          >
            <RadarIcon className="w-5 h-5" />
            Acessar vaga original
          </a>
          <button
            onClick={() => alternarFavorito(vaga.id)}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl transition-colors ${
              favoritado
                ? 'bg-danger-100 text-danger-700 hover:bg-danger-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <svg
              className={`w-5 h-5 ${favoritado ? 'fill-danger-500 text-danger-500' : 'fill-none text-slate-500'}`}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {favoritado ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VagaDetalhes;
