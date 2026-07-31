import { BaseCollector } from './base';
import type { CollectorResult, Job } from '../../types';
import { fetchHtml, normalizeJob } from './utils';

export class CIEEEstagiosCollector extends BaseCollector {
  async collect(): Promise<CollectorResult> {
    const jobs: Job[] = [];
    const errors: string[] = [];

    try {
      const urls = [
        'https://portal.ciee.org.br/quero-uma-vaga/estagio/',
        'https://portal.ciee.org.br/',
      ];

      for (const url of urls) {
        try {
          const html = await fetchHtml(url);

          const jobBlocks = html.match(/<article[^>]*>[\s\S]*?<\/article>/gi) ||
                           html.match(/<div[^>]*class="[^"]*card[^"]*"[^>]*>[\s\S]*?<\/div>/gi) ||
                           html.match(/<li[^>]*class="[^"]*vaga[^"]*"[^>]*>[\s\S]*?<\/li>/gi) || [];

          for (const block of jobBlocks) {
            const title = this.extractText(block, /<h[234][^>]*>([\s\S]*?)<\/h[234]>/i) ||
                          this.extractText(block, /<a[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/a>/i);
            const company = this.extractText(block, /<span[^>]*class="[^"]*company[^"]*"[^>]*>([\s\S]*?)<\/span>/i);
            const link = this.extractLink(block);
            const description = this.extractDescription(block);
            const location = this.extractLocation(block);

            if (title) {
              jobs.push(
                normalizeJob({
                  titulo: title,
                  empresa: company || 'CIEE',
                  descricao: description || 'Vaga de estágio',
                  cidade: location || '',
                  modalidade: this.detectModality(description + ' ' + title),
                  area_atuacao: '',
                  link,
                  data_expiracao: null,
                })
              );
            }
          }
        } catch (error) {
          errors.push(`CIEE: erro em ${url}: ${(error as Error).message}`);
        }
      }
    } catch (error) {
      errors.push(`CIEE: ${(error as Error).message}`);
    }

    return this.createResult(jobs, errors);
  }

  private extractText(html: string, regex: RegExp): string {
    const match = html.match(regex);
    if (match) {
      return match[1].replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    }
    return '';
  }

  private extractLink(html: string): string {
    const absolute = html.match(/href="(https?:\/\/[^"]+)"/i);
    if (absolute) return absolute[1];
    const relative = html.match(/href="(\/[^"]+)"/i);
    if (relative) return 'https://portal.ciee.org.br' + relative[1];
    return '';
  }

  private extractDescription(html: string): string {
    const clean = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    if (clean.length > 300) {
      return clean.slice(0, 297) + '...';
    }
    return clean || 'Vaga de estágio';
  }

  private extractLocation(html: string): string {
    const match = html.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*-\s*([A-Z]{2})/);
    if (match) return `${match[1]} - ${match[2]}`;
    return '';
  }

  private detectModality(text: string): Job['modalidade'] {
    const lower = text.toLowerCase();
    if (lower.includes('remoto') || lower.includes('remote')) return 'Remoto';
    if (lower.includes('híbrido') || lower.includes('hibrido') || lower.includes('hybrid')) return 'Híbrido';
    return 'Presencial';
  }
}
