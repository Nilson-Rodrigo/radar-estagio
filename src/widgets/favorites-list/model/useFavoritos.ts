import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../entities/session/model/useAuth';
import { getJobsByIds } from '../../../entities/job/api/jobsApi';
import { getFavoriteJobIds, toggleFavorite } from '../../../entities/favorite/api/favoritesApi';
import type { Job } from '../../../entities/job/model/types';

interface UseFavoritosReturn {
  jobs: Job[];
  loading: boolean;
  removerFavorito: (jobId: string) => void;
}

export function useFavoritos(): UseFavoritosReturn {
  const { user, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarFavoritos = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const ids = await getFavoriteJobIds(user.id);
      const favoritados = await getJobsByIds(ids);
      setJobs(favoritados);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;
    carregarFavoritos();
  }, [isAuthenticated, user, carregarFavoritos]);

  const removerFavorito = useCallback(
    (jobId: string) => {
      if (!user) return;

      toggleFavorite(user.id, jobId).then(() => {
        // Remove imediatamente da tela (RF09) — a tela de Favoritos nunca deve
        // mostrar de volta uma vaga que acabou de ser removida.
        setJobs((atual) => atual.filter((job) => job.id !== jobId));
      });
    },
    [user]
  );

  return { jobs, loading, removerFavorito };
}