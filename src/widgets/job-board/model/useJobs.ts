import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../entities/session/model/useAuth';
import { getJobs, getFilterOptions } from '../../../entities/job/api/jobsApi';
import { getFavoriteJobIds, toggleFavorite } from '../../../entities/favorite/api/favoritesApi';
import type { Job } from '../../../entities/job/model/types';
import type { JobFilters, FilterOptions } from '../../../entities/job/model/filters';

const FILTROS_VAZIOS: JobFilters = {
  cidade: '',
  modalidade: '',
  empresa: '',
  areaAtuacao: '',
};

const OPCOES_VAZIAS: FilterOptions = {
  cidades: [],
  modalidades: [],
  empresas: [],
  areasAtuacao: [],
};

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  erro: string | null;
  termoBusca: string;
  filters: JobFilters;
  favoritosIds: string[];
  opcoesFiltro: FilterOptions;
  setTermoBusca: (valor: string) => void;
  atualizarFiltro: (campo: keyof JobFilters, valor: string) => void;
  limparFiltros: () => void;
  alternarFavorito: (jobId: string) => void;
}

export function useJobs(): UseJobsReturn {
  const { user, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [filters, setFilters] = useState<JobFilters>(FILTROS_VAZIOS);
  const [opcoesFiltro, setOpcoesFiltro] = useState<FilterOptions>(OPCOES_VAZIAS);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);

  // Opções de filtro (cidades, modalidades, empresas, áreas) são carregadas uma única vez
  useEffect(() => {
    getFilterOptions()
      .then(setOpcoesFiltro)
      .catch(() => {
        // Falha aqui não deve travar a tela: os selects de filtro só ficam vazios.
      });
  }, []);

  // Vagas recarregam sempre que a busca textual ou os filtros mudam (UC03)
  useEffect(() => {
    let cancelado = false;
    /* eslint-disable react-hooks/set-state-in-effect -- reset de loading/erro a cada
       nova busca ou filtro (UC03); é o padrão de fetch-em-efeito sem lib externa
       (React Query/SWR), aceito pelo projeto nesta fase mockada. */
    setLoading(true);
    setErro(null);
    /* eslint-enable react-hooks/set-state-in-effect */

    getJobs(termoBusca, filters)
      .then((resultado) => {
        if (!cancelado) setJobs(resultado);
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível carregar as vagas. Tente novamente.');
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });

    return () => {
      cancelado = true;
    };
  }, [termoBusca, filters]);

  // Favoritos do usuário carregam assim que a sessão (mockada) estiver pronta (UC04)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    getFavoriteJobIds(user.id)
      .then(setFavoritosIds)
      .catch(() => {
        // Sem favoritos carregados, os corações simplesmente começam vazios.
      });
  }, [isAuthenticated, user]);

  const atualizarFiltro = useCallback((campo: keyof JobFilters, valor: string) => {
    setFilters((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  const limparFiltros = useCallback(() => {
    setTermoBusca('');
    setFilters(FILTROS_VAZIOS);
  }, []);

  const alternarFavorito = useCallback(
    (jobId: string) => {
      if (!user) return;

      toggleFavorite(user.id, jobId).then((ficouFavoritado) => {
        setFavoritosIds((atual) =>
          ficouFavoritado ? [...atual, jobId] : atual.filter((id) => id !== jobId)
        );
      });
    },
    [user]
  );

  return {
    jobs,
    loading,
    erro,
    termoBusca,
    filters,
    favoritosIds,
    opcoesFiltro,
    setTermoBusca,
    atualizarFiltro,
    limparFiltros,
    alternarFavorito,
  };
}