export interface Job {
  id?: string;
  titulo: string;
  empresa: string;
  descricao: string;
  cidade: string;
  modalidade: 'Remoto' | 'Híbrido' | 'Presencial';
  area_atuacao: string;
  link: string;
  data_expiracao: string | null;
}

export interface CollectorResult {
  source: string;
  jobs: Job[];
  errors?: string[];
}

export interface SyncStats {
  totalFonte: number;
  totalBanco: number;
  inseridos: number;
  atualizados: number;
  removidos: number;
  erros: number;
}
