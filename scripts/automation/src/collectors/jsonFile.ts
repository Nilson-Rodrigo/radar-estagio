import { BaseCollector } from './base';
import type { CollectorResult, Job } from '../../types';
import { normalizeJob } from './utils';
import fs from 'fs';

export class JsonFileCollector extends BaseCollector {
  private filePath: string;

  constructor(filePath: string) {
    super('Arquivo JSON');
    this.filePath = filePath;
  }

  async collect(): Promise<CollectorResult> {
    const jobs: Job[] = [];
    const errors: string[] = [];

    try {
      if (!fs.existsSync(this.filePath)) {
        errors.push(`Arquivo não encontrado: ${this.filePath}`);
        return this.createResult(jobs, errors);
      }

      const raw = fs.readFileSync(this.filePath, 'utf-8');
      const data = JSON.parse(raw);

      const items = Array.isArray(data) ? data : data?.jobs || data?.data || data?.results || [];
      if (!Array.isArray(items)) {
        errors.push('Formato JSON não suportado. Esperado array de vagas.');
        return this.createResult(jobs, errors);
      }

      for (const item of items) {
        const job: Job = normalizeJob({
          titulo: item.titulo || item.title || item.name || '',
          empresa: item.empresa || item.company || item.organization || '',
          descricao: item.descricao || item.description || item.summary || '',
          cidade: item.cidade || item.city || item.location || '',
          modalidade: item.modalidade || this.detectModality((item.descricao || item.description || '') + ' ' + (item.titulo || item.title || '')),
          area_atuacao: item.area_atuacao || item.area || item.category || item.department || '',
          link: item.link || item.url || item.apply_url || '',
          data_expiracao: item.data_expiracao || item.expiresAt || item.deadline || null,
        });

        if (job.titulo && job.link) {
          jobs.push(job);
        }
      }
    } catch (error) {
      errors.push(`Erro ao ler arquivo JSON: ${(error as Error).message}`);
    }

    return this.createResult(jobs, errors);
  }

  private detectModality(text: string): Job['modalidade'] {
    const lower = text.toLowerCase();
    if (lower.includes('remoto') || lower.includes('remote')) return 'Remoto';
    if (lower.includes('híbrido') || lower.includes('hibrido') || lower.includes('hybrid')) return 'Híbrido';
    return 'Presencial';
  }
}
