import { supabase } from '../../../shared/lib/supabase';
import type { Job } from '../model/types';
import type { JobFilters, FilterOptions } from '../model/filters';

// Integração real com o Supabase Database (tabela `jobs`) — UC03.
// As assinaturas abaixo (getJobs, getJobById, getJobsByIds, getFilterOptions)
// são idênticas às da versão mock da Ana Rosa; nenhum hook/componente que
// consome jobsApi precisa mudar. termoBusca vira .ilike() em titulo/empresa/
// descricao e os campos de filters viram .eq() (cidade, modalidade, empresa,
// area_atuacao).

// Remove caracteres que quebrariam a sintaxe do operador .or() do PostgREST.
function sanitizarTermo(termo: string): string {
  return termo.replace(/[,()%*]/g, ' ').replace(/\s+/g, ' ').trim();
}

export async function getJobs(termoBusca?: string, filters?: JobFilters): Promise<Job[]> {
  let query = supabase.from('jobs').select('*');

  if (termoBusca && termoBusca.trim() !== '') {
    const termo = sanitizarTermo(termoBusca);
    if (termo) {
      query = query.or(
        `titulo.ilike.%${termo}%,empresa.ilike.%${termo}%,descricao.ilike.%${termo}%`
      );
    }
  }

  if (filters?.cidade) query = query.eq('cidade', filters.cidade);
  if (filters?.modalidade) query = query.eq('modalidade', filters.modalidade);
  if (filters?.empresa) query = query.eq('empresa', filters.empresa);
  if (filters?.areaAtuacao) query = query.eq('area_atuacao', filters.areaAtuacao);

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Falha ao buscar vagas: ${error.message}`);
  }

  return (data ?? []) as Job[];
}

export async function getJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    throw new Error(`Falha ao buscar a vaga: ${error.message}`);
  }

  return (data as Job | null) ?? null;
}

export async function getJobsByIds(ids: string[]): Promise<Job[]> {
  if (ids.length === 0) {
    return [];
  }

  const { data, error } = await supabase.from('jobs').select('*').in('id', ids);

  if (error) {
    throw new Error(`Falha ao buscar as vagas favoritadas: ${error.message}`);
  }

  return (data ?? []) as Job[];
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const { data, error } = await supabase
    .from('jobs')
    .select('cidade, modalidade, empresa, area_atuacao');

  if (error) {
    throw new Error(`Falha ao carregar as opções de filtro: ${error.message}`);
  }

  type LinhaFiltro = Pick<Job, 'cidade' | 'modalidade' | 'empresa' | 'area_atuacao'>;
  const linhas = (data ?? []) as LinhaFiltro[];

  const distintos = (valores: (string | null | undefined)[]): string[] =>
    Array.from(new Set(valores.filter((v): v is string => !!v))).sort((a, b) =>
      a.localeCompare(b, 'pt-BR')
    );

  return {
    cidades: distintos(linhas.map((l) => l.cidade)),
    modalidades: distintos(linhas.map((l) => l.modalidade)),
    empresas: distintos(linhas.map((l) => l.empresa)),
    areasAtuacao: distintos(linhas.map((l) => l.area_atuacao)),
  };
}
