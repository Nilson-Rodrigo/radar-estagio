export interface Job {
  id: string;
  titulo: string;
  empresa: string;
  descricao: string;
  cidade: string;
  modalidade: 'Presencial' | 'Remoto' | 'Híbrido';
  area_atuacao: string;
  link: string;
  created_at: string;
}