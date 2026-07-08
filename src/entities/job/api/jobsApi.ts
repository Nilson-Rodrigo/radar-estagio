import type { Job } from '../model/types';
import type { JobFilters, FilterOptions } from '../model/filters';

// TODO(Eric): substituir este mock pela integração real com Supabase Database.
// Contrato a preservar: as assinaturas de getJobs, getJobById, getJobsByIds e
// getFilterOptions abaixo. Nenhum componente ou hook que consome jobsApi precisa
// ser alterado quando a versão real entrar — só o corpo destas funções muda.
// Ao integrar: getJobs deve traduzir termoBusca para .ilike() em titulo/empresa/
// descricao, e os campos de filters para .eq() (cidade, modalidade, empresa,
// area_atuacao) na tabela jobs (UC03).

const MOCK_JOBS: Job[] = [
  {
    id: '1',
    titulo: 'Estagiário de Desenvolvimento Frontend',
    empresa: 'TechNova Soluções',
    descricao: 'Atuação no desenvolvimento de interfaces web utilizando React e TypeScript, em squad ágil com deploys semanais.',
    cidade: 'Teresina',
    modalidade: 'Híbrido',
    area_atuacao: 'Tecnologia da Informação',
    link: 'https://jobs.example.com/technova/frontend',
  },
  {
    id: '2',
    titulo: 'Estagiário de Marketing Digital',
    empresa: 'Grupo Cerrado Comunicação',
    descricao: 'Apoio na criação de campanhas em redes sociais, análise de métricas e produção de conteúdo para clientes do setor varejista.',
    cidade: 'Piripiri',
    modalidade: 'Presencial',
    area_atuacao: 'Marketing',
    link: 'https://jobs.example.com/cerrado/marketing',
  },
  {
    id: '3',
    titulo: 'Estagiário de Engenharia Civil',
    empresa: 'Construtora Horizonte',
    descricao: 'Suporte técnico em obras residenciais, acompanhamento de cronograma e elaboração de relatórios de obra.',
    cidade: 'São Paulo',
    modalidade: 'Presencial',
    area_atuacao: 'Engenharia Civil',
    link: 'https://jobs.example.com/horizonte/engenharia-civil',
  },
  {
    id: '4',
    titulo: 'Estagiário de Análise de Dados',
    empresa: 'DataFlux Analytics',
    descricao: 'Construção de dashboards e relatórios em Python e SQL para apoiar decisões comerciais de clientes de médio porte.',
    cidade: 'Belo Horizonte',
    modalidade: 'Remoto',
    area_atuacao: 'Tecnologia da Informação',
    link: 'https://jobs.example.com/dataflux/analise-dados',
  },
  {
    id: '5',
    titulo: 'Estagiário de Recursos Humanos',
    empresa: 'Grupo Sertão Alimentos',
    descricao: 'Apoio em processos seletivos, integração de novos colaboradores e organização de treinamentos internos.',
    cidade: 'Teresina',
    modalidade: 'Presencial',
    area_atuacao: 'Recursos Humanos',
    link: 'https://jobs.example.com/sertao/rh',
  },
  {
    id: '6',
    titulo: 'Estagiário de Contabilidade',
    empresa: 'Contmax Assessoria Contábil',
    descricao: 'Lançamentos contábeis, conciliação bancária e apoio na apuração de impostos de clientes do Simples Nacional.',
    cidade: 'Parnaíba',
    modalidade: 'Presencial',
    area_atuacao: 'Contabilidade',
    link: 'https://jobs.example.com/contmax/contabilidade',
  },
  {
    id: '7',
    titulo: 'Estagiário de Design de Produto',
    empresa: 'Estúdio Aurora Design',
    descricao: 'Criação de protótipos de interface, testes de usabilidade e apoio na manutenção do design system de clientes de tecnologia.',
    cidade: 'Brasília',
    modalidade: 'Remoto',
    area_atuacao: 'Design',
    link: 'https://jobs.example.com/aurora/design-produto',
  },
  {
    id: '8',
    titulo: 'Estagiário de Direito',
    empresa: 'Bastos & Medeiros Advogados',
    descricao: 'Apoio na elaboração de peças processuais, acompanhamento de prazos e organização de documentação jurídica.',
    cidade: 'Piripiri',
    modalidade: 'Presencial',
    area_atuacao: 'Jurídico',
    link: 'https://jobs.example.com/bastosmedeiros/direito',
  },
  {
    id: '9',
    titulo: 'Estagiário de Backend',
    empresa: 'TechNova Soluções',
    descricao: 'Desenvolvimento de APIs em Node.js, integração com bancos de dados relacionais e apoio em rotinas de testes automatizados.',
    cidade: 'Recife',
    modalidade: 'Híbrido',
    area_atuacao: 'Tecnologia da Informação',
    link: 'https://jobs.example.com/technova/backend',
  },
  {
    id: '10',
    titulo: 'Estagiário de Enfermagem',
    empresa: 'Hospital Vida Plena',
    descricao: 'Acompanhamento de plantões, apoio em procedimentos básicos de enfermagem e registro de prontuários sob supervisão.',
    cidade: 'Teresina',
    modalidade: 'Presencial',
    area_atuacao: 'Saúde',
    link: 'https://jobs.example.com/vidaplena/enfermagem',
  },
];

function atrasoSimulado<T>(valor: T, ms = 250): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(valor), ms));
}

export async function getJobs(termoBusca?: string, filters?: JobFilters): Promise<Job[]> {
  let resultado = MOCK_JOBS;

  if (termoBusca && termoBusca.trim() !== '') {
    const termo = termoBusca.trim().toLowerCase();
    resultado = resultado.filter(
      (job) =>
        job.titulo.toLowerCase().includes(termo) ||
        job.empresa.toLowerCase().includes(termo) ||
        job.descricao.toLowerCase().includes(termo)
    );
  }

  if (filters?.cidade) {
    resultado = resultado.filter((job) => job.cidade === filters.cidade);
  }
  if (filters?.modalidade) {
    resultado = resultado.filter((job) => job.modalidade === filters.modalidade);
  }
  if (filters?.empresa) {
    resultado = resultado.filter((job) => job.empresa === filters.empresa);
  }
  if (filters?.areaAtuacao) {
    resultado = resultado.filter((job) => job.area_atuacao === filters.areaAtuacao);
  }

  return atrasoSimulado(resultado);
}

export async function getJobById(id: string): Promise<Job | null> {
  const job = MOCK_JOBS.find((j) => j.id === id) ?? null;
  return atrasoSimulado(job);
}

export async function getJobsByIds(ids: string[]): Promise<Job[]> {
  const jobs = MOCK_JOBS.filter((j) => ids.includes(j.id));
  return atrasoSimulado(jobs);
}

export async function getFilterOptions(): Promise<FilterOptions> {
  const cidades = Array.from(new Set(MOCK_JOBS.map((j) => j.cidade))).sort();
  const modalidades = Array.from(new Set(MOCK_JOBS.map((j) => j.modalidade))).sort();
  const empresas = Array.from(new Set(MOCK_JOBS.map((j) => j.empresa))).sort();
  const areasAtuacao = Array.from(new Set(MOCK_JOBS.map((j) => j.area_atuacao))).sort();

  return atrasoSimulado({ cidades, modalidades, empresas, areasAtuacao });
}