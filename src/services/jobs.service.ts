import type { Job } from '../types/Job';

/**
 * VERSÃO PROVISÓRIA — implementação temporária criada pela Ana Rosa
 * para viabilizar o desenvolvimento do módulo de Vagas/Filtros (UC03)
 * e Favoritos (UC04), enquanto o cliente real do Supabase
 * (src/services/supabase.ts, responsabilidade do Eric) ainda não
 * foi integrado ao projeto.
 *
 * As funções abaixo simulam, com um atraso artificial (setTimeout),
 * o comportamento assíncrono de uma consulta real ao banco, e retornam
 * Promises — exatamente como o Supabase retorna. Isso significa que,
 * quando o supabase.ts real existir, o CORPO destas funções será
 * substituído por chamadas .ilike() / .eq() ao Supabase, mas a
 * ASSINATURA (nomes, parâmetros, tipo de retorno) permanece igual,
 * então nenhum componente ou hook que consome este serviço precisa
 * ser alterado.
 *
 * TODO (Eric): substituir o array MOCK_JOBS e o corpo das funções
 * por chamadas reais, por exemplo:
 *   supabase.from('jobs').select('*').ilike('titulo', `%${termo}%`)
 */

// Dados fictícios cobrindo os cenários citados no constitution.md
// (remoto, híbrido, presencial, capital, interior) — usados apenas
// para permitir testar a busca e os filtros localmente.
const MOCK_JOBS: Job[] = [
  {
    id: '1',
    titulo: 'Estágio em Desenvolvimento Front-end',
    empresa: 'TechNova Soluções',
    descricao: 'Atuação com React e Tailwind CSS em projetos internos.',
    cidade: 'Teresina',
    modalidade: 'Remoto',
    area_atuacao: 'Tecnologia da Informação',
    link: 'https://exemplo.com/vaga/1',
    created_at: new Date('2026-05-10').toISOString(),
  },
  {
    id: '2',
    titulo: 'Estágio em Análise de Dados',
    empresa: 'Grupo Piauí Log',
    descricao: 'Apoio na geração de relatórios e dashboards.',
    cidade: 'Parnaíba',
    modalidade: 'Presencial',
    area_atuacao: 'Dados e Business Intelligence',
    link: 'https://exemplo.com/vaga/2',
    created_at: new Date('2026-05-12').toISOString(),
  },
  {
    id: '3',
    titulo: 'Estágio em Suporte Técnico',
    empresa: 'Conecta Piripiri',
    descricao: 'Atendimento e suporte a usuários internos de TI.',
    cidade: 'Piripiri',
    modalidade: 'Híbrido',
    area_atuacao: 'Infraestrutura de TI',
    link: 'https://exemplo.com/vaga/3',
    created_at: new Date('2026-05-14').toISOString(),
  },
  {
    id: '4',
    titulo: 'Estágio em Desenvolvimento Back-end',
    empresa: 'TechNova Soluções',
    descricao: 'Apoio na construção de APIs e integração com bancos de dados.',
    cidade: 'Teresina',
    modalidade: 'Híbrido',
    area_atuacao: 'Tecnologia da Informação',
    link: 'https://exemplo.com/vaga/4',
    created_at: new Date('2026-05-16').toISOString(),
  },
  {
    id: '5',
    titulo: 'Estágio em Design de Produto',
    empresa: 'Estúdio Cerrado',
    descricao: 'Criação de interfaces e protótipos de novos produtos digitais.',
    cidade: 'Picos',
    modalidade: 'Remoto',
    area_atuacao: 'Design e UX',
    link: 'https://exemplo.com/vaga/5',
    created_at: new Date('2026-05-18').toISOString(),
  },
];

// Simula a latência de uma requisição de rede real.
function delay<T>(data: T, ms = 300): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

export interface JobFilters {
  termoBusca?: string;
  cidade?: string;
  modalidade?: string;
  empresa?: string;
  areaAtuacao?: string;
}

/**
 * Busca vagas aplicando pesquisa textual (equivalente ao .ilike() do
 * Supabase, usado no termo de busca) e filtros de correspondência exata
 * (equivalente ao .eq(), usado em cidade/modalidade/empresa/área),
 * conforme descrito no UC03.
 */

export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  const { termoBusca, cidade, modalidade, empresa, areaAtuacao } = filters;

  const resultado = MOCK_JOBS.filter((job) => {
    const termo = termoBusca?.toLowerCase();
    const bateBusca =
      !termo ||
      job.titulo.toLowerCase().includes(termo) ||
      job.empresa.toLowerCase().includes(termo) ||
      job.descricao.toLowerCase().includes(termo);

    const bateCidade = !cidade || job.cidade === cidade;
    const bateModalidade = !modalidade || job.modalidade === modalidade;
    const bateEmpresa = !empresa || job.empresa === empresa;
    const bateArea = !areaAtuacao || job.area_atuacao === areaAtuacao;

    return bateBusca && bateCidade && bateModalidade && bateEmpresa && bateArea;
  });

  return delay(resultado);
}

/**
 * Armazenamento provisório dos favoritos em memória, simulando a tabela
 * `favorites`. Guarda apenas o par (user_id, job_id), exatamente como
 * definido no dicionário de dados (chave composta única).
 *
 * TODO (Eric): substituir por leitura/escrita real na tabela `favorites`
 * do Supabase (.select(), .insert(), .delete()).
 */
const MOCK_FAVORITES: { user_id: string; job_id: string }[] = [];

/** Retorna os ids das vagas favoritadas por um usuário (usado no RF09). */
export async function getFavoriteJobIds(userId: string): Promise<string[]> {
  const ids = MOCK_FAVORITES
    .filter((f) => f.user_id === userId)
    .map((f) => f.job_id);
  return delay(ids);
}

/**
 * Alterna o estado de favorito de uma vaga (UC04 + Fluxo Alternativo FA01):
 * se ainda não existe o par (user_id, job_id), insere; se já existe, remove.
 * Retorna o novo estado (true = favoritado, false = removido).
 */
export async function toggleFavorite(userId: string, jobId: string): Promise<boolean> {
  const indice = MOCK_FAVORITES.findIndex(
    (f) => f.user_id === userId && f.job_id === jobId
  );

  if (indice >= 0) {
    MOCK_FAVORITES.splice(indice, 1);
    return delay(false);
  }

  MOCK_FAVORITES.push({ user_id: userId, job_id: jobId });
  return delay(true);
}

export interface FilterOptions {
  cidades: string[];
  modalidades: string[];
  empresas: string[];
  areasAtuacao: string[];
}

/**
 * Retorna os valores distintos existentes, para popular os <select> de
 * filtro (UC03). Aqui é calculado a partir do MOCK_JOBS; quando o Eric
 * integrar o Supabase, isso deve virar uma consulta com valores distintos
 * reais da tabela `jobs` (ex: .select('cidade').distinct(), ou equivalente).
 */
export async function getFilterOptions(): Promise<FilterOptions> {
  const unico = (valores: string[]) => Array.from(new Set(valores)).sort();

  return delay({
    cidades: unico(MOCK_JOBS.map((j) => j.cidade)),
    modalidades: unico(MOCK_JOBS.map((j) => j.modalidade)),
    empresas: unico(MOCK_JOBS.map((j) => j.empresa)),
    areasAtuacao: unico(MOCK_JOBS.map((j) => j.area_atuacao)),
  });
}

/** Busca os dados completos das vagas a partir de uma lista de ids (RF09). */
export async function getJobsByIds(ids: string[]): Promise<Job[]> {
  const resultado = MOCK_JOBS.filter((job) => ids.includes(job.id));
  return delay(resultado);
}