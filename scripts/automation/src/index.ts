import 'dotenv/config';
import { CIEEEstagiosCollector } from './collectors/ciee';
import { JsonFileCollector } from './collectors/jsonFile';
import { GitHubIssuesCollector } from './collectors/github-issues';
import { GitHubSearchIssuesCollector } from './collectors/github-search-issues';
import { syncJobs } from './services/supabase';
import type { Collector, CollectorResult } from './types';

type BuildCollector = {
  name: string;
  enabled: boolean;
  build: () => Collector | null;
};

const collectors: BuildCollector[] = [
  {
    name: 'CIEE',
    enabled: true,
    build: () => new CIEEEstagiosCollector(),
  },
  {
    name: 'GitHub Issues',
    enabled: true,
    build: () => new GitHubIssuesCollector(),
  },
  {
    name: 'GitHub Search Issues',
    enabled: true,
    build: () => new GitHubSearchIssuesCollector(),
  },
  {
    name: 'Arquivo JSON Local',
    enabled: true,
    build: () => new JsonFileCollector('jobs-feed.json'),
  },
];

async function run(): Promise<void> {
  console.log('🚀 Iniciando automação de vagas...\n');

  const enabledCollectors = collectors.filter((c) => c.enabled);

  if (enabledCollectors.length === 0) {
    console.warn('⚠️ Nenhuma fonte de dados habilitada.');
    process.exit(0);
  }

  console.log(`📡 Fontes habilitadas: ${enabledCollectors.map((c) => c.name).join(', ')}`);

  const results: CollectorResult[] = [];

  for (const collector of enabledCollectors) {
    try {
      const instance = collector.build();
      if (!instance) {
        console.warn(`⚠️ ${collector.name}: colecionador não pôde ser iniciado.`);
        continue;
      }

      console.log(`\n🔍 Coletando vagas em: ${collector.name}...`);
      const result = await instance.collect();

      console.log(`   → ${result.jobs.length} vaga(s) encontrada(s)`);
      if (result.errors?.length) {
        console.warn(`   ⚠️ ${result.errors.length} erro(s):`);
        for (const error of result.errors) {
          console.warn(`     - ${error}`);
        }
      }

      results.push(result);
    } catch (error) {
      console.error(`❌ ${collector.name}: ${(error as Error).message}`);
    }
  }

  const totalJobs = results.reduce((sum, r) => sum + r.jobs.length, 0);
  console.log(`\n📦 Total coletado de todas as fontes: ${totalJobs} vaga(s)`);

  if (totalJobs === 0) {
    console.log('ℹ️ Nenhuma vaga para sincronizar.');
    process.exit(0);
  }

  console.log('\n🔄 Sincronizando com o Supabase...');
  const stats = await syncJobs(results);

  console.log('\n📊 Resultado da sincronização:');
  console.log(`   - Vagas na fonte:      ${stats.totalFonte}`);
  console.log(`   - Vagas no banco:      ${stats.totalBanco}`);
  console.log(`   - Inseridas:           ${stats.inseridos}`);
  console.log(`   - Atualizadas:         ${stats.atualizados}`);
  console.log(`   - Removidas:           ${stats.removidos}`);
  console.log(`   - Erros:               ${stats.erros}`);

  if (stats.erros > 0) {
    console.log('\n❌ Automação concluída com erros.');
    process.exit(1);
  }

  console.log('\n✅ Automação concluída com sucesso!');
}

run().catch((error) => {
  console.error('❌ Erro fatal na automação:', error);
  process.exit(1);
});
