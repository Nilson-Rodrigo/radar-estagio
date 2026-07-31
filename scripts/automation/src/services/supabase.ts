import { createClient } from '@supabase/supabase-js';
import type { Job, CollectorResult, SyncStats } from '../types/job';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios nas variáveis de ambiente.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
  },
});

export async function fetchExistingJobs(): Promise<Job[]> {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('id, titulo, empresa, descricao, cidade, modalidade, area_atuacao, link, data_expiracao')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Falha ao buscar vagas existentes: ${error.message} | code: ${error.code} | details: ${error.details} | hint: ${error.hint}`);
    }

    return (data ?? []) as Job[];
  } catch (error) {
    console.error('Erro detalhado ao buscar vagas:', error);
    throw error;
  }
}

export async function insertJobs(jobs: Job[]): Promise<number> {
  if (jobs.length === 0) return 0;

  const { error } = await supabase.from('jobs').insert(
    jobs.map((job) => ({
      titulo: job.titulo,
      empresa: job.empresa,
      descricao: job.descricao,
      cidade: job.cidade,
      modalidade: job.modalidade,
      area_atuacao: job.area_atuacao,
      link: job.link,
      data_expiracao: job.data_expiracao,
    }))
  );

  if (error) {
    console.error('Erro ao inserir vagas:', error.message);
    return 0;
  }

  return jobs.length;
}

export async function updateJobs(jobs: Job[]): Promise<number> {
  if (jobs.length === 0) return 0;

  let updated = 0;

  for (const job of jobs) {
    if (!job.id) continue;

    const { error } = await supabase
      .from('jobs')
      .update({
        titulo: job.titulo,
        empresa: job.empresa,
        descricao: job.descricao,
        cidade: job.cidade,
        modalidade: job.modalidade,
        area_atuacao: job.area_atuacao,
        link: job.link,
        data_expiracao: job.data_expiracao,
      })
      .eq('id', job.id);

    if (!error) {
      updated += 1;
    } else {
      console.error(`Erro ao atualizar vaga ${job.id}:`, error.message);
    }
  }

  return updated;
}

export async function deleteJobs(ids: string[]): Promise<number> {
  if (ids.length === 0) return 0;

  const { error } = await supabase
    .from('jobs')
    .delete()
    .in('id', ids);

  if (error) {
    console.error('Erro ao remover vagas:', error.message);
    return 0;
  }

  return ids.length;
}

export async function syncJobs(results: CollectorResult[]): Promise<SyncStats> {
  const stats: SyncStats = {
    totalFonte: 0,
    totalBanco: 0,
    inseridos: 0,
    atualizados: 0,
    removidos: 0,
    erros: 0,
  };

  stats.totalFonte = results.reduce((sum, r) => sum + r.jobs.length, 0);

  const existing = await fetchExistingJobs();
  stats.totalBanco = existing.length;

  const existingByLink = new Map<string, Job>();
  for (const job of existing) {
    if (job.link) {
      existingByLink.set(job.link.trim().toLowerCase(), job);
    }
  }

  const sourceLinks = new Set<string>();
  const toInsert: Job[] = [];
  const toUpdate: Job[] = [];
  const toDelete: string[] = [];

  for (const result of results) {
    for (const job of result.jobs) {
      const normalizedLink = job.link.trim().toLowerCase();

      if (!normalizedLink) {
        stats.erros += 1;
        continue;
      }

      sourceLinks.add(normalizedLink);

      const existingJob = existingByLink.get(normalizedLink);
      if (!existingJob) {
        toInsert.push(job);
      } else {
        const changed =
          existingJob.titulo !== job.titulo ||
          existingJob.empresa !== job.empresa ||
          existingJob.descricao !== job.descricao ||
          existingJob.cidade !== job.cidade ||
          existingJob.modalidade !== job.modalidade ||
          existingJob.area_atuacao !== job.area_atuacao ||
          existingJob.data_expiracao !== job.data_expiracao;

        if (changed) {
          toUpdate.push({ ...job, id: existingJob.id });
        }
      }
    }
  }

  for (const [link, job] of existingByLink) {
    if (!sourceLinks.has(link)) {
      toDelete.push(job.id);
    }
  }

  if (toInsert.length > 0) {
    stats.inseridos = await insertJobs(toInsert);
  }

  if (toUpdate.length > 0) {
    stats.atualizados = await updateJobs(toUpdate);
  }

  if (toDelete.length > 0) {
    stats.removidos = await deleteJobs(toDelete);
  }

  return stats;
}
