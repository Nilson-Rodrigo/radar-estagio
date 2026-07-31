import { BaseCollector } from './base';
import type { CollectorResult, Job } from '../../types';
import { fetchHtml, normalizeJob } from './utils';

interface GitHubSearchItem {
  id: number;
  title: string;
  html_url: string;
  body: string;
  labels: Array<{ name: string; color: string }>;
  created_at: string;
  updated_at: string;
  user: { login: string };
  repository_url: string;
}

export class GitHubSearchIssuesCollector extends BaseCollector {
  private queries: string[];

  constructor(queries?: string[]) {
    super('GitHub Search Issues');
    this.queries = queries || [
      'label:Estágio+state:open+type:issue',
      'label:Trainee+state:open+type:issue',
      'label:Júnior+state:open+type:issue+estagio',
      'label:Est%C3%A1gio+state:open+repo:backend-br/vagas+repo:frontendbr/vagas+repo:react-brasil/vagas+repo:soujava/vagas-java',
    ];
  }

  async collect(): Promise<CollectorResult> {
    const jobs: Job[] = [];
    const errors: string[] = [];

    for (const query of this.queries) {
      try {
        const url = `https://api.github.com/search/issues?q=${query}&per_page=50&sort=created&order=desc`;
        const html = await fetchHtml(url);

        const jsonMatch = html.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          errors.push(`GitHub Search: resposta inválida para "${query}"`);
          continue;
        }

        const data = JSON.parse(jsonMatch[0]) as { items: GitHubSearchItem[] };

        for (const issue of data.items || []) {
          const company = this.extractCompany(issue);
          const description = this.extractDescription(issue);
          const link = this.extractOriginalLink(issue) || issue.html_url;

          if (!this.isInternshipIssue(issue, description)) {
            continue;
          }

          jobs.push(
            normalizeJob({
              titulo: issue.title,
              empresa: company,
              descricao: description,
              cidade: this.extractLocation(description),
              modalidade: this.detectModality(issue.title + ' ' + description + ' ' + issue.labels.map((l) => l.name).join(' ')),
              area_atuacao: this.extractArea(issue.title + ' ' + description),
              link,
              data_expiracao: null,
            })
          );
        }
      } catch (error) {
        errors.push(`GitHub Search: erro em "${query}": ${(error as Error).message}`);
      }
    }

    return this.createResult(jobs, errors);
  }

  private extractCompany(issue: GitHubSearchItem): string {
    const text = `${issue.title} ${issue.body || ''}`;

    const patterns = [
      /@([\w\-]+)/,
      /empresa[:\s]+([^\n]+)/i,
      /company[:\s]+([^\n]+)/i,
      /\[([^\]]+)\]\s*[-–]\s*([^\n]+)/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    return issue.user?.login || 'GitHub';
  }

  private extractDescription(issue: GitHubSearchItem): string {
    const body = issue.body || '';
    const clean = body.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    if (clean.length > 500) {
      return clean.slice(0, 497) + '...';
    }
    return clean || 'Vaga de estágio/trainee';
  }

  private extractOriginalLink(issue: GitHubSearchItem): string {
    const body = issue.body || '';
    const urlMatch = body.match(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i);
    if (urlMatch) {
      const link = urlMatch[0];
      if (!link.includes('github.com')) {
        return link;
      }
    }
    return '';
  }

  private extractLocation(text: string): string {
    const match = text.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s*-\s*([A-Z]{2})/);
    if (match) return `${match[1]} - ${match[2]}`;

    const remoteMatch = text.match(/remoto|home office|remote/i);
    if (remoteMatch) return 'Remoto';

    return '';
  }

  private extractArea(text: string): string {
    const lower = text.toLowerCase();
    const areas: Record<string, string> = {
      backend: 'Backend',
      frontend: 'Frontend',
      fullstack: 'Fullstack',
      mobile: 'Mobile',
      devops: 'DevOps',
      dados: 'Dados',
      data: 'Dados',
      qualidade: 'Qualidade',
      qa: 'Qualidade',
      produto: 'Produto',
      design: 'Design',
      java: 'Java',
      python: 'Python',
      javascript: 'JavaScript',
      react: 'Frontend',
      node: 'Backend',
      php: 'Backend',
    };

    for (const [key, area] of Object.entries(areas)) {
      if (lower.includes(key)) {
        return area;
      }
    }

    return '';
  }

  private isInternshipIssue(issue: GitHubSearchItem, description: string): boolean {
    const title = issue.title.toLowerCase();
    const body = description.toLowerCase();
    const labels = issue.labels.map((l) => l.name.toLowerCase());

    const internshipKeywords = ['estágio', 'estagio', 'internship', 'trainee', 'júnior', 'junior'];

    const hasInternshipKeyword = internshipKeywords.some((kw) => title.includes(kw) || body.includes(kw) || labels.includes(kw));

    const isNotJobPosting = !title.includes('contrata') && !title.includes('vaga') && !title.includes('oportunidade');

    return hasInternshipKeyword && isNotJobPosting;
  }

  private detectModality(text: string): Job['modalidade'] {
    const lower = text.toLowerCase();
    if (lower.includes('remoto') || lower.includes('remote')) return 'Remoto';
    if (lower.includes('híbrido') || lower.includes('hibrido') || lower.includes('hybrid')) return 'Híbrido';
    return 'Presencial';
  }
}
