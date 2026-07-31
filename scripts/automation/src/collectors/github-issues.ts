import { BaseCollector } from './base';
import type { CollectorResult, Job } from '../../types';
import { fetchHtml, normalizeJob } from './utils';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface GitHubIssue {
  id: number;
  title: string;
  body: string;
  html_url: string;
  labels: Array<{ name: string; color: string }>;
  created_at: string;
  updated_at: string;
  user: { login: string };
}

const DEFAULT_REPOSITORIES = [
  'backend-br/vagas',
  'frontendbr/vagas',
  'react-brasil/vagas',
  'soujava/vagas-java',
  'vuejs-br/vagas',
];

const KEYWORDS = ['estágio', 'estagio', 'internship', 'trainee', 'junior', 'remoto'];
const JUNIOR_KEYWORDS = ['junior', 'júnior', 'estágio', 'estagio', 'trainee', 'remoto'];

function matchesLabels(labels: GitHubIssue['labels']): boolean {
  const labelNames = labels.map((l) => l.name.toLowerCase());
  const title = labels.map((l) => l.name).join(' ').toLowerCase();

  const hasJuniorOrInternship =
    JUNIOR_KEYWORDS.some((kw) => labelNames.includes(kw)) ||
    KEYWORDS.some((kw) => title.includes(kw));

  return hasJuniorOrInternship;
}

function extractCompanyFromIssue(issue: GitHubIssue): string {
  const title = issue.title;
  const body = issue.body || '';

  const companyPatterns = [
    /@([\w\-]+)/,
    /\[([^\]]+)\]\s*[-–]\s*([^\n]+)/,
    /empresa[:\s]+([^\n]+)/i,
    /company[:\s]+([^\n]+)/i,
  ];

  for (const pattern of companyPatterns) {
    const match = body.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }

  return issue.user?.login || 'GitHub';
}

export class GitHubIssuesCollector extends BaseCollector {
  private repositories: string[];

  constructor(repositories?: string[]) {
    super('GitHub Issues');
    this.repositories = repositories || DEFAULT_REPOSITORIES;
  }

  async collect(): Promise<CollectorResult> {
    const jobs: Job[] = [];
    const errors: string[] = [];

    for (const repo of this.repositories) {
      try {
        const url = `https://api.github.com/repos/${repo}/issues?state=open&per_page=50&sort=created&direction=desc`;
        const html = await fetchHtml(url);

        const trimmed = html.trim();
        if (!trimmed.startsWith('[')) {
          const snippet = trimmed.slice(0, 200);
          errors.push(`GitHub ${repo}: resposta não é JSON de issues: ${snippet}`);
          continue;
        }

        const issues = JSON.parse(trimmed) as GitHubIssue[];
        if (!Array.isArray(issues)) {
          errors.push(`GitHub ${repo}: resposta JSON não é lista de issues`);
          continue;
        }

        const filteredIssues = issues.filter((issue) => {
          const title = issue.title.toLowerCase();
          const labels = issue.labels.map((l) => l.name.toLowerCase());
          return (
            issue.pull_request === undefined &&
            (KEYWORDS.some((kw) => title.includes(kw)) || matchesLabels(issue.labels))
          );
        });

        for (const issue of filteredIssues) {
          const company = extractCompanyFromIssue(issue);
          const description = this.extractDescription(issue);
          const link = this.extractOriginalLink(issue) || issue.html_url;

          jobs.push(
            normalizeJob({
              titulo: issue.title,
              empresa: company,
              descricao: description,
              cidade: '',
              modalidade: this.detectModality(issue.title + ' ' + (issue.body || '') + ' ' + issue.labels.map((l) => l.name).join(' ')),
              area_atuacao: this.extractArea(issue),
              link,
              data_expiracao: null,
            })
          );
        }
      } catch (error) {
        errors.push(`GitHub ${repo}: ${(error as Error).message}`);
      }

      await delay(300);
    }

    return this.createResult(jobs, errors);
  }

  private extractArea(issue: GitHubIssue): string {
    const text = `${issue.title} ${issue.body || ''}`.toLowerCase();
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
      ux: 'Design',
      ui: 'Design',
      java: 'Java',
      python: 'Python',
      javascript: 'JavaScript',
      react: 'Frontend',
      node: 'Backend',
      php: 'Backend',
      go: 'Backend',
      infra: 'Infraestrutura',
      cloud: 'Cloud',
    };

    for (const [key, area] of Object.entries(areas)) {
      if (text.includes(key)) {
        return area;
      }
    }

    return '';
  }

  private extractDescription(issue: GitHubIssue): string {
    const body = issue.body || '';
    const clean = body.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/\s+/g, ' ').trim();
    if (clean.length > 500) {
      return clean.slice(0, 497) + '...';
    }
    return clean || 'Vaga de estágio/trainee';
  }

  private extractOriginalLink(issue: GitHubIssue): string {
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

  private detectModality(text: string): Job['modalidade'] {
    const lower = text.toLowerCase();
    if (lower.includes('remoto') || lower.includes('remote')) return 'Remoto';
    if (lower.includes('híbrido') || lower.includes('hibrido') || lower.includes('hybrid')) return 'Híbrido';
    return 'Presencial';
  }
}
