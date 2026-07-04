import { useState, useEffect, useCallback } from 'react';
import type { Job } from '../types/Job';
import { getFavoriteJobIds, getJobsByIds, toggleFavorite } from '../services/jobs.service';
import { useAuth } from './useAuth';

interface UseFavoritosReturn {
  jobs: Job[];
  loading: boolean;
  removerFavorito: (jobId: string) => Promise<void>;
}

/**
 * Custom Hook responsável por carregar e gerenciar a lista de vagas
 * favoritadas pelo usuário logado (RF09 - Listar Favoritos), reutilizando
 * o mesmo serviço de dados (jobs.service.ts) usado em useJobs.ts.
 */
export function useFavoritos(): UseFavoritosReturn {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarFavoritos = useCallback(async () => {
    if (!user) {
      setJobs([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ids = await getFavoriteJobIds(user.id);
    const vagasFavoritas = await getJobsByIds(ids);
    setJobs(vagasFavoritas);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    carregarFavoritos();
  }, [carregarFavoritos]);

  // Remove dos favoritos (reaproveita o toggle: como a vaga já está
  // favoritada, o mesmo toggleFavorite executa a remoção - UC04, FA01).
  const removerFavorito = useCallback(
    async (jobId: string) => {
      if (!user) return;
      await toggleFavorite(user.id, jobId);
      setJobs((atual) => atual.filter((job) => job.id !== jobId));
    },
    [user]
  );

  return { jobs, loading, removerFavorito };
}