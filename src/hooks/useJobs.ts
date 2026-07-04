import { useState, useEffect, useCallback } from 'react';
import type { Job } from '../types/Job';
import {
  getJobs,
  getFavoriteJobIds,
  toggleFavorite,
  getFilterOptions,
  type JobFilters,
  type FilterOptions,
} from '../services/jobs.service';
import { useAuth } from './useAuth';

interface UseJobsReturn {
  jobs: Job[];
  loading: boolean;
  erro: string | null;
  filters: JobFilters;
  favoritosIds: string[];
  atualizarFiltro: (campo: keyof JobFilters, valor: string) => void;
  limparFiltros: () => void;
  alternarFavorito: (jobId: string) => Promise<void>;
  opcoesFiltro: FilterOptions;
}

const FILTROS_VAZIOS: JobFilters = {
  termoBusca: '',
  cidade: '',
  modalidade: '',
  empresa: '',
  areaAtuacao: '',
};

/**
 * Custom Hook responsável por isolar toda a regra de negócio de busca,
 * filtragem (UC03) e favoritar/desfavoritar vagas (UC04), mantendo os
 * componentes visuais (Vagas.tsx, SearchBar.tsx, Filters.tsx, JobCard.tsx)
 * livres de lógica de acesso a dados — conforme exigido no constitution.md
 * ("Nenhuma lógica de negócio direto em componente de página").
 */
export function useJobs(): UseJobsReturn {
  const { user } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(FILTROS_VAZIOS);
  const [favoritosIds, setFavoritosIds] = useState<string[]>([]);
  const [opcoesFiltro, setOpcoesFiltro] = useState<FilterOptions>({
    cidades: [], modalidades: [], empresas: [], areasAtuacao: [],
  });

  useEffect(() => {
    getFilterOptions().then(setOpcoesFiltro);
  }, []);
  // Busca as vagas sempre que algum filtro muda (UC03, fluxo principal).
  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      setLoading(true);
      setErro(null);
      try {
        const resultado = await getJobs(filters);
        if (!cancelado) setJobs(resultado);
      } catch {
        if (!cancelado) {
          // Equivalente ao FE02 do UC03 (falha na consulta/sessão expirada).
          setErro('Não foi possível carregar as vagas. Tente novamente.');
        }
      } finally {
        if (!cancelado) setLoading(false);
      }
    }

    buscar();
    return () => {
      cancelado = true;
    };
  }, [filters]);

  // Carrega os favoritos do usuário logado assim que ele estiver disponível.
  useEffect(() => {
    if (!user) return;
    getFavoriteJobIds(user.id).then(setFavoritosIds);
  }, [user]);

  const atualizarFiltro = useCallback((campo: keyof JobFilters, valor: string) => {
    setFilters((atual) => ({ ...atual, [campo]: valor }));
  }, []);

  // FA01 do UC03: "Limpeza Global de Filtros".
  const limparFiltros = useCallback(() => {
    setFilters(FILTROS_VAZIOS);
  }, []);

  // UC04: alterna favorito e atualiza a lista local sem precisar recarregar tudo.
  const alternarFavorito = useCallback(
    async (jobId: string) => {
      if (!user) return;
      const favoritado = await toggleFavorite(user.id, jobId);
      setFavoritosIds((atual) =>
        favoritado ? [...atual, jobId] : atual.filter((id) => id !== jobId)
      );
    },
    [user]
  );

  return {
    jobs,
    loading,
    erro,
    filters,
    favoritosIds,
    atualizarFiltro,
    limparFiltros,
    alternarFavorito,
    opcoesFiltro
  };
}