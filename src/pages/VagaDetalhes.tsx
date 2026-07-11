import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJobById } from '../entities/job/api/jobsApi';
import { getFavoriteJobIds, toggleFavorite } from '../entities/favorite/api/favoritesApi';
import { useAuth } from '../entities/session/model/useAuth';
import type { Job } from '../entities/job/model/types';
import Badge from '../shared/ui/Badge';
import RadarIcon from '../shared/ui/RadarIcon';

const variantePorModalidade: Record<Job['modalidade'], 'success' | 'brand' | 'neutral'> = {
  Remoto: 'success',
  Híbrido: 'brand',
  Presencial: 'neutral',
};

const VagaDetalhes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [vaga, setVaga] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getJobById(id)
      .then((data) => setVaga(data))
      .catch(() => setVaga(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!isAuthenticated || !user || !id) return;
    getFavoriteJobIds(user.id)
      .then((ids) => setFavoritado(ids.includes(id)))
      .catch(() => {});
  }, [isAuthenticated, user, id]);

  const alternarFavorito = useCallback(async () => {
    if (!user || !id) return;
    try {
      const ficouFavoritado = await toggleFavorite(user.id, id);
      setFavoritado(ficouFavoritado);
    } catch {
      // silencia — estado já reflete o último valor confirmado
    }
  }, [user, id]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center">
        <p className="text-sm text-slate-500">Carregando vaga...</p>
      </div>
    );
  }

  if (!vaga) {
    return (
      <div className="flex min-h-[calc(100vh-13rem)] items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-slate-600">Vaga não encontrada.</p>
          <Link to="/vagas" className="mt-4 inline-block text-radar-600 hover:underline">
            Voltar para as vagas
          </Link>
        </div>
      </div>
    );
  }

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

          {isAuthenticated && (
            <button
              onClick={alternarFavorito}
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
          )}
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

          {isAuthenticated && (
            <button
              onClick={alternarFavorito}
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
          )}
        </div>
      </div>
    </div>
  );
};

export default VagaDetalhes;
