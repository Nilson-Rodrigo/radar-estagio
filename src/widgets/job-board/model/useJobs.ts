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
  buscaRealizada: boolean;
}

export function useJobs(): UseJobsReturn {
  const { user, isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [termoBusca, setTermoBuscaState] = useState('');
  const [filters, setFilters] = useState<JobFilters>(FILTROS_VAZIOS);
  const [opcoesFiltro, setOpcoesFiltro] = useState<FilterOptions>(OPCOES_VAZIAS);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);

  // Opções de filtro (cidades, modalidades, empresas, áreas) são carregadas uma única vez
  useEffect(() => {
    getFilterOptions()
      .then(setOpcoesFiltro)
      .catch(() => {
        // Falha aqui não deve travar a tela: os selects de filtro só ficam vazios.
      });
  }, []);

  // Vagas recarregam somente após o usuário iniciar uma busca ou aplicar filtros
  useEffect(() => {
    if (!buscaRealizada) return;

    let cancelado = false;
    setLoading(true);
    setErro(null);

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
  }, [termoBusca, filters, buscaRealizada]);

  // Favoritos do usuário carregam assim que a sessão (mockada) estiver pronta (UC04)
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setFavoritosIds([]);
      return;
    }

    getFavoriteJobIds(user.id)
      .then(setFavoritosIds)
      .catch(() => {
        // Sem favoritos carregados, os corações simplesmente começam vazios.
      });
  }, [isAuthenticated, user]);

  const setTermoBusca = useCallback((valor: string) => {
    setBuscaRealizada(true);
    setTermoBuscaState(valor);
  }, []);

  const atualizarFiltro = useCallback((campo: keyof JobFilters, valor: string) => {
    setBuscaRealizada(true);
    setFilters((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  const limparFiltros = useCallback(() => {
    setBuscaRealizada(true);
    setTermoBuscaState('');
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
    buscaRealizada,
  };
}