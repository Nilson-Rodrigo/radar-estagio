import https from 'https';
import http from 'http';
import { URL } from 'url';
import type { Job } from '../../types';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function getGitHubAuthHeader(): Record<string, string> | undefined {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) return undefined;
  return { Authorization: `Bearer ${token}` };
}

function buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'User-Agent': USER_AGENT,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    ...customHeaders,
  };

  const githubAuth = getGitHubAuthHeader();
  if (githubAuth) {
    Object.assign(headers, githubAuth);
  }

  return headers;
}

export async function fetchHtml(url: string): Promise<string> {
  const client = url.startsWith('https') ? https : http;

  return new Promise((resolve, reject) => {
    const request = client.get(url, { headers: buildHeaders() }, (response) => {
      const chunks: Buffer[] = [];

      response.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer.toString('utf8'));
      });

      response.on('error', reject);
    });

    request.on('error', reject);
  });
}

export async function fetchHtmlWithFetch(url: string, customHeaders: Record<string, string> = {}): Promise<string> {
  const headers: Record<string, string> = {
    'User-Agent': USER_AGENT,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en;q=0.8',
    Connection: 'keep-alive',
    'Upgrade-Insecure-Requests': '1',
    ...customHeaders,
  };

  const githubAuth = getGitHubAuthHeader();
  if (githubAuth) {
    Object.assign(headers, githubAuth);
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return await response.text();
}

export function extractText(html: string, selector: string): string {
  const regex = new RegExp(selector, 'i');
  const match = html.match(regex);
  return match ? match[1]?.trim() || match[0].trim() || '' : '';
}

export function sanitizeText(text: string): string {
  return text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#\d+;/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeJob(job: Partial<Job> & { link: string }): Job {
  return {
    titulo: truncate(sanitizeText(job.titulo || ''), 255),
    empresa: truncate(sanitizeText(job.empresa || ''), 255),
    descricao: sanitizeText(job.descricao || ''),
    cidade: truncate(sanitizeText(job.cidade || ''), 100),
    modalidade: job.modalidade || 'Presencial',
    area_atuacao: truncate(sanitizeText(job.area_atuacao || ''), 100),
    link: job.link.trim(),
    data_expiracao: job.data_expiracao || null,
  };
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3).trim() + '...';
}
