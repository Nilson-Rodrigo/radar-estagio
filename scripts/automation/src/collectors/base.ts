import type { Collector, CollectorResult, Job } from '../types';

export class BaseCollector implements Collector {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async collect(): Promise<CollectorResult> {
    throw new Error('Método collect() não implementado.');
  }

  protected createResult(jobs: Job[], errors: string[] = []): CollectorResult {
    return {
      source: this.name,
      jobs,
      errors: errors.length > 0 ? errors : undefined,
    };
  }
}
