import type { CollectorResult, Job } from './job';

export interface Collector {
  name: string;
  collect(): Promise<CollectorResult>;
}

export type CollectorModule = {
  default: Collector;
};
